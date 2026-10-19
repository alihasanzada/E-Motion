"""Account-scoped API endpoints for E-Motion.

Old shared demo tables are intentionally left intact. New health records are
stored by user_id and never read from unowned legacy rows.
"""

from functools import wraps
import hashlib
from flask import jsonify, request


def register_user_data_routes(app, get_db_connection, get_authenticated_user):
    def initialize_tables():
        conn = get_db_connection()
        try:
            conn.executescript("""
                CREATE TABLE IF NOT EXISTS account_activity (
                    user_id INTEGER PRIMARY KEY,
                    steps INTEGER NOT NULL DEFAULT 0,
                    active_minutes INTEGER NOT NULL DEFAULT 0,
                    water_ml INTEGER NOT NULL DEFAULT 0
                );
                CREATE TABLE IF NOT EXISTS account_moods (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    user_id INTEGER NOT NULL,
                    mood TEXT NOT NULL,
                    note TEXT,
                    date TEXT NOT NULL DEFAULT (DATETIME('now'))
                );
                CREATE TABLE IF NOT EXISTS account_nutrition (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    user_id INTEGER NOT NULL,
                    meal TEXT NOT NULL,
                    calories INTEGER NOT NULL,
                    date TEXT NOT NULL DEFAULT (DATETIME('now'))
                );
                CREATE TABLE IF NOT EXISTS account_notifications (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    user_id INTEGER NOT NULL,
                    title TEXT NOT NULL,
                    desc TEXT NOT NULL,
                    time TEXT NOT NULL,
                    read INTEGER NOT NULL DEFAULT 0
                );
                CREATE TABLE IF NOT EXISTS account_messages (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    user_id INTEGER NOT NULL,
                    sender TEXT NOT NULL,
                    text TEXT NOT NULL,
                    time TEXT NOT NULL,
                    read INTEGER NOT NULL DEFAULT 0
                );
                CREATE TABLE IF NOT EXISTS account_water (
                    user_id INTEGER PRIMARY KEY,
                    count INTEGER NOT NULL DEFAULT 0
                );
                CREATE TABLE IF NOT EXISTS account_challenges (
                    user_id INTEGER NOT NULL,
                    challenge_id INTEGER NOT NULL,
                    completed INTEGER NOT NULL DEFAULT 0,
                    PRIMARY KEY (user_id, challenge_id)
                );
            """)
            conn.commit()
        finally:
            conn.close()

    initialize_tables()

    def authenticated(handler):
        @wraps(handler)
        def wrapper(*args, **kwargs):
            conn = get_db_connection()
            try:
                user = get_authenticated_user(conn)
                if user is None:
                    return jsonify({"error": "Giriş tələb olunur."}), 401
                return handler(conn, user["id"], *args, **kwargs)
            finally:
                conn.close()
        return wrapper

    def integer_value(data, key, previous, maximum):
        value = data.get(key, previous)
        if isinstance(value, bool):
            raise ValueError(key)
        converted = int(value)
        if converted < 0 or converted > maximum:
            raise ValueError(key)
        return converted

    def activity_data(conn, user_id):
        row = conn.execute(
            "SELECT * FROM account_activity WHERE user_id = ?", (user_id,)
        ).fetchone()
        values = dict(row) if row else {"steps": 0, "active_minutes": 0, "water_ml": 0}
        steps, minutes, water = (
            values["steps"], values["active_minutes"], values["water_ml"]
        )
        return {
            "steps": steps, "active_minutes": minutes,
            "water": water, "water_ml": water,
            "calories": round(steps * 0.04 + minutes * 5)
        }

    def save_activity(conn, user_id, values):
        conn.execute("""
            INSERT INTO account_activity(user_id, steps, active_minutes, water_ml)
            VALUES (?, ?, ?, ?)
            ON CONFLICT(user_id) DO UPDATE SET
                steps=excluded.steps,
                active_minutes=excluded.active_minutes,
                water_ml=excluded.water_ml
        """, (user_id, values["steps"], values["active_minutes"], values["water_ml"]))
        conn.execute("""
            INSERT INTO account_water(user_id, count) VALUES (?, ?)
            ON CONFLICT(user_id) DO UPDATE SET count=excluded.count
        """, (user_id, values["water_ml"] // 250))
        conn.commit()

    @app.route("/api/activity", methods=["GET", "POST"])
    @authenticated
    def account_activity(conn, user_id):
        existing = activity_data(conn, user_id)
        if request.method == "GET":
            return jsonify(existing), 200
        data = request.get_json(silent=True)
        if not isinstance(data, dict):
            return jsonify({"error": "JSON obyekti tələb olunur."}), 400
        try:
            raw_water = data.get("water_ml", data.get("water", existing["water_ml"]))
            values = {
                "steps": integer_value(data, "steps", existing["steps"], 1000000),
                "active_minutes": integer_value(
                    data, "active_minutes", existing["active_minutes"], 1440
                ),
                "water_ml": integer_value(
                    {"water_ml": raw_water}, "water_ml", existing["water_ml"], 20000
                )
            }
        except (ValueError, TypeError, OverflowError):
            return jsonify({"error": "Aktivlik göstəriciləri düzgün deyil."}), 400
        save_activity(conn, user_id, values)
        return jsonify({"message": "Aktivlik yeniləndi!", **activity_data(conn, user_id)}), 201

    @app.route("/api/moods", methods=["GET", "POST"])
    @authenticated
    def account_moods(conn, user_id):
        if request.method == "GET":
            rows = conn.execute(
                "SELECT id, mood, note, date FROM account_moods "
                "WHERE user_id = ? ORDER BY id DESC LIMIT 5", (user_id,)
            ).fetchall()
            return jsonify([dict(row) for row in rows]), 200
        data = request.get_json(silent=True)
        if not isinstance(data, dict) or not str(data.get("mood") or "").strip():
            return jsonify({"error": "Zəhmət olmasa emosiya seçin."}), 400
        mood, note = str(data["mood"]).strip(), str(data.get("note") or "").strip()
        if len(mood) > 100 or len(note) > 4000:
            return jsonify({"error": "Mətn çox uzundur."}), 400
        conn.execute(
            "INSERT INTO account_moods(user_id, mood, note) VALUES (?, ?, ?)",
            (user_id, mood, note)
        )
        conn.commit()
        return jsonify({"message": "Əhval qeydi əlavə edildi."}), 201

    @app.route("/api/nutrition", methods=["GET", "POST"])
    @authenticated
    def account_nutrition(conn, user_id):
        if request.method == "GET":
            rows = conn.execute(
                "SELECT id, meal, calories, date FROM account_nutrition "
                "WHERE user_id = ? ORDER BY id DESC LIMIT 5", (user_id,)
            ).fetchall()
            return jsonify([dict(row) for row in rows]), 200
        data = request.get_json(silent=True)
        if not isinstance(data, dict):
            return jsonify({"error": "JSON obyekti tələb olunur."}), 400
        if data.get("water_ml") is not None:
            try:
                ml = integer_value(data, "water_ml", 0, 20000)
            except (ValueError, TypeError):
                return jsonify({"error": "Su miqdarı düzgün deyil."}), 400
            values = activity_data(conn, user_id)
            values["water_ml"] = ml
            save_activity(conn, user_id, values)
            return jsonify({"success": True, "water_ml": ml}), 200
        meal = str(data.get("meal") or "").strip()
        try:
            calories = integer_value(data, "calories", -1, 10000)
        except (ValueError, TypeError):
            return jsonify({"error": "Kalori düzgün deyil."}), 400
        if not meal or len(meal) > 250:
            return jsonify({"error": "Yemək adı tələb olunur (maks. 250 simvol)."}), 400
        conn.execute(
            "INSERT INTO account_nutrition(user_id, meal, calories) VALUES (?, ?, ?)",
            (user_id, meal, calories)
        )
        conn.commit()
        return jsonify({"message": "Qidalanma qeydi əlavə edildi."}), 201

    @app.route("/api/water", methods=["GET", "POST"])
    @authenticated
    def account_water(conn, user_id):
        if request.method == "GET":
            row = conn.execute(
                "SELECT count FROM account_water WHERE user_id = ?", (user_id,)
            ).fetchone()
            return jsonify({"count": row["count"] if row else 0}), 200
        data = request.get_json(silent=True)
        if not isinstance(data, dict) or "count" not in data:
            return jsonify({"error": "Su stəkanlarının sayı tələb olunur."}), 400
        try:
            count = integer_value(data, "count", 0, 80)
        except (ValueError, TypeError):
            return jsonify({"error": "Stəkan sayı düzgün deyil."}), 400
        current = activity_data(conn, user_id)
        current["water_ml"] = count * 250
        save_activity(conn, user_id, current)
        return jsonify({"success": True, "count": count}), 200

    @app.route("/api/notifications", methods=["GET"])
    @authenticated
    def account_notifications(conn, user_id):
        rows = conn.execute(
            'SELECT id, title, "desc", time, read FROM account_notifications WHERE user_id = ? ORDER BY id DESC',
            (user_id,)
        ).fetchall()
        return jsonify([{**dict(row), "read": bool(row["read"])} for row in rows]), 200

    @app.route("/api/notifications/read-all", methods=["POST"])
    @authenticated
    def account_notifications_read(conn, user_id):
        conn.execute("UPDATE account_notifications SET read = 1 WHERE user_id = ?", (user_id,))
        conn.commit()
        return jsonify({"success": True, "notifications": []}), 200

    @app.route("/api/notifications/reset", methods=["POST"])
    @authenticated
    def account_notifications_reset(conn, user_id):
        conn.execute("UPDATE account_notifications SET read = 0 WHERE user_id = ?", (user_id,))
        conn.commit()
        return jsonify({"success": True}), 200

    @app.route("/api/messages", methods=["GET"])
    @authenticated
    def account_messages(conn, user_id):
        rows = conn.execute(
            "SELECT id, sender, text, time, read FROM account_messages WHERE user_id = ? ORDER BY id DESC",
            (user_id,)
        ).fetchall()
        return jsonify([{**dict(row), "read": bool(row["read"])} for row in rows]), 200

    @app.route("/api/messages/read-all", methods=["POST"])
    @authenticated
    def account_messages_read(conn, user_id):
        conn.execute("UPDATE account_messages SET read = 1 WHERE user_id = ?", (user_id,))
        conn.commit()
        return jsonify({"success": True}), 200

    @app.route("/api/messages/reset", methods=["POST"])
    @authenticated
    def account_messages_reset(conn, user_id):
        conn.execute("UPDATE account_messages SET read = 0 WHERE user_id = ?", (user_id,))
        conn.commit()
        return jsonify({"success": True}), 200

    @app.route("/api/challenges", methods=["GET"])
    @authenticated
    def account_challenges(conn, user_id):
        rows = conn.execute("""
            SELECT c.id, c.title, c.description,
                   COALESCE(p.completed, 0) AS completed
            FROM challenges c
            LEFT JOIN account_challenges p ON p.challenge_id = c.id AND p.user_id = ?
            ORDER BY c.id
        """, (user_id,)).fetchall()
        return jsonify([dict(row) for row in rows]), 200

    @app.route("/api/challenges/<int:challenge_id>/toggle", methods=["POST"])
    @authenticated
    def account_challenge_toggle(conn, user_id, challenge_id):
        challenge = conn.execute(
            "SELECT 1 FROM challenges WHERE id = ?", (challenge_id,)
        ).fetchone()
        if challenge is None:
            return jsonify({"error": "Çağırış tapılmadı."}), 404
        conn.execute("""
            INSERT INTO account_challenges (user_id, challenge_id, completed)
            VALUES (?, ?, 1)
            ON CONFLICT(user_id, challenge_id) DO UPDATE
                SET completed = 1 - account_challenges.completed
        """, (user_id, challenge_id))
        conn.commit()
        result = conn.execute(
            "SELECT completed FROM account_challenges WHERE user_id = ? AND challenge_id = ?",
            (user_id, challenge_id)
        ).fetchone()
        return jsonify({"message": "Status yeniləndi!", "completed": bool(result["completed"])}), 200

    @app.route("/api/logout", methods=["POST"])
    def account_logout():
        conn = get_db_connection()
        try:
            token = request.cookies.get("token", "")
            if token:
                digest = hashlib.sha256(token.encode("utf-8")).hexdigest()
                conn.execute("DELETE FROM user_sessions WHERE token_hash = ?", (digest,))
                conn.commit()
        finally:
            conn.close()
        response = jsonify({"success": True})
        # secure/samesite only matter on creation; delete by matching name and path.
        response.delete_cookie("token", path="/")
        return response, 200

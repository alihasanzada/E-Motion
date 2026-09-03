from flask import Flask, jsonify, request
from flask_cors import CORS
from flasgger import Swagger
from werkzeug.security import generate_password_hash, check_password_hash
import sqlite3
import re
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__, template_folder='../frontend', static_folder='../frontend')
CORS(app)

app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'default_secret_key')

# Swagger Konfiqurasiyası
swagger_config = {
    "headers": [],
    "specs": [
        {
            "endpoint": 'apispec_1',
            "route": '/apispec_1.json',
            "rule_filter": lambda rule: True,
            "model_filter": lambda model: True,
        }
    ],
    "static_url_path": "/flasgger_static",
    "swagger_ui": True,
    "specs_route": "/apidocs/"
}

template = {
    "swagger": "2.0",
    "info": {
        "title": "E-motion API",
        "description": "E-motion Platform Backend REST API Documentation",
        "version": "1.0.0"
    }
}

swagger = Swagger(app, config=swagger_config, template=template)

DB_NAME = 'kuds_database.db'

@app.route('/', methods=['GET'])
def root():
    """
    Root endpoint for API status check
    ---
    tags:
      - System
    responses:
      200:
        description: API Server running status
    """
    return jsonify({
        "message": "E-Motion API Server is running",
        "docs": "/apidocs",
        "health": "/health"
    }), 200

@app.route('/health', methods=['GET'])
def health_check():
    """
    Health Check Endpoint
    ---
    tags:
      - System
    responses:
      200:
        description: Server is running smoothly
    """
    return jsonify({"status": "ok", "message": "Server is active"}), 200

@app.route('/api/gemini', methods=['POST'])
def ai_chat():
    """
    E-Motion AI Asistenti ilə dialoq
    ---
    tags:
      - AI Assistant
    parameters:
      - name: body
        in: body
        required: true
        schema:
          type: object
          required:
            - prompt
          properties:
            prompt:
              type: string
              example: "İmtahana hazırlaşmaq üçün resursları necə tapa bilərəm?"
    responses:
      200:
        description: AI asistentin cavabı uğurla qaytarıldı
        schema:
          type: object
          properties:
            result:
              type: string
              example: "Salam! İmtahan hazırlığı prosesində sənə dəstək olmaqdan çox məmnun olaram..."
      400:
        description: Sorğuda prompt daxil edilməyib
        schema:
          type: object
          properties:
            error:
              type: string
              example: "Prompt sahəsi boş ola bilməz"
      500:
        description: AI xidmətində və ya serverdə daxili xəta
    """
    data = request.get_json(silent=True) or {}
    prompt = data.get('prompt')

    if not prompt:
        return jsonify({'error': 'Prompt sahəsi boş ola bilməz'}), 400

    return jsonify({
        'result': 'AI cavabı inteqrasiya olunub.'
    }), 200

@app.route('/api/activity', methods=['GET'])
def get_activity():
    """
    Get physical activity logs
    ---
    tags:
      - Health & Activity
    responses:
      200:
        description: Physical activity data
    """
    conn = get_db_connection()
    try:
        activity = conn.execute('SELECT * FROM physical_activity ORDER BY id DESC LIMIT 1').fetchone()
        if activity:
            act_dict = dict(activity)
            steps = act_dict.get('steps', 0)
            water = act_dict.get('water_ml', act_dict.get('water', 0))
            calories = int(steps * 0.04)
            return jsonify({
                'steps': steps,
                'water': water,
                'water_ml': water,
                'calories': calories
            }), 200

        return jsonify({'steps': 0, 'water': 0, 'water_ml': 0, 'calories': 0}), 200
    finally:
        conn.close()


@app.route('/api/activity', methods=['POST'])
def update_activity():
    """
    Update physical activity and water intake
    ---
    tags:
      - Health & Activity
    parameters:
      - name: body
        in: body
        required: true
        schema:
          type: object
          properties:
            steps:
              type: integer
            water_ml:
              type: integer
    responses:
      201:
        description: Activity updated successfully
    """
    data = request.get_json(silent=True) or {}
    steps = data.get('steps')
    water_ml = data.get('water_ml') if data.get('water_ml') is not None else data.get('water')

    conn = get_db_connection()
    try:
        if steps is None or water_ml is None:
            last_act = conn.execute('SELECT * FROM physical_activity ORDER BY id DESC LIMIT 1').fetchone()
            if steps is None:
                steps = last_act['steps'] if last_act else 0
            if water_ml is None:
                water_ml = last_act['water_ml'] if last_act else 0

        cursor = conn.cursor()
        cursor.execute('INSERT INTO physical_activity (steps, water_ml) VALUES (?, ?)', (steps, water_ml))
        conn.commit()
        
        calories_burned = int(steps * 0.04)
        return jsonify({
            'message': 'Aktivlik uğurla yeniləndi!',
            'steps': steps,
            'water': water_ml,
            'water_ml': water_ml,
            'calories': calories_burned
        }), 201
    except Exception as e:
        app.logger.error(f"Activity update error: {e}")
        return jsonify({'error': 'Aktivlik yenilənərkən xəta baş verdi'}), 500
    finally:
        conn.close()

@app.route('/api/moods', methods=['GET'])
def get_moods():
    """
    Get last 5 mood logs
    ---
    tags:
      - Health & Activity
    responses:
      200:
        description: Emotion list successfully retrieved
    """
    conn = get_db_connection()
    try:
        moods = conn.execute('SELECT * FROM mood_logs ORDER BY id DESC LIMIT 5').fetchall()
        return jsonify([dict(row) for row in moods]), 200
    finally:
        conn.close()

@app.route('/api/moods', methods=['POST'])
def add_mood():
    """
    Log a new mood entry
    ---
    tags:
      - Health & Activity
    parameters:
      - name: body
        in: body
        required: true
        schema:
          type: object
          properties:
            mood:
              type: string
              example: "Xoşbəxt"
            note:
              type: string
              example: "Bu gün dərslər əla keçdi."
    responses:
      201:
        description: Mood entry successfully logged
      400:
        description: Validation error
      500:
        description: Internal server error
    """
    data = request.get_json(silent=True) or {}
    mood = data.get('mood')
    note = data.get('note')

    if not mood:
        return jsonify({'error': 'Zəhmət olmasa bir emosiya seçin!'}), 400

    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        cursor.execute('INSERT INTO mood_logs (mood, note) VALUES (?, ?)', (mood, note))
        conn.commit()
        return jsonify({'message': 'Mental vəziyyətiniz uğurla qeyd olundu!'}), 201
    except Exception as e:
        app.logger.error(f"Database error in add_mood: {e}")
        return jsonify({'error': 'Məlumat saxlanılarkən daxili xəta baş verdi.'}), 500
    finally:
        conn.close()

@app.route('/api/nutrition', methods=['GET'])
def get_nutrition():
    """
    Get last 5 nutrition logs
    ---
    tags:
      - Health & Activity
    responses:
      200:
        description: Nutrition logs successfully retrieved
    """
    conn = get_db_connection()
    try:
        logs = conn.execute('SELECT * FROM nutrition ORDER BY id DESC LIMIT 5').fetchall()
        return jsonify([dict(row) for row in logs]), 200
    finally:
        conn.close()

@app.route('/api/nutrition', methods=['POST'])
def add_nutrition():
    """
    Add nutrition and calorie record
    ---
    tags:
      - Health & Activity
    parameters:
      - name: body
        in: body
        required: true
        schema:
          type: object
          properties:
            meal:
              type: string
              example: "Toyuq və Düyü"
            calories:
              type: integer
              example: 650
    responses:
      201:
        description: Nutrition log added successfully
    """
    data = request.get_json(silent=True) or {}
    meal = data.get('meal')
    calories = data.get('calories')

    if not meal or not calories:
        return jsonify({'error': 'Bütün xanaları doldurun!'}), 400

    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        cursor.execute('INSERT INTO nutrition (meal, calories) VALUES (?, ?)', (meal, int(calories)))
        conn.commit()
        return jsonify({'message': 'Qidalanma qeydi uğurla əlavə edildi!'}), 201
    except Exception as e:
        app.logger.error(f"Nutrition log error: {e}")
        return jsonify({'error': 'Qidalanma qeydi əlavə edilərkən xəta baş verdi.'}), 500
    finally:
        conn.close()

@app.route('/api/challenges/<int:challenge_id>/toggle', methods=['POST'])
def toggle_challenge(challenge_id):
    """
    Toggle challenge status (Completed/Pending)
    ---
    tags:
      - Health & Activity
    parameters:
      - name: challenge_id
        in: path
        type: integer
        required: true
    responses:
      200:
        description: Challenge status updated successfully
    """
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        cursor.execute('UPDATE challenges SET completed = 1 - completed WHERE id = ?', (challenge_id,))
        conn.commit()
        return jsonify({'message': 'Status yeniləndi!'}), 200
    except Exception as e:
        app.logger.error(f"Challenge toggle error: {e}")
        return jsonify({'error': 'Status yenilənərkən xəta baş verdi'}), 500
    finally:
        conn.close()

# --- NOTIFICATIONS ENDPOINTS ---
@app.route('/api/notifications', methods=['GET'])
def get_notifications():
    """
    Get all notifications
    ---
    tags:
      - Notifications
    responses:
      200:
        description: List of notifications
    """
    conn = get_db_connection()
    try:
        notifications = conn.execute('SELECT * FROM notifications').fetchall()
        result = [
            {
                "id": n["id"],
                "title": n["title"],
                "desc": n["desc"],
                "time": n["time"],
                "read": bool(n["read"])
            }
            for n in notifications
        ]
        return jsonify(result), 200
    finally:
        conn.close()

@app.route('/api/notifications/read-all', methods=['POST', 'OPTIONS'])
def read_all_notifications():
    """
    Mark all notifications as read
    ---
    tags:
      - Notifications
    responses:
      200:
        description: Success status and updated notifications
    """
    if request.method == 'OPTIONS':
        return '', 200

    conn = get_db_connection()
    try:
        conn.execute('UPDATE notifications SET read = 1')
        conn.commit()
        
        notifications = conn.execute('SELECT * FROM notifications').fetchall()
        result = [
            {
                "id": n["id"],
                "title": n["title"],
                "desc": n["desc"],
                "time": n["time"],
                "read": True
            }
            for n in notifications
        ]
        return jsonify({"success": True, "notifications": result}), 200
    finally:
        conn.close()

@app.route('/api/notifications/reset', methods=['GET'])
def reset_notifications():
    """
    Reset notifications to default state
    ---
    tags:
      - Notifications
    responses:
      200:
        description: Notifications reset
    """
    conn = get_db_connection()
    try:
        conn.execute('''
            INSERT OR IGNORE INTO notifications (id, title, desc, time, read)
            VALUES 
            (1, 'Sistem yenilənməsi', 'Platformada yeni funksiyalar aktivləşdirildi.', '10 dəq əvvəl', 0),
            (2, 'Yeni tapşırıq', 'Aktivlik panelinə yeni məqsəd əlavə olundu.', '1 saat əvvəl', 0)
        ''')
        conn.execute('UPDATE notifications SET read = 0')
        conn.commit()
        return jsonify({"message": "Bildirişlər bərpa olundu və oxunmamış vəziyyətə gətirildi!"}), 200
    finally:
        conn.close()

# --- MESSAGES ENDPOINTS ---
@app.route('/api/messages', methods=['GET'])
def get_messages():
    """
    Get all messages
    ---
    tags:
      - Notifications
    responses:
      200:
        description: List of messages
    """
    conn = get_db_connection()
    try:
        messages = conn.execute('SELECT * FROM messages').fetchall()
        
        if not messages:
            conn.execute('''
                INSERT OR IGNORE INTO messages (id, sender, text, time, read)
                VALUES 
                (1, 'Aysel Məmmədova', 'Layihənin backend inteqrasiyası hazırdır?', '12:45', 0),
                (2, 'Dəstək Komandası', 'Sistemlə bağlı hər hansı sualınız var?', 'Dünən', 0)
            ''')
            conn.commit()
            messages = conn.execute('SELECT * FROM messages').fetchall()

        result = [
            {
                "id": m["id"],
                "sender": m["sender"],
                "text": m["text"],
                "time": m["time"],
                "read": bool(m["read"]) if "read" in m.keys() else False
            }
            for m in messages
        ]
        return jsonify(result), 200
    finally:
        conn.close()

@app.route('/api/messages/reset', methods=['GET'])
def reset_messages():
    """
    Reset messages to default state
    ---
    tags:
      - Notifications
    responses:
      200:
        description: Messages reset
    """
    conn = get_db_connection()
    try:
        conn.execute('''
            INSERT OR IGNORE INTO messages (id, sender, text, time, read)
            VALUES 
            (1, 'Aysel Məmmədova', 'Layihənin backend inteqrasiyası hazırdır?', '12:45', 0),
            (2, 'Dəstək Komandası', 'Sistemlə bağlı hər hansı sualınız var?', 'Dünən', 0)
        ''')
        conn.execute('UPDATE messages SET read = 0')
        conn.commit()
        return jsonify({"message": "Mesajlar bərpa olundu!"}), 200
    finally:
        conn.close()

@app.route('/api/messages/read-all', methods=['POST', 'OPTIONS'])
def mark_all_messages_read():
    """
    Mark all messages as read
    ---
    tags:
      - Notifications
    responses:
      200:
        description: Messages marked as read
    """
    if request.method == 'OPTIONS':
        return '', 200

    conn = get_db_connection()
    try:
        conn.execute('UPDATE messages SET read = 1')
        conn.commit()
        return jsonify({"success": True}), 200
    finally:
        conn.close()

@app.route('/api/water', methods=['GET'])
def get_water():
    """
    Get water intake count
    ---
    tags:
      - Health & Activity
    responses:
      200:
        description: Water count retrieved
    """
    conn = get_db_connection()
    try:
        water = conn.execute('SELECT * FROM water WHERE id = 1').fetchone()
        count = water["count"] if water else 4
        return jsonify({"count": count}), 200
    finally:
        conn.close()

@app.route('/api/water', methods=['POST', 'OPTIONS'])
def update_water():
    """
    Update water intake count
    ---
    tags:
      - Health & Activity
    parameters:
      - name: body
        in: body
        required: true
        schema:
          type: object
          properties:
            count:
              type: integer
              example: 5
    responses:
      200:
        description: Water count updated
      400:
        description: Invalid payload
    """
    if request.method == 'OPTIONS':
        return '', 200

    data = request.get_json(silent=True) or {}
    if 'count' in data:
        new_count = data['count']
        conn = get_db_connection()
        try:
            conn.execute('INSERT OR REPLACE INTO water (id, count) VALUES (1, ?)', (new_count,))
            conn.commit()
            return jsonify({"success": True, "count": new_count}), 200
        finally:
            conn.close()
        
    return jsonify({"error": "Səhv məlumat formatı"}), 400

@app.route('/api/user/profile', methods=['GET'])
def get_user_profile():
    """
    Get active user profile details
    ---
    tags:
      - User
    responses:
      200:
        description: User profile information
      404:
        description: User not found
    """
    conn = get_db_connection()
    try:
        user = conn.execute('SELECT * FROM user_profile WHERE id = 1').fetchone()
        if user:
            return jsonify(dict(user)), 200
        return jsonify({"error": "İstifadəçi tapılmadı"}), 404
    finally:
        conn.close()

def get_db_connection():
    conn = sqlite3.connect(DB_NAME)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db_connection()
    cursor = conn.cursor()

    # 1. Users
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL
        )
    ''')

    # 2. Students
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS students (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            student_id TEXT UNIQUE NOT NULL,
            major TEXT NOT NULL,
            semester INTEGER NOT NULL
        )
    ''')

    # 3. Courses
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS courses (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            code TEXT UNIQUE NOT NULL,
            credits INTEGER NOT NULL
        )
    ''')

    # 4. Events
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS events (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            date TEXT NOT NULL,
            location TEXT NOT NULL
        )
    ''')

    # 5. Resources
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS resources (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            category TEXT NOT NULL,
            link TEXT NOT NULL
        )
    ''')

    # 6. Physical Activity
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS physical_activity (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            steps INTEGER NOT NULL,
            water_ml INTEGER NOT NULL,
            date TEXT DEFAULT (DATE('now', 'localtime'))
        )
    ''')

    # 7. Mood Logs
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS mood_logs (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            mood TEXT NOT NULL,
            note TEXT,
            date TEXT DEFAULT (DATE('now', 'localtime'))
        )
    ''')

    # 8. Nutrition
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS nutrition (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            meal TEXT NOT NULL,
            calories INTEGER NOT NULL,
            date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')

    # 9. Challenges
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS challenges (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            description TEXT NOT NULL,
            completed INTEGER DEFAULT 0
        )
    ''')

    # 10. Notifications Cədvəli
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS notifications (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            desc TEXT NOT NULL,
            time TEXT NOT NULL,
            read BOOLEAN NOT NULL DEFAULT 0
        )
    ''')

    # 11. Messages Cədvəli
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS messages (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            sender TEXT NOT NULL,
            text TEXT NOT NULL,
            time TEXT NOT NULL
        )
    ''')

    # 12. Water Cədvəli
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS water (
            id INTEGER PRIMARY KEY CHECK (id = 1),
            count INTEGER NOT NULL DEFAULT 4
        )
    ''')

    # 13. User Profile Cədvəli
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS user_profile (
            id INTEGER PRIMARY KEY CHECK (id = 1),
            fullname TEXT NOT NULL,
            major TEXT NOT NULL,
            course INTEGER NOT NULL
        )
    ''')

    conn.commit()

    # Seed initial test data
    cursor.execute('SELECT COUNT(*) FROM students')
    if cursor.fetchone()[0] == 0:
        cursor.execute("INSERT INTO students (name, student_id, major, semester) VALUES ('Əli Məmmədov', 'st123456', 'Kompüter Mühəndisliyi', 4)")
        cursor.execute("INSERT INTO students (name, student_id, major, semester) VALUES ('Aysel Əliyeva', 'st123457', 'İnformasiya Texnologiyaları', 2)")
        cursor.execute("INSERT INTO students (name, student_id, major, semester) VALUES ('Aylin Əliyeva', 'st123458', 'Hüquq', 4)")
        cursor.execute("INSERT INTO courses (title, code, credits) VALUES ('Veb Proqramlaşdırma', 'CS301', 6)")
        cursor.execute("INSERT INTO courses (title, code, credits) VALUES ('Verilənlər Bazası Sistemləri', 'CS204', 5)")
        cursor.execute("INSERT INTO events (title, date, location) VALUES ('AI və Gələcək Seminarı', '2026-04-15', 'Əsas Bina, Zal A')")
        cursor.execute("INSERT INTO resources (title, category, link) VALUES ('Flask Sənədləşməsi', 'Dərslik', 'https://flask.palletsprojects.com/')")
        cursor.execute("INSERT INTO challenges (title, description, completed) VALUES ('Su Kampaniyası', 'Hər gün 2 litr su iç', 0)")
        cursor.execute("INSERT INTO challenges (title, description, completed) VALUES ('Aktiv Həyat', 'Həftə sonuna qədər günlük 7000 addım at', 0)")
        cursor.execute("INSERT INTO notifications (title, desc, time) VALUES ('Su hədəfi', 'Gündəlik su qəbulunun 50%-nə çatdınız!', '10 dəq əvvəl')")
        cursor.execute("INSERT INTO notifications (title, desc, time) VALUES ('Həkim qəbulu', 'Sabah saat 14:00-da həkim müayinəniz var.', '1 saat əvvəl')")
        cursor.execute("INSERT INTO notifications (title, desc, time) VALUES ('Tədbir xəbərdarlığı', 'Yoqa seansı 22 May tarixində keçiriləcək.', '3 saat əvvəl')")
        cursor.execute("INSERT INTO messages (sender, text, time) VALUES ('Dr. Əliyev (Tibb məntəqəsi)', 'Qan analizi nəticələriniz hazırdır.', '12:30')")
        cursor.execute("INSERT INTO messages (sender, text, time) VALUES ('Psixoloq Leyla M.', 'Növbəti seans üçün vaxtı təsdiqləyin.', 'Dünən')")
        cursor.execute("INSERT INTO water (id, count) VALUES (1, 4)")
        cursor.execute("INSERT INTO user_profile (id, fullname, major, course) VALUES (1, 'Əli Həsənov', 'Kompüter Mühəndisliyi', 1)")
        conn.commit()

    conn.close()

init_db()

# --- AUTHENTICATION ENDPOINTS ---

@app.route('/api/register', methods=['POST'])
def register():
    """
    User registration
    ---
    tags:
      - Authentication
    parameters:
      - name: body
        in: body
        required: true
        schema:
          type: object
          properties:
            name:
              type: string
              example: "Əli Həsənov"
            email:
              type: string
              example: "st123456@qu.edu.az"
            password:
              type: string
              example: "secret123"
    responses:
      201:
        description: Qeydiyyat uğurla tamamlandı
      400:
        description: Yanlış məlumat və ya artıq mövcud istifadəçi
      500:
        description: Server xətası
    """
    data = request.get_json(silent=True) or {}
    name = data.get('name')
    email = data.get('email')
    password = data.get('password')

    if not name or not email or not password:
        return jsonify({"error": "Bütün xanaları doldurun!"}), 400

    email_pattern = r'^(?i:s|st)\d{6}@qu\.edu\.az$'
    if not re.match(email_pattern, email):
        return jsonify({"error": "Keçərsiz e-poçt formatı! Yalnız st123456@qu.edu.az formatında e-poçtlar qəbul edilir."}), 400

    hashed_password = generate_password_hash(password)
    conn = get_db_connection()
    cursor = conn.cursor()

    try:
        user_check = cursor.execute("SELECT id FROM users WHERE email = ?", (email,)).fetchone()
        if user_check:
            return jsonify({"error": "Bu e-poçt ünvanı artıq qeydiyyatdan keçib!"}), 400

        cursor.execute("INSERT INTO users (name, email, password) VALUES (?, ?, ?)", (name, email, hashed_password))
        conn.commit()
        return jsonify({"message": "Qeydiyyat uğurla tamamlandı!"}), 201
    except sqlite3.IntegrityError as e:
        app.logger.error(f"Register IntegrityError: {e}")
        return jsonify({"error": "Verilənlər bazası xətası: Məlumat təkrarı mövcuddur."}), 400
    except Exception as e:
        app.logger.error(f"Register Error: {e}")
        return jsonify({"error": "Qeydiyyat zamanı server xətası baş verdi."}), 500
    finally:
        conn.close()

@app.route('/api/login', methods=['POST'])
def login():
    """
    User login
    ---
    tags:
      - Authentication
    parameters:
      - name: body
        in: body
        required: true
        schema:
          type: object
          properties:
            email:
              type: string
              example: "st123456@qu.edu.az"
            password:
              type: string
              example: "secret123"
    responses:
      200:
        description: Login successful
      401:
        description: Email or password is incorrect
    """
    data = request.get_json(silent=True) or {}
    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify({'error': 'E-poçt və şifrəni daxil edin!'}), 400

    conn = get_db_connection()
    try:
        user = conn.execute('SELECT * FROM users WHERE email = ?', (email,)).fetchone()

        if user and check_password_hash(user['password'], password):
            student_id = email.split('@')[0].upper()
            student_record = conn.execute('SELECT * FROM students WHERE UPPER(student_id) = ?', (student_id,)).fetchone()

            if student_record:
                major = student_record['major']
                semester = student_record['semester']
                course = (semester + 1) // 2
                student_name = student_record['name']
            else:
                major = 'Kompüter Mühəndisliyi'
                course = 1
                student_name = user['name']

            return jsonify({
                'message': 'Giriş uğurludur!',
                'token': 'auth-token-xyz-12345',
                'user': {
                    'id': user['id'],
                    'name': student_name,
                    'email': user['email'],
                    'major': major,
                    'course': f'{course}-ci kurs'
                }
            }), 200

        return jsonify({'error': 'E-poçt və ya şifrə yanlışdır!'}), 401
    except Exception as e:
        app.logger.error(f"Login Error: {e}")
        return jsonify({'error': 'Giriş zamanı daxili xəta baş verdi.'}), 500
    finally:
        conn.close()

# ================= DASHBOARD & STATS =================

@app.route('/api/stats', methods=['GET'])
def get_stats():
    """
    Get overall platform statistics
    ---
    tags:
      - Stats
    responses:
      200:
        description: Statistics successfully imported
    """
    conn = get_db_connection()
    try:
        students_count = conn.execute('SELECT COUNT(*) FROM students').fetchone()[0]
        courses_count = conn.execute('SELECT COUNT(*) FROM courses').fetchone()[0]
        events_count = conn.execute('SELECT COUNT(*) FROM events').fetchone()[0]
        resources_count = conn.execute('SELECT COUNT(*) FROM resources').fetchone()[0]

        return jsonify({
            'students': students_count,
            'courses': courses_count,
            'events': events_count,
            'resources': resources_count
        }), 200
    finally:
        conn.close()

# --- STUDENTS, COURSES ENDPOINTS ---

@app.route('/api/students', methods=['GET'])
def get_students():
    """
    Get list of students
    ---
    tags:
      - Students
    responses:
      200:
        description: List of students retrieved successfully
    """
    conn = get_db_connection()
    try:
        students = conn.execute('SELECT * FROM students').fetchall()
        return jsonify([dict(row) for row in students]), 200
    finally:
        conn.close()

@app.route('/api/students', methods=['POST'])
def add_student():
    """
    Add a new student
    ---
    tags:
      - Students
    parameters:
      - name: body
        in: body
        required: true
        schema:
          type: object
          properties:
            name:
              type: string
            student_id:
              type: string
            major:
              type: string
            semester:
              type: integer
    responses:
      201:
        description: Student added successfully
      400:
        description: Student ID already exists
    """
    data = request.get_json(silent=True) or {}
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        cursor.execute(
            'INSERT INTO students (name, student_id, major, semester) VALUES (?, ?, ?, ?)',
            (data.get('name'), data.get('student_id'), data.get('major'), data.get('semester'))
        )
        conn.commit()
        return jsonify({'message': 'Tələbə uğurla əlavə edildi!'}), 201
    except sqlite3.IntegrityError:
        return jsonify({'error': 'Bu ID ilə tələbə artıq mövcuddur!'}), 400
    finally:
        conn.close()

@app.route('/api/students/<int:id>', methods=['DELETE'])
def delete_student(id):
    """
    Delete student profile by ID
    ---
    tags:
      - Students
    parameters:
      - name: id
        in: path
        type: integer
        required: true
        description: ID of the student to be deleted
    responses:
      200:
        description: Student deleted successfully
      404:
        description: Student not found
    """
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        cursor.execute("SELECT id FROM students WHERE id = ?", (id,))
        if cursor.fetchone() is None:
            return jsonify({'error': 'Belə bir tələbə mövcud deyil!'}), 404
            
        cursor.execute('DELETE FROM students WHERE id = ?', (id,))
        conn.commit()
        return jsonify({'message': 'Tələbə uğurla silindi!'}), 200
    finally:
        conn.close()

@app.route('/api/courses', methods=['GET'])
def get_courses():
    """
    Get list of courses
    ---
    tags:
      - Courses
    responses:
      200:
        description: List of subjects retrieved successfully
    """
    conn = get_db_connection()
    try:
        courses = conn.execute('SELECT * FROM courses').fetchall()
        return jsonify([dict(row) for row in courses]), 200
    finally:
        conn.close()

@app.route('/api/courses', methods=['POST'])
def add_course():
    """
    Add a new course
    ---
    tags:
      - Courses
    parameters:
      - name: body
        in: body
        required: true
        schema:
          type: object
          properties:
            title:
              type: string
            code:
              type: string
            credits:
              type: integer
    responses:
      201:
        description: Subject added successfully
      400:
        description: Course code already exists
    """
    data = request.get_json(silent=True) or {}
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        cursor.execute(
            'INSERT INTO courses (title, code, credits) VALUES (?, ?, ?)',
            (data.get('title'), data.get('code'), data.get('credits'))
        )
        conn.commit()
        return jsonify({'message': 'Fənn uğurla əlavə edildi!'}), 201
    except sqlite3.IntegrityError:
        return jsonify({'error': 'Bu kodlu fənn artıq mövcuddur!'}), 400
    finally:
        conn.close()

@app.route('/api/events', methods=['GET'])
def get_events():
    """
    Retrieve all campus events
    ---
    tags:
      - Events
    responses:
      200:
        description: List of events retrieved successfully
    """
    conn = get_db_connection()
    try:
        events = conn.execute('SELECT * FROM events').fetchall()
        return jsonify([dict(row) for row in events]), 200
    finally:
        conn.close()

@app.route('/api/events', methods=['POST'])
def add_event():
    """
    Add a new campus event
    ---
    tags:
      - Events
    parameters:
      - name: body
        in: body
        required: true
        schema:
          type: object
          properties:
            title:
              type: string
            date:
              type: string
            location:
              type: string
    responses:
      201:
        description: Event added successfully
    """
    data = request.get_json(silent=True) or {}
    title = data.get('title')
    date = data.get('date')
    location = data.get('location')

    if not title or not date or not location:
        return jsonify({'error': 'Bütün xanaları doldurun!'}), 400

    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        cursor.execute('INSERT INTO events (title, date, location) VALUES (?, ?, ?)', (title, date, location))
        conn.commit()
        return jsonify({'message': 'Tədbir uğurla əlavə edildi!'}), 201
    except Exception as e:
        app.logger.error(f"Event add error: {e}")
        return jsonify({'error': 'Tədbir əlavə edilərkən daxili xəta baş verdi.'}), 500
    finally:
        conn.close()

@app.route('/api/resources', methods=['GET'])
def get_resources():
    """
    Get list of resources
    ---
    tags:
      - Resources
    responses:
      200:
        description: List of resources retrieved successfully
    """
    conn = get_db_connection()
    try:
        resources = conn.execute('SELECT * FROM resources').fetchall()
        return jsonify([dict(row) for row in resources]), 200
    finally:
        conn.close()

@app.route('/api/resources', methods=['POST'])
def add_resource():
    """
    Add a new resource
    ---
    tags:
      - Resources
    parameters:
      - name: body
        in: body
        required: true
        schema:
          type: object
          properties:
            title:
              type: string
            category:
              type: string
            link:
              type: string
    responses:
      201:
        description: Resource added successfully
    """
    data = request.get_json(silent=True) or {}
    title = data.get('title')
    category = data.get('category')
    link = data.get('link')

    if not title or not category or not link:
        return jsonify({'error': 'Bütün xanaları doldurun!'}), 400

    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        cursor.execute('INSERT INTO resources (title, category, link) VALUES (?, ?, ?)', (title, category, link))
        conn.commit()
        return jsonify({'message': 'Resurs uğurla əlavə edildi!'}), 201
    except Exception as e:
        app.logger.error(f"Resource add error: {e}")
        return jsonify({'error': 'Resurs əlavə edilərkən daxili xəta baş verdi.'}), 500
    finally:
        conn.close()

@app.route('/api/challenges', methods=['GET'])
def get_challenges():
    """
    Get list of all active wellness challenges
    ---
    tags:
      - Health & Activity
    responses:
      200:
        description: List of challenges successfully retrieved
    """
    conn = get_db_connection()
    try:
        challenges = conn.execute('SELECT * FROM challenges').fetchall()
        return jsonify([dict(row) for row in challenges]), 200
    finally:
        conn.close()

# --- GLOBAL ERROR HANDLERS ---

@app.errorhandler(400)
def bad_request_error(error):
    return jsonify({
        "status": "error",
        "code": 400,
        "error": "Yanlış sorğu. Göndərilən data formatını və ya sahələri yoxlayın."
    }), 400

@app.errorhandler(404)
def not_found_error(error):
    return jsonify({
        "status": "error",
        "code": 404,
        "error": "Axtarılan API endpoint-i və ya resurs tapılmadı."
    }), 404

@app.errorhandler(405)
def method_not_allowed_error(error):
    return jsonify({
        "status": "error",
        "code": 405,
        "error": "Bu endpoint üçün istifadə edilən HTTP metodu dəstəklənmir."
    }), 405

@app.errorhandler(500)
def internal_server_error(error):
    return jsonify({
        "status": "error",
        "code": 500,
        "error": "Daxili server xətası baş verdi. Xahiş olunur bir az sonra yenidən cəhd edin."
    }), 500

if __name__ == '__main__':
    port = int(os.getenv('PORT', 5050))
    debug = os.getenv('FLASK_ENV') == 'development'
    app.run(host='0.0.0.0', port=port, debug=debug)
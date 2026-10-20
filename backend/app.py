from flask import Flask, jsonify, request, make_response
from flask_cors import CORS
from flasgger import Swagger
from werkzeug.security import generate_password_hash, check_password_hash
import sqlite3
import re
import os
import hashlib
import secrets
import time
from dotenv import load_dotenv
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address

load_dotenv()

app = Flask(__name__, template_folder='../frontend', static_folder='../frontend')

# Yalnız etibarlı frontend origin-lərinə giriş icazəsi verilir.
# Render-də CORS_ORIGINS mühit dəyişəni ilə əlavə domenlər təyin edilə bilər.
DEFAULT_CORS_ORIGINS = (
    "http://localhost:3000,http://127.0.0.1:3000,"
    "https://e-motion-iota.vercel.app,https://e-motion-7vds.onrender.com"
)
allowed_origins = [
    origin.strip().rstrip("/")
    for origin in os.getenv("CORS_ORIGINS", DEFAULT_CORS_ORIGINS).split(",")
    if origin.strip()
]
CORS(app, supports_credentials=True, origins=allowed_origins)

app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'default_secret_key')

# Vercel-in proxy IP-si bir neçə istifadəçi üçün eyni ola bilər.
# Autentifikasiya olunmuş sorğuları fərdi sessiya üzrə limitləyirik.
# Login isə ayrıca hesab identifikatoru əsasında limitlənir.
def rate_limit_identity():
    token = request.cookies.get("token")
    if token:
        digest = hashlib.sha256(token.encode("utf-8")).hexdigest()
        return "session:" + digest
    return "ip:" + get_remote_address()


def login_limit_identity():
    payload = request.get_json(silent=True) or {}
    email = str(payload.get("email") or "").strip().lower() if isinstance(payload, dict) else ""
    if email:
        return "login-account:" + hashlib.sha256(email.encode("utf-8")).hexdigest()
    return "login-ip:" + get_remote_address()


limiter = Limiter(
    rate_limit_identity,
    app=app,
    # UI loads multiple endpoints; the former 50/hour shared-IP limit caused
    # surprising lockouts during ordinary dashboard use.
    default_limits=["240 per minute"],
    storage_uri="memory://"
)


@app.errorhandler(429)
def rate_limit_json(error):
    return jsonify({
        "error": "Çox sayda sorğu göndərildi. Bir qədər gözləyib yenidən cəhd edin.",
        "code": "rate_limited"
    }), 429

# Admin rol sistemi hazır olmadığı üçün idarəetmə API-lərinin
# anonim oxunmasını və sərbəst yazılmasını dayandırırıq.
@app.before_request
def guard_legacy_admin_api():
    path = request.path
    if path == "/api/students" or path.startswith("/api/students/"):
        return jsonify({"error": "Tələbə məlumatları üçün administrator icazəsi tələb olunur."}), 403
    if path in {"/api/courses", "/api/events", "/api/resources"} and request.method not in {"GET", "HEAD", "OPTIONS"}:
        return jsonify({"error": "Bu əməliyyat yalnız administrator üçün nəzərdə tutulub."}), 403


# Brauzerdə cross-site cookie sorğularının profil və sağlamlıq
# məlumatlarını səssiz dəyişməsinin qarşısını alırıq.
@app.before_request
def protect_cookie_mutations():
    if request.method in {"POST", "PUT", "PATCH", "DELETE"} and request.cookies.get("token"):
        origin = request.headers.get("Origin")
        if origin and request.headers.get("X-E-Motion-Request") != "1":
            return jsonify({"error": "Təhlükəsizlik yoxlaması uğursuz oldu."}), 403


# Təhlükəsizlik Başlıqları
@app.after_request
def set_security_headers(response):
    response.headers['X-Content-Type-Options'] = 'nosniff'
    response.headers['X-Frame-Options'] = 'SAMEORIGIN'
    response.headers['X-XSS-Protection'] = '1; mode=block'
    return response

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

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DB_NAME = os.path.join(BASE_DIR, 'kuds_database.db')

# --- DATABASE HELPER & INITIALIZATION ---

def get_db_connection():
    """Verilənlər bazası ilə əlaqə yaradır və row_factory təyin edir"""
    conn = sqlite3.connect(DB_NAME)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    """Cəvəlləri yaradır və ilkin dataları daxil edir"""
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
            time TEXT NOT NULL,
            read BOOLEAN NOT NULL DEFAULT 0
        )
    ''')

    # 12. Water Cədvəli
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS water (
            id INTEGER PRIMARY KEY CHECK (id = 1),
            count INTEGER NOT NULL DEFAULT 0
        )
    ''')

    # 13. User Profile Cədvəli
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS user_profile (
            id INTEGER PRIMARY KEY CHECK (id = 1),
            fullname TEXT NOT NULL,
            major TEXT NOT NULL,
            course INTEGER NOT NULL,
            student_id TEXT DEFAULT 'QU-2024-101',
            email TEXT DEFAULT 'st123456@qu.edu.az',
            phone TEXT DEFAULT '+994 50 123 45 67',
            blood_group TEXT DEFAULT 'A+',
            emergency_contact TEXT DEFAULT '+994 50 765 43 21',
            bio TEXT DEFAULT 'Qarabağ Universiteti tələbəsi. Sağlam həyat tərzi və idman həvəskarı.',
            daily_step_goal INTEGER DEFAULT 10000,
            daily_water_goal INTEGER DEFAULT 2000
        )
    ''')

    # Login sessiyaları və hər tələbəyə məxsus profil məlumatları.
    # Köhnə singleton user_profile cədvəli məlumat qarışıqlığına səbəb ola bilər:
    # yeni istifadəçi məlumatlarını user_profiles cədvəlində saxlayırıq.
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS user_sessions (
            token_hash TEXT PRIMARY KEY,
            user_id INTEGER NOT NULL,
            expires_at INTEGER NOT NULL,
            FOREIGN KEY(user_id) REFERENCES users(id)
        )
    """)
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS user_profiles (
            user_id INTEGER PRIMARY KEY,
            fullname TEXT NOT NULL DEFAULT '',
            major TEXT NOT NULL DEFAULT '',
            course INTEGER NOT NULL DEFAULT 1,
            student_id TEXT NOT NULL DEFAULT '',
            phone TEXT NOT NULL DEFAULT '',
            blood_group TEXT NOT NULL DEFAULT '',
            emergency_contact TEXT NOT NULL DEFAULT '',
            bio TEXT NOT NULL DEFAULT '',
            daily_step_goal INTEGER NOT NULL DEFAULT 10000,
            daily_water_goal INTEGER NOT NULL DEFAULT 2000,
            FOREIGN KEY(user_id) REFERENCES users(id)
        )
    """)

    conn.commit()

    # Seed initial test data if empty
    cursor.execute('SELECT COUNT(*) FROM students')
    if cursor.fetchone()[0] == 0:
        cursor.execute("INSERT INTO students (name, student_id, major, semester) VALUES ('Əli Məmmədov', 'st123456', 'Kompüter Mühəndisliyi', 4)")
        cursor.execute("INSERT INTO students (name, student_id, major, semester) VALUES ('Aysel Əliyeva', 'st123457', 'İnformasiya Texnologiyaları', 2)")
        cursor.execute("INSERT INTO courses (title, code, credits) VALUES ('Veb Proqramlaşdırma', 'CS301', 6)")
        cursor.execute("INSERT INTO courses (title, code, credits) VALUES ('Verilənlər Bazası Sistemləri', 'CS204', 5)")
        cursor.execute("INSERT INTO events (title, date, location) VALUES ('AI və Gələcək Seminarı', '2026-04-15', 'Əsas Bina, Zal A')")
        cursor.execute("INSERT INTO resources (title, category, link) VALUES ('Flask Sənədləşməsi', 'Dərslik', 'https://flask.palletsprojects.com/')")
        cursor.execute("INSERT INTO challenges (title, description, completed) VALUES ('Su Kampaniyası', 'Hər gün 2 litr su iç', 0)")
        cursor.execute("INSERT INTO challenges (title, description, completed) VALUES ('Aktiv Həyat', 'Həftə sonuna qədər günlük 7000 addım at', 0)")
        cursor.execute("INSERT INTO notifications (title, desc, time) VALUES ('Su hədəfi', 'Gündəlik su qəbulunun 50%-nə çatdınız!', '10 dəq əvvəl')")
        cursor.execute("INSERT INTO messages (sender, text, time, read) VALUES ('Dr. Əliyev', 'Qan analizi nəticələriniz hazırdır.', '12:30', 0)")
        cursor.execute("INSERT INTO water (id, count) VALUES (1, 0)")
        conn.commit()

    conn.close()

# Bazanı işə salırıq
init_db()

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
      400:
        description: Sorğuda prompt daxil edilməyib
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

# Student health endpoints are registered below from user_data.py.

def get_authenticated_user(conn):
    """Return the account associated with a valid, unexpired session cookie."""
    auth_header = request.headers.get("Authorization", "")
    token = (
        auth_header[len("Bearer "):].strip()
        if auth_header.startswith("Bearer ")
        else request.cookies.get("token", "")
    )
    if not token:
        return None

    digest = hashlib.sha256(token.encode("utf-8")).hexdigest()
    return conn.execute("""
        SELECT users.id, users.name, users.email
        FROM user_sessions
        JOIN users ON users.id = user_sessions.user_id
        WHERE user_sessions.token_hash = ?
          AND user_sessions.expires_at > ?
    """, (digest, int(time.time()))).fetchone()


def build_user_profile(conn, user):
    """Merge account identity with the authenticated student's saved settings."""
    student_id = user["email"].split("@")[0]
    student = conn.execute(
        "SELECT major, semester FROM students WHERE UPPER(student_id) = UPPER(?)",
        (student_id,)
    ).fetchone()
    profile = conn.execute(
        "SELECT * FROM user_profiles WHERE user_id = ?", (user["id"],)
    ).fetchone()
    values = dict(profile) if profile else {}
    return {
        "fullname": values.get("fullname") or user["name"],
        "email": user["email"],
        "major": values.get("major") or (student["major"] if student else ""),
        "course": values.get("course") or ((student["semester"] + 1) // 2 if student else 1),
        "student_id": values.get("student_id") or student_id.upper(),
        "phone": values.get("phone") or "",
        "blood_group": values.get("blood_group") or "",
        "emergency_contact": values.get("emergency_contact") or "",
        "bio": values.get("bio") or "",
        "daily_step_goal": values.get("daily_step_goal") or 10000,
        "daily_water_goal": values.get("daily_water_goal") or 2000
    }


from user_data import register_user_data_routes
register_user_data_routes(app, get_db_connection, get_authenticated_user)

@app.route('/api/user/profile', methods=['GET', 'POST', 'PUT', 'OPTIONS'])
def user_profile_endpoint():
    """Read/update only the profile belonging to the authenticated account."""
    if request.method == 'OPTIONS':
        return '', 200

    conn = get_db_connection()
    try:
        user = get_authenticated_user(conn)
        if user is None:
            return jsonify({"error": "Giriş tələb olunur."}), 401

        if request.method == 'GET':
            return jsonify(build_user_profile(conn, user)), 200

        data = request.get_json(silent=True)
        if not isinstance(data, dict):
            return jsonify({"error": "Profil üçün JSON obyekt göndərin."}), 400

        existing = build_user_profile(conn, user)
        supplied_email = str(data.get("email") or "").strip()
        if supplied_email and supplied_email.lower() != user["email"].lower():
            return jsonify({"error": "Başqa hesabın e-poçtu ilə profil dəyişdirilə bilməz."}), 403

        def get_text(key, alias=None):
            value = data.get(key)
            if value is None and alias:
                value = data.get(alias)
            if value is None:
                value = existing[key]
            return str(value).strip() if value is not None else ""

        try:
            course = int(data.get("course", existing["course"]))
            step_goal = int(data.get("daily_step_goal", data.get("dailyStepGoal", existing["daily_step_goal"])))
            water_goal = int(data.get("daily_water_goal", data.get("dailyWaterGoal", existing["daily_water_goal"])))
        except (ValueError, TypeError):
            return jsonify({"error": "Hədəflər və kurs rəqəm olmalıdır."}), 400

        if not 1 <= course <= 8 or not 1 <= step_goal <= 100000 or not 1 <= water_goal <= 10000:
            return jsonify({"error": "Kurs və gündəlik hədəflər uyğun aralıqda olmalıdır."}), 400

        fullname = get_text("fullname", "name") or user["name"]
        if len(fullname) > 150:
            return jsonify({"error": "Ad və soyad çox uzundur."}), 400

        profile_values = (
            user["id"], fullname, get_text("major"), course,
            get_text("student_id", "studentId"), get_text("phone"),
            get_text("blood_group", "bloodGroup"),
            get_text("emergency_contact", "emergencyContact"),
            get_text("bio"), step_goal, water_goal
        )
        conn.execute("""
            INSERT INTO user_profiles (
                user_id, fullname, major, course, student_id, phone,
                blood_group, emergency_contact, bio, daily_step_goal, daily_water_goal
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ON CONFLICT(user_id) DO UPDATE SET
                fullname=excluded.fullname,
                major=excluded.major,
                course=excluded.course,
                student_id=excluded.student_id,
                phone=excluded.phone,
                blood_group=excluded.blood_group,
                emergency_contact=excluded.emergency_contact,
                bio=excluded.bio,
                daily_step_goal=excluded.daily_step_goal,
                daily_water_goal=excluded.daily_water_goal
        """, profile_values)
        conn.commit()

        return jsonify({
            "message": "Profil məlumatları uğurla yeniləndi!",
            "user": build_user_profile(conn, user)
        }), 200
    except Exception:
        app.logger.exception("Profile endpoint failed")
        return jsonify({"error": "Profil yenilənərkən xəta baş verdi."}), 500
    finally:
        conn.close()


# --- AUTHENTICATION ENDPOINTS ---

@app.route('/api/register', methods=['POST'])
@limiter.limit("5 per 15 minutes")
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

    if len(password) < 8:
        return jsonify({"error": "Şifrə minimum 8 simvoldan ibarət olmalıdır!"}), 400

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
@limiter.limit("10 per 15 minutes", key_func=login_limit_identity)
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
        description: Login successful (Token HttpOnly cookie olaraq yazılır)
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

            # Hər giriş üçün kriptoqrafik təsadüfi sessiya; bazada yalnız hash saxlanılır.
            token = secrets.token_urlsafe(32)
            token_hash = hashlib.sha256(token.encode("utf-8")).hexdigest()
            lifetime = 7 * 24 * 60 * 60
            conn.execute(
                "INSERT INTO user_sessions (token_hash, user_id, expires_at) VALUES (?, ?, ?)",
                (token_hash, user["id"], int(time.time()) + lifetime)
            )
            conn.commit()

            response = make_response(jsonify({
                "message": "Giriş uğurludur!",
                "user": {
                    "id": user["id"],
                    "name": student_name,
                    "email": user["email"],
                    "major": major,
                    "course": course
                }
            }), 200)
            is_production = (
                os.getenv("RENDER") is not None
                or os.getenv("FLASK_ENV") == "production"
            )
            response.set_cookie(
                "token", token, httponly=True, secure=is_production,
                samesite="None" if is_production else "Lax",
                max_age=lifetime, path="/"
            )

            return response

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
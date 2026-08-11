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
        "description": "E-motion Platformasının Backend REST API Sənədləşməsi",
        "version": "1.0.0"
    }
}

swagger = Swagger(app, config=swagger_config, template=template)

DB_NAME = 'kuds_database.db'

# --- HEALTH CHECK ENDPOINT ---
@app.route('/health', methods=['GET'])
def health_check():
    """
    Health Check Endpoint
    ---
    responses:
      200:
        description: Server is running smoothly
    """
    return jsonify({"status": "ok", "message": "Server is active"}), 200

# --- NOTIFICATIONS ENDPOINTS ---
@app.route('/api/notifications', methods=['GET'])
def get_notifications():
    """
    Get all notifications
    ---
    responses:
      200:
        description: List of notifications
    """
    conn = get_db_connection()
    notifications = conn.execute('SELECT * FROM notifications').fetchall()
    conn.close()
    
    result = []
    for n in notifications:
        result.append({
            "id": n["id"],
            "title": n["title"],
            "desc": n["desc"],
            "time": n["time"],
            "read": bool(n["read"])
        })
    return jsonify(result), 200

@app.route('/api/notifications/read-all', methods=['PUT', 'POST', 'OPTIONS'])
def read_all_notifications():
    """
    Mark all notifications as read
    ---
    responses:
      200:
        description: Success status and updated notifications
    """
    if request.method == 'OPTIONS':
        return '', 200

    conn = get_db_connection()
    conn.execute('UPDATE notifications SET read = 1')
    conn.commit()
    
    notifications = conn.execute('SELECT * FROM notifications').fetchall()
    conn.close()

    result = []
    for n in notifications:
        result.append({
            "id": n["id"],
            "title": n["title"],
            "desc": n["desc"],
            "time": n["time"],
            "read": True
        })
    return jsonify({"success": True, "notifications": result}), 200

@app.route('/api/notifications/reset', methods=['GET'])
def reset_notifications():
    conn = get_db_connection()
    
    conn.execute('''
        INSERT OR IGNORE INTO notifications (id, title, desc, time, read)
        VALUES 
        (1, 'Sistem yenilənməsi', 'Platformada yeni funksiyalar aktivləşdirildi.', '10 dəq əvvəl', 0),
        (2, 'Yeni tapşırıq', 'Aktivlik panelinə yeni məqsəd əlavə olundu.', '1 saat əvvəl', 0)
    ''')
    
    conn.execute('UPDATE notifications SET read = 0')
    conn.commit()
    conn.close()
    return jsonify({"message": "Bildirişlər bərpa olundu və oxunmamış vəziyyətə gətirildi!"}), 200

# --- MESSAGES ENDPOINTS ---
@app.route('/api/messages', methods=['GET'])
def get_messages():
    conn = get_db_connection()
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
        
    conn.close()

    result = []
    for m in messages:
        result.append({
            "id": m["id"],
            "sender": m["sender"],
            "text": m["text"],
            "time": m["time"],
            "read": bool(m["read"]) if "read" in m.keys() else False
        })
    return jsonify(result), 200

@app.route('/api/messages/reset', methods=['GET'])
def reset_messages():
    conn = get_db_connection()
    conn.execute('''
        INSERT OR IGNORE INTO messages (id, sender, text, time, read)
        VALUES 
        (1, 'Aysel Məmmədova', 'Layihənin backend inteqrasiyası hazırdır?', '12:45', 0),
        (2, 'Dəstək Komandası', 'Sistemlə bağlı hər hansı sualınız var?', 'Dünən', 0)
    ''')
    conn.execute('UPDATE messages SET read = 0')
    conn.commit()
    conn.close()
    return jsonify({"message": "Mesajlar bərpa olundu!"}), 200

# --- MESAJLARI OXUNMUŞ ET ---
@app.route('/api/messages/read-all', methods=['POST', 'OPTIONS'])
def mark_all_messages_read():
    if request.method == 'OPTIONS':
        return '', 200

    conn = get_db_connection()
    conn.execute('UPDATE messages SET read = 1')
    conn.commit()
    conn.close()
    return jsonify({"success": True}), 200

# --- BİLDİRİŞLƏRİ OXUNMUŞ ET ---
@app.route('/api/notifications/read-all', methods=['POST', 'OPTIONS'])
def mark_all_notifications_read():
    if request.method == 'OPTIONS':
        return '', 200

    conn = get_db_connection()
    conn.execute('UPDATE notifications SET read = 1')
    conn.commit()
    conn.close()
    return jsonify({"success": True}), 200

# --- WATER ENDPOINTS ---
@app.route('/api/water', methods=['GET'])
def get_water():
    conn = get_db_connection()
    water = conn.execute('SELECT * FROM water WHERE id = 1').fetchone()
    conn.close()
    
    count = water["count"] if water else 4
    return jsonify({"count": count}), 200

@app.route('/api/water', methods=['POST', 'PUT', 'OPTIONS'])
def update_water():
    if request.method == 'OPTIONS':
        return '', 200

    data = request.get_json()
    if data and 'count' in data:
        new_count = data['count']
        
        conn = get_db_connection()
        conn.execute('INSERT OR REPLACE INTO water (id, count) VALUES (1, ?)', (new_count,))
        conn.commit()
        conn.close()
        
        return jsonify({"success": True, "count": new_count}), 200
        
    return jsonify({"error": "Səhv məlumat"}), 400

@app.route('/api/user/profile', methods=['GET'])
def get_user_profile():
    """
    Get active user profile details
    ---
    responses:
      200:
        description: User profile information
    """
    conn = get_db_connection()
    user = conn.execute('SELECT * FROM user_profile WHERE id = 1').fetchone()
    conn.close()
    if user:
        return jsonify(dict(user)), 200
    return jsonify({"error": "İstifadəçi tapılmadı"}), 404

@app.route('/', methods=['GET'])
def root():
    return jsonify({
        "message": "E-Motion API Server is running",
        "docs": "/apidocs",
        "health": "/health"
    }), 200

# Mərkəzləşdirilmiş Xəta İdarəediciləri
@app.errorhandler(400)
def bad_request(error):
    return jsonify({
        "status": 400,
        "error": "Bad Request",
        "message": getattr(error, 'description', 'Daxil edilən məlumatlar yanlışdır.')
    }), 400

@app.errorhandler(404)
def not_found(error):
    return jsonify({
        "status": 404,
        "error": "Not Found",
        "message": "Axtarılan resurs və ya endpoint tapılmadı."
    }), 404

@app.errorhandler(500)
def internal_server_error(error):
    return jsonify({
        "status": 500,
        "error": "Internal Server Error",
        "message": "Serverdə daxili xəta baş verdi. Zəhmət olmasa daha sonra yenidən cəhd edin."
    }), 500

# CORS idarəetməsi
@app.after_request
def after_request(response):
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
    response.headers.add('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS')
    return response

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

# ================= AUTHENTICATION =================

@app.route('/api/register', methods=['POST'])
def register():
    """
    İstifadəçi Qeydiyyatı
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
    data = request.get_json() or {}
    name = data.get('name')
    email = data.get('email')
    password = data.get('password')

    if not name or not email or not password:
        return jsonify({"message": "Bütün xanaları doldurun!"}), 400

    email_pattern = r'^(?i:s|st)\d{6}@qu\.edu\.az$'
    if not re.match(email_pattern, email):
        return jsonify({"message": "Keçərsiz e-poçt formatı! Yalnız S123456@qu.edu.az formatında e-poçtlar qəbul edilir."}), 400

    hashed_password = generate_password_hash(password)
    conn = get_db_connection()
    cursor = conn.cursor()

    user_check = cursor.execute("SELECT id FROM users WHERE email = ?", (email,)).fetchone()
    if user_check:
        conn.close()
        return jsonify({"message": "Bu e-poçt ünvanı artıq qeydiyyatdan keçib!"}), 400

    try:
        cursor.execute("INSERT INTO users (name, email, password) VALUES (?, ?, ?)", (name, email, hashed_password))
        conn.commit()
        return jsonify({"message": "Qeydiyyat uğurla tamamlandı!"}), 201
    except sqlite3.IntegrityError as e:
        return jsonify({"message": f"Verilənlər bazası xətası: {str(e)}"}), 400
    except Exception as e:
        return jsonify({"message": f"Server xətası: {str(e)}"}), 500
    finally:
        conn.close()

@app.route('/api/login', methods=['POST'])
def login():
    """
    İstifadəçi Girişi
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
        description: Giriş uğurludur
      401:
        description: E-poçt və ya şifrə yanlışdır
    """
    data = request.get_json() or {}
    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify({'message': 'E-poçt və şifrəni daxil edin!'}), 400

    conn = get_db_connection()
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

        conn.close()
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

    conn.close()
    return jsonify({'message': 'E-poçt və ya şifrə yanlışdır!'}), 401

# ================= DASHBOARD & STATS =================

@app.route('/api/stats', methods=['GET'])
def get_stats():
    """
    Ümumi Statistika Məlumatları
    ---
    tags:
      - Stats
    responses:
      200:
        description: Statistika uğurla gətirildi
    """
    conn = get_db_connection()
    students_count = conn.execute('SELECT COUNT(*) FROM students').fetchone()[0]
    courses_count = conn.execute('SELECT COUNT(*) FROM courses').fetchone()[0]
    events_count = conn.execute('SELECT COUNT(*) FROM events').fetchone()[0]
    resources_count = conn.execute('SELECT COUNT(*) FROM resources').fetchone()[0]
    conn.close()

    return jsonify({
        'students': students_count,
        'courses': courses_count,
        'events': events_count,
        'resources': resources_count
    }), 200

# ================= ACADEMICS (STUDENTS, COURSES) =================

@app.route('/api/students', methods=['GET'])
def get_students():
    """
    Tələbələrin Siyahısı
    ---
    tags:
      - Students
    responses:
      200:
        description: Tələbələr siyahısı
    """
    conn = get_db_connection()
    students = conn.execute('SELECT * FROM students').fetchall()
    conn.close()
    return jsonify([dict(row) for row in students]), 200

@app.route('/api/students', methods=['POST'])
def add_student():
    """
    Yeni Tələbə Əlavə Etmə
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
        description: Tələbə əlavə edildi
    """
    data = request.get_json() or {}
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
        return jsonify({'message': 'Bu ID ilə tələbə artıq mövcuddur!'}), 400
    finally:
        conn.close()

@app.route('/api/students/<int:id>', methods=['DELETE'])
def delete_student(id):
    """
    Tələbəni Silmə
    ---
    tags:
      - Students
    parameters:
      - name: id
        in: path
        type: integer
        required: true
        description: Silinəcək tələbənin ID-si
    responses:
      200:
        description: Tələbə silindi
      404:
        description: Tələbə tapılmadı
    """
    conn = get_db_connection()
    cursor = conn.cursor()
    
    cursor.execute("SELECT id FROM students WHERE id = ?", (id,))
    if cursor.fetchone() is None:
        conn.close()
        return jsonify({'message': 'Belə bir tələbə mövcud deyil!'}), 404
        
    conn.execute('DELETE FROM students WHERE id = ?', (id,))
    conn.commit()
    conn.close()
    return jsonify({'message': 'Tələbə uğurla silindi!'}), 200

@app.route('/api/courses', methods=['GET'])
def get_courses():
    """
    Fənlərin Siyahısı
    ---
    tags:
      - Courses
    responses:
      200:
        description: Fənlər siyahısı
    """
    conn = get_db_connection()
    courses = conn.execute('SELECT * FROM courses').fetchall()
    conn.close()
    return jsonify([dict(row) for row in courses]), 200

@app.route('/api/courses', methods=['POST'])
def add_course():
    """
    Yeni Fənn Əlavə Etmə
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
        description: Fənn əlavə edildi
    """
    data = request.get_json() or {}
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
        return jsonify({'message': 'Bu kodlu fənn artıq mövcuddur!'}), 400
    finally:
        conn.close()

# ================= EVENTS & RESOURCES =================

@app.route('/api/events', methods=['GET'])
def get_events():
    """
    Tədbirlərin Siyahısı
    ---
    tags:
      - Events
    responses:
      200:
        description: Tədbirlər siyahısı
    """
    conn = get_db_connection()
    events = conn.execute('SELECT * FROM events').fetchall()
    conn.close()
    return jsonify([dict(row) for row in events]), 200

@app.route('/api/events', methods=['POST'])
def add_event():
    """
    Yeni Tədbir Əlavə Etmə
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
        description: Tədbir əlavə edildi
    """
    data = request.get_json() or {}
    title = data.get('title')
    date = data.get('date')
    location = data.get('location')

    if not title or not date or not location:
        return jsonify({'message': 'Bütün xanaları doldurun!'}), 400

    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        cursor.execute('INSERT INTO events (title, date, location) VALUES (?, ?, ?)', (title, date, location))
        conn.commit()
        return jsonify({'message': 'Tədbir uğurla əlavə edildi!'}), 201
    except Exception as e:
        return jsonify({'message': f'Server xətası: {str(e)}'}), 500
    finally:
        conn.close()

@app.route('/api/resources', methods=['GET'])
def get_resources():
    """
    Resursların Siyahısı
    ---
    tags:
      - Resources
    responses:
      200:
        description: Resurslar siyahısı
    """
    conn = get_db_connection()
    resources = conn.execute('SELECT * FROM resources').fetchall()
    conn.close()
    return jsonify([dict(row) for row in resources]), 200

@app.route('/api/resources', methods=['POST'])
def add_resource():
    """
    Yeni Resurs Əlavə Etmə
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
        description: Resurs əlavə edildi
    """
    data = request.get_json() or {}
    title = data.get('title')
    category = data.get('category')
    link = data.get('link')

    if not title or not category or not link:
        return jsonify({'message': 'Bütün xanaları doldurun!'}), 400

    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        cursor.execute('INSERT INTO resources (title, category, link) VALUES (?, ?, ?)', (title, category, link))
        conn.commit()
        return jsonify({'message': 'Resurs uğurla əlavə edildi!'}), 201
    except Exception as e:
        return jsonify({'message': f'Server xətası: {str(e)}'}), 500
    finally:
        conn.close()

# ================= HEALTH & WELLNESS =================

@app.route('/api/activity', methods=['GET'])
def get_activity():
    """
    Son fiziki aktivlik məlumatını gətirir
    """
    conn = get_db_connection()
    activity = conn.execute('SELECT * FROM physical_activity ORDER BY id DESC LIMIT 1').fetchone()
    conn.close()
    
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


@app.route('/api/activity', methods=['POST'])
def update_activity():
    """
    Yeni fiziki aktivlik və su qəbulu məlumatını bazada saxlayır
    """
    data = request.get_json() or {}
    
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
        return jsonify({'message': f'Server xətası: {str(e)}'}), 500
    finally:
        conn.close()

@app.route('/api/moods', methods=['GET'])
def get_moods():
    """
    Son 5 emosiya qeydini gətirir
    ---
    tags:
      - Health & Activity
    responses:
      200:
        description: Emosiya siyahısı uğurla gətirildi
    """
    conn = get_db_connection()
    moods = conn.execute('SELECT * FROM mood_logs ORDER BY id DESC LIMIT 5').fetchall()
    conn.close()
    return jsonify([dict(row) for row in moods]), 200

@app.route('/api/moods', methods=['POST'])
def add_mood():
    """
    Yeni emosiya qeydi əlavə edir
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
        description: Mental vəziyyət uğurla qeyd olundu
    """
    data = request.get_json() or {}
    mood = data.get('mood')
    note = data.get('note')

    if not mood:
        return jsonify({'message': 'Zəhmət olmasa bir emosiya seçin!'}), 400

    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        cursor.execute('INSERT INTO mood_logs (mood, note) VALUES (?, ?)', (mood, note))
        conn.commit()
        return jsonify({'message': 'Mental vəziyyətiniz uğurla qeyd olundu!'}), 201
    except Exception as e:
        return jsonify({'message': f'Server xətası: {str(e)}'}), 500
    finally:
        conn.close()

@app.route('/api/nutrition', methods=['GET'])
def get_nutrition():
    """
    Son 5 qidalanma logunu gətirir
    ---
    tags:
      - Health & Activity
    responses:
      200:
        description: Qidalanma siyahısı uğurla gətirildi
    """
    conn = get_db_connection()
    logs = conn.execute('SELECT * FROM nutrition ORDER BY id DESC LIMIT 5').fetchall()
    conn.close()
    return jsonify([dict(row) for row in logs]), 200

@app.route('/api/nutrition', methods=['POST'])
def add_nutrition():
    """
    Yeni yemək və kalori qeydi əlavə edir
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
        description: Qidalanma qeydi əlavə edildi
    """
    data = request.get_json() or {}
    meal = data.get('meal')
    calories = data.get('calories')

    if not meal or not calories:
        return jsonify({'message': 'Bütün xanaları doldurun!'}), 400

    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        cursor.execute('INSERT INTO nutrition (meal, calories) VALUES (?, ?)', (meal, int(calories)))
        conn.commit()
        return jsonify({'message': 'Qidalanma qeydi uğurla əlavə edildi!'}), 201
    except Exception as e:
        return jsonify({'message': f'Server xətası: {str(e)}'}), 500
    finally:
        conn.close()

@app.route('/api/challenges', methods=['GET'])
def get_challenges():
    """
    Mövcud çağırışların siyahısını gətirir
    ---
    tags:
      - Health & Activity
    responses:
      200:
        description: Çağırışlar uğurla gətirildi
    """
    conn = get_db_connection()
    challenges = conn.execute('SELECT * FROM challenges').fetchall()
    conn.close()
    return jsonify([dict(row) for row in challenges]), 200

@app.route('/api/challenges/<int:challenge_id>/toggle', methods=['POST'])
def toggle_challenge(challenge_id):
    """
    Çağırışın statusunu dəyişir (Tamamlandı/Tamamlanmadı)
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
        description: Status yeniləndi
    """
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        cursor.execute('UPDATE challenges SET completed = 1 - completed WHERE id = ?', (challenge_id,))
        conn.commit()
        return jsonify({'message': 'Status yeniləndi!'}), 200
    except Exception as e:
        return jsonify({'message': str(e)}), 500
    finally:
        conn.close()

if __name__ == '__main__':
    port = int(os.getenv('PORT', 5050))
    debug = os.getenv('FLASK_ENV') == 'development'
    app.run(host='0.0.0.0', port=port, debug=debug)
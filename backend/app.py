from flask import Flask, jsonify, request
from flask_cors import CORS
from flasgger import Swagger
from werkzeug.security import generate_password_hash, check_password_hash
import sqlite3
import os
import re

app = Flask(__name__, template_folder='../frontend', static_folder='../frontend')
CORS(app)
swagger = Swagger(app)

DATABASE = 'kuds_database.db'


# CORS idarəetməsi
@app.after_request
def after_request(response):
  response.headers.add('Access-Control-Allow-Origin', '*')
  response.headers.add(
      'Access-Control-Allow-Headers', 'Content-Type,Authorization'
  )
  response.headers.add(
      'Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS'
  )
  return response


def get_db_connection():
  conn = sqlite3.connect(DATABASE)
  conn.row_factory = sqlite3.Row
  return conn


def init_db():
  conn = get_db_connection()
  cursor = conn.cursor()

  # 1. İstifadəçilər (Users) cədvəli
  cursor.execute("""
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL
        )
    """)

  # 2. Tələbələr (Students) cədvəli
  cursor.execute("""
        CREATE TABLE IF NOT EXISTS students (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            student_id TEXT UNIQUE NOT NULL,
            major TEXT NOT NULL,
            semester INTEGER NOT NULL
        )
    """)

  # 3. Fənlər (Courses) cədvəli
  cursor.execute("""
        CREATE TABLE IF NOT EXISTS courses (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            code TEXT UNIQUE NOT NULL,
            credits INTEGER NOT NULL
        )
    """)

  # 4. Qiymətlər (Grades) cədvəli
  cursor.execute("""
        CREATE TABLE IF NOT EXISTS grades (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            student_name TEXT NOT NULL,
            course_code TEXT NOT NULL,
            midterm INTEGER NOT NULL,
            final INTEGER NOT NULL
        )
    """)

  # 5. Qayıblar (Attendance) cədvəli
  cursor.execute("""
        CREATE TABLE IF NOT EXISTS attendance (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            student_name TEXT NOT NULL,
            course_code TEXT NOT NULL,
            status TEXT NOT NULL
        )
    """)

  # 6. Tədbirlər (Events) cədvəli
  cursor.execute("""
        CREATE TABLE IF NOT EXISTS events (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            date TEXT NOT NULL,
            location TEXT NOT NULL
        )
    """)

  # 7. Resurslar (Resources) cədvəli
  cursor.execute("""
        CREATE TABLE IF NOT EXISTS resources (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            category TEXT NOT NULL,
            link TEXT NOT NULL
        )
    """)

  conn.commit()

  # Test məlumatlarının əlavə edilməsi (cədvəl boşdursa)
  cursor.execute('SELECT COUNT(*) FROM students')
  if cursor.fetchone()[0] == 0:
    cursor.execute(
        "INSERT INTO students (name, student_id, major, semester) VALUES ('Əli"
        " Məmmədov', 'S123456', 'Kompüter Mühəndisliyi', 4)"
    )
    cursor.execute(
        "INSERT INTO students (name, student_id, major, semester) VALUES ('Aysel"
        " Əliyeva', 'S123457', 'İnformasiya Texnologiyaları', 2)"
    )
    cursor.execute(
        "INSERT INTO students (name, student_id, major, semester) VALUES ('Aylin"
        " Əliyeva', 'S123458', 'İnformatika', 4)"
    )
    cursor.execute(
        "INSERT INTO courses (title, code, credits) VALUES ('Veb"
        " Proqramlaşdırma', 'CS301', 6)"
    )
    cursor.execute(
        "INSERT INTO courses (title, code, credits) VALUES ('Verilənlər Bazası"
        " Sistemləri', 'CS204', 5)"
    )
    cursor.execute(
        "INSERT INTO events (title, date, location) VALUES ('AI və Gələcək"
        " Seminarı', '2025-04-15', 'Əsas Bina, Zal A')"
    )
    cursor.execute(
        "INSERT INTO resources (title, category, link) VALUES ('Flask"
        " Sənədləşməsi', 'Dərslik', 'https://flask.palletsprojects.com/')"
    )
    conn.commit()

  conn.close()


# Server hər başlayanda cədvəllərin olduğundan əmin oluruq
init_db()

# ================= GİRİŞ VƏ QEYDİYYAT ENDPOINLERİ =================


@app.route('/api/register', methods=['POST'])
def register():
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
        return jsonify({"message": f"Verilənlər bazası məhdudiyyət xətası: {str(e)}. Ehtimal ki, yazdığınız Ad və Soyad bazada artıq mövcuddur!"}), 400
    except Exception as e:
        return jsonify({"message": f"Server xətası: {str(e)}"}), 500
    finally:
        conn.close()


@app.route('/api/login', methods=['POST'])
def login():
  data = request.get_json() or {}
  email = data.get('email')
  password = data.get('password')

  if not email or not password:
    return jsonify({'message': 'E-poçt və şifrəni daxil edin!'}), 400

  conn = get_db_connection()
  user = conn.execute(
      'SELECT * FROM users WHERE email = ?', (email,)
  ).fetchone()

  if user and check_password_hash(user['password'], password):
    student_id = email.split('@')[0].upper()

    student_record = conn.execute(
        'SELECT * FROM students WHERE UPPER(student_id) = ?', (student_id,)
    ).fetchone()

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

    return (
        jsonify({
            'message': 'Giriş uğurludur!',
            'token': 'auth-token-xyz-12345',
            'user': {
                'id': user['id'],
                'name': student_name,
                'email': user['email'],
                'major': major,
                'course': f'{course}-ci kurs',
            },
        }),
        200,
    )

  conn.close()
  return jsonify({'message': 'E-poçt və ya şifrə yanlışdır!'}), 401


# ================= DASHBOARD VƏ STATİSTİKA =================


@app.route('/api/stats', methods=['GET'])
def get_stats():
  conn = get_db_connection()
  students_count = conn.execute('SELECT COUNT(*) FROM students').fetchone()[0]
  courses_count = conn.execute('SELECT COUNT(*) FROM courses').fetchone()[0]
  events_count = conn.execute('SELECT COUNT(*) FROM events').fetchone()[0]
  resources_count = conn.execute('SELECT COUNT(*) FROM resources').fetchone()[0]
  conn.close()

  return (
      jsonify({
          'students': students_count,
          'courses': courses_count,
          'events': events_count,
          'resources': resources_count,
      }),
      200,
  )


# ================= TƏLƏBƏLƏR (STUDENTS) =================


@app.route('/api/students', methods=['GET'])
def get_students():
  conn = get_db_connection()
  students = conn.execute('SELECT * FROM students').fetchall()
  conn.close()
  return jsonify([dict(row) for row in students]), 200


@app.route('/api/students', methods=['POST'])
def add_student():
  data = request.get_json() or {}
  conn = get_db_connection()
  cursor = conn.cursor()
  try:
    cursor.execute(
        'INSERT INTO students (name, student_id, major, semester) VALUES (?, ?,'
        ' ?, ?)',
        (
            data.get('name'),
            data.get('student_id'),
            data.get('major'),
            data.get('semester'),
        ),
    )
    conn.commit()
    return jsonify({'message': 'Tələbə uğurla əlavə edildi!'}), 201
  except sqlite3.IntegrityError:
    return jsonify({'message': 'Bu ID ilə tələbə artıq mövcuddur!'}), 400
  finally:
    conn.close()


@app.route('/api/students/<int:id>', methods=['DELETE'])
def delete_student(id):
  conn = get_db_connection()
  conn.execute('DELETE FROM students WHERE id = ?', (id,))
  conn.commit()
  conn.close()
  return jsonify({'message': 'Tələbə silindi!'}), 200


# ================= FƏNLƏR (COURSES) =================


@app.route('/api/courses', methods=['GET'])
def get_courses():
  conn = get_db_connection()
  courses = conn.execute('SELECT * FROM courses').fetchall()
  conn.close()
  return jsonify([dict(row) for row in courses]), 200


@app.route('/api/courses', methods=['POST'])
def add_course():
  data = request.get_json() or {}
  conn = get_db_connection()
  cursor = conn.cursor()
  try:
    cursor.execute(
        'INSERT INTO courses (title, code, credits) VALUES (?, ?, ?)',
        (data.get('title'), data.get('code'), data.get('credits')),
    )
    conn.commit()
    return jsonify({'message': 'Fənn uğurla əlavə edildi!'}), 201
  except sqlite3.IntegrityError:
    return jsonify({'message': 'Bu kodlu fənn artıq mövcuddur!'}), 400
  finally:
    conn.close()


# ================= TƏDBİRLƏR VƏ RESURSLAR =================


@app.route('/api/events', methods=['GET'])
def get_events():
  conn = get_db_connection()
  events = conn.execute('SELECT * FROM events').fetchall()
  conn.close()
  return jsonify([dict(row) for row in events]), 200

@app.route('/api/events', methods=['POST'])
def add_event():
    data = request.get_json() or {}
    title = data.get('title')
    date = data.get('date')
    location = data.get('location')

    if not title or not date or not location:
        return jsonify({'message': 'Bütün xanaları doldurun!'}), 400

    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        cursor.execute(
            'INSERT INTO events (title, date, location) VALUES (?, ?, ?)',
            (title, date, location)
        )
        conn.commit()
        return jsonify({'message': 'Tədbir uğurla əlavə edildi!'}), 201
    except Exception as e:
        return jsonify({'message': f'Server xətası: {str(e)}'}), 500
    finally:
        conn.close()


@app.route('/api/resources', methods=['GET'])
def get_resources():
  conn = get_db_connection()
  resources = conn.execute('SELECT * FROM resources').fetchall()
  conn.close()
  return jsonify([dict(row) for row in resources]), 200

@app.route('/api/resources', methods=['POST'])
def add_resource():
    data = request.get_json() or {}
    title = data.get('title')
    category = data.get('category')
    link = data.get('link')

    if not title or not category or not link:
        return jsonify({'message': 'Bütün xanaları doldurun!'}), 400

    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        cursor.execute(
            'INSERT INTO resources (title, category, link) VALUES (?, ?, ?)',
            (title, category, link)
        )
        conn.commit()
        return jsonify({'message': 'Resurs uğurla əlavə edildi!'}), 201
    except Exception as e:
        return jsonify({'message': f'Server xətası: {str(e)}'}), 500
    finally:
        conn.close()

def init_activity_db():
    conn = get_db_connection()
    cursor = conn.cursor()
    # Aktivlik cədvəli
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS physical_activity (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            steps INTEGER NOT NULL,
            water_ml INTEGER NOT NULL,
            date TEXT DEFAULT (DATE('now', 'localtime'))
        )
    ''')
    conn.commit()
    conn.close()

init_activity_db()

@app.route('/api/activity', methods=['GET'])
def get_activity():
    """
    Son fiziki aktivlik məlumatını gətirir
    ---
    responses:
      200:
        description: Aktivlik məlumatı uğurla gətirildi
      500:
        description: Server xətası
    """
    conn = get_db_connection()
    activity = conn.execute('SELECT * FROM physical_activity ORDER BY id DESC LIMIT 1').fetchone()
    conn.close()
    
    if activity:
        return jsonify(dict(activity)), 200
    return jsonify({'steps': 0, 'water_ml': 0}), 200

@app.route('/api/activity', methods=['POST'])
def update_activity():
    """
    Yeni fiziki aktivlik məlumatı əlavə edir
    ---
    parameters:
      - name: body
        in: body
        required: true
        schema:
          type: object
          properties:
            steps:
              type: integer
              example: 5000
            water_ml:
              type: integer
              example: 500
    responses:
      201:
        description: Aktivlik uğurla yeniləndi
      400:
        description: Məlumatlar tam ötürülməyib
      500:
        description: Server xətası
    """
    data = request.get_json() or {}
    steps = data.get('steps')
    water_ml = data.get('water_ml')

    if steps is None or water_ml is None:
        return jsonify({'message': 'Məlumatlar tam ötürülməyib!'}), 400

    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        cursor.execute(
            'INSERT INTO physical_activity (steps, water_ml) VALUES (?, ?)',
            (steps, water_ml)
        )
        conn.commit()
        return jsonify({'message': 'Aktivlik uğurla yeniləndi!'}), 201
    except Exception as e:
        return jsonify({'message': f'Server xətası: {str(e)}'}), 500
    finally:
        conn.close()

def init_mental_db():
    conn = get_db_connection()
    cursor = conn.cursor()
    # Emosiya qeydləri cədvəli
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS mood_logs (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            mood TEXT NOT NULL,
            note TEXT,
            date TEXT DEFAULT (DATE('now', 'localtime'))
        )
    ''')
    conn.commit()
    conn.close()

init_mental_db()

@app.route('/api/moods', methods=['GET'])
def get_moods():
    """
    Son 5 emosiya qeydini gətirir
    ---
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
      400:
        description: Emosiya seçilməyib
      500:
        description: Server xətası
    """
    data = request.get_json() or {}
    mood = data.get('mood')
    note = data.get('note')

    if not mood:
        return jsonify({'message': 'Zəhmət olmasa bir emosiya seçin!'}), 400

    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        cursor.execute(
            'INSERT INTO mood_logs (mood, note) VALUES (?, ?)',
            (mood, note)
        )
        conn.commit()
        return jsonify({'message': 'Mental vəziyyətiniz uğurla qeyd olundu!'}), 201
    except Exception as e:
        return jsonify({'message': f'Server xətası: {str(e)}'}), 500
    finally:
        conn.close()

        # ======================= QİDALANMA MODULU =======================

@app.route('/api/nutrition', methods=['GET'])
def get_nutrition():
    """
    Son 5 qidalanma logunu gətirir
    ---
    responses:
      200:
        description: Qidalanma siyahısı uğurla gətirildi
    """
    conn = get_db_connection()
    try:
        logs = conn.execute('SELECT * FROM nutrition ORDER BY id DESC LIMIT 5').fetchall()
        conn.close()
        return jsonify([dict(row) for row in logs]), 200
    except Exception:
        conn.close()
        return jsonify([]), 200

@app.route('/api/nutrition', methods=['POST'])
def add_nutrition():
    """
    Yeni yemək və kalori qeydi əlavə edir
    ---
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
      400:
        description: Bütün xanalar doldurulmayıb
      500:
        description: Server xətası
    """
    data = request.get_json() or {}
    meal = data.get('meal')
    calories = data.get('calories')

    if not meal or not calories:
        return jsonify({'message': 'Bütün xanaları doldurun!'}), 400

    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS nutrition (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                meal TEXT,
                calories INTEGER,
                date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        ''')
        cursor.execute(
            'INSERT INTO nutrition (meal, calories) VALUES (?, ?)',
            (meal, int(calories))
        )
        conn.commit()
        return jsonify({'message': 'Qidalanma qeydi uğurla əlavə edildi!'}), 201
    except Exception as e:
        return jsonify({'message': f'Server xətası: {str(e)}'}), 500
    finally:
        conn.close()

        # ======================= ÇAĞIRIŞLAR MODULU =======================

@app.route('/api/challenges', methods=['GET'])
def get_challenges():
    """
    Mövcud çağırışların siyahısını gətirir
    ---
    responses:
      200:
        description: Çağırışlar uğurla gətirildi
    """
    conn = get_db_connection()
    try:
        cursor = conn.cursor()
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS challenges (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                title TEXT,
                description TEXT,
                completed INTEGER DEFAULT 0
            )
        ''')
        count = conn.execute('SELECT COUNT(*) FROM challenges').fetchone()[0]
        if count == 0:
            cursor.execute("INSERT INTO challenges (title, description, completed) VALUES ('Su Kampaniyası', 'Hər gün 2 litr su iç', 0)")
            cursor.execute("INSERT INTO challenges (title, description, completed) VALUES ('Aktiv Həyat', 'Həftə sonuna qədər günlük 7000 addım at', 0)")
            conn.commit()

        challenges = conn.execute('SELECT * FROM challenges').fetchall()
        conn.close()
        return jsonify([dict(row) for row in challenges]), 200
    except Exception as e:
        conn.close()
        return jsonify({'message': str(e)}), 500

@app.route('/api/challenges/<int:challenge_id>/toggle', methods=['POST'])
def toggle_challenge(challenge_id):
    """
    Çağırışın statusunu dəyişir (Tamamlandı/Tamamlanmadı)
    ---
    parameters:
      - name: challenge_id
        in: path
        type: integer
        required: true
        description: Çağırışın ID-si
    responses:
      200:
        description: Status yeniləndi
      500:
        description: Server xətası
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
  app.run(debug=True, port=5050)
from flask import Flask, jsonify, request
from flasgger import Swagger
from werkzeug.security import generate_password_hash, check_password_hash
import sqlite3
import os
import re

app = Flask(__name__, template_folder='../frontend', static_folder='../frontend')
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
        "INSERT INTO students (name, student_id, major, semester) VALUES"
        " ('Aysel Əliyeva', 'S123457', 'İnformasiya Texnologiyaları', 2)"
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
    return jsonify({'message': 'Bütün xanaları doldurun!'}), 400

  # S və ya ST (böyük/kiçik fərqsiz) + 6 rəqəm + kiçik hərflə @qu.edu.az
  email_pattern = r'^(?i:s|st)\d{6}@qu\.edu\.az$'
  if not re.match(email_pattern, email):
    return (
        jsonify({
            'message': (
                'Keçərsiz e-poçt formatı! Yalnız S123456@qu.edu.az və ya'
                ' ST123456@qu.edu.az formatında e-poçtlar qəbul edilir.'
            )
        }),
        400,
    )

  hashed_password = generate_password_hash(password)

  conn = get_db_connection()
  cursor = conn.cursor()

  # Təhlükəsizlik üçün cədvəlin varlığını hər ehtimala qarşı təkrar yoxlayırıq
  cursor.execute("""
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL
        )
    """)

  try:
    cursor.execute(
        'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
        (name, email, hashed_password),
    )
    conn.commit()
    return jsonify({'message': 'Qeydiyyat uğurla tamamlandı!'}), 201
  except sqlite3.IntegrityError:
    return (
        jsonify({'message': 'Bu e-poçt ünvanı artıq qeydiyyatdan keçib!'}),
        400,
    )
  except Exception as e:
    return jsonify({'message': f'Server xətası: {str(e)}'}), 500
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
  conn.close()

  if user and check_password_hash(user['password'], password):
    return (
        jsonify({
            'message': 'Giriş uğurludur!',
            'token': 'auth-token-xyz-12345',
            'user': {
                'id': user['id'],
                'name': user['name'],
                'email': user['email'],
            },
        }),
        200,
    )

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


@app.route('/api/resources', methods=['GET'])
def get_resources():
  conn = get_db_connection()
  resources = conn.execute('SELECT * FROM resources').fetchall()
  conn.close()
  return jsonify([dict(row) for row in resources]), 200



if __name__ == '__main__':
  app.run(debug=True, port=5050)
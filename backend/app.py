from flask import Flask, jsonify, request
from flasgger import Swagger
from werkzeug.security import generate_password_hash, check_password_hash
import sqlite3
import os

app = Flask(__name__, template_folder='../frontend', static_folder='../frontend')
swagger = Swagger(app)

DATABASE = 'kuds_database.db'

# Frontend və Backend fərqli portlarda işləyərsə CORS probleminin qarşısını almaq üçün
@app.after_request
def after_request(response):
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
    response.headers.add('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS')
    return response

def get_db_connection():
    conn = sqlite3.connect(DATABASE)
    conn.row_factory = sqlite3.Row  # Nəticələrin dictionary formatında oxunması üçün
    return conn

def init_db():
    """Bütün verilənlər bazası cədvəllərinin təmiz və vahid şəkildə başladılması"""
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        # 1. İstifadəçilər cədvəli (Email sütunu əlavə olundu)
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                username TEXT UNIQUE NOT NULL,
                email TEXT UNIQUE NOT NULL,
                password TEXT NOT NULL
            )
        ''')
        
        # 2. Emosiyalar cədvəli
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS emotions (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                username TEXT NOT NULL,
                emotion TEXT NOT NULL,
                note TEXT,
                date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        ''')
        
        # 3. Tələbə məlumatları cədvəli (KUDS)
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS students (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                student_id TEXT UNIQUE NOT NULL,
                major TEXT NOT NULL,
                semester INTEGER NOT NULL
            )
        ''')
        
        # 4. Fənlər cədvəli
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS courses (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                code TEXT UNIQUE NOT NULL,
                name TEXT NOT NULL,
                credits INTEGER NOT NULL
            )
        ''')
        
        # 5. Qiymətləndirmə cədvəli
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS grades (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                student_id INTEGER,
                course_id INTEGER,
                midterm REAL DEFAULT 0,
                final REAL DEFAULT 0,
                retake REAL DEFAULT NULL,
                total REAL DEFAULT 0,
                letter TEXT DEFAULT 'F',
                FOREIGN KEY(student_id) REFERENCES students(id),
                FOREIGN KEY(course_id) REFERENCES courses(id)
            )
        ''')

        # 6. Davamiyyət cədvəli
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS attendance (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                student_id INTEGER,
                course_id INTEGER,
                total_hours INTEGER NOT NULL,
                absent_hours INTEGER DEFAULT 0,
                FOREIGN KEY(student_id) REFERENCES students(id),
                FOREIGN KEY(course_id) REFERENCES courses(id)
            )
        ''')

        # --- Test Məlumatlarının (Seed Data) Yalnız Baza Boş Olduqda Əlavə Edilməsi ---
        check_students = cursor.execute("SELECT COUNT(*) as count FROM students").fetchone()
        if check_students['count'] == 0:
            # Tələbə qeydiyyatı
            cursor.execute(
                "INSERT INTO students (name, student_id, major, semester) VALUES (?, ?, ?, ?)",
                ('Əli', 'KU2026170', 'Computer Engineering', 3)
            )
            student_id = cursor.lastrowid
            
            # Fənlərin əlavə edilməsi
            courses_data = [
                ('MATH201', 'Mathematical Analysis', 6),
                ('PHYS201', 'Physics', 4),
                ('COMP101', 'Programming Fundamentals 1', 5),
                ('COMP102', 'Programming Fundamentals 2', 5)
            ]
            cursor.executemany("INSERT INTO courses (code, name, credits) VALUES (?, ?, ?)", courses_data)
            
            # Cari qiymət statusları
            grades_data = [
                (student_id, 1, 22.0, 18.0, None, 40.0, 'F'),  
                (student_id, 2, 25.0, 17.0, None, 42.0, 'F'),  
                (student_id, 3, 30.0, 11.0, None, 41.0, 'F'),  
                (student_id, 4, 0.0, 0.0, None, 0.0, 'FX')     
            ]
            cursor.executemany(
                "INSERT INTO grades (student_id, course_id, midterm, final, retake, total, letter) VALUES (?, ?, ?, ?, ?, ?, ?)",
                grades_data
            )

            # Davamiyyət verilənləri
            attendance_data = [
                (student_id, 1, 60, 4),
                (student_id, 2, 45, 6),
                (student_id, 3, 60, 2),
                (student_id, 4, 60, 0)
            ]
            cursor.executemany(
                "INSERT INTO attendance (student_id, course_id, total_hours, absent_hours) VALUES (?, ?, ?, ?)",
                attendance_data
            )

        conn.commit()
        conn.close()
    except Exception as e:
        print("Baza başladılarkən kritik xəta:", e)

# Verilənlər bazasını tək bir funksiya ilə yaradırıq
init_db()


# --- AUTENTIFİKASIYA API ENDPOINTS ---

@app.route('/api/signup', methods=['POST'])
def signup():
    """
    Yeni istifadəçi qeydiyyatı (Username + Email + Password)
    ---
    tags:
      - Autentifikasiya
    parameters:
      - name: body
        in: body
        required: true
        schema:
          type: object
          properties:
            username:
              type: string
              example: alik_user
            email:
              type: string
              example: alik@example.com
            password:
              type: string
              example: secret123
    responses:
      201:
        description: Qeydiyyat uğurla tamamlandı
      400:
        description: Xəta baş verdi
    """
    data = request.get_json()
    username = data.get('username')
    email = data.get('email')
    password = data.get('password')
    
    if not username or not email or not password:
        return jsonify({"success": False, "error": "Məlumatlar tam daxil edilmədi"}), 400
        
    hashed_password = generate_password_hash(password)
    
    try:
        conn = get_db_connection()
        conn.execute("INSERT INTO users (username, email, password) VALUES (?, ?, ?)", (username, email, hashed_password))
        conn.commit()
        conn.close()
        return jsonify({"success": True, "message": "Qeydiyyat uğurla tamamlandı"}), 201
    except Exception as e:
        print("\n❌ [BAZADA REAL XƏTA]:", str(e), "\n")
        return jsonify({"success": False, "error": "Bu istifadəçi adı və ya e-poçt ünvanı artıq mövcuddur!"}), 400


@app.route('/api/login', methods=['POST'])
def login():
    """
    İstifadəçi girişi (Email + Password ilə)
    ---
    tags:
      - Autentifikasiya
    parameters:
      - name: body
        in: body
        required: true
        schema:
          type: object
          properties:
            email:
              type: string
              example: alik@example.com
            password:
              type: string
              example: secret123
    responses:
      200:
        description: Giriş uğurludur
      401:
        description: Yanlış e-poçt və ya şifrə
    """
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    
    if not email or not password:
        return jsonify({"success": False, "error": "E-poçt və şifrə daxil edilməlidir"}), 400
        
    conn = get_db_connection()
    user = conn.execute("SELECT * FROM users WHERE email = ?", (email,)).fetchone()
    conn.close()
    
    if user and check_password_hash(user['password'], password):
        # Dashboard interfeysində adı göstərə bilmək üçün geriyə yenə də username-i ötürürük
        return jsonify({
            "success": True, 
            "message": "Giriş uğurludur", 
            "username": user['username']
        }), 200
    else:
        return jsonify({"success": False, "error": "Yanlış e-poçt və ya şifrə"}), 401


# --- EMOSİYA SİSTEMİ API ENDPOINTS ---

@app.route('/api/emotions', methods=['POST'])
def add_emotion():
    """
    Yeni emosiya qeyd etmək
    ---
    tags:
      - Emosiyalar
    parameters:
      - name: body
        in: body
        required: true
        schema:
          type: object
          properties:
            username:
              type: string
              example: alik_user
            emotion:
              type: string
              example: Xoşbəxt
            note:
              type: string
              example: Bu gün hər şey əla keçdi!
    responses:
      201:
        description: Emosiya uğurla qeyd edildi
      400:
        description: Məlumatlar əskikdir
    """
    data = request.get_json()
    username = data.get('username')
    emotion = data.get('emotion')
    note = data.get('note', '')

    if not username or not emotion:
        return jsonify({"success": False, "error": "İstifadəçi adı və emosiya qeyd olunmalıdır"}), 400

    try:
        conn = get_db_connection()
        conn.execute("INSERT INTO emotions (username, emotion, note) VALUES (?, ?, ?)", (username, emotion, note))
        conn.commit()
        conn.close()
        return jsonify({"success": True, "message": "Emosiya uğurla qeyd edildi"}), 201
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 400


@app.route('/api/emotions/<username>', methods=['GET'])
def get_emotions(username):
    """
    İstifadəçinin emosiya tarixçəsini əldə etmək
    ---
    tags:
      - Emosiyalar
    parameters:
      - name: username
        in: path
        type: string
        required: true
        description: İstifadəçi adı
    responses:
      200:
        description: Emosiyalar siyahısı uğurla qaytarıldı
    """
    try:
        conn = get_db_connection()
        emotions = conn.execute("SELECT * FROM emotions WHERE username = ? ORDER BY date DESC", (username,)).fetchall()
        conn.close()
        
        result = [dict(row) for row in emotions]
        return jsonify({"success": True, "emotions": result}), 200
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 400


# --- KUDS AKADEMİK API ENDPOINTS ---

@app.route('/api/profile', methods=['GET'])
def get_profile():
    """Tələbənin profil məlumatlarını qaytarır"""
    conn = get_db_connection()
    student = conn.execute('SELECT * FROM students LIMIT 1').fetchone()
    conn.close()
    
    if student:
        return jsonify(dict(student)), 200
    return jsonify({"error": "Tələbə tapılmadı"}), 404


@app.route('/api/dashboard/stats', methods=['GET'])
def get_dashboard_stats():
    """Dashboard-un yuxarı paneli üçün ümumi statistik göstəricilər"""
    conn = get_db_connection()
    
    failed_courses = conn.execute(
        "SELECT COUNT(*) as count FROM grades WHERE letter = 'F' OR letter = 'FX'"
    ).fetchone()['count']
    
    total_credits = conn.execute("SELECT SUM(credits) as total FROM courses").fetchone()['total']
    
    attendance = conn.execute("SELECT SUM(total_hours) as total, SUM(absent_hours) as absent FROM attendance").fetchone()
    att_percentage = 100.0
    if attendance['total'] and attendance['total'] > 0:
        att_percentage = round(((attendance['total'] - attendance['absent']) / attendance['total']) * 100, 1)

    conn.close()
    
    return jsonify({
        "outstanding_retakes": failed_courses,
        "total_credits": total_credits,
        "attendance_rate": f"{att_percentage}%",
        "academic_status": "Aktiv (Yoxlama Dövrü)"
    }), 200


@app.route('/api/grades', methods=['GET'])
def get_grades():
    """Fənlər, kreditlər və cari qiymət ballarının siyahısı"""
    conn = get_db_connection()
    query = '''
        SELECT c.code, c.name, c.credits, g.midterm, g.final, g.retake, g.total, g.letter
        FROM grades g
        JOIN courses c ON g.course_id = c.id
    '''
    grades = conn.execute(query).fetchall()
    conn.close()
    
    return jsonify([dict(row) for row in grades]), 200


@app.route('/api/attendance', methods=['GET'])
def get_attendance():
    """Fənlər üzrə limitlər və qayıb saatları"""
    conn = get_db_connection()
    query = '''
        SELECT c.name as course_name, a.total_hours, a.absent_hours,
               ROUND(((a.absent_hours * 1.0) / a.total_hours) * 100, 1) as limit_percentage
        FROM attendance a
        JOIN courses c ON a.course_id = c.id
    '''
    attendance_records = conn.execute(query).fetchall()
    conn.close()
    
    return jsonify([dict(row) for row in attendance_records]), 200


@app.route('/api/grades/update-retake', methods=['POST'])
def update_retake_grade():
    """Kəsr imtahanı (retake) nəticəsi daxil edildikdə ümumi balı yeniləyən funksional sonluq"""
    data = request.get_json()
    course_code = data.get('course_code')
    retake_score = data.get('retake_score')
    
    if not course_code or retake_score is None:
        return jsonify({"error": "Eksik məlumat daxil edilib"}), 400
        
    conn = get_db_connection()
    course = conn.execute('SELECT id FROM courses WHERE code = ?', (course_code,)).fetchone()
    
    if not course:
        conn.close()
        return jsonify({"error": "Fənn tapılmadı"}), 404
        
    grade_entry = conn.execute('SELECT midterm FROM grades WHERE course_id = ?', (course['id'],)).fetchone()
    new_total = grade_entry['midterm'] + float(retake_score)
    new_letter = 'S' if new_total >= 51 else 'F' 
    
    conn.execute('''
        UPDATE grades 
        SET retake = ?, total = ?, letter = ? 
        WHERE course_id = ?
    ''', (retake_score, new_total, new_letter, course['id']))
    
    conn.commit()
    conn.close()
    
    return jsonify({"success": True, "new_total": new_total, "letter": new_letter}), 200


if __name__ == '__main__':
    app.run(debug=True, port=5000)
from flask import Flask, request, jsonify
from flask_cors import CORS
import sqlite3
from datetime import datetime

app = Flask(__name__)
CORS(app)  # Frontend ilə backend arasındakı CORS bloklanmasının qarşısını almaq üçün

DB_NAME = "emotion_app.db"

# 🛠️ VERİLƏNLƏR BAZASININ YARADILMASI
def init_db():
    conn = sqlite3.connect(DB_NAME)
    cursor = conn.cursor()
    # Analiz tarixçəsini saxlamaq üçün cədvəl yaradırıq
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS mood_history (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT,
            text TEXT,
            emotion TEXT,
            color TEXT,
            advice TEXT,
            timestamp TEXT
        )
    ''')
    conn.commit()
    conn.close()

# Server hər dəfə başlayanda bazanı yoxla/yarat
init_db()

# 🧠 1. DUYĞU ANALİZİ VƏ BAZAYA YAZILMA ENDPOINT-İ
@app.route('/api/analyze', methods=['POST'])
def analyze_emotion():
    data = request.get_json()
    text = data.get('text', '')
    username = data.get('username', 'Tələbə')  # Frontenddən gələn tələbə adı

    if not text.strip():
        return jsonify({"message": "Mətn boş ola bilməz!"}), 400

    text_lower = text.lower()
    
    # Yeni "Stealth" dizayn rənglərimizə uyğunlaşdırılmış duyğu təyini
    if any(word in text_lower for word in ["əla", "xoşbəxt", "yaxşı", "super", "uğurlu", "sevin"]):
        emotion = "Müsbət (Positive) 😊"
        color = "#34d399"  # Yumşaq zümrüd yaşılı
        advice = "Hər şey əla gedir! Bu enerjini qoru və ətrafındakılarla bölüş."
    elif any(word in text_lower for word in ["zəif", "pis", "yorğun", "çətin", "kədər", "stres"]):
        emotion = "Mənfi (Negative) 😢"
        color = "#cf6679"  # Yumşaq qırmızı-çəhrayı
        advice = "Görünür, bir az yorulmusunuz. Unutmayın, bu bir marafondur. Bir az fasilə verin."
    else:
        emotion = "Neytral (Neutral) 😐"
        color = "#bb86fc"  # Bənövşəyi
        advice = "Stabil və balanslı bir gün. Dərslərə və layihəyə eyni tempdə davam!"

    timestamp = datetime.now().strftime("%d.%m.%Y %H:%M")

    # 💾 Məlumatları SQLite bazasına yazırıq
    try:
        conn = sqlite3.connect(DB_NAME)
        cursor = conn.cursor()
        cursor.execute('''
            INSERT INTO mood_history (username, text, emotion, color, advice, timestamp)
            VALUES (?, ?, ?, ?, ?, ?)
        ''', (username, text, emotion, color, advice, timestamp))
        conn.commit()
        conn.close()
    except Exception as e:
        return jsonify({"message": f"Verilənlər bazasına yazılanda xəta oldu: {str(e)}"}), 500

    return jsonify({
        "status": "success",
        "emotion": emotion,
        "color": color,
        "advice": advice,
        "date": timestamp
    }), 200

# 📜 2. BAZADAN TARİXÇƏNİ OXUMAQ ÜÇÜN YENİ ENDPOINT
@app.route('/api/history', methods=['GET'])
def get_history():
    username = request.args.get('username', 'Tələbə')
    try:
        conn = sqlite3.connect(DB_NAME)
        cursor = conn.cursor()
        # Ən son edilən analizlər ən üstdə gəlsin deyə ORDER BY id DESC edirik
        cursor.execute('''
            SELECT text, emotion, color, advice, timestamp 
            FROM mood_history 
            WHERE username = ?
            ORDER BY id DESC
        ''', (username,))
        rows = cursor.fetchall()
        conn.close()

        # Baza sətirlərini JSON formatına salırıq
        history_list = []
        for row in rows:
            history_list.append({
                "text": row[0],
                "emotion": row[1],
                "color": row[2],
                "advice": row[3],
                "date": row[4]
            })
        return jsonify(history_list), 200
    except Exception as e:
        return jsonify({"message": f"Tarixçə bazadan oxunarkən xəta oldu: {str(e)}"}), 500

if __name__ == '__main__':
    # Portu sənin sisteminə uyğun olaraq 5050 qoyduq
    app.run(debug=True, port=5050)
"""
KU-Emotion Backend API
Bu modul layihənin əsas Flask serverini və Swagger sənədləşməsini işlədir.
Müəllif: Ali Hasanov
Tarix: 2026
"""
from flask import Flask, request, jsonify
from flask_cors import CORS
from flasgger import Swagger

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*"}}) # Frontend inteqrasiyası üçün CORS xətalarının qarşısını alır

# Swagger Konfiqurasiyası
app.config['SWAGGER'] = {
    'title': 'Karabakh University E-MOTION API',
    'uiversion': 3
}
swagger = Swagger(app)

# MVP üçün müvəqqəti istifadəçi siyahısı (Verilənlər bazası əvəzi)
users_db = []

@app.route('/api/auth/signup', methods=['POST'])
@app.route('/api/register', methods=['POST']) # Frontend ilə tam uyğunluq üçün əlavə olundu
def signup():
    """
    Yeni istifadəçi qeydiyyatı (Sign Up)
    ---
    tags:
      - Authentication
    parameters:
      - name: body
        in: body
        required: true
        schema:
          type: object
          required:
            - name
            - email
            - password
          properties:
            name:
              type: string
              example: "Aylin Əliyeva"
            email:
              type: string
              example: "aylin.aliyeva@karabakh.edu.az"
            password:
              type: string
              example: "P@ssword123"
    responses:
      21:
        description: İstifadəçi uğurla qeydiyyatdan keçdi.
      400:
        description: Məlumatlar eksik və ya e-poçt artıq mövcuddur.
    """
    data = request.get_json()
    name = data.get('name')
    email = data.get('email')
    password = data.get('password')

    if not name or not email or not password:
        return jsonify({"message": "Bütün xanaları doldurun."}), 400

    # İstifadəçi yoxlaması
    for user in users_db:
        if user['email'] == email:
            return jsonify({"message": "Bu e-poçt artıq qeydiyyatdan keçib."}), 400

    new_user = {"id": len(users_db) + 1, "name": name, "email": email, "password": password}
    users_db.append(new_user)

    return jsonify({"success": True, "message": "Qeydiyyat tamamlandı.", "user": {"id": new_user['id'], "name": name, "email": email}}), 201


@app.route('/api/auth/login', methods=['POST'])
@app.route('/api/login', methods=['POST'])
def login():
    """
    İstifadəçi girişi (Login)
    ---
    tags:
      - Authentication
    parameters:
      - name: body
        in: body
        required: true
        schema:
          type: object
          required:
            - email
            - password
          properties:
            email:
              type: string
              example: "aylin.aliyeva@karabakh.edu.az"
            password:
              type: string
              example: "P@ssword123"
    responses:
      200:
        description: Giriş uğurludur.
      401:
        description: Yanlış e-poçt və ya şifrə.
    """
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    # 1. Yeni qeydiyyatdan keçən dinamik istifadəçiləri yoxlayırıq
    for user in users_db:
        if user['email'] == email and user['password'] == password:
            return jsonify({
                "success": True,
                "token": "mock-python-jwt-token-dynamic",
                "user": {"name": user['name'], "email": email, "role": "Student"}
            }), 200

    # 2. MVP yoxlaması üçün statik tələbə məlumatı (Zəmanət variantı)
    if email == "aylin.aliyeva@karabakh.edu.az" and password == "P@ssword123":
        return jsonify({
            "success": True,
            "token": "mock-python-jwt-token",
            "user": {"name": "Aylin Əliyeva", "email": email, "role": "Student"}
        }), 200

    return jsonify({"message": "E-poçt və ya şifrə yanlışdır."}), 401
    

@app.route('/api/analyze', methods=['POST'])
def analyze_emotion():
    data = request.get_json()
    text = data.get('text', '')

    if not text.strip():
        return jsonify({"message": "Mətn boş ola bilməz!"}), 400

    text_lower = text.lower()
    
    if any(word in text_lower for word in ["əla", "xoşbəxt", "yaxşı", "super", "uğurlu", "sevin"]):
        emotion = "Müsbət (Positive) 😊"
        color = "#03dac6" # Yaşılımtıl-mavi
        advice = "Hər şey əla gedir! Bu enerjini qoru və komanda yoldaşlarınla bölüş."
    elif any(word in text_lower for word in ["zəif", "pis", "yorğun", "çətin", "kədər", "stres"]):
        emotion = "Mənfi (Negative) 😢"
        color = "#cf6679" # Açıq qırmızı/çəhrayı
        advice = "Görünür, bir az yorulmusunuz. Unutmayın, Holberton final layihəsi bir marafondur. Bir az fasilə verin."
    else:
        emotion = "Neytral (Neutral) 😐"
        color = "#bb86fc" # Bənövşəyi
        advice = "Stabil və balanslı bir gün. Dərslərə və layihəyə eyni tempdə davam!"

    return jsonify({
        "status": "success",
        "emotion": emotion,
        "color": color,
        "advice": advice
    }), 200

if __name__ == '__main__':
    # host '127.0.0.1' və use_reloader=False Arch Linux/CachyOS mühitində ən stabil formadır
    app.run(host='127.0.0.1', port=5050, debug=True, use_reloader=False)
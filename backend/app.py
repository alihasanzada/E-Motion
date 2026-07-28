from flask import Flask, request, jsonify
from flask_cors import CORS
from flasgger import Swagger

app = Flask(__name__)
CORS(app) # Frontend inteqrasiyası üçün CORS xətalarının qarşısını alır

# Swagger Konfiqurasiyası
app.config['SWAGGER'] = {
    'title': 'Karabakh University E-MOTION API',
    'uiversion': 3
}
swagger = Swagger(app)

# MVP üçün müvəqqəti istifadəçi siyahısı (Verilənlər bazası əvəzi)
users_db = []

@app.route('/api/auth/signup', methods=['POST'])
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

    # MVP yoxlaması üçün statik tələbə məlumatı
    if email == "aylin.aliyeva@karabakh.edu.az" and password == "P@ssword123":
        return jsonify({
            "success": True,
            "token": "mock-python-jwt-token",
            "user": {"name": "Aylin Əliyeva", "email": email, "role": "Student"}
        }), 200

    return jsonify({"message": "E-poçt və ya şifrə yanlışdır."}), 401


if __name__ == '__main__':
    # Serveri 5000 portunda başladırıq
    print("🚀 Python Flask Serveri aktivdir!")
    print("📄 Swagger sənədləşməsi ünvanı: http://127.0.0.1:5000/apidocs/")
    app.run(debug=True, port=5000)
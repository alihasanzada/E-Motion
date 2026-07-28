document.addEventListener('DOMContentLoaded', () => {
    const loginBox = document.getElementById('login-box');
    const registerBox = document.getElementById('register-box');
    const toLoginLink = document.getElementById('to-login');
    const toRegisterLink = document.getElementById('to-register');

    // Backend API URL (Bayaq Flask serverinin başladığı ünvan)
    const API_BASE_URL = 'http://127.0.0.1:5050/api';
    // --- EKRANLAR ARASI KEÇİD MƏNTİQİ ---
    toLoginLink.addEventListener('click', (e) => {
        e.preventDefault();
        registerBox.style.display = 'none';
        loginBox.style.display = 'block';
    });

    toRegisterLink.addEventListener('click', (e) => {
        e.preventDefault();
        loginBox.style.display = 'none';
        registerBox.style.display = 'block';
    });

    // --- QEYDİYYAT (REGISTER) API SORĞUSU ---
    const registerForm = document.getElementById('register-form');
    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const username = document.getElementById('reg-username').value;
        const email = document.getElementById('reg-email').value;
        const password = document.getElementById('reg-password').value;

        // DIQQƏT: Brauzer konsolunda göndərilən datanı görmək üçün bu sətri əlavə etdik
        console.log("Backend-ə göndərilən data:", { username, email, password });

        try {
            const response = await fetch(`${API_BASE_URL}/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name: username, email, password })
            });

            const data = await response.json();

            if (response.ok) {
                alert(`Uğurlu: ${data.message}\nİndi daxil ola bilərsiniz.`);
                registerForm.reset();
                // Avtomatik Giriş ekranına yönləndiririk
                registerBox.style.display = 'none';
                loginBox.style.display = 'block';
            } else {
                alert(`Xəta: ${data.message || 'Qeydiyyat baş tutmadı.'}`);
            }
        } catch (error) {
            console.error('Sorğu xətası:', error);
            alert('Backend serverinə qoşulmaq mümkün olmadı. Serverin aktiv olduğundan əmin olun.');
        }
    });

    // --- GİRİŞ (LOGIN) API SORĞUSU ---
    const loginForm = document.getElementById('login-form');
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;

        try {
            const response = await fetch(`${API_BASE_URL}/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (response.ok) {
                alert(`Xoş gəldiniz! Token: ${data.token}`);
                loginForm.reset();
                // Bura gələcəkdə istifadəçinin yönləndiriləcəyi əsas səhifə (Dashboard) linki gələcək
            } else {
                alert(`Xəta: ${data.message || 'Giriş uğursuz oldu.'}`);
            }
        } catch (error) {
            console.error('Sorğu xətası:', error);
            alert('Backend serverinə qoşulmaq mümkün olmadı. Serverin aktiv olduğundan əmin olun.');
        }
    });
});
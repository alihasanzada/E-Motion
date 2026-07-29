document.addEventListener('DOMContentLoaded', () => {
    const loginBox = document.getElementById('login-box');
    const registerBox = document.getElementById('register-box');
    const toLoginLink = document.getElementById('to-login');
    const toRegisterLink = document.getElementById('to-register');

    // Backend API URL
    const API_BASE_URL = 'http://127.0.0.1:5000/api';

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

    // --- QEYDİYYAT (REGISTER/SIGNUP) API SORĞUSU ---
    const registerForm = document.getElementById('register-form');
    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const username = document.getElementById('reg-username').value;
        const password = document.getElementById('reg-password').value;

        try {
            const response = await fetch(`${API_BASE_URL}/signup`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, password })
            });

            const data = await response.json();

            if (response.ok && data.success) {
                alert(`Uğurlu: ${data.message}\nİndi daxil ola bilərsiniz.`);
                registerForm.reset();
                registerBox.style.display = 'none';
                loginBox.style.display = 'block';
            } else {
                alert(`Xəta: ${data.error || 'Qeydiyyat baş tutmadı.'}`);
            }
        } catch (error) {
            console.error('Sorğu xətası:', error);
            alert('Backend serverinə qoşulmaq mümkün olmadı.');
        }
    });

    // --- GİRİŞ (LOGIN) API SORĞUSU ---
    const loginForm = document.getElementById('login-form');
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Burada ID 'login-username' olaraq yeniləndi
        const username = document.getElementById('login-username').value;
        const password = document.getElementById('login-password').value;

        try {
            const response = await fetch(`${API_BASE_URL}/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, password })
            });

            const data = await response.json();

            if (response.ok && data.success) {
                localStorage.setItem('userData', JSON.stringify({ name: data.username }));
                loginForm.reset();
                window.location.href = 'dashboard.html';
            } else {
                alert(`Xəta: ${data.error || 'Giriş uğursuz oldu.'}`);
            }
        } catch (error) {
            console.error('Sorğu xətası:', error);
            alert('Backend serverinə qoşulmaq mümkün olmadı.');
        }
    });
});
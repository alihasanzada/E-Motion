document.addEventListener('DOMContentLoaded', () => {
    const loginBox = document.getElementById('login-box');
    const signupBox = document.getElementById('signup-box');
    const toLoginLink = document.getElementById('to-login');
    const toSignupLink = document.getElementById('to-signup');

    // Backend API URL
    const API_BASE_URL = 'http://127.0.0.1:5000/api';

    if (toLoginLink) {
        toLoginLink.addEventListener('click', (e) => {
            e.preventDefault();
            if (signupBox && loginBox) {
                signupBox.style.display = 'none';
                loginBox.style.display = 'block';
            }
        });
    }

    if (toSignupLink) {
        toSignupLink.addEventListener('click', (e) => {
            e.preventDefault();
            if (loginBox && signupBox) {
                loginBox.style.display = 'none';
                signupBox.style.display = 'block';
            }
        });
    }

    // --- QEYDİYYAT (REGISTER/SIGNUP) API SORĞUSU ---
    const signupForm = document.getElementById('signup-form');
    if (signupForm) {
        signupForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const username = document.getElementById('signup-username').value;
            const email = document.getElementById('signup-email').value;
            const password = document.getElementById('signup-password').value;

            try {
                const response = await fetch(`${API_BASE_URL}/signup`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username, email, password })
                });
                const data = await response.json();
                
                if (data.success) {
                    signupForm.reset();
                    
                    if (signupBox && loginBox) {
                        signupBox.style.display = 'none';
                        loginBox.style.display = 'block';
                    }
                } else {
                    alert('Xəta: ' + data.error); // Uğursuz cəhdlərdə xətanı görmək üçün bu qalmalıdır
                }
            } catch (error) {
                console.error('Xəta:', error);
                alert('Serverə qoşulmaq mümkün olmadı.');
            }
        });
    }

    // --- GİRİŞ (LOGIN) API SORĞUSU ---
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('login-email').value;
            const password = document.getElementById('login-password').value;

            try {
                const response = await fetch(`${API_BASE_URL}/login`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password })
                });
                const data = await response.json();
                
                if (data.success) {
                    // Backend-dən gələn username-i götürüb localStorage-a yazırıq
                    localStorage.setItem('userData', JSON.stringify({ name: data.username }));
                    loginForm.reset();
                    window.location.href = 'dashboard.html';
                } else {
                    alert('Xəta: ' + data.error);
                }
            } catch (error) {
                console.error('Xəta:', error);
                alert('Backend serverinə qoşulmaq mümkün olmadı.');
            }
        });
    }
});
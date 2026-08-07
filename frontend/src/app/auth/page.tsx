'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AuthPage() {
  const router = useRouter();

  // Ekranlar arası keçid state-i: 'login' və ya 'signup'
  const [view, setView] = useState<'login' | 'signup'>('signup');
  const [loading, setLoading] = useState<boolean>(false);

  // Form dataları üçün state-lər
  const [username, setUsername] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://e-motion-7vds.onrender.com';
  // Qeydiyyat (Register) Funksiyası
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: username, email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        alert(`Uğurlu: ${data.message}\nİndi daxil ola bilərsiniz.`);
        // Qeydiyyatdan sonra form sahələrini sıfırlayırıq, amma emaili saxlayırıq ki logində rahat yazasan
        setPassword('');
        setView('login'); // Avtomatik giriş ekranına keçid
      } else {
        alert(`Xəta: ${data.message || 'Qeydiyyat baş tutmadı.'}`);
      }
    } catch (error) {
      console.error('Sorğu xətası:', error);
      alert('Backend serverinə qoşulmaq mümkün olmadı.');
    } finally {
      setLoading(false);
    }
  };

  // Giriş (Login) Funksiyası
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        if (typeof window !== 'undefined') {
          localStorage.setItem('userToken', data.token);

          // Backend-dən gələn istifadəçi adını götürürük
          const fullNameFromBackend = data.user?.name || data.name || "Əli Həsənov";

          // Dashboard-dakı state strukturuna tam uyğun obyekt yaradırıq
          const userData = {
            fullname: fullNameFromBackend,
            major: "Kompüter Mühəndisliyi",
            course: 1,
            username: fullNameFromBackend // Bura qeydiyyatdakı ad oturacaq
          };

          // Dashboard-un oxuduğu eyni açarla ('user') yaddaşa yazırıq
          localStorage.setItem('user', JSON.stringify(userData));
        }

        router.push('/');
      } else {
        alert(`Xəta: ${data.message || 'Giriş uğursuz oldu.'}`);
      }
    } catch (error) {
      console.error('Sorğu xətası:', error);
      alert('Backend serverinə qoşulmaq mümkün olmadı.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={styles.body}>
      {/* Brauzer səviyyəsində 0ms gecikmə ilə yönləndirmə skripti */}
      <script
        dangerouslySetInnerHTML={{
          __html: `
            if (typeof window !== 'undefined' && localStorage.getItem('userToken')) {
              window.location.href = '/';
            }
          `,
        }}
      />

      <div style={styles.authContainer}>

        {/* QEYDİYYAT FORMU (SIGNUP) */}
        {view === 'signup' && (
          <div style={styles.formBox}>
            <h2 style={styles.heading}>Hesab Yarat</h2>
            <form onSubmit={handleRegister}>
              <input
                type="text"
                placeholder="Adınız və soyadınız"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                style={styles.input}
              />
              <input
                type="email"
                placeholder="E-poçt ünvanınız"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={styles.input}
              />
              <input
                type="password"
                placeholder="Şifrəniz"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={styles.input}
              />
              <button type="submit" disabled={loading} style={styles.button}>
                {loading ? 'Yüklənir...' : 'Qeydiyyatdan Keç'}
              </button>
            </form>
            <p style={styles.text}>
              Artıq hesabınız var?{' '}
              <span onClick={() => setView('login')} style={styles.link}>
                Daxil olun
              </span>
            </p>
          </div>
        )}

        {/* GİRİŞ FORMU (LOGIN) */}
        {view === 'login' && (
          <div style={styles.formBox}>
            <h2 style={styles.heading}>Daxil Ol</h2>
            <form onSubmit={handleLogin}>
              <input
                type="email"
                placeholder="E-poçt ünvanınız"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={styles.input}
              />
              <input
                type="password"
                placeholder="Şifrəniz"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={styles.input}
              />
              <button type="submit" disabled={loading} style={styles.button}>
                {loading ? 'Yüklənir...' : 'Giriş Et'}
              </button>
            </form>
            <p style={styles.text}>
              Hesabınız yoxdur?{' '}
              <span onClick={() => setView('signup')} style={styles.link}>
                Qeydiyyatdan keçin
              </span>
            </p>
          </div>
        )}

      </div>
    </main>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  body: {
    backgroundColor: '#0a0a0c',
    color: '#ffffff',
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  authContainer: {
    width: '100%',
    maxWidth: '400px',
    padding: '20px',
    zIndex: 2,
  },
  formBox: {
    backgroundColor: '#121216',
    border: '1px solid #2a2a35',
    borderRadius: '12px',
    padding: '40px 30px',
    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.5)',
  },
  heading: {
    fontSize: '24px',
    fontWeight: 600,
    marginBottom: '25px',
    textAlign: 'center',
    letterSpacing: '0.5px',
  },
  input: {
    width: '100%',
    padding: '12px 16px',
    backgroundColor: '#1a1a22',
    border: '1px solid #2a2a35',
    borderRadius: '8px',
    color: '#ffffff',
    fontSize: '15px',
    marginBottom: '16px',
    outline: 'none',
  },
  button: {
    width: '100%',
    padding: '14px',
    backgroundColor: '#00ff66',
    color: '#000000',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: 600,
    cursor: 'pointer',
    marginTop: '10px',
  },
  text: {
    color: '#88889b',
    fontSize: '14px',
    marginTop: '20px',
    textAlign: 'center',
  },
  link: {
    color: '#00ff66',
    cursor: 'pointer',
    fontWeight: 500,
    textDecoration: 'none',
  },
};
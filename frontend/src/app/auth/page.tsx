'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AuthPage() {
  const router = useRouter();

  const [view, setView] = useState<'login' | 'signup'>('signup');
  const [loading, setLoading] = useState<boolean>(false);

  const [username, setUsername] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://e-motion-7vds.onrender.com';

  useEffect(() => {
    if (typeof window !== 'undefined' && localStorage.getItem('userToken')) {
      router.push('/');
    }
  }, [router]);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.toLowerCase().endsWith('@qu.edu.az')) {
      alert("Xəta: Qeydiyyat üçün yalnız @qu.edu.az domeninə malik tələbə e-poçtundan istifadə edə bilərsiniz.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: username, email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setPassword('');
        setView('login');
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

          const fullNameFromBackend = data.user?.name || data.name || username || "Tələbə";

          const userData = {
            fullname: fullNameFromBackend,
            major: "Kompüter Mühəndisliyi",
            course: 1,
            username: fullNameFromBackend,
            email: email
          };
          localStorage.setItem('user', JSON.stringify(userData));

          // Yeni istifadəçi üçün ilkin göstəriciləri 0 olaraq sıfırlayırıq
          if (!localStorage.getItem('user_steps')) localStorage.setItem('user_steps', '0');
          if (!localStorage.getItem('user_water_ml')) localStorage.setItem('user_water_ml', '0');
          if (!localStorage.getItem('user_water_glasses')) localStorage.setItem('user_water_glasses', '0');
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
      <div style={styles.authContainer}>

        {/* Qeydiyyat Formu */}
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
                placeholder="Tələbə e-poçtunuz (@qu.edu.az)"
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

        {/* Giriş Formu */}
        {view === 'login' && (
          <div style={styles.formBox}>
            <h2 style={styles.heading}>Daxil Ol</h2>
            <form onSubmit={handleLogin}>
              <input
                type="email"
                placeholder="Tələbə e-poçtunuz (@qu.edu.az)"
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
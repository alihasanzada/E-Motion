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
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const errorParam = urlParams.get('error');

      if (errorParam === 'not_qu_student') {
        alert("Giriş qadağandır!\n\nBu platformadan yalnız Qarabağ Universiteti tələbələri (@qu.edu.az e-poçtu ilə) daxil ola bilər.");
        window.history.replaceState({}, document.title, window.location.pathname);
        return;
      }

      const googleToken = urlParams.get('access_token') || urlParams.get('google_access_token');
      const userToken = urlParams.get('token') || urlParams.get('userToken');

      if (googleToken) {
        localStorage.setItem('google_access_token', googleToken);
      }

      if (userToken || googleToken) {
        localStorage.setItem('userToken', userToken || googleToken || 'google_logged_in');

        if (!localStorage.getItem('user')) {
          const userData = {
            fullname: "Əli Həsənov",
            major: "Kompüter Mühəndisliyi",
            course: 1,
            username: "Əli Həsənov"
          };
          localStorage.setItem('user', JSON.stringify(userData));
        }

        router.push('/');
      }
    }
  }, [router]);

  const handleGoogleLogin = () => {
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/callback/google`;

    const scopes = [
      "openid",
      "profile",
      "email",
      "https://www.googleapis.com/auth/fitness.activity.read"
    ].join(" ");

    const options = {
      client_id: clientId!,
      redirect_uri: redirectUri,
      response_type: "code",
      scope: scopes,
      access_type: "offline",
      prompt: "consent"
    };

    const qs = new URLSearchParams(options);
    window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?${qs.toString()}`;
  };

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
        alert(`Uğurlu: ${data.message}\nİndi daxil ola bilərsiniz.`);
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

          const fullNameFromBackend = data.user?.name || data.name || "Əli Həsənov";

          const userData = {
            fullname: fullNameFromBackend,
            major: "Kompüter Mühəndisliyi",
            course: 1,
            username: fullNameFromBackend
          };

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

        {/* Qeydiyyat Formu (Signup) */}
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

            <div style={styles.divider}>
              <span style={styles.dividerText}>və ya</span>
            </div>

            <button type="button" onClick={handleGoogleLogin} style={styles.googleButton}>
              <svg width="18" height="18" viewBox="0 0 24 24" style={{ marginRight: '10px' }}>
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              Google ilə davam et
            </button>

            <p style={styles.text}>
              Artıq hesabınız var?{' '}
              <span onClick={() => setView('login')} style={styles.link}>
                Daxil olun
              </span>
            </p>
          </div>
        )}

        {/* Giriş Formu (Login) */}
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

            <div style={styles.divider}>
              <span style={styles.dividerText}>və ya</span>
            </div>

            <button type="button" onClick={handleGoogleLogin} style={styles.googleButton}>
              <svg width="18" height="18" viewBox="0 0 24 24" style={{ marginRight: '10px' }}>
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              Google ilə daxil ol
            </button>

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
  divider: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '20px 0',
  },
  dividerText: {
    color: '#66667e',
    fontSize: '13px',
    textTransform: 'uppercase',
    letterSpacing: '1px',
  },
  googleButton: {
    width: '100%',
    padding: '12px',
    backgroundColor: '#1a1a22',
    color: '#ffffff',
    border: '1px solid #2a2a35',
    borderRadius: '8px',
    fontSize: '15px',
    fontWeight: 500,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'background-color 0.2s ease',
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
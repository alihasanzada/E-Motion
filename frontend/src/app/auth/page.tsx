'use client';

import { apiFetch, clearPrivateLocalData } from '@/utils/api';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff } from 'lucide-react';

export default function AuthPage() {
  const router = useRouter();

  const [view, setView] = useState<'login' | 'signup'>('signup');
  const [loading, setLoading] = useState<boolean>(false);

  const [username, setUsername] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const [showRegisterPassword, setShowRegisterPassword] = useState(false);
  const [showLoginPassword, setShowLoginPassword] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && localStorage.getItem('user')) {
      router.push('/');
    }
  }, [router]);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    const cleanEmail = email.trim();
    const cleanPassword = password.trim();

    if (!cleanEmail.toLowerCase().endsWith('@qu.edu.az')) {
      alert("Xəta: Qeydiyyat üçün yalnız @qu.edu.az domeninə malik tələbə e-poçtundan istifadə edə bilərsiniz.");
      return;
    }

    if (cleanPassword.length < 8) {
      alert("Xəta: Şifrə minimum 8 simvoldan ibarət olmalıdır!");
      return;
    }

    setLoading(true);

    try {
      const response = await apiFetch('/api/register', {
        method: 'POST',
        body: JSON.stringify({ name: username.trim(), email: cleanEmail, password: cleanPassword }),
      });

      const data = await response.json().catch(() => null);
      if (!data) {
        alert(`Serverdən düzgün cavab alınmadı (HTTP ${response.status}). Staging serverini yoxlayın və yenidən cəhd edin.`);
        return;
      }

      if (response.ok) {
        alert("Qeydiyyat uğurla tamamlandı! İndi daxil ola bilərsiniz.");
        setPassword('');
        setUsername('');
        setView('login');
      } else {
        alert(`Qeydiyyat baş tutmadı (HTTP ${response.status}): ${data.error || data.message || 'Server cavabı alınmadı.'}`);
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
      const response = await apiFetch('/api/login', {
        method: 'POST',
        body: JSON.stringify({ email: email.trim(), password: password.trim() }),
      });

      const data = await response.json().catch(() => null);
      if (!data) {
        alert(`Serverdən düzgün cavab alınmadı (HTTP ${response.status}). Staging serverini yoxlayın və yenidən cəhd edin.`);
        return;
      }

      if (response.ok) {
        // A successful password check does not guarantee the browser kept the
        // session cookie. Verify it BEFORE redirecting to the dashboard.
        const profileRes = await apiFetch('/api/user/profile', { cache: 'no-store' });
        if (!profileRes.ok) {
          throw new Error(`Giriş təsdiqləndi, amma sessiya yoxlanmadı (HTTP ${profileRes.status}). Saytı yeniləyib yenidən daxil olun.`);
        }
        const profile = await profileRes.json();
        const loggedInEmail = String(data.user?.email || '').trim().toLowerCase();
        const verifiedEmail = String(profile?.email || '').trim().toLowerCase();
        if (!verifiedEmail || verifiedEmail !== loggedInEmail) {
          throw new Error('Serverdə aktiv olan hesab yeni girişlə uyğun gəlmir. Saytı yeniləyib yenidən daxil olun.');
        }

        clearPrivateLocalData();
        localStorage.setItem('user', JSON.stringify({
          ...data.user,
          ...profile,
        }));
        router.replace('/');
      } else {
        if (response.status === 429) {
          alert('Çox sayda giriş cəhdi edildi (HTTP 429). Bir qədər gözləyib yenidən cəhd edin.');
        } else {
          alert(`Giriş uğursuz oldu (HTTP ${response.status}): ${data.error || data.message || 'Server cavabı alınmadı.'}`);
        }
      }
    } catch (error) {
      console.error('Login sorğusu xətası:', error);
      alert(error instanceof Error ? error.message : 'Backend serverinə qoşulmaq mümkün olmadı.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={styles.body}>
      <div style={styles.authContainer}>

        {/* Signup Form */}
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

              <div style={styles.passwordWrapper}>
                <input
                  type={showRegisterPassword ? "text" : "password"}
                  placeholder="Şifrəniz"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={styles.inputWithIcon}
                />
                <button
                  type="button"
                  onClick={() => setShowRegisterPassword(!showRegisterPassword)}
                  style={styles.eyeBtn}
                >
                  {showRegisterPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

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

        {/* Login Form */}
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

              <div style={styles.passwordWrapper}>
                <input
                  type={showLoginPassword ? "text" : "password"}
                  placeholder="Şifrəniz"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={styles.inputWithIcon}
                />
                <button
                  type="button"
                  onClick={() => setShowLoginPassword(!showLoginPassword)}
                  style={styles.eyeBtn}
                >
                  {showLoginPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

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
    boxSizing: 'border-box',
  },
  passwordWrapper: {
    position: 'relative',
    width: '100%',
    marginBottom: '16px',
  },
  inputWithIcon: {
    width: '100%',
    padding: '12px 42px 12px 16px',
    backgroundColor: '#1a1a22',
    border: '1px solid #2a2a35',
    borderRadius: '8px',
    color: '#ffffff',
    fontSize: '15px',
    outline: 'none',
    boxSizing: 'border-box',
  },
  eyeBtn: {
    position: 'absolute',
    right: '14px',
    top: '50%',
    transform: 'translateY(-50%)',
    background: 'none',
    border: 'none',
    color: '#88889b',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    padding: 0,
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
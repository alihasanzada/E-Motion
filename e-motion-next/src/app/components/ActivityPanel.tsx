'use client';

import React, { useState, useEffect } from 'react';

interface ActivityData {
  steps: number;
  water_ml: number;
}

export default function ActivityPanel() {
  const [activity, setActivity] = useState<ActivityData>({ steps: 0, water_ml: 0 });
  const [inputSteps, setInputSteps] = useState<string>('');
  const [inputWater, setInputWater] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const API_BASE_URL = 'http://127.0.0.1:5050/api/activity';

  // 1. Məlumatları Backend-dən Çəkmək (Read)
  useEffect(() => {
    fetch(API_BASE_URL)
      .then((res) => res.json())
      .then((data) => {
        setActivity({
          steps: data.steps || 0,
          water_ml: data.water_ml || 0,
        });
        setLoading(false);
      })
      .catch((err) => {
        console.error('Məlumat çəkilərkən xəta:', err);
        setLoading(false);
      });
  }, []);

  // 2. Yeni Məlumatları Yadda Saxlamaq (Create/Update)
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Form validasiyası
    if (!inputSteps && !inputWater) {
      setMessage({ type: 'error', text: 'Zəhmət olmasa ən azı bir sahəni doldurun.' });
      return;
    }

    setSubmitting(true);
    setMessage(null);

    // Əgər sahə boşdursa, köhnə dəyəri saxlayırıq
    const updatedSteps = inputSteps !== '' ? parseInt(inputSteps) : activity.steps;
    const updatedWater = inputWater !== '' ? parseInt(inputWater) : activity.water_ml;

    try {
      const response = await fetch(API_BASE_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          steps: updatedSteps,
          water_ml: updatedWater,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setActivity({ steps: updatedSteps, water_ml: updatedWater });
        setMessage({ type: 'success', text: 'Məlumatlar uğurla yeniləndi!' });
        setInputSteps('');
        setInputWater('');
      } else {
        setMessage({ type: 'error', text: data.message || 'Xəta baş verdi.' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Serverlə əlaqə qurulmadı.' });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div style={{ padding: '20px', color: '#fff' }}>Yüklənir...</div>;
  }

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Fiziki Aktivlik və Su İzləyicisi</h2>

      {/* Göstəricilər Paneli (Empty State / Data State) */}
      <div style={styles.grid}>
        <div style={styles.card}>
          <h3>🏃 Atılan Addım</h3>
          <p style={styles.value}>{activity.steps} <span style={styles.unit}>addım</span></p>
        </div>
        <div style={styles.card}>
          <h3>💧 İçilən Su</h3>
          <p style={styles.value}>{activity.water_ml} <span style={styles.unit}>ml</span></p>
        </div>
      </div>

      {/* Məlumat Giriş Formu */}
      <form onSubmit={handleUpdate} style={styles.form}>
        <h3 style={styles.formTitle}>Gündəlik Göstəriciləri Yenilə</h3>
        
        {message && (
          <div style={{
            ...styles.alert,
            backgroundColor: message.type === 'success' ? '#1b4332' : '#7209b7',
            borderColor: message.type === 'success' ? '#2d6a4f' : '#f72585'
          }}>
            {message.text}
          </div>
        )}

        <div style={styles.inputGroup}>
          <input
            type="number"
            placeholder="Yeni addım sayı (Məs: 5000)"
            value={inputSteps}
            onChange={(e) => setInputSteps(e.target.value)}
            style={styles.input}
            min="0"
          />
          <input
            type="number"
            placeholder="İçilən su (ml) (Məs: 500)"
            value={inputWater}
            onChange={(e) => setInputWater(e.target.value)}
            style={styles.input}
            min="0"
          />
        </div>

        <button type="submit" disabled={submitting} style={styles.button}>
          {submitting ? 'Yenilənir...' : 'Göstəriciləri Qeyd Et'}
        </button>
      </form>
    </div>
  );
}

// Sadə və Layihənin Vahid Dizaynına Uyğun Qara/Yaşıl Stil Strukturu
const styles: { [key: string]: React.CSSProperties } = {
  container: {
    padding: '20px',
    color: '#fff',
  },
  title: {
    fontSize: '24px',
    marginBottom: '20px',
    fontWeight: '600',
  },
  grid: {
    display: 'flex',
    gap: '20px',
    marginBottom: '30px',
    flexWrap: 'wrap',
  },
  card: {
    flex: '1',
    minWidth: '200px',
    background: '#1a1a1a',
    border: '1px solid #2e2e2e',
    padding: '20px',
    borderRadius: '12px',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
  },
  value: {
    fontSize: '32px',
    fontWeight: 'bold',
    marginTop: '10px',
    color: '#2d6a4f',
  },
  unit: {
    fontSize: '16px',
    fontWeight: 'normal',
    color: '#aaa',
  },
  form: {
    background: '#111',
    border: '1px solid #222',
    padding: '24px',
    borderRadius: '12px',
  },
  formTitle: {
    fontSize: '18px',
    marginBottom: '15px',
  },
  inputGroup: {
    display: 'flex',
    gap: '15px',
    marginBottom: '15px',
    flexWrap: 'wrap',
  },
  input: {
    flex: '1',
    minWidth: '200px',
    padding: '12px',
    borderRadius: '8px',
    border: '1px solid #333',
    background: '#1f1f1f',
    color: '#fff',
    outline: 'none',
  },
  button: {
    padding: '12px 24px',
    borderRadius: '8px',
    border: 'none',
    background: '#1b4332',
    color: '#fff',
    cursor: 'pointer',
    fontWeight: 'bold',
    transition: 'background 0.2s',
  },
  alert: {
    padding: '12px',
    borderRadius: '8px',
    border: '1px solid',
    marginBottom: '15px',
    fontSize: '14px',
  }
};
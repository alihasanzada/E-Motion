'use client';

import React, { useState, useEffect } from 'react';

interface MoodLog {
  id: number;
  mood: string;
  note: string;
  date: string;
}

export default function MentalPanel() {
  const [moodLogs, setMoodLogs] = useState<MoodLog[]>([]);
  const [selectedMood, setSelectedMood] = useState<string>('');
  const [note, setNote] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const API_BASE_URL = 'http://127.0.0.1:5050/api/moods';

  const moodOptions = [
    { emoji: '😊', label: 'Əla' },
    { emoji: '😐', label: 'Normal' },
    { emoji: '😴', label: 'Yorğun' },
    { emoji: '🤯', label: 'Stressli' },
    { emoji: '💪', label: 'Həvəsli' }
  ];

  // 1. Son mental qeydləri backend-dən çəkirik (Read)
  const fetchMoods = () => {
    fetch(API_BASE_URL)
      .then((res) => {
        if (!res.ok) throw new Error('Məlumatlar yüklənərkən xəta baş verdi.');
        return res.json();
      })
      .then((data) => {
        setMoodLogs(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchMoods();
  }, []);

  // 2. Yeni mental vəziyyət qeydini yadda saxlayırıq (Create)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMood) {
      setMessage({ type: 'error', text: 'Zəhmət olmasa, cari emosiyanızı seçin!' });
      return;
    }

    setSubmitting(true);
    setMessage(null);

    try {
      const response = await fetch(API_BASE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mood: selectedMood, note }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ type: 'success', text: 'Mental vəziyyətiniz qeyd olundu.' });
        setSelectedMood('');
        setNote('');
        fetchMoods(); // Siyahını yeniləyirik
      } else {
        setMessage({ type: 'error', text: data.message || 'Xəta baş verdi.' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Serverlə əlaqə qurulmadı.' });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div style={{ padding: '20px', color: '#fff' }}>Yüklənir...</div>;

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Mental Sağlamlıq Gündəliyi</h2>

      <div style={styles.mainGrid}>
        {/* Form Hissəsi */}
        <form onSubmit={handleSubmit} style={styles.form}>
          <h3 style={styles.sectionTitle}>Özünüzü necə hiss edirsiniz?</h3>
          
          {message && (
            <div style={{
              ...styles.alert,
              backgroundColor: message.type === 'success' ? '#1b4332' : '#5c0d11',
              borderColor: message.type === 'success' ? '#2d6a4f' : '#800f14'
            }}>
              {message.text}
            </div>
          )}

          {/* Emosiya Seçimi */}
          <div style={styles.moodSelector}>
            {moodOptions.map((option) => (
              <button
                type="button"
                key={option.label}
                onClick={() => setSelectedMood(option.label)}
                style={{
                  ...styles.moodButton,
                  backgroundColor: selectedMood === option.label ? '#2d6a4f' : '#1f1f1f',
                  borderColor: selectedMood === option.label ? '#52b788' : '#333'
                }}
              >
                <span style={{ fontSize: '24px' }}>{option.emoji}</span>
                <span style={{ fontSize: '12px', marginTop: '4px' }}>{option.label}</span>
              </button>
            ))}
          </div>

          {/* Qeyd Sahəsi */}
          <div style={{ marginTop: '20px' }}>
            <textarea
              placeholder="Ağlınızdan nələr keçir? Qısaca qeyd edin..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              style={styles.textarea}
              rows={4}
            />
          </div>

          <button type="submit" disabled={submitting} style={styles.button}>
            {submitting ? 'Qeyd olunur...' : 'Gündəliyə Əlavə Et'}
          </button>
        </form>

        {/* Tarixçə Hissəsi (Son 5 Qeyd) */}
        <div style={styles.historySection}>
          <h3 style={styles.sectionTitle}>Son Qeydləriniz</h3>
          {moodLogs.length === 0 ? (
            <p style={{ color: '#aaa', fontSize: '14px' }}>Hələ ki heç bir mental qeydiniz yoxdur.</p>
          ) : (
            <div style={{ display: 'grid', gap: '12px' }}>
              {moodLogs.map((log) => (
                <div key={log.id} style={styles.historyCard}>
                  <div style={styles.historyHeader}>
                    <span style={styles.moodBadge}>{log.mood}</span>
                    <span style={styles.dateText}>{log.date}</span>
                  </div>
                  {log.note && <p style={styles.noteText}>{log.note}</p>}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  container: { padding: '20px', color: '#fff' },
  title: { fontSize: '24px', marginBottom: '20px', fontWeight: '600' },
  mainGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px' },
  form: { background: '#111', border: '1px solid #222', padding: '24px', borderRadius: '12px' },
  sectionTitle: { fontSize: '18px', marginBottom: '15px', color: '#fff' },
  moodSelector: { display: 'flex', gap: '10px', justifyContent: 'space-between', flexWrap: 'wrap' },
  moodButton: {
    flex: '1',
    minWidth: '60px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '10px',
    borderRadius: '8px',
    border: '1px solid',
    color: '#fff',
    cursor: 'pointer',
    transition: 'all 0.2s'
  },
  textarea: {
    width: '100%',
    padding: '12px',
    borderRadius: '8px',
    border: '1px solid #333',
    background: '#1f1f1f',
    color: '#fff',
    outline: 'none',
    resize: 'none',
    boxSizing: 'border-box'
  },
  button: {
    marginTop: '15px',
    width: '100%',
    padding: '12px',
    borderRadius: '8px',
    border: 'none',
    background: '#1b4332',
    color: '#fff',
    cursor: 'pointer',
    fontWeight: 'bold'
  },
  alert: { padding: '12px', borderRadius: '8px', border: '1px solid', marginBottom: '15px', fontSize: '14px' },
  historySection: { background: '#141414', border: '1px solid #222', padding: '24px', borderRadius: '12px' },
  historyCard: { background: '#1f1f1f', padding: '15px', borderRadius: '8px', border: '1px solid #333' },
  historyHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' },
  moodBadge: { background: '#2d6a4f', padding: '3px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold' },
  dateText: { fontSize: '12px', color: '#aaa' },
  noteText: { fontSize: '14px', color: '#ddd', margin: '0', lineHeight: '1.4' }
};
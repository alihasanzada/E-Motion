'use client';

import React, { useState, useEffect } from 'react';

interface NutritionLog {
  id: number;
  meal: string;
  calories: number;
  date?: string;
}

export default function NutritionPanel() {
  const [logs, setLogs] = useState<NutritionLog[]>([]);
  const [meal, setMeal] = useState('');
  const [calories, setCalories] = useState('');
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<{ text: string; isError: boolean } | null>(null);

  const API_URL = 'http://127.0.0.1:5050/api/nutrition';

  const fetchNutrition = () => {
    fetch(API_URL)
      .then((res) => res.json())
      .then((data) => {
        setLogs(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    fetchNutrition();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    if (!meal || !calories) {
      setMessage({ text: 'Zəhmət olmasa, bütün xanaları doldurun.', isError: true });
      return;
    }

    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ meal, calories }),
      });

      if (res.ok) {
        setMessage({ text: 'Qeyd uğurla əlavə olundu!', isError: false });
        setMeal('');
        setCalories('');
        fetchNutrition();
      } else {
        setMessage({ text: 'Xəta baş verdi.', isError: true });
      }
    } catch {
      setMessage({ text: 'Serverlə əlaqə qurulmadı.', isError: true });
    }
  };

  const totalCalories = logs.reduce((sum, item) => sum + item.calories, 0);

  if (loading) return <div style={{ color: '#fff', padding: '20px' }}>Yüklənir...</div>;

  return (
    <div style={{ padding: '20px', color: '#fff' }}>
      <h3 style={{ fontSize: '24px', marginBottom: '20px', color: '#fff' }}>Gündəlik Qidalanma və Kalori İzləyicisi</h3>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '25px' }}>
        {/* Form */}
        <form onSubmit={handleSubmit} style={{ background: '#111', padding: '20px', borderRadius: '12px', border: '1px solid #222' }}>
          <h4 style={{ margin: '0 0 15px 0' }}>Yemək Əlavə Et</h4>
          {message && (
            <div style={{ padding: '10px', borderRadius: '6px', marginBottom: '15px', fontSize: '14px', backgroundColor: message.isError ? '#5c0d11' : '#1b4332' }}>
              {message.text}
            </div>
          )}
          <input type="text" placeholder="Yeməyin adı (Məs: Toyuq və Düyü)" value={meal} onChange={(e) => setMeal(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #333', background: '#1f1f1f', color: '#fff', marginBottom: '12px', boxSizing: 'border-box' }} />
          <input type="number" placeholder="Kalori (kcal)" value={calories} onChange={(e) => setCalories(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #333', background: '#1f1f1f', color: '#fff', marginBottom: '15px', boxSizing: 'border-box' }} />
          <button type="submit" style={{ width: '100%', padding: '12px', backgroundColor: '#1b4332', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>Qeyd Et</button>
        </form>

        {/* Günlük Xülasə */}
        <div style={{ background: '#141414', padding: '20px', borderRadius: '12px', border: '1px solid #222' }}>
          <h4>Bugünkü Xülasə</h4>
          <div style={{ fontSize: '28px', color: '#2d6a4f', fontWeight: 'bold', marginBottom: '20px' }}>{totalCalories} <span style={{ fontSize: '16px', color: '#aaa' }}>kcal qəbul edilib</span></div>
          
          <h5>Son Qeydlər</h5>
          {logs.length === 0 ? <p style={{ color: '#aaa', fontSize: '14px' }}>Hələ qeyd yoxdur.</p> : (
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {logs.map((log) => (
                <li key={log.id} style={{ padding: '10px', background: '#1f1f1f', borderRadius: '6px', marginBottom: '8px', border: '1px solid #333', display: 'flex', justifyContent: 'space-between' }}>
                  <span>{log.meal}</span>
                  <span style={{ color: '#52b788', fontWeight: 'bold' }}>{log.calories} kcal</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
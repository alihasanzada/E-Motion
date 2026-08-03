'use client';

import React, { useEffect, useState } from 'react';

interface EventItem {
  id: number;
  title: string;
  date: string;
  location: string;
}

export default function EventsPanel() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Form stateləri
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [location, setLocation] = useState('');
  const [formMessage, setFormMessage] = useState<{ text: string; isError: boolean } | null>(null);

  const API_URL = 'http://127.0.0.1:5050/api/events';

  const fetchEvents = () => {
    fetch(API_URL)
      .then((res) => {
        if (!res.ok) throw new Error('Tədbirlər yüklənərkən xəta baş verdi.');
        return res.json();
      })
      .then((data) => {
        setEvents(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormMessage(null);

    if (!title || !date || !location) {
      setFormMessage({ text: 'Zəhmət olmasa, bütün xanaları doldurun.', isError: true });
      return;
    }

    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, date, location }),
      });

      const data = await res.json();

      if (res.ok) {
        setFormMessage({ text: 'Tədbir uğurla əlavə olundu!', isError: false });
        setTitle('');
        setDate('');
        setLocation('');
        fetchEvents(); // Siyahını yeniləyirik
      } else {
        setFormMessage({ text: data.message || 'Xəta baş verdi.', isError: true });
      }
    } catch (err) {
      setFormMessage({ text: 'Backend serverinə qoşulmaq mümkün olmadı.', isError: true });
    }
  };

  if (loading) return <div style={{ color: '#fff', padding: '20px' }}>Yüklənir...</div>;

  return (
    <div style={{ padding: '20px', color: '#fff' }}>
      <h3 style={{ marginBottom: '20px', color: '#1E293B', fontSize: '24px', fontWeight: '600' }}>Universitet Tədbirləri</h3>

      {/* Yeni Tədbir Əlavə Etmə Formu */}
      <form onSubmit={handleSubmit} style={{ background: '#111', padding: '20px', borderRadius: '12px', marginBottom: '30px', border: '1px solid #222' }}>
        <h4 style={{ margin: '0 0 15px 0', color: '#fff', fontSize: '18px' }}>Yeni Tədbir Yarat</h4>
        
        {formMessage && (
          <div style={{ padding: '10px', borderRadius: '6px', marginBottom: '15px', fontSize: '14px', backgroundColor: formMessage.isError ? '#5c0d11' : '#1b4332', color: '#fff', border: '1px solid', borderColor: formMessage.isError ? '#800f14' : '#2d6a4f' }}>
            {formMessage.text}
          </div>
        )}

        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <input type="text" placeholder="Tədbirin adı" value={title} onChange={(e) => setTitle(e.target.value)} style={{ flex: 2, minWidth: '200px', padding: '10px 12px', borderRadius: '8px', border: '1px solid #333', background: '#1f1f1f', color: '#fff' }} />
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} style={{ flex: 1, minWidth: '150px', padding: '10px 12px', borderRadius: '8px', border: '1px solid #333', background: '#1f1f1f', color: '#fff' }} />
          <input type="text" placeholder="Məkan (Məs: Zal A)" value={location} onChange={(e) => setLocation(e.target.value)} style={{ flex: 1, minWidth: '150px', padding: '10px 12px', borderRadius: '8px', border: '1px solid #333', background: '#1f1f1f', color: '#fff' }} />
          
          <button type="submit" style={{ padding: '10px 20px', backgroundColor: '#1b4332', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>Yarat</button>
        </div>
      </form>

      {/* Siyahı */}
      {error && <div style={{ color: '#ff4d4d', marginBottom: '15px' }}>Xəta: {error}</div>}
      {events.length === 0 ? (
        <p style={{ color: '#aaa' }}>Hazırda aktiv tədbir yoxdur.</p>
      ) : (
        <div style={{ display: 'grid', gap: '15px', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
          {events.map((item) => (
            <div key={item.id} style={{ background: '#1e1e1e', padding: '20px', borderRadius: '10px', border: '1px solid #333', display: 'flex', flexDirection: 'column', justifyContent: 'between' }}>
              <div>
                <h4 style={{ margin: '0 0 10px 0', color: '#4da6ff', fontSize: '18px' }}>{item.title}</h4>
                <div style={{ display: 'flex', gap: '15px', fontSize: '13px', color: '#aaa', marginBottom: '5px' }}>
                  <span>📅 {item.date}</span>
                  <span>📍 {item.location}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
'use client';

import React, { useEffect, useState } from 'react';

interface Challenge {
  id: number;
  title: string;
  description: string;
  completed: number;
}

export default function ChallengesPanel() {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const API_URL = 'http://127.0.0.1:5050/api/challenges';

  const fetchChallenges = () => {
    fetch(API_URL)
      .then((res) => res.json())
      .then((data) => {
        setChallenges(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    fetchChallenges();
  }, []);

  const handleToggle = async (id: number) => {
    try {
      const res = await fetch(`${API_URL}/${id}/toggle`, { method: 'POST' });
      if (res.ok) {
        fetchChallenges(); // Status yeniləndikdən sonra siyahını yenidən çəkirik
      }
    } catch (err) {
      console.error("Status yenilənərkən xəta:", err);
    }
  };

  if (loading) return <div style={{ color: '#fff', padding: '20px' }}>Yüklənir...</div>;

  return (
    <div style={{ padding: '20px', color: '#fff' }}>
      <h3 style={{ fontSize: '24px', marginBottom: '20px' }}>Həftəlik Motivasiya Çağırışları</h3>
      
      <div style={{ display: 'grid', gap: '15px' }}>
        {challenges.map((ch) => (
          <div key={ch.id} style={{ 
            background: ch.completed ? '#1b4332' : '#1e1e1e', 
            padding: '20px', 
            borderRadius: '10px', 
            border: '1px solid', 
            borderColor: ch.completed ? '#2d6a4f' : '#333',
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            transition: 'all 0.3s ease'
          }}>
            <div>
              <h4 style={{ margin: '0 0 5px 0', textDecoration: ch.completed ? 'line-through' : 'none', color: ch.completed ? '#a7c957' : '#fff' }}>{ch.title}</h4>
              <p style={{ margin: 0, fontSize: '14px', color: ch.completed ? '#ddd' : '#aaa' }}>{ch.description}</p>
            </div>
            <button 
              onClick={() => handleToggle(ch.id)}
              style={{ 
                padding: '8px 16px', 
                backgroundColor: ch.completed ? '#4cc9f0' : '#2d6a4f', 
                color: '#fff', 
                border: 'none', 
                borderRadius: '6px', 
                cursor: 'pointer', 
                fontWeight: 'bold' 
              }}
            >
              {ch.completed ? 'Tamamlandı ✓' : 'İcra Et'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
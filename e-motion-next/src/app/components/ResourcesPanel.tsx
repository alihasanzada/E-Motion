'use client';

import React, { useEffect, useState } from 'react';

interface Resource {
  id: number;
  title: string;
  category: string;
  link: string;
}

export default function ResourcesPanel() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Form stateləri
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Dərslik');
  const [link, setLink] = useState('');
  const [formMessage, setFormMessage] = useState<{ text: string; isError: boolean } | null>(null);

  const fetchResources = () => {
    fetch('http://127.0.0.1:5050/api/resources')
      .then((res) => {
        if (!res.ok) throw new Error('Məlumatlar yüklənərkən xəta baş verdir.');
        return res.json();
      })
      .then((data) => {
        setResources(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchResources();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormMessage(null);

    if (!title || !link) {
      setFormMessage({ text: 'Zəhmət olmasa, bütün xanaları doldurun.', isError: true });
      return;
    }

    try {
      const res = await fetch('http://127.0.0.1:5050/api/resources', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, category, link }),
      });

      const data = await res.json();

      if (res.ok) {
        setFormMessage({ text: 'Resurs uğurla əlavə olundu!', isError: false });
        setTitle('');
        setLink('');
        fetchResources(); // Siyahını yeniləyirik
      } else {
        setFormMessage({ text: data.message || 'Xəta baş verdi.', isError: true });
      }
    } catch (err) {
      setFormMessage({ text: 'Backend serverinə qoşulmaq mümkün olmadı.', isError: true });
    }
  };

  if (loading) return <div style={{ color: '#000', padding: '20px' }}>Yüklənir...</div>;

  return (
    <div style={{ padding: '20px' }}>
      <h3 style={{ marginBottom: '20px', color: '#1E293B' }}>Faydalı Təhsil Resursları</h3>

      {/* Yenı Resurs Əlavə Etmə Formu */}
      <form onSubmit={handleSubmit} style={{ background: '#f8fafc', padding: '20px', borderRadius: '8px', marginBottom: '30px', border: '1px solid #e2e8f0' }}>
        <h4 style={{ margin: '0 0 15px 0', color: '#334155' }}>Yeni Resurs Paylaş</h4>
        
        {formMessage && (
          <div style={{ padding: '10px', borderRadius: '4px', marginBottom: '15px', fontSize: '14px', backgroundColor: formMessage.isError ? '#fee2e2' : '#dcfce7', color: formMessage.isError ? '#991b1b' : '#166534' }}>
            {formMessage.text}
          </div>
        )}

        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <input type="text" placeholder="Resurs adı (Məs: Next.js Official)" value={title} onChange={(e) => setTitle(e.target.value)} style={{ flex: 1, padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1' }} />
          
          <select value={category} onChange={(e) => setCategory(e.target.value)} style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', backgroundColor: '#fff' }}>
            <option value="Dərslik">Dərslik</option>
            <option value="Məqalə">Məqalə</option>
            <option value="Video">Video</option>
            <option value="Alət">Alət</option>
          </select>

          <input type="text" placeholder="Link (Məs: https://nextjs.org)" value={link} onChange={(e) => setLink(e.target.value)} style={{ flex: 1, padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1' }} />
          
          <button type="submit" style={{ padding: '8px 16px', backgroundColor: '#0f172a', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>Əlavə Et</button>
        </div>
      </form>

      {/* Siyahı */}
      {error && <div style={{ color: '#ff4d4d', marginBottom: '15px' }}>Xəta: {error}</div>}
      
      <div style={{ display: 'grid', gap: '15px' }}>
        {resources.map((item) => (
          <div key={item.id} style={{ background: '#1e1e1e', padding: '15px', borderRadius: '8px', border: '1px solid #333', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h4 style={{ margin: '0 0 5px 0', color: '#4da6ff' }}>{item.title}</h4>
              <span style={{ fontSize: '12px', background: '#333', color: '#fff', padding: '3px 8px', borderRadius: '4px' }}>{item.category}</span>
            </div>
            <a href={item.link} target="_blank" rel="noopener noreferrer" style={{ color: '#10b981', textDecoration: 'none', fontWeight: 'bold' }}>Keçid et →</a>
          </div>
        ))}
      </div>
    </div>
  );
}
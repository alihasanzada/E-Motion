"use client";
import React, { useState } from 'react';
import { BookOpen, ExternalLink, Plus, Search, Bookmark, Tag, Code, FileText, Video } from 'lucide-react';

export default function ResourcesPanel() {
  const [title, setTitle] = useState('');
  const [link, setLink] = useState('');
  const [type, setType] = useState('Dərslik');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Hamısı');

  const [resources, setResources] = useState([
    {
      id: 1,
      title: 'React Rəsmi Sənədləşməsi',
      link: 'https://react.dev',
      type: 'Dərslik',
      author: 'React Team',
      icon: Code
    },
    {
      id: 2,
      title: 'Flask Python Web Framework',
      link: 'https://flask.palletsprojects.com',
      type: 'Dərslik',
      author: 'Pallets',
      icon: Code
    },
    {
      id: 3,
      title: 'Kibertəhlükəsizlik üzrə Başlanğıc Bələdçisi',
      link: 'https://tryhackme.com',
      type: 'Məqalə',
      author: 'TryHackMe',
      icon: FileText
    }
  ]);

  const categories = ['Hamısı', 'Dərslik', 'Məqalə', 'Video', 'Kitab'];

  const handleAddResource = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !link.trim()) return;

    const newResource = {
      id: Date.now(),
      title,
      link: link.startsWith('http') ? link : `https://${link}`,
      type,
      author: 'Tələbə Paylaşımı',
      icon: type === 'Video' ? Video : type === 'Məqalə' ? FileText : Code
    };

    setResources([newResource, ...resources]);
    setTitle('');
    setLink('');
  };

  const filteredResources = resources.filter(res => {
    const matchesSearch = res.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'Hamısı' || res.type === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', paddingBottom: '40px' }}>
      
      {/* 1. Başlıq */}
      <div>
        <h2 style={{ margin: 0, fontSize: '22px', fontWeight: '800', color: '#0F172A', letterSpacing: '-0.5px' }}>
          Faydalı Təhsil Resursları
        </h2>
        <p style={{ margin: '4px 0 0 0', fontSize: '13.5px', color: '#64748B' }}>
          Dərs materialları, proqramlaşdırma sənədləri və faydalı linkləri kəşf edin və ya yoldaşlarınızla paylaşın.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px', alignItems: 'start' }}>
        
        {/* Sol Sütun: Yeni Resurs Paylaş Formu */}
        <div style={{
          backgroundColor: '#FFFFFF',
          padding: '24px',
          borderRadius: '20px',
          border: '1px solid #E2E8F0',
          boxShadow: '0 4px 12px rgba(0,0,0,0.03)'
        }}>
          <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: '700', color: '#0F172A', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <BookOpen size={18} color="#2E5B4E" /> Yeni Resurs Paylaş
          </h3>

          <form onSubmit={handleAddResource} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#475569', marginBottom: '6px' }}>
                Resursun Adı
              </label>
              <input
                type="text"
                placeholder="Məl. Next.js Official Docs"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                style={{
                  width: '100%',
                  padding: '11px 14px',
                  borderRadius: '10px',
                  border: '1px solid #CBD5E1',
                  fontSize: '13px',
                  outline: 'none',
                  backgroundColor: '#F8FAFC',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#475569', marginBottom: '6px' }}>
                  Növü
                </label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '11px',
                    borderRadius: '10px',
                    border: '1px solid #CBD5E1',
                    fontSize: '13px',
                    outline: 'none',
                    backgroundColor: '#F8FAFC',
                    boxSizing: 'border-box'
                  }}
                >
                  <option value="Dərslik">Dərslik</option>
                  <option value="Məqalə">Məqalə</option>
                  <option value="Video">Video</option>
                  <option value="Kitab">Kitab</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#475569', marginBottom: '6px' }}>
                  Keçid Linki (URL)
                </label>
                <input
                  type="text"
                  placeholder="https://..."
                  value={link}
                  onChange={(e) => setLink(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '11px 14px',
                    borderRadius: '10px',
                    border: '1px solid #CBD5E1',
                    fontSize: '13px',
                    outline: 'none',
                    backgroundColor: '#F8FAFC',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
            </div>

            <button
              type="submit"
              style={{
                marginTop: '6px',
                backgroundColor: '#2E5B4E',
                color: '#FFFFFF',
                border: 'none',
                padding: '12px',
                borderRadius: '10px',
                fontSize: '13.5px',
                fontWeight: '600',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxShadow: '0 4px 12px rgba(46, 91, 78, 0.2)',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#23473D'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#2E5B4E'}
            >
              <Plus size={16} /> Resurs Əlavə Et
            </button>
          </form>
        </div>

        {/* Sağ Sütun: Resurslar və Axtarış */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          
          {/* Kateqoriya Düymələri */}
          <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                style={{
                  backgroundColor: selectedCategory === cat ? '#2E5B4E' : '#FFFFFF',
                  color: selectedCategory === cat ? '#FFFFFF' : '#64748B',
                  border: '1px solid',
                  borderColor: selectedCategory === cat ? '#2E5B4E' : '#E2E8F0',
                  padding: '6px 14px',
                  borderRadius: '20px',
                  fontSize: '12px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.2s ease'
                }}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Resurs Kartları Siyahısı */}
          {filteredResources.length === 0 ? (
            <div style={{ backgroundColor: '#FFFFFF', padding: '32px', borderRadius: '18px', border: '1px solid #E2E8F0', textAlign: 'center' }}>
              <p style={{ margin: 0, fontSize: '13.5px', color: '#94A3B8' }}>Resurs tapılmadı.</p>
            </div>
          ) : (
            filteredResources.map((res) => {
              const IconComponent = res.icon || BookOpen;
              return (
                <div
                  key={res.id}
                  style={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '18px',
                    padding: '18px 20px',
                    border: '1px solid #E2E8F0',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.02)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '16px',
                    transition: 'transform 0.2s ease, box-shadow 0.2s ease'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <div style={{
                      backgroundColor: '#ECFDF5',
                      border: '1px solid #A7F3D0',
                      padding: '12px',
                      borderRadius: '14px',
                      color: '#2E5B4E',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <IconComponent size={20} />
                    </div>

                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
                        <span style={{ backgroundColor: '#F1F5F9', color: '#475569', fontSize: '11px', fontWeight: '700', padding: '2px 8px', borderRadius: '12px' }}>
                          {res.type}
                        </span>
                        <span style={{ fontSize: '11.5px', color: '#94A3B8' }}>• {res.author}</span>
                      </div>

                      <h4 style={{ margin: 0, fontSize: '15px', fontWeight: '700', color: '#0F172A' }}>
                        {res.title}
                      </h4>
                    </div>
                  </div>

                  <a
                    href={res.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      backgroundColor: '#F8FAFC',
                      color: '#2E5B4E',
                      border: '1px solid #E2E8F0',
                      padding: '8px 14px',
                      borderRadius: '10px',
                      fontSize: '12.5px',
                      fontWeight: '700',
                      textDecoration: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      whiteSpace: 'nowrap',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#2E5B4E';
                      e.currentTarget.style.color = '#FFFFFF';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = '#F8FAFC';
                      e.currentTarget.style.color = '#2E5B4E';
                    }}
                  >
                    Keçid Et <ExternalLink size={14} />
                  </a>
                </div>
              );
            })
          )}

        </div>

      </div>

    </div>
  );
}
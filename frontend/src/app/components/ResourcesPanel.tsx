"use client";
import React, { useState } from 'react';
import { BookOpen, ExternalLink, Plus, Code, FileText, Video } from 'lucide-react';

interface ResourcesPanelProps {
  isDarkMode?: boolean;
}

export default function ResourcesPanel({ isDarkMode = false }: ResourcesPanelProps) {
  const theme = {
    cardBg: isDarkMode ? '#1E1E1E' : '#FFFFFF',
    textPrimary: isDarkMode ? '#FFFFFF' : '#0F172A',
    textSecondary: isDarkMode ? '#94A3B8' : '#64748B',
    textMuted: isDarkMode ? '#CBD5E1' : '#475569',
    borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : '#E2E8F0',
    inputBg: isDarkMode ? '#27272A' : '#F8FAFC',
    inputBorder: isDarkMode ? '#3F3F46' : '#CBD5E1',
    badgeCategoryBg: isDarkMode ? 'rgba(255, 255, 255, 0.08)' : '#F1F5F9',
    iconBoxBg: isDarkMode ? 'rgba(46, 91, 78, 0.2)' : '#ECFDF5',
    iconBoxBorder: isDarkMode ? 'rgba(46, 91, 78, 0.4)' : '#A7F3D0',
    iconBoxColor: isDarkMode ? '#4ADE80' : '#2E5B4E',
    linkBtnBg: isDarkMode ? '#27272A' : '#F8FAFC',
    linkBtnText: isDarkMode ? '#4ADE80' : '#2E5B4E',
    linkBtnBorder: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : '#E2E8F0',
    activeCatBg: isDarkMode ? '#23473D' : '#2E5B4E',
    activeCatText: '#FFFFFF',
    inactiveCatBg: isDarkMode ? '#1E1E1E' : '#FFFFFF',
    inactiveCatText: isDarkMode ? '#94A3B8' : '#64748B',
    inactiveCatBorder: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : '#E2E8F0'
  };

  const [title, setTitle] = useState('');
  const [link, setLink] = useState('');
  const [type, setType] = useState('Dərslik');
  const [searchQuery] = useState('');
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
        <h2 style={{ margin: 0, fontSize: '22px', fontWeight: '800', color: theme.textPrimary, letterSpacing: '-0.5px' }}>
          Faydalı Təhsil Resursları
        </h2>
        <p style={{ margin: '4px 0 0 0', fontSize: '13.5px', color: theme.textSecondary }}>
          Dərs materialları, proqramlaşdırma sənədləri və faydalı linkləri kəşf edin və ya yoldaşlarınızla paylaşın.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px', alignItems: 'start' }}>
        
        {/* Sol Sütun: Yeni Resurs Paylaş Formu */}
        <div style={{
          backgroundColor: theme.cardBg,
          padding: '24px',
          borderRadius: '20px',
          border: `1px solid ${theme.borderColor}`,
          boxShadow: '0 4px 12px rgba(0,0,0,0.03)'
        }}>
          <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: '700', color: theme.textPrimary, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <BookOpen size={18} color={isDarkMode ? '#4ADE80' : '#2E5B4E'} /> Yeni Resurs Paylaş
          </h3>

          <form onSubmit={handleAddResource} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: theme.textMuted, marginBottom: '6px' }}>
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
                  border: `1px solid ${theme.inputBorder}`,
                  fontSize: '13px',
                  outline: 'none',
                  backgroundColor: theme.inputBg,
                  color: theme.textPrimary,
                  boxSizing: 'border-box'
                }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: theme.textMuted, marginBottom: '6px' }}>
                  Növü
                </label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '11px',
                    borderRadius: '10px',
                    border: `1px solid ${theme.inputBorder}`,
                    fontSize: '13px',
                    outline: 'none',
                    backgroundColor: theme.inputBg,
                    color: theme.textPrimary,
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
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: theme.textMuted, marginBottom: '6px' }}>
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
                    border: `1px solid ${theme.inputBorder}`,
                    fontSize: '13px',
                    outline: 'none',
                    backgroundColor: theme.inputBg,
                    color: theme.textPrimary,
                    boxSizing: 'border-box'
                  }}
                />
              </div>
            </div>

            <button
              type="submit"
              style={{
                marginTop: '6px',
                backgroundColor: isDarkMode ? '#23473D' : '#2E5B4E',
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
                boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = isDarkMode ? '#2E5B4E' : '#23473D'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = isDarkMode ? '#23473D' : '#2E5B4E'}
            >
              <Plus size={16} /> Resurs Əlavə Et
            </button>
          </form>
        </div>

        {/* Sağ Sütun: Resurslar və Axtarış */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          
          {/* Kateqoriya Düymələri */}
          <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
            {categories.map((cat) => {
              const isActive = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  style={{
                    backgroundColor: isActive ? theme.activeCatBg : theme.inactiveCatBg,
                    color: isActive ? theme.activeCatText : theme.inactiveCatText,
                    border: '1px solid',
                    borderColor: isActive ? theme.activeCatBg : theme.inactiveCatBorder,
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
              );
            })}
          </div>

          {/* Resurs Kartları Siyahısı */}
          {filteredResources.length === 0 ? (
            <div style={{ backgroundColor: theme.cardBg, padding: '32px', borderRadius: '18px', border: `1px solid ${theme.borderColor}`, textAlign: 'center' }}>
              <p style={{ margin: 0, fontSize: '13.5px', color: theme.textSecondary }}>Resurs tapılmadı.</p>
            </div>
          ) : (
            filteredResources.map((res) => {
              const IconComponent = res.icon || BookOpen;
              return (
                <div
                  key={res.id}
                  style={{
                    backgroundColor: theme.cardBg,
                    borderRadius: '18px',
                    padding: '18px 20px',
                    border: `1px solid ${theme.borderColor}`,
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
                      backgroundColor: theme.iconBoxBg,
                      border: `1px solid ${theme.iconBoxBorder}`,
                      padding: '12px',
                      borderRadius: '14px',
                      color: theme.iconBoxColor,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <IconComponent size={20} />
                    </div>

                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
                        <span style={{ backgroundColor: theme.badgeCategoryBg, color: theme.textMuted, fontSize: '11px', fontWeight: '700', padding: '2px 8px', borderRadius: '12px' }}>
                          {res.type}
                        </span>
                        <span style={{ fontSize: '11.5px', color: theme.textSecondary }}>• {res.author}</span>
                      </div>

                      <h4 style={{ margin: 0, fontSize: '15px', fontWeight: '700', color: theme.textPrimary }}>
                        {res.title}
                      </h4>
                    </div>
                  </div>

                  <a
                    href={res.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      backgroundColor: theme.linkBtnBg,
                      color: theme.linkBtnText,
                      border: `1px solid ${theme.linkBtnBorder}`,
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
                      e.currentTarget.style.backgroundColor = isDarkMode ? '#2E5B4E' : '#2E5B4E';
                      e.currentTarget.style.color = '#FFFFFF';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = theme.linkBtnBg;
                      e.currentTarget.style.color = theme.linkBtnText;
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
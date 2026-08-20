"use client";
import React, { useState, useEffect, useMemo } from 'react';
import {
  BookOpen, ExternalLink, Plus, Code, FileText, Video, Book, Heart, Bookmark,
  Trash2, Search, User, List, ArrowUpDown
} from 'lucide-react';

interface Resource {
  id: number;
  title: string;
  description?: string;
  link: string;
  type: string;
  author: string;
  createdAt: string;
  likes: number;
  isLiked?: boolean;
  isSaved?: boolean;
  isMyPost?: boolean;
}

interface ResourcesPanelProps {
  isDarkMode?: boolean;
}

const DEFAULT_RESOURCES: Resource[] = [
  {
    id: 1,
    title: 'React Rəsmi Sənədləşməsi',
    description: 'React 18+ hooks, komponentlər və state idarəetməsi haqqında rəsmi bələdçi.',
    link: 'https://react.dev',
    type: 'Dərslik',
    author: 'React Team',
    createdAt: '2 saat əvvəl',
    likes: 12,
    isLiked: false,
    isSaved: true,
    isMyPost: false
  },
  {
    id: 2,
    title: 'Flask Python Web Framework',
    description: 'Python ilə yüngül və sürətli veb tətbiqlər hazırlamaq üçün rəsmi sənədləşmə.',
    link: 'https://flask.palletsprojects.com',
    type: 'Dərslik',
    author: 'Pallets',
    createdAt: '5 saat əvvəl',
    likes: 8,
    isLiked: false,
    isSaved: false,
    isMyPost: false
  },
  {
    id: 3,
    title: 'Kibertəhlükəsizlik üzrə Başlanğıc Bələdçisi',
    description: 'Təhlükəsizlik əsasları, şəbəkə analizi və sızma testləri üçün praktiki laboratoriyalar.',
    link: 'https://tryhackme.com',
    type: 'Məqalə',
    author: 'TryHackMe',
    createdAt: '1 gün əvvəl',
    likes: 24,
    isLiked: true,
    isSaved: true,
    isMyPost: false
  }
];

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
  const [description, setDescription] = useState('');
  const [link, setLink] = useState('');
  const [type, setType] = useState('Dərslik');
  const [detectedSource, setDetectedSource] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Hamısı');
  const [sortBy, setSortBy] = useState<'newest' | 'popular'>('newest');

  const [activeTab, setActiveTab] = useState<'all' | 'saved' | 'my'>('all');

  const [resources, setResources] = useState<Resource[]>(() => {
    if (typeof window !== 'undefined') {
      const savedData = localStorage.getItem('emotion_resources');
      if (savedData) {
        try { return JSON.parse(savedData); } catch { return DEFAULT_RESOURCES; }
      }
    }
    return DEFAULT_RESOURCES;
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('emotion_resources', JSON.stringify(resources));
    }
  }, [resources]);

  const categories = ['Hamısı', 'Dərslik', 'Məqalə', 'Video', 'Kitab'];

  const handleLinkChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setLink(val);

    try {
      if (val.startsWith('http://') || val.startsWith('https://')) {
        const hostname = new URL(val).hostname.replace('www.', '');
        const domain = hostname.split('.')[0];
        const formattedDomain = domain.charAt(0).toUpperCase() + domain.slice(1);
        setDetectedSource(formattedDomain);

        if (val.includes('youtube.com') || val.includes('youtu.be')) {
          setType('Video');
        } else if (val.includes('github.com') || val.includes('docs.')) {
          setType('Dərslik');
        } else if (val.includes('medium.com') || val.includes('dev.to')) {
          setType('Məqalə');
        }
      } else {
        setDetectedSource('');
      }
    } catch {
      setDetectedSource('');
    }
  };

  const handleAddResource = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !link.trim()) return;

    const newResource: Resource = {
      id: Date.now(),
      title,
      description: description.trim() || undefined,
      link: link.startsWith('http') ? link : `https://${link}`,
      type,
      author: detectedSource || 'Mənim Paylaşımım',
      createdAt: 'İndi',
      likes: 0,
      isLiked: false,
      isSaved: false,
      isMyPost: true
    };

    setResources([newResource, ...resources]);
    setTitle('');
    setDescription('');
    setLink('');
    setDetectedSource('');
    setActiveTab('my');
  };

  const toggleLike = (id: number) => {
    setResources(resources.map(res => {
      if (res.id === id) {
        return {
          ...res,
          likes: res.isLiked ? res.likes - 1 : res.likes + 1,
          isLiked: !res.isLiked
        };
      }
      return res;
    }));
  };

  const toggleSave = (id: number) => {
    setResources(resources.map(res => {
      if (res.id === id) {
        return { ...res, isSaved: !res.isSaved };
      }
      return res;
    }));
  };

  const handleDelete = (id: number) => {
    setResources(resources.filter(res => res.id !== id));
  };

  const getIcon = (resType: string) => {
    switch (resType) {
      case 'Video': return Video;
      case 'Məqalə': return FileText;
      case 'Kitab': return Book;
      default: return Code;
    }
  };

  const filteredResources = useMemo(() => {
    const list = resources.filter(res => {
      const matchesSearch = res.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (res.description && res.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
        res.author.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'Hamısı' || res.type === selectedCategory;

      let matchesTab = true;
      if (activeTab === 'saved') matchesTab = res.isSaved === true;
      if (activeTab === 'my') matchesTab = res.isMyPost === true;

      return matchesSearch && matchesCategory && matchesTab;
    });

    return list.sort((a, b) => {
      if (sortBy === 'popular') {
        return b.likes - a.likes;
      }
      return b.id - a.id;
    });
  }, [resources, searchQuery, selectedCategory, activeTab, sortBy]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', paddingBottom: '40px' }}>

      {/* Başlıq */}
      <div>
        <h2 style={{ margin: 0, fontSize: '22px', fontWeight: '800', color: theme.textPrimary, letterSpacing: '-0.5px' }}>
          Faydalı Təhsil Resursları
        </h2>
        <p style={{ margin: '4px 0 0 0', fontSize: '13.5px', color: theme.textSecondary }}>
          Dərs materialları, proqramlaşdırma sənədləri və faydalı linkləri kəşf edin və ya yoldaşlarınızla paylaşın.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px', alignItems: 'start' }}>

        {/* Sol Sütun: Form */}
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
                required
                placeholder="Məsələn: Next.js Official Docs"
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

            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: theme.textMuted, marginBottom: '6px' }}>
                Qısa Açıqlama <span style={{ opacity: 0.6 }}>(isteğe bağlı)</span>
              </label>
              <textarea
                rows={2}
                placeholder="Mənbə haqqında 1-2 cümləlik qısa məlumat..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: '10px',
                  border: `1px solid ${theme.inputBorder}`,
                  fontSize: '13px',
                  outline: 'none',
                  backgroundColor: theme.inputBg,
                  color: theme.textPrimary,
                  resize: 'none',
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
                  required
                  placeholder="https://..."
                  value={link}
                  onChange={handleLinkChange}
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

            {detectedSource && (
              <div style={{ fontSize: '11.5px', color: isDarkMode ? '#4ADE80' : '#2E5B4E', fontWeight: '600' }}>
                ✓ Mənbə avtomatik təyin olundu: <strong>{detectedSource}</strong>
              </div>
            )}

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

        {/* Sağ Sütun */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

          {/* Görünüş Tabları */}
          <div style={{
            display: 'flex',
            backgroundColor: theme.cardBg,
            padding: '4px',
            borderRadius: '14px',
            border: `1px solid ${theme.borderColor}`,
            gap: '4px'
          }}>
            <button
              onClick={() => setActiveTab('all')}
              style={{
                flex: 1,
                padding: '8px 12px',
                borderRadius: '10px',
                border: 'none',
                fontSize: '12.5px',
                fontWeight: '700',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                backgroundColor: activeTab === 'all' ? theme.activeCatBg : 'transparent',
                color: activeTab === 'all' ? '#FFFFFF' : theme.textSecondary,
                transition: 'all 0.2s ease'
              }}
            >
              <List size={15} /> Hamısı ({resources.length})
            </button>

            <button
              onClick={() => setActiveTab('saved')}
              style={{
                flex: 1,
                padding: '8px 12px',
                borderRadius: '10px',
                border: 'none',
                fontSize: '12.5px',
                fontWeight: '700',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                backgroundColor: activeTab === 'saved' ? theme.activeCatBg : 'transparent',
                color: activeTab === 'saved' ? '#FFFFFF' : theme.textSecondary,
                transition: 'all 0.2s ease'
              }}
            >
              <Bookmark size={15} fill={activeTab === 'saved' ? '#F59E0B' : 'none'} color={activeTab === 'saved' ? '#F59E0B' : 'currentColor'} /> Yadda Saxlanılanlar ({resources.filter(r => r.isSaved).length})
            </button>

            <button
              onClick={() => setActiveTab('my')}
              style={{
                flex: 1,
                padding: '8px 12px',
                borderRadius: '10px',
                border: 'none',
                fontSize: '12.5px',
                fontWeight: '700',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                backgroundColor: activeTab === 'my' ? theme.activeCatBg : 'transparent',
                color: activeTab === 'my' ? '#FFFFFF' : theme.textSecondary,
                transition: 'all 0.2s ease'
              }}
            >
              <User size={15} /> Mənim Paylaşdıqlarım ({resources.filter(r => r.isMyPost).length})
            </button>
          </div>

          {/* Axtarış və Sıralama Zolağı */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>

            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              {/* Canlı Axtarış */}
              <div style={{ position: 'relative', flex: 1 }}>
                <Search size={16} color={theme.textSecondary} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="text"
                  placeholder="Resurs adı, açıqlama və ya mənbə üzrə axtar..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 14px 10px 36px',
                    borderRadius: '12px',
                    border: `1px solid ${theme.inputBorder}`,
                    fontSize: '13px',
                    outline: 'none',
                    backgroundColor: theme.inputBg,
                    color: theme.textPrimary,
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              {/* Çeşidləmə */}
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <ArrowUpDown size={14} color={theme.textSecondary} style={{ position: 'absolute', left: '10px', pointerEvents: 'none' }} />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as 'newest' | 'popular')}
                  style={{
                    padding: '10px 12px 10px 30px',
                    borderRadius: '12px',
                    border: `1px solid ${theme.inputBorder}`,
                    fontSize: '12.5px',
                    fontWeight: '600',
                    outline: 'none',
                    backgroundColor: theme.inputBg,
                    color: theme.textPrimary,
                    cursor: 'pointer'
                  }}
                >
                  <option value="newest">Ən Yenilər</option>
                  <option value="popular">Ən Çox Bəyənilənlər</option>
                </select>
              </div>
            </div>

            {/* Kateqoriyalar */}
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
          </div>

          {/* Siyahı */}
          {filteredResources.length === 0 ? (
            <div style={{ backgroundColor: theme.cardBg, padding: '36px', borderRadius: '18px', border: `1px solid ${theme.borderColor}`, textAlign: 'center' }}>
              <p style={{ margin: 0, fontSize: '13.5px', color: theme.textSecondary }}>
                {activeTab === 'saved'
                  ? 'Hələ heç bir resursu yadda saxlamamısınız.'
                  : activeTab === 'my'
                    ? 'Hələ heç bir resurs paylaşmamısınız.'
                    : 'Axtarışa uyğun resurs tapılmadı.'}
              </p>
            </div>
          ) : (
            filteredResources.map((res) => {
              const IconComponent = getIcon(res.type);
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
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px', flex: 1 }}>
                    <div style={{
                      backgroundColor: theme.iconBoxBg,
                      border: `1px solid ${theme.iconBoxBorder}`,
                      padding: '12px',
                      borderRadius: '14px',
                      color: theme.iconBoxColor,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      marginTop: '2px'
                    }}>
                      <IconComponent size={20} />
                    </div>

                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                        <span style={{ backgroundColor: theme.badgeCategoryBg, color: theme.textMuted, fontSize: '11px', fontWeight: '700', padding: '2px 8px', borderRadius: '12px' }}>
                          {res.type}
                        </span>
                        <span style={{ fontSize: '11.5px', color: theme.textSecondary }}>• {res.author}</span>
                        {res.createdAt && (
                          <span style={{ fontSize: '11px', color: theme.textSecondary }}>({res.createdAt})</span>
                        )}
                      </div>

                      <h4 style={{ margin: '0 0 4px 0', fontSize: '15px', fontWeight: '700', color: theme.textPrimary }}>
                        {res.title}
                      </h4>

                      {res.description && (
                        <p style={{ margin: 0, fontSize: '12.5px', color: theme.textSecondary, lineHeight: '1.4' }}>
                          {res.description}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Sağ Düymələr */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>

                    {/* Bəyənmə */}
                    <button
                      onClick={() => toggleLike(res.id)}
                      title="Bəyən"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        background: 'none',
                        border: 'none',
                        color: res.isLiked ? '#EF4444' : theme.textSecondary,
                        cursor: 'pointer',
                        fontSize: '12px',
                        fontWeight: '600'
                      }}
                    >
                      <Heart size={16} fill={res.isLiked ? '#EF4444' : 'none'} />
                      <span>{res.likes}</span>
                    </button>

                    {/* Bookmark */}
                    <button
                      onClick={() => toggleSave(res.id)}
                      title={res.isSaved ? "Yaddaşdan çıxart" : "Yadda saxla"}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: res.isSaved ? '#F59E0B' : theme.textSecondary,
                        cursor: 'pointer',
                        padding: '4px'
                      }}
                    >
                      <Bookmark size={16} fill={res.isSaved ? '#F59E0B' : 'none'} />
                    </button>

                    {/* Silmə */}
                    {res.isMyPost && (
                      <button
                        onClick={() => handleDelete(res.id)}
                        title="Sil"
                        style={{
                          background: 'none',
                          border: 'none',
                          color: theme.textSecondary,
                          cursor: 'pointer',
                          padding: '4px'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.color = '#EF4444'}
                        onMouseLeave={(e) => e.currentTarget.style.color = theme.textSecondary}
                      >
                        <Trash2 size={16} />
                      </button>
                    )}

                    {/* Keçid Et */}
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
                </div>
              );
            })
          )}

        </div>

      </div>

    </div>
  );
}
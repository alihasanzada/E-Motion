"use client";
import React, { useState } from 'react';
import { MapPin, Users, Plus, CheckCircle2, Sparkles, Clock, User, X, Search, Calendar } from 'lucide-react';

interface EventsPanelProps {
  isDarkMode?: boolean;
}

interface EventItem {
  id: number;
  title: string;
  date: string;
  time: string;
  displayDate: { day: string; month: string };
  location: string;
  category: string;
  organizer: string;
  capacity: number;
  attendees: number;
  description: string;
  isAttending: boolean;
  isPast?: boolean;
  avatars?: string[];
}

export default function EventsPanel({ isDarkMode = false }: EventsPanelProps) {
  const theme = {
    cardBg: isDarkMode ? '#1E1E1E' : '#FFFFFF',
    textPrimary: isDarkMode ? '#FFFFFF' : '#0F172A',
    textSecondary: isDarkMode ? '#94A3B8' : '#64748B',
    textMuted: isDarkMode ? '#CBD5E1' : '#475569',
    borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : '#E2E8F0',
    inputBg: isDarkMode ? '#27272A' : '#F8FAFC',
    inputBorder: isDarkMode ? '#3F3F46' : '#CBD5E1',
    badgeCategoryBg: isDarkMode ? 'rgba(255, 255, 255, 0.08)' : '#F1F5F9',
    dateBoxBg: isDarkMode ? 'rgba(46, 91, 78, 0.2)' : '#ECFDF5',
    dateBoxBorder: isDarkMode ? 'rgba(46, 91, 78, 0.4)' : '#A7F3D0',
    dateBoxDayText: isDarkMode ? '#4ADE80' : '#2E5B4E',
    dateBoxMonthText: isDarkMode ? '#34D399' : '#059669',
    attendingBtnBg: isDarkMode ? 'rgba(16, 185, 129, 0.15)' : '#ECFDF5',
    attendingBtnText: isDarkMode ? '#34D399' : '#059669',
    attendingBtnBorder: isDarkMode ? 'rgba(16, 185, 129, 0.3)' : '#A7F3D0',
    modalOverlay: isDarkMode ? 'rgba(0, 0, 0, 0.75)' : 'rgba(15, 23, 42, 0.5)',
    activeTabBg: isDarkMode ? '#23473D' : '#2E5B4E',
    activeTabText: '#FFFFFF',
    inactiveTabBg: isDarkMode ? '#27272A' : '#F1F5F9',
    inactiveTabText: isDarkMode ? '#CBD5E1' : '#475569',
  };

  const [activeTab, setActiveTab] = useState<string>('Bütün Tədbirlər');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
  const [selectedEvent, setSelectedEvent] = useState<EventItem | null>(null);

  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [location, setLocation] = useState('');
  const [category, setCategory] = useState('Texnologiya');
  const [organizer, setOrganizer] = useState('');
  const [capacity, setCapacity] = useState<string>('');
  const [description, setDescription] = useState('');

  const [events, setEvents] = useState<EventItem[]>([
    {
      id: 1,
      title: 'AI və Gələcək Seminarı',
      date: '2026-08-15',
      time: '14:00 - 16:00',
      displayDate: { day: '15', month: 'AVQ' },
      location: 'Əsas Bina, Zal A',
      category: 'Texnologiya',
      organizer: 'Kompüter Klubu',
      capacity: 60,
      attendees: 42,
      description: 'Süni intellektin müasir cəmiyyətdəki rolu, LLM modelləri və gələcək karyera imkanları haqqında interaktiv seminar.',
      isAttending: false,
      isPast: false,
      avatars: [
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80',
      ]
    },
    {
      id: 2,
      title: 'Kampus daxili Şahmat Turniri',
      date: '2026-08-18',
      time: '11:00 - 15:00',
      displayDate: { day: '18', month: 'AVQ' },
      location: 'Tələbə Mərkəzi',
      category: 'İdman',
      organizer: 'İdman Şurası',
      capacity: 30,
      attendees: 18,
      description: 'Universitet tələbələri arasında İsveçrə sistemi üzrə təşkil edilən sürətli şahmat (Blitz) çempionatı.',
      isAttending: true,
      isPast: false,
      avatars: [
        'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&auto=format&fit=crop&q=80',
      ]
    },
    {
      id: 3,
      title: 'Karyera və Təcrübə Proqramı Masterklassı',
      date: '2026-08-22',
      time: '15:30 - 17:30',
      displayDate: { day: '22', month: 'AVQ' },
      location: 'Böyük Akt Zalı',
      category: 'Karyera',
      organizer: 'Karyera Mərkəzi',
      capacity: 100,
      attendees: 85,
      description: 'CV hazırlığı, müsahibə texnikaları və yerli/beynəlxalq şirkətlərdə təcrübə imkanları mövzusunda təlim.',
      isAttending: false,
      isPast: false,
      avatars: [
        'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=100&auto=format&fit=crop&q=80',
      ]
    }
  ]);

  const handleCreateEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !date || !location.trim()) return;

    const eventDate = new Date(date);
    const months = ['YAN', 'FEV', 'MAR', 'APR', 'MAY', 'İY N', 'İY L', 'AVQ', 'SEN', 'OKT', 'NOY', 'DEK'];
    const parsedCapacity = parseInt(capacity, 10);

    const newEvent: EventItem = {
      id: Date.now(),
      title,
      date,
      time: time.trim() || 'Vaxt təyin edilməyib',
      displayDate: {
        day: String(eventDate.getDate()).padStart(2, '0'),
        month: months[eventDate.getMonth()] || 'AVQ'
      },
      location,
      category,
      organizer: organizer.trim() || 'Tələbə Təşəbbüsü',
      capacity: !isNaN(parsedCapacity) && parsedCapacity > 0 ? parsedCapacity : 50,
      attendees: 1,
      description: description.trim() || 'Bu tədbir haqqında əlavə məlumat qeyd edilməyib.',
      isAttending: true,
      isPast: false,
      avatars: ['https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80']
    };

    setEvents([newEvent, ...events]);
    setTitle('');
    setDate('');
    setTime('');
    setLocation('');
    setOrganizer('');
    setCapacity('');
    setDescription('');
    setIsCreateModalOpen(false);
  };

  const toggleAttend = (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    setEvents(prev =>
      prev.map(ev => {
        if (ev.id === id) {
          const attending = !ev.isAttending;
          return {
            ...ev,
            isAttending: attending,
            attendees: attending ? ev.attendees + 1 : ev.attendees - 1
          };
        }
        return ev;
      })
    );

    if (selectedEvent && selectedEvent.id === id) {
      setSelectedEvent(prev =>
        prev
          ? {
            ...prev,
            isAttending: !prev.isAttending,
            attendees: !prev.isAttending ? prev.attendees + 1 : prev.attendees - 1
          }
          : null
      );
    }
  };

  const filteredEvents = events.filter(ev => {
    if (activeTab === 'Keçmiş Tədbirlər') {
      if (!ev.isPast) return false;
    } else if (activeTab !== 'Bütün Tədbirlər') {
      if (ev.isPast) return false;
      if (ev.category !== activeTab) return false;
    } else {
      if (ev.isPast) return false;
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      return (
        ev.title.toLowerCase().includes(query) ||
        ev.location.toLowerCase().includes(query) ||
        ev.organizer.toLowerCase().includes(query)
      );
    }

    return true;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', paddingBottom: '20px' }}>

      {/* Başlıq və Düymə */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 style={{ margin: 0, fontSize: '22px', fontWeight: '800', color: theme.textPrimary, letterSpacing: '-0.5px' }}>
            Universitet Tədbirləri
          </h2>
          <p style={{ margin: '4px 0 0 0', fontSize: '13.5px', color: theme.textSecondary }}>
            Kampus daxilində baş tutan seminarlar, yarışlar və görüşlərdə iştirak edin və ya yenisini təşkil edin.
          </p>
        </div>

        <button
          onClick={() => setIsCreateModalOpen(true)}
          style={{
            backgroundColor: isDarkMode ? '#23473D' : '#2E5B4E',
            color: '#FFFFFF',
            border: 'none',
            padding: '10px 18px',
            borderRadius: '12px',
            fontSize: '13.5px',
            fontWeight: '700',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: '0 4px 14px rgba(46, 91, 78, 0.25)',
            transition: 'all 0.2s ease'
          }}
        >
          <Plus size={18} /> Yeni Tədbir Yarat
        </button>
      </div>

      {/* Filtrlər və Axtarış */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {['Bütün Tədbirlər', 'Texnologiya', 'İdman', 'Karyera', 'Keçmiş Tədbirlər'].map(tab => {
            const isActive = activeTab === tab;
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  backgroundColor: isActive ? theme.activeTabBg : theme.inactiveTabBg,
                  color: isActive ? theme.activeTabText : theme.inactiveTabText,
                  border: 'none',
                  padding: '8px 16px',
                  borderRadius: '10px',
                  fontSize: '13px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                {tab}
              </button>
            );
          })}
        </div>

        <div style={{ position: 'relative', width: '100%', maxWidth: '280px' }}>
          <Search size={16} color={theme.textSecondary} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            placeholder="Tədbir, məkan və ya spiker axtar..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '8px 12px 8px 36px',
              borderRadius: '10px',
              border: '1px solid ' + theme.inputBorder,
              fontSize: '13px',
              outline: 'none',
              backgroundColor: theme.inputBg,
              color: theme.textPrimary,
              boxSizing: 'border-box'
            }}
          />
        </div>
      </div>

      {/* Tədbirlər Siyahısı */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {filteredEvents.length === 0 ? (
          <div style={{
            backgroundColor: theme.cardBg,
            borderRadius: '18px',
            padding: '36px',
            textAlign: 'center',
            border: '1px solid ' + theme.borderColor,
            color: theme.textSecondary
          }}>
            <Calendar size={36} style={{ marginBottom: '10px', opacity: 0.5 }} />
            <p style={{ margin: 0, fontSize: '15px', fontWeight: '600' }}>Uyğun tədbir tapılmadı.</p>
          </div>
        ) : (
          filteredEvents.map(ev => (
            <div
              key={ev.id}
              onClick={() => setSelectedEvent(ev)}
              style={{
                backgroundColor: theme.cardBg,
                borderRadius: '18px',
                padding: '18px 22px',
                border: '1px solid ' + theme.borderColor,
                display: 'flex',
                gap: '20px',
                alignItems: 'center',
                justifyContent: 'space-between',
                cursor: 'pointer',
                transition: 'transform 0.15s ease',
                opacity: ev.isPast ? 0.75 : 1
              }}
            >
              <div style={{ display: 'flex', gap: '18px', alignItems: 'center', flex: 1 }}>
                <div style={{
                  backgroundColor: ev.isPast ? (isDarkMode ? '#334155' : '#E2E8F0') : theme.dateBoxBg,
                  border: '1px solid ' + (ev.isPast ? (isDarkMode ? '#475569' : '#CBD5E1') : theme.dateBoxBorder),
                  borderRadius: '14px',
                  padding: '10px 14px',
                  textAlign: 'center',
                  minWidth: '54px',
                  flexShrink: 0
                }}>
                  <span style={{ display: 'block', fontSize: '20px', fontWeight: '800', color: ev.isPast ? theme.textSecondary : theme.dateBoxDayText, lineHeight: '1' }}>
                    {ev.displayDate.day}
                  </span>
                  <span style={{ display: 'block', fontSize: '11px', fontWeight: '700', color: ev.isPast ? theme.textMuted : theme.dateBoxMonthText, marginTop: '3px' }}>
                    {ev.displayDate.month}
                  </span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ backgroundColor: theme.badgeCategoryBg, color: theme.textMuted, fontSize: '11px', fontWeight: '700', padding: '2px 8px', borderRadius: '10px' }}>
                      {ev.category}
                    </span>
                    <span style={{ fontSize: '12px', color: theme.textSecondary }}>• {ev.organizer}</span>
                  </div>

                  <h4 style={{ margin: 0, fontSize: '15.5px', fontWeight: '700', color: theme.textPrimary }}>
                    {ev.title}
                  </h4>

                  <div style={{ display: 'flex', gap: '16px', fontSize: '12.5px', color: theme.textSecondary }}>
                    {ev.time && (
                      <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <Clock size={13} color={theme.textSecondary} /> {ev.time}
                      </span>
                    )}
                    <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <MapPin size={13} color={theme.textSecondary} /> {ev.location}
                    </span>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '18px', flexShrink: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  {ev.avatars && ev.avatars.length > 0 && (
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      {ev.avatars.map((imgUrl, idx) => (
                        <img
                          key={idx}
                          src={imgUrl}
                          alt="iştirakçı"
                          style={{
                            width: '26px',
                            height: '26px',
                            borderRadius: '50%',
                            border: '2px solid ' + theme.cardBg,
                            marginLeft: idx === 0 ? 0 : '-8px',
                            objectFit: 'cover'
                          }}
                        />
                      ))}
                    </div>
                  )}
                  <span style={{ fontSize: '12.5px', fontWeight: '600', color: theme.textSecondary, display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Users size={14} /> {ev.attendees} / {ev.capacity}
                  </span>
                </div>

                {!ev.isPast && (
                  <button
                    onClick={e => toggleAttend(e, ev.id)}
                    style={{
                      backgroundColor: ev.isAttending ? theme.attendingBtnBg : (isDarkMode ? '#23473D' : '#2E5B4E'),
                      color: ev.isAttending ? theme.attendingBtnText : '#FFFFFF',
                      border: ev.isAttending ? '1px solid ' + theme.attendingBtnBorder : 'none',
                      padding: '9px 16px',
                      borderRadius: '12px',
                      fontSize: '12.5px',
                      fontWeight: '700',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    {ev.isAttending ? (
                      <>
                        <CheckCircle2 size={15} /> Qeydiyyatdasınız
                      </>
                    ) : (
                      'İştirak Et'
                    )}
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Yeni Tədbir Yarat */}
      {isCreateModalOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: theme.modalOverlay,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '16px'
        }}>
          <div style={{
            backgroundColor: theme.cardBg,
            borderRadius: '20px',
            padding: '22px 26px',
            width: '100%',
            maxWidth: '560px',
            boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
            border: '1px solid ' + theme.borderColor,
            overflow: 'hidden'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ margin: 0, fontSize: '17px', fontWeight: '800', color: theme.textPrimary, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Sparkles size={18} color={isDarkMode ? '#4ADE80' : '#2E5B4E'} /> Yeni Tədbir Yarat
              </h3>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: theme.textSecondary, padding: '4px' }}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateEvent} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {/* Adı vı Kateqoriya */}
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '11.5px', fontWeight: '600', color: theme.textMuted, marginBottom: '4px' }}>
                    Tədbirin Adı *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Məsələn: AI və Gələcək Seminarı"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '8px 11px',
                      borderRadius: '8px',
                      border: '1px solid ' + theme.inputBorder,
                      fontSize: '12.5px',
                      outline: 'none',
                      backgroundColor: theme.inputBg,
                      color: theme.textPrimary,
                      boxSizing: 'border-box'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '11.5px', fontWeight: '600', color: theme.textMuted, marginBottom: '4px' }}>
                    Kateqoriya
                  </label>
                  <select
                    value={category}
                    onChange={e => setCategory(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '8px 11px',
                      borderRadius: '8px',
                      border: '1px solid ' + theme.inputBorder,
                      fontSize: '12.5px',
                      outline: 'none',
                      backgroundColor: theme.inputBg,
                      color: theme.textPrimary,
                      boxSizing: 'border-box'
                    }}
                  >
                    <option value="Texnologiya">Texnologiya</option>
                    <option value="İdman">İdman</option>
                    <option value="Karyera">Karyera</option>
                    <option value="Əyləncə">Əyləncə</option>
                  </select>
                </div>
              </div>

              {/* Tarix + Saat + Tutum */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '11.5px', fontWeight: '600', color: theme.textMuted, marginBottom: '4px' }}>
                    Tarix *
                  </label>
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={e => setDate(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '8px 8px',
                      borderRadius: '8px',
                      border: '1px solid ' + theme.inputBorder,
                      fontSize: '12px',
                      outline: 'none',
                      backgroundColor: theme.inputBg,
                      color: theme.textPrimary,
                      boxSizing: 'border-box'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '11.5px', fontWeight: '600', color: theme.textMuted, marginBottom: '4px' }}>
                    Saat
                  </label>
                  <input
                    type="text"
                    placeholder="14:00 - 16:00"
                    value={time}
                    onChange={e => setTime(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '8px 10px',
                      borderRadius: '8px',
                      border: '1px solid ' + theme.inputBorder,
                      fontSize: '12.5px',
                      outline: 'none',
                      backgroundColor: theme.inputBg,
                      color: theme.textPrimary,
                      boxSizing: 'border-box'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '11.5px', fontWeight: '600', color: theme.textMuted, marginBottom: '4px' }}>
                    Maks. Tutum
                  </label>
                  <input
                    type="number"
                    placeholder="50"
                    value={capacity}
                    onChange={e => setCapacity(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '8px 10px',
                      borderRadius: '8px',
                      border: '1px solid ' + theme.inputBorder,
                      fontSize: '12.5px',
                      outline: 'none',
                      backgroundColor: theme.inputBg,
                      color: theme.textPrimary,
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
              </div>

              {/* Məkan + Təşkilatçı */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '11.5px', fontWeight: '600', color: theme.textMuted, marginBottom: '4px' }}>
                    Məkan *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Əsas Bina, Zal A"
                    value={location}
                    onChange={e => setLocation(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '8px 11px',
                      borderRadius: '8px',
                      border: '1px solid ' + theme.inputBorder,
                      fontSize: '12.5px',
                      outline: 'none',
                      backgroundColor: theme.inputBg,
                      color: theme.textPrimary,
                      boxSizing: 'border-box'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '11.5px', fontWeight: '600', color: theme.textMuted, marginBottom: '4px' }}>
                    Təşkilatçı / Spiker
                  </label>
                  <input
                    type="text"
                    placeholder="Kompüter Klubu"
                    value={organizer}
                    onChange={e => setOrganizer(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '8px 11px',
                      borderRadius: '8px',
                      border: '1px solid ' + theme.inputBorder,
                      fontSize: '12.5px',
                      outline: 'none',
                      backgroundColor: theme.inputBg,
                      color: theme.textPrimary,
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
              </div>

              {/* Təsvir */}
              <div>
                <label style={{ display: 'block', fontSize: '11.5px', fontWeight: '600', color: theme.textMuted, marginBottom: '4px' }}>
                  Tədbir Haqqında (Təsvir)
                </label>
                <textarea
                  rows={2}
                  placeholder="Tədbir haqqında qısa məlumat..."
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 11px',
                    borderRadius: '8px',
                    border: '1px solid ' + theme.inputBorder,
                    fontSize: '12.5px',
                    outline: 'none',
                    backgroundColor: theme.inputBg,
                    color: theme.textPrimary,
                    boxSizing: 'border-box',
                    resize: 'none',
                    height: '52px'
                  }}
                />
              </div>

              {/* Düymə */}
              <button
                type="submit"
                style={{
                  marginTop: '6px',
                  backgroundColor: isDarkMode ? '#23473D' : '#2E5B4E',
                  color: '#FFFFFF',
                  border: 'none',
                  padding: '10px',
                  borderRadius: '10px',
                  fontSize: '13.5px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px'
                }}
              >
                <Plus size={16} /> Tədbiri Dərc Et
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Tədbir Detalları */}
      {selectedEvent && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: theme.modalOverlay,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '16px'
        }}>
          <div style={{
            backgroundColor: theme.cardBg,
            borderRadius: '20px',
            padding: '24px',
            width: '100%',
            maxWidth: '520px',
            border: '1px solid ' + theme.borderColor,
            overflow: 'hidden'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
              <div>
                <span style={{ backgroundColor: theme.badgeCategoryBg, color: theme.textMuted, fontSize: '11px', fontWeight: '700', padding: '2px 8px', borderRadius: '10px' }}>
                  {selectedEvent.category}
                </span>
                <h3 style={{ margin: '6px 0 0 0', fontSize: '18px', fontWeight: '800', color: theme.textPrimary }}>
                  {selectedEvent.title}
                </h3>
              </div>
              <button onClick={() => setSelectedEvent(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: theme.textSecondary }}>
                <X size={18} />
              </button>
            </div>

            <div style={{
              backgroundColor: theme.inputBg,
              borderRadius: '12px',
              padding: '12px 14px',
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '10px',
              marginBottom: '16px'
            }}>
              <div>
                <span style={{ display: 'block', fontSize: '11px', color: theme.textSecondary }}>Tarix & Saat</span>
                <span style={{ fontSize: '12.5px', fontWeight: '700', color: theme.textPrimary }}>{selectedEvent.date} ({selectedEvent.time})</span>
              </div>
              <div>
                <span style={{ display: 'block', fontSize: '11px', color: theme.textSecondary }}>Məkan</span>
                <span style={{ fontSize: '12.5px', fontWeight: '700', color: theme.textPrimary }}>{selectedEvent.location}</span>
              </div>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <p style={{ margin: 0, fontSize: '13px', color: theme.textSecondary, lineHeight: '1.4' }}>
                {selectedEvent.description}
              </p>
            </div>

            {!selectedEvent.isPast && (
              <button
                onClick={e => toggleAttend(e, selectedEvent.id)}
                style={{
                  width: '100%',
                  backgroundColor: selectedEvent.isAttending ? theme.attendingBtnBg : (isDarkMode ? '#23473D' : '#2E5B4E'),
                  color: selectedEvent.isAttending ? theme.attendingBtnText : '#FFFFFF',
                  border: selectedEvent.isAttending ? '1px solid ' + theme.attendingBtnBorder : 'none',
                  padding: '10px',
                  borderRadius: '10px',
                  fontSize: '13px',
                  fontWeight: '700',
                  cursor: 'pointer'
                }}
              >
                {selectedEvent.isAttending ? 'Qeydiyyatı Ləğv Et' : 'Tədbirə Qeydiyyatdan Keç'}
              </button>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
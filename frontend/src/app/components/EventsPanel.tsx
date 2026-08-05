"use client";
import React, { useState } from 'react';
import { MapPin, Users, Plus, CheckCircle2, Sparkles } from 'lucide-react';

interface EventsPanelProps {
  isDarkMode?: boolean;
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
  };

  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [location, setLocation] = useState('');
  const [category, setCategory] = useState('Texnologiya');

  const [events, setEvents] = useState([
    {
      id: 1,
      title: 'AI və Gələcək Seminarı',
      date: '2026-08-15',
      displayDate: { day: '15', month: 'AVQ' },
      location: 'Əsas Bina, Zal A',
      category: 'Texnologiya',
      organizer: 'Kompüter Klubu',
      attendees: 42,
      isAttending: false
    },
    {
      id: 2,
      title: 'Kampus daxili Şahmat Turniri',
      date: '2026-08-18',
      displayDate: { day: '18', month: 'AVQ' },
      location: 'Tələbə Mərkəzi',
      category: 'İdman',
      organizer: 'İdman Şurası',
      attendees: 18,
      isAttending: true
    },
    {
      id: 3,
      title: 'Karyera və İnternship Masterklassı',
      date: '2026-08-22',
      displayDate: { day: '22', month: 'AVQ' },
      location: 'Böyük Akt Zalı',
      category: 'Karyera',
      organizer: 'Karyera Mərkəzi',
      attendees: 85,
      isAttending: false
    }
  ]);

  const handleCreateEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !date || !location.trim()) return;

    const eventDate = new Date(date);
    const months = ['YAN', 'FEV', 'MAR', 'APR', 'MAY', 'İY N', 'İY L', 'AVQ', 'SEN', 'OKT', 'NOY', 'DEK'];

    const newEvent = {
      id: Date.now(),
      title,
      date,
      displayDate: {
        day: String(eventDate.getDate()).padStart(2, '0'),
        month: months[eventDate.getMonth()] || 'AVQ'
      },
      location,
      category,
      organizer: 'Tələbə Təşəbbüsü',
      attendees: 1,
      isAttending: true
    };

    setEvents([newEvent, ...events]);
    setTitle('');
    setDate('');
    setLocation('');
  };

  const toggleAttend = (id: number) => {
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
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', paddingBottom: '40px' }}>
      
      {/* Başlıq */}
      <div>
        <h2 style={{ margin: 0, fontSize: '22px', fontWeight: '800', color: theme.textPrimary, letterSpacing: '-0.5px' }}>
          Universitet Tədbirləri
        </h2>
        <p style={{ margin: '4px 0 0 0', fontSize: '13.5px', color: theme.textSecondary }}>
          Kampus daxilində baş tutan seminarlar, yarışlar və görüşlərdə iştirak edin və ya yenisini təşkil edin.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px', alignItems: 'start' }}>
        
        {/* Sol Sütun: Yeni Tədbir Yarat Formu */}
        <div style={{
          backgroundColor: theme.cardBg,
          padding: '24px',
          borderRadius: '20px',
          border: `1px solid ${theme.borderColor}`,
          boxShadow: '0 4px 12px rgba(0,0,0,0.03)'
        }}>
          <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: '700', color: theme.textPrimary, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Sparkles size={18} color={isDarkMode ? '#4ADE80' : '#2E5B4E'} /> Yeni Tədbir Yarat
          </h3>

          <form onSubmit={handleCreateEvent} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: theme.textMuted, marginBottom: '6px' }}>
                Tədbirin Adı
              </label>
              <input
                type="text"
                placeholder="Məl. AI və Gələcək Seminarı"
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
                  Tarix
                </label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
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
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: theme.textMuted, marginBottom: '6px' }}>
                  Kateqoriya
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
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
                  <option value="Texnologiya">Texnologiya</option>
                  <option value="İdman">İdman</option>
                  <option value="Karyera">Karyera</option>
                  <option value="Əyləncə">Əyləncə</option>
                </select>
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: theme.textMuted, marginBottom: '6px' }}>
                Məkan
              </label>
              <input
                type="text"
                placeholder="Məl. Əsas Bina, Zal A"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
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
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = isDarkMode ? '#2E5B4E' : '#23473D'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = isDarkMode ? '#23473D' : '#2E5B4E'}
            >
              <Plus size={16} /> Tədbir Əlavə Et
            </button>
          </form>
        </div>

        {/* Sağ Sütun: Tədbirlər Siyahısı */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {events.map((ev) => (
            <div
              key={ev.id}
              style={{
                backgroundColor: theme.cardBg,
                borderRadius: '18px',
                padding: '20px',
                border: `1px solid ${theme.borderColor}`,
                boxShadow: '0 4px 12px rgba(0,0,0,0.02)',
                display: 'flex',
                gap: '18px',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >
              {/* Sol Tarix Bloku */}
              <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                <div style={{
                  backgroundColor: theme.dateBoxBg,
                  border: `1px solid ${theme.dateBoxBorder}`,
                  borderRadius: '14px',
                  padding: '12px 16px',
                  textAlign: 'center',
                  minWidth: '54px',
                  flexShrink: 0
                }}>
                  <span style={{ display: 'block', fontSize: '20px', fontWeight: '800', color: theme.dateBoxDayText, lineHeight: '1' }}>
                    {ev.displayDate.day}
                  </span>
                  <span style={{ display: 'block', fontSize: '11px', fontWeight: '700', color: theme.dateBoxMonthText, marginTop: '4px' }}>
                    {ev.displayDate.month}
                  </span>
                </div>

                {/* Tədbir Məlumatı */}
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <span style={{ backgroundColor: theme.badgeCategoryBg, color: theme.textMuted, fontSize: '11px', fontWeight: '700', padding: '2px 8px', borderRadius: '12px' }}>
                      {ev.category}
                    </span>
                    <span style={{ fontSize: '12px', color: theme.textSecondary }}>• {ev.organizer}</span>
                  </div>

                  <h4 style={{ margin: '0 0 6px 0', fontSize: '15.5px', fontWeight: '700', color: theme.textPrimary }}>
                    {ev.title}
                  </h4>

                  <div style={{ display: 'flex', gap: '14px', fontSize: '12.5px', color: theme.textSecondary }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <MapPin size={14} color={theme.textSecondary} /> {ev.location}
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Users size={14} color={theme.textSecondary} /> {ev.attendees} İştirakçı
                    </span>
                  </div>
                </div>
              </div>

              {/* İştirak Düyməsi */}
              <button
                onClick={() => toggleAttend(ev.id)}
                style={{
                  backgroundColor: ev.isAttending ? theme.attendingBtnBg : (isDarkMode ? '#23473D' : '#2E5B4E'),
                  color: ev.isAttending ? theme.attendingBtnText : '#FFFFFF',
                  border: ev.isAttending ? `1px solid ${theme.attendingBtnBorder}` : 'none',
                  padding: '10px 16px',
                  borderRadius: '12px',
                  fontSize: '12.5px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.2s ease',
                  flexShrink: 0
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
            </div>
          ))}
        </div>

      </div>

    </div>
  );
}
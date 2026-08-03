"use client";
import React, { useState } from 'react';
import { Calendar, MapPin, Users, Plus, CheckCircle2, Clock, Sparkles, Tag } from 'lucide-react';

export default function EventsPanel() {
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
        <h2 style={{ margin: 0, fontSize: '22px', fontWeight: '800', color: '#0F172A', letterSpacing: '-0.5px' }}>
          Universitet Tədbirləri
        </h2>
        <p style={{ margin: '4px 0 0 0', fontSize: '13.5px', color: '#64748B' }}>
          Kampus daxilində baş tutan seminarlar, yarışlar və görüşlərdə iştirak edin və ya yenisini təşkil edin.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px', alignItems: 'start' }}>
        
        {/* Sol Sütun: Yeni Tədbir Yarat Formu */}
        <div style={{
          backgroundColor: '#FFFFFF',
          padding: '24px',
          borderRadius: '20px',
          border: '1px solid #E2E8F0',
          boxShadow: '0 4px 12px rgba(0,0,0,0.03)'
        }}>
          <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: '700', color: '#0F172A', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Sparkles size={18} color="#2E5B4E" /> Yeni Tədbir Yarat
          </h3>

          <form onSubmit={handleCreateEvent} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#475569', marginBottom: '6px' }}>
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
                    border: '1px solid #CBD5E1',
                    fontSize: '13px',
                    outline: 'none',
                    backgroundColor: '#F8FAFC',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#475569', marginBottom: '6px' }}>
                  Kateqoriya
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
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
                  <option value="Texnologiya">Texnologiya</option>
                  <option value="İdman">İdman</option>
                  <option value="Karyera">Karyera</option>
                  <option value="Əyləncə">Əyləncə</option>
                </select>
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#475569', marginBottom: '6px' }}>
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
                  border: '1px solid #CBD5E1',
                  fontSize: '13px',
                  outline: 'none',
                  backgroundColor: '#F8FAFC',
                  boxSizing: 'border-box'
                }}
              />
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
                backgroundColor: '#FFFFFF',
                borderRadius: '18px',
                padding: '20px',
                border: '1px solid #E2E8F0',
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
                  backgroundColor: '#ECFDF5',
                  border: '1px solid #A7F3D0',
                  borderRadius: '14px',
                  padding: '12px 16px',
                  textAlign: 'center',
                  minWidth: '54px',
                  flexShrink: 0
                }}>
                  <span style={{ display: 'block', fontSize: '20px', fontWeight: '800', color: '#2E5B4E', lineHeight: '1' }}>
                    {ev.displayDate.day}
                  </span>
                  <span style={{ display: 'block', fontSize: '11px', fontWeight: '700', color: '#059669', marginTop: '4px' }}>
                    {ev.displayDate.month}
                  </span>
                </div>

                {/* Tədbir Məlumatı */}
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <span style={{ backgroundColor: '#F1F5F9', color: '#475569', fontSize: '11px', fontWeight: '700', padding: '2px 8px', borderRadius: '12px' }}>
                      {ev.category}
                    </span>
                    <span style={{ fontSize: '12px', color: '#94A3B8' }}>• {ev.organizer}</span>
                  </div>

                  <h4 style={{ margin: '0 0 6px 0', fontSize: '15.5px', fontWeight: '700', color: '#0F172A' }}>
                    {ev.title}
                  </h4>

                  <div style={{ display: 'flex', gap: '14px', fontSize: '12.5px', color: '#64748B' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <MapPin size={14} color="#64748B" /> {ev.location}
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Users size={14} color="#64748B" /> {ev.attendees} İştirakçı
                    </span>
                  </div>
                </div>
              </div>

              {/* İştirak Düyməsi */}
              <button
                onClick={() => toggleAttend(ev.id)}
                style={{
                  backgroundColor: ev.isAttending ? '#ECFDF5' : '#2E5B4E',
                  color: ev.isAttending ? '#059669' : '#FFFFFF',
                  border: ev.isAttending ? '1px solid #A7F3D0' : 'none',
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
"use client";
import React, { useState } from 'react';
import { Heart, Send, Wind, BookOpen, Clock } from 'lucide-react';

interface MentalPanelProps {
  isDarkMode?: boolean;
}

export default function MentalPanel({ isDarkMode = false }: MentalPanelProps) {
  const theme = {
    cardBg: isDarkMode ? '#1E1E1E' : '#FFFFFF',
    textPrimary: isDarkMode ? '#FFFFFF' : '#111827',
    textSecondary: isDarkMode ? '#9CA3AF' : '#4B5563',
    inputBg: isDarkMode ? '#2A2A2A' : '#F9FAFB',
    borderColor: isDarkMode ? '#374151' : '#E5E7EB',
  };
  const [selectedMood, setSelectedMood] = useState<'Əla' | 'Normal' | 'Yorğun' | 'Stressli' | 'Həvəsli'>('Əla');
  const [noteText, setNoteText] = useState('');
  const [notes, setNotes] = useState([
    { id: 1, mood: 'Əla', text: 'Özünü çox gümrah hiss edirəm. İmtahan hazırlıqları yaxşı gedir!', date: '2026-08-03' },
    { id: 2, mood: 'Normal', text: 'Dərslər bir az sıx idi, amma axşam gəzintisi yaxşı gəldi.', date: '2026-08-02' }
  ]);

  const moods = [
    { label: 'Əla', emoji: '😊', color: '#10B981', bg: '#ECFDF5' },
    { label: 'Normal', emoji: '😐', color: '#6366F1', bg: '#EEF2FF' },
    { label: 'Yorğun', emoji: '😴', color: '#F59E0B', bg: '#FFFBEB' },
    { label: 'Stressli', emoji: '🤯', color: '#EF4444', bg: '#FEF2F2' },
    { label: 'Həvəsli', emoji: '💪', color: '#8B5CF6', bg: '#F5F3FF' },
  ];

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteText.trim()) return;

    const newNote = {
      id: Date.now(),
      mood: selectedMood,
      text: noteText,
      date: new Date().toISOString().split('T')[0]
    };

    setNotes([newNote, ...notes]);
    setNoteText('');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', paddingBottom: '40px' }}>

      {/* Brend Yaşılına Uyğunlaşdırılmış Rahatladıcı Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #1E3E35 0%, #2E5B4E 50%, #44766C 100%)',
        borderRadius: '20px',
        padding: '28px 32px',
        color: '#FFFFFF',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        boxShadow: '0 10px 25px -5px rgba(46, 91, 78, 0.25)'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <span style={{ backgroundColor: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(4px)', padding: '4px 10px', borderRadius: '20px', fontSize: '11.5px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '4px' }}>
              Mental Mərkəz
            </span>
          </div>
          <h2 style={{ margin: 0, fontSize: '24px', fontWeight: '800', letterSpacing: '-0.5px' }}>
            Zehninizi dinləyin, hisslərinizi kəşf edin!
          </h2>
          <p style={{ margin: '6px 0 0 0', fontSize: '13.5px', opacity: 0.9, maxWidth: '520px', lineHeight: '1.5' }}>
            Hər emosiya təbiidir. Gündəlik əhval-ruhiyyənizi qeyd edin və zehni balansı qorumaq üçün tövsiyələrdən yararlanın.
          </p>
        </div>
        <div style={{ background: 'rgba(255,255,255,0.08)', padding: '16px 20px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.15)', textAlign: 'center' }}>
          <span style={{ fontSize: '11.5px', opacity: 0.8, display: 'block', fontWeight: '500' }}>Günün Sözü</span>
          <p style={{ margin: '4px 0 0 0', fontSize: '12.5px', fontWeight: '700', fontStyle: 'italic', maxWidth: '180px', color: '#ECFDF5' }}>
            "Nəfəsinizə fokuslanın, anı yaşayın."
          </p>
        </div>
      </div>

      {/* Əsas Şəbəkə: Əhval Qeydiyyatı + Qeydlər */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '20px' }}>

        {/* Əhval-ruhiyyə Daxil Etmə Kartı */}
        <div style={{
          backgroundColor: theme.cardBg,
          padding: '24px',
          borderRadius: '20px',
          border: `1px solid ${theme.borderColor}`,
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.03)'
        }}>
          <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: '700', color: theme.textPrimary, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Heart size={18} color="#EF4444" /> Özünüzü necə hiss edirsiniz?
          </h3>

          {/* Emoji Düymələri */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '8px', marginBottom: '20px' }}>
            {moods.map((m) => {
              const isSelected = selectedMood === m.label;
              return (
                <button
                  key={m.label}
                  type="button"
                  onClick={() => setSelectedMood(m.label as any)}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '12px 6px',
                    borderRadius: '12px',
                    border: isSelected ? `2px solid ${m.color}` : `1px solid ${theme.borderColor}`,
                    backgroundColor: theme.cardBg,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    transform: isSelected ? 'scale(1.03)' : 'scale(1)'
                  }}
                >
                  <span style={{ fontSize: '22px' }}>{m.emoji}</span>
                  <span style={{ fontSize: '11px', fontWeight: '600', color: isSelected ? m.color : theme.textSecondary }}>{m.label}</span>
                </button>
              );
            })}
          </div>

          {/* Mətn Formu */}
          <form onSubmit={handleAddNote} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <textarea
              rows={4}
              placeholder="Ağlınızdan nələr keçir? Qısaca qeyd edin..."
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              style={{
                width: '100%',
                padding: '14px',
                borderRadius: '12px',
                border: `1px solid ${theme.borderColor}`,
                fontSize: '13.5px',
                outline: 'none',
                resize: 'none',
                boxSizing: 'border-box',
                backgroundColor: theme.cardBg,
                fontFamily: 'inherit'
              }}
            />
            <button
              type="submit"
              style={{
                backgroundColor: '#2E5B4E',
                color: '#FFFFFF',
                border: 'none',
                padding: '12px',
                borderRadius: '12px',
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
              <Send size={16} />
              Gündəliyə Əlavə Et
            </button>
          </form>
        </div>

        {/* Son Qeydlər Kartı */}
        <div style={{
          backgroundColor: theme.cardBg,
          padding: '24px',
          borderRadius: '20px',
          border: `1px solid ${theme.borderColor}`,
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.03)',
          display: 'flex',
          flexDirection: 'column'
        }}>
          <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: '700', color: theme.textPrimary, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <BookOpen size={18} color={theme.textPrimary} /> Son Qeydləriniz
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', overflowY: 'auto', maxHeight: '300px', paddingRight: '4px' }}>
            {notes.map((note) => {
              const moodObj = moods.find(m => m.label === note.mood) || moods[0];
              return (
                <div
                  key={note.id}
                  style={{
                    padding: '14px',
                    borderRadius: '12px',
                    backgroundColor: theme.cardBg,
                    borderLeft: `4px solid ${moodObj.color}`,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '6px'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{
                      fontSize: '11px',
                      fontWeight: '700',
                      color: moodObj.color,
                      backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : moodObj.bg,
                      padding: '2px 8px',
                      borderRadius: '12px'
                    }}>
                      {moodObj.emoji} {note.mood}
                    </span>
                    <span style={{ fontSize: '11px', color: theme.textSecondary }}>{note.date}</span>
                  </div>
                  <p style={{ margin: 0, fontSize: '13px', color: theme.textPrimary, lineHeight: '1.4' }}>
                    {note.text}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* Sürətli Mental Məşqlər */}
      <div style={{
        backgroundColor: theme.cardBg,
        padding: '24px',
        borderRadius: '20px',
        border: `1px solid ${theme.borderColor}`,
        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.03)'
      }}>
        <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: '700', color: theme.textPrimary, display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Wind size={18} color="#10B981" /> Sürətli Rahatlama Məşqləri
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>

          <div style={{ border: `1px solid ${theme.borderColor}`, padding: '16px', borderRadius: '14px', backgroundColor: theme.cardBg, display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontWeight: '700', fontSize: '14px', color: theme.textPrimary }}>Nəfəs Məşqi</span>
              <Clock size={14} color={theme.textPrimary} />
            </div>
            <p style={{ margin: 0, fontSize: '12px', color: theme.textSecondary, lineHeight: '1.3' }}>
              4-7-8 texnikası ilə həyəcanı və stressi azaldın.
            </p>
            <button style={{ marginTop: '8px', background: '#10B981', color: '#FFF', border: 'none', padding: '8px', borderRadius: '8px', fontSize: '12px', fontWeight: '600', cursor: 'pointer' }}>
              Başla (3 dəq)
            </button>
          </div>

          <div style={{ border: `1px solid ${theme.borderColor}`, padding: '16px', borderRadius: '14px', backgroundColor: theme.cardBg, display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontWeight: '700', fontSize: '14px', color: theme.textPrimary }}>Fokus Meditasiyası</span>
              <Clock size={14} color={theme.textPrimary} />
            </div>
            <p style={{ margin: 0, fontSize: '12px', color: theme.textSecondary, lineHeight: '1.3' }}>
              Dərs öncəsi diqqəti toplamaq üçün mini seans.
            </p>
            <button style={{ marginTop: '8px', background: '#2E5B4E', color: '#FFF', border: 'none', padding: '8px', borderRadius: '8px', fontSize: '12px', fontWeight: '600', cursor: 'pointer' }}>
              Dinlə (5 dəq)
            </button>
          </div>

          <div style={{ border: `1px solid ${theme.borderColor}`, padding: '16px', borderRadius: '14px', backgroundColor: theme.cardBg, display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontWeight: '700', fontSize: '14px', color: theme.textPrimary }}>Pozitiv Affirmasiya</span>
              <Clock size={14} color={theme.textPrimary} />
            </div>
            <p style={{ margin: 0, fontSize: '12px', color: theme.textSecondary, lineHeight: '1.3' }}>
              Özünə inamı bərpa etmək üçün gündəlik cümlələr.
            </p>
            <button style={{ marginTop: '8px', background: '#8B5CF6', color: '#FFF', border: 'none', padding: '8px', borderRadius: '8px', fontSize: '12px', fontWeight: '600', cursor: 'pointer' }}>
              Oxu (2 dəq)
            </button>
          </div>

        </div>
      </div>

    </div>
  );
}
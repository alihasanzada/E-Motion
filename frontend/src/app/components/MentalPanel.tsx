'use client';
import { useState } from 'react';
import ExerciseModal, { ExerciseType } from './ExerciseModal';

interface MentalPanelProps {
  isDarkMode?: boolean;
}

interface JournalEntry {
  id: string;
  mood: string;
  moodLabel: string;
  note: string;
  date: string;
}

const moodOptions = [
  { emoji: '😊', label: 'Əla', val: 'great' },
  { emoji: '😐', label: 'Normal', val: 'normal' },
  { emoji: '🥳', label: 'Yorğun', val: 'tired' },
  { emoji: '🤯', label: 'Stressli', val: 'stressed' },
  { emoji: '💪', label: 'Həvəsli', val: 'motivated' },
];

export default function MentalPanel({ isDarkMode }: MentalPanelProps) {
  const [selectedMood, setSelectedMood] = useState('great');
  const [journalNote, setJournalNote] = useState('');
  const [activeExercise, setActiveExercise] = useState<ExerciseType>(null);

  const [entries, setEntries] = useState<JournalEntry[]>([
    {
      id: '1',
      mood: '😊',
      moodLabel: 'Əla',
      note: 'Özünü çox gümrah hiss edirəm. İmtahan hazırlıqları yaxşı gedir!',
      date: '2026-08-03',
    },
    {
      id: '2',
      mood: '😐',
      moodLabel: 'Normal',
      note: 'Dərslər bir az sıx idi, amma axşam gəzintisi yaxşı gəldi.',
      date: '2026-08-02',
    },
  ]);

  const handleAddEntry = () => {
    if (!journalNote.trim()) return;
    const moodObj = moodOptions.find((m) => m.val === selectedMood);
    const newEntry: JournalEntry = {
      id: Date.now().toString(),
      mood: moodObj?.emoji || '😊',
      moodLabel: moodObj?.label || 'Əla',
      note: journalNote,
      date: new Date().toISOString().split('T')[0],
    };
    setEntries([newEntry, ...entries]);
    setJournalNote('');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', width: '100%' }}>

      {/* Orijinal Başlıq */}
      <div>
        <h2 style={{ fontSize: '24px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '10px', color: isDarkMode ? '#fff' : '#000', margin: '0 0 6px 0' }}>
          <span>🧠</span> Mental Sağlamlıq və İntizam
        </h2>
        <p style={{ color: isDarkMode ? '#a1a1aa' : '#666', fontSize: '14px', margin: 0 }}>
          Günün gərginliyini azaltmaq və diqqətini toplamaq üçün interaktiv məşqləri sına.
        </p>
      </div>

      {/* Əsas Panel Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>

        {/* Sol Tərəf: Emosiya və Gündəlik Qeydi */}
        <div style={{
          backgroundColor: isDarkMode ? '#18181b' : '#fff',
          border: `1px solid ${isDarkMode ? '#27272a' : '#e4e4e7'}`,
          borderRadius: '16px',
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px'
        }}>
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'space-between' }}>
            {moodOptions.map((m) => {
              const isSelected = selectedMood === m.val;
              return (
                <button
                  key={m.val}
                  onClick={() => setSelectedMood(m.val)}
                  style={{
                    flex: 1,
                    padding: '12px 8px',
                    borderRadius: '12px',
                    border: isSelected ? '2px solid #10b981' : `1px solid ${isDarkMode ? '#3f3f46' : '#e4e4e7'}`,
                    backgroundColor: isSelected ? (isDarkMode ? '#064e3b' : '#ecfdf5') : 'transparent',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '4px',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <span style={{ fontSize: '22px' }}>{m.emoji}</span>
                  <span style={{ fontSize: '12px', fontWeight: isSelected ? 'bold' : 'normal', color: isDarkMode ? '#f4f4f5' : '#18181b' }}>
                    {m.label}
                  </span>
                </button>
              );
            })}
          </div>

          <textarea
            value={journalNote}
            onChange={(e) => setJournalNote(e.target.value)}
            placeholder="Ağlınızdan nələr keçir? Qısaca qeyd edin..."
            style={{
              width: '100%',
              height: '100px',
              padding: '12px',
              borderRadius: '12px',
              border: `1px solid ${isDarkMode ? '#3f3f46' : '#e4e4e7'}`,
              backgroundColor: isDarkMode ? '#09090b' : '#fafafa',
              color: isDarkMode ? '#fff' : '#000',
              resize: 'none',
              outline: 'none',
              fontSize: '14px'
            }}
          />

          <button
            onClick={handleAddEntry}
            style={{
              width: '100%',
              padding: '12px',
              backgroundColor: '#10b981',
              color: '#fff',
              border: 'none',
              borderRadius: '10px',
              fontWeight: 'bold',
              cursor: 'pointer',
              fontSize: '14px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
          >
            <span>🚀</span> Gündəliyə Əlavə Et
          </button>
        </div>

        {/* Sağ Tərəf: Gündəlik Tarixçəsi */}
        <div style={{
          backgroundColor: isDarkMode ? '#18181b' : '#fff',
          border: `1px solid ${isDarkMode ? '#27272a' : '#e4e4e7'}`,
          borderRadius: '16px',
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          maxHeight: '260px',
          overflowY: 'auto'
        }}>
          {entries.map((item) => (
            <div
              key={item.id}
              style={{
                backgroundColor: isDarkMode ? '#09090b' : '#fafafa',
                borderLeft: '4px solid #10b981',
                borderRadius: '8px',
                padding: '12px 14px'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span style={{ fontSize: '12px', fontWeight: 'bold', backgroundColor: isDarkMode ? '#27272a' : '#e4e4e7', padding: '2px 8px', borderRadius: '12px', color: isDarkMode ? '#fff' : '#000' }}>
                  {item.mood} {item.moodLabel}
                </span>
                <span style={{ fontSize: '11px', color: isDarkMode ? '#71717a' : '#a1a1aa' }}>
                  {item.date}
                </span>
              </div>
              <p style={{ fontSize: '13px', margin: 0, color: isDarkMode ? '#d4d4d8' : '#3f3f46', lineHeight: '1.4' }}>
                {item.note}
              </p>
            </div>
          ))}
        </div>

      </div>

      {/* Aşağı Hissə: Sürətli Rahatlama Məşqləri (Orijinal Kart Dizaynı) */}
      <div style={{
        backgroundColor: isDarkMode ? '#18181b' : '#fff',
        border: `1px solid ${isDarkMode ? '#27272a' : '#e4e4e7'}`,
        borderRadius: '16px',
        padding: '24px'
      }}>
        <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px', color: isDarkMode ? '#fff' : '#000' }}>
          <span>🍃</span> Sürətli Rahatlama Məşqləri
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>

          {/* Nəfəs Məşqi */}
          <div style={{
            backgroundColor: isDarkMode ? '#09090b' : '#f4f4f5',
            border: `1px solid ${isDarkMode ? '#27272a' : '#e4e4e7'}`,
            borderRadius: '14px',
            padding: '16px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}>
            <div>
              <h4 style={{ fontSize: '15px', fontWeight: 'bold', margin: '0 0 6px', color: isDarkMode ? '#fff' : '#000' }}>
                Nəfəs Məşqi ⏱️
              </h4>
              <p style={{ fontSize: '12px', color: isDarkMode ? '#a1a1aa' : '#71717a', margin: '0 0 16px' }}>
                4-7-8 texnikası ilə həyəcanı və stresi azaldın.
              </p>
            </div>
            <button
              onClick={() => setActiveExercise('breathing')}
              style={{
                width: '100%',
                padding: '10px',
                backgroundColor: '#10b981',
                color: '#fff',
                border: 'none',
                borderRadius: '8px',
                fontWeight: 'bold',
                cursor: 'pointer',
                fontSize: '13px'
              }}
            >
              Başla (3 dəq)
            </button>
          </div>

          {/* Fokus Meditasiyası */}
          <div style={{
            backgroundColor: isDarkMode ? '#09090b' : '#f4f4f5',
            border: `1px solid ${isDarkMode ? '#27272a' : '#e4e4e7'}`,
            borderRadius: '14px',
            padding: '16px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}>
            <div>
              <h4 style={{ fontSize: '15px', fontWeight: 'bold', margin: '0 0 6px', color: isDarkMode ? '#fff' : '#000' }}>
                Fokus Meditasiyası ⏱️
              </h4>
              <p style={{ fontSize: '12px', color: isDarkMode ? '#a1a1aa' : '#71717a', margin: '0 0 16px' }}>
                Dərs öncəsi diqqəti toplamaq üçün mini seans.
              </p>
            </div>
            <button
              onClick={() => setActiveExercise('meditation')}
              style={{
                width: '100%',
                padding: '10px',
                backgroundColor: '#059669',
                color: '#fff',
                border: 'none',
                borderRadius: '8px',
                fontWeight: 'bold',
                cursor: 'pointer',
                fontSize: '13px'
              }}
            >
              Dinlə (5 dəq)
            </button>
          </div>

          {/* Pozitiv Affirmasiya */}
          <div style={{
            backgroundColor: isDarkMode ? '#09090b' : '#f4f4f5',
            border: `1px solid ${isDarkMode ? '#27272a' : '#e4e4e7'}`,
            borderRadius: '14px',
            padding: '16px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}>
            <div>
              <h4 style={{ fontSize: '15px', fontWeight: 'bold', margin: '0 0 6px', color: isDarkMode ? '#fff' : '#000' }}>
                Pozitiv Affirmasiya ⏱️
              </h4>
              <p style={{ fontSize: '12px', color: isDarkMode ? '#a1a1aa' : '#71717a', margin: '0 0 16px' }}>
                Özünə inamı bərpa etmək üçün gündəlik cümlələr.
              </p>
            </div>
            <button
              onClick={() => setActiveExercise('affirmation')}
              style={{
                width: '100%',
                padding: '10px',
                backgroundColor: '#8b5cf6',
                color: '#fff',
                border: 'none',
                borderRadius: '8px',
                fontWeight: 'bold',
                cursor: 'pointer',
                fontSize: '13px'
              }}
            >
              Oxu (2 dəq)
            </button>
          </div>

        </div>
      </div>

      {/* Ayrı Modul Component çağırışı */}
      <ExerciseModal
        type={activeExercise}
        onClose={() => setActiveExercise(null)}
        isDarkMode={isDarkMode}
      />

    </div>
  );
}
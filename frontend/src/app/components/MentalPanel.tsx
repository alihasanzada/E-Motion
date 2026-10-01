'use client';
import { useState, useEffect } from 'react';
import ExerciseModal, { ExerciseType } from './ExerciseModal';
import { toast } from 'sonner';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://e-motion-7vds.onrender.com';

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

  useEffect(() => {
    const saved = localStorage.getItem('mental_journal_entries');
    if (saved) {
      try {
        setEntries(JSON.parse(saved));
      } catch (e) {
        console.error('Mental qeydlər oxunarkən xəta:', e);
      }
    }

    const fetchBackendMoods = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/moods`);
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            const mapped: JournalEntry[] = data.map((item: any) => {
              const matchedMood =
                moodOptions.find(
                  m => m.label.toLowerCase() === (item.mood || '').toLowerCase()
                ) || moodOptions[0];

              return {
                id: item.id?.toString() || Date.now().toString(),
                mood: matchedMood.emoji,
                moodLabel: item.mood || matchedMood.label,
                note: item.note || '',
                date: item.date || new Date().toISOString().split('T')[0]
              };
            });

            setEntries(mapped);
            localStorage.setItem(
              'mental_journal_entries',
              JSON.stringify(mapped)
            );
          }
        }
      } catch (err) {
        console.warn('Backend moods çəkilə bilmədi:', err);
      }
    };

    fetchBackendMoods();
  }, []);

  const handleAddEntry = async () => {
    if (!journalNote.trim()) return;

    const moodObj = moodOptions.find((m) => m.val === selectedMood);

    const newEntry: JournalEntry = {
      id: Date.now().toString(),
      mood: moodObj?.emoji || '😊',
      moodLabel: moodObj?.label || 'Əla',
      note: journalNote,
      date: new Date().toISOString().split('T')[0],
    };

    const updated = [newEntry, ...entries];

    setEntries(updated);
    localStorage.setItem(
      'mental_journal_entries',
      JSON.stringify(updated)
    );

    setJournalNote('');

    toast.success('Əhval qeydiniz uğurla əlavə edildi!');

    try {
      await fetch(`${API_BASE_URL}/api/moods`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mood: moodObj?.label || 'Əla',
          note: journalNote
        })
      });
    } catch (err) {
      console.warn('Backend mood göndərilmədi:', err);
    }
  };

  return (
    <div
      className="mental-panel"
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '24px',
        width: '100%',
        minWidth: 0
      }}
    >

      {/* Başlıq */}
      <div className="mental-header">
        <h2
          style={{
            fontSize: '24px',
            fontWeight: 'bold',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            color: isDarkMode ? '#fff' : '#000',
            margin: '0 0 6px 0'
          }}
        >
          <span></span>
        </h2>

        <p
          style={{
            color: isDarkMode ? '#a1a1aa' : '#666',
            fontSize: '14px',
            margin: 0
          }}
        >
          Günün gərginliyini azaltmaq və diqqətini toplamaq üçün interaktiv
          məşqləri sına.
        </p>
      </div>

      {/* Əsas Panel Grid */}
      <div
        className="mental-main-grid"
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '20px',
          width: '100%',
          minWidth: 0
        }}
      >

        {/* Sol Tərəf: Emosiya və Gündəlik Qeydi */}
        <div
          className="mental-journal-card"
          style={{
            backgroundColor: isDarkMode ? '#18181b' : '#fff',
            border: `1px solid ${isDarkMode ? '#27272a' : '#e4e4e7'}`,
            borderRadius: '16px',
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            minWidth: 0
          }}
        >
          <div
            className="mood-options"
            style={{
              display: 'flex',
              gap: '10px',
              justifyContent: 'space-between'
            }}
          >
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
                    border: isSelected
                      ? '2px solid #10b981'
                      : `1px solid ${isDarkMode ? '#3f3f46' : '#e4e4e7'}`,
                    backgroundColor: isSelected
                      ? (isDarkMode ? '#064e3b' : '#ecfdf5')
                      : 'transparent',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '4px',
                    transition: 'all 0.2s ease',
                    minWidth: 0
                  }}
                >
                  <span style={{ fontSize: '22px' }}>{m.emoji}</span>

                  <span
                    style={{
                      fontSize: '12px',
                      fontWeight: isSelected ? 'bold' : 'normal',
                      color: isDarkMode ? '#f4f4f5' : '#18181b',
                      whiteSpace: 'nowrap'
                    }}
                  >
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
              fontSize: '14px',
              boxSizing: 'border-box'
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
            <span></span> Gündəliyə Əlavə Et
          </button>
        </div>

        {/* Sağ Tərəf: Gündəlik Tarixçəsi */}
        <div
          className="mental-history-card"
          style={{
            backgroundColor: isDarkMode ? '#18181b' : '#fff',
            border: `1px solid ${isDarkMode ? '#27272a' : '#e4e4e7'}`,
            borderRadius: '16px',
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            maxHeight: '260px',
            overflowY: 'auto',
            minWidth: 0
          }}
        >
          {entries.map((item) => (
            <div
              key={item.id}
              style={{
                backgroundColor: isDarkMode ? '#09090b' : '#fafafa',
                borderLeft: '4px solid #10b981',
                borderRadius: '8px',
                padding: '12px 14px',
                minWidth: 0
              }}
            >
              <div
                className="journal-entry-header"
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginBottom: '6px',
                  gap: '8px',
                  alignItems: 'center'
                }}
              >
                <span
                  style={{
                    fontSize: '12px',
                    fontWeight: 'bold',
                    backgroundColor: isDarkMode ? '#27272a' : '#e4e4e7',
                    padding: '2px 8px',
                    borderRadius: '12px',
                    color: isDarkMode ? '#fff' : '#000',
                    minWidth: 0,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  }}
                >
                  {item.mood} {item.moodLabel}
                </span>

                <span
                  style={{
                    fontSize: '11px',
                    color: isDarkMode ? '#71717a' : '#a1a1aa',
                    flexShrink: 0
                  }}
                >
                  {item.date}
                </span>
              </div>

              <p
                style={{
                  fontSize: '13px',
                  margin: 0,
                  color: isDarkMode ? '#d4d4d8' : '#3f3f46',
                  lineHeight: '1.4',
                  overflowWrap: 'anywhere'
                }}
              >
                {item.note}
              </p>
            </div>
          ))}
        </div>

      </div>

      {/* Sürətli Rahatlama Məşqləri */}
      <div
        className="relaxation-card"
        style={{
          backgroundColor: isDarkMode ? '#18181b' : '#fff',
          border: `1px solid ${isDarkMode ? '#27272a' : '#e4e4e7'}`,
          borderRadius: '16px',
          padding: '24px',
          width: '100%',
          minWidth: 0
        }}
      >
        <h3
          style={{
            fontSize: '18px',
            fontWeight: 'bold',
            marginBottom: '16px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            color: isDarkMode ? '#fff' : '#000'
          }}
        >
          <span>🍃</span> Sürətli Rahatlama Məşqləri
        </h3>

        <div
          className="relaxation-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '16px',
            width: '100%',
            minWidth: 0
          }}
        >

          {/* Nəfəs Məşqi */}
          <div
            className="relaxation-item"
            style={{
              backgroundColor: isDarkMode ? '#09090b' : '#f4f4f5',
              border: `1px solid ${isDarkMode ? '#27272a' : '#e4e4e7'}`,
              borderRadius: '14px',
              padding: '16px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              minWidth: 0
            }}
          >
            <div>
              <h4
                style={{
                  fontSize: '15px',
                  fontWeight: 'bold',
                  margin: '0 0 6px',
                  color: isDarkMode ? '#fff' : '#000'
                }}
              >
                Nəfəs Məşqi ⏱️
              </h4>

              <p
                style={{
                  fontSize: '12px',
                  color: isDarkMode ? '#a1a1aa' : '#71717a',
                  margin: '0 0 16px'
                }}
              >
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
          <div
            className="relaxation-item"
            style={{
              backgroundColor: isDarkMode ? '#09090b' : '#f4f4f5',
              border: `1px solid ${isDarkMode ? '#27272a' : '#e4e4e7'}`,
              borderRadius: '14px',
              padding: '16px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              minWidth: 0
            }}
          >
            <div>
              <h4
                style={{
                  fontSize: '15px',
                  fontWeight: 'bold',
                  margin: '0 0 6px',
                  color: isDarkMode ? '#fff' : '#000'
                }}
              >
                Fokus Meditasiyası ⏱️
              </h4>

              <p
                style={{
                  fontSize: '12px',
                  color: isDarkMode ? '#a1a1aa' : '#71717a',
                  margin: '0 0 16px'
                }}
              >
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
          <div
            className="relaxation-item"
            style={{
              backgroundColor: isDarkMode ? '#09090b' : '#f4f4f5',
              border: `1px solid ${isDarkMode ? '#27272a' : '#e4e4e7'}`,
              borderRadius: '14px',
              padding: '16px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              minWidth: 0
            }}
          >
            <div>
              <h4
                style={{
                  fontSize: '15px',
                  fontWeight: 'bold',
                  margin: '0 0 6px',
                  color: isDarkMode ? '#fff' : '#000'
                }}
              >
                Pozitiv Affirmasiya ⏱️
              </h4>

              <p
                style={{
                  fontSize: '12px',
                  color: isDarkMode ? '#a1a1aa' : '#71717a',
                  margin: '0 0 16px'
                }}
              >
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

      <ExerciseModal
        type={activeExercise}
        onClose={() => setActiveExercise(null)}
        isDarkMode={isDarkMode}
      />

      {/* Responsive qaydalar */}
      <style jsx>{`
        .mental-panel {
          overflow-x: hidden;
        }

        .mental-main-grid,
        .relaxation-grid {
          min-width: 0;
        }

        @media (max-width: 900px) {
          .mental-main-grid {
            grid-template-columns: 1fr !important;
          }

          .mental-history-card {
            max-height: 320px !important;
          }

          .relaxation-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
          }
        }

        @media (max-width: 600px) {
          .mental-panel {
            gap: 16px !important;
          }

          .mental-header p {
            font-size: 12px !important;
            line-height: 1.5 !important;
          }

          .mental-journal-card,
          .mental-history-card,
          .relaxation-card {
            padding: 14px !important;
            border-radius: 12px !important;
          }

          .mood-options {
            display: grid !important;
            grid-template-columns: repeat(5, minmax(0, 1fr)) !important;
            gap: 5px !important;
          }

          .mood-options button {
            padding: 8px 3px !important;
            border-radius: 9px !important;
          }

          .mood-options button span:first-child {
            font-size: 18px !important;
          }

          .mood-options button span:last-child {
            font-size: 9px !important;
          }

          .journal-entry-header {
            align-items: flex-start !important;
          }

          .journal-entry-header span:first-child {
            white-space: normal !important;
          }

          .relaxation-grid {
            grid-template-columns: 1fr !important;
            gap: 10px !important;
          }

          .relaxation-item {
            padding: 12px !important;
          }

          .relaxation-item h4 {
            font-size: 14px !important;
          }

          .relaxation-item p {
            font-size: 11px !important;
            line-height: 1.4 !important;
          }
        }

        @media (max-width: 400px) {
          .mental-journal-card,
          .mental-history-card,
          .relaxation-card {
            padding: 10px !important;
          }

          .mood-options {
            gap: 3px !important;
          }

          .mood-options button {
            padding: 7px 2px !important;
          }

          .mood-options button span:first-child {
            font-size: 16px !important;
          }

          .mood-options button span:last-child {
            font-size: 8px !important;
          }

          .journal-entry-header {
            flex-direction: column !important;
            gap: 4px !important;
          }

          .journal-entry-header span {
            max-width: 100% !important;
          }
        }
      `}</style>
    </div>
  );
}
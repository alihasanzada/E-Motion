'use client';
import { useState, useEffect } from 'react';

type ExerciseType = 'breathing' | 'meditation' | 'affirmation' | null;

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

const affirmations = [
  "Mən özümə və zəkama tamamilə inanıram.",
  "Hər çətinlik məni daha da təcrübəli və güclü edir.",
  "Bu gün diqqətimi sakitliyə və uğura kökləyirəm.",
  "Zehnim aydın, bədənim tamamilə rahatdır.",
  "Məqsədlərimə doğru addım-addım əminliklə irəliləyirəm.",
  "Səhvlərim mənim öyrənmə prosesimin təbii hissəsidir.",
  "Öz templə irəliləyirəm və nəticələrimlə fəxr edirəm."
];

export default function MentalPanel({ isDarkMode }: MentalPanelProps) {
  const [selectedMood, setSelectedMood] = useState('great');
  const [journalNote, setJournalNote] = useState('');
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

  const [activeExercise, setActiveExercise] = useState<ExerciseType>(null);

  const [breathPhase, setBreathPhase] = useState<'Inhale' | 'Hold' | 'Exhale'>('Inhale');
  const [breathTimer, setBreathTimer] = useState(4);

  const [meditationTime, setMeditationTime] = useState(300);
  const [isMeditating, setIsMeditating] = useState(false);

  const [affIndex, setAffIndex] = useState(0);

  useEffect(() => {
    if (activeExercise === 'breathing') {
      setBreathPhase('Inhale');
      setBreathTimer(4);
    } else if (activeExercise === 'meditation') {
      setMeditationTime(300);
      setIsMeditating(false);
    } else if (activeExercise === 'affirmation') {
      setAffIndex(0);
    }
  }, [activeExercise]);

  useEffect(() => {
    if (activeExercise !== 'breathing') return;
    const interval = setInterval(() => {
      setBreathTimer((prev) => {
        if (prev > 1) return prev - 1;
        if (breathPhase === 'Inhale') { setBreathPhase('Hold'); return 7; }
        else if (breathPhase === 'Hold') { setBreathPhase('Exhale'); return 8; }
        else { setBreathPhase('Inhale'); return 4; }
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [activeExercise, breathPhase]);

  useEffect(() => {
    if (activeExercise !== 'meditation' || !isMeditating) return;
    const interval = setInterval(() => {
      setMeditationTime((prev) => {
        if (prev <= 1) { setIsMeditating(false); return 0; }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [activeExercise, isMeditating]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', width: '100%' }}>

      {/* Emosiya Qeydi və Gündəlik Tarixçəsi */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>

        {/* Emosiya Seçimi və Yazı */}
        <div style={{
          backgroundColor: isDarkMode ? '#18181b' : '#fff',
          border: `1px solid ${isDarkMode ? '#27272a' : '#e4e4e7'}`,
          borderRadius: '16px',
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px'
        }}>
          {/* Emosiya düymələri */}
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

          {/* Textarea */}
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

          {/* Gündəliyə əlavə et düyməsi */}
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

        {/* Tarixçə Kartları */}
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

      {/* Sürətli Rahatlama Məşqləri */}
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

          {/* Nəfəs Məşqi Kartı */}
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

          {/* Fokus Meditasiyası Kartı */}
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

          {/* Pozitiv Affirmasiya Kartı */}
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

      {/* İşlək Modal Pəncərə */}
      {activeExercise && (
        <div
          onClick={(e) => e.target === e.currentTarget && setActiveExercise(null)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            backdropFilter: 'blur(4px)'
          }}
        >
          <div
            style={{
              backgroundColor: isDarkMode ? '#1c1c1e' : '#fff',
              padding: '32px 28px',
              borderRadius: '20px',
              maxWidth: '460px',
              width: '90%',
              color: isDarkMode ? '#fff' : '#000',
              textAlign: 'center',
              position: 'relative',
              border: '1px solid #333',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5)'
            }}
          >
            <button
              onClick={() => setActiveExercise(null)}
              style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                background: 'none',
                border: 'none',
                color: isDarkMode ? '#aaa' : '#555',
                fontSize: '22px',
                cursor: 'pointer'
              }}
            >
              ✕
            </button>

            {activeExercise === 'breathing' && (
              <div>
                <h3 style={{ fontSize: '20px', marginBottom: '8px' }}>🫁 4-7-8 Nəfəs Məşqi</h3>
                <p style={{ fontSize: '14px', color: isDarkMode ? '#aaa' : '#555', marginBottom: '24px' }}>
                  Sinir sistemini sakitləşdirmək üçün ekrandakı ritmə uyğun nəfəs al və ver.
                </p>
                <div
                  style={{
                    width: '160px',
                    height: '160px',
                    borderRadius: '50%',
                    backgroundColor:
                      breathPhase === 'Inhale'
                        ? '#10b981'
                        : breathPhase === 'Hold'
                          ? '#f59e0b'
                          : '#3b82f6',
                    margin: '0 auto 24px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.8s ease-in-out',
                    transform:
                      breathPhase === 'Inhale'
                        ? 'scale(1.18)'
                        : breathPhase === 'Hold'
                          ? 'scale(1.10)'
                          : 'scale(0.90)'
                  }}
                >
                  <span style={{ fontSize: '18px', fontWeight: 'bold' }}>
                    {breathPhase === 'Inhale' ? 'Nəfəs Al' : breathPhase === 'Hold' ? 'Saxla' : 'Nəfəs Ver'}
                  </span>
                  <span style={{ fontSize: '32px', fontWeight: 'bold', marginTop: '4px' }}>
                    {breathTimer}s
                  </span>
                </div>
                <button
                  onClick={() => setActiveExercise(null)}
                  style={{
                    padding: '10px 24px',
                    backgroundColor: '#2a2a2d',
                    border: '1px solid #444',
                    borderRadius: '10px',
                    color: '#fff',
                    cursor: 'pointer'
                  }}
                >
                  Məşqi Bitir
                </button>
              </div>
            )}

            {activeExercise === 'meditation' && (
              <div>
                <h3 style={{ fontSize: '20px', marginBottom: '8px' }}>🧘 Fokus Meditasiyası</h3>
                <p style={{ fontSize: '14px', color: isDarkMode ? '#aaa' : '#555', margin: '12px 0 20px' }}>
                  Gözlərini yum, çiyinlərini sərbəst burax və diqqətini yalnız nəfəsində saxla.
                </p>
                <div style={{ padding: '24px', background: isDarkMode ? '#2a2a2d' : '#f0f0f0', borderRadius: '14px', margin: '0 0 24px' }}>
                  <div style={{ fontSize: '42px', fontWeight: 'bold', fontFamily: 'monospace', color: '#10b981', marginBottom: '8px' }}>
                    {formatTime(meditationTime)}
                  </div>
                  <p style={{ color: isDarkMode ? '#ccc' : '#777', fontSize: '14px', fontStyle: 'italic', margin: 0 }}>
                    {isMeditating ? 'Sakitləş və yalnız anı hiss et...' : 'Başlamaq üçün düyməyə sıx'}
                  </p>
                </div>
                <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                  <button
                    onClick={() => setIsMeditating(!isMeditating)}
                    style={{
                      padding: '12px 24px',
                      backgroundColor: isMeditating ? '#ef4444' : '#10b981',
                      border: 'none',
                      borderRadius: '10px',
                      color: '#fff',
                      cursor: 'pointer',
                      fontWeight: 'bold'
                    }}
                  >
                    {isMeditating ? 'Pauza Et' : 'Başla (5 dəq)'}
                  </button>
                  <button
                    onClick={() => setActiveExercise(null)}
                    style={{
                      padding: '12px 20px',
                      backgroundColor: '#2a2a2d',
                      border: '1px solid #444',
                      borderRadius: '10px',
                      color: '#fff',
                      cursor: 'pointer'
                    }}
                  >
                    Tamamla
                  </button>
                </div>
              </div>
            )}

            {activeExercise === 'affirmation' && (
              <div>
                <h3 style={{ fontSize: '20px', marginBottom: '8px' }}>✨ Pozitiv Affirmasiya</h3>
                <p style={{ fontSize: '14px', color: isDarkMode ? '#aaa' : '#555', marginBottom: '20px' }}>
                  Daxili inamını bərpa etmək üçün bu cümləni daxilən 3 dəfə təkrarla.
                </p>
                <div style={{ minHeight: '120px', padding: '24px', background: isDarkMode ? '#2a2a2d' : '#f0f0f0', borderRadius: '14px', margin: '0 0 24px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderLeft: '4px solid #8b5cf6' }}>
                  <p style={{ fontSize: '18px', fontStyle: 'italic', color: isDarkMode ? '#f1f5f9' : '#333', margin: 0, lineHeight: 1.5 }}>
                    "{affirmations[affIndex]}"
                  </p>
                </div>
                <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                  <button
                    onClick={() => setAffIndex((prev) => (prev + 1) % affirmations.length)}
                    style={{
                      padding: '12px 22px',
                      backgroundColor: '#8b5cf6',
                      border: 'none',
                      borderRadius: '10px',
                      color: '#fff',
                      cursor: 'pointer',
                      fontWeight: 'bold'
                    }}
                  >
                    Növbəti Cümlə ➔
                  </button>
                  <button
                    onClick={() => setActiveExercise(null)}
                    style={{
                      padding: '12px 18px',
                      backgroundColor: '#2a2a2d',
                      border: '1px solid #444',
                      borderRadius: '10px',
                      color: '#fff',
                      cursor: 'pointer'
                    }}
                  >
                    Bağla
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
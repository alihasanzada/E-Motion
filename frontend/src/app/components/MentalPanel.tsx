"use client";

import React, { useState, useEffect, useRef } from 'react';
import {
  Brain,
  Wind,
  Music,
  Volume2,
  Play,
  Pause,
  Plus,
  Smile,
  BookOpen,
  X,
  Clock,
  Feather
} from 'lucide-react';

interface MentalPanelProps {
  isDarkMode?: boolean;
}

interface JournalEntry {
  id: string;
  date: string;
  mood: string;
  moodColor: string;
  note: string;
}

const AMBIENT_SOUNDS = [
  { id: 'rain', name: 'Sakit Yağış', icon: '🌧️', url: 'https://cdn.pixabay.com/download/audio/2022/05/16/audio_db6591201e.mp3' },
  { id: 'ocean', name: 'Okean Dalğası', icon: '🌊', url: 'https://cdn.pixabay.com/download/audio/2022/03/10/audio_c3e60a75d5.mp3' },
  { id: 'forest', name: 'Meşə Fısıltısı', icon: '🌲', url: 'https://cdn.pixabay.com/download/audio/2021/09/06/audio_8fa2667b57.mp3' },
  { id: 'meditation', name: 'Meditasiya Musiqisi', icon: '🎵', url: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3' }
];

export default function MentalPanel({ isDarkMode = false }: MentalPanelProps) {
  const [selectedMood, setSelectedMood] = useState<string>('Əla');
  const [noteText, setNoteText] = useState<string>('');
  const [entries, setEntries] = useState<JournalEntry[]>([]);

  const [activeModal, setActiveModal] = useState<'breath' | 'meditation' | 'affirmation' | null>(null);

  const [currentSoundId, setCurrentSoundId] = useState<string>('rain');
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [breathPhase, setBreathPhase] = useState<'In' | 'Hold' | 'Out'>('In');
  const [breathTimer, setBreathTimer] = useState<number>(4);
  const [meditationSeconds, setMeditationSeconds] = useState<number>(300);
  const [isMeditationRunning, setIsMeditationRunning] = useState<boolean>(false);
  const [affirmationIndex, setAffirmationIndex] = useState<number>(0);

  const theme = {
    cardBg: isDarkMode ? '#1E293B' : '#FFFFFF',
    innerBg: isDarkMode ? '#0F172A' : '#F8FAFC',
    inputBg: isDarkMode ? '#0F172A' : '#FFFFFF',
    textPrimary: isDarkMode ? '#F8FAFC' : '#0F172A',
    textSecondary: isDarkMode ? '#94A3B8' : '#475569',
    borderColor: isDarkMode ? '#334155' : '#E2E8F0',
    primary: '#44766C',
    accentGreen: '#10B981',
    purple: '#8B5CF6'
  };

  const moods = [
    { name: 'Əla', emoji: '🌟', color: '#10B981', bg: 'rgba(16, 185, 129, 0.12)' },
    { name: 'Sakit', emoji: '🍃', color: '#0EA5E9', bg: 'rgba(14, 165, 233, 0.12)' },
    { name: 'Yorğun', emoji: '☕', color: '#F59E0B', bg: 'rgba(245, 158, 11, 0.12)' },
    { name: 'Stressli', emoji: '🌧️', color: '#EF4444', bg: 'rgba(239, 68, 68, 0.12)' },
    { name: 'Həvəsli', emoji: '🔥', color: '#8B5CF6', bg: 'rgba(139, 92, 246, 0.12)' }
  ];

  const affirmations = [
    "Mən özümə və zəkama tamamilə inanıram.",
    "Hər bir çətinlik mənim böyüməyim üçün bir imkandır.",
    "Zehnim sakitdir, diqqətim tam şəkildə hədəflərimdədir.",
    "Bugünkü kiçik addımlarım böyük uğurların təməlidir.",
    "Bədənimə və ruhuma ehtiyacı olan dincəlməni verməyə dəyərəm."
  ];

  useEffect(() => {
    const savedEntries = localStorage.getItem('mental_journal_entries');
    if (savedEntries) {
      try {
        setEntries(JSON.parse(savedEntries));
      } catch (e) {
        console.error(e);
      }
    } else {
      const defaults: JournalEntry[] = [
        { id: '1', date: new Date().toLocaleDateString('az-AZ'), mood: 'Əla', moodColor: '#10B981', note: 'Özümü çox gümrah hiss edirəm. İmtahan hazırlıqları yaxşı gedir!' },
        { id: '2', date: '2026-10-08', mood: 'Sakit', moodColor: '#0EA5E9', note: 'Dərslər bir az sıx idi, amma axşam gəzintisi ruhuma çox yaxşı gəldi.' }
      ];
      setEntries(defaults);
      localStorage.setItem('mental_journal_entries', JSON.stringify(defaults));
    }
  }, []);

  const toggleAudio = (soundUrl?: string) => {
    const targetUrl = soundUrl || AMBIENT_SOUNDS.find(s => s.id === currentSoundId)?.url;

    if (!audioRef.current) {
      audioRef.current = new Audio(targetUrl);
      audioRef.current.loop = true;
    }

    if (isPlayingAudio && !soundUrl) {
      audioRef.current.pause();
      setIsPlayingAudio(false);
    } else {
      if (soundUrl && audioRef.current.src !== soundUrl) {
        audioRef.current.src = soundUrl;
      }
      audioRef.current.play().then(() => setIsPlayingAudio(true)).catch(console.error);
    }
  };

  useEffect(() => {
    let interval: any = null;
    if (activeModal === 'breath') {
      interval = setInterval(() => {
        setBreathTimer((prev) => {
          if (prev <= 1) {
            if (breathPhase === 'In') {
              setBreathPhase('Hold');
              return 7;
            } else if (breathPhase === 'Hold') {
              setBreathPhase('Out');
              return 8;
            } else {
              setBreathPhase('In');
              return 4;
            }
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [activeModal, breathPhase]);

  useEffect(() => {
    let interval: any = null;
    if (activeModal === 'meditation' && isMeditationRunning && meditationSeconds > 0) {
      interval = setInterval(() => {
        setMeditationSeconds((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [activeModal, isMeditationRunning, meditationSeconds]);

  const handleAddEntry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteText.trim()) return;

    const moodObj = moods.find(m => m.name === selectedMood);
    const newEntry: JournalEntry = {
      id: Date.now().toString(),
      date: new Date().toLocaleDateString('az-AZ'),
      mood: selectedMood,
      moodColor: moodObj?.color || '#10B981',
      note: noteText.trim()
    };

    const updated = [newEntry, ...entries];
    setEntries(updated);
    localStorage.setItem('mental_journal_entries', JSON.stringify(updated));
    setNoteText('');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', paddingBottom: '30px', color: theme.textPrimary }}>

      {/* Top Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #2E5B4E 0%, #44766C 100%)',
        borderRadius: '18px',
        padding: '22px 26px',
        color: '#FFFFFF',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '14px',
        boxShadow: '0 6px 16px -2px rgba(68, 118, 108, 0.22)'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
            <span style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)', padding: '3px 10px', borderRadius: '14px', fontSize: '11.5px', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '5px' }}>
              <Brain size={14} /> Mental Zonalıq & Dinclik
            </span>
          </div>
          <h2 style={{ margin: 0, fontSize: '20px', fontWeight: '800' }}>
            Zihnini sakitləşdir, daxili balansını tap
          </h2>
          <p style={{ margin: '4px 0 0 0', fontSize: '12.5px', opacity: 0.9, maxWidth: '540px', lineHeight: '1.4' }}>
            Günün gərginliyini azaltmaq və diqqətini toplamaq üçün interaktiv məşqlərdən istifadə et.
          </p>
        </div>

        <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.15)', padding: '10px 16px', borderRadius: '14px', display: 'flex', alignItems: 'center', gap: '12px', border: '1px solid rgba(255, 255, 255, 0.2)' }}>
          <Feather size={24} color="#A7F3D0" />
          <div>
            <span style={{ fontSize: '10.5px', display: 'block', opacity: 0.85 }}>Günün Ruh Halı</span>
            <strong style={{ fontSize: '14px', fontWeight: '800', color: '#A7F3D0' }}>Sakit & Fokusda</strong>
          </div>
        </div>
      </div>

      {/* Main Grid: Mood Tracker & Ambient Audio Player */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>

        {/* Mood Tracker & Input Form */}
        <div style={{ backgroundColor: theme.cardBg, border: `1px solid ${theme.borderColor}`, borderRadius: '16px', padding: '18px 20px', boxShadow: isDarkMode ? 'none' : '0 2px 10px rgba(0,0,0,0.02)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
            <Smile size={18} color={theme.primary} />
            <h3 style={{ margin: 0, fontSize: '15px', fontWeight: '700' }}>Bu gün özünü necə hiss edirsən?</h3>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '6px', marginBottom: '12px' }}>
            {moods.map((m) => {
              const isSelected = selectedMood === m.name;
              return (
                <button
                  key={m.name}
                  onClick={() => setSelectedMood(m.name)}
                  style={{
                    backgroundColor: isSelected ? m.bg : theme.innerBg,
                    border: isSelected ? `2px solid ${m.color}` : `1px solid ${theme.borderColor}`,
                    borderRadius: '10px',
                    padding: '8px 4px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '4px',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    transform: isSelected ? 'scale(1.03)' : 'scale(1)'
                  }}
                >
                  <span style={{ fontSize: '18px' }}>{m.emoji}</span>
                  <span style={{ fontSize: '10.5px', fontWeight: '700', color: isSelected ? m.color : theme.textSecondary }}>{m.name}</span>
                </button>
              );
            })}
          </div>

          <form onSubmit={handleAddEntry} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <textarea
              rows={2}
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              placeholder="Ağlınızdan nələr keçir? Qısaca qeyd edin və ya fikirlərinizi bölüşün..."
              style={{
                width: '100%',
                padding: '8px 12px',
                borderRadius: '10px',
                border: `1px solid ${theme.borderColor}`,
                backgroundColor: theme.inputBg,
                color: theme.textPrimary,
                fontSize: '12.5px',
                outline: 'none',
                resize: 'none',
                boxSizing: 'border-box'
              }}
            />
            <button
              type="submit"
              style={{
                backgroundColor: theme.primary,
                color: '#FFFFFF',
                border: 'none',
                padding: '9px',
                borderRadius: '10px',
                fontSize: '12.5px',
                fontWeight: '700',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                transition: 'all 0.2s ease'
              }}
            >
              <Plus size={15} /> Gündəliyə Əlavə Et
            </button>
          </form>
        </div>

        {/* Ambient Audio Player */}
        <div style={{ backgroundColor: theme.cardBg, border: `1px solid ${theme.borderColor}`, borderRadius: '16px', padding: '18px 20px', boxShadow: isDarkMode ? 'none' : '0 2px 10px rgba(0,0,0,0.02)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Music size={18} color={theme.purple} />
                <h3 style={{ margin: 0, fontSize: '15px', fontWeight: '700' }}>Günün Fokus Səsləri</h3>
              </div>
              <span style={{ fontSize: '10.5px', fontWeight: '700', backgroundColor: 'rgba(139, 92, 246, 0.15)', color: theme.purple, padding: '2px 8px', borderRadius: '10px' }}>
                Relaksasiya
              </span>
            </div>

            <p style={{ fontSize: '11.5px', color: theme.textSecondary, margin: '0 0 10px 0', lineHeight: '1.3' }}>
              Dərs oxuyarkən və ya dincələrkən fonda dinləmək üçün sakitləşdirici səsləri başladın:
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '10px' }}>
              {AMBIENT_SOUNDS.map((snd) => {
                const isActive = currentSoundId === snd.id;
                return (
                  <button
                    key={snd.id}
                    onClick={() => {
                      setCurrentSoundId(snd.id);
                      toggleAudio(snd.url);
                    }}
                    style={{
                      padding: '7px 10px',
                      borderRadius: '10px',
                      border: `1px solid ${isActive ? theme.purple : theme.borderColor}`,
                      backgroundColor: isActive ? 'rgba(139, 92, 246, 0.12)' : theme.innerBg,
                      color: isActive ? theme.purple : theme.textPrimary,
                      fontSize: '11.5px',
                      fontWeight: '700',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <span>{snd.icon}</span>
                    <span>{snd.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div style={{ backgroundColor: theme.innerBg, padding: '8px 12px', borderRadius: '12px', border: `1px solid ${theme.borderColor}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Volume2 size={16} color={theme.purple} />
              <span style={{ fontSize: '12px', fontWeight: '700', color: theme.textPrimary }}>
                {AMBIENT_SOUNDS.find(s => s.id === currentSoundId)?.name}
              </span>
            </div>

            <button
              onClick={() => toggleAudio()}
              style={{
                backgroundColor: theme.purple,
                color: '#FFFFFF',
                border: 'none',
                padding: '6px 14px',
                borderRadius: '8px',
                fontSize: '11.5px',
                fontWeight: '700',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '5px'
              }}
            >
              {isPlayingAudio ? <Pause size={13} /> : <Play size={13} />}
              {isPlayingAudio ? 'Dayandır' : 'Səsi Başlat'}
            </button>
          </div>
        </div>

      </div>

      {/* Quick Relaxation Exercises */}
      <div style={{ backgroundColor: theme.cardBg, border: `1px solid ${theme.borderColor}`, borderRadius: '16px', padding: '18px 20px', boxShadow: isDarkMode ? 'none' : '0 2px 10px rgba(0,0,0,0.02)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
          <Wind size={18} color={theme.primary} />
          <h3 style={{ margin: 0, fontSize: '15.5px', fontWeight: '800' }}>Sürətli Rahatlama Məşqləri</h3>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '12px' }}>

          {/* Breathing */}
          <div style={{ backgroundColor: theme.innerBg, border: `1px solid ${theme.borderColor}`, borderRadius: '12px', padding: '12px 14px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '10px' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                <h4 style={{ margin: 0, fontSize: '14px', fontWeight: '700' }}>Nəfəs Məşqi</h4>
                <Clock size={14} color={theme.textSecondary} />
              </div>
              <p style={{ margin: 0, fontSize: '11.5px', color: theme.textSecondary, lineHeight: '1.3' }}>
                4-7-8 ritmi ilə həyəcanı və stresi anında azaldın.
              </p>
            </div>
            <button
              onClick={() => setActiveModal('breath')}
              style={{ backgroundColor: theme.primary, color: '#FFFFFF', border: 'none', padding: '8px', borderRadius: '8px', fontSize: '12px', fontWeight: '700', cursor: 'pointer' }}
            >
              Başla (3 dəq)
            </button>
          </div>

          {/* Focus Meditation */}
          <div style={{ backgroundColor: theme.innerBg, border: `1px solid ${theme.borderColor}`, borderRadius: '12px', padding: '12px 14px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '10px' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                <h4 style={{ margin: 0, fontSize: '14px', fontWeight: '700' }}>Fokus Meditasiyası</h4>
                <Clock size={14} color={theme.textSecondary} />
              </div>
              <p style={{ margin: 0, fontSize: '11.5px', color: theme.textSecondary, lineHeight: '1.3' }}>
                Dərs öncəsi diqqəti toplamaq üçün mini seans.
              </p>
            </div>
            <button
              onClick={() => setActiveModal('meditation')}
              style={{ backgroundColor: theme.primary, color: '#FFFFFF', border: 'none', padding: '8px', borderRadius: '8px', fontSize: '12px', fontWeight: '700', cursor: 'pointer' }}
            >
              Dinlə (5 dəq)
            </button>
          </div>

          {/* Affirmations */}
          <div style={{ backgroundColor: theme.innerBg, border: `1px solid ${theme.borderColor}`, borderRadius: '12px', padding: '12px 14px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '10px' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                <h4 style={{ margin: 0, fontSize: '14px', fontWeight: '700' }}>Pozitiv Affirmasiya</h4>
                <Clock size={14} color={theme.textSecondary} />
              </div>
              <p style={{ margin: 0, fontSize: '11.5px', color: theme.textSecondary, lineHeight: '1.3' }}>
                Özünə inamı bərpa etmək üçün gündəlik cümlələr.
              </p>
            </div>
            <button
              onClick={() => setActiveModal('affirmation')}
              style={{ backgroundColor: theme.purple, color: '#FFFFFF', border: 'none', padding: '8px', borderRadius: '8px', fontSize: '12px', fontWeight: '700', cursor: 'pointer' }}
            >
              Oxu (2 dəq)
            </button>
          </div>

        </div>
      </div>

      {/* Journal Entries History Section */}
      <div style={{ backgroundColor: theme.cardBg, border: `1px solid ${theme.borderColor}`, borderRadius: '16px', padding: '18px 20px', boxShadow: isDarkMode ? 'none' : '0 2px 10px rgba(0,0,0,0.02)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
          <BookOpen size={18} color={theme.primary} />
          <h3 style={{ margin: 0, fontSize: '15.5px', fontWeight: '800' }}>Gündəlik Qeydlərin</h3>
        </div>

        {entries.length === 0 ? (
          <p style={{ margin: 0, fontSize: '12.5px', color: theme.textSecondary }}>Hələ ki heç bir qeyd əlavə edilməyib.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {entries.map((item) => (
              <div
                key={item.id}
                style={{
                  backgroundColor: theme.innerBg,
                  borderLeft: `4px solid ${item.moodColor}`,
                  borderTop: `1px solid ${theme.borderColor}`,
                  borderRight: `1px solid ${theme.borderColor}`,
                  borderBottom: `1px solid ${theme.borderColor}`,
                  borderRadius: '10px',
                  padding: '12px 16px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '4px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '11px', fontWeight: '800', color: item.moodColor, backgroundColor: `${item.moodColor}1F`, padding: '2px 8px', borderRadius: '6px' }}>
                    {item.mood}
                  </span>
                  <span style={{ fontSize: '11px', color: theme.textSecondary }}>{item.date}</span>
                </div>
                <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: theme.textPrimary, lineHeight: '1.4' }}>{item.note}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modals Container */}
      {activeModal && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.65)',
          backdropFilter: 'blur(6px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '20px'
        }}>
          <div style={{
            backgroundColor: theme.cardBg,
            border: `1px solid ${theme.borderColor}`,
            borderRadius: '20px',
            width: '100%',
            maxWidth: '440px',
            padding: '22px',
            position: 'relative',
            color: theme.textPrimary,
            boxShadow: '0 20px 40px rgba(0,0,0,0.25)'
          }}>
            <button
              onClick={() => setActiveModal(null)}
              style={{ position: 'absolute', top: '16px', right: '16px', backgroundColor: 'transparent', border: 'none', color: theme.textSecondary, cursor: 'pointer' }}
            >
              <X size={18} />
            </button>

            {/* Breathing Modal */}
            {activeModal === 'breath' && (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '16px' }}>
                <h3 style={{ margin: 0, fontSize: '17px', fontWeight: '800' }}>🫁 4-7-8 Nəfəs Məşqi</h3>
                <p style={{ margin: 0, fontSize: '12.5px', color: theme.textSecondary }}>Sinir sistemini sakitləşdirin.</p>

                <div style={{
                  width: '140px',
                  height: '140px',
                  borderRadius: '50%',
                  background: breathPhase === 'In' ? 'radial-gradient(circle, #10B981 0%, #059669 100%)' : (breathPhase === 'Hold' ? 'radial-gradient(circle, #F59E0B 0%, #D97706 100%)' : 'radial-gradient(circle, #3B82F6 0%, #1D4ED8 100%)'),
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#FFFFFF',
                  boxShadow: '0 0 25px rgba(16, 185, 129, 0.4)',
                  transition: 'all 1s ease-in-out',
                  transform: breathPhase === 'In' ? 'scale(1.1)' : (breathPhase === 'Hold' ? 'scale(1.05)' : 'scale(0.95)')
                }}>
                  <span style={{ fontSize: '16px', fontWeight: '800' }}>
                    {breathPhase === 'In' ? 'Nəfəs Al' : (breathPhase === 'Hold' ? 'Saxla' : 'Nəfəs Ver')}
                  </span>
                  <span style={{ fontSize: '28px', fontWeight: '900' }}>{breathTimer}s</span>
                </div>

                <button
                  onClick={() => setActiveModal(null)}
                  style={{ backgroundColor: theme.primary, color: '#FFFFFF', border: 'none', padding: '10px 20px', borderRadius: '10px', fontSize: '13px', fontWeight: '700', cursor: 'pointer' }}
                >
                  Məşqi Bitir
                </button>
              </div>
            )}

            {/* Meditation Modal */}
            {activeModal === 'meditation' && (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '16px' }}>
                <h3 style={{ margin: 0, fontSize: '17px', fontWeight: '800' }}>🧘 Fokus Meditasiyası</h3>
                <p style={{ margin: 0, fontSize: '12.5px', color: theme.textSecondary }}>Diqqəti nəfəsinizə toplayın.</p>

                <div style={{ backgroundColor: theme.innerBg, border: `1px solid ${theme.borderColor}`, padding: '16px 30px', borderRadius: '16px', width: '100%', boxSizing: 'border-box' }}>
                  <span style={{ fontSize: '38px', fontWeight: '900', color: theme.primary, fontFamily: 'monospace' }}>
                    {Math.floor(meditationSeconds / 60).toString().padStart(2, '0')}:{(meditationSeconds % 60).toString().padStart(2, '0')}
                  </span>
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    onClick={() => setIsMeditationRunning(!isMeditationRunning)}
                    style={{ backgroundColor: theme.primary, color: '#FFFFFF', border: 'none', padding: '10px 20px', borderRadius: '10px', fontSize: '13px', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
                  >
                    {isMeditationRunning ? <Pause size={15} /> : <Play size={15} />}
                    {isMeditationRunning ? 'Pauza' : 'Başla'}
                  </button>
                  <button
                    onClick={() => setActiveModal(null)}
                    style={{ backgroundColor: theme.innerBg, border: `1px solid ${theme.borderColor}`, color: theme.textPrimary, padding: '10px 20px', borderRadius: '10px', fontSize: '13px', fontWeight: '700', cursor: 'pointer' }}
                  >
                    Tamamla
                  </button>
                </div>
              </div>
            )}

            {/* Affirmation Modal */}
            {activeModal === 'affirmation' && (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '16px' }}>
                <h3 style={{ margin: 0, fontSize: '17px', fontWeight: '800' }}>✨ Pozitiv Affirmasiya</h3>
                <p style={{ margin: 0, fontSize: '12.5px', color: theme.textSecondary }}>Bu cümləni daxilən 3 dəfə təkrarla:</p>

                <div style={{ backgroundColor: 'rgba(139, 92, 246, 0.08)', border: `1.5px solid ${theme.purple}`, padding: '20px 16px', borderRadius: '14px', width: '100%', boxSizing: 'border-box' }}>
                  <p style={{ margin: 0, fontSize: '15px', fontWeight: '700', color: theme.purple, fontStyle: 'italic', lineHeight: '1.4' }}>
                    "{affirmations[affirmationIndex]}"
                  </p>
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    onClick={() => setAffirmationIndex((prev) => (prev + 1) % affirmations.length)}
                    style={{ backgroundColor: theme.purple, color: '#FFFFFF', border: 'none', padding: '10px 18px', borderRadius: '10px', fontSize: '12.5px', fontWeight: '700', cursor: 'pointer' }}
                  >
                    Növbəti Cümlə →
                  </button>
                  <button
                    onClick={() => setActiveModal(null)}
                    style={{ backgroundColor: theme.innerBg, border: `1px solid ${theme.borderColor}`, color: theme.textPrimary, padding: '10px 18px', borderRadius: '10px', fontSize: '12.5px', fontWeight: '700', cursor: 'pointer' }}
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
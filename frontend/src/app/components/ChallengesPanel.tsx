"use client";

import React, { useState, useEffect } from 'react';
import {
  Trophy,
  Flame,
  CheckCircle2,
  Droplet,
  Footprints,
  Moon,
  Dumbbell,
  Award,
  Zap,
  ShieldCheck,
  Sparkles,
  Plus,
  Play,
  Pause,
  RotateCcw,
  X,
  Check,
  Lock,
  ChevronRight,
  Info,
  Clock
} from 'lucide-react';

interface ChallengesPanelProps {
  isDarkMode?: boolean;
}

interface Student {
  id: string;
  name: string;
  faculty: string;
  xp: number;
  level: number;
  badge: string;
  isUser?: boolean;
}

export default function ChallengesPanel({ isDarkMode = true }: ChallengesPanelProps) {
  const theme = {
    cardBg: '#18181B',
    bgSecondary: '#121214',
    textPrimary: '#FFFFFF',
    textSecondary: '#A1A1AA',
    textMuted: '#71717A',
    borderColor: 'rgba(255, 255, 255, 0.1)',
    progressBg: '#27272A',
    accentGreen: '#10B981',
    accentGreenDark: '#2E5B4E',
    btnBg: '#23473D',
    btnHoverBg: '#2E5B4E',
    gold: '#F59E0B',
  };

  const [activeTab, setActiveTab] = useState<'challenges' | 'leaderboard' | 'badges'>('challenges');
  const [leaderboardScope, setLeaderboardScope] = useState<'faculties' | 'students'>('students');
  const [selectedCategory, setSelectedCategory] = useState<string>('Hamısı');

  const [userXP, setUserXP] = useState(410);
  const streakDays = 5;

  const userLevel = Math.floor(userXP / 200) + 1;
  const currentLevelProgress = ((userXP % 200) / 200) * 100;

  const [activeModalTask, setActiveModalTask] = useState<any | null>(null);

  const [waterDrunk, setWaterDrunk] = useState(1.4); // litr

  const [timerSeconds, setTimerSeconds] = useState(45);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [workoutStep, setWorkoutStep] = useState(1);

  const [sleepTimeInput, setSleepTimeInput] = useState('22:45');
  const [sleepVerified, setSleepVerified] = useState<boolean | null>(null);

  useEffect(() => {
    let interval: any = null;
    if (isTimerRunning && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds(prev => prev - 1);
      }, 1000);
    } else if (timerSeconds === 0) {
      setIsTimerRunning(false);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timerSeconds]);

  const [challenges, setChallenges] = useState([
    {
      id: 1,
      type: 'water',
      title: 'Su Kampaniyası',
      desc: 'Hər gün ən azı 2.0 litr su iç və qabı doldur',
      category: 'Qidalanma',
      xp: 50,
      current: waterDrunk,
      target: 2.0,
      unit: 'Litr',
      icon: <Droplet color="#0EA5E9" size={20} />,
      iconBg: 'rgba(14, 165, 233, 0.15)',
      completed: false
    },
    {
      id: 2,
      type: 'steps',
      title: 'Aktiv Həyat',
      desc: 'Həftə sonuna qədər günlük 7,000 addım at',
      category: 'Fiziki Aktivlik',
      xp: 100,
      current: 7000,
      target: 7000,
      unit: 'Addım',
      icon: <Footprints color="#10B981" size={20} />,
      iconBg: 'rgba(16, 185, 129, 0.15)',
      completed: true
    },
    {
      id: 3,
      type: 'sleep',
      title: 'Erkən Yuxu Rejimi',
      desc: 'Saat 23:00-a qədər telefonu kənara qoy və yat',
      category: 'Mental & İstirahət',
      xp: 75,
      current: 2,
      target: 7,
      unit: 'Gün',
      icon: <Moon color="#8B5CF6" size={20} />,
      iconBg: 'rgba(139, 92, 246, 0.15)',
      completed: false
    },
    {
      id: 4,
      type: 'workout',
      title: 'Masaüstü Əzələ Məşqi',
      desc: 'Dərs arası 45 saniyəlik canlı dartınma (stretching) et',
      category: 'Fitnes',
      xp: 60,
      current: 0,
      target: 1,
      unit: 'Məşq',
      icon: <Dumbbell color="#F59E0B" size={20} />,
      iconBg: 'rgba(245, 158, 11, 0.15)',
      completed: false
    }
  ]);

  const otherStudents: Student[] = [
    { id: 'st-1', name: 'Elvin Məmmədov', faculty: 'Kompüter Mühəndisliyi', xp: 2450, level: 12, badge: '👑 Çempion' },
    { id: 'st-2', name: 'Aysel Qasımova', faculty: 'İqtisadiyyat', xp: 2100, level: 10, badge: '🔥 Aktiv' },
    { id: 'st-3', name: 'Kamran Əliyev', faculty: 'Pedaqoji', xp: 1850, level: 9, badge: '🎯 Hədəfçi' },
    { id: 'st-4', name: 'Nigar Sultanova', faculty: 'Kompüter Mühəndisliyi', xp: 1620, level: 8, badge: '🌱 Yeni' },
    { id: 'st-5', name: 'Leyla Həsənova', faculty: 'Təbiət Elmləri', xp: 850, level: 5, badge: '⚡ İrəliləyən' }
  ];

  const allStudentsUnsorted = [
    ...otherStudents,
    { id: 'user-me', name: 'Əli Həsənzadə (Sən)', faculty: 'Kompüter Mühəndisliyi', xp: userXP, level: userLevel, badge: '⚡ İrəliləyən', isUser: true }
  ];

  const sortedStudents = [...allStudentsUnsorted]
    .sort((a, b) => b.xp - a.xp)
    .map((student, index) => ({ ...student, rank: index + 1 }));

  const faculties = [
    { rank: 1, name: 'Kompüter Mühəndisliyi & İT', xp: 14250, members: 320, bonus: '+15% XP', isUserFaculty: true },
    { rank: 2, name: 'İqtisadiyyat & İdarəetmə', xp: 12890, members: 290, bonus: '+10% XP', isUserFaculty: false },
    { rank: 3, name: 'Pedaqoji & İctimai Elmlər', xp: 9450, members: 210, bonus: '+5% XP', isUserFaculty: false },
    { rank: 4, name: 'Təbiət Elmləri & İncəsənət', xp: 7800, members: 160, bonus: '0%', isUserFaculty: false }
  ];

  const badges = [
    { id: 1, title: 'Su Çempionu', desc: '5 gün üst-üstə günlük su hədəfini tamamla', icon: '💧', unlocked: true, status: 'Qazanıldı' },
    { id: 2, title: 'Kampus Lideri', desc: 'Fakültənə ümumilikdə 300+ XP qazandır', icon: '🏆', unlocked: true, status: 'Qazanıldı' },
    { id: 3, title: 'Yorulmaz Addımlayan', desc: 'Bir gündə 10,000 addım məsafə qət et', icon: '👟', unlocked: false, status: '7,000 / 10,000' },
    { id: 4, title: 'Erkən Yatan', desc: '7 gün dalbadal saat 23:00-dan əvvəl yat', icon: '🌙', unlocked: false, status: '2 / 7 Gün' },
    { id: 5, title: 'Masaüstü Atlet', desc: '5 dəfə canlı masaüstü stretching məşqini bitir', icon: '🧘', unlocked: false, status: '0 / 5 Məşq' },
    { id: 6, title: 'Liderlər Sırası', desc: 'Fərdi tələbə sıralamasında İlk 3-lüyə daxil ol', icon: '🥇', unlocked: false, status: 'Sıralamada yüksəl' }
  ];

  const categories = ['Hamısı', 'Qidalanma', 'Fiziki Aktivlik', 'Mental & İstirahət', 'Fitnes'];

  const completeTask = (taskId: number, earnedXP: number) => {
    setChallenges(prev =>
      prev.map(item => {
        if (item.id === taskId) {
          return { ...item, completed: true, current: item.target };
        }
        return item;
      })
    );
    setUserXP(curr => curr + earnedXP);
    setActiveModalTask(null);
  };

  const completedCount = challenges.filter(c => c.completed).length;

  const filteredChallenges = selectedCategory === 'Hamısı'
    ? challenges
    : challenges.filter(c => c.category === selectedCategory);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', paddingBottom: '30px', color: theme.textPrimary }}>

      {/* Üst Gamification Statistika Banneri */}
      <div style={{
        backgroundColor: theme.cardBg,
        border: `1px solid ${theme.borderColor}`,
        borderRadius: '20px',
        padding: '20px 24px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '16px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.04)'
      }}>
        {/* Level & XP */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{
            width: '58px',
            height: '58px',
            borderRadius: '16px',
            backgroundColor: 'rgba(245, 158, 11, 0.12)',
            border: `1px solid ${theme.gold}`,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            color: theme.gold
          }}>
            <span style={{ fontSize: '10px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Səviyyə</span>
            <strong style={{ fontSize: '20px', fontWeight: '800', lineHeight: '1.1' }}>{userLevel}</strong>
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h2 style={{ margin: 0, fontSize: '18px', fontWeight: '800' }}>Həftəlik Motivasiya Çağırışları</h2>
              <Sparkles size={16} color={theme.gold} />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '6px' }}>
              <div style={{ width: '150px', height: '8px', backgroundColor: theme.progressBg, borderRadius: '10px', overflow: 'hidden' }}>
                <div style={{ width: `${currentLevelProgress}%`, height: '100%', backgroundColor: theme.gold, transition: 'width 0.4s ease' }} />
              </div>
              <span style={{ fontSize: '12.5px', fontWeight: '700', color: theme.gold }}>
                {userXP} XP <span style={{ color: theme.textMuted, fontWeight: '500' }}>/ {userLevel * 200} XP</span>
              </span>
            </div>
          </div>
        </div>

        {/* Aktivlik Seriyası & Sıralama Statusu */}
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <div style={{
            backgroundColor: 'rgba(239, 68, 68, 0.12)',
            border: '1px solid rgba(239, 68, 68, 0.2)',
            padding: '8px 14px',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            color: '#EF4444'
          }}>
            <Flame size={18} />
            <div>
              <span style={{ display: 'block', fontSize: '10px', fontWeight: '600' }}>Aktivlik Seriyası</span>
              <strong style={{ fontSize: '13px', fontWeight: '800' }}>{streakDays} Gün Dalbadal</strong>
            </div>
          </div>

          <div style={{
            backgroundColor: 'rgba(16, 185, 129, 0.12)',
            border: '1px solid rgba(16, 185, 129, 0.2)',
            padding: '8px 14px',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            color: theme.accentGreen
          }}>
            <ShieldCheck size={18} />
            <div>
              <span style={{ display: 'block', fontSize: '10px', fontWeight: '600' }}>Sıralama Mövqeyin</span>
              <strong style={{ fontSize: '13px', fontWeight: '800' }}>
                #{sortedStudents.find(s => s.isUser)?.rank || '-'} Sırada
              </strong>
            </div>
          </div>
        </div>
      </div>

      {/* Ana Tab Keçidləri */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: `1px solid ${theme.borderColor}`, paddingBottom: '12px', flexWrap: 'wrap', gap: '10px' }}>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={() => setActiveTab('challenges')}
            style={{
              padding: '9px 18px',
              borderRadius: '12px',
              border: 'none',
              backgroundColor: activeTab === 'challenges' ? theme.accentGreen : 'transparent',
              color: activeTab === 'challenges' ? '#FFFFFF' : theme.textSecondary,
              fontWeight: '700',
              fontSize: '13.5px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'all 0.2s ease'
            }}
          >
            <Zap size={16} /> Aktiv Çağırışlar ({completedCount}/{challenges.length})
          </button>

          <button
            onClick={() => setActiveTab('leaderboard')}
            style={{
              padding: '9px 18px',
              borderRadius: '12px',
              border: 'none',
              backgroundColor: activeTab === 'leaderboard' ? theme.accentGreen : 'transparent',
              color: activeTab === 'leaderboard' ? '#FFFFFF' : theme.textSecondary,
              fontWeight: '700',
              fontSize: '13.5px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'all 0.2s ease'
            }}
          >
            <Trophy size={16} /> Liderlər Cədvəli
          </button>

          <button
            onClick={() => setActiveTab('badges')}
            style={{
              padding: '9px 18px',
              borderRadius: '12px',
              border: 'none',
              backgroundColor: activeTab === 'badges' ? theme.accentGreen : 'transparent',
              color: activeTab === 'badges' ? '#FFFFFF' : theme.textSecondary,
              fontWeight: '700',
              fontSize: '13.5px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'all 0.2s ease'
            }}
          >
            <Award size={16} /> Nailiyyət Nişanları
          </button>
        </div>

        {/* Filtrlər */}
        {activeTab === 'challenges' && (
          <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '4px' }}>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                style={{
                  padding: '5px 12px',
                  borderRadius: '8px',
                  border: `1px solid ${selectedCategory === cat ? theme.accentGreen : theme.borderColor}`,
                  backgroundColor: selectedCategory === cat ? 'rgba(16, 185, 129, 0.15)' : 'transparent',
                  color: selectedCategory === cat ? theme.accentGreen : theme.textMuted,
                  fontSize: '11.5px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap'
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Aktiv Çağırışlar */}
      {activeTab === 'challenges' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '18px' }}>
          {filteredChallenges.map((item) => {
            const progressPercent = item.completed ? 100 : Math.min(100, Math.round((item.current / item.target) * 100));

            return (
              <div
                key={item.id}
                style={{
                  backgroundColor: theme.cardBg,
                  border: item.completed ? `1.5px solid ${theme.accentGreen}` : `1px solid ${theme.borderColor}`,
                  borderRadius: '20px',
                  padding: '20px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: '16px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
                  transition: 'transform 0.2s ease, border-color 0.2s ease'
                }}
              >
                {/* Kart Üst Başlıq */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px' }}>
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <div style={{ backgroundColor: item.iconBg, padding: '12px', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {item.icon}
                    </div>
                    <div>
                      <span style={{ fontSize: '11px', fontWeight: '700', color: theme.textSecondary, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                        {item.category}
                      </span>
                      <h3 style={{ margin: '2px 0 0 0', fontSize: '16px', fontWeight: '700', color: theme.textPrimary }}>
                        {item.title}
                      </h3>
                    </div>
                  </div>

                  <span style={{
                    backgroundColor: item.completed ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                    color: item.completed ? '#34D399' : theme.gold,
                    padding: '4px 10px',
                    borderRadius: '12px',
                    fontSize: '11.5px',
                    fontWeight: '800',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}>
                    <Flame size={12} /> +{item.xp} XP
                  </span>
                </div>

                {/* Mətn */}
                <p style={{ margin: 0, fontSize: '13px', color: theme.textMuted, lineHeight: '1.4' }}>
                  {item.desc}
                </p>

                {/* Progress Bar */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11.5px', fontWeight: '600', color: theme.textSecondary, marginBottom: '6px' }}>
                    <span>İrəliləyiş</span>
                    <span>{item.completed ? `${item.target} ${item.unit}` : `${item.current} / ${item.target} ${item.unit}`}</span>
                  </div>
                  <div style={{ width: '100%', height: '8px', backgroundColor: theme.progressBg, borderRadius: '10px', overflow: 'hidden' }}>
                    <div style={{
                      width: `${progressPercent}%`,
                      height: '100%',
                      backgroundColor: item.completed ? theme.accentGreen : '#0EA5E9',
                      borderRadius: '10px',
                      transition: 'width 0.4s ease'
                    }} />
                  </div>
                </div>

                {/* Modal Açan Düymə */}
                {item.completed ? (
                  <div style={{
                    backgroundColor: 'rgba(16, 185, 129, 0.12)',
                    color: theme.accentGreen,
                    padding: '10px',
                    borderRadius: '12px',
                    fontSize: '13px',
                    fontWeight: '700',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px'
                  }}>
                    <CheckCircle2 size={16} /> Tamamlandı
                  </div>
                ) : (
                  <button
                    onClick={() => setActiveModalTask(item)}
                    style={{
                      backgroundColor: theme.btnBg,
                      color: '#FFFFFF',
                      border: 'none',
                      padding: '11px 14px',
                      borderRadius: '12px',
                      fontSize: '13px',
                      fontWeight: '700',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      transition: 'all 0.2s ease',
                      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = theme.btnHoverBg}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = theme.btnBg}
                  >
                    <Play size={15} fill="#FFFFFF" /> Yarışmaya Başla
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Liderlər Cədvəli */}
      {activeTab === 'leaderboard' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

          {/* Seçim Keçidləri */}
          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={() => setLeaderboardScope('students')}
              style={{
                padding: '8px 18px',
                borderRadius: '10px',
                border: `1px solid ${leaderboardScope === 'students' ? theme.accentGreen : theme.borderColor}`,
                backgroundColor: leaderboardScope === 'students' ? 'rgba(16, 185, 129, 0.15)' : theme.cardBg,
                color: leaderboardScope === 'students' ? theme.accentGreen : theme.textSecondary,
                fontSize: '13px',
                fontWeight: '700',
                cursor: 'pointer'
              }}
            >
              Fərdi Tələbələr Sıralaması
            </button>
            <button
              onClick={() => setLeaderboardScope('faculties')}
              style={{
                padding: '8px 18px',
                borderRadius: '10px',
                border: `1px solid ${leaderboardScope === 'faculties' ? theme.accentGreen : theme.borderColor}`,
                backgroundColor: leaderboardScope === 'faculties' ? 'rgba(16, 185, 129, 0.15)' : theme.cardBg,
                color: leaderboardScope === 'faculties' ? theme.accentGreen : theme.textSecondary,
                fontSize: '13px',
                fontWeight: '700',
                cursor: 'pointer'
              }}
            >
              Fakültələrarası Yarış
            </button>
          </div>

          {/* Siyahı Cədvəli */}
          <div style={{ backgroundColor: theme.cardBg, border: `1px solid ${theme.borderColor}`, borderRadius: '18px', overflow: 'hidden' }}>
            {leaderboardScope === 'students' ? (
              <div>
                {sortedStudents.map((st) => (
                  <div
                    key={st.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '16px 20px',
                      borderBottom: `1px solid ${theme.borderColor}`,
                      backgroundColor: st.isUser ? 'rgba(16, 185, 129, 0.12)' : 'transparent',
                      transition: 'background-color 0.3s ease'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                      <span style={{
                        fontSize: '16px',
                        fontWeight: '800',
                        width: '32px',
                        color: st.rank === 1 ? theme.gold : (st.rank === 2 ? '#94A3B8' : (st.rank === 3 ? '#B45309' : theme.textMuted))
                      }}>
                        #{st.rank}
                      </span>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <h4 style={{ margin: 0, fontSize: '14.5px', fontWeight: '700', color: st.isUser ? theme.accentGreen : theme.textPrimary }}>
                            {st.name}
                          </h4>
                          <span style={{ fontSize: '10px', border: `1px solid ${theme.borderColor}`, padding: '1px 6px', borderRadius: '6px', color: theme.textMuted }}>
                            Lvl {st.level}
                          </span>
                        </div>
                        <span style={{ fontSize: '12px', color: theme.textMuted }}>{st.faculty}</span>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                      <span style={{ fontSize: '11px', backgroundColor: theme.progressBg, padding: '4px 10px', borderRadius: '8px', color: theme.textSecondary }}>
                        {st.badge}
                      </span>
                      <strong style={{ fontSize: '15px', fontWeight: '800', color: theme.gold }}>
                        {st.xp} XP
                      </strong>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div>
                {faculties.map((fac) => (
                  <div
                    key={fac.rank}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '16px 20px',
                      borderBottom: `1px solid ${theme.borderColor}`,
                      backgroundColor: fac.isUserFaculty ? 'rgba(16, 185, 129, 0.08)' : 'transparent'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                      <span style={{
                        fontSize: '16px',
                        fontWeight: '800',
                        width: '28px',
                        color: fac.rank === 1 ? theme.gold : (fac.rank === 2 ? '#94A3B8' : (fac.rank === 3 ? '#B45309' : theme.textMuted))
                      }}>
                        #{fac.rank}
                      </span>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <h4 style={{ margin: 0, fontSize: '14.5px', fontWeight: '700' }}>{fac.name}</h4>
                          {fac.isUserFaculty && (
                            <span style={{ backgroundColor: 'rgba(16, 185, 129, 0.2)', color: theme.accentGreen, fontSize: '10px', fontWeight: '800', padding: '2px 6px', borderRadius: '6px' }}>
                              Sənin Fakültən
                            </span>
                          )}
                        </div>
                        <span style={{ fontSize: '12px', color: theme.textMuted }}>{fac.members} aktiv tələbə qoşulub</span>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                      <span style={{ fontSize: '11px', backgroundColor: 'rgba(239, 68, 68, 0.12)', color: '#EF4444', padding: '4px 8px', borderRadius: '6px', fontWeight: '700' }}>
                        {fac.bonus}
                      </span>
                      <strong style={{ fontSize: '15px', fontWeight: '800', color: theme.gold }}>
                        {fac.xp.toLocaleString()} XP
                      </strong>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Nailiyyət Nişanları */}
      {activeTab === 'badges' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
          {badges.map((b) => (
            <div
              key={b.id}
              style={{
                backgroundColor: theme.cardBg,
                border: b.unlocked ? `1.5px solid ${theme.gold}` : `1px solid ${theme.borderColor}`,
                borderRadius: '18px',
                padding: '18px',
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                opacity: b.unlocked ? 1 : 0.6
              }}
            >
              <div style={{
                fontSize: '32px',
                backgroundColor: b.unlocked ? 'rgba(245, 158, 11, 0.12)' : theme.progressBg,
                width: '56px',
                height: '56px',
                borderRadius: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                {b.unlocked ? b.icon : <Lock size={22} color={theme.textMuted} />}
              </div>

              <div>
                <h4 style={{ margin: '0 0 4px 0', fontSize: '14px', fontWeight: '700' }}>{b.title}</h4>
                <p style={{ margin: '0 0 8px 0', fontSize: '12px', color: theme.textMuted, lineHeight: '1.3' }}>{b.desc}</p>
                <span style={{
                  fontSize: '11px',
                  fontWeight: '800',
                  color: b.unlocked ? theme.accentGreen : theme.textMuted
                }}>
                  {b.unlocked ? '✓ ' + b.status : b.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Çağırış Modalı */}
      {activeModalTask && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.75)',
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
            borderRadius: '24px',
            width: '100%',
            maxWidth: '480px',
            padding: '24px',
            boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
            position: 'relative'
          }}>
            {/* Bağlama Düyməsi */}
            <button
              onClick={() => setActiveModalTask(null)}
              style={{
                position: 'absolute',
                top: '20px',
                right: '20px',
                backgroundColor: 'transparent',
                border: 'none',
                color: theme.textMuted,
                cursor: 'pointer'
              }}
            >
              <X size={20} />
            </button>

            {/* Modal Başlığı */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '18px' }}>
              <div style={{ backgroundColor: activeModalTask.iconBg, padding: '10px', borderRadius: '12px' }}>
                {activeModalTask.icon}
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: '17px', fontWeight: '800' }}>{activeModalTask.title}</h3>
                <span style={{ fontSize: '12px', color: theme.gold, fontWeight: '700' }}>+{activeModalTask.xp} XP Mükafat</span>
              </div>
            </div>

            {/* Su İçmə Simulyası */}
            {activeModalTask.type === 'water' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', textAlign: 'center' }}>
                <p style={{ fontSize: '13px', color: theme.textSecondary, margin: 0 }}>
                  Qabı 2.0 Litr səviyyəsinə çatdırmaq üçün içdiyiniz su miktarını əlavə edin:
                </p>

                {/* Vizual Su Boku */}
                <div style={{
                  height: '140px',
                  backgroundColor: theme.progressBg,
                  borderRadius: '16px',
                  position: 'relative',
                  overflow: 'hidden',
                  border: '1px solid #0EA5E9',
                  display: 'flex',
                  alignItems: 'flex-end'
                }}>
                  <div style={{
                    width: '100%',
                    height: `${Math.min(100, (waterDrunk / 2.0) * 100)}%`,
                    backgroundColor: '#0EA5E9',
                    transition: 'height 0.4s ease',
                    opacity: 0.85
                  }} />
                  <div style={{
                    position: 'absolute',
                    width: '100%',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    fontSize: '20px',
                    fontWeight: '800',
                    color: '#FFFFFF',
                    textShadow: '0 2px 4px rgba(0,0,0,0.5)'
                  }}>
                    {waterDrunk.toFixed(1)} / 2.0 Litr
                  </div>
                </div>

                {/* Su Əlavə Etmə Düymələri */}
                <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                  <button
                    onClick={() => setWaterDrunk(prev => Math.min(2.0, prev + 0.25))}
                    style={{
                      padding: '8px 16px',
                      borderRadius: '10px',
                      backgroundColor: 'rgba(14, 165, 233, 0.2)',
                      color: '#0EA5E9',
                      border: '1px solid #0EA5E9',
                      fontWeight: '700',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    <Plus size={14} /> +250 ML Su İçdim
                  </button>
                  <button
                    onClick={() => setWaterDrunk(2.0)}
                    style={{
                      padding: '8px 16px',
                      borderRadius: '10px',
                      backgroundColor: 'rgba(14, 165, 233, 0.2)',
                      color: '#0EA5E9',
                      border: '1px solid #0EA5E9',
                      fontWeight: '700',
                      cursor: 'pointer'
                    }}
                  >
                    Hədəfi Tamamla (2L)
                  </button>
                </div>

                <button
                  disabled={waterDrunk < 2.0}
                  onClick={() => completeTask(activeModalTask.id, activeModalTask.xp)}
                  style={{
                    marginTop: '10px',
                    padding: '12px',
                    borderRadius: '12px',
                    backgroundColor: waterDrunk >= 2.0 ? theme.accentGreen : theme.progressBg,
                    color: waterDrunk >= 2.0 ? '#FFFFFF' : theme.textMuted,
                    border: 'none',
                    fontWeight: '800',
                    cursor: waterDrunk >= 2.0 ? 'pointer' : 'not-allowed',
                    transition: 'all 0.2s ease'
                  }}
                >
                  {waterDrunk >= 2.0 ? 'Mükafatı Götür (+50 XP)' : 'Hədəfə Çatmaq Üçün Suyu Doldurun'}
                </button>
              </div>
            )}

            {/* Masaüstü Əzələ Məşqi Taymeri */}
            {activeModalTask.type === 'workout' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', textAlign: 'center' }}>
                <p style={{ fontSize: '13.5px', color: theme.textSecondary, margin: 0 }}>
                  Aşağıdakı 45 saniyəlik dartınma (stretching) taymerini başladın və hərəkətləri icra edin:
                </p>

                <div style={{
                  padding: '20px',
                  backgroundColor: theme.progressBg,
                  borderRadius: '16px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <Clock size={28} color={theme.gold} />
                  <span style={{ fontSize: '36px', fontWeight: '900', color: theme.gold, fontFamily: 'monospace' }}>
                    00:{timerSeconds < 10 ? `0${timerSeconds}` : timerSeconds}
                  </span>
                  <span style={{ fontSize: '12px', color: theme.textMuted }}>
                    {timerSeconds > 30 ? '1. Boyun və Çiyin Dartınması' : (timerSeconds > 15 ? '2. Qol və Bel Açılması' : '3. Göz və Duruş Məşqi')}
                  </span>
                </div>

                <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                  <button
                    onClick={() => setIsTimerRunning(!isTimerRunning)}
                    style={{
                      padding: '10px 20px',
                      borderRadius: '12px',
                      backgroundColor: theme.gold,
                      color: '#000000',
                      border: 'none',
                      fontWeight: '800',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                  >
                    {isTimerRunning ? <Pause size={16} /> : <Play size={16} />}
                    {isTimerRunning ? 'Pauza' : 'Məşqi Başlat'}
                  </button>
                </div>

                <button
                  disabled={timerSeconds > 0}
                  onClick={() => completeTask(activeModalTask.id, activeModalTask.xp)}
                  style={{
                    marginTop: '10px',
                    padding: '12px',
                    borderRadius: '12px',
                    backgroundColor: timerSeconds === 0 ? theme.accentGreen : theme.progressBg,
                    color: timerSeconds === 0 ? '#FFFFFF' : theme.textMuted,
                    border: 'none',
                    fontWeight: '800',
                    cursor: timerSeconds === 0 ? 'pointer' : 'not-allowed'
                  }}
                >
                  {timerSeconds === 0 ? 'Məşq Tamamlandı! Mükafatı Al (+60 XP)' : 'Məşq Taymerinin Bitişini Gözləyin'}
                </button>
              </div>
            )}

            {/* Yuxu Rejimi Sorğusu */}
            {activeModalTask.type === 'sleep' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <p style={{ fontSize: '13px', color: theme.textSecondary, margin: 0 }}>
                  Dünən saat neçədə yatdığınızı qeyd edin və rejimə riayət etdiyinizi təsdiqləyin:
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontSize: '12px', color: theme.textMuted, fontWeight: '600' }}>Yatdığınız Saat:</label>
                  <input
                    type="time"
                    value={sleepTimeInput}
                    onChange={(e) => setSleepTimeInput(e.target.value)}
                    style={{
                      padding: '12px',
                      borderRadius: '10px',
                      backgroundColor: theme.progressBg,
                      border: `1px solid ${theme.borderColor}`,
                      color: '#FFFFFF',
                      fontSize: '16px',
                      textAlign: 'center'
                    }}
                  />
                </div>

                <button
                  onClick={() => setSleepVerified(true)}
                  style={{
                    padding: '10px',
                    borderRadius: '10px',
                    backgroundColor: 'rgba(139, 92, 246, 0.2)',
                    color: '#8B5CF6',
                    border: '1px solid #8B5CF6',
                    fontWeight: '700',
                    cursor: 'pointer'
                  }}
                >
                  Rejimə Uyğun Yatdığımı Təsdiqləyirəm
                </button>

                {sleepVerified && (
                  <button
                    onClick={() => completeTask(activeModalTask.id, activeModalTask.xp)}
                    style={{
                      padding: '12px',
                      borderRadius: '12px',
                      backgroundColor: theme.accentGreen,
                      color: '#FFFFFF',
                      border: 'none',
                      fontWeight: '800',
                      cursor: 'pointer'
                    }}
                  >
                    Mükafatı Qazan (+75 XP)
                  </button>
                )}
              </div>
            )}

            {/* Addım Təsdiqi */}
            {activeModalTask.type === 'steps' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', textAlign: 'center' }}>
                <p style={{ fontSize: '13px', color: theme.textSecondary, margin: 0 }}>
                  Cihazınızdakı addım sayğacı göstəricisi sinxronlaşdırılır:
                </p>
                <div style={{ padding: '16px', backgroundColor: theme.progressBg, borderRadius: '12px', color: theme.accentGreen, fontWeight: '800' }}>
                  ✓ 7,000 / 7,000 Addım Aşkar Edildi!
                </div>
                <button
                  onClick={() => completeTask(activeModalTask.id, activeModalTask.xp)}
                  style={{
                    padding: '12px',
                    borderRadius: '12px',
                    backgroundColor: theme.accentGreen,
                    color: '#FFFFFF',
                    border: 'none',
                    fontWeight: '800',
                    cursor: 'pointer'
                  }}
                >
                  Addımları Təsdiqlə və Mükafatı Al (+100 XP)
                </button>
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
}
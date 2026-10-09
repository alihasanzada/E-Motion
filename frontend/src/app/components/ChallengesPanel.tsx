"use client";

import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Flame,
  ShieldCheck,
  Zap,
  Trophy,
  Award,
  Play,
  CheckCircle2,
  Lock,
  X,
  Plus,
  Clock,
  Pause,
  Droplet,
  Activity,
  Moon,
  Dumbbell,
  Crown
} from 'lucide-react';

interface ChallengesPanelProps {
  isDarkMode?: boolean;
}

interface ChallengeItem {
  id: string;
  category: string;
  title: string;
  desc: string;
  xp: number;
  current: number;
  target: number;
  unit: string;
  completed: boolean;
  type: 'water' | 'workout' | 'sleep' | 'steps';
  iconBg: string;
  icon: React.ReactNode;
}

export default function ChallengesPanel({ isDarkMode = false }: ChallengesPanelProps) {
  const [userXP, setUserXP] = useState<number>(410);
  const [userLevel, setUserLevel] = useState<number>(3);
  const [streakDays, setStreakDays] = useState<number>(5);
  const [activeTab, setActiveTab] = useState<'challenges' | 'leaderboard' | 'badges'>('challenges');
  const [selectedCategory, setSelectedCategory] = useState<string>('Hamısı');
  const [leaderboardScope, setLeaderboardScope] = useState<'students' | 'faculties'>('students');

  const [activeModalTask, setActiveModalTask] = useState<ChallengeItem | null>(null);

  const [waterDrunk, setWaterDrunk] = useState<number>(1.4);
  const [timerSeconds, setTimerSeconds] = useState<number>(45);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);
  const [sleepTimeInput, setSleepTimeInput] = useState<string>('23:00');
  const [sleepVerified, setSleepVerified] = useState<boolean>(false);

  const theme = {
    cardBg: isDarkMode ? '#1E293B' : '#FFFFFF',
    bannerBg: isDarkMode ? '#18181B' : '#FFFFFF',
    innerBg: isDarkMode ? '#0F172A' : '#F8FAFC',
    inputBg: isDarkMode ? '#0F172A' : '#F1F5F9',
    inputText: isDarkMode ? '#F8FAFC' : '#0F172A',
    textPrimary: isDarkMode ? '#F8FAFC' : '#0F172A',
    textSecondary: isDarkMode ? '#94A3B8' : '#475569',
    textMuted: isDarkMode ? '#64748B' : '#64748B',
    borderColor: isDarkMode ? '#334155' : '#E2E8F0',
    progressBg: isDarkMode ? '#334155' : '#E2E8F0',
    lockedCardBg: isDarkMode ? '#1E293B' : '#F8FAFC',
    lockedCardBorder: isDarkMode ? '#334155' : '#E2E8F0',
    btnBg: isDarkMode ? '#334155' : '#44766C',
    btnHoverBg: isDarkMode ? '#475569' : '#38635A',
    primary: '#44766C',
    accentGreen: '#10B981',
    gold: isDarkMode ? '#F59E0B' : '#D97706'
  };

  useEffect(() => {
    let interval: any = null;
    if (isTimerRunning && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev - 1);
      }, 1000);
    } else if (timerSeconds === 0) {
      setIsTimerRunning(false);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timerSeconds]);

  const [challenges, setChallenges] = useState<ChallengeItem[]>([
    {
      id: '1',
      category: 'Qidalanma',
      title: 'Su Kampaniyası',
      desc: 'Hər gün en azı 2.0 litr su iç və qabı doldur.',
      xp: 50,
      current: 1.4,
      target: 2.0,
      unit: 'Litr',
      completed: false,
      type: 'water',
      iconBg: isDarkMode ? '#1E3A8A' : '#E0F2FE',
      icon: <Droplet size={20} color="#0EA5E9" />
    },
    {
      id: '2',
      category: 'Fiziki Aktivlik',
      title: 'Aktiv Həyat',
      desc: 'Həftə sonuna qədər günlük 7,000 addım at.',
      xp: 100,
      current: 7000,
      target: 7000,
      unit: 'Addım',
      completed: true,
      type: 'steps',
      iconBg: isDarkMode ? '#064E3B' : '#DCFCE7',
      icon: <Activity size={20} color="#10B981" />
    },
    {
      id: '3',
      category: 'Mental & İstirahət',
      title: 'Erkən Yuxu Rejimi',
      desc: 'Saat 23:00-a qədər telefonu kənara qoy və yat.',
      xp: 75,
      current: 2,
      target: 7,
      unit: 'Gün',
      completed: false,
      type: 'sleep',
      iconBg: isDarkMode ? '#312E81' : '#EDE9FE',
      icon: <Moon size={20} color="#8B5CF6" />
    },
    {
      id: '4',
      category: 'Fitnes',
      title: 'Masaüstü Əzələ Məşqi',
      desc: 'Dərs arası 45 saniyəlik canlı dartınma (stretching) et.',
      xp: 60,
      current: 0,
      target: 1,
      unit: 'Məşq',
      completed: false,
      type: 'workout',
      iconBg: isDarkMode ? '#78350F' : '#FEF3C7',
      icon: <Dumbbell size={20} color="#D97706" />
    }
  ]);

  const categories = ['Hamısı', 'Qidalanma', 'Fiziki Aktivlik', 'Mental & İstirahət', 'Fitnes'];

  const filteredChallenges = selectedCategory === 'Hamısı'
    ? challenges
    : challenges.filter(c => c.category === selectedCategory);

  const completedCount = challenges.filter(c => c.completed).length;
  const currentLevelProgress = Math.min(100, Math.round(((userXP % 200) / 200) * 100));

  const completeTask = (taskId: string, xpReward: number) => {
    setChallenges(prev =>
      prev.map(c => c.id === taskId ? { ...c, completed: true, current: c.target } : c)
    );
    setUserXP(prev => prev + xpReward);
    setActiveModalTask(null);
  };

  const sortedStudents = [
    { id: 1, name: 'Elvin Məmmədov', rank: 1, level: 12, faculty: 'Kompüter Mühəndisliyi', badge: '👑 Çempion', xp: 2450, isUser: false },
    { id: 2, name: 'Aysel Qasımova', rank: 2, level: 10, faculty: 'İqtisadiyyat', badge: '🔥 Aktiv', xp: 2100, isUser: false },
    { id: 3, name: 'Kamran Əliyev', rank: 3, level: 9, faculty: 'Pedaqoji', badge: '🎯 Hədəfçi', xp: 1850, isUser: false },
    { id: 4, name: 'Nigar Sultanova', rank: 4, level: 8, faculty: 'Kompüter Mühəndisliyi', badge: '🌱 Yeni', xp: 1620, isUser: false },
    { id: 5, name: 'Leyla Həsənova', rank: 5, level: 5, faculty: 'Təbiət Elmləri', badge: '⚡ İrəliləyən', xp: 850, isUser: false },
    { id: 6, name: 'Əli Həsənzadə', rank: 6, level: userLevel, faculty: 'Kompüter Mühəndisliyi', badge: '🎓 Sənin Mövqeyin', xp: userXP, isUser: true }
  ];

  const faculties = [
    { rank: 1, name: 'Kompüter Mühəndisliyi & İT', members: 320, bonus: '+15% XP', xp: 14250, isUserFaculty: true },
    { rank: 2, name: 'İqtisadiyyat & İdarəetmə', members: 290, bonus: '+10% XP', xp: 12890, isUserFaculty: false },
    { rank: 3, name: 'Pedaqoji & İctimai Elmlər', members: 210, bonus: '+5% XP', xp: 9450, isUserFaculty: false },
    { rank: 4, name: 'Təbiət Elmləri & İncəsənət', members: 160, bonus: '0%', xp: 7800, isUserFaculty: false }
  ];

  const badges = [
    { id: 1, title: 'Su Çempionu', desc: '5 gün ard-arda günlük su hədəfini tamamla', unlocked: true, icon: '💧', status: '✓ Qazanıldı' },
    { id: 2, title: 'Kampus Lideri', desc: 'Fakültənə ümumilikdə 300+ XP qazandır', unlocked: true, icon: '🏆', status: '✓ Qazanıldı' },
    { id: 3, title: 'Yorulmaz Addımlayan', desc: 'Bir gündə 10,000 addım məsafə qət et', unlocked: false, icon: '👟', status: '7,000 / 10,000' },
    { id: 4, title: 'Erkən Yatan', desc: '7 gün ard-arda saat 23:00-dan əvvəl yat', unlocked: false, icon: '🌙', status: '2 / 7 Gün' },
    { id: 5, title: 'Masaüstü Atlet', desc: '5 dəfə canlı masaüstü stretching məşqini bitir', unlocked: false, icon: '🧘', status: '0 / 5 Məşq' },
    { id: 6, title: 'Liderlər Sırası', desc: 'Fərdi tələbə sıralamasında İlk 3-lüyə daxil ol', unlocked: false, icon: '🥇', status: 'Sıralamada yüksəl' }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', paddingBottom: '30px', color: theme.textPrimary }}>

      {/* Top Motivation Banner */}
      <div style={{
        backgroundColor: theme.bannerBg,
        border: `1px solid ${theme.borderColor}`,
        borderRadius: '20px',
        padding: '20px 24px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '16px',
        boxShadow: isDarkMode ? 'none' : '0 2px 10px rgba(0,0,0,0.03)'
      }}>
        {/* Level & XP */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{
            width: '58px',
            height: '58px',
            borderRadius: '16px',
            backgroundColor: isDarkMode ? 'rgba(245, 158, 11, 0.12)' : '#FEF3C7',
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
              <h2 style={{ margin: 0, fontSize: '18px', fontWeight: '800', color: theme.textPrimary }}>Həftəlik Motivasiya Çağırışları</h2>
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

        {/* Active Challenges & Status */}
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <div style={{
            backgroundColor: isDarkMode ? 'rgba(239, 68, 68, 0.15)' : '#FEE2E2',
            border: `1px solid ${isDarkMode ? 'rgba(239, 68, 68, 0.3)' : '#FCA5A5'}`,
            padding: '8px 14px',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            color: '#DC2626'
          }}>
            <Flame size={18} />
            <div>
              <span style={{ display: 'block', fontSize: '10px', fontWeight: '600' }}>Aktivlik Seriyası</span>
              <strong style={{ fontSize: '13px', fontWeight: '800' }}>{streakDays} Gün</strong>
            </div>
          </div>

          <div style={{
            backgroundColor: isDarkMode ? 'rgba(16, 185, 129, 0.15)' : '#DCFCE7',
            border: `1px solid ${isDarkMode ? 'rgba(16, 185, 129, 0.3)' : '#86EFAC'}`,
            padding: '8px 14px',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            color: '#059669'
          }}>
            <ShieldCheck size={18} />
            <div>
              <span style={{ display: 'block', fontSize: '10px', fontWeight: '600' }}>Sıralama Mövqeyin</span>
              <strong style={{ fontSize: '13px', fontWeight: '800' }}>
                #{sortedStudents.find(s => s.isUser)?.rank || '6'} Sırada
              </strong>
            </div>
          </div>
        </div>
      </div>

      {/* Main Tab Transitions */}
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

        {/* Filters */}
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
                  backgroundColor: selectedCategory === cat ? (isDarkMode ? 'rgba(16, 185, 129, 0.2)' : '#DCFCE7') : 'transparent',
                  color: selectedCategory === cat ? (isDarkMode ? '#34D399' : '#059669') : theme.textMuted,
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

      {/* Active Challenges */}
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
                  boxShadow: isDarkMode ? 'none' : '0 4px 12px rgba(0,0,0,0.03)'
                }}
              >
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
                    backgroundColor: item.completed ? (isDarkMode ? 'rgba(16, 185, 129, 0.2)' : '#DCFCE7') : (isDarkMode ? 'rgba(245, 158, 11, 0.2)' : '#FEF3C7'),
                    color: item.completed ? (isDarkMode ? '#34D399' : '#059669') : theme.gold,
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

                <p style={{ margin: 0, fontSize: '13px', color: theme.textSecondary, lineHeight: '1.4' }}>
                  {item.desc}
                </p>

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

                {item.completed ? (
                  <div style={{
                    backgroundColor: isDarkMode ? 'rgba(16, 185, 129, 0.15)' : '#DCFCE7',
                    color: isDarkMode ? '#34D399' : '#059669',
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
                      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.12)'
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

      {/* Leaderboard */}
      {activeTab === 'leaderboard' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

          {/* Transition Buttons */}
          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={() => setLeaderboardScope('students')}
              style={{
                padding: '8px 18px',
                borderRadius: '10px',
                border: `1px solid ${leaderboardScope === 'students' ? theme.accentGreen : theme.borderColor}`,
                backgroundColor: leaderboardScope === 'students' ? (isDarkMode ? 'rgba(16, 185, 129, 0.2)' : '#DCFCE7') : theme.cardBg,
                color: leaderboardScope === 'students' ? (isDarkMode ? '#34D399' : '#059669') : theme.textSecondary,
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
                backgroundColor: leaderboardScope === 'faculties' ? (isDarkMode ? 'rgba(16, 185, 129, 0.2)' : '#DCFCE7') : theme.cardBg,
                color: leaderboardScope === 'faculties' ? (isDarkMode ? '#34D399' : '#059669') : theme.textSecondary,
                fontSize: '13px',
                fontWeight: '700',
                cursor: 'pointer'
              }}
            >
              Fakültələrarası Yarış
            </button>
          </div>

          {/* List Table Card */}
          <div style={{
            backgroundColor: theme.cardBg,
            border: `1px solid ${theme.borderColor}`,
            borderRadius: '18px',
            overflow: 'hidden',
            boxShadow: isDarkMode ? 'none' : '0 4px 16px rgba(0,0,0,0.03)'
          }}>
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
                      backgroundColor: st.isUser ? (isDarkMode ? 'rgba(16, 185, 129, 0.15)' : '#ECFDF5') : 'transparent',
                      transition: 'background-color 0.2s ease'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                      <span style={{
                        fontSize: '16px',
                        fontWeight: '800',
                        width: '32px',
                        color: st.rank === 1 ? theme.gold : (st.rank === 2 ? '#64748B' : (st.rank === 3 ? '#B45309' : theme.textMuted))
                      }}>
                        #{st.rank}
                      </span>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <h4 style={{ margin: 0, fontSize: '14.5px', fontWeight: '700', color: st.isUser ? '#059669' : theme.textPrimary }}>
                            {st.name}
                          </h4>
                          <span style={{ fontSize: '10px', backgroundColor: theme.innerBg, border: `1px solid ${theme.borderColor}`, padding: '2px 6px', borderRadius: '6px', color: theme.textSecondary }}>
                            Lvl {st.level}
                          </span>
                        </div>
                        <span style={{ fontSize: '12px', color: theme.textSecondary }}>{st.faculty}</span>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                      <span style={{ fontSize: '11.5px', backgroundColor: theme.innerBg, border: `1px solid ${theme.borderColor}`, padding: '4px 10px', borderRadius: '8px', color: theme.textSecondary, fontWeight: '600' }}>
                        {st.badge}
                      </span>
                      <strong style={{ fontSize: '15px', fontWeight: '800', color: theme.gold }}>
                        {st.xp.toLocaleString()} XP
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
                      backgroundColor: fac.isUserFaculty ? (isDarkMode ? 'rgba(16, 185, 129, 0.12)' : '#ECFDF5') : 'transparent'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                      <span style={{
                        fontSize: '16px',
                        fontWeight: '800',
                        width: '28px',
                        color: fac.rank === 1 ? theme.gold : (fac.rank === 2 ? '#64748B' : (fac.rank === 3 ? '#B45309' : theme.textMuted))
                      }}>
                        #{fac.rank}
                      </span>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <h4 style={{ margin: 0, fontSize: '14.5px', fontWeight: '700', color: theme.textPrimary }}>{fac.name}</h4>
                          {fac.isUserFaculty && (
                            <span style={{ backgroundColor: (isDarkMode ? 'rgba(16, 185, 129, 0.2)' : '#DCFCE7'), color: '#059669', fontSize: '10px', fontWeight: '800', padding: '2px 6px', borderRadius: '6px' }}>
                              Sənin Fakültən
                            </span>
                          )}
                        </div>
                        <span style={{ fontSize: '12px', color: theme.textSecondary }}>{fac.members} aktiv tələbə qoşulub</span>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                      <span style={{ fontSize: '11px', backgroundColor: (isDarkMode ? 'rgba(239, 68, 68, 0.15)' : '#FEE2E2'), color: '#DC2626', padding: '4px 8px', borderRadius: '6px', fontWeight: '700' }}>
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

      {/* Achievement Badges  */}
      {activeTab === 'badges' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
          {badges.map((b) => (
            <div
              key={b.id}
              style={{
                backgroundColor: b.unlocked ? theme.cardBg : theme.lockedCardBg,
                border: b.unlocked ? `2px solid ${theme.gold}` : `1px solid ${theme.lockedCardBorder}`,
                borderRadius: '18px',
                padding: '20px',
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                boxShadow: b.unlocked && !isDarkMode ? '0 4px 14px rgba(217, 119, 6, 0.12)' : 'none'
              }}
            >
              <div style={{
                fontSize: '30px',
                backgroundColor: b.unlocked ? (isDarkMode ? 'rgba(245, 158, 11, 0.15)' : '#FEF3C7') : theme.progressBg,
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
                <h4 style={{ margin: '0 0 4px 0', fontSize: '14.5px', fontWeight: '700', color: b.unlocked ? theme.textPrimary : theme.textSecondary }}>{b.title}</h4>
                <p style={{ margin: '0 0 8px 0', fontSize: '12px', color: theme.textSecondary, lineHeight: '1.3' }}>{b.desc}</p>
                <span style={{
                  fontSize: '11px',
                  fontWeight: '800',
                  color: b.unlocked ? (isDarkMode ? '#34D399' : '#059669') : theme.textMuted
                }}>
                  {b.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Task Contents */}
      {activeModalTask && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.65)',
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
            boxShadow: '0 20px 40px rgba(0,0,0,0.25)',
            position: 'relative',
            color: theme.textPrimary
          }}>
            <button
              onClick={() => setActiveModalTask(null)}
              style={{
                position: 'absolute',
                top: '20px',
                right: '20px',
                backgroundColor: 'transparent',
                border: 'none',
                color: theme.textSecondary,
                cursor: 'pointer'
              }}
            >
              <X size={20} />
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '18px' }}>
              <div style={{ backgroundColor: activeModalTask.iconBg, padding: '10px', borderRadius: '12px' }}>
                {activeModalTask.icon}
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: '17px', fontWeight: '800', color: theme.textPrimary }}>{activeModalTask.title}</h3>
                <span style={{ fontSize: '12px', color: theme.gold, fontWeight: '700' }}>+{activeModalTask.xp} XP Mükafat</span>
              </div>
            </div>

            {/* Modal Task Contents */}
            {activeModalTask.type === 'water' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', textAlign: 'center' }}>
                <p style={{ fontSize: '13px', color: theme.textSecondary, margin: 0 }}>
                  Qabı 2.0 Litr səviyyəsinə çatdırmaq üçün içdiyiniz su miqdarını əlavə edin:
                </p>
                <div style={{
                  height: '140px',
                  backgroundColor: theme.innerBg,
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

                <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                  <button
                    onClick={() => setWaterDrunk(prev => Math.min(2.0, prev + 0.25))}
                    style={{
                      padding: '8px 16px',
                      borderRadius: '10px',
                      backgroundColor: 'rgba(14, 165, 233, 0.15)',
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
                      backgroundColor: 'rgba(14, 165, 233, 0.15)',
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
                    cursor: waterDrunk >= 2.0 ? 'pointer' : 'not-allowed'
                  }}
                >
                  {waterDrunk >= 2.0 ? 'Mükafatı Götür (+50 XP)' : 'Hədəfə Çatmaq Üçün Suyu Doldurun'}
                </button>
              </div>
            )}

            {activeModalTask.type === 'workout' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', textAlign: 'center' }}>
                <p style={{ fontSize: '13.5px', color: theme.textSecondary, margin: 0 }}>
                  Aşağıdakı 45 saniyəlik dartınma (stretching) taymerini başladın və hərəkətləri icra edin:
                </p>
                <div style={{
                  padding: '20px',
                  backgroundColor: theme.innerBg,
                  borderRadius: '16px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '8px',
                  border: `1px solid ${theme.borderColor}`
                }}>
                  <Clock size={28} color={theme.gold} />
                  <span style={{ fontSize: '36px', fontWeight: '900', color: theme.gold, fontFamily: 'monospace' }}>
                    00:{timerSeconds < 10 ? `0${timerSeconds}` : timerSeconds}
                  </span>
                </div>

                <button
                  onClick={() => setIsTimerRunning(!isTimerRunning)}
                  style={{
                    padding: '10px 20px',
                    borderRadius: '12px',
                    backgroundColor: theme.gold,
                    color: '#FFFFFF',
                    border: 'none',
                    fontWeight: '800',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px'
                  }}
                >
                  {isTimerRunning ? <Pause size={16} /> : <Play size={16} />}
                  {isTimerRunning ? 'Pauza' : 'Məşqi Başlat'}
                </button>

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

            {activeModalTask.type === 'sleep' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <p style={{ fontSize: '13px', color: theme.textSecondary, margin: 0 }}>
                  Dünən saat neçədə yatdığınızı qeyd edin və rejimə riayət etdiyinizi təsdiqləyin:
                </p>
                <input
                  type="time"
                  value={sleepTimeInput}
                  onChange={(e) => setSleepTimeInput(e.target.value)}
                  style={{
                    padding: '12px',
                    borderRadius: '10px',
                    backgroundColor: theme.inputBg,
                    border: `1px solid ${theme.borderColor}`,
                    color: theme.inputText,
                    fontSize: '16px',
                    textAlign: 'center',
                    outline: 'none'
                  }}
                />
                <button
                  onClick={() => setSleepVerified(true)}
                  style={{
                    padding: '10px',
                    borderRadius: '10px',
                    backgroundColor: 'rgba(139, 92, 246, 0.15)',
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

            {activeModalTask.type === 'steps' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', textAlign: 'center' }}>
                <p style={{ fontSize: '13px', color: theme.textSecondary, margin: 0 }}>
                  Cihazınızdakı addım sayğacı göstəricisi sinxronlaşdırılır:
                </p>
                <div style={{
                  padding: '16px',
                  backgroundColor: isDarkMode ? 'rgba(16, 185, 129, 0.15)' : '#DCFCE7',
                  border: `1px solid ${theme.accentGreen}`,
                  borderRadius: '12px',
                  color: isDarkMode ? '#34D399' : '#059669',
                  fontWeight: '800'
                }}>
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
"use client";

import React, { useState } from 'react';
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
  Users,
  ShieldCheck,
  Medal,
  Lock,
  Sparkles,
  TrendingUp,
  ChevronRight,
  Filter
} from 'lucide-react';

interface ChallengesPanelProps {
  isDarkMode?: boolean;
}

export default function ChallengesPanel({ isDarkMode = true }: ChallengesPanelProps) {
  const theme = {
    cardBg: isDarkMode ? '#18181B' : '#FFFFFF',
    bgSecondary: isDarkMode ? '#121214' : '#F8FAFC',
    textPrimary: isDarkMode ? '#FFFFFF' : '#0F172A',
    textSecondary: isDarkMode ? '#A1A1AA' : '#64748B',
    textMuted: isDarkMode ? '#71717A' : '#94A3B8',
    borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : '#E2E8F0',
    progressBg: isDarkMode ? '#27272A' : '#F1F5F9',
    accentGreen: '#10B981',
    accentGreenDark: '#2E5B4E',
    btnBg: isDarkMode ? '#23473D' : '#2E5B4E',
    btnHoverBg: isDarkMode ? '#2E5B4E' : '#1D3B32',
    gold: '#F59E0B',
    purple: '#8B5CF6',
    blue: '#0EA5E9',
  };

  const [activeTab, setActiveTab] = useState<'challenges' | 'leaderboard' | 'badges'>('challenges');
  const [leaderboardScope, setLeaderboardScope] = useState<'faculties' | 'students'>('faculties');
  const [selectedCategory, setSelectedCategory] = useState<string>('Hamısı');

  const [userXP, setUserXP] = useState(350);
  const [streakDays, setStreakDays] = useState(5);

  const userLevel = Math.floor(userXP / 200) + 1;
  const currentLevelProgress = ((userXP % 200) / 200) * 100;

  const [challenges, setChallenges] = useState([
    {
      id: 1,
      title: 'Su Kampaniyası',
      desc: 'Hər gün ən azı 2 litr su iç',
      category: 'Qidalanma',
      xp: 50,
      current: 1.4,
      target: 2.0,
      unit: 'Litr',
      progress: 70,
      icon: <Droplet color="#0EA5E9" size={20} />,
      iconBg: isDarkMode ? 'rgba(14, 165, 233, 0.15)' : '#E0F2FE',
      completed: false
    },
    {
      id: 2,
      title: 'Aktiv Həyat',
      desc: 'Həftə sonuna qədər günlük 7,000 addım at',
      category: 'Fiziki Aktivlik',
      xp: 100,
      current: 7000,
      target: 7000,
      unit: 'Addım',
      progress: 100,
      icon: <Footprints color="#10B981" size={20} />,
      iconBg: isDarkMode ? 'rgba(16, 185, 129, 0.15)' : '#DCFCE7',
      completed: true
    },
    {
      id: 3,
      title: 'Erkən Yuxu Rejimi',
      desc: 'Saat 23:00-a qədər telefonu kənara qoy və yat',
      category: 'Mental & İstirahət',
      xp: 75,
      current: 2,
      target: 7,
      unit: 'Gün',
      progress: 30,
      icon: <Moon color="#8B5CF6" size={20} />,
      iconBg: isDarkMode ? 'rgba(139, 92, 246, 0.15)' : '#F5F3FF',
      completed: false
    },
    {
      id: 4,
      title: 'Masaüstü Əzələ Məşqi',
      desc: 'Dərs arası 10 dəqiqə dartınma (stretching) et',
      category: 'Fitnes',
      xp: 60,
      current: 0,
      target: 1,
      unit: 'Məşq',
      progress: 0,
      icon: <Dumbbell color="#F59E0B" size={20} />,
      iconBg: isDarkMode ? 'rgba(245, 158, 11, 0.15)' : '#FEF3C7',
      completed: false
    }
  ]);

  const faculties = [
    { rank: 1, name: 'Kompüter Mühəndisliyi & İT', xp: 14250, members: 320, bonus: '+15% XP', isUserFaculty: true },
    { rank: 2, name: 'İqtisadiyyat & İdarəetmə', xp: 12890, members: 290, bonus: '+10% XP', isUserFaculty: false },
    { rank: 3, name: 'Pedaqoji & İctimai Elmlər', xp: 9450, members: 210, bonus: '+5% XP', isUserFaculty: false },
    { rank: 4, name: 'Təbiət Elmləri & İncəsənət', xp: 7800, members: 160, bonus: '0%', isUserFaculty: false }
  ];

  const students = [
    { rank: 1, name: 'Elvin Məmmədov', faculty: 'Kompüter Mühəndisliyi', xp: 2450, level: 12, badge: '👑 Çempion' },
    { rank: 2, name: 'Aysel Qasımova', faculty: 'İqtisadiyyat', xp: 2100, level: 10, badge: '🔥 Aktiv' },
    { rank: 3, name: 'Əli Həsənzadə (Sən)', faculty: 'Kompüter Mühəndisliyi', xp: userXP, level: userLevel, badge: '⚡ İrəliləyən', isUser: true },
    { rank: 4, name: 'Kamran Əliyev', faculty: 'Pedaqoji', xp: 1850, level: 9, badge: '🎯 Hədəfçi' },
    { rank: 5, name: 'Nigar Sultanova', faculty: 'Kompüter Mühəndisliyi', xp: 1620, level: 8, badge: '🌱 Yeni' }
  ];

  const badges = [
    { id: 1, title: 'Su Çempionu', desc: '5 gün üst-üstə günlük su hədəfini tamamla', icon: '💧', unlocked: true, status: 'Qazanıldı' },
    { id: 2, title: 'Kampus Lideri', desc: 'Fakültənə ümumilikdə 300+ XP qazandır', icon: '🏆', unlocked: true, status: 'Qazanıldı' },
    { id: 3, title: 'Yorulmaz Addımlayan', desc: 'Bir gündə 10,000 addım məsafə qət et', icon: '👟', unlocked: false, status: '7,000 / 10,000' },
    { id: 4, title: 'Erkən Yatan', desc: '7 gün dalbadal saat 23:00-dan əvvəl yat', icon: '🌙', unlocked: false, status: '2 / 7 Gün' },
    { id: 5, title: 'Masaüstü Atlet', desc: '5 dəfə masaüstü stretching məşqini bitir', icon: '🧘', unlocked: false, status: '0 / 5 Məşq' },
    { id: 6, title: 'Liderlər Sırası', desc: 'Fərdi tələbə sıralamasında İlk 3-lüyə daxil ol', icon: '🥇', unlocked: true, status: 'Qazanıldı' }
  ];

  const categories = ['Hamısı', 'Qidalanma', 'Fiziki Aktivlik', 'Mental & İstirahət', 'Fitnes'];

  const handleComplete = (id: number, xp: number) => {
    setChallenges(prev =>
      prev.map(item => {
        if (item.id === id && !item.completed) {
          setUserXP(curr => curr + xp);
          return { ...item, completed: true, progress: 100, current: item.target };
        }
        return item;
      })
    );
  };

  const completedCount = challenges.filter(c => c.completed).length;

  const filteredChallenges = selectedCategory === 'Hamısı'
    ? challenges
    : challenges.filter(c => c.category === selectedCategory);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', paddingBottom: '30px', color: theme.textPrimary }}>

      {/* Başlıq Və Gamification Statistika Banneri */}
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
        {/* Sol Tərəf: Level & XP Bar */}
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
              <div style={{ width: '140px', height: '8px', backgroundColor: theme.progressBg, borderRadius: '10px', overflow: 'hidden' }}>
                <div style={{ width: `${currentLevelProgress}%`, height: '100%', backgroundColor: theme.gold, transition: 'width 0.4s ease' }} />
              </div>
              <span style={{ fontSize: '12.5px', fontWeight: '700', color: theme.gold }}>
                {userXP} XP <span style={{ color: theme.textMuted, fontWeight: '500' }}>/ {userLevel * 200} XP</span>
              </span>
            </div>
          </div>
        </div>

        {/* Sağ Tərəf: Seriya & Fakültə statusu */}
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
              <span style={{ display: 'block', fontSize: '10px', fontWeight: '600' }}>Fakültə Sıralaması</span>
              <strong style={{ fontSize: '13px', fontWeight: '800' }}>Kompüter Müh. (#1)</strong>
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

        {/* Filtrləmə */}
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

      {/* Aktiv çağırışlar */}
      {activeTab === 'challenges' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '18px' }}>
          {filteredChallenges.map((item) => (
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
              {/* Kartın Yuxarısı */}
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

              {/* Təsvir */}
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
                    width: `${item.progress}%`,
                    height: '100%',
                    backgroundColor: item.completed ? theme.accentGreen : '#3B82F6',
                    borderRadius: '10px',
                    transition: 'width 0.4s ease'
                  }} />
                </div>
              </div>

              {/* Düymə */}
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
                  onClick={() => handleComplete(item.id, item.xp)}
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
                    gap: '6px',
                    transition: 'all 0.2s ease',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = theme.btnHoverBg}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = theme.btnBg}
                >
                  İcra Et
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Liderlər Cədvəli */}
      {activeTab === 'leaderboard' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

          {/* Siyahı növü seçimi */}
          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={() => setLeaderboardScope('faculties')}
              style={{
                padding: '7px 16px',
                borderRadius: '10px',
                border: `1px solid ${leaderboardScope === 'faculties' ? theme.accentGreen : theme.borderColor}`,
                backgroundColor: leaderboardScope === 'faculties' ? 'rgba(16, 185, 129, 0.15)' : theme.cardBg,
                color: leaderboardScope === 'faculties' ? theme.accentGreen : theme.textSecondary,
                fontSize: '12.5px',
                fontWeight: '700',
                cursor: 'pointer'
              }}
            >
              Fakültələrarası Yarış
            </button>
            <button
              onClick={() => setLeaderboardScope('students')}
              style={{
                padding: '7px 16px',
                borderRadius: '10px',
                border: `1px solid ${leaderboardScope === 'students' ? theme.accentGreen : theme.borderColor}`,
                backgroundColor: leaderboardScope === 'students' ? 'rgba(16, 185, 129, 0.15)' : theme.cardBg,
                color: leaderboardScope === 'students' ? theme.accentGreen : theme.textSecondary,
                fontSize: '12.5px',
                fontWeight: '700',
                cursor: 'pointer'
              }}
            >
              Fərdi Tələbələr
            </button>
          </div>

          {/* Siyahı Cədvəli */}
          <div style={{ backgroundColor: theme.cardBg, border: `1px solid ${theme.borderColor}`, borderRadius: '18px', overflow: 'hidden' }}>
            {leaderboardScope === 'faculties' ? (
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
            ) : (
              <div>
                {students.map((st) => (
                  <div
                    key={st.rank}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '14px 20px',
                      borderBottom: `1px solid ${theme.borderColor}`,
                      backgroundColor: st.isUser ? 'rgba(16, 185, 129, 0.08)' : 'transparent'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                      <span style={{
                        fontSize: '15px',
                        fontWeight: '800',
                        width: '28px',
                        color: st.rank <= 3 ? theme.gold : theme.textMuted
                      }}>
                        #{st.rank}
                      </span>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <h4 style={{ margin: 0, fontSize: '14px', fontWeight: '700' }}>{st.name}</h4>
                          <span style={{ fontSize: '10px', border: `1px solid ${theme.borderColor}`, padding: '1px 6px', borderRadius: '6px', color: theme.textMuted }}>
                            Lvl {st.level}
                          </span>
                        </div>
                        <span style={{ fontSize: '11.5px', color: theme.textMuted }}>{st.faculty}</span>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                      <span style={{ fontSize: '11px', backgroundColor: theme.progressBg, padding: '3px 8px', borderRadius: '6px' }}>
                        {st.badge}
                      </span>
                      <strong style={{ fontSize: '14.5px', fontWeight: '800', color: theme.gold }}>
                        {st.xp} XP
                      </strong>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Nailiyyət nişanları */}
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
                opacity: b.unlocked ? 1 : 0.6,
                boxShadow: b.unlocked ? '0 4px 14px rgba(245, 158, 11, 0.08)' : 'none'
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
                  color: b.unlocked ? theme.accentGreen : theme.textMuted,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px'
                }}>
                  {b.unlocked ? '✓ ' + b.status : b.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}
"use client";
import React, { useState } from 'react';
import { Trophy, Flame, CheckCircle2, Droplet, Footprints, Moon, Dumbbell, Award } from 'lucide-react';

interface ChallengesPanelProps {
  isDarkMode?: boolean;
}

export default function ChallengesPanel({ isDarkMode = false }: ChallengesPanelProps) {
  const theme = {
    cardBg: isDarkMode ? '#1E1E1E' : '#FFFFFF',
    textPrimary: isDarkMode ? '#FFFFFF' : '#0F172A',
    textSecondary: isDarkMode ? '#94A3B8' : '#64748B',
    textMuted: isDarkMode ? '#CBD5E1' : '#475569',
    borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : '#E2E8F0',
    progressBg: isDarkMode ? '#2A2A2A' : '#F1F5F9',
    iconBgDroplet: isDarkMode ? 'rgba(14, 165, 233, 0.15)' : '#E0F2FE',
    iconBgFootprints: isDarkMode ? 'rgba(16, 185, 129, 0.15)' : '#DCFCE7',
    iconBgMoon: isDarkMode ? 'rgba(139, 92, 246, 0.15)' : '#F5F3FF',
    iconBgDumbbell: isDarkMode ? 'rgba(245, 158, 11, 0.15)' : '#FEF3C7',
    badgeXpPendingBg: isDarkMode ? 'rgba(245, 158, 11, 0.15)' : '#FEF3C7',
    badgeXpPendingText: isDarkMode ? '#FBBF24' : '#B45309',
    badgeXpDoneBg: isDarkMode ? 'rgba(16, 185, 129, 0.15)' : '#DCFCE7',
    badgeXpDoneText: isDarkMode ? '#34D399' : '#15803D',
    completedCardBg: isDarkMode ? 'rgba(16, 185, 129, 0.1)' : '#ECFDF5',
    completedCardText: isDarkMode ? '#34D399' : '#059669',
  };

  const [userXP, setUserXP] = useState(350);
  const [completedCount, setCompletedCount] = useState(1);

  const [challenges, setChallenges] = useState([
    {
      id: 1,
      title: 'Su Kampaniyası',
      desc: 'Hər gün ən azı 2 litr su iç',
      category: 'Qidalanma',
      xp: 50,
      progress: 70, // 70%
      target: '1.4 / 2.0 Litr',
      icon: <Droplet color="#0EA5E9" size={22} />,
      iconBg: theme.iconBgDroplet,
      completed: false
    },
    {
      id: 2,
      title: 'Aktiv Həyat',
      desc: 'Həftə sonuna qədər günlük 7,000 addım at',
      category: 'Fiziki Aktivlik',
      xp: 100,
      progress: 100, // 100%
      target: '7,000 / 7,000 Addım',
      icon: <Footprints color="#10B981" size={22} />,
      iconBg: theme.iconBgFootprints,
      completed: true
    },
    {
      id: 3,
      title: 'Erkən Yuxu Rejimi',
      desc: 'Saat 23:00-a qədər telefonu kənara qoy və yat',
      category: 'Mental & İstirahət',
      xp: 75,
      progress: 30, // 30%
      target: '2/7 Gün',
      icon: <Moon color="#8B5CF6" size={22} />,
      iconBg: theme.iconBgMoon,
      completed: false
    },
    {
      id: 4,
      title: 'Masaüstü Əzələ Məşqi',
      desc: 'Dərs arası 10 dəqiqə dartınma (stretching) et',
      category: 'Fitnes',
      xp: 60,
      progress: 0,
      target: '0/1 Məşq',
      icon: <Dumbbell color="#F59E0B" size={22} />,
      iconBg: theme.iconBgDumbbell,
      completed: false
    }
  ]);

  const handleComplete = (id: number, xp: number) => {
    setChallenges(prev =>
      prev.map(item => {
        if (item.id === id && !item.completed) {
          setUserXP(curr => curr + xp);
          setCompletedCount(curr => curr + 1);
          return { ...item, completed: true, progress: 100 };
        }
        return item;
      })
    );
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', paddingBottom: '40px' }}>
      
      {/* 1. Başlıq və Statistika Xülasəsi */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 style={{ margin: 0, fontSize: '22px', fontWeight: '800', color: theme.textPrimary, letterSpacing: '-0.5px' }}>
            Həftəlik Motivasiya Çağırışları
          </h2>
          <p style={{ margin: '4px 0 0 0', fontSize: '13.5px', color: theme.textSecondary }}>
            Sağlam vərdişlər qazanın, çağırışları icra edin və xallar toplayaraq liderlər sırasına yüksəlin!
          </p>
        </div>

        {/* Gamification Badge-ləri */}
        <div style={{ display: 'flex', gap: '12px' }}>
          <div style={{
            backgroundColor: theme.cardBg,
            border: `1px solid ${theme.borderColor}`,
            padding: '8px 16px',
            borderRadius: '14px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.02)'
          }}>
            <div style={{ backgroundColor: isDarkMode ? 'rgba(245, 158, 11, 0.15)' : '#FEF3C7', padding: '8px', borderRadius: '10px', color: '#D97706' }}>
              <Trophy size={18} />
            </div>
            <div>
              <span style={{ display: 'block', fontSize: '11px', color: theme.textSecondary, fontWeight: '500' }}>Ümumi XP</span>
              <strong style={{ fontSize: '15px', color: theme.textPrimary, fontWeight: '800' }}>{userXP} XP</strong>
            </div>
          </div>

          <div style={{
            backgroundColor: theme.cardBg,
            border: `1px solid ${theme.borderColor}`,
            padding: '8px 16px',
            borderRadius: '14px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.02)'
          }}>
            <div style={{ backgroundColor: isDarkMode ? 'rgba(16, 185, 129, 0.15)' : '#DCFCE7', padding: '8px', borderRadius: '10px', color: '#16A34A' }}>
              <Award size={18} />
            </div>
            <div>
              <span style={{ display: 'block', fontSize: '11px', color: theme.textSecondary, fontWeight: '500' }}>Tamamlanan</span>
              <strong style={{ fontSize: '15px', color: theme.textPrimary, fontWeight: '800' }}>{completedCount} / {challenges.length}</strong>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Çağırış Kartları Siyahısı */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '18px' }}>
        {challenges.map((item) => (
          <div
            key={item.id}
            style={{
              backgroundColor: theme.cardBg,
              border: item.completed ? '1.5px solid #10B981' : `1px solid ${theme.borderColor}`,
              borderRadius: '20px',
              padding: '20px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              gap: '16px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
              transition: 'all 0.2s ease',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            {/* Üst Hissə: Icon, Başlıq və XP */}
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
                backgroundColor: item.completed ? theme.badgeXpDoneBg : theme.badgeXpPendingBg,
                color: item.completed ? theme.badgeXpDoneText : theme.badgeXpPendingText,
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

            {/* Tərəqqi Zolağı (Progress Bar) */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11.5px', fontWeight: '600', color: theme.textSecondary, marginBottom: '6px' }}>
                <span>İrəliləyiş</span>
                <span>{item.target}</span>
              </div>
              <div style={{ width: '100%', height: '8px', backgroundColor: theme.progressBg, borderRadius: '10px', overflow: 'hidden' }}>
                <div style={{
                  width: `${item.progress}%`,
                  height: '100%',
                  backgroundColor: item.completed ? '#10B981' : (isDarkMode ? '#4ADE80' : '#2E5B4E'),
                  borderRadius: '10px',
                  transition: 'width 0.4s ease'
                }} />
              </div>
            </div>

            {/* Alt Düymə */}
            {item.completed ? (
              <div style={{
                backgroundColor: theme.completedCardBg,
                color: theme.completedCardText,
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
                  backgroundColor: isDarkMode ? '#23473D' : '#2E5B4E',
                  color: '#FFFFFF',
                  border: 'none',
                  padding: '10px 14px',
                  borderRadius: '12px',
                  fontSize: '13px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  transition: 'all 0.2s ease',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = isDarkMode ? '#2E5B4E' : '#23473D'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = isDarkMode ? '#23473D' : '#2E5B4E'}
              >
                İcra Et
              </button>
            )}
          </div>
        ))}
      </div>

    </div>
  );
}
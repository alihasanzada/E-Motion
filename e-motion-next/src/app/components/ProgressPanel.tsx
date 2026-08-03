"use client";
import React, { useState } from 'react';
import { Flame, Award, CheckCircle2, Circle, Trophy, Star, Zap, Target } from 'lucide-react';

export default function MyProgressPanel() {
  const [streakDays] = useState(5);
  const [userLevel] = useState(3);
  const [currentXP] = useState(750);
  const [nextLevelXP] = useState(1000);

  // Həftəlik Hədəflər Siyahısı
  const [goals, setGoals] = useState([
    { id: 1, title: 'Həftəlik 3 dəfə fiziki aktivlik etmək', completed: true, category: 'Fiziki Aktivlik' },
    { id: 2, title: 'Gündəlik 2L su içmək (7 gün)', completed: true, category: 'Sağlamlıq' },
    { id: 3, title: 'Azon azı 1 Kampus Tədbirində iştirak etmək', completed: false, category: 'Sosial' },
    { id: 4, title: 'Həftədə 2 dəfə qidalanma menyusunu qeyd etmək', completed: false, category: 'Qidalanma' },
  ]);

  // Nişanlar (Badges)
  const badges = [
    { id: 1, name: 'Hidratasiya Ustası', desc: '7 gün ardıcıl su balansı', unlocked: true, icon: '💧' },
    { id: 2, name: 'Erkən Qalxan', desc: 'Səhər yürüşləri tamamlandı', unlocked: true, icon: '🌅' },
    { id: 3, name: 'Sosial Tələbə', desc: '3 tədbirə qatıldın', unlocked: true, icon: '🎉' },
    { id: 4, name: 'İdman Həvəskarı', desc: '5 idman seansı', unlocked: true, icon: '🏋️' },
    { id: 5, name: 'Marfonçu', desc: '10,000 addım hədəfi', unlocked: false, icon: '🏃' },
    { id: 6, name: 'Master Mind', desc: 'Mental sağlamlıq testləri', unlocked: false, icon: '🧠' }
  ];

  const toggleGoal = (id: number) => {
    setGoals(goals.map(g => g.id === id ? { ...g, completed: !g.completed } : g));
  };

  const xpPercent = Math.min(Math.round((currentXP / nextLevelXP) * 100), 100);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', paddingBottom: '40px' }}>
      
      {/* 1. Başlıq */}
      <div>
        <h2 style={{ margin: 0, fontSize: '22px', fontWeight: '800', color: '#0F172A', letterSpacing: '-0.5px' }}>
          Mənimsənilmiş İrəliləyiş və Uğurlar
        </h2>
        <p style={{ margin: '4px 0 0 0', fontSize: '13.5px', color: '#64748B' }}>
          Şəxsi inkişaf hədəfləriniz, qazandığınız nişanlar və vərdiş zənciriniz.
        </p>
      </div>

      {/* 2. Səviyyə və XP Status Banneri */}
      <div style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '20px',
        padding: '24px',
        border: '1px solid #E2E8F0',
        boxShadow: '0 4px 12px rgba(0,0,0,0.02)',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '24px',
        alignItems: 'center'
      }}>
        {/* Level İkonu vər Ədədi */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{
            width: '56px',
            height: '56px',
            borderRadius: '16px',
            backgroundColor: '#FEF3C7',
            border: '1px solid #FDE68A',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#D97706'
          }}>
            <Trophy size={28} />
          </div>
          <div>
            <span style={{ fontSize: '12px', fontWeight: '700', color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Mövcud Səviyyə
            </span>
            <h3 style={{ margin: 0, fontSize: '20px', fontWeight: '800', color: '#0F172A' }}>
              Səviyyə {userLevel} - Aktiv Tələbə
            </h3>
          </div>
        </div>

        {/* XP Progress Bar */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '12.5px', fontWeight: '700' }}>
            <span style={{ color: '#64748B', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Zap size={14} color="#2E5B4E" /> Təcrübə Xalı (XP)
            </span>
            <span style={{ color: '#0F172A' }}>{currentXP} / {nextLevelXP} XP</span>
          </div>
          <div style={{ width: '100%', height: '10px', backgroundColor: '#F1F5F9', borderRadius: '10px', overflow: 'hidden' }}>
            <div style={{
              width: `${xpPercent}%`,
              height: '100%',
              backgroundColor: '#2E5B4E',
              borderRadius: '10px',
              transition: 'width 0.4s ease'
            }} />
          </div>
        </div>
      </div>

      {/* 3. Vərdiş Zənciri və Qazanılan Nişanlar Kartları */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
        
        {/* Vərdiş Zənciri */}
        <div style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '20px',
          padding: '20px',
          border: '1px solid #E2E8F0',
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.02)'
        }}>
          <div style={{ backgroundColor: '#FFEDD5', padding: '14px', borderRadius: '16px', color: '#EA580C' }}>
            <Flame size={28} />
          </div>
          <div>
            <span style={{ fontSize: '12px', color: '#64748B', fontWeight: '600' }}>Vərdiş Zənciri</span>
            <h4 style={{ margin: '2px 0 0 0', fontSize: '22px', fontWeight: '800', color: '#0F172A' }}>
              {streakDays} Gün Ardıcıl
            </h4>
            <span style={{ fontSize: '11.5px', color: '#16A34A', fontWeight: '600' }}>🔥 Möhtəşəm tempdir!</span>
          </div>
        </div>

        {/* Qazanılan Nişanlar Xülasəsi */}
        <div style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '20px',
          padding: '20px',
          border: '1px solid #E2E8F0',
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.02)'
        }}>
          <div style={{ backgroundColor: '#E0E7FF', padding: '14px', borderRadius: '16px', color: '#4F46E5' }}>
            <Award size={28} />
          </div>
          <div>
            <span style={{ fontSize: '12px', color: '#64748B', fontWeight: '600' }}>Kollektsiya</span>
            <h4 style={{ margin: '2px 0 0 0', fontSize: '22px', fontWeight: '800', color: '#0F172A' }}>
              {badges.filter(b => b.unlocked).length} / {badges.length} Nişan
            </h4>
            <span style={{ fontSize: '11.5px', color: '#64748B', fontWeight: '500' }}>2 yeni nişan kilitlidir</span>
          </div>
        </div>

      </div>

      {/* 4. Cari Həftəlik Hədəflər & Nişanlar Vitrini */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px', alignItems: 'start' }}>
        
        {/* Sol: İnteraktiv Hədəf Siyahısı */}
        <div style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '20px',
          padding: '24px',
          border: '1px solid #E2E8F0',
          boxShadow: '0 4px 12px rgba(0,0,0,0.02)',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px'
        }}>
          <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '700', color: '#0F172A', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Target size={18} color="#2E5B4E" /> Həftəlik Hədəflərim
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {goals.map((goal) => (
              <div
                key={goal.id}
                onClick={() => toggleGoal(goal.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px 14px',
                  borderRadius: '12px',
                  backgroundColor: goal.completed ? '#F0FDF4' : '#F8FAFC',
                  border: '1px solid',
                  borderColor: goal.completed ? '#DCFCE7' : '#F1F5F9',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                {goal.completed ? (
                  <CheckCircle2 size={20} color="#16A34A" />
                ) : (
                  <Circle size={20} color="#94A3B8" />
                )}
                <div style={{ flex: 1 }}>
                  <p style={{
                    margin: 0,
                    fontSize: '13px',
                    fontWeight: '600',
                    color: goal.completed ? '#166534' : '#0F172A',
                    textDecoration: goal.completed ? 'line-through' : 'none'
                  }}>
                    {goal.title}
                  </p>
                  <span style={{ fontSize: '11px', color: goal.completed ? '#22C55E' : '#64748B' }}>
                    {goal.category}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sağ: Qazanılan və Kilitli Nişanlar */}
        <div style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '20px',
          padding: '24px',
          border: '1px solid #E2E8F0',
          boxShadow: '0 4px 12px rgba(0,0,0,0.02)',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px'
        }}>
          <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '700', color: '#0F172A', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Star size={18} color="#D97706" /> Qazanılan Nişanlar
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
            {badges.map((b) => (
              <div
                key={b.id}
                style={{
                  padding: '12px',
                  borderRadius: '14px',
                  backgroundColor: b.unlocked ? '#F8FAFC' : '#FAFAFA',
                  border: '1px solid',
                  borderColor: b.unlocked ? '#E2E8F0' : '#F1F5F9',
                  opacity: b.unlocked ? 1 : 0.5,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px'
                }}
              >
                <span style={{ fontSize: '24px' }}>{b.icon}</span>
                <div>
                  <h5 style={{ margin: 0, fontSize: '12.5px', fontWeight: '700', color: '#0F172A' }}>{b.name}</h5>
                  <p style={{ margin: 0, fontSize: '10.5px', color: '#64748B' }}>{b.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
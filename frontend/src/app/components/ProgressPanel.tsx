"use client";
import React, { useState, useEffect } from 'react';
import { Flame, Award, CheckCircle2, Circle, Trophy, Star, Zap, Target, Plus, Trash2, Lock, Sparkles } from 'lucide-react';

interface ProgressPanelProps {
  isDarkMode?: boolean;
}

interface Goal {
  id: number;
  title: string;
  completed: boolean;
  category: string;
}

const INITIAL_GOALS: Goal[] = [
  { id: 1, title: 'Həftəlik 3 dəfə fiziki aktivlik etmək', completed: true, category: 'Fiziki Aktivlik' },
  { id: 2, title: 'Gündəlik 2L su içmək (7 gün)', completed: true, category: 'Sağlamlıq' },
  { id: 3, title: 'Ən azı 1 Kampus Tədbirində iştirak etmək', completed: false, category: 'Sosial' },
  { id: 4, title: 'Həftədə 2 dəfə qidalanma menyusunu qeyd etmək', completed: false, category: 'Qidalanma' },
];

export default function ProgressPanel({ isDarkMode = false }: ProgressPanelProps) {
  const theme = {
    cardBg: isDarkMode ? '#1E1E1E' : '#FFFFFF',
    textPrimary: isDarkMode ? '#FFFFFF' : '#0F172A',
    textSecondary: isDarkMode ? '#94A3B8' : '#64748B',
    borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : '#E2E8F0',
    progressBg: isDarkMode ? '#2A2A2A' : '#F1F5F9',
    trophyIconBg: isDarkMode ? 'rgba(245, 158, 11, 0.15)' : '#FEF3C7',
    trophyIconBorder: isDarkMode ? 'rgba(245, 158, 11, 0.3)' : '#FDE68A',
    streakBg: isDarkMode ? 'rgba(234, 88, 12, 0.15)' : '#FFEDD5',
    awardBg: isDarkMode ? 'rgba(79, 70, 229, 0.15)' : '#E0E7FF',
    goalBg: isDarkMode ? '#27272A' : '#F8FAFC',
    goalBorder: isDarkMode ? 'rgba(255, 255, 255, 0.05)' : '#F1F5F9',
    goalCompletedBg: isDarkMode ? 'rgba(22, 163, 74, 0.15)' : '#F0FDF4',
    goalCompletedBorder: isDarkMode ? 'rgba(22, 163, 74, 0.3)' : '#DCFCE7',
    goalCompletedText: isDarkMode ? '#CBD5E1' : '#1E293B',
    badgeBg: isDarkMode ? '#27272A' : '#F8FAFC',
    badgeBorder: isDarkMode ? 'rgba(255, 255, 255, 0.08)' : '#E2E8F0',
    badgeLockedBg: isDarkMode ? '#18181B' : '#FAFAFA',
    badgeLockedBorder: isDarkMode ? 'rgba(255, 255, 255, 0.04)' : '#F1F5F9',
    inputBg: isDarkMode ? '#27272A' : '#F1F5F9',
    accentGreen: isDarkMode ? '#4ADE80' : '#2E5B4E',
  };

  const baseXP = 650;
  const xpPerGoal = 50;
  const userLevel = 3;
  const nextLevelXP = 1000;

  const weekDays = [
    { day: 'B.E', active: true },
    { day: 'Ç.A', active: true },
    { day: 'Ç', active: true },
    { day: 'C.A', active: true },
    { day: 'C', active: true },
    { day: 'Ş', active: false },
    { day: 'B', active: false },
  ];

  const [goals, setGoals] = useState<Goal[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('e_motion_goals');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {
          return INITIAL_GOALS;
        }
      }
    }
    return INITIAL_GOALS;
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('e_motion_goals', JSON.stringify(goals));
    }
  }, [goals]);

  const [isAddingGoal, setIsAddingGoal] = useState(false);
  const [newGoalTitle, setNewGoalTitle] = useState('');
  const [newGoalCategory, setNewGoalCategory] = useState('Sağlamlıq');

  const badges = [
    { id: 1, name: 'Hidratasiya Ustası', desc: '7 gün ardıcıl su balansı', unlocked: true, icon: '💧', progress: '7/7 gün' },
    { id: 2, name: 'Erkən Qalxan', desc: 'Səhər yürüşləri tamamlandı', unlocked: true, icon: '🌅', progress: 'Tamamlandı' },
    { id: 3, name: 'Sosial Tələbə', desc: '3 tədbirə qatıldın', unlocked: true, icon: '🎉', progress: '3/3 tədbir' },
    { id: 4, name: 'İdman Həvəskarı', desc: '5 idman seansı', unlocked: true, icon: '🏋️', progress: '5/5 seans' },
    { id: 5, name: 'Marafonçu', desc: '10,000 addım hədəfi', unlocked: false, icon: '🏃', progress: '7,200 / 10,000 addım' },
    { id: 6, name: 'Master Mind', desc: 'Mental sağlamlıq testləri', unlocked: false, icon: '🧠', progress: '1 / 3 test' }
  ];

  const toggleGoal = (id: number) => {
    setGoals(goals.map(g => g.id === id ? { ...g, completed: !g.completed } : g));
  };

  const handleAddGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGoalTitle.trim()) return;

    const newGoal: Goal = {
      id: Date.now(),
      title: newGoalTitle.trim(),
      completed: false,
      category: newGoalCategory
    };

    setGoals([...goals, newGoal]);
    setNewGoalTitle('');
    setIsAddingGoal(false);
  };

  const handleDeleteGoal = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setGoals(goals.filter(g => g.id !== id));
  };

  const completedCount = goals.filter(g => g.completed).length;
  const currentXP = baseXP + (completedCount * xpPerGoal);
  const xpPercent = Math.min(Math.round((currentXP / nextLevelXP) * 100), 100);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', paddingBottom: '40px' }}>

      {/* Başlıq */}
      <div>
        <h2 style={{ margin: 0, fontSize: '22px', fontWeight: '800', color: theme.textPrimary, letterSpacing: '-0.5px' }}>
          Mənimsənilmiş İrəliləyiş və Uğurlar
        </h2>
        <p style={{ margin: '4px 0 0 0', fontSize: '13.5px', color: theme.textSecondary }}>
          Şəxsi inkişaf hədəfləriniz, qazandığınız nişanlar və vərdiş zənciriniz.
        </p>
      </div>

      {/* Səviyyə və XP Status Banneri */}
      <div style={{
        backgroundColor: theme.cardBg,
        borderRadius: '20px',
        padding: '24px',
        border: `1px solid ${theme.borderColor}`,
        boxShadow: '0 4px 12px rgba(0,0,0,0.02)',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '24px',
        alignItems: 'center'
      }}>
        {/* Level İkonu */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{
            width: '56px',
            height: '56px',
            borderRadius: '16px',
            backgroundColor: theme.trophyIconBg,
            border: `1px solid ${theme.trophyIconBorder}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#D97706',
            flexShrink: 0
          }}>
            <Trophy size={28} />
          </div>
          <div>
            <span style={{ fontSize: '12px', fontWeight: '700', color: theme.textSecondary, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Mövcud Səviyyə
            </span>
            <h3 style={{ margin: 0, fontSize: '20px', fontWeight: '800', color: theme.textPrimary }}>
              Səviyyə {userLevel} - Aktiv Tələbə
            </h3>
          </div>
        </div>

        {/* XP Progress Bar */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '12.5px', fontWeight: '700' }}>
            <span style={{ color: theme.textSecondary, display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Zap size={15} color={theme.accentGreen} /> Təcrübə Xalı (XP)
            </span>
            <span style={{ color: theme.textPrimary }}>{currentXP} / {nextLevelXP} XP</span>
          </div>
          <div style={{ width: '100%', height: '10px', backgroundColor: theme.progressBg, borderRadius: '10px', overflow: 'hidden' }}>
            <div style={{
              width: `${xpPercent}%`,
              height: '100%',
              backgroundColor: theme.accentGreen,
              borderRadius: '10px',
              transition: 'width 0.4s ease'
            }} />
          </div>
          <span style={{ fontSize: '11px', color: theme.textSecondary, marginTop: '6px', display: 'block' }}>
            Növbəti səviyyəyə çatmağa {nextLevelXP - currentXP} XP qaldı 🚀
          </span>
        </div>
      </div>

      {/* Vərdiş Zənciri və Qazanılan Nişanlar Kartları */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>

        {/* Vərdiş Zənciri */}
        <div style={{
          backgroundColor: theme.cardBg,
          borderRadius: '20px',
          padding: '20px',
          border: `1px solid ${theme.borderColor}`,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          gap: '16px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.02)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ backgroundColor: theme.streakBg, padding: '14px', borderRadius: '16px', color: '#EA580C', flexShrink: 0 }}>
              <Flame size={28} />
            </div>
            <div>
              <span style={{ fontSize: '12px', color: theme.textSecondary, fontWeight: '600' }}>Vərdiş Zənciri</span>
              <h4 style={{ margin: '2px 0 0 0', fontSize: '22px', fontWeight: '800', color: theme.textPrimary }}>
                5 Gün Ardıcıl
              </h4>
              <span style={{ fontSize: '11.5px', color: '#16A34A', fontWeight: '600' }}>🔥 Möhtəşəm tempdir!</span>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '10px', borderTop: `1px dashed ${theme.borderColor}` }}>
            {weekDays.map((item, idx) => (
              <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                <span style={{ fontSize: '10px', fontWeight: '700', color: theme.textSecondary }}>{item.day}</span>
                <div style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  backgroundColor: item.active ? (isDarkMode ? 'rgba(234, 88, 12, 0.25)' : '#FFEDD5') : theme.progressBg,
                  border: `1.5px solid ${item.active ? '#EA580C' : 'transparent'}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '11px',
                  color: item.active ? '#EA580C' : theme.textSecondary,
                  fontWeight: 'bold'
                }}>
                  {item.active ? '✓' : ''}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Qazanılan Nişanlar Xülasəsi */}
        <div style={{
          backgroundColor: theme.cardBg,
          borderRadius: '20px',
          padding: '20px',
          border: `1px solid ${theme.borderColor}`,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          gap: '16px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.02)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ backgroundColor: theme.awardBg, padding: '14px', borderRadius: '16px', color: '#4F46E5', flexShrink: 0 }}>
              <Award size={28} />
            </div>
            <div>
              <span style={{ fontSize: '12px', color: theme.textSecondary, fontWeight: '600' }}>Kolleksiya</span>
              <h4 style={{ margin: '2px 0 0 0', fontSize: '22px', fontWeight: '800', color: theme.textPrimary }}>
                {badges.filter(b => b.unlocked).length} / {badges.length} Nişan
              </h4>
              <span style={{ fontSize: '11.5px', color: theme.textSecondary, fontWeight: '500' }}>2 yeni nişan kilitlidir</span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 12px', backgroundColor: theme.progressBg, borderRadius: '12px' }}>
            <Sparkles size={16} color="#D97706" />
            <span style={{ fontSize: '11.5px', color: theme.textSecondary, fontWeight: '600' }}>
              Növbəti nişan: <strong style={{ color: theme.textPrimary }}>Marafonçu</strong>
            </span>
          </div>
        </div>

      </div>

      {/* Cari Həftəlik Hədəflər & Nişanlar Vitrini */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px', alignItems: 'start' }}>

        {/* Sol: İnteraktiv Hədəf Siyahısı */}
        <div style={{
          backgroundColor: theme.cardBg,
          borderRadius: '20px',
          padding: '24px',
          border: `1px solid ${theme.borderColor}`,
          boxShadow: '0 4px 12px rgba(0,0,0,0.02)',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '700', color: theme.textPrimary, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Target size={18} color={theme.accentGreen} /> Həftəlik Hədəflərim
              </h3>
              <span style={{ fontSize: '11.5px', color: theme.textSecondary }}>
                {completedCount} / {goals.length} tamamlandı ({goals.length > 0 ? Math.round((completedCount / goals.length) * 100) : 0}%)
              </span>
            </div>

            <button
              onClick={() => setIsAddingGoal(!isAddingGoal)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                padding: '6px 12px',
                borderRadius: '10px',
                backgroundColor: isAddingGoal ? 'rgba(239, 68, 68, 0.1)' : (isDarkMode ? 'rgba(255,255,255,0.08)' : '#F1F5F9'),
                color: isAddingGoal ? '#EF4444' : theme.textPrimary,
                border: 'none',
                fontSize: '12px',
                fontWeight: '700',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              <Plus size={14} style={{ transform: isAddingGoal ? 'rotate(45deg)' : 'none', transition: 'transform 0.2s' }} />
              {isAddingGoal ? 'Ləğv et' : 'Yeni Hədəf'}
            </button>
          </div>

          {isAddingGoal && (
            <form onSubmit={handleAddGoal} style={{ display: 'flex', flexDirection: 'column', gap: '10px', padding: '12px', backgroundColor: theme.inputBg, borderRadius: '12px' }}>
              <input
                type="text"
                placeholder="Hədəfin adını yazın..."
                value={newGoalTitle}
                onChange={(e) => setNewGoalTitle(e.target.value)}
                style={{
                  padding: '8px 12px',
                  borderRadius: '8px',
                  border: `1px solid ${theme.borderColor}`,
                  backgroundColor: theme.cardBg,
                  color: theme.textPrimary,
                  fontSize: '13px',
                  outline: 'none'
                }}
                autoFocus
              />
              <div style={{ display: 'flex', gap: '8px' }}>
                <select
                  value={newGoalCategory}
                  onChange={(e) => setNewGoalCategory(e.target.value)}
                  style={{
                    flex: 1,
                    padding: '8px',
                    borderRadius: '8px',
                    border: `1px solid ${theme.borderColor}`,
                    backgroundColor: theme.cardBg,
                    color: theme.textPrimary,
                    fontSize: '12px'
                  }}
                >
                  <option value="Sağlamlıq">Sağlamlıq</option>
                  <option value="Fiziki Aktivlik">Fiziki Aktivlik</option>
                  <option value="Sosial">Sosial</option>
                  <option value="Qidalanma">Qidalanma</option>
                  <option value="Təhsil">Təhsil</option>
                </select>
                <button
                  type="submit"
                  style={{
                    padding: '8px 16px',
                    borderRadius: '8px',
                    backgroundColor: theme.accentGreen,
                    color: isDarkMode ? '#0F172A' : '#FFFFFF',
                    border: 'none',
                    fontWeight: '700',
                    fontSize: '12px',
                    cursor: 'pointer'
                  }}
                >
                  Əlavə et
                </button>
              </div>
            </form>
          )}

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
                  backgroundColor: goal.completed ? theme.goalCompletedBg : theme.goalBg,
                  border: '1px solid',
                  borderColor: goal.completed ? theme.goalCompletedBorder : theme.goalBorder,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  position: 'relative'
                }}
              >
                {goal.completed ? (
                  <CheckCircle2 size={20} color={isDarkMode ? '#4ADE80' : '#16A34A'} style={{ flexShrink: 0 }} />
                ) : (
                  <Circle size={20} color={theme.textSecondary} style={{ flexShrink: 0 }} />
                )}
                <div style={{ flex: 1 }}>
                  <p style={{
                    margin: 0,
                    fontSize: '13px',
                    fontWeight: '600',
                    color: goal.completed ? theme.goalCompletedText : theme.textPrimary,
                    textDecoration: goal.completed ? 'line-through' : 'none',
                    opacity: goal.completed ? 0.75 : 1
                  }}>
                    {goal.title}
                  </p>
                  <span style={{ fontSize: '11px', color: goal.completed ? (isDarkMode ? '#86EFAC' : '#166534') : theme.textSecondary }}>
                    {goal.category} • +50 XP
                  </span>
                </div>

                <button
                  onClick={(e) => handleDeleteGoal(goal.id, e)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: theme.textSecondary,
                    cursor: 'pointer',
                    padding: '4px',
                    borderRadius: '6px',
                    opacity: 0.6,
                    transition: 'opacity 0.2s'
                  }}
                  title="Hədəfi sil"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Sağ: Qazanılan və Kilidli Nişanlar */}
        <div style={{
          backgroundColor: theme.cardBg,
          borderRadius: '20px',
          padding: '24px',
          border: `1px solid ${theme.borderColor}`,
          boxShadow: '0 4px 12px rgba(0,0,0,0.02)',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px'
        }}>
          <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '700', color: theme.textPrimary, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Star size={18} color="#D97706" /> Qazanılan Nişanlar
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
            {badges.map((b) => (
              <div
                key={b.id}
                style={{
                  padding: '12px',
                  borderRadius: '14px',
                  backgroundColor: b.unlocked ? theme.badgeBg : theme.badgeLockedBg,
                  border: '1px solid',
                  borderColor: b.unlocked ? theme.badgeBorder : theme.badgeLockedBorder,
                  opacity: b.unlocked ? 1 : 0.6,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  position: 'relative'
                }}
              >
                <div style={{ position: 'relative' }}>
                  <span style={{ fontSize: '24px', filter: b.unlocked ? 'none' : 'grayscale(80%)' }}>{b.icon}</span>
                  {!b.unlocked && (
                    <div style={{
                      position: 'absolute',
                      bottom: '-2px',
                      right: '-4px',
                      backgroundColor: 'rgba(0,0,0,0.6)',
                      borderRadius: '50%',
                      padding: '2px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <Lock size={10} color="#FFFFFF" />
                    </div>
                  )}
                </div>
                <div>
                  <h5 style={{ margin: 0, fontSize: '12.5px', fontWeight: '700', color: theme.textPrimary }}>{b.name}</h5>
                  <p style={{ margin: '2px 0 0 0', fontSize: '10.5px', color: theme.textSecondary }}>{b.desc}</p>
                  <span style={{ fontSize: '9.5px', fontWeight: '700', color: b.unlocked ? '#16A34A' : theme.textSecondary, marginTop: '2px', display: 'block' }}>
                    {b.progress}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
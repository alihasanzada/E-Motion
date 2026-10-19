"use client";

import React, { useState, useEffect } from 'react';
import { apiFetch } from '@/utils/api';
import {
  Flame,
  Award,
  CheckCircle2,
  Circle,
  Trophy,
  Star,
  Zap,
  Target,
  Plus,
  Trash2,
  Lock,
  Sparkles
} from 'lucide-react';

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
  const [steps, setSteps] = useState<number>(0);
  const [activeMinutes, setActiveMinutes] = useState<number>(0);
  const [streakDays, setStreakDays] = useState<number>(5);

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

  const [isAddingGoal, setIsAddingGoal] = useState(false);
  const [newGoalTitle, setNewGoalTitle] = useState('');
  const [newGoalCategory, setNewGoalCategory] = useState('Sağlamlıq');

  const syncRealData = () => {
    if (typeof window !== 'undefined') {
      const savedSteps = localStorage.getItem('user_steps');
      const savedMins = localStorage.getItem('user_active_minutes');
      const savedStreak = localStorage.getItem('user_streak');

      if (savedSteps !== null) setSteps(Number(savedSteps));
      if (savedMins !== null) setActiveMinutes(Number(savedMins));
      if (savedStreak !== null) setStreakDays(Number(savedStreak));
    }
  };

  useEffect(() => {
    syncRealData();

    const handleStorageUpdate = () => syncRealData();
    window.addEventListener('storage', handleStorageUpdate);
    window.addEventListener('activity-updated', handleStorageUpdate);

    return () => {
      window.removeEventListener('storage', handleStorageUpdate);
      window.removeEventListener('activity-updated', handleStorageUpdate);
    };
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('e_motion_goals', JSON.stringify(goals));
    }
  }, [goals]);

  const completedCount = goals.filter(g => g.completed).length;
  const activityXP = Math.round(steps * 0.02 + activeMinutes * 2);
  const goalXP = completedCount * 50;

  const totalXP = 400 + activityXP + goalXP;
  const userLevel = Math.floor(totalXP / 300) + 1;
  const nextLevelXP = userLevel * 300;
  const xpPercent = Math.min(Math.round(((totalXP % 300) / 300) * 100), 100);

  const theme = {
    cardBg: isDarkMode ? '#1A1D20' : '#FFFFFF',
    textPrimary: isDarkMode ? '#F1F5F9' : '#0F172A',
    textSecondary: isDarkMode ? '#94A3B8' : '#64748B',
    borderColor: isDarkMode ? '#2E353D' : '#E2E8F0',
    progressBg: isDarkMode ? '#22262B' : '#F1F5F9',
    trophyIconBg: isDarkMode ? 'rgba(245, 158, 11, 0.15)' : '#FEF3C7',
    trophyIconBorder: isDarkMode ? 'rgba(245, 158, 11, 0.3)' : '#FDE68A',
    streakBg: isDarkMode ? 'rgba(234, 88, 12, 0.15)' : '#FFEDD5',
    awardBg: isDarkMode ? 'rgba(99, 102, 241, 0.15)' : '#E0E7FF',
    goalBg: isDarkMode ? '#15181B' : '#F8FAFC',
    goalBorder: isDarkMode ? '#2E353D' : '#F1F5F9',
    goalCompletedBg: isDarkMode ? 'rgba(16, 185, 129, 0.12)' : '#F0FDF4',
    goalCompletedBorder: isDarkMode ? 'rgba(16, 185, 129, 0.25)' : '#DCFCE7',
    goalCompletedText: isDarkMode ? '#CBD5E1' : '#1E293B',
    badgeBg: isDarkMode ? '#15181B' : '#F8FAFC',
    badgeBorder: isDarkMode ? '#2E353D' : '#E2E8F0',
    badgeLockedBg: isDarkMode ? '#121416' : '#FAFAFA',
    badgeLockedBorder: isDarkMode ? '#22262B' : '#F1F5F9',
    inputBg: isDarkMode ? '#15181B' : '#F1F5F9',
    accentGreen: '#44766C',
  };

  const weekDays = [
    { day: 'B.E', active: true },
    { day: 'Ç.A', active: true },
    { day: 'Ç', active: true },
    { day: 'C.A', active: true },
    { day: 'C', active: true },
    { day: 'Ş', active: false },
    { day: 'B', active: false },
  ];

  const badges = [
    { id: 1, name: 'Hidratasiya Ustası', desc: '7 gün ardıcıl su balansı', unlocked: true, icon: '💧', progress: '7/7 gün' },
    { id: 2, name: 'Erkən Qalxan', desc: 'Səhər yürüşləri tamamlandı', unlocked: true, icon: '🌅', progress: 'Tamamlandı' },
    { id: 3, name: 'Sosial Tələbə', desc: '3 tədbirə qatıldın', unlocked: true, icon: '🎉', progress: '3/3 tədbir' },
    { id: 4, name: 'İdman Həvəskarı', desc: '5 idman seansı', unlocked: true, icon: '🏋️', progress: '5/5 seans' },
    {
      id: 5,
      name: 'Marafonçu',
      desc: '10,000 addım hədəfi',
      unlocked: steps >= 10000,
      icon: '🏃',
      progress: `${steps.toLocaleString()} / 10,000 addım`
    },
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

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', paddingBottom: '20px' }}>

      {/* Header */}
      <div>
        <h2 style={{ margin: 0, fontSize: '20px', fontWeight: '800', color: theme.textPrimary, letterSpacing: '-0.4px' }}>
          Mənimsənilmiş İrəliləyiş və Uğurlar
        </h2>
        <p style={{ margin: '3px 0 0 0', fontSize: '12.5px', color: theme.textSecondary }}>
          Şəxsi inkişaf hədəfləriniz, qazandığınız nişanlar və vərdiş zənciriniz.
        </p>
      </div>

      {/* Level and XP Status Banner */}
      <div style={{
        backgroundColor: theme.cardBg,
        borderRadius: '16px',
        padding: '18px 22px',
        border: `1px solid ${theme.borderColor}`,
        boxShadow: isDarkMode ? 'none' : '0 2px 10px rgba(0,0,0,0.02)',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '20px',
        alignItems: 'center'
      }}>
        {/* Level Icon */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{
            width: '50px',
            height: '50px',
            borderRadius: '14px',
            backgroundColor: theme.trophyIconBg,
            border: `1px solid ${theme.trophyIconBorder}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#D97706',
            flexShrink: 0
          }}>
            <Trophy size={25} />
          </div>
          <div>
            <span style={{ fontSize: '11px', fontWeight: '700', color: theme.textSecondary, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Mövcud Səviyyə
            </span>
            <h3 style={{ margin: '2px 0 0 0', fontSize: '18px', fontWeight: '800', color: theme.textPrimary }}>
              Səviyyə {userLevel} - Aktiv Tələbə
            </h3>
          </div>
        </div>

        {/* XP Progress Bar */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '12px', fontWeight: '700' }}>
            <span style={{ color: theme.textSecondary, display: 'flex', alignItems: 'center', gap: '5px' }}>
              Təcrübə Xalı (XP)
            </span>
            <span style={{ color: theme.textPrimary }}>{totalXP} / {nextLevelXP} XP</span>
          </div>
          <div style={{ width: '100%', height: '8px', backgroundColor: theme.progressBg, borderRadius: '8px', overflow: 'hidden' }}>
            <div style={{
              width: `${xpPercent}%`,
              height: '100%',
              backgroundColor: '#10B981',
              borderRadius: '8px',
              transition: 'width 0.4s ease'
            }} />
          </div>
          <span style={{ fontSize: '10.5px', color: theme.textSecondary, marginTop: '5px', display: 'block' }}>
            Növbəti səviyyəyə çatmağa {nextLevelXP - totalXP} XP qaldı !
          </span>
        </div>
      </div>

      {/* Habit Chain and Earned Badges Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>

        {/* Habit Chain */}
        <div style={{
          backgroundColor: theme.cardBg,
          borderRadius: '16px',
          padding: '16px 18px',
          border: `1px solid ${theme.borderColor}`,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          gap: '14px',
          boxShadow: isDarkMode ? 'none' : '0 2px 10px rgba(0,0,0,0.02)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{ backgroundColor: theme.streakBg, padding: '11px', borderRadius: '13px', color: '#EA580C', flexShrink: 0 }}>
              <Flame size={24} />
            </div>
            <div>
              <span style={{ fontSize: '11.5px', color: theme.textSecondary, fontWeight: '600' }}>Vərdiş Zənciri</span>
              <h4 style={{ margin: '1px 0 0 0', fontSize: '19px', fontWeight: '800', color: theme.textPrimary }}>
                {streakDays} Gün Ardıcıl
              </h4>
              <span style={{ fontSize: '11px', color: '#10B981', fontWeight: '600' }}>Möhtəşəm tempdir!</span>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '8px', borderTop: `1px dashed ${theme.borderColor}` }}>
            {weekDays.map((item, idx) => (
              <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                <span style={{ fontSize: '10px', fontWeight: '700', color: theme.textSecondary }}>{item.day}</span>
                <div style={{
                  width: '22px',
                  height: '22px',
                  borderRadius: '50%',
                  backgroundColor: item.active ? (isDarkMode ? 'rgba(234, 88, 12, 0.25)' : '#FFEDD5') : theme.progressBg,
                  border: `1.5px solid ${item.active ? '#EA580C' : 'transparent'}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '10.5px',
                  color: item.active ? '#EA580C' : theme.textSecondary,
                  fontWeight: 'bold'
                }}>
                  {item.active ? '✓' : ''}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Summary of Badges Earned */}
        <div style={{
          backgroundColor: theme.cardBg,
          borderRadius: '16px',
          padding: '16px 18px',
          border: `1px solid ${theme.borderColor}`,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          gap: '14px',
          boxShadow: isDarkMode ? 'none' : '0 2px 10px rgba(0,0,0,0.02)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{ backgroundColor: theme.awardBg, padding: '11px', borderRadius: '13px', color: '#6366F1', flexShrink: 0 }}>
              <Award size={24} />
            </div>
            <div>
              <span style={{ fontSize: '11.5px', color: theme.textSecondary, fontWeight: '600' }}>Kolleksiya</span>
              <h4 style={{ margin: '1px 0 0 0', fontSize: '19px', fontWeight: '800', color: theme.textPrimary }}>
                {badges.filter(b => b.unlocked).length} / {badges.length} Nişan
              </h4>
              <span style={{ fontSize: '11px', color: theme.textSecondary, fontWeight: '500' }}>
                {badges.filter(b => !b.unlocked).length} nişan kilitlidir
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 12px', backgroundColor: theme.progressBg, borderRadius: '10px' }}>
            <span style={{ fontSize: '11px', color: theme.textSecondary, fontWeight: '600' }}>
              Növbəti nişan: <strong style={{ color: theme.textPrimary }}>Marafonçu</strong>
            </span>
          </div>
        </div>

      </div>

      {/* Current Weekly Goals & Badges Showcase */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px', alignItems: 'start' }}>

        {/* Target List */}
        <div style={{
          backgroundColor: theme.cardBg,
          borderRadius: '16px',
          padding: '18px 20px',
          border: `1px solid ${theme.borderColor}`,
          boxShadow: isDarkMode ? 'none' : '0 2px 10px rgba(0,0,0,0.02)',
          display: 'flex',
          flexDirection: 'column',
          gap: '14px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h3 style={{ margin: 0, fontSize: '15px', fontWeight: '700', color: theme.textPrimary, display: 'flex', alignItems: 'center', gap: '7px' }}>
                Həftəlik Hədəflərim
              </h3>
              <span style={{ fontSize: '11px', color: theme.textSecondary }}>
                {completedCount} / {goals.length} tamamlandı ({goals.length > 0 ? Math.round((completedCount / goals.length) * 100) : 0}%)
              </span>
            </div>

            <button
              onClick={() => setIsAddingGoal(!isAddingGoal)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                padding: '5px 10px',
                borderRadius: '8px',
                backgroundColor: isAddingGoal ? 'rgba(239, 68, 68, 0.12)' : (isDarkMode ? '#22262B' : '#F1F5F9'),
                color: isAddingGoal ? '#EF4444' : theme.textPrimary,
                border: 'none',
                fontSize: '11.5px',
                fontWeight: '700',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              <Plus size={13} style={{ transform: isAddingGoal ? 'rotate(45deg)' : 'none', transition: 'transform 0.2s' }} />
              {isAddingGoal ? 'Ləğv et' : 'Yeni Hədəf'}
            </button>
          </div>

          {isAddingGoal && (
            <form onSubmit={handleAddGoal} style={{ display: 'flex', flexDirection: 'column', gap: '8px', padding: '10px', backgroundColor: theme.inputBg, borderRadius: '10px' }}>
              <input
                type="text"
                placeholder="Hədəfin adını yazın..."
                value={newGoalTitle}
                onChange={(e) => setNewGoalTitle(e.target.value)}
                style={{
                  padding: '7px 10px',
                  borderRadius: '7px',
                  border: `1px solid ${theme.borderColor}`,
                  backgroundColor: theme.cardBg,
                  color: theme.textPrimary,
                  fontSize: '12px',
                  outline: 'none'
                }}
                autoFocus
              />
              <div style={{ display: 'flex', gap: '6px' }}>
                <select
                  value={newGoalCategory}
                  onChange={(e) => setNewGoalCategory(e.target.value)}
                  style={{
                    flex: 1,
                    padding: '7px',
                    borderRadius: '7px',
                    border: `1px solid ${theme.borderColor}`,
                    backgroundColor: theme.cardBg,
                    color: theme.textPrimary,
                    fontSize: '11.5px'
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
                    padding: '7px 14px',
                    borderRadius: '7px',
                    backgroundColor: theme.accentGreen,
                    color: '#FFFFFF',
                    border: 'none',
                    fontWeight: '700',
                    fontSize: '11.5px',
                    cursor: 'pointer'
                  }}
                >
                  Əlavə et
                </button>
              </div>
            </form>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {goals.map((goal) => (
              <div
                key={goal.id}
                onClick={() => toggleGoal(goal.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '10px 12px',
                  borderRadius: '10px',
                  backgroundColor: goal.completed ? theme.goalCompletedBg : theme.goalBg,
                  border: '1px solid',
                  borderColor: goal.completed ? theme.goalCompletedBorder : theme.goalBorder,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  position: 'relative'
                }}
              >
                {goal.completed ? (
                  <CheckCircle2 size={18} color="#10B981" style={{ flexShrink: 0 }} />
                ) : (
                  <Circle size={18} color={theme.textSecondary} style={{ flexShrink: 0 }} />
                )}
                <div style={{ flex: 1 }}>
                  <p style={{
                    margin: 0,
                    fontSize: '12.5px',
                    fontWeight: '600',
                    color: goal.completed ? theme.goalCompletedText : theme.textPrimary,
                    textDecoration: goal.completed ? 'line-through' : 'none',
                    opacity: goal.completed ? 0.75 : 1
                  }}>
                    {goal.title}
                  </p>
                  <span style={{ fontSize: '10.5px', color: goal.completed ? '#10B981' : theme.textSecondary }}>
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
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Earned and Unlocked Badges */}
        <div style={{
          backgroundColor: theme.cardBg,
          borderRadius: '16px',
          padding: '18px 20px',
          border: `1px solid ${theme.borderColor}`,
          boxShadow: isDarkMode ? 'none' : '0 2px 10px rgba(0,0,0,0.02)',
          display: 'flex',
          flexDirection: 'column',
          gap: '14px'
        }}>
          <h3 style={{ margin: 0, fontSize: '15px', fontWeight: '700', color: theme.textPrimary, display: 'flex', alignItems: 'center', gap: '7px' }}>
            Qazanılan Nişanlar
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
            {badges.map((b) => (
              <div
                key={b.id}
                style={{
                  padding: '10px 12px',
                  borderRadius: '12px',
                  backgroundColor: b.unlocked ? theme.badgeBg : theme.badgeLockedBg,
                  border: '1px solid',
                  borderColor: b.unlocked ? theme.badgeBorder : theme.badgeLockedBorder,
                  opacity: b.unlocked ? 1 : 0.6,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  position: 'relative'
                }}
              >
                <div style={{ position: 'relative' }}>
                  <span style={{ fontSize: '22px', filter: b.unlocked ? 'none' : 'grayscale(80%)' }}>{b.icon}</span>
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
                      <Lock size={9} color="#FFFFFF" />
                    </div>
                  )}
                </div>
                <div>
                  <h5 style={{ margin: 0, fontSize: '12px', fontWeight: '700', color: theme.textPrimary }}>{b.name}</h5>
                  <p style={{ margin: '1px 0 0 0', fontSize: '10px', color: theme.textSecondary }}>{b.desc}</p>
                  <span style={{ fontSize: '9px', fontWeight: '700', color: b.unlocked ? '#10B981' : theme.textSecondary, marginTop: '2px', display: 'block' }}>
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
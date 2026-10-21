"use client";

import React, { useState, useEffect } from 'react';
import { apiFetch } from '@/utils/api';
import {
  TrendingUp,
  Activity,
  Flame,
  Droplets,
  Moon,
  BarChart2,
  Award,
  Plus,
  X,
  CheckCircle2,
  Sparkles
} from 'lucide-react';

interface StatsPanelProps {
  isDarkMode?: boolean;
}

type Timeframe = 'Həftəlik' | 'Aylıq' | 'İllik';

interface ChartBar {
  day: string;
  steps: number;
  height: string;
}

interface StatsData {
  avgSteps: number;
  stepsTrend: string;
  calories: number;
  calTrend: string;
  waterText: string;
  waterTargetPercent: number;
  sleep: string;
  sleepStatus: string;
  categoryIntensity: {
    physical: number;
    mental: number;
    nutrition: number;
  };
  summary: string;
  weeklyData: ChartBar[];
}

export default function StatsPanel({ isDarkMode = false }: StatsPanelProps) {
  const [selectedPeriod, setSelectedPeriod] = useState<Timeframe>('Həftəlik');
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [inputSteps, setInputSteps] = useState('');
  const [inputWater, setInputWater] = useState('');
  const [inputSleep, setInputSleep] = useState('');

  const [steps, setSteps] = useState<number>(0);
  const [activeMins, setActiveMins] = useState<number>(0);
  const [calories, setCalories] = useState<number>(0);
  const [waterMl, setWaterMl] = useState<number>(1500);
  const [sleepTime, setSleepTime] = useState<string>('7s 30dəq');

  const loadUserData = () => {
    if (typeof window !== 'undefined') {
      const savedSteps = localStorage.getItem('user_steps');
      const savedMins = localStorage.getItem('user_active_minutes');
      const savedCals = localStorage.getItem('user_calories');
      const savedWater = localStorage.getItem('user_water');
      const savedSleep = localStorage.getItem('user_sleep');

      const currentSteps = savedSteps !== null ? Number(savedSteps) : 0;
      const currentMins = savedMins !== null ? Number(savedMins) : 0;
      const currentCals = savedCals !== null ? Number(savedCals) : Math.round(currentSteps * 0.04 + currentMins * 5);

      let currentWater = 1500;
      if (savedWater !== null) {
        const val = Number(savedWater);
        currentWater = val < 50 ? val * 1000 : val;
      }

      const currentSleep = savedSleep !== null ? savedSleep : '7s 30dəq';

      setSteps(currentSteps);
      setActiveMins(currentMins);
      setCalories(currentCals);
      setWaterMl(currentWater);
      setSleepTime(currentSleep);
    }
  };

  useEffect(() => {
    loadUserData();

    const handleUpdate = () => loadUserData();
    window.addEventListener('storage', handleUpdate);
    window.addEventListener('activity-updated', handleUpdate);

    return () => {
      window.removeEventListener('storage', handleUpdate);
      window.removeEventListener('activity-updated', handleUpdate);
    };
  }, []);

  const buildStatsData = (): Record<Timeframe, StatsData> => {
    const baseSteps = steps > 0 ? steps : 7000;
    const baseCals = calories > 0 ? calories : Math.round(baseSteps * 0.04);
    const dailyWaterTargetMl = 2000;

    const physicalIntensity = Math.min(Math.round((baseSteps / 10000) * 100), 100);
    const mentalIntensity = 75;
    const nutritionIntensity = Math.min(Math.round((waterMl / dailyWaterTargetMl) * 100), 100);

    const weeklyChart: ChartBar[] = [
      { day: 'B.e.', steps: Math.round(baseSteps * 0.85), height: `${Math.min(Math.round((Math.round(baseSteps * 0.85) / 10000) * 100), 100)}%` },
      { day: 'Ç.a.', steps: Math.round(baseSteps * 0.95), height: `${Math.min(Math.round((Math.round(baseSteps * 0.95) / 10000) * 100), 100)}%` },
      { day: 'Ç.', steps: Math.round(baseSteps * 0.75), height: `${Math.min(Math.round((Math.round(baseSteps * 0.75) / 10000) * 100), 100)}%` },
      { day: 'C.a.', steps: Math.round(baseSteps * 1.05), height: `${Math.min(Math.round((Math.round(baseSteps * 1.05) / 10000) * 100), 100)}%` },
      { day: 'C.', steps: Math.round(baseSteps * 0.90), height: `${Math.min(Math.round((Math.round(baseSteps * 0.90) / 10000) * 100), 100)}%` },
      { day: 'Ş.', steps: baseSteps, height: `${Math.min(Math.round((baseSteps / 10000) * 100), 100)}%` },
      { day: 'B.', steps: Math.round(baseSteps * 0.80), height: `${Math.min(Math.round((Math.round(baseSteps * 0.80) / 10000) * 100), 100)}%` }
    ];

    const monthlyChart: ChartBar[] = [
      { day: '1-ci hft.', steps: Math.round(baseSteps * 0.88), height: '72%' },
      { day: '2-ci hft.', steps: Math.round(baseSteps * 0.94), height: '78%' },
      { day: '3-cü hft.', steps: Math.round(baseSteps * 1.08), height: '88%' },
      { day: '4-cü hft.', steps: baseSteps, height: `${Math.min(Math.round((baseSteps / 10000) * 100), 100)}%` }
    ];

    const yearlyChart: ChartBar[] = [
      { day: 'Yan', steps: Math.round(baseSteps * 0.80), height: '62%' },
      { day: 'Fev', steps: Math.round(baseSteps * 0.85), height: '68%' },
      { day: 'Mar', steps: Math.round(baseSteps * 0.90), height: '74%' },
      { day: 'Apr', steps: Math.round(baseSteps * 0.95), height: '80%' },
      { day: 'May', steps: Math.round(baseSteps * 1.02), height: '85%' },
      { day: 'İyun', steps: Math.round(baseSteps * 1.10), height: '92%' },
      { day: 'İyul', steps: Math.round(baseSteps * 1.15), height: '98%' },
      { day: 'Avq', steps: Math.round(baseSteps * 1.08), height: '90%' },
      { day: 'Sen', steps: Math.round(baseSteps * 0.98), height: '82%' },
      { day: 'Okt', steps: baseSteps, height: `${Math.min(Math.round((baseSteps / 10000) * 100), 100)}%` },
      { day: 'Noy', steps: Math.round(baseSteps * 0.92), height: '75%' },
      { day: 'Dek', steps: Math.round(baseSteps * 0.88), height: '70%' }
    ];

    const dailyLiters = (waterMl / 1000).toFixed(1);
    const monthlyLiters = ((waterMl * 30) / 1000).toFixed(1);
    const yearlyLiters = ((waterMl * 365) / 1000).toFixed(1);

    return {
      'Həftəlik': {
        avgSteps: Math.round(baseSteps * 0.9),
        stepsTrend: steps > 7000 ? '+14% bu həftə' : '+6% bu həftə',
        calories: baseCals,
        calTrend: '+7% keçən həftədən',
        waterText: `${dailyLiters}L / gün`,
        waterTargetPercent: Math.min(Math.round((waterMl / dailyWaterTargetMl) * 100), 100),
        sleep: sleepTime,
        sleepStatus: 'Balanslaşdırılmış',
        categoryIntensity: { physical: physicalIntensity, mental: mentalIntensity, nutrition: nutritionIntensity },
        summary: `Bu həftə ümumi ortalama addımınız ${Math.round(baseSteps * 0.9).toLocaleString('az-AZ')} təşkil edir. Su qəbulunuz ${dailyLiters}L ilə hədəfin ${Math.min(Math.round((waterMl / dailyWaterTargetMl) * 100), 100)}% həddindədir.`,
        weeklyData: weeklyChart
      },
      'Aylıq': {
        avgSteps: Math.round(baseSteps * 0.96),
        stepsTrend: '+18% keçən aydan',
        calories: Math.round(baseCals * 1.05),
        calTrend: '+9% keçən aydan',
        waterText: `${monthlyLiters}L / ay`,
        waterTargetPercent: Math.min(Math.round(((waterMl * 30) / (dailyWaterTargetMl * 30)) * 100), 100),
        sleep: '7s 45dəq',
        sleepStatus: 'Əla dincəlmə',
        categoryIntensity: { physical: Math.min(physicalIntensity + 5, 100), mental: 80, nutrition: Math.min(nutritionIntensity + 5, 100) },
        summary: `Aylıq göstəricilərinizə əsasən su balansı və yuxu rejiminizdə 12% müsbət artım var. Günlük orta addımınız ${Math.round(baseSteps * 0.96).toLocaleString('az-AZ')} addıma çatmışdır.`,
        weeklyData: monthlyChart
      },
      'İllik': {
        avgSteps: Math.round(baseSteps * 0.93),
        stepsTrend: '+22% keçən ildən',
        calories: Math.round(baseCals * 1.02),
        calTrend: '+11% keçən ildən',
        waterText: `${yearlyLiters}L / il`,
        waterTargetPercent: Math.min(Math.round(((waterMl * 365) / (dailyWaterTargetMl * 365)) * 100), 100),
        sleep: '7s 40dəq',
        sleepStatus: 'Sabit rejim',
        categoryIntensity: { physical: physicalIntensity, mental: 82, nutrition: nutritionIntensity },
        summary: `İllik analitika göstərir ki, vərdişləriniz davamlı xarakter alıb. Ən aktiv dövrünüz yay ayları və cari oktyabr ayı üzrə qeydə alınmışdır.`,
        weeklyData: yearlyChart
      }
    };
  };

  const currentStats = buildStatsData();
  const currentData = currentStats[selectedPeriod];

  const theme = {
    cardBg: isDarkMode ? '#1A1D20' : '#FFFFFF',
    textPrimary: isDarkMode ? '#F1F5F9' : '#0F172A',
    textSecondary: isDarkMode ? '#94A3B8' : '#64748B',
    borderColor: isDarkMode ? '#2E353D' : '#E2E8F0',
    progressBg: isDarkMode ? '#22262B' : '#F1F5F9',

    kpiActivityBg: isDarkMode ? 'rgba(16, 185, 129, 0.15)' : '#ECFDF5',
    kpiFlameBg: isDarkMode ? 'rgba(239, 68, 68, 0.15)' : '#FEF2F2',
    kpiDropletsBg: isDarkMode ? 'rgba(59, 130, 246, 0.15)' : '#EFF6FF',
    kpiMoonBg: isDarkMode ? 'rgba(147, 51, 234, 0.15)' : '#F3E8FF',

    barTargetReached: '#10B981',
    barTargetReachedHover: '#059669',
    barNormal: isDarkMode ? '#44766C' : '#5B9A8B',
    barNormalHover: '#3A685F',

    summaryBg: isDarkMode ? 'rgba(68, 118, 108, 0.15)' : '#ECFDF5',
    summaryBorder: isDarkMode ? 'rgba(68, 118, 108, 0.3)' : '#A7F3D0',
    summaryTitle: isDarkMode ? '#A7F3D0' : '#065F46',
    summaryText: isDarkMode ? '#CBD5E1' : '#047857',
  };

  const handleQuickAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputSteps && !inputWater && !inputSleep) return;

    if (inputSteps) {
      const newSteps = parseInt(inputSteps, 10);
      setSteps(newSteps);
      localStorage.setItem('user_steps', newSteps.toString());
    }

    if (inputWater) {
      const val = parseFloat(inputWater);
      const newWaterMl = val < 50 ? val * 1000 : val;
      setWaterMl(newWaterMl);
      localStorage.setItem('user_water', newWaterMl.toString());
    }

    if (inputSleep) {
      setSleepTime(inputSleep);
      localStorage.setItem('user_sleep', inputSleep);
    }

    window.dispatchEvent(new Event('activity-updated'));
    window.dispatchEvent(new Event('storage'));

    setInputSteps('');
    setInputWater('');
    setInputSleep('');
    setIsModalOpen(false);
  };

  return (
    <div className="em-mobile-panel" style={{ display: 'flex', flexDirection: 'column', gap: '13px', paddingBottom: '20px' }}>

      {/* Title, Add Button, and Filter */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h2 style={{ margin: 0, fontSize: '20px', fontWeight: '800', color: theme.textPrimary, letterSpacing: '-0.4px' }}>
            Statistika və Analitika
          </h2>
          <p style={{ margin: '3px 0 0 0', fontSize: '12.5px', color: theme.textSecondary }}>
            Sağlamlıq göstəricilərinizin həftəlik, aylıq və illik geniş analitik hesabatı.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {/* Add Note Button */}
          <button
            onClick={() => setIsModalOpen(true)}
            style={{
              backgroundColor: theme.cardBg,
              border: `1px solid ${theme.borderColor}`,
              color: theme.textPrimary,
              padding: '6px 13px',
              borderRadius: '9px',
              fontSize: '12px',
              fontWeight: '700',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.2s ease'
            }}
          >
            <Plus size={14} color="#44766C" /> Göstərici Əlavə Et
          </button>

          {/* Time Filter */}
          <div style={{ backgroundColor: theme.cardBg, border: `1px solid ${theme.borderColor}`, padding: '3px', borderRadius: '10px', display: 'flex', gap: '3px' }}>
            {(['Həftəlik', 'Aylıq', 'İllik'] as Timeframe[]).map((period) => (
              <button
                key={period}
                onClick={() => setSelectedPeriod(period)}
                style={{
                  backgroundColor: selectedPeriod === period ? '#44766C' : 'transparent',
                  color: selectedPeriod === period ? '#FFFFFF' : theme.textSecondary,
                  border: 'none',
                  padding: '5px 12px',
                  borderRadius: '7px',
                  fontSize: '11.5px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                {period}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main KPI Metric Cards*/}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 210px), 1fr))', gap: '14px' }}>

        {/* Average Steps */}
        <div style={{ backgroundColor: theme.cardBg, padding: '14px 16px', borderRadius: '15px', border: `1px solid ${theme.borderColor}`, boxShadow: isDarkMode ? 'none' : '0 2px 10px rgba(0,0,0,0.02)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <span style={{ fontSize: '11.5px', fontWeight: '700', color: theme.textSecondary }}>Orta Addım</span>
          </div>
          <h3 style={{ margin: '0 0 3px 0', fontSize: '21px', fontWeight: '800', color: theme.textPrimary, letterSpacing: '-0.3px' }}>
            {currentData.avgSteps.toLocaleString('az-AZ')}
          </h3>
          <span style={{ fontSize: '11px', color: '#10B981', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <TrendingUp size={12} /> {currentData.stepsTrend}
          </span>
        </div>

        {/* Calories */}
        <div style={{ backgroundColor: theme.cardBg, padding: '14px 16px', borderRadius: '15px', border: `1px solid ${theme.borderColor}`, boxShadow: isDarkMode ? 'none' : '0 2px 10px rgba(0,0,0,0.02)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <span style={{ fontSize: '11.5px', fontWeight: '700', color: theme.textSecondary }}>Yandırılan Kalori</span>
          </div>
          <h3 style={{ margin: '0 0 3px 0', fontSize: '21px', fontWeight: '800', color: theme.textPrimary, letterSpacing: '-0.3px' }}>
            {currentData.calories.toLocaleString('az-AZ')} kcal
          </h3>
          <span style={{ fontSize: '11px', color: '#10B981', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <TrendingUp size={12} /> {currentData.calTrend}
          </span>
        </div>

        {/* Water Intake */}
        <div style={{ backgroundColor: theme.cardBg, padding: '14px 16px', borderRadius: '15px', border: `1px solid ${theme.borderColor}`, boxShadow: isDarkMode ? 'none' : '0 2px 10px rgba(0,0,0,0.02)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <span style={{ fontSize: '11.5px', fontWeight: '700', color: theme.textSecondary }}>Su Balansı</span>
          </div>
          <h3 style={{ margin: '0 0 3px 0', fontSize: '21px', fontWeight: '800', color: theme.textPrimary, letterSpacing: '-0.3px' }}>
            {currentData.waterText}
          </h3>
          <span style={{ fontSize: '11px', color: '#3B82F6', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <CheckCircle2 size={12} /> {currentData.waterTargetPercent}% Hədəf tamamlandı
          </span>
        </div>

        {/* Sleep */}
        <div style={{ backgroundColor: theme.cardBg, padding: '14px 16px', borderRadius: '15px', border: `1px solid ${theme.borderColor}`, boxShadow: isDarkMode ? 'none' : '0 2px 10px rgba(0,0,0,0.02)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <span style={{ fontSize: '11.5px', fontWeight: '700', color: theme.textSecondary }}>Yuxu Rejimi</span>
          </div>
          <h3 style={{ margin: '0 0 3px 0', fontSize: '21px', fontWeight: '800', color: theme.textPrimary, letterSpacing: '-0.3px' }}>
            {currentData.sleep}
          </h3>
          <span style={{ fontSize: '11px', color: '#9333EA', fontWeight: '700' }}>
            {currentData.sleepStatus}
          </span>
        </div>

      </div>

      {/* Weekly/Monthly/Yearly Chart & Category Distribution */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))', gap: '16px', alignItems: 'start' }}>

        {/* Step Chart */}
        <div style={{
          backgroundColor: theme.cardBg,
          borderRadius: '16px',
          padding: '15px 17px',
          border: `1px solid ${theme.borderColor}`,
          boxShadow: isDarkMode ? 'none' : '0 2px 10px rgba(0,0,0,0.02)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ margin: 0, fontSize: '15px', fontWeight: '700', color: theme.textPrimary, display: 'flex', alignItems: 'center', gap: '7px' }}>
              <BarChart2 size={17} color="#44766C" /> {selectedPeriod} Aktivlik Dinamikası
            </h3>
            <span style={{ fontSize: '11px', color: theme.textSecondary }}>Hədəf: 8,000 addım</span>
          </div>

          {/* Bar Chart Columns */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', height: '160px', paddingTop: '16px', borderBottom: `1px solid ${theme.borderColor}`, paddingBottom: '8px', position: 'relative' }}>
            {currentData.weeklyData.map((item, idx) => {
              const isTargetReached = item.steps >= 8000;
              const barBg = isTargetReached ? theme.barTargetReached : theme.barNormal;
              const barHoverBg = isTargetReached ? theme.barTargetReachedHover : theme.barNormalHover;

              return (
                <div
                  key={idx}
                  onMouseEnter={() => setHoveredIndex(idx)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', height: '100%', justifyContent: 'flex-end', flex: 1, position: 'relative' }}
                >
                  {/* Interactive Tooltip */}
                  {hoveredIndex === idx && (
                    <div style={{
                      position: 'absolute',
                      top: '-30px',
                      backgroundColor: isDarkMode ? '#000000' : '#0F172A',
                      color: '#FFFFFF',
                      padding: '3px 7px',
                      borderRadius: '6px',
                      fontSize: '10.5px',
                      fontWeight: '700',
                      whiteSpace: 'nowrap',
                      zIndex: 10,
                      boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                    }}>
                      {item.steps.toLocaleString('az-AZ')} addım
                    </div>
                  )}

                  {/* Column */}
                  <div
                    style={{
                      width: '24px',
                      height: item.height,
                      backgroundColor: barBg,
                      borderRadius: '6px 6px 3px 3px',
                      transition: 'height 0.3s ease, background-color 0.2s ease',
                      cursor: 'pointer'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = barHoverBg}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = barBg}
                  />

                  {/* Day Name */}
                  <span style={{ fontSize: '11px', color: theme.textSecondary, fontWeight: '600' }}>{item.day}</span>
                </div>
              );
            })}
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', marginTop: '14px', fontSize: '11.5px', color: theme.textSecondary }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <span style={{ width: '9px', height: '9px', borderRadius: '50%', backgroundColor: theme.barTargetReached }} /> Hədəfə çatıldı (≥8k)
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <span style={{ width: '9px', height: '9px', borderRadius: '50%', backgroundColor: theme.barNormal }} /> Normal gün
            </span>
          </div>
        </div>

        {/* Category Intensity & Feedback */}
        <div style={{
          backgroundColor: theme.cardBg,
          borderRadius: '16px',
          padding: '15px 17px',
          border: `1px solid ${theme.borderColor}`,
          boxShadow: isDarkMode ? 'none' : '0 2px 10px rgba(0,0,0,0.02)',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px'
        }}>
          <h3 style={{ margin: 0, fontSize: '15px', fontWeight: '700', color: theme.textPrimary, display: 'flex', alignItems: 'center', gap: '7px' }}>
            Kateqoriya İntensivliyi
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>

            {/* Progress Item 1 */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: '600', marginBottom: '5px' }}>
                <span style={{ color: theme.textSecondary }}>Fiziki Aktivlik</span>
                <span style={{ color: theme.textPrimary }}>{currentData.categoryIntensity.physical}%</span>
              </div>
              <div style={{ height: '7px', backgroundColor: theme.progressBg, borderRadius: '8px', overflow: 'hidden' }}>
                <div style={{ width: `${currentData.categoryIntensity.physical}%`, height: '100%', backgroundColor: '#44766C', borderRadius: '8px', transition: 'width 0.4s ease' }} />
              </div>
            </div>

            {/* Progress Item 2 */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: '600', marginBottom: '5px' }}>
                <span style={{ color: theme.textSecondary }}>Mental Balans</span>
                <span style={{ color: theme.textPrimary }}>{currentData.categoryIntensity.mental}%</span>
              </div>
              <div style={{ height: '7px', backgroundColor: theme.progressBg, borderRadius: '8px', overflow: 'hidden' }}>
                <div style={{ width: `${currentData.categoryIntensity.mental}%`, height: '100%', backgroundColor: '#3B82F6', borderRadius: '8px', transition: 'width 0.4s ease' }} />
              </div>
            </div>

            {/* Progress Item 3 */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: '600', marginBottom: '5px' }}>
                <span style={{ color: theme.textSecondary }}>Qidalanma İntizamı</span>
                <span style={{ color: theme.textPrimary }}>{currentData.categoryIntensity.nutrition}%</span>
              </div>
              <div style={{ height: '7px', backgroundColor: theme.progressBg, borderRadius: '8px', overflow: 'hidden' }}>
                <div style={{ width: `${currentData.categoryIntensity.nutrition}%`, height: '100%', backgroundColor: '#EAB308', borderRadius: '8px', transition: 'width 0.4s ease' }} />
              </div>
            </div>

          </div>

          {/* Real AI Analytical Recommendation Box */}
          <div style={{
            backgroundColor: theme.summaryBg,
            border: `1px solid ${theme.summaryBorder}`,
            borderRadius: '12px',
            padding: '12px 14px'
          }}>
            <h4 style={{ margin: '0 0 3px 0', fontSize: '12.5px', fontWeight: '700', color: theme.summaryTitle, display: 'flex', alignItems: 'center', gap: '5px' }}>
              {selectedPeriod}
            </h4>
            <p style={{ margin: 0, fontSize: '11.5px', color: theme.summaryText, lineHeight: '1.4' }}>
              {currentData.summary}
            </p>
          </div>

        </div>

      </div>

      {/* Add quick entry modal */}
      {isModalOpen && (
        <div className="em-dialog-backdrop" style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0,0,0,0.6)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 100,
          padding: '16px'
        }}>
          <div className="em-dialog-card" style={{
            backgroundColor: theme.cardBg,
            borderRadius: '16px',
            padding: '20px',
            width: '100%',
            maxWidth: '350px',
            border: `1px solid ${theme.borderColor}`,
            display: 'flex',
            flexDirection: 'column',
            gap: '14px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h4 style={{ margin: 0, fontSize: '15px', fontWeight: '800', color: theme.textPrimary }}>
                Göstəriciləri Yenilə
              </h4>
              <button onClick={() => setIsModalOpen(false)} style={{ background: 'none', border: 'none', color: theme.textSecondary, cursor: 'pointer' }}>
                <X size={17} />
              </button>
            </div>

            <form onSubmit={handleQuickAdd} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div>
                <label style={{ fontSize: '11.5px', fontWeight: '700', color: theme.textSecondary, display: 'block', marginBottom: '4px' }}>
                  Günün Addım Sayı
                </label>
                <input
                  type="number"
                  placeholder="Məsələn: 8500"
                  value={inputSteps}
                  onChange={(e) => setInputSteps(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 11px',
                    borderRadius: '8px',
                    border: `1px solid ${theme.borderColor}`,
                    backgroundColor: theme.progressBg,
                    color: theme.textPrimary,
                    fontSize: '12.5px',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div>
                <label style={{ fontSize: '11.5px', fontWeight: '700', color: theme.textSecondary, display: 'block', marginBottom: '4px' }}>
                  Su Qəbulu (ml)
                </label>
                <input
                  type="number"
                  step="0.1"
                  placeholder="Məsələn: 1500"
                  value={inputWater}
                  onChange={(e) => setInputWater(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 11px',
                    borderRadius: '8px',
                    border: `1px solid ${theme.borderColor}`,
                    backgroundColor: theme.progressBg,
                    color: theme.textPrimary,
                    fontSize: '12.5px',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div>
                <label style={{ fontSize: '11.5px', fontWeight: '700', color: theme.textSecondary, display: 'block', marginBottom: '4px' }}>
                  Yuxu Müddəti
                </label>
                <input
                  type="text"
                  placeholder="Məsələn: 7s 45dəq"
                  value={inputSleep}
                  onChange={(e) => setInputSleep(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 11px',
                    borderRadius: '8px',
                    border: `1px solid ${theme.borderColor}`,
                    backgroundColor: theme.progressBg,
                    color: theme.textPrimary,
                    fontSize: '12.5px',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <button
                type="submit"
                style={{
                  marginTop: '6px',
                  padding: '9px',
                  borderRadius: '8px',
                  backgroundColor: '#44766C',
                  color: '#FFFFFF',
                  border: 'none',
                  fontWeight: '800',
                  fontSize: '12.5px',
                  cursor: 'pointer'
                }}
              >
                Yadda Saxla
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
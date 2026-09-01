"use client";
import React, { useState, useEffect } from 'react';
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
  water: number;
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

const DEFAULT_DATA: Record<Timeframe, StatsData> = {
  'Həftəlik': {
    avgSteps: 7630,
    stepsTrend: '+12% bu həftə',
    calories: 2150,
    calTrend: '+5% keçən həftədən',
    water: 2.1,
    waterTargetPercent: 100,
    sleep: '7s 20dəq',
    sleepStatus: 'Balanslaşdırılmış',
    categoryIntensity: { physical: 85, mental: 70, nutrition: 60 },
    summary: 'Bu həftə fiziki aktivliyiniz çox yüksəkdir. Şənbə günü 10,500 addımla rekord vurdunuz! Su qəbulunu eyni səviyyədə saxlayın.',
    weeklyData: [
      { day: 'B.e.', steps: 6800, height: '65%' },
      { day: 'Ç.a.', steps: 8400, height: '80%' },
      { day: 'Ç.', steps: 5200, height: '50%' },
      { day: 'C.a.', steps: 9100, height: '90%' },
      { day: 'C.', steps: 7300, height: '70%' },
      { day: 'Ş.', steps: 10500, height: '100%' },
      { day: 'B.', steps: 6100, height: '60%' }
    ]
  },
  'Aylıq': {
    avgSteps: 8240,
    stepsTrend: '+18% keçən aydan',
    calories: 2300,
    calTrend: '+8% keçən aydan',
    water: 2.3,
    waterTargetPercent: 100,
    sleep: '7s 45dəq',
    sleepStatus: 'Əla dincəlmə',
    categoryIntensity: { physical: 90, mental: 78, nutrition: 72 },
    summary: 'Bu ay dözümlülük göstəricinizdə 18% artım müşahidə olundu. Yuxu rejiminin sabitliyi mental gümrahlığınızı hiss olunacaq dərəcədə artırıb.',
    weeklyData: [
      { day: '1-ci hft.', steps: 7400, height: '70%' },
      { day: '2-ci hft.', steps: 8100, height: '78%' },
      { day: '3-cü hft.', steps: 8900, height: '85%' },
      { day: '4-cü hft.', steps: 8560, height: '82%' }
    ]
  },
  'İllik': {
    avgSteps: 7950,
    stepsTrend: '+24% keçən ildən',
    calories: 2210,
    calTrend: '+10% keçən ildən',
    water: 2.2,
    waterTargetPercent: 95,
    sleep: '7s 30dəq',
    sleepStatus: 'Sabit rejim',
    categoryIntensity: { physical: 82, mental: 80, nutrition: 68 },
    summary: 'İllik analitika göstərir ki, vərdişləriniz davamlı xarakter alıb. Ən yüksək fiziki aktivlik göstəriciləri yay aylarında qeydə alınıb.',
    weeklyData: [
      { day: 'Yan', steps: 6800, height: '60%' },
      { day: 'Fev', steps: 7100, height: '65%' },
      { day: 'Mar', steps: 7600, height: '70%' },
      { day: 'Apr', steps: 8200, height: '78%' },
      { day: 'May', steps: 8900, height: '85%' },
      { day: 'İyun', steps: 9500, height: '90%' },
      { day: 'İyul', steps: 9800, height: '95%' },
      { day: 'Avq', steps: 9100, height: '88%' },
      { day: 'Sen', steps: 8000, height: '76%' },
      { day: 'Okt', steps: 7500, height: '72%' },
      { day: 'Noy', steps: 7200, height: '68%' },
      { day: 'Dek', steps: 6900, height: '62%' }
    ]
  }
};

export default function StatsPanel({ isDarkMode = false }: StatsPanelProps) {
  const [selectedPeriod, setSelectedPeriod] = useState<Timeframe>('Həftəlik');
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [inputSteps, setInputSteps] = useState('');
  const [inputWater, setInputWater] = useState('');

  // LocalStorage ilə state saxlanılması
  const [stats, setStats] = useState<Record<Timeframe, StatsData>>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('e_motion_stats_panel_data');
      if (saved) {
        try { return JSON.parse(saved); } catch { return DEFAULT_DATA; }
      }
    }
    return DEFAULT_DATA;
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('e_motion_stats_panel_data', JSON.stringify(stats));
    }
  }, [stats]);

  const currentData = stats[selectedPeriod];

  const theme = {
    cardBg: isDarkMode ? '#1E1E1E' : '#FFFFFF',
    textPrimary: isDarkMode ? '#FFFFFF' : '#0F172A',
    textSecondary: isDarkMode ? '#94A3B8' : '#64748B',
    borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : '#E2E8F0',
    progressBg: isDarkMode ? '#2A2A2A' : '#F1F5F9',

    // KPI İkon Fonları
    kpiActivityBg: isDarkMode ? 'rgba(5, 150, 105, 0.2)' : '#ECFDF5',
    kpiFlameBg: isDarkMode ? 'rgba(239, 68, 68, 0.2)' : '#FEF2F2',
    kpiDropletsBg: isDarkMode ? 'rgba(59, 130, 246, 0.2)' : '#EFF6FF',
    kpiMoonBg: isDarkMode ? 'rgba(147, 51, 234, 0.2)' : '#F3E8FF',

    // Qrafik
    barActive: isDarkMode ? '#4ADE80' : '#2E5B4E',
    barActiveHover: isDarkMode ? '#22C55E' : '#1C3A32',
    barNormal: isDarkMode ? '#334155' : '#CBD5E1',

    // Tövsiyə Bloku
    summaryBg: isDarkMode ? 'rgba(6, 95, 70, 0.25)' : '#ECFDF5',
    summaryBorder: isDarkMode ? 'rgba(167, 243, 208, 0.2)' : '#A7F3D0',
    summaryTitle: isDarkMode ? '#6EE7B7' : '#065F46',
    summaryText: isDarkMode ? '#A7F3D0' : '#047857',
  };

  const handleQuickAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputSteps && !inputWater) return;

    const updatedWeeklyData = [...currentData.weeklyData];
    const lastIdx = updatedWeeklyData.length - 1;

    let newSteps = updatedWeeklyData[lastIdx].steps;
    if (inputSteps) {
      newSteps = parseInt(inputSteps, 10);
      const maxSteps = Math.max(...updatedWeeklyData.map(d => d.steps), newSteps);
      const newHeight = `${Math.min(Math.round((newSteps / (maxSteps || 10000)) * 100), 100)}%`;
      updatedWeeklyData[lastIdx] = { ...updatedWeeklyData[lastIdx], steps: newSteps, height: newHeight };
    }

    const newAvg = Math.round(updatedWeeklyData.reduce((acc, curr) => acc + curr.steps, 0) / updatedWeeklyData.length);
    const newWater = inputWater ? parseFloat(inputWater) : currentData.water;

    setStats({
      ...stats,
      [selectedPeriod]: {
        ...currentData,
        avgSteps: newAvg,
        water: newWater,
        weeklyData: updatedWeeklyData
      }
    });

    setInputSteps('');
    setInputWater('');
    setIsModalOpen(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', paddingBottom: '40px' }}>

      {/* 1. Başlıq, Əlavə Et Düyməsi və Filter */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h2 style={{ margin: 0, fontSize: '22px', fontWeight: '800', color: theme.textPrimary, letterSpacing: '-0.5px' }}>
            Statistika və Analitika
          </h2>
          <p style={{ margin: '4px 0 0 0', fontSize: '13.5px', color: theme.textSecondary }}>
            Sağlamlıq göstəricilərinizin həftəlik, aylıq və illik geniş analitik hesabatı.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {/* Qeyd Əlavə Et Düyməsi */}
          <button
            onClick={() => setIsModalOpen(true)}
            style={{
              backgroundColor: theme.cardBg,
              border: `1px solid ${theme.borderColor}`,
              color: theme.textPrimary,
              padding: '6px 14px',
              borderRadius: '10px',
              fontSize: '12px',
              fontWeight: '700',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.2s ease'
            }}
          >
            <Plus size={15} color={isDarkMode ? '#4ADE80' : '#2E5B4E'} /> Qeyd Əlavə Et
          </button>

          {/* Vaxt Filteri */}
          <div style={{ backgroundColor: theme.cardBg, border: `1px solid ${theme.borderColor}`, padding: '4px', borderRadius: '12px', display: 'flex', gap: '4px' }}>
            {(['Həftəlik', 'Aylıq', 'İllik'] as Timeframe[]).map((period) => (
              <button
                key={period}
                onClick={() => setSelectedPeriod(period)}
                style={{
                  backgroundColor: selectedPeriod === period ? (isDarkMode ? '#4ADE80' : '#2E5B4E') : 'transparent',
                  color: selectedPeriod === period ? (isDarkMode ? '#0F172A' : '#FFFFFF') : theme.textSecondary,
                  border: 'none',
                  padding: '6px 14px',
                  borderRadius: '8px',
                  fontSize: '12px',
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

      {/* 2. 4 Əsas KPI Metrika Kartları (Dinamik) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>

        {/* Card 1: Addım */}
        <div style={{ backgroundColor: theme.cardBg, padding: '20px', borderRadius: '18px', border: `1px solid ${theme.borderColor}`, boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{ fontSize: '12px', fontWeight: '700', color: theme.textSecondary }}>Orta Addım</span>
            <div style={{ backgroundColor: theme.kpiActivityBg, color: isDarkMode ? '#34D399' : '#059669', padding: '6px', borderRadius: '10px' }}>
              <Activity size={18} />
            </div>
          </div>
          <h3 style={{ margin: '0 0 4px 0', fontSize: '22px', fontWeight: '800', color: theme.textPrimary }}>
            {currentData.avgSteps.toLocaleString('az-AZ')}
          </h3>
          <span style={{ fontSize: '11.5px', color: isDarkMode ? '#4ADE80' : '#16A34A', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <TrendingUp size={13} /> {currentData.stepsTrend}
          </span>
        </div>

        {/* Card 2: Kalori */}
        <div style={{ backgroundColor: theme.cardBg, padding: '20px', borderRadius: '18px', border: `1px solid ${theme.borderColor}`, boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{ fontSize: '12px', fontWeight: '700', color: theme.textSecondary }}>Yandırılan Kalori</span>
            <div style={{ backgroundColor: theme.kpiFlameBg, color: isDarkMode ? '#F87171' : '#EF4444', padding: '6px', borderRadius: '10px' }}>
              <Flame size={18} />
            </div>
          </div>
          <h3 style={{ margin: '0 0 4px 0', fontSize: '22px', fontWeight: '800', color: theme.textPrimary }}>
            {currentData.calories.toLocaleString('az-AZ')} kcal
          </h3>
          <span style={{ fontSize: '11.5px', color: isDarkMode ? '#4ADE80' : '#16A34A', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <TrendingUp size={13} /> {currentData.calTrend}
          </span>
        </div>

        {/* Card 3: Su Qəbulu */}
        <div style={{ backgroundColor: theme.cardBg, padding: '20px', borderRadius: '18px', border: `1px solid ${theme.borderColor}`, boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{ fontSize: '12px', fontWeight: '700', color: theme.textSecondary }}>Su Balansı</span>
            <div style={{ backgroundColor: theme.kpiDropletsBg, color: isDarkMode ? '#60A5FA' : '#3B82F6', padding: '6px', borderRadius: '10px' }}>
              <Droplets size={18} />
            </div>
          </div>
          <h3 style={{ margin: '0 0 4px 0', fontSize: '22px', fontWeight: '800', color: theme.textPrimary }}>
            {currentData.water} Litr / gün
          </h3>
          <span style={{ fontSize: '11.5px', color: isDarkMode ? '#60A5FA' : '#3B82F6', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <CheckCircle2 size={13} /> {currentData.waterTargetPercent}% Hədəf tamamlandı
          </span>
        </div>

        {/* Card 4: Yuxu */}
        <div style={{ backgroundColor: theme.cardBg, padding: '20px', borderRadius: '18px', border: `1px solid ${theme.borderColor}`, boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{ fontSize: '12px', fontWeight: '700', color: theme.textSecondary }}>Yuxu Rejimi</span>
            <div style={{ backgroundColor: theme.kpiMoonBg, color: isDarkMode ? '#C084FC' : '#9333EA', padding: '6px', borderRadius: '10px' }}>
              <Moon size={18} />
            </div>
          </div>
          <h3 style={{ margin: '0 0 4px 0', fontSize: '22px', fontWeight: '800', color: theme.textPrimary }}>
            {currentData.sleep}
          </h3>
          <span style={{ fontSize: '11.5px', color: isDarkMode ? '#C084FC' : '#9333EA', fontWeight: '700' }}>
            {currentData.sleepStatus}
          </span>
        </div>

      </div>

      {/* 3. Vizual Həftəlik/Aylıq/İllik Qrafik & Kateqoriya Paylanması */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px', alignItems: 'start' }}>

        {/* Sol Sütun: Addım Qrafiki */}
        <div style={{
          backgroundColor: theme.cardBg,
          borderRadius: '20px',
          padding: '24px',
          border: `1px solid ${theme.borderColor}`,
          boxShadow: '0 4px 12px rgba(0,0,0,0.02)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '700', color: theme.textPrimary, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <BarChart2 size={18} color={isDarkMode ? '#4ADE80' : '#2E5B4E'} /> {selectedPeriod} Aktivlik Dinamikası
            </h3>
            <span style={{ fontSize: '12px', color: theme.textSecondary }}>Hədəf: 8,000 addım</span>
          </div>

          {/* Bar Chart Sütunları (Tooltip İnteqrasiyalı) */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', height: '180px', paddingTop: '20px', borderBottom: `1px solid ${theme.borderColor}`, paddingBottom: '10px', position: 'relative' }}>
            {currentData.weeklyData.map((item, idx) => (
              <div
                key={idx}
                onMouseEnter={() => setHoveredIndex(idx)}
                onMouseLeave={() => setHoveredIndex(null)}
                style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', height: '100%', justifyContent: 'flex-end', flex: 1, position: 'relative' }}
              >
                {/* Interactive Tooltip */}
                {hoveredIndex === idx && (
                  <div style={{
                    position: 'absolute',
                    top: '-32px',
                    backgroundColor: isDarkMode ? '#000000' : '#0F172A',
                    color: '#FFFFFF',
                    padding: '3px 8px',
                    borderRadius: '6px',
                    fontSize: '11px',
                    fontWeight: '700',
                    whiteSpace: 'nowrap',
                    zIndex: 10,
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                  }}>
                    {item.steps.toLocaleString('az-AZ')} addım
                  </div>
                )}

                {/* Sütun */}
                <div
                  style={{
                    width: '28px',
                    height: item.height,
                    backgroundColor: item.steps >= 8000 ? theme.barActive : theme.barNormal,
                    borderRadius: '6px 6px 2px 2px',
                    transition: 'height 0.3s ease, background-color 0.2s ease',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = theme.barActiveHover}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = item.steps >= 8000 ? theme.barActive : theme.barNormal}
                />

                {/* Gün Adı (Düzəldilmiş orfoqrafiya: Ç.a., C.a.) */}
                <span style={{ fontSize: '11.5px', color: theme.textSecondary, fontWeight: '600' }}>{item.day}</span>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '16px', fontSize: '12px', color: theme.textSecondary }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: theme.barActive }} /> Hədəfə çatıldı (≥8k)
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: theme.barNormal }} /> Normal gün
            </span>
          </div>
        </div>

        {/* Sağ Sütun: Kateqoriya İntensivliyi & Rəy */}
        <div style={{
          backgroundColor: theme.cardBg,
          borderRadius: '20px',
          padding: '24px',
          border: `1px solid ${theme.borderColor}`,
          boxShadow: '0 4px 12px rgba(0,0,0,0.02)',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px'
        }}>
          <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '700', color: theme.textPrimary, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Award size={18} color={isDarkMode ? '#4ADE80' : '#2E5B4E'} /> Kateqoriya İntensivliyi
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>

            {/* Progress Item 1 */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12.5px', fontWeight: '600', marginBottom: '6px' }}>
                <span style={{ color: theme.textSecondary }}>Fiziki Aktivlik</span>
                <span style={{ color: theme.textPrimary }}>{currentData.categoryIntensity.physical}%</span>
              </div>
              <div style={{ height: '8px', backgroundColor: theme.progressBg, borderRadius: '10px', overflow: 'hidden' }}>
                <div style={{ width: `${currentData.categoryIntensity.physical}%`, height: '100%', backgroundColor: isDarkMode ? '#4ADE80' : '#2E5B4E', borderRadius: '10px', transition: 'width 0.4s ease' }} />
              </div>
            </div>

            {/* Progress Item 2 */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12.5px', fontWeight: '600', marginBottom: '6px' }}>
                <span style={{ color: theme.textSecondary }}>Mental Balans</span>
                <span style={{ color: theme.textPrimary }}>{currentData.categoryIntensity.mental}%</span>
              </div>
              <div style={{ height: '8px', backgroundColor: theme.progressBg, borderRadius: '10px', overflow: 'hidden' }}>
                <div style={{ width: `${currentData.categoryIntensity.mental}%`, height: '100%', backgroundColor: '#3B82F6', borderRadius: '10px', transition: 'width 0.4s ease' }} />
              </div>
            </div>

            {/* Progress Item 3 */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12.5px', fontWeight: '600', marginBottom: '6px' }}>
                <span style={{ color: theme.textSecondary }}>Qidalanma İntizamı</span>
                <span style={{ color: theme.textPrimary }}>{currentData.categoryIntensity.nutrition}%</span>
              </div>
              <div style={{ height: '8px', backgroundColor: theme.progressBg, borderRadius: '10px', overflow: 'hidden' }}>
                <div style={{ width: `${currentData.categoryIntensity.nutrition}%`, height: '100%', backgroundColor: '#EAB308', borderRadius: '10px', transition: 'width 0.4s ease' }} />
              </div>
            </div>

          </div>

          {/* AI Analitik Tövsiyə Kutusu (Dinamik) */}
          <div style={{
            backgroundColor: theme.summaryBg,
            border: `1px solid ${theme.summaryBorder}`,
            borderRadius: '14px',
            padding: '14px 16px'
          }}>
            <h4 style={{ margin: '0 0 4px 0', fontSize: '13px', fontWeight: '700', color: theme.summaryTitle, display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Sparkles size={14} /> {selectedPeriod} Xülasə
            </h4>
            <p style={{ margin: 0, fontSize: '12px', color: theme.summaryText, lineHeight: '1.4' }}>
              {currentData.summary}
            </p>
          </div>

        </div>

      </div>

      {/* Qeyd Əlavə Et */}
      {isModalOpen && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 100,
          padding: '16px'
        }}>
          <div style={{
            backgroundColor: theme.cardBg,
            borderRadius: '20px',
            padding: '24px',
            width: '100%',
            maxWidth: '360px',
            border: `1px solid ${theme.borderColor}`,
            display: 'flex',
            flexDirection: 'column',
            gap: '16px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h4 style={{ margin: 0, fontSize: '16px', fontWeight: '800', color: theme.textPrimary }}>
                Göstəriciləri Yenilə
              </h4>
              <button onClick={() => setIsModalOpen(false)} style={{ background: 'none', border: 'none', color: theme.textSecondary, cursor: 'pointer' }}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleQuickAdd} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '12px', fontWeight: '700', color: theme.textSecondary, display: 'block', marginBottom: '4px' }}>
                  Addım Sayı
                </label>
                <input
                  type="number"
                  placeholder="Məsələn: 8500"
                  value={inputSteps}
                  onChange={(e) => setInputSteps(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '10px',
                    border: `1px solid ${theme.borderColor}`,
                    backgroundColor: theme.progressBg,
                    color: theme.textPrimary,
                    fontSize: '13px',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: '700', color: theme.textSecondary, display: 'block', marginBottom: '4px' }}>
                  Su Qəbulu (Litr)
                </label>
                <input
                  type="number"
                  step="0.1"
                  placeholder="Məsələn: 2.5"
                  value={inputWater}
                  onChange={(e) => setInputWater(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '10px',
                    border: `1px solid ${theme.borderColor}`,
                    backgroundColor: theme.progressBg,
                    color: theme.textPrimary,
                    fontSize: '13px',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <button
                type="submit"
                style={{
                  marginTop: '8px',
                  padding: '10px',
                  borderRadius: '10px',
                  backgroundColor: isDarkMode ? '#4ADE80' : '#2E5B4E',
                  color: isDarkMode ? '#0F172A' : '#FFFFFF',
                  border: 'none',
                  fontWeight: '800',
                  fontSize: '13px',
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
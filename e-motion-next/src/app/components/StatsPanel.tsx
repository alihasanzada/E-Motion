"use client";
import React, { useState } from 'react';
import { TrendingUp, Activity, Flame, Droplets, Moon, BarChart2, Calendar, Award } from 'lucide-react';

export default function StatsPanel() {
  const [selectedPeriod, setSelectedPeriod] = useState('Həftəlik');

  // Həftəlik Addım Statistikası (Piksel hündürlüyü faizlə)
  const weeklyData = [
    { day: 'B.E.', steps: 6800, height: '65%' },
    { day: 'Ç.Ə.', steps: 8400, height: '80%' },
    { day: 'Ç.', steps: 5200, height: '50%' },
    { day: 'C.Ə.', steps: 9100, height: '90%' },
    { day: 'C.', steps: 7300, height: '70%' },
    { day: 'Ş.', steps: 10500, height: '100%' },
    { day: 'B.', steps: 6100, height: '60%' }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', paddingBottom: '40px' }}>
      
      {/* 1. Başlıq vər Filter */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h2 style={{ margin: 0, fontSize: '22px', fontWeight: '800', color: '#0F172A', letterSpacing: '-0.5px' }}>
            Statistika və Analitika
          </h2>
          <p style={{ margin: '4px 0 0 0', fontSize: '13.5px', color: '#64748B' }}>
            Sağlamlıq göstəricilərinizin həftəlik və aylıq geniş analitik hesabatı.
          </p>
        </div>

        {/* Vaxt Filteri */}
        <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', padding: '4px', borderRadius: '12px', display: 'flex', gap: '4px' }}>
          {['Həftəlik', 'Aylıq', 'İllik'].map((period) => (
            <button
              key={period}
              onClick={() => setSelectedPeriod(period)}
              style={{
                backgroundColor: selectedPeriod === period ? '#2E5B4E' : 'transparent',
                color: selectedPeriod === period ? '#FFFFFF' : '#64748B',
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

      {/* 2. 4 Əsas KPI Metrika Kartları */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
        
        {/* Card 1: Addım */}
        <div style={{ backgroundColor: '#FFFFFF', padding: '20px', borderRadius: '18px', border: '1px solid #E2E8F0', boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{ fontSize: '12px', fontWeight: '700', color: '#64748B' }}>Orta Addım</span>
            <div style={{ backgroundColor: '#ECFDF5', color: '#059669', padding: '6px', borderRadius: '10px' }}>
              <Activity size={18} />
            </div>
          </div>
          <h3 style={{ margin: '0 0 4px 0', fontSize: '22px', fontWeight: '800', color: '#0F172A' }}>7,630</h3>
          <span style={{ fontSize: '11.5px', color: '#16A34A', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <TrendingUp size={13} /> +12% bu həftə
          </span>
        </div>

        {/* Card 2: Kalori */}
        <div style={{ backgroundColor: '#FFFFFF', padding: '20px', borderRadius: '18px', border: '1px solid #E2E8F0', boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{ fontSize: '12px', fontWeight: '700', color: '#64748B' }}>Yandırılan Kalori</span>
            <div style={{ backgroundColor: '#FEF2F2', color: '#EF4444', padding: '6px', borderRadius: '10px' }}>
              <Flame size={18} />
            </div>
          </div>
          <h3 style={{ margin: '0 0 4px 0', fontSize: '22px', fontWeight: '800', color: '#0F172A' }}>2,150 kcal</h3>
          <span style={{ fontSize: '11.5px', color: '#16A34A', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <TrendingUp size={13} /> +5% keçən həftədən
          </span>
        </div>

        {/* Card 3: Su Qəbulu */}
        <div style={{ backgroundColor: '#FFFFFF', padding: '20px', borderRadius: '18px', border: '1px solid #E2E8F0', boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{ fontSize: '12px', fontWeight: '700', color: '#64748B' }}>Su Balansı</span>
            <div style={{ backgroundColor: '#EFF6FF', color: '#3B82F6', padding: '6px', borderRadius: '10px' }}>
              <Droplets size={18} />
            </div>
          </div>
          <h3 style={{ margin: '0 0 4px 0', fontSize: '22px', fontWeight: '800', color: '#0F172A' }}>2.1 Litr / gün</h3>
          <span style={{ fontSize: '11.5px', color: '#3B82F6', fontWeight: '700' }}>
            ✓ 100% Hədəf tamamlandı
          </span>
        </div>

        {/* Card 4: Yuxu */}
        <div style={{ backgroundColor: '#FFFFFF', padding: '20px', borderRadius: '18px', border: '1px solid #E2E8F0', boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{ fontSize: '12px', fontWeight: '700', color: '#64748B' }}>Yuxu Rejimi</span>
            <div style={{ backgroundColor: '#F3E8FF', color: '#9333EA', padding: '6px', borderRadius: '10px' }}>
              <Moon size={18} />
            </div>
          </div>
          <h3 style={{ margin: '0 0 4px 0', fontSize: '22px', fontWeight: '800', color: '#0F172A' }}>7s 20dəq</h3>
          <span style={{ fontSize: '11.5px', color: '#9333EA', fontWeight: '700' }}>
            Balanslaşdırılmış
          </span>
        </div>

      </div>

      {/* 3. Vizual Həftəlik Qrafik & Məqsəd Paylanması */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px', alignItems: 'start' }}>
        
        {/* Sol Sütun: Həftəlik Addım Qrafiki */}
        <div style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '20px',
          padding: '24px',
          border: '1px solid #E2E8F0',
          boxShadow: '0 4px 12px rgba(0,0,0,0.02)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '700', color: '#0F172A', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <BarChart2 size={18} color="#2E5B4E" /> Həftəlik Aktivlik Dinamikası
            </h3>
            <span style={{ fontSize: '12px', color: '#64748B' }}>Məqsəd: 8,000 addım</span>
          </div>

          {/* Bar Chart Sütunları */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', height: '180px', paddingTop: '20px', borderBottom: '1px solid #F1F5F9', paddingBottom: '10px' }}>
            {weeklyData.map((item, idx) => (
              <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', height: '100%', justifyContent: 'flex-end', flex: 1 }}>
                
                {/* Sütun */}
                <div
                  title={`${item.steps} addım`}
                  style={{
                    width: '28px',
                    height: item.height,
                    backgroundColor: item.steps >= 8000 ? '#2E5B4E' : '#CBD5E1',
                    borderRadius: '6px 6px 2px 2px',
                    transition: 'height 0.3s ease, background-color 0.2s ease',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#1C3A32'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = item.steps >= 8000 ? '#2E5B4E' : '#CBD5E1'}
                />

                {/* Gün Adı */}
                <span style={{ fontSize: '11.5px', color: '#64748B', fontWeight: '600' }}>{item.day}</span>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '16px', fontSize: '12px', color: '#64748B' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#2E5B4E' }} /> Hədəfə çatıldı (≥8k)
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#CBD5E1' }} /> Normal gün
            </span>
          </div>
        </div>

        {/* Sağ Sütun: Kateqoriya İntensivliyi & Rəy */}
        <div style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '20px',
          padding: '24px',
          border: '1px solid #E2E8F0',
          boxShadow: '0 4px 12px rgba(0,0,0,0.02)',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px'
        }}>
          <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '700', color: '#0F172A', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Award size={18} color="#2E5B4E" /> Kateqoriya İntensivliyi
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            
            {/* Progress Item 1 */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12.5px', fontWeight: '600', marginBottom: '6px' }}>
                <span style={{ color: '#475569' }}>Fiziki Aktivlik</span>
                <span style={{ color: '#0F172A' }}>85%</span>
              </div>
              <div style={{ height: '8px', backgroundColor: '#F1F5F9', borderRadius: '10px', overflow: 'hidden' }}>
                <div style={{ width: '85%', height: '100%', backgroundColor: '#2E5B4E', borderRadius: '10px' }} />
              </div>
            </div>

            {/* Progress Item 2 */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12.5px', fontWeight: '600', marginBottom: '6px' }}>
                <span style={{ color: '#475569' }}>Mental Balans</span>
                <span style={{ color: '#0F172A' }}>70%</span>
              </div>
              <div style={{ height: '8px', backgroundColor: '#F1F5F9', borderRadius: '10px', overflow: 'hidden' }}>
                <div style={{ width: '70%', height: '100%', backgroundColor: '#3B82F6', borderRadius: '10px' }} />
              </div>
            </div>

            {/* Progress Item 3 */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12.5px', fontWeight: '600', marginBottom: '6px' }}>
                <span style={{ color: '#475569' }}>Qidalanma İntizamı</span>
                <span style={{ color: '#0F172A' }}>60%</span>
              </div>
              <div style={{ height: '8px', backgroundColor: '#F1F5F9', borderRadius: '10px', overflow: 'hidden' }}>
                <div style={{ width: '60%', height: '100%', backgroundColor: '#EAB308', borderRadius: '10px' }} />
              </div>
            </div>

          </div>

          {/* AI Analitik Tövsiyə Kutusu */}
          <div style={{
            backgroundColor: '#ECFDF5',
            border: '1px solid #A7F3D0',
            borderRadius: '14px',
            padding: '14px 16px'
          }}>
            <h4 style={{ margin: '0 0 4px 0', fontSize: '13px', fontWeight: '700', color: '#065F46' }}>
              💡 Həftəlik Xülasə
            </h4>
            <p style={{ margin: 0, fontSize: '12px', color: '#047857', lineHeight: '1.4' }}>
              Bu həftə fiziki aktivliyiniz çox yüksəkdir. Şənbə günü 10,500 addımla rekord vurdunuz! Su qəbulunu eyni səviyyədə saxlayın.
            </p>
          </div>

        </div>

      </div>

    </div>
  );
}
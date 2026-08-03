"use client";
import React, { useState } from 'react';
import { Footprints, Droplet, Flame, Trophy, Plus, RefreshCw, Zap, Sparkles, CheckCircle2 } from 'lucide-react';

export default function ActivityPanel() {
  const [steps, setSteps] = useState(4200);
  const [water, setWater] = useState(2200);
  const [inputSteps, setInputSteps] = useState('');
  const [inputWater, setInputWater] = useState('');

  const stepGoal = 10000;
  const waterGoal = 3000;

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputSteps) setSteps(prev => prev + Number(inputSteps));
    if (inputWater) setWater(prev => prev + Number(inputWater));
    setInputSteps('');
    setInputWater('');
  };

  const stepPercentage = Math.min(Math.round((steps / stepGoal) * 100), 100);
  const waterPercentage = Math.min(Math.round((water / waterGoal) * 100), 100);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', paddingBottom: '40px' }}>
      
      {/* 1. Canlı Hero Banner (Düz ağ fon əvəzinə qradient və motivasiya elementi) */}
      <div style={{
        background: 'linear-gradient(135deg, #2E5B4E 0%, #44766C 100%)',
        borderRadius: '20px',
        padding: '28px 32px',
        color: '#FFFFFF',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        boxShadow: '0 10px 25px -5px rgba(68, 118, 108, 0.3)'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <span style={{ backgroundColor: 'rgba(255,255,255,0.2)', padding: '4px 10px', borderRadius: '20px', fontSize: '11.5px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Sparkles size={13} /> Gündəlik Status
            </span>
          </div>
          <h2 style={{ margin: 0, fontSize: '24px', fontWeight: '800', letterSpacing: '-0.5px' }}>
            Hədəflərinə doğru əla irəliləyirsən! 🎯
          </h2>
          <p style={{ margin: '6px 0 0 0', fontSize: '13.5px', opacity: 0.9, maxWidth: '500px', lineHeight: '1.5' }}>
            Bədənini hərəkətdə saxla və su balansını tənzimlə. Kiçik addımlar böyük nəticələr verir.
          </p>
        </div>
        <div style={{ display: 'block', textAlign: 'right', background: 'rgba(255,255,255,0.1)', padding: '16px 20px', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.15)' }}>
          <span style={{ fontSize: '12px', opacity: 0.8, display: 'block' }}>Ümumi Gedişat</span>
          <span style={{ fontSize: '22px', fontWeight: '700', color: '#A7F3D0' }}>{Math.round((stepPercentage + waterPercentage) / 2)}%</span>
        </div>
      </div>

      {/* 2. Metrika Kartları (Daha dərin qradient detalları və sürətli əlavəetmə düymələri ilə) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
        
        {/* Addım Kartı */}
        <div style={{
          backgroundColor: '#FFFFFF',
          padding: '24px',
          borderRadius: '20px',
          border: '1px solid #E2E8F0',
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.03), 0 4px 6px -4px rgba(0, 0, 0, 0.03)',
          position: 'relative',
          overflow: 'hidden'
        }}>
          {/* Üst bəzək xətti */}
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: 'linear-gradient(90deg, #44766C, #A7F3D0)' }} />

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ backgroundColor: '#F0FDF4', padding: '12px', borderRadius: '14px', color: '#44766C' }}>
                <Footprints size={22} />
              </div>
              <div>
                <h4 style={{ margin: 0, fontSize: '15px', fontWeight: '700', color: '#0F172A' }}>Atılan Addım</h4>
                <span style={{ fontSize: '12px', color: '#64748B' }}>Hədəf: {stepGoal.toLocaleString()}</span>
              </div>
            </div>
            <span style={{ fontSize: '13px', fontWeight: '700', color: '#44766C', backgroundColor: '#F0FDF4', padding: '6px 12px', borderRadius: '20px' }}>
              {stepPercentage}%
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', margin: '16px 0' }}>
            <span style={{ fontSize: '36px', fontWeight: '800', color: '#0F172A', letterSpacing: '-1px' }}>{steps.toLocaleString()}</span>
            <span style={{ fontSize: '14px', color: '#64748B', fontWeight: '600' }}>addım</span>
          </div>

          {/* Progress Bar */}
          <div style={{ width: '100%', backgroundColor: '#F1F5F9', height: '10px', borderRadius: '6px', overflow: 'hidden', marginBottom: '16px' }}>
            <div style={{
              width: `${stepPercentage}%`,
              background: 'linear-gradient(90deg, #44766C, #619B8D)',
              height: '100%',
              borderRadius: '6px',
              transition: 'width 0.5s ease'
            }} />
          </div>

          {/* Sürətli Əlavə Et Düymələri (Interaktiv element) */}
          <div style={{ display: 'flex', gap: '8px' }}>
            <button 
              onClick={() => setSteps(prev => prev + 500)}
              style={{ flex: 1, padding: '8px', borderRadius: '8px', border: '1px solid #E2E8F0', backgroundColor: '#F8FAFC', color: '#334155', fontSize: '12px', fontWeight: '600', cursor: 'pointer', transition: 'all 0.2s' }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#E2E8F0'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#F8FAFC'}
            >
              +500 addım
            </button>
            <button 
              onClick={() => setSteps(prev => prev + 1000)}
              style={{ flex: 1, padding: '8px', borderRadius: '8px', border: '1px solid #C6F6D5', backgroundColor: '#F0FDF4', color: '#22543D', fontSize: '12px', fontWeight: '600', cursor: 'pointer', transition: 'all 0.2s' }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#DCFCE7'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#F0FDF4'}
            >
              +1,000 addım
            </button>
          </div>
        </div>

        {/* Su Kartı */}
        <div style={{
          backgroundColor: '#FFFFFF',
          padding: '24px',
          borderRadius: '20px',
          border: '1px solid #E2E8F0',
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.03), 0 4px 6px -4px rgba(0, 0, 0, 0.03)',
          position: 'relative',
          overflow: 'hidden'
        }}>
          {/* Üst bəzək xətti */}
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: 'linear-gradient(90deg, #0284C7, #7DD3FC)' }} />

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ backgroundColor: '#E0F2FE', padding: '12px', borderRadius: '14px', color: '#0284C7' }}>
                <Droplet size={22} />
              </div>
              <div>
                <h4 style={{ margin: 0, fontSize: '15px', fontWeight: '700', color: '#0F172A' }}>İçilən Su</h4>
                <span style={{ fontSize: '12px', color: '#64748B' }}>Hədəf: {waterGoal} ml</span>
              </div>
            </div>
            <span style={{ fontSize: '13px', fontWeight: '700', color: '#0284C7', backgroundColor: '#F0F9FF', padding: '6px 12px', borderRadius: '20px' }}>
              {waterPercentage}%
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', margin: '16px 0' }}>
            <span style={{ fontSize: '36px', fontWeight: '800', color: '#0F172A', letterSpacing: '-1px' }}>{water.toLocaleString()}</span>
            <span style={{ fontSize: '14px', color: '#64748B', fontWeight: '600' }}>ml</span>
          </div>

          {/* Progress Bar */}
          <div style={{ width: '100%', backgroundColor: '#F1F5F9', height: '10px', borderRadius: '6px', overflow: 'hidden', marginBottom: '16px' }}>
            <div style={{
              width: `${waterPercentage}%`,
              background: 'linear-gradient(90deg, #0284C7, #38BDF8)',
              height: '100%',
              borderRadius: '6px',
              transition: 'width 0.5s ease'
            }} />
          </div>

          {/* Sürətli Əlavə Et Düymələri (Interaktiv element) */}
          <div style={{ display: 'flex', gap: '8px' }}>
            <button 
              onClick={() => setWater(prev => prev + 250)}
              style={{ flex: 1, padding: '8px', borderRadius: '8px', border: '1px solid #E2E8F0', backgroundColor: '#F8FAFC', color: '#334155', fontSize: '12px', fontWeight: '600', cursor: 'pointer', transition: 'all 0.2s' }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#E2E8F0'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#F8FAFC'}
            >
              +250 ml (Stəkan)
            </button>
            <button 
              onClick={() => setWater(prev => prev + 500)}
              style={{ flex: 1, padding: '8px', borderRadius: '8px', border: '1px solid #BAE6FD', backgroundColor: '#F0F9FF', color: '#0369A1', fontSize: '12px', fontWeight: '600', cursor: 'pointer', transition: 'all 0.2s' }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#E0F2FE'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#F0F9FF'}
            >
              +500 ml (Şüşə)
            </button>
          </div>
        </div>

      </div>

      {/* 3. Fərdi Dəyər Daxiletmə Formu (Modern & Clean) */}
      <div style={{
        backgroundColor: '#FFFFFF',
        padding: '28px',
        borderRadius: '20px',
        border: '1px solid #E2E8F0',
        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.03)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
          <div style={{ backgroundColor: '#F1F5F9', padding: '8px', borderRadius: '10px', color: '#334155' }}>
            <RefreshCw size={18} />
          </div>
          <div>
            <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '700', color: '#0F172A' }}>Manuel Dəyər Daxil Et</h3>
            <p style={{ margin: 0, fontSize: '12.5px', color: '#64748B' }}>İstədiyiniz dəqiq miqdarı əlavə edin.</p>
          </div>
        </div>

        <form onSubmit={handleUpdate} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', alignItems: 'end' }}>
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#334155', marginBottom: '8px' }}>
              Addım Əlavə Et
            </label>
            <input
              type="number"
              placeholder="Məs: 1500"
              value={inputSteps}
              onChange={(e) => setInputSteps(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 16px',
                borderRadius: '12px',
                border: '1px solid #CBD5E1',
                fontSize: '14px',
                outline: 'none',
                backgroundColor: '#F8FAFC',
                boxSizing: 'border-box',
                transition: 'border-color 0.2s'
              }}
              onFocus={(e) => e.currentTarget.style.borderColor = '#44766C'}
              onBlur={(e) => e.currentTarget.style.borderColor = '#CBD5E1'}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#334155', marginBottom: '8px' }}>
              Su Əlavə Et (ml)
            </label>
            <input
              type="number"
              placeholder="Məs: 300"
              value={inputWater}
              onChange={(e) => setInputWater(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 16px',
                borderRadius: '12px',
                border: '1px solid #CBD5E1',
                fontSize: '14px',
                outline: 'none',
                backgroundColor: '#F8FAFC',
                boxSizing: 'border-box',
                transition: 'border-color 0.2s'
              }}
              onFocus={(e) => e.currentTarget.style.borderColor = '#0284C7'}
              onBlur={(e) => e.currentTarget.style.borderColor = '#CBD5E1'}
            />
          </div>

          <button
            type="submit"
            style={{
              backgroundColor: '#44766C',
              color: '#FFFFFF',
              border: 'none',
              padding: '13px 24px',
              borderRadius: '12px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              boxShadow: '0 4px 12px rgba(68, 118, 108, 0.25)',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#355E56';
              e.currentTarget.style.transform = 'translateY(-1px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#44766C';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            <Plus size={18} />
            Məlumatı Yenilə
          </button>
        </form>
      </div>

    </div>
  );
}
"use client";
import React, { useState, useEffect } from 'react';
import { Footprints, Droplet, Plus, RefreshCw, Sparkles } from 'lucide-react';

interface ActivityPanelProps {
  isDarkMode?: boolean;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://e-motion-7vds.onrender.com';

export default function ActivityPanel({ isDarkMode = false }: ActivityPanelProps) {
  const [steps, setSteps] = useState(0);
  const [water, setWater] = useState(0);
  const [inputSteps, setInputSteps] = useState('');
  const [inputWater, setInputWater] = useState('');

  const stepGoal = 10000;
  const waterGoal = 3000;

  useEffect(() => {
    const savedSteps = localStorage.getItem('user_steps');
    const savedWater = localStorage.getItem('user_water');

    if (savedSteps !== null) setSteps(Number(savedSteps));
    if (savedWater !== null) setWater(Number(savedWater));

    const fetchActivity = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/activity`);
        if (res.ok) {
          const data = await res.json();
          if (data.steps !== undefined && data.steps !== null) {
            setSteps(data.steps);
            localStorage.setItem('user_steps', data.steps.toString());
          }
          if (data.water !== undefined && data.water !== null) {
            setWater(data.water);
            localStorage.setItem('user_water', data.water.toString());
          }
        }
      } catch (error) {
        console.error("Aktivlik məlumatı çəkilə bilmədi:", error);
      }
    };

    fetchActivity();
  }, []);

  const updateActivity = async (newSteps: number, newWaterMl: number) => {
    setSteps(newSteps);
    setWater(newWaterMl);

    const glassCount = Math.floor(newWaterMl / 250);

    localStorage.setItem('user_water_ml', newWaterMl.toString());
    localStorage.setItem('user_water_glasses', glassCount.toString());
    localStorage.setItem('user_steps', newSteps.toString());

    try {
      await fetch(`${API_BASE_URL}/api/activity`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ steps: newSteps, water_ml: newWaterMl }),
      });
    } catch (error) {
      console.error("Aktivlik yenilənə bilmədi:", error);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    const addedSteps = inputSteps ? Number(inputSteps) : 0;
    const addedWater = inputWater ? Number(inputWater) : 0;

    const newSteps = steps + addedSteps;
    const newWater = water + addedWater;

    setInputSteps('');
    setInputWater('');

    await updateActivity(newSteps, newWater);
  };

  const handleQuickAdd = async (addSteps: number, addWaterMl: number) => {
    const newSteps = steps + addSteps;
    const newWaterMl = water + addWaterMl;
    const newGlasses = Math.floor(newWaterMl / 250);

    setSteps(newSteps);
    setWater(newWaterMl);

    localStorage.setItem('user_steps', newSteps.toString());
    localStorage.setItem('user_water_ml', newWaterMl.toString());
    localStorage.setItem('user_water_glasses', newGlasses.toString());

    try {
      await fetch(`${API_BASE_URL}/api/activity`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ steps: newSteps, water_ml: newWaterMl }),
      });
    } catch (err) {
      console.warn("Aktivlik yenilənə bilmədi:", err);
    }
  };

  const stepPercentage = Math.min(Math.round((steps / stepGoal) * 100), 100);
  const waterPercentage = Math.min(Math.round((water / waterGoal) * 100), 100);

  const theme = {
    cardBg: isDarkMode ? '#1E1E1E' : '#FFFFFF',
    border: isDarkMode ? '#2D3748' : '#E2E8F0',
    textPrimary: isDarkMode ? '#F7FAFC' : '#0F172A',
    textSecondary: isDarkMode ? '#A0AEC0' : '#64748B',
    inputBg: isDarkMode ? '#2D3748' : '#F8FAFC',
    inputBorder: isDarkMode ? '#4A5568' : '#CBD5E1',
    btnSecondaryBg: isDarkMode ? '#2D3748' : '#F8FAFC',
    btnSecondaryText: isDarkMode ? '#E2E8F0' : '#334155',
    progressBg: isDarkMode ? '#2D3748' : '#F1F5F9',
    iconBgStep: isDarkMode ? '#1A365D' : '#F0FDF4',
    iconBgWater: isDarkMode ? '#1A365D' : '#E0F2FE',
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', paddingBottom: '40px' }}>

      {/* 1. Hero Banner */}
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

      {/* 2. Metrika Kartları */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>

        {/* Addım Kartı */}
        <div style={{
          backgroundColor: theme.cardBg,
          padding: '24px',
          borderRadius: '20px',
          border: `1px solid ${theme.border}`,
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.05)',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: 'linear-gradient(90deg, #44766C, #A7F3D0)' }} />

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ backgroundColor: theme.iconBgStep, padding: '12px', borderRadius: '14px', color: '#44766C' }}>
                <Footprints size={22} />
              </div>
              <div>
                <h4 style={{ margin: 0, fontSize: '15px', fontWeight: '700', color: theme.textPrimary }}>Atılan Addım</h4>
                <span style={{ fontSize: '12px', color: theme.textSecondary }}>Hədəf: {stepGoal.toLocaleString()}</span>
              </div>
            </div>
            <span style={{ fontSize: '13px', fontWeight: '700', color: '#34D399', backgroundColor: 'rgba(52, 211, 153, 0.15)', padding: '6px 12px', borderRadius: '20px' }}>
              {stepPercentage}%
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', margin: '16px 0' }}>
            <span style={{ fontSize: '36px', fontWeight: '800', color: theme.textPrimary, letterSpacing: '-1px' }}>{steps.toLocaleString()}</span>
            <span style={{ fontSize: '14px', color: theme.textSecondary, fontWeight: '600' }}>addım</span>
          </div>

          {/* Progress Bar */}
          <div style={{ width: '100%', backgroundColor: theme.progressBg, height: '10px', borderRadius: '6px', overflow: 'hidden', marginBottom: '16px' }}>
            <div style={{
              width: `${stepPercentage}%`,
              background: 'linear-gradient(90deg, #44766C, #619B8D)',
              height: '100%',
              borderRadius: '6px',
              transition: 'width 0.5s ease'
            }} />
          </div>

          {/* Sürətli Əlavə Et Düymələri */}
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={() => handleQuickAdd(500, 0)}
              style={{ flex: 1, padding: '8px', borderRadius: '8px', border: `1px solid ${theme.border}`, backgroundColor: theme.btnSecondaryBg, color: theme.btnSecondaryText, fontSize: '12px', fontWeight: '600', cursor: 'pointer' }}
            >
              +500 addım
            </button>
            <button
              onClick={() => handleQuickAdd(1000, 0)}
              style={{ flex: 1, padding: '8px', borderRadius: '8px', border: '1px solid rgba(52, 211, 153, 0.3)', backgroundColor: 'rgba(52, 211, 153, 0.15)', color: '#34D399', fontSize: '12px', fontWeight: '600', cursor: 'pointer' }}
            >
              +1,000 addım
            </button>
          </div>
        </div>

        {/* Su Kartı */}
        <div style={{
          backgroundColor: theme.cardBg,
          padding: '24px',
          borderRadius: '20px',
          border: `1px solid ${theme.border}`,
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.05)',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: 'linear-gradient(90deg, #0284C7, #7DD3FC)' }} />

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ backgroundColor: theme.iconBgWater, padding: '12px', borderRadius: '14px', color: '#38BDF8' }}>
                <Droplet size={22} />
              </div>
              <div>
                <h4 style={{ margin: 0, fontSize: '15px', fontWeight: '700', color: theme.textPrimary }}>İçilən Su</h4>
                <span style={{ fontSize: '12px', color: theme.textSecondary }}>Hədəf: {waterGoal} ml</span>
              </div>
            </div>
            <span style={{ fontSize: '13px', fontWeight: '700', color: '#38BDF8', backgroundColor: 'rgba(56, 189, 248, 0.15)', padding: '6px 12px', borderRadius: '20px' }}>
              {waterPercentage}%
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', margin: '16px 0' }}>
            <span style={{ fontSize: '36px', fontWeight: '800', color: theme.textPrimary, letterSpacing: '-1px' }}>{water.toLocaleString()}</span>
            <span style={{ fontSize: '14px', color: theme.textSecondary, fontWeight: '600' }}>ml</span>
          </div>

          {/* Progress Bar */}
          <div style={{ width: '100%', backgroundColor: theme.progressBg, height: '10px', borderRadius: '6px', overflow: 'hidden', marginBottom: '16px' }}>
            <div style={{
              width: `${waterPercentage}%`,
              background: 'linear-gradient(90deg, #0284C7, #38BDF8)',
              height: '100%',
              borderRadius: '6px',
              transition: 'width 0.5s ease'
            }} />
          </div>

          {/* Sürətli Əlavə Et Düymələri */}
          <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
            <button
              onClick={() => handleQuickAdd(0, 250)}
              style={{ flex: 1, padding: '8px', borderRadius: '8px', border: `1px solid ${theme.border}`, backgroundColor: theme.btnSecondaryBg, color: theme.btnSecondaryText, fontSize: '12px', fontWeight: '600', cursor: 'pointer' }}
            >
              +250 ml (Stəkan)
            </button>
            <button
              onClick={() => handleQuickAdd(0, 500)}
              style={{ flex: 1, padding: '8px', borderRadius: '8px', border: '1px solid rgba(56, 189, 248, 0.3)', backgroundColor: 'rgba(56, 189, 248, 0.15)', color: '#38BDF8', fontSize: '12px', fontWeight: '600', cursor: 'pointer' }}
            >
              +500 ml (Şüşə)
            </button>
          </div>
        </div>

      </div>

      {/* 3. Manual Dəyər Daxiletmə Formu */}
      <div style={{
        backgroundColor: theme.cardBg,
        padding: '28px',
        borderRadius: '20px',
        border: `1px solid ${theme.border}`,
        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.05)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
          <div style={{ backgroundColor: theme.progressBg, padding: '8px', borderRadius: '10px', color: theme.textPrimary }}>
            <RefreshCw size={18} />
          </div>
          <div>
            <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '700', color: theme.textPrimary }}>Manual Dəyər Daxil Et</h3>
            <p style={{ margin: 0, fontSize: '12.5px', color: theme.textSecondary }}>İstədiyiniz dəqiq miqdarı əlavə edin.</p>
          </div>
        </div>

        <form onSubmit={handleUpdate} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', alignItems: 'end' }}>
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: theme.textSecondary, marginBottom: '8px' }}>
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
                border: `1px solid ${theme.inputBorder}`,
                fontSize: '14px',
                outline: 'none',
                backgroundColor: theme.inputBg,
                color: theme.textPrimary,
                boxSizing: 'border-box'
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: theme.textSecondary, marginBottom: '8px' }}>
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
                border: `1px solid ${theme.inputBorder}`,
                fontSize: '14px',
                outline: 'none',
                backgroundColor: theme.inputBg,
                color: theme.textPrimary,
                boxSizing: 'border-box'
              }}
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
              boxShadow: '0 4px 12px rgba(68, 118, 108, 0.25)'
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
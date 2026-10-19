"use client";

import React, { useState, useEffect } from 'react';
import { apiFetch } from '@/utils/api';
import {
  Footprints,
  Plus,
  RefreshCw,
  Sparkles,
  CheckCircle2,
  Flame,
  MapPin,
  Smartphone,
  Timer,
  Dumbbell,
  Activity
} from 'lucide-react';

interface ActivityPanelProps {
  isDarkMode?: boolean;
}

export default function ActivityPanel({ isDarkMode = false }: ActivityPanelProps) {
  const [steps, setSteps] = useState<number>(0);
  const [activeMinutes, setActiveMinutes] = useState<number>(0);
  const [inputSteps, setInputSteps] = useState('');
  const [inputMinutes, setInputMinutes] = useState('');
  const [isSyncing, setIsSyncing] = useState(false);
  const [isGoogleConnected, setIsGoogleConnected] = useState(false);
  const [showIosModal, setShowIosModal] = useState(false);

  const stepGoal = 10000;
  const activeMinGoal = 60;

  const caloriesBurned = Math.round(steps * 0.04 + activeMinutes * 5);
  const distanceKm = (steps * 0.00075).toFixed(2);

  const saveAndSyncActivity = async (newSteps: number, newMinutes: number) => {
    const cappedSteps = Math.min(Math.max(0, newSteps), stepGoal);
    const cappedMinutes = Math.min(Math.max(0, newMinutes), activeMinGoal);

    setSteps(cappedSteps);
    setActiveMinutes(cappedMinutes);

    const totalCalories = Math.round(cappedSteps * 0.04 + cappedMinutes * 5);

    localStorage.setItem('user_steps', cappedSteps.toString());
    localStorage.setItem('user_active_minutes', cappedMinutes.toString());
    localStorage.setItem('user_calories', totalCalories.toString());

    window.dispatchEvent(new CustomEvent('activity-updated', {
      detail: { steps: cappedSteps, activeMinutes: cappedMinutes, calories: totalCalories }
    }));
    window.dispatchEvent(new Event('storage'));

    try {
      await apiFetch('/api/activity', {
        method: 'POST',
        body: JSON.stringify({ steps: cappedSteps, active_minutes: cappedMinutes }),
      });
    } catch (error) {
      console.error("Activity DB sync error:", error);
    }
  };

  const connectGoogleFit = () => {
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    let appUrl = 'https://e-motion-7vds.onrender.com';
    if (typeof window !== 'undefined') {
      appUrl = window.location.origin;
    }

    const redirectUri = `${appUrl}/api/auth/callback/google`;

    if (!clientId) {
      fetchActivity();
      return;
    }

    const scopes = ["https://www.googleapis.com/auth/fitness.activity.read"].join(" ");
    const options = {
      client_id: clientId,
      redirect_uri: redirectUri,
      response_type: "code",
      scope: scopes,
      access_type: "offline",
      prompt: "consent"
    };

    const qs = new URLSearchParams(options);
    window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?${qs.toString()}`;
  };

  const fetchActivity = async () => {
    const savedSteps = localStorage.getItem('user_steps');
    const savedMins = localStorage.getItem('user_active_minutes');

    if (savedSteps !== null) setSteps(Number(savedSteps));
    if (savedMins !== null) setActiveMinutes(Number(savedMins));

    try {
      const res = await apiFetch('/api/activity');

      if (res.ok) {
        const data = await res.json();
        if (savedSteps === null && data.steps !== undefined && data.steps !== null) {
          setSteps(data.steps);
          localStorage.setItem('user_steps', data.steps.toString());
        }
        if (savedMins === null && data.active_minutes !== undefined && data.active_minutes !== null) {
          setActiveMinutes(data.active_minutes);
          localStorage.setItem('user_active_minutes', data.active_minutes.toString());
        }
      }
    } catch (error) {
      console.error("Failed to fetch activity:", error);
      if (savedSteps !== null) setSteps(Number(savedSteps));
      if (savedMins !== null) setActiveMinutes(Number(savedMins));
    }
  };

  const syncGoogleFitSteps = async () => {
    const accessToken = localStorage.getItem('google_access_token');

    if (!accessToken) {
      setIsGoogleConnected(false);
      connectGoogleFit();
      return;
    }

    setIsGoogleConnected(true);
    setIsSyncing(true);

    try {
      // Google Fit API Next.js layihəsinin daxilindədir, Flask backend-də deyil.
      const res = await fetch('/api/google-fit/steps', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accessToken }),
      });

      const data = await res.json();

      if (res.ok && data.success && typeof data.steps === 'number') {
        await saveAndSyncActivity(data.steps, activeMinutes);
      } else {
        localStorage.removeItem('google_access_token');
        setIsGoogleConnected(false);
        await fetchActivity();
      }
    } catch (err) {
      console.error('Sync error:', err);
      localStorage.removeItem('google_access_token');
      setIsGoogleConnected(false);
      await fetchActivity();
    } finally {
      setIsSyncing(false);
    }
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const fitToken = urlParams.get('google_fit_token');

      if (fitToken) {
        localStorage.setItem('google_access_token', fitToken);
        window.history.replaceState({}, document.title, window.location.pathname);
      }
    }

    const savedSteps = localStorage.getItem('user_steps');
    const savedMins = localStorage.getItem('user_active_minutes');

    if (savedSteps !== null) setSteps(Number(savedSteps));
    if (savedMins !== null) setActiveMinutes(Number(savedMins));

    const token = localStorage.getItem('google_access_token');
    if (token) {
      setIsGoogleConnected(true);
      syncGoogleFitSteps();
    } else {
      fetchActivity();
    }
  }, []);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    const addedSteps = inputSteps ? Number(inputSteps) : 0;
    const addedMins = inputMinutes ? Number(inputMinutes) : 0;

    const newSteps = steps + addedSteps;
    const newMins = activeMinutes + addedMins;

    setInputSteps('');
    setInputMinutes('');

    await saveAndSyncActivity(newSteps, newMins);
  };

  const handleQuickAdd = async (addSteps: number, addMins: number) => {
    await saveAndSyncActivity(steps + addSteps, activeMinutes + addMins);
  };

  const stepPercentage = Math.min(Math.round((steps / stepGoal) * 100), 100);
  const activeMinPercentage = Math.min(Math.round((activeMinutes / activeMinGoal) * 100), 100);

  const theme = {
    cardBg: isDarkMode ? '#1A1D20' : '#FFFFFF',
    border: isDarkMode ? '#2E353D' : '#E2E8F0',
    textPrimary: isDarkMode ? '#F1F5F9' : '#0F172A',
    textSecondary: isDarkMode ? '#94A3B8' : '#64748B',
    inputBg: isDarkMode ? '#15181B' : '#FFFFFF',
    inputBorder: isDarkMode ? '#2E353D' : '#CBD5E1',
    btnSecondaryBg: isDarkMode ? '#22262B' : '#F8FAFC',
    btnSecondaryText: isDarkMode ? '#E2E8F0' : '#334155',
    progressBg: isDarkMode ? '#22262B' : '#F1F5F9',

    iconFlameBg: isDarkMode ? 'rgba(239, 68, 68, 0.15)' : '#FEF2F2',
    iconFlameColor: '#EF4444',

    iconMapBg: isDarkMode ? 'rgba(59, 130, 246, 0.15)' : '#EFF6FF',
    iconMapColor: '#3B82F6',

    iconStepBg: isDarkMode ? 'rgba(16, 185, 129, 0.15)' : '#F0FDF4',
    iconStepColor: '#10B981',

    iconTimerBg: isDarkMode ? 'rgba(245, 158, 11, 0.15)' : '#FEF3C7',
    iconTimerColor: '#F59E0B',
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '18px', paddingBottom: '0px' }}>

      {/* Header Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #2E5B4E 0%, #44766C 100%)',
        borderRadius: '16px',
        padding: '19px 24px',
        color: '#FFFFFF',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '12px',
        boxShadow: '0 4px 14px -2px rgba(68, 118, 108, 0.22)'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
            <span style={{ backgroundColor: 'rgba(255,255,255,0.2)', padding: '2px 8px', borderRadius: '12px', fontSize: '11px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Sparkles size={12} /> Fiziki Aktivlik Hub-ı
            </span>
          </div>
          <h2 style={{ margin: 0, fontSize: '19px', fontWeight: '800', letterSpacing: '-0.3px' }}>
            Hər bir hərəkət bədəninizə enerji qatır!
          </h2>
          <p style={{ margin: '3px 0 0 0', fontSize: '13px', opacity: 0.9, maxWidth: '520px', lineHeight: '1.3' }}>
            Günlük addımlarınızı, qət olunan məsafəni və idman dəqiqələrinizi izləyin.
          </p>
        </div>

        <div style={{ textAlign: 'center', background: 'rgba(255,255,255,0.12)', padding: '10px 16px', borderRadius: '13px', border: '1px solid rgba(255,255,255,0.18)' }}>
          <span style={{ fontSize: '11px', opacity: 0.85, display: 'block' }}>Gündəlik Aktivlik</span>
          <span style={{ fontSize: '20px', fontWeight: '800', color: '#A7F3D0' }}>{Math.round((stepPercentage + activeMinPercentage) / 2)}%</span>
        </div>
      </div>

      {/* Stats Summary Bar */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '12px' }}>

        <div style={{ backgroundColor: theme.cardBg, padding: '13px 16px', borderRadius: '13px', border: `1px solid ${theme.border}`, display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ backgroundColor: theme.iconFlameBg, padding: '8px', borderRadius: '10px', color: theme.iconFlameColor }}>
            <Flame size={17} />
          </div>
          <div>
            <span style={{ fontSize: '11px', color: theme.textSecondary, display: 'block' }}>Yandırılan Kalori</span>
            <span style={{ fontSize: '16.5px', fontWeight: '800', color: theme.textPrimary }}>{caloriesBurned} kcal</span>
          </div>
        </div>

        <div style={{ backgroundColor: theme.cardBg, padding: '13px 16px', borderRadius: '13px', border: `1px solid ${theme.border}`, display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ backgroundColor: theme.iconMapBg, padding: '8px', borderRadius: '10px', color: theme.iconMapColor }}>
            <MapPin size={17} />
          </div>
          <div>
            <span style={{ fontSize: '11px', color: theme.textSecondary, display: 'block' }}>Qət Edilən Məsafə</span>
            <span style={{ fontSize: '16.5px', fontWeight: '800', color: theme.textPrimary }}>{distanceKm} km</span>
          </div>
        </div>

        <div style={{ backgroundColor: theme.cardBg, padding: '13px 16px', borderRadius: '13px', border: `1px solid ${theme.border}`, display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ backgroundColor: theme.iconStepBg, padding: '8px', borderRadius: '10px', color: theme.iconStepColor }}>
            <Footprints size={17} />
          </div>
          <div>
            <span style={{ fontSize: '11px', color: theme.textSecondary, display: 'block' }}>Günün Addımı</span>
            <span style={{ fontSize: '16.5px', fontWeight: '800', color: theme.textPrimary }}>{steps.toLocaleString()}</span>
          </div>
        </div>

        <div style={{ backgroundColor: theme.cardBg, padding: '13px 16px', borderRadius: '13px', border: `1px solid ${theme.border}`, display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ backgroundColor: theme.iconTimerBg, padding: '8px', borderRadius: '10px', color: theme.iconTimerColor }}>
            <Timer size={17} />
          </div>
          <div>
            <span style={{ fontSize: '11px', color: theme.textSecondary, display: 'block' }}>Aktiv Məşq Vaxtı</span>
            <span style={{ fontSize: '16.5px', fontWeight: '800', color: theme.textPrimary }}>{activeMinutes} dəq</span>
          </div>
        </div>

      </div>

      {/* Main Metric Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))', gap: '14px' }}>

        {/* Steps Card */}
        <div style={{
          backgroundColor: theme.cardBg,
          padding: '19px 21px',
          borderRadius: '15px',
          border: `1px solid ${theme.border}`,
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: 'linear-gradient(90deg, #44766C, #A7F3D0)' }} />

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', flexWrap: 'wrap', gap: '6px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ backgroundColor: theme.iconStepBg, padding: '8px', borderRadius: '10px', color: theme.iconStepColor }}>
                <Footprints size={18} />
              </div>
              <div>
                <h4 style={{ margin: 0, fontSize: '15px', fontWeight: '700', color: theme.textPrimary }}>Atılan Addım</h4>
                <span style={{ fontSize: '11px', color: theme.textSecondary }}>Hədəf: {stepGoal.toLocaleString()} addım</span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '5px' }}>
              {isGoogleConnected ? (
                <button
                  onClick={syncGoogleFitSteps}
                  disabled={isSyncing}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    backgroundColor: 'rgba(52, 211, 153, 0.15)',
                    color: '#059669',
                    border: '1px solid rgba(52, 211, 153, 0.3)',
                    padding: '4px 8px',
                    borderRadius: '8px',
                    fontSize: '11px',
                    fontWeight: '600',
                    cursor: 'pointer',
                  }}
                >
                  {isSyncing ? <RefreshCw size={11} style={{ animation: 'spin 1s linear infinite' }} /> : <CheckCircle2 size={11} />}
                  Google Fit
                </button>
              ) : (
                <button
                  onClick={connectGoogleFit}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    backgroundColor: '#44766C',
                    color: '#FFFFFF',
                    border: 'none',
                    padding: '4px 8px',
                    borderRadius: '8px',
                    fontSize: '11px',
                    fontWeight: '600',
                    cursor: 'pointer',
                  }}
                >
                  <RefreshCw size={11} />
                  Google Fit Qoş
                </button>
              )}

              <button
                onClick={() => setShowIosModal(true)}
                title="iOS Apple Health"
                style={{
                  backgroundColor: theme.btnSecondaryBg,
                  color: theme.textSecondary,
                  border: `1px solid ${theme.border}`,
                  padding: '4px 8px',
                  borderRadius: '8px',
                  fontSize: '11px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '3px'
                }}
              >
                <Smartphone size={11} />
                iOS
              </button>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'baseline', gap: '5px', margin: '10px 0' }}>
            <span style={{ fontSize: '26px', fontWeight: '800', color: theme.textPrimary, letterSpacing: '-0.5px' }}>{steps.toLocaleString()}</span>
            <span style={{ fontSize: '12px', color: theme.textSecondary, fontWeight: '600' }}>/ {stepGoal.toLocaleString()}</span>
          </div>

          {/* Progress Bar */}
          <div style={{ width: '100%', backgroundColor: theme.progressBg, height: '8px', borderRadius: '6px', overflow: 'hidden', marginBottom: '12px' }}>
            <div style={{
              width: `${stepPercentage}%`,
              background: 'linear-gradient(90deg, #44766C, #619B8D)',
              height: '100%',
              borderRadius: '6px',
              transition: 'width 0.5s ease'
            }} />
          </div>

          {/* Quick Add Buttons */}
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={() => handleQuickAdd(500, 0)}
              style={{ flex: 1, padding: '8px', borderRadius: '8px', border: `1px solid ${theme.border}`, backgroundColor: theme.btnSecondaryBg, color: theme.btnSecondaryText, fontSize: '11.5px', fontWeight: '600', cursor: 'pointer' }}
            >
              +500 addım
            </button>
            <button
              onClick={() => handleQuickAdd(1000, 0)}
              style={{ flex: 1, padding: '8px', borderRadius: '8px', border: '1px solid rgba(52, 211, 153, 0.3)', backgroundColor: 'rgba(52, 211, 153, 0.15)', color: isDarkMode ? '#A7F3D0' : '#059669', fontSize: '11.5px', fontWeight: '600', cursor: 'pointer' }}
            >
              +1,000 addım
            </button>
          </div>
        </div>

        {/* Active Exercise Card */}
        <div style={{
          backgroundColor: theme.cardBg,
          padding: '19px 21px',
          borderRadius: '15px',
          border: `1px solid ${theme.border}`,
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: 'linear-gradient(90deg, #F59E0B, #FDE68A)' }} />

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ backgroundColor: theme.iconTimerBg, padding: '8px', borderRadius: '10px', color: theme.iconTimerColor }}>
                <Dumbbell size={18} />
              </div>
              <div>
                <h4 style={{ margin: 0, fontSize: '15px', fontWeight: '700', color: theme.textPrimary }}>İdman / Məşq Vaxtı</h4>
                <span style={{ fontSize: '11px', color: theme.textSecondary }}>Hədəf: {activeMinGoal} dəqiqə</span>
              </div>
            </div>
            <span style={{ fontSize: '11px', fontWeight: '700', color: '#D97706', backgroundColor: isDarkMode ? 'rgba(245, 158, 11, 0.2)' : '#FEF3C7', padding: '3px 8px', borderRadius: '12px' }}>
              {activeMinPercentage}%
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'baseline', gap: '5px', margin: '10px 0' }}>
            <span style={{ fontSize: '26px', fontWeight: '800', color: theme.textPrimary, letterSpacing: '-0.5px' }}>{activeMinutes}</span>
            <span style={{ fontSize: '12px', color: theme.textSecondary, fontWeight: '600' }}>/ {activeMinGoal} dəqiqə</span>
          </div>

          {/* Progress Bar */}
          <div style={{ width: '100%', backgroundColor: theme.progressBg, height: '8px', borderRadius: '6px', overflow: 'hidden', marginBottom: '12px' }}>
            <div style={{
              width: `${activeMinPercentage}%`,
              background: 'linear-gradient(90deg, #F59E0B, #FBBF24)',
              height: '100%',
              borderRadius: '6px',
              transition: 'width 0.5s ease'
            }} />
          </div>

          {/* Quick Add Exercise Buttons */}
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={() => handleQuickAdd(0, 15)}
              style={{ flex: 1, padding: '8px', borderRadius: '8px', border: `1px solid ${theme.border}`, backgroundColor: theme.btnSecondaryBg, color: theme.btnSecondaryText, fontSize: '11.5px', fontWeight: '600', cursor: 'pointer' }}
            >
              +15 dəq Məşq
            </button>
            <button
              onClick={() => handleQuickAdd(0, 30)}
              style={{ flex: 1, padding: '8px', borderRadius: '8px', border: '1px solid rgba(245, 158, 11, 0.3)', backgroundColor: isDarkMode ? 'rgba(245, 158, 11, 0.15)' : '#FEF3C7', color: isDarkMode ? '#FDE68A' : '#D97706', fontSize: '11.5px', fontWeight: '600', cursor: 'pointer' }}
            >
              +30 dəq Məşq
            </button>
          </div>
        </div>

      </div>

      {/* Manual Input Section */}
      <div style={{
        backgroundColor: theme.cardBg,
        padding: '16px 21px',
        borderRadius: '15px',
        border: `1px solid ${theme.border}`,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
          <div style={{ backgroundColor: theme.progressBg, padding: '6px', borderRadius: '8px', color: theme.textPrimary }}>
          </div>
          <div>
            <h3 style={{ margin: 0, fontSize: '15px', fontWeight: '700', color: theme.textPrimary }}>Aktivlik Əlavə Et</h3>
            <p style={{ margin: '1px 0 0 0', fontSize: '11px', color: theme.textSecondary }}>Manual olaraq addım və ya məşq müddətinizi yeniləyin.</p>
          </div>
        </div>

        <form onSubmit={handleUpdate} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px', alignItems: 'end' }}>
          <div>
            <label style={{ display: 'block', fontSize: '11.5px', fontWeight: '600', color: theme.textSecondary, marginBottom: '5px' }}>
              Addım Əlavə Et
            </label>
            <input
              type="number"
              placeholder="Məs: 1500"
              value={inputSteps}
              onChange={(e) => setInputSteps(e.target.value)}
              style={{
                width: '100%',
                padding: '9px 12px',
                borderRadius: '8px',
                border: `1px solid ${theme.inputBorder}`,
                fontSize: '12.5px',
                outline: 'none',
                backgroundColor: theme.inputBg,
                color: theme.textPrimary,
                boxSizing: 'border-box'
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '11.5px', fontWeight: '600', color: theme.textSecondary, marginBottom: '5px' }}>
              Məşq Müddəti (Dəqiqə)
            </label>
            <input
              type="number"
              placeholder="Məs: 30"
              value={inputMinutes}
              onChange={(e) => setInputMinutes(e.target.value)}
              style={{
                width: '100%',
                padding: '9px 12px',
                borderRadius: '8px',
                border: `1px solid ${theme.inputBorder}`,
                fontSize: '12.5px',
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
              padding: '9px 18px',
              borderRadius: '8px',
              fontSize: '12.5px',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              boxShadow: '0 3px 8px rgba(68, 118, 108, 0.2)'
            }}
          >
            <Plus size={15} />
            Yenilə
          </button>
        </form>
      </div>

      {/* iOS Modal */}
      {showIosModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.65)',
          zIndex: 999,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '20px'
        }}>
          <div style={{
            backgroundColor: theme.cardBg,
            borderRadius: '16px',
            padding: '20px',
            maxWidth: '420px',
            width: '100%',
            boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
            border: `1px solid ${theme.border}`
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <div style={{ backgroundColor: theme.btnSecondaryBg, padding: '7px', borderRadius: '10px', color: theme.textPrimary }}>
                <Smartphone size={18} />
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: '15px', fontWeight: '700', color: theme.textPrimary }}>iOS (Apple Health) Qoşulması</h3>
                <span style={{ fontSize: '11px', color: theme.textSecondary }}>iPhone istifadəçiləri üçün</span>
              </div>
            </div>

            <div style={{ fontSize: '12px', color: theme.textSecondary, lineHeight: '1.4', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <p style={{ margin: 0 }}>
                Apple-ın təhlükəsizlik siyasətinə görə Apple Health məlumatları vebdə avtomatik oxuna bilmir.
              </p>
              <div style={{ backgroundColor: theme.inputBg, padding: '10px', borderRadius: '10px', border: `1px solid ${theme.border}` }}>
                <strong style={{ color: theme.textPrimary, display: 'block', marginBottom: '4px' }}>Tövsiyə olunan 2 həll yolu:</strong>
                <ol style={{ margin: 0, paddingLeft: '16px' }}>
                  <li>Google Fit tətbiqini yükləyib Apple Health ilə sinxronlaşdırın, sonra "Google Fit Qoş" düyməsini basın.</li>
                  <li style={{ marginTop: '4px' }}>Günün sonunda Health tətbiqindəki addımı "Aktivlik Əlavə Et" bölməsinə yazın.</li>
                </ol>
              </div>
            </div>

            <button
              onClick={() => setShowIosModal(false)}
              style={{
                width: '100%',
                marginTop: '14px',
                backgroundColor: '#44766C',
                color: '#FFFFFF',
                border: 'none',
                padding: '9px',
                borderRadius: '8px',
                fontSize: '12.5px',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              Anladım
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
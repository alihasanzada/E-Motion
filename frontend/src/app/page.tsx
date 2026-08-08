"use client";
import React, { useState, useEffect, useRef } from 'react';
import ActivityPanel from './components/ActivityPanel';
import NutritionPanel from './components/NutritionPanel';
import MentalPanel from './components/MentalPanel';
import ServicesPanel from './components/ServicesPanel';
import {
  Sprout, HeartPulse, UserCheck, PhoneCall, Zap, RefreshCw, CheckCircle2, LayoutDashboard, Activity, Heart, ShieldPlus,
  Trophy, Calendar, Apple, Folder, TrendingUp,
  BarChart3, Search, ChevronDown, Bell, MessageSquare,
  Footprints, Clock, Flame, Droplet, Moon, Sun, Brain,
  Flower2, Wind, BookOpen, Smile, Stethoscope, ClipboardList,
  Phone, LogOut, ArrowRight, Dumbbell, Timer, Plus, FileText, X, Sparkles, Check
} from 'lucide-react';
import ChallengesPanel from './components/ChallengesPanel';
import StatsPanel from './components/StatsPanel';
import ResourcesPanel from './components/ResourcesPanel';
import EventsPanel from './components/EventsPanel';
import ProgressPanel from './components/ProgressPanel';
import { useRouter } from 'next/navigation';
import { toast } from "sonner";
import EmptyState from "./components/EmptyState";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://e-motion-7vds.onrender.com';

const searchIndex = [
  { keywords: ['idarə', 'panel', 'əsas', 'home', 'dashboard'], tabId: 'dashboard', title: 'İdarə paneli' },
  { keywords: ['fiziki', 'addım', 'kalori', 'idman', 'məşq', 'qaçış', 'aktivlik'], tabId: 'activity', title: 'Fiziki aktivlik' },
  { keywords: ['mental', 'meditasiya', 'nəfəs', 'stress', 'yaddaş', 'yuxu', 'rifah'], tabId: 'mental', title: 'Mental sağlamlıq' },
  { keywords: ['sağlamlıq xidmətləri', 'həkim', 'həkim qəbulu', 'psixoloq', 'təcili yardım', 'tibbi məlumatlar', 'xidmət'], tabId: 'services', title: 'Sağlamlıq xidmətləri' },
  { keywords: ['çağırışlar', 'su balansı', 'kampus çağırışı', 'hədəf', 'yarış'], tabId: 'challenges', title: 'Çağırışlar' },
  { keywords: ['tədbirlər', 'seminar', 'vebinar', 'kampus', 'görüş'], tabId: 'events', title: 'Tədbirlər' },
  { keywords: ['qidalanma', 'su', 'kalori', 'pəhriz', 'diet', 'yemək'], tabId: 'nutrition', title: 'Qidalanma' },
  { keywords: ['resurslar', 'kitabxana', 'məqalə', 'material'], tabId: 'resources', title: 'Resurslar' },
  { keywords: ['irəliləyiş', 'uğurlar', 'nişanlar', 'vərdiş', 'günlər'], tabId: 'progress', title: 'Mənim irəliləyişim' },
  { keywords: ['statistika', 'analitika', 'qrafik', 'hesabat'], tabId: 'stats', title: 'Statistikam' }
];

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const [stepsCount, setStepsCount] = useState(7200);
  const [sleepHours, setSleepHours] = useState(7.5);
  const [caloriesCount, setCaloriesCount] = useState(420);

  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isMessagesOpen, setIsMessagesOpen] = useState(false);
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);

  const notificationRef = useRef<HTMLDivElement>(null);
  const messageRef = useRef<HTMLDivElement>(null);

  const [quickMetricType, setQuickMetricType] = useState('water');
  const [quickMetricValue, setQuickMetricValue] = useState('');

  const [notifications, setNotifications] = useState([
    { id: 1, title: 'Su hədəfi', desc: 'Gündəlik su qəbulunun 50%-nə çatdınız!', time: '10 dəq əvvəl', read: false },
    { id: 2, title: 'Həkim qəbulu', desc: 'Sabah saat 14:00-da həkim müayinəniz var.', time: '1 saat əvvəl', read: false },
    { id: 3, title: 'Tədbir xəbərdarlığı', desc: 'Yoqa seansı 22 May tarixində keçiriləcək.', time: '3 saat əvvəl', read: false }
  ]);

  const [messages, setMessages] = useState([
    { id: 1, sender: 'Dr. Əliyev (Tibb məntəqəsi)', text: 'Qan analizi nəticələriniz hazırdır.', time: '12:30', read: false },
    { id: 2, sender: 'Psixoloq Leyla M.', text: 'Növbəti seans üçün vaxtı təsdiqləyin.', time: 'Dünən', read: false }
  ]);

  useEffect(() => {
    const localSteps = localStorage.getItem('user_steps');
    const localWaterGlasses = localStorage.getItem('user_water_glasses');
    const localWaterMl = localStorage.getItem('user_water_ml');

    if (localSteps) setStepsCount(Number(localSteps));

    if (localWaterGlasses !== null) {
      setWaterCount(Number(localWaterGlasses));
    } else if (localWaterMl !== null) {
      setWaterCount(Math.floor(Number(localWaterMl) / 250));
    }

    const loadDashboardData = async () => {
      setIsLoading(true);
      try {
        const [notifRes, msgRes, activityRes] = await Promise.all([
          fetch(`${API_BASE_URL}/api/notifications`),
          fetch(`${API_BASE_URL}/api/messages`),
          fetch(`${API_BASE_URL}/api/activity`)
        ]);

        if (notifRes.ok) setNotifications(await notifRes.json());
        if (msgRes.ok) setMessages(await msgRes.json());

        if (activityRes.ok) {
          const activityData = await activityRes.json();
          if (activityData) {

            if (activityData.steps && activityData.steps > 0) {
              setStepsCount(activityData.steps);
              localStorage.setItem('user_steps', activityData.steps.toString());
            }

            setCaloriesCount(activityData.calories || 0);

            const serverWaterMl = activityData.water ?? activityData.water_ml;
            if (serverWaterMl !== undefined && serverWaterMl !== null && serverWaterMl > 0) {
              const calculatedGlasses = Math.floor(serverWaterMl / 250);
              setWaterCount(calculatedGlasses);
              localStorage.setItem('user_water_ml', serverWaterMl.toString());
              localStorage.setItem('user_water_glasses', calculatedGlasses.toString());
            }
          }
        }
      } catch (err) {
        console.warn('Backend serveri ilə əlaqə yaradılmadı:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setDarkMode(true);
    }
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setIsNotificationsOpen(false);
      }
      if (messageRef.current && !messageRef.current.contains(event.target as Node)) {
        setIsMessagesOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleMarkAllAsRead = async () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));

    try {
      await fetch(`${API_BASE_URL}/api/notifications/read-all`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
    } catch (err) {
      console.warn('Backend ilə əlaqə qurulmadı, lakin interfeys yeniləndi:', err);
    }
  };

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem('theme', newMode ? 'dark' : 'light');
  };
  const router = useRouter();

  const [user, setUser] = useState<{
    fullname: string;
    major: string;
    course: number;
  } | null>(null);

  const [waterCount, setWaterCount] = useState<number>(4);

  useEffect(() => {
    const fetchWater = async () => {
      const savedWater = localStorage.getItem('waterCount');
      if (savedWater !== null) {
        setWaterCount(Number(savedWater));
      }

      try {
        const res = await fetch(`${API_BASE_URL}/api/water`);
        if (res.ok) {
          const data = await res.json();
          setWaterCount(data.count);
          localStorage.setItem('waterCount', data.count.toString());
        }
      } catch (err) {
        console.warn('Backend-dən su məlumatı alınmadı:', err);
      }
    };

    fetchWater();
  }, []);

  const handleWaterUpdate = async (newGlasses: number) => {
    setWaterCount(newGlasses);

    const newWaterMl = newGlasses * 250;

    localStorage.setItem('user_water_glasses', newGlasses.toString());
    localStorage.setItem('user_water_ml', newWaterMl.toString());

    try {
      await fetch(`${API_BASE_URL}/api/activity`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ steps: stepsCount, water_ml: newWaterMl }),
      });
    } catch (err) {
      console.warn("Su miqdarı yenilənə bilmədi:", err);
    }
  };

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error("İstifadəçi məlumatları oxunarkən xəta baş verdi:", e);
        toast.error("Məlumatları yükləyərkən xəta baş verdi.");
      }
    } else {
      setUser({
        fullname: "Əli Həsənov",
        major: "Kompüter mühəndisliyi",
        course: 1
      });
    }
  }, []);

  const handleQuickAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(quickMetricValue);
    if (isNaN(val) || val <= 0) return;

    if (quickMetricType === 'water') {
      setWaterCount(prev => Math.min(8, prev + val));
    } else if (quickMetricType === 'steps') {
      setStepsCount(prev => prev + val);
    } else if (quickMetricType === 'sleep') {
      setSleepHours(prev => parseFloat((prev + val).toFixed(1)));
    } else if (quickMetricType === 'calories') {
      setCaloriesCount(prev => prev + val);
    }

    setQuickMetricValue('');
    setIsQuickAddOpen(false);
  };

  const theme = darkMode ? {
    bgApp: '#121212',
    bgCard: '#1E1E1E',
    bgInner: '#2A2A2A',
    textPrimary: '#FFFFFF',
    textSecondary: '#A0AEC0',
    border: '#333333'
  } : {
    bgApp: '#F8FAFC',
    bgCard: '#FFFFFF',
    bgInner: '#F1F5F9',
    textPrimary: '#0F172A',
    textSecondary: '#64748B',
    border: '#E2E8F0'
  };

  const unreadNotificationsCount = notifications.filter(n => !n.read).length;
  const unreadMessagesCount = messages.filter(m => !m.read).length;
  const handleMarkAllNotificationsAsRead = async () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    try {
      await fetch(`${API_BASE_URL}/api/notifications/read-all`, { method: 'POST' });
    } catch (err) {
      console.error('Bildiriş sıfırlama xətası:', err);
    }
  };

  const toggleMessagesModal = async () => {
    const nextState = !isMessagesOpen;
    setIsMessagesOpen(nextState);
    setIsNotificationsOpen(false);

    if (nextState && unreadMessagesCount > 0) {
      setMessages(prev => prev.map(m => ({ ...m, read: true })));

      try {
        await fetch(`${API_BASE_URL}/api/messages/read-all`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' }
        });
      } catch (err) {
        console.warn('Backend ilə əlaqə qurulmadı, lakin interfeys yeniləndi:', err);
      }
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        minHeight: '100vh',
        width: '100%',
        backgroundColor: theme.bgApp,
        color: theme.textPrimary,
        transition: 'background-color 0.3s ease, color 0.3s ease',
        position: 'relative'
      }}
    >

      {/* Sidebar */}
      <aside
        className="sidebar transition-colors duration-300"
        style={{
          width: '240px',
          backgroundColor: theme.bgCard,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '16px 14px',
          flexShrink: 0,
          borderRight: `1px solid ${theme.border}`,
          height: '100vh',
          position: 'sticky',
          top: 0,
          boxSizing: 'border-box'
        }}
      >
        <div>
          <div className="logo-area" style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '18px', padding: '0 4px' }}>
            <div
              className="logo-icon"
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '10px',
                backgroundColor: '#44766C',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#FFFFFF',
                flexShrink: 0,
                boxShadow: '0 2px 8px rgba(68, 118, 108, 0.25)'
              }}
            >
              <Sprout size={22} />
            </div>
            <div className="logo-text">
              <h2 style={{ margin: 0, fontSize: '15.5px', fontWeight: '700', color: theme.textPrimary, letterSpacing: '-0.3px' }}>E-Motion</h2>
              <p style={{ margin: 0, fontSize: '10.5px', color: theme.textSecondary, fontWeight: '500' }}>Qarabağ Universiteti</p>
            </div>
          </div>

          <nav className="nav-menu" style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
            {[
              { id: 'dashboard', label: 'İdarə paneli', icon: <LayoutDashboard size={17} /> },
              { id: 'activity', label: 'Fiziki aktivlik', icon: <Activity size={17} /> },
              { id: 'mental', label: 'Mental sağlamlıq', icon: <Heart size={17} /> },
              { id: 'services', label: 'Sağlamlıq xidmətləri', icon: <ShieldPlus size={17} /> },
              { id: 'challenges', label: 'Çağırışlar', icon: <Trophy size={17} /> },
              { id: 'events', label: 'Tədbirlər', icon: <Calendar size={17} /> },
              { id: 'nutrition', label: 'Qidalanma', icon: <Apple size={17} /> },
              { id: 'resources', label: 'Resurslar', icon: <Folder size={17} /> },
              { id: 'progress', label: 'Mənim irəliləyişim', icon: <TrendingUp size={17} /> },
              { id: 'stats', label: 'Statistikam', icon: <BarChart3 size={17} /> }
            ].map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`nav-item ${isActive ? 'active' : ''}`}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '11px',
                    width: '100%',
                    padding: '9px 12px',
                    borderRadius: '8px',
                    border: 'none',
                    fontSize: '13px',
                    fontWeight: isActive ? '600' : '500',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'all 0.2s ease',
                    backgroundColor: isActive ? '#44766C' : 'transparent',
                    color: isActive ? '#FFFFFF' : theme.textSecondary,
                    boxShadow: isActive ? '0 2px 4px rgba(68, 118, 108, 0.15)' : 'none'
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.backgroundColor = theme.bgInner;
                      e.currentTarget.style.color = theme.textPrimary;
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.backgroundColor = 'transparent';
                      e.currentTarget.style.color = theme.textSecondary;
                    }
                  }}
                >
                  <span style={{ display: 'flex', alignItems: 'center' }}>{item.icon}</span>
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div style={{ background: darkMode ? '#143826' : '#F0FDF4', padding: '11px 12px', borderRadius: '10px', border: darkMode ? '1px solid #1C5438' : '1px solid #DCFCE7', textAlign: 'center' }}>
            <p style={{ margin: '0 0 6px 0', fontSize: '11px', fontWeight: '600', color: darkMode ? '#A7F3D0' : '#166534', lineHeight: '1.3' }}>Nəfəs al. Rahatla.<br />Özünə vaxt ayır.</p>
            <button
              onClick={() => setActiveTab('mental')}
              style={{ background: '#44766C', color: '#FFFFFF', border: 'none', padding: '7px 12px', borderRadius: '6px', fontSize: '11.5px', fontWeight: '600', cursor: 'pointer', width: '100%', transition: 'opacity 0.2s' }}
            >
              Analiz et
            </button>
          </div>

          <button
            className="nav-item"
            onClick={() => {
              localStorage.clear();
              sessionStorage.clear();
              router.push('/auth');
            }}
            style={{
              border: darkMode ? '1px solid #7F1D1D' : '1px solid #FEE2E2',
              background: darkMode ? '#451A1A' : '#FEF2F2',
              padding: '9px 12px',
              borderRadius: '8px',
              width: '100%',
              textAlign: 'left',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '11px',
              color: darkMode ? '#FCA5A5' : '#EF4444',
              fontWeight: '600',
              fontSize: '13px',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = darkMode ? '#7F1D1D' : '#FEE2E2';
              e.currentTarget.style.color = darkMode ? '#FFFFFF' : '#DC2626';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = darkMode ? '#451A1A' : '#FEF2F2';
              e.currentTarget.style.color = darkMode ? '#FCA5A5' : '#EF4444';
            }}
          >
            <LogOut size={17} />
            <span>Hesabdan çıx</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div
        className="wrapper flex-1 flex flex-col"
        style={{
          backgroundColor: theme.bgApp,
          minHeight: '100vh',
          overflowY: 'auto',
          padding: '0'
        }}
      >

        {/* Header */}
        <header style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '12px 22px',
          backgroundColor: theme.bgCard,
          borderBottom: `1px solid ${theme.border}`,
          width: '100%',
          position: 'sticky',
          top: 0,
          zIndex: 50
        }}>
          <div style={{ position: 'relative', width: '400px' }}>
            <div
              className="search-container"
              style={{
                display: 'flex',
                alignItems: 'center',
                backgroundColor: theme.bgInner,
                border: `1px solid ${theme.border}`,
                padding: '8px 14px',
                borderRadius: '8px',
                width: '100%',
                boxSizing: 'border-box'
              }}
            >
              <Search size={16} style={{ color: theme.textSecondary, marginRight: '8px', flexShrink: 0 }} />
              <input
                type="text"
                placeholder="Axtarış edin..."
                className="search-bar"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setIsSearchOpen(e.target.value.trim().length > 0);
                }}
                onFocus={() => {
                  if (searchQuery.trim().length > 0) setIsSearchOpen(true);
                }}
                style={{
                  border: 'none',
                  outline: 'none',
                  fontSize: '13px',
                  width: '100%',
                  color: theme.textPrimary,
                  background: 'transparent'
                }}
              />
              {searchQuery && (
                <X
                  size={16}
                  onClick={() => {
                    setSearchQuery('');
                    setIsSearchOpen(false);
                  }}
                  style={{ color: theme.textSecondary, cursor: 'pointer', marginLeft: '6px' }}
                />
              )}
            </div>

            {isSearchOpen && searchQuery && (
              <div
                style={{
                  position: 'absolute',
                  top: '44px',
                  left: 0,
                  right: 0,
                  backgroundColor: theme.bgCard,
                  border: `1px solid ${theme.border}`,
                  borderRadius: '10px',
                  boxShadow: darkMode ? '0 10px 25px rgba(0, 0, 0, 0.5)' : '0 10px 25px rgba(0, 0, 0, 0.08)',
                  zIndex: 100,
                  maxHeight: '250px',
                  overflowY: 'auto',
                  padding: '4px 0'
                }}
              >
                {searchIndex.filter(item =>
                  item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  item.keywords.some(k => k.toLowerCase().includes(searchQuery.toLowerCase()))
                ).length > 0 ? (
                  searchIndex
                    .filter(item =>
                      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      item.keywords.some(k => k.toLowerCase().includes(searchQuery.toLowerCase()))
                    )
                    .map((res, index) => (
                      <div
                        key={index}
                        onClick={() => {
                          setActiveTab(res.tabId);
                          setSearchQuery('');
                          setIsSearchOpen(false);
                        }}
                        style={{
                          padding: '9px 15px',
                          fontSize: '12.5px',
                          fontWeight: '600',
                          color: theme.textPrimary,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          borderBottom: `1px solid ${theme.border}`,
                          transition: 'background-color 0.15s ease'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = theme.bgInner}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                      >
                        <span>{res.title}</span>
                        <span style={{ fontSize: '11px', color: '#44766C', fontWeight: '600' }}>Keçid et →</span>
                      </div>
                    ))
                ) : (
                  <EmptyState
                    title="Axtarış nəticəsi tapılmadı"
                    description="Daxil etdiyiniz açar sözə uyğun xidmət və ya panel tapılmadı."
                  />
                )}
              </div>
            )}
          </div>

          <div className="header-right" style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', color: theme.textSecondary }}>
              <button
                onClick={toggleDarkMode}
                title={darkMode ? "Açıq rejimə keç" : "Qaranlıq rejimə keç"}
                style={{
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: darkMode ? '#FBBF24' : theme.textSecondary,
                  transition: 'transform 0.2s ease, color 0.2s ease',
                  padding: 0
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
              >
                {darkMode ? <Sun size={20} /> : <Moon size={20} />}
              </button>

              {/* BİLDİRİŞ VƏ MESAJ KONTEYNERİ */}
              <div ref={notificationRef} style={{ position: 'relative', display: 'inline-flex', alignItems: 'center' }}>
                <button
                  onClick={() => {
                    setIsNotificationsOpen(!isNotificationsOpen);
                    setIsMessagesOpen(false);
                  }}
                  title="Bildirişlər"
                  style={{
                    background: 'transparent',
                    border: 'none',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    color: theme.textSecondary,
                    position: 'relative',
                    padding: 0,
                    transition: 'transform 0.2s ease, color 0.2s ease'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                >
                  <Bell size={20} />
                  {unreadNotificationsCount > 0 && (
                    <span style={{
                      position: 'absolute',
                      top: '-3px',
                      right: '-4px',
                      background: '#EF4444',
                      color: '#FFFFFF',
                      fontSize: '9px',
                      fontWeight: '700',
                      borderRadius: '50%',
                      width: '15px',
                      height: '15px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: `2px solid ${theme.bgCard}`
                    }}>
                      {unreadNotificationsCount}
                    </span>
                  )}
                </button>

                {/* Bildirişlər Modal Pəncərəsi */}
                {isNotificationsOpen && (
                  <div style={{
                    position: 'absolute',
                    top: '42px',
                    right: '0px',
                    width: '320px',
                    backgroundColor: theme.bgCard,
                    border: `1px solid ${theme.border}`,
                    borderRadius: '16px',
                    boxShadow: darkMode ? '0 12px 32px rgba(0, 0, 0, 0.5)' : '0 12px 30px rgba(0, 0, 0, 0.08)',
                    zIndex: 100,
                    overflow: 'hidden'
                  }}>
                    {/* Başlıq Hissəsi */}
                    <div style={{
                      padding: '12px 16px',
                      borderBottom: `1px solid ${theme.border}`,
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      width: '100%',
                      boxSizing: 'border-box'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <h4 style={{ margin: 0, fontSize: '14px', fontWeight: '700', color: theme.textPrimary }}>
                          Bildirişlər
                        </h4>
                        {unreadNotificationsCount > 0 && (
                          <span style={{
                            fontSize: '10.5px',
                            fontWeight: '700',
                            padding: '2px 8px',
                            borderRadius: '12px',
                            backgroundColor: 'rgba(16, 185, 129, 0.15)',
                            color: '#10B981'
                          }}>
                            {unreadNotificationsCount} yeni
                          </span>
                        )}
                      </div>

                      {unreadNotificationsCount > 0 && (
                        <span
                          onClick={handleMarkAllAsRead}
                          style={{
                            fontSize: '11.5px',
                            color: '#10B981',
                            cursor: 'pointer',
                            fontWeight: '600',
                            transition: 'opacity 0.2s',
                            marginLeft: 'auto'
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.opacity = '0.8'}
                          onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
                        >
                          Hamısını oxunmuş et
                        </span>
                      )}
                    </div>

                    {/* Bildirişlər Siyahısı */}
                    <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                      {notifications && notifications.filter(n => !n.read).length > 0 ? (
                        notifications.filter(n => !n.read).map((n) => (
                          <div
                            key={n.id}
                            style={{
                              padding: '12px 16px',
                              borderBottom: `1px solid ${theme.border}`,
                              backgroundColor: darkMode ? 'rgba(16, 185, 129, 0.08)' : '#F0FDF4',
                              display: 'flex',
                              gap: '10px',
                              alignItems: 'flex-start',
                              transition: 'all 0.2s ease',
                              cursor: 'pointer'
                            }}
                          >
                            {/* Oxunmamış İndikator Nöqtəsi */}
                            <span style={{
                              width: '8px',
                              height: '8px',
                              borderRadius: '50%',
                              backgroundColor: '#10B981',
                              marginTop: '5px',
                              flexShrink: 0
                            }} />

                            <div style={{ flex: 1, minWidth: 0 }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3px' }}>
                                <span style={{
                                  fontSize: '13.5px',
                                  fontWeight: '600',
                                  color: theme.textPrimary,
                                  whiteSpace: 'nowrap',
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis'
                                }}>
                                  {n.title}
                                </span>
                                <span style={{
                                  fontSize: '11px',
                                  color: theme.textSecondary,
                                  flexShrink: 0,
                                  marginLeft: '8px'
                                }}>
                                  {n.time}
                                </span>
                              </div>
                              <p style={{
                                margin: 0,
                                fontSize: '12px',
                                color: theme.textSecondary,
                                lineHeight: '1.45',
                                wordBreak: 'break-word'
                              }}>
                                {n.desc}
                              </p>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div style={{
                          padding: '24px 16px',
                          textAlign: 'center',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center'
                        }}>
                          <div style={{
                            width: '44px',
                            height: '44px',
                            borderRadius: '12px',
                            backgroundColor: darkMode ? 'rgba(16, 185, 129, 0.12)' : '#ECFDF5',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#10B981',
                            marginBottom: '10px'
                          }}>
                            <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                            </svg>
                          </div>
                          <p style={{ margin: '0 0 4px 0', fontSize: '14px', fontWeight: '600', color: theme.textPrimary }}>
                            Yeni bildiriş yoxdur
                          </p>
                          <p style={{ margin: 0, fontSize: '12px', color: theme.textSecondary, maxWidth: '240px', lineHeight: '1.4' }}>
                            Bütün bildirişləri oxumusunuz və ya hazırda yeni xəbərdarlıq yoxdur.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* MESAJ SEKSİYASI */}
              <div ref={messageRef} style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', marginLeft: '12px' }}>
                <button
                  onClick={toggleMessagesModal}
                  title="Mesajlar"
                  style={{
                    background: 'transparent',
                    border: 'none',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    color: theme.textSecondary,
                    position: 'relative',
                    padding: 0,
                    transition: 'transform 0.2s ease, color 0.2s ease'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                >
                  <MessageSquare size={20} />
                  {unreadMessagesCount > 0 && (
                    <span style={{
                      position: 'absolute',
                      top: '-3px',
                      right: '-4px',
                      background: '#3B82F6',
                      color: '#FFFFFF',
                      fontSize: '9px',
                      fontWeight: '700',
                      borderRadius: '50%',
                      width: '15px',
                      height: '15px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: `2px solid ${theme.bgCard}`
                    }}>
                      {unreadMessagesCount}
                    </span>
                  )}
                </button>

                {/* Mesajlar Modal Pəncərəsi */}
                {isMessagesOpen && (
                  <div style={{
                    position: 'absolute',
                    top: '38px',
                    right: '0px',
                    width: '290px',
                    backgroundColor: theme.bgCard,
                    border: `1px solid ${theme.border}`,
                    borderRadius: '12px',
                    boxShadow: darkMode ? '0 10px 25px rgba(0, 0, 0, 0.6)' : '0 10px 25px rgba(0, 0, 0, 0.1)',
                    zIndex: 100,
                    overflow: 'hidden'
                  }}>
                    <div style={{ padding: '12px 14px', borderBottom: `1px solid ${theme.border}` }}>
                      <h4 style={{ margin: 0, fontSize: '13px', fontWeight: '700', color: theme.textPrimary }}>Mesajlar</h4>
                    </div>
                    <div style={{ maxHeight: '240px', overflowY: 'auto' }}>
                      {messages && messages.length > 0 ? (
                        messages.map((m) => (
                          <div key={m.id} style={{ padding: '10px 14px', borderBottom: `1px solid ${theme.border}`, cursor: 'pointer' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px' }}>
                              <span style={{ fontSize: '11.5px', fontWeight: '600', color: theme.textPrimary }}>{m.sender}</span>
                              <span style={{ fontSize: '9.5px', color: theme.textSecondary }}>{m.time}</span>
                            </div>
                            <p style={{ margin: 0, fontSize: '11px', color: theme.textSecondary, lineHeight: '1.3' }}>{m.text}</p>
                          </div>
                        ))
                      ) : (
                        <EmptyState
                          title="Mesaj yoxdur"
                          description="Yeni mesajınız mövcud deyil."
                        />
                      )}
                    </div>
                  </div>
                )}
              </div>

            </div>

            <div className="profile-card" style={{ display: 'flex', alignItems: 'center', gap: '11px', cursor: 'pointer' }}>
              <div className="profile-img" style={{ width: '34px', height: '34px', borderRadius: '50%', backgroundColor: '#44766C', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '600', fontSize: '13.5px' }}>
                {user && user.fullname ? user.fullname.charAt(0).toUpperCase() : 'Ə'}
              </div>
              <div className="profile-info" style={{ textAlign: 'left' }}>
                <h4 style={{ margin: 0, fontSize: '13px', fontWeight: '600', color: theme.textPrimary }}>
                  {user ? user.fullname : 'Əli Həsənov'}
                </h4>
                <p style={{ margin: 0, fontSize: '10.5px', color: theme.textSecondary }}>
                  {user ? `${user.major}, ${user.course}-ci kurs` : 'Yüklənir...'}
                </p>
              </div>
              <ChevronDown size={14} style={{ color: theme.textSecondary }} />
            </div>
          </div>
        </header>

        {/* Dashboard Grid View */}
        <main className="main-content flex-1" style={{ padding: '18px 22px', backgroundColor: theme.bgApp }}>

          {activeTab === 'dashboard' && (
            <div className="dashboard-layout" style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: '16px' }}>

              <div className="left-content" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

                {/* Banner */}
                <div
                  style={{
                    backgroundImage: `linear-gradient(90deg, rgba(10, 35, 25, 0.82) 0%, rgba(10, 35, 25, 0.55) 50%, rgba(10, 35, 25, 0.15) 100%), url('https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1400&q=80')`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center 45%',
                    color: '#FFFFFF',
                    padding: '26px 28px',
                    borderRadius: '16px',
                    border: `1px solid ${theme.border}`,
                    boxShadow: '0 8px 20px rgba(0,0,0,0.08)'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ maxWidth: '60%' }}>
                      <h1 style={{ margin: 0, fontSize: '23px', fontWeight: '700', letterSpacing: '-0.2px', textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>
                        Xoş gəlmisiniz, {user ? user.fullname.split(' ')[0] : 'Əli'}!
                      </h1>
                      <p style={{ margin: '8px 0 0 0', fontSize: '13px', opacity: 0.95, lineHeight: '1.45', textShadow: '0 1px 3px rgba(0,0,0,0.4)' }}>
                        Təbiətlə iç-içə, daha sağlam seçimlər və aydın bir zehin. Bu gün hədəfinizə bir addım daha yaxınlaşın.
                      </p>
                      <button
                        onClick={() => setActiveTab('stats')}
                        style={{ marginTop: '16px', display: 'inline-flex', alignItems: 'center', gap: '7px', background: 'rgba(255,255,255,0.25)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.4)', color: '#FFFFFF', padding: '8px 16px', borderRadius: '8px', fontSize: '12.5px', fontWeight: '600', cursor: 'pointer', transition: 'all 0.2s ease' }}
                      >
                        Göstəriciləri yenilə <ArrowRight size={14} />
                      </button>
                    </div>
                    <div style={{ textAlign: 'right', fontSize: '11.5px', background: 'rgba(10, 35, 25, 0.65)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.25)', padding: '12px 16px', borderRadius: '12px', maxWidth: '220px' }}>
                      <b style={{ color: '#A7F3D0', display: 'block', marginBottom: '4px' }}>Günün mesajı:</b>
                      <p style={{ margin: 0, fontStyle: 'italic', opacity: 0.95, fontSize: '11.5px', lineHeight: '1.4' }}>"Kiçik addımlar böyük dəyişikliklər yaradır."</p>
                    </div>
                  </div>
                </div>

                <div className="summary-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '11px' }}>
                  {[
                    { id: 'activity', title: 'Addımlar', value: `${stepsCount.toLocaleString()}`, sub: '/ 10,000 hədəf', color: '#10B981', bg: darkMode ? '#064E3B' : '#E6F4EA', icon: <Footprints size={15} />, percent: Math.min(100, (stepsCount / 10000) * 100) },
                    { id: 'activity', title: 'Aktivlik', value: '35 dəq', sub: '/ 60 dəq hədəf', color: '#3B82F6', bg: darkMode ? '#1E3A8A' : '#E8F0FE', icon: <Clock size={15} />, percent: 58 },
                    { id: 'nutrition', title: 'Kalori', value: `${caloriesCount} kkal`, sub: '/ 600 kkal hədəf', color: '#8B5CF6', bg: darkMode ? '#581C87' : '#F3E8FF', icon: <Flame size={15} />, percent: Math.min(100, (caloriesCount / 600) * 100) },
                    { id: 'nutrition', title: 'Su qəbulu', value: `${waterCount} stəkan`, sub: '/ 8 stəkan hədəf', color: '#F59E0B', bg: darkMode ? '#78350F' : '#FEF3C7', icon: <Droplet size={15} />, percent: Math.min(100, (waterCount / 8) * 100) },
                    { id: 'mental', title: 'Yuxu', value: `${sleepHours} saat`, sub: '/ 8 saat hədəf', color: '#06B6D4', bg: darkMode ? '#164E63' : '#E0F7FA', icon: <Moon size={15} />, percent: Math.min(100, (sleepHours / 8) * 100) }
                  ].map((card, idx) => (
                    <div
                      key={idx}
                      onClick={() => setActiveTab(card.id)}
                      className="summary-card"
                      style={{
                        backgroundColor: theme.bgCard,
                        padding: '14px 15px',
                        borderRadius: '13px',
                        border: `1px solid ${theme.border}`,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '7px',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <div style={{ backgroundColor: card.bg, color: card.color, padding: '5.5px', borderRadius: '50%', display: 'flex' }}>{card.icon}</div>
                        <span style={{ color: theme.textSecondary, fontSize: '12.5px', fontWeight: '500' }}>{card.title}</span>
                      </div>
                      <h3 style={{ margin: 0, fontSize: '17px', fontWeight: '700', color: theme.textPrimary }}>{card.value}</h3>
                      <div style={{ width: '100%', height: '4px', backgroundColor: theme.border, borderRadius: '10px', overflow: 'hidden' }}>
                        <div style={{ width: `${card.percent}%`, height: '100%', backgroundColor: card.color, borderRadius: '10px', transition: 'width 0.3s ease' }}></div>
                      </div>
                      <p style={{ margin: 0, fontSize: '10.5px', color: theme.textSecondary }}>{card.sub}</p>
                    </div>
                  ))}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 2.4fr', gap: '16px' }}>

                  <div
                    onClick={() => setActiveTab('challenges')}
                    className="card"
                    style={{ backgroundColor: theme.bgCard, padding: '16px', borderRadius: '13px', border: `1px solid ${theme.border}`, display: 'flex', flexDirection: 'column', cursor: 'pointer' }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
                      <span style={{ fontSize: '14px' }}>🎯</span>
                      <h3 style={{ margin: 0, fontSize: '13.5px', fontWeight: '700', color: theme.textPrimary }}>Aktiv kampus çağırışı</h3>
                    </div>
                    <div style={{ overflow: 'hidden', borderRadius: '9px', border: `1px solid ${theme.border}`, position: 'relative', height: '100px', marginBottom: '10px', backgroundColor: theme.bgInner }}>
                      <div style={{ position: 'absolute', top: '7px', left: '7px', zIndex: 2 }}>
                        <span style={{ fontSize: '9.5px', background: '#10B981', color: '#FFFFFF', padding: '2.5px 6px', borderRadius: '4px', fontWeight: '600' }}>Aktiv iştirak</span>
                      </div>
                      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)', padding: '9px', color: '#FFFFFF', zIndex: 2 }}>
                        <h4 style={{ margin: 0, fontSize: '12.5px', fontWeight: '600' }}>Su balansı çağırışı</h4>
                      </div>
                      <div style={{ width: '100%', height: '100%', background: 'linear-gradient(45deg, #334155, #1E293B)', opacity: 0.5 }}></div>
                    </div>
                    <p style={{ margin: 0, fontSize: '11.5px', color: theme.textSecondary, lineHeight: '1.35' }}>
                      Susuzlaşmanın qarşısını almaq üçün hər gün hüceyrələri yenilə.
                    </p>
                  </div>

                  <div className="card" style={{ backgroundColor: theme.bgCard, padding: '16px', borderRadius: '13px', border: `1px solid ${theme.border}`, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ fontSize: '14px' }}>🧠</span>
                        <h3 style={{ margin: 0, fontSize: '13.5px', fontWeight: '700', color: theme.textPrimary }}>Mental rifah</h3>
                      </div>
                      <button onClick={() => setActiveTab('mental')} style={{ background: 'none', border: 'none', fontSize: '11.5px', color: theme.textSecondary, cursor: 'pointer' }}>Hamısına bax →</button>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px', flex: 1 }}>
                      {[
                        { title: 'Meditasiya', desc: 'Stressi azaldın', time: '10 dəq', bg: darkMode ? '#3B0764' : '#F3E8FF', border: darkMode ? '#581C87' : '#E9D5FF', icon: <Flower2 size={16} />, color: darkMode ? '#E9D5FF' : '#6B21A8' },
                        { title: 'Nəfəs məşqləri', desc: 'Rahatla və fokuslan', time: '5 dəq', bg: darkMode ? '#1E3A8A' : '#EFF6FF', border: darkMode ? '#1D4ED8' : '#DBEAFE', icon: <Wind size={16} />, color: darkMode ? '#BFDBFE' : '#1E40AF' },
                        { title: 'Yaddaş dəftəri', desc: 'Düşüncələrini yaz', time: '10 dəq', bg: darkMode ? '#7C2D12' : '#FFF7ED', border: darkMode ? '#9A3412' : '#FFEDD5', icon: <BookOpen size={16} />, color: darkMode ? '#FFEDD5' : '#9A3412' },
                        { title: 'Özünüqiymətləndirmə', desc: 'Öz rifahını yoxla', time: '5 dəq', bg: darkMode ? '#064E3B' : '#E6F4EA', border: darkMode ? '#047857' : '#D1FAE5', icon: <Smile size={16} />, color: darkMode ? '#A7F3D0' : '#065F46' }
                      ].map((box, i) => (
                        <div
                          key={i}
                          onClick={() => setActiveTab('mental')}
                          style={{ padding: '10px 4px', background: box.bg, borderRadius: '11px', border: `1px solid ${box.border}`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-around', textAlign: 'center', height: '100%', cursor: 'pointer', boxSizing: 'border-box' }}
                        >
                          <div style={{ color: box.color, background: darkMode ? 'rgba(0,0,0,0.4)' : '#FFFFFF', padding: '5.5px', borderRadius: '50%', display: 'flex' }}>{box.icon}</div>
                          <h5 style={{ margin: 0, fontSize: box.title === 'Özünüqiymətləndirmə' ? '10px' : '11px', fontWeight: '700', color: theme.textPrimary, whiteSpace: 'nowrap' }}>{box.title}</h5>
                          <p style={{ margin: 0, fontSize: '9.5px', color: theme.textSecondary, lineHeight: '1.2', whiteSpace: 'nowrap' }}>{box.desc}</p>
                          <span style={{ fontSize: '9.5px', color: box.color, fontWeight: '700', background: darkMode ? 'rgba(0,0,0,0.5)' : 'rgba(255,255,255,0.8)', padding: '2px 6px', borderRadius: '50px' }}>{box.time}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>

                <div className="card" style={{ backgroundColor: theme.bgCard, padding: '16px', borderRadius: '13px', border: `1px solid ${theme.border}` }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Calendar size={16} style={{ color: '#44766C' }} />
                      <h3 style={{ margin: 0, fontSize: '13.5px', fontWeight: '700', color: theme.textPrimary }}>Gələcək tədbirlər</h3>
                    </div>
                    <button onClick={() => setActiveTab('events')} style={{ background: 'none', border: 'none', fontSize: '11.5px', color: theme.textSecondary, cursor: 'pointer' }}>Hamısına bax →</button>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '11px' }}>
                    {[
                      { date: '22 MAY', title: 'Yoqa seansı', time: '17:00 - 18:00', location: 'Qarabağ idman zalı' },
                      { date: '25 MAY', title: 'Sağlamlıq həftəsi', time: '09:00 - 17:00', location: 'Təbib meydançası' },
                      { date: '28 MAY', title: 'Stress idarəetməsi', time: '14:00 - 15:30', location: 'Tələbə mərkəzi' }
                    ].map((event, idx) => (
                      <div
                        key={idx}
                        onClick={() => setActiveTab('events')}
                        style={{ backgroundColor: theme.bgInner, padding: '12px', borderRadius: '10px', border: `1px solid ${theme.border}`, display: 'flex', gap: '10px', alignItems: 'center', cursor: 'pointer' }}
                      >
                        <div style={{ background: '#44766C', color: '#FFFFFF', padding: '6px 8px', borderRadius: '7px', textAlign: 'center', minWidth: '42px' }}>
                          <span style={{ fontSize: '12px', fontWeight: '700', display: 'block', lineHeight: '1' }}>{event.date.split(' ')[0]}</span>
                          <span style={{ fontSize: '8.5px', opacity: 0.9 }}>{event.date.split(' ')[1]}</span>
                        </div>
                        <div style={{ overflow: 'hidden' }}>
                          <h4 style={{ margin: 0, fontSize: '11.5px', fontWeight: '600', color: theme.textPrimary, whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>{event.title}</h4>
                          <p style={{ margin: '2px 0 0 0', fontSize: '9.5px', color: theme.textSecondary }}>{event.time}</p>
                          <span style={{ fontSize: '9px', color: '#44766C', fontWeight: '500' }}>{event.location}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

              <div className="right-sidebar" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

                <div
                  onClick={() => setActiveTab('progress')}
                  className="card"
                  style={{ backgroundColor: theme.bgCard, padding: '16px', borderRadius: '13px', border: `1px solid ${theme.border}`, cursor: 'pointer' }}
                >
                  <h3 style={{ margin: '0 0 10px 0', fontSize: '13.5px', fontWeight: '700', color: theme.textPrimary }}>Ardıcıl sağlamlıq günləri</h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '11px' }}>
                    <div style={{ width: '38px', height: '38px', borderRadius: '50%', border: '2px solid #F59E0B', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '17px', background: darkMode ? '#78350F' : '#FEF3C7' }}>🔥</div>
                    <div>
                      <h4 style={{ margin: 0, fontSize: '15.5px', fontWeight: '700', color: theme.textPrimary }}>7 gün</h4>
                      <p style={{ margin: 0, fontSize: '11.5px', color: theme.textSecondary }}>Mükəmməl! Davam et!</p>
                    </div>
                  </div>
                </div>

                <div className="card" style={{ backgroundColor: theme.bgCard, padding: '16px', borderRadius: '13px', border: `1px solid ${theme.border}` }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <h3 style={{ margin: 0, fontSize: '13.5px', fontWeight: '700', color: theme.textPrimary }}>Sağlamlıq xidmətləri</h3>
                    <button onClick={() => setActiveTab('services')} style={{ background: 'none', border: 'none', fontSize: '11.5px', color: theme.textSecondary, cursor: 'pointer' }}>Hamısına bax →</button>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '9px' }}>
                    <div
                      onClick={() => setActiveTab('services')}
                      style={{ backgroundColor: theme.bgInner, padding: '11px', borderRadius: '11px', border: `1px solid ${theme.border}`, cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: '7px' }}
                    >
                      <div style={{ backgroundColor: darkMode ? '#064E3B' : '#ECFDF5', color: '#10B981', padding: '5.5px', borderRadius: '7px', width: 'fit-content', display: 'flex' }}>
                        <Stethoscope size={16} />
                      </div>
                      <span style={{ fontSize: '11.5px', fontWeight: '600', color: theme.textPrimary }}>Həkim qəbulu</span>
                    </div>

                    <div
                      onClick={() => setActiveTab('services')}
                      style={{ backgroundColor: theme.bgInner, padding: '11px', borderRadius: '11px', border: `1px solid ${theme.border}`, cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: '7px' }}
                    >
                      <div style={{ backgroundColor: darkMode ? '#3B0764' : '#F3E8FF', color: '#9333EA', padding: '5.5px', borderRadius: '7px', width: 'fit-content', display: 'flex' }}>
                        <Brain size={16} />
                      </div>
                      <span style={{ fontSize: '11.5px', fontWeight: '600', color: theme.textPrimary }}>Psixoloq görüşü</span>
                    </div>

                    <div
                      onClick={() => setActiveTab('services')}
                      style={{ backgroundColor: theme.bgInner, padding: '11px', borderRadius: '11px', border: `1px solid ${theme.border}`, cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: '7px' }}
                    >
                      <div style={{ backgroundColor: darkMode ? '#1E3A8A' : '#EFF6FF', color: '#3B82F6', padding: '5.5px', borderRadius: '7px', width: 'fit-content', display: 'flex' }}>
                        <FileText size={16} />
                      </div>
                      <span style={{ fontSize: '11.5px', fontWeight: '600', color: theme.textPrimary }}>Tibbi məlumatlar</span>
                    </div>

                    <div
                      onClick={() => setActiveTab('services')}
                      style={{ backgroundColor: theme.bgInner, padding: '11px', borderRadius: '11px', border: `1px solid ${theme.border}`, cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: '7px' }}
                    >
                      <div style={{ backgroundColor: darkMode ? '#451A1A' : '#FEF2F2', color: '#EF4444', padding: '5.5px', borderRadius: '7px', width: 'fit-content', display: 'flex' }}>
                        <PhoneCall size={16} />
                      </div>
                      <span style={{ fontSize: '11.5px', fontWeight: '600', color: theme.textPrimary }}>Təcili yardım</span>
                    </div>
                  </div>
                </div>

                <div className="card" style={{ backgroundColor: theme.bgCard, padding: '16px', borderRadius: '13px', border: `1px solid ${theme.border}` }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '11px' }}>
                    <h3 style={{ margin: 0, fontSize: '13.5px', fontWeight: '700', color: theme.textPrimary }}>Su qəbulu izləyicisi</h3>
                    <span onClick={() => setActiveTab('nutrition')} style={{ fontSize: '11px', color: theme.textSecondary, cursor: 'pointer' }}>Redaktə et</span>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: '4px', marginBottom: '12px' }}>
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                      <div
                        key={i}
                        onClick={() => handleWaterUpdate(i <= waterCount ? i - 1 : i)}
                        style={{
                          flex: 1,
                          height: '28px',
                          borderRadius: '5.5px',
                          backgroundColor: i <= waterCount ? '#3B82F6' : theme.bgInner,
                          color: i <= waterCount ? '#FFFFFF' : theme.textSecondary,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease',
                          border: `1px solid ${theme.border}`
                        }}
                      >
                        <Droplet size={12.5} />
                      </div>
                    ))}
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '11.5px', color: theme.textSecondary }}>
                    <span>Gündəlik hədəf: 8 stəkan</span>
                    <span style={{ fontWeight: '700', color: theme.textPrimary }}>{waterCount}/8 stəkan</span>
                  </div>
                </div>

                <div style={{ background: darkMode ? 'linear-gradient(135deg, #1E293B, #0F172A)' : 'linear-gradient(135deg, #334155, #1E293B)', color: '#FFFFFF', padding: '16px', borderRadius: '13px', border: `1px solid ${theme.border}` }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                    <Sparkles size={16} style={{ color: '#FBBF24' }} />
                    <h4 style={{ margin: 0, fontSize: '12.5px', fontWeight: '600' }}>Motivasiyaya ehtiyacın var?</h4>
                  </div>
                  <p style={{ margin: '0 0 12px 0', fontSize: '11px', opacity: 0.85, lineHeight: '1.4' }}>
                    Bədəninə qulluq et, çünki orada yaşamaq məcburiyyətindəsən.
                  </p>
                  <button
                    onClick={() => setActiveTab('resources')}
                    style={{ background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.2)', color: '#FFFFFF', padding: '6px 12px', borderRadius: '6px', fontSize: '11px', fontWeight: '600', cursor: 'pointer', width: '100%', textAlign: 'center' }}
                  >
                    İlham verən fikirlər →
                  </button>
                </div>

              </div>

            </div>
          )}

          {activeTab === 'activity' && <ActivityPanel isDarkMode={darkMode} />}
          {activeTab === 'mental' && <MentalPanel isDarkMode={darkMode} />}
          {activeTab === 'services' && <ServicesPanel isDarkMode={darkMode} />}
          {activeTab === 'challenges' && <ChallengesPanel isDarkMode={darkMode} />}
          {activeTab === 'events' && <EventsPanel isDarkMode={darkMode} />}
          {activeTab === 'nutrition' && <NutritionPanel isDarkMode={darkMode} />}
          {activeTab === 'resources' && <ResourcesPanel isDarkMode={darkMode} />}
          {activeTab === 'progress' && <ProgressPanel isDarkMode={darkMode} />}
          {activeTab === 'stats' && <StatsPanel isDarkMode={darkMode} />}

        </main>
      </div>

      {/* Quick Add Modal */}
      <button
        onClick={() => setIsQuickAddOpen(true)}
        title="Sürətli məlumat əlavə et"
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          width: '50px',
          height: '50px',
          borderRadius: '50%',
          backgroundColor: '#44766C',
          color: '#FFFFFF',
          border: 'none',
          boxShadow: '0 8px 20px rgba(68, 118, 108, 0.4)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          zIndex: 90,
          transition: 'transform 0.2s ease'
        }}
        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.08)'}
        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
      >
        <Plus size={24} />
      </button>

      {isQuickAddOpen && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          backdropFilter: 'blur(3px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 200
        }}>
          <div style={{
            backgroundColor: theme.bgCard,
            border: `1px solid ${theme.border}`,
            borderRadius: '16px',
            padding: '20px 24px',
            width: '360px',
            boxShadow: '0 20px 40px rgba(0,0,0,0.2)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '700', color: theme.textPrimary }}>Sürətli məlumat əlavəsi</h3>
              <X size={18} style={{ cursor: 'pointer', color: theme.textSecondary }} onClick={() => setIsQuickAddOpen(false)} />
            </div>

            <form onSubmit={handleQuickAddSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '12px', fontWeight: '600', color: theme.textSecondary, display: 'block', marginBottom: '6px' }}>KATEQORİYA SEÇİN</label>
                <select
                  value={quickMetricType}
                  onChange={(e) => setQuickMetricType(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '9px 12px',
                    borderRadius: '8px',
                    border: `1px solid ${theme.border}`,
                    backgroundColor: theme.bgInner,
                    color: theme.textPrimary,
                    fontSize: '13px',
                    outline: 'none'
                  }}
                >
                  <option value="water">Su qəbulu (Stəkan)</option>
                  <option value="steps">Addım sayı</option>
                  <option value="sleep">Yuxu (Saat)</option>
                  <option value="calories">Qidalanma (Kkal)</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: '600', color: theme.textSecondary, display: 'block', marginBottom: '6px' }}>MİQDAR</label>
                <input
                  type="number"
                  step="any"
                  placeholder="Məsələn: 2 və ya 500"
                  value={quickMetricValue}
                  onChange={(e) => setQuickMetricValue(e.target.value)}
                  required
                  style={{
                    width: '100%',
                    padding: '9px 12px',
                    borderRadius: '8px',
                    border: `1px solid ${theme.border}`,
                    backgroundColor: theme.bgInner,
                    color: theme.textPrimary,
                    fontSize: '13px',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <button
                type="submit"
                style={{
                  marginTop: '6px',
                  backgroundColor: '#44766C',
                  color: '#FFFFFF',
                  border: 'none',
                  padding: '10px',
                  borderRadius: '8px',
                  fontSize: '13px',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                Əlavə et
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
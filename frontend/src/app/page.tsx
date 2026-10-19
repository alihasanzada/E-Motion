"use client";
import {
  Sprout, HeartPulse, UserCheck, PhoneCall, Zap, RefreshCw, CheckCircle2, LayoutDashboard, Activity, Heart, ShieldPlus,
  Trophy, Calendar, Apple, Folder, TrendingUp,
  BarChart3, Search, ChevronDown, Bell, MessageSquare,
  Footprints, Clock, Flame, Droplet, Moon, Sun, Brain, Bot,
  Flower2, Wind, BookOpen, Smile, Stethoscope, ClipboardList,
  Phone, LogOut, ArrowRight, Dumbbell, Timer, Plus, FileText, X, Sparkles, Check
} from 'lucide-react';
import React, { useState, useEffect, useRef } from 'react';
import ActivityPanel from './components/ActivityPanel';
import NutritionPanel from './components/NutritionPanel';
import MentalPanel from './components/MentalPanel';
import ServicesPanel from './components/ServicesPanel';
import ChallengesPanel from './components/ChallengesPanel';
import StatsPanel from './components/StatsPanel';
import EventsPanel from './components/EventsPanel';
import ProgressPanel from './components/ProgressPanel';
import DailyScoreWidget from "./components/DailyScoreWidget";
import AIChatModal from './components/AIChatModal';
import EditProfileModal, { UserProfileData } from './components/EditProfileModal';
import { useRouter } from 'next/navigation';
import { toast } from "sonner";
import EmptyState from "./components/EmptyState";
import { apiFetch, clearPrivateLocalData } from '@/utils/api';

const searchIndex = [
  { keywords: ['idarə', 'panel', 'əsas', 'home', 'dashboard'], tabId: 'dashboard', title: 'İdarə paneli' },
  { keywords: ['fiziki', 'addım', 'kalori', 'idman', 'məşq', 'qaçış', 'aktivlik'], tabId: 'activity', title: 'Fiziki aktivlik' },
  { keywords: ['mental', 'meditasiya', 'nəfəs', 'stress', 'yaddaş', 'yuxu', 'rifah'], tabId: 'mental', title: 'Mental sağlamlıq' },
  { keywords: ['sağlamlıq xidmətləri', 'həkim', 'həkim qəbulu', 'psixoloq', 'təcili yardım', 'tibbi məlumatlar', 'xidmət'], tabId: 'services', title: 'Sağlamlıq xidmətləri' },
  { keywords: ['çağırışlar', 'su balansı', 'kampus çağırışı', 'hədəf', 'yarış'], tabId: 'challenges', title: 'Çağırışlar' },
  { keywords: ['tədbirlər', 'seminar', 'vebinar', 'kampus', 'görüş'], tabId: 'events', title: 'Tədbirlər' },
  { keywords: ['qidalanma', 'su', 'kalori', 'pəhriz', 'diet', 'yemək'], tabId: 'nutrition', title: 'Qidalanma' },
  { keywords: ['irəliləyiş', 'uğurlar', 'nişanlar', 'vərdiş', 'günlər'], tabId: 'progress', title: 'İrəliləyişim' },
  { keywords: ['statistika', 'analitika', 'qrafik', 'hesabat'], tabId: 'stats', title: 'Statistikam' }
];

export default function Dashboard() {
  const [isMobileMenuOpen, setisMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isDarkMode, setisDarkMode] = useState(false);
  const [isChatOpen, setisChatOpen] = useState(false);

  const [isSleepModalOpen, setIsSleepModalOpen] = useState(false);
  const [sleepInputValue, setSleepInputValue] = useState('8');

  const [stepsCount, setStepsCount] = useState(0);
  const [sleepHours, setSleepHours] = useState(0);
  const [caloriesCount, setCaloriesCount] = useState(0);
  const [streakDays, setStreakDays] = useState(0);
  const [activityMinutes, setActivityMinutes] = useState(0);
  const [waterCount, setWaterCount] = useState(0);

  const [isNotificationsOpen, setisNotificationsOpen] = useState(false);
  const [isMessagesOpen, setisMessagesOpen] = useState(false);
  const [isProfileModalOpen, setisProfileModalOpen] = useState(false);
  const [isProfileDropdownOpen, setisProfileDropdownOpen] = useState(false);

  const notificationRef = useRef<HTMLDivElement>(null);
  const messageRef = useRef<HTMLDivElement>(null);
  const profileDropdownRef = useRef<HTMLDivElement>(null);


  // Bildiriş və həkim mesajları yalnız serverdən gələndə göstərilməlidir.
  const [notifications, setNotifications] = useState<{
    id: number; title: string; desc: string; time: string; read: boolean;
  }[]>([]);

  const [messages, setMessages] = useState<{
    id: number; sender: string; text: string; time: string; read: boolean;
  }[]>([]);

  useEffect(() => {
    const localSteps = localStorage.getItem('user_steps');
    const localWaterGlasses = localStorage.getItem('user_water_glasses');
    const localWaterMl = localStorage.getItem('user_water_ml');
    const localCalories = localStorage.getItem('user_calories');
    const localMinutes = localStorage.getItem('user_active_minutes');
    const localSleep = localStorage.getItem('user_sleep_hours');

    const mins = localMinutes ? Number(localMinutes) : 0;
    setActivityMinutes(mins);

    if (localSteps) {
      const stepsNum = Number(localSteps);
      setStepsCount(stepsNum);

      const calculatedCalories = localCalories ? Number(localCalories) : Math.round(stepsNum * 0.04 + mins * 5);
      setCaloriesCount(calculatedCalories);
    }

    if (localWaterGlasses !== null) {
      setWaterCount(Number(localWaterGlasses));
    } else if (localWaterMl !== null) {
      setWaterCount(Math.floor(Number(localWaterMl) / 250));
    } else {
      setWaterCount(0);
    }

    if (localSleep !== null) {
      setSleepHours(Number(localSleep));
    }

    const loadDashboardData = async () => {
      setIsLoading(true);
      try {
        // A slow or failing notifications endpoint must not prevent activity
        // and water from being restored after the student signs in.
        const [notificationResult, messageResult, activityResult] = await Promise.allSettled([
          apiFetch('/api/notifications'),
          apiFetch('/api/messages'),
          apiFetch('/api/activity')
        ]);

        if (notificationResult.status === 'fulfilled' && notificationResult.value.ok) {
          setNotifications(await notificationResult.value.json());
        }
        if (messageResult.status === 'fulfilled' && messageResult.value.ok) {
          setMessages(await messageResult.value.json());
        }

        if (activityResult.status === 'fulfilled' && activityResult.value.ok) {
          const activityData = await activityResult.value.json();
          const serverSteps = Number(activityData.steps ?? 0);
          const serverMinutes = Number(activityData.active_minutes ?? 0);
          const serverWaterMl = Number(activityData.water_ml ?? activityData.water ?? 0);
          if ([serverSteps, serverMinutes, serverWaterMl].every(Number.isFinite)) {
            // Always trust the authenticated server, including valid zero values.
            const totalCalories = Math.round(serverSteps * 0.04 + serverMinutes * 5);
            const glasses = Math.floor(serverWaterMl / 250);
            setStepsCount(serverSteps);
            setActivityMinutes(serverMinutes);
            setCaloriesCount(totalCalories);
            setWaterCount(glasses);
            localStorage.setItem('user_steps', String(serverSteps));
            localStorage.setItem('user_active_minutes', String(serverMinutes));
            localStorage.setItem('user_calories', String(totalCalories));
            localStorage.setItem('user_water_ml', String(serverWaterMl));
            localStorage.setItem('user_water_glasses', String(glasses));
          }
        } else {
          console.warn('Şəxsi aktivlik məlumatları serverdən alına bilmədi.');
        }
      } catch (err) {
        console.warn('Dashboard məlumatları yenilənə bilmədi:', err);
      } finally {
        setIsLoading(false);
      }
    };

    const handleStorageChange = () => {
      const updatedSteps = localStorage.getItem('user_steps');
      const updatedMins = localStorage.getItem('user_active_minutes');
      const updatedWaterG = localStorage.getItem('user_water_glasses');
      const updatedSleep = localStorage.getItem('user_sleep_hours');
      const updatedCals = localStorage.getItem('user_calories');

      if (updatedSteps !== null) setStepsCount(Number(updatedSteps));
      if (updatedMins !== null) setActivityMinutes(Number(updatedMins));
      if (updatedWaterG !== null) setWaterCount(Number(updatedWaterG));
      if (updatedSleep !== null) setSleepHours(Number(updatedSleep));

      const steps = updatedSteps ? Number(updatedSteps) : stepsCount;
      const mins = updatedMins ? Number(updatedMins) : activityMinutes;
      const cals = updatedCals ? Number(updatedCals) : Math.round(steps * 0.04 + mins * 5);
      setCaloriesCount(cals);
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);

    loadDashboardData();
  }, [activeTab]);

  useEffect(() => {
    const handleActivityUpdate = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail) {
        if (customEvent.detail.steps !== undefined) setStepsCount(Number(customEvent.detail.steps));
        if (customEvent.detail.activeMinutes !== undefined) setActivityMinutes(Number(customEvent.detail.activeMinutes));
        if (customEvent.detail.calories !== undefined) setCaloriesCount(Number(customEvent.detail.calories));
      }
    };

    const handleStorageChange = () => {
      const savedSteps = localStorage.getItem('user_steps');
      const savedMins = localStorage.getItem('user_active_minutes');
      const savedCals = localStorage.getItem('user_calories');
      const savedWater = localStorage.getItem('user_water_glasses');
      const savedSleep = localStorage.getItem('user_sleep_hours');

      if (savedSteps !== null) setStepsCount(Number(savedSteps));
      if (savedMins !== null) setActivityMinutes(Number(savedMins));
      if (savedCals !== null) setCaloriesCount(Number(savedCals));
      if (savedWater !== null) setWaterCount(Number(savedWater));
      if (savedSleep !== null) setSleepHours(Number(savedSleep));
    };

    window.addEventListener('activity-updated', handleActivityUpdate as EventListener);
    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('activity-updated', handleActivityUpdate as EventListener);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setisDarkMode(true);
    }
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setisNotificationsOpen(false);
      }
      if (messageRef.current && !messageRef.current.contains(event.target as Node)) {
        setisMessagesOpen(false);
      }
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target as Node)) {
        setisProfileDropdownOpen(false);
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
      await apiFetch('/api/notifications/read-all', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
    } catch (err) {
      console.warn('Backend ilə əlaqə qurulmadı, lakin interfeys yeniləndi:', err);
    }
  };

  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setisDarkMode(newMode);
    localStorage.setItem('theme', newMode ? 'dark' : 'light');
  };
  const router = useRouter();

  const [user, setUser] = useState<UserProfileData | null>(null);

  useEffect(() => {
    const fetchWater = async () => {
      const savedWater = localStorage.getItem('user_water') || localStorage.getItem('user_water_ml');

      if (savedWater !== null) {
        const ml = Number(savedWater);
        const glasses = ml > 10 ? Math.round(ml / 250) : ml;
        setWaterCount(glasses);
      } else {
        setWaterCount(0);
      }
    };

    fetchWater();
  }, []);

  const handleWaterUpdate = async (newGlasses: number) => {
    const newWaterMl = newGlasses * 250;
    try {
      // Do not send stepsCount here: it may still be zero while dashboard loads,
      // and would otherwise overwrite the saved steps on the server.
      const response = await apiFetch('/api/activity', {
        method: 'POST',
        body: JSON.stringify({ water_ml: newWaterMl }),
      });
      if (!response.ok) throw new Error(`Su qəbulu yazılmadı: HTTP ${response.status}`);
      const data = await response.json();
      const savedGlasses = Math.floor(Number(data.water_ml ?? newWaterMl) / 250);
      setWaterCount(savedGlasses);
      localStorage.setItem('user_water_glasses', String(savedGlasses));
      localStorage.setItem('user_water_ml', String(data.water_ml ?? newWaterMl));
      window.dispatchEvent(new Event('storage'));
    } catch (err) {
      console.error('Su miqdarı saxlanılmadı:', err);
      toast.error('Su qəbulu serverdə saxlanmadı. Yenidən cəhd edin.');
    }
  };

  useEffect(() => {
    const loadUserData = async () => {
      const storedUser = localStorage.getItem('user');
      if (!storedUser) {
        router.replace('/auth');
        return;
      }
      try {
        const res = await apiFetch('/api/user/profile');
        if (res.status === 401) {
          clearPrivateLocalData();
          router.replace('/auth');
          return;
        }
        if (!res.ok) {
          console.warn('Profil sorğusu uğursuz oldu:', res.status);
          return;
        }
        const profileData = await res.json();
        const cachedUser = JSON.parse(storedUser);
        if (profileData.email !== cachedUser.email) {
          clearPrivateLocalData();
          router.replace('/auth');
          return;
        }
        const merged = { ...cachedUser, ...profileData };
        setUser(merged);
        localStorage.setItem('user', JSON.stringify(merged));
      } catch (err) {
        console.warn('Backend profil məlumatı oxunmadı:', err);
      }
    };
    loadUserData();
  }, [router]);

  const handleLogout = async () => {
    try {
      await apiFetch('/api/logout', { method: 'POST' });
    } catch (err) {
      console.warn('Server sessiyasını bağlamaq mümkün olmadı:', err);
    } finally {
      clearPrivateLocalData();
      router.replace('/auth');
    }
  };

  const theme = isDarkMode ? {
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
      await apiFetch('/api/notifications/read-all', { method: 'POST' });
    } catch (err) {
      console.error('Bildiriş sıfırlama xətası:', err);
    }
  };

  const toggleMessagesModal = async () => {
    const nextState = !isMessagesOpen;
    setisMessagesOpen(nextState);
    setisNotificationsOpen(false);

    if (nextState && unreadMessagesCount > 0) {
      setMessages(prev => prev.map(m => ({ ...m, read: true })));

      try {
        await apiFetch('/api/messages/read-all', {
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
        className={`sidebar transition-colors duration-300 ${isMobileMenuOpen ? 'mobile-open' : ''}`}
        style={{
          backgroundColor: theme.bgCard,
          borderRight: `1px solid ${theme.border}`
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
              { id: 'progress', label: 'İrəliləyişim', icon: <TrendingUp size={17} /> },
              { id: 'stats', label: 'Statistikam', icon: <BarChart3 size={17} /> }
            ].map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setisMobileMenuOpen(false);
                  }}
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
          <div style={{ background: isDarkMode ? '#143826' : '#F0FDF4', padding: '11px 12px', borderRadius: '10px', border: isDarkMode ? '1px solid #1C5438' : '1px solid #DCFCE7', textAlign: 'center' }}>
            <p style={{ margin: '0 0 6px 0', fontSize: '11px', fontWeight: '600', color: isDarkMode ? '#A7F3D0' : '#166534', lineHeight: '1.3' }}>Nəfəs al. Rahatla.<br />Özünə vaxt ayır.</p>
            <button
              onClick={() => setActiveTab('mental')}
              style={{ background: '#44766C', color: '#FFFFFF', border: 'none', padding: '7px 12px', borderRadius: '6px', fontSize: '11.5px', fontWeight: '600', cursor: 'pointer', width: '100%', transition: 'opacity 0.2s' }}
            >
              Analiz et
            </button>
          </div>

          <button
            className="nav-item"
            onClick={handleLogout}
            style={{
              border: isDarkMode ? '1px solid #7F1D1D' : '1px solid #FEE2E2',
              background: isDarkMode ? '#451A1A' : '#FEF2F2',
              padding: '9px 12px',
              borderRadius: '8px',
              width: '100%',
              textAlign: 'left',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '11px',
              color: isDarkMode ? '#FCA5A5' : '#EF4444',
              fontWeight: '600',
              fontSize: '13px',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = isDarkMode ? '#7F1D1D' : '#FEE2E2';
              e.currentTarget.style.color = isDarkMode ? '#FFFFFF' : '#DC2626';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = isDarkMode ? '#451A1A' : '#FEF2F2';
              e.currentTarget.style.color = isDarkMode ? '#FCA5A5' : '#EF4444';
            }}
          >
            <LogOut size={17} />
            <span>Hesabdan çıx</span>
          </button>
        </div>
      </aside>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div
          onClick={() => setisMobileMenuOpen(false)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: 'rgba(0, 0, 0, 0.4)',
            zIndex: 9998
          }}
        />
      )}

      {/* Main Content Area */}
      <div
        className="wrapper flex-1 flex flex-col"
        style={{
          backgroundColor: theme.bgApp,
          minHeight: '100vh',
          overflowY: 'auto',
          padding: '0',
          width: '100%'
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
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1, maxWidth: '500px' }}>

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setisMobileMenuOpen(!isMobileMenuOpen)}
              className="mobile-menu-btn"
              style={{
                background: 'none',
                border: 'none',
                fontSize: '24px',
                cursor: 'pointer',
                color: theme.textPrimary,
                padding: '4px 8px'
              }}
            >
              {isMobileMenuOpen ? '✕' : '☰'}
            </button>

            {/* Search Wrapper */}
            <div className="search-wrapper" style={{ position: 'relative', width: '100%', maxWidth: '400px' }}>

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
                    boxShadow: isDarkMode ? '0 10px 25px rgba(0, 0, 0, 0.5)' : '0 10px 25px rgba(0, 0, 0, 0.08)',
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
          </div>

          <div className="header-right" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', color: theme.textSecondary }}>
              <button
                onClick={toggleDarkMode}
                title={isDarkMode ? "Açıq rejimə keç" : "Qaranlıq rejimə keç"}
                style={{
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: isDarkMode ? '#FBBF24' : theme.textSecondary,
                  transition: 'transform 0.2s ease, color 0.2s ease',
                  padding: 0
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
              >
                {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
              </button>

              {/* Notifications */}
              <div ref={notificationRef} style={{ position: 'relative', display: 'inline-flex', alignItems: 'center' }}>
                <button
                  onClick={() => {
                    setisNotificationsOpen(!isNotificationsOpen);
                    setisMessagesOpen(false);
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

                {isNotificationsOpen && (
                  <div style={{
                    position: 'absolute',
                    top: '42px',
                    right: '0px',
                    width: '320px',
                    backgroundColor: theme.bgCard,
                    border: `1px solid ${theme.border}`,
                    borderRadius: '16px',
                    boxShadow: isDarkMode ? '0 12px 32px rgba(0, 0, 0, 0.5)' : '0 12px 30px rgba(0, 0, 0, 0.08)',
                    zIndex: 100,
                    overflow: 'hidden'
                  }}>
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

                    <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                      {notifications && notifications.filter(n => !n.read).length > 0 ? (
                        notifications.filter(n => !n.read).map((n) => (
                          <div
                            key={n.id}
                            style={{
                              padding: '12px 16px',
                              borderBottom: `1px solid ${theme.border}`,
                              backgroundColor: isDarkMode ? 'rgba(16, 185, 129, 0.08)' : '#F0FDF4',
                              display: 'flex',
                              gap: '10px',
                              alignItems: 'flex-start',
                              transition: 'all 0.2s ease',
                              cursor: 'pointer'
                            }}
                          >
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
                            backgroundColor: isDarkMode ? 'rgba(16, 185, 129, 0.12)' : '#ECFDF5',
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

              {/* Messages */}
              <div ref={messageRef} style={{ position: 'relative', display: 'inline-flex', alignItems: 'center' }}>
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

                {isMessagesOpen && (
                  <div style={{
                    position: 'absolute',
                    top: '38px',
                    right: '0px',
                    width: '290px',
                    backgroundColor: theme.bgCard,
                    border: `1px solid ${theme.border}`,
                    borderRadius: '12px',
                    boxShadow: isDarkMode ? '0 10px 25px rgba(0, 0, 0, 0.6)' : '0 10px 25px rgba(0, 0, 0, 0.1)',
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

            <div ref={profileDropdownRef} style={{ position: 'relative' }}>
              <div
                className="profile-card"
                onClick={() => setisProfileDropdownOpen(!isProfileDropdownOpen)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '11px',
                  cursor: 'pointer',
                  padding: '4px 8px',
                  borderRadius: '10px',
                  transition: 'background-color 0.15s ease',
                  backgroundColor: isProfileDropdownOpen ? theme.bgInner : 'transparent'
                }}
              >
                <div
                  className="profile-img"
                  style={{
                    width: '34px',
                    height: '34px',
                    borderRadius: '50%',
                    backgroundColor: '#44766C',
                    color: '#FFFFFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: '600',
                    fontSize: '13.5px',
                    boxShadow: '0 2px 6px rgba(68, 118, 108, 0.25)'
                  }}
                >
                  {user && user.fullname ? user.fullname.charAt(0).toUpperCase() : 'Ə'}
                </div>
                <div className="profile-info" style={{ textAlign: 'left' }}>
                  <h4 style={{ margin: 0, fontSize: '13px', fontWeight: '600', color: theme.textPrimary }}>
                    {user?.fullname || 'İstifadəçi'}
                  </h4>
                  <p style={{ margin: 0, fontSize: '10.5px', color: theme.textSecondary }}>
                    {user?.major
                      ? `${user.major}${user.course ? `, ${user.course}-ci kurs` : ''}`
                      : 'Tələbə'}
                  </p>
                </div>
                <ChevronDown
                  size={14}
                  style={{
                    color: theme.textSecondary,
                    transform: isProfileDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                    transition: 'transform 0.2s ease'
                  }}
                />
              </div>

              {/* Profile Dropdown Menu */}
              {isProfileDropdownOpen && (
                <div
                  style={{
                    position: 'absolute',
                    top: 'calc(100% + 8px)',
                    right: 0,
                    width: '240px',
                    backgroundColor: theme.bgCard,
                    border: `1px solid ${theme.border}`,
                    borderRadius: '14px',
                    boxShadow: '0 12px 30px rgba(0,0,0,0.18)',
                    zIndex: 99,
                    padding: '8px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '4px'
                  }}
                >
                  <div style={{ padding: '8px 10px', borderBottom: `1px solid ${theme.border}`, marginBottom: '4px' }}>
                    <p style={{ margin: 0, fontSize: '12px', fontWeight: '700', color: theme.textPrimary }}>
                      {user?.fullname || 'İstifadəçi'}
                    </p>
                    <p style={{ margin: '2px 0 0', fontSize: '10.5px', color: theme.textSecondary }}>
                      {user?.email || ''}
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      setisProfileDropdownOpen(false);
                      setisProfileModalOpen(true);
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      width: '100%',
                      padding: '9px 12px',
                      borderRadius: '8px',
                      border: 'none',
                      backgroundColor: 'transparent',
                      color: theme.textPrimary,
                      fontSize: '12.5px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'background-color 0.15s'
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = theme.bgInner)}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                  >
                    <UserCheck size={16} color="#44766C" />
                    <span>Profili Redaktə Et</span>
                  </button>

                  <button
                    onClick={() => {
                      setisProfileDropdownOpen(false);
                      void handleLogout();
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      width: '100%',
                      padding: '9px 12px',
                      borderRadius: '8px',
                      border: 'none',
                      backgroundColor: 'transparent',
                      color: '#EF4444',
                      fontSize: '12.5px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'background-color 0.15s'
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = isDarkMode ? '#451A1A' : '#FEE2E2')}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                  >
                    <LogOut size={16} />
                    <span>Hesabdan Çıxış</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Dashboard Grid View */}
        <main className="main-content flex-1" style={{ padding: '18px 22px', backgroundColor: theme.bgApp }}>

          {activeTab === 'dashboard' && (
            <div className="dashboard-layout">

              <div className="left-content" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

                {/* Banner */}
                <div
                  className="welcome-banner-card"
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
                  <div className="banner-content">
                    <div className="banner-text">
                      <h1 style={{ margin: 0, fontSize: '23px', fontWeight: '700', letterSpacing: '-0.2px', textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>
                        Xoş gəlmisiniz, {user?.fullname ? user.fullname.split(' ')[0] : 'İstifadəçi'}!
                      </h1>
                      <p style={{ margin: '8px 0 0', fontSize: '13px', opacity: 0.95, lineHeight: '1.45', textShadow: '0 1px 3px rgba(0,0,0,0.4)' }}>
                        Təbiətlə iç-içə, daha sağlam seçimlər və aydın bir zehin. Bu gün hədəfinizə bir addım daha yaxınlaşın.
                      </p>
                      <button
                        onClick={() => setActiveTab('stats')}
                        style={{ marginTop: '16px', display: 'inline-flex', alignItems: 'center', gap: '7px', background: 'rgba(255,255,255,0.25)', backdropFilter: 'blur(4px)', padding: '8px 16px', borderRadius: '10px', color: '#FFFFFF', border: '1px solid rgba(255,255,255,0.3)', cursor: 'pointer', fontSize: '12.5px', fontWeight: '600' }}
                      >
                        Göstəriciləri yenilə <ArrowRight size={14} />
                      </button>
                    </div>
                    <div className="banner-quote" style={{ textAlign: 'right', fontSize: '11.5px', background: 'rgba(10, 35, 25, 0.65)', backdropFilter: 'blur(8px)', border: `1px solid ${theme.border}`, padding: '10px 14px', borderRadius: '12px' }}>
                      <p style={{ margin: 0, fontStyle: 'italic', opacity: 0.95, fontSize: '11.5px', lineHeight: '1.4' }}>"Kiçik addımlar böyük dəyişikliklər yaradır."</p>
                    </div>
                  </div>
                </div>

                {/* Summary Cards Grid */}
                <div className="summary-grid">
                  {[
                    { id: 'activity', title: 'Addımlar', value: `${stepsCount.toLocaleString()}`, sub: '/ 10,000 hədəf', color: '#10B981', bg: isDarkMode ? '#064E3B' : '#E6F4EA', icon: <Footprints size={15} />, percent: Math.min(100, (stepsCount / 10000) * 100) },
                    { id: 'activity', title: 'Aktivlik', value: `${activityMinutes} dəq`, sub: '/ 60 dəq hədəf', color: '#3B82F6', bg: isDarkMode ? '#1E3A8A' : '#E8F0FE', icon: <Clock size={15} />, percent: Math.min(100, (activityMinutes / 60) * 100) },
                    { id: 'nutrition', title: 'Kalori', value: `${caloriesCount} kkal`, sub: '/ 600 kkal hədəf', color: '#8B5CF6', bg: isDarkMode ? '#581C87' : '#F3E8FF', icon: <Flame size={15} />, percent: Math.min(100, (caloriesCount / 600) * 100) },
                    { id: 'nutrition', title: 'Su qəbulu', value: `${waterCount} stəkan`, sub: '/ 8 stəkan hədəf', color: '#F59E0B', bg: isDarkMode ? '#78350F' : '#FEF3C7', icon: <Droplet size={15} />, percent: Math.min(100, (waterCount / 8) * 100) },
                    { id: 'mental', title: 'Yuxu', value: `${sleepHours} saat`, sub: '/ 8 saat hədəf', color: '#06B6D4', bg: isDarkMode ? '#164E63' : '#E0F7FA', icon: <Moon size={15} />, percent: Math.min(100, (sleepHours / 8) * 100) },
                  ].map((card, idx) => (
                    <div
                      key={idx}
                      onClick={() => {
                        if (card.id === 'mental') {
                          setIsSleepModalOpen(true);
                        } else {
                          setActiveTab(card.id);
                        }
                      }}
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

                {/* Challenge & Mental Row */}
                <div className="challenge-mental-row">

                  {/* Active Campus Challenge Card */}
                  <div
                    onClick={() => setActiveTab('challenges')}
                    style={{
                      position: 'relative',
                      borderRadius: '16px',
                      overflow: 'hidden',
                      padding: '20px',
                      color: '#FFFFFF',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      minHeight: '160px',
                      cursor: 'pointer',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                      backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.55), rgba(0, 0, 0, 0.75)), url("https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=800&q=80")',
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                    }}
                  >
                    <div>
                      <span style={{
                        backgroundColor: '#10B981',
                        color: '#FFFFFF',
                        padding: '3px 10px',
                        borderRadius: '12px',
                        fontSize: '11px',
                        fontWeight: '700',
                        display: 'inline-block',
                        marginBottom: '10px'
                      }}>
                        Aktiv iştirak
                      </span>
                      <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '800', letterSpacing: '-0.3px', color: '#FFFFFF' }}>
                        Su balansı çağırışı
                      </h3>
                    </div>

                    <p style={{ margin: '8px 0 0 0', fontSize: '12.5px', opacity: 0.9, lineHeight: '1.4', color: '#FFFFFF' }}>
                      Susuzlaşmanın qarşısını almaq üçün hər gün hüceyrələri yenilə.
                    </p>
                  </div>

                  <div className="card" style={{ backgroundColor: theme.bgCard, padding: '16px', borderRadius: '13px', border: `1px solid ${theme.border}`, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ fontSize: '14px' }}></span>
                        <h3 style={{ margin: 0, fontSize: '13.5px', fontWeight: '700', color: theme.textPrimary }}>Mental rifah</h3>
                      </div>
                      <button onClick={() => setActiveTab('mental')} style={{ background: 'none', border: 'none', fontSize: '11.5px', color: theme.textSecondary, cursor: 'pointer' }}>Hamısına bax →</button>
                    </div>

                    <div className="mental-mini-grid">
                      {[
                        { title: 'Meditasiya', desc: 'Stressi azaldın', time: '10 dəq', bg: isDarkMode ? '#3B0764' : '#F3E8FF', border: isDarkMode ? '#581C87' : '#E9D5FF', icon: <Flower2 size={16} />, color: isDarkMode ? '#E9D5FF' : '#6B21A8' },
                        { title: 'Nəfəs məşqləri', desc: 'Rahatla və fokuslan', time: '5 dəq', bg: isDarkMode ? '#1E3A8A' : '#EFF6FF', border: isDarkMode ? '#1D4ED8' : '#DBEAFE', icon: <Wind size={16} />, color: isDarkMode ? '#BFDBFE' : '#1E40AF' },
                        { title: 'Yaddaş dəftəri', desc: 'Düşüncələrini yaz', time: '10 dəq', bg: isDarkMode ? '#7C2D12' : '#FFF7ED', border: isDarkMode ? '#9A3412' : '#FFEDD5', icon: <BookOpen size={16} />, color: isDarkMode ? '#FFEDD5' : '#9A3412' },
                        { title: 'Özünüqiymətləndirmə', desc: 'Öz rifahını yoxla', time: '5 dəq', bg: isDarkMode ? '#064E3B' : '#E6F4EA', border: isDarkMode ? '#047857' : '#D1FAE5', icon: <Smile size={16} />, color: isDarkMode ? '#A7F3D0' : '#065F46' }
                      ].map((box, i) => (
                        <div
                          key={i}
                          onClick={() => setActiveTab('mental')}
                          style={{ padding: '10px 4px', background: box.bg, borderRadius: '11px', border: `1px solid ${box.border}`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-around', textAlign: 'center', cursor: 'pointer', boxSizing: 'border-box' }}
                        >
                          <div style={{ color: box.color, background: isDarkMode ? 'rgba(0,0,0,0.4)' : '#FFFFFF', padding: '5.5px', borderRadius: '50%', display: 'flex' }}>{box.icon}</div>
                          <h5 style={{ margin: 0, fontSize: box.title === 'Özünüqiymətləndirmə' ? '10px' : '11px', fontWeight: '700', color: theme.textPrimary, whiteSpace: 'nowrap' }}>{box.title}</h5>
                          <p style={{ margin: 0, fontSize: '9.5px', color: theme.textSecondary, lineHeight: '1.2', whiteSpace: 'nowrap' }}>{box.desc}</p>
                          <span style={{ fontSize: '9.5px', color: box.color, fontWeight: '700', background: isDarkMode ? 'rgba(0,0,0,0.5)' : 'rgba(255,255,255,0.8)', padding: '2px 6px', borderRadius: '50px' }}>{box.time}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>

                {/* Events Card */}
                <div className="card" style={{ backgroundColor: theme.bgCard, padding: '16px', borderRadius: '13px', border: `1px solid ${theme.border}` }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Calendar size={16} style={{ color: '#44766C' }} />
                      <h3 style={{ margin: 0, fontSize: '13.5px', fontWeight: '700', color: theme.textPrimary }}>Gələcək tədbirlər</h3>
                    </div>
                    <button onClick={() => setActiveTab('events')} style={{ background: 'none', border: 'none', fontSize: '11.5px', color: theme.textSecondary, cursor: 'pointer' }}>Hamısına bax →</button>
                  </div>

                  <div className="events-grid">
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

              {/* Right Sidebar */}
              <div className="right-sidebar" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <DailyScoreWidget isDarkMode={isDarkMode} />

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
                      <div style={{ backgroundColor: isDarkMode ? '#064E3B' : '#ECFDF5', color: '#10B981', padding: '5.5px', borderRadius: '7px', width: 'fit-content', display: 'flex' }}>
                        <Stethoscope size={16} />
                      </div>
                      <span style={{ fontSize: '11.5px', fontWeight: '600', color: theme.textPrimary }}>Həkim qəbulu</span>
                    </div>

                    <div
                      onClick={() => setActiveTab('services')}
                      style={{ backgroundColor: theme.bgInner, padding: '11px', borderRadius: '11px', border: `1px solid ${theme.border}`, cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: '7px' }}
                    >
                      <div style={{ backgroundColor: isDarkMode ? '#3B0764' : '#F3E8FF', color: '#9333EA', padding: '5.5px', borderRadius: '7px', width: 'fit-content', display: 'flex' }}>
                        <Brain size={16} />
                      </div>
                      <span style={{ fontSize: '11.5px', fontWeight: '600', color: theme.textPrimary }}>Psixoloq görüşü</span>
                    </div>

                    <div
                      onClick={() => setActiveTab('services')}
                      style={{ backgroundColor: theme.bgInner, padding: '11px', borderRadius: '11px', border: `1px solid ${theme.border}`, cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: '7px' }}
                    >
                      <div style={{ backgroundColor: isDarkMode ? '#1E3A8A' : '#EFF6FF', color: '#3B82F6', padding: '5.5px', borderRadius: '7px', width: 'fit-content', display: 'flex' }}>
                        <FileText size={16} />
                      </div>
                      <span style={{ fontSize: '11.5px', fontWeight: '600', color: theme.textPrimary }}>Tibbi məlumatlar</span>
                    </div>

                    <div
                      onClick={() => setActiveTab('services')}
                      style={{ backgroundColor: theme.bgInner, padding: '11px', borderRadius: '11px', border: `1px solid ${theme.border}`, cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: '7px' }}
                    >
                      <div style={{ backgroundColor: isDarkMode ? '#451A1A' : '#FEF2F2', color: '#EF4444', padding: '5.5px', borderRadius: '7px', width: 'fit-content', display: 'flex' }}>
                        <PhoneCall size={16} />
                      </div>
                      <span style={{ fontSize: '11.5px', fontWeight: '600', color: theme.textPrimary }}>Təcili yardım</span>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          )}

          {activeTab === 'activity' && <ActivityPanel isDarkMode={isDarkMode} />}
          {activeTab === 'mental' && <MentalPanel isDarkMode={isDarkMode} />}
          {activeTab === 'services' && <ServicesPanel isDarkMode={isDarkMode} />}
          {activeTab === 'challenges' && <ChallengesPanel isDarkMode={isDarkMode} />}
          {activeTab === 'events' && <EventsPanel isDarkMode={isDarkMode} />}
          {activeTab === 'nutrition' && <NutritionPanel isDarkMode={isDarkMode} />}
          {activeTab === 'progress' && <ProgressPanel isDarkMode={isDarkMode} />}
          {activeTab === 'stats' && <StatsPanel isDarkMode={isDarkMode} />}

        </main>
      </div>

      {/* AI Asistent Floating Button */}
      <button
        onClick={() => setisChatOpen(!isChatOpen)}
        title="E-Motion AI Asistent"
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
        <Bot size={24} />
      </button>

      {/* AI Chat Modal */}
      <AIChatModal
        isOpen={isChatOpen}
        onClose={() => setisChatOpen(false)}
        userStats={{
          addimlar: stepsCount,
          aktivlikDeq: activityMinutes,
          kalori: caloriesCount,
          suQebulu: waterCount,
          yuxu: sleepHours,
          seriya: streakDays,
        }}
      />

      {/* Profile Edit */}
      <EditProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setisProfileModalOpen(false)}
        currentUser={user}
        onUpdate={(updatedData) => {
          setUser(updatedData);
          if (updatedData.daily_step_goal || updatedData.dailyStepGoal) {
            localStorage.setItem('user_step_goal', (updatedData.daily_step_goal || updatedData.dailyStepGoal)!.toString());
          }
        }}
        isDarkMode={isDarkMode}
      />
      {/* Modern Sleep Input Modal */}
      {isSleepModalOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0, 0, 0, 0.6)',
          backdropFilter: 'blur(5px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: '16px'
        }}>
          <div style={{
            backgroundColor: isDarkMode ? '#1E1E1E' : '#FFFFFF',
            borderRadius: '24px',
            padding: '28px',
            width: '100%',
            maxWidth: '400px',
            border: `1px solid ${isDarkMode ? 'rgba(255,255,255,0.1)' : '#E2E8F0'}`,
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.3)',
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
            color: isDarkMode ? '#FFFFFF' : '#0F172A'
          }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px', color: '#06B6D4', fontWeight: '700', fontSize: '15px' }}>
                Gecə Yuxusu Balansı
              </div>
              <p style={{ margin: 0, fontSize: '12.5px', color: isDarkMode ? '#94A3B8' : '#64748B', lineHeight: '1.5' }}>
                Optimal sağlamlıq, beyin funksiyaları və hüceyrə bərpası üçün hər gecə 7–9 saat keyfiyyətli yuxu tövsiyə olunur.
              </p>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', marginBottom: '8px', color: isDarkMode ? '#CBD5E1' : '#475569' }}>
                Yuxu Müddəti (Saat)
              </label>
              <input
                type="number"
                min="1"
                max="14"
                step="0.5"
                value={sleepInputValue}
                onChange={(e) => setSleepInputValue(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  borderRadius: '12px',
                  border: `1px solid ${isDarkMode ? '#3F3F46' : '#CBD5E1'}`,
                  backgroundColor: isDarkMode ? '#27272A' : '#F8FAFC',
                  color: isDarkMode ? '#FFFFFF' : '#0F172A',
                  fontSize: '15px',
                  fontWeight: '600',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            {/* Quick Select Buttons */}
            <div style={{ display: 'flex', gap: '8px' }}>
              {['6', '7', '8', '9'].map((hrs) => (
                <button
                  key={hrs}
                  type="button"
                  onClick={() => setSleepInputValue(hrs)}
                  style={{
                    flex: 1,
                    padding: '8px',
                    borderRadius: '8px',
                    border: `1px solid ${isDarkMode ? '#3F3F46' : '#E2E8F0'}`,
                    backgroundColor: sleepInputValue === hrs ? 'rgba(6, 182, 212, 0.15)' : (isDarkMode ? '#27272A' : '#F8FAFC'),
                    color: sleepInputValue === hrs ? '#06B6D4' : (isDarkMode ? '#FFFFFF' : '#0F172A'),
                    fontSize: '13px',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  {hrs} saat
                </button>
              ))}
            </div>

            <div style={{ display: 'flex', gap: '10px', marginTop: '4px' }}>
              <button
                type="button"
                onClick={() => setIsSleepModalOpen(false)}
                style={{
                  flex: 1,
                  padding: '12px',
                  borderRadius: '12px',
                  border: `1px solid ${isDarkMode ? '#3F3F46' : '#E2E8F0'}`,
                  backgroundColor: 'transparent',
                  color: isDarkMode ? '#CBD5E1' : '#64748B',
                  fontSize: '13.5px',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                Ləğv et
              </button>
              <button
                type="button"
                onClick={() => {
                  const val = Number(sleepInputValue);
                  if (isNaN(val) || val <= 0) {
                    toast.error('Zəhmət olmasa etibarlı saat daxil edin.', {
                      style: {
                        backgroundColor: isDarkMode ? '#1E1E1E' : '#FFFFFF',
                        color: isDarkMode ? '#FFFFFF' : '#0F172A',
                        border: `1px solid ${isDarkMode ? '#3F3F46' : '#E2E8F0'}`,
                      }
                    });
                    return;
                  }
                  if (val > 14) {
                    toast.warning('Sağlam yuxu balansı üçün 1 gündə maksimum 14 saat qeyd edə bilərsiniz.', {
                      style: {
                        backgroundColor: isDarkMode ? '#1E1E1E' : '#FFFFFF',
                        color: isDarkMode ? '#FFFFFF' : '#0F172A',
                        border: `1px solid ${isDarkMode ? '#3F3F46' : '#E2E8F0'}`,
                      }
                    });
                    return;
                  }
                  setSleepHours(val);
                  localStorage.setItem('user_sleep_hours', val.toString());
                  window.dispatchEvent(new Event('storage'));
                  setIsSleepModalOpen(false);
                  toast.success('Yuxu balansınız uğurla yeniləndi!', {
                    style: {
                      backgroundColor: isDarkMode ? '#1E1E1E' : '#FFFFFF',
                      color: isDarkMode ? '#FFFFFF' : '#0F172A',
                      border: `1px solid ${isDarkMode ? '#3F3F46' : '#E2E8F0'}`,
                    }
                  });
                }}
                style={{
                  flex: 1,
                  padding: '12px',
                  borderRadius: '12px',
                  border: 'none',
                  backgroundColor: '#06B6D4',
                  color: '#FFFFFF',
                  fontSize: '13.5px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(6, 182, 212, 0.3)'
                }}
              >
                Yadda saxla
              </button>
            </div>
          </div>
        </div>
      )}
    </div>

  );
}
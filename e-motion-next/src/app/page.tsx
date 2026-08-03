"use client";
import React, { useState, useEffect } from 'react';
import ActivityPanel from './components/ActivityPanel';
import NutritionPanel from './components/NutritionPanel';
import MentalPanel from './components/MentalPanel';
import ServicesPanel from './components/ServicesPanel';
import {
  Sprout, LayoutDashboard, Activity, Heart, ShieldPlus,
  Trophy, Calendar, Apple, Folder, TrendingUp,
  BarChart3, Search, ChevronDown, Bell, MessageSquare,
  Footprints, Clock, Flame, Droplet, Moon, Brain,
  Flower2, Wind, BookOpen, Smile, Stethoscope, ClipboardList,
  Phone, LogOut, ArrowRight, Dumbbell, Timer, Plus, FileText
} from 'lucide-react';
import ChallengesPanel from './components/ChallengesPanel';
import StatsPanel from './components/StatsPanel';
import ResourcesPanel from './components/ResourcesPanel';
import EventsPanel from './components/EventsPanel';
import ProgressPanel from './components/ProgressPanel';
import { useRouter } from 'next/navigation';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [waterCount, setWaterCount] = useState(0);
  const router = useRouter();

  // İstifadıçi məlumatlarını saxlamaq üçün state
  const [user, setUser] = useState<{
    fullname: string;
    major: string;
    course: number;
  } | null>(null);

  // Səhifə yüklənəndə localstorage-dən məlumatları oxuyan hissə
  useEffect(() => {
  const storedUser = localStorage.getItem('user');
  if (storedUser) {
    try {
      setUser(JSON.parse(storedUser));
    } catch (e) {
      console.error("İstifadəçi məlumatları oxunarkən xəta:", e);
    }
  } else {
    setUser({
      fullname: "Əli Həsənov",
      major: "Kompüter Mühəndisliyi",
      course: 1
    });
  }
}, []);

  return (
    <div className="flex min-h-screen w-full bg-[#F8FAFC]" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}> 
      
      {/* SOL MENYÜ (SIDEBAR) */}
<aside className="sidebar" style={{ width: '250px', backgroundColor: '#FFFFFF', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '20px 16px', flexShrink: 0, borderRight: '1px solid #E2E8F0', height: '100vh', position: 'sticky', top: 0, boxSizing: 'border-box' }}>
  <div>
    {/* Logo Bölməsi */}
    <div className="logo-area" style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px', padding: '0 6px' }}>
      <div className="logo-icon" style={{ backgroundColor: '#44766C', color: '#FFFFFF', padding: '8px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Sprout size={20} />
      </div>
      <div className="logo-text">
        <h2 style={{ margin: 0, fontSize: '16px', fontWeight: '700', color: '#1E293B', letterSpacing: '-0.3px' }}>E-MOTION</h2>
        <p style={{ margin: 0, fontSize: '11px', color: '#64748B', fontWeight: '500' }}>Qarabağ Universiteti</p>
      </div>
    </div>
    
    {/* Naviqasiya Menyusu */}
    <nav className="nav-menu" style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
      {[
        { id: 'dashboard', label: 'İdarə paneli', icon: <LayoutDashboard size={18} /> },
        { id: 'activity', label: 'Fiziki Aktivlik', icon: <Activity size={18} /> },
        { id: 'mental', label: 'Mental Sağlamlıq', icon: <Heart size={18} /> },
        { id: 'services', label: 'Sağlamlıq Xidmətləri', icon: <ShieldPlus size={18} /> },
        { id: 'challenges', label: 'Çağırışlar', icon: <Trophy size={18} /> },
        { id: 'events', label: 'Tədbirlər', icon: <Calendar size={18} /> },
        { id: 'nutrition', label: 'Qidalanma', icon: <Apple size={18} /> },
        { id: 'resources', label: 'Resurslar', icon: <Folder size={18} /> },
        { id: 'progress', label: 'Mənim İrəliləyişim', icon: <TrendingUp size={18} /> },
        { id: 'stats', label: 'Statistikam', icon: <BarChart3 size={18} /> }
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
              gap: '12px',
              width: '100%',
              padding: '10px 14px',
              borderRadius: '8px',
              border: 'none',
              fontSize: '13.5px',
              fontWeight: isActive ? '600' : '500',
              cursor: 'pointer',
              textAlign: 'left',
              transition: 'all 0.2s ease',
              backgroundColor: isActive ? '#44766C' : 'transparent',
              color: isActive ? '#FFFFFF' : '#64748B',
              boxShadow: isActive ? '0 2px 4px rgba(68, 118, 108, 0.15)' : 'none'
            }}
            onMouseEnter={(e) => {
              if (!isActive) {
                e.currentTarget.style.backgroundColor = '#F8FAFC';
                e.currentTarget.style.color = '#1E293B';
              }
            }}
            onMouseLeave={(e) => {
              if (!isActive) {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = '#64748B';
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

  {/* Alt Baner və Çıxış */}
  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
    {/* Ümumi dizayn rənginə uyğunlaşdırılmış Motivasiya Kartı */}
    <div style={{ background: '#F0FDF4', padding: '14px', borderRadius: '12px', border: '1px solid #DCFCE7', textAlign: 'center' }}>
      <p style={{ margin: '0 0 8px 0', fontSize: '11.5px', fontWeight: '600', color: '#166534', lineHeight: '1.4' }}>Nəfəs al. Rahatla.<br/>Özünə vaxt ayır.</p>
      <button style={{ background: '#44766C', color: '#FFFFFF', border: 'none', padding: '8px 14px', borderRadius: '6px', fontSize: '11.5px', fontWeight: '600', cursor: 'pointer', width: '100%', transition: 'opacity 0.2s' }}>Analiz et</button>
    </div>

    {/* Çıxış Düyməsi */}
    <button 
      className="nav-item" 
      onClick={() => {
        localStorage.clear(); 
        sessionStorage.clear();
        router.push('/auth');
      }}
      style={{ 
        border: '1px solid #FEE2E2',
        background: '#FEF2F2',
        padding: '10px 14px', 
        borderRadius: '8px', 
        width: '100%', 
        textAlign: 'left', 
        cursor: 'pointer', 
        display: 'flex', 
        alignItems: 'center', 
        gap: '12px', 
        color: '#EF4444',
        fontWeight: '600', 
        fontSize: '13.5px',
        transition: 'all 0.2s ease'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = '#FEE2E2';
        e.currentTarget.style.color = '#DC2626';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = '#FEF2F2';
        e.currentTarget.style.color = '#EF4444';
      }}
    >
      <LogOut size={18} />
      <span>Hesabdan Çıx</span>
    </button>
  </div>
</aside>

      {/* ƏSAS PANEL WRAPPER */}
      <div className="wrapper flex-1 flex flex-col" style={{ overflowY: 'auto', padding: '0' }}>
        
        {/* HEADER - Tam sağa və sola qədər uzanan, çərçivəyə uyğun ağ fonlu header */}
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '9.5px 24px', backgroundColor: '#FFFFFF', borderBottom: '1px solid #E2E8F0', width: '100%' }}>
  {/* Axtarış qutusu */}
  <div className="search-container" style={{ display: 'flex', alignItems: 'center', backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', padding: '10px 16px', borderRadius: '8px', width: '420px' }}>
    <Search size={16} style={{ color: '#94A3B8', marginRight: '8px', flexShrink: 0 }} />
    <input type="text" placeholder="Axtarış edin..." className="search-bar" style={{ border: 'none', outline: 'none', fontSize: '13.5px', width: '100%', color: '#1E293B', background: 'transparent' }} />
  </div>
  
  <div className="header-right" style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
    <div style={{ display: 'flex', gap: '16px', color: '#64748B' }}>
      <div style={{ position: 'relative', cursor: 'pointer' }}>
        <Bell size={20} />
        <span style={{ position: 'absolute', top: '-4px', right: '-4px', background: '#EF4444', color: '#FFFFFF', fontSize: '9px', fontWeight: '700', borderRadius: '50%', width: '14px', height: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>3</span>
      </div>
      <div style={{ position: 'relative', cursor: 'pointer' }}>
        <MessageSquare size={20} />
        <span style={{ position: 'absolute', top: '-4px', right: '-4px', background: '#EF4444', color: '#FFFFFF', fontSize: '9px', fontWeight: '700', borderRadius: '50%', width: '14px', height: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>2</span>
      </div>
    </div>

    {/* DİNAMİK PROFİL KARTI */}
<div className="profile-card" style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
  <div className="profile-img" style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: '#44766C', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '600', fontSize: '14px' }}>
    {/* Tam adın ilk hərfini götürür */}
    {user && user.fullname ? user.fullname.charAt(0).toUpperCase() : 'U'}
  </div>
  <div className="profile-info" style={{ textAlign: 'left' }}>
    <h4 style={{ margin: 0, fontSize: '13.5px', fontWeight: '600', color: '#1E293B' }}>
      {/* Burada tam ad və soyad görünür */}
      {user ? user.fullname : 'İstifadəçi'}
    </h4>
    <p style={{ margin: 0, fontSize: '11px', color: '#64748B' }}>
      {user ? `${user.major}, ${user.course}-ci kurs` : 'Yüklənir...'}
    </p>
  </div>
  <ChevronDown size={14} style={{ color: '#64748B' }} />
</div>
  </div>
</header>

        {/* DİNAMİK MƏZMUN SAHƏSİ */}
        <main className="main-content flex-1" style={{ padding: '24px' }}>
          {/* <div style={{ background: '#FEF08A', color: '#854D0E', padding: '8px 16px', borderRadius: '6px', marginBottom: '16px', fontWeight: '600', fontSize: '13px' }}>
            Hazırda aktiv olan tabın adı: "{activeTab}"
          </div>  */}
          {activeTab === 'dashboard' && (
            <div className="dashboard-layout" style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '20px' }}>
              
              {/* SOL SÜTUN */}
              <div className="left-content" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                
                {/* BANNER */}
<div style={{ background: 'linear-gradient(135deg, #2E5B4E, #193D33)', color: '#FFFFFF', padding: '24px 28px', borderRadius: '16px' }}>
  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
    <div style={{ maxWidth: '68%' }}>
      <h1 style={{ margin: 0, fontSize: '24px', fontWeight: '700' }}>
        Xoş gəlmisiniz, {user ? user.fullname.split(' ')[0] : 'İstifadəçi'}!
      </h1>
      <p style={{ margin: '8px 0 0 0', fontSize: '13.5px', opacity: 0.9, lineHeight: '1.5' }}>
        Sağlamlıq göstəriciləriniz tam şəkildə SQLite verilənlər bazasına inteqrasiya olunub.
      </p>
      <button style={{ marginTop: '16px', display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.25)', color: '#FFFFFF', padding: '8px 16px', borderRadius: '6px', fontSize: '13px', fontWeight: '600', cursor: 'pointer' }}>
        Görstəriciləri yenilə <ArrowRight size={14} />
      </button>
    </div>
    <div style={{ textAlign: 'right', fontSize: '12px', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.15)', padding: '12px 16px', borderRadius: '12px', maxWidth: '220px' }}>
      <b style={{ color: '#A7F3D0', display: 'block', marginBottom: '4px' }}>Günün Mesajı:</b>
      <p style={{ margin: 0, fontStyle: 'italic', opacity: 0.85, fontSize: '12px', lineHeight: '1.4' }}>"İntizam hədəflərlə nailiyyətlər arasındakı körpüdür."</p>
    </div>
  </div>
</div>

                {/* 5-li Metriklər Paneli */}
                <div className="summary-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '12px' }}>
                  {[
                    { title: 'Addımlar', value: '0', sub: '/ 10,000 hədəf', color: '#10B981', bg: '#E6F4EA', icon: <Footprints size={16} /> },
                    { title: 'Aktivlik', value: '0 dəq', sub: '/ 60 dəq hədəf', color: '#3B82F6', bg: '#E8F0FE', icon: <Clock size={16} /> },
                    { title: 'Kalori', value: '0 kkal', sub: '/ 600 kkal hədəf', color: '#8B5CF6', bg: '#F3E8FF', icon: <Flame size={16} /> },
                    { title: 'Su qəbulu', value: `${waterCount} stəkan`, sub: '/ 8 stəkan hədəf', color: '#F59E0B', bg: '#FEF3C7', icon: <Droplet size={16} /> },
                    { title: 'Yuxu', value: '0 saat', sub: '/ 8 saat hədəf', color: '#06B6D4', bg: '#E0F7FA', icon: <Moon size={16} /> }
                  ].map((card, idx) => (
                    <div key={idx} className="summary-card" style={{ backgroundColor: '#FFFFFF', padding: '16px', borderRadius: '14px', border: '1px solid #E2E8F0', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <div style={{ backgroundColor: card.bg, color: card.color, padding: '6px', borderRadius: '50%', display: 'flex' }}>{card.icon}</div>
                        <span style={{ color: '#64748B', fontSize: '13px', fontWeight: '500' }}>{card.title}</span>
                      </div>
                      <h3 style={{ margin: 0, fontSize: '19px', fontWeight: '700', color: '#1E293B' }}>{card.value}</h3>
                      <div style={{ width: '100%', height: '4px', backgroundColor: '#E2E8F0', borderRadius: '10px', overflow: 'hidden' }}>
                        <div style={{ width: card.title === 'Su qəbulu' ? `${(waterCount/8)*100}%` : '0%', height: '100%', backgroundColor: card.color, borderRadius: '10px' }}></div>
                      </div>
                      <p style={{ margin: 0, fontSize: '11px', color: '#94A3B8' }}>{card.sub}</p>
                    </div>
                  ))}
                </div>

                {/* Alt Bloklar */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 2.2fr', gap: '20px' }}>
                  
                  {/* Kampus Çağırışı */}
                  <div className="card" style={{ backgroundColor: '#FFFFFF', padding: '18px', borderRadius: '14px', border: '1px solid #E2E8F0', display: 'flex', flexDirection: 'column' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '12px' }}>
                      <span style={{ fontSize: '14px' }}>🎯</span>
                      <h3 style={{ margin: 0, fontSize: '14px', fontWeight: '700', color: '#1E293B' }}>Aktiv Kampus Çağırışı</h3>
                    </div>
                    <div style={{ overflow: 'hidden', borderRadius: '10px', border: '1px solid #E2E8F0', position: 'relative', height: '120px', marginBottom: '10px', backgroundColor: '#F1F5F9' }}>
                      <div style={{ position: 'absolute', top: '8px', left: '8px', zIndex: 2 }}>
                        <span style={{ fontSize: '10px', background: '#10B981', color: '#FFFFFF', padding: '3px 6px', borderRadius: '4px', fontWeight: '600' }}>Aktiv iştirak</span>
                      </div>
                      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.6), transparent)', padding: '10px', color: '#FFFFFF', zIndex: 2 }}>
                        <h4 style={{ margin: 0, fontSize: '13px', fontWeight: '600' }}>Su Balansı Çağırışı</h4>
                      </div>
                      <div style={{ width: '100%', height: '100%', background: 'linear-gradient(45deg, #CBD5E1, #94A3B8)', opacity: 0.5 }}></div>
                    </div>
                    <p style={{ margin: 0, fontSize: '12px', color: '#64748B', lineHeight: '1.4' }}>
                      Dehidratasiyanın qarşısını almaq üçün hər gün hüceyrələri yenilə.
                    </p>
                  </div>
                  
                  {/* MENTAL WELLBEING - Çərçivəyə uyğunlaşdırıldı */}
                  <div className="card" style={{ backgroundColor: '#FFFFFF', padding: '18px', borderRadius: '14px', border: '1px solid #E2E8F0' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ fontSize: '14px' }}>🧠</span>
                        <h3 style={{ margin: 0, fontSize: '14px', fontWeight: '700', color: '#1E293B' }}>Mental Wellbeing</h3>
                      </div>
                      <a href="#" style={{ fontSize: '12px', color: '#64748B', textDecoration: 'none' }}>Hamısına bax →</a>
                    </div>
                    
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }}>
                      {[
                        { title: 'Meditasiya', desc: 'Stressi azaldın', time: '10 dəq', bg: '#F3E8FF', border: '#E9D5FF', icon: <Flower2 size={16} />, color: '#6B21A8' },
                        { title: 'Nəfəs məşqləri', desc: 'Rahatla və fokuslan', time: '5 dəq', bg: '#EFF6FF', border: '#DBEAFE', icon: <Wind size={16} />, color: '#1E40AF' },
                        { title: 'Yaddaş dəftəri', desc: 'Düşüncələrini yaz', time: '10 dəq', bg: '#FFF7ED', border: '#FFEDD5', icon: <BookOpen size={16} />, color: '#9A3412' },
                        { title: 'Özünüqiymətləndirmə', desc: 'Öz rifahını yoxla', time: '5 dəq', bg: '#E6F4EA', border: '#D1FAE5', icon: <Smile size={16} />, color: '#065F46' }
                      ].map((box, i) => (
                        <div key={i} style={{ padding: '14px 8px', background: box.bg, borderRadius: '12px', border: `1px solid ${box.border}`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between', textAlign: 'center', minHeight: '145px' }}>
                          <div style={{ color: box.color, background: '#FFFFFF', padding: '6px', borderRadius: '50%', display: 'flex', marginBottom: '4px' }}>{box.icon}</div>
                          <h5 style={{ margin: '4px 0 2px 0', fontSize: '12px', fontWeight: '700', color: '#1E293B' }}>{box.title}</h5>
                          <p style={{ margin: 0, fontSize: '10.5px', color: '#64748B', lineHeight: '1.3' }}>{box.desc}</p>
                          <span style={{ marginTop: '8px', fontSize: '10px', color: box.color, fontWeight: '700', background: 'rgba(255,255,255,0.8)', padding: '3px 8px', borderRadius: '50px' }}>{box.time}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>

              </div>

              {/* SAĞ SÜTUN - Tam sağ kənara qədər uzanan qutular */}
              <div className="right-sidebar" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                
                {/* 1. Ardıcıl Günlər */}
                <div className="card" style={{ backgroundColor: '#FFFFFF', padding: '18px', borderRadius: '14px', border: '1px solid #E2E8F0' }}>
                  <h3 style={{ margin: '0 0 12px 0', fontSize: '14px', fontWeight: '700', color: '#1E293B' }}>Ardıcıl Sağlamlıq Günləri</h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '50%', border: '2px solid #F59E0B', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', background: '#FEF3C7' }}>🔥</div>
                    <div>
                      <h4 style={{ margin: 0, fontSize: '16px', fontWeight: '700', color: '#1E293B' }}>7 Gün</h4>
                      <p style={{ margin: 0, fontSize: '12px', color: '#64748B' }}>Mükəmməl Davam et!</p>
                    </div>
                  </div>
                </div>

                {/* 2. Sağlamlıq xidmətləri (2x2 Matrisi) */}
                <div className="card" style={{ backgroundColor: '#FFFFFF', padding: '18px', borderRadius: '14px', border: '1px solid #E2E8F0' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                    <h3 style={{ margin: 0, fontSize: '14px', fontWeight: '700', color: '#1E293B' }}>Sağlamlıq xidmətləri</h3>
                    <a href="#" style={{ fontSize: '12px', color: '#44766C', textDecoration: 'none' }}>Hamısına bax →</a>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
                    {[
                      { name: 'Həkim qəbulu', bg: '#E6F4EA', color: '#10B981', icon: <Stethoscope size={16} /> },
                      { name: 'Psixoloq görüşü', bg: '#F3E8FF', color: '#8B5CF6', icon: <Brain size={16} /> },
                      { name: 'Tibbi məlumatlar', bg: '#E8F0FE', color: '#3B82F6', icon: <ClipboardList size={16} /> },
                      { name: 'Təcili yardım', bg: '#FEF2F2', color: '#EF4444', icon: <Phone size={16} /> }
                    ].map((srv, idx) => (
                      <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '8px', padding: '12px', backgroundColor: '#F8FAFC', borderRadius: '10px', border: '1px solid #E2E8F0', cursor: 'pointer' }}>
                        <div style={{ backgroundColor: srv.bg, color: srv.color, padding: '6px', borderRadius: '8px', display: 'flex' }}>{srv.icon}</div>
                        <span style={{ fontSize: '12px', fontWeight: '600', color: '#334155', lineHeight: '1.2' }}>{srv.name}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 3. Su İzləyicisi */}
                <div className="card" style={{ backgroundColor: '#FFFFFF', padding: '18px', borderRadius: '14px', border: '1px solid #E2E8F0' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <h3 style={{ margin: 0, fontSize: '14px', fontWeight: '700', color: '#1E293B' }}>Su İcmə İzləyicisi</h3>
                    <a href="#" style={{ fontSize: '12px', color: '#64748B', textDecoration: 'none' }}>Redaktə et</a>
                  </div>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(8, 1fr)', gap: '4px', marginBottom: '12px' }}>
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                      <button 
                        key={num} 
                        onClick={() => setWaterCount(num <= waterCount ? num - 1 : num)}
                        style={{ 
                          border: num <= waterCount ? '1px solid #3B82F6' : '1px dashed #CBD5E1', 
                          borderRadius: '6px',
                          height: '34px',
                          cursor: 'pointer',
                          backgroundColor: num <= waterCount ? '#DBEAFE' : '#F8FAFC',
                          color: num <= waterCount ? '#3B82F6' : '#94A3B8',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          outline: 'none'
                        }}
                      >
                        <Droplet size={15} fill={num <= waterCount ? "#3B82F6" : "none"} />
                      </button>
                    ))}
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px' }}>
                    <span style={{ color: '#64748B' }}>Gündəlik hədəf: 8 stəkan</span>
                    <span style={{ fontWeight: '700', color: '#1E293B' }}>{waterCount}/8 stəkan</span>
                  </div>
                </div>

                {/* 4. Bugünkü Pəhriz Ortalaması */}
                <div className="card" style={{ backgroundColor: '#FFFFFF', padding: '18px', borderRadius: '14px', border: '1px solid #E2E8F0' }}>
                  <h3 style={{ margin: '0 0 4px 0', fontSize: '14px', fontWeight: '700', color: '#1E293B' }}>Bugünkü Pəhriz Ortalaması</h3>
                  <h2 style={{ margin: '6px 0', fontSize: '28px', fontWeight: '800', color: '#10B981' }}>0 kkal</h2>
                  <p style={{ margin: 0, fontSize: '12px', color: '#64748B' }}>Bu gün qəbul edilən qida enerjisi.</p>
                </div>

              </div>

            </div>
          )}
          
          {/* Fiziki Aktivlik Tabı açıldığında ActivityPanel komponenti göstərilir */}
          {activeTab === 'activity' && <ActivityPanel />}
          {/* Qidalanma Tabı açıldığında NutritionPanel komponenti göstərilir */}
          {activeTab === 'nutrition' && <NutritionPanel />}
          {/* Mental Sağlamlıq Tabı açıldığında MentalPanel komponenti göstərilir */}
          {activeTab === 'mental' && <MentalPanel />}
          {/* Sağlamlıq Xidmətləri Tabı açıldığında ServicesPanel komponenti göstərilir */}
          {activeTab === 'services' && <ServicesPanel />}
          {/* Çağırışlar Tabı açıldığında ChallengesPanel komponenti göstərilir */}
          {activeTab === 'challenges' && <ChallengesPanel />}
          {/* Tədbirlər Tabı açıldığında EventsPanel komponenti göstərilir */}
          {activeTab === 'events' && <EventsPanel />}
          {/* Resurslar Tabı açıldığında ResourcesPanel komponenti göstərilir */}
          {activeTab === 'resources' && <ResourcesPanel />}
          {/* İrəliləyiş Tabı açıldığında ProgressPanel komponenti göstərilir */}
          {activeTab === 'progress' && <ProgressPanel />}
          {/* Statistika Tabı açıldığında StatsPanel komponenti göstərilir */}
          {activeTab === 'stats' && <StatsPanel />}

    {/* Digər açılmamış menyular üçün placeholder */}
    {activeTab !== 'dashboard' && activeTab !== 'activity' && activeTab !== 'nutrition' && activeTab !== 'qidalanma' && activeTab !== 'mental' && activeTab !== 'services' && activeTab !== 'challenges' && activeTab !== 'events' && activeTab !== 'resources' && activeTab !== 'progress' && activeTab !== 'stats' && (
      <div className="card" style={{ backgroundColor: '#FFFFFF', padding: '35px', borderRadius: '14px', border: '1px solid #E2E8F0' }}>
        <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#1E293B' }}>Seçilmiş Bölmə İnkişaf Mərhələsindədir</h3>
        <p style={{ fontSize: '13.5px', color: '#64748B', marginTop: '6px' }}>
          Bu bölmə Next.js memarlığı ilə birləşdirilməyə hazırdır.
        </p>
      </div>
    )}
        </main>
      </div>
    </div>
  );
}
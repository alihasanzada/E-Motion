"use client";

import React, { useState, useEffect } from 'react';
import {
  X,
  User,
  GraduationCap,
  Heart,
  Phone,
  Mail,
  ShieldAlert,
  Footprints,
  Droplet,
  Save,
  Building,
  Hash,
  Activity,
  FileText,
  Sparkles
} from 'lucide-react';
import { toast } from 'sonner';

export interface UserProfileData {
  fullname: string;
  major: string;
  course: number | string;
  student_id?: string;
  studentId?: string;
  email?: string;
  phone?: string;
  blood_group?: string;
  bloodGroup?: string;
  emergency_contact?: string;
  emergencyContact?: string;
  bio?: string;
  daily_step_goal?: number;
  dailyStepGoal?: number;
  daily_water_goal?: number;
  dailyWaterGoal?: number;
}

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfileData | null;
  onUpdate: (updatedUser: UserProfileData) => void;
  isDarkMode?: boolean;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://e-motion-7vds.onrender.com';

const QU_MAJORS = [
  "Kompüter Mühəndisliyi",
  "İnformasiya Texnologiyaları",
  "Kibertəhlükəsizlik",
  "Kompüter Elmləri",
  "Ümumi Tibb",
  "Müalicə İşi",
  "İqtisadiyyat",
  "Maliyyə və Menecment",
  "Beynəlxalq Münasibətlər",
  "Riyaziyyat və İnformatika Müəllimliyi",
  "Xarici Dil Müəllimliyi",
  "Tarix və Coğrafiya",
  "Dizayn və Təsviri İncəsənət"
];

const BLOOD_GROUPS = [
  "0 (I) Rh+",
  "0 (I) Rh-",
  "A (II) Rh+",
  "A (II) Rh-",
  "B (III) Rh+",
  "B (III) Rh-",
  "AB (IV) Rh+",
  "AB (IV) Rh-"
];

export default function EditProfileModal({
  isOpen,
  onClose,
  currentUser,
  onUpdate,
  isDarkMode = false
}: EditProfileModalProps) {
  const [activeTab, setActiveTab] = useState<'personal' | 'academic' | 'health'>('personal');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [fullname, setFullname] = useState('');
  const [major, setMajor] = useState(QU_MAJORS[0]);
  const [course, setCourse] = useState<number>(1);
  const [studentId, setStudentId] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [bloodGroup, setBloodGroup] = useState(BLOOD_GROUPS[0]);
  const [emergencyContact, setEmergencyContact] = useState('');
  const [bio, setBio] = useState('');
  const [dailyStepGoal, setDailyStepGoal] = useState<number>(10000);
  const [dailyWaterGoal, setDailyWaterGoal] = useState<number>(2000);

  useEffect(() => {
    let activeUserData = currentUser;

    if (!activeUserData && typeof window !== 'undefined') {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        try {
          activeUserData = JSON.parse(storedUser);
        } catch (err) {
          console.error("Lokal istifadəçi datası oxunarkən xəta yarandı:", err);
        }
      }
    }

    if (activeUserData) {
      setFullname(activeUserData.fullname || '');
      setMajor(activeUserData.major || QU_MAJORS[0]);
      setCourse(Number(activeUserData.course) || 1);
      setStudentId(activeUserData.student_id || activeUserData.studentId || '');
      setEmail(activeUserData.email || '');
      setPhone(activeUserData.phone || '');
      setBloodGroup(activeUserData.blood_group || activeUserData.bloodGroup || BLOOD_GROUPS[0]);
      setEmergencyContact(activeUserData.emergency_contact || activeUserData.emergencyContact || '');
      setBio(activeUserData.bio || '');
      setDailyStepGoal(Number(activeUserData.daily_step_goal || activeUserData.dailyStepGoal) || 10000);
      setDailyWaterGoal(Number(activeUserData.daily_water_goal || activeUserData.dailyWaterGoal) || 2000);
    }
  }, [currentUser, isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const theme = {
    overlayBg: 'rgba(0, 0, 0, 0.65)',
    cardBg: isDarkMode ? '#1A1D20' : '#FFFFFF',
    innerBg: isDarkMode ? '#22262B' : '#F8FAFC',
    inputBg: isDarkMode ? '#15181B' : '#FFFFFF',
    textPrimary: isDarkMode ? '#F1F5F9' : '#0F172A',
    textSecondary: isDarkMode ? '#94A3B8' : '#64748B',
    borderColor: isDarkMode ? '#2E353D' : '#E2E8F0',
    primary: '#44766C',
    primaryLight: isDarkMode ? '#1E3530' : '#E8F3F1',
    accent: '#10B981',
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!fullname.trim()) {
      toast.error('Zəhmət olmasa ad və soyadınızı daxil edin!');
      return;
    }

    setIsSubmitting(true);

    const updatedProfile: UserProfileData = {
      fullname: fullname.trim(),
      major,
      course: Number(course),
      student_id: studentId.trim(),
      studentId: studentId.trim(),
      email: email.trim(),
      phone: phone.trim(),
      blood_group: bloodGroup,
      bloodGroup: bloodGroup,
      emergency_contact: emergencyContact.trim(),
      emergencyContact: emergencyContact.trim(),
      bio: bio.trim(),
      daily_step_goal: Number(dailyStepGoal),
      dailyStepGoal: Number(dailyStepGoal),
      daily_water_goal: Number(dailyWaterGoal),
      dailyWaterGoal: Number(dailyWaterGoal),
    };

    try {
      const stored = localStorage.getItem('user');
      const existingUser = stored ? JSON.parse(stored) : {};
      const mergedUser = { ...existingUser, ...updatedProfile };

      localStorage.setItem('user', JSON.stringify(mergedUser));
      localStorage.setItem('daily_step_goal', dailyStepGoal.toString());
      localStorage.setItem('user_step_goal', dailyStepGoal.toString());
      localStorage.setItem('daily_water_goal', dailyWaterGoal.toString());
      localStorage.setItem('user_water_goal', dailyWaterGoal.toString());

      const token = localStorage.getItem('userToken') || localStorage.getItem('token');
      const headers: Record<string, string> = {
        'Content-Type': 'application/json'
      };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(`${API_BASE_URL}/api/user/profile`, {
        method: 'POST',
        headers,
        body: JSON.stringify(updatedProfile),
      });

      if (!response.ok) {
        await fetch(`${API_BASE_URL}/api/user/profile`, {
          method: 'PUT',
          headers,
          body: JSON.stringify(updatedProfile),
        }).catch(() => null);
      }

      onUpdate(mergedUser);
      toast.success('Profil məlumatları uğurla yeniləndi!');
      onClose();
    } catch (error) {
      console.warn('Backend ilə əlaqə qurulmadı, lakin lokal profil yeniləndi:', error);
      onUpdate(updatedProfile);
      toast.success('Məlumatlar yadda saxlanıldı (Lokal rejim)!');
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: theme.overlayBg,
        backdropFilter: 'blur(6px)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
        animation: 'fadeIn 0.2s ease-out'
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: theme.cardBg,
          color: theme.textPrimary,
          width: '100%',
          maxWidth: '680px',
          maxHeight: '90vh',
          borderRadius: '20px',
          border: `1px solid ${theme.borderColor}`,
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.35)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          animation: 'slideUp 0.25s cubic-bezier(0.16, 1, 0.3, 1)'
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '20px 24px',
            borderBottom: `1px solid ${theme.borderColor}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: theme.innerBg
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '12px',
                backgroundColor: theme.primary,
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 12px rgba(68, 118, 108, 0.3)'
              }}
            >
              <User size={22} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '700', letterSpacing: '-0.3px', color: theme.textPrimary }}>
                İstifadəçi Profilini Redaktə Et
              </h3>
              <p style={{ margin: '2px 0 0', fontSize: '12px', color: theme.textSecondary }}>
                Qarabağ Universiteti • E-Motion Sağlamlıq Portalı
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Bağla"
            style={{
              background: 'transparent',
              border: 'none',
              color: theme.textSecondary,
              cursor: 'pointer',
              padding: '6px',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'background-color 0.15s'
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = isDarkMode ? '#333A42' : '#E2E8F0')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
          >
            <X size={20} />
          </button>
        </div>

        {/* Canlı Profil Xülasəsi Kartı */}
        <div
          style={{
            margin: '16px 24px 0',
            padding: '14px 18px',
            borderRadius: '14px',
            backgroundColor: theme.innerBg,
            border: `1px solid ${theme.borderColor}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px',
            flexWrap: 'wrap'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '46px',
                height: '46px',
                borderRadius: '50%',
                backgroundColor: '#44766C',
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: '700',
                fontSize: '18px',
                boxShadow: '0 2px 8px rgba(68, 118, 108, 0.35)'
              }}
            >
              {fullname.trim() ? fullname.trim().charAt(0).toUpperCase() : 'T'}
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '15px', fontWeight: '700', color: theme.textPrimary }}>
                  {fullname || 'Tələbə Adı'}
                </span>
                <span
                  style={{
                    fontSize: '10.5px',
                    padding: '2px 8px',
                    borderRadius: '20px',
                    backgroundColor: theme.primaryLight,
                    color: theme.primary,
                    fontWeight: '600'
                  }}
                >
                  {course}-ci kurs
                </span>
              </div>
              <p style={{ margin: '2px 0 0', fontSize: '12px', color: theme.textSecondary }}>
                {major} {studentId ? `• ID: ${studentId}` : ''}
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <span
              style={{
                fontSize: '11px',
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                padding: '4px 10px',
                borderRadius: '8px',
                backgroundColor: isDarkMode ? '#2D1F23' : '#FEE2E2',
                color: '#EF4444',
                fontWeight: '600'
              }}
            >
              <Heart size={12} /> {bloodGroup}
            </span>
            <span
              style={{
                fontSize: '11px',
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                padding: '4px 10px',
                borderRadius: '8px',
                backgroundColor: isDarkMode ? '#132E27' : '#DCFCE7',
                color: '#10B981',
                fontWeight: '600'
              }}
            >
              <Sparkles size={12} /> {dailyStepGoal.toLocaleString()} addım
            </span>
          </div>
        </div>

        {/* Tab Menyu */}
        <div
          style={{
            display: 'flex',
            padding: '12px 24px 0',
            gap: '8px',
            borderBottom: `1px solid ${theme.borderColor}`
          }}
        >
          {[
            { id: 'personal', label: 'Şəxsi Məlumat', icon: <User size={15} /> },
            { id: 'academic', label: 'Təhsil & Əlaqə', icon: <GraduationCap size={15} /> },
            { id: 'health', label: 'Sağlamlıq & Hədəflər', icon: <Heart size={15} /> }
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as any)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '10px 14px',
                  borderRadius: '8px 8px 0 0',
                  border: 'none',
                  backgroundColor: 'transparent',
                  color: isActive ? theme.primary : theme.textSecondary,
                  fontWeight: isActive ? '700' : '500',
                  fontSize: '13px',
                  cursor: 'pointer',
                  borderBottom: isActive ? `2px solid ${theme.primary}` : '2px solid transparent',
                  transition: 'all 0.15s ease'
                }}
              >
                {tab.icon}
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
          <div
            style={{
              padding: '20px 24px',
              overflowY: 'auto',
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              gap: '16px'
            }}
          >
            {/* Şəxsi Məlumat */}
            {activeTab === 'personal' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '600', marginBottom: '6px', color: theme.textPrimary }}>
                    Ad və Soyad *
                  </label>
                  <div style={{ position: 'relative' }}>
                    <User size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: theme.textSecondary }} />
                    <input
                      type="text"
                      required
                      value={fullname}
                      onChange={(e) => setFullname(e.target.value)}
                      placeholder="Ad və soyadınızı daxil edin"
                      style={{
                        width: '100%',
                        padding: '10px 12px 10px 38px',
                        borderRadius: '10px',
                        border: `1px solid ${theme.borderColor}`,
                        backgroundColor: theme.inputBg,
                        color: theme.textPrimary,
                        fontSize: '13.5px',
                        outline: 'none',
                        boxSizing: 'border-box'
                      }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '600', marginBottom: '6px', color: theme.textPrimary }}>
                    Qısa Bio / Status
                  </label>
                  <div style={{ position: 'relative' }}>
                    <FileText size={16} style={{ position: 'absolute', left: '12px', top: '12px', color: theme.textSecondary }} />
                    <textarea
                      rows={3}
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      placeholder="Özünüz, maraqlarınız və ya sağlamlıq mottonuz haqqında qısa qeyd..."
                      style={{
                        width: '100%',
                        padding: '10px 12px 10px 38px',
                        borderRadius: '10px',
                        border: `1px solid ${theme.borderColor}`,
                        backgroundColor: theme.inputBg,
                        color: theme.textPrimary,
                        fontSize: '13px',
                        outline: 'none',
                        resize: 'none',
                        boxSizing: 'border-box',
                        fontFamily: 'inherit'
                      }}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '600', marginBottom: '6px', color: theme.textPrimary }}>
                      E-poçt Ünvanı
                    </label>
                    <div style={{ position: 'relative' }}>
                      <Mail size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: theme.textSecondary }} />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="ornek@qu.edu.az"
                        style={{
                          width: '100%',
                          padding: '10px 12px 10px 38px',
                          borderRadius: '10px',
                          border: `1px solid ${theme.borderColor}`,
                          backgroundColor: theme.inputBg,
                          color: theme.textPrimary,
                          fontSize: '13px',
                          outline: 'none',
                          boxSizing: 'border-box'
                        }}
                      />
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '600', marginBottom: '6px', color: theme.textPrimary }}>
                      Mobil Telefon
                    </label>
                    <div style={{ position: 'relative' }}>
                      <Phone size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: theme.textSecondary }} />
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+994 50 000 00 00"
                        style={{
                          width: '100%',
                          padding: '10px 12px 10px 38px',
                          borderRadius: '10px',
                          border: `1px solid ${theme.borderColor}`,
                          backgroundColor: theme.inputBg,
                          color: theme.textPrimary,
                          fontSize: '13px',
                          outline: 'none',
                          boxSizing: 'border-box'
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Təhsil & Əlaqə */}
            {activeTab === 'academic' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '14px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '600', marginBottom: '6px', color: theme.textPrimary }}>
                      İxtisas / Fakültə *
                    </label>
                    <div style={{ position: 'relative' }}>
                      <Building size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: theme.textSecondary }} />
                      <select
                        value={major}
                        onChange={(e) => setMajor(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '10px 12px 10px 38px',
                          borderRadius: '10px',
                          border: `1px solid ${theme.borderColor}`,
                          backgroundColor: theme.inputBg,
                          color: theme.textPrimary,
                          fontSize: '13px',
                          outline: 'none',
                          boxSizing: 'border-box',
                          cursor: 'pointer'
                        }}
                      >
                        {QU_MAJORS.map((m) => (
                          <option key={m} value={m}>
                            {m}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '600', marginBottom: '6px', color: theme.textPrimary }}>
                      Tədris Kursu *
                    </label>
                    <div style={{ position: 'relative' }}>
                      <GraduationCap size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: theme.textSecondary }} />
                      <select
                        value={course}
                        onChange={(e) => setCourse(Number(e.target.value))}
                        style={{
                          width: '100%',
                          padding: '10px 12px 10px 38px',
                          borderRadius: '10px',
                          border: `1px solid ${theme.borderColor}`,
                          backgroundColor: theme.inputBg,
                          color: theme.textPrimary,
                          fontSize: '13px',
                          outline: 'none',
                          boxSizing: 'border-box',
                          cursor: 'pointer'
                        }}
                      >
                        <option value={1}>1-ci kurs</option>
                        <option value={2}>2-ci kurs</option>
                        <option value={3}>3-cü kurs</option>
                        <option value={4}>4-cü kurs</option>
                        <option value={5}>Magistratura</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '600', marginBottom: '6px', color: theme.textPrimary }}>
                    Tələbə Nömrəsi / ID
                  </label>
                  <div style={{ position: 'relative' }}>
                    <Hash size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: theme.textSecondary }} />
                    <input
                      type="text"
                      value={studentId}
                      onChange={(e) => setStudentId(e.target.value)}
                      placeholder="Məs: QU-2024-XXXX"
                      style={{
                        width: '100%',
                        padding: '10px 12px 10px 38px',
                        borderRadius: '10px',
                        border: `1px solid ${theme.borderColor}`,
                        backgroundColor: theme.inputBg,
                        color: theme.textPrimary,
                        fontSize: '13px',
                        outline: 'none',
                        boxSizing: 'border-box'
                      }}
                    />
                  </div>
                </div>

                <div
                  style={{
                    padding: '14px',
                    borderRadius: '12px',
                    backgroundColor: isDarkMode ? '#2D1A1A' : '#FEF2F2',
                    border: isDarkMode ? '1px solid #5C2222' : '1px solid #FEE2E2',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px'
                  }}
                >
                  <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12.5px', fontWeight: '700', color: isDarkMode ? '#FCA5A5' : '#DC2626' }}>
                    <ShieldAlert size={16} /> Təcili Əlaqə Nömrəsi (Fövqəladə Hal / Tibb məntəqəsi üçün)
                  </label>
                  <p style={{ margin: 0, fontSize: '11.5px', color: theme.textSecondary }}>
                    Universitet ərazisində qəfil sağlamlıq ehtiyacı olduqda təcili bildiriş göndəriləcək nömrə.
                  </p>
                  <input
                    type="tel"
                    value={emergencyContact}
                    onChange={(e) => setEmergencyContact(e.target.value)}
                    placeholder="+994 50 000 00 00"
                    style={{
                      width: '100%',
                      padding: '9px 12px',
                      borderRadius: '8px',
                      border: isDarkMode ? '1px solid #7F1D1D' : '1px solid #FCA5A5',
                      backgroundColor: theme.inputBg,
                      color: theme.textPrimary,
                      fontSize: '13px',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
              </div>
            )}

            {/* Sağlamlıq & Hədəflər */}
            {activeTab === 'health' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '600', marginBottom: '6px', color: theme.textPrimary }}>
                    Qan Qrupu (Tibbi Qeyd)
                  </label>
                  <div style={{ position: 'relative' }}>
                    <Heart size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#EF4444' }} />
                    <select
                      value={bloodGroup}
                      onChange={(e) => setBloodGroup(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '10px 12px 10px 38px',
                        borderRadius: '10px',
                        border: `1px solid ${theme.borderColor}`,
                        backgroundColor: theme.inputBg,
                        color: theme.textPrimary,
                        fontSize: '13px',
                        outline: 'none',
                        boxSizing: 'border-box',
                        cursor: 'pointer'
                      }}
                    >
                      {BLOOD_GROUPS.map((bg) => (
                        <option key={bg} value={bg}>
                          {bg}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '600', marginBottom: '6px', color: theme.textPrimary }}>
                      Gündəlik Addım Hədəfi
                    </label>
                    <div style={{ position: 'relative' }}>
                      <Footprints size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#10B981' }} />
                      <input
                        type="number"
                        min={1000}
                        max={50000}
                        step={500}
                        value={dailyStepGoal}
                        onChange={(e) => setDailyStepGoal(Number(e.target.value))}
                        style={{
                          width: '100%',
                          padding: '10px 12px 10px 38px',
                          borderRadius: '10px',
                          border: `1px solid ${theme.borderColor}`,
                          backgroundColor: theme.inputBg,
                          color: theme.textPrimary,
                          fontSize: '13px',
                          outline: 'none',
                          boxSizing: 'border-box'
                        }}
                      />
                    </div>
                    <span style={{ fontSize: '11px', color: theme.textSecondary, marginTop: '3px', display: 'block' }}>
                      Tövsiyə olunan: 8,000 - 10,000 addım
                    </span>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '600', marginBottom: '6px', color: theme.textPrimary }}>
                      Gündəlik Su Hədəfi (ml)
                    </label>
                    <div style={{ position: 'relative' }}>
                      <Droplet size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#06B6D4' }} />
                      <input
                        type="number"
                        min={500}
                        max={6000}
                        step={250}
                        value={dailyWaterGoal}
                        onChange={(e) => setDailyWaterGoal(Number(e.target.value))}
                        style={{
                          width: '100%',
                          padding: '10px 12px 10px 38px',
                          borderRadius: '10px',
                          border: `1px solid ${theme.borderColor}`,
                          backgroundColor: theme.inputBg,
                          color: theme.textPrimary,
                          fontSize: '13px',
                          outline: 'none',
                          boxSizing: 'border-box'
                        }}
                      />
                    </div>
                    <span style={{ fontSize: '11px', color: theme.textSecondary, marginTop: '3px', display: 'block' }}>
                      Məsələn: {Math.round(dailyWaterGoal / 250)} stəkan (250 ml)
                    </span>
                  </div>
                </div>

                <div
                  style={{
                    backgroundColor: theme.primaryLight,
                    border: `1px solid ${theme.borderColor}`,
                    padding: '12px 14px',
                    borderRadius: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px'
                  }}
                >
                  <Activity size={20} color={theme.primary} />
                  <p style={{ margin: 0, fontSize: '12px', color: theme.textPrimary, lineHeight: '1.4' }}>
                    Təyin etdiyiniz hədəflər İdarə Panelindəki irəliləyiş halqaları və bildiriş sistemi ilə avtomatik əlaqələndiriləcəkdir.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Footer Buttons */}
          <div
            style={{
              padding: '16px 24px',
              borderTop: `1px solid ${theme.borderColor}`,
              backgroundColor: theme.innerBg,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              gap: '12px'
            }}
          >
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              style={{
                padding: '9px 18px',
                borderRadius: '10px',
                border: `1px solid ${theme.borderColor}`,
                backgroundColor: 'transparent',
                color: theme.textPrimary,
                fontSize: '13px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'background-color 0.15s'
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = isDarkMode ? '#333A42' : '#E2E8F0')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
            >
              Ləğv et
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              style={{
                padding: '9px 20px',
                borderRadius: '10px',
                border: 'none',
                backgroundColor: theme.primary,
                color: '#FFFFFF',
                fontSize: '13px',
                fontWeight: '600',
                cursor: isSubmitting ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: '0 4px 12px rgba(68, 118, 108, 0.3)',
                opacity: isSubmitting ? 0.7 : 1,
                transition: 'all 0.15s'
              }}
              onMouseEnter={(e) => {
                if (!isSubmitting) e.currentTarget.style.backgroundColor = '#38635A';
              }}
              onMouseLeave={(e) => {
                if (!isSubmitting) e.currentTarget.style.backgroundColor = theme.primary;
              }}
            >
              <Save size={16} />
              {isSubmitting ? 'Yadda saxlanılır...' : 'Yadda saxla'}
            </button>
          </div>
        </form>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px) scale(0.97);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
      `}</style>
    </div>
  );
}
"use client";
import React, { useState } from 'react';
import { ShieldCheck, Stethoscope, FileText, Plus, PhoneCall, Calendar, CheckCircle2, Clock, AlertCircle, X, ChevronRight, MessageSquare } from 'lucide-react';

interface ServicesPanelProps {
  isDarkMode?: boolean;
}

export default function ServicesPanel({ isDarkMode = false }: ServicesPanelProps) {
  const theme = {
    cardBg: isDarkMode ? '#1E1E1E' : '#FFFFFF',
    textPrimary: isDarkMode ? '#FFFFFF' : '#0F172A',
    textSecondary: isDarkMode ? '#94A3B8' : '#64748B',
    innerBg: isDarkMode ? '#2A2A2A' : '#F8FAFC',
    borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : '#E2E8F0',
    modalBg: isDarkMode ? '#18181B' : '#FFFFFF',
    inputBg: isDarkMode ? '#27272A' : '#F8FAFC',
    inputBorder: isDarkMode ? '#3F3F46' : '#CBD5E1',
  };

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [requestType, setRequestType] = useState('Həkim Qəbulu');
  const [description, setDescription] = useState('');

  const [activePopup, setActivePopup] = useState<'insurance' | 'lab' | 'emergency' | null>(null);

  const [chatMessage, setChatMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([
    { sender: 'operator', text: 'Salam! Qarabağ Universiteti Tibb Xidməti mərkəzindəyik. Sizə necə kömək edə bilərik?' }
  ]);

  const [requests, setRequests] = useState<any[]>([]);

  React.useEffect(() => {
    const saved = localStorage.getItem('user_health_requests');
    if (saved) {
      try {
        setRequests(JSON.parse(saved));
      } catch (e) {
        console.error('Müraciətlər oxunarkən xəta:', e);
      }
    } else {
      setRequests([
        {
          id: 1,
          title: 'Kardiologiya Müayinəsi üçün Arayış',
          sub: 'Kampus Klinikası • İdman zalına buraxılış üçün',
          status: 'Təsdiqləndi',
          statusColor: '#10B981',
          bgColor: isDarkMode ? 'rgba(16, 185, 129, 0.15)' : '#ECFDF5',
          date: '02 Avqust 2026'
        },
        {
          id: 2,
          title: 'Göz Müayinəsi Növbəsi',
          sub: 'Dr. Aytən Əliyeva • Kampus Tibb Məntəqəsi',
          status: 'Gözləmədə',
          statusColor: '#F59E0B',
          bgColor: isDarkMode ? 'rgba(245, 158, 11, 0.15)' : '#FFFBEB',
          date: '06 Avqust, 14:00'
        }
      ]);
    }
  }, [isDarkMode]);

  const handleCreateRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) return;

    const newReq = {
      id: Date.now(),
      title: `${requestType} Sorğusu`,
      sub: description,
      status: 'Gözləmədə',
      statusColor: '#F59E0B',
      bgColor: isDarkMode ? 'rgba(245, 158, 11, 0.15)' : '#FFFBEB',
      date: 'İndi əlavə edildi'
    };

    const updated = [newReq, ...requests];
    setRequests(updated);
    localStorage.setItem('user_health_requests', JSON.stringify(updated));
    setDescription('');
    setIsModalOpen(false);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatMessage.trim()) return;

    setChatHistory(prev => [...prev, { sender: 'user', text: chatMessage }]);
    const msg = chatMessage;
    setChatMessage('');

    setTimeout(() => {
      setChatHistory(prev => [
        ...prev,
        { sender: 'operator', text: `Müraciətiniz qəbul olundu: "${msg}". Növbətçi tibb işçisi qısa zamanda sizinlə əlaqə saxlayacaq.` }
      ]);
    }, 1000);
  };

  return (
    <div className="em-mobile-panel" style={{ display: 'flex', flexDirection: 'column', gap: '24px', paddingBottom: '40px' }}>

      {/* Header and New Request Button */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 style={{ margin: 0, fontSize: '22px', fontWeight: '800', color: theme.textPrimary, letterSpacing: '-0.5px' }}>
            Sağlamlıq Xidmətləri
          </h2>
          <p style={{ margin: '4px 0 0 0', fontSize: '13.5px', color: theme.textSecondary }}>
            Kampus daxili tibbi xidmətlər, sığorta statusu və həkim qəbullarını rahat idarə edin.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          style={{
            backgroundColor: '#2E5B4E',
            color: '#FFFFFF',
            border: 'none',
            padding: '10px 18px',
            borderRadius: '12px',
            fontSize: '13.5px',
            fontWeight: '600',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: '0 4px 12px rgba(46, 91, 78, 0.2)',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#23473D'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#2E5B4E'}
        >
          <Plus size={18} />
          Yeni Müraciət
        </button>
      </div>

      {/* Essential Service Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))', gap: '20px' }}>

        {/* Student Health Insurance */}
        <div style={{
          backgroundColor: theme.cardBg,
          padding: '20px',
          borderRadius: '16px',
          border: `1px solid ${theme.borderColor}`,
          boxShadow: '0 4px 12px rgba(0,0,0,0.02)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          gap: '16px'
        }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
            <div style={{ backgroundColor: isDarkMode ? 'rgba(16, 185, 129, 0.15)' : '#ECFDF5', padding: '12px', borderRadius: '12px', color: '#10B981' }}>
              <ShieldCheck size={24} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '15px', fontWeight: '700', color: theme.textPrimary }}>Tələbə Tibbi Sığortası</h3>
              <p style={{ margin: '4px 0 0 0', fontSize: '12.5px', color: theme.textSecondary, lineHeight: '1.4' }}>
                İllik icbari və könüllü tibbi sığorta paketinizin aktivliyi.
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '12px', borderTop: `1px solid ${theme.borderColor}` }}>
            <span style={{ backgroundColor: isDarkMode ? 'rgba(21, 128, 61, 0.25)' : '#DCFCE7', color: isDarkMode ? '#4ADE80' : '#15803D', padding: '4px 10px', borderRadius: '20px', fontSize: '11.5px', fontWeight: '700' }}>
              Aktiv Paket
            </span>
            <button
              onClick={() => setActivePopup('insurance')}
              style={{ background: 'none', border: 'none', color: isDarkMode ? '#4ADE80' : '#2E5B4E', fontWeight: '600', fontSize: '12.5px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '2px' }}
            >
              Detallar <ChevronRight size={14} />
            </button>
          </div>
        </div>

        {/* Campus Doctor */}
        <div style={{
          backgroundColor: theme.cardBg,
          padding: '20px',
          borderRadius: '16px',
          border: `1px solid ${theme.borderColor}`,
          boxShadow: '0 4px 12px rgba(0,0,0,0.02)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          gap: '16px'
        }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
            <div style={{ backgroundColor: isDarkMode ? 'rgba(59, 130, 246, 0.15)' : '#EFF6FF', padding: '12px', borderRadius: '12px', color: '#3B82F6' }}>
              <Stethoscope size={24} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '15px', fontWeight: '700', color: theme.textPrimary }}>Kampus Həkimi</h3>
              <p style={{ margin: '4px 0 0 0', fontSize: '12.5px', color: theme.textSecondary, lineHeight: '1.4' }}>
                Universitet tibb məntəqəsindəki həkimlərin növbə qrafiki.
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '12px', borderTop: `1px solid ${theme.borderColor}` }}>
            <span style={{ fontSize: '12px', color: theme.textSecondary }}>Növbəti qəbul: <strong style={{ color: theme.textPrimary }}>Bu gün</strong></span>
            <button
              onClick={() => { setRequestType('Həkim Qəbulu'); setIsModalOpen(true); }}
              style={{ background: 'none', border: 'none', color: isDarkMode ? '#4ADE80' : '#2E5B4E', fontWeight: '600', fontSize: '12.5px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '2px' }}
            >
              Növbə al <ChevronRight size={14} />
            </button>
          </div>
        </div>

        {/* Medical Tests */}
        <div style={{
          backgroundColor: theme.cardBg,
          padding: '20px',
          borderRadius: '16px',
          border: `1px solid ${theme.borderColor}`,
          boxShadow: '0 4px 12px rgba(0,0,0,0.02)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          gap: '16px'
        }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
            <div style={{ backgroundColor: isDarkMode ? 'rgba(239, 68, 68, 0.15)' : '#FEF2F2', padding: '12px', borderRadius: '12px', color: '#EF4444' }}>
              <FileText size={24} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '15px', fontWeight: '700', color: theme.textPrimary }}>Tibbi Analizlər</h3>
              <p style={{ margin: '4px 0 0 0', fontSize: '12.5px', color: theme.textSecondary, lineHeight: '1.4' }}>
                Laboratoriya testlərinin cavabları və check-up tarixçəsi.
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '12px', borderTop: `1px solid ${theme.borderColor}` }}>
            <span style={{ backgroundColor: isDarkMode ? 'rgba(180, 83, 9, 0.25)' : '#FEF3C7', color: isDarkMode ? '#FBBF24' : '#B45309', padding: '4px 10px', borderRadius: '20px', fontSize: '11.5px', fontWeight: '700' }}>
              1 Yeni Cavab
            </span>
            <button
              onClick={() => setActivePopup('lab')}
              style={{ background: 'none', border: 'none', color: isDarkMode ? '#4ADE80' : '#2E5B4E', fontWeight: '600', fontSize: '12.5px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '2px' }}
            >
              Görüntülə <ChevronRight size={14} />
            </button>
          </div>
        </div>

      </div>

      {/* Inquiries and Emergency Support Section */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 320px), 1fr))', gap: '20px' }}>

        {/* Application Status*/}
        <div style={{
          backgroundColor: theme.cardBg,
          padding: '24px',
          borderRadius: '20px',
          border: `1px solid ${theme.borderColor}`,
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.03)',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px'
        }}>
          <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '700', color: theme.textPrimary }}>
            Son Müraciətlərin Statusu
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {requests.map((req) => (
              <div
                key={req.id}
                style={{
                  padding: '16px',
                  borderRadius: '12px',
                  backgroundColor: theme.innerBg,
                  border: `1px solid ${theme.borderColor}`,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: '12px'
                }}
              >
                <div>
                  <h4 style={{ margin: 0, fontSize: '13.5px', fontWeight: '700', color: theme.textPrimary }}>{req.title}</h4>
                  <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: theme.textSecondary }}>{req.sub}</p>
                </div>
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <span style={{
                    backgroundColor: isDarkMode
                      ? (req.status === 'Təsdiqləndi' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(245, 158, 11, 0.2)')
                      : req.bgColor,
                    color: req.statusColor,
                    padding: '4px 10px',
                    borderRadius: '20px',
                    fontSize: '11px',
                    fontWeight: '700',
                    display: 'inline-block',
                    marginBottom: '4px'
                  }}>
                    {req.status}
                  </span>
                  <span style={{ display: 'block', fontSize: '11px', color: theme.textSecondary }}>{req.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 7/24 Emergency Support Banner */}
        <div style={{
          background: isDarkMode
            ? 'linear-gradient(135deg, #132A24 0%, #1E3E35 100%)'
            : 'linear-gradient(135deg, #1E3E35 0%, #2E5B4E 100%)',
          padding: '24px',
          borderRadius: '20px',
          color: '#FFFFFF',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          gap: '20px',
          boxShadow: '0 10px 20px -5px rgba(0, 0, 0, 0.3)',
          border: `1px solid ${theme.borderColor}`
        }}>
          <div>
            <span style={{ backgroundColor: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(4px)', padding: '4px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: '600' }}>
              7/24 TİBBİ DƏSTƏK
            </span>
            <h3 style={{ margin: '12px 0 6px 0', fontSize: '20px', fontWeight: '800' }}>
              Sığorta Köməkçisi & Təcili Xətt
            </h3>
            <p style={{ margin: 0, fontSize: '13px', opacity: 0.9, lineHeight: '1.5' }}>
              Sığorta ilə bağlı suallarınız yarandıqda və ya təcili tibbi məsləhətə ehtiyac olduqda dərhal kampus operatoru ilə əlaqə saxlayın.
            </p>
          </div>

          <button
            onClick={() => setActivePopup('emergency')}
            style={{
              backgroundColor: isDarkMode ? '#2A2A2A' : '#FFFFFF',
              color: isDarkMode ? '#FFFFFF' : '#2E5B4E',
              border: `1px solid ${theme.borderColor}`,
              padding: '12px',
              borderRadius: '12px',
              fontSize: '13.5px',
              fontWeight: '700',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              transition: 'all 0.2s ease'
            }}
          >
            <PhoneCall size={16} /> Zəng Et / Canlı Çat
          </button>
        </div>

      </div>

      {/* New Request Creation Form */}
      {isModalOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.65)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 999,
          padding: '16px'
        }}>
          <div style={{
            backgroundColor: theme.modalBg,
            borderRadius: '20px',
            padding: '24px',
            width: '100%',
            maxWidth: '480px',
            boxShadow: '0 20px 25px -5px rgba(0,0,0,0.3)',
            border: `1px solid ${theme.borderColor}`
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '800', color: theme.textPrimary }}>Yeni Müraciət Yarat</h3>
              <button onClick={() => setIsModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: theme.textSecondary }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateRequest} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '600', color: theme.textSecondary, marginBottom: '6px' }}>
                  Müraciət Növü
                </label>
                <select
                  value={requestType}
                  onChange={(e) => setRequestType(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '10px',
                    border: `1px solid ${theme.inputBorder}`,
                    fontSize: '13.5px',
                    outline: 'none',
                    backgroundColor: theme.inputBg,
                    color: theme.textPrimary
                  }}
                >
                  <option value="Həkim Qəbulu">Həkim Qəbulu (Növbə)</option>
                  <option value="Tibbi Arayış">İdman / Universitet üçün Arayış</option>
                  <option value="Sığorta Sorğusu">Sığorta Təminatı Sorğusu</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '600', color: theme.textSecondary, marginBottom: '6px' }}>
                  Əlavə Qeyd və ya Şikayət
                </label>
                <textarea
                  rows={4}
                  placeholder="Məsələn: Göz müayinəsi üçün həkimə yazılmaq istəyirəm..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '10px',
                    border: `1px solid ${theme.inputBorder}`,
                    fontSize: '13.5px',
                    outline: 'none',
                    resize: 'none',
                    backgroundColor: theme.inputBg,
                    color: theme.textPrimary,
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '8px' }}>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  style={{
                    flex: 1,
                    padding: '12px',
                    borderRadius: '10px',
                    border: `1px solid ${theme.inputBorder}`,
                    backgroundColor: theme.inputBg,
                    color: theme.textPrimary,
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  Ləğv et
                </button>
                <button
                  type="submit"
                  style={{
                    flex: 1,
                    padding: '12px',
                    borderRadius: '10px',
                    border: 'none',
                    backgroundColor: '#2E5B4E',
                    color: '#FFF',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  Təsdiqlə
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Insurance Details */}
      {activePopup === 'insurance' && (
        <div style={popupStyles.overlay}>
          <div style={{ ...popupStyles.box, backgroundColor: theme.modalBg, color: theme.textPrimary, border: `1px solid ${theme.borderColor}` }}>
            <div style={popupStyles.header}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <ShieldCheck size={24} color="#10B981" />
                <h3 style={{ margin: 0, fontSize: '16px' }}>Tələbə Tibbi Sığorta Detalları</h3>
              </div>
              <button onClick={() => setActivePopup(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: theme.textSecondary }}><X size={20} /></button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '13.5px' }}>
              <div style={popupStyles.row}><span>Sığorta Növü:</span> <strong>İcbari və Könüllü Tələbə Paketi</strong></div>
              <div style={popupStyles.row}><span>Polis Nömrəsi:</span> <strong>QU-INS-2026-8942</strong></div>
              <div style={popupStyles.row}><span>Etibarlılıq Müddəti:</span> <strong>01.09.2026 – 30.06.2027</strong></div>
              <div style={popupStyles.row}><span>Əhatə Dairəsi:</span> <strong>Stomatologiya, Təcili Cərrahiyyə, Laboratoriya Testləri</strong></div>
              <div style={popupStyles.row}><span>Tərəfdaş Klinika:</span> <strong>Qarabağ Universiteti Kampus Klinika</strong></div>
            </div>
          </div>
        </div>
      )}

      {/* Medical Test Results */}
      {activePopup === 'lab' && (
        <div style={popupStyles.overlay}>
          <div style={{ ...popupStyles.box, backgroundColor: theme.modalBg, color: theme.textPrimary, border: `1px solid ${theme.borderColor}` }}>
            <div style={popupStyles.header}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <FileText size={24} color="#EF4444" />
                <h3 style={{ margin: 0, fontSize: '16px' }}>Laboratoriya Analiz Nəticələri</h3>
              </div>
              <button onClick={() => setActivePopup(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: theme.textSecondary }}><X size={20} /></button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '13px' }}>
              <p style={{ margin: 0, color: theme.textSecondary }}>Tarix: 04 Avqust 2026 | Status: <span style={{ color: '#10B981', fontWeight: '700' }}>Normal / Təsdiqlənib</span></p>

              <div style={{ border: `1px solid ${theme.borderColor}`, borderRadius: '10px', overflow: 'hidden' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px', borderBottom: `1px solid ${theme.borderColor}`, fontWeight: '700', backgroundColor: theme.innerBg }}>
                  <span>Göstərici</span><span>Nəticə</span><span>Normal Diapazon</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px', borderBottom: `1px solid ${theme.borderColor}` }}>
                  <span>Hemoglobin (HGB)</span><strong>14.2 g/dL</strong><span style={{ color: theme.textSecondary }}>13.0 - 17.0</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px', borderBottom: `1px solid ${theme.borderColor}` }}>
                  <span>Leukositlər (WBC)</span><strong>6.8 k/uL</strong><span style={{ color: theme.textSecondary }}>4.0 - 10.0</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px' }}>
                  <span>Qlükoza (Şəkər)</span><strong>88 mg/dL</strong><span style={{ color: theme.textSecondary }}>70 - 99</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Emergency Line & Live Chat */}
      {activePopup === 'emergency' && (
        <div style={popupStyles.overlay}>
          <div style={{ ...popupStyles.box, backgroundColor: theme.modalBg, color: theme.textPrimary, border: `1px solid ${theme.borderColor}`, maxWidth: '460px' }}>
            <div style={popupStyles.header}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <PhoneCall size={24} color="#EF4444" />
                <h3 style={{ margin: 0, fontSize: '16px' }}>Təcili Tibbi Xətt & Canlı Dəstək</h3>
              </div>
              <button onClick={() => setActivePopup(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: theme.textSecondary }}><X size={20} /></button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <a href="tel:+994555057162" style={{ textDecoration: 'none', backgroundColor: 'rgba(239, 68, 68, 0.15)', color: '#EF4444', padding: '10px', borderRadius: '10px', textAlign: 'center', fontWeight: '700', fontSize: '12.5px' }}>
                  📞 Təcili Yardım
                </a>
              </div>

              <div style={{ border: `1px solid ${theme.borderColor}`, borderRadius: '12px', padding: '10px', height: '160px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px', backgroundColor: theme.innerBg }}>
                {chatHistory.map((msg, idx) => (
                  <div key={idx} style={{
                    alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                    backgroundColor: msg.sender === 'user' ? '#2E5B4E' : theme.borderColor,
                    color: msg.sender === 'user' ? '#FFFFFF' : theme.textPrimary,
                    padding: '8px 12px',
                    borderRadius: '10px',
                    fontSize: '12px',
                    maxWidth: '80%'
                  }}>
                    {msg.text}
                  </div>
                ))}
              </div>

              <form onSubmit={handleSendMessage} style={{ display: 'flex', gap: '8px' }}>
                <input
                  type="text"
                  placeholder="Operatora mesaj yazın..."
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                  style={{
                    flex: 1,
                    padding: '10px 12px',
                    borderRadius: '10px',
                    border: `1px solid ${theme.inputBorder}`,
                    backgroundColor: theme.inputBg,
                    color: theme.textPrimary,
                    fontSize: '13px',
                    outline: 'none'
                  }}
                />
                <button type="submit" style={{ padding: '0 16px', backgroundColor: '#2E5B4E', color: '#FFF', border: 'none', borderRadius: '10px', fontWeight: '600', cursor: 'pointer', fontSize: '13px' }}>Göndər</button>
              </form>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

const popupStyles = {
  overlay: {
    position: 'fixed' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.6)',
    backdropFilter: 'blur(4px)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
    padding: '16px',
  },
  box: {
    width: '100%',
    maxWidth: '420px',
    borderRadius: '18px',
    padding: '22px',
    boxShadow: '0 20px 25px -5px rgba(0,0,0,0.3)',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '16px',
  },
  row: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '8px 0',
    borderBottom: '1px solid rgba(128,128,128,0.15)',
  }
};
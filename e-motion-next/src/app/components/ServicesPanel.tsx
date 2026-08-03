"use client";
import React, { useState } from 'react';
import { ShieldCheck, Stethoscope, FileText, Plus, PhoneCall, Calendar, CheckCircle2, Clock, AlertCircle, X, ChevronRight } from 'lucide-react';

export default function HealthPanel() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [requestType, setRequestType] = useState('Həkim Qəbulu');
  const [description, setDescription] = useState('');

  const [requests, setRequests] = useState([
    {
      id: 1,
      title: 'Kardiologiya Müayinəsi üçün Arayış',
      sub: 'Kampus Klinikası • İdman zalına buraxılış üçün',
      status: 'Təsdiqləndi',
      statusColor: '#10B981',
      bgColor: '#ECFDF5',
      date: '02 Avqust 2026'
    },
    {
      id: 2,
      title: 'Göz Müayinəsi Növbəsi',
      sub: 'Dr. Aytən Əliyeva • Kampus Tibb Məntəqəsi',
      status: 'Gözləmədə',
      statusColor: '#F59E0B',
      bgColor: '#FFFBEB',
      date: '06 Avqust, 14:00'
    }
  ]);

  const handleCreateRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) return;

    const newReq = {
      id: Date.now(),
      title: `${requestType} Sorğusu`,
      sub: description,
      status: 'Gözləmədə',
      statusColor: '#F59E0B',
      bgColor: '#FFFBEB',
      date: 'İndi əlavə edildi'
    };

    setRequests([newReq, ...requests]);
    setDescription('');
    setIsModalOpen(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', paddingBottom: '40px' }}>
      
      {/* 1. Başlıq vı Yeni Müraciət Düyməsi */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 style={{ margin: 0, fontSize: '22px', fontWeight: '800', color: '#0F172A', letterSpacing: '-0.5px' }}>
            Sağlamlıq Xidmətləri
          </h2>
          <p style={{ margin: '4px 0 0 0', fontSize: '13.5px', color: '#64748B' }}>
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

      {/* 2. Əsas Xidmət Kartları (Sığorta, Həkim, Analizlər) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
        
        {/* Tələbə Tibbi Sığortası */}
        <div style={{
          backgroundColor: '#FFFFFF',
          padding: '20px',
          borderRadius: '16px',
          border: '1px solid #E2E8F0',
          boxShadow: '0 4px 12px rgba(0,0,0,0.02)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          gap: '16px'
        }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
            <div style={{ backgroundColor: '#ECFDF5', padding: '12px', borderRadius: '12px', color: '#10B981' }}>
              <ShieldCheck size={24} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '15px', fontWeight: '700', color: '#0F172A' }}>Tələbə Tibbi Sığortası</h3>
              <p style={{ margin: '4px 0 0 0', fontSize: '12.5px', color: '#64748B', lineHeight: '1.4' }}>
                İllik icbari və könüllü tibbi sığorta paketinizin aktivliyi.
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '12px', borderTop: '1px solid #F1F5F9' }}>
            <span style={{ backgroundColor: '#DCFCE7', color: '#15803D', padding: '4px 10px', borderRadius: '20px', fontSize: '11.5px', fontWeight: '700' }}>
              Aktiv Paket
            </span>
            <button style={{ background: 'none', border: 'none', color: '#2E5B4E', fontWeight: '600', fontSize: '12.5px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '2px' }}>
              Detallar <ChevronRight size={14} />
            </button>
          </div>
        </div>

        {/* Kampus Həkimi */}
        <div style={{
          backgroundColor: '#FFFFFF',
          padding: '20px',
          borderRadius: '16px',
          border: '1px solid #E2E8F0',
          boxShadow: '0 4px 12px rgba(0,0,0,0.02)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          gap: '16px'
        }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
            <div style={{ backgroundColor: '#EFF6FF', padding: '12px', borderRadius: '12px', color: '#3B82F6' }}>
              <Stethoscope size={24} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '15px', fontWeight: '700', color: '#0F172A' }}>Kampus Həkimi</h3>
              <p style={{ margin: '4px 0 0 0', fontSize: '12.5px', color: '#64748B', lineHeight: '1.4' }}>
                Universitet tibb məntəqəsindəki həkimlərin növbə qrafiki.
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '12px', borderTop: '1px solid #F1F5F9' }}>
            <span style={{ fontSize: '12px', color: '#64748B' }}>Növbəti qəbul: <strong style={{ color: '#0F172A' }}>Bu gün</strong></span>
            <button 
              onClick={() => setIsModalOpen(true)}
              style={{ background: 'none', border: 'none', color: '#2E5B4E', fontWeight: '600', fontSize: '12.5px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '2px' }}
            >
              Növbə al <ChevronRight size={14} />
            </button>
          </div>
        </div>

        {/* Tibbi Analizlər */}
        <div style={{
          backgroundColor: '#FFFFFF',
          padding: '20px',
          borderRadius: '16px',
          border: '1px solid #E2E8F0',
          boxShadow: '0 4px 12px rgba(0,0,0,0.02)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          gap: '16px'
        }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
            <div style={{ backgroundColor: '#FEF2F2', padding: '12px', borderRadius: '12px', color: '#EF4444' }}>
              <FileText size={24} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '15px', fontWeight: '700', color: '#0F172A' }}>Tibbi Analizlər</h3>
              <p style={{ margin: '4px 0 0 0', fontSize: '12.5px', color: '#64748B', lineHeight: '1.4' }}>
                Laboratoriya testlərinin cavabları və check-up tarixçəsi.
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '12px', borderTop: '1px solid #F1F5F9' }}>
            <span style={{ backgroundColor: '#FEF3C7', color: '#B45309', padding: '4px 10px', borderRadius: '20px', fontSize: '11.5px', fontWeight: '700' }}>
              1 Yeni Cavab
            </span>
            <button style={{ background: 'none', border: 'none', color: '#2E5B4E', fontWeight: '600', fontSize: '12.5px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '2px' }}>
              Görüntülə <ChevronRight size={14} />
            </button>
          </div>
        </div>

      </div>

      {/* 3. Müraciətlər və Təcili Dəstək Bölməsi */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
        
        {/* Müraciətlərin Statusu */}
        <div style={{
          backgroundColor: '#FFFFFF',
          padding: '24px',
          borderRadius: '20px',
          border: '1px solid #E2E8F0',
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.03)',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px'
        }}>
          <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '700', color: '#0F172A' }}>
            Son Müraciətlərin Statusu
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {requests.map((req) => (
              <div
                key={req.id}
                style={{
                  padding: '16px',
                  borderRadius: '12px',
                  backgroundColor: '#F8FAFC',
                  border: '1px solid #F1F5F9',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: '12px'
                }}
              >
                <div>
                  <h4 style={{ margin: 0, fontSize: '13.5px', fontWeight: '700', color: '#1E293B' }}>{req.title}</h4>
                  <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: '#64748B' }}>{req.sub}</p>
                </div>
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <span style={{
                    backgroundColor: req.bgColor,
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
                  <span style={{ display: 'block', fontSize: '11px', color: '#94A3B8' }}>{req.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 7/24 Təcili Dəstək Banneri */}
        <div style={{
          background: 'linear-gradient(135deg, #1E3E35 0%, #2E5B4E 100%)',
          padding: '24px',
          borderRadius: '20px',
          color: '#FFFFFF',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          gap: '20px',
          boxShadow: '0 10px 20px -5px rgba(46, 91, 78, 0.3)'
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

          <button style={{
            backgroundColor: '#FFFFFF',
            color: '#2E5B4E',
            border: 'none',
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
          }}>
            <PhoneCall size={16} /> Zəng Et / Canlı Çat
          </button>
        </div>

      </div>

      {/* 4. MODAL: Yeni Müraciət Yaratma Formu */}
      {isModalOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.5)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 999,
          padding: '16px'
        }}>
          <div style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '20px',
            padding: '24px',
            width: '100%',
            maxWidth: '480px',
            boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '800', color: '#0F172A' }}>Yeni Müraciət Yarat</h3>
              <button onClick={() => setIsModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748B' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateRequest} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '600', color: '#475569', marginBottom: '6px' }}>
                  Müraciət Növü
                </label>
                <select
                  value={requestType}
                  onChange={(e) => setRequestType(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '10px',
                    border: '1px solid #CBD5E1',
                    fontSize: '13.5px',
                    outline: 'none',
                    backgroundColor: '#F8FAFC'
                  }}
                >
                  <option value="Həkim Qəbulu">Həkim Qəbulu (Növbə)</option>
                  <option value="Tibbi Arayış">İdman / Universitet üçün Arayış</option>
                  <option value="Sığorta Sorğusu">Sığorta Təminatı Sorğusu</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '600', color: '#475569', marginBottom: '6px' }}>
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
                    border: '1px solid #CBD5E1',
                    fontSize: '13.5px',
                    outline: 'none',
                    resize: 'none',
                    backgroundColor: '#F8FAFC',
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
                    border: '1px solid #CBD5E1',
                    backgroundColor: '#FFF',
                    color: '#475569',
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

    </div>
  );
}
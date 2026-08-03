import React from 'react';
import { ShieldPlus, Stethoscope, Heart, Activity, Plus, ChevronRight } from 'lucide-react';

export default function ServicesPanel() {
  return (
    <div className="services-container" style={{ display: 'flex', flexDirection: 'column', gap: '24px', width: '100%', textAlign: 'left' }}>
      
      {/* Üst Başlıq və Düymə */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ margin: 0, fontSize: '22px', fontWeight: '700', color: '#1E293B' }}>Sağlamlıq Xidmətləri</h2>
          <p style={{ margin: '4px 0 0 0', fontSize: '14px', color: '#64748B' }}>Kampus daxili tibbi xidmətlər, sığorta və həkim qəbullarını idarə edin.</p>
        </div>
        <button style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#44766C', color: '#FFFFFF', border: 'none', padding: '10px 16px', borderRadius: '8px', fontWeight: '600', fontSize: '14px', cursor: 'pointer' }}>
          <Plus size={18} />
          Yeni Müraciət
        </button>
      </div>

      {/* Əsas Xidmət Kartları */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px' }}>
        
        {/* Tələbə Sığortası */}
        <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '14px', justifyContent: 'space-between' }}>
          <div>
            <div style={{ backgroundColor: '#E6F4F1', padding: '12px', borderRadius: '10px', color: '#44766C', width: 'fit-content', marginBottom: '16px' }}>
              <ShieldPlus size={24} />
            </div>
            <h3 style={{ margin: '0 0 6px 0', fontSize: '16px', fontWeight: '700', color: '#1E293B' }}>Tələbə Tibbi Sığortası</h3>
            <p style={{ margin: 0, fontSize: '13px', color: '#64748B', lineHeight: '1.5' }}>İllik icbari və könüllü tibbi sığorta paketinizin statusu və əhatə dairəsi.</p>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px', borderTop: '1px solid #F1F5F9', paddingTop: '12px' }}>
            <span style={{ fontSize: '12px', color: '#16A34A', fontWeight: '600', backgroundColor: '#DCFCE7', padding: '4px 8px', borderRadius: '6px' }}>Aktivdir</span>
            <span style={{ fontSize: '13px', color: '#44766C', fontWeight: '600', display: 'flex', alignItems: 'center', cursor: 'pointer' }}>Detallar <ChevronRight size={16} /></span>
          </div>
        </div>

        {/* Həkim Qəbulu */}
        <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '14px', justifyContent: 'space-between' }}>
          <div>
            <div style={{ backgroundColor: '#E0F2FE', padding: '12px', borderRadius: '10px', color: '#0284C7', width: 'fit-content', marginBottom: '16px' }}>
              <Stethoscope size={24} />
            </div>
            <h3 style={{ margin: '0 0 6px 0', fontSize: '16px', fontWeight: '700', color: '#1E293B' }}>Kampus Həkimi</h3>
            <p style={{ margin: 0, fontSize: '13px', color: '#64748B', lineHeight: '1.5' }}>Universitet tibb məntəqəsindəki həkimlərin növbə qrafiki və onlayn növbə götürmə.</p>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px', borderTop: '1px solid #F1F5F9', paddingTop: '12px' }}>
            <span style={{ fontSize: '12px', color: '#64748B', fontWeight: '500' }}>Növbəti qəbul: Yoxdur</span>
            <span style={{ fontSize: '13px', color: '#0284C7', fontWeight: '600', display: 'flex', alignItems: 'center', cursor: 'pointer' }}>Növbə al <ChevronRight size={16} /></span>
          </div>
        </div>

        {/* Analiz Nəticələri */}
        <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '14px', justifyContent: 'space-between' }}>
          <div>
            <div style={{ backgroundColor: '#FEF2F2', padding: '12px', borderRadius: '10px', color: '#EF4444', width: 'fit-content', marginBottom: '16px' }}>
              <Activity size={24} />
            </div>
            <h3 style={{ margin: '0 0 6px 0', fontSize: '16px', fontWeight: '700', color: '#1E293B' }}>Tibbi Analizlər</h3>
            <p style={{ margin: 0, fontSize: '13px', color: '#64748B', lineHeight: '1.5' }}>Son laboratoriya testlərinizin cavabları, qan qrupu və ümumi check-up tarixçəsi.</p>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px', borderTop: '1px solid #F1F5F9', paddingTop: '12px' }}>
            <span style={{ fontSize: '12px', color: '#EA580C', fontWeight: '600', backgroundColor: '#FFEDD5', padding: '4px 8px', borderRadius: '6px' }}>1 Yeni Cavab</span>
            <span style={{ fontSize: '13px', color: '#EF4444', fontWeight: '600', display: 'flex', alignItems: 'center', cursor: 'pointer' }}>Görüntülə <ChevronRight size={16} /></span>
          </div>
        </div>

      </div>

      {/* Aktiv Müraciətlər və Bildiriş Paneli */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px' }}>
        
        {/* Sol: Son Tibbi Müraciətlər */}
        <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '24px' }}>
          <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: '700', color: '#1E293B' }}>Son Müraciətlərin Statusu</h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px', border: '1px solid #F1F5F9', backgroundColor: '#F8FAFC', borderRadius: '8px' }}>
              <div>
                <h4 style={{ margin: 0, fontSize: '14px', fontWeight: '600', color: '#1E293B' }}>Kardiologiya Müayinəsi üçün Arayış</h4>
                <p style={{ margin: 0, fontSize: '12px', color: '#64748B' }}>Kampus Klinikası • İdman zalına buraxılış üçün • Təqdim edilib</p>
              </div>
              <span style={{ fontSize: '12px', padding: '4px 8px', borderRadius: '6px', backgroundColor: '#DCFCE7', color: '#15803D', fontWeight: '600' }}>Təsdiqləndi</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px', border: '1px solid #F1F5F9', backgroundColor: '#F8FAFC', borderRadius: '8px' }}>
              <div>
                <h4 style={{ margin: 0, fontSize: '14px', fontWeight: '600', color: '#1E293B' }}>Göz Müayinəsi Növbəsi</h4>
                <p style={{ margin: 0, fontSize: '12px', color: '#64748B' }}>Dr. Aytən Əliyeva • 06 Avqust, 14:00</p>
              </div>
              <span style={{ fontSize: '12px', padding: '4px 8px', borderRadius: '6px', backgroundColor: '#FEF3C7', color: '#D97706', fontWeight: '600' }}>Gözləmədə</span>
            </div>
          </div>
        </div>

        {/* Sağ: Sığorta Dəstək Mərkəzi */}
        <div style={{ backgroundColor: '#44766C', borderRadius: '12px', padding: '20px', color: '#FFFFFF', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <span style={{ fontSize: '11px', textTransform: 'uppercase', fontWeight: '700', letterSpacing: '0.5px', opacity: 0.9 }}>7/24 Tibbi Dəstək</span>
            <h4 style={{ margin: '4px 0 8px 0', fontSize: '16px', fontWeight: '600' }}>Sığorta Köməkçisi</h4>
            <p style={{ margin: '0 0 16px 0', fontSize: '12.5px', opacity: 0.85, lineHeight: '1.4' }}>Sığorta ilə bağlı hər hansı sualınız yarandıqda dərhal kampus operatoru ilə əlaqə saxlayın.</p>
          </div>
          <button style={{ width: '100%', backgroundColor: '#FFFFFF', color: '#44766C', border: 'none', padding: '10px 12px', borderRadius: '6px', fontWeight: '600', fontSize: '13px', cursor: 'pointer', transition: 'background-color 0.2s' }}>
            Zəng Et / Çat Aç
          </button>
        </div>

      </div>

    </div>
  );
}
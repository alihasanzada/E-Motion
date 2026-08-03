import React from 'react';
import { CheckCircle, Award, Target, Flame } from 'lucide-react';

export default function ProgressPanel() {
  return (
    <div className="progress-container" style={{ display: 'flex', flexDirection: 'column', gap: '24px', width: '100%', textAlign: 'left' }}>
      <div>
        <h2 style={{ margin: 0, fontSize: '22px', fontWeight: '700', color: '#1E293B' }}>Mənim İrəliləyişim</h2>
        <p style={{ margin: '4px 0 0 0', fontSize: '14px', color: '#64748B' }}>Şəxsi inkişaf hədəfləriniz, qazandığınız uğurlar və vərdiş zənciriniz.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' }}>
        <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ backgroundColor: '#F0FDF4', padding: '12px', borderRadius: '10px', color: '#16A34A' }}>
            <Flame size={24} />
          </div>
          <div>
            <p style={{ margin: 0, fontSize: '13px', color: '#64748B', fontWeight: '500' }}>Vərdiş Zənciri</p>
            <h3 style={{ margin: '4px 0 0 0', fontSize: '20px', fontWeight: '700', color: '#1E293B' }}>5 Gün Ardıcıl</h3>
          </div>
        </div>

        <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ backgroundColor: '#FEF3C7', padding: '12px', borderRadius: '10px', color: '#D97706' }}>
            <Award size={24} />
          </div>
          <div>
            <p style={{ margin: 0, fontSize: '13px', color: '#64748B', fontWeight: '500' }}>Qazanılan Nişanlar</p>
            <h3 style={{ margin: '4px 0 0 0', fontSize: '20px', fontWeight: '700', color: '#1E293B' }}>4 Nişan</h3>
          </div>
        </div>
      </div>

      <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '24px' }}>
        <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: '700', color: '#1E293B' }}>Tamamlanan Hədəflər Tarixçəsi</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', borderBottom: '1px solid #F1F5F9' }}>
            <CheckCircle size={20} style={{ color: '#16A34A' }} />
            <div>
              <h4 style={{ margin: 0, fontSize: '14px', fontWeight: '600', color: '#1E293B' }}>Həftəlik Hidratasiya Hədəfi Tamamlandı</h4>
              <p style={{ margin: 0, fontSize: '12px', color: '#64748B' }}>7 gün ardıcıl olaraq su balansı qorundu.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
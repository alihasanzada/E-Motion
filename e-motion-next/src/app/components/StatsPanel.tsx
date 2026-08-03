import React from 'react';
import { BarChart3, PieChart, Activity, TrendingUp } from 'lucide-react';

export default function StatsPanel() {
  return (
    <div className="stats-container" style={{ display: 'flex', flexDirection: 'column', gap: '24px', width: '100%', textAlign: 'left' }}>
      <div>
        <h2 style={{ margin: 0, fontSize: '22px', fontWeight: '700', color: '#1E293B' }}>Statistika və Analitika</h2>
        <p style={{ margin: '4px 0 0 0', fontSize: '14px', color: '#64748B' }}>Sağlamlıq göstəricilərinizin həftəlik və aylıq geniş analitik hesabatı.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' }}>
        <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ backgroundColor: '#E6F4F1', padding: '12px', borderRadius: '10px', color: '#44766C' }}>
            <BarChart3 size={24} />
          </div>
          <div>
            <p style={{ margin: 0, fontSize: '13px', color: '#64748B', fontWeight: '500' }}>Ümumi Aktivlik</p>
            <h3 style={{ margin: '4px 0 0 0', fontSize: '20px', fontWeight: '700', color: '#1E293B' }}>+12% Artış</h3>
          </div>
        </div>
      </div>

      <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '30px', textAlign: 'center', color: '#64748B' }}>
        <Activity size={40} style={{ color: '#44766C', marginBottom: '12px' }} />
        <h4 style={{ margin: '0 0 6px 0', fontSize: '15px', fontWeight: '600', color: '#1E293B' }}>Geniş qrafiklər tezliklə aktivləşəcək</h4>
        <p style={{ margin: 0, fontSize: '13px' }}>Next.js verilənlər bazası inteqrasiyası ilə real-time qrafiklər bura qoşulacaq.</p>
      </div>
    </div>
  );
}
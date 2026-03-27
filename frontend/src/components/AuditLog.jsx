import React, { useState } from 'react';
import GlassCard from './common/GlassCard';
import { 
  Search, 
  Download, 
  Filter, 
  TrendingUp, 
  AlertCircle, 
  Activity, 
  User, 
  ShieldCheck, 
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  MoreVertical
} from 'lucide-react';

const AuditLog = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const stats = [
    { label: 'Security Events (24h)', value: '1,284', trend: '+12%', color: 'var(--primary-accent)' },
    { label: 'Critical Alerts', value: '0', trend: 'Stable', color: '#ffb4a4' },
    { label: 'Active Sessions', value: '42', trend: '+5', color: '#adc9eb' },
  ];

  const logs = [
    { user: 'Adrian Kessler', email: 'adrian@curator.ai', action: 'Deployment Triggered', resource: 'model_v4_prod', level: 'Info', ip: '192.168.1.104', time: '14:32:01 UTC', date: 'Oct 24, 2024' },
    { user: 'Sarah Mitchell', email: 's.mitchell@curator.ai', action: 'API Key Rotated', resource: 'global_auth_v1', level: 'Warning', ip: '10.0.4.192', time: '12:15:44 UTC', date: 'Oct 24, 2024' },
    { user: 'Marcus Thorne', email: 'm.thorne@system.internal', action: 'Unauthorized Access Attempt', resource: 'root_access', level: 'Critical', ip: '45.12.98.01', time: '09:02:11 UTC', date: 'Oct 24, 2024' },
    { user: 'Daniel Benes', email: 'd.benes@curator.ai', action: 'Data Subset Exported', resource: 'customer_churn_db', level: 'Info', ip: '192.168.1.15', time: '18:44:09 UTC', date: 'Oct 23, 2024' },
  ];

  const getLevelStyle = (level) => {
    switch (level) {
        case 'Critical': return { color: '#ffb4a4', bg: 'rgba(255, 180, 164, 0.1)', border: 'rgba(255, 180, 164, 0.2)' };
        case 'Warning': return { color: 'var(--primary-accent)', bg: 'rgba(0, 210, 255, 0.1)', border: 'rgba(0, 210, 255, 0.2)' };
        default: return { color: '#67d9c9', bg: 'rgba(103, 217, 201, 0.1)', border: 'rgba(103, 217, 201, 0.2)' };
    }
  };

  return (
    <div className="audit-log-view" style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
      {/* Header */}
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <h2 style={{ fontSize: '2.5rem', fontWeight: 800, color: 'white', marginBottom: '0.5rem', letterSpacing: '-0.02em' }}>Audit Log</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', maxWidth: '600px' }}>Security history and granular user activity monitoring for the ML infrastructure.</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
            <button className="btn-primary" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--glass-border)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Download size={18} /> Export CSV
            </button>
            <button className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Filter size={18} /> Advanced Filter
            </button>
        </div>
      </header>

      {/* Quick Stats Bento */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr', gap: '1.5rem' }}>
        {stats.map((s, i) => (
            <div key={i} style={{ background: 'rgba(255,255,255,0.02)', padding: '2rem', borderRadius: '24px', border: '1px solid var(--glass-border)', position: 'relative', overflow: 'hidden' }}>
                <span style={{ fontSize: '0.65rem', fontWeight: 800, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{s.label}</span>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '1rem', marginTop: '1.5rem' }}>
                    <span style={{ fontSize: '2.5rem', fontWeight: 800, color: s.label.includes('Critical') && s.value !== '0' ? '#ffb4a4' : 'white' }}>{s.value}</span>
                    <span style={{ fontSize: '0.8rem', fontWeight: 700, color: s.trend.includes('+') ? '#67d9c9' : 'var(--text-secondary)' }}>
                        {s.trend.includes('+') && <TrendingUp size={12} style={{ marginRight: '4px' }} />}
                        {s.trend}
                    </span>
                </div>
                {/* Visual context */}
                {i === 0 && <div style={{ position: 'absolute', bottom: 0, right: 0, width: '120px', height: '60px', opacity: 0.1 }}>
                    <svg viewBox="0 0 100 40" style={{ width: '100%', height: '100%' }}>
                        <path d="M0 40 Q 25 35 50 20 T 100 0" fill="none" stroke="var(--primary-accent)" strokeWidth="3" />
                    </svg>
                </div>}
            </div>
        ))}
      </div>

      {/* Table Section */}
      <div style={{ background: 'rgba(255,255,255,0.02)', borderRadius: '24px', border: '1px solid var(--glass-border)', overflow: 'hidden' }}>
        {/* Table Controls */}
        <div style={{ padding: '1.5rem 2rem', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.01)' }}>
            <div style={{ display: 'flex', gap: '1rem' }}>
                <button style={{ padding: '0.5rem 1.25rem', borderRadius: '100px', background: 'var(--primary-accent)', color: 'black', fontWeight: 800, fontSize: '0.75rem', border: 'none' }}>All Logs</button>
                <button style={{ padding: '0.5rem 1.25rem', borderRadius: '100px', background: 'transparent', color: 'var(--text-secondary)', fontWeight: 700, fontSize: '0.75rem', border: 'none' }}>Authentication</button>
                <button style={{ padding: '0.5rem 1.25rem', borderRadius: '100px', background: 'transparent', color: 'var(--text-secondary)', fontWeight: 700, fontSize: '0.75rem', border: 'none' }}>Model Deployments</button>
            </div>
            <div style={{ position: 'relative' }}>
                <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                <input 
                    type="text" 
                    placeholder="Search logs..." 
                    style={{ padding: '0.6rem 1rem 0.6rem 2.5rem', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--glass-border)', borderRadius: '12px', color: 'white', fontSize: '0.85rem', width: '240px' }}
                />
            </div>
        </div>

        {/* The Table */}
        <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                    <tr style={{ color: 'var(--text-secondary)', fontSize: '0.65rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                        <th style={{ padding: '1.25rem 2rem' }}>User</th>
                        <th style={{ padding: '1.25rem 1.5rem' }}>Action</th>
                        <th style={{ padding: '1.25rem 1.5rem' }}>Resource</th>
                        <th style={{ padding: '1.25rem 1.5rem' }}>Level</th>
                        <th style={{ padding: '1.25rem 1.5rem' }}>IP Address</th>
                        <th style={{ padding: '1.25rem 2rem', textAlign: 'right' }}>Timestamp</th>
                    </tr>
                </thead>
                <tbody style={{ fontSize: '0.85rem' }}>
                    {logs.map((log, idx) => {
                        const style = getLevelStyle(log.level);
                        return (
                            <tr key={idx} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', transition: 'background 0.2s' }} className="hover:bg-white/5">
                                <td style={{ padding: '1.5rem 2rem' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                        <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, color: 'var(--primary-accent)', fontSize: '0.7rem' }}>
                                            {log.user.split(' ').map(n => n[0]).join('')}
                                        </div>
                                        <div>
                                            <div style={{ fontWeight: 700, color: 'white' }}>{log.user}</div>
                                            <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>{log.email}</div>
                                        </div>
                                    </div>
                                </td>
                                <td style={{ padding: '1.5rem 1.5rem', color: 'white', fontWeight: 500 }}>{log.action}</td>
                                <td style={{ padding: '1.5rem 1.5rem' }}>
                                    <span style={{ padding: '0.25rem 0.5rem', borderRadius: '4px', background: 'rgba(255,255,255,0.05)', color: '#adc9eb', fontSize: '0.7rem', fontWeight: 800 }}>{log.resource}</span>
                                </td>
                                <td style={{ padding: '1.5rem 1.5rem' }}>
                                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.3rem 0.8rem', borderRadius: '100px', background: style.bg, color: style.color, border: `1px solid ${style.border}`, fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase' }}>
                                        {log.level === 'Critical' ? <AlertTriangle size={12} /> : log.level === 'Warning' ? <AlertCircle size={12} /> : <CheckCircle size={12} />}
                                        {log.level}
                                    </div>
                                </td>
                                <td style={{ padding: '1.5rem 1.5rem', fontFamily: 'monospace', color: 'var(--text-secondary)' }}>{log.ip}</td>
                                <td style={{ padding: '1.5rem 2rem', textAlign: 'right' }}>
                                    <div style={{ color: 'white', fontWeight: 500 }}>{log.date}</div>
                                    <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>{log.time}</div>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>

        {/* Pagination */}
        <div style={{ padding: '1.5rem 2rem', borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Showing 1 to 4 of 24,892 results</span>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button style={{ width: '32px', height: '32px', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'transparent', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><ChevronLeft size={16}/></button>
                <button style={{ width: '32px', height: '32px', borderRadius: '8px', border: 'none', background: 'var(--primary-accent)', color: 'black', fontWeight: 800, fontSize: '0.75rem' }}>1</button>
                <button style={{ width: '32px', height: '32px', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'transparent', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><ChevronRight size={16}/></button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default AuditLog;

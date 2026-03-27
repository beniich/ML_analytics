import React, { useState } from 'react';
import GlassCard from './common/GlassCard';
import { 
  ShieldCheck, 
  Smartphone, 
  Mail, 
  Globe, 
  Laptop, 
  Smartphone as Phone, 
  LogOut, 
  Plus, 
  Edit2, 
  Trash2, 
  CheckCircle,
  AlertTriangle,
  History,
  Lock
} from 'lucide-react';

const AdvancedSecurity = () => {
  const [mfaEnabled, setMfaEnabled] = useState(false);
  
  const sessions = [
    { device: 'MacBook Pro - Chrome', os: 'macOS 14.2.1', loc: 'San Francisco, US', last: 'Current Session', status: 'Online', icon: <Laptop size={20} />, current: true },
    { device: 'iPhone 15 Pro - Safari', os: 'iOS 17.1', loc: 'London, UK', last: '14 hours ago', status: 'Inactive', icon: <Phone size={20} />, current: false },
  ];

  const whitelistedIPs = [
    { ip: '192.168.1.1', label: 'Office Network (Primary)' },
    { ip: '10.0.0.45', label: 'VPN Gateway' },
  ];

  return (
    <div className="advanced-security-view" style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
      {/* Header */}
      <header>
        <h2 style={{ fontSize: '2.8rem', fontWeight: 800, color: 'white', marginBottom: '0.75rem', letterSpacing: '-0.02em' }}>Advanced Security</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', maxWidth: '800px', lineHeight: 1.6 }}>
          Refine your administrative perimeter. Manage multi-factor authentication, active session states, and enterprise IP whitelisting protocols.
        </p>
      </header>

      {/* Top Bento Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '1.5rem' }}>
        
        {/* MFA MFA */}
        <div style={{ background: 'rgba(255,255,255,0.02)', padding: '2.5rem', borderRadius: '32px', border: '1px solid var(--glass-border)', position: 'relative', overflow: 'hidden' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2.5rem' }}>
                <div>
                   <h3 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'white', marginBottom: '0.5rem' }}>Multi-factor Authentication</h3>
                   <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Add an extra layer of security to your curator account.</p>
                </div>
                <ShieldCheck size={36} color="var(--primary-accent)" />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.25rem', background: 'rgba(255,255,255,0.03)', borderRadius: '16px', border: '1px solid var(--glass-border)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'rgba(0, 210, 255, 0.1)', color: 'var(--primary-accent)', display: 'flex', alignItems: 'center', justifyCenter: 'center' }}>
                           <Smartphone size={24} style={{ margin: 'auto' }} />
                        </div>
                        <div>
                            <span style={{ display: 'block', fontWeight: 700, color: 'white' }}>Authenticator App</span>
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Recommended for maximum security</span>
                        </div>
                    </div>
                    <button className="btn-primary" style={{ padding: '0.6rem 1.5rem' }}>Enable</button>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.25rem', background: 'rgba(255,255,255,0.01)', borderRadius: '16px', border: '1px solid var(--glass-border)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'rgba(173, 201, 235, 0.1)', color: '#adc9eb', display: 'flex', alignItems: 'center', justifyCenter: 'center' }}>
                           <Mail size={24} style={{ margin: 'auto' }} />
                        </div>
                        <div>
                            <span style={{ display: 'block', fontWeight: 700, color: 'white' }}>Email Verification</span>
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>adm***@enterprise.com</span>
                        </div>
                    </div>
                    <span style={{ fontSize: '0.65rem', fontWeight: 800, color: '#67d9c9', textTransform: 'uppercase', background: 'rgba(103, 217, 201, 0.1)', padding: '4px 12px', borderRadius: '100px' }}>Active</span>
                </div>
            </div>
            {/* Decoration */}
            <div style={{ position: 'absolute', right: '-40px', bottom: '-40px', width: '200px', height: '200px', background: 'rgba(0, 210, 255, 0.03)', borderRadius: '50%', filter: 'blur(40px)' }}></div>
        </div>

        {/* IP Control */}
        <div style={{ background: 'rgba(255,255,255,0.02)', padding: '2.5rem', borderRadius: '32px', border: '1px solid var(--glass-border)', display: 'flex', flexDirection: 'column' }}>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'white', marginBottom: '2.5rem' }}>IP Access Control</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.75rem' }}>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Whitelisted IPs</span>
                    <span style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--primary-accent)' }}>12</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.75rem' }}>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Blocked Attempts (24h)</span>
                    <span style={{ fontSize: '1.8rem', fontWeight: 800, color: '#ffb4a4' }}>142</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.75rem' }}>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Last Access</span>
                    <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'white' }}>2m ago, London, UK</span>
                </div>
            </div>
            <button className="btn-primary" style={{ marginTop: '2.5rem', width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--glass-border)' }}>Manage Whitelist</button>
        </div>
      </div>

      {/* Session Management Area */}
      <GlassCard title="Active Session Management">
         <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                    <tr style={{ color: 'var(--text-secondary)', fontSize: '0.65rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', background: 'rgba(255,255,255,0.02)' }}>
                        <th style={{ padding: '1.25rem 2rem' }}>Device / Browser</th>
                        <th style={{ padding: '1.25rem 2rem' }}>Location</th>
                        <th style={{ padding: '1.25rem 2rem' }}>Last Activity</th>
                        <th style={{ padding: '1.25rem 2rem' }}>Status</th>
                        <th style={{ padding: '1.25rem 2rem', textAlign: 'right' }}>Action</th>
                    </tr>
                </thead>
                <tbody style={{ fontSize: '0.9rem' }}>
                    {sessions.map((s, idx) => (
                        <tr key={idx} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', transition: 'background 0.2s' }}>
                            <td style={{ padding: '1.5rem 2rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                    <div style={{ color: s.current ? '#adc9eb' : 'var(--text-secondary)' }}>{s.icon}</div>
                                    <div>
                                        <div style={{ fontWeight: 700, color: 'white' }}>{s.device}</div>
                                        <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>{s.os}</div>
                                    </div>
                                </div>
                            </td>
                            <td style={{ padding: '1.5rem 2rem', color: 'var(--text-secondary)' }}>{s.loc}</td>
                            <td style={{ padding: '1.5rem 2rem', color: 'var(--text-secondary)' }}>{s.last}</td>
                            <td style={{ padding: '1.5rem 2rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: s.status === 'Online' ? '#67d9c9' : 'rgba(255,255,255,0.1)' }}></div>
                                    <span style={{ fontSize: '0.8rem', color: s.status === 'Online' ? 'white' : 'var(--text-secondary)' }}>{s.status}</span>
                                </div>
                            </td>
                            <td style={{ padding: '1.5rem 2rem', textAlign: 'right' }}>
                                {s.current ? (
                                    <span style={{ fontSize: '0.75rem', fontStyle: 'italic', color: 'var(--text-secondary)' }}>This Device</span>
                                ) : (
                                    <button style={{ color: '#ffb4a4', border: 'none', background: 'transparent', fontWeight: 800, cursor: 'pointer', fontSize: '0.75rem', textTransform: 'uppercase' }}>Revoke</button>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
         </div>
      </GlassCard>

      {/* Footer Bottom Section */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.8fr 1fr', gap: '1.5fr' }}>
          {/* IP List Section */}
          <div style={{ background: 'rgba(255,255,255,0.02)', padding: '2.5rem', borderRadius: '32px', border: '1px solid var(--glass-border)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
                  <h4 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'white' }}>IP Whitelisting</h4>
                  <button style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary-accent)', background: 'transparent', border: 'none', fontWeight: 800, cursor: 'pointer' }}>
                      <Plus size={18} /> Add Range
                  </button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {whitelistedIPs.map((w, idx) => (
                      <div key={idx} style={{ padding: '1.25rem', borderRadius: '16px', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                         <div>
                            <span style={{ display: 'block', fontFamily: 'monospace', color: '#adc9eb', fontSize: '1rem' }}>{w.ip}</span>
                            <span style={{ fontSize: '0.65rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{w.label}</span>
                         </div>
                         <div style={{ display: 'flex', gap: '1rem', color: 'var(--text-secondary)' }}>
                            <Edit2 size={16} style={{ cursor: 'pointer' }} />
                            <Trash2 size={16} style={{ cursor: 'pointer', color: '#ffb4a4' }} />
                         </div>
                      </div>
                  ))}
              </div>
          </div>

          {/* Security Score Widget */}
          <div style={{ 
              background: 'linear-gradient(135deg, rgba(0, 210, 255, 0.05) 0%, transparent 100%)', 
              padding: '2.5rem', 
              borderRadius: '32px', 
              border: '1px solid rgba(0, 210, 255, 0.2)',
              position: 'relative'
          }}>
              <span style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--primary-accent)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Security Posture</span>
              <div style={{ display: 'flex', flexDirection: 'column', itemsCenter: 'center', marginTop: '3rem' }}>
                  <div style={{ position: 'relative', width: '160px', height: '160px', margin: '0 auto' }}>
                      <svg style={{ width: '100%', height: '100%', transform: 'rotate(-90deg)' }}>
                          <circle cx="80" cy="80" r="70" fill="transparent" stroke="rgba(255,255,255,0.05)" strokeWidth="10" />
                          <circle cx="80" cy="80" r="70" fill="transparent" stroke="var(--primary-accent)" strokeWidth="10" strokeDasharray="440" strokeDashoffset="44" style={{ transition: 'stroke-dashoffset 1s' }} />
                      </svg>
                      <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem', fontWeight: 900 }}>90%</div>
                  </div>
                  <p style={{ textAlign: 'center', fontSize: '0.9rem', color: 'var(--text-secondary)', marginTop: '2.5rem', lineHeight: 1.6 }}>
                      Your security configuration is <span style={{ color: '#67d9c9', fontWeight: 700 }}>Optimized</span>. Enable MFA to reach 100%.
                  </p>
              </div>
          </div>
      </div>

    </div>
  );
};

export default AdvancedSecurity;

import React, { useState } from 'react';
import GlassCard from './common/GlassCard';
import { 
  Zap, 
  History, 
  ChevronRight, 
  Settings, 
  Activity, 
  CheckCircle2, 
  MoreVertical,
  Layers,
  Sparkles,
  Server,
  CloudLightning
} from 'lucide-react';

const PlatformUpdates = () => {
  const [activeTab, setActiveTab] = useState('All');

  const updates = [
    { 
      id: 1, 
      tag: 'Neural Link v2.0', 
      type: 'Feature', 
      date: 'Oct 24, 2023', 
      ver: 'v4.1.8-alpha', 
      msg: 'Implemented a new cross-model synchronization layer that reduces latency by 45%. New API endpoints are now available for enterprise partners.', 
      color: '#ffb4a4',
      chips: ['Latency', 'API Expansion'] 
    },
    { 
      id: 2, 
      tag: 'Edge Proxy Hardening', 
      type: 'Security', 
      date: 'Oct 19, 2023', 
      ver: 'v4.1.5', 
      msg: 'Migrated all edge proxy nodes to secure-enclave instances. Updated TLS certificates and restricted legacy protocol access across all clusters.', 
      color: 'var(--primary-accent)',
      chips: ['TLS 1.3', 'Zero Trust'] 
    },
    { 
      id: 3, 
      tag: 'UI Memory Leak Resolved', 
      type: 'Bug Fix', 
      date: 'Oct 12, 2023', 
      ver: 'v4.1.2-hotfix', 
      msg: 'Identified and patched a WebSocket subscription leak in the analytics dashboard causing browser slow-downs after long sessions.', 
      color: '#67d9c9',
      chips: ['WebSocket', 'Performance'] 
    },
  ];

  return (
    <div className="updates-view" style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
      
      {/* Header */}
      <header>
        <span style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--primary-accent)', textTransform: 'uppercase', letterSpacing: '0.2em' }}>Platform Evolution</span>
        <h2 style={{ fontSize: '2.5rem', fontWeight: 800, color: 'white', marginBottom: '0.5rem', letterSpacing: '-0.02em' }}>Updates & Changelog</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', maxWidth: '800px' }}>Tracking the evolution of the ML Curator ecosystem. From infrastructure hardening to architectural breakthroughs.</p>
      </header>

      {/* System Health Bento */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }}>
          <div style={{ background: 'rgba(255,255,255,0.02)', padding: '2rem', borderRadius: '32px', border: '1px solid var(--glass-border)', position: 'relative' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
                  <div>
                      <span style={{ fontSize: '0.65rem', fontWeight: 800, color: '#67d9c9', textTransform: 'uppercase', letterSpacing: '0.1em' }}>System Health</span>
                      <h3 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'white' }}>99.98% Uptime</h3>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#67d9c9' }}><CheckCircle2 size={24} /> <span style={{ fontWeight: 800 }}>OPERATIONAL</span></div>
              </div>
              <div style={{ h: '100px', width: '100%', display: 'flex', alignItems: 'flex-end', gap: '4px' }}>
                  {[40, 60, 50, 80, 70, 90, 100, 80, 95, 100, 100, 100].map((h, i) => (
                      <div key={i} style={{ flex: 1, height: `${h}%`, background: '#67d9c9', opacity: 0.1 + (i * 0.08), borderRadius: '4px' }}></div>
                  ))}
              </div>
          </div>
          <div style={{ 
              background: 'linear-gradient(135deg, rgba(255, 180, 164, 0.1) 0%, rgba(255, 180, 164, 0.05) 100%)', 
              padding: '2rem', 
              borderRadius: '32px', 
              border: '1px solid rgba(255, 180, 164, 0.2)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center'
          }}>
              <span style={{ fontSize: '0.6rem', fontWeight: 800, color: '#ffb4a4', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Next Sync</span>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'white' }}>v4.2.0 Rollout</h3>
              <div style={{ fontSize: '2rem', fontWeight: 900, color: '#ffb4a4', marginTop: '1rem' }}>02:45:12</div>
              <span style={{ fontSize: '0.6rem', color: 'var(--text-secondary)', fontWeight: 800, textTransform: 'uppercase' }}>Hours : Mins : Secs</span>
          </div>
      </div>

      {/* Timeline Section */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4rem', position: 'relative' }}>
          <div style={{ position: 'absolute', left: '50%', top: 0, bottom: 0, width: '2px', background: 'linear-gradient(to bottom, var(--primary-accent), transparent)', marginLeft: '-1px', opacity: 0.2 }}></div>
          
          {updates.map((up, idx) => (
             <div key={idx} style={{ 
                 display: 'flex', 
                 justifyContent: idx % 2 === 0 ? 'flex-start' : 'flex-end', 
                 position: 'relative' 
             }}>
                 {/* Timeline Node */}
                 <div style={{ 
                     position: 'absolute', 
                     left: '50%', 
                     top: '2rem', 
                     width: '24px', 
                     height: '24px', 
                     borderRadius: '50%', 
                     background: 'black', 
                     border: `4px solid ${up.color}`, 
                     transform: 'translateX(-50%)',
                     zIndex: 10 
                 }}></div>

                 {/* Card Content */}
                 <div style={{ width: '45%', display: 'flex', flexDirection: 'column', itemsAlign: idx % 2 === 0 ? 'flex-end' : 'flex-start' }}>
                     <span style={{ fontSize: '0.85rem', fontWeight: 800, color: 'white', marginBottom: '0.5rem' }}>{up.date}</span>
                     <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', marginBottom: '1rem', fontWeight: 700 }}>Version {up.ver}</span>
                     
                     <GlassCard style={{ padding: '2rem', borderLeft: `6px solid ${up.color}`, width: '100%' }}>
                         <span style={{ fontSize: '0.65rem', fontWeight: 800, color: up.color, background: `${up.color}1a`, padding: '2px 8px', borderRadius: '4px', textTransform: 'uppercase', marginBottom: '1rem', display: 'inline-block' }}>{up.type}</span>
                         <h4 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'white', marginBottom: '0.75rem' }}>{up.tag}</h4>
                         <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '1.5rem' }}>{up.msg}</p>
                         <div style={{ display: 'flex', gap: '0.5rem' }}>
                             {up.chips.map((c, i) => (
                                 <span key={i} style={{ padding: '4px 10px', background: 'rgba(255,255,255,0.03)', borderRadius: '6px', fontSize: '0.65rem', color: 'white', fontWeight: 700 }}>{c}</span>
                             ))}
                         </div>
                     </GlassCard>
                 </div>
             </div>
          ))}
      </div>

      {/* Infrastructure CTA */}
      <div style={{ 
          background: 'rgba(255,255,255,0.02)', 
          padding: '4rem', 
          borderRadius: '32px', 
          border: '1px solid var(--glass-border)', 
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden'
      }}>
          <div style={{ position: 'relative', zIndex: 1 }}>
              <CloudLightning size={48} color="var(--primary-accent)" style={{ margin: '0 auto 1.5rem' }} />
              <h3 style={{ fontSize: '2.5rem', fontWeight: 900, color: 'white', marginBottom: '1rem' }}>Global Infrastructure</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', marginBottom: '3rem', maxWidth: '600px', margin: '0 auto' }}>
                  Our data centers are powered by 100% renewable energy and redundant fiber links across 4 continents.
              </p>
              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                  <button className="btn-primary" style={{ padding: '1rem 2rem' }}>Subscribe to Status</button>
                  <button style={{ padding: '1rem 2rem', borderRadius: '12px', background: 'transparent', border: '1px solid var(--glass-border)', color: 'white', fontWeight: 700 }}>View Public API Docs</button>
              </div>
          </div>
          {/* Subtle glow */}
          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '300px', height: '300px', background: 'var(--primary-accent)', filter: 'blur(150px)', opacity: 0.1 }}></div>
      </div>

    </div>
  );
};

export default PlatformUpdates;

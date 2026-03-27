import React, { useState } from 'react';
import GlassCard from './common/GlassCard';
import { 
  Building2, 
  Upload, 
  Settings2, 
  Shield, 
  Globe, 
  Clock, 
  CheckCircle2, 
  Zap, 
  Lock, 
  ChevronRight,
  Save,
  Trash2
} from 'lucide-react';

const OrganizationSettings = () => {
  const [orgName, setOrgName] = useState('Quantum Dynamics Inc.');
  const [predictiveEnabled, setPredictiveEnabled] = useState(true);
  const [syncingEnabled, setSyncingEnabled] = useState(false);
  const [anonymizationEnabled, setAnonymizationEnabled] = useState(true);

  return (
    <div className="org-settings-view" style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
      {/* Header */}
      <header>
        <h2 style={{ fontSize: '2.5rem', fontWeight: 800, color: 'white', marginBottom: '0.75rem', letterSpacing: '-0.02em' }}>Organization Settings</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', maxWidth: '800px', lineHeight: 1.6 }}>
          Configure your company identity, visual presence, and global preferences for the ML Analytics AI ecosystem.
        </p>
      </header>

      {/* Main Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.8fr 1fr', gap: '1.5rem' }}>
        
        {/* Company Profile Card */}
        <div style={{ background: 'rgba(255,255,255,0.02)', padding: '2.5rem', borderRadius: '32px', border: '1px solid var(--glass-border)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2.5rem' }}>
                <Building2 size={24} color="#adc9eb" />
                <h3 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'white' }}>Company Profile</h3>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <span style={{ fontSize: '0.65rem', fontWeight: 800, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Organization Name</span>
                        <input 
                            type="text" 
                            value={orgName} 
                            onChange={(e) => setOrgName(e.target.value)}
                            style={{ padding: '0.9rem 1.25rem', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--glass-border)', borderRadius: '12px', color: 'white' }} 
                        />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <span style={{ fontSize: '0.65rem', fontWeight: 800, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Primary Industry</span>
                        <input 
                            type="text" 
                            defaultValue="Advanced Machine Learning" 
                            style={{ padding: '0.9rem 1.25rem', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--glass-border)', borderRadius: '12px', color: 'white' }} 
                        />
                    </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <span style={{ fontSize: '0.65rem', fontWeight: 800, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Corporate Description</span>
                    <textarea 
                        rows="4"
                        defaultValue="Global leaders in high-performance computing and neural network orchestration, serving the enterprise sector with curated strategic intelligence."
                        style={{ padding: '0.9rem 1.25rem', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--glass-border)', borderRadius: '12px', color: 'white', resize: 'none' }} 
                    />
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1.5rem' }}>
                    <button style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', fontWeight: 700 }}>Discard</button>
                    <button className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Save size={18} /> Save Profile
                    </button>
                </div>
            </div>
        </div>

        {/* Branding Identity */}
        <div style={{ background: 'rgba(255,255,255,0.02)', padding: '2.5rem', borderRadius: '32px', border: '1px solid var(--glass-border)', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'white', alignSelf: 'flex-start', marginBottom: '2.5rem' }}>Brand Identity</h3>
            <div style={{ 
                width: '180px', 
                height: '180px', 
                borderRadius: '50%', 
                border: '2px dashed rgba(255,255,255,0.1)', 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                justifyContent: 'center',
                background: 'rgba(255,255,255,0.01)',
                marginBottom: '2rem'
            }}>
                <Upload size={32} color="var(--text-secondary)" />
                <span style={{ fontSize: '0.6rem', fontWeight: 800, color: 'var(--text-secondary)', marginTop: '0.5rem', textTransform: 'uppercase' }}>Logo Upload</span>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '2.5rem' }}>Preferred size is 512x512px with transparent background.</p>
            <button className="btn-primary" style={{ width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--glass-border)' }}>Select Logo File</button>
        </div>

      </div>

      {/* Preferences Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.8fr 1fr', gap: '1.5rem' }}>
         {/* Global Preferences */}
         <div style={{ background: 'rgba(255,255,255,0.02)', padding: '2.5rem', borderRadius: '32px', border: '1px solid var(--glass-border)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2.5rem' }}>
                <Settings2 size={24} color="#67d9c9" />
                <h3 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'white' }}>Global Preferences</h3>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div>
                            <span style={{ fontWeight: 700, color: 'white', display: 'block' }}>Predictive Analysis</span>
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Enable automated trend forecasting.</span>
                        </div>
                        <div onClick={() => setPredictiveEnabled(!predictiveEnabled)} style={{ width: '44px', height: '22px', borderRadius: '100px', background: predictiveEnabled ? 'var(--primary-accent)' : 'rgba(255,255,255,0.1)', position: 'relative', cursor: 'pointer' }}>
                            <div style={{ position: 'absolute', top: '3px', left: predictiveEnabled ? '25px' : '4px', width: '16px', height: '16px', borderRadius: '50%', background: predictiveEnabled ? 'white' : 'var(--text-secondary)', transition: 'all 0.2s' }}></div>
                        </div>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div>
                            <span style={{ fontWeight: 700, color: 'white', display: 'block' }}>Real-time Syncing</span>
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Update visualizations immediately.</span>
                        </div>
                        <div onClick={() => setSyncingEnabled(!syncingEnabled)} style={{ width: '44px', height: '22px', borderRadius: '100px', background: syncingEnabled ? 'var(--primary-accent)' : 'rgba(255,255,255,0.1)', position: 'relative', cursor: 'pointer' }}>
                            <div style={{ position: 'absolute', top: '3px', left: syncingEnabled ? '25px' : '4px', width: '16px', height: '16px', borderRadius: '50%', background: syncingEnabled ? 'white' : 'var(--text-secondary)', transition: 'all 0.2s' }}></div>
                        </div>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div>
                            <span style={{ fontWeight: 700, color: 'white', display: 'block' }}>Data Anonymization</span>
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Strip PII from all datasets.</span>
                        </div>
                        <div onClick={() => setAnonymizationEnabled(!anonymizationEnabled)} style={{ width: '44px', height: '22px', borderRadius: '100px', background: anonymizationEnabled ? 'var(--primary-accent)' : 'rgba(255,255,255,0.1)', position: 'relative', cursor: 'pointer' }}>
                            <div style={{ position: 'absolute', top: '3px', left: anonymizationEnabled ? '25px' : '4px', width: '16px', height: '16px', borderRadius: '50%', background: anonymizationEnabled ? 'white' : 'var(--text-secondary)', transition: 'all 0.2s' }}></div>
                        </div>
                    </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <span style={{ fontSize: '0.65rem', fontWeight: 800, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Standard Timezone</span>
                        <select style={{ padding: '0.75rem', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--glass-border)', borderRadius: '10px', color: 'white' }}>
                            <option>UTC -05:00 Eastern Time</option>
                            <option>UTC +00:00 GMT</option>
                        </select>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <span style={{ fontSize: '0.65rem', fontWeight: 800, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Currency Format</span>
                        <select style={{ padding: '0.75rem', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--glass-border)', borderRadius: '10px', color: 'white' }}>
                            <option>USD ($) US Dollar</option>
                            <option>EUR (€) Euro</option>
                        </select>
                    </div>
                </div>
            </div>
         </div>

         {/* Small Widgets Stack */}
         <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
             <div style={{ background: 'rgba(255,255,255,0.02)', padding: '1.5rem', borderRadius: '24px', borderLeft: '4px solid var(--primary-accent)', borderTop: '1px solid var(--glass-border)', borderRight: '1px solid var(--glass-border)', borderBottom: '1px solid var(--glass-border)' }}>
                <span style={{ fontSize: '0.6rem', fontWeight: 800, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Organization Health</span>
                <div style={{ fontSize: '1.8rem', fontWeight: 800, margin: '0.5rem 0' }}>Optimal</div>
                <div style={{ width: '100%', height: '4px', background: 'rgba(255,255,255,0.05)', borderRadius: '2px', margin: '0.75rem 0' }}>
                    <div style={{ width: '94%', height: '100%', background: 'var(--primary-accent)' }}></div>
                </div>
                <span style={{ fontSize: '0.65rem', color: 'var(--text-secondary)' }}>94% compliance score</span>
             </div>
             
             <div style={{ background: 'rgba(255,255,255,0.02)', padding: '1.5rem', borderRadius: '24px', border: '1px solid var(--glass-border)', position: 'relative', overflow: 'hidden' }}>
                <Shield size={60} style={{ position: 'absolute', right: '-15px', bottom: '-15px', opacity: 0.1, color: '#67d9c9' }} />
                <span style={{ fontSize: '0.6rem', fontWeight: 800, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Security Status</span>
                <div style={{ fontSize: '1.2rem', fontWeight: 700, margin: '0.5rem 0' }}>Tier 3 Encryption</div>
                <button style={{ color: '#67d9c9', background: 'transparent', border: 'none', fontSize: '0.7rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer', marginTop: '0.5rem' }}>
                    VIEW AUDIT LOGS <ChevronRight size={14} />
                </button>
             </div>
         </div>
      </div>

    </div>
  );
};

export default OrganizationSettings;

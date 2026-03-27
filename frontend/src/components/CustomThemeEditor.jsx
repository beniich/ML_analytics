import React, { useState } from 'react';
import GlassCard from './common/GlassCard';
import { 
  Palette, 
  Type, 
  UploadCloud, 
  Save, 
  RotateCcw, 
  Eye, 
  Calendar,
  Download,
  Database,
  BrainCircuit,
  TrendingUp,
  Activity
} from 'lucide-react';

const CustomThemeEditor = () => {
  const [primaryColor, setPrimaryColor] = useState('#ffb4a4');
  const [secondaryColor, setSecondaryColor] = useState('#adc9eb');
  const [fontFamily, setFontFamily] = useState('Manrope & Inter');

  return (
    <div className="theme-editor-view" style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
      {/* Header */}
      <header>
        <span style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--primary-accent)', textTransform: 'uppercase', letterSpacing: '0.2em' }}>Branding & Styling</span>
        <h2 style={{ fontSize: '2.5rem', fontWeight: 800, color: 'white', marginBottom: '0.5rem', letterSpacing: '-0.02em' }}>Custom Theme Editor</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', maxWidth: '800px' }}>
          Define your brand identity and system aesthetics globally across the application.
        </p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 5fr) minmax(0, 7fr)', gap: '2rem' }}>
        
        {/* Editor Controls Panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            
            {/* Color Palette section */}
            <div style={{ background: 'rgba(255,255,255,0.02)', padding: '2rem', borderRadius: '24px', border: '1px solid var(--glass-border)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                    <Palette size={20} color="var(--primary-accent)" />
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'white' }}>Brand Colors</h3>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <span style={{ fontSize: '0.65rem', fontWeight: 800, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Primary Accent</span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', border: '1px solid var(--glass-border)' }}>
                            <div style={{ width: '2rem', height: '2rem', borderRadius: '8px', background: primaryColor, border: '1px solid rgba(255,255,255,0.1)' }}></div>
                            <input 
                              type="text" 
                              value={primaryColor} 
                              onChange={(e) => setPrimaryColor(e.target.value)} 
                              style={{ background: 'transparent', border: 'none', color: 'white', outline: 'none', width: '100%', fontFamily: 'monospace' }}
                            />
                        </div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <span style={{ fontSize: '0.65rem', fontWeight: 800, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Secondary Base</span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', border: '1px solid var(--glass-border)' }}>
                            <div style={{ width: '2rem', height: '2rem', borderRadius: '8px', background: secondaryColor, border: '1px solid rgba(255,255,255,0.1)' }}></div>
                            <input 
                              type="text" 
                              value={secondaryColor} 
                              onChange={(e) => setSecondaryColor(e.target.value)} 
                              style={{ background: 'transparent', border: 'none', color: 'white', outline: 'none', width: '100%', fontFamily: 'monospace' }}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Typography & Identity */}
            <div style={{ background: 'rgba(255,255,255,0.02)', padding: '2rem', borderRadius: '24px', border: '1px solid var(--glass-border)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                    <Type size={20} color="var(--primary-accent)" />
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'white' }}>Identity & Type</h3>
                </div>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <span style={{ fontSize: '0.65rem', fontWeight: 800, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Brand Logo</span>
                        <div style={{ border: '2px dashed rgba(255,255,255,0.1)', borderRadius: '16px', padding: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', background: 'rgba(255,255,255,0.01)', cursor: 'pointer' }}>
                            <UploadCloud size={32} color="var(--text-secondary)" />
                            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textAlign: 'center', lineHeight: 1.5 }}>
                                <span style={{ color: 'var(--primary-accent)', fontWeight: 700 }}>Click to upload</span> or drag and drop<br/>SVG, PNG, or WEBP (Max 2MB)
                            </p>
                        </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <span style={{ fontSize: '0.65rem', fontWeight: 800, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Font Selection</span>
                        <select 
                            value={fontFamily}
                            onChange={(e) => setFontFamily(e.target.value)}
                            style={{ padding: '1rem', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--glass-border)', borderRadius: '12px', color: 'white', outline: 'none' }}
                        >
                            <option>Manrope & Inter (System Default)</option>
                            <option>Plus Jakarta Sans & Satoshi</option>
                            <option>Geist Sans & Mono</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
                <button className="btn-primary" style={{ flex: 1, padding: '1rem', fontSize: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                    <Save size={18} /> Publish Changes
                </button>
                <button style={{ padding: '1rem 2rem', borderRadius: '12px', background: 'transparent', border: '1px solid var(--glass-border)', color: 'white', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                    <RotateCcw size={18} /> Reset
                </button>
            </div>
            
        </div>

        {/* Live Preview Panel */}
        <div style={{ position: 'sticky', top: '100px', alignSelf: 'start' }}>
            <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '24px', border: '1px solid var(--glass-border)', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                <div style={{ padding: '1rem 1.5rem', background: 'rgba(0,0,0,0.2)', borderBottom: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#ff5f56' }}></div>
                        <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#ffbd2e' }}></div>
                        <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#27c93f' }}></div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.7rem', color: 'var(--text-secondary)' }}>
                        <Eye size={14} /> Viewing: Custom Theme
                    </div>
                </div>
                
                {/* Simulated App View */}
                <div style={{ padding: '2rem', background: '#111317', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    
                    {/* Fake Header */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <h4 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'white' }}>Insight Overview</h4>
                            <p style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>Monitoring real-time predictive models</p>
                        </div>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <div style={{ padding: '0.5rem 1rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', color: 'var(--text-secondary)', fontSize: '0.65rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                <Calendar size={12}/> LAST 30 DAYS
                            </div>
                            <div style={{ padding: '0.5rem 1rem', borderRadius: '8px', background: primaryColor, color: 'black', fontSize: '0.65rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                <Download size={12}/> EXPORT
                            </div>
                        </div>
                    </div>

                    {/* Fake Bento Grid */}
                    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1rem' }}>
                        <div style={{ padding: '1.5rem', borderRadius: '16px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
                                <span style={{ fontSize: '0.65rem', color: 'var(--text-secondary)', fontWeight: 800, textTransform: 'uppercase' }}>Accuracy Trend</span>
                                <span style={{ color: secondaryColor, fontSize: '0.8rem', fontWeight: 800 }}>+12.4%</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '4px', height: '80px' }}>
                                {[20, 40, 30, 60, 50, 80, 70, 90, 100].map((h, i) => (
                                    <div key={i} style={{ flex: 1, height: `${h}%`, background: h > 70 ? primaryColor : secondaryColor, opacity: h > 70 ? 0.8 : 0.3, borderRadius: '4px 4px 0 0' }}></div>
                                ))}
                            </div>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                             <div style={{ padding: '1rem', borderRadius: '16px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
                                <span style={{ fontSize: '0.6rem', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 800 }}>Total Predictions</span>
                                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'white', marginTop: '0.2rem' }}>1.2M</div>
                             </div>
                             <div style={{ padding: '1rem', borderRadius: '16px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
                                <span style={{ fontSize: '0.6rem', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 800 }}>Active Models</span>
                                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'white', marginTop: '0.2rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: secondaryColor }}></div> 42
                                </div>
                             </div>
                        </div>
                    </div>

                    {/* Fake List */}
                    <div>
                        <span style={{ fontSize: '0.65rem', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 800, display: 'block', marginBottom: '0.75rem' }}>Recent Deployments</span>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <div style={{ padding: '0.75rem 1rem', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                    <div style={{ width: '24px', height: '24px', borderRadius: '6px', background: `${secondaryColor}33`, color: secondaryColor, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <Database size={12}/>
                                    </div>
                                    <span style={{ fontSize: '0.8rem', color: 'white', fontWeight: 700 }}>ChurnPredictor_v4</span>
                                </div>
                                <span style={{ fontSize: '0.6rem', color: 'var(--text-secondary)', fontFamily: 'monospace' }}>2m ago</span>
                            </div>
                            <div style={{ padding: '0.75rem 1rem', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                    <div style={{ width: '24px', height: '24px', borderRadius: '6px', background: `${primaryColor}33`, color: primaryColor, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <BrainCircuit size={12}/>
                                    </div>
                                    <span style={{ fontSize: '0.8rem', color: 'white', fontWeight: 700 }}>Sentiment_Engine_Final</span>
                                </div>
                                <span style={{ fontSize: '0.6rem', color: 'var(--text-secondary)', fontFamily: 'monospace' }}>14h ago</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default CustomThemeEditor;

import React, { useState } from 'react';
import GlassCard from './common/GlassCard';
import { 
  FileText, 
  Settings, 
  Eye, 
  Download, 
  Layers, 
  BarChart, 
  Zap, 
  Clock,
  CheckCircle2,
  ChevronRight,
  Printer
} from 'lucide-react';

const ReportBuilder = () => {
  const [selectedTemplate, setSelectedTemplate] = useState(1);
  const [sections, setSections] = useState([
    { id: 1, name: 'Introduction & Scope', enabled: true, info: 'On, 1 page' },
    { id: 2, name: 'Stats Overview', enabled: true, info: 'On, 3 pages, 5 charts' },
    { id: 3, name: 'Correlations Analysis', enabled: true, info: 'On, 2 pages, 3 matrices' },
    { id: 4, name: 'Predictions Model', enabled: true, info: 'On, 2 pages, 1 forecast' },
    { id: 5, name: 'Key Findings', enabled: true, info: 'On, 1 page' },
    { id: 6, name: 'Methodology', enabled: false, info: 'Off' },
    { id: 7, name: 'Appendix', enabled: false, info: 'Off' },
  ]);

  const toggleSection = (id) => {
    setSections(sections.map(s => s.id === id ? { ...s, enabled: !s.enabled } : s));
  };

  return (
    <div className="report-builder-view" style={{ display: 'flex', flexDirection: 'column', gap: '2rem', height: '100%' }}>
      
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 800 }}>Automated Report Builder</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Generate stakeholder-ready PDFs and interactive HTML summaries</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
           <button className="btn-primary" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)' }}>
             <Clock size={16} style={{ marginRight: '0.5rem' }} /> History
           </button>
           <button className="btn-primary">
             <Download size={16} style={{ marginRight: '0.5rem' }} /> Export as PDF
           </button>
        </div>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: '300px 320px 1fr', gap: '2rem', flex: 1, minHeight: 0 }}>
        
        {/* Templates Sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--primary-accent)' }}>Templates</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
             {[
               { id: 1, name: 'Executive Summary', desc: 'Concise overview for stakeholders. Key metrics emphasis.', icon: <Zap size={18} /> },
               { id: 2, name: 'Technical Deep-dive', desc: 'Full data analysis with detailed chart sub-blocks.', icon: <BarChart size={18} /> },
             ].map(tpl => (
               <div 
                 key={tpl.id}
                 onClick={() => setSelectedTemplate(tpl.id)}
                 style={{
                   padding: '1.25rem',
                   borderRadius: '16px',
                   background: selectedTemplate === tpl.id ? 'rgba(0, 210, 255, 0.05)' : 'rgba(255,255,255,0.02)',
                   border: `1px solid ${selectedTemplate === tpl.id ? 'var(--primary-accent)' : 'var(--glass-border)'}`,
                   cursor: 'pointer',
                   transition: 'all 0.2s ease'
                 }}
               >
                 <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                    <div style={{ padding: '0.6rem', background: 'rgba(255,255,255,0.03)', borderRadius: '10px', color: selectedTemplate === tpl.id ? 'var(--primary-accent)' : 'white' }}>
                       {tpl.icon}
                    </div>
                    <div>
                       <h4 style={{ fontSize: '0.9rem', fontWeight: 700 }}>{tpl.name}</h4>
                       <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>{tpl.desc}</p>
                    </div>
                 </div>
               </div>
             ))}
          </div>
        </div>

        {/* Builder Controls */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--primary-accent)' }}>Report Builder</h3>
          <GlassCard>
             <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {sections.map(section => (
                  <div key={section.id} style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', opacity: section.enabled ? 1 : 0.4 }}>
                     <div 
                       onClick={() => toggleSection(section.id)}
                       style={{
                         width: '36px',
                         height: '18px',
                         borderRadius: '20px',
                         background: section.enabled ? 'var(--primary-accent)' : 'rgba(255,255,255,0.1)',
                         position: 'relative',
                         cursor: 'pointer',
                         marginTop: '2px'
                       }}
                     >
                       <div style={{
                         width: '12px',
                         height: '12px',
                         borderRadius: '50%',
                         background: 'white',
                         position: 'absolute',
                         top: '3px',
                         left: section.enabled ? '21px' : '3px',
                         transition: 'all 0.2s ease'
                       }}></div>
                     </div>
                     <div>
                        <div style={{ fontSize: '0.85rem', fontWeight: 700 }}>{section.name}</div>
                        <div style={{ fontSize: '0.65rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>{section.info}</div>
                     </div>
                  </div>
                ))}
             </div>
          </GlassCard>
        </div>

        {/* Live Preview Pane */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--primary-accent)' }}>Live Preview</h3>
          <div style={{ flex: 1, background: 'rgba(0,0,0,0.3)', borderRadius: '20px', padding: '2rem', display: 'flex', justifyContent: 'center', overflow: 'hidden' }}>
             <div style={{ 
               width: '100%', 
               maxWidth: '550px', 
               background: 'white', 
               height: '100%', 
               borderRadius: '4px',
               color: '#0f172a',
               padding: '2.5rem',
               overflowY: 'auto',
               boxShadow: '0 20px 50px rgba(0,0,0,0.5)'
             }}>
                <header style={{ borderBottom: '1px solid #e2e8f0', paddingBottom: '1.5rem', marginBottom: '2rem' }}>
                   <div style={{ fontSize: '0.65rem', fontWeight: 800, color: '#64748b' }}>OCTOBER 26, 2023 • AUDIT REPORT</div>
                   <h1 style={{ fontSize: '1.4rem', fontWeight: 900, marginTop: '0.2rem' }}>Q4 Executive Summary: Revenue Forecast Analysis</h1>
                </header>

                <section style={{ marginBottom: '2.5rem' }}>
                   <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                      <CheckCircle2 color="#0ea5e9" size={16} />
                      <h3 style={{ fontSize: '1rem', fontWeight: 800 }}>1. Stats Overview</h3>
                   </div>
                   <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                      <div style={{ height: '120px', borderLeft: '1px solid #e2e8f0', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'end', gap: '6px', padding: '0 8px' }}>
                        {[80, 50, 40, 90, 65].map((h, i) => (
                          <div key={i} style={{ flex: 1, height: `${h}%`, background: '#0284c7', borderRadius: '2px 2px 0 0' }}></div>
                        ))}
                      </div>
                      <p style={{ fontSize: '0.7rem', lineHeight: '1.5', color: '#475569' }}>
                        Key performance indicators reveal a <span style={{ color: '#059669', fontWeight: 700 }}>+15% growth</span> in North regions. Scaling operations in West sectors showed a deviation of 4% from historical averages.
                      </p>
                   </div>
                </section>

                <section style={{ marginBottom: '2.5rem' }}>
                   <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                      <CheckCircle2 color="#0ea5e9" size={16} />
                      <h3 style={{ fontSize: '1rem', fontWeight: 800 }}>2. Predictive Modeling</h3>
                   </div>
                   <div style={{ padding: '1rem', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                      <div style={{ height: '80px', position: 'relative', display: 'flex', alignItems: 'end' }}>
                         <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
                            <path d="M0 100 Q 25 80, 50 60 T 100 10" fill="none" stroke="#0284c7" strokeWidth="2" />
                            <path d="M0 100 Q 25 80, 50 60 T 100 10 L 100 100 Z" fill="rgba(2, 132, 199, 0.05)" />
                         </svg>
                      </div>
                      <div style={{ marginTop: '0.5rem', display: 'flex', justifyContent: 'space-between', fontSize: '0.6rem', fontWeight: 700, color: '#64748b' }}>
                         <span>Q1 PROJECTION</span>
                         <span style={{ color: '#0284c7' }}>EST. $12.5M</span>
                      </div>
                   </div>
                </section>

                <footer style={{ marginTop: '4rem', textAlign: 'center', borderTop: '1px solid #f1f5f9', paddingTop: '1rem' }}>
                   <p style={{ fontSize: '0.6rem', color: '#94a3b8' }}>SYTHESIS ML PLATFORM • PAGE 1 OF 12</p>
                </footer>
             </div>
          </div>
        </div>

      </div>

    </div>
  );
};

export default ReportBuilder;

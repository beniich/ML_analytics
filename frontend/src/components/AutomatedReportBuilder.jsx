import React, { useState } from 'react';
import GlassCard from './common/GlassCard';
import { toast } from 'react-toastify';
import { 
  FileText, 
  Layout, 
  BarChart3, 
  TrendingUp, 
  Layers, 
  FileOutput, 
  Download, 
  Settings, 
  Share2,
  Calendar,
  Check,
  Eye,
  Plus
} from 'lucide-react';

const AutomatedReportBuilder = () => {
  const [selectedTemplate, setSelectedTemplate] = useState('executive');
  const [reportSections, setReportSections] = useState([
    { id: 'intro', label: 'Introduction & Scope', enabled: true, pages: 1 },
    { id: 'stats', label: 'Stats Overview', enabled: true, pages: 3, charts: 5 },
    { id: 'correlations', label: 'Correlations Analysis', enabled: true, pages: 2, matrices: 3 },
    { id: 'predictions', label: 'Predictions Model', enabled: true, pages: 2, forecast: 1 },
    { id: 'findings', label: 'Key Findings & Recommendations', enabled: true, pages: 1 },
    { id: 'methodology', label: 'Methodology', enabled: false, pages: 0 },
    { id: 'appendix', label: 'Appendix', enabled: false, pages: 0 },
  ]);
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async (format) => {
    setIsExporting(true);
    toast.info(`Generating ${format.toUpperCase()} report... this may take a moment.`);
    try {
      await new Promise(r => setTimeout(r, 2500));
      toast.success(`Report successfully exported as ${format.toUpperCase()}!`);
    } catch (e) {
      toast.error('Failed to export report');
    } finally {
      setIsExporting(false);
    }
  };

  const toggleSection = (id) => {
    setReportSections(prev => prev.map(s => s.id === id ? { ...s, enabled: !s.enabled } : s));
  };

  return (
    <div className="report-builder-view" style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
      {/* Header */}
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <h2 style={{ fontSize: '2.5rem', fontWeight: 800, color: 'white', marginBottom: '0.5rem', letterSpacing: '-0.02em' }}>Automated Report Builder</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', maxWidth: '600px' }}>Design and schedule automated analytical reports for your project stakeholders.</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
            <button onClick={() => toast.info('Schedule dialog opened')} className="btn-primary" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--glass-border)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Calendar size={18} /> Schedule
            </button>
            <button onClick={() => toast.success('Created new blank report template')} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Plus size={18} /> New Report
            </button>
        </div>
      </header>

      {/* Main Builder Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(280px, 1fr) 1fr 1.5fr', gap: '1.5rem' }}>
        
        {/* Templates Sidebar */}
        <div style={{ background: 'rgba(255,255,255,0.02)', padding: '2rem', borderRadius: '32px', border: '1px solid var(--glass-border)' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'white', marginBottom: '2rem', borderBottom: '1px solid rgba(255,255,255,0.05)', pb: '1rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Layout size={20} color="var(--primary-accent)" /> Templates
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {[
                  { id: 'executive', title: 'Executive Summary', sub: 'Concise overview for stakeholders.', icon: <FileText size={20} /> },
                  { id: 'technical', title: 'Technical Deep-dive', sub: 'Full data analysis with detailed charts.', icon: <BarChart3 size={20} /> },
                  { id: 'monthly', title: 'Monthly Performance', sub: 'Month-over-month trend comparison.', icon: <Layers size={20} /> },
                ].map((t) => (
                    <div 
                        key={t.id}
                        onClick={() => setSelectedTemplate(t.id)}
                        style={{ 
                            padding: '1.25rem', 
                            borderRadius: '16px', 
                            border: `1px solid ${selectedTemplate === t.id ? 'var(--primary-accent)' : 'var(--glass-border)'}`,
                            background: selectedTemplate === t.id ? 'rgba(0, 210, 255, 0.05)' : 'rgba(255,255,255,0.01)',
                            cursor: 'pointer',
                            transition: 'all 0.2s'
                        }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.75rem' }}>
                            <div style={{ color: selectedTemplate === t.id ? 'var(--primary-accent)' : 'var(--text-secondary)' }}>{t.icon}</div>
                            <span style={{ fontWeight: 700, color: 'white' }}>{t.title}</span>
                        </div>
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>{t.sub}</p>
                    </div>
                ))}
            </div>
        </div>

        {/* Builder Controls */}
        <div style={{ background: 'rgba(255,255,255,0.02)', padding: '2rem', borderRadius: '32px', border: '1px solid var(--glass-border)', display: 'flex', flexDirection: 'column' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'white', marginBottom: '2rem', borderBottom: '1px solid rgba(255,255,255,0.05)', pb: '1rem' }}>Report Sections</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', flex: 1 }}>
                {reportSections.map((s) => (
                    <div key={s.id} style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', opacity: s.enabled ? 1 : 0.4 }}>
                        <div 
                            onClick={() => toggleSection(s.id)}
                            style={{ 
                                width: '40px', 
                                height: '22px', 
                                borderRadius: '100px', 
                                background: s.enabled ? 'var(--primary-accent)' : 'rgba(255,255,255,0.1)', 
                                position: 'relative', 
                                cursor: 'pointer',
                                marginTop: '4px'
                            }}
                        >
                            <div style={{ position: 'absolute', top: '3px', left: s.enabled ? '21px' : '4px', width: '16px', height: '16px', borderRadius: '50%', background: 'white', transition: 'all 0.2s' }}></div>
                        </div>
                        <div>
                            <span style={{ fontWeight: 700, color: 'white', display: 'block' }}>{s.label}</span>
                            <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>
                                {s.enabled ? `On, ${s.pages} page${s.pages > 1 ? 's' : ''}${s.charts ? `, ${s.charts} charts` : ''}` : 'Off'}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
            <div style={{ marginTop: '2.5rem', paddingTop: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                <button 
                  className="btn-primary" 
                  onClick={() => handleExport('pdf')}
                  disabled={isExporting}
                  style={{ width: '100%', background: '#ffb4a4', color: 'black', fontWeight: 900, marginBottom: '1rem', opacity: isExporting ? 0.6 : 1 }}
                >
                    {isExporting ? 'GENERATING...' : 'EXPORT AS PDF'}
                </button>
                <div style={{ textAlign: 'center' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>or <span onClick={() => handleExport('html')} style={{ color: 'white', textDecoration: 'underline', cursor: 'pointer' }}>Export as HTML</span></span>
                </div>
            </div>
        </div>

        {/* Live Preview */}
        <div style={{ background: 'rgba(255,255,255,0.02)', padding: '1.5rem', borderRadius: '32px', border: '1px solid var(--glass-border)', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'white' }}>Live Preview</h3>
                <Eye size={18} color="var(--primary-accent)" />
            </div>
            {/* The "Paper" container */}
            <div style={{ 
                flex: 1, 
                background: 'white', 
                borderRadius: '8px', 
                padding: '2.5rem', 
                color: '#1e293b',
                display: 'flex',
                flexDirection: 'column',
                gap: '2rem',
                overflowY: 'auto',
                boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
                minHeight: '500px'
            }}>
                <header>
                    <h4 style={{ fontSize: '1.5rem', fontWeight: 900, marginBottom: '0.25rem' }}>Q4 Executive Summary</h4>
                    <span style={{ fontSize: '0.65rem', color: '#64748b', fontWeight: 600 }}>Prepared on Oct 26, 2023 • ML Analytics AI</span>
                </header>

                <section>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.75rem', marginBottom: '1.25rem' }}>
                        <BarChart3 size={16} color="#3b82f6" />
                        <h5 style={{ fontSize: '0.9rem', fontWeight: 800 }}>1. Stats Overview</h5>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                        <div style={{ height: '100px', background: '#f8fafc', borderRadius: '6px', border: '1px solid #e2e8f0', padding: '1rem', display: 'flex', alignItems: 'flex-end', gap: '4px' }}>
                            {[60, 80, 40, 90, 70].map((h, i) => (
                                <div key={i} style={{ flex: 1, height: `${h}%`, background: '#1e293b', borderRadius: '2px' }}></div>
                            ))}
                        </div>
                        <p style={{ fontSize: '0.65rem', color: '#64748b', lineHeight: 1.5 }}>
                            Performance indicators show a <strong style={{ color: '#10b981' }}>+15% growth</strong> in the northern region, while sustaining stability in central nodes.
                        </p>
                    </div>
                </section>

                <section>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.75rem', marginBottom: '1.25rem' }}>
                        <TrendingUp size={16} color="#3b82f6" />
                        <h5 style={{ fontSize: '0.9rem', fontWeight: 800 }}>2. Predictive Analysis</h5>
                    </div>
                    <div style={{ height: '80px', position: 'relative' }}>
                        <svg viewBox="0 0 100 40" style={{ width: '100%', height: '100%' }}>
                            <path d="M0 40 Q 25 35 50 20 T 100 0" fill="rgba(59, 130, 246, 0.1)" stroke="#3b82f6" strokeWidth="2" />
                        </svg>
                    </div>
                </section>
                
                <div style={{ marginTop: 'auto', textAlign: 'center', borderTop: '1px solid #f1f5f9', paddingTop: '1rem' }}>
                    <span style={{ fontSize: '0.6rem', color: '#94a3b8' }}>PAGE 1 OF 12 • INTERNAL USE ONLY</span>
                </div>
            </div>
        </div>

      </div>

    </div>
  );
};

export default AutomatedReportBuilder;

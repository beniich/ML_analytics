import React, { useState } from 'react';
import GlassCard from './common/GlassCard';
import { toast } from 'react-toastify';
import { 
  Database, 
  PlusCircle, 
  Play, 
  Trash2, 
  Zap,
  Box,
  CheckCircle,
  Cpu,
  ArrowRight,
  Maximize2,
  Minimize2,
  LineChart
} from 'lucide-react';

const FeatureEngineeringStudio = () => {
  const [activeTab, setActiveTab] = useState('math');
  const [zoom, setZoom] = useState(100);
  const [isComputing, setIsComputing] = useState(false);

  const handleCompute = async () => {
    setIsComputing(true);
    toast.info('Compiling node execution graph...');
    try {
      await new Promise(r => setTimeout(r, 2000));
      toast.success('Successfully pipeline logic. Added log_net_revenue to feature store.');
    } catch(e) {
      toast.error('Compilation failed.');
    } finally {
      setIsComputing(false);
    }
  };

  const libraryItems = {
    math: [
      { id: 'sum', name: 'Summation', desc: 'A + B + ...', icon: <PlusCircle size={16} />, color: '#ffb4a4' },
      { id: 'prod', name: 'Product', desc: 'A * B * ...', icon: <Zap size={16} />, color: '#ffb4a4' },
    ],
    logic: [
      { id: 'if', name: 'If/Else', desc: 'Conditional logic', icon: <Box size={16} />, color: '#adc9eb' },
      { id: 'ln', name: 'Natural Log', desc: 'ln(x)', icon: <LineChart size={16} />, color: '#adc9eb' },
    ],
    string: [
      { id: 'concat', name: 'Concat', desc: 'Join strings', icon: <PlusCircle size={16} />, color: '#67d9c9' },
    ]
  };

  const nodes = [
    { id: 1, type: 'source', name: 'daily_revenue_usd', dtype: 'Float64', rows: '1.2M', x: 40, y: 128 },
    { id: 2, type: 'source', name: 'tax_adjustment', dtype: 'Float64', rows: '1.2M', x: 40, y: 288 },
    { id: 3, type: 'operator', name: 'ADDITION', x: 380, y: 208, color: '#ffb4a4' },
    { id: 4, type: 'transform', name: 'LOG_NATURAL', x: 640, y: 208, color: '#adc9eb' },
    { id: 5, type: 'output', name: 'log_net_revenue', x: 940, y: 208, stats: 'μ: 14.2 σ: 2.1' },
  ];

  return (
    <div className="feature-engineering-view" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', height: '100%' }}>
      {/* Header */}
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--primary-accent)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Feature Lab</span>
            <span style={{ padding: '2px 6px', background: 'rgba(0, 210, 255, 0.1)', color: 'var(--primary-accent)', borderRadius: '4px', fontSize: '0.65rem', fontWeight: 700 }}>ALPHA 36/50</span>
          </div>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 700, color: 'white' }}>Financial_Forecast_v2.var</h2>
        </div>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <div style={{ display: 'flex', background: 'rgba(255,255,255,0.03)', borderRadius: '100px', padding: '0.5rem 1.25rem', border: '1px solid var(--glass-border)', gap: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Cpu size={14} color="var(--primary-accent)" />
                <span style={{ fontSize: '0.75rem', fontWeight: 600 }}>Latency: <span style={{ color: '#67d9c9' }}>14ms</span></span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Database size={14} color="#adc9eb" />
                <span style={{ fontSize: '0.75rem', fontWeight: 600 }}>Usage: <span style={{ color: '#67d9c9' }}>2.4GB</span></span>
            </div>
          </div>
          <button 
            className="btn-primary" 
            onClick={handleCompute}
            disabled={isComputing}
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.5rem', opacity: isComputing ? 0.6 : 1 }}
          >
            <Play size={16} fill="currentColor" className={isComputing ? "spin-animation" : ""} />
            {isComputing ? 'Compiling DAG...' : 'Compute Variable'}
          </button>
        </div>
      </header>

      {/* Main Workspace */}
      <div style={{ display: 'flex', gap: '1.5rem', flex: 1, minHeight: '600px', position: 'relative' }}>
        
        {/* Visual Canvas */}
        <div style={{ 
            flex: 1, 
            background: '#0c1220', 
            borderRadius: '24px', 
            border: '1px solid var(--glass-border)',
            position: 'relative',
            overflow: 'hidden',
            backgroundImage: 'radial-gradient(rgba(255,255,255,0.05) 1px, transparent 1px)',
            backgroundSize: '32px 32px'
        }}>
          {/* SVG Connections Overlay */}
          <svg style={{ position: 'absolute', width: '100%', height: '100%', pointerEvents: 'none', opacity: 0.6 }}>
            <defs>
              <linearGradient id="line-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#ffb4a4" />
                <stop offset="100%" stopColor="#adc9eb" />
              </linearGradient>
            </defs>
            {/* Hardcoded paths matching the static nodes for demo */}
            <path d="M 280 180 Q 380 180 380 240" fill="none" stroke="url(#line-grad)" strokeWidth="2" />
            <path d="M 280 340 Q 380 340 380 280" fill="none" stroke="url(#line-grad)" strokeWidth="2" />
            <path d="M 580 260 Q 640 260 640 260" fill="none" stroke="#adc9eb" strokeWidth="2" />
            <path d="M 840 260 Q 940 260 940 260" fill="none" stroke="#67d9c9" strokeWidth="2" />
          </svg>

          {/* Nodes */}
          {nodes.map(node => (
            <div 
              key={node.id}
              style={{
                position: 'absolute',
                left: node.x,
                top: node.y,
                width: node.type === 'output' ? '260px' : node.type === 'operator' ? '190px' : '220px',
                background: node.type === 'output' ? 'rgba(255,255,255,0.05)' : 'rgba(30, 41, 59, 0.8)',
                backdropFilter: 'blur(12px)',
                borderRadius: '16px',
                border: `1px solid ${node.color || 'var(--glass-border)'}`,
                borderLeft: node.type === 'source' ? '4px solid var(--primary-accent)' : undefined,
                borderRight: node.type === 'output' ? '4px solid #67d9c9' : undefined,
                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5)',
                zIndex: 10
              }}
            >
                <div style={{ padding: '0.75rem', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.6rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-secondary)' }}>
                        {node.type === 'source' ? 'Source Column' : node.type.toUpperCase()}
                    </span>
                    {node.type === 'source' ? <Database size={12} color="var(--primary-accent)" /> : node.type === 'output' ? <CheckCircle size={12} color="#67d9c9" /> : null}
                </div>
                <div style={{ padding: '1rem' }}>
                    <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'white' }}>{node.name}</h4>
                    {node.dtype && <p style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>{node.dtype} • {node.rows} rows</p>}
                    {node.stats && (
                        <div style={{ marginTop: '0.75rem' }}>
                            <div style={{ height: '32px', background: 'rgba(0,0,0,0.3)', borderRadius: '8px', overflow: 'hidden', opacity: 0.5, marginBottom: '0.5rem' }}>
                                 {/* Simple Histogram placeholder */}
                                 <div style={{ display: 'flex', alignItems: 'flex-end', height: '100%', gap: '2px', padding: '0 4px' }}>
                                    {[20, 50, 80, 60, 90, 40, 30].map((h, i) => <div key={i} style={{ flex: 1, height: `${h}%`, background: '#67d9c9' }}></div>)}
                                 </div>
                            </div>
                            <span style={{ fontSize: '0.7rem', color: '#67d9c9', fontFamily: 'monospace' }}>{node.stats}</span>
                        </div>
                    )}
                </div>
            </div>
          ))}

          {/* Canvas Controls */}
          <div style={{ 
              position: 'absolute', 
              bottom: '2rem', 
              left: '50%', 
              transform: 'translateX(-50%)',
              display: 'flex',
              alignItems: 'center',
              background: 'rgba(15, 23, 42, 0.8)',
              backdropFilter: 'blur(16px)',
              padding: '0.5rem',
              borderRadius: '16px',
              border: '1px solid var(--glass-border)',
              gap: '0.5rem'
          }}>
              <button style={{ padding: '0.5rem', color: 'var(--text-secondary)', background: 'transparent', border: 'none' }}><Maximize2 size={16} /></button>
              <div style={{ width: '1px', height: '16px', background: 'var(--glass-border)' }}></div>
              <button style={{ padding: '0.5rem', color: 'white', background: 'rgba(255,255,255,0.05)', borderRadius: '8px', border: 'none' }}><ArrowRight size={16} /></button>
              <div style={{ width: '1px', height: '16px', background: 'var(--glass-border)' }}></div>
              <button style={{ padding: '0.5rem', color: 'var(--text-secondary)', background: 'transparent', border: 'none' }} onClick={() => setZoom(z => Math.max(z-10, 50))}><Minimize2 size={16} /></button>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, minWidth: '40px', textAlign: 'center' }}>{zoom}%</span>
              <button style={{ padding: '0.5rem', color: 'var(--text-secondary)', background: 'transparent', border: 'none' }} onClick={() => setZoom(z => Math.min(z+10, 150))}><Maximize2 size={16} /></button>
              <div style={{ width: '1px', height: '16px', background: 'var(--glass-border)' }}></div>
              <button style={{ padding: '0.5rem', color: '#ef4444', background: 'transparent', border: 'none' }} onClick={() => toast.success('Canvas cleared')}><Trash2 size={16} /></button>
          </div>
        </div>

        {/* Right Palette */}
        <aside style={{ width: '300px', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <GlassCard title="Node Library">
            <div style={{ display: 'flex', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', padding: '0.25rem', marginBottom: '1.5rem' }}>
              {['math', 'logic', 'string'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  style={{
                    flex: 1,
                    padding: '0.5rem',
                    fontSize: '0.7rem',
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    background: activeTab === tab ? 'rgba(255,255,255,0.05)' : 'transparent',
                    color: activeTab === tab ? 'white' : 'var(--text-secondary)',
                    border: 'none',
                    borderRadius: '8px',
                    transition: 'all 0.2s'
                  }}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {libraryItems[activeTab].map(item => (
                <div 
                  key={item.id}
                  style={{
                    padding: '1rem',
                    background: 'rgba(255,255,255,0.02)',
                    borderRadius: '16px',
                    border: '1px solid transparent',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    cursor: 'grab',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={e => e.currentTarget.style.border = `1px solid ${item.color}44`}
                  onMouseLeave={e => e.currentTarget.style.border = '1px solid transparent'}
                  onClick={() => toast.info(`Added ${item.name} node to canvas.`)}
                >
                  <div style={{ 
                      width: '36px', 
                      height: '36px', 
                      borderRadius: '10px', 
                      background: `${item.color}15`, 
                      color: item.color,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                  }}>
                    {item.icon}
                  </div>
                  <div>
                    <h5 style={{ fontSize: '0.8rem', fontWeight: 700 }}>{item.name}</h5>
                    <p style={{ fontSize: '0.65rem', color: 'var(--text-secondary)' }}>{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ marginTop: '2rem', padding: '1rem', background: 'rgba(255,255,255,0.02)', borderRadius: '16px' }}>
                <p style={{ fontSize: '0.6rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-secondary)', textAlign: 'center', marginBottom: '0.75rem' }}>Workspace Meta</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', marginBottom: '0.5rem' }}>
                    <span>Nodes Active:</span>
                    <span style={{ fontWeight: 700 }}>5 / 50</span>
                </div>
                <div style={{ width: '100%', height: '4px', background: 'rgba(255,255,255,0.05)', borderRadius: '2px' }}>
                    <div style={{ width: '10%', height: '100%', background: 'var(--primary-accent)', borderRadius: '2px' }}></div>
                </div>
            </div>
          </GlassCard>

          <div style={{ 
              background: 'rgba(245, 158, 11, 0.03)', 
              border: '1px solid rgba(245, 158, 11, 0.1)', 
              borderRadius: '20px', 
              padding: '1rem',
              display: 'flex',
              gap: '0.75rem'
          }}>
              <Zap size={18} color="#f59e0b" style={{ flexShrink: 0 }} />
              <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.6)', lineHeight: 1.5 }}>
                  <strong>GPU Acceleration:</strong> Node computation is handled by the CUDA backend (v12.4).
              </p>
          </div>
        </aside>

        {/* Mini Map */}
        <div style={{
            position: 'absolute',
            bottom: '2rem',
            right: '320px',
            width: '120px',
            height: '120px',
            background: 'rgba(15, 23, 42, 0.8)',
            backdropFilter: 'blur(12px)',
            borderRadius: '16px',
            border: '1px solid var(--glass-border)',
            padding: '1rem',
            opacity: 0.5,
            pointerEvents: 'none'
        }}>
            <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                <div style={{ position: 'absolute', top: '10%', left: '10%', width: '20%', height: '10%', background: 'var(--primary-accent)', borderRadius: '2px' }}></div>
                <div style={{ position: 'absolute', top: '40%', left: '40%', width: '25%', height: '15%', background: '#ffb4a4', borderRadius: '2px' }}></div>
                <div style={{ position: 'absolute', top: '40%', right: '5%', width: '30%', height: '15%', background: '#67d9c9', borderRadius: '2px' }}></div>
                <div style={{ position: 'absolute', inset: '5px', border: '1px solid rgba(255,255,255,0.3)', borderRadius: '4px' }}></div>
            </div>
        </div>

      </div>
    </div>
  );
};

export default FeatureEngineeringStudio;

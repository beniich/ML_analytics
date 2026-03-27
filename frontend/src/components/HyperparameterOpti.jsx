import React, { useState } from 'react';
import GlassCard from './common/GlassCard';
import { 
  Zap, 
  Activity, 
  TrendingDown, 
  Cpu, 
  Settings2, 
  BarChart, 
  Maximize2, 
  Filter, 
  Download,
  Play,
  ArrowRight,
  Info
} from 'lucide-react';

const HyperparameterOpti = () => {
  const [activeTab, setActiveTab] = useState('parallel');

  const trials = [
    { id: '#321', lr: '0.00245', batch: '64', decay: '1e-5', status: 'Completed', loss: '0.0412', best: true },
    { id: '#289', lr: '0.00180', batch: '128', decay: '5e-5', status: 'Completed', loss: '0.0425', best: false },
    { id: '#342', lr: '0.00510', batch: '32', decay: '1e-4', status: 'Running', loss: 'evaluating...', best: false },
  ];

  return (
    <div className="hpo-view" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Header Section */}
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: '2rem' }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.65rem', fontWeight: 800, color: 'var(--primary-accent)', background: 'rgba(0, 210, 255, 0.1)', padding: '2px 8px', borderRadius: '4px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Active Session</span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>• Project: ResNet-101 Optimization</span>
          </div>
          <h2 style={{ fontSize: '2.8rem', fontWeight: 800, color: 'white', letterSpacing: '-0.02em', marginBottom: '1rem' }}>Hyperparameter Tuning</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: 1.6, maxWidth: '700px' }}>
            Exploring multidimensional parameter spaces to identify the optimal configuration for loss minimization. Analyzing correlations between learning rates, batch sizes, and weight decay.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <div style={{ background: 'rgba(255,255,255,0.02)', padding: '1.25rem', borderRadius: '16px', border: '1px solid var(--glass-border)', minWidth: '140px' }}>
             <span style={{ fontSize: '0.6rem', fontWeight: 800, color: 'var(--text-secondary)', textTransform: 'uppercase', display: 'block', marginBottom: '0.5rem' }}>Trials</span>
             <div style={{ fontSize: '1.5rem', fontWeight: 800 }}>342<span style={{ fontSize: '0.9rem', color: '#67d9c9', marginLeft: '4px' }}>/500</span></div>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.02)', padding: '1.25rem', borderRadius: '16px', border: '1px solid var(--glass-border)', minWidth: '140px' }}>
             <span style={{ fontSize: '0.6rem', fontWeight: 800, color: 'var(--text-secondary)', textTransform: 'uppercase', display: 'block', marginBottom: '0.5rem' }}>Best Loss</span>
             <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--primary-accent)' }}>0.0412</div>
          </div>
        </div>
      </header>

      {/* Main Analysis Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.8fr 1fr', gap: '1.5rem' }}>
        {/* Parallel Coordinates Plot */}
        <div style={{ 
            background: 'rgba(255,255,255,0.02)', 
            borderRadius: '24px', 
            border: '1px solid var(--glass-border)', 
            padding: '2rem',
            position: 'relative',
            overflow: 'hidden'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2.5rem' }}>
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'white' }}>Parallel Coordinates</h3>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Mapping Trial Configurations to Performance</p>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button style={{ padding: '0.5rem', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: 'none', color: 'white' }}><Filter size={14}/></button>
              <button style={{ padding: '0.5rem', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: 'none', color: 'white' }}><Maximize2 size={14}/></button>
            </div>
          </div>

          <div style={{ height: '280px', position: 'relative', display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '20px' }}>
            {/* Columns Labels */}
            {['Learning Rate', 'Batch Size', 'Weight Decay', 'Optimizer', 'Loss'].map((label, i) => (
                <div key={i} style={{ 
                    position: 'absolute', 
                    left: `${i * 25}%`, 
                    top: '-25px', 
                    fontSize: '0.6rem', 
                    fontWeight: 800, 
                    color: i === 4 ? 'var(--primary-accent)' : 'var(--text-secondary)',
                    textTransform: 'uppercase'
                }}>
                    {label}
                </div>
            ))}
            
            {/* Vertical Axes */}
            {[0, 25, 50, 75, 100].map(x => (
                <div key={x} style={{ position: 'absolute', left: `${x}%`, top: 0, bottom: '20px', width: x === 100 ? '2px' : '1px', background: x === 100 ? 'var(--primary-accent)' : 'rgba(255,255,255,0.1)' }}></div>
            ))}

            {/* SVG Paths */}
            <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
                <path d="M 0 100 L 250 80 L 500 150 L 750 60 L 1000 200" fill="none" stroke="var(--primary-accent)" strokeWidth="3" opacity="0.9" style={{ strokeLinecap: 'round', vectorEffect: 'non-scaling-stroke' }} />
                <path d="M 0 150 L 250 120 L 500 80 L 750 180 L 1000 100" fill="none" stroke="#adc9eb" strokeWidth="1.5" strokeDasharray="4 2" opacity="0.4" />
                <path d="M 0 50 L 250 200 L 500 50 L 750 120 L 1000 140" fill="none" stroke="#adc9eb" strokeWidth="1.5" strokeDasharray="4 2" opacity="0.4" />
            </svg>
          </div>
        </div>

        {/* Training Loss Curve */}
        <div style={{ 
            background: 'rgba(255,255,255,0.02)', 
            borderRadius: '24px', 
            border: '1px solid var(--glass-border)', 
            padding: '1.5rem',
            display: 'flex',
            flexDirection: 'column'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'white' }}>Training Loss</h3>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.65rem' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '2px', background: 'var(--primary-accent)' }}></div>
                    <span style={{ color: 'var(--text-secondary)' }}>Best</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.65rem' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '2px', background: '#43474d' }}></div>
                    <span style={{ color: 'var(--text-secondary)' }}>Avg</span>
                </div>
            </div>
          </div>

          <div style={{ flex: 1, position: 'relative', minHeight: '180px' }}>
             <svg style={{ width: '100%', height: '100%' }} viewBox="0 0 200 120" preserveAspectRatio="none">
                <path d="M 0 80 Q 50 60 100 40 T 200 25" fill="none" stroke="#43474d" strokeWidth="1.5" strokeDasharray="2 2" />
                <path d="M 0 70 Q 50 40 100 20 T 200 10" fill="none" stroke="var(--primary-accent)" strokeWidth="2.5" />
             </svg>
             <div style={{ 
                 position: 'absolute', 
                 top: 0, 
                 right: 0, 
                 background: 'rgba(30, 41, 59, 0.8)', 
                 padding: '0.5rem 0.75rem', 
                 borderRadius: '10px', 
                 border: '1px solid var(--glass-border)',
                 backdropFilter: 'blur(8px)'
             }}>
                <span style={{ display: 'block', fontSize: '0.6rem', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 800 }}>Latest Trial</span>
                <span style={{ fontSize: '0.9rem', fontWeight: 800 }}>Loss: 0.0384</span>
             </div>
          </div>

          <div style={{ marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
             <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '0.5rem' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Convergence Rate</span>
                <span style={{ color: '#67d9c9', fontWeight: 700 }}>+12.4%</span>
             </div>
             <div style={{ width: '100%', height: '4px', background: 'rgba(255,255,255,0.05)', borderRadius: '2px' }}>
                <div style={{ width: '75%', height: '100%', background: '#67d9c9', borderRadius: '2px' }}></div>
             </div>
          </div>
        </div>
      </div>

      {/* Trials Table */}
      <GlassCard title="Top Trial Configurations">
        <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                    <tr style={{ background: 'rgba(255,255,255,0.01)', color: 'var(--text-secondary)', fontSize: '0.65rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                        <th style={{ padding: '1rem 1.5rem' }}>Trial ID</th>
                        <th style={{ padding: '1rem 1.5rem' }}>Learning Rate</th>
                        <th style={{ padding: '1rem 1.5rem' }}>Batch Size</th>
                        <th style={{ padding: '1rem 1.5rem' }}>Weight Decay</th>
                        <th style={{ padding: '1rem 1.5rem' }}>Status</th>
                        <th style={{ padding: '1rem 1.5rem', textAlign: 'right' }}>Loss Score</th>
                    </tr>
                </thead>
                <tbody style={{ fontSize: '0.85rem' }}>
                    {trials.map((trial, idx) => (
                        <tr key={idx} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)', background: trial.best ? 'rgba(0, 210, 255, 0.02)' : 'transparent' }}>
                            <td style={{ padding: '1rem 1.5rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: trial.status === 'Completed' ? '#67d9c9' : 'var(--primary-accent)' }}></div>
                                    <span style={{ fontWeight: 700 }}>{trial.id}</span>
                                </div>
                            </td>
                            <td style={{ padding: '1rem 1.5rem', color: 'var(--text-secondary)' }}>{trial.lr}</td>
                            <td style={{ padding: '1rem 1.5rem', color: 'var(--text-secondary)' }}>{trial.batch}</td>
                            <td style={{ padding: '1rem 1.5rem', color: 'var(--text-secondary)' }}>{trial.decay}</td>
                            <td style={{ padding: '1rem 1.5rem' }}>
                                <span style={{ fontSize: '0.65rem', fontWeight: 800, padding: '0.25rem 0.6rem', borderRadius: '4px', background: trial.status === 'Completed' ? 'rgba(103, 217, 201, 0.1)' : 'rgba(0, 210, 255, 0.1)', color: trial.status === 'Completed' ? '#67d9c9' : 'var(--primary-accent)', textTransform: 'uppercase' }}>
                                    {trial.status}
                                </span>
                            </td>
                            <td style={{ padding: '1rem 1.5rem', textAlign: 'right', fontWeight: 800, color: trial.best ? 'var(--primary-accent)' : 'white' }}>
                                {trial.loss}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
      </GlassCard>

      {/* Suggested refinement */}
      <div style={{ 
          background: 'linear-gradient(135deg, rgba(0, 210, 255, 0.1) 0%, transparent 100%)', 
          borderRadius: '24px', 
          padding: '2rem', 
          border: '1px solid rgba(0, 210, 255, 0.2)',
          display: 'flex',
          gap: '1.5rem',
          alignItems: 'center'
      }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(0, 210, 255, 0.1)', display: 'flex', alignItems: 'center', justifyCenter: 'center', flexShrink: 0 }}>
             <Zap size={24} color="var(--primary-accent)" fill="var(--primary-accent)" style={{ margin: 'auto' }} />
          </div>
          <div style={{ flex: 1 }}>
              <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'white', marginBottom: '0.5rem' }}>Curated Hyperparameter Suggestion</h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                  ADAM with Weight Decay (1e-5) is consistently outperforming SGD. We recommend narrowing the Learning Rate search space to <strong style={{ color: 'white' }}>[0.001, 0.005]</strong> for the next 100 trials.
              </p>
          </div>
          <button className="btn-primary" style={{ flexShrink: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              Refine Space <ArrowRight size={16} />
          </button>
      </div>

    </div>
  );
};

export default HyperparameterOpti;

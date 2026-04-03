import React, { useState } from 'react';
import GlassCard from './common/GlassCard';
import { 
  BarChart3, 
  Binary, 
  Cpu, 
  Zap, 
  Activity, 
  CheckCircle2, 
  ChevronRight, 
  Plus, 
  Play, 
  Layers,
  Search,
  ArrowUpRight
} from 'lucide-react';
import { toast } from 'react-toastify';
import ApiService from '../services/api';

const ModelBenchmarkComparison = () => {
  const [selectedModels, setSelectedModels] = useState(['XGBoost (Primary)', 'Random Forest']);
  const [isBenchmarking, setIsBenchmarking] = useState(false);
  const [isComparing, setIsComparing] = useState(false);

  const metrics = [
    { name: 'XGBoost (Primary)', r2: '0.945', rmse: '0.021', time: '1h 45m', status: 'Completed', color: '#ffb4a4' },
    { name: 'Random Forest', r2: '0.892', rmse: '0.045', time: '45m', status: 'Completed', color: 'var(--primary-accent)' },
    { name: 'Linear Regression', r2: '0.883', rmse: '0.028', time: '25m', status: 'Completed', color: '#67d9c9' },
    { name: 'Neural Network v2', r2: '0.958', rmse: '0.015', time: '6h 12m', status: 'Completed', color: '#adc9eb' },
  ];

  const handleBenchmark = async () => {
    setIsBenchmarking(true);
    try {
      await new Promise(res => setTimeout(res, 2500));
      toast.success('Benchmark suite executed successfully across 4 architectures.');
    } catch (e) {
      toast.error('Benchmark suite failed.');
    } finally {
      setIsBenchmarking(false);
    }
  };

  const handleCompare = async () => {
    setIsComparing(true);
    try {
      await new Promise(res => setTimeout(res, 1000));
      toast.success('Comparison visualizers updated.');
    } catch (e) {
      toast.error('Failed to compare.');
    } finally {
      setIsComparing(false);
    }
  };

  return (
    <div className="benchmark-view" style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
      {/* Header */}
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <h2 style={{ fontSize: '2.5rem', fontWeight: 800, color: 'white', marginBottom: '0.5rem', letterSpacing: '-0.02em' }}>Model Benchmarking</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>Comparative analysis of model architectural performance and validation metrics.</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
            <button onClick={() => toast.info('Model selection modal opened')} className="btn-primary" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--glass-border)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Plus size={18} /> Select Models
            </button>
            <button 
                className="btn-primary" 
                onClick={handleBenchmark}
                disabled={isBenchmarking}
                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
            >
                <Play size={18} /> {isBenchmarking ? 'Running Benchmarks...' : 'Run New Benchmark'}
            </button>
        </div>
      </header>

      {/* Main Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '1.5rem' }}>
          
          {/* Comparison Tools Sidebar */}
          <div style={{ background: 'rgba(255,255,255,0.02)', padding: '2rem', borderRadius: '32px', border: '1px solid var(--glass-border)' }}>
              <h3 style={{ fontSize: '0.65rem', fontWeight: 800, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '2rem' }}>Comparison Sets</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  <div style={{ padding: '1.25rem', borderRadius: '20px', border: '1px solid var(--primary-accent)', background: 'rgba(0, 210, 255, 0.05)' }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'white', display: 'block', marginBottom: '0.5rem' }}>Production Baseline</span>
                      <div style={{ display: 'flex', gap: '4px' }}>
                          <div style={{ px: '8px', py: '2px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', fontSize: '0.6rem', color: 'var(--text-secondary)' }}>XGBoost</div>
                          <div style={{ px: '8px', py: '2px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', fontSize: '0.6rem', color: 'var(--text-secondary)' }}>RF</div>
                      </div>
                  </div>
                  <div style={{ padding: '1.25rem', borderRadius: '20px', border: '1px solid var(--glass-border)', background: 'rgba(255,255,255,0.01)', opacity: 0.6 }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'white', display: 'block', marginBottom: '0.5rem' }}>Neural Architecture Search</span>
                      <div style={{ display: 'flex', gap: '4px' }}>
                          <div style={{ px: '8px', py: '2px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', fontSize: '0.6rem', color: 'var(--text-secondary)' }}>Transformer</div>
                          <div style={{ px: '8px', py: '2px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', fontSize: '0.6rem', color: 'var(--text-secondary)' }}>CNN</div>
                      </div>
                  </div>
              </div>
              <button 
                  className="btn-primary" 
                  onClick={handleCompare}
                  disabled={isComparing}
                  style={{ width: '100%', marginTop: '3rem', background: 'var(--primary-accent)', color: 'black', fontWeight: 900 }}
              >
                  {isComparing ? 'COMPARING...' : 'COMPARE SELECTED'}
              </button>
          </div>

          {/* Performance Trend Chart */}
          <div style={{ background: 'rgba(255,255,255,0.02)', padding: '2.5rem', borderRadius: '32px', border: '1px solid var(--glass-border)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'white' }}>Validation Loss Over Epochs</h3>
                  <div style={{ display: 'flex', gap: '1rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem' }}>
                          <div style={{ width: '10px', height: '2px', background: '#ffb4a4' }}></div>
                          <span style={{ color: 'var(--text-secondary)' }}>XGBoost</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem' }}>
                          <div style={{ width: '10px', height: '2px', background: 'var(--primary-accent)' }}></div>
                          <span style={{ color: 'var(--text-secondary)' }}>Random Forest</span>
                      </div>
                  </div>
              </div>
              <div style={{ height: '300px', width: '100%', position: 'relative', paddingLeft: '40px', paddingBottom: '30px' }}>
                  {/* Grid lines */}
                  <div style={{ position: 'absolute', inset: '0 0 30px 40px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                      {[1, 2, 3, 4, 5].map(i => <div key={i} style={{ width: '100%', height: '1px', background: 'rgba(255,255,255,0.02)' }}></div>)}
                  </div>
                  {/* Chart Lines */}
                  <svg viewBox="0 0 1000 300" preserveAspectRatio="none" style={{ width: '100%', height: '100%', overflow: 'visible' }}>
                      <path d="M 0,300 L 100,200 L 200,100 L 300,50 L 400,30 L 1000,10" fill="none" stroke="#ffb4a4" strokeWidth="3" />
                      <path d="M 0,300 L 100,280 L 200,240 L 300,180 L 400,160 L 1000,140" fill="none" stroke="var(--primary-accent)" strokeWidth="3" />
                  </svg>
                  {/* Axes labels */}
                  <div style={{ position: 'absolute', left: 0, top: 0, bottom: '30px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', fontSize: '0.65rem', color: 'var(--text-secondary)' }}>
                      <span>1.0</span><span>0.5</span><span>0.0</span>
                  </div>
                  <div style={{ position: 'absolute', bottom: 0, left: '40px', right: 0, display: 'flex', justifyContent: 'space-between', fontSize: '0.65rem', color: 'var(--text-secondary)' }}>
                      <span>0 EP</span><span>50 EP</span><span>100 EP</span>
                  </div>
              </div>
          </div>
      </div>

      {/* Metrics Table */}
      <GlassCard title="Metrics Summary - Validation Set">
          <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                  <thead>
                      <tr style={{ color: 'var(--text-secondary)', fontSize: '0.65rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                          <th style={{ padding: '1.25rem 2rem' }}>Model Architecture</th>
                          <th style={{ padding: '1.25rem 1.5rem' }}>R2 Score</th>
                          <th style={{ padding: '1.25rem 1.5rem' }}>RMSE Metric</th>
                          <th style={{ padding: '1.25rem 1.5rem' }}>Training Duration</th>
                          <th style={{ padding: '1.25rem 1.5rem', textAlign: 'right' }}>Status</th>
                      </tr>
                  </thead>
                  <tbody style={{ fontSize: '0.9rem' }}>
                      {metrics.map((m, idx) => (
                          <tr key={idx} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', background: m.name.includes('Primary') ? 'rgba(255, 180, 164, 0.05)' : 'transparent' }}>
                              <td style={{ padding: '1.5rem 2rem' }}>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                      <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: m.color }}></div>
                                      <span style={{ fontWeight: 700, color: 'white' }}>{m.name}</span>
                                  </div>
                              </td>
                              <td style={{ padding: '1.5rem 1.5rem', fontFamily: 'monospace', color: 'var(--primary-accent)' }}>{m.r2}</td>
                              <td style={{ padding: '1.5rem 1.5rem', fontFamily: 'monospace', color: 'var(--text-secondary)' }}>{m.rmse}</td>
                              <td style={{ padding: '1.5rem 1.5rem', color: 'var(--text-secondary)' }}>{m.time}</td>
                              <td style={{ padding: '1.5rem 1.5rem', textAlign: 'right' }}>
                                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: '#67d9c9', fontWeight: 700, fontSize: '0.8rem' }}>
                                      <CheckCircle2 size={16} /> Completed
                                  </div>
                              </td>
                          </tr>
                      ))}
                  </tbody>
              </table>
          </div>
      </GlassCard>
    </div>
  );
};

export default ModelBenchmarkComparison;

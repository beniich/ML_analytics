import React, { useState } from 'react';
import GlassCard from './common/GlassCard';
import { 
  Zap, 
  Target, 
  Cpu, 
  BarChart3, 
  Play, 
  CheckCircle2, 
  Settings2, 
  BrainCircuit, 
  Clock, 
  Database,
  ArrowRight,
  Sparkles,
  Search
} from 'lucide-react';

const AutoMLFlow = () => {
  const [step, setStep] = useState(2);
  const [objective, setObjective] = useState('regression');
  const [speed, setSpeed] = useState(50);

  const objectives = [
    { id: 'regression', label: 'Regression', sub: 'Predict continuous values', icon: <Activity size={24} />, color: '#adc9eb' },
    { id: 'classification', label: 'Classification', sub: 'Categorize inputs', icon: <Layers size={24} />, color: '#67d9c9' },
    { id: 'time-series', label: 'Time-Series', sub: 'Forecast sequences', icon: <TrendingUp size={24} />, color: 'var(--primary-accent)' },
    { id: 'nlp', label: 'NLP Analysis', sub: 'Process textual data', icon: <BarChart3 size={24} />, color: '#ffb4a4' },
  ];

  return (
    <div className="automl-flow-view" style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
      {/* Header */}
      <header>
        <span style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--primary-accent)', textTransform: 'uppercase', letterSpacing: '0.2em' }}>Automated Workflow</span>
        <h2 style={{ fontSize: '2.5rem', fontWeight: 800, color: 'white', marginBottom: '0.5rem', letterSpacing: '-0.02em' }}>AutoML Architect</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', maxWidth: '800px' }}>
          Let the Curator engine find the optimal architecture for your objectives. Follow the 3-step wizard to launch your search.
        </p>
      </header>

      {/* Progress Tracker */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', maxWidth: '600px', marginBottom: '1rem' }}>
          {[
            { id: 1, label: 'Select Data' },
            { id: 2, label: 'Define Goal' },
            { id: 3, label: 'Run Search' }
          ].map((s, i) => (
             <React.Fragment key={s.id}>
                <div style={{ display: 'flex', flexDirection: 'column', itemsCenter: 'center', gap: '0.5rem' }}>
                    <div style={{ 
                        width: '40px', 
                        height: '40px', 
                        borderRadius: '50%', 
                        background: step > s.id ? 'var(--primary-accent)' : step === s.id ? 'rgba(0, 210, 255, 0.1)' : 'rgba(255,255,255,0.05)', 
                        border: `2px solid ${step >= s.id ? 'var(--primary-accent)' : 'var(--glass-border)'}`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: step > s.id ? 'black' : 'white',
                        fontWeight: 800
                    }}>
                        {step > s.id ? <CheckCircle2 size={20} /> : s.id}
                    </div>
                    <span style={{ fontSize: '0.6rem', fontWeight: 800, color: step >= s.id ? 'white' : 'var(--text-secondary)', textTransform: 'uppercase' }}>{s.label}</span>
                </div>
                {i < 2 && <div style={{ flex: 1, height: '2px', background: step > s.id ? 'var(--primary-accent)' : 'rgba(255,255,255,0.05)', marginBottom: '1.5rem' }}></div>}
             </React.Fragment>
          ))}
      </div>

      {/* Main Wizard Content */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.8fr) 1fr', gap: '1.5rem' }}>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {/* Objective Selection */}
              <div style={{ background: 'rgba(255,255,255,0.02)', padding: '2.5rem', borderRadius: '32px', border: '1px solid var(--glass-border)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2.5rem' }}>
                      <Target size={24} color="var(--primary-accent)" />
                      <h3 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'white' }}>Primary Objective</h3>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                      {objectives.map((obj) => (
                          <div 
                            key={obj.id} 
                            onClick={() => setObjective(obj.id)}
                            style={{ 
                                padding: '1.5rem', 
                                borderRadius: '20px', 
                                border: `1px solid ${objective === obj.id ? 'var(--primary-accent)' : 'var(--glass-border)'}`,
                                background: objective === obj.id ? 'rgba(0, 210, 255, 0.05)' : 'rgba(255,255,255,0.01)',
                                cursor: 'pointer',
                                transition: 'all 0.2s',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '0.5rem',
                                position: 'relative'
                            }}
                          >
                              <div style={{ color: obj.color }}>{obj.icon}</div>
                              <span style={{ fontWeight: 700, color: 'white' }}>{obj.label}</span>
                              <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{obj.sub}</span>
                              {objective === obj.id && <div style={{ position: 'absolute', top: '1rem', right: '1rem', width: '12px', height: '12px', background: 'var(--primary-accent)', borderRadius: '50%' }}></div>}
                          </div>
                      ))}
                  </div>
              </div>

              {/* Target Variable */}
              <div style={{ background: 'rgba(255,255,255,0.02)', padding: '2.5rem', borderRadius: '32px', border: '1px solid var(--glass-border)' }}>
                   <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2.5rem' }}>
                      <Settings2 size={24} color="#67d9c9" />
                      <h3 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'white' }}>Target Parameter</h3>
                  </div>
                  <div style={{ padding: '1.25rem', borderRadius: '16px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--primary-accent)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                          <Database size={20} color="var(--primary-accent)" />
                          <div>
                              <span style={{ fontSize: '0.65rem', color: 'var(--primary-accent)', fontWeight: 800, textTransform: 'uppercase' }}>Selected Column</span>
                              <div style={{ fontWeight: 700, color: 'white', fontSize: '1.1rem' }}>customer_churn_probability</div>
                          </div>
                      </div>
                      <button style={{ color: 'var(--primary-accent)', background: 'transparent', border: 'none', fontWeight: 800, fontSize: '0.8rem' }}>CHANGE</button>
                  </div>
              </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {/* Optimization Settings */}
              <div style={{ background: 'rgba(255,255,255,0.02)', padding: '2.5rem', borderRadius: '32px', border: '1px solid var(--glass-border)' }}>
                   <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2.5rem' }}>
                      <Zap size={24} color="#ffb4a4" />
                      <h3 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'white' }}>Search Intensity</h3>
                  </div>
                  <div style={{ marginBottom: '2rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)', fontSize: '0.7rem', marginBottom: '0.5rem', fontWeight: 800 }}>
                          <span>BALANCED</span>
                          <span>~14 MINS</span>
                      </div>
                      <input 
                        type="range" 
                        min="1" max="100" 
                        value={speed} 
                        onChange={(e) => setSpeed(e.target.value)}
                        style={{ width: '100%', accentColor: 'var(--primary-accent)' }}
                      />
                      <div style={{ display: 'flex', justifyContent: 'space-between', color: 'rgba(255,255,255,0.2)', fontSize: '0.6rem', marginTop: '0.5rem', fontWeight: 800 }}>
                          <span>FAST</span>
                          <span>DEEP SEARCH</span>
                      </div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                      {[
                        { label: 'Validation Split', val: '20%' },
                        { label: 'Evaluation Metric', val: 'Log-Loss' },
                        { label: 'Max Runtime', val: '30 mins' },
                      ].map((item, i) => (
                        <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem', borderRadius: '10px', background: 'rgba(255,255,255,0.02)' }}>
                            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{item.label}</span>
                            <span style={{ fontSize: '0.8rem', color: 'white', fontWeight: 700 }}>{item.val}</span>
                        </div>
                      ))}
                  </div>
              </div>

              {/* Next Step Action */}
              <div style={{ background: 'linear-gradient(145deg, rgba(0, 210, 255, 0.1), rgba(103, 217, 201, 0.05))', padding: '2.5rem', borderRadius: '32px', border: '1px solid rgba(0, 210, 255, 0.2)', textAlign: 'center' }}>
                  <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'var(--primary-accent)', color: 'black', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
                      <Play size={32} />
                  </div>
                  <h4 style={{ color: 'white', fontWeight: 800, fontSize: '1.25rem' }}>Ready for Search</h4>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '0.5rem', marginBottom: '2rem' }}>Step 2 complete. Ready to finalize parameters.</p>
                  <button className="btn-primary" style={{ width: '100%', padding: '1rem', fontSize: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem' }}>
                    Next: Finalize & Run <ArrowRight size={20} />
                  </button>
              </div>
          </div>

      </div>

      {/* Footer Status */}
      <footer style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '2rem', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
          <div style={{ display: 'flex', gap: '2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.75rem' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#67d9c9', boxShadow: '0 0 10px #67d9c9' }}></div>
                  <span style={{ fontWeight: 800 }}>ENGINE: READY</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.75rem' }}>
                  <Cpu size={16} />
                  <span>CLUSTER LOAD: 24%</span>
              </div>
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontStyle: 'italic' }}>Compliant with Enterprise Governance v2.4</span>
      </footer>

      {/* Magic FAB */}
      <button style={{ 
          position: 'fixed', 
          bottom: '2rem', 
          right: '2rem', 
          width: '56px', 
          height: '56px', 
          borderRadius: '50%', 
          background: 'var(--primary-accent)', 
          color: 'black', 
          border: 'none', 
          boxShadow: '0 10px 30px rgba(0, 210, 255, 0.3)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer'
      }}>
          <Sparkles size={24} />
      </button>

    </div>
  );
};

export default AutoMLFlow;

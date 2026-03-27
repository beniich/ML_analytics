import React, { useState } from 'react';
import GlassCard from './common/GlassCard';
import { 
  ArrowRight, 
  Search, 
  Trash2, 
  BarChart2, 
  Layers, 
  CheckCircle, 
  Clock, 
  Info 
} from 'lucide-react';

const VisualDataTransformation = () => {
  const [pipelineStep, setPipelineStep] = useState(2);
  const [searchTerm, setSearchTerm] = useState('');

  const transformations = [
    { id: 1, name: 'Drop Missing Values', desc: 'Identify and remove rows with null entries.', icon: <Trash2 size={16} />, type: 'Simple' },
    { id: 2, name: 'Normalize Data', desc: 'Scale numeric features to [0, 1] range.', icon: <BarChart2 size={16} />, type: 'Statistical', active: true },
    { id: 3, name: 'One-Hot Encode', desc: 'Convert categorical features into binary vectors.', icon: <Layers size={16} />, type: 'Engineering' },
  ];

  return (
    <div className="transformation-view" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 700, color: 'var(--primary-accent)' }}>Visual Data Transformation</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Clean and prepare your dataset for ML training</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button className="btn-primary" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)' }}>View History</button>
          <button className="btn-primary">Apply & Proceed <ArrowRight size={16} style={{ marginLeft: '0.5rem' }} /></button>
        </div>
      </header>

      <div className="transformation-grid" style={{ display: 'grid', gridTemplateColumns: '300px 300px 1fr', gap: '2rem' }}>
        
        {/* Transformation Pipeline */}
        <GlassCard title="Pipeline" icon={<Clock />} status="v1.2">
          <div className="steps-list" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <div className={`step-item ${pipelineStep > 1 ? 'done' : ''}`} style={{ padding: '1rem', borderRadius: '10px', background: 'rgba(255,255,255,0.02)', display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '0.9rem' }}>1. Load Data</span>
              {pipelineStep > 1 && <CheckCircle size={14} color="#10b981" />}
            </div>
            <div className={`step-item active`} style={{ padding: '1rem', borderRadius: '10px', background: 'rgba(0, 210, 255, 0.1)', border: '1px solid var(--primary-accent)', display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--primary-accent)' }}>2. Data Cleaning</span>
              <span style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase' }}>Active</span>
            </div>
            <div className={`step-item`} style={{ padding: '1rem', borderRadius: '10px', background: 'rgba(255,255,255,0.01)', opacity: 0.4, display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '0.9rem' }}>3. Feature Engineering</span>
            </div>
          </div>
        </GlassCard>

        {/* Available Transforms */}
        <GlassCard title="Transformations" icon={<Layers />}>
          <div className="search-box" style={{ position: 'relative', marginBottom: '1.5rem' }}>
            <Search size={14} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
            <input 
              type="text" 
              placeholder="Search functions..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ width: '100%', paddingLeft: '2.5rem', background: 'rgba(0,0,0,0.2)' }}
            />
          </div>
          <div className="transform-list" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {transformations.map(t => (
              <div 
                key={t.id} 
                className={`transform-card ${t.active ? 'active' : ''}`}
                style={{
                  padding: '1rem',
                  borderRadius: '12px',
                  background: t.active ? 'rgba(0, 210, 255, 0.05)' : 'rgba(255,255,255,0.02)',
                  border: `1px solid ${t.active ? 'var(--primary-accent)' : 'var(--glass-border)'}`,
                  cursor: 'pointer'
                }}
              >
                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                  <div style={{ padding: '0.5rem', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', color: t.active ? 'var(--primary-accent)' : 'white' }}>
                    {t.icon}
                  </div>
                  <div>
                    <h4 style={{ fontSize: '0.85rem', fontWeight: 600 }}>{t.name}</h4>
                    <p style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>{t.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>

        {/* Distribution Preview */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <GlassCard title="Distribution Preview (Before vs After)" icon={<BarChart2 />} status="Live">
            <div style={{ display: 'flex', gap: '2rem', height: '100%' }}>
              
              {/* Before */}
              <div style={{ flex: 1, padding: '1rem', borderRight: '1px solid var(--glass-border)' }}>
                <p style={{ textAlign: 'center', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>ORIGINAL DATA (BEFORE)</p>
                <div style={{ height: '150px', display: 'flex', alignItems: 'end', gap: '4px' }}>
                  {[40, 75, 85, 45, 95, 35, 30, 25, 15, 10, 90].map((h, i) => (
                    <div key={i} style={{ flex: 1, height: `${h}%`, background: 'rgba(255,255,255,0.1)', borderRadius: '2px 2px 0 0' }}></div>
                  ))}
                </div>
                <div style={{ borderTop: '1px solid var(--glass-border)', marginTop: '4px', textAlign: 'center', fontSize: '0.6rem', padding: '0.5rem' }}>Age (Distorted)</div>
              </div>

              {/* After */}
              <div style={{ flex: 1, padding: '1rem' }}>
                <p style={{ textAlign: 'center', fontSize: '0.75rem', fontWeight: 600, color: 'var(--primary-accent)', marginBottom: '1.5rem' }}>TRANSFORMED DATA (AFTER)</p>
                <div style={{ height: '150px', position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'end' }}>
                  <svg width="100%" height="100%" viewBox="0 0 200 100" style={{ position: 'absolute' }}>
                    <path d="M0,100 Q50,100 100,20 T100,20 Q150,100 200,100" fill="rgba(0, 210, 255, 0.1)" stroke="var(--primary-accent)" strokeWidth="2" />
                  </svg>
                  <div style={{ width: '100%', display: 'flex', alignItems: 'end', gap: '4px', zIndex: 1, padding: '0 10px' }}>
                    {[10, 20, 40, 60, 75, 80, 75, 55, 30, 15].map((h, i) => (
                      <div key={i} style={{ flex: 1, height: `${h}%`, background: 'rgba(0, 210, 255, 0.2)', borderRadius: '2px 2px 0 0' }}></div>
                    ))}
                  </div>
                </div>
                <div style={{ borderTop: '1px solid var(--glass-border)', marginTop: '4px', textAlign: 'center', fontSize: '0.6rem', padding: '0.5rem' }}>Age (Normalized)</div>
              </div>

            </div>
          </GlassCard>

          {/* Table Preview */}
          <GlassCard title="Data Preview" status="Top 5 Rows">
             <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--glass-border)', textAlign: 'left', color: 'var(--text-secondary)' }}>
                    <th style={{ padding: '0.75rem' }}>ID</th>
                    <th style={{ padding: '0.75rem' }}>Age (Norm)</th>
                    <th style={{ padding: '0.75rem' }}>Income</th>
                    <th style={{ padding: '0.75rem' }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { id: 1001, age: '0.45', income: '$75k', status: 'Clean' },
                    { id: 1002, age: '0.22', income: '$45k', status: 'Clean' },
                    { id: 1003, age: '0.89', income: '$120k', status: 'Clean' },
                  ].map(row => (
                    <tr key={row.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.02)' }}>
                      <td style={{ padding: '0.75rem' }}>{row.id}</td>
                      <td style={{ padding: '0.75rem', color: 'var(--primary-accent)', fontWeight: 600 }}>{row.age}</td>
                      <td style={{ padding: '0.75rem' }}>{row.income}</td>
                      <td style={{ padding: '0.75rem' }}>
                        <span style={{ fontSize: '0.65rem', padding: '0.2rem 0.5rem', background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', borderRadius: '4px' }}>
                          {row.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
             </table>
          </GlassCard>
        </div>

      </div>
      
      <div style={{ padding: '1rem', background: 'rgba(245, 158, 11, 0.05)', border: '1px solid rgba(245, 158, 11, 0.2)', borderRadius: '12px', display: 'flex', gap: '1rem', alignItems: 'center' }}>
         <Info size={20} color="#f59e0b" />
         <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.8)' }}>
           <strong>Security Tip:</strong> Transformation pipelines are versioned. Any data export will be audited and logged according to the platform security guidelines.
         </p>
      </div>
    </div>
  );
};

export default VisualDataTransformation;

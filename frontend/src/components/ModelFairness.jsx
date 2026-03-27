import React from 'react';
import GlassCard from './common/GlassCard';
import { 
  Scale, 
  ShieldAlert, 
  BarChart2, 
  Activity, 
  FileText, 
  ArrowRight,
  TrendingDown,
  Info,
  Map,
  CreditCard,
  Zap
} from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const ModelFairness = () => {
  const barData = {
    labels: ['Group A', 'Group B', 'Group C', 'Group D', 'Group E'],
    datasets: [{
      label: 'Approval Rate',
      data: [85, 42, 78, 92, 30],
      backgroundColor: (context) => {
        const val = context.dataset.data[context.dataIndex];
        return val < 50 ? 'rgba(239, 68, 68, 0.6)' : 'rgba(0, 210, 255, 0.6)';
      },
      borderRadius: 8,
    }]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      y: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: 'rgba(255,255,255,0.5)', font: { size: 10 } } },
      x: { grid: { display: false }, ticks: { color: 'rgba(255,255,255,0.5)', font: { size: 10 } } }
    }
  };

  return (
    <div className="model-fairness-view" style={{ display: 'flex', flexDirection: 'column', gap: '3rem', height: '100%', overflowY: 'auto', paddingBottom: '3rem' }}>
      
      {/* Page Header */}
      <section style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--primary-accent)' }}>
             <Activity size={18} />
             <span style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '2px' }}>Diagnostic Report</span>
          </div>
          <h2 style={{ fontSize: '2.5rem', fontWeight: 900, letterSpacing: '-1px' }}>Model Bias & Fairness</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', maxWidth: '650px' }}>
            Analyzing disparate impact across protected demographic groups for <span style={{ color: 'var(--primary-accent)', fontWeight: 700 }}>Credit_Risk_v4.2</span>.
          </p>
        </div>
        <div style={{ textAlign: 'right' }}>
           <div style={{ fontSize: '4rem', fontWeight: 900, color: 'var(--primary-accent)', lineHeight: 1 }}>32 <span style={{ fontSize: '1.5rem', color: 'var(--text-secondary)' }}>/ 50</span></div>
           <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Overall Fairness Score</p>
        </div>
      </section>

      {/* Main Bento Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '2rem' }}>
        
        {/* Large Chart Card */}
        <GlassCard style={{ gridColumn: 'span 8', padding: '2rem', position: 'relative', overflow: 'hidden' }}>
           <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2.5rem' }}>
              <div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '0.25rem' }}>Disparate Impact Distribution</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Approval rate variance across defined demographic slices</p>
              </div>
              <span style={{ fontSize: '0.65rem', fontWeight: 800, padding: '0.2rem 0.6rem', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '20px' }}>LIVE DATA</span>
           </div>
           <div style={{ height: '250px' }}>
              <Bar data={barData} options={options} />
           </div>
        </GlassCard>

        {/* Parity Difference Card */}
        <GlassCard style={{ gridColumn: 'span 4', padding: '2rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
           <div>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(0, 210, 255, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary-accent)', marginBottom: '1.5rem' }}>
                 <Scale size={24} />
              </div>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '1rem', lineHeight: 1.2 }}>Statistical Parity Difference</h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                The model currently favors <span style={{ color: 'white', fontWeight: 700 }}>Group D</span> over <span style={{ color: '#ef4444', fontWeight: 700 }}>Group E</span> by a margin of 62%, exceeding regulatory thresholds.
              </p>
           </div>
           <button style={{ background: 'transparent', border: 'none', color: 'var(--primary-accent)', fontSize: '0.85rem', fontWeight: 700, padding: 0, display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', marginTop: '2rem' }}>
              View mitigation strategies <ArrowRight size={16} />
           </button>
        </GlassCard>

        {/* Bias Vectors */}
        <GlassCard title="Bias Vectors" style={{ gridColumn: 'span 5', padding: '2rem' }}>
           <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginTop: '1rem' }}>
              {[
                { label: 'Age (Senior vs Junior)', val: '+12.4%', color: 'var(--primary-accent)' },
                { label: 'Postal Code Entropy', val: '-3.1%', color: '#10b981' },
                { label: 'Gender Parity Index', val: '+24.8%', color: '#ef4444' }
              ].map((v, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                   <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: v.color }}></div>
                      <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>{v.label}</span>
                   </div>
                   <span style={{ fontSize: '1rem', fontWeight: 800, color: v.color }}>{v.val}</span>
                </div>
              ))}
           </div>
        </GlassCard>

        {/* Fairness Thresholds */}
        <GlassCard title="Fairness Thresholds" style={{ gridColumn: 'span 7', padding: '2rem' }}>
           <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginTop: '1rem' }}>
              {[
                { label: 'FPR', current: 65, baseline: 80 },
                { label: 'FNR', current: 82, baseline: 70 },
                { label: 'EOP', current: 44, baseline: 50 },
              ].map((t, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                   <div style={{ width: '40px', fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-secondary)' }}>{t.label}</div>
                   <div style={{ flex: 1, height: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', position: 'relative' }}>
                      <div style={{ position: 'absolute', top: 0, left: 0, height: '100%', width: `${t.baseline}%`, borderRadius: '4px', border: '1px dashed rgba(255,255,255,0.2)' }}></div>
                      <div style={{ position: 'absolute', top: 0, left: 0, height: '100%', width: `${t.current}%`, borderRadius: '4px', background: 'var(--primary-accent)', boxShadow: '0 0 10px rgba(0, 210, 255, 0.3)' }}></div>
                   </div>
                   <div style={{ width: '40px', textAlign: 'right', fontSize: '0.85rem', fontWeight: 800 }}>{(t.current / 100).toFixed(2)}</div>
                </div>
              ))}
              <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
                 <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div style={{ width: '10px', height: '10px', borderRadius: '2px', border: '1px dashed rgba(255,255,255,0.5)' }}></div>
                    <span style={{ fontSize: '0.65rem', color: 'var(--text-secondary)', fontWeight: 800 }}>BASELINE</span>
                 </div>
                 <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div style={{ width: '10px', height: '10px', borderRadius: '2px', background: 'var(--primary-accent)' }}></div>
                    <span style={{ fontSize: '0.65rem', color: 'var(--text-secondary)', fontWeight: 800 }}>CURRENT</span>
                 </div>
              </div>
           </div>
        </GlassCard>

      </div>

      {/* Proxy Insights Section */}
      <section style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
         <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: '1.8rem', fontWeight: 900 }}>Proxy Detection Insights</h3>
            <button className="btn-primary" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', fontSize: '0.75rem', padding: '0.6rem 1.2rem' }}>Export Full Audit</button>
         </div>
         <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '2rem' }}>
            <ProxyCard 
              icon={<Map size={24} />} 
              level="High Risk" 
              levelColor="#ef4444" 
              title="Zip_Code_802" 
              desc="Strong correlation detected between geographical markers and protected race attributes." 
              action="Recommended: Exclude" 
            />
            <ProxyCard 
              icon={<CreditCard size={24} />} 
              level="Neutral" 
              levelColor="#10b981" 
              title="Years_Credit_History" 
              desc="Fair distribution across all monitored demographic groups within expected variance." 
              action="Safe Feature" 
            />
            <ProxyCard 
              icon={<ShieldAlert size={24} />} 
              level="Action Required" 
              levelColor="#f59e0b" 
              title="Employment_Length" 
              desc="Identified as a secondary proxy for age-based disparate treatment in sub-optimal scoring." 
              action="Action: Re-weighting" 
            />
         </div>
      </section>

      {/* Floating Action Button */}
      <div style={{ position: 'fixed', bottom: '2rem', right: '2rem', zIndex: 100 }}>
         <button className="btn-primary" style={{ height: '60px', padding: '0 2rem', borderRadius: '30px', background: 'linear-gradient(90deg, #00d2ff 0%, #3a7bd5 100%)', border: 'none', boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5)', display: 'flex', alignItems: 'center', gap: '1rem', fontWeight: 800 }}>
            <Zap size={20} /> Apply Mitigation
         </button>
      </div>

    </div>
  );
};

const ProxyCard = ({ icon, level, levelColor, title, desc, action }) => (
  <GlassCard style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
     <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ color: 'var(--primary-accent)' }}>{icon}</div>
        <span style={{ fontSize: '0.65rem', fontWeight: 800, padding: '0.3rem 0.6rem', background: `${levelColor}15`, color: levelColor, borderRadius: '4px', textTransform: 'uppercase' }}>{level}</span>
     </div>
     <div>
        <h4 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '0.5rem' }}>{title}</h4>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>{desc}</p>
     </div>
     <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px' }}>
        <Info size={14} /> {action}
     </div>
  </GlassCard>
);

export default ModelFairness;

import React from 'react';
import GlassCard from './common/GlassCard';
import { 
  Database, 
  FileJson, 
  Zap, 
  Settings2, 
  Clock, 
  Activity, 
  Cpu, 
  ArrowRight,
  ShieldCheck,
  Search,
  Maximize2
} from 'lucide-react';

const DataLineage = () => {
  return (
    <div className="data-lineage-view" style={{ display: 'flex', flexDirection: 'column', gap: '2rem', height: '100%', position: 'relative' }}>
      
      {/* Background Grid Pattern */}
      <div style={{ 
        position: 'absolute', 
        inset: 0, 
        backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.03) 1px, transparent 1px)', 
        backgroundSize: '32px 32px',
        pointerEvents: 'none',
        zIndex: 0
      }}></div>

      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end', position: 'relative', zIndex: 1 }}>
        <div>
          <h2 style={{ fontSize: '2.5rem', fontWeight: 900, letterSpacing: '-1px' }}>Data Lineage Map</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', marginTop: '0.5rem', maxWidth: '600px' }}>
            Visualize the journey of your training data from raw ingestion to model inference. Monitor transformations and health metrics across the entire pipeline.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
           <button className="btn-primary" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)' }}>
             <Search size={16} /> Trace Data
           </button>
           <button className="btn-primary">
             <Maximize2 size={16} /> Fullscreen
           </button>
        </div>
      </header>

      {/* Lineage Diagram Canvas */}
      <div style={{ flex: 1, position: 'relative', zIndex: 1, minHeight: '600px' }}>
        
        {/* SVG Connections Layer */}
        <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', filter: 'drop-shadow(0 0 8px rgba(0, 210, 255, 0.15))' }}>
           {/* Row 1 to Row 2 */}
           <path d="M 280 180 C 350 180, 350 250, 420 250" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="2" />
           <path d="M 280 380 C 350 380, 350 270, 420 270" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="2" />
           
           {/* Row 2 to Row 3 (Active Line) */}
           <path d="M 680 260 L 780 260" fill="none" stroke="var(--primary-accent)" strokeWidth="3" strokeDasharray="8 4" className="lineage-path-pulse" />
           
           {/* Row 3 to Row 4 */}
           <path d="M 1040 260 C 1100 260, 1100 180, 1180 180" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="2" />
           <path d="M 1040 260 C 1100 260, 1100 350, 1180 350" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="2" />
        </svg>

        {/* Nodes Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '4rem', height: '100%', paddingTop: '2rem' }}>
           
           {/* COLUMN 1: SOURCE */}
           <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              <span style={{ fontSize: '0.65rem', fontWeight: 800, color: 'var(--primary-accent)', textTransform: 'uppercase', letterSpacing: '1px' }}>Source Ingestion</span>
              <NodeCard status="STABLE" color="#10b981" icon={<Database />} title="SQL_Customer_DB" desc="RDS Instance: us-east-1" progress={85} />
              <NodeCard status="LATENCY" color="#ef4444" icon={<FileJson />} title="Daily_Sales_Dump" desc="S3 Bucket: raw-stream" progress={42} />
           </div>

           {/* COLUMN 2: TRANSFORMATION */}
           <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '2rem' }}>
              <span style={{ fontSize: '0.65rem', fontWeight: 800, color: 'var(--primary-accent)', textTransform: 'uppercase', letterSpacing: '1px' }}>Transformation</span>
              <GlassCard style={{ padding: '1.5rem', border: '1px solid var(--primary-accent)', boxShadow: '0 0 30px rgba(0, 210, 255, 0.1)' }}>
                 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                    <div style={{ color: 'var(--primary-accent)' }}><Zap size={24} /></div>
                    <span style={{ fontSize: '0.6rem', fontWeight: 800, color: 'var(--primary-accent)', background: 'rgba(0, 210, 255, 0.1)', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>SPARK-3.4</span>
                 </div>
                 <h4 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '0.5rem' }}>Cleaning & Scaling</h4>
                 <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>Python script executing on distributed cluster workers.</p>
                 <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                    <div style={{ background: 'rgba(255,255,255,0.03)', padding: '0.5rem', borderRadius: '8px' }}>
                       <span style={{ display: 'block', fontSize: '0.6rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Null Count</span>
                       <span style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--primary-accent)' }}>0.02%</span>
                    </div>
                    <div style={{ background: 'rgba(255,255,255,0.03)', padding: '0.5rem', borderRadius: '8px' }}>
                       <span style={{ display: 'block', fontSize: '0.6rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Thruput</span>
                       <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#10b981' }}>14k/s</span>
                    </div>
                 </div>
              </GlassCard>
           </div>

           {/* COLUMN 3: TRAINING */}
           <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '2rem' }}>
              <span style={{ fontSize: '0.65rem', fontWeight: 800, color: 'var(--primary-accent)', textTransform: 'uppercase', letterSpacing: '1px' }}>Training Stage</span>
              <GlassCard style={{ padding: '1.5rem' }}>
                 <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                    <div className="spinner-border" style={{ width: '40px', height: '40px', borderRadius: '50%', border: '2px solid rgba(0, 210, 255, 0.2)', borderTop: '2px solid var(--primary-accent)', animation: 'spin 2s linear infinite' }}></div>
                    <div>
                       <h4 style={{ fontSize: '0.95rem', fontWeight: 800 }}>XGBoost_v4</h4>
                       <p style={{ fontSize: '0.65rem', color: 'var(--text-secondary)', fontWeight: 600 }}>EPOCH 45/100</p>
                    </div>
                 </div>
                 <div style={{ height: '80px', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', overflow: 'hidden', position: 'relative' }}>
                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(transparant, rgba(0,210,255,0.05))' }}></div>
                    <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
                       <path d="M 0 60 Q 50 20, 100 45 T 200 10 T 300 30" fill="none" stroke="var(--primary-accent)" strokeWidth="2" />
                    </svg>
                 </div>
              </GlassCard>
           </div>

           {/* COLUMN 4: INSIGHTS */}
           <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              <span style={{ fontSize: '0.65rem', fontWeight: 800, color: 'var(--primary-accent)', textTransform: 'uppercase', letterSpacing: '1px' }}>Model Insight</span>
              <NodeCard status="NORMAL" color="#10b981" icon={<Activity />} title="Inference Drift" desc="Feature Weight Stability" progress={82} hideBar />
              <GlassCard style={{ padding: '1.25rem' }}>
                 <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                    <ShieldCheck size={18} color="#10b981" />
                    <h4 style={{ fontSize: '0.85rem', fontWeight: 800 }}>Compliance Data</h4>
                 </div>
                 <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <div style={{ fontSize: '1.5rem', fontWeight: 900 }}>PASS</div>
                    <p style={{ fontSize: '0.65rem', color: 'var(--text-secondary)' }}>Compliant with Enterprise Governance v2.4</p>
                 </div>
              </GlassCard>
           </div>

        </div>
      </div>
    </div>
  );
};

const NodeCard = ({ status, color, icon, title, desc, progress, hideBar }) => (
  <GlassCard style={{ padding: '1.25rem' }}>
     <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
        <div style={{ 
          width: '36px', height: '36px', borderRadius: '8px', 
          background: 'rgba(255,255,255,0.03)', display: 'flex', 
          alignItems: 'center', justifyContent: 'center', color: 'var(--primary-accent)' 
        }}>
           {icon}
        </div>
        <span style={{ fontSize: '0.6rem', fontWeight: 800, color: color, textTransform: 'uppercase' }}>{status}</span>
     </div>
     <h4 style={{ fontSize: '0.9rem', fontWeight: 800, marginBottom: '0.25rem' }}>{title}</h4>
     <p style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>{desc}</p>
     {!hideBar && (
       <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{ flex: 1, height: '4px', background: 'rgba(255,255,255,0.05)', borderRadius: '2px' }}>
             <div style={{ height: '100%', width: `${progress}%`, background: color, borderRadius: '2px' }}></div>
          </div>
          <span style={{ fontSize: '0.6rem', fontWeight: 800 }}>{progress}%</span>
       </div>
     )}
  </GlassCard>
);

export default DataLineage;

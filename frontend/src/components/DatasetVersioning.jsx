import React from 'react';
import GlassCard from './common/GlassCard';
import { 
  History, 
  Upload, 
  CheckCircle2, 
  Archive, 
  Compare, 
  RotateCcw,
  User,
  MoreVertical,
  Filter
} from 'lucide-react';

const DatasetVersioning = () => {
  const versions = [
    { 
      id: 4, 
      title: 'Version 4 (Current)', 
      status: 'Active', 
      statusColor: '#10b981', 
      date: 'Oct 26, 2023, 10:45 AM', 
      author: 'Sarah Chen',
      desc: 'Updated genomic sequence data for cohort B. Includes fix for variant calling.',
      current: true
    },
    { 
      id: 3, 
      title: 'Version 3', 
      status: 'Archived', 
      statusColor: 'var(--text-secondary)', 
      date: 'Oct 24, 2023, 3:30 PM', 
      author: 'David Miller',
      desc: 'Initial cohort B sequence data. Pending variant calling fix.'
    },
    { 
      id: 2, 
      title: 'Version 2', 
      status: 'Archived', 
      statusColor: 'var(--text-secondary)', 
      date: 'Oct 20, 2023, 9:15 AM', 
      author: 'Sarah Chen',
      desc: 'Refined cohort A data with additional metadata.'
    },
    { 
      id: 1, 
      title: 'Version 1 (Baseline)', 
      status: 'Archived', 
      statusColor: 'var(--text-secondary)', 
      date: 'Oct 15, 2023, 11:00 AM', 
      author: 'Emily Davis',
      desc: 'Original raw genomic data upload from sequencing facility.'
    }
  ];

  return (
    <div className="dataset-versioning-view" style={{ display: 'flex', flexDirection: 'column', gap: '2rem', height: '100%' }}>
      
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end' }}>
        <div>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 800 }}>Dataset Versioning & History</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Monitor and manage historical snapshots of your project data for auditing and rollbacks.</p>
        </div>
        <button className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Upload size={16} /> Upload New Version
        </button>
      </header>

      <GlassCard style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
         <div style={{ padding: '1rem 1.5rem', background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
            <button style={{ background: 'transparent', border: '1px solid var(--glass-border)', padding: '0.5rem', borderRadius: '4px', color: 'var(--text-secondary)' }}><Filter size={14} /></button>
            <button style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', padding: '0.4rem 1rem', borderRadius: '4px', color: 'var(--text-secondary)', fontSize: '0.75rem', fontWeight: 700, opacity: 0.5, cursor: 'not-allowed' }}>
              Compare Selected
            </button>
         </div>

         <div style={{ padding: '2rem 3rem', overflowY: 'auto', position: 'relative' }}>
            {/* Timeline Line */}
            <div style={{ position: 'absolute', left: '46px', top: '2rem', bottom: '2rem', width: '2px', background: 'var(--glass-border)', zIndex: 0 }}></div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', position: 'relative', zIndex: 1 }}>
               {versions.map((v, idx) => (
                 <div key={v.id} style={{ display: 'flex', gap: '2rem' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: v.current ? 'var(--primary-accent)' : '#0f172a', border: `3px solid ${v.current ? 'rgba(0, 210, 255, 0.2)' : 'var(--glass-border)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '1.5rem', boxShadow: v.current ? '0 0 15px rgba(0, 210, 255, 0.3)' : 'none' }}>
                       {v.current ? <CheckCircle2 size={16} color="#0f172a" strokeWidth={3} /> : <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--text-secondary)' }}></div>}
                    </div>

                    <div style={{ 
                      flex: 1, 
                      padding: '1.5rem', 
                      background: v.current ? 'rgba(0, 210, 255, 0.05)' : 'rgba(255,255,255,0.02)', 
                      border: `1px solid ${v.current ? 'var(--primary-accent)' : 'var(--glass-border)'}`, 
                      borderRadius: '12px',
                      transition: 'all 0.2s ease',
                    }} className="version-card-hover">
                       <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                             <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>{v.title}</h3>
                             <span style={{ fontSize: '0.6rem', fontWeight: 800, padding: '0.2rem 0.5rem', borderRadius: '4px', background: `${v.statusColor}20`, color: v.statusColor, textTransform: 'uppercase' }}>{v.status}</span>
                          </div>
                          <div style={{ display: 'flex', gap: '0.75rem' }}>
                             <button style={{ padding: '0.4rem 1rem', background: 'transparent', border: '1px solid var(--glass-border)', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)', cursor: v.current ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                <RotateCcw size={12} /> Restore
                             </button>
                             <button style={{ padding: '0.4rem 1rem', background: 'transparent', border: `1px solid ${v.current ? 'var(--primary-accent)' : 'var(--glass-border)'}`, borderRadius: '6px', fontSize: '0.75rem', fontWeight: 700, color: v.current ? 'var(--primary-accent)' : 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                <History size={12} /> Compare
                             </button>
                          </div>
                       </div>

                       <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '1rem', alignItems: 'center' }}>
                          <span>{v.date}</span>
                          <span style={{ width: '3px', height: '3px', borderRadius: '50%', background: 'var(--text-secondary)' }}></span>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                             <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: 'var(--primary-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <User size={10} color="#0f172a" />
                             </div>
                             <span style={{ fontWeight: 600, color: 'white' }}>{v.author}</span>
                          </div>
                       </div>

                       <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                          {v.desc}
                       </p>
                    </div>
                 </div>
               ))}
            </div>
         </div>
      </GlassCard>

    </div>
  );
};

export default DatasetVersioning;

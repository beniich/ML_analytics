import React from 'react';
import GlassCard from './common/GlassCard';
import { 
  CheckCircle, 
  AlertCircle, 
  BarChart, 
  Database, 
  Zap, 
  Activity,
  History,
  FileDown,
  LayoutGrid
} from 'lucide-react';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title
} from 'chart.js';
import { Doughnut, Bar } from 'react-chartjs-2';

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title
);

const DataQuality = () => {
  const qualityData = {
    labels: ['Completed', 'Missing', 'Invalid'],
    datasets: [
      {
        data: [92.4, 4.2, 3.4],
        backgroundColor: [
          'rgba(16, 185, 129, 0.6)',
          'rgba(239, 68, 68, 0.4)',
          'rgba(245, 158, 11, 0.4)',
        ],
        borderColor: [
          '#10b981',
          '#ef4444',
          '#f59e0b',
        ],
        borderWidth: 1,
      },
    ],
  };

  const heatmapData = {
    labels: ['Node A', 'Node B', 'Node C', 'Node D', 'Node E', 'Node F', 'Node G'],
    datasets: [
      {
        label: 'Anomalies Detected',
        data: [12, 19, 3, 5, 2, 3, 15],
        backgroundColor: 'rgba(0, 210, 255, 0.5)',
        borderColor: 'rgba(0, 210, 255, 1)',
        borderWidth: 1,
        borderRadius: 8,
      },
    ],
  };

  const nodeStats = [
    { id: 'DB-A1', name: 'Legacy ERP Cluster', status: 'Optimal', score: '48/50', sync: '2 mins ago', color: '#10b981' },
    { id: 'S3-PR', name: 'Regional Landing Zone', status: 'Critical Drift', score: '12/50', sync: '14 mins ago', color: '#ef4444' },
    { id: 'KFK-1', name: 'Streaming Ingest', status: 'High Latency', score: '32/50', sync: 'Just now', color: '#f59e0b' },
  ];

  return (
    <div className="quality-view" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end' }}>
        <div>
          <span style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--primary-accent)', letterSpacing: '2px', textTransform: 'uppercase' }}>Operational Assessment</span>
          <h2 style={{ fontSize: '2.5rem', fontWeight: 900, marginTop: '0.5rem' }}>Data Quality Scorecard</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', marginTop: '0.5rem' }}>
            Audit of raw data health for <span style={{ color: 'white', fontWeight: 600 }}>Q4 Revenue Forecasting</span>.
          </p>
        </div>
        <div className="glass-panel" style={{ padding: '1.5rem 2.5rem', borderRadius: '40px', display: 'flex', alignItems: 'center', gap: '2rem' }}>
           <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '0.6rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Overall Health</div>
              <div style={{ fontSize: '2.2rem', fontWeight: 900, color: 'var(--primary-accent)' }}>34<span style={{ fontSize: '1rem', color: 'var(--text-secondary)' }}>/50</span></div>
           </div>
           <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'rgba(0, 210, 255, 0.1)', border: '1px solid var(--primary-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Activity color="var(--primary-accent)" size={28} />
           </div>
        </div>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '2rem' }}>
        
        {/* Completeness Card */}
        <div style={{ gridColumn: 'span 7' }}>
          <GlassCard title="Data Completeness" icon={<CheckCircle />} status="Healthy">
            <div style={{ display: 'flex', alignItems: 'center', gap: '3rem' }}>
               <div style={{ width: '160px', height: '160px' }}>
                  <Doughnut data={qualityData} options={{ cutout: '70%', plugins: { legend: { display: false } } }} />
               </div>
               <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '2.5rem', fontWeight: 900, color: '#10b981' }}>92.4%</div>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Percentage of non-null required fields in the current partition.</p>
                  <div style={{ display: 'flex', gap: '1.5rem', marginTop: '1.5rem' }}>
                     <div>
                        <div style={{ fontSize: '0.6rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Metadata</div>
                        <div style={{ fontWeight: 700 }}>100%</div>
                     </div>
                     <div>
                        <div style={{ fontSize: '0.6rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>User IDs</div>
                        <div style={{ fontWeight: 700 }}>98.1%</div>
                     </div>
                  </div>
               </div>
            </div>
          </GlassCard>
        </div>

        {/* Anomaly Heatmap */}
        <div style={{ gridColumn: 'span 5' }}>
          <GlassCard title="Anomaly Heatmap" icon={<BarChart />}>
            <div style={{ height: '220px' }}>
               <Bar 
                 data={heatmapData} 
                 options={{ 
                   responsive: true, 
                   maintainAspectRatio: false, 
                   plugins: { legend: { display: false } },
                   scales: { y: { display: false }, x: { grid: { display: false }, ticks: { color: 'rgba(255,255,255,0.3)', font: { size: 10 } } } }
                 }} 
               />
            </div>
          </GlassCard>
        </div>

        {/* Node Assessment Table */}
        <div style={{ gridColumn: 'span 12' }}>
          <GlassCard title="Node Integrity Assessment" icon={<Database />}>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginBottom: '1.5rem' }}>
               <button className="btn-primary" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', fontSize: '0.75rem' }}>
                 <FileDown size={14} style={{ marginRight: '0.5rem' }} /> EXPORT PDF
               </button>
               <button className="btn-primary" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', fontSize: '0.75rem' }}>
                 <History size={14} style={{ marginRight: '0.5rem' }} /> HISTORY
               </button>
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
               <thead>
                 <tr style={{ textAlign: 'left', color: 'var(--text-secondary)', borderBottom: '1px solid var(--glass-border)' }}>
                    <th style={{ padding: '1rem' }}>Source Node</th>
                    <th style={{ padding: '1rem' }}>Status</th>
                    <th style={{ padding: '1rem' }}>Score</th>
                    <th style={{ padding: '1rem' }}>Last Sync</th>
                    <th style={{ padding: '1rem', textAlign: 'right' }}>Action</th>
                 </tr>
               </thead>
               <tbody>
                 {nodeStats.map(node => (
                   <tr key={node.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.02)' }}>
                      <td style={{ padding: '1.25rem' }}>
                         <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <div style={{ width: '40px', height: '40px', background: 'rgba(255,255,255,0.05)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', color: 'var(--primary-accent)', fontWeight: 800 }}>{node.id}</div>
                            <span style={{ fontWeight: 600 }}>{node.name}</span>
                         </div>
                      </td>
                      <td style={{ padding: '1.25rem' }}>
                         <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: node.color }}></span>
                            <span style={{ fontSize: '0.85rem' }}>{node.status}</span>
                         </div>
                      </td>
                      <td style={{ padding: '1.25rem', fontWeight: 800 }}>{node.score}</td>
                      <td style={{ padding: '1.25rem', fontStyle: 'italic', color: 'var(--text-secondary)', fontSize: '0.8rem' }}>{node.sync}</td>
                      <td style={{ padding: '1.25rem', textAlign: 'right' }}>
                         <button style={{ color: 'var(--primary-accent)', background: 'transparent', border: 'none', fontWeight: 700, cursor: 'pointer', fontSize: '0.8rem' }}>DETAILS</button>
                      </td>
                   </tr>
                 ))}
               </tbody>
            </table>
          </GlassCard>
        </div>

      </div>

      {/* Footer Status Bar */}
      <footer style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', padding: '1rem 0', borderTop: '1px solid var(--glass-border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
             <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981', animation: 'pulse 2s infinite' }}></span>
                <span style={{ fontSize: '0.65rem', fontWeight: 800, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Live Auditor Active</span>
             </div>
             <div style={{ width: '1px', height: '12px', background: 'var(--glass-border)' }}></div>
             <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>Last full re-calculation: 12:44:02 UTC</span>
          </div>
          <div style={{ display: 'flex', gap: '2rem' }}>
             <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-secondary)' }}>
                <LayoutGrid size={14} /> STORAGE: 84%
             </div>
             <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-secondary)' }}>
                <Zap size={14} /> PROCESSING: 1.2 GB/S
             </div>
          </div>
      </footer>

    </div>
  );
};

export default DataQuality;

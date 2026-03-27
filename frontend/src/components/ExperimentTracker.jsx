import React, { useState } from 'react';
import GlassCard from './common/GlassCard';
import { 
  FlaskConical, 
  History, 
  Activity, 
  Settings, 
  FileCode, 
  Terminal, 
  ExternalLink,
  ChevronRight,
  Database,
  Box
} from 'lucide-react';
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js';
import { Radar } from 'react-chartjs-2';

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

const ExperimentTracker = () => {
  const [selectedRun, setSelectedRun] = useState(1);

  const runs = [
    { id: 1, name: 'Run_20231027_0915', time: 'Oct 27, 09:15 AM', status: 'Finished', accuracy: 0.945, loss: 0.089, duration: '2h 15m', source: 'GitHub' },
    { id: 2, name: 'Run_20231026_1430', time: 'Oct 26, 02:30 PM', status: 'Finished', accuracy: 0.932, loss: 0.105, duration: '1h 55m', source: 'Local' },
    { id: 3, name: 'Run_20231026_1100', time: 'Oct 26, 11:00 AM', status: 'Failed', accuracy: '-', loss: '-', duration: '30m', source: 'Jupyter' },
    { id: 4, name: 'Run_20231025_1645', time: 'Oct 25, 04:45 PM', status: 'Finished', accuracy: 0.951, loss: 0.072, duration: '2h 40m', source: 'GitHub' },
  ];

  const radarData = {
    labels: ['Accuracy', 'Precision', 'Recall', 'F1-Score', 'AUC', 'Latency'],
    datasets: [
      {
        label: 'Current Run',
        data: [0.94, 0.88, 0.92, 0.90, 0.96, 0.75],
        backgroundColor: 'rgba(0, 210, 255, 0.2)',
        borderColor: 'rgba(0, 210, 255, 1)',
        borderWidth: 2,
      },
      {
        label: 'Baseline',
        data: [0.85, 0.80, 0.82, 0.81, 0.88, 0.90],
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        borderColor: 'rgba(255, 255, 255, 0.3)',
        borderWidth: 1,
      },
    ],
  };

  const radarOptions = {
    scales: {
      r: {
        grid: { color: 'rgba(255,255,255,0.1)' },
        angleLines: { color: 'rgba(255,255,255,0.1)' },
        pointLabels: { color: 'rgba(255,255,255,0.7)', font: { size: 10 } },
        ticks: { display: false }
      }
    },
    plugins: {
      legend: { labels: { color: '#fff', font: { size: 10 } } }
    }
  };

  return (
    <div className="mlflow-view" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 700, color: 'var(--primary-accent)' }}>MLflow Experiment Tracker</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Version-controlled model tracking & artifact logging</p>
        </div>
        <button className="btn-primary">
          <FlaskConical size={16} style={{ marginRight: '0.6rem' }} /> New Experiment
        </button>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '2rem' }}>
        
        {/* Main Runs Table */}
        <GlassCard title="Logged Experiments" icon={<History />}>
          <div className="table-wrapper" style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--glass-border)', textAlign: 'left', color: 'var(--text-secondary)' }}>
                  <th style={{ padding: '1rem' }}>Run Name</th>
                  <th style={{ padding: '1rem' }}>Status</th>
                  <th style={{ padding: '1rem' }}>Accuracy</th>
                  <th style={{ padding: '1rem' }}>Duration</th>
                  <th style={{ padding: '1rem' }}>Source</th>
                </tr>
              </thead>
              <tbody>
                {runs.map(run => (
                  <tr 
                    key={run.id} 
                    onClick={() => setSelectedRun(run.id)}
                    style={{ 
                      cursor: 'pointer',
                      borderBottom: '1px solid rgba(255,255,255,0.02)',
                      background: selectedRun === run.id ? 'rgba(0, 210, 255, 0.05)' : 'transparent',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <td style={{ padding: '1rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{ color: selectedRun === run.id ? 'var(--primary-accent)' : 'white', fontWeight: 600 }}>{run.name}</span>
                      </div>
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <span style={{ 
                        fontSize: '0.65rem', 
                        padding: '0.2rem 0.5rem', 
                        borderRadius: '4px',
                        background: run.status === 'Finished' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                        color: run.status === 'Finished' ? '#10b981' : '#ef4444',
                        fontWeight: 700
                      }}>
                        {run.status}
                      </span>
                    </td>
                    <td style={{ padding: '1rem', fontFamily: 'monospace' }}>{run.accuracy}</td>
                    <td style={{ padding: '1rem', color: 'var(--text-secondary)' }}>{run.duration}</td>
                    <td style={{ padding: '1rem', fontStyle: 'italic', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{run.source}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </GlassCard>

        {/* Details Sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <GlassCard title="Run Comparison" icon={<Activity />}>
             <div style={{ height: '220px' }}>
                <Radar data={radarData} options={radarOptions} />
             </div>
          </GlassCard>

          <GlassCard title="Artifacts" icon={<Box />}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
               {[
                 { name: 'model.pkl', size: '124MB', icon: <Database size={14} /> },
                 { name: 'metrics.json', size: '12KB', icon: <FileCode size={14} /> },
                 { name: 'logs.txt', size: '4.2MB', icon: <Terminal size={14} /> },
               ].map((art, i) => (
                 <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem', background: 'rgba(255,255,255,0.02)', borderRadius: '8px', cursor: 'pointer' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                       <span style={{ color: 'var(--primary-accent)' }}>{art.icon}</span>
                       <span style={{ fontSize: '0.8rem' }}>{art.name}</span>
                    </div>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>{art.size}</span>
                 </div>
               ))}
               <button className="btn-primary" style={{ width: '100%', marginTop: '1rem', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)' }}>
                 Open MLflow UI <ExternalLink size={14} style={{ marginLeft: '0.5rem' }} />
               </button>
            </div>
          </GlassCard>
        </div>

      </div>

    </div>
  );
};

export default ExperimentTracker;

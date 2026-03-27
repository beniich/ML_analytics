import React from 'react';
import GlassCard from './common/GlassCard';
import { 
  GitCompare, 
  PlaySquare, 
  CheckSquare, 
  BarChart2, 
  Activity,
  CheckCircle2
} from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const ModelBenchmark = () => {
  const chartData = {
    labels: Array.from({ length: 11 }, (_, i) => i * 10),
    datasets: [
      {
        label: 'XGBoost (Primary)',
        data: [1, 0.4, 0.2, 0.1, 0.05, 0.03, 0.02, 0.015, 0.012, 0.01, 0.009],
        borderColor: 'var(--primary-accent)',
        borderWidth: 3,
        pointRadius: 0,
        tension: 0.4,
      },
      {
        label: 'Random Forest',
        data: [1, 0.6, 0.4, 0.3, 0.25, 0.2, 0.18, 0.16, 0.15, 0.14, 0.13],
        borderColor: 'var(--text-secondary)',
        borderWidth: 3,
        pointRadius: 0,
        tension: 0.4,
      }
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top', align: 'end', labels: { color: 'white', boxWidth: 12 } },
      tooltip: { backgroundColor: 'rgba(15, 23, 42, 0.9)' }
    },
    scales: {
      y: {
        grid: { color: 'rgba(255,255,255,0.05)' },
        ticks: { color: 'rgba(255,255,255,0.5)' },
        title: { display: true, text: 'Loss', color: 'rgba(255,255,255,0.5)', font: { size: 10, weight: 'bold' } }
      },
      x: {
        grid: { color: 'rgba(255,255,255,0.05)' },
        ticks: { color: 'rgba(255,255,255,0.5)' },
        title: { display: true, text: 'Epochs', color: 'rgba(255,255,255,0.5)', font: { size: 10, weight: 'bold' } }
      }
    }
  };

  const metrics = [
    { name: 'XGBoost (Primary)', r2: '0.945', rmse: '0.021', time: '1h 45m', status: 'Completed', color: 'var(--primary-accent)' },
    { name: 'Random Forest', r2: '0.892', rmse: '0.045', time: '45m', status: 'Completed', color: 'var(--text-secondary)' },
    { name: 'Linear Regression', r2: '0.883', rmse: '0.028', time: '25m', status: 'Completed', color: 'var(--text-secondary)' },
  ];

  return (
    <div className="model-benchmark-view" style={{ display: 'flex', flexDirection: 'column', gap: '2rem', minHeight: '100%' }}>
      
      {/* Header */}
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end' }}>
        <div>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 800 }}>Model Benchmark Comparison</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Evaluate and compare algorithm performance metrics against baseline.</p>
        </div>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: '2rem', flex: 1 }}>
        
        {/* Sidebar Tools */}
        <aside style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <span style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1px' }}>Comparison Tools</span>
          
          <button style={{ 
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', 
            padding: '1rem', background: 'rgba(0, 210, 255, 0.05)', border: '2px solid var(--primary-accent)', 
            color: 'var(--primary-accent)', borderRadius: '12px', fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer' 
          }}>
            <CheckSquare size={16} /> Select Models
          </button>

          <button style={{ 
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', 
            padding: '1rem', background: 'transparent', border: '2px solid var(--glass-border)', 
            color: 'white', borderRadius: '12px', fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer' 
          }}>
            <PlaySquare size={16} /> Run New Benchmark
          </button>

          <button className="btn-primary" style={{ 
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', 
            padding: '1rem', borderRadius: '12px', fontWeight: 800, fontSize: '0.9rem',
            backgroundImage: 'linear-gradient(90deg, #00d2ff 0%, #3a7bd5 100%)', border: 'none', color: '#0f172a'
          }}>
            <GitCompare size={16} /> Compare Selected
          </button>
        </aside>

        {/* Main Content Areas */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          <GlassCard title="Performance Trends" icon={<Activity />}>
             <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 700 }}>Validation Loss Over Epochs</span>
             </div>
             <div style={{ height: '350px', position: 'relative', width: '100%' }}>
                <Line data={chartData} options={chartOptions} />
             </div>
          </GlassCard>

          <GlassCard title="Metrics Summary" icon={<BarChart2 />}>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                <thead>
                  <tr style={{ color: 'var(--text-secondary)', borderBottom: '1px solid var(--glass-border)', textAlign: 'left', textTransform: 'uppercase', fontSize: '0.65rem', letterSpacing: '1px' }}>
                     <th style={{ padding: '1rem' }}>Model Name</th>
                     <th style={{ padding: '1rem' }}>R2 Score</th>
                     <th style={{ padding: '1rem' }}>RMSE</th>
                     <th style={{ padding: '1rem' }}>Training Time</th>
                     <th style={{ padding: '1rem' }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {metrics.map((m, idx) => (
                    <tr key={idx} style={{ borderBottom: '1px solid rgba(255,255,255,0.02)', background: idx === 0 ? 'rgba(0, 210, 255, 0.05)' : 'transparent' }}>
                       <td style={{ padding: '1.25rem', fontWeight: 700, color: m.color }}>{m.name}</td>
                       <td style={{ padding: '1.25rem', fontFamily: 'monospace' }}>{m.r2}</td>
                       <td style={{ padding: '1.25rem', fontFamily: 'monospace' }}>{m.rmse}</td>
                       <td style={{ padding: '1.25rem', color: 'var(--text-secondary)' }}>{m.time}</td>
                       <td style={{ padding: '1.25rem' }}>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#10b981', fontWeight: 700, fontSize: '0.8rem' }}>
                             <CheckCircle2 size={14} /> {m.status}
                          </span>
                       </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </GlassCard>

        </div>
      </div>
    </div>
  );
};

export default ModelBenchmark;

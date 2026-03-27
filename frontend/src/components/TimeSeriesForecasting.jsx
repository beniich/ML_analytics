import React, { useState } from 'react';
import GlassCard from './common/GlassCard';
import { 
  TrendingUp, 
  Calendar, 
  Settings2, 
  Zap, 
  Database, 
  FileText,
  ChevronDown,
  Info,
  Maximize2
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
  Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const TimeSeriesForecasting = () => {
  const [horizon, setHorizon] = useState(12);
  const [alpha, setAlpha] = useState(0.45);

  const chartData = {
    labels: ['Jan 22', 'Apr 22', 'Jul 22', 'Oct 22', 'Jan 23', 'Apr 23', 'Jul 23', 'Oct 23', 'Jan 24', 'Apr 24', 'Jul 24', 'Oct 24'],
    datasets: [
      {
        label: 'Historical Data',
        data: [410, 380, 385, 430, 350, 355, 290, 380, 210, null, null, null],
        borderColor: 'rgba(255, 255, 255, 0.4)',
        borderWidth: 2,
        pointRadius: 0,
        tension: 0.3,
      },
      {
        label: 'Forecast',
        data: [null, null, null, null, null, null, null, null, 210, 240, 220, 180],
        borderColor: 'var(--primary-accent)',
        borderDash: [5, 5],
        borderWidth: 3,
        pointRadius: 4,
        pointBackgroundColor: 'var(--primary-accent)',
        tension: 0.4,
      },
      {
        label: 'Confidence Interval (Upper)',
        data: [null, null, null, null, null, null, null, null, 210, 270, 240, 210],
        borderColor: 'transparent',
        backgroundColor: 'rgba(0, 210, 255, 0.05)',
        fill: '+1',
        pointRadius: 0,
        tension: 0.4,
      },
      {
        label: 'Confidence Interval (Lower)',
        data: [null, null, null, null, null, null, null, null, 210, 210, 180, 150],
        borderColor: 'transparent',
        backgroundColor: 'rgba(0, 210, 255, 0.05)',
        fill: false,
        pointRadius: 0,
        tension: 0.4,
      }
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: 'rgba(15, 23, 42, 0.9)',
        padding: 12,
        titleFont: { size: 14, weight: 'bold' },
        callbacks: {
          label: (context) => {
            if (context.dataset.label === 'Forecast') return ` Forecast: $${context.parsed.y}k (±$20k)`;
            return ` Sales: $${context.parsed.y}k`;
          }
        }
      }
    },
    scales: {
      y: {
        grid: { color: 'rgba(255,255,255,0.05)' },
        ticks: { color: 'rgba(255,255,255,0.5)', callback: (val) => `$${val}k` }
      },
      x: {
        grid: { display: false },
        ticks: { color: 'rgba(255,255,255,0.5)' }
      }
    }
  };

  return (
    <div className="forecast-view" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end' }}>
        <div>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 800 }}>Time-Series Forecasting View</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Analysis › Time-Series › <span style={{ color: 'var(--primary-accent)' }}>Prophet Forecasting</span></p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
           <div className="glass-panel" style={{ padding: '0.5rem 1rem', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
              <span style={{ fontSize: '0.8rem' }}>Last 24 Months</span>
              <ChevronDown size={14} />
           </div>
        </div>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '2rem' }}>
        
        {/* Main Visualization Area */}
        <GlassCard title="Sales Revenue Forecast (USD)" icon={<TrendingUp />} status="v4.2">
           <div style={{ padding: '1rem', height: '450px', position: 'relative' }}>
              <Line data={chartData} options={chartOptions} />
              <div style={{ position: 'absolute', top: '10px', right: '10px' }}>
                 <Maximize2 size={16} style={{ color: 'var(--text-secondary)', cursor: 'pointer' }} />
              </div>
           </div>
        </GlassCard>

        {/* Settings Sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
           <GlassCard title="Forecast Settings" icon={<Settings2 />}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                 
                 <div>
                    <label style={{ fontSize: '0.65rem', fontWeight: 800, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1px', display: 'block', marginBottom: '0.75rem' }}>Forecast Horizon</label>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                       <div className="glass-panel" style={{ flex: 1, padding: '0.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontSize: '0.8rem' }}>Jul 23, 2024</span>
                          <Calendar size={14} color="var(--text-secondary)" />
                       </div>
                       <div className="glass-panel" style={{ width: '60px', padding: '0.5rem', textAlign: 'center' }}>
                          <span style={{ fontSize: '0.8rem', fontWeight: 700 }}>{horizon}</span>
                       </div>
                    </div>
                 </div>

                 <div>
                    <label style={{ fontSize: '0.65rem', fontWeight: 800, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1px', display: 'block', marginBottom: '0.75rem' }}>Seasonality Parameters</label>
                    <div className="glass-panel" style={{ padding: '0.5rem', fontSize: '0.8rem', display: 'flex', justifyContent: 'space-between' }}>
                       <span>Automatic (Prophet)</span>
                       <ChevronDown size={14} />
                    </div>
                    <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}>
                       {['Annual', 'Monthly', 'Weekly'].map(tag => (
                          <div key={tag} style={{ fontSize: '0.65rem', padding: '0.25rem 0.6rem', borderRadius: '4px', background: tag === 'Annual' ? 'rgba(0, 210, 255, 0.1)' : 'rgba(255,255,255,0.05)', color: tag === 'Annual' ? 'var(--primary-accent)' : 'var(--text-secondary)', border: `1px solid ${tag === 'Annual' ? 'rgba(0, 210, 255, 0.2)' : 'transparent'}`, fontWeight: 700 }}>{tag}</div>
                       ))}
                    </div>
                 </div>

                 <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                       <label style={{ fontSize: '0.65rem', fontWeight: 800, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Smoothing (Alpha)</label>
                       <span style={{ fontSize: '0.75rem', fontWeight: 700 }}>{alpha}</span>
                    </div>
                    <input 
                      type="range" 
                      min="0" max="1" step="0.01" 
                      value={alpha} 
                      onChange={(e) => setAlpha(e.target.value)}
                      style={{ width: '100%', accentColor: 'var(--primary-accent)' }}
                    />
                 </div>

                 <button className="btn-primary" style={{ width: '100%', marginTop: '1rem', padding: '1rem', borderRadius: '30px', fontWeight: 800, letterSpacing: '1px' }}>
                    RUN FORECAST
                 </button>
                 <p style={{ textAlign: 'center', fontSize: '0.65rem', color: 'var(--text-secondary)' }}>Last run: Today at 10:35 AM</p>

              </div>
           </GlassCard>

           <div style={{ padding: '1rem', background: 'rgba(255, 255, 255, 0.02)', border: '1px solid var(--glass-border)', borderRadius: '16px', display: 'flex', gap: '1rem' }}>
              <Info size={16} color="var(--primary-accent)" />
              <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
                Forecasts are generated using **FB Prophet v1.1**. Confidence intervals represent the **80% uncertainty** range.
              </p>
           </div>
        </div>

      </div>

    </div>
  );
};

export default TimeSeriesForecasting;

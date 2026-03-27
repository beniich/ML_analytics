import React, { useState } from 'react';
import GlassCard from './common/GlassCard';
import { 
  BarChart, 
  Filter, 
  Activity, 
  PieChart, 
  LineChart,
  LayoutGrid
} from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const DistributionAnalysis = () => {
  const [dataType, setDataType] = useState('numerical');

  // Helper chart configurations
  const commonOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: { backgroundColor: 'rgba(15, 23, 42, 0.9)' }
    },
    scales: {
      y: { display: false },
      x: { grid: { display: false }, ticks: { color: 'rgba(255,255,255,0.5)', font: { size: 10 } } }
    }
  };

  const createChartData = (label, data, color) => ({
    labels: ['1', '2', '3', '4', '5', '6', '7', '8', '9'],
    datasets: [{
      label,
      data,
      backgroundColor: color || 'rgba(0, 210, 255, 0.5)',
      borderRadius: 4,
    }]
  });

  const charts = [
    { title: 'Age Distribution', subtitle: '(Histogram)', data: [10, 25, 40, 60, 45, 80, 50, 20, 5] },
    { title: 'Income per Household', subtitle: '(Box Plot Approx)', data: [5, 10, 15, 70, 95, 60, 25, 10, 5] },
    { title: 'Product Ratings', subtitle: '(Histogram)', data: [5, 12, 18, 40, 75, 40, 15, 8, 2] },
    { title: 'Daily Active Users', subtitle: '(Time Dist)', data: [30, 45, 40, 60, 80, 95, 65, 40, 20] },
    { title: 'Transaction Value', subtitle: '(Histogram)', data: [15, 30, 45, 90, 75, 50, 30, 15, 5] },
    { title: 'Session Duration', subtitle: '(Box Plot Approx)', data: [5, 15, 30, 65, 85, 55, 25, 10, 5] },
  ];

  return (
    <div className="distribution-analysis-view" style={{ display: 'flex', flexDirection: 'column', gap: '2rem', height: '100%' }}>
      
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end' }}>
        <div>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 800 }}>Distribution Analysis</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Visualize data spread, identify outliers, and detect skewness across variables.</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          
          {/* Data Toggle */}
          <div style={{ display: 'flex', background: 'rgba(0,0,0,0.3)', borderRadius: '30px', padding: '0.25rem' }}>
             <button 
               onClick={() => setDataType('categorical')}
               style={{ padding: '0.5rem 1rem', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 700, background: dataType === 'categorical' ? 'var(--primary-accent)' : 'transparent', color: dataType === 'categorical' ? '#0f172a' : 'var(--text-secondary)', border: 'none', cursor: 'pointer', transition: 'all 0.2s' }}
             >
               CATEGORICAL
             </button>
             <button 
               onClick={() => setDataType('numerical')}
               style={{ padding: '0.5rem 1rem', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 700, background: dataType === 'numerical' ? 'var(--primary-accent)' : 'transparent', color: dataType === 'numerical' ? '#0f172a' : 'var(--text-secondary)', border: 'none', cursor: 'pointer', transition: 'all 0.2s' }}
             >
               NUMERICAL
             </button>
          </div>

          <button className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Filter size={16} /> Filter Data
          </button>
        </div>
      </header>

      {/* Grid of Distribution Charts */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', overflowY: 'auto', paddingBottom: '2rem' }}>
         {charts.map((chart, idx) => (
           <GlassCard key={idx} style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column' }}>
              <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                 <div>
                    <h3 style={{ fontSize: '1rem', fontWeight: 800 }}>{chart.title}</h3>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }}>{chart.subtitle}</p>
                 </div>
                 <LayoutGrid size={16} style={{ color: 'rgba(255,255,255,0.2)' }} />
              </div>
              <div style={{ height: '200px', width: '100%', position: 'relative' }}>
                 <Bar 
                   data={createChartData(chart.title, chart.data, idx % 2 === 0 ? 'rgba(0, 210, 255, 0.4)' : 'rgba(238, 129, 98, 0.4)')} 
                   options={commonOptions} 
                 />
                 {/* Simulate median line */}
                 {idx % 2 === 0 && (
                   <div style={{ position: 'absolute', top: '20%', left: '50%', transform: 'translateX(-50%)', width: '2px', height: '80%', background: 'var(--primary-accent)', zIndex: 10, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <span style={{ position: 'absolute', top: '-20px', fontSize: '0.65rem', fontWeight: 800, color: 'var(--primary-accent)', background: '#0f172a', padding: '0 4px' }}>Median</span>
                   </div>
                 )}
              </div>
           </GlassCard>
         ))}
      </div>

    </div>
  );
};

export default DistributionAnalysis;

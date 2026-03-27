import React from 'react';
import GlassCard from './common/GlassCard';
import { 
  AlertTriangle, 
  TrendingUp, 
  Clock, 
  ExternalLink, 
  ShieldAlert,
  Zap,
  Info
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

const AnomalyMonitoring = () => {
  const chartData = {
    labels: ['May 1', 'May 5', 'May 10', 'May 15', 'May 20', 'May 25', 'May 30'],
    datasets: [
      {
        fill: true,
        label: 'Alert Frequency',
        data: [5, 12, 8, 15, 10, 22, 11, 14, 6, 18, 12, 9, 15, 20, 8, 25, 14, 16],
        borderColor: 'rgba(0, 210, 255, 1)',
        backgroundColor: 'rgba(0, 210, 255, 0.1)',
        tension: 0.4,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: 'rgba(15, 23, 42, 0.9)',
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: 'rgba(255,255,255,0.1)',
        borderWidth: 1,
      }
    },
    scales: {
      y: {
        grid: { color: 'rgba(255,255,255,0.05)' },
        ticks: { color: 'rgba(255,255,255,0.5)', font: { size: 10 } }
      },
      x: {
        grid: { display: false },
        ticks: { color: 'rgba(255,255,255,0.5)', font: { size: 10 } }
      }
    }
  };

  const currentAlerts = [
    { id: 1, severity: 'High', title: "Model Performance Drop: 'Fraud Detection v3' F1-score decreased.", data: 'Transaction Logs', time: '09:15 AM', color: '#ef4444' },
    { id: 2, severity: 'Medium', title: "Data Anomaly: Unusual spike in 'Login Attempts' detected.", data: 'User Access Logs', time: '04:30 PM', color: '#f59e0b' },
    { id: 3, severity: 'Low', title: "Data Quality Issue: Missing values in 'Demographics' exceeds threshold.", data: 'Customer Records', time: '11:45 AM', color: '#10b981' },
    { id: 4, severity: 'High', title: "Drift Detected: 'Recommendation Engine' input distribution shifted.", data: 'Product Interactions', time: '02:00 PM', color: '#ef4444' },
  ];

  return (
    <div className="anomaly-view" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 700, color: 'var(--primary-accent)' }}>Anomaly Alerts & Monitoring</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Real-time statistical error detection and performance tracking</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.2)', borderRadius: '20px' }}>
            <Zap size={14} color="#10b981" />
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#10b981' }}>System Healthy</span>
          </div>
        </div>
      </header>

      {/* Chart Section */}
      <GlassCard title="Alert Frequency Over Time (Last 30 Days)" icon={<TrendingUp />} status="Live">
         <div style={{ height: '300px', padding: '1rem' }}>
            <Line data={chartData} options={chartOptions} />
         </div>
      </GlassCard>

      {/* Recent Alerts List */}
      <GlassCard title="Recent Intercepted Alerts" icon={<ShieldAlert />}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {currentAlerts.map(alert => (
            <div 
              key={alert.id} 
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '1.25rem',
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid var(--glass-border)',
                borderRadius: '12px',
                transition: 'all 0.3s ease'
              }}
              className="alert-item-hover"
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flex: 1 }}>
                <div style={{ 
                  minWidth: '100px', 
                  textAlign: 'center', 
                  padding: '0.35rem', 
                  borderRadius: '20px', 
                  background: `${alert.color}15`, 
                  border: `1px solid ${alert.color}33`,
                  color: alert.color,
                  fontSize: '0.7rem',
                  fontWeight: 800,
                  textTransform: 'uppercase'
                }}>
                  {alert.severity}
                </div>
                <div>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 600, color: 'rgba(255,255,255,0.9)' }}>{alert.title}</h4>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.3rem' }}>
                    Affected Dataset: <span style={{ color: 'white' }}>{alert.data}</span> • Today, {alert.time}
                  </p>
                </div>
              </div>
              <button 
                className="btn-primary" 
                style={{ 
                  background: 'rgba(255,255,255,0.05)', 
                  border: '1px solid var(--glass-border)',
                  padding: '0.5rem 1rem',
                  fontSize: '0.8rem'
                }}
              >
                View Details
              </button>
            </div>
          ))}
        </div>
      </GlassCard>

      <div style={{ padding: '1.5rem', background: 'rgba(0, 210, 255, 0.03)', border: '1px solid rgba(0, 210, 255, 0.1)', borderRadius: '16px', display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
         <Info size={20} color="var(--primary-accent)" style={{ marginTop: '0.2rem' }} />
         <div>
            <h5 style={{ fontSize: '0.9rem', fontWeight: 600, marginBottom: '0.4rem' }}>Predictive Anomaly Engine v4.0</h5>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
              The current monitoring system uses localized Z-score and Isolation Forest algorithms to detect statistical shifts. 
              Alerts are automatically cross-referenced with the **Audit Log** for full traceability and compliance with security guidelines.
            </p>
         </div>
      </div>

    </div>
  );
};

export default AnomalyMonitoring;

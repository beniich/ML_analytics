import React, { useState } from 'react';
import GlassCard from './common/GlassCard';
import { 
  AlertTriangle, 
  Activity, 
  Zap, 
  ShieldAlert, 
  Clock, 
  CheckCircle2, 
  TrendingDown, 
  MoreVertical,
  ArrowUpRight,
  Filter,
  BarChart3
} from 'lucide-react';

const AnomalyAlerts = () => {
  const [activeFilter, setActiveFilter] = useState('All');

  const alerts = [
    { id: 1, type: 'High', msg: "Model Performance Drop: 'Fraud Detection Model v3' F1-score decreased significantly.", ref: 'Transaction Logs', time: 'Today, 09:15 AM', color: '#ffb4a4' },
    { id: 2, type: 'Medium', msg: "Data Anomaly: Unusual spike in 'Login Attempts' detected.", ref: 'User Access Logs', time: 'Yesterday, 04:30 PM', color: 'var(--primary-accent)' },
    { id: 3, type: 'Low', msg: "Data Quality Issue: Missing values in 'Customer Demographics' exceed threshold.", ref: 'Customer Records', time: 'Oct 27, 11:45 AM', color: '#67d9c9' },
    { id: 4, type: 'High', msg: "Drift Detected: 'Recommendation Engine' input data distribution has shifted.", ref: 'Product Interaction Data', time: 'Oct 26, 02:00 PM', color: '#ffb4a4' },
    { id: 5, type: 'Medium', msg: "Latency Warning: Real-time inference response time above SLA.", ref: 'API Gateway Metrics', time: 'Oct 25, 10:10 AM', color: 'var(--primary-accent)' },
  ];

  return (
    <div className="anomaly-alerts-view" style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
      {/* Header */}
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <h2 style={{ fontSize: '2.5rem', fontWeight: 800, color: 'white', marginBottom: '0.5rem', letterSpacing: '-0.02em' }}>Anomaly & Drift Monitoring</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>Real-time surveillance of model performance and data integrity across all production nodes.</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
            <button className="btn-primary" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--glass-border)' }}>Pause Monitoring</button>
            <button className="btn-primary">Alert Settings</button>
        </div>
      </header>

      {/* Frequency Chart Bento */}
      <div style={{ background: 'rgba(255,255,255,0.02)', padding: '2.5rem', borderRadius: '32px', border: '1px solid var(--glass-border)', position: 'relative', overflow: 'hidden' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'white' }}>Alert Frequency Over Time</h3>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Last 30 days aggregation</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--primary-accent)' }}></div>
                      <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>Data Drift</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ffb4a4' }}></div>
                      <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>Performance Drop</span>
                  </div>
              </div>
          </div>
          
          <div style={{ height: '200px', width: '100%', position: 'relative' }}>
              <svg viewBox="0 0 1000 200" preserveAspectRatio="none" style={{ width: '100%', height: '100%' }}>
                  <path 
                      d="M 0,200 L 100,180 L 200,190 L 300,120 L 400,160 L 500,50 L 600,140 L 700,110 L 800,150 L 900,40 L 1000,160" 
                      fill="none" 
                      stroke="var(--primary-accent)" 
                      strokeWidth="3" 
                  />
                  <path 
                      d="M 0,200 L 100,180 L 200,190 L 300,120 L 400,160 L 500,50 L 600,140 L 700,110 L 800,150 L 900,40 L 1000,160 V 200 H 0 Z" 
                      fill="rgba(0, 210, 255, 0.05)" 
                  />
                  {/* Critical Points */}
                  <circle cx="500" cy="50" r="6" fill="#ffb4a4" stroke="black" strokeWidth="2" />
                  <circle cx="900" cy="40" r="6" fill="#ffb4a4" stroke="black" strokeWidth="2" />
              </svg>
              {/* Labels Placeholder */}
              <div style={{ position: 'absolute', bottom: '-20px', left: 0, right: 0, display: 'flex', justifyContent: 'space-between', fontSize: '0.65rem', color: 'var(--text-secondary)' }}>
                  <span>Oct 01</span>
                  <span>Oct 10</span>
                  <span>Oct 20</span>
                  <span>Today</span>
              </div>
          </div>
      </div>

      {/* Main Alerts Feed */}
      <GlassCard title="Live Alert Feed">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {alerts.map((alert) => (
                  <div key={alert.id} style={{ 
                      padding: '1.5rem', 
                      borderRadius: '20px', 
                      background: 'rgba(255,255,255,0.01)', 
                      border: '1px solid var(--glass-border)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '1.5rem',
                      transition: 'transform 0.2s'
                  }} className="hover:translate-x-1">
                      <div style={{ 
                          width: '48px', 
                          height: '48px', 
                          borderRadius: '12px', 
                          background: `rgba(${alert.type === 'High' ? '255, 180, 164' : alert.type === 'Medium' ? '0, 210, 255' : '103, 217, 201'}, 0.1)`,
                          color: alert.color,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                      }}>
                          {alert.type === 'High' ? <AlertTriangle size={24} /> : alert.type === 'Medium' ? <Zap size={24} /> : <CheckCircle2 size={24} />}
                      </div>
                      <div style={{ flex: 1 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.4rem' }}>
                              <span style={{ 
                                  fontSize: '0.65rem', 
                                  fontWeight: 800, 
                                  color: 'black', 
                                  background: alert.color, 
                                  padding: '2px 8px', 
                                  borderRadius: '100px', 
                                  textTransform: 'uppercase' 
                              }}>{alert.type}</span>
                              <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'white' }}>{alert.msg}</h4>
                          </div>
                          <div style={{ display: 'flex', gap: '1rem', color: 'var(--text-secondary)', fontSize: '0.75rem' }}>
                              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><BarChart3 size={12}/> {alert.ref}</span>
                              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Clock size={12}/> {alert.time}</span>
                          </div>
                      </div>
                      <button className="btn-primary" style={{ padding: '0.6rem 1.25rem', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--glass-border)' }}>Analysis</button>
                      <button className="btn-primary" style={{ padding: '0.6rem 1.25rem' }}>Acknowledge</button>
                  </div>
              ))}
          </div>
          <div style={{ marginTop: '2rem', textAlign: 'center' }}>
              <button style={{ color: 'var(--text-secondary)', background: 'transparent', border: 'none', fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer' }}>View Older Alerts</button>
          </div>
      </GlassCard>

      {/* Footer Info Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
          <div style={{ background: 'linear-gradient(135deg, rgba(255, 180, 164, 0.05) 0%, transparent 100%)', padding: '2rem', borderRadius: '24px', border: '1px solid rgba(255, 180, 164, 0.1)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                  <ShieldAlert size={20} color="#ffb4a4" />
                  <span style={{ fontWeight: 800, color: 'white', textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: '0.7rem' }}>Critical Drifts Detected</span>
              </div>
              <div style={{ fontSize: '2rem', fontWeight: 900, color: '#ffb4a4' }}>02</div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.75rem' }}>Models require retraining to restore optimal accuracy.</p>
          </div>
          <div style={{ background: 'linear-gradient(135deg, rgba(0, 210, 255, 0.05) 0%, transparent 100%)', padding: '2rem', borderRadius: '24px', border: '1px solid rgba(0, 210, 255, 0.1)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                  <Activity size={20} color="var(--primary-accent)" />
                  <span style={{ fontWeight: 800, color: 'white', textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: '0.7rem' }}>Inference Uptime</span>
              </div>
              <div style={{ fontSize: '2rem', fontWeight: 900, color: 'white' }}>99.98%</div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.75rem' }}>Response time stable within SLA (14ms avg).</p>
          </div>
      </div>

    </div>
  );
};

export default AnomalyAlerts;

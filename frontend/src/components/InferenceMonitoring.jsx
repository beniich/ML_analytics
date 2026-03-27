import React from 'react';
import GlassCard from './common/GlassCard';
import { 
  Activity, 
  Timer, 
  AlertTriangle, 
  Zap, 
  TrendingDown, 
  TrendingUp, 
  Bell, 
  ShieldCheck,
  CheckCircle2,
  Clock,
  Layers,
  ArrowUpRight
} from 'lucide-react';

const InferenceMonitoring = () => {
  const alerts = [
    { title: 'P99 Spike Detected', sub: 'Cluster: us-east-1a • 2m ago', val: '240ms', type: 'error' },
    { title: 'Scale Up Completed', sub: 'Nodes increased to 12 • 15m ago', val: '100% Health', type: 'success' },
    { title: 'Daily Report Generated', sub: 'PDF sent to team • 2h ago', val: 'Sent', type: 'info' },
  ];

  const deployments = [
    { version: 'V2', name: 'ResNet-50v2-Prod', sha: 'a1b2c3d', status: 'Active', inf: '12.4M', lat: '42ms', uptime: '99.98%' },
    { version: 'B', name: 'ResNet-50v2-Canary', sha: 'e5f6g7h', status: 'Routing 10%', inf: '1.2M', lat: '38ms', uptime: '100%' },
  ];

  return (
    <div className="inference-monitoring-view" style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
      {/* Header */}
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <h2 style={{ fontSize: '2.5rem', fontWeight: 800, color: 'white', marginBottom: '0.5rem', letterSpacing: '-0.02em' }}>Real-time Inference</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>Live performance metrics for <span style={{ color: '#adc9eb', fontWeight: 600 }}>ResNet-50v2-Prod</span></p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', background: 'rgba(103, 217, 201, 0.05)', padding: '0.6rem 1.2rem', borderRadius: '100px', border: '1px solid rgba(103, 217, 201, 0.1)' }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#67d9c9', boxShadow: '0 0 10px #67d9c9' }}></div>
            <span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#67d9c9', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Live System Status</span>
        </div>
      </header>

      {/* Bento Grid Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
        {/* Latency */}
        <div style={{ background: 'rgba(255,255,255,0.02)', padding: '2rem', borderRadius: '24px', border: '1px solid var(--glass-border)', position: 'relative', overflow: 'hidden' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
                <Timer size={32} color="#adc9eb" />
                <span style={{ fontSize: '0.65rem', fontWeight: 800, color: 'var(--text-secondary)', background: 'rgba(255,255,255,0.05)', padding: '2px 8px', borderRadius: '4px', textTransform: 'uppercase' }}>p99 Latency</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
                <span style={{ fontSize: '3rem', fontWeight: 800 }}>42.8</span>
                <span style={{ fontSize: '1rem', color: '#adc9eb', fontWeight: 600 }}>ms</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#67d9c9', fontSize: '0.8rem', fontWeight: 600, marginTop: '1rem' }}>
                <TrendingDown size={14} /> -2.4% vs last hour
            </div>
        </div>

        {/* Error Rate */}
        <div style={{ background: 'rgba(255,255,255,0.02)', padding: '2rem', borderRadius: '24px', border: '1px solid var(--glass-border)', position: 'relative', overflow: 'hidden' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
                <AlertTriangle size={32} color="var(--primary-accent)" />
                <span style={{ fontSize: '0.65rem', fontWeight: 800, color: 'var(--text-secondary)', background: 'rgba(255,255,255,0.05)', padding: '2px 8px', borderRadius: '4px', textTransform: 'uppercase' }}>Error Rate</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
                <span style={{ fontSize: '3rem', fontWeight: 800, color: 'var(--primary-accent)' }}>0.04</span>
                <span style={{ fontSize: '1.2rem', color: 'var(--primary-accent)', opacity: 0.7, fontWeight: 600 }}>%</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary-accent)', fontSize: '0.8rem', fontWeight: 600, marginTop: '1rem' }}>
                <Bell size={14} /> 3 critical alerts pending
            </div>
        </div>

        {/* Throughput */}
        <div style={{ background: 'rgba(255,255,255,0.02)', padding: '2rem', borderRadius: '24px', border: '1px solid var(--glass-border)', position: 'relative', overflow: 'hidden' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
                <Zap size={32} color="#67d9c9" />
                <span style={{ fontSize: '0.65rem', fontWeight: 800, color: 'var(--text-secondary)', background: 'rgba(255,255,255,0.05)', padding: '2px 8px', borderRadius: '4px', textTransform: 'uppercase' }}>Throughput</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
                <span style={{ fontSize: '3rem', fontWeight: 800 }}>1.2M</span>
                <span style={{ fontSize: '1rem', color: 'var(--text-secondary)', fontWeight: 600 }}>inf/hr</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#67d9c9', fontSize: '0.8rem', fontWeight: 600, marginTop: '1rem' }}>
                <TrendingUp size={14} /> +12% scale-up active
            </div>
        </div>
      </div>

      {/* Distribution Chart & Log */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.8fr 1fr', gap: '1.5rem' }}>
         {/* Chart */}
         <div style={{ background: 'rgba(255,255,255,0.02)', padding: '2rem', borderRadius: '24px', border: '1px solid var(--glass-border)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
                <div>
                   <h4 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'white' }}>Latency Distribution</h4>
                   <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Real-time inference response times across clusters</p>
                </div>
                <div style={{ display: 'flex', background: 'rgba(255,255,255,0.03)', borderRadius: '10px', padding: '0.25rem' }}>
                    <button style={{ padding: '0.4rem 1rem', fontSize: '0.7rem', fontWeight: 800, background: 'rgba(103, 217, 201, 0.1)', color: '#67d9c9', border: 'none', borderRadius: '8px' }}>LIVE</button>
                    <button style={{ padding: '0.4rem 1rem', fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-secondary)', background: 'transparent', border: 'none' }}>1H</button>
                    <button style={{ padding: '0.4rem 1rem', fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-secondary)', background: 'transparent', border: 'none' }}>6H</button>
                </div>
            </div>
            <div style={{ height: '220px', position: 'relative' }}>
                <svg style={{ width: '100%', height: '100%' }} viewBox="0 0 1000 200" preserveAspectRatio="none">
                    <path d="M0,150 Q50,140 100,160 T200,130 T300,145 T400,120 T500,155 T600,110 T700,140 T800,90 T900,120 T1000,100" fill="none" stroke="var(--primary-accent)" strokeWidth="3" />
                </svg>
            </div>
         </div>

         {/* Log */}
         <div style={{ background: 'rgba(255,255,255,0.02)', padding: '2rem', borderRadius: '24px', border: '1px solid var(--glass-border)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem' }}>
                <Bell size={20} color="var(--primary-accent)" />
                <h4 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'white' }}>Incident Log</h4>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {alerts.map((alert, i) => (
                    <div key={i} style={{ display: 'flex', gap: '1rem' }}>
                        <div style={{ width: '4px', height: '48px', borderRadius: '10px', background: alert.type === 'error' ? 'var(--primary-accent)' : alert.type === 'success' ? '#67d9c9' : '#adc9eb' }}></div>
                        <div style={{ flex: 1 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <span style={{ fontSize: '0.9rem', fontWeight: 700 }}>{alert.title}</span>
                                <span style={{ fontSize: '0.65rem', fontWeight: 800, color: alert.type === 'error' ? 'var(--primary-accent)' : alert.type === 'success' ? '#67d9c9' : 'white', textTransform: 'uppercase' }}>{alert.val}</span>
                            </div>
                            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>{alert.sub}</p>
                        </div>
                    </div>
                ))}
            </div>
            <button className="btn-primary" style={{ width: '100%', marginTop: '2rem', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--glass-border)', fontSize: '0.7rem', fontWeight: 800, letterSpacing: '0.1em' }}>
                VIEW ALL HISTORY
            </button>
         </div>
      </div>

      {/* Deployments Table */}
      <div style={{ background: 'rgba(255,255,255,0.02)', padding: '2rem', borderRadius: '24px', border: '1px solid var(--glass-border)' }}>
         <h4 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'white', marginBottom: '2rem' }}>Active Deployments</h4>
         <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                    <tr style={{ color: 'var(--text-secondary)', fontSize: '0.65rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', background: 'rgba(255,255,255,0.03)' }}>
                        <th style={{ padding: '1rem 1.5rem' }}>Model Version</th>
                        <th style={{ padding: '1rem 1.5rem' }}>Status</th>
                        <th style={{ padding: '1rem 1.5rem', textAlign: 'right' }}>Inferences (24h)</th>
                        <th style={{ padding: '1rem 1.5rem', textAlign: 'right' }}>Avg. Latency</th>
                        <th style={{ padding: '1rem 1.5rem', textAlign: 'right' }}>Uptime</th>
                    </tr>
                </thead>
                <tbody style={{ fontSize: '0.9rem' }}>
                    {deployments.map((dep, idx) => (
                        <tr key={idx} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                            <td style={{ padding: '1.5rem' }}>
                                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                    <div style={{ width: '32px', height: '32px', borderRadius: '6px', background: dep.version === 'V2' ? 'rgba(173, 201, 235, 0.2)' : 'rgba(255, 180, 164, 0.2)', color: dep.version === 'V2' ? '#adc9eb' : 'var(--primary-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.75rem' }}>
                                        {dep.version}
                                    </div>
                                    <div>
                                        <div style={{ fontWeight: 700 }}>{dep.name}</div>
                                        <div style={{ fontSize: '0.65rem', color: 'var(--text-secondary)' }}>SHA: {dep.sha}</div>
                                    </div>
                                </div>
                            </td>
                            <td style={{ padding: '1.5rem' }}>
                                <span style={{ fontSize: '0.65rem', fontWeight: 800, padding: '0.25rem 0.6rem', borderRadius: '4px', background: dep.status === 'Active' ? 'rgba(103, 217, 201, 0.1)' : 'rgba(173, 201, 235, 0.1)', color: dep.status === 'Active' ? '#67d9c9' : '#adc9eb', textTransform: 'uppercase' }}>
                                    {dep.status}
                                </span>
                            </td>
                            <td style={{ padding: '1.5rem', textAlign: 'right', fontWeight: 600 }}>{dep.inf}</td>
                            <td style={{ padding: '1.5rem', textAlign: 'right' }}>{dep.lat}</td>
                            <td style={{ padding: '1.5rem', textAlign: 'right', color: 'var(--text-secondary)' }}>{dep.uptime}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
         </div>
      </div>

    </div>
  );
};

export default InferenceMonitoring;

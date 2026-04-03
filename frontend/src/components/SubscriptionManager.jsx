import React, { useState } from 'react';
import GlassCard from './common/GlassCard';
import { 
  CreditCard, 
  Zap, 
  ShieldCheck, 
  BarChart3, 
  Server, 
  Cpu, 
  ArrowUpRight,
  CheckCircle2,
  Clock,
  Layers,
  Sparkles
} from 'lucide-react';
import { toast } from 'react-toastify';
import ApiService from '../services/api';

const SubscriptionManager = () => {
  const [activePlan, setActivePlan] = useState('Pro');
  const [loadingPlan, setLoadingPlan] = useState(null);
  const [isAddingCredits, setIsAddingCredits] = useState(false);

  const quotas = [
    { label: 'AI Inference Credits', used: 8500, total: 10000, icon: <Sparkles size={18} color="#ffb4a4" />, unit: 'req' },
    { label: 'API Calls', used: 45000, total: 50000, icon: <Server size={18} color="var(--primary-accent)" />, unit: 'calls' },
    { label: 'Compute Time (GPU)', used: 120, total: 200, icon: <Cpu size={18} color="#67d9c9" />, unit: 'hrs' },
  ];

  const plans = [
    { name: 'Starter', price: '0', features: ['1k AI Credits', '10k API Calls', 'Community Support'], accent: 'var(--text-secondary)' },
    { name: 'Pro', price: '49', features: ['10k AI Credits', '50k API Calls', 'Priority GPU Access', 'SLA Guarantee'], accent: 'var(--primary-accent)' },
    { name: 'Enterprise', price: 'Custom', features: ['Unlimited Credits', 'Unlimited API', 'Dedicated Cluster', 'White-glove Support'], accent: '#ffb4a4' },
  ];

  const handleUpgrade = async (planName) => {
    if (planName === activePlan) {
      toast.info(`You are already on the ${planName} plan. Redirecting to billing portal...`);
      return;
    }
    setLoadingPlan(planName);
    try {
      if (ApiService.billing?.upgradePlan) {
          await ApiService.billing.upgradePlan(planName);
      } else {
          await new Promise(res => setTimeout(res, 2000));
      }
      toast.success(`Successfully upgraded to ${planName} plan!`);
      setActivePlan(planName);
    } catch (e) {
      toast.error('Payment processing failed.');
    } finally {
      setLoadingPlan(null);
    }
  };

  const handleAddCredits = async () => {
    setIsAddingCredits(true);
    try {
      await new Promise(res => setTimeout(res, 1000));
      toast.success('Credits added successfully.');
    } catch (e) {
      toast.error('Failed to add credits.');
    } finally {
      setIsAddingCredits(false);
    }
  };

  return (
    <div className="subscription-view" style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
      {/* Header */}
      <header>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <div>
            <h2 style={{ fontSize: '2.5rem', fontWeight: 800, color: 'white', marginBottom: '0.5rem', letterSpacing: '-0.02em' }}>Monetization & Quotas</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>Manage your premium services, AI credits, and API usage limits.</p>
          </div>
          <div style={{ display: 'flex', gap: '1rem' }}>
             <button 
                className="btn-primary" 
                onClick={handleAddCredits}
                disabled={isAddingCredits}
                style={{ background: 'rgba(255,180,164,0.1)', border: '1px solid #ffb4a4', color: '#ffb4a4' }}
             >
                {isAddingCredits ? 'Processing...' : 'Add Credits'}
             </button>
             <button 
                className="btn-primary"
                onClick={() => handleUpgrade('Pro')}
                disabled={loadingPlan !== null}
             >
                Upgrade Plan
             </button>
          </div>
        </div>
      </header>

      {/* Quota Dashboard */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
          {quotas.map((q, idx) => {
              const perc = (q.used / q.total) * 100;
              return (
                  <GlassCard key={idx} style={{ padding: '1.5rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                          <div style={{ p: '8px', background: 'rgba(255,255,255,0.03)', borderRadius: '10px' }}>{q.icon}</div>
                          <span style={{ fontWeight: 700, fontSize: '0.9rem', color: 'white' }}>{q.label}</span>
                      </div>
                      <div style={{ marginBottom: '0.5rem', display: 'flex', justifyContent: 'space-between' }}>
                          <span style={{ fontSize: '1.5rem', fontWeight: 900, color: 'white' }}>{q.used.toLocaleString()} <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 400 }}>/ {q.total.toLocaleString()} {q.unit}</span></span>
                          <span style={{ fontSize: '0.8rem', color: perc > 80 ? '#ffb4a4' : 'var(--primary-accent)', fontWeight: 800 }}>{perc.toFixed(0)}%</span>
                      </div>
                      <div style={{ height: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '100px', overflow: 'hidden' }}>
                          <div style={{ width: `${perc}%`, height: '100%', background: perc > 80 ? '#ffb4a4' : 'var(--primary-accent)', borderRadius: '100px' }}></div>
                      </div>
                  </GlassCard>
              );
          })}
      </div>

      {/* Plan Selection */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2rem' }}>
          {plans.map((p, idx) => (
              <div key={idx} style={{ 
                  background: 'rgba(255,255,255,0.02)', 
                  padding: '2.5rem', 
                  borderRadius: '32px', 
                  border: `1px solid ${activePlan === p.name ? p.accent : 'var(--glass-border)'}`,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '2rem',
                  position: 'relative'
              }}>
                  {activePlan === p.name && (
                      <div style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: p.accent, color: 'black', padding: '2px 10px', borderRadius: '100px', fontSize: '0.65rem', fontWeight: 900 }}>CURRENT PLAN</div>
                  )}
                  <div>
                      <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'white', marginBottom: '0.5rem' }}>{p.name}</h3>
                      <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
                          <span style={{ fontSize: '2.5rem', fontWeight: 900, color: 'white' }}>${p.price}</span>
                          {p.price !== 'Custom' && <span style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>/mo</span>}
                      </div>
                  </div>
                  
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                      {p.features.map((f, i) => (
                          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                              <CheckCircle2 size={16} color={p.accent} />
                              {f}
                          </div>
                      ))}
                  </div>

                  <button 
                     className="btn-primary" 
                     onClick={() => handleUpgrade(p.name)}
                     disabled={loadingPlan === p.name}
                     style={{ width: '100%', padding: '1rem', background: activePlan === p.name ? 'rgba(255,255,255,0.05)' : p.accent, border: 'none', color: activePlan === p.name ? 'white' : 'black', fontWeight: 900 }}
                  >
                      {loadingPlan === p.name ? 'Processing...' : activePlan === p.name ? 'Manage Plan' : `Upgrade to ${p.name}`}
                  </button>
              </div>
          ))}
      </div>

      {/* Invoicing & History */}
      <GlassCard title="Recent Transactions">
          <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                  <thead>
                      <tr style={{ color: 'var(--text-secondary)', fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                          <th style={{ padding: '1rem' }}>Service</th>
                          <th style={{ padding: '1rem' }}>Date</th>
                          <th style={{ padding: '1rem' }}>Amount</th>
                          <th style={{ padding: '1rem' }}>Status</th>
                          <th style={{ padding: '1rem' }}>Invoice</th>
                      </tr>
                  </thead>
                  <tbody style={{ color: 'white', fontSize: '0.9rem' }}>
                      {[
                        { s: 'Pro Plan Monthly', d: 'Oct 01, 2023', a: '$49.00', st: 'Paid' },
                        { s: '5k AI Credit Top-up', d: 'Sep 15, 2023', a: '$25.00', st: 'Paid' },
                      ].map((t, i) => (
                          <tr key={i} style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                              <td style={{ padding: '1rem' }}>{t.s}</td>
                              <td style={{ padding: '1rem', color: 'var(--text-secondary)' }}>{t.d}</td>
                              <td style={{ padding: '1rem', fontWeight: 700 }}>{t.a}</td>
                              <td style={{ padding: '1rem' }}><span style={{ color: '#67d9c9', fontWeight: 700 }}>{t.st}</span></td>
                              <td style={{ padding: '1rem' }}><button onClick={() => toast.info('Downloading invoice PDF...')} style={{ background: 'transparent', border: 'none', color: 'var(--primary-accent)', cursor: 'pointer' }}><CreditCard size={16} /></button></td>
                          </tr>
                      ))}
                  </tbody>
              </table>
          </div>
      </GlassCard>

    </div>
  );
};

export default SubscriptionManager;

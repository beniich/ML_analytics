import React from 'react';
import GlassCard from './common/GlassCard';
import { 
  Users, 
  MessageSquare, 
  CheckCircle2, 
  AlertTriangle, 
  TrendingUp, 
  Clock, 
  Reply, 
  Shield, 
  CalendarDays, 
  Share2, 
  Waves,
  Zap,
  MoreVertical,
  UserPlus
} from 'lucide-react';
import { toast } from 'react-toastify';

const TeamCollaboration = () => {
  const activities = [
    {
      id: 1,
      user: 'Elena Chen',
      role: 'Lead Scientist',
      action: 'commented on',
      target: 'Inference Latency',
      comment: '"We need to optimize the quantization levels for the mobile edge deployment."',
      time: '2m ago',
      type: 'comment'
    },
    {
      id: 2,
      user: 'System',
      action: 'deployed',
      target: 'Model v2.4-stable',
      tags: ['Production', 'US-East-1'],
      time: '45m ago',
      type: 'deploy'
    },
    {
      id: 3,
      user: 'Marcus Thorne',
      role: 'Sr. Dev Ops',
      action: 'flagged a',
      target: 'Data Drift',
      targetSuffix: 'anomaly',
      comment: '"The distribution for the \'user_tenure\' feature has shifted by 14% since Monday."',
      time: '2h ago',
      type: 'alert'
    }
  ];

  const members = [
    { name: 'Elena Chen', role: 'Lead Scientist', status: 'online' },
    { name: 'Marcus Thorne', role: 'Sr. Dev Ops', status: 'online' }
  ];

  return (
    <div className="team-collaboration-view" style={{ display: 'flex', gap: '2.5rem', height: '100%', overflow: 'hidden' }}>
      
      {/* Left Column: Activity Feed */}
      <section style={{ width: '380px', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
         <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Team Activity</h3>
            <span style={{ fontSize: '0.65rem', fontWeight: 800, padding: '0.2rem 0.6rem', background: 'rgba(0, 210, 255, 0.1)', color: 'var(--primary-accent)', borderRadius: '20px', textTransform: 'uppercase', letterSpacing: '1px' }}>Live</span>
         </div>
         
         <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1.25rem', paddingRight: '0.5rem' }}>
            {activities.map((act) => (
              <div key={act.id} style={{ 
                padding: '1.25rem', 
                background: 'rgba(255,255,255,0.02)', 
                borderLeft: `4px solid ${act.type === 'comment' ? 'var(--primary-accent)' : act.type === 'deploy' ? '#10b981' : '#ef4444'}`,
                borderRadius: '8px',
                border: '1px solid var(--glass-border)',
                borderLeftWidth: '4px'
              }}>
                 <div style={{ display: 'flex', gap: '1rem' }}>
                    <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--primary-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                       {act.type === 'deploy' ? <CheckCircle2 size={16} color="#0f172a" /> : <Users size={16} color="#0f172a" />}
                    </div>
                    <div style={{ flex: 1 }}>
                       <p style={{ fontSize: '0.85rem', color: 'white', fontWeight: 600 }}>
                          {act.user} <span style={{ color: 'var(--text-secondary)', fontWeight: 400 }}>{act.action}</span> <span style={{ color: act.type === 'deploy' ? '#10b981' : 'var(--primary-accent)' }}>{act.target}</span>
                       </p>
                       {act.comment && (
                         <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.5rem', fontStyle: 'italic', lineHeight: 1.4 }}>
                            {act.comment}
                         </p>
                       )}
                       {act.tags && (
                         <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                            {act.tags.map(t => <span key={t} style={{ fontSize: '0.6rem', padding: '0.1rem 0.4rem', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', color: 'var(--text-secondary)' }}>{t}</span>)}
                         </div>
                       )}
                       <div style={{ display: 'flex', gap: '1rem', marginTop: '0.75rem', fontSize: '0.65rem', fontWeight: 800, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
                          <span>{act.time}</span>
                          {act.type === 'comment' && (
                            <button onClick={() => toast.info('Reply modal opened.')} style={{ background: 'transparent', border: 'none', color: 'var(--primary-accent)', display: 'flex', alignItems: 'center', gap: '0.2rem', padding: 0, fontWeight: 800, cursor: 'pointer' }}>
                               <Reply size={12} /> Reply
                            </button>
                          )}
                       </div>
                    </div>
                 </div>
              </div>
            ))}
         </div>

         <div style={{ borderTop: '1px solid var(--glass-border)', paddingTop: '1.5rem' }}>
            <h4 style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '1.5rem', letterSpacing: '1px' }}>Project Members</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
               {members.map(m => (
                 <div key={m.name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                       <div style={{ position: 'relative' }}>
                          <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Users size={16} /></div>
                          <div style={{ position: 'absolute', bottom: 0, right: 0, width: '10px', height: '10px', border: '2px solid #0f172a', borderRadius: '50%', background: '#10b981' }}></div>
                       </div>
                       <div>
                          <div style={{ fontSize: '0.85rem', fontWeight: 700 }}>{m.name}</div>
                          <div style={{ fontSize: '0.65rem', color: 'var(--text-secondary)' }}>{m.role}</div>
                       </div>
                    </div>
                    <MoreVertical size={14} color="var(--text-secondary)" cursor="pointer" />
                 </div>
               ))}
               <button onClick={() => toast.success('Invitation link copied to clipboard.')} style={{ width: '100%', marginTop: '0.5rem', padding: '0.75rem', borderRadius: '8px', border: '1px dashed var(--glass-border)', background: 'transparent', color: 'var(--text-secondary)', fontSize: '0.75rem', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                  <UserPlus size={14} /> Invite Member
               </button>
            </div>
         </div>
      </section>

      {/* Right Column: Shared Dashboard */}
      <section style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '2rem' }}>
         <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
               <h3 style={{ fontSize: '1.8rem', fontWeight: 900 }}>System Performance Core</h3>
               <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Shared interactive view of project metrics and drift status.</p>
            </div>
            <div style={{ display: 'flex', gap: '1rem' }}>
               <button onClick={() => toast.info('Filtering view: Last 24h')} style={{ padding: '0.6rem 1rem', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', color: 'white', fontSize: '0.75rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                  <CalendarDays size={14} /> Last 24h
               </button>
               <button onClick={() => toast.success('View snapshot link generated!')} style={{ padding: '0.6rem 1rem', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', color: 'white', fontSize: '0.75rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                  <Share2 size={14} /> Share View
               </button>
            </div>
         </div>

         <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gridTemplateRows: 'repeat(6, 1fr)', gap: '1.5rem', flex: 1 }}>
            
            {/* Accuracy Chart */}
            <GlassCard style={{ gridColumn: 'span 8', gridRow: 'span 4', padding: '2rem', display: 'flex', flexDirection: 'column' }}>
               <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
                  <div>
                     <h4 style={{ fontSize: '1.1rem', fontWeight: 800 }}>Prediction Accuracy</h4>
                     <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Weighted average across all inference nodes</p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                     <div style={{ fontSize: '1.8rem', fontWeight: 900, color: 'var(--primary-accent)' }}>98.42%</div>
                     <div style={{ fontSize: '0.65rem', color: '#10b981', fontWeight: 800 }}>+1.2% from v2.3</div>
                  </div>
               </div>
               <div style={{ flex: 1, position: 'relative' }}>
                  <svg style={{ width: '100%', height: '100%' }} preserveAspectRatio="none">
                     <path d="M0,150 Q75,140 150,165 T300,120 T450,110 T600,60 T750,90 T900,40" fill="none" stroke="var(--primary-accent)" strokeWidth="3" />
                  </svg>
                  {/* Pinned Thread Context */}
                  <div style={{ position: 'absolute', top: '40px', right: '15%', padding: '1rem', background: 'rgba(15, 23, 42, 0.9)', border: '1px solid var(--primary-accent)', borderRadius: '12px', maxWidth: '200px', zIndex: 10 }}>
                     <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                        <div style={{ width: '16px', height: '16px', borderRadius: '50%', background: 'var(--primary-accent)' }}></div>
                        <span style={{ fontSize: '0.65rem', fontWeight: 800 }}>Elena Chen</span>
                     </div>
                     <p style={{ fontSize: '0.65rem', fontStyle: 'italic', lineHeight: 1.4 }}>"This spike correlates with the layer optimization."</p>
                     <div style={{ marginTop: '0.5rem', fontSize: '0.55rem', fontWeight: 900, color: 'var(--primary-accent)', textTransform: 'uppercase' }}>In Discussion</div>
                  </div>
               </div>
            </GlassCard>

            {/* Drift Status */}
            <GlassCard style={{ gridColumn: 'span 4', gridRow: 'span 2', padding: '1.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
               <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Waves size={18} color="var(--primary-accent)" />
                  <span style={{ fontSize: '0.6rem', fontWeight: 800, color: '#10b981', textTransform: 'uppercase' }}>Normal</span>
               </div>
               <div>
                  <h4 style={{ fontSize: '0.85rem', fontWeight: 800 }}>Data Drift PSI</h4>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginTop: '0.5rem' }}>
                     <span style={{ fontSize: '2rem', fontWeight: 900 }}>0.082</span>
                     <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>/ 0.20 max</span>
                  </div>
                  <div style={{ width: '100%', height: '4px', background: 'rgba(255,255,255,0.05)', borderRadius: '2px', marginTop: '0.75rem' }}>
                     <div style={{ width: '41%', height: '100%', background: 'var(--primary-accent)', borderRadius: '2px' }}></div>
                  </div>
               </div>
            </GlassCard>

            {/* Pending Tasks */}
            <GlassCard style={{ gridColumn: 'span 4', gridRow: 'span 2', padding: '1.5rem' }}>
               <h4 style={{ fontSize: '0.65rem', fontWeight: 800, color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '1rem', letterSpacing: '1px' }}>Pending Peer Review</h4>
               <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.75rem' }}>
                     <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--primary-accent)' }}></div>
                     <span style={{ color: 'white' }}>PR-402: Hyper-param tuning</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.75rem' }}>
                     <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981' }}></div>
                     <span style={{ color: 'white' }}>DATA-91: Clean validation set</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.75rem' }}>
                     <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'rgba(255,255,255,0.2)' }}></div>
                     <span style={{ color: 'white' }}>UI-11: Dashboard Dark Mode</span>
                  </div>
               </div>
            </GlassCard>

            {/* Regional Latency */}
            <GlassCard style={{ gridColumn: 'span 12', gridRow: 'span 2', padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '3rem' }}>
               <div>
                  <h4 style={{ fontSize: '0.9rem', fontWeight: 800, marginBottom: '0.25rem' }}>Regional Latency</h4>
                  <p style={{ fontSize: '0.65rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1px' }}>P99 (ms)</p>
                  <div style={{ display: 'flex', gap: '1.5rem', marginTop: '1rem' }}>
                     <div><div style={{ fontSize: '1rem', fontWeight: 800 }}>24ms</div><div style={{ fontSize: '0.6rem', color: 'var(--text-secondary)' }}>US-W</div></div>
                     <div style={{ width: '1px', background: 'var(--glass-border)' }}></div>
                     <div><div style={{ fontSize: '1rem', fontWeight: 800 }}>118ms</div><div style={{ fontSize: '0.6rem', color: 'var(--text-secondary)' }}>EU-C</div></div>
                     <div style={{ width: '1px', background: 'var(--glass-border)' }}></div>
                     <div><div style={{ fontSize: '1rem', fontWeight: 800, color: '#ef4444' }}>210ms</div><div style={{ fontSize: '0.6rem', color: 'var(--text-secondary)' }}>AS-S</div></div>
                  </div>
               </div>
               <div style={{ flex: 1, height: '50px', display: 'flex', alignItems: 'flex-end', gap: '4px' }}>
                  {[40, 60, 80, 100, 70, 50, 90, 40, 60, 80, 100, 70].map((h, i) => (
                    <div key={i} style={{ flex: 1, background: 'rgba(255,255,255,0.05)', height: `${h}%`, borderRadius: '2px 2px 0 0', transition: 'background 0.2s' }} className="bar-hover-accent"></div>
                  ))}
               </div>
            </GlassCard>

         </div>
      </section>

      {/* Floating Action Button */}
      <button 
        onClick={() => toast.info('Opening new discussion thread...')}
        style={{ 
        position: 'fixed', bottom: '2rem', right: '2rem', 
        width: '60px', height: '60px', borderRadius: '50%', 
        background: 'linear-gradient(135deg, #00d2ff 0%, #3a7bd5 100%)',
        border: 'none', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5)', zIndex: 100, cursor: 'pointer'
      }}>
         <MessageSquare size={24} fill="white" />
      </button>

    </div>
  );
};

export default TeamCollaboration;

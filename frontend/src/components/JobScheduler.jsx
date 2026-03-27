import React from 'react';
import GlassCard from './common/GlassCard';
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight, 
  Clock, 
  Repeat, 
  MoreVertical,
  Activity,
  Zap,
  ArrowRight
} from 'lucide-react';

const JobScheduler = () => {
  // Mock Calendar data
  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const calendarDays = [
    { date: 27, type: 'prev' }, { date: 28, type: 'prev' }, { date: 29, type: 'prev' }, 
    { date: 30, type: 'prev' }, { date: 31, type: 'prev' }, { date: 1, type: 'current' }, 
    { date: 2, type: 'current' }, { date: 3, type: 'current' }, 
    { date: 4, type: 'current', events: [{ type: 'completed', label: 'Completed' }, { type: 'running', label: 'Running' }] }, 
    { date: 5, type: 'current' }, 
    { date: 6, type: 'current', events: [{ type: 'failed', label: 'Failed' }] }, 
    { date: 7, type: 'current', today: true }, { date: 8, type: 'current' }, 
    { date: 9, type: 'current' }, { date: 10, type: 'current' }, { date: 11, type: 'current' }, 
    { date: 12, type: 'current', events: [{ type: 'scheduled', label: 'Scheduled' }] }, 
    { date: 13, type: 'current' }, { date: 14, type: 'current' }, { date: 15, type: 'current' }, 
    { date: 16, type: 'current' }
  ];

  const getEventStyle = (type) => {
    switch(type) {
      case 'completed': return { bg: 'rgba(16, 185, 129, 0.2)', border: '#10b981', color: '#10b981' };
      case 'running': return { bg: 'rgba(0, 210, 255, 0.2)', border: 'var(--primary-accent)', color: 'var(--primary-accent)' };
      case 'failed': return { bg: 'rgba(239, 68, 68, 0.2)', border: '#ef4444', color: '#ef4444' };
      case 'scheduled': return { bg: 'rgba(255, 255, 255, 0.1)', border: 'var(--text-secondary)', color: 'white' };
      default: return { bg: 'transparent', border: 'transparent', color: 'white' };
    }
  };

  return (
    <div className="job-scheduler-view" style={{ display: 'flex', flexDirection: 'column', gap: '2rem', height: '100%' }}>
      
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end' }}>
        <div>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 800 }}>Batch Processing Scheduler</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Manage and monitor automated analysis workloads across your ML pipeline.</p>
        </div>
        <div style={{ display: 'flex', background: 'rgba(0,0,0,0.3)', borderRadius: '30px', padding: '0.25rem' }}>
           <button style={{ padding: '0.5rem 1.5rem', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 700, background: 'var(--primary-accent)', color: '#0f172a', border: 'none', cursor: 'pointer' }}>Calendar</button>
           <button style={{ padding: '0.5rem 1.5rem', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 700, background: 'transparent', color: 'var(--text-secondary)', border: 'none', cursor: 'pointer' }}>Timeline</button>
        </div>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '2rem', flex: 1, minHeight: 0, overflowY: 'auto', paddingBottom: '2rem' }}>
        
        {/* Main Calendar Section */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
           <GlassCard style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                 <h2 style={{ fontSize: '1.2rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <CalendarIcon color="var(--primary-accent)" /> November 2024
                 </h2>
                 <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button style={{ background: 'rgba(255,255,255,0.05)', border: 'none', borderRadius: '8px', padding: '0.5rem', color: 'white', cursor: 'pointer' }}><ChevronLeft size={16} /></button>
                    <button style={{ background: 'rgba(255,255,255,0.05)', border: 'none', borderRadius: '8px', padding: '0.5rem', color: 'white', cursor: 'pointer' }}><ChevronRight size={16} /></button>
                 </div>
              </div>

              {/* Calendar Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '1px', background: 'var(--glass-border)', borderRadius: '12px', overflow: 'hidden', border: '1px solid var(--glass-border)' }}>
                 {/* Days Header */}
                 {daysOfWeek.map(day => (
                   <div key={day} style={{ background: 'rgba(15, 23, 42, 0.8)', padding: '1rem 0', textAlign: 'center', fontSize: '0.65rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-secondary)' }}>
                      {day}
                   </div>
                 ))}
                 
                 {/* Calendar Cells */}
                 {calendarDays.map((day, idx) => (
                   <div key={idx} style={{ 
                     minHeight: '120px', 
                     padding: '0.75rem', 
                     background: day.today ? 'rgba(0, 210, 255, 0.05)' : 'rgba(15, 23, 42, 0.6)', 
                     border: day.today ? '1px solid var(--primary-accent)' : 'none',
                     opacity: day.type === 'prev' ? 0.4 : 1
                   }}>
                      <span style={{ fontSize: '0.85rem', fontWeight: 600, color: day.today ? 'var(--primary-accent)' : 'white' }}>{day.date}</span>
                      
                      {day.events && (
                        <div style={{ marginTop: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                           {day.events.map((evt, i) => {
                             const style = getEventStyle(evt.type);
                             return (
                               <div key={i} style={{ padding: '0.2rem 0.4rem', background: style.bg, borderLeft: `2px solid ${style.border}`, borderRadius: '4px', fontSize: '0.6rem', fontWeight: 700, textTransform: 'uppercase', color: style.color, display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                  <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: style.border }}></div>
                                  {evt.label}
                               </div>
                             );
                           })}
                        </div>
                      )}
                   </div>
                 ))}
              </div>
           </GlassCard>

           {/* Metrics below calendar */}
           <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
              <GlassCard style={{ padding: '2rem', borderLeft: '4px solid var(--primary-accent)' }}>
                 <p style={{ fontSize: '0.65rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--primary-accent)', marginBottom: '0.5rem' }}>Network Health</p>
                 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                    <h3 style={{ fontSize: '2.5rem', fontWeight: 900 }}>99.4%</h3>
                    <div style={{ display: 'flex', gap: '4px', height: '40px', alignItems: 'flex-end', opacity: 0.8 }}>
                       <div style={{ width: '12px', height: '40%', background: 'var(--primary-accent)', borderRadius: '2px 2px 0 0', opacity: 0.5 }}></div>
                       <div style={{ width: '12px', height: '60%', background: 'var(--primary-accent)', borderRadius: '2px 2px 0 0', opacity: 0.5 }}></div>
                       <div style={{ width: '12px', height: '80%', background: 'var(--primary-accent)', borderRadius: '2px 2px 0 0', opacity: 0.5 }}></div>
                       <div style={{ width: '12px', height: '100%', background: 'var(--primary-accent)', borderRadius: '2px 2px 0 0' }}></div>
                    </div>
                 </div>
              </GlassCard>
              <GlassCard style={{ padding: '2rem', borderLeft: '4px solid #10b981' }}>
                 <p style={{ fontSize: '0.65rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px', color: '#10b981', marginBottom: '0.5rem' }}>Throughput</p>
                 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                    <h3 style={{ fontSize: '2.5rem', fontWeight: 900 }}>1.2 TB/hr</h3>
                    <div style={{ display: 'flex', gap: '4px', height: '40px', alignItems: 'flex-end', opacity: 0.8 }}>
                       <div style={{ width: '12px', height: '70%', background: '#10b981', borderRadius: '2px 2px 0 0' }}></div>
                       <div style={{ width: '12px', height: '90%', background: '#10b981', borderRadius: '2px 2px 0 0' }}></div>
                       <div style={{ width: '12px', height: '60%', background: '#10b981', borderRadius: '2px 2px 0 0' }}></div>
                       <div style={{ width: '12px', height: '85%', background: '#10b981', borderRadius: '2px 2px 0 0' }}></div>
                    </div>
                 </div>
              </GlassCard>
           </div>
        </div>

        {/* Sidebar right */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
           
           <GlassCard style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                 <h3 style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--text-secondary)' }}>Recurring Tasks</h3>
                 <span style={{ fontSize: '0.6rem', padding: '0.1rem 0.4rem', background: 'rgba(0, 210, 255, 0.1)', color: 'var(--primary-accent)', borderRadius: '4px', fontWeight: 700 }}>04 Active</span>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                 {[
                   { name: 'Daily Sentiment Sweep', time: '04:00 AM', repeat: 'Daily' },
                   { name: 'Model Retraining V4', time: 'Sun 12:00', repeat: 'Weekly' },
                   { name: 'Infrastructure Backup', time: 'Every 6h', repeat: 'Hourly' }
                 ].map((task, i) => (
                   <div key={i} style={{ padding: '0.75rem', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--glass-border)', borderRadius: '8px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                         <p style={{ fontSize: '0.85rem', fontWeight: 700 }}>{task.name}</p>
                         <MoreVertical size={14} style={{ color: 'var(--text-secondary)', cursor: 'pointer' }} />
                      </div>
                      <div style={{ display: 'flex', gap: '1rem', fontSize: '0.7rem', color: 'var(--text-secondary)' }}>
                         <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><Clock size={12} /> {task.time}</span>
                         <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><Repeat size={12} /> {task.repeat}</span>
                      </div>
                   </div>
                 ))}
              </div>
           </GlassCard>

           <GlassCard style={{ padding: '1.5rem' }}>
              <h3 style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>Recent Executions</h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                 
                 <div style={{ display: 'flex', gap: '1rem' }}>
                    <div style={{ width: '4px', background: '#10b981', borderRadius: '4px' }}></div>
                    <div style={{ flex: 1 }}>
                       <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                          <p style={{ fontSize: '0.85rem', fontWeight: 700 }}>Data Cleansing</p>
                          <span style={{ fontSize: '0.6rem', fontWeight: 800, color: '#10b981', textTransform: 'uppercase' }}>Completed</span>
                       </div>
                       <p style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>Took 12m 45s • ID: #B-9921</p>
                    </div>
                 </div>

                 <div style={{ display: 'flex', gap: '1rem' }}>
                    <div style={{ width: '4px', background: 'var(--primary-accent)', borderRadius: '4px' }}></div>
                    <div style={{ flex: 1 }}>
                       <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                          <p style={{ fontSize: '0.85rem', fontWeight: 700 }}>Neural Mesh Sync</p>
                          <span style={{ fontSize: '0.6rem', fontWeight: 800, color: 'var(--primary-accent)', textTransform: 'uppercase' }}>Running</span>
                       </div>
                       <div style={{ width: '100%', height: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: '2px', marginTop: '0.5rem', overflow: 'hidden' }}>
                          <div style={{ width: '65%', height: '100%', background: 'var(--primary-accent)', borderRadius: '2px' }}></div>
                       </div>
                    </div>
                 </div>

                 <div style={{ display: 'flex', gap: '1rem' }}>
                    <div style={{ width: '4px', background: '#ef4444', borderRadius: '4px' }}></div>
                    <div style={{ flex: 1 }}>
                       <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                          <p style={{ fontSize: '0.85rem', fontWeight: 700 }}>Cold Storage Migration</p>
                          <span style={{ fontSize: '0.6rem', fontWeight: 800, color: '#ef4444', textTransform: 'uppercase' }}>Failed</span>
                       </div>
                       <p style={{ fontSize: '0.7rem', color: '#ef4444', opacity: 0.8 }}>Timeout error: DB connection lost.</p>
                    </div>
                 </div>

              </div>
           </GlassCard>

           {/* Promo Card */}
           <div style={{ background: 'linear-gradient(135deg, rgba(0, 210, 255, 0.1) 0%, rgba(15, 23, 42, 0.8) 100%)', borderRadius: '16px', padding: '1.5rem', border: '1px solid rgba(0, 210, 255, 0.2)', position: 'relative', overflow: 'hidden' }}>
              <Zap size={80} style={{ position: 'absolute', right: '-10px', bottom: '-10px', opacity: 0.05, color: 'var(--primary-accent)' }} />
              <h4 style={{ fontSize: '0.9rem', fontWeight: 800, marginBottom: '0.5rem' }}>Advanced Heuristics</h4>
              <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.7)', marginBottom: '1rem', lineHeight: 1.5 }}>
                 Let AI automatically adjust your processing schedule based on server load and costs.
              </p>
              <button style={{ background: 'transparent', border: 'none', color: 'var(--primary-accent)', fontSize: '0.75rem', fontWeight: 800, padding: 0, display: 'flex', alignItems: 'center', gap: '0.25rem', cursor: 'pointer' }}>
                 Enable Optimization <ArrowRight size={12} />
              </button>
           </div>

        </div>
      </div>
    </div>
  );
};

export default JobScheduler;

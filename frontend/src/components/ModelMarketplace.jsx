import React from 'react';
import GlassCard from './common/GlassCard';
import { 
  ShoppingBag, 
  Search, 
  Plus, 
  History, 
  Activity, 
  CheckCircle2, 
  Zap, 
  Database, 
  Star, 
  Eye, 
  TrendingUp,
  Filter,
  ArrowRight,
  MessageSquareQuotation,
  Quote
} from 'lucide-react';

const ModelMarketplace = () => {
  const stats = [
    { label: 'Active Deployments', val: '124', color: 'var(--primary-accent)' },
    { label: 'Avg. Accuracy', val: '98.2%', color: '#adc9eb' },
    { label: 'Total Inferences', val: '14.2M', color: '#67d9c9' },
    { label: 'Market Value', val: '$2.4M', color: 'white' }
  ];

  const models = [
    { 
      name: 'Vision-Guardian V2', 
      desc: 'Real-time object detection and anomaly flagging for industrial surveillance pipelines.',
      tags: ['PyTorch', 'Real-time'],
      precision: '97.8%',
      rating: '4.9',
      reviews: '1.2k',
      icon: <Eye size={20} />
    },
    { 
      name: 'MarketForecaster Prime', 
      desc: 'High-frequency financial time-series prediction with confidence interval mapping.',
      tags: ['TensorFlow', 'Regression'],
      precision: '92.1%',
      rating: '4.7',
      reviews: '842',
      icon: <TrendingUp size={20} />
    },
    { 
      name: 'HealthText BioBERT', 
      desc: 'Medical entity recognition and clinical documentation summary for healthcare providers.',
      tags: ['Transformers', 'Medical'],
      precision: '99.1%',
      rating: '4.8',
      reviews: '315',
      icon: <Database size={20} />
    }
  ];

  return (
    <div className="model-marketplace-view" style={{ display: 'flex', flexDirection: 'column', gap: '3rem', height: '100%', overflowY: 'auto', paddingBottom: '3rem' }}>
      
      {/* Hero Header */}
      <section style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--primary-accent)', letterSpacing: '3px', textTransform: 'uppercase' }}>Internal Marketplace</span>
          <h2 style={{ fontSize: '3rem', fontWeight: 900, letterSpacing: '-1.5px' }}>Model Marketplace <span style={{ fontWeight: 300, color: 'var(--text-secondary)', marginLeft: '1rem', fontSize: '2rem' }}>37 / 50 Slots</span></h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', maxWidth: '700px', lineHeight: 1.6 }}>
            Access our curated library of pre-trained enterprise models. Standardized for seamless deployment across production clusters.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
           <button style={{ padding: '0.8rem 1.5rem', borderRadius: '12px', border: '1px solid var(--glass-border)', background: 'rgba(255,255,255,0.05)', color: 'white', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <History size={18} /> View History
           </button>
           <button className="btn-primary" style={{ padding: '0.8rem 1.82rem', fontWeight: 800 }}>
              Upload Custom Model
           </button>
        </div>
      </section>

      {/* Stats Ribbon */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1px', background: 'var(--glass-border)', borderRadius: '16px', overflow: 'hidden', border: '1px solid var(--glass-border)' }}>
         {stats.map(s => (
           <div key={s.label} style={{ background: '#0f172a', padding: '1.5rem 2rem' }}>
              <div style={{ fontSize: '0.65rem', fontWeight: 800, color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '0.5rem', letterSpacing: '1px' }}>{s.label}</div>
              <div style={{ fontSize: '2rem', fontWeight: 900, color: s.color }}>{s.val}</div>
           </div>
         ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '2.5rem' }}>
         
         {/* Featured Model Large Card */}
         <GlassCard style={{ gridColumn: 'span 8', padding: '3rem', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 0, right: 0, width: '40%', height: '100%', opacity: 0.1, background: 'linear-gradient(90deg, transparent, var(--primary-accent))' }}></div>
            <div style={{ position: 'relative', zIndex: 1, maxWidth: '80%' }}>
               <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem' }}>
                  <span style={{ fontSize: '0.6rem', fontWeight: 900, padding: '0.2rem 0.6rem', background: 'rgba(0, 210, 255, 0.1)', color: 'var(--primary-accent)', borderRadius: '20px', textTransform: 'uppercase' }}>Recommended</span>
                  <span style={{ fontSize: '0.6rem', fontWeight: 900, padding: '0.2rem 0.6rem', background: 'rgba(255, 255, 255, 0.05)', borderRadius: '20px', textTransform: 'uppercase' }}>NLP-V4</span>
               </div>
               <h3 style={{ fontSize: '2.2rem', fontWeight: 900, marginBottom: '1rem', letterSpacing: '-0.5px' }}>Semantic Context Engine XL</h3>
               <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: 1.6, marginBottom: '2rem' }}>
                  Our state-of-the-art transformer model optimized for multi-lingual sentiment analysis and intent classification with zero-shot capabilities.
               </p>
               <div style={{ display: 'flex', gap: '3rem', marginBottom: '2.5rem' }}>
                  <div><div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>Accuracy</div><div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#adc9eb' }}>99.4%</div></div>
                  <div><div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>Latency</div><div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#adc9eb' }}>14ms</div></div>
                  <div><div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>Params</div><div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#adc9eb' }}>1.2B</div></div>
               </div>
               <div style={{ display: 'flex', gap: '1rem' }}>
                  <button className="btn-primary" style={{ padding: '0.75rem 2rem', fontWeight: 800 }}>Deploy Now</button>
                  <button style={{ padding: '0.75rem 2rem', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'transparent', color: 'white', fontWeight: 700, cursor: 'pointer' }}>Documentation</button>
               </div>
            </div>
         </GlassCard>

         {/* Marketplace Sidebar / Filter */}
         <div style={{ gridColumn: 'span 4', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <GlassCard title="Filter Marketplace" style={{ padding: '1.5rem', flex: 1 }}>
               <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
                  {['Computer Vision', 'Natural Language', 'Predictive Analytics', 'Recommendation Systems'].map((cat, i) => (
                    <label key={cat} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--glass-border)', borderRadius: '12px', cursor: 'pointer' }}>
                       <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>{cat}</span>
                       <input type="checkbox" defaultChecked={i === 1} style={{ accentColor: 'var(--primary-accent)' }} />
                    </label>
                  ))}
               </div>
            </GlassCard>
            <div style={{ padding: '2rem', background: 'rgba(0, 210, 255, 0.03)', border: '1px solid rgba(0, 210, 255, 0.1)', borderRadius: '24px' }}>
               <Zap size={24} color="var(--primary-accent)" style={{ marginBottom: '1rem' }} />
               <h4 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '0.5rem' }}>Need a custom fine-tune?</h4>
               <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '1.5rem' }}>Schedule a session with our ML Core team to build a proprietary model tailored to your dataset.</p>
               <button style={{ background: 'transparent', border: 'none', color: 'var(--primary-accent)', fontSize: '0.85rem', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>Request Consultation <ArrowRight size={16} /></button>
            </div>
         </div>

         {/* Secondary Models Grid */}
         {models.map(m => (
           <div key={m.name} style={{ gridColumn: 'span 4' }}>
             <GlassCard style={{ padding: '2rem', height: '100%', display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                   <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(255,255,255,0.03)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#adc9eb' }}>{m.icon}</div>
                   <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-secondary)' }}>
                      <Star size={14} fill="var(--primary-accent)" color="var(--primary-accent)" /> 
                      <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'white' }}>{m.rating}</span>
                      <span style={{ fontSize: '0.75rem' }}>({m.reviews})</span>
                   </div>
                </div>
                <h4 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '0.5rem' }}>{m.name}</h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5, flex: 1, marginBottom: '1.5rem' }}>{m.desc}</p>
                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
                   {m.tags.map(t => <span key={t} style={{ fontSize: '0.65rem', fontWeight: 800, padding: '0.2rem 0.5rem', background: 'rgba(255,255,255,0.05)', color: 'var(--text-secondary)', borderRadius: '4px', textTransform: 'uppercase' }}>{t}</span>)}
                </div>
                <div style={{ paddingTop: '1.25rem', borderTop: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                   <div>
                      <div style={{ fontSize: '0.6rem', color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '0.25rem', fontWeight: 800 }}>Precision</div>
                      <div style={{ fontSize: '1.1rem', fontWeight: 900, color: '#67d9c9' }}>{m.precision}</div>
                   </div>
                   <button style={{ padding: '0.5rem 1rem', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', color: 'white', fontWeight: 700, fontSize: '0.75rem', cursor: 'pointer' }}>Deploy</button>
                </div>
             </GlassCard>
           </div>
         ))}

      </div>

      {/* Community Validation */}
      <section style={{ marginTop: '2rem' }}>
         <h3 style={{ fontSize: '1.8rem', fontWeight: 900, marginBottom: '2rem' }}>Community Validation</h3>
         <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '2rem' }}>
            <GlassCard style={{ padding: '2rem', position: 'relative' }}>
               <Quote style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', opacity: 0.1 }} size={48} />
               <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'linear-gradient(45deg, #00d2ff, #3a7bd5)' }}></div>
                  <div><div style={{ fontSize: '0.85rem', fontWeight: 700 }}>Sarah Jenkins</div><div style={{ fontSize: '0.65rem', color: 'var(--text-secondary)' }}>Lead Data Scientist, FinCorp</div></div>
               </div>
               <p style={{ fontSize: '0.85rem', fontStyle: 'italic', lineHeight: 1.6, color: 'var(--text-secondary)' }}>
                  "The Context Engine XL reduced our false positives by 40% in the first week. The deployment container was flawless."
               </p>
            </GlassCard>
            <GlassCard style={{ padding: '2rem', position: 'relative' }}>
               <Quote style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', opacity: 0.1 }} size={48} />
               <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'linear-gradient(45deg, #67d9c9, #006f64)' }}></div>
                  <div><div style={{ fontSize: '0.85rem', fontWeight: 700 }}>David Chen</div><div style={{ fontSize: '0.65rem', color: 'var(--text-secondary)' }}>ML Ops Director, HealthStack</div></div>
               </div>
               <p style={{ fontSize: '0.85rem', fontStyle: 'italic', lineHeight: 1.6, color: 'var(--text-secondary)' }}>
                  "BioBERT is consistently ahead of the curve. Being able to deploy locally within our secure cluster is a huge win for HIPAA."
               </p>
            </GlassCard>
            <div style={{ padding: '2rem', border: '1px dashed var(--glass-border)', borderRadius: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
               <Plus size={32} color="var(--primary-accent)" style={{ marginBottom: '1rem' }} />
               <h4 style={{ fontWeight: 800, marginBottom: '0.5rem' }}>Write a Review</h4>
               <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>Share your production experience with the community.</p>
               <button style={{ background: 'transparent', border: 'none', color: 'var(--primary-accent)', borderBottom: '1px solid var(--primary-accent)', fontSize: '0.8rem', fontWeight: 800, cursor: 'pointer' }}>Start Writing</button>
            </div>
         </div>
      </section>

      {/* FAB */}
      <button style={{ 
        position: 'fixed', bottom: '2rem', right: '2rem', 
        width: '60px', height: '60px', borderRadius: '50%', 
        background: 'linear-gradient(135deg, #00d2ff 0%, #3a7bd5 100%)',
        border: 'none', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5)', zIndex: 100, cursor: 'pointer'
      }}>
         <Plus size={28} />
      </button>

    </div>
  );
};

export default ModelMarketplace;

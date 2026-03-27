import React, { useState } from 'react';
import GlassCard from './common/GlassCard';
import { 
  Search, 
  Rocket, 
  Video, 
  Code, 
  MessagesSquare, 
  ArrowRight, 
  ChevronRight, 
  ShieldCheck, 
  HelpCircle,
  Play
} from 'lucide-react';

const HelpCenter = () => {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="help-center-view" style={{ display: 'flex', flexDirection: 'column', gap: '4rem' }}>
      
      {/* Hero Section */}
      <section style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto' }}>
        <h2 style={{ fontSize: '3.5rem', fontWeight: 900, color: 'white', marginBottom: '1.5rem', letterSpacing: '-0.03em' }}>
            How can we <span style={{ color: 'var(--primary-accent)' }}>help</span> you?
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.25rem', marginBottom: '3rem' }}>
            Access deep-dive documentation, video masterclasses, and API schemas curated for enterprise ML excellence.
        </p>
        <div style={{ position: 'relative' }}>
            <Search style={{ position: 'absolute', left: '1.5rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--primary-accent)' }} size={24} />
            <input 
                type="text" 
                placeholder="Search for models, API endpoints, or tutorials..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ 
                    width: '100%', 
                    padding: '1.5rem 1.5rem 1.5rem 4rem', 
                    borderRadius: '100px', 
                    background: 'rgba(255,255,255,0.03)', 
                    border: '1px solid var(--glass-border)', 
                    color: 'white', 
                    fontSize: '1.1rem',
                    outline: 'none',
                    boxShadow: '0 20px 40px rgba(0,0,0,0.4)'
                }}
            />
        </div>
      </section>

      {/* Main Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '1.5rem' }}>
          
          {/* Foundation Card */}
          <div style={{ 
              gridColumn: 'span 8', 
              background: 'linear-gradient(135deg, rgba(0, 210, 255, 0.1) 0%, rgba(103, 217, 201, 0.05) 100%)', 
              padding: '2.5rem', 
              borderRadius: '32px', 
              border: '1px solid rgba(0, 210, 255, 0.2)',
              position: 'relative',
              overflow: 'hidden'
          }}>
              <div style={{ position: 'relative', zIndex: 1, maxWidth: '400px' }}>
                  <Rocket size={48} color="var(--primary-accent)" style={{ marginBottom: '1.5rem' }} />
                  <h3 style={{ fontSize: '2rem', fontWeight: 900, color: 'white', marginBottom: '1rem' }}>Foundation Series</h3>
                  <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '2.5rem' }}>
                      New to ML Analytics AI? Start with our interactive onboarding modules to master the dashboard in under 15 minutes.
                  </p>
                  <button className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '1rem 2rem' }}>
                      Start Onboarding <ArrowRight size={18} />
                  </button>
              </div>
              <div style={{ position: 'absolute', right: '-10%', bottom: '-10%', width: '60%', height: '80%', opacity: 0.2 }}>
                  <div style={{ width: '100%', height: '100%', background: 'radial-gradient(circle, var(--primary-accent) 0%, transparent 70%)' }}></div>
              </div>
          </div>

          {/* Video Library */}
          <div style={{ gridColumn: 'span 4', background: 'rgba(255,255,255,0.02)', padding: '2rem', borderRadius: '32px', border: '1px solid var(--glass-border)', display: 'flex', flexDirection: 'column' }}>
              <Video size={40} color="#67d9c9" style={{ marginBottom: '1.5rem' }} />
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'white', marginBottom: '0.5rem' }}>Video Library</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '2rem' }}>Expert-led walkthroughs of complex ML pipeline configurations.</p>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {[ 'Dataset Normalization', 'Model Versioning Logic', 'Advanced SQL Exports' ].map((v, idx) => (
                      <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'white', fontSize: '0.8rem', cursor: 'pointer' }} className="hover:text-primary-accent">
                          <Play size={14} fill="currentColor" /> {v}
                      </div>
                  ))}
              </div>
          </div>

          {/* API Reference */}
          <div style={{ gridColumn: 'span 4', background: 'rgba(255,255,255,0.02)', padding: '2rem', borderRadius: '32px', border: '1px solid var(--glass-border)', display: 'flex', flexDirection: 'column' }}>
              <Code size={40} color="#adc9eb" style={{ marginBottom: '1.5rem' }} />
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'white', marginBottom: '0.5rem' }}>API Reference</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '1rem' }}>Connect your stack with our REST and GraphQL endpoints.</p>
              <pre style={{ 
                  background: 'rgba(0,0,0,0.3)', 
                  padding: '1rem', 
                  borderRadius: '12px', 
                  fontSize: '0.7rem', 
                  color: 'white', 
                  fontFamily: 'monospace',
                  marginBottom: '1rem',
                  overflowX: 'hidden'
              }}>
                <span style={{ color: 'var(--primary-accent)' }}>GET</span> /v1/analytics/process<br/>
                <span style={{ opacity: 0.5 }}>{ '{ "limit": 50, "auth": "key" }' }</span>
              </pre>
              <a href="#" style={{ color: 'var(--primary-accent)', fontSize: '0.8rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>View Schemas <ChevronRight size={14} /></a>
          </div>

          {/* Concierge */}
          <div style={{ 
              gridColumn: 'span 8', 
              background: 'rgba(255,255,255,0.02)', 
              padding: '2.5rem', 
              borderRadius: '32px', 
              border: '1px solid var(--glass-border)',
              display: 'flex',
              alignItems: 'center',
              gap: '3rem'
          }}>
              <div style={{ flex: 1 }}>
                  <h3 style={{ fontSize: '1.75rem', fontWeight: 900, color: 'white', marginBottom: '0.75rem' }}>Enterprise Concierge</h3>
                  <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>Priority 24/7 support for architecture reviews and scaling bottlenecks.</p>
                  <div style={{ display: 'flex', gap: '1rem' }}>
                      <button style={{ padding: '0.75rem 1.5rem', borderRadius: '12px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--glass-border)', color: 'white', fontWeight: 700 }}>Talk to Engineer</button>
                      <button style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', fontWeight: 700 }}><MessagesSquare size={18} /> Open Chat</button>
                  </div>
              </div>
              {/* Avatars */}
              <div style={{ display: 'flex', gap: '-0.5rem', alignItems: 'center' }}>
                  {[1,2,3].map(i => (
                      <div key={i} style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)', border: '3px solid black', marginLeft: i === 1 ? 0 : '-12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                         <img src={`https://i.pravatar.cc/100?u=${i}`} alt="Avatar" style={{ width: '100%', height: '100%', borderRadius: '50%' }} />
                      </div>
                  ))}
                  <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'rgba(0, 210, 255, 0.1)', border: '3px solid black', marginLeft: '-12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary-accent)', fontSize: '0.7rem', fontWeight: 900 }}>+12</div>
              </div>
          </div>

      </div>

      {/* Trending Articles */}
      <section>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'white' }}>Trending Solutions</h3>
              <button style={{ color: 'var(--primary-accent)', background: 'transparent', border: 'none', fontWeight: 800, fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '4px' }}>Browse all <ChevronRight size={16} /></button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
              {[
                { cat: 'Security', title: 'OAuth 2.0 with SAML Providers', col: '#ffb4a4' },
                { cat: 'Edge', title: 'Optimizing Transformer Latency', col: '#67d9c9' },
                { cat: 'Admin', title: 'Bulk User Management Tools', col: '#adc9eb' }
              ].map((art, i) => (
                  <GlassCard key={i} style={{ padding: '1.75rem', cursor: 'pointer' }} className="hover:bg-white/5 transition-all">
                      <span style={{ fontSize: '0.65rem', fontWeight: 800, color: art.col, textTransform: 'uppercase', letterSpacing: '0.1em', background: `${art.col}1a`, padding: '2px 8px', borderRadius: '4px', marginBottom: '1.5rem', display: 'inline-block' }}>{art.cat}</span>
                      <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'white', marginBottom: '1rem' }}>{art.title}</h4>
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>Step-by-step guide to implement production-grade analytics logic for your workspace...</p>
                  </GlassCard>
              ))}
          </div>
      </section>

    </div>
  );
};

export default HelpCenter;

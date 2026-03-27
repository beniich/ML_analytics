import React, { useState } from 'react';
import GlassCard from './common/GlassCard';
import { 
  Shield, 
  Key, 
  Database, 
  Terminal, 
  RefreshCcw, 
  Trash2, 
  Copy, 
  Cpu, 
  Server,
  Lock,
  Plus,
  X
} from 'lucide-react';

const SystemSettings = () => {
  const [showTokenModal, setShowTokenModal] = useState(false);
  const [tokens, setTokens] = useState([
    { id: 1, name: 'Production-Read-Only', created: 'Oct 26, 2023', expiry: 'Oct 26, 2024', scope: 'read:modules', status: 'Active' },
    { id: 2, name: 'Staging-Full-Access', created: 'Nov 12, 2023', expiry: 'Nov 12, 2024', scope: 'admin', status: 'Active' }
  ]);

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert('Token copied to clipboard!');
  };

  return (
    <div className="settings-view" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      <header>
        <h2 style={{ fontSize: '1.8rem', fontWeight: 700, color: 'var(--primary-accent)' }}>Advanced Security & System</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Manage API access, system services, and security protocols</p>
      </header>

      {/* API Access Section */}
      <GlassCard title="API Access Tracking (JWT Tokens)" icon={<Key />} status="Secure">
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1.5rem' }}>
          <button className="btn-primary" onClick={() => setShowTokenModal(true)}>
             <Plus size={16} style={{ marginRight: '0.5rem' }} /> Generate New Token
          </button>
        </div>
        <div className="table-responsive">
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--glass-border)', textAlign: 'left', color: 'var(--text-secondary)' }}>
                <th style={{ padding: '1rem' }}>Token Name</th>
                <th style={{ padding: '1rem' }}>Created</th>
                <th style={{ padding: '1rem' }}>Permissions</th>
                <th style={{ padding: '1rem' }}>Status</th>
                <th style={{ padding: '1rem' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {tokens.map(token => (
                <tr key={token.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.02)' }}>
                  <td style={{ padding: '1rem', fontWeight: 600 }}>{token.name}</td>
                  <td style={{ padding: '1rem', color: 'var(--text-secondary)' }}>{token.created}</td>
                  <td style={{ padding: '1rem' }}>
                    <span style={{ fontSize: '0.7rem', padding: '0.2rem 0.6rem', background: 'rgba(255,255,255,0.05)', borderRadius: '4px' }}>
                      {token.scope}
                    </span>
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#10b981', fontWeight: 600 }}>
                      <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981' }}></span> Active
                    </div>
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                      <button onClick={() => copyToClipboard('fake-token-value')} style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}><Copy size={16} /></button>
                      <button style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer' }}><Trash2 size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>

      {/* System Infrastructure Management */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '2rem' }}>
        
        <GlassCard title="Docker Node Controls" icon={<Server />}>
           <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Status</span>
                <span style={{ color: '#10b981', fontWeight: 700 }}>Running (99.9% Healthy)</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Resource Usage</span>
                <div style={{ textAlign: 'right' }}>
                   <div style={{ fontWeight: 600 }}>CPU: 12% | RAM: 1.2GB</div>
                   <div style={{ width: '150px', height: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: '2px', marginTop: '0.5rem' }}>
                      <div style={{ width: '30%', height: '100%', background: 'var(--primary-accent)', borderRadius: '2px' }}></div>
                   </div>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1rem' }}>
                 <button className="btn-primary" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)' }}>Restart Node</button>
                 <button className="btn-primary" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)' }}>View Logs</button>
              </div>
           </div>
        </GlassCard>

        <GlassCard title="Redis Caching Node" icon={<RefreshCcw />}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Status</span>
              <span style={{ color: '#10b981', fontWeight: 700 }}>Connected</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Efficiency</span>
              <span style={{ fontWeight: 600 }}>95% Hit Rate</span>
            </div>
            <button className="btn-primary" style={{ width: '100%', marginTop: '1rem', background: '#ef44441a', color: '#ef4444', border: '1px solid #ef444433' }}>Flush Entire Cache</button>
            <code style={{ fontSize: '0.7rem', padding: '0.5rem', background: 'rgba(0,0,0,0.3)', borderRadius: '6px', color: 'var(--text-secondary)' }}>
              redis://cache-cluster-01.internal:6379
            </code>
          </div>
        </GlassCard>

        <GlassCard title="SQL Performance" icon={<Database />}>
           <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Storage</span>
                <span style={{ fontWeight: 700 }}>45GB / 100GB (SSD)</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Maintenance Task</span>
                <span style={{ fontSize: '0.7rem', color: '#f59e0b' }}>Scheduled in 4h</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1rem' }}>
                 <button className="btn-primary" style={{ background: 'rgba(34, 197, 94, 0.1)', color: '#22c55e', border: '1px solid rgba(34, 197, 94, 0.2)' }}>Manual Backup</button>
                 <button className="btn-primary" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)' }}>Run Migrations</button>
              </div>
           </div>
        </GlassCard>

      </div>

      {/* API Documentation Snippet */}
      <GlassCard title="API Interaction Code (cURL)" icon={<Terminal />}>
        <div style={{ background: 'black', borderRadius: '12px', padding: '1.5rem', position: 'relative' }}>
          <button onClick={() => copyToClipboard('curl -X GET...')} style={{ position: 'absolute', right: '15px', top: '15px', background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white', padding: '4px', borderRadius: '4px', cursor: 'pointer' }}>
             <Copy size={14} />
          </button>
          <pre style={{ color: '#10b981', fontSize: '0.85rem', overflowX: 'auto' }}>
            <code>{`curl -X GET 'https://api.analytics-saas.com/v1/analysis/stats' \\
  -H 'Authorization: Bearer YOUR_PRODUCTION_TOKEN' \\
  -H 'X-Security-Hash: sha256_...'`}</code>
          </pre>
        </div>
      </GlassCard>

      {/* Modal Overlay for Token Generation */}
      {showTokenModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(5px)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
           <div className="glass-panel" style={{ width: '400px', padding: '2rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                <h3 style={{ fontWeight: 700 }}>Generate API Token</h3>
                <button onClick={() => setShowTokenModal(false)} style={{ background: 'transparent', border: 'none', color: 'white' }}><X /></button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                 <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Token Name</label>
                    <input type="text" placeholder="e.g. Analytics-App-Integration" style={{ width: '100%' }} />
                 </div>
                 <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Scope Delegation</label>
                    <select style={{ width: '100%' }}>
                       <option>Read-Only Analytics</option>
                       <option>Full Admin Access</option>
                       <option>Editor (Write/Execute)</option>
                    </select>
                 </div>
                 <button className="btn-primary" style={{ width: '100%', marginTop: '1rem' }} onClick={() => setShowTokenModal(false)}>Construct Payload & Sign</button>
              </div>
           </div>
        </div>
      )}

    </div>
  );
};

export default SystemSettings;

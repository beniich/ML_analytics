import React, { useState } from 'react';
import GlassCard from './common/GlassCard';
import { 
  Search, 
  Filter, 
  Download, 
  Plus, 
  MoreVertical, 
  Edit, 
  ChevronLeft, 
  ChevronRight, 
  ChevronsLeft, 
  ChevronsRight,
  Calendar,
  Columns,
  CheckCircle,
  TrendingUp,
  Database,
  Terminal
} from 'lucide-react';

const DataExplorerPro = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const mockData = [
    { id: '#UID-82910', timestamp: '2024-10-24 14:02:11', entity: 'Global Logistics Corp', score: 0.82, confidence: '94.2%', region: 'North America', status: 'Verified' },
    { id: '#UID-82911', timestamp: '2024-10-24 13:58:45', entity: 'Starlight Retail Ltd', score: 0.31, confidence: '88.7%', region: 'Europe', status: 'Pending' },
    { id: '#UID-82912', timestamp: '2024-10-24 13:55:01', entity: 'Apex Dynamics', score: 0.55, confidence: '91.4%', region: 'Asia Pacific', status: 'Verified' },
    { id: '#UID-82913', timestamp: '2024-10-24 13:50:33', entity: 'Zenith Systems', score: 0.89, confidence: '97.0%', region: 'North America', status: 'Verified' },
  ];

  return (
    <div className="data-explorer-pro-view" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Header */}
      <header>
        <h2 style={{ fontSize: '2rem', fontWeight: 800, color: 'white', marginBottom: '0.5rem' }}>Data Explorer Pro</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>Managing 2.4M rows of inferred customer sentiment data.</p>
      </header>

      {/* Action Bar */}
      <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          background: 'rgba(255,255,255,0.02)', 
          padding: '1rem', 
          borderRadius: '16px', 
          border: '1px solid var(--glass-border)',
          flexWrap: 'wrap',
          gap: '1rem'
      }}>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <div style={{ position: 'relative' }}>
            <Search size={14} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
            <input 
              type="text" 
              placeholder="Regex filtering..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ paddingLeft: '2.5rem', width: '280px', height: '40px' }}
            />
          </div>
          <button style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'transparent', border: 'none', color: 'var(--primary-accent)', fontSize: '0.85rem', fontWeight: 600 }}>
            <Calendar size={14} /> Date Range
          </button>
          <button style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'transparent', border: 'none', color: 'var(--primary-accent)', fontSize: '0.85rem', fontWeight: 600 }}>
            <Columns size={14} /> Columns
          </button>
        </div>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Selected: 0</span>
          <button className="btn-primary" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Download size={14} /> Export CSV
          </button>
          <button className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Plus size={14} /> New Entry
          </button>
        </div>
      </div>

      {/* Table Section */}
      <div style={{ 
          background: 'rgba(15, 23, 42, 0.4)', 
          borderRadius: '20px', 
          border: '1px solid var(--glass-border)', 
          overflow: 'hidden' 
      }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: 'rgba(0, 210, 255, 0.05)', color: 'var(--primary-accent)', fontSize: '0.65rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                <th style={{ padding: '1.25rem 1.5rem', width: '40px' }}><input type="checkbox" /></th>
                <th style={{ padding: '1.25rem 1.5rem' }}>ID</th>
                <th style={{ padding: '1.25rem 1.5rem' }}>Timestamp</th>
                <th style={{ padding: '1.25rem 1.5rem' }}>Customer Entity</th>
                <th style={{ padding: '1.25rem 1.5rem' }}>Sentiment Score</th>
                <th style={{ padding: '1.25rem 1.5rem' }}>Confidence</th>
                <th style={{ padding: '1.25rem 1.5rem' }}>Region</th>
                <th style={{ padding: '1.25rem 1.5rem' }}>Status</th>
                <th style={{ padding: '1.25rem 1.5rem', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody style={{ fontSize: '0.85rem' }}>
              {mockData.map((row, idx) => (
                <tr key={idx} style={{ borderBottom: '1px solid rgba(255,255,255,0.02)', transition: 'background 0.2s' }}>
                  <td style={{ padding: '1.25rem 1.5rem' }}><input type="checkbox" /></td>
                  <td style={{ padding: '1.25rem 1.5rem', fontFamily: 'monospace', color: 'var(--primary-accent)' }}>{row.id}</td>
                  <td style={{ padding: '1.25rem 1.5rem', color: 'var(--text-secondary)' }}>{row.timestamp}</td>
                  <td style={{ padding: '1.25rem 1.5rem', fontWeight: 600 }}>{row.entity}</td>
                  <td style={{ padding: '1.25rem 1.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div style={{ flex: 1, minWidth: '80px', height: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '100px', overflow: 'hidden' }}>
                        <div style={{ width: `${row.score * 100}%`, height: '100%', background: row.score > 0.5 ? '#67d9c9' : '#ffb4a4' }}></div>
                      </div>
                      <span style={{ fontSize: '0.75rem', fontWeight: 700, color: row.score > 0.5 ? '#67d9c9' : '#ffb4a4' }}>{row.score}</span>
                    </div>
                  </td>
                  <td style={{ padding: '1.25rem 1.5rem', fontWeight: 500 }}>{row.confidence}</td>
                  <td style={{ padding: '1.25rem 1.5rem' }}>
                    <span style={{ fontSize: '0.65rem', fontWeight: 800, padding: '0.25rem 0.5rem', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', textTransform: 'uppercase' }}>{row.region}</span>
                  </td>
                  <td style={{ padding: '1.25rem 1.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: row.status === 'Verified' ? '#67d9c9' : '#ffb4a4' }}></div>
                      <span style={{ fontSize: '0.75rem' }}>{row.status}</span>
                    </div>
                  </td>
                  <td style={{ padding: '1.25rem 1.5rem', textAlign: 'right' }}>
                    <button style={{ color: 'var(--text-secondary)', background: 'transparent', border: 'none', marginRight: '0.5rem' }}><Edit size={16} /></button>
                    <button style={{ color: 'var(--text-secondary)', background: 'transparent', border: 'none' }}><MoreVertical size={16} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.5rem', background: 'rgba(0,0,0,0.1)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600, textTransform: 'uppercase' }}>
            <span>Show</span>
            <select style={{ background: 'rgba(255,255,255,0.05)', border: 'none', color: 'white', borderRadius: '6px', padding: '0.25rem 0.5rem' }}>
              <option>50 rows</option>
              <option>100 rows</option>
            </select>
            <span>Displaying 1-50 of 2,410,293 rows</span>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button style={{ padding: '0.5rem', background: 'transparent', border: 'none', color: 'var(--text-secondary)', opacity: 0.3 }}><ChevronsLeft size={16}/></button>
            <button style={{ padding: '0.5rem', background: 'transparent', border: 'none', color: 'var(--text-secondary)', opacity: 0.3 }}><ChevronLeft size={16}/></button>
            <div style={{ display: 'flex', gap: '0.25rem' }}>
                <span style={{ padding: '0.4rem 0.8rem', background: 'var(--primary-accent)', color: 'black', fontWeight: 800, borderRadius: '6px', fontSize: '0.75rem' }}>1</span>
                <span style={{ padding: '0.4rem 0.8rem', color: 'white', fontWeight: 800, borderRadius: '6px', fontSize: '0.75rem', cursor: 'pointer' }}>2</span>
                <span style={{ padding: '0.4rem 0.8rem', color: 'white', fontWeight: 800, borderRadius: '6px', fontSize: '0.75rem', cursor: 'pointer' }}>3</span>
            </div>
            <button style={{ padding: '0.5rem', background: 'transparent', border: 'none', color: 'var(--text-secondary)' }}><ChevronRight size={16}/></button>
            <button style={{ padding: '0.5rem', background: 'transparent', border: 'none', color: 'var(--text-secondary)' }}><ChevronsRight size={16}/></button>
          </div>
        </div>
      </div>

      {/* Bento Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
        <GlassCard title="Ingestion Speed">
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', margin: '0.5rem 0' }}>
                <span style={{ fontSize: '2.5rem', fontWeight: 800 }}>12.4k</span>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>rows/sec</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#67d9c9', fontSize: '0.75rem', fontWeight: 700 }}>
                <TrendingUp size={14} /> 8.2% increase from yesterday
            </div>
        </GlassCard>
        <GlassCard title="Cluster Health">
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', margin: '0.5rem 0' }}>
                <span style={{ fontSize: '2.5rem', fontWeight: 800 }}>99.98%</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#67d9c9', fontSize: '0.75rem', fontWeight: 700 }}>
                <CheckCircle size={14} /> Operational • 12 Active Nodes
            </div>
        </GlassCard>
        <GlassCard title="Total Storage">
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', margin: '0.5rem 0' }}>
                <span style={{ fontSize: '2.5rem', fontWeight: 800 }}>4.2 TB</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.75rem', fontWeight: 700 }}>
                <Database size={14} /> PostgreSQL + Parquet S3
            </div>
        </GlassCard>
      </div>

    </div>
  );
};

export default DataExplorerPro;

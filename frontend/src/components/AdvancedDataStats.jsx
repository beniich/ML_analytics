import React, { useState } from 'react';
import GlassCard from './common/GlassCard';
import { 
  Search, 
  BarChart2, 
  Activity, 
  AlertCircle, 
  CheckCircle, 
  ArrowRight,
  Filter,
  ArrowUpDown,
  FileBarChart
} from 'lucide-react';

const AdvancedDataStats = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const statsSummary = [
    { label: 'Total Features', value: '42', icon: <FileBarChart size={20} />, sub: 'All features valid', color: 'var(--primary-accent)' },
    { label: 'Data Health', value: '98.4%', icon: <Activity size={20} />, sub: 'Avg. non-missing ratio', color: '#67d9c9' },
    { label: 'Outliers Detected', value: '12', icon: <AlertCircle size={20} />, sub: 'Across 3 features', color: '#ffb4a4' },
  ];

  const tableData = [
    { name: 'user_purchase_value', type: 'Float64', mean: '1,245.82', median: '980.00', missing: '0.2%', dist: [30, 50, 80, 100, 60, 40, 20] },
    { name: 'session_duration_sec', type: 'Int32', mean: '412.5', median: '390.0', missing: '0.0%', dist: [10, 20, 40, 80, 100, 70, 30] },
    { name: 'customer_loyalty_score', type: 'Float64', mean: '0.68', median: '0.72', missing: '12.4%', dist: [20, 30, 25, 35, 50, 70, 90], alert: true },
    { name: 'ad_click_frequency', type: 'Int32', mean: '4.2', median: '2.0', missing: '0.1%', dist: [100, 80, 60, 40, 20, 10, 5] },
  ];

  return (
    <div className="advanced-stats-view" style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
      {/* Header */}
      <header>
        <h2 style={{ fontSize: '2.5rem', fontWeight: 800, color: 'white', marginBottom: '0.75rem', letterSpacing: '-0.02em' }}>Feature Statistics</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem', maxWidth: '800px', lineHeight: 1.6 }}>
          Detailed exploratory data analysis. Review distributions, central tendencies, and data quality metrics for active ML model features.
        </p>
      </header>

      {/* Filters Area */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '1.5rem', alignItems: 'flex-end' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <span style={{ fontSize: '0.65rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-secondary)', letterSpacing: '0.1em' }}>Search Features</span>
          <div style={{ position: 'relative' }}>
            <Search size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
            <input 
              type="text" 
              placeholder="Filter by column name..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ paddingLeft: '3rem', width: '100%', height: '52px', fontSize: '1rem', background: 'rgba(255,255,255,0.03)' }}
            />
          </div>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <span style={{ fontSize: '0.65rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-secondary)', letterSpacing: '0.1em' }}>Data Type</span>
            <select style={{ height: '52px', padding: '0 1.5rem', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--glass-border)', color: 'white', borderRadius: '12px' }}>
              <option>All Types</option>
              <option>Numerical</option>
              <option>Categorical</option>
            </select>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <span style={{ fontSize: '0.65rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-secondary)', letterSpacing: '0.1em' }}>Sort By</span>
            <select style={{ height: '52px', padding: '0 1.5rem', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--glass-border)', color: 'white', borderRadius: '12px' }}>
              <option>Missing Values</option>
              <option>Variance</option>
              <option>Mean</option>
            </select>
          </div>
        </div>
      </div>

      {/* Bento Summary */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
        {statsSummary.map((stat, i) => (
          <div key={i} style={{ 
            background: 'rgba(255,255,255,0.02)', 
            padding: '2rem', 
            borderRadius: '24px', 
            border: '1px solid var(--glass-border)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            height: '180px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-secondary)', letterSpacing: '0.1em' }}>{stat.label}</span>
              <div style={{ color: stat.color }}>{stat.icon}</div>
            </div>
            <div style={{ fontSize: '3rem', fontWeight: 800, letterSpacing: '-0.02em' }}>{stat.value}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', fontWeight: 600, color: stat.color === '#ffb4a4' ? '#ffb4a4' : '#67d9c9' }}>
               {stat.color === '#ffb4a4' ? <AlertCircle size={14}/> : <CheckCircle size={14}/>}
               {stat.sub}
            </div>
          </div>
        ))}
      </div>

      {/* Stats Table */}
      <GlassCard title="Feature Distribution & Central Tendency">
        <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                    <tr style={{ color: 'var(--text-secondary)', fontSize: '0.65rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                        <th style={{ padding: '1.5rem' }}>Column Name</th>
                        <th style={{ padding: '1.5rem' }}>Mean</th>
                        <th style={{ padding: '1.5rem' }}>Median</th>
                        <th style={{ padding: '1.5rem' }}>Missing Values</th>
                        <th style={{ padding: '1.5rem' }}>Distribution</th>
                        <th style={{ padding: '1.5rem', textAlign: 'right' }}>Action</th>
                    </tr>
                </thead>
                <tbody style={{ fontSize: '0.9rem' }}>
                    {tableData.map((row, idx) => (
                        <tr key={idx} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', transition: 'background 0.2s' }}>
                            <td style={{ padding: '1.5rem' }}>
                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                    <span style={{ fontWeight: 700, color: 'white' }}>{row.name}</span>
                                    <span style={{ fontSize: '0.65rem', color: 'var(--primary-accent)', fontWeight: 800, textTransform: 'uppercase', marginTop: '0.25rem' }}>{row.type}</span>
                                </div>
                            </td>
                            <td style={{ padding: '1.5rem', fontFamily: 'monospace' }}>{row.mean}</td>
                            <td style={{ padding: '1.5rem', fontFamily: 'monospace' }}>{row.median}</td>
                            <td style={{ padding: '1.5rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                    <div style={{ width: '100px', height: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '100px', overflow: 'hidden' }}>
                                        <div style={{ width: `${100 - parseFloat(row.missing)}%`, height: '100%', background: row.alert ? '#ffb4a4' : '#67d9c9' }}></div>
                                    </div>
                                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: row.alert ? '#ffb4a4' : 'var(--text-secondary)' }}>{row.missing}</span>
                                </div>
                            </td>
                            <td style={{ padding: '1.5rem' }}>
                                <div style={{ height: '32px', display: 'flex', alignItems: 'flex-end', gap: '2px' }}>
                                    {row.dist.map((h, i) => (
                                        <div key={i} style={{ width: '8px', height: `${h}%`, background: 'var(--primary-accent)', opacity: h/100, borderRadius: '2px 2px 0 0' }}></div>
                                    ))}
                                </div>
                            </td>
                            <td style={{ padding: '1.5rem', textAlign: 'right' }}>
                                <button style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                                    <BarChart2 size={18} />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
        <div style={{ padding: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
            <span>Showing 4 of 42 features</span>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button className="btn-primary" style={{ padding: '0.4rem 1rem', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)' }}>Previous</button>
                <button className="btn-primary" style={{ padding: '0.4rem 1rem' }}>Next <ArrowRight size={14} style={{ marginLeft: '0.4rem' }} /></button>
            </div>
        </div>
      </GlassCard>

    </div>
  );
};

export default AdvancedDataStats;

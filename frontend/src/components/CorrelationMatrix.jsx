import React, { useState } from 'react';
import GlassCard from './common/GlassCard';
import { toast } from 'react-toastify';
import { 
  Network, 
  Settings2, 
  Search, 
  Filter, 
  Info,
  Maximize2
} from 'lucide-react';

const CorrelationMatrix = () => {
  const [method, setMethod] = useState('pearson');
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeVars, setActiveVars] = useState({
    0: true, 1: true, 2: true, 3: true, 4: true, 5: false, 6: false
  });

  const handleMethodChange = async (newMethod) => {
    setIsProcessing(true);
    setMethod(newMethod);
    try {
       await new Promise(r => setTimeout(r, 1200));
       toast.success(`${newMethod === 'pearson' ? 'Pearson' : 'Spearman'} correlation recalculated`);
    } finally {
       setIsProcessing(false);
    }
  };

  const toggleVar = async (index, name) => {
    const newState = !activeVars[index];
    setActiveVars(prev => ({ ...prev, [index]: newState }));
    toast.info(`Updating matrix for ${name}...`, { autoClose: 1000 });
    setIsProcessing(true);
    setTimeout(() => setIsProcessing(false), 800);
  };
  
  const variables = [
    'Customer Age', 'Purchase Freq', 'Product Rating', 'Site Visits', 
    'Return Rate', 'Session Time', 'Discount Usage'
  ];

  const mockData = [
    [1.00, -0.39, 0.83, 0.05, 0.37, -0.85, 1.00],
    [-0.23, 1.00, 0.78, 0.23, 0.34, -0.35, 0.88],
    [-0.76, 1.00, 0.78, 0.75, 0.73, -0.17, 0.78],
    [-0.22, -0.12, 0.00, 0.23, 0.65, -0.17, 0.72],
    [-0.85, -0.02, 0.24, 0.00, 0.32, -0.17, 0.75],
    [-0.65, -0.17, 0.03, -0.05, 0.00, -0.35, 0.83],
    [-1.00, 0.00, 0.22, 0.30, 0.03, 1.00, 0.97],
  ];

  const getColor = (value) => {
    if (value === 1.00) return 'rgba(255, 255, 255, 0.1)'; 
    if (value >= 0.7) return 'rgba(238, 129, 98, 0.9)'; // High Pos
    if (value >= 0.3) return 'rgba(244, 167, 144, 0.6)'; // Med Pos
    if (value > -0.3 && value < 0.3) return 'rgba(203, 213, 225, 0.1)'; // Neutral
    if (value <= -0.7) return 'rgba(74, 85, 120, 0.9)'; // High Neg
    if (value <= -0.3) return 'rgba(148, 163, 184, 0.6)'; // Med Neg
    return 'rgba(203, 213, 225, 0.1)';
  };

  return (
    <div className="correlation-matrix-view" style={{ display: 'flex', flexDirection: 'column', gap: '2rem', height: '100%' }}>
      
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end' }}>
        <div>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 800 }}>Correlation Analysis Matrix</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Visualize feature relationships prior to feature engineering.</p>
        </div>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: '2rem', flex: 1, minHeight: 0 }}>
        
        {/* Left Sidebar Rules */}
        <aside style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', overflowY: 'auto', paddingRight: '0.5rem' }}>
          
          <GlassCard style={{ padding: '1.25rem' }}>
            <h3 style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--primary-accent)', textTransform: 'uppercase', marginBottom: '1rem' }}>Filter Variables</h3>
            <div style={{ position: 'relative', marginBottom: '1rem' }}>
               <Search size={16} style={{ position: 'absolute', top: '10px', left: '10px', color: 'var(--text-secondary)' }} />
               <input 
                 type="text" 
                 placeholder="Search" 
                 style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', padding: '0.5rem 1rem 0.5rem 2rem', borderRadius: '8px', color: 'white', fontSize: '0.85rem' }} 
               />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
               {variables.map((v, i) => (
                 <label key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                    <input 
                      type="checkbox" 
                      checked={activeVars[i]} 
                      onChange={() => toggleVar(i, v)}
                      style={{ accentColor: 'var(--primary-accent)' }} 
                    />
                    <span style={{ color: activeVars[i] ? 'white' : 'inherit' }}>{v}</span>
                 </label>
               ))}
            </div>
          </GlassCard>

          <GlassCard style={{ padding: '1.25rem' }}>
            <h3 style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--primary-accent)', textTransform: 'uppercase', marginBottom: '1rem' }}>Correlation Method</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
               <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', cursor: 'pointer' }}>
                  <input type="radio" name="method" checked={method === 'pearson'} onChange={() => handleMethodChange('pearson')} style={{ accentColor: 'var(--primary-accent)' }} />
                  <span style={{ color: method === 'pearson' ? 'white' : 'var(--text-secondary)' }}>Pearson (Linear)</span>
               </label>
               <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', cursor: 'pointer' }}>
                  <input type="radio" name="method" checked={method === 'spearman'} onChange={() => handleMethodChange('spearman')} style={{ accentColor: 'var(--primary-accent)' }} />
                  <span style={{ color: method === 'spearman' ? 'white' : 'var(--text-secondary)' }}>Spearman (Rank-based)</span>
               </label>
            </div>
          </GlassCard>

        </aside>

        {/* Heatmap View */}
        <GlassCard title="Interactive Matrix" icon={<Network />} style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
           <div style={{ position: 'absolute', top: '1.5rem', right: '1.5rem' }}>
              <Maximize2 size={16} style={{ color: 'var(--text-secondary)', cursor: 'pointer' }} />
           </div>

           <div style={{ overflow: 'auto', flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: '2rem', transition: 'opacity 0.3s', opacity: isProcessing ? 0.3 : 1 }}>
              
              <table style={{ borderSpacing: '6px', borderCollapse: 'separate' }}>
                <thead>
                  <tr>
                    <th style={{ width: '120px' }}></th>
                    {variables.map((v, i) => activeVars[i] && (
                      <th key={i} style={{ height: '100px', verticalAlign: 'bottom', paddingBottom: '0.5rem' }}>
                         <div style={{ writingMode: 'vertical-rl', transform: 'rotate(225deg)', fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600, whiteSpace: 'nowrap' }}>
                            {v}
                         </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {variables.map((rowVar, rIdx) => activeVars[rIdx] && (
                    <tr key={rIdx}>
                       <td style={{ textAlign: 'right', paddingRight: '1rem', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                          {rowVar}
                       </td>
                       {mockData[rIdx].map((val, cIdx) => activeVars[cIdx] && (
                         <td key={cIdx} style={{ padding: 0 }}>
                            <div 
                              style={{ 
                                width: '3.5rem', 
                                height: '3.5rem', 
                                background: getColor(val), 
                                borderRadius: '6px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '0.8rem',
                                fontWeight: 700,
                                color: (val > 0.5 || val < -0.5) && val !== 1.00 ? 'white' : 'var(--text-secondary)',
                                border: val === 1.00 ? '1px solid rgba(255,255,255,0.1)' : 'none',
                                cursor: 'pointer',
                                transition: 'transform 0.1s'
                              }}
                              title={`${rowVar} vs ${variables[cIdx]}: ${val}`}
                              onClick={() => toast.info(`Detailed view for ${rowVar} & ${variables[cIdx]} not available in preview.`)}
                              className="matrix-cell-hover"
                            >
                               {val > 0 && val !== 1.00 ? `+${val}` : val.toFixed(2)}
                            </div>
                         </td>
                       ))}
                    </tr>
                  ))}
                </tbody>
              </table>

              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '3rem' }}>
                 <span style={{ fontSize: '0.65rem', fontWeight: 800, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Negative</span>
                 <div style={{ width: '200px', height: '12px', borderRadius: '10px', background: 'linear-gradient(90deg, #4A5578 0%, rgba(203, 213, 225, 0.2) 50%, #EE8162 100%)' }}></div>
                 <span style={{ fontSize: '0.65rem', fontWeight: 800, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Positive</span>
              </div>
           </div>
        </GlassCard>

      </div>
    </div>
  );
};

export default CorrelationMatrix;

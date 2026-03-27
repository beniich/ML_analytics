import React, { useState } from 'react';
import GlassCard from './common/GlassCard';
import { 
  Play, 
  Settings2, 
  Target, 
  Cpu, 
  Layers, 
  Activity,
  GitMerge
} from 'lucide-react';

const PredictiveModelTraining = () => {
  const [selectedAlgo, setSelectedAlgo] = useState('random_forest');
  const [params, setParams] = useState({
    n_estimators: 400,
    max_depth: 10,
    learning_rate: 0.052
  });

  const algorithms = [
    { id: 'random_forest', name: 'Random Forest', icon: <Layers size={16} /> },
    { id: 'linear_regression', name: 'Linear Regression', icon: <TrendingUp size={16} /> },
    { id: 'gradient_boosting', name: 'Gradient Boosting', icon: <Activity size={16} /> },
    { id: 'neural_network', name: 'Neural Network', icon: <GitMerge size={16} /> },
  ];

  const handleParamChange = (key, value) => {
    setParams(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="predictive-training-view" style={{ display: 'flex', flexDirection: 'column', gap: '2rem', minHeight: '100%' }}>
      
      {/* Header */}
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end' }}>
        <div>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 800 }}>Predictive Model Training</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Configure and launch supervised learning algorithms on processed datasets</p>
        </div>
        <button className="btn-primary" style={{ backgroundImage: 'linear-gradient(90deg, #00d2ff 0%, #3a7bd5 100%)', border: 'none' }}>
           <Play size={16} style={{ marginRight: '0.5rem', fill: 'currentColor' }} /> Train Model
        </button>
      </header>

      {/* Main Container */}
      <GlassCard style={{ padding: 0, overflow: 'hidden', flex: 1, display: 'flex' }}>
         <div style={{ display: 'flex', minHeight: '600px', width: '100%' }}>
            
            {/* Sidebar: Algorithms */}
            <aside style={{ width: '280px', borderRight: '1px solid var(--glass-border)', background: 'rgba(0,0,0,0.2)', display: 'flex', flexDirection: 'column' }}>
               <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--glass-border)' }}>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--primary-accent)' }}>Algorithms</h3>
               </div>
               <nav style={{ padding: '1rem 0' }}>
                  {algorithms.map(algo => (
                    <div 
                      key={algo.id}
                      onClick={() => setSelectedAlgo(algo.id)}
                      style={{
                        padding: '1rem 1.5rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '1rem',
                        cursor: 'pointer',
                        background: selectedAlgo === algo.id ? 'rgba(0, 210, 255, 0.1)' : 'transparent',
                        borderLeft: `3px solid ${selectedAlgo === algo.id ? 'var(--primary-accent)' : 'transparent'}`,
                        transition: 'all 0.2s ease',
                      }}
                    >
                      <div style={{ color: selectedAlgo === algo.id ? 'var(--primary-accent)' : 'var(--text-secondary)' }}>
                        {algo.icon}
                      </div>
                      <span style={{ fontSize: '0.9rem', fontWeight: selectedAlgo === algo.id ? 700 : 500, color: selectedAlgo === algo.id ? 'white' : 'var(--text-secondary)' }}>
                        {algo.name}
                      </span>
                    </div>
                  ))}
               </nav>
            </aside>

            {/* Content: Configuration */}
            <div style={{ flex: 1, padding: '3rem 4rem', display: 'flex', flexDirection: 'column', gap: '3rem', overflowY: 'auto' }}>
               
               <header>
                  <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <Settings2 color="var(--primary-accent)" /> Model Configuration
                  </h2>
               </header>

               {/* Target Column */}
               <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.75rem', display: 'block' }}>Target Column</label>
                  <select 
                    style={{ 
                      width: '100%', 
                      maxWidth: '400px',
                      padding: '1rem', 
                      background: 'rgba(255,255,255,0.05)', 
                      border: '1px solid var(--glass-border)', 
                      borderRadius: '8px',
                      color: 'white',
                      fontSize: '1rem'
                    }}
                  >
                     <option value="revenue" style={{ background: '#0f172a' }}>Revenue</option>
                     <option value="churn" style={{ background: '#0f172a' }}>Churn Probability</option>
                     <option value="growth" style={{ background: '#0f172a' }}>User Growth</option>
                  </select>
               </div>

               {/* Hyperparameters */}
               <div>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                     <Cpu size={20} color="var(--primary-accent)" /> Hyperparameters
                  </h3>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem', maxWidth: '600px' }}>
                     
                     {/* N-Estimators */}
                     <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                           <label style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-secondary)' }}>N-Estimators (Trees)</label>
                           <input 
                             type="number" 
                             value={params.n_estimators}
                             onChange={(e) => handleParamChange('n_estimators', e.target.value)}
                             style={{ width: '80px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--primary-accent)', borderRadius: '4px', color: 'white', textAlign: 'center', padding: '0.2rem' }}
                           />
                        </div>
                        <input 
                          type="range" 
                          min="10" max="1000" 
                          value={params.n_estimators}
                          onChange={(e) => handleParamChange('n_estimators', Number(e.target.value))}
                          style={{ width: '100%', accentColor: 'var(--primary-accent)' }}
                        />
                     </div>

                     {/* Max Depth */}
                     <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                           <label style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-secondary)' }}>Max Depth</label>
                           <input 
                             type="number" 
                             value={params.max_depth}
                             onChange={(e) => handleParamChange('max_depth', e.target.value)}
                             style={{ width: '80px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--primary-accent)', borderRadius: '4px', color: 'white', textAlign: 'center', padding: '0.2rem' }}
                           />
                        </div>
                        <input 
                          type="range" 
                          min="1" max="50" 
                          value={params.max_depth}
                          onChange={(e) => handleParamChange('max_depth', Number(e.target.value))}
                          style={{ width: '100%', accentColor: 'var(--primary-accent)' }}
                        />
                     </div>

                     {/* Learning Rate */}
                     <div style={{ opacity: selectedAlgo === 'random_forest' ? 0.5 : 1, pointerEvents: selectedAlgo === 'random_forest' ? 'none' : 'auto' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                           <label style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-secondary)' }}>Learning Rate</label>
                           <input 
                             type="number" 
                             step="0.001"
                             value={params.learning_rate}
                             onChange={(e) => handleParamChange('learning_rate', e.target.value)}
                             style={{ width: '80px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--primary-accent)', borderRadius: '4px', color: 'white', textAlign: 'center', padding: '0.2rem' }}
                           />
                        </div>
                        <input 
                          type="range" 
                          min="0.001" max="1" step="0.001"
                          value={params.learning_rate}
                          onChange={(e) => handleParamChange('learning_rate', Number(e.target.value))}
                          style={{ width: '100%', accentColor: 'var(--primary-accent)' }}
                        />
                     </div>

                  </div>
               </div>

            </div>
         </div>
      </GlassCard>

    </div>
  );
};

// Fallback icon definition since TrendingUp is not imported
function TrendingUp(props) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
      <polyline points="17 6 23 6 23 12" />
    </svg>
  );
}

export default PredictiveModelTraining;

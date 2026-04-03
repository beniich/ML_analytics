import React, { useState } from 'react';
import GlassCard from './common/GlassCard';
import { toast } from 'react-toastify';
import { 
  Check, 
  Terminal, 
  Hub, 
  ArrowRight, 
  ArrowLeft, 
  Info, 
  Server,
  Cloud,
  Layers,
  Activity,
  Box,
  Cpu
} from 'lucide-react';

const ModelDeploymentWizard = () => {
  const [step, setStep] = useState(2);
  const [selectedEnv, setSelectedEnv] = useState('docker');
  const [isDeploying, setIsDeploying] = useState(false);

  const steps = [
    { id: 1, label: 'Select Model', completed: step > 1, active: step === 1 },
    { id: 2, label: 'Environment', completed: step > 2, active: step === 2 },
    { id: 3, label: 'Scaling Options', completed: step > 3, active: step === 3 },
    { id: 4, label: 'Review & Deploy', completed: step > 4, active: step === 4 },
  ];

  const handleNext = async () => {
    if (step < 4) {
      setStep(step + 1);
    } else {
      setIsDeploying(true);
      toast.info(`Provisioning ${selectedEnv.toUpperCase()} container instance...`);
      try {
        await new Promise(r => setTimeout(r, 3000));
        toast.success(`Model successfully deployed on ${selectedEnv.toUpperCase()}! Traffic routed.`);
        setStep(1); // reset or go to monitoring
      } catch (e) {
        toast.error('Deployment failed due to cluster timeouts.');
      } finally {
        setIsDeploying(false);
      }
    }
  };

  const renderContent = () => {
    if (step === 3) {
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', flex: 1 }}>
          <h1 style={{ fontSize: '3rem', fontWeight: 800, color: 'white' }}>Scaling Options</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Set boundaries for auto-replicas depending on inference API load.</p>
          <div style={{ marginTop: '2rem', background: 'rgba(255,255,255,0.02)', padding: '2rem', borderRadius: '16px', border: '1px solid var(--glass-border)' }}>
             <label style={{ display: 'block', color: 'var(--primary-accent)', marginBottom: '1rem', fontWeight: 800 }}>Minimum Replicas</label>
             <input type="range" min="1" max="10" defaultValue="2" style={{ width: '100%', accentColor: 'var(--primary-accent)' }} />
             <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)', fontSize: '0.8rem', marginTop: '0.5rem' }}><span>1</span><span>10</span></div>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.02)', padding: '2rem', borderRadius: '16px', border: '1px solid var(--glass-border)' }}>
             <label style={{ display: 'block', color: '#ffb4a4', marginBottom: '1rem', fontWeight: 800 }}>Maximum Replicas</label>
             <input type="range" min="1" max="50" defaultValue="10" style={{ width: '100%', accentColor: '#ffb4a4' }} />
             <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)', fontSize: '0.8rem', marginTop: '0.5rem' }}><span>1</span><span>50</span></div>
          </div>
        </div>
      );
    }
    if (step === 4) {
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', flex: 1 }}>
          <h1 style={{ fontSize: '3rem', fontWeight: 800, color: 'white' }}>Review & Deploy</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Please review the launch specifications before initiating the DevOps pipeline.</p>
          <div style={{ background: 'rgba(0,0,0,0.2)', padding: '2rem', borderRadius: '16px', border: '1px dashed var(--glass-border)', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
             <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '0.5rem' }}>
               <span style={{ color: 'var(--text-secondary)' }}>Target Environment</span>
               <strong style={{ color: 'white' }}>{selectedEnv.toUpperCase()}</strong>
             </div>
             <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '0.5rem' }}>
               <span style={{ color: 'var(--text-secondary)' }}>Scaling Bounds</span>
               <strong style={{ color: 'white' }}>2 to 10 Replicas</strong>
             </div>
             <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '0.5rem' }}>
               <span style={{ color: 'var(--text-secondary)' }}>Compute Instance</span>
               <strong style={{ color: '#67d9c9' }}>GPU (CUDA 12.4)</strong>
             </div>
          </div>
        </div>
      );
    }
    
    // Step 2 Default
    return (
       <>
            <header style={{ marginBottom: '4rem' }}>
                <span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#67d9c9', textTransform: 'uppercase', letterSpacing: '0.2em' }}>Configuration Phase</span>
                <h1 style={{ fontSize: '3rem', fontWeight: 800, color: 'white', marginTop: '0.5rem', marginBottom: '1.25rem' }}>Choose Environment</h1>
                <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', maxWidth: '600px', lineHeight: 1.6 }}>
                    Select the target infrastructure for your deployment. Each environment comes with pre-configured health checks.
                </p>
            </header>

            {/* Env Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.5rem', marginBottom: 'auto' }}>
                {/* Docker */}
                <div 
                    onClick={() => setSelectedEnv('docker')}
                    style={{ 
                        padding: '2rem', 
                        borderRadius: '24px', 
                        border: `1px solid ${selectedEnv === 'docker' ? 'var(--primary-accent)' : 'var(--glass-border)'}`,
                        background: selectedEnv === 'docker' ? 'rgba(0, 210, 255, 0.05)' : 'rgba(255,255,255,0.01)',
                        cursor: 'pointer',
                        transition: 'all 0.3s'
                    }}
                >
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2.5rem' }}>
                        <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(173, 201, 235, 0.1)', color: '#adc9eb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Box size={24} />
                        </div>
                        <div style={{ width: '20px', height: '20px', borderRadius: '50%', border: `2px solid ${selectedEnv === 'docker' ? 'var(--primary-accent)' : 'var(--text-secondary)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            {selectedEnv === 'docker' && <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'var(--primary-accent)' }}></div>}
                        </div>
                    </div>
                    <h3 style={{ fontSize: '1.4rem', fontWeight: 700, color: 'white', marginBottom: '0.75rem' }}>Docker Container</h3>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '2rem' }}>
                        Lightweight standalone deployment ideal for rapid prototyping and microservices.
                    </p>
                    <div style={{ display: 'flex', gap: '1.5rem', paddingTop: '1.25rem', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                        <div>
                            <span style={{ display: 'block', fontSize: '0.6rem', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 800 }}>Cold Start</span>
                            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#67d9c9' }}>~2s</span>
                        </div>
                        <div>
                            <span style={{ display: 'block', fontSize: '0.6rem', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 800 }}>Complexity</span>
                            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#adc9eb' }}>Low</span>
                        </div>
                    </div>
                </div>

                {/* Kubernetes */}
                <div 
                    onClick={() => setSelectedEnv('k8s')}
                    style={{ 
                        padding: '2rem', 
                        borderRadius: '24px', 
                        border: `1px solid ${selectedEnv === 'k8s' ? 'var(--primary-accent)' : 'var(--glass-border)'}`,
                        background: selectedEnv === 'k8s' ? 'rgba(0, 210, 255, 0.05)' : 'rgba(255,255,255,0.01)',
                        cursor: 'pointer',
                        transition: 'all 0.3s'
                    }}
                >
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2.5rem' }}>
                        <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(103, 217, 201, 0.1)', color: '#67d9c9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Layers size={24} />
                        </div>
                        <div style={{ width: '20px', height: '20px', borderRadius: '50%', border: `2px solid ${selectedEnv === 'k8s' ? 'var(--primary-accent)' : 'var(--text-secondary)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            {selectedEnv === 'k8s' && <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'var(--primary-accent)' }}></div>}
                        </div>
                    </div>
                    <h3 style={{ fontSize: '1.4rem', fontWeight: 700, color: 'white', marginBottom: '0.75rem' }}>Kubernetes Cluster</h3>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '2rem' }}>
                        Production-grade orchestration with auto-scaling and multi-node availability.
                    </p>
                    <div style={{ display: 'flex', gap: '1.5rem', paddingTop: '1.25rem', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                        <div>
                            <span style={{ display: 'block', fontSize: '0.6rem', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 800 }}>Uptime SLA</span>
                            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#67d9c9' }}>99.99%</span>
                        </div>
                        <div>
                            <span style={{ display: 'block', fontSize: '0.6rem', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 800 }}>Autoscaling</span>
                            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#adc9eb' }}>Native</span>
                        </div>
                    </div>
                </div>
            </div>
       </>
    );
  };

  return (
    <div className="deployment-wizard-view" style={{ display: 'flex', gap: '4rem', height: '100%' }}>
      {/* Progress Sidebar */}
      <aside style={{ width: '280px', flexShrink: 0 }}>
        <div style={{ marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '2.5rem', fontWeight: 800, color: 'white', marginBottom: '0.5rem', letterSpacing: '-0.02em' }}>Deploy Model</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Configure and push your model to production.</p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem', position: 'relative' }}>
          {/* Progress Line */}
          <div style={{ position: 'absolute', left: '19px', top: '20px', bottom: '20px', width: '2px', background: 'rgba(255,255,255,0.05)' }}></div>
          
          {steps.map((s, i) => (
            <div key={s.id} style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', opacity: s.id > step ? 0.4 : 1, transition: 'all 0.3s' }}>
                <div style={{ 
                    width: '40px', 
                    height: '40px', 
                    borderRadius: '50%', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    background: s.completed ? 'var(--primary-accent)' : s.active ? 'transparent' : 'rgba(255,255,255,0.05)',
                    border: s.active ? '2px solid var(--primary-accent)' : 'none',
                    color: s.completed ? 'black' : s.active ? 'var(--primary-accent)' : 'var(--text-secondary)',
                    fontWeight: 800,
                    zIndex: 1,
                    boxShadow: s.completed ? '0 0 15px rgba(0, 210, 255, 0.3)' : 'none'
                }}>
                    {s.completed ? <Check size={20} /> : `0${s.id}`}
                </div>
                <div>
                   <span style={{ display: 'block', fontSize: '0.6rem', color: 'var(--primary-accent)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Step {s.id}</span>
                   <span style={{ fontWeight: 700, color: s.active ? 'white' : 'var(--text-secondary)' }}>{s.label}</span>
                </div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: '4rem', padding: '1.25rem', borderRadius: '16px', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--glass-border)', display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            <Info size={18} color="#adc9eb" />
            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                Estimated deployment time: <strong style={{ color: 'white' }}>4.5 minutes</strong>
            </p>
        </div>
      </aside>

      {/* Content Area */}
      <section style={{ flex: 1 }}>
         <div style={{ 
             background: 'rgba(255,255,255,0.02)', 
             borderRadius: '32px', 
             border: '1px solid var(--glass-border)', 
             padding: '3.5rem',
             minHeight: '600px',
             display: 'flex',
             flexDirection: 'column'
         }}>
            {renderContent()}

            {/* Footer Actions */}
            <div style={{ marginTop: '4rem', paddingTop: '2.5rem', borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', opacity: isDeploying ? 0 : 1 }}>
                <button 
                  className="btn-primary" 
                  style={{ background: 'transparent', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}
                  onClick={() => step > 1 ? setStep(step - 1) : window.history.back()}
                >
                    <ArrowLeft size={18} /> Back
                </button>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <button className="btn-primary" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--glass-border)' }}>Save Draft</button>
                    <button onClick={handleNext} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        {step === 4 ? 'Deploy to Production' : 'Next Step'} <ArrowRight size={18} />
                    </button>
                </div>
            </div>
         </div>
      </section>
    </div>
  );
};

export default ModelDeploymentWizard;

import React, { useState } from 'react';
import GlassCard from './common/GlassCard';
import { 
  Sparkles, 
  MessageSquare, 
  Send, 
  X, 
  Terminal, 
  Zap, 
  BrainCircuit, 
  TrendingUp, 
  AlertTriangle,
  Bot,
  Minimize2,
  Maximize2
} from 'lucide-react';

const InsightCopilot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', content: "Hello! I'm the **ML Analytics AI**. I've analyzed your current workspace. I noticed a **12% drift** in your *Fraud Detection v3* model. Would you like me to suggest a retraining strategy?" }
  ]);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (!input.trim()) return;
    const newMessages = [...messages, { role: 'user', content: input }];
    setMessages(newMessages);
    setInput('');
    
    // Fake typing effect
    setTimeout(() => {
        setMessages([...newMessages, { role: 'assistant', content: "Analyzing... I've processed your request. Based on the *Transaction Logs*, I recommend focused feature engineering on the 'ip_origin' column to reduce false positives." }]);
    }, 1000);
  };

  const suggestions = [
      "Explain the recent drift",
      "Suggest retrain parameters",
      "Compare with baseline",
      "Analyze data quality"
  ];

  return (
    <>
      {/* Floating Trigger Button */}
      {!isOpen && (
        <button 
            onClick={() => setIsOpen(true)}
            style={{ 
                position: 'fixed', 
                bottom: '2rem', 
                right: '2rem', 
                width: '64px', 
                height: '64px', 
                borderRadius: '50%', 
                background: 'linear-gradient(135deg, #00d2ff 0%, #3a7bd5 100%)', 
                color: 'white', 
                border: 'none', 
                boxShadow: '0 10px 40px rgba(0, 210, 255, 0.5)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 2000,
                cursor: 'pointer',
                animation: 'pulse 2s infinite'
            }}
        >
            <Bot size={32} />
        </button>
      )}

      {/* Copilot Interface */}
      {isOpen && (
        <div style={{ 
            position: 'fixed', 
            bottom: '2rem', 
            right: '2rem', 
            width: isMinimized ? '300px' : '400px', 
            height: isMinimized ? '60px' : '650px', 
            maxHeight: '85vh',
            background: 'rgba(15, 23, 42, 0.85)',
            backdropFilter: 'blur(30px)',
            border: '1px solid rgba(0, 210, 255, 0.3)',
            borderRadius: '24px',
            boxShadow: '0 30px 60px rgba(0,0,0,0.6)',
            display: 'flex',
            flexDirection: 'column',
            zIndex: 2000,
            overflow: 'hidden',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
        }}>
            {/* Header */}
            <div style={{ padding: '1.25rem', background: 'rgba(0, 210, 255, 0.1)', borderBottom: '1px solid rgba(0, 210, 255, 0.2)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{ position: 'relative' }}>
                        <Bot size={24} color="#00d2ff" />
                        <div style={{ position: 'absolute', bottom: -2, right: -2, width: '8px', height: '8px', borderRadius: '50%', background: '#10b981', border: '2px solid black' }}></div>
                    </div>
                    <div>
                        <span style={{ color: 'white', fontWeight: 800, fontSize: '0.9rem', display: 'block' }}>ANALYTICS AI</span>
                        <span style={{ color: '#00d2ff', fontSize: '0.65rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Insight Copilot</span>
                    </div>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button onClick={() => setIsMinimized(!isMinimized)} style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                        {isMinimized ? <Maximize2 size={16} /> : <Minimize2 size={16} />}
                    </button>
                    <button onClick={() => setIsOpen(false)} style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                        <X size={18} />
                    </button>
                </div>
            </div>

            {!isMinimized && (
                <>
                    {/* Messages Area */}
                    <div style={{ flex: 1, padding: '1.5rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        {messages.map((m, idx) => (
                            <div key={idx} style={{ 
                                alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start',
                                maxWidth: '85%',
                                padding: '1rem',
                                borderRadius: m.role === 'user' ? '18px 18px 0 18px' : '0 18px 18px 18px',
                                background: m.role === 'user' ? 'rgba(0, 210, 255, 0.1)' : 'rgba(255,255,255,0.03)',
                                border: m.role === 'user' ? '1px solid rgba(0, 210, 255, 0.2)' : '1px solid rgba(255,255,255,0.05)',
                                color: 'white',
                                fontSize: '0.9rem',
                                lineHeight: 1.5
                            }}>
                                {m.role === 'assistant' && (
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '0.5rem', color: 'var(--primary-accent)', fontSize: '0.65rem', fontWeight: 800, textTransform: 'uppercase' }}>
                                        <Sparkles size={10} /> Copilot
                                    </div>
                                )}
                                {m.content}
                            </div>
                        ))}
                    </div>

                    {/* Suggestions Chips */}
                    <div style={{ padding: '0 1.5rem', display: 'flex', gap: '0.5rem', overflowX: 'auto', whiteSpace: 'nowrap', paddingBottom: '0.5rem' }} className="hide-scrollbar">
                        {suggestions.map((s, idx) => (
                            <button 
                                key={idx} 
                                onClick={() => setInput(s)}
                                style={{ 
                                    padding: '6px 14px', 
                                    borderRadius: '100px', 
                                    background: 'rgba(255,255,255,0.03)', 
                                    border: '1px solid rgba(255,255,255,0.1)', 
                                    color: 'var(--text-secondary)', 
                                    fontSize: '0.75rem',
                                    whiteSpace: 'nowrap'
                                }}
                                className="hover:border-primary-accent"
                            >
                                {s}
                            </button>
                        ))}
                    </div>

                    {/* Input Area */}
                    <div style={{ padding: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                        <div style={{ position: 'relative' }}>
                            <input 
                                type="text"
                                placeholder="Ask ML Analytics AI anything..."
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                                style={{ 
                                    width: '100%', 
                                    padding: '1rem 3.5rem 1rem 1.25rem', 
                                    borderRadius: '14px', 
                                    background: 'rgba(255,255,255,0.03)', 
                                    border: '1px solid rgba(255,255,255,0.1)', 
                                    color: 'white',
                                    outline: 'none'
                                }}
                            />
                            <button 
                                onClick={handleSend}
                                style={{ 
                                    position: 'absolute', 
                                    right: '0.75rem', 
                                    top: '50%', 
                                    transform: 'translateY(-50%)', 
                                    background: 'var(--primary-accent)', 
                                    border: 'none', 
                                    borderRadius: '10px', 
                                    padding: '0.5rem', 
                                    color: 'black',
                                    display: 'flex'
                                }}
                            >
                                <Send size={18} />
                            </button>
                        </div>
                        <div style={{ textAlign: 'center', marginTop: '1rem' }}>
                            <span style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.2)', fontWeight: 800 }}>POWERED BY ML ANALYTICS ENGINE v4.2</span>
                        </div>
                    </div>
                </>
            )}
        </div>
      )}

      {/* Global Pulse Animation */}
      <style>{`
        @keyframes pulse {
            0% { box-shadow: 0 0 0 0 rgba(0, 210, 255, 0.4); }
            70% { box-shadow: 0 0 0 20px rgba(0, 210, 255, 0); }
            100% { box-shadow: 0 0 0 0 rgba(0, 210, 255, 0); }
        }
        .hide-scrollbar::-webkit-scrollbar {
            display: none;
        }
      `}</style>
    </>
  );
};

export default InsightCopilot;

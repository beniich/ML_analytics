import React from 'react';

const GlassCard = ({ children, className = '', title = '', status = '', icon = null }) => {
  return (
    <div className={`glass-panel ${className}`} style={{ minHeight: '100%' }}>
      {(title || status || icon) && (
        <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            {icon && <span style={{ fontSize: '1.25rem', color: 'var(--primary-accent)' }}>{icon}</span>}
            <h3 style={{ fontSize: '1.1rem', fontWeight: 600 }}>{title}</h3>
          </div>
          {status && (
            <span style={{
              fontSize: '0.75rem',
              padding: '0.25rem 0.6rem',
              borderRadius: '20px',
              background: 'rgba(0, 210, 255, 0.1)',
              color: 'var(--primary-accent)',
              border: '1px solid rgba(0, 210, 255, 0.2)'
            }}>
              {status}
            </span>
          )}
        </div>
      )}
      <div className="card-body">
        {children}
      </div>
    </div>
  );
};

export default GlassCard;

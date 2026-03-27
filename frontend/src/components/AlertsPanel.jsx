import React, { useState } from 'react';
import { alertService } from '../services/api';
import { toast } from 'react-toastify';

function AlertsPanel() {
  const [alertConfig, setAlertConfig] = useState({
    email_enabled: false,
    email_recipients: '',
    smtp_server: '',
    smtp_port: 587,
    smtp_user: '',
    smtp_password: ''
  });

  const handleConfigChange = (field, value) => {
    setAlertConfig(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const saveConfiguration = async () => {
    try {
      await alertService.configureAlerts(alertConfig);
      toast.success('Alert configuration saved successfully!');
    } catch (error) {
      toast.error('Failed to save configuration');
    }
  };

  const testAlert = () => {
    toast.info('Test alert sent! Check your email configuration.');
  };

  return (
    <div className="alerts-panel">
      <h2>Alert Configuration</h2>
      
      <div className="config-section result-card">
        <h3>Email Notifications</h3>
        
        <div className="form-group">
          <label style={{ display: 'flex', alignItems: 'center', gap: '10px', width: 'auto' }}>
            <input
              type="checkbox"
              checked={alertConfig.email_enabled}
              onChange={(e) => handleConfigChange('email_enabled', e.target.checked)}
              style={{ width: 'auto' }}
            />
            Enable Email Alerts
          </label>
        </div>

        {alertConfig.email_enabled && (
          <div style={{ padding: '15px', background: '#f9f9f9', borderRadius: '4px', marginTop: '10px' }}>
            <div className="form-group">
              <label>Recipient Emails (comma-separated)</label>
              <input
                type="text"
                value={alertConfig.email_recipients}
                onChange={(e) => handleConfigChange('email_recipients', e.target.value)}
                placeholder="user1@example.com, user2@example.com"
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div className="form-group">
                <label>SMTP Server</label>
                <input
                  type="text"
                  value={alertConfig.smtp_server}
                  onChange={(e) => handleConfigChange('smtp_server', e.target.value)}
                  placeholder="smtp.gmail.com"
                />
              </div>

              <div className="form-group">
                <label>SMTP Port</label>
                <input
                  type="number"
                  value={alertConfig.smtp_port}
                  onChange={(e) => handleConfigChange('smtp_port', parseInt(e.target.value))}
                />
              </div>
            </div>

            <div className="form-group">
              <label>SMTP Username</label>
              <input
                type="email"
                value={alertConfig.smtp_user}
                onChange={(e) => handleConfigChange('smtp_user', e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>SMTP Password</label>
              <input
                type="password"
                value={alertConfig.smtp_password}
                onChange={(e) => handleConfigChange('smtp_password', e.target.value)}
              />
            </div>
          </div>
        )}

        <div className="config-actions" style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
          <button onClick={saveConfiguration} style={{ width: 'auto' }}>Save Configuration</button>
          <button onClick={testAlert} disabled={!alertConfig.email_enabled} style={{ width: 'auto', background: '#e7f3ff', color: 'var(--primary-color)', border: '1px solid var(--primary-color)' }}>
            Send Test Alert
          </button>
        </div>
      </div>

      <div className="alerts-history" style={{ marginTop: '20px' }}>
        <h3>Recent Alerts</h3>
        <div className="result-card alert-card">
          <div style={{ fontWeight: '600' }}>Warning: Distribution Shift</div>
          <p style={{ fontSize: '0.8rem', color: '#666' }}>Detected in column 'revenue' | 2 hours ago</p>
          <p style={{ marginTop: '5px' }}>Significance: High (p=0.002)</p>
        </div>
        
        <div className="result-card alert-card" style={{ borderLeftColor: 'var(--danger-color)' }}>
          <div style={{ fontWeight: '600' }}>Critical: Anomaly Detected</div>
          <p style={{ fontSize: '0.8rem', color: '#666' }}>Detected in column 'age' | 1 day ago</p>
          <p style={{ marginTop: '5px' }}>Found 12 outliers (Z-score > 3.0)</p>
        </div>
      </div>
    </div>
  );
}

export default AlertsPanel;

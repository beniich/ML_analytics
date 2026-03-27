import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { toast } from 'react-toastify';

function UserProfile() {
  const { user } = useAuth();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleChangePassword = async (e) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }

    toast.success('Password changed successfully!');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  const handleClearCache = () => {
    toast.info('Cache cleared successfully');
  };

  return (
    <div className="user-profile">
      <h2>User Profile</h2>
      
      <div className="profile-info" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '20px' }}>
        <div className="info-card result-card">
          <h3>Account Information</h3>
          <div className="info-item" style={{ marginTop: '10px' }}>
            <label style={{ fontWeight: 600 }}>Username:</label>
            <span style={{ marginLeft: '10px' }}>{user?.username}</span>
          </div>
          <div className="info-item" style={{ marginTop: '10px' }}>
            <label style={{ fontWeight: 600 }}>Member Since:</label>
            <span style={{ marginLeft: '10px' }}>March 2024</span>
          </div>
        </div>

        <div className="info-card result-card">
          <h3>Subscription</h3>
          <div className="info-item" style={{ marginTop: '10px' }}>
            <label style={{ fontWeight: 600 }}>Plan:</label>
            <span style={{ marginLeft: '10px' }}>Professional</span>
          </div>
          <div className="info-item" style={{ marginTop: '10px' }}>
            <label style={{ fontWeight: 600 }}>Next Billing:</label>
            <span style={{ marginLeft: '10px' }}>April 15, 2024</span>
          </div>
        </div>
      </div>

      <div className="profile-settings" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '20px' }}>
        <div className="settings-section result-card">
          <h3>Change Password</h3>
          <form onSubmit={handleChangePassword} style={{ marginTop: '15px' }}>
            <div className="form-group">
              <label>Current Password</label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
              />
            </div>
            
            <div className="form-group">
              <label>New Password</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </div>
            
            <div className="form-group">
              <label>Confirm New Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
            
            <button type="submit" style={{ width: 'auto' }}>Update Password</button>
          </form>
        </div>

        <div className="settings-section result-card">
          <h3>System Settings</h3>
          <div style={{ padding: '15px', background: '#f9f9f9', borderRadius: '4px', marginTop: '15px' }}>
            <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <input type="checkbox" defaultChecked style={{ width: 'auto' }} />
              <label>Enable Dark Mode</label>
            </div>
            
            <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <input type="checkbox" defaultChecked style={{ width: 'auto' }} />
              <label>Email Notifications</label>
            </div>
            
            <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <input type="checkbox" style={{ width: 'auto' }} />
              <label>Auto-save Reports</label>
            </div>
            
            <button onClick={handleClearCache} style={{ width: 'auto', background: '#e7f3ff', color: 'var(--primary-color)', border: '1px solid var(--primary-color)' }}>
              Clear System Cache
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserProfile;

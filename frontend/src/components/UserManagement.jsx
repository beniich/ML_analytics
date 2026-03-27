import React, { useState } from 'react';
import GlassCard from './common/GlassCard';
import { 
  UserPlus, 
  Search, 
  MoreVertical, 
  UserX, 
  Edit3, 
  ShieldCheck, 
  Users, 
  ChevronLeft, 
  ChevronRight,
  Filter,
  UserCheck
} from 'lucide-react';

const UserManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const users = [
    { name: 'Alice Smith', email: 'alice.smith@example.com', role: 'Admin', lastLogin: 'Today, 10:15 AM', status: 'Active' },
    { name: 'Bob Jones', email: 'bob.jones@example.com', role: 'Editor', lastLogin: 'Yesterday, 4:30 PM', status: 'Active' },
    { name: 'Charlie Davis', email: 'charlie.davis@example.com', role: 'Viewer', lastLogin: 'Oct 25, 2:00 PM', status: 'Inactive' },
    { name: 'David Lee', email: 'david.lee@example.com', role: 'Viewer', lastLogin: 'Oct 24, 11:45 AM', status: 'Active' },
    { name: 'Emma Wilson', email: 'emma.wilson@example.com', role: 'Editor', lastLogin: 'Oct 23, 9:00 AM', status: 'Active' },
  ];

  const getRoleStyle = (role) => {
    switch (role) {
      case 'Admin': return { color: 'var(--primary-accent)', bg: 'rgba(0, 210, 255, 0.1)' };
      case 'Editor': return { color: '#67d9c9', bg: 'rgba(103, 217, 201, 0.1)' };
      default: return { color: '#adc9eb', bg: 'rgba(173, 201, 235, 0.1)' };
    }
  };

  return (
    <div className="user-management-view" style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
      {/* Header */}
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <h2 style={{ fontSize: '2.5rem', fontWeight: 800, color: 'white', marginBottom: '0.5rem', letterSpacing: '-0.02em' }}>User Management</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>Control access permissions and oversee user activity across the organization.</p>
        </div>
        <button className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.8rem 1.8rem' }}>
          <UserPlus size={18} /> Add New User
        </button>
      </header>

      {/* Stats Summary Area */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem' }}>
          {[
            { label: 'Total Users', val: '125', icon: <Users size={20} />, col: 'white' },
            { label: 'Admins', val: '12', icon: <ShieldCheck size={20} />, col: 'var(--primary-accent)' },
            { label: 'Active Now', val: '42', icon: <UserCheck size={20} />, col: '#67d9c9' },
            { label: 'Inactive', val: '5', icon: <UserX size={20} />, col: '#ffb4a4' },
          ].map((stat, i) => (
             <div key={i} style={{ background: 'rgba(255,255,255,0.02)', padding: '1.5rem', borderRadius: '20px', border: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                   <span style={{ fontSize: '0.6rem', fontWeight: 800, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{stat.label}</span>
                   <div style={{ fontSize: '1.8rem', fontWeight: 800, color: stat.col, marginTop: '0.25rem' }}>{stat.val}</div>
                </div>
                <div style={{ color: 'var(--text-secondary)', opacity: 0.5 }}>{stat.icon}</div>
             </div>
          ))}
      </div>

      {/* Main Table Container */}
      <div style={{ background: 'rgba(255,255,255,0.02)', borderRadius: '24px', border: '1px solid var(--glass-border)', overflow: 'hidden' }}>
        
        {/* Table Controls */}
        <div style={{ padding: '1.5rem 2rem', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.01)' }}>
            <div style={{ position: 'relative' }}>
                <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                <input 
                    type="text" 
                    placeholder="Search users..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{ padding: '0.6rem 1rem 0.6rem 2.5rem', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--glass-border)', borderRadius: '12px', color: 'white', fontSize: '0.85rem', width: '320px' }}
                />
            </div>
            <div style={{ display: 'flex', gap: '1rem' }}>
                <button style={{ padding: '0.6rem 1rem', borderRadius: '10px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--glass-border)', color: 'white', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Filter size={14} /> Filter
                </button>
            </div>
        </div>

        {/* The Table */}
        <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                    <tr style={{ background: 'rgba(255,255,255,0.02)', color: 'var(--text-secondary)', fontSize: '0.65rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                        <th style={{ padding: '1.25rem 2rem' }}>User Identity</th>
                        <th style={{ padding: '1.25rem 1.5rem' }}>Access Role</th>
                        <th style={{ padding: '1.25rem 1.5rem' }}>Last Activity</th>
                        <th style={{ padding: '1.25rem 1.5rem' }}>Status</th>
                        <th style={{ padding: '1.25rem 2rem', textAlign: 'right' }}>Actions</th>
                    </tr>
                </thead>
                <tbody style={{ fontSize: '0.9rem' }}>
                    {users.map((user, idx) => {
                        const roleStyle = getRoleStyle(user.role);
                        return (
                            <tr key={idx} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', transition: 'background 0.2s' }} className="hover:bg-white/5">
                                <td style={{ padding: '1.5rem 2rem' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                        <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, color: 'var(--primary-accent)' }}>
                                            {user.name.split(' ').map(n => n[0]).join('')}
                                        </div>
                                        <div>
                                            <div style={{ fontWeight: 700, color: 'white' }}>{user.name}</div>
                                            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{user.email}</div>
                                        </div>
                                    </div>
                                </td>
                                <td style={{ padding: '1.5rem 1.5rem' }}>
                                    <span style={{ padding: '0.3rem 0.75rem', borderRadius: '6px', background: roleStyle.bg, color: roleStyle.color, fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase' }}>
                                        {user.role}
                                    </span>
                                </td>
                                <td style={{ padding: '1.5rem 1.5rem', color: 'var(--text-secondary)' }}>{user.lastLogin}</td>
                                <td style={{ padding: '1.5rem 1.5rem' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: user.status === 'Active' ? '#67d9c9' : 'rgba(255,255,255,0.1)' }}></div>
                                        <span style={{ fontSize: '0.8rem', color: user.status === 'Active' ? 'white' : 'var(--text-secondary)' }}>{user.status}</span>
                                    </div>
                                </td>
                                <td style={{ padding: '1.5rem 2rem', textAlign: 'right' }}>
                                    <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                                        <button style={{ padding: '0.4rem', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }} title="Edit"><Edit3 size={14}/></button>
                                        <button style={{ padding: '0.4rem', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: 'none', color: '#ffb4a4', cursor: 'pointer' }} title="Revoke"><UserX size={14}/></button>
                                        <button style={{ padding: '0.4rem', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: 'none', color: 'white', cursor: 'pointer' }}><MoreVertical size={14}/></button>
                                    </div>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>

        {/* Table Footer */}
        <div style={{ padding: '1.5rem 2rem', borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.01)' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>1-5 of 125 users</span>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button style={{ width: '32px', height: '32px', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'transparent', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><ChevronLeft size={16}/></button>
                <button style={{ width: '32px', height: '32px', borderRadius: '8px', border: 'none', background: 'var(--primary-accent)', color: 'black', fontWeight: 800, fontSize: '0.75rem' }}>1</button>
                <button style={{ width: '32px', height: '32px', borderRadius: '8px', border: 'none', background: 'rgba(255,255,255,0.05)', color: 'white', fontWeight: 700, fontSize: '0.75rem' }}>2</button>
                <button style={{ width: '32px', height: '32px', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'transparent', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><ChevronRight size={16}/></button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default UserManagement;

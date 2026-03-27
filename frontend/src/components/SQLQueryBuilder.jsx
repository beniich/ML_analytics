import React, { useState } from 'react';
import GlassCard from './common/GlassCard';
import { 
  Database, 
  Search, 
  Play, 
  Save, 
  FileCode, 
  ChevronRight, 
  Table as TableIcon,
  Columns,
  Code,
  Download
} from 'lucide-react';

const SQLQueryBuilder = () => {
  const [query, setQuery] = useState(`SELECT id, username, email\nFROM users\nWHERE created_at > '2023-01-01'\nORDER BY id DESC;`);

  const schema = [
    { 
      name: 'public', 
      tables: [
        { name: 'users', columns: ['id', 'username', 'email', 'created_at'] },
        { name: 'products', columns: ['id', 'sku', 'price', 'inventory'] },
        { name: 'orders', columns: ['id', 'user_id', 'total', 'status'] }
      ]
    }
  ];

  const results = [
    { id: 1, username: 'almin', email: 'almin01@example.com', created_at: '2023-01-01 06:58:33' },
    { id: 2, username: 'username', email: 'user@gmail.com', created_at: '2023-01-01 06:50:00' },
    { id: 3, username: 'example', email: 'ex@example.com', created_at: '2023-01-01 06:53:06' },
    { id: 4, username: 'deskltay', email: 'desk@example.com', created_at: '2023-01-01 06:59:40' }
  ];

  return (
    <div className="sql-builder-view" style={{ display: 'flex', flexDirection: 'column', gap: '2rem', height: '100%' }}>
      
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end' }}>
        <div>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 800 }}>SQL Query & Integration Builder</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Directly query connected data sources to build custom ML datasets.</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
           <button style={{ padding: '0.6rem 1.2rem', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'rgba(255,255,255,0.05)', color: 'white', fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Save size={16} /> Save Query
           </button>
           <button className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Play size={16} fill="white" /> Run Query
           </button>
        </div>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: '2rem', flex: 1, minHeight: 0 }}>
        
        {/* Schema Browser Side */}
        <aside style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', overflowY: 'auto' }}>
           <GlassCard title="Schema Browser" icon={<Database size={16} />} style={{ flex: 1, padding: '1.25rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
                 {schema.map((db, idx) => (
                   <div key={idx}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', fontWeight: 800, color: 'var(--primary-accent)', marginBottom: '0.75rem' }}>
                         <ChevronRight size={14} /> {db.name}
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginLeft: '1rem' }}>
                         {db.tables.map((table, tIdx) => (
                           <div key={tIdx}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', fontWeight: 700, color: 'white', cursor: 'pointer' }}>
                                 <TableIcon size={14} opacity={0.6} /> {table.name}
                              </div>
                              <div style={{ marginLeft: '1.5rem', marginTop: '0.25rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                                 {table.columns.map((col, cIdx) => (
                                   <div key={cIdx} style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                      <Columns size={10} opacity={0.4} /> {col}
                                   </div>
                                 ))}
                              </div>
                           </div>
                         ))}
                      </div>
                   </div>
                 ))}
              </div>
           </GlassCard>
        </aside>

        {/* Editor & Results Area */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', minHeight: 0 }}>
           
           {/* Code Editor */}
           <GlassCard style={{ height: '350px', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
              <div style={{ padding: '0.75rem 1.5rem', background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                 <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-secondary)' }}>
                    <Code size={14} /> SQL_EDITOR.EXE
                 </div>
                 <div style={{ fontSize: '0.7rem', color: 'var(--primary-accent)', fontWeight: 800 }}>PostgreSQL v14.2</div>
              </div>
              <textarea 
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                style={{ 
                  flex: 1, 
                  background: 'transparent', 
                  border: 'none', 
                  padding: '1.5rem', 
                  color: 'var(--primary-accent)', 
                  fontFamily: '"Fira Code", monospace', 
                  fontSize: '0.9rem', 
                  lineHeight: 1.6,
                  resize: 'none',
                  outline: 'none'
                }}
              />
           </GlassCard>

           {/* Results Table */}
           <GlassCard style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
              <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                 <h3 style={{ fontSize: '0.9rem', fontWeight: 800 }}>Query Results (Top 100)</h3>
                 <button style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer' }}>
                    <Download size={14} /> Export CSV
                 </button>
              </div>
              <div style={{ flex: 1, overflow: 'auto' }}>
                 <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                    <thead>
                       <tr style={{ background: 'rgba(255,255,255,0.02)', textAlign: 'left' }}>
                          <th style={{ padding: '1rem', borderBottom: '1px solid var(--glass-border)' }}>ID</th>
                          <th style={{ padding: '1rem', borderBottom: '1px solid var(--glass-border)' }}>Username</th>
                          <th style={{ padding: '1rem', borderBottom: '1px solid var(--glass-border)' }}>Email</th>
                          <th style={{ padding: '1rem', borderBottom: '1px solid var(--glass-border)' }}>Created At</th>
                       </tr>
                    </thead>
                    <tbody>
                       {results.map((row) => (
                         <tr key={row.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                            <td style={{ padding: '1rem', color: 'var(--primary-accent)', fontWeight: 700 }}>{row.id}</td>
                            <td style={{ padding: '1rem', color: 'white' }}>{row.username}</td>
                            <td style={{ padding: '1rem', color: 'var(--text-secondary)' }}>{row.email}</td>
                            <td style={{ padding: '1rem', color: 'var(--text-secondary)' }}>{row.created_at}</td>
                         </tr>
                       ))}
                    </tbody>
                 </table>
              </div>
           </GlassCard>

        </div>
      </div>
    </div>
  );
};

export default SQLQueryBuilder;

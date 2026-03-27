import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

function ReportViewer() {
  const [savedReports, setSavedReports] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null);

  // Mock data for saved reports
  useEffect(() => {
    const mockReports = [
      { id: 1, name: 'Q1 Sales Analysis', date: '2024-03-15', type: 'Complete' },
      { id: 2, name: 'Customer Behavior Study', date: '2024-03-10', type: 'Predictive' },
      { id: 3, name: 'Market Trends Report', date: '2024-03-05', type: 'Statistical' }
    ];
    setSavedReports(mockReports);
  }, []);

  const loadReport = (reportId) => {
    const report = savedReports.find(r => r.id === reportId);
    setSelectedReport({
      ...report,
      content: `Detailed analysis report for ${report.name}\nGenerated on ${report.date}\nType: ${report.type}\n\nThis is a sample report content for demonstration.`
    });
  };

  const deleteReport = (reportId) => {
    setSavedReports(savedReports.filter(r => r.id !== reportId));
    if (selectedReport?.id === reportId) {
      setSelectedReport(null);
    }
    toast.success('Report deleted successfully');
  };

  return (
    <div className="report-viewer">
      <h2>Saved Reports</h2>
      
      <div className="reports-layout" style={{ display: 'flex', gap: '20px', marginTop: '20px' }}>
        <div className="reports-list" style={{ flex: '1' }}>
          <h3>History</h3>
          {savedReports.length === 0 ? (
            <p>No reports found.</p>
          ) : (
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {savedReports.map(report => (
                <li key={report.id} className="result-card" style={{ padding: '10px' }}>
                  <div>
                    <h4>{report.name}</h4>
                    <p style={{ fontSize: '0.8rem' }}>{report.type} - {report.date}</p>
                  </div>
                  <div style={{ marginTop: '10px', display: 'flex', gap: '5px' }}>
                    <button onClick={() => loadReport(report.id)} style={{ padding: '5px', width: 'auto' }}>View</button>
                    <button onClick={() => deleteReport(report.id)} style={{ padding: '5px', width: 'auto', background: 'var(--danger-color)' }}>Del</button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="report-preview" style={{ flex: '2', background: 'white', padding: '20px', borderRadius: '8px', border: '1px solid #ddd' }}>
          {selectedReport ? (
            <div>
              <h3>{selectedReport.name}</h3>
              <p>Type: {selectedReport.type} | Date: {selectedReport.date}</p>
              <pre style={{ marginTop: '20px', whiteSpace: 'pre-wrap' }}>{selectedReport.content}</pre>
            </div>
          ) : (
            <p style={{ textAlign: 'center', color: '#888' }}>Select a report to view details</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default ReportViewer;

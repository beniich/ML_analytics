import React, { useState } from 'react';
import { ApiService } from '../services/api';
import { toast } from 'react-toastify';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function AnalysisForm() {
  const [file, setFile] = useState(null);
  const [options, setOptions] = useState({
    includePredictions: true,
    cacheResults: true,
    format: 'json'
  });
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [charts, setCharts] = useState({});

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      toast.error('Please select a file');
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('include_predictions', options.includePredictions);
    formData.append('cache_results', options.cacheResults);

    try {
      const response = await ApiService.analysis.comprehensive(file, { include_predictions: options.includePredictions, cache_results: options.cacheResults });
      setResults(response.data.analysis);
      generateCharts(response.data.analysis);
      toast.success('Analysis completed successfully!');
    } catch (error) {
      toast.error('Analysis failed: ' + (error.response?.data?.detail || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  const generateCharts = (analysisData) => {
    const chartsData = {};
    
    // Chart pour les statistiques basiques
    if (analysisData.basic_stats?.basic_stats) {
      const stats = analysisData.basic_stats.basic_stats;
      const labels = Object.keys(stats);
      const data = Object.values(stats).map(stat => stat.mean || 0);
      
      chartsData.statsChart = {
        labels: labels,
        datasets: [{
          label: 'Mean Values',
          data: data,
          backgroundColor: 'rgba(53, 162, 235, 0.5)',
          borderColor: 'rgb(53, 162, 235)',
          borderWidth: 1,
        }]
      };
    }

    setCharts(chartsData);
  };

  const exportResults = async (format) => {
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await ApiService.analysis.complete(file, format);
      
      if (format === 'pdf' || format === 'html') {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `analysis_report.${format}`);
        document.body.appendChild(link);
        link.click();
        link.remove();
      } else {
        const blob = new Blob([JSON.stringify(response.data)], { type: 'application/json' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `analysis_report.${format}`);
        document.body.appendChild(link);
        link.click();
        link.remove();
      }
      
      toast.success(`Report exported as ${format.toUpperCase()}!`);
    } catch (error) {
      toast.error('Export failed');
    }
  };

  return (
    <div className="analysis-form">
      <h2>Data Analysis</h2>
      
      <form onSubmit={handleSubmit} className="upload-form">
        <div className="form-group">
          <label htmlFor="file-upload">Upload Data File</label>
          <input
            id="file-upload"
            type="file"
            accept=".csv,.xlsx,.xls,.json"
            onChange={handleFileChange}
            required
          />
          <small>Supported formats: CSV, Excel, JSON</small>
        </div>

        <div className="options-grid">
          <div className="checkbox-group">
            <label>
              <input
                type="checkbox"
                checked={options.includePredictions}
                onChange={(e) => setOptions({...options, includePredictions: e.target.checked})}
              />
              Include Predictive Analysis
            </label>
          </div>
          
          <div className="checkbox-group">
            <label>
              <input
                type="checkbox"
                checked={options.cacheResults}
                onChange={(e) => setOptions({...options, cacheResults: e.target.checked})}
              />
              Use Cached Results
            </label>
          </div>
        </div>

        <button type="submit" disabled={loading || !file}>
          {loading ? 'Analyzing...' : 'Analyze Data'}
        </button>
      </form>

      {results && (
        <div className="results-section">
          <div className="results-header">
            <h3>Analysis Results</h3>
            <div className="export-buttons" style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
              <button onClick={() => exportResults('json')} style={{ width: 'auto' }}>Export JSON</button>
              <button onClick={() => exportResults('html')} style={{ width: 'auto' }}>Export HTML</button>
              <button onClick={() => exportResults('pdf')} style={{ width: 'auto' }}>Export PDF</button>
            </div>
          </div>

          {charts.statsChart && (
            <div className="chart-container" style={{ margin: '20px 0', background: 'white', padding: '20px', borderRadius: '8px' }}>
              <h4>Statistical Overview (Mean per column)</h4>
              <div style={{ height: '300px' }}>
                <Bar data={charts.statsChart} options={{ maintainAspectRatio: false }} />
              </div>
            </div>
          )}

          <div className="results-details">
            <div className="result-card">
              <h4>Basic Statistics</h4>
              <pre>{JSON.stringify(results.basic_stats, null, 2)}</pre>
            </div>
            
            <div className="result-card">
              <h4>Correlation Analysis</h4>
              <pre>{JSON.stringify(results.correlation, null, 2)}</pre>
            </div>
            
            {results.predictions && (
              <div className="result-card">
                <h4>Predictive Modeling</h4>
                <pre>{JSON.stringify(results.predictions, null, 2)}</pre>
              </div>
            )}
            
            {results.alerts && (
              <div className="result-card alert-card">
                <h4>Alerts Detected</h4>
                <pre>{JSON.stringify(results.alerts, null, 2)}</pre>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default AnalysisForm;

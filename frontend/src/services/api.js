import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptors for Authentication
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = localStorage.getItem('refresh_token');
        const res = await axios.post(`${API_BASE_URL}/auth/refresh`, { refresh_token: refreshToken });
        localStorage.setItem('access_token', res.data.access_token);
        originalRequest.headers.Authorization = `Bearer ${res.data.access_token}`;
        return api(originalRequest);
      } catch (err) {
        localStorage.clear();
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// --- API Service Hub ---

export const ApiService = {
  // 1. Authentication
  auth: {
    register: (data) => api.post('/auth/register', data),
    login: (username, password) => api.post('/auth/login', null, { params: { username, password } }),
    refresh: (token) => api.post('/auth/refresh', { refresh_token: token }),
  },

  // 2. Core Analysis
  analysis: {
    basic: (file) => uploadFile('/analysis/basic', file),
    correlation: (file) => uploadFile('/analysis/correlation', file),
    distribution: (file) => uploadFile('/analysis/distribution', file),
    predictive: (file, target, type) => uploadFile('/analysis/predictive', file, { target_column: target, model_type: type }),
    outliers: (file, method) => uploadFile('/analysis/outliers', file, { method }),
    complete: (file, format) => uploadFile('/analysis/complete', file, { report_format: format }),
    comprehensive: (file, options) => uploadFile('/analysis/comprehensive', file, options),
  },

  // 3. Advanced Features
  advanced: {
    anomalyDetection: (file) => uploadFile('/analysis/anomaly-detection', file),
    multiFormat: (file) => uploadFile('/analysis/multi-format', file),
    exportMultiple: (data) => api.post('/analysis/export-multiple', data),
    configureAlerts: (config) => api.post('/analysis/configure-alerts', config),
    getCacheStats: () => api.get('/analysis/cache-stats'),
    clearCache: () => api.delete('/analysis/cache-clear'),
  },

  // 4. Data Quality
  quality: {
    validate: (file) => uploadFile('/quality/validate', file),
    profile: (file) => uploadFile('/quality/profile', file),
  },

  // 5. Job Scheduling
  jobs: {
    list: () => api.get('/jobs'),
    get: (id) => api.get(`/jobs/${id}`),
    scheduleAnalysis: (data) => api.post('/jobs/schedule-analysis', data),
    scheduleReport: (data) => api.post('/jobs/schedule-report', data),
    pause: (id) => api.put(`/jobs/${id}/pause`),
    resume: (id) => api.put(`/jobs/${id}/resume`),
    delete: (id) => api.delete(`/jobs/${id}`),
    history: (id) => api.get(`/jobs/${id}/history`),
    stats: () => api.get('/jobs/stats'),
  },

  // 6. Data Transformation (ETL)
  transform: {
    filter: (data) => api.post('/transform/filter', data),
    aggregate: (data) => api.post('/transform/aggregate', data),
    normalize: (data) => api.post('/transform/normalize', data),
    pipeline: (data) => api.post('/transform/pipeline', data),
  },

  // 7. Time Series
  timeseries: {
    analyze: (file) => uploadFile('/timeseries/analyze', file),
    forecast: (file) => uploadFile('/timeseries/forecast', file),
    getComprehensive: (id) => api.get(`/timeseries/comprehensive-analysis/${id}`),
  },

  // 8. Feature Engineering
  engineering: {
    compute: (data) => api.post('/engineering/compute', data),
    getStats: (column) => api.get(`/engineering/stats/${column}`),
    listNodes: () => api.get('/engineering/nodes'),
  },

  // 9. Monitoring
  monitoring: {
    health: () => api.get('/monitoring/health'),
    endpoints: () => api.get('/monitoring/endpoints'),
    userPerformance: (id) => api.get(`/monitoring/users/${id}`),
    topEndpoints: () => api.get('/monitoring/top-endpoints'),
    report: () => api.get('/monitoring/report'),
    alerts: () => api.get('/monitoring/alerts'),
    thresholds: (data) => api.put('/monitoring/thresholds', data),
  },

  // 9. Reports & Users
  reports: {
    list: () => api.get('/reports'),
    get: (id) => api.get(`/reports/${id}`),
    delete: (id) => api.delete(`/reports/${id}`),
  },
  users: {
    me: () => api.get('/users/me'),
    update: (data) => api.put('/users/me', data),
  },

  // 10. Billing & Monetization
  billing: {
    getQuotas: () => api.get('/billing/quotas'),
    getSubscription: () => api.get('/billing/subscription'),
    getTransactions: () => api.get('/billing/transactions'),
    upgradePlan: (planId) => api.post('/billing/upgrade', { plan_id: planId }),
    addCredits: (amount) => api.post('/billing/credits/add', { amount }),
  },

  // 11. Help & Support
  support: {
    getArticles: (query) => api.get('/support/articles', { params: { q: query } }),
    getChangelog: () => api.get('/support/changelog'),
    getStatus: () => api.get('/support/status'),
    submitTicket: (data) => api.post('/support/ticket', data),
  },
};

// Helper for multipart/form-data
const uploadFile = (url, file, params = {}) => {
  const formData = new FormData();
  formData.append('file', file);
  return api.post(url, formData, {
    params: params,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export default ApiService;

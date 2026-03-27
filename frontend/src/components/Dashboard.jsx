import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { ApiService } from '../services/api';
import GlassCard from './common/GlassCard';
import AnalysisForm from './AnalysisForm';
import VisualDataTransformation from './VisualDataTransformation';
import SystemSettings from './SystemSettings';
import PredictiveModelTraining from './PredictiveModelTraining';
import ModelBenchmark from './ModelBenchmark';
import AnomalyMonitoring from './AnomalyMonitoring';
import ExperimentTracker from './ExperimentTracker';
import DataQuality from './DataQuality';
import TimeSeriesForecasting from './TimeSeriesForecasting';
import ReportBuilder from './ReportBuilder';
import CorrelationMatrix from './CorrelationMatrix';
import DistributionAnalysis from './DistributionAnalysis';
import JobScheduler from './JobScheduler';
import DataLineage from './DataLineage';
import DatasetVersioning from './DatasetVersioning';
import ModelFairness from './ModelFairness';
import SQLQueryBuilder from './SQLQueryBuilder';
import TeamCollaboration from './TeamCollaboration';
import ModelMarketplace from './ModelMarketplace';
import FeatureEngineeringStudio from './FeatureEngineeringStudio';
import DataExplorerPro from './DataExplorerPro';
import AdvancedDataStats from './AdvancedDataStats';
import HyperparameterOpti from './HyperparameterOpti';
import InferenceMonitoring from './InferenceMonitoring';
import ModelDeploymentWizard from './ModelDeploymentWizard';
import AdvancedSecurity from './AdvancedSecurity';
import AuditLog from './AuditLog';
import OrganizationSettings from './OrganizationSettings';
import UserManagement from './UserManagement';
import AutomatedReportBuilder from './AutomatedReportBuilder';
import AnomalyAlerts from './AnomalyAlerts';
import ModelBenchmarkComparison from './ModelBenchmarkComparison';
import AutoMLFlow from './AutoMLFlow';
import CustomThemeEditor from './CustomThemeEditor';
import SubscriptionManager from './SubscriptionManager';
import HelpCenter from './HelpCenter';
import PlatformUpdates from './PlatformUpdates';
import InsightCopilot from './InsightCopilot';
import { toast } from 'react-toastify';
import { 
  BarChart, 
  Settings, 
  Activity, 
  Shield, 
  Clock, 
  Database, 
  FileText, 
  AlertTriangle,
  Cpu,
  Layers,
  LineChart,
  Target,
  Network,
  LayoutGrid,
  CalendarDays,
  GitBranch,
  History,
  Scale,
  Terminal,
  Users,
  ShoppingBag,
  Library,
  Zap,
  CreditCard,
  Palette,
  HelpCircle,
  Rocket,
  ChevronDown,
  ChevronRight
} from 'lucide-react';

function Dashboard() {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [collapsedGroups, setCollapsedGroups] = useState({});

  const toggleGroup = (groupIdx) => {
    setCollapsedGroups(prev => ({
      ...prev,
      [groupIdx]: !prev[groupIdx]
    }));
  };
  const [stats, setStats] = useState({
    activeJobs: 0,
    totalReports: 0,
    healthStatus: 'Checking...',
    usageMemory: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [jobsRes, reportsRes, healthRes] = await Promise.all([
          ApiService.jobs.stats(),
          ApiService.reports.list(),
          ApiService.monitoring.health()
        ]);
        setStats({
          activeJobs: jobsRes.data.total_active || 0,
          totalReports: reportsRes.data.total || 0,
          healthStatus: healthRes.data.status || 'Offline',
          usageMemory: healthRes.data.memory_usage || 0
        });
      } catch (err) {
        console.error('Failed to fetch stats', err);
      }
    };
    fetchStats();
  }, []);

  const menuGroups = [
    {
      group: "Core Dashboard",
      items: [
        { id: 'overview', label: 'Overview', icon: <Activity size={18} /> }
      ]
    },
    {
      group: "Data Engineering",
      items: [
        { id: 'data-explorer', label: 'Data Explorer', icon: <Database size={18} /> },
        { id: 'quality', label: 'Data Quality', icon: <Database size={18} /> },
        { id: 'analysis', label: 'Transformation', icon: <BarChart size={18} /> },
        { id: 'sql', label: 'SQL Builder', icon: <Terminal size={18} /> },
        { id: 'feature-eng', label: 'Feature Studio', icon: <Cpu size={18} /> },
        { id: 'lineage', label: 'Data Lineage', icon: <GitBranch size={18} /> },
        { id: 'versioning', label: 'Version History', icon: <History size={18} /> },
      ]
    },
    {
      group: "Modeling & AutoML",
      items: [
        { id: 'automl', label: 'AutoML Architect', icon: <Zap size={18} /> },
        { id: 'training', label: 'Model Training', icon: <Layers size={18} /> },
        { id: 'hpo', label: 'Hyperparameter Opti', icon: <Settings size={18} /> },
        { id: 'tracker', label: 'MLflow Tracker', icon: <Clock size={18} /> },
        { id: 'benchmark', label: 'Model Benchmark', icon: <Activity size={18} /> },
        { id: 'fairness', label: 'Fairness (Bias)', icon: <Scale size={18} /> },
      ]
    },
    {
      group: "Deploy & Monitor",
      items: [
        { id: 'deployment', label: 'Deployment Wizard', icon: <Rocket size={18} /> },
        { id: 'inference', label: 'Inference Monitoring', icon: <Activity size={18} /> },
        { id: 'anomaly', label: 'Anomaly Alerts', icon: <AlertTriangle size={18} /> },
        { id: 'monitoring', label: 'Anomaly Alarms', icon: <Shield size={18} /> },
        { id: 'marketplace', label: 'Marketplace', icon: <ShoppingBag size={18} /> },
        { id: 'jobs', label: 'Job Scheduler', icon: <CalendarDays size={18} /> },
      ]
    },
    {
      group: "Analytics & Reports",
      items: [
        { id: 'data-stats', label: 'Advanced Stats', icon: <FileText size={18} /> },
        { id: 'correlation', label: 'Correlations', icon: <Network size={18} /> },
        { id: 'distribution', label: 'Distributions', icon: <LayoutGrid size={18} /> },
        { id: 'timeseries', label: 'Forecasting', icon: <LineChart size={18} /> },
        { id: 'reports', label: 'Report Builder', icon: <FileText size={18} /> },
      ]
    },
    {
      group: "Administration",
      items: [
        { id: 'org-settings', label: 'Organization', icon: <Library size={18} /> },
        { id: 'users', label: 'User Management', icon: <Users size={18} /> },
        { id: 'team', label: 'Team Space', icon: <Users size={18} /> },
        { id: 'security', label: 'Security Center', icon: <Shield size={18} /> },
        { id: 'settings', label: 'Security & API', icon: <Settings size={18} /> },
        { id: 'audit', label: 'Audit Log', icon: <FileText size={18} /> },
        { id: 'billing', label: 'Billing & Quotas', icon: <CreditCard size={18} /> },
        { id: 'theme', label: 'Theme Editor', icon: <Palette size={18} /> },
        { id: 'help', label: 'Help Center', icon: <HelpCircle size={18} /> },
        { id: 'updates', label: 'Changelog', icon: <History size={18} /> },
      ]
    }
  ];

  return (
    <div className="dashboard">
      <nav className="nav-glass">
        <div className="logo">ML ANALYTICS.AI</div>
        <div className="user-menu" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{user?.username}</div>
            <div style={{ color: 'var(--text-secondary)', fontSize: '0.75rem' }}>Pro Account</div>
          </div>
          <button 
            onClick={logout} 
            className="btn-primary" 
            style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}
          >
            Sign Out
          </button>
        </div>
      </nav>

      <div className="dashboard-layout" style={{ display: 'flex', minHeight: 'calc(100vh - 70px)' }}>
        {/* Sidebar Nav */}
        <aside style={{
          width: '260px',
          background: 'rgba(255, 255, 255, 0.02)',
          borderRight: '1px solid var(--glass-border)',
          display: 'flex',
          flexDirection: 'column',
          height: 'calc(100vh - 70px)'
        }}>
          <div style={{ flex: 1, padding: '1.5rem 1rem', overflowY: 'auto' }} className="hide-scrollbar">
            {menuGroups.map((group, groupIdx) => (
            <div key={groupIdx} style={{ marginBottom: '1.5rem' }}>
              <div 
                onClick={() => toggleGroup(groupIdx)}
                style={{ 
                fontSize: '0.65rem', 
                fontWeight: 800, 
                color: collapsedGroups[groupIdx] ? 'rgba(255,255,255,0.4)' : 'var(--text-secondary)', 
                textTransform: 'uppercase', 
                letterSpacing: '0.1em',
                marginBottom: '0.75rem',
                paddingLeft: '0.5rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                cursor: 'pointer',
                transition: 'all 0.2s',
                userSelect: 'none'
              }}>
                {group.group}
                {collapsedGroups[groupIdx] ? <ChevronRight size={14} /> : <ChevronDown size={14} />}
              </div>
              
              <div style={{ 
                  display: collapsedGroups[groupIdx] ? 'none' : 'block',
                  animation: 'fadeIn 0.3s ease-in-out'
              }}>
                {group.items.map(item => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    padding: '0.6rem 1rem',
                    marginBottom: '0.2rem',
                    border: 'none',
                    background: activeTab === item.id ? 'rgba(0, 210, 255, 0.1)' : 'transparent',
                    color: activeTab === item.id ? 'var(--primary-accent)' : 'var(--text-secondary)',
                    borderRadius: '8px',
                    textAlign: 'left',
                    justifyContent: 'flex-start',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    if (activeTab !== item.id) e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
                  }}
                  onMouseLeave={(e) => {
                    if (activeTab !== item.id) e.currentTarget.style.background = 'transparent';
                  }}
                >
                  {item.icon}
                  <span style={{ fontSize: '0.85rem', fontWeight: 500 }}>{item.label}</span>
                </button>
              ))}
              </div>
            </div>
          ))}
          </div>

          <div style={{
            padding: '1.25rem 1rem',
            borderTop: '1px solid rgba(255, 255, 255, 0.05)',
            background: 'rgba(0, 0, 0, 0.1)',
            textAlign: 'center',
            fontSize: '0.7rem',
            color: 'var(--text-secondary)',
            lineHeight: 1.6
          }}>
            <strong style={{ color: 'white', fontSize: '0.8rem', display: 'block', marginBottom: '4px' }}>RiceCloud Ltd</strong>
            <div>ML Analytics AI v5.1</div>
            <div>© {new Date().getFullYear()} Tous droits réservés</div>
            <div style={{ 
                marginTop: '1rem', 
                paddingTop: '0.75rem', 
                borderTop: '1px dashed rgba(255,255,255,0.05)',
                color: 'var(--primary-accent)', 
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
            }}>
                ADMIN EN LIGNE : {user?.username}
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="dashboard-content" style={{ flex: 1, padding: '3rem', background: '#0f172a' }}>
          {activeTab === 'overview' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '2rem' }}>
              <GlassCard title="System Health" status="Active" icon={<Activity />}>
                <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>{stats.healthStatus}</div>
                <div style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', marginTop: '0.5rem' }}>Uptime: 99.9%</div>
              </GlassCard>
              <GlassCard title="Active Jobs" status="Async" icon={<Clock />}>
                <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>{stats.activeJobs}</div>
                <div style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', marginTop: '0.5rem' }}>Scheduled Tasks</div>
              </GlassCard>
              <GlassCard title="Storage Used" status="Local" icon={<Database />}>
                <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>1.2 GB</div>
                <div style={{ width: '100%', height: '4px', background: 'rgba(255, 255, 255, 0.1)', borderRadius: '2px', marginTop: '1rem' }}>
                  <div style={{ width: '35%', height: '100%', background: 'var(--primary-accent)', borderRadius: '2px' }}></div>
                </div>
              </GlassCard>
              <GlassCard title="Anomaly Alerts" status="Realtime" icon={<AlertTriangle />}>
                <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#f59e0b' }}>0</div>
                <div style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', marginTop: '0.5rem' }}>Since last session</div>
              </GlassCard>

              {/* Recent Activity Panel */}
              <div style={{ gridColumn: 'span 3' }}>
                <GlassCard title="Interactive ML Console" icon={<BarChart />}>
                  <div style={{ height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px dashed var(--glass-border)', borderRadius: '12px' }}>
                    <div style={{ textAlign: 'center' }}>
                      <Activity size={48} color="rgba(255, 255, 255, 0.1)" />
                      <div style={{ marginTop: '1rem', color: 'var(--text-secondary)' }}>Live Graph Interaction Placeholder</div>
                    </div>
                  </div>
                </GlassCard>
              </div>

              <div style={{ gridColumn: 'span 1' }}>
                <GlassCard title="Security Status" icon={<Shield />}>
                  <div style={{ borderLeft: '3px solid #10b981', paddingLeft: '1rem', marginBottom: '1.5rem' }}>
                    <div style={{ fontWeight: 600 }}>JWT Protection</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Session encrypted via AES-256</div>
                  </div>
                  <div style={{ borderLeft: '3px solid #10b981', paddingLeft: '1rem' }}>
                    <div style={{ fontWeight: 600 }}>CORS Enabled</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Secure origin validation active</div>
                  </div>
                  <button className="btn-primary" style={{ width: '100%', marginTop: '2rem', padding: '0.6rem' }}>View Audit Logs</button>
                </GlassCard>
              </div>
            </div>
          )}

          {activeTab === 'feature-eng' && <FeatureEngineeringStudio />}
          {activeTab === 'data-explorer' && <DataExplorerPro />}
          {activeTab === 'data-stats' && <AdvancedDataStats />}
          {activeTab === 'hpo' && <HyperparameterOpti />}
          {activeTab === 'inference' && <InferenceMonitoring />}
          {activeTab === 'deployment' && <ModelDeploymentWizard />}
          {activeTab === 'security' && <AdvancedSecurity />}
          {activeTab === 'audit' && <AuditLog />}
          {activeTab === 'org-settings' && <OrganizationSettings />}
          {activeTab === 'users' && <UserManagement />}
          {activeTab === 'reports' && <AutomatedReportBuilder />}
          {activeTab === 'anomaly' && <AnomalyAlerts />}
          {activeTab === 'benchmark' && <ModelBenchmarkComparison />}
          {activeTab === 'automl' && <AutoMLFlow />}
          {activeTab === 'billing' && <SubscriptionManager />}
          {activeTab === 'theme' && <CustomThemeEditor />}
          {activeTab === 'help' && <HelpCenter />}
          {activeTab === 'updates' && <PlatformUpdates />}
          {activeTab === 'analysis' && <VisualDataTransformation />}
          {activeTab === 'sql' && <SQLQueryBuilder />}
          {activeTab === 'lineage' && <DataLineage />}
          {activeTab === 'versioning' && <DatasetVersioning />}
          {activeTab === 'correlation' && <CorrelationMatrix />}
          {activeTab === 'distribution' && <DistributionAnalysis />}
          {activeTab === 'training' && <PredictiveModelTraining />}
          {activeTab === 'fairness' && <ModelFairness />}
          {activeTab === 'timeseries' && <TimeSeriesForecasting />}
          {activeTab === 'quality' && <DataQuality />}
          {activeTab === 'jobs' && <JobScheduler />}
          {activeTab === 'team' && <TeamCollaboration />}
          {activeTab === 'marketplace' && <ModelMarketplace />}
          {activeTab === 'tracker' && <ExperimentTracker />}
          {activeTab === 'monitoring' && <AnomalyMonitoring />}
          {activeTab === 'settings' && <SystemSettings />}
        </main>
      </div>
      <InsightCopilot />
    </div>
  );
}

export default Dashboard;

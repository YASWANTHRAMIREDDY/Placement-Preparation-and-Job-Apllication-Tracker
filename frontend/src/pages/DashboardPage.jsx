import React, { useState, useEffect } from 'react';
import { dashboardApi } from '../api/client';
import { useAuth } from '../context/AuthContext';
import { ReadinessScoreCard } from '../components/dashboard/ReadinessScoreCard';
import { PipelineFunnel } from '../components/dashboard/PipelineFunnel';
import { PrepMetricsGrid } from '../components/dashboard/PrepMetricsGrid';
import { UpcomingEventsList } from '../components/dashboard/UpcomingEventsList';
import { RefreshCw } from 'lucide-react';

export const DashboardPage = ({ onNavigate }) => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchStats = async () => {
    try {
      const res = await dashboardApi.getStats();
      setStats(res.data);
    } catch (err) {
      console.error('Failed to load dashboard statistics:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchStats();
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[500px] text-slate-500">
        <RefreshCw className="w-8 h-8 animate-spin mb-3 text-indigo-500" />
        <p className="text-sm">Calculating placement analytics and syllabus progress...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Welcome back, {user?.full_name?.split(' ')[0] || 'Student'}! 👋
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Here is your daily placement readiness overview and recruitment funnel.
          </p>
        </div>

        <button
          onClick={handleRefresh}
          className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 transition"
          title="Refresh statistics"
        >
          <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* 1. Placement Readiness Index */}
      <ReadinessScoreCard score={stats?.placement_readiness_score || 0} user={user} />

      {/* 2. Preparation Metrics Across Subjects */}
      <div>
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-3">
          Preparation Milestones
        </h3>
        <PrepMetricsGrid stats={stats} onNavigate={onNavigate} />
      </div>

      {/* 3. Recruitment Pipeline Funnel & Upcoming Interviews */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <PipelineFunnel stats={stats} />
        </div>
        <div>
          <UpcomingEventsList
            events={stats?.upcoming_events}
            onNavigateToApplications={() => onNavigate('applications')}
          />
        </div>
      </div>
    </div>
  );
};

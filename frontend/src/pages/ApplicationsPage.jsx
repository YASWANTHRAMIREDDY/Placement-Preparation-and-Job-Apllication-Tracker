import React, { useState, useEffect } from 'react';
import { applicationsApi } from '../api/client';
import { ApplicationTable } from '../components/applications/ApplicationTable';
import { ApplicationKanban } from '../components/applications/ApplicationKanban';
import { ApplicationModal } from '../components/applications/ApplicationModal';
import {
  Briefcase,
  Plus,
  Search,
  LayoutList,
  Kanban,
  Filter,
  Download,
} from 'lucide-react';

export const ApplicationsPage = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('table'); // 'table' | 'kanban'
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedApp, setSelectedApp] = useState(null);

  const fetchApps = async () => {
    try {
      setLoading(true);
      const res = await applicationsApi.getAll({
        search: searchQuery || null,
        status: statusFilter === 'All' ? null : statusFilter,
      });
      setApplications(res.data);
    } catch (err) {
      console.error('Failed to load applications:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApps();
  }, [searchQuery, statusFilter]);

  const handleCreateOrUpdate = async (formData) => {
    try {
      if (selectedApp) {
        await applicationsApi.update(selectedApp.id, formData);
      } else {
        await applicationsApi.create(formData);
      }
      setIsModalOpen(false);
      setSelectedApp(null);
      fetchApps();
    } catch (err) {
      console.error('Failed to save application:', err);
      alert('Failed to save application. Please verify details.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to remove this job application?')) return;
    try {
      await applicationsApi.delete(id);
      setApplications((prev) => prev.filter((a) => a.id !== id));
    } catch (err) {
      console.error('Failed to delete application:', err);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await applicationsApi.update(id, { status: newStatus });
      setApplications((prev) =>
        prev.map((a) => (a.id === id ? { ...a, status: newStatus } : a))
      );
    } catch (err) {
      console.error('Failed to update stage:', err);
    }
  };

  const openNewModal = () => {
    setSelectedApp(null);
    setIsModalOpen(true);
  };

  const openEditModal = (app) => {
    setSelectedApp(app);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <Briefcase className="w-6 h-6 text-indigo-400" />
            <span>Job Application Tracker</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Keep track of campus and off-campus recruitment pipelines, OA links, and interview stages.
          </p>
        </div>

        <button
          onClick={openNewModal}
          className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 transition"
        >
          <Plus className="w-4 h-4" />
          <span>New Application</span>
        </button>
      </div>

      {/* Filter and View Toggle Toolbar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex flex-1 items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 max-w-sm">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search company or role..."
              className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-10 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-indigo-500"
          >
            <option value="All">All Stages</option>
            <option value="Applied">Applied</option>
            <option value="Online Assessment">Online Assessment</option>
            <option value="Tech Round 1">Tech Round 1</option>
            <option value="Tech Round 2">Tech Round 2</option>
            <option value="HR Round">HR Round</option>
            <option value="Offered">Offered</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>

        {/* View Switcher: Table vs Kanban */}
        <div className="flex items-center gap-1 bg-slate-950 border border-slate-800 p-1 rounded-xl self-end md:self-auto">
          <button
            onClick={() => setViewMode('table')}
            className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
              viewMode === 'table'
                ? 'bg-indigo-600 text-white shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <LayoutList className="w-4 h-4" />
            <span className="hidden sm:inline">Table</span>
          </button>
          <button
            onClick={() => setViewMode('kanban')}
            className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
              viewMode === 'kanban'
                ? 'bg-indigo-600 text-white shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Kanban className="w-4 h-4" />
            <span className="hidden sm:inline">Kanban</span>
          </button>
        </div>
      </div>

      {/* Content Rendering */}
      {loading ? (
        <div className="text-center py-16 text-slate-500 text-sm">Loading applications...</div>
      ) : viewMode === 'table' ? (
        <ApplicationTable
          applications={applications}
          onEdit={openEditModal}
          onDelete={handleDelete}
        />
      ) : (
        <ApplicationKanban
          applications={applications}
          onEdit={openEditModal}
          onDelete={handleDelete}
          onStatusChange={handleStatusChange}
        />
      )}

      {/* Modal Dialog */}
      <ApplicationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleCreateOrUpdate}
        application={selectedApp}
      />
    </div>
  );
};

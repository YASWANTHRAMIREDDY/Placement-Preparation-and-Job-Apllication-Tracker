import React from 'react';
import { StatusBadge } from '../common/Badge';
import { ExternalLink, Edit2, Trash2, Calendar, MapPin, DollarSign } from 'lucide-react';

export const ApplicationTable = ({ applications, onEdit, onDelete }) => {
  const formatDate = (isoString) => {
    if (!isoString) return '—';
    const date = new Date(isoString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  if (!applications || applications.length === 0) {
    return (
      <div className="text-center py-16 bg-slate-900 border border-slate-800 rounded-2xl">
        <p className="text-base text-slate-300 font-semibold">No applications found</p>
        <p className="text-xs text-slate-500 mt-1">Add your first job application using the button above</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900 shadow-xl shadow-slate-950/40">
      <table className="w-full text-left text-sm text-slate-300">
        <thead className="bg-slate-950/70 text-[11px] uppercase tracking-wider text-slate-400 font-bold border-b border-slate-800">
          <tr>
            <th className="px-6 py-3.5">Company & Role</th>
            <th className="px-6 py-3.5">Type & Location</th>
            <th className="px-6 py-3.5">Package / CTC</th>
            <th className="px-6 py-3.5">Stage</th>
            <th className="px-6 py-3.5">Interview / Deadline</th>
            <th className="px-6 py-3.5 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800/60">
          {applications.map((app) => (
            <tr key={app.id} className="hover:bg-slate-800/40 transition">
              <td className="px-6 py-4">
                <div className="font-bold text-white flex items-center gap-2">
                  <span>{app.company_name}</span>
                  {app.job_url && (
                    <a
                      href={app.job_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-slate-500 hover:text-indigo-400 transition"
                      title="Open job link"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
                <div className="text-xs text-slate-400">{app.role_title}</div>
              </td>

              <td className="px-6 py-4">
                <span className="inline-block px-2 py-0.5 rounded text-[11px] font-medium bg-slate-800 text-slate-300 border border-slate-700/60">
                  {app.job_type}
                </span>
                <div className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-slate-500" />
                  <span>{app.location || 'Remote'}</span>
                </div>
              </td>

              <td className="px-6 py-4 font-mono text-xs font-semibold text-emerald-400">
                {app.ctc_or_stipend || '—'}
              </td>

              <td className="px-6 py-4">
                <StatusBadge status={app.status} />
              </td>

              <td className="px-6 py-4 text-xs">
                {app.next_interview_date ? (
                  <div className="text-purple-300 font-medium flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-purple-400" />
                    <span>Int: {formatDate(app.next_interview_date)}</span>
                  </div>
                ) : app.deadline ? (
                  <div className="text-amber-300 font-medium flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-amber-400" />
                    <span>Due: {formatDate(app.deadline)}</span>
                  </div>
                ) : (
                  <span className="text-slate-500">Applied: {formatDate(app.application_date)}</span>
                )}
              </td>

              <td className="px-6 py-4 text-right space-x-1 whitespace-nowrap">
                <button
                  onClick={() => onEdit(app)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-400 hover:bg-slate-800 transition"
                  title="Edit"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onDelete(app.id)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

import React from 'react';
import { StatusBadge } from '../common/Badge';
import { ExternalLink, Edit2, Trash2, Calendar, MapPin } from 'lucide-react';

export const ApplicationKanban = ({ applications, onEdit, onDelete, onStatusChange }) => {
  const columns = [
    {
      id: 'applied',
      title: 'Applied',
      filter: (app) => app.status === 'Applied',
      color: 'border-blue-500/40 bg-blue-500/5',
    },
    {
      id: 'oa',
      title: 'Online Assessment',
      filter: (app) => app.status === 'Online Assessment' || app.status === 'OA',
      color: 'border-amber-500/40 bg-amber-500/5',
    },
    {
      id: 'interview',
      title: 'Interview Rounds',
      filter: (app) =>
        app.status === 'Tech Round 1' ||
        app.status === 'Tech Round 2' ||
        app.status === 'HR Round',
      color: 'border-purple-500/40 bg-purple-500/5',
    },
    {
      id: 'decision',
      title: 'Offers & Final Decisions',
      filter: (app) =>
        app.status === 'Offered' || app.status === 'Rejected' || app.status === 'Withdrawn',
      color: 'border-emerald-500/40 bg-emerald-500/5',
    },
  ];

  const statusOptions = [
    'Applied',
    'Online Assessment',
    'Tech Round 1',
    'Tech Round 2',
    'HR Round',
    'Offered',
    'Rejected',
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-start">
      {columns.map((col) => {
        const colApps = applications.filter(col.filter);
        return (
          <div
            key={col.id}
            className={`rounded-2xl border p-4 bg-slate-900/90 ${col.color} flex flex-col min-h-[500px]`}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
              <h4 className="font-bold text-sm text-white">{col.title}</h4>
              <span className="w-6 h-6 rounded-full bg-slate-800 text-slate-300 text-xs font-mono font-bold flex items-center justify-center">
                {colApps.length}
              </span>
            </div>

            <div className="space-y-3 flex-1 overflow-y-auto">
              {colApps.map((app) => (
                <div
                  key={app.id}
                  className="bg-slate-950/80 border border-slate-800/90 rounded-xl p-3.5 shadow-md hover:border-slate-700 transition"
                >
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <h5 className="font-bold text-white text-sm">{app.company_name}</h5>
                    <StatusBadge status={app.status} />
                  </div>

                  <p className="text-xs text-slate-400 mb-2">{app.role_title}</p>

                  <div className="flex items-center justify-between text-xs text-slate-400 font-mono mb-2">
                    <span className="text-emerald-400 font-semibold">{app.ctc_or_stipend || '—'}</span>
                    <span className="text-[11px] text-slate-500">{app.job_type}</span>
                  </div>

                  {app.next_interview_date && (
                    <div className="bg-purple-950/40 border border-purple-800/40 rounded-lg p-2 text-[11px] text-purple-300 flex items-center gap-1.5 mb-2.5">
                      <Calendar className="w-3.5 h-3.5 text-purple-400" />
                      <span>{new Date(app.next_interview_date).toLocaleDateString()}</span>
                    </div>
                  )}

                  {/* Stage Mover & Card Actions */}
                  <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between gap-1">
                    <select
                      value={app.status}
                      onChange={(e) => onStatusChange(app.id, e.target.value)}
                      className="bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-[11px] text-slate-300 focus:outline-none focus:border-indigo-500"
                    >
                      {statusOptions.map((opt) => (
                        <option key={opt} value={opt}>
                          Move: {opt}
                        </option>
                      ))}
                    </select>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => onEdit(app)}
                        className="p-1 text-slate-400 hover:text-indigo-400"
                        title="Edit"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => onDelete(app.id)}
                        className="p-1 text-slate-400 hover:text-rose-400"
                        title="Delete"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {colApps.length === 0 && (
                <div className="h-32 border border-dashed border-slate-800/80 rounded-xl flex items-center justify-center text-xs text-slate-600">
                  No applications in this stage
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

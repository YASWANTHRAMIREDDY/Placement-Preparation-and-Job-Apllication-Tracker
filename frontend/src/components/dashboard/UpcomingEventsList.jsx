import React from 'react';
import { Calendar, Clock, AlertTriangle, CheckCircle2, ChevronRight } from 'lucide-react';
import { StatusBadge } from '../common/Badge';

export const UpcomingEventsList = ({ events = [], onNavigateToApplications }) => {
  const formatDate = (isoString) => {
    if (!isoString) return 'Date TBD';
    const date = new Date(isoString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl shadow-slate-950/40">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
            <Calendar className="w-5 h-5 text-indigo-400" />
            <span>Interview Schedule & Deadlines</span>
          </h3>
          <p className="text-xs text-slate-400">Critical upcoming milestones requiring preparation</p>
        </div>
        <button
          onClick={onNavigateToApplications}
          className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition"
        >
          <span>View All</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {events.length === 0 ? (
        <div className="py-8 text-center bg-slate-950/40 rounded-xl border border-slate-800/60">
          <Clock className="w-8 h-8 text-slate-600 mx-auto mb-2" />
          <p className="text-sm font-medium text-slate-300">No imminent deadlines or interviews</p>
          <p className="text-xs text-slate-500 mt-1">Add interview rounds and deadlines in the Application Tracker</p>
        </div>
      ) : (
        <div className="space-y-3">
          {events.map((ev, idx) => {
            const isInterview = ev.event_type === 'Interview';
            return (
              <div
                key={`${ev.id}-${idx}`}
                className="flex items-center justify-between p-3.5 bg-slate-950/50 border border-slate-800/80 rounded-xl hover:border-slate-700 transition"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xs ${
                      isInterview
                        ? 'bg-purple-500/10 text-purple-400 border border-purple-500/30'
                        : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                    }`}
                  >
                    {isInterview ? 'INT' : 'DUE'}
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-white flex items-center gap-2">
                      {ev.company_name}
                      <span className="text-xs font-normal text-slate-400">• {ev.role_title}</span>
                    </h4>
                    <p className="text-xs text-indigo-300 flex items-center gap-1 mt-0.5">
                      <Clock className="w-3 h-3" />
                      <span>{formatDate(ev.event_date)}</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <StatusBadge status={ev.status} />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

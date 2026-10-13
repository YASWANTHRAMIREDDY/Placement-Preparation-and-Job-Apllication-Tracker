import React from 'react';
import { Send, FileCode2, Users, CheckCircle2, XCircle, TrendingUp } from 'lucide-react';

export const PipelineFunnel = ({ stats }) => {
  const {
    total_applications = 0,
    applied_count = 0,
    oa_count = 0,
    interviewing_count = 0,
    offered_count = 0,
    rejected_count = 0,
  } = stats || {};

  const conversionRate = total_applications > 0
    ? ((offered_count / total_applications) * 100).toFixed(1)
    : 0.0;

  const stages = [
    { label: 'Applied', count: applied_count, icon: Send, color: 'text-blue-400 bg-blue-500/10 border-blue-500/30' },
    { label: 'Online Test', count: oa_count, icon: FileCode2, color: 'text-amber-400 bg-amber-500/10 border-amber-500/30' },
    { label: 'Interviews', count: interviewing_count, icon: Users, color: 'text-purple-400 bg-purple-500/10 border-purple-500/30' },
    { label: 'Offers', count: offered_count, icon: CheckCircle2, color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30' },
    { label: 'Archived / Rejected', count: rejected_count, icon: XCircle, color: 'text-rose-400 bg-rose-500/10 border-rose-500/30' },
  ];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl shadow-slate-950/40">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-bold text-white tracking-tight">Application Pipeline</h3>
          <p className="text-xs text-slate-400">Current status across all campus & off-campus opportunities</p>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-xs font-semibold text-emerald-400">
          <TrendingUp className="w-3.5 h-3.5" />
          <span>{conversionRate}% Offer Rate</span>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 mt-4">
        {stages.map((stage) => {
          const Icon = stage.icon;
          return (
            <div
              key={stage.label}
              className="bg-slate-950/60 border border-slate-800 rounded-xl p-4 flex flex-col justify-between hover:border-slate-700 transition"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-slate-400">{stage.label}</span>
                <div className={`p-1.5 rounded-lg border ${stage.color}`}>
                  <Icon className="w-3.5 h-3.5" />
                </div>
              </div>
              <div className="text-2xl font-black text-white font-mono">{stage.count}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

import React from 'react';
import { Award, Zap, ShieldCheck, Target } from 'lucide-react';

export const ReadinessScoreCard = ({ score = 0, user }) => {
  let statusText = 'Getting Started';
  let badgeColor = 'text-amber-400 bg-amber-500/10 border-amber-500/30';
  let gradientColor = 'from-amber-500 to-amber-600';

  if (score >= 80) {
    statusText = 'Placement Ready';
    badgeColor = 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30';
    gradientColor = 'from-emerald-500 to-teal-500';
  } else if (score >= 50) {
    statusText = 'On Track & Competitive';
    badgeColor = 'text-indigo-400 bg-indigo-500/10 border-indigo-500/30';
    gradientColor = 'from-indigo-500 to-indigo-600';
  } else if (score >= 25) {
    statusText = 'Accelerating Prep';
    badgeColor = 'text-blue-400 bg-blue-500/10 border-blue-500/30';
    gradientColor = 'from-blue-500 to-indigo-500';
  }

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 relative overflow-hidden shadow-xl shadow-slate-950/50">
      <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${badgeColor} inline-flex items-center gap-1`}>
              <Zap className="w-3 h-3" />
              {statusText}
            </span>
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Placement Readiness Index</h2>
          <p className="text-xs text-slate-400 max-w-md mt-1">
            Comprehensive benchmark calculated across Data Structures (40%), Core CS Engineering (25%), SQL Queries (20%), and Aptitude (15%).
          </p>
        </div>

        {/* Big Score Indicator */}
        <div className="flex items-center gap-4 bg-slate-950/60 border border-slate-800/80 rounded-2xl p-4 px-6">
          <div className="text-right">
            <div className="text-4xl font-extrabold text-white font-mono tracking-tight">
              {score}<span className="text-lg text-slate-500">/100</span>
            </div>
            <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Composite Score
            </div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-indigo-500 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-600/30">
            <ShieldCheck className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Target Role & College Footer */}
      <div className="mt-5 pt-4 border-t border-slate-800/80 flex flex-wrap items-center justify-between text-xs text-slate-400 gap-2">
        <div className="flex items-center gap-2">
          <Target className="w-4 h-4 text-indigo-400" />
          <span>Targeting: <strong className="text-white font-semibold">{user?.target_role || 'SDE 1'}</strong></span>
        </div>
        {user?.college && (
          <div className="text-slate-400">
            {user.college} {user.graduation_year ? `• Class of ${user.graduation_year}` : ''}
          </div>
        )}
      </div>
    </div>
  );
};

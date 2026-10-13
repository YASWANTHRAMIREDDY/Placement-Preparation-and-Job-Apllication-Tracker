import React from 'react';

export const StatusBadge = ({ status }) => {
  let style = 'bg-slate-700 text-slate-300 border-slate-600';

  if (!status) return null;

  switch (status.toLowerCase()) {
    case 'applied':
      style = 'bg-blue-900/40 text-blue-300 border-blue-600/50';
      break;
    case 'online assessment':
    case 'oa':
      style = 'bg-amber-900/40 text-amber-300 border-amber-600/50';
      break;
    case 'tech round 1':
    case 'tech round 2':
    case 'technical round':
    case 'interview':
      style = 'bg-purple-900/40 text-purple-300 border-purple-600/50';
      break;
    case 'hr round':
      style = 'bg-indigo-900/40 text-indigo-300 border-indigo-600/50';
      break;
    case 'offered':
      style = 'bg-emerald-900/40 text-emerald-300 border-emerald-500/50 shadow-sm shadow-emerald-900/20';
      break;
    case 'rejected':
      style = 'bg-rose-900/40 text-rose-300 border-rose-600/50';
      break;
    case 'withdrawn':
      style = 'bg-slate-800 text-slate-400 border-slate-700';
      break;
    default:
      style = 'bg-slate-800 text-slate-300 border-slate-700';
  }

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${style}`}
    >
      <span className="w-1.5 h-1.5 rounded-full mr-1.5 bg-current opacity-70"></span>
      {status}
    </span>
  );
};

export const DifficultyBadge = ({ difficulty }) => {
  let style = 'bg-slate-700 text-slate-300';
  switch (difficulty?.toLowerCase()) {
    case 'easy':
      style = 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30';
      break;
    case 'medium':
      style = 'bg-amber-500/10 text-amber-400 border border-amber-500/30';
      break;
    case 'hard':
      style = 'bg-rose-500/10 text-rose-400 border border-rose-500/30';
      break;
    default:
      break;
  }

  return (
    <span className={`px-2 py-0.5 rounded text-xs font-semibold ${style}`}>
      {difficulty}
    </span>
  );
};

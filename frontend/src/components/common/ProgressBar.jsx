import React from 'react';

export const ProgressBar = ({ percentage = 0, color = 'indigo', showLabel = true, height = 'h-2' }) => {
  const clampedPct = Math.min(100, Math.max(0, Math.round(percentage)));

  const colorClasses = {
    indigo: 'bg-indigo-500',
    emerald: 'bg-emerald-500',
    amber: 'bg-amber-500',
    blue: 'bg-blue-500',
    purple: 'bg-purple-500',
  };

  const barColor = colorClasses[color] || colorClasses.indigo;

  return (
    <div className="w-full">
      <div className={`w-full bg-slate-800 rounded-full overflow-hidden ${height} border border-slate-700/50`}>
        <div
          className={`${barColor} ${height} rounded-full transition-all duration-500 ease-out`}
          style={{ width: `${clampedPct}%` }}
        />
      </div>
      {showLabel && (
        <div className="flex justify-between items-center text-xs text-slate-400 mt-1 font-mono">
          <span>Progress</span>
          <span className="font-semibold text-slate-200">{clampedPct}%</span>
        </div>
      )}
    </div>
  );
};

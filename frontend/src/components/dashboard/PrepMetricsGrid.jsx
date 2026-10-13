import React from 'react';
import { ProgressBar } from '../common/ProgressBar';
import { Code2, Database, BookOpen, BrainCircuit, ArrowRight, RotateCcw } from 'lucide-react';

export const PrepMetricsGrid = ({ stats, onNavigate }) => {
  const {
    dsa_total = 0,
    dsa_solved = 0,
    dsa_needs_revision = 0,
    dsa_percentage = 0,
    sql_total = 0,
    sql_solved = 0,
    sql_percentage = 0,
    aptitude_total = 0,
    aptitude_completed = 0,
    aptitude_percentage = 0,
    core_total = 0,
    core_mastered = 0,
    core_percentage = 0,
  } = stats || {};

  const cards = [
    {
      id: 'prep_dsa',
      title: 'Data Structures & Algo',
      category: '40% Weightage',
      icon: Code2,
      color: 'indigo',
      solved: dsa_solved,
      total: dsa_total,
      percentage: dsa_percentage,
      extra: dsa_needs_revision > 0 ? `${dsa_needs_revision} Need Revision` : null,
      extraIcon: RotateCcw,
      actionText: 'Open DSA Sheet',
    },
    {
      id: 'prep_sql',
      title: 'SQL & Database Queries',
      category: '20% Weightage',
      icon: Database,
      color: 'blue',
      solved: sql_solved,
      total: sql_total,
      percentage: sql_percentage,
      extra: null,
      actionText: 'Practice SQL',
    },
    {
      id: 'prep_core',
      title: 'Core CS (OS, DBMS, CN)',
      category: '25% Weightage',
      icon: BookOpen,
      color: 'purple',
      solved: core_mastered,
      total: core_total,
      percentage: core_percentage,
      extra: null,
      actionText: 'Revise Core CS',
    },
    {
      id: 'prep_aptitude',
      title: 'Aptitude & Reasoning',
      category: '15% Weightage',
      icon: BrainCircuit,
      color: 'amber',
      solved: aptitude_completed,
      total: aptitude_total,
      percentage: aptitude_percentage,
      extra: null,
      actionText: 'Aptitude Drill',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((c) => {
        const Icon = c.icon;
        return (
          <div
            key={c.id}
            className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between shadow-lg shadow-slate-950/30 hover:border-slate-700 transition group"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="p-2 rounded-xl bg-slate-800 border border-slate-700/60 text-indigo-400 group-hover:scale-105 transition">
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                  {c.category}
                </span>
              </div>

              <h4 className="text-base font-bold text-white mb-1">{c.title}</h4>
              <div className="flex items-baseline gap-1 text-2xl font-black text-white font-mono mb-3">
                {c.solved} <span className="text-sm font-normal text-slate-500">/ {c.total} completed</span>
              </div>

              <ProgressBar percentage={c.percentage} color={c.color} showLabel={true} />

              {c.extra && (
                <div className="mt-3 flex items-center gap-1.5 text-xs text-amber-400/90 font-medium">
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>{c.extra}</span>
                </div>
              )}
            </div>

            <button
              onClick={() => onNavigate(c.id)}
              className="mt-5 w-full py-2 px-3 rounded-xl bg-slate-800/80 hover:bg-indigo-600 text-slate-300 hover:text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-all shadow-sm"
            >
              <span>{c.actionText}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
};

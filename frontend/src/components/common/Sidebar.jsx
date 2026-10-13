import React from 'react';
import {
  LayoutDashboard,
  Briefcase,
  Code2,
  Database,
  BrainCircuit,
  BookOpen,
  User,
  Sparkles,
} from 'lucide-react';

export const Sidebar = ({ activeTab, setActiveTab }) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard & Stats', icon: LayoutDashboard },
    { id: 'applications', label: 'Application Tracker', icon: Briefcase },
    { id: 'prep_dsa', label: 'DSA Problem Sheet', icon: Code2 },
    { id: 'prep_sql', label: 'SQL Query Challenges', icon: Database },
    { id: 'prep_aptitude', label: 'Aptitude & Reasoning', icon: BrainCircuit },
    { id: 'prep_core', label: 'Core CS Subjects', icon: BookOpen },
    { id: 'profile', label: 'Student Profile', icon: User },
  ];

  return (
    <aside className="w-64 border-r border-slate-800 bg-slate-900/60 backdrop-blur min-h-[calc(100vh-4rem)] p-4 flex flex-col justify-between hidden md:flex">
      <div>
        <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-3 mb-2">
          Navigation
        </div>
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/25'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/80'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Pro Placement Tip card */}
      <div className="bg-gradient-to-br from-indigo-950/60 to-slate-900 border border-indigo-500/20 rounded-2xl p-4 text-xs">
        <div className="flex items-center gap-2 text-indigo-400 font-semibold mb-1">
          <Sparkles className="w-4 h-4" />
          <span>Placement Tip</span>
        </div>
        <p className="text-slate-400 leading-relaxed">
          Master 2-3 DSA problems daily and revise OS/DBMS concurrency weekly for highest interview conversion.
        </p>
      </div>
    </aside>
  );
};

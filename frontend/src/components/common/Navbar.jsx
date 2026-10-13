import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { LogOut, User as UserIcon, GraduationCap, Briefcase, Award } from 'lucide-react';

export const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <header className="h-16 border-b border-slate-800 bg-slate-900/90 backdrop-blur sticky top-0 z-30 px-6 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-400 flex items-center justify-center shadow-lg shadow-indigo-600/30">
          <GraduationCap className="w-6 h-6 text-white" />
        </div>
        <div>
          <span className="text-lg font-extrabold tracking-tight text-white flex items-center gap-1.5">
            Placement<span className="text-indigo-400">Tracker</span>
          </span>
          <span className="hidden sm:block text-xs text-slate-400 font-medium">
            Career & Placement Preparation OS
          </span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {user?.target_role && (
          <div className="hidden md:flex items-center gap-2 bg-indigo-950/60 border border-indigo-800/50 px-3 py-1 rounded-full text-xs font-medium text-indigo-300">
            <Briefcase className="w-3.5 h-3.5 text-indigo-400" />
            <span>Target: {user.target_role}</span>
            {user.target_ctc && (
              <span className="ml-1 pl-2 border-l border-indigo-700/60 text-emerald-400 font-bold">
                {user.target_ctc}
              </span>
            )}
          </div>
        )}

        <div className="flex items-center gap-3 pl-2 border-l border-slate-800">
          <div className="flex items-center gap-2.5 text-left">
            <div className="w-8 h-8 rounded-full bg-slate-800 border border-indigo-500/40 flex items-center justify-center text-sm font-bold text-indigo-300">
              {user?.full_name ? user.full_name.charAt(0).toUpperCase() : 'U'}
            </div>
            <div className="hidden sm:block">
              <p className="text-xs font-semibold text-white leading-tight">{user?.full_name || 'Student'}</p>
              <p className="text-[10px] text-slate-400 truncate max-w-[140px]">{user?.college || user?.email}</p>
            </div>
          </div>

          <button
            onClick={logout}
            title="Sign Out"
            className="p-2 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};

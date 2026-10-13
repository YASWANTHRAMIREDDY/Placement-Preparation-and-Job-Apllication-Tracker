import React, { useState, useEffect } from 'react';
import { prepApi } from '../../api/client';
import { DifficultyBadge } from '../common/Badge';
import { Database, CheckCircle2, Eye, EyeOff, Save, ExternalLink } from 'lucide-react';

export const SQLTrackerView = () => {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [revealedQueries, setRevealedQueries] = useState({});
  const [draftQueries, setDraftQueries] = useState({});

  const fetchProblems = async () => {
    try {
      setLoading(true);
      const res = await prepApi.getSQL();
      setProblems(res.data);
      const initialDrafts = {};
      res.data.forEach((p) => {
        initialDrafts[p.id] = p.user_query || '';
      });
      setDraftQueries(initialDrafts);
    } catch (err) {
      console.error('Failed to load SQL problems:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProblems();
  }, []);

  const toggleReveal = (id) => {
    setRevealedQueries((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleStatusToggle = async (problem) => {
    const nextStatus = problem.status === 'Solved' ? 'Todo' : 'Solved';
    try {
      await prepApi.updateSQLProgress(problem.id, { status: nextStatus });
      setProblems((prev) =>
        prev.map((p) => (p.id === problem.id ? { ...p, status: nextStatus } : p))
      );
    } catch (err) {
      console.error('Error updating SQL status:', err);
    }
  };

  const handleSaveQuery = async (problemId) => {
    const query = draftQueries[problemId];
    try {
      await prepApi.updateSQLProgress(problemId, { user_query: query, status: 'Solved' });
      setProblems((prev) =>
        prev.map((p) => (p.id === problemId ? { ...p, user_query: query, status: 'Solved' } : p))
      );
      alert('SQL solution saved successfully!');
    } catch (err) {
      console.error('Error saving user query:', err);
    }
  };

  const total = problems.length;
  const solved = problems.filter((p) => p.status === 'Solved').length;

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl shadow-slate-950/40 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/30 flex items-center gap-1">
              <Database className="w-3.5 h-3.5" />
              SQL Practice Suite
            </span>
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">SQL Query Challenges</h2>
          <p className="text-xs text-slate-400 mt-1">
            Crucial database query questions: Window Functions, Self Joins, CTEs, Aggregations, and Correlated Subqueries.
          </p>
        </div>

        <div className="flex items-center gap-4 bg-slate-950/60 border border-slate-800 rounded-xl px-5 py-3 font-mono">
          <div>
            <div className="text-xs text-slate-400 font-sans font-medium">Challenges Solved</div>
            <div className="text-2xl font-black text-white">
              {solved} <span className="text-sm font-normal text-slate-500">/ {total}</span>
            </div>
          </div>
          <div className="text-right pl-4 border-l border-slate-800">
            <div className="text-xs text-slate-400 font-sans font-medium">Success Rate</div>
            <div className="text-2xl font-black text-blue-400">
              {total > 0 ? Math.round((solved / total) * 100) : 0}%
            </div>
          </div>
        </div>
      </div>

      {/* Questions list */}
      {loading ? (
        <div className="text-center py-16 text-slate-500 text-sm">Loading SQL challenges...</div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {problems.map((prob) => {
            const isSolved = prob.status === 'Solved';
            const isRevealed = !!revealedQueries[prob.id];

            return (
              <div
                key={prob.id}
                className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg shadow-slate-950/30 space-y-3 hover:border-slate-700/80 transition"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <button
                      onClick={() => handleStatusToggle(prob)}
                      className={`mt-0.5 p-1 rounded-lg transition ${
                        isSolved ? 'text-emerald-400 hover:text-emerald-300' : 'text-slate-600 hover:text-slate-400'
                      }`}
                      title={isSolved ? 'Mark as Todo' : 'Mark as Solved'}
                    >
                      <CheckCircle2
                        className={`w-5 h-5 ${isSolved ? 'fill-emerald-500/20 text-emerald-400' : ''}`}
                      />
                    </button>

                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-white text-base">{prob.title}</h4>
                        <DifficultyBadge difficulty={prob.difficulty} />
                        <span className="text-[11px] px-2 py-0.5 rounded bg-slate-800 text-blue-300 border border-slate-700/50">
                          {prob.topic}
                        </span>
                      </div>
                      <p className="text-xs text-slate-300 mt-1 leading-relaxed">{prob.scenario}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {prob.platform_url && (
                      <a
                        href={prob.platform_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
                        title="Practice on LeetCode / HackerRank"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                    <button
                      onClick={() => toggleReveal(prob.id)}
                      className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition flex items-center gap-1.5"
                    >
                      {isRevealed ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      <span>{isRevealed ? 'Hide Solution' : 'Reveal SQL'}</span>
                    </button>
                  </div>
                </div>

                {/* Revealed canonical solution */}
                {isRevealed && (
                  <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs font-mono text-emerald-300">
                    <span className="text-[10px] text-slate-500 uppercase tracking-wider block mb-1 font-sans font-bold">
                      Optimal Canonical Solution:
                    </span>
                    {prob.expected_query}
                  </div>
                )}

                {/* Interactive user query box */}
                <div className="pt-2 border-t border-slate-800/80">
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                      Your Draft Query:
                    </label>
                    <button
                      onClick={() => handleSaveQuery(prob.id)}
                      className="px-2.5 py-1 rounded-lg bg-indigo-600/80 hover:bg-indigo-600 text-white text-[11px] font-semibold flex items-center gap-1 transition"
                    >
                      <Save className="w-3 h-3" />
                      <span>Save & Mark Solved</span>
                    </button>
                  </div>
                  <textarea
                    rows="2"
                    value={draftQueries[prob.id] || ''}
                    onChange={(e) =>
                      setDraftQueries({ ...draftQueries, [prob.id]: e.target.value })
                    }
                    placeholder="SELECT ... FROM ... WHERE ..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs font-mono text-white placeholder-slate-600 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

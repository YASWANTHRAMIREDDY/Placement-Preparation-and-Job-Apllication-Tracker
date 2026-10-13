import React, { useState, useEffect } from 'react';
import { prepApi } from '../../api/client';
import { DifficultyBadge } from '../common/Badge';
import { Modal } from '../common/Modal';
import {
  Code2,
  CheckCircle2,
  Bookmark,
  ExternalLink,
  ChevronDown,
  ChevronRight,
  Filter,
  FileEdit,
  Sparkles,
  Clock,
} from 'lucide-react';

export const DSATrackerView = () => {
  const [topicGroups, setTopicGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [difficultyFilter, setDifficultyFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [openTopics, setOpenTopics] = useState({});
  const [activeNotesProblem, setActiveNotesProblem] = useState(null);
  const [notesContent, setNotesContent] = useState('');

  const fetchProblems = async () => {
    try {
      setLoading(true);
      const res = await prepApi.getDSA({
        difficulty: difficultyFilter,
        status_filter: statusFilter,
      });
      setTopicGroups(res.data);
      // Auto expand first 2 topics if none set
      if (Object.keys(openTopics).length === 0 && res.data.length > 0) {
        const initialOpen = {};
        res.data.slice(0, 3).forEach((g) => (initialOpen[g.topic] = true));
        setOpenTopics(initialOpen);
      }
    } catch (err) {
      console.error('Failed to fetch DSA problems:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProblems();
  }, [difficultyFilter, statusFilter]);

  const toggleTopic = (topicName) => {
    setOpenTopics((prev) => ({ ...prev, [topicName]: !prev[topicName] }));
  };

  const handleStatusToggle = async (problem) => {
    const nextStatus = problem.status === 'Solved' ? 'Todo' : 'Solved';
    try {
      await prepApi.updateDSAProgress(problem.id, { status: nextStatus });
      // Optimistic update
      setTopicGroups((prevGroups) =>
        prevGroups.map((group) => {
          const updatedProblems = group.problems.map((p) =>
            p.id === problem.id ? { ...p, status: nextStatus } : p
          );
          const solvedCount = updatedProblems.filter((p) => p.status === 'Solved').length;
          return {
            ...group,
            problems: updatedProblems,
            solved_problems: solvedCount,
          };
        })
      );
    } catch (err) {
      console.error('Error toggling DSA problem status:', err);
    }
  };

  const handleRevisionToggle = async (problem) => {
    const nextVal = !problem.needs_revision;
    try {
      await prepApi.updateDSAProgress(problem.id, { needs_revision: nextVal });
      setTopicGroups((prevGroups) =>
        prevGroups.map((group) => ({
          ...group,
          problems: group.problems.map((p) =>
            p.id === problem.id ? { ...p, needs_revision: nextVal } : p
          ),
        }))
      );
    } catch (err) {
      console.error('Error toggling revision flag:', err);
    }
  };

  const openNotes = (problem) => {
    setActiveNotesProblem(problem);
    setNotesContent(problem.notes || '');
  };

  const saveNotes = async () => {
    if (!activeNotesProblem) return;
    try {
      await prepApi.updateDSAProgress(activeNotesProblem.id, { notes: notesContent });
      setTopicGroups((prevGroups) =>
        prevGroups.map((group) => ({
          ...group,
          problems: group.problems.map((p) =>
            p.id === activeNotesProblem.id ? { ...p, notes: notesContent } : p
          ),
        }))
      );
      setActiveNotesProblem(null);
    } catch (err) {
      console.error('Failed to save notes:', err);
    }
  };

  const totalProblems = topicGroups.reduce((acc, g) => acc + g.total_problems, 0);
  const totalSolved = topicGroups.reduce((acc, g) => acc + g.solved_problems, 0);
  const totalPct = totalProblems > 0 ? Math.round((totalSolved / totalProblems) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl shadow-slate-950/40 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 flex items-center gap-1">
              <Code2 className="w-3.5 h-3.5" />
              DSA Question Bank
            </span>
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Data Structures & Algorithms Tracker</h2>
          <p className="text-xs text-slate-400 mt-1">
            Curated high-frequency coding patterns essential for FAANG, Top Tech & Product Companies.
          </p>
        </div>

        <div className="flex items-center gap-4 bg-slate-950/60 border border-slate-800 rounded-xl px-5 py-3 font-mono">
          <div>
            <div className="text-xs text-slate-400 font-sans font-medium">Total Solved</div>
            <div className="text-2xl font-black text-white">
              {totalSolved} <span className="text-sm font-normal text-slate-500">/ {totalProblems}</span>
            </div>
          </div>
          <div className="text-right pl-4 border-l border-slate-800">
            <div className="text-xs text-slate-400 font-sans font-medium">Completion</div>
            <div className="text-2xl font-black text-emerald-400">{totalPct}%</div>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900/60 border border-slate-800/80 p-3 rounded-xl">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
          <Filter className="w-4 h-4" />
          <span>Filters:</span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <select
            value={difficultyFilter}
            onChange={(e) => setDifficultyFilter(e.target.value)}
            className="bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-indigo-500"
          >
            <option value="All">All Difficulties</option>
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-indigo-500"
          >
            <option value="All">All Statuses</option>
            <option value="Solved">Solved</option>
            <option value="Todo">Todo (Unsolved)</option>
          </select>
        </div>
      </div>

      {/* Topics Accordion List */}
      {loading ? (
        <div className="text-center py-16 text-slate-500 text-sm">Loading DSA patterns...</div>
      ) : (
        <div className="space-y-4">
          {topicGroups.map((group) => {
            const isOpen = !!openTopics[group.topic];
            const groupPct = group.total_problems > 0
              ? Math.round((group.solved_problems / group.total_problems) * 100)
              : 0;

            return (
              <div
                key={group.topic}
                className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-md transition"
              >
                {/* Topic Header Bar */}
                <button
                  onClick={() => toggleTopic(group.topic)}
                  className="w-full flex items-center justify-between p-4 bg-slate-950/40 hover:bg-slate-800/40 transition text-left"
                >
                  <div className="flex items-center gap-3">
                    {isOpen ? (
                      <ChevronDown className="w-4 h-4 text-slate-400" />
                    ) : (
                      <ChevronRight className="w-4 h-4 text-slate-400" />
                    )}
                    <h3 className="font-bold text-base text-white">{group.topic}</h3>
                    <span className="text-xs font-mono text-slate-400">
                      ({group.solved_problems}/{group.total_problems} Solved)
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-24 bg-slate-800 rounded-full h-1.5 overflow-hidden hidden sm:block">
                      <div
                        className="bg-indigo-500 h-1.5 rounded-full"
                        style={{ width: `${groupPct}%` }}
                      />
                    </div>
                    <span className="text-xs font-mono font-bold text-slate-300 min-w-[32px] text-right">
                      {groupPct}%
                    </span>
                  </div>
                </button>

                {/* Problem Items */}
                {isOpen && (
                  <div className="divide-y divide-slate-800/60 p-2">
                    {group.problems.map((prob) => {
                      const isSolved = prob.status === 'Solved';
                      return (
                        <div
                          key={prob.id}
                          className={`flex items-center justify-between p-3 rounded-xl transition ${
                            isSolved ? 'bg-emerald-950/10' : 'hover:bg-slate-800/30'
                          }`}
                        >
                          <div className="flex items-center gap-3 flex-1">
                            <button
                              onClick={() => handleStatusToggle(prob)}
                              title={isSolved ? 'Mark as Todo' : 'Mark as Solved'}
                              className={`p-1 rounded-lg transition ${
                                isSolved
                                  ? 'text-emerald-400 hover:text-emerald-300'
                                  : 'text-slate-600 hover:text-slate-400'
                              }`}
                            >
                              <CheckCircle2
                                className={`w-5 h-5 ${
                                  isSolved ? 'fill-emerald-500/20 text-emerald-400' : ''
                                }`}
                              />
                            </button>

                            <div>
                              <div className="flex items-center gap-2">
                                <span
                                  className={`text-sm font-semibold ${
                                    isSolved ? 'text-slate-300 line-through opacity-75' : 'text-white'
                                  }`}
                                >
                                  {prob.title}
                                </span>
                                <DifficultyBadge difficulty={prob.difficulty} />
                                {prob.pattern && (
                                  <span className="hidden md:inline-block text-[11px] px-2 py-0.5 rounded bg-slate-800 text-indigo-300 border border-slate-700/50">
                                    {prob.pattern}
                                  </span>
                                )}
                              </div>
                              {prob.notes && (
                                <p className="text-xs text-slate-400 mt-0.5 line-clamp-1 italic">
                                  Note: {prob.notes}
                                </p>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center gap-2 pl-3">
                            <button
                              onClick={() => handleRevisionToggle(prob)}
                              title={prob.needs_revision ? 'Remove from revision' : 'Mark for revision'}
                              className={`p-1.5 rounded-lg transition ${
                                prob.needs_revision
                                  ? 'text-amber-400 bg-amber-500/10'
                                  : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800'
                              }`}
                            >
                              <Bookmark className="w-4 h-4" />
                            </button>

                            <button
                              onClick={() => openNotes(prob)}
                              title="Add / View Notes"
                              className="p-1.5 rounded-lg text-slate-500 hover:text-indigo-400 hover:bg-slate-800 transition"
                            >
                              <FileEdit className="w-4 h-4" />
                            </button>

                            {prob.leetcode_url && (
                              <a
                                href={prob.leetcode_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                title="Solve on LeetCode"
                                className="p-1.5 rounded-lg text-slate-500 hover:text-white hover:bg-slate-800 transition"
                              >
                                <ExternalLink className="w-4 h-4" />
                              </a>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Problem Notes Modal */}
      <Modal
        isOpen={!!activeNotesProblem}
        onClose={() => setActiveNotesProblem(null)}
        title={`Notes: ${activeNotesProblem?.title || ''}`}
      >
        <div className="space-y-4">
          <p className="text-xs text-slate-400">
            Write down key algorithmic insights, tricky edge cases, and Time & Space complexity analysis.
          </p>
          <textarea
            rows="6"
            value={notesContent}
            onChange={(e) => setNotesContent(e.target.value)}
            placeholder="e.g. Approach: Use Monotonic Stack. Time: O(N), Space: O(N). Watch out for duplicates..."
            className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-sm text-white font-mono placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
          <div className="flex justify-end gap-3">
            <button
              onClick={() => setActiveNotesProblem(null)}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800"
            >
              Cancel
            </button>
            <button
              onClick={saveNotes}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/30"
            >
              Save Notes
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

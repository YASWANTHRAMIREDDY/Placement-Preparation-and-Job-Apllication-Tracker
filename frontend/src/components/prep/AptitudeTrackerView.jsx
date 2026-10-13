import React, { useState, useEffect } from 'react';
import { prepApi } from '../../api/client';
import { BrainCircuit, BookOpen, CheckCircle, Plus, Minus, Calculator } from 'lucide-react';
import { ProgressBar } from '../common/ProgressBar';

export const AptitudeTrackerView = () => {
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');

  const categories = ['All', 'Quantitative Ability', 'Logical Reasoning', 'Verbal Ability'];

  const fetchTopics = async () => {
    try {
      setLoading(true);
      const res = await prepApi.getAptitude({
        category: activeCategory === 'All' ? null : activeCategory,
      });
      setTopics(res.data);
    } catch (err) {
      console.error('Failed to load aptitude topics:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTopics();
  }, [activeCategory]);

  const handleUpdateQuestions = async (topic, delta) => {
    const nextCount = Math.max(
      0,
      Math.min(topic.total_suggested_questions, topic.completed_questions + delta)
    );
    try {
      await prepApi.updateAptitudeProgress(topic.id, { completed_questions: nextCount });
      setTopics((prev) =>
        prev.map((t) => (t.id === topic.id ? { ...t, completed_questions: nextCount } : t))
      );
    } catch (err) {
      console.error('Error updating question count:', err);
    }
  };

  const handleAccuracyChange = async (topic, accuracy) => {
    try {
      const val = parseFloat(accuracy) || 0;
      await prepApi.updateAptitudeProgress(topic.id, { accuracy_percentage: val });
      setTopics((prev) =>
        prev.map((t) => (t.id === topic.id ? { ...t, accuracy_percentage: val } : t))
      );
    } catch (err) {
      console.error('Error updating accuracy:', err);
    }
  };

  const totalQuestionsTarget = topics.reduce((acc, t) => acc + t.total_suggested_questions, 0);
  const totalCompleted = topics.reduce((acc, t) => acc + t.completed_questions, 0);
  const overallPct =
    totalQuestionsTarget > 0 ? Math.round((totalCompleted / totalQuestionsTarget) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl shadow-slate-950/40 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/30 flex items-center gap-1">
              <BrainCircuit className="w-3.5 h-3.5" />
              Aptitude & General Intelligence
            </span>
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Aptitude & Reasoning Mastery</h2>
          <p className="text-xs text-slate-400 mt-1">
            Standard syllabus for campus screening rounds: Quants, Logical Puzzles, and Verbal Comprehension.
          </p>
        </div>

        <div className="flex items-center gap-4 bg-slate-950/60 border border-slate-800 rounded-xl px-5 py-3 font-mono">
          <div>
            <div className="text-xs text-slate-400 font-sans font-medium">Questions Solved</div>
            <div className="text-2xl font-black text-white">
              {totalCompleted} <span className="text-sm font-normal text-slate-500">/ {totalQuestionsTarget}</span>
            </div>
          </div>
          <div className="text-right pl-4 border-l border-slate-800">
            <div className="text-xs text-slate-400 font-sans font-medium">Syllabus Covered</div>
            <div className="text-2xl font-black text-amber-400">{overallPct}%</div>
          </div>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex gap-2 border-b border-slate-800 pb-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition ${
              activeCategory === cat
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Topics Grid */}
      {loading ? (
        <div className="text-center py-16 text-slate-500 text-sm">Loading aptitude syllabus...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {topics.map((topic) => {
            const pct = Math.round(
              (topic.completed_questions / topic.total_suggested_questions) * 100
            );

            return (
              <div
                key={topic.id}
                className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg shadow-slate-950/30 flex flex-col justify-between hover:border-slate-700 transition"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400">
                      {topic.category}
                    </span>
                    <span className="text-xs font-mono font-bold text-slate-300">
                      {topic.completed_questions} / {topic.total_suggested_questions} Qs
                    </span>
                  </div>

                  <h4 className="text-base font-bold text-white mb-2">{topic.topic_name}</h4>

                  {/* Formula / Trick Cheat Sheet */}
                  {topic.formula_summary && (
                    <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3 text-xs text-slate-300 mb-4 font-mono leading-relaxed">
                      <div className="flex items-center gap-1.5 text-slate-500 uppercase tracking-wider text-[10px] font-sans font-bold mb-1">
                        <Calculator className="w-3 h-3 text-amber-400" />
                        <span>Formulas & Shortcut Rules:</span>
                      </div>
                      {topic.formula_summary}
                    </div>
                  )}

                  <ProgressBar percentage={pct} color="amber" showLabel={true} />
                </div>

                {/* Progress controls */}
                <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-400">Solved:</span>
                    <button
                      onClick={() => handleUpdateQuestions(topic, -5)}
                      className="p-1 rounded-lg bg-slate-800 text-slate-400 hover:text-white transition"
                      title="Minus 5"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="font-mono text-sm font-bold text-white min-w-[24px] text-center">
                      {topic.completed_questions}
                    </span>
                    <button
                      onClick={() => handleUpdateQuestions(topic, 5)}
                      className="p-1 rounded-lg bg-slate-800 text-slate-400 hover:text-white transition"
                      title="Plus 5"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-400">Test Accuracy:</span>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={topic.accuracy_percentage || ''}
                      onChange={(e) => handleAccuracyChange(topic, e.target.value)}
                      placeholder="%"
                      className="w-16 bg-slate-950 border border-slate-700 rounded-lg px-2 py-1 text-xs text-white font-mono text-center focus:outline-none focus:border-amber-500"
                    />
                    <span className="text-xs text-slate-500">%</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

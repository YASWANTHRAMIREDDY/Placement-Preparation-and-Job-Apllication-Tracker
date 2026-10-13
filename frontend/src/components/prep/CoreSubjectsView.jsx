import React, { useState, useEffect } from 'react';
import { prepApi } from '../../api/client';
import { BookOpen, HelpCircle, Star, CheckCircle, Flame, Layers } from 'lucide-react';

export const CoreSubjectsView = () => {
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSubject, setSelectedSubject] = useState('Operating Systems');

  const subjects = ['Operating Systems', 'DBMS', 'Computer Networks', 'OOP & System Design'];

  const fetchTopics = async () => {
    try {
      setLoading(true);
      const res = await prepApi.getCore({ subject: selectedSubject });
      setTopics(res.data);
    } catch (err) {
      console.error('Failed to load core topics:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTopics();
  }, [selectedSubject]);

  const handleStatusChange = async (topic, newStatus) => {
    try {
      await prepApi.updateCoreProgress(topic.id, { status: newStatus });
      setTopics((prev) =>
        prev.map((t) => (t.id === topic.id ? { ...t, status: newStatus } : t))
      );
    } catch (err) {
      console.error('Error changing core topic status:', err);
    }
  };

  const handleRatingChange = async (topic, rating) => {
    try {
      await prepApi.updateCoreProgress(topic.id, { confidence_rating: rating });
      setTopics((prev) =>
        prev.map((t) => (t.id === topic.id ? { ...t, confidence_rating: rating } : t))
      );
    } catch (err) {
      console.error('Error changing confidence rating:', err);
    }
  };

  const total = topics.length;
  const mastered = topics.filter((t) => t.status === 'Mastered').length;

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl shadow-slate-950/40 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-500/10 text-purple-400 border border-purple-500/30 flex items-center gap-1">
              <BookOpen className="w-3.5 h-3.5" />
              Core Engineering Fundamentals
            </span>
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Technical Subjects Revision</h2>
          <p className="text-xs text-slate-400 mt-1">
            Must-know interview concepts, system design basics, and common theoretical questions.
          </p>
        </div>

        <div className="flex items-center gap-4 bg-slate-950/60 border border-slate-800 rounded-xl px-5 py-3 font-mono">
          <div>
            <div className="text-xs text-slate-400 font-sans font-medium">Concepts Mastered</div>
            <div className="text-2xl font-black text-white">
              {mastered} <span className="text-sm font-normal text-slate-500">/ {total}</span>
            </div>
          </div>
          <div className="text-right pl-4 border-l border-slate-800">
            <div className="text-xs text-slate-400 font-sans font-medium">Readiness</div>
            <div className="text-2xl font-black text-purple-400">
              {total > 0 ? Math.round((mastered / total) * 100) : 0}%
            </div>
          </div>
        </div>
      </div>

      {/* Subject Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-slate-800 pb-2">
        {subjects.map((sub) => (
          <button
            key={sub}
            onClick={() => setSelectedSubject(sub)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition ${
              selectedSubject === sub
                ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            {sub}
          </button>
        ))}
      </div>

      {/* Concepts Cards */}
      {loading ? (
        <div className="text-center py-16 text-slate-500 text-sm">Loading technical topics...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {topics.map((topic) => {
            const isMastered = topic.status === 'Mastered';
            return (
              <div
                key={topic.id}
                className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg shadow-slate-950/30 flex flex-col justify-between hover:border-slate-700 transition space-y-4"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-purple-400 flex items-center gap-1">
                      <Layers className="w-3 h-3" />
                      {topic.subject}
                    </span>

                    {/* Status Pill */}
                    <select
                      value={topic.status}
                      onChange={(e) => handleStatusChange(topic, e.target.value)}
                      className={`px-2 py-1 rounded-lg text-xs font-semibold border ${
                        isMastered
                          ? 'bg-emerald-950/60 text-emerald-300 border-emerald-500/40'
                          : topic.status === 'In Progress'
                          ? 'bg-amber-950/60 text-amber-300 border-amber-500/40'
                          : 'bg-slate-950 text-slate-400 border-slate-700'
                      }`}
                    >
                      <option value="Not Started">Not Started</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Mastered">Mastered 🏆</option>
                    </select>
                  </div>

                  <h4 className="text-base font-bold text-white mb-2">{topic.topic_name}</h4>

                  {/* Summary Notes */}
                  {topic.summary_notes && (
                    <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-3 text-xs text-slate-300 leading-relaxed mb-3">
                      <span className="text-[10px] text-slate-500 uppercase tracking-wider block font-bold mb-1">
                        Quick Summary:
                      </span>
                      {topic.summary_notes}
                    </div>
                  )}

                  {/* Frequent Interview Questions */}
                  {topic.frequent_questions && (
                    <div className="bg-purple-950/20 border border-purple-900/30 rounded-xl p-3 text-xs text-purple-200/90 leading-relaxed">
                      <div className="flex items-center gap-1 text-[10px] text-purple-400 uppercase tracking-wider font-bold mb-1">
                        <HelpCircle className="w-3 h-3" />
                        <span>High-Frequency Interview Questions:</span>
                      </div>
                      {topic.frequent_questions}
                    </div>
                  )}
                </div>

                {/* Confidence Star Rating */}
                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                  <span>Confidence Level:</span>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() => handleRatingChange(topic, star)}
                        className={`p-0.5 transition ${
                          star <= topic.confidence_rating
                            ? 'text-amber-400'
                            : 'text-slate-600 hover:text-slate-400'
                        }`}
                      >
                        <Star className="w-4 h-4 fill-current" />
                      </button>
                    ))}
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

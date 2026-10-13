import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';

export const ApplicationModal = ({ isOpen, onClose, onSave, application = null }) => {
  const [formData, setFormData] = useState({
    company_name: '',
    role_title: '',
    job_type: 'Full Time',
    location: 'Remote',
    ctc_or_stipend: '',
    status: 'Applied',
    job_url: '',
    referral_name: '',
    notes: '',
    deadline: '',
    next_interview_date: '',
  });

  useEffect(() => {
    if (application) {
      setFormData({
        company_name: application.company_name || '',
        role_title: application.role_title || '',
        job_type: application.job_type || 'Full Time',
        location: application.location || 'Remote',
        ctc_or_stipend: application.ctc_or_stipend || '',
        status: application.status || 'Applied',
        job_url: application.job_url || '',
        referral_name: application.referral_name || '',
        notes: application.notes || '',
        deadline: application.deadline ? application.deadline.substring(0, 16) : '',
        next_interview_date: application.next_interview_date ? application.next_interview_date.substring(0, 16) : '',
      });
    } else {
      setFormData({
        company_name: '',
        role_title: '',
        job_type: 'Full Time',
        location: 'Remote',
        ctc_or_stipend: '',
        status: 'Applied',
        job_url: '',
        referral_name: '',
        notes: '',
        deadline: '',
        next_interview_date: '',
      });
    }
  }, [application, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Prepare payload
    const payload = {
      ...formData,
      deadline: formData.deadline ? new Date(formData.deadline).toISOString() : null,
      next_interview_date: formData.next_interview_date ? new Date(formData.next_interview_date).toISOString() : null,
    };
    onSave(payload);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={application ? 'Edit Application' : 'Add New Job Application'}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Company Name *
            </label>
            <input
              type="text"
              name="company_name"
              required
              value={formData.company_name}
              onChange={handleChange}
              placeholder="e.g. Google, Microsoft, Adobe"
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Role Title *
            </label>
            <input
              type="text"
              name="role_title"
              required
              value={formData.role_title}
              onChange={handleChange}
              placeholder="e.g. SDE 1, Graduate Trainee"
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Job Type
            </label>
            <select
              name="job_type"
              value={formData.job_type}
              onChange={handleChange}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
            >
              <option value="Full Time">Full Time</option>
              <option value="Internship">Internship</option>
              <option value="6M Intern + FTE">6M Intern + FTE</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Location
            </label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="Bangalore, Remote"
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              CTC / Stipend
            </label>
            <input
              type="text"
              name="ctc_or_stipend"
              value={formData.ctc_or_stipend}
              onChange={handleChange}
              placeholder="e.g. 18 LPA, 50k/mo"
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Current Stage / Status
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
            >
              <option value="Applied">Applied</option>
              <option value="Online Assessment">Online Assessment</option>
              <option value="Tech Round 1">Tech Round 1</option>
              <option value="Tech Round 2">Tech Round 2</option>
              <option value="HR Round">HR Round</option>
              <option value="Offered">Offered 🎉</option>
              <option value="Rejected">Rejected</option>
              <option value="Withdrawn">Withdrawn</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Application Deadline
            </label>
            <input
              type="datetime-local"
              name="deadline"
              value={formData.deadline}
              onChange={handleChange}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Next Interview Date
            </label>
            <input
              type="datetime-local"
              name="next_interview_date"
              value={formData.next_interview_date}
              onChange={handleChange}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Application / Portal URL
            </label>
            <input
              type="url"
              name="job_url"
              value={formData.job_url}
              onChange={handleChange}
              placeholder="https://company.com/careers/job123"
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Referral Contact
            </label>
            <input
              type="text"
              name="referral_name"
              value={formData.referral_name}
              onChange={handleChange}
              placeholder="Referral person / LinkedIn contact"
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
            Interview Preparation Notes / Topics Discussed
          </label>
          <textarea
            name="notes"
            rows="3"
            value={formData.notes}
            onChange={handleChange}
            placeholder="Key concepts asked, questions discussed, interviewer names, feedback..."
            className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-sm font-semibold text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-5 py-2 rounded-xl text-sm font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30 transition"
          >
            {application ? 'Save Changes' : 'Create Application'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

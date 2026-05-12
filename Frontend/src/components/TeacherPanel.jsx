import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, ClipboardList, MessageSquare, 
  Search, CheckCircle, Star, Clock, 
  Filter, ChevronDown, Download, ExternalLink,
  Award, MessageCircle, X
} from 'lucide-react';
import toast from 'react-hot-toast';
import { submissionApi } from '../api';

const TeacherPanel = () => {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [selectedSub, setSelectedSub] = useState(null);
  const [isGradeModalOpen, setIsGradeModalOpen] = useState(false);

  // Grading Form State
  const [grade, setGrade] = useState('');
  const [feedback, setFeedback] = useState('');
  const [rubrics, setRubrics] = useState({
    accuracy: 5,
    completeness: 5,
    quality: 5
  });

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const fetchSubmissions = async () => {
    try {
      const res = await submissionApi.getAll();
      setSubmissions(Array.isArray(res.data) ? res.data : res.data.results || []);
    } catch (err) {
      toast.error('Failed to load submissions');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenGradeModal = (sub) => {
    setSelectedSub(sub);
    setGrade(sub.grade || '');
    setFeedback(sub.feedback || '');
    setRubrics(sub.rubric_scores || { accuracy: 5, completeness: 5, quality: 5 });
    setIsGradeModalOpen(true);
  };

  const submitGrade = async () => {
    try {
      await toast.promise(
        submissionApi.update(selectedSub.id, {
          grade,
          feedback,
          rubric_scores: rubrics,
          status: 'Graded'
        }),
        {
          loading: 'Saving grade...',
          success: 'Submission graded successfully!',
          error: 'Failed to save grade.'
        }
      );
      setIsGradeModalOpen(false);
      fetchSubmissions();
    } catch (err) {
      console.error(err);
    }
  };

  const filteredSubmissions = submissions.filter(sub => {
    const matchesSearch = 
      sub.student_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sub.task_title?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'All' || sub.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Evaluation Dashboard</h1>
          <p className="text-slate-400 mt-1">Review student submissions and provide academic feedback.</p>
        </div>
      </header>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Total Submissions', value: submissions.length, icon: ClipboardList, color: 'text-indigo-400' },
          { label: 'Pending Review', value: submissions.filter(s => s.status !== 'Graded').length, icon: Clock, color: 'text-amber-400' },
          { label: 'Graded Tasks', value: submissions.filter(s => s.status === 'Graded').length, icon: CheckCircle, color: 'text-emerald-400' },
        ].map((stat, i) => (
          <div key={i} className="bg-white/5 border border-white/10 p-6 rounded-2xl backdrop-blur-sm flex items-center gap-4">
            <div className="p-3 bg-white/5 rounded-xl">
              <stat.icon className={`w-6 h-6 ${stat.color}`} />
            </div>
            <div>
              <p className="text-slate-400 text-sm font-medium">{stat.label}</p>
              <p className="text-2xl font-bold text-white">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Submissions Table */}
      <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-sm">
        <div className="p-6 border-b border-white/10 flex flex-col md:flex-row justify-between gap-4">
          <div className="relative flex-grow max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
            <input 
              type="text" 
              placeholder="Search by student or task..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-900/50 border border-slate-700 rounded-xl py-2 px-9 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="text-slate-400 w-4 h-4" />
            <select 
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="bg-slate-900 border border-slate-700 rounded-xl py-2 px-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
            >
              <option value="All">All Status</option>
              <option value="Submitted">Pending</option>
              <option value="Graded">Graded</option>
              <option value="Returned">Returned</option>
            </select>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/5 border-b border-white/10">
                <th className="p-4 text-slate-300 font-semibold text-sm">Student</th>
                <th className="p-4 text-slate-300 font-semibold text-sm">Task</th>
                <th className="p-4 text-slate-300 font-semibold text-sm">Submitted</th>
                <th className="p-4 text-slate-300 font-semibold text-sm">Status</th>
                <th className="p-4 text-slate-300 font-semibold text-sm text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {filteredSubmissions.map((sub) => (
                <motion.tr 
                  key={sub.id}
                  whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.02)' }}
                  className="group transition-colors"
                >
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-xs">
                        {sub.student_name?.[0]?.toUpperCase()}
                      </div>
                      <span className="text-white font-medium">{sub.student_name}</span>
                    </div>
                  </td>
                  <td className="p-4 text-slate-300">{sub.task_title}</td>
                  <td className="p-4 text-slate-400 text-sm">{new Date(sub.submitted_at).toLocaleDateString()}</td>
                  <td className="p-4">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      sub.status === 'Graded' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 
                      sub.status === 'Returned' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' :
                      'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                    }`}>
                      {sub.status || 'Submitted'}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => handleOpenGradeModal(sub)}
                        className="bg-indigo-600/10 hover:bg-indigo-600 text-indigo-400 hover:text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-all border border-indigo-600/20"
                      >
                        {sub.status === 'Graded' ? 'Review' : 'Grade'}
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
              {filteredSubmissions.length === 0 && (
                <tr>
                  <td colSpan="5" className="py-20 text-center text-slate-500">
                    No submissions found matching your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Grading Modal */}
      <AnimatePresence>
        {isGradeModalOpen && selectedSub && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-slate-900 border border-white/10 rounded-3xl p-8 w-full max-w-4xl shadow-2xl relative max-h-[90vh] overflow-y-auto"
            >
              <button 
                onClick={() => setIsGradeModalOpen(false)}
                className="absolute top-6 right-6 text-slate-500 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>

              <div className="flex flex-col lg:flex-row gap-12">
                {/* Submission Info */}
                <div className="lg:w-1/2 space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-1">Evaluate Submission</h2>
                    <p className="text-slate-400">{selectedSub.student_name} • {selectedSub.task_title}</p>
                  </div>

                  <div className="bg-white/5 rounded-2xl p-6 border border-white/5 space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400 text-sm">Submission File</span>
                      <a href={selectedSub.file} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-indigo-400 hover:text-indigo-300 text-sm font-bold">
                        <Download className="w-4 h-4" /> Download File
                      </a>
                    </div>
                    {selectedSub.description && (
                      <div>
                        <span className="text-slate-400 text-sm block mb-1">Description</span>
                        <p className="text-white text-sm leading-relaxed">{selectedSub.description}</p>
                      </div>
                    )}
                    {selectedSub.comment && (
                      <div>
                        <span className="text-slate-400 text-sm block mb-1">Student Note</span>
                        <p className="text-slate-300 text-sm italic">"{selectedSub.comment}"</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Grading Controls */}
                <div className="lg:w-1/2 space-y-8">
                  <div className="space-y-4">
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                      <Award className="text-indigo-400 w-5 h-5" /> Rubric Scoring
                    </h3>
                    {Object.keys(rubrics).map((key) => (
                      <div key={key} className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-300 capitalize">{key}</span>
                          <span className="text-indigo-400 font-bold">{rubrics[key]}/10</span>
                        </div>
                        <input 
                          type="range" 
                          min="0" 
                          max="10" 
                          value={rubrics[key]}
                          onChange={(e) => setRubrics({...rubrics, [key]: parseInt(e.target.value)})}
                          className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                        />
                      </div>
                    ))}
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                      <Star className="text-amber-400 w-5 h-5" /> Overall Grade
                    </h3>
                    <input 
                      type="text" 
                      value={grade}
                      onChange={(e) => setGrade(e.target.value)}
                      placeholder="e.g. A+, 95, Excellent"
                      className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                    />
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                      <MessageCircle className="text-emerald-400 w-5 h-5" /> Written Feedback
                    </h3>
                    <textarea 
                      value={feedback}
                      onChange={(e) => setFeedback(e.target.value)}
                      placeholder="Provide detailed feedback to the student..."
                      className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white h-32 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                    />
                  </div>

                  <div className="flex gap-4">
                    <button 
                      onClick={() => setIsGradeModalOpen(false)}
                      className="flex-grow py-3 bg-white/5 hover:bg-white/10 text-white font-bold rounded-xl transition-all border border-white/10"
                    >
                      Cancel
                    </button>
                    <button 
                      onClick={submitGrade}
                      className="flex-grow py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl shadow-lg shadow-indigo-600/20 transition-all"
                    >
                      Submit Review
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TeacherPanel;


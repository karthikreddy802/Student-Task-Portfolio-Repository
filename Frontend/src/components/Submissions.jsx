import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, FileText, Upload, Search, 
  MoreVertical, Download, ExternalLink, Trash2, X
} from 'lucide-react';
import toast from 'react-hot-toast';
import { taskApi, submissionApi } from '../api';

const Submissions = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [submissions, setSubmissions] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Form State
  const [selectedTask, setSelectedTask] = useState('');
  const [file, setFile] = useState(null);
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState('');
  const [comment, setComment] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [subRes, taskRes] = await Promise.all([
        submissionApi.getAll(),
        taskApi.getAll()
      ]);
      setSubmissions(Array.isArray(subRes.data) ? subRes.data : subRes.data.results || []);
      setTasks(Array.isArray(taskRes.data) ? taskRes.data : taskRes.data.results || []);
    } catch (err) {
      console.error(err);
      toast.error('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!selectedTask || !file) {
      toast.error('Please select a task and a file');
      return;
    }

    const formData = {
      task: selectedTask,
      file: file,
      description: description,
      tags: tags,
      comment: comment,
      student: localStorage.getItem('userId') || 1, // Get current user ID
    };

    try {
      await toast.promise(
        submissionApi.create(formData),
        {
          loading: 'Uploading submission...',
          success: 'Task submitted successfully!',
          error: 'Upload failed. Please try again.',
        }
      );
      setIsModalOpen(false);
      setDescription('');
      setTags('');
      setComment('');
      fetchData(); // Refresh list
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this submission?')) return;
    
    try {
      await submissionApi.delete(id);
      toast.success('Submission deleted');
      fetchData();
    } catch (err) {
      toast.error('Failed to delete submission');
    }
  };

  const handleDownload = (fileUrl) => {
    if (!fileUrl) return;
    const link = document.createElement('a');
    link.href = fileUrl;
    link.setAttribute('download', fileUrl.split('/').pop());
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Your Submissions</h1>
          <p className="text-slate-400 mt-1">Manage and track your task submissions.</p>
        </div>
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3 rounded-xl font-semibold shadow-lg shadow-indigo-600/20 transition-all"
        >
          <Plus className="w-5 h-5" /> New Submission
        </motion.button>
      </header>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5" />
          <input 
            type="text" 
            placeholder="Search submissions by task or status..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-10 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 bg-white/5">
                <th className="p-4 text-slate-300 font-semibold">File Name</th>
                <th className="p-4 text-slate-300 font-semibold">Submitted On</th>
                <th className="p-4 text-slate-300 font-semibold">Type</th>
                <th className="p-4 text-slate-300 font-semibold">Status</th>
                <th className="p-4 text-slate-300 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              <AnimatePresence>
                {submissions
                  .filter(sub => 
                    sub.task_title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    sub.status?.toLowerCase().includes(searchTerm.toLowerCase())
                  )
                  .map((sub) => (
                  <motion.tr 
                    key={sub.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="group hover:bg-white/5 transition-colors"
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center text-indigo-400">
                          <FileText className="w-6 h-6" />
                        </div>
                        <div>
                          <span className="text-white font-medium block">{sub.task_title || 'Unnamed Task'}</span>
                          {sub.tags && (
                            <div className="flex gap-1 mt-1">
                              {sub.tags.split(',').map((tag, i) => (
                                <span key={i} className="text-[10px] bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded">
                                  {tag.trim()}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-slate-400">{new Date(sub.submitted_at).toLocaleDateString()}</td>
                    <td className="p-4">
                      <span className="px-2 py-1 bg-slate-800 text-slate-300 rounded text-xs uppercase font-bold">
                        {sub.file?.split('.').pop() || 'NA'}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
                        sub.status === 'Graded' ? 'bg-emerald-500/10 text-emerald-400' : 
                        sub.status === 'Returned' ? 'bg-rose-500/10 text-rose-400' :
                        'bg-amber-500/10 text-amber-400'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${
                          sub.status === 'Graded' ? 'bg-emerald-400' : 
                          sub.status === 'Returned' ? 'bg-rose-400' :
                          'bg-amber-400'
                        }`} />
                        {sub.status || 'Submitted'}
                        {sub.grade && ` (${sub.grade})`}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => handleDownload(sub.file)}
                          className="p-2 hover:bg-white/10 rounded-lg text-slate-400 hover:text-white transition-all" 
                          title="Download"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => window.open(sub.file, '_blank')}
                          className="p-2 hover:bg-white/10 rounded-lg text-slate-400 hover:text-white transition-all" 
                          title="View Details"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDelete(sub.id)}
                          className="p-2 hover:bg-rose-500/20 rounded-lg text-slate-400 hover:text-rose-400 transition-all" 
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
        
        {/* Empty State Mockup */}
        {(submissions.length === 0 || submissions.filter(sub => 
                    sub.task_title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    sub.status?.toLowerCase().includes(searchTerm.toLowerCase())
                  ).length === 0) && (
          <div className="py-20 flex flex-col items-center text-center">
            <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-4">
              <Upload className="text-slate-500 w-10 h-10" />
            </div>
            <h3 className="text-white font-semibold text-lg">No submissions found</h3>
            <p className="text-slate-500 mt-1">Start by uploading your first task or refine your search.</p>
          </div>
        )}
      </div>

      {/* Submission Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-slate-900 border border-white/10 rounded-2xl p-8 w-full max-w-lg shadow-2xl relative max-h-[90vh] overflow-y-auto"
            >
              <button 
                onClick={() => setIsModalOpen(false)}
                className="absolute top-4 right-4 text-slate-500 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>

              <h2 className="text-2xl font-bold text-white mb-6">Submit Task</h2>
              
              <form onSubmit={handleUpload} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-400">Select Task</label>
                  <select 
                    value={selectedTask}
                    onChange={(e) => setSelectedTask(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                    required
                  >
                    <option value="" className="bg-slate-900 text-slate-400">Choose a task...</option>
                    {tasks.map(task => (
                      <option key={task.id} value={task.id} className="bg-slate-900 text-white">
                        {task.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-400">Upload File</label>
                    <div className="relative">
                      <input 
                        type="file" 
                        onChange={(e) => setFile(e.target.files[0])}
                        className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white file:mr-4 file:py-1 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-indigo-600 file:text-white hover:file:bg-indigo-500 transition-all"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-400">Tags (comma separated)</label>
                    <input 
                      type="text" 
                      value={tags}
                      onChange={(e) => setTags(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                      placeholder="e.g. React, UI/UX, Backend"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-400">Work Description</label>
                  <textarea 
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white h-24 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                    placeholder="Briefly describe what you did..."
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-400">Additional Comments (Optional)</label>
                  <textarea 
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white h-20 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                    placeholder="Any specific note for the teacher..."
                  />
                </div>

                <button 
                  type="submit"
                  className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-4 rounded-xl shadow-lg transition-all mt-4"
                >
                  Confirm Submission
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Submissions;

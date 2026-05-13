import React, { useState, useEffect } from 'react';
import { 
  ClipboardList, Plus, Search, 
  Calendar, BookOpen, Clock, 
  Trash2, Edit3, Sparkles, X,
  ChevronRight, Filter, MoreVertical,
  CheckCircle, AlertCircle
} from 'lucide-react';
import { taskApi } from '../api';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';

const TaskManager = () => {
  const location = useLocation();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSuggesting, setIsSuggesting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Form State
  const [newTask, setNewTask] = useState({
    title: '',
    subject: '',
    description: '',
    due_date: '',
    status: 'Active'
  });

  useEffect(() => {
    fetchTasks();
    // Auto-open modal if action=create is in URL
    const params = new URLSearchParams(location.search);
    if (params.get('action') === 'create') {
      setIsModalOpen(true);
    }
  }, [location]);

  const fetchTasks = async () => {
    try {
      const res = await taskApi.getAll();
      setTasks(res.data);
    } catch (err) {
      toast.error('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    try {
      await toast.promise(
        taskApi.create({
          ...newTask,
          teacher: localStorage.getItem('userId'),
          due_date: new Date(newTask.due_date).toISOString()
        }),
        {
          loading: 'Creating task...',
          success: 'Task created successfully! 📝',
          error: 'Failed to create task.'
        }
      );
      setIsModalOpen(false);
      setNewTask({ title: '', subject: '', description: '', due_date: '', status: 'Active' });
      fetchTasks();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteTask = async (id) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await taskApi.delete(id);
        toast.success('Task deleted');
        fetchTasks();
      } catch (err) {
        toast.error('Failed to delete task');
      }
    }
  };

  const handleSuggestDescription = async () => {
    if (!newTask.title || !newTask.subject) {
      toast.error('Enter title and subject first');
      return;
    }
    setIsSuggesting(true);
    try {
      const res = await taskApi.suggestDescription({
        title: newTask.title,
        subject: newTask.subject
      });
      setNewTask({ ...newTask, description: res.data.description });
      toast.success('AI description generated! ✨');
    } catch (err) {
      toast.error('AI suggestion failed');
    } finally {
      setIsSuggesting(false);
    }
  };

  const filteredTasks = tasks.filter(t => 
    t.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.subject?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Task Management</h1>
          <p className="text-slate-400 mt-1">Design, assign, and manage academic challenges.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3 rounded-2xl font-bold transition-all shadow-lg shadow-indigo-600/20"
        >
          <Plus className="w-5 h-5" /> Create New Task
        </button>
      </header>

      {/* Toolbar */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
          <input 
            type="text" 
            placeholder="Search tasks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-900/50 border border-white/10 rounded-2xl py-3 pl-12 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
          />
        </div>
        <div className="flex items-center gap-2">
           <span className="text-slate-500 text-sm font-medium">Total: {tasks.length} Tasks</span>
        </div>
      </div>

      {/* Task Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTasks.map((task) => (
          <div key={task.id} className="bg-slate-900/50 border border-white/5 rounded-3xl p-6 backdrop-blur-sm group hover:border-white/10 transition-all flex flex-col justify-between h-[280px]">
            <div>
              <div className="flex justify-between items-start mb-4">
                <span className="px-3 py-1 bg-indigo-500/10 text-indigo-400 rounded-lg text-[10px] font-black uppercase tracking-widest border border-indigo-500/20">
                  {task.subject}
                </span>
                <div className="flex gap-1">
                   <button className="p-2 text-slate-500 hover:text-white transition-colors"><Edit3 className="w-4 h-4" /></button>
                   <button 
                     onClick={() => handleDeleteTask(task.id)}
                     className="p-2 text-slate-500 hover:text-rose-400 transition-colors"
                   >
                    <Trash2 className="w-4 h-4" />
                   </button>
                </div>
              </div>
              <h3 className="text-xl font-bold text-white mb-2 line-clamp-1">{task.title}</h3>
              <p className="text-slate-400 text-sm line-clamp-3 leading-relaxed">
                {task.description}
              </p>
            </div>

            <div className="pt-6 border-t border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-2 text-slate-500 text-xs">
                <Calendar className="w-3.5 h-3.5 text-indigo-400" />
                <span>Due: {new Date(task.due_date).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400 text-[10px] font-bold">ACTIVE</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredTasks.length === 0 && !loading && (
        <div className="py-20 text-center bg-slate-900/20 rounded-3xl border border-dashed border-white/5">
          <BookOpen className="w-16 h-16 text-slate-700 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-slate-500">No tasks found</h3>
          <p className="text-slate-600 mt-1 text-sm">Start by creating a new academic challenge.</p>
        </div>
      )}

      {/* Create Task Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-slate-900 border border-white/10 rounded-3xl p-8 w-full max-w-2xl shadow-2xl relative"
            >
              <button 
                onClick={() => setIsModalOpen(false)} 
                className="absolute top-6 right-6 text-slate-500 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
              
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <Sparkles className="text-indigo-400" /> Design New Task
              </h2>
              
              <form onSubmit={handleCreateTask} className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-slate-400 text-xs font-bold uppercase tracking-widest ml-1">Title</label>
                    <input 
                      type="text" 
                      required
                      placeholder="e.g. React Fundamentals"
                      value={newTask.title}
                      onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-slate-400 text-xs font-bold uppercase tracking-widest ml-1">Subject</label>
                    <input 
                      type="text" 
                      required
                      placeholder="e.g. Web Development"
                      value={newTask.subject}
                      onChange={(e) => setNewTask({...newTask, subject: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-slate-400 text-xs font-bold uppercase tracking-widest ml-1">Due Date</label>
                  <input 
                    type="datetime-local" 
                    required
                    value={newTask.due_date}
                    onChange={(e) => setNewTask({...newTask, due_date: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                  />
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between items-center mb-1 ml-1">
                    <label className="text-slate-400 text-xs font-bold uppercase tracking-widest">Description</label>
                    <button 
                      type="button"
                      onClick={handleSuggestDescription}
                      disabled={isSuggesting}
                      className="flex items-center gap-1.5 text-xs font-bold text-indigo-400 hover:text-indigo-300 transition-colors disabled:opacity-50"
                    >
                      {isSuggesting ? (
                        <div className="flex items-center gap-2">
                           <div className="w-3 h-3 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin" />
                           Generating...
                        </div>
                      ) : (
                        <>
                          <Sparkles className="w-3.5 h-3.5" /> AI Suggest
                        </>
                      )}
                    </button>
                  </div>
                  <textarea 
                    required
                    rows="5"
                    value={newTask.description}
                    onChange={(e) => setNewTask({...newTask, description: e.target.value})}
                    placeholder="Provide clear objectives and requirements..."
                    className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 resize-none"
                  />
                </div>
                
                <button 
                  type="submit"
                  className="w-full py-4 bg-gradient-to-r from-indigo-600 to-violet-700 hover:from-indigo-500 hover:to-violet-600 text-white font-black rounded-2xl shadow-xl shadow-indigo-600/20 transition-all mt-4 uppercase tracking-widest text-sm"
                >
                  Publish Task
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TaskManager;

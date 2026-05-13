import React, { useState, useEffect } from 'react';
import { ClipboardList, Search, Clock, CheckCircle, AlertCircle, ExternalLink } from 'lucide-react';
import { taskApi } from '../api';
import toast from 'react-hot-toast';

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchTasks();
  }, []);

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

  const filteredTasks = tasks.filter(task => 
    task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    task.subject.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in slide-in-from-top-4 duration-500">
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Active Assignments</h1>
          <p className="text-slate-400 mt-1">Manage your coursework and upcoming deadlines.</p>
        </div>
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
          <input 
            type="text" 
            placeholder="Search tasks or subjects..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-900 border border-white/10 rounded-xl py-2 px-9 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
          />
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTasks.map((task) => (
          <div key={task.id} className="bg-slate-900/50 border border-white/10 rounded-3xl p-6 backdrop-blur-sm group hover:border-indigo-500/30 transition-all">
            <div className="flex justify-between items-start mb-4">
              <span className="px-2 py-1 bg-indigo-500/10 text-indigo-400 rounded text-[10px] font-bold uppercase tracking-wider">
                {task.subject}
              </span>
              <span className={`flex items-center gap-1.5 px-2 py-1 rounded text-[10px] font-bold ${
                task.status === 'Completed' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'
              }`}>
                {task.status === 'Completed' ? <CheckCircle className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                {task.status}
              </span>
            </div>
            
            <h3 className="text-xl font-bold text-white mb-2 group-hover:text-indigo-400 transition-colors">{task.title}</h3>
            <p className="text-slate-400 text-sm line-clamp-3 mb-6 leading-relaxed">{task.description}</p>
            
            <div className="flex items-center justify-between pt-6 border-t border-white/5">
              <div className="flex flex-col">
                <span className="text-slate-500 text-[10px] uppercase font-bold tracking-widest">Due Date</span>
                <span className="text-white text-sm font-medium">{new Date(task.due_date).toLocaleDateString()}</span>
              </div>
              <button 
                onClick={() => window.location.href = '/submissions'}
                className="p-2 bg-indigo-600 rounded-xl text-white hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-600/20"
              >
                <ExternalLink className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
        
        {filteredTasks.length === 0 && !loading && (
          <div className="col-span-full py-20 text-center bg-white/5 rounded-3xl border border-dashed border-white/10">
            <ClipboardList className="w-12 h-12 text-slate-700 mx-auto mb-4" />
            <p className="text-slate-500 font-bold">No tasks found</p>
            <p className="text-slate-600 text-sm">You're all caught up for now!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Tasks;

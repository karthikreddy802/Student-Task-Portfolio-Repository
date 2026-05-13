import React, { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, Clock, ChevronLeft, ChevronRight } from 'lucide-react';
import { taskApi } from '../api';
import toast from 'react-hot-toast';

const Calendar = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const today = new Date();

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await taskApi.getAll();
        setTasks(res.data);
      } catch (err) {
        toast.error('Failed to load tasks for calendar');
      } finally {
        setLoading(false);
      }
    };
    fetchTasks();
  }, []);
  
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Academic Calendar</h1>
          <p className="text-slate-400 mt-1">Track your deadlines and academic events.</p>
        </div>
        <div className="flex gap-2">
          <button className="p-2 bg-white/5 border border-white/10 rounded-xl text-slate-400 hover:text-white transition-all">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button className="p-2 bg-white/5 border border-white/10 rounded-xl text-slate-400 hover:text-white transition-all">
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Calendar Grid */}
        <div className="lg:col-span-3 bg-slate-900/50 border border-white/10 rounded-3xl p-8 backdrop-blur-sm">
          <div className="grid grid-cols-7 gap-4 mb-8">
            {days.map(day => (
              <div key={day} className="text-center text-xs font-bold text-slate-500 uppercase tracking-widest">
                {day}
              </div>
            ))}
          </div>
          
          <div className="grid grid-cols-7 gap-4">
            {Array.from({ length: 31 }).map((_, i) => (
              <div 
                key={i} 
                className={`
                  aspect-square rounded-2xl border border-white/5 p-3 flex flex-col justify-between transition-all hover:bg-indigo-600/10 cursor-pointer
                  ${i + 1 === today.getDate() ? 'bg-indigo-600/20 border-indigo-500/50 ring-1 ring-indigo-500/50' : 'bg-white/5'}
                `}
              >
                <span className={`text-sm font-bold ${i + 1 === today.getDate() ? 'text-indigo-400' : 'text-slate-400'}`}>
                  {i + 1}
                </span>
                {tasks.some(t => new Date(t.due_date).getDate() === i + 1 && new Date(t.due_date).getMonth() === today.getMonth()) && (
                  <div className="w-2 h-2 rounded-full bg-indigo-500 shadow-lg shadow-indigo-500/50 mx-auto" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Events */}
        <div className="space-y-6">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Clock className="text-indigo-400 w-5 h-5" /> Upcoming Deadlines
          </h3>
          
          <div className="space-y-4">
            {tasks.slice(0, 5).map((task, i) => (
              <div key={i} className={`bg-white/5 border border-indigo-500/30 p-4 rounded-2xl backdrop-blur-sm group hover:bg-white/10 transition-all cursor-pointer`}>
                <p className="text-white font-bold group-hover:text-indigo-400 transition-colors">{task.title}</p>
                <p className="text-slate-500 text-xs mt-1">{new Date(task.due_date).toLocaleDateString()}</p>
              </div>
            ))}
            {tasks.length === 0 && !loading && (
              <p className="text-slate-600 text-sm text-center italic">No upcoming tasks</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Calendar;

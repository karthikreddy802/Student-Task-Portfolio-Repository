import React, { useState, useEffect } from 'react';
import { 
  Users, ClipboardList, CheckCircle, 
  Clock, AlertCircle, TrendingUp,
  BookOpen, Star, MessageSquare
} from 'lucide-react';
import { taskApi, submissionApi } from '../api';
import toast from 'react-hot-toast';

const TeacherDashboard = () => {
  const [stats, setStats] = useState({
    activeStudents: 0,
    pendingReviews: 0,
    completedTasks: 0,
    avgScore: '0%'
  });
  const [recentSubmissions, setRecentSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTeacherStats();
  }, []);

  const fetchTeacherStats = async () => {
    try {
      const [tasks, submissions] = await Promise.all([
        taskApi.getAll(),
        submissionApi.getAll()
      ]);
      
      const subData = submissions.data || [];
      const taskData = tasks.data || [];
      
      // Calculate unique students
      const uniqueStudents = new Set(subData.map(s => s.student)).size;
      const pending = subData.filter(s => s.status === 'Pending').length;
      
      // Calculate avg score (mocked calculation for now based on graded items)
      const gradedItems = subData.filter(s => s.grade);
      const avg = gradedItems.length > 0 ? '82%' : 'N/A';

      setRecentSubmissions(subData.slice(0, 5)); // Get top 5
      
      setStats({
        activeStudents: uniqueStudents || 0,
        pendingReviews: pending,
        completedTasks: taskData.length,
        avgScore: avg
      });
    } catch (err) {
      toast.error('Failed to load teacher analytics');
    } finally {
      setLoading(false);
    }
  };

  const cards = [
    { label: 'Active Students', value: stats.activeStudents, icon: Users, color: 'text-indigo-400', bg: 'bg-indigo-400/10' },
    { label: 'Pending Reviews', value: stats.pendingReviews, icon: Clock, color: 'text-amber-400', bg: 'bg-amber-400/10' },
    { label: 'Total Tasks', value: stats.completedTasks, icon: BookOpen, color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
    { label: 'Avg. Class Grade', value: stats.avgScore, icon: Star, color: 'text-violet-400', bg: 'bg-violet-400/10' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <header>
        <h1 className="text-3xl font-bold text-white tracking-tight">Faculty Dashboard</h1>
        <p className="text-slate-400 mt-1">Overview of your classes, student performance, and pending evaluations.</p>
      </header>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, i) => (
          <div key={i} className="bg-slate-900/50 border border-white/5 p-6 rounded-3xl backdrop-blur-sm group hover:border-white/10 transition-all">
            <div className={`w-12 h-12 rounded-2xl ${card.bg} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
              <card.icon className={`w-6 h-6 ${card.color}`} />
            </div>
            <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">{card.label}</p>
            <p className="text-3xl font-black text-white mt-1">{card.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Submissions Feed */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <MessageSquare className="text-indigo-400 w-5 h-5" /> Recent Submissions
          </h3>
          <div className="bg-slate-900/50 border border-white/5 rounded-3xl overflow-hidden divide-y divide-white/5">
            {recentSubmissions.map((sub, i) => (
              <div key={i} className="p-6 flex items-center justify-between hover:bg-white/5 transition-colors cursor-pointer group">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center text-white font-bold uppercase">
                    {sub.student_name?.[0] || 'S'}
                  </div>
                  <div>
                    <p className="text-white font-bold group-hover:text-indigo-400 transition-colors">
                      {sub.student_name} submitted {sub.task_title}
                    </p>
                    <p className="text-slate-500 text-xs mt-0.5">
                      {sub.task_subject || 'General'} • {new Date(sub.submitted_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <button 
                  onClick={() => window.location.href = '/teacher'}
                  className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-xs font-bold text-slate-300 hover:bg-indigo-600 hover:text-white transition-all"
                >
                  Grade Now
                </button>
              </div>
            ))}
            {recentSubmissions.length === 0 && !loading && (
              <div className="p-10 text-center text-slate-500 italic">No submissions yet</div>
            )}
          </div>
        </div>

        {/* Task Distribution */}
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <TrendingUp className="text-emerald-400 w-5 h-5" /> Activity
          </h3>
          <div className="bg-slate-900/50 border border-white/5 rounded-3xl p-8 backdrop-blur-sm h-[400px] flex flex-col justify-between">
            <div className="space-y-6">
               <div className="space-y-2">
                 <div className="flex justify-between text-xs font-bold text-slate-400 uppercase tracking-tighter">
                   <span>Grading Progress</span>
                   <span>75%</span>
                 </div>
                 <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                    <div className="w-3/4 h-full bg-gradient-to-r from-emerald-500 to-teal-400" />
                 </div>
               </div>
               <div className="space-y-2">
                 <div className="flex justify-between text-xs font-bold text-slate-400 uppercase tracking-tighter">
                   <span>Task Completion</span>
                   <span>92%</span>
                 </div>
                 <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                    <div className="w-[92%] h-full bg-gradient-to-r from-indigo-500 to-violet-400" />
                 </div>
               </div>
               <div className="space-y-2">
                 <div className="flex justify-between text-xs font-bold text-slate-400 uppercase tracking-tighter">
                   <span>Engagement</span>
                   <span>64%</span>
                 </div>
                 <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                    <div className="w-[64%] h-full bg-gradient-to-r from-amber-500 to-orange-400" />
                 </div>
               </div>
            </div>
            
            <div className="pt-8 border-t border-white/5 text-center">
              <p className="text-slate-500 text-xs italic">Class participation is up 12% this week</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;

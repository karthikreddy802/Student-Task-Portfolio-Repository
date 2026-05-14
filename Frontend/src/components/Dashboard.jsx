import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  AreaChart, Area 
} from 'recharts';
import { 
  CheckCircle2, Clock, BookOpen, Award, 
  ArrowUpRight, TrendingUp, Filter 
} from 'lucide-react';
import { taskApi, submissionApi } from '../api';
import SEO from './SEO';

// Dynamic data calculated inside component

const StatCard = ({ title, value, icon: Icon, trend, color }) => (
  <motion.div 
    whileHover={{ y: -5 }}
    className="bg-white/5 border border-white/10 p-6 rounded-2xl backdrop-blur-sm"
  >
    <div className="flex justify-between items-start mb-4">
      <div className={`p-3 rounded-xl ${color}`}>
        <Icon className="text-white w-6 h-6" />
      </div>
      <div className="flex items-center gap-1 text-emerald-400 text-sm font-medium">
        {trend} <ArrowUpRight className="w-4 h-4" />
      </div>
    </div>
    <h3 className="text-slate-400 text-sm font-medium">{title}</h3>
    <p className="text-2xl font-bold text-white mt-1">{value}</p>
  </motion.div>
);

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([taskApi.getAll(), submissionApi.getAll()])
      .then(([tasksRes, submissionsRes]) => {
        setTasks(Array.isArray(tasksRes.data) ? tasksRes.data : tasksRes.data.results || []);
        setSubmissions(Array.isArray(submissionsRes.data) ? submissionsRes.data : submissionsRes.data.results || []);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const stats = {
    completed: tasks.filter(t => t.status === 'Completed').length,
    pending: tasks.filter(t => t.status === 'Pending').length,
    submissions: submissions.length,
    graded: submissions.filter(s => s.grade).length
  };

  // Generate chart data from real tasks (count by date)
  const taskChartData = tasks.reduce((acc, task) => {
    const day = new Date(task.created_at).toLocaleDateString('en-US', { weekday: 'short' });
    const existing = acc.find(d => d.name === day);
    if (existing) existing.tasks += 1;
    else acc.push({ name: day, tasks: 1 });
    return acc;
  }, []);

  // Generate performance data from submissions
  const performanceData = submissions.filter(s => s.grade).map((s, i) => ({
    name: `Task ${i + 1}`,
    score: parseInt(s.grade) || 0
  }));

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <SEO 
        title="Student Dashboard" 
        description="Track your academic progress, manage tasks, and view performance analytics on your HUB OS dashboard."
      />
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Student Dashboard</h1>
          <p className="text-slate-400 mt-1">Track your progress and manage your tasks.</p>
        </div>
        <button className="flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2 rounded-lg text-slate-300 hover:bg-white/10 transition-colors">
          <Filter className="w-4 h-4" /> Filter Views
        </button>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Completed Tasks" 
          value={stats.completed} 
          icon={CheckCircle2} 
          trend="+12%" 
          color="bg-emerald-500/20 shadow-[0_0_20px_rgba(16,185,129,0.2)]" 
        />
        <StatCard 
          title="Pending Reviews" 
          value={stats.pending} 
          icon={Clock} 
          trend="+5%" 
          color="bg-amber-500/20 shadow-[0_0_20px_rgba(245,158,11,0.2)]" 
        />
        <StatCard 
          title="Total Submissions" 
          value={stats.submissions} 
          icon={BookOpen} 
          trend="+2%" 
          color="bg-indigo-500/20 shadow-[0_0_20px_rgba(99,102,241,0.2)]" 
        />
        <StatCard 
          title="Graded Tasks" 
          value={stats.graded} 
          icon={Award} 
          trend="+18%" 
          color="bg-purple-500/20 shadow-[0_0_20px_rgba(168,85,247,0.2)]" 
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white/5 border border-white/10 p-6 rounded-2xl backdrop-blur-sm">
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp className="text-indigo-400 w-5 h-5" />
            <h2 className="text-lg font-semibold text-white">Task Activity</h2>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%" debounce={100}>
              <BarChart data={taskChartData.length > 0 ? taskChartData : [{name: 'None', tasks: 0}]}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Bar dataKey="tasks" fill="#6366f1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white/5 border border-white/10 p-6 rounded-2xl backdrop-blur-sm">
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp className="text-purple-400 w-5 h-5" />
            <h2 className="text-lg font-semibold text-white">Academic Performance</h2>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%" debounce={100}>
              <AreaChart data={performanceData.length > 0 ? performanceData : [{name: 'No Grades', score: 0}]}>
                <defs>
                  <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#a855f7" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#a855f7" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Area type="monotone" dataKey="score" stroke="#a855f7" strokeWidth={2} fillOpacity={1} fill="url(#colorScore)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Submissions */}
      <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-sm">
        <div className="p-6 border-b border-white/10">
          <h2 className="text-lg font-semibold text-white">Recent Submissions</h2>
        </div>
        <div className="divide-y divide-white/10">
          {tasks.slice(0, 3).map((item) => (
            <div key={item.id} className="p-4 hover:bg-white/5 transition-colors flex items-center justify-between">
              <div>
                <h4 className="text-white font-medium">{item.title}</h4>
                <p className="text-slate-400 text-sm">{item.status} • {new Date(item.due_date).toLocaleDateString()}</p>
              </div>
              <div className="text-right">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  item.status === 'Graded' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'
                }`}>
                  {item.status}
                </span>
                <p className="text-white font-bold mt-1">{item.score}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Settings, Shield, Database, 
  Server, Activity, Lock, 
  RefreshCw, AlertCircle, Globe,
  Users, Briefcase, ClipboardList, Send
} from 'lucide-react';
import { taskApi, submissionApi, portfolioApi, notificationApi } from '../api';
import toast from 'react-hot-toast';

const AdminPanel = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalPortfolios: 0,
    totalTasks: 0,
    totalSubmissions: 0
  });
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSystemData();
  }, []);

  const fetchSystemData = async () => {
    setLoading(true);
    try {
      const [tasks, submissions, portfolios, notifications] = await Promise.all([
        taskApi.getAll(),
        submissionApi.getAll(),
        portfolioApi.getMine(''), // Fetch all
        notificationApi.getAll()
      ]);

      // Calculate unique users from portfolios/submissions as a proxy for total active users
      const uniqueUsers = new Set([
        ...portfolios.data.map(p => p.user),
        ...submissions.data.map(s => s.student)
      ]).size;

      setStats({
        totalUsers: uniqueUsers || portfolios.data.length,
        totalPortfolios: portfolios.data.length,
        totalTasks: tasks.data.length,
        totalSubmissions: submissions.data.length
      });

      setLogs(notifications.data.slice(0, 5));
    } catch (err) {
      console.error(err);
      toast.error('Failed to sync system data');
    } finally {
      setLoading(false);
    }
  };

  const systemStatus = [
    { label: 'System Portals', value: stats.totalPortfolios, icon: Briefcase, color: 'text-indigo-400' },
    { label: 'Global Tasks', value: stats.totalTasks, icon: ClipboardList, color: 'text-emerald-400' },
    { label: 'Active Submissions', value: stats.totalSubmissions, icon: Send, color: 'text-amber-400' },
    { label: 'Total Users', value: stats.totalUsers, icon: Users, color: 'text-violet-400' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-top-4 duration-500">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">System Administration</h1>
          <p className="text-slate-400 mt-1">Real-time overview of the Academic OS infrastructure.</p>
        </div>
        <button 
          onClick={fetchSystemData}
          disabled={loading}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3 rounded-2xl font-bold transition-all shadow-lg shadow-indigo-600/20 disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} /> 
          {loading ? 'Syncing...' : 'System Refresh'}
        </button>
      </header>

      {/* System Status Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {systemStatus.map((stat, i) => (
          <motion.div 
            key={i}
            whileHover={{ scale: 1.02 }}
            className="bg-slate-900/50 border border-white/5 p-6 rounded-3xl backdrop-blur-sm"
          >
            <div className="flex justify-between items-start mb-4">
              <stat.icon className={`${stat.color} w-6 h-6`} />
              <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]" />
            </div>
            <p className="text-slate-400 text-sm font-medium">{stat.label}</p>
            <p className="text-2xl font-bold text-white mt-1">{loading ? '...' : stat.value}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Quick Settings */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-slate-900/50 border border-white/5 rounded-3xl p-8 backdrop-blur-sm space-y-8">
            <h2 className="text-2xl font-bold text-white flex items-center gap-3">
              <Settings className="text-slate-400 w-7 h-7" /> Platform Control
            </h2>
            
            <div className="space-y-4">
              {[
                { title: 'Maintenance Mode', desc: 'Secure platform for maintenance.', icon: Lock, active: false },
                { title: 'Security Hardening', desc: 'Enable multi-factor requirements.', icon: Shield, active: true },
                { title: 'Server Health', desc: 'Monitoring infrastructure nodes.', icon: Server, active: true },
              ].map((setting, i) => (
                <div key={i} className="flex items-center justify-between p-6 bg-white/5 rounded-2xl border border-white/5 group hover:border-white/10 transition-all">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-slate-800 rounded-xl">
                      <setting.icon className="text-indigo-400 w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-white font-bold">{setting.title}</h4>
                      <p className="text-slate-500 text-sm">{setting.desc}</p>
                    </div>
                  </div>
                  <button className={`w-14 h-7 rounded-full transition-all relative ${setting.active ? 'bg-indigo-600' : 'bg-slate-700'}`}>
                    <div className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-all shadow-md ${setting.active ? 'right-1' : 'left-1'}`} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* System Logs */}
        <div className="bg-slate-900/50 border border-white/5 rounded-3xl p-8 backdrop-blur-sm shadow-2xl">
          <h2 className="text-2xl font-bold text-white flex items-center gap-3 mb-8">
            <AlertCircle className="text-rose-400 w-7 h-7" /> System Activity
          </h2>
          <div className="space-y-4">
            {logs.map((log, i) => (
              <div key={i} className="text-sm p-4 border-l-4 border-indigo-500 bg-white/5 rounded-r-2xl hover:bg-white/10 transition-all">
                <div className="flex justify-between items-start mb-1">
                  <p className="text-white font-bold truncate pr-4">{log.message}</p>
                  <span className="w-2 h-2 rounded-full bg-indigo-500" />
                </div>
                <div className="flex justify-between text-slate-500 text-xs mt-1">
                  <span>System Event</span>
                  <span className="font-medium text-slate-600 uppercase tracking-tighter">{new Date(log.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
              </div>
            ))}
            {logs.length === 0 && !loading && (
              <div className="text-center py-10 text-slate-600 italic text-sm">No recent activity</div>
            )}
          </div>
          <button className="w-full mt-8 py-4 text-indigo-400 font-bold border border-indigo-400/10 rounded-2xl hover:bg-indigo-400/5 transition-all text-sm uppercase tracking-widest">
            Detailed Logs
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;

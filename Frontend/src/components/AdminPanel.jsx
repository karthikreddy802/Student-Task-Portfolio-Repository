import React from 'react';
import { motion } from 'framer-motion';
import { 
  Settings, Shield, Database, 
  Server, Activity, Lock, 
  RefreshCw, AlertCircle, Globe
} from 'lucide-react';

const AdminPanel = () => {
  const systemStatus = [
    { label: 'Server Status', value: 'Online', status: 'healthy', icon: Server },
    { label: 'Database', value: 'Connected', status: 'healthy', icon: Database },
    { label: 'API Latency', value: '24ms', status: 'healthy', icon: Activity },
    { label: 'Storage', value: '45% used', status: 'warning', icon: Globe },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-top-4 duration-500">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">System Administration</h1>
          <p className="text-slate-400 mt-1">Configure and monitor the entire platform.</p>
        </div>
        <button className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-xl font-semibold transition-all shadow-lg shadow-indigo-600/20">
          <RefreshCw className="w-4 h-4" /> System Refresh
        </button>
      </header>

      {/* System Status Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {systemStatus.map((stat, i) => (
          <motion.div 
            key={i}
            whileHover={{ scale: 1.02 }}
            className="bg-white/5 border border-white/10 p-6 rounded-2xl backdrop-blur-sm"
          >
            <div className="flex justify-between items-start mb-4">
              <stat.icon className="text-indigo-400 w-6 h-6" />
              <div className={`w-3 h-3 rounded-full ${
                stat.status === 'healthy' ? 'bg-emerald-500 shadow-[0_0_10px_#10b981]' : 'bg-amber-500 shadow-[0_0_10px_#f59e0b]'
              }`} />
            </div>
            <p className="text-slate-400 text-sm font-medium">{stat.label}</p>
            <p className="text-xl font-bold text-white mt-1">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Quick Settings */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm space-y-6">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Settings className="text-slate-400 w-6 h-6" /> Platform Settings
            </h2>
            
            <div className="space-y-4">
              {[
                { title: 'Maintenance Mode', desc: 'Disable student access temporarily.', icon: Lock, active: false },
                { title: 'Security Hardening', desc: 'Enable stricter password requirements.', icon: Shield, active: true },
                { title: 'Auto-Grading', desc: 'Enable AI-assisted grading for basic tasks.', icon: Activity, active: true },
              ].map((setting, i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5">
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-slate-800 rounded-lg">
                      <setting.icon className="text-indigo-400 w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-white font-medium">{setting.title}</h4>
                      <p className="text-slate-500 text-sm">{setting.desc}</p>
                    </div>
                  </div>
                  <button className={`w-12 h-6 rounded-full transition-colors relative ${setting.active ? 'bg-indigo-600' : 'bg-slate-700'}`}>
                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${setting.active ? 'right-1' : 'left-1'}`} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* User Management Section */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm space-y-6">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Shield className="text-emerald-400 w-6 h-6" /> User Management
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-white/5 border border-white/5 rounded-xl space-y-4">
                <h3 className="text-white font-semibold">Generate Credentials</h3>
                <div className="space-y-3">
                  <input type="text" placeholder="Full Name" className="w-full bg-slate-900 border border-white/10 rounded-lg p-2 text-sm text-white" />
                  <input type="email" placeholder="Email Address" className="w-full bg-slate-900 border border-white/10 rounded-lg p-2 text-sm text-white" />
                  <select className="w-full bg-slate-900 border border-white/10 rounded-lg p-2 text-sm text-white">
                    <option value="Student">Assign as Student</option>
                    <option value="Teacher">Assign as Teacher</option>
                  </select>
                  <button className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2 rounded-lg transition-all">
                    Create Account
                  </button>
                </div>
              </div>
              <div className="p-4 bg-white/5 border border-white/5 rounded-xl">
                <h3 className="text-white font-semibold mb-3">Active Users</h3>
                <div className="space-y-2">
                  {['Siddharth (Student)', 'Prof. Sharma (Teacher)', 'Anjali (Student)'].map((user, i) => (
                    <div key={i} className="flex justify-between items-center text-sm py-1 border-b border-white/5 last:border-0">
                      <span className="text-slate-300">{user}</span>
                      <span className="text-indigo-400 cursor-pointer hover:underline text-xs">Edit</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Security Logs */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
          <h2 className="text-xl font-bold text-white flex items-center gap-2 mb-6">
            <AlertCircle className="text-rose-400 w-6 h-6" /> Security Logs
          </h2>
          <div className="space-y-4">
            {[
              { event: 'Failed Login', user: 'Unknown IP', time: '2 mins ago' },
              { event: 'Config Change', user: 'Admin_01', time: '1h ago' },
              { event: 'Large Export', user: 'Teacher_Felix', time: '3h ago' },
              { event: 'New Enrollment', user: 'System', time: '5h ago' },
            ].map((log, i) => (
              <div key={i} className="text-sm p-3 border-l-2 border-indigo-500/50 bg-white/5 rounded-r-lg">
                <p className="text-white font-medium">{log.event}</p>
                <div className="flex justify-between text-slate-500 mt-1">
                  <span>{log.user}</span>
                  <span>{log.time}</span>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-6 py-2 text-indigo-400 font-semibold border border-indigo-400/20 rounded-xl hover:bg-indigo-400/10 transition-all">
            View All Logs
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;

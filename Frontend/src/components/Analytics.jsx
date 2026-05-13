import React from 'react';
import { 
  BarChart3, TrendingUp, Users, 
  CheckCircle, Clock, AlertCircle,
  PieChart as PieChartIcon
} from 'lucide-react';

const Analytics = () => {
  const stats = [
    { label: 'Avg. Grade', value: '88%', change: '+2.5%', icon: TrendingUp, color: 'text-emerald-400' },
    { label: 'Completion Rate', value: '94%', change: '+1.2%', icon: CheckCircle, color: 'text-indigo-400' },
    { label: 'Active Students', value: '1,240', change: '+15', icon: Users, color: 'text-amber-400' },
  ];

  return (
    <div className="space-y-8 animate-in zoom-in-95 duration-500">
      <header>
        <h1 className="text-3xl font-bold text-white tracking-tight">System Analytics</h1>
        <p className="text-slate-400 mt-1">Deep insights into academic performance and engagement.</p>
      </header>

      {/* Hero Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-slate-900/50 border border-white/10 p-8 rounded-3xl backdrop-blur-sm relative overflow-hidden group">
            <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/5 rounded-full group-hover:scale-150 transition-transform duration-700" />
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-white/5 rounded-xl">
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <span className="text-emerald-400 text-xs font-bold bg-emerald-400/10 px-2 py-1 rounded-lg">
                {stat.change}
              </span>
            </div>
            <p className="text-slate-400 text-sm font-medium">{stat.label}</p>
            <p className="text-3xl font-bold text-white mt-1 tracking-tight">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Performance Chart Placeholder */}
        <div className="bg-slate-900/50 border border-white/10 rounded-3xl p-8 backdrop-blur-sm">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <BarChart3 className="text-indigo-400 w-5 h-5" /> Performance Trends
            </h3>
            <select className="bg-slate-800 border border-white/10 rounded-lg px-3 py-1 text-xs text-slate-300 outline-none">
              <option>Last 30 Days</option>
              <option>Last 6 Months</option>
            </select>
          </div>
          <div className="h-64 flex items-end justify-between gap-4">
            {[40, 70, 45, 90, 65, 80, 55].map((h, i) => (
              <div key={i} className="flex-grow flex flex-col items-center gap-2">
                <div 
                  className="w-full bg-gradient-to-t from-indigo-600 to-violet-500 rounded-t-lg transition-all duration-1000"
                  style={{ height: `${h}%` }}
                />
                <span className="text-[10px] text-slate-500 font-bold">Week {i + 1}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Distribution Placeholder */}
        <div className="bg-slate-900/50 border border-white/10 rounded-3xl p-8 backdrop-blur-sm">
          <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-8">
            <PieChartIcon className="text-amber-400 w-5 h-5" /> Submission Status
          </h3>
          <div className="flex items-center justify-center h-64 relative">
             <div className="w-48 h-48 rounded-full border-[16px] border-indigo-500/20 flex items-center justify-center">
                <div className="w-40 h-40 rounded-full border-[16px] border-amber-500/20 flex items-center justify-center">
                   <div className="w-32 h-32 rounded-full border-[16px] border-emerald-500/40" />
                </div>
             </div>
             <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-bold text-white tracking-tight">Total</span>
                <span className="text-slate-400 text-sm">4,829</span>
             </div>
          </div>
          <div className="mt-4 grid grid-cols-3 gap-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-emerald-500" />
              <span className="text-[10px] text-slate-400 font-bold uppercase">Graded</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-amber-500" />
              <span className="text-[10px] text-slate-400 font-bold uppercase">Pending</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-indigo-500" />
              <span className="text-[10px] text-slate-400 font-bold uppercase">Returned</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;

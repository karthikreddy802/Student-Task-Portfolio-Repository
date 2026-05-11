import React from 'react';
import { motion } from 'framer-motion';
import { 
  Users, ClipboardList, MessageSquare, 
  Search, UserCheck, Star, Clock 
} from 'lucide-react';

const TeacherPanel = () => {
  const students = [
    { id: 1, name: 'Alice Johnson', tasks: 12, lastActive: '2h ago', status: 'On Track', grade: 'A' },
    { id: 2, name: 'Bob Smith', tasks: 8, lastActive: '5h ago', status: 'Needs Help', grade: 'B-' },
    { id: 3, name: 'Charlie Davis', tasks: 15, lastActive: '10m ago', status: 'Excellent', grade: 'A+' },
  ];

  return (
    <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Teacher Panel</h1>
          <p className="text-slate-400 mt-1">Manage your students and review their progress.</p>
        </div>
      </header>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Total Students', value: '42', icon: Users, color: 'text-blue-400' },
          { label: 'Ungraded Tasks', value: '08', icon: ClipboardList, color: 'text-amber-400' },
          { label: 'New Messages', value: '14', icon: MessageSquare, color: 'text-emerald-400' },
        ].map((stat, i) => (
          <div key={i} className="bg-white/5 border border-white/10 p-6 rounded-2xl backdrop-blur-sm flex items-center gap-4">
            <div className="p-3 bg-white/5 rounded-xl">
              <stat.icon className={`w-6 h-6 ${stat.color}`} />
            </div>
            <div>
              <p className="text-slate-400 text-sm">{stat.label}</p>
              <p className="text-2xl font-bold text-white">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Student List */}
      <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-sm">
        <div className="p-6 border-b border-white/10 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-white">Student Enrollment</h2>
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
            <input 
              type="text" 
              placeholder="Search students..."
              className="w-full bg-slate-900/50 border border-slate-700 rounded-lg py-2 px-9 text-sm text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>
        </div>
        
        <div className="divide-y divide-white/10">
          {students.map((student) => (
            <motion.div 
              key={student.id}
              whileHover={{ bg: 'rgba(255, 255, 255, 0.05)' }}
              className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-6"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-500 flex items-center justify-center font-bold text-white">
                  {student.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <h3 className="text-white font-semibold">{student.name}</h3>
                  <div className="flex items-center gap-3 text-sm text-slate-400">
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {student.lastActive}</span>
                    <span className="flex items-center gap-1"><UserCheck className="w-3 h-3" /> {student.tasks} tasks</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-8">
                <div className="text-right">
                  <p className="text-xs text-slate-500 uppercase tracking-wider font-bold mb-1">Performance</p>
                  <span className={`px-2 py-1 rounded-md text-xs font-bold ${
                    student.status === 'Excellent' ? 'bg-emerald-500/10 text-emerald-400' :
                    student.status === 'On Track' ? 'bg-blue-500/10 text-blue-400' :
                    'bg-amber-500/10 text-amber-400'
                  }`}>
                    {student.status}
                  </span>
                </div>
                <div className="text-right">
                  <p className="text-xs text-slate-500 uppercase tracking-wider font-bold mb-1">Avg. Grade</p>
                  <p className="text-xl font-bold text-white flex items-center gap-1 justify-end">
                    <Star className="w-4 h-4 text-amber-400 fill-amber-400" /> {student.grade}
                  </p>
                </div>
                <button className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-all">
                  View Profile
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TeacherPanel;

import React, { useState, useEffect } from 'react';
import { 
  Users, Key, Shield, 
  Search, UserPlus, Mail,
  CheckCircle, XCircle, MoreVertical,
  Lock, RefreshCw, UserCheck, ChevronDown
} from 'lucide-react';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

const UserManagement = () => {
  const [activeTab, setActiveTab] = useState('directory'); // 'directory' or 'credentials'
  const [searchTerm, setSearchTerm] = useState('');
  
  // Mock data for users - in a real app, this would come from an admin-only API
  const [users, setUsers] = useState([
    { id: 1, name: 'Karthik Reddy', email: 'karthik@example.com', role: 'Student', status: 'Active', joined: '2026-05-10' },
    { id: 2, name: 'Dr. Raju', email: 'raju@example.com', role: 'Teacher', status: 'Active', joined: '2026-05-01' },
    { id: 3, name: 'Admin User', email: 'admin@hub.edu', role: 'Admin', status: 'Active', joined: '2026-04-15' },
  ]);

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">System User Control</h1>
          <p className="text-slate-400 mt-1">Manage global access, credentials, and user lifecycle.</p>
        </div>
        <div className="flex bg-slate-900/80 p-1 rounded-2xl border border-white/5">
          <button 
            onClick={() => setActiveTab('directory')}
            className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === 'directory' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
          >
            User Directory
          </button>
          <button 
            onClick={() => setActiveTab('credentials')}
            className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === 'credentials' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
          >
            Credential Manager
          </button>
        </div>
      </header>

      {activeTab === 'directory' ? (
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
            <div className="relative w-full md:max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
              <input 
                type="text" 
                placeholder="Search students, teachers, admins..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-900/50 border border-white/10 rounded-2xl py-3 pl-12 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
              />
            </div>
            <button className="flex items-center gap-2 bg-white text-slate-950 px-6 py-3 rounded-2xl font-bold hover:bg-indigo-50 transition-all">
              <UserPlus className="w-4 h-4" /> Create New User
            </button>
          </div>

          <div className="bg-slate-900/50 border border-white/5 rounded-3xl overflow-hidden backdrop-blur-md">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/5 bg-white/5">
                  <th className="p-5 text-slate-400 font-bold text-xs uppercase tracking-widest">User Details</th>
                  <th className="p-5 text-slate-400 font-bold text-xs uppercase tracking-widest">Role</th>
                  <th className="p-5 text-slate-400 font-bold text-xs uppercase tracking-widest">Status</th>
                  <th className="p-5 text-slate-400 font-bold text-xs uppercase tracking-widest">Joined Date</th>
                  <th className="p-5 text-slate-400 font-bold text-xs uppercase tracking-widest text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-white/5 transition-colors group">
                    <td className="p-5">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold">
                          {user.name[0]}
                        </div>
                        <div>
                          <p className="text-white font-bold">{user.name}</p>
                          <p className="text-slate-500 text-xs">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-5">
                      <span className={`px-2 py-1 rounded text-[10px] font-black uppercase ${
                        user.role === 'Admin' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' :
                        user.role === 'Teacher' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                        'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="p-5">
                      <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.5)]" />
                        <span className="text-slate-300 text-sm font-medium">{user.status}</span>
                      </div>
                    </td>
                    <td className="p-5 text-slate-500 text-sm">{user.joined}</td>
                    <td className="p-5 text-right">
                      <button className="p-2 text-slate-500 hover:text-white transition-colors">
                        <MoreVertical className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 bg-emerald-500/10 rounded-2xl">
              <Shield className="text-emerald-400 w-8 h-8" />
            </div>
            <h2 className="text-3xl font-black text-white tracking-tight">User Management</h2>
          </div>

          <div className="bg-slate-900/50 border border-white/5 p-8 rounded-[32px] backdrop-blur-xl shadow-2xl space-y-8">
            <div className="flex items-center gap-2">
              <UserPlus className="text-emerald-400 w-5 h-5" />
              <h3 className="text-xl font-bold text-white tracking-tight">Generate Credentials</h3>
            </div>

            <form className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <input 
                  type="text" 
                  placeholder="Username"
                  className="bg-slate-950/50 border border-white/10 rounded-2xl p-4 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 transition-all"
                />
                <input 
                  type="text" 
                  placeholder="ID Number"
                  className="bg-slate-950/50 border border-white/10 rounded-2xl p-4 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 transition-all"
                />
              </div>

              <input 
                type="email" 
                placeholder="Email Address"
                className="w-full bg-slate-950/50 border border-white/10 rounded-2xl p-4 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 transition-all"
              />

              <input 
                type="text" 
                placeholder="Department"
                className="w-full bg-slate-950/50 border border-white/10 rounded-2xl p-4 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 transition-all"
              />

              <div className="flex gap-4">
                <div className="relative flex-grow">
                  <select className="w-full bg-slate-950/50 border border-white/10 rounded-2xl p-4 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/30 appearance-none cursor-pointer">
                    <option value="Student">Student</option>
                    <option value="Teacher">Teacher</option>
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none w-5 h-5" />
                </div>
                <div className="bg-slate-950/50 border border-white/10 rounded-2xl p-4 text-slate-500 text-sm flex items-center justify-center shrink-0">
                  PWD: password123
                </div>
              </div>

              <button className="w-full py-5 bg-[#00a86b] hover:bg-[#00c980] text-white font-black rounded-2xl shadow-xl shadow-emerald-900/20 transition-all text-lg tracking-tight mt-4">
                Create Account
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;

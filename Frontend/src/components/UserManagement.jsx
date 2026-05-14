import React, { useState, useEffect } from 'react';
import { 
  Users, Key, Shield, 
  Search, UserPlus, Mail,
  CheckCircle, XCircle, MoreVertical,
  Lock, RefreshCw, UserCheck, ChevronDown
} from 'lucide-react';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { userApi, authApi } from '../api';

const UserManagement = () => {
  const [activeTab, setActiveTab] = useState('directory'); // 'directory' or 'credentials'
  const [searchTerm, setSearchTerm] = useState('');
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeMenu, setActiveMenu] = useState(null);
  
  // Create Form State
  const [createForm, setCreateForm] = useState({
    username: '',
    email: '',
    id_number: '',
    department: '',
    role: 'Student',
    password: 'password123'
  });

  // Edit Modal State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await userApi.getAll();
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    try {
      await authApi.register(createForm);
      toast.success('User created successfully!');
      setCreateForm({
        username: '',
        email: '',
        id_number: '',
        department: '',
        role: 'Student',
        password: 'password123'
      });
      fetchUsers();
      setActiveTab('directory');
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to create user');
    }
  };

  // Delete Confirmation State
  const [confirmDelete, setConfirmDelete] = useState(null);

  const handleDeleteUser = async (id) => {
    try {
      await userApi.delete(id);
      toast.success('User deleted');
      setConfirmDelete(null);
      fetchUsers();
    } catch (error) {
      toast.error('Failed to delete user');
    }
    setActiveMenu(null);
  };

  const openEditModal = (user) => {
    setEditingUser({ ...user });
    setIsEditModalOpen(true);
    setActiveMenu(null);
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    try {
      await userApi.update(editingUser.id, editingUser);
      toast.success('User updated successfully');
      setIsEditModalOpen(false);
      fetchUsers();
    } catch (error) {
      toast.error('Failed to update user');
    }
  };

  const filteredUsers = users.filter(u => 
    (u.username?.toLowerCase().includes(searchTerm.toLowerCase()) || 
     u.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
     (u.first_name + ' ' + u.last_name).toLowerCase().includes(searchTerm.toLowerCase()))
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
                {loading ? (
                  <tr><td colSpan="5" className="p-10 text-center text-slate-500">Loading users...</td></tr>
                ) : filteredUsers.length === 0 ? (
                  <tr><td colSpan="5" className="p-10 text-center text-slate-500">No users found</td></tr>
                ) : filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-white/5 transition-colors group">
                    <td className="p-5">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold">
                          {user.username?.[0] || 'U'}
                        </div>
                        <div>
                          <p className="text-white font-bold">{user.first_name} {user.last_name || user.username}</p>
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
                        <span className="text-slate-300 text-sm font-medium">Active</span>
                      </div>
                    </td>
                    <td className="p-5 text-slate-500 text-sm">Recently</td>
                    <td className="p-5 text-right relative">
                      <button 
                        onClick={() => setActiveMenu(activeMenu === user.id ? null : user.id)}
                        className="p-2 text-slate-500 hover:text-white transition-colors"
                      >
                        <MoreVertical className="w-5 h-5" />
                      </button>
                      
                      <AnimatePresence>
                        {activeMenu === user.id && (
                          <motion.div 
                            initial={{ opacity: 0, scale: 0.9, y: -10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: -10 }}
                            className="absolute right-10 top-12 z-50 bg-slate-900 border border-white/10 rounded-2xl shadow-2xl overflow-hidden min-w-[140px]"
                          >
                            <button 
                              onClick={() => openEditModal(user)}
                              className="w-full text-left px-4 py-3 text-sm text-slate-300 hover:bg-white/5 hover:text-white transition-colors flex items-center gap-2"
                            >
                              <Shield className="w-4 h-4" /> Edit User
                            </button>
                            
                            {confirmDelete === user.id ? (
                              <div className="bg-rose-500/10 p-2 space-y-2 border-t border-white/5">
                                <p className="text-[10px] text-rose-400 font-bold px-2">Confirm Delete?</p>
                                <div className="flex gap-1">
                                  <button 
                                    onClick={() => handleDeleteUser(user.id)}
                                    className="flex-1 py-1 text-[10px] bg-rose-500 text-white rounded font-bold hover:bg-rose-600 transition-colors"
                                  >
                                    Yes
                                  </button>
                                  <button 
                                    onClick={() => setConfirmDelete(null)}
                                    className="flex-1 py-1 text-[10px] bg-slate-800 text-white rounded font-bold hover:bg-slate-700 transition-colors"
                                  >
                                    No
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <button 
                                onClick={() => setConfirmDelete(user.id)}
                                className="w-full text-left px-4 py-3 text-sm text-rose-400 hover:bg-rose-500/10 transition-colors flex items-center gap-2"
                              >
                                <XCircle className="w-4 h-4" /> Delete User
                              </button>
                            )}
                          </motion.div>
                        )}
                      </AnimatePresence>
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

            <form onSubmit={handleCreateUser} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <input 
                  type="text" 
                  placeholder="Username"
                  value={createForm.username}
                  onChange={(e) => setCreateForm({...createForm, username: e.target.value})}
                  className="bg-slate-950/50 border border-white/10 rounded-2xl p-4 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 transition-all"
                  required
                />
                <input 
                  type="text" 
                  placeholder="ID Number"
                  value={createForm.id_number}
                  onChange={(e) => setCreateForm({...createForm, id_number: e.target.value})}
                  className="bg-slate-950/50 border border-white/10 rounded-2xl p-4 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 transition-all"
                  required
                />
              </div>

              <input 
                type="email" 
                placeholder="Email Address"
                value={createForm.email}
                onChange={(e) => setCreateForm({...createForm, email: e.target.value})}
                className="w-full bg-slate-950/50 border border-white/10 rounded-2xl p-4 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 transition-all"
                required
              />

              <input 
                type="text" 
                placeholder="Department"
                value={createForm.department}
                onChange={(e) => setCreateForm({...createForm, department: e.target.value})}
                className="w-full bg-slate-950/50 border border-white/10 rounded-2xl p-4 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 transition-all"
                required
              />

              <div className="flex gap-4">
                <div className="relative flex-grow">
                  <select 
                    value={createForm.role}
                    onChange={(e) => setCreateForm({...createForm, role: e.target.value})}
                    className="w-full bg-slate-950/50 border border-white/10 rounded-2xl p-4 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/30 appearance-none cursor-pointer"
                  >
                    <option value="Student">Student</option>
                    <option value="Teacher">Teacher</option>
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none w-5 h-5" />
                </div>
                <div className="bg-slate-950/50 border border-white/10 rounded-2xl p-4 text-slate-500 text-sm flex items-center justify-center shrink-0">
                  PWD: {createForm.password}
                </div>
              </div>

              <button type="submit" className="w-full py-5 bg-[#00a86b] hover:bg-[#00c980] text-white font-black rounded-2xl shadow-xl shadow-emerald-900/20 transition-all text-lg tracking-tight mt-4">
                Create Account
              </button>
            </form>
          </div>
        </div>
      )}
      {/* Edit User Modal */}
      <AnimatePresence>
        {isEditModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsEditModalOpen(false)}
              className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg bg-slate-900 border border-white/10 rounded-[32px] p-8 shadow-2xl overflow-hidden"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-black text-white">Edit User</h3>
                <button 
                  onClick={() => setIsEditModalOpen(false)}
                  className="p-2 hover:bg-white/5 rounded-full text-slate-500 hover:text-white transition-colors"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleUpdateUser} className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Username</label>
                  <input 
                    type="text" 
                    value={editingUser?.username || ''}
                    disabled
                    className="w-full bg-slate-950/50 border border-white/5 rounded-2xl p-4 text-slate-500 cursor-not-allowed mt-1"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">First Name</label>
                    <input 
                      type="text" 
                      value={editingUser?.first_name || ''}
                      onChange={(e) => setEditingUser({...editingUser, first_name: e.target.value})}
                      className="w-full bg-slate-950/50 border border-white/10 rounded-2xl p-4 text-white focus:ring-2 focus:ring-indigo-500/30 transition-all mt-1"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Last Name</label>
                    <input 
                      type="text" 
                      value={editingUser?.last_name || ''}
                      onChange={(e) => setEditingUser({...editingUser, last_name: e.target.value})}
                      className="w-full bg-slate-950/50 border border-white/10 rounded-2xl p-4 text-white focus:ring-2 focus:ring-indigo-500/30 transition-all mt-1"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Email Address</label>
                  <input 
                    type="email" 
                    value={editingUser?.email || ''}
                    onChange={(e) => setEditingUser({...editingUser, email: e.target.value})}
                    className="w-full bg-slate-950/50 border border-white/10 rounded-2xl p-4 text-white focus:ring-2 focus:ring-indigo-500/30 transition-all mt-1"
                  />
                </div>

                <div className="pt-4">
                  <button type="submit" className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-black rounded-2xl shadow-xl shadow-indigo-900/20 transition-all">
                    Save Changes
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default UserManagement;

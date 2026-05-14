import React, { useState } from 'react';
import { 
  Search, Bell, ChevronDown, 
  User, Settings, LogOut, 
  HelpCircle, Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api, { notificationApi } from '../api';
import { useEffect } from 'react';

const Navbar = () => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [avatar, setAvatar] = useState(null);
  const navigate = useNavigate();
  const username = localStorage.getItem('username') || 'Student';
  const role = localStorage.getItem('userRole') || 'Student';
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    if (userId && userId !== 'undefined') {
      fetchNotifications();
      fetchProfile();
    }
  }, [userId]);

  const fetchProfile = async () => {
    try {
      const res = await api.get('/profiles/');
      const allProfiles = Array.isArray(res.data) ? res.data : res.data.results || [];
      const myProfile = allProfiles.find(p => p.user.id == userId);
      if (myProfile?.avatar) setAvatar(myProfile.avatar);
    } catch (err) {
      console.error('Failed to fetch profile for avatar');
    }
  };

  const fetchNotifications = async () => {
    try {
      const res = await notificationApi.getAll(userId);
      setNotifications(Array.isArray(res.data) ? res.data : res.data.results || []);
    } catch (err) {
      console.error('Failed to fetch notifications');
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      await notificationApi.markAsRead(id);
      fetchNotifications();
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  const handleSearch = (e) => {
    if (e.key === 'Enter' && e.target.value.trim()) {
      toast.success(`Searching for: ${e.target.value}`);
      // In a real app, this would navigate to a search results page
    }
  };

  return (
    <nav className="h-20 border-b border-white/10 flex items-center justify-between px-8 bg-slate-900/20 backdrop-blur-md sticky top-0 z-40">
      {/* Left: Search Bar */}
      <div className="relative flex-grow max-w-md hidden md:block">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
        <input 
          type="text" 
          placeholder="Quick search projects, tasks..." 
          onKeyDown={handleSearch}
          className="w-full bg-white/5 border border-white/10 rounded-2xl py-2.5 pl-11 pr-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all"
        />
      </div>

      {/* Right: Actions & Profile */}
      <div className="flex items-center gap-6">
        {/* AI Assistant Indicator */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-indigo-500/10 border border-indigo-500/20 rounded-full">
          <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
          <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">AI Active</span>
        </div>

        {/* Notifications */}
        <div className="relative">
          <button 
            onClick={() => setIsNotifOpen(!isNotifOpen)}
            aria-label="View Notifications"
            className="relative p-2 text-slate-400 hover:text-white transition-colors"
          >
            <Bell className="w-5 h-5" />
            {notifications.some(n => !n.is_read) && (
              <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-[#0f172a]" />
            )}
          </button>

          <AnimatePresence>
            {isNotifOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setIsNotifOpen(false)} />
                <motion.div 
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute right-0 mt-3 w-80 bg-slate-900 border border-white/10 rounded-2xl shadow-2xl z-20 p-4 overflow-hidden backdrop-blur-xl"
                >
                  <h3 className="text-white font-bold mb-4 px-2">Notifications</h3>
                  <div className="space-y-2 max-h-[400px] overflow-y-auto pr-1">
                    {notifications.length > 0 ? notifications.map(n => (
                      <div 
                        key={n.id} 
                        onClick={() => handleMarkAsRead(n.id)}
                        className={`p-3 rounded-xl border transition-all cursor-pointer ${
                          n.is_read 
                            ? 'bg-white/2 border-white/5 opacity-60' 
                            : 'bg-white/5 border-white/10 hover:border-indigo-500/30 shadow-lg shadow-indigo-500/5'
                        }`}
                      >
                        <p className="text-sm font-bold text-white flex justify-between items-center">
                          {n.title}
                          {!n.is_read && <span className="w-2 h-2 bg-indigo-500 rounded-full" />}
                        </p>
                        <p className="text-xs text-slate-400 mt-1 leading-relaxed">{n.message}</p>
                        <p className="text-[10px] text-indigo-400 mt-2 font-medium">
                          {new Date(n.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    )) : (
                      <div className="py-10 text-center text-slate-500 text-sm italic">
                        No new notifications
                      </div>
                    )}
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>

        {/* Vertical Divider */}
        <div className="h-8 w-px bg-white/10 mx-2" />

        {/* Profile Dropdown */}
        <div className="relative">
          <button 
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            aria-label="Open Profile Menu"
            className="flex items-center gap-3 p-1.5 rounded-2xl hover:bg-white/5 transition-all group"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-500 p-0.5 shadow-lg shadow-indigo-500/20">
              <div className="w-full h-full rounded-[10px] bg-slate-900 flex items-center justify-center overflow-hidden">
                <img 
                  src={avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`} 
                  alt={`${username}'s avatar`} 
                  loading="lazy"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            <div className="text-left hidden sm:block">
              <p className="text-sm font-bold text-white leading-tight">{username}</p>
              <p className="text-[10px] font-medium text-slate-500 uppercase tracking-tighter">{role}</p>
            </div>
            <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
          </button>

          <AnimatePresence>
            {isProfileOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setIsProfileOpen(false)} />
                <motion.div 
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute right-0 mt-3 w-56 bg-slate-900 border border-white/10 rounded-2xl shadow-2xl z-20 p-2 overflow-hidden backdrop-blur-xl"
                >
                  <div className="px-4 py-3 border-b border-white/5 mb-2">
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Account Settings</p>
                  </div>
                  
                  {[
                    { icon: User, label: 'My Profile', path: '/profile' },
                    { icon: Settings, label: 'Preferences', path: '/profile' },
                    { icon: HelpCircle, label: 'Help Center', path: '#' },
                  ].map((item, i) => (
                    <button 
                      key={i} 
                      onClick={() => {
                        setIsProfileOpen(false);
                        if (item.path !== '#') navigate(item.path);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-slate-300 hover:text-white hover:bg-white/5 transition-all text-sm"
                    >
                      <item.icon className="w-4 h-4" /> {item.label}
                    </button>
                  ))}

                  <div className="h-px bg-white/5 my-2" />
                  
                  <button 
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-rose-400 hover:bg-rose-500/10 transition-all text-sm font-bold"
                  >
                    <LogOut className="w-4 h-4" /> Sign Out
                  </button>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

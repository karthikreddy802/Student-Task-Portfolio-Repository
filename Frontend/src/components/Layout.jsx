import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, Send, UserCircle, 
  GraduationCap, Settings, LogOut, Menu, X 
} from 'lucide-react';
import Navbar from './Navbar';

const Layout = ({ children }) => {
  const [isOpen, setIsOpen] = useState(true);
  const location = useLocation();

  const role = localStorage.getItem('userRole') || 'Student';

  const menuItems = [
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, roles: ['Student'] },
    { path: '/submissions', label: 'Submissions', icon: Send, roles: ['Student'] },
    { path: '/portfolio', label: 'Portfolio', icon: UserCircle, roles: ['Student', 'Teacher', 'Admin'] },
    { path: '/teacher', label: 'Teacher Panel', icon: GraduationCap, roles: ['Teacher', 'Admin'] },
    { path: '/admin', label: 'Admin Panel', icon: Settings, roles: ['Admin'] },
  ].filter(item => item.roles.includes(role));

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-200 flex">
      {/* Sidebar */}
      <aside 
        className={`${
          isOpen ? 'w-64' : 'w-20'
        } bg-slate-900/50 border-r border-white/10 transition-all duration-300 relative z-50 backdrop-blur-xl hidden md:flex flex-col`}
      >
        <div className="p-6 flex items-center gap-3">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shrink-0">
            <GraduationCap className="text-white w-5 h-5" />
          </div>
          {isOpen && <span className="font-bold text-xl tracking-tight text-white">Hub</span>}
        </div>

        <nav className="flex-grow px-3 space-y-1 mt-4">
          {menuItems.map((item) => (
            <Link key={item.path} to={item.path}>
              <div className={`
                flex items-center gap-3 px-3 py-3 rounded-xl transition-all group
                ${location.pathname === item.path 
                  ? 'bg-indigo-600/10 text-indigo-400 border border-indigo-500/20' 
                  : 'text-slate-400 hover:text-white hover:bg-white/5'}
              `}>
                <item.icon className={`w-5 h-5 shrink-0 ${location.pathname === item.path ? 'text-indigo-400' : 'group-hover:text-white'}`} />
                {isOpen && <span className="font-medium">{item.label}</span>}
                {location.pathname === item.path && isOpen && (
                  <motion.div layoutId="active" className="ml-auto w-1 h-1 bg-indigo-400 rounded-full" />
                )}
              </div>
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-white/10">
          <div 
            onClick={() => {
              localStorage.clear();
              window.location.href = '/';
            }}
            className="flex items-center gap-3 px-3 py-3 rounded-xl text-rose-400 hover:bg-rose-500/10 transition-all group cursor-pointer"
          >
            <LogOut className="w-5 h-5 shrink-0" />
            {isOpen && <span className="font-medium">Logout</span>}
          </div>
        </div>
        
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="absolute -right-3 top-20 w-6 h-6 bg-indigo-600 rounded-full flex items-center justify-center text-white border border-slate-900"
        >
          {isOpen ? <X className="w-3 h-3" /> : <Menu className="w-3 h-3" />}
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-grow overflow-y-auto max-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow max-w-7xl w-full mx-auto p-4 md:p-8">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;

import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, Send, UserCircle, 
  GraduationCap, Settings, LogOut, Menu, X,
  Bell, Calendar, ClipboardList, Briefcase,
  Users, Layers, BookOpen, PieChart, 
  ChevronDown, ChevronRight, Star, History,
  Shield, Server, Activity, Database, Key
} from 'lucide-react';
import Navbar from './Navbar';

const SidebarSection = ({ title, children, isOpen }) => (
  <div className="mb-6">
    {isOpen && (
      <h3 className="px-4 mb-2 text-[10px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
        <span className="w-4 h-[1px] bg-slate-800"></span>
        {title}
      </h3>
    )}
    <div className="space-y-1">
      {children}
    </div>
  </div>
);

const NavItem = ({ path, icon: Icon, label, isOpen, active, badge, subItems }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const location = useLocation();
  const hasSubItems = subItems && subItems.length > 0;

  return (
    <div className="px-3">
      <Link 
        to={path} 
        onClick={() => {
          if (hasSubItems && isOpen) {
            setIsExpanded(!isExpanded);
          }
        }}
      >
        <div className={`
          flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group relative
          ${active 
            ? 'bg-indigo-600/10 text-indigo-400 border border-indigo-500/20' 
            : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'}
        `}
        aria-current={active ? 'page' : undefined}
        >
          <Icon className={`w-5 h-5 shrink-0 transition-colors ${active ? 'text-indigo-400' : 'group-hover:text-white'}`} />
          {isOpen && (
            <>
              <span className="font-medium text-sm flex-grow">{label}</span>
              {badge && (
                <span className="px-1.5 py-0.5 rounded-md bg-indigo-500/20 text-indigo-400 text-[10px] font-bold">
                  {badge}
                </span>
              )}
              {hasSubItems && (
                isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />
              )}
            </>
          )}
          {!isOpen && active && (
             <motion.div layoutId="active-pill" className="absolute left-0 w-1 h-6 bg-indigo-500 rounded-r-full" />
          )}
        </div>
      </Link>
      
      <AnimatePresence>
        {isOpen && hasSubItems && isExpanded && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden ml-9 mt-1 space-y-1 border-l border-white/5"
          >
            {subItems.map((sub, i) => {
              const isSubActive = location.pathname + location.search === sub.path || location.pathname === sub.path;
              return (
                <Link key={i} to={sub.path}>
                  <div className={`
                    py-2 px-3 text-xs transition-colors flex items-center gap-2
                    ${isSubActive ? 'text-indigo-400 font-bold' : 'text-slate-500 hover:text-indigo-400'}
                  `}>
                    <div className={`w-1 h-1 rounded-full ${isSubActive ? 'bg-indigo-400' : 'bg-slate-700'}`} />
                    {sub.label}
                  </div>
                </Link>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const Layout = ({ children }) => {
  const [isOpen, setIsOpen] = useState(true);
  const location = useLocation();
  const role = localStorage.getItem('userRole') || 'Student';

  const sections = [
    {
      title: 'Main',
      roles: ['Student', 'Teacher', 'Admin'],
      items: [
        { path: role === 'Student' ? '/dashboard' : (role === 'Admin' ? '/admin' : '/teacher-dashboard'), label: 'Dashboard', icon: LayoutDashboard },
        { path: '/calendar', label: 'Calendar', icon: Calendar, roles: ['Student', 'Teacher'] },
      ]
    },
    {
      title: 'Task Management',
      roles: ['Student', 'Teacher'],
      items: [
        { 
          path: '/teacher/tasks', 
          label: 'Tasks', 
          icon: ClipboardList,
          roles: ['Teacher'],
          subItems: [
            { label: 'Create Task', path: '/teacher/tasks?action=create' },
            { label: 'Manage Tasks', path: '/teacher/tasks' }
          ]
        },
        { path: '/submissions', label: 'All Submissions', icon: Send },
      ]
    },
    {
      title: 'Evaluation',
      roles: ['Student'],
      items: [
        { path: '/submissions?view=grades', label: 'My Grades', icon: Star },
        { path: '/submissions?view=feedback', label: 'Feedback', icon: History },
      ]
    },
    {
      title: 'Evaluation',
      roles: ['Teacher'],
      items: [
        { path: '/teacher', label: 'Evaluation Hub', icon: Shield },
      ]
    },
    {
      title: 'Portfolio',
      roles: ['Student'],
      items: [
        { path: '/portfolio', label: 'AI Portfolio', icon: Briefcase },
      ]
    },
    {
      title: 'Management',
      roles: ['Admin'],
      items: [
        { path: '/admin/users', label: 'User Directory', icon: Users },
        { path: '/admin/users', label: 'Credential Manager', icon: Key },
        { path: '/admin', label: 'Academic Batches', icon: Layers },
      ]
    },
    {
      title: 'System',
      roles: ['Admin'],
      items: [
        { path: '/admin', label: 'Analytics', icon: PieChart },
        { path: '/admin', label: 'System Health', icon: Activity },
        { path: '/admin', label: 'Settings', icon: Settings },
      ]
    }
  ];

  const visibleSections = sections.filter(s => s.roles.includes(role));

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 flex overflow-hidden">
      {/* Sidebar */}
      <aside 
        className={`${
          isOpen ? 'w-64' : 'w-20'
        } bg-slate-950 border-r border-white/5 transition-all duration-300 relative z-50 flex flex-col`}
      >
        {/* Logo */}
        <div className="p-6 mb-4 flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-violet-700 rounded-xl flex items-center justify-center shrink-0 shadow-lg shadow-indigo-500/20">
            <GraduationCap className="text-white w-6 h-6" />
          </div>
          {isOpen && (
            <div className="flex flex-col">
              <span className="font-black text-xl tracking-tighter text-white">HUB</span>
              <span className="text-[8px] font-bold text-indigo-500 uppercase tracking-widest -mt-1">Academic OS</span>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-grow overflow-y-auto px-1 custom-scrollbar">
          {visibleSections.map((section, idx) => (
            <SidebarSection key={idx} title={section.title} isOpen={isOpen}>
              {section.items.map((item, i) => (
                <NavItem 
                  key={i}
                  {...item}
                  isOpen={isOpen}
                  active={location.pathname + location.search === item.path || location.pathname === item.path}
                />
              ))}
            </SidebarSection>
          ))}
        </nav>

        {/* Footer Actions */}
        <div className="p-4 border-t border-white/5 space-y-2">
          <NavItem 
            to="/profile" 
            label="My Profile" 
            icon={UserCircle} 
            isOpen={isOpen} 
            active={location.pathname === '/profile'} 
          />
          <div 
            onClick={() => {
              localStorage.clear();
              window.location.href = '/';
            }}
            className="flex items-center gap-3 px-3 py-3 mx-3 rounded-xl text-rose-500 hover:bg-rose-500/10 transition-all group cursor-pointer"
          >
            <LogOut className="w-5 h-5 shrink-0" />
            {isOpen && <span className="font-bold text-sm">Sign Out</span>}
          </div>
        </div>
        
        {/* Toggle Button */}
        <button 
          onClick={() => setIsOpen(!isOpen)}
          aria-label={isOpen ? "Collapse Sidebar" : "Expand Sidebar"}
          className="absolute -right-3 top-24 w-6 h-6 bg-slate-900 rounded-full flex items-center justify-center text-slate-400 hover:text-white border border-white/10 shadow-xl transition-all hover:scale-110"
        >
          {isOpen ? <X className="w-3 h-3" /> : <Menu className="w-3 h-3" />}
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-grow overflow-hidden flex flex-col bg-[#020617]">
        <Navbar />
        <div className="flex-grow overflow-y-auto bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-900/10 via-slate-950 to-slate-950">
          <div className="max-w-7xl w-full mx-auto p-4 md:p-8">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Layout;

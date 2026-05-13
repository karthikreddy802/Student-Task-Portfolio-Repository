import React, { useState, useEffect } from 'react';
import { Bell, CheckCircle, Info, AlertTriangle, Clock } from 'lucide-react';
import { notificationApi } from '../api';
import toast from 'react-hot-toast';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const userId = localStorage.getItem('userId');
      const res = await notificationApi.getAll(userId);
      setNotifications(res.data);
    } catch (err) {
      toast.error('Failed to load notifications');
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id) => {
    try {
      await notificationApi.markAsRead(id);
      setNotifications(notifications.filter(n => n.id !== id));
      toast.success('Notification cleared');
    } catch (err) {
      toast.error('Failed to mark as read');
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case 'Success': return { icon: CheckCircle, color: 'text-emerald-400', bg: 'bg-emerald-500/10' };
      case 'Warning': return { icon: AlertTriangle, color: 'text-amber-400', bg: 'bg-amber-500/10' };
      default: return { icon: Info, color: 'text-indigo-400', bg: 'bg-indigo-500/10' };
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in slide-in-from-bottom-4 duration-500">
      <header>
        <h1 className="text-3xl font-bold text-white tracking-tight">Notifications</h1>
        <p className="text-slate-400 mt-1">Stay updated with your academic progress and tasks.</p>
      </header>

      <div className="space-y-4">
        {notifications.map((notif) => {
          const { icon: Icon, color, bg } = getIcon(notif.notification_type);
          return (
            <div 
              key={notif.id} 
              className="group bg-slate-900/50 border border-white/10 rounded-2xl p-6 backdrop-blur-sm hover:border-white/20 transition-all cursor-pointer flex gap-6"
            >
              <div className={`p-3 rounded-xl shrink-0 ${bg}`}>
                <Icon className={`w-6 h-6 ${color}`} />
              </div>
              <div className="flex-grow">
                <div className="flex justify-between items-start">
                  <h3 className="text-white font-bold text-lg group-hover:text-indigo-400 transition-colors">{notif.title}</h3>
                  <span className="text-slate-500 text-xs flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {new Date(notif.created_at).toLocaleTimeString()}
                  </span>
                </div>
                <p className="text-slate-400 mt-1 leading-relaxed">{notif.message}</p>
                <div className="mt-4 flex gap-3">
                  <button 
                    onClick={() => markAsRead(notif.id)}
                    className="text-xs font-bold text-indigo-400 hover:text-white transition-colors"
                  >
                    Mark as read
                  </button>
                  <button 
                    onClick={() => window.location.href = '/submissions'}
                    className="text-xs font-bold text-slate-500 hover:text-white transition-colors"
                  >
                    View details
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      {notifications.length === 0 && (
        <div className="py-20 text-center">
          <Bell className="w-16 h-16 text-slate-700 mx-auto mb-4" />
          <p className="text-slate-500 font-medium text-lg">You're all caught up!</p>
          <p className="text-slate-600 text-sm">No new notifications at this time.</p>
        </div>
      )}
    </div>
  );
};

export default Notifications;

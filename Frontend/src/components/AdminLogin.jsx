import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, Lock, Eye, Globe, ArrowRight } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { authApi } from '../api';

const AdminLogin = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const email = e.target.querySelector('input[type="text"]').value;
    const password = e.target.querySelector('input[type="password"]').value;
    
    try {
      const res = await authApi.login({ username: email, password });
      const { access, refresh, role } = res.data;

      localStorage.setItem('accessToken', access);
      localStorage.setItem('refreshToken', refresh);
      localStorage.setItem('userRole', role);
      localStorage.setItem('username', res.data.username);
      localStorage.setItem('userId', res.data.user_id);
      
      if (role !== 'Admin') {
         toast.error('Unauthorized access. Admin only.');
         return;
      }

      toast.success(`System Access Granted`);
      navigate('/admin');
    } catch (err) {
      console.error(err);
      toast.error('Invalid Administrator credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-6">
      <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
        
        {/* Left Side: Branding */}
        <div className="hidden lg:block relative">
          <div className="relative z-10 space-y-2">
            <h1 className="text-6xl font-bold text-white tracking-tight leading-tight">
              Admin <br />
              <span className="text-purple-500">Console</span>
            </h1>
            <p className="text-slate-400 text-lg font-light">
              Student Task & Portfolio Repository
            </p>
          </div>
          <div className="absolute -top-20 -left-20 w-[450px] h-[450px] bg-gradient-to-br from-purple-500/20 to-rose-900/10 rounded-full blur-3xl -z-0" />
        </div>

        {/* Right Side: Login Card */}
        <div className="flex justify-center lg:justify-end">
          <motion.div 
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-[420px] bg-[#0d121d] border border-purple-500/10 rounded-3xl p-10 shadow-2xl"
          >
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-purple-500/10 border border-purple-500/20 rounded-2xl flex items-center justify-center">
                <Shield className="text-purple-500 w-8 h-8" />
              </div>
            </div>
            <h2 className="text-2xl font-semibold text-white text-center mb-8 uppercase tracking-widest">Admin Login</h2>

            <form onSubmit={handleSubmit} className="space-y-5">
              <input 
                type="text" 
                required
                placeholder="ADMIN_ID"
                className="w-full bg-[#1b222f] border-none rounded-xl py-4 px-5 text-white font-mono placeholder:text-slate-500 focus:ring-2 focus:ring-purple-500/50 transition-all"
              />
              <div className="relative">
                <input 
                  type={showPassword ? "text" : "password"} 
                  required
                  placeholder="••••••••"
                  className="w-full bg-[#1b222f] border-none rounded-xl py-4 px-5 text-white placeholder:text-slate-500 focus:ring-2 focus:ring-purple-500/50 transition-all"
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"
                >
                  <Eye className="w-5 h-5" />
                </button>
              </div>

              <button 
                disabled={loading}
                className="w-full bg-purple-600 hover:bg-purple-500 text-white font-bold py-4 rounded-xl shadow-lg shadow-purple-500/20 uppercase tracking-widest transition-all disabled:opacity-50"
              >
                {loading ? 'Decrypting...' : 'Initiate Secure Login'}
              </button>
            </form>

            <div className="mt-8 pt-6 border-t border-white/5 text-center">
              <Link to="/" className="text-slate-600 hover:text-purple-400 text-xs transition-colors uppercase tracking-widest">
                Return to Public Portal
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;

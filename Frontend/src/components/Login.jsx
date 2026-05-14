import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Lock, Eye, ArrowRight } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { authApi } from '../api';
import SEO from './SEO';

const Login = () => {
  const navigate = useNavigate();
  const [isResetMode, setIsResetMode] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const { username, password } = e.target.elements;
    
    try {
      const res = await authApi.login({ 
        username: username.value, 
        password: password.value 
      });
      const { access, refresh, role } = res.data;

      localStorage.setItem('accessToken', access);
      localStorage.setItem('refreshToken', refresh);
      localStorage.setItem('userRole', role);
      localStorage.setItem('username', res.data.username);
      localStorage.setItem('userId', res.data.user_id);
      
      toast.success(`Welcome back, Student!`);
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      toast.error('Invalid Student credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async (e) => {
    e.preventDefault();
    setResetLoading(true);
    const { username, email, new_password } = e.target.elements;

    try {
      await authApi.passwordReset({
        username: username.value,
        email: email.value,
        new_password: new_password.value
      });
      toast.success('Password reset successfully! Please login.');
      setIsResetMode(false);
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to reset password.');
    } finally {
      setResetLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-6">
      <SEO 
        title="Student Login" 
        description="Access your academic portal, manage your student tasks, and build your professional portfolio with HUB OS."
      />
      <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
        
        {/* Left Side: Branding */}
        <div className="hidden lg:block relative">
          <div className="relative z-10 space-y-2">
            <h1 className="text-6xl font-bold text-white tracking-tight leading-tight">
              Student Task <br />
              <span className="text-[#00df82]">& Portfolio</span>
            </h1>
            <p className="text-slate-400 text-lg font-light">
              Repository Platform
            </p>
          </div>
          
          {/* Decorative Circle */}
          <div className="absolute -top-20 -left-20 w-[450px] h-[450px] bg-gradient-to-br from-emerald-500/20 to-teal-900/10 rounded-full blur-3xl -z-0" />
          <div className="absolute top-1/2 -translate-y-1/2 -left-10 w-80 h-80 border border-emerald-500/10 rounded-full -z-0" />
        </div>

        {/* Right Side: Login Card */}
        <div className="flex justify-center lg:justify-end">
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="w-full max-w-[420px] bg-[#0d121d] border border-white/5 rounded-3xl p-10 shadow-2xl"
          >
            <h2 className="text-2xl font-semibold text-white text-center mb-8">
              {isResetMode ? 'Reset Password' : 'Student Login'}
            </h2>

            {!isResetMode ? (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-1">
                  <input 
                    name="username"
                    type="text" 
                    required
                    placeholder="Username or Student ID"
                    className="w-full bg-[#1b222f] border-none rounded-xl py-4 px-5 text-white placeholder:text-slate-500 focus:ring-2 focus:ring-[#00df82]/50 transition-all"
                  />
                </div>

                <div className="space-y-1 relative">
                  <input 
                    name="password"
                    type={showPassword ? "text" : "password"} 
                    required
                    placeholder="Password"
                    className="w-full bg-[#1b222f] border-none rounded-xl py-4 px-5 pr-12 text-white placeholder:text-slate-500 focus:ring-2 focus:ring-[#00df82]/50 transition-all"
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
                  >
                    <Eye className="w-5 h-5" />
                  </button>
                </div>

                <div className="flex justify-between items-center text-xs px-1">
                  <button 
                    type="button" 
                    onClick={() => setIsResetMode(true)}
                    className="text-slate-500 hover:text-white transition-colors"
                  >
                    Forgot password?
                  </button>
                  <a href="#" className="text-slate-500 hover:text-white transition-colors">OTP Login</a>
                </div>

                <button 
                  disabled={loading}
                  className="w-full bg-[#00df82] hover:bg-[#00c572] text-black font-bold py-4 rounded-xl shadow-lg shadow-emerald-500/10 uppercase tracking-wider transition-all disabled:opacity-50"
                >
                  {loading ? 'Authenticating...' : 'Sign In'}
                </button>
              </form>
            ) : (
              <form onSubmit={handleReset} className="space-y-5">
                <div className="space-y-1">
                  <input 
                    name="username"
                    type="text" 
                    required
                    placeholder="Username"
                    className="w-full bg-[#1b222f] border-none rounded-xl py-4 px-5 text-white placeholder:text-slate-500 focus:ring-2 focus:ring-[#00df82]/50 transition-all"
                  />
                </div>
                <div className="space-y-1">
                  <input 
                    name="email"
                    type="email" 
                    required
                    placeholder="Registered Email"
                    className="w-full bg-[#1b222f] border-none rounded-xl py-4 px-5 text-white placeholder:text-slate-500 focus:ring-2 focus:ring-[#00df82]/50 transition-all"
                  />
                </div>
                <div className="space-y-1">
                  <input 
                    name="new_password"
                    type="password" 
                    required
                    placeholder="New Password"
                    className="w-full bg-[#1b222f] border-none rounded-xl py-4 px-5 text-white placeholder:text-slate-500 focus:ring-2 focus:ring-[#00df82]/50 transition-all"
                  />
                </div>

                <button 
                  disabled={resetLoading}
                  className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-4 rounded-xl shadow-lg transition-all disabled:opacity-50"
                >
                  {resetLoading ? 'Resetting...' : 'Update Password'}
                </button>

                <button 
                  type="button"
                  onClick={() => setIsResetMode(false)}
                  className="w-full text-slate-500 hover:text-white text-sm transition-colors"
                >
                  Back to Login
                </button>
              </form>
            )}

            <div className="mt-8 pt-6 border-t border-white/5 text-center space-y-4">
              <p className="text-sm text-slate-500">
                New here? <Link to="/register" className="text-[#00df82] hover:underline font-medium">Create account</Link>
              </p>
              
              <div className="flex items-center justify-center gap-4 text-xs font-medium uppercase tracking-widest">
                <span className="text-slate-600">Faculty?</span>
                <Link to="/faculty-login" className="text-[#00df82] hover:underline">Login here</Link>
                <div className="w-px h-3 bg-white/10" />
                <span className="text-slate-600">Admin?</span>
                <Link to="/admin-login" className="text-purple-400 hover:underline">Login here</Link>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Login;

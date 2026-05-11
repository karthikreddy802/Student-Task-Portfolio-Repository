import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Lock, Mail, BookOpen, Fingerprint, ArrowRight } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { authApi } from '../api';

const Register = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);
    
    try {
      await authApi.register(data);
      toast.success('Registration successful! Please login.');
      navigate('/');
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.error || 'Registration failed. Check your details.');
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
              Join the <br />
              <span className="text-[#00df82]">Academic Network</span>
            </h1>
            <p className="text-slate-400 text-lg font-light">
              Create your portfolio and start your journey today.
            </p>
          </div>
          <div className="absolute -top-20 -left-20 w-[450px] h-[450px] bg-gradient-to-br from-[#00df82]/20 to-teal-900/10 rounded-full blur-3xl -z-0" />
        </div>

        {/* Right Side: Register Card */}
        <div className="flex justify-center lg:justify-end">
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="w-full max-w-[450px] bg-[#0d121d] border border-white/5 rounded-3xl p-10 shadow-2xl"
          >
            <h2 className="text-2xl font-semibold text-white text-center mb-8">Create Student Account</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
                    <input name="username" type="text" required placeholder="Username" className="w-full bg-[#1b222f] border-none rounded-xl py-3 px-10 text-white placeholder:text-slate-500 text-sm focus:ring-2 focus:ring-[#00df82]/50" />
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="relative">
                    <Fingerprint className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
                    <input name="id_number" type="text" required placeholder="Student ID" className="w-full bg-[#1b222f] border-none rounded-xl py-3 px-10 text-white placeholder:text-slate-500 text-sm focus:ring-2 focus:ring-[#00df82]/50" />
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
                  <input name="email" type="email" required placeholder="Email Address" className="w-full bg-[#1b222f] border-none rounded-xl py-3 px-10 text-white placeholder:text-slate-500 text-sm focus:ring-2 focus:ring-[#00df82]/50" />
                </div>
              </div>

              <div className="space-y-1">
                <div className="relative">
                  <BookOpen className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
                  <input name="department" type="text" required placeholder="Department (e.g. CS, IT)" className="w-full bg-[#1b222f] border-none rounded-xl py-3 px-10 text-white placeholder:text-slate-500 text-sm focus:ring-2 focus:ring-[#00df82]/50" />
                </div>
              </div>

              <div className="space-y-1">
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
                  <input name="password" type="password" required placeholder="Create Password" className="w-full bg-[#1b222f] border-none rounded-xl py-3 px-10 text-white placeholder:text-slate-500 text-sm focus:ring-2 focus:ring-[#00df82]/50" />
                </div>
              </div>

              <button 
                disabled={loading}
                className="w-full bg-[#00df82] hover:bg-[#00c572] text-black font-bold py-4 rounded-xl shadow-lg transition-all disabled:opacity-50 mt-4 uppercase tracking-widest text-sm"
              >
                {loading ? 'Processing...' : 'Register Now'}
              </button>
            </form>

            <div className="mt-8 text-center">
              <p className="text-sm text-slate-500">
                Already have an account? <Link to="/" className="text-[#00df82] hover:underline font-medium">Sign in</Link>
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Register;

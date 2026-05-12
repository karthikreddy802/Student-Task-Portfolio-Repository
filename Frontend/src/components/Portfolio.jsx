import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Globe, Mail, Terminal, UserCircle,
  ExternalLink, Code, Layers, Sparkles,
  CheckCircle2, Circle, ArrowRight, Wand2,
  Share2, Layout, Image as ImageIcon, Briefcase, Award
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { submissionApi, portfolioApi } from '../api';
import toast from 'react-hot-toast';

const Portfolio = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [submissions, setSubmissions] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedData, setGeneratedData] = useState(null);

  useEffect(() => {
    fetchGradedSubmissions();
  }, []);

  const fetchGradedSubmissions = async () => {
    try {
      const res = await submissionApi.getAll();
      const allSubmissions = Array.isArray(res.data) ? res.data : res.data.results || [];
      // Show both Submitted and Graded submissions for testing/selection
      setSubmissions(allSubmissions.filter(s => s.status === 'Graded' || s.status === 'Submitted'));
    } catch (err) {
      toast.error('Failed to fetch your works');
    }
  };

  const toggleSelection = (id) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleGenerate = async () => {
    if (selectedIds.length === 0) {
      toast.error('Please select at least one work');
      return;
    }
    
    setStep(2);
    setIsGenerating(true);
    
    try {
      const res = await portfolioApi.generate({
        submission_ids: selectedIds,
        student_name: localStorage.getItem('username') || 'Student Developer'
      });
      
      const aiData = res.data;
      
      setGeneratedData({
        name: localStorage.getItem('username') || 'Student Developer',
        title: 'Full Stack Enthusiast',
        bio: aiData.bio,
        projects: submissions.filter(s => selectedIds.includes(s.id)).map(s => {
          const aiProject = aiData.projects?.find(p => p.id === s.id) || {};
          return {
            title: s.task_title,
            description: aiProject.summary || s.description || 'Project implementation.',
            tags: aiProject.tags || (s.tags || 'Development').split(','),
            grade: s.grade,
            file: s.file
          };
        })
      });
      setStep(3);
      toast.success('AI has organized your portfolio!');
    } catch (err) {
      console.error(err);
      toast.error('AI Generation failed. Using basic organization.');
      // Fallback
      setGeneratedData({
        name: localStorage.getItem('username') || 'Student Developer',
        title: 'Full Stack Enthusiast',
        bio: 'Academic portfolio showcasing best works.',
        projects: submissions.filter(s => selectedIds.includes(s.id)).map(s => ({
          title: s.task_title,
          description: s.description,
          tags: (s.tags || 'Development').split(','),
          grade: s.grade,
          file: s.file
        }))
      });
      setStep(3);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      <header>
        <h1 className="text-4xl font-bold text-white tracking-tight flex items-center gap-3">
          <Wand2 className="text-indigo-400 w-8 h-8" /> Portfolio Wizard
        </h1>
        <p className="text-slate-400 mt-2 text-lg">AI-powered showcase generation for your academic journey.</p>
      </header>

      {/* Progress Bar */}
      <div className="flex items-center gap-4 max-w-2xl">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex-grow flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-all ${
              step >= i ? 'bg-indigo-600 text-white' : 'bg-white/5 text-slate-500 border border-white/10'
            }`}>
              {step > i ? <CheckCircle2 className="w-5 h-5" /> : i}
            </div>
            {i < 3 && <div className={`flex-grow h-1 rounded-full ${step > i ? 'bg-indigo-600' : 'bg-white/5'}`} />}
          </div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div 
            key="step1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-8"
          >
            <div className="bg-indigo-600/10 border border-indigo-500/20 p-6 rounded-2xl flex items-start gap-4">
              <Sparkles className="text-indigo-400 w-6 h-6 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-white font-bold text-lg">Select Your Best Works</h3>
                <p className="text-slate-400">Choose the submissions you want to include in your professional portfolio. We recommend selecting your highest-graded work.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {submissions.map((sub) => (
                <div 
                  key={sub.id}
                  onClick={() => toggleSelection(sub.id)}
                  className={`relative p-6 rounded-2xl border transition-all cursor-pointer group ${
                    selectedIds.includes(sub.id) 
                      ? 'bg-indigo-600/20 border-indigo-500 shadow-lg shadow-indigo-500/10' 
                      : 'bg-white/5 border-white/10 hover:border-white/20'
                  }`}
                >
                  <div className="absolute top-4 right-4">
                    {selectedIds.includes(sub.id) ? (
                      <CheckCircle2 className="text-indigo-400 w-6 h-6" />
                    ) : (
                      <Circle className="text-slate-700 w-6 h-6 group-hover:text-slate-500" />
                    )}
                  </div>
                  <Briefcase className="text-slate-400 w-8 h-8 mb-4" />
                  <h4 className="text-white font-bold mb-2 pr-8">{sub.task_title}</h4>
                  <p className="text-slate-500 text-sm line-clamp-2 mb-4">{sub.description || 'No description provided.'}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-indigo-400 font-bold">Grade: {sub.grade}</span>
                    <span className="text-slate-600 text-xs">{new Date(sub.submitted_at).toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
            </div>

            {submissions.length === 0 && (
              <div className="text-center py-20 bg-white/5 rounded-3xl border border-dashed border-white/10">
                <Layout className="w-16 h-16 text-slate-700 mx-auto mb-4" />
                <p className="text-slate-500 text-lg">No graded submissions found yet.</p>
                <p className="text-slate-600 text-sm mt-1">Complete some tasks and wait for teacher feedback to start.</p>
              </div>
            )}

            <div className="flex justify-end">
              <button 
                onClick={handleGenerate}
                disabled={selectedIds.length === 0}
                className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:hover:bg-indigo-600 text-white px-8 py-4 rounded-2xl font-bold transition-all shadow-xl shadow-indigo-600/20"
              >
                Organize with AI <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div 
            key="step2"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center py-40 space-y-8"
          >
            <div className="relative">
              <div className="w-24 h-24 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
              <Wand2 className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-indigo-400 w-8 h-8 animate-pulse" />
            </div>
            <div className="text-center">
              <h2 className="text-3xl font-bold text-white mb-2">AI is organizing your portfolio...</h2>
              <p className="text-slate-400 max-w-md">Using Local AI (Ollama) to analyze your projects, structure your highlights, and format your technical achievements.</p>
            </div>
            <div className="flex gap-2">
              {[1, 2, 3].map(i => (
                <div key={i} className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: `${i * 0.1}s` }} />
              ))}
            </div>
          </motion.div>
        )}

        {step === 3 && generatedData && (
          <motion.div 
            key="step3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-12"
          >
            {/* Header Preview */}
            <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-indigo-600/20 to-purple-600/20 border border-white/10 p-8 sm:p-12">
              <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
                <div className="w-32 h-32 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-500 p-1">
                  <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="Avatar" className="w-full h-full rounded-2xl bg-slate-900" />
                </div>
                <div className="text-center md:text-left space-y-4">
                  <div>
                    <h1 className="text-4xl font-bold text-white">{generatedData.name}</h1>
                    <p className="text-indigo-400 font-medium text-lg">{generatedData.title}</p>
                  </div>
                  <p className="text-slate-400 max-w-xl">{generatedData.bio}</p>
                </div>
              </div>
            </div>

            {/* Projects Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {generatedData.projects.map((project, i) => (
                <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4">
                  <h3 className="text-xl font-bold text-white">{project.title}</h3>
                  <p className="text-slate-400 text-sm">{project.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {project.tags.map(tag => (
                      <span key={tag} className="px-2 py-1 bg-indigo-500/10 text-indigo-400 rounded-md text-[10px] font-bold uppercase">
                        {tag.trim()}
                      </span>
                    ))}
                  </div>
                  <div className="pt-4 border-t border-white/5 flex justify-between items-center">
                    <span className="text-emerald-400 font-bold text-sm flex items-center gap-1">
                      <Award className="w-4 h-4" /> Grade: {project.grade}
                    </span>
                    <a href={project.file} className="text-indigo-400 text-sm hover:underline flex items-center gap-1">
                      View Project <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-center gap-4">
              <button 
                onClick={() => setStep(1)}
                className="px-8 py-4 bg-white/5 hover:bg-white/10 text-white font-bold rounded-2xl border border-white/10 transition-all"
              >
                Re-select Works
              </button>
              <button 
                className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-8 py-4 rounded-2xl font-bold transition-all shadow-xl shadow-emerald-600/20"
                onClick={() => {
                  localStorage.setItem('publishedPortfolio', JSON.stringify(generatedData));
                  toast.success('Public link generated!');
                  setTimeout(() => navigate('/portfolio-preview'), 1500);
                }}
              >
                <Share2 className="w-5 h-5" /> Publish & Share Portfolio
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Portfolio;

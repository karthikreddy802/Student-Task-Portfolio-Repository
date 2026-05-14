import React from 'react';
import { motion } from 'framer-motion';
import { 
  Globe, Mail, Terminal, UserCircle,
  ExternalLink, Award, Sparkles, BookOpen, Loader2
} from 'lucide-react';
import { useParams } from 'react-router-dom';
import { portfolioApi } from '../api';
import toast from 'react-hot-toast';
import SEO from './SEO';

const PortfolioPreview = () => {
  const { username } = useParams();
  const [data, setData] = React.useState(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchData = async () => {
      if (username) {
        try {
          const res = await portfolioApi.getPublic(username);
          setData({
            name: res.data.student_name,
            title: res.data.title,
            bio: res.data.bio,
            avatar: res.data.effective_avatar,
            skills: res.data.data.skills || [],
            recommendation: res.data.data.recommendation || null,
            projects: res.data.data.projects || []
          });
        } catch (err) {
          console.error(err);
          toast.error('Could not find this portfolio');
        } finally {
          setLoading(false);
        }
      } else {
        // Fallback to localStorage if no username in URL (for local preview)
        const savedData = localStorage.getItem('publishedPortfolio');
        if (savedData) {
          setData(JSON.parse(savedData));
        }
        setLoading(false);
      }
    };
    fetchData();
  }, [username]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0f172a] flex flex-col items-center justify-center">
        <Loader2 className="w-12 h-12 text-indigo-500 animate-spin mb-4" />
        <p className="text-slate-400 font-medium">Loading Portfolio...</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-[#0f172a] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-6">
          <BookOpen className="w-10 h-10 text-slate-500" />
        </div>
        <h1 className="text-3xl font-bold text-white mb-2">Portfolio Not Found</h1>
        <p className="text-slate-400 max-w-md">The portfolio you are looking for might not be published yet or the username is incorrect.</p>
        <button 
          onClick={() => window.location.href = '/'}
          className="mt-8 px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold"
        >
          Back to Home
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-300 font-sans selection:bg-indigo-500/30">
      <SEO 
        title={`${data?.name}'s Academic Portfolio`} 
        description={data?.bio || "View this student's curated academic projects and technical achievements."}
      />
      {/* Decorative background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/10 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-5xl mx-auto px-6 py-20 relative z-10">
        {/* Header */}
        <header className="text-center space-y-8 mb-24">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-32 h-32 mx-auto rounded-3xl bg-gradient-to-tr from-indigo-500 to-purple-500 p-1 shadow-2xl"
          >
            <img 
              src={data.avatar ? (data.avatar.startsWith('http') ? data.avatar : `http://localhost:8000${data.avatar}`) : "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"} 
              alt="Avatar" 
              className="w-full h-full rounded-[22px] bg-slate-900 object-cover"
            />
          </motion.div>
          
          <div className="space-y-4">
            <motion.h1 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-5xl font-extrabold text-white tracking-tight"
            >
              {data.name}
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-indigo-400 text-xl font-medium"
            >
              {data.title}
            </motion.p>
            <motion.p 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="max-w-2xl mx-auto text-slate-400 leading-relaxed text-lg"
            >
              {data.bio}
            </motion.p>
          </div>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col items-center gap-6"
          >
            <div className="flex flex-wrap justify-center gap-2 max-w-2xl">
              {data.skills?.map((skill, i) => (
                <span key={i} className="px-4 py-1.5 bg-indigo-500/10 border border-indigo-500/20 rounded-full text-sm text-indigo-300 font-medium">
                  {skill}
                </span>
              ))}
            </div>
            <div className="flex justify-center gap-6 mt-4">
              {[Terminal, Globe, UserCircle, Mail].map((Icon, i) => (
                <a key={i} href="#" className="p-3 bg-white/5 hover:bg-white/10 rounded-xl transition-all border border-white/10 text-slate-400 hover:text-white">
                  <Icon className="w-6 h-6" />
                </a>
              ))}
            </div>
          </motion.div>
        </header>

        {/* AI Insight: Star Project */}
        {data.recommendation && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-24 p-8 rounded-[32px] bg-gradient-to-br from-indigo-600/20 to-transparent border border-indigo-500/30 relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 p-6">
              <Sparkles className="w-12 h-12 text-indigo-500/10 group-hover:text-indigo-500/20 transition-colors" />
            </div>
            <div className="flex flex-col md:flex-row gap-8 items-start relative z-10">
              <div className="p-4 bg-indigo-500/20 rounded-2xl shrink-0">
                <Award className="w-10 h-10 text-amber-400" />
              </div>
              <div className="space-y-4">
                <h3 className="text-2xl font-bold text-white">Recommended Best Work</h3>
                <p className="text-slate-300 text-lg italic">
                  "The standout piece in this collection is <strong>{
                    data.projects.find(p => p.id === data.recommendation.star_project_id)?.title || 'Selected Project'
                  }</strong>."
                </p>
                <p className="text-slate-400 leading-relaxed max-w-3xl">
                  {data.recommendation.reason}
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Featured Projects */}
        <section className="space-y-12">
          <div className="flex items-center gap-4">
            <h2 className="text-3xl font-bold text-white tracking-tight">Academic Projects</h2>
            <div className="h-px flex-grow bg-white/10" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {data.projects.map((project, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + (i * 0.1) }}
                whileHover={{ y: -8 }}
                className="group bg-white/5 border border-white/10 rounded-3xl p-8 hover:bg-white/[0.07] transition-all"
              >
                <div className="flex justify-between items-start mb-6">
                  <div className="p-3 bg-indigo-500/10 rounded-2xl text-indigo-400">
                    <BookOpen className="w-8 h-8" />
                  </div>
                  <span className="flex items-center gap-1 px-3 py-1 bg-emerald-500/10 text-emerald-400 rounded-full text-xs font-bold uppercase tracking-widest border border-emerald-500/20">
                    <Award className="w-3 h-3" /> {project.grade}
                  </span>
                </div>

                <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-indigo-400 transition-colors">
                  {project.title}
                </h3>
                <p className="text-slate-400 leading-relaxed mb-6 italic border-l-2 border-indigo-500/30 pl-4">
                  {project.description}
                </p>

                {project.highlights && project.highlights.length > 0 && (
                  <div className="mb-6 space-y-2">
                    {project.highlights.map((h, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-sm text-slate-500">
                        <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5 shrink-0" />
                        {h}
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex flex-wrap gap-2 mb-8">
                  {project.tags.map(tag => (
                    <span key={tag} className="px-3 py-1 bg-slate-800/50 text-slate-500 rounded-lg text-[10px] font-bold uppercase tracking-wider border border-white/5">
                      {tag}
                    </span>
                  ))}
                </div>

                <a 
                  href={project.file ? (project.file.startsWith('http') ? project.file : `http://localhost:8000${project.file}`) : (project.link || '#')} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="inline-flex items-center gap-2 text-white font-bold group-hover:gap-3 transition-all"
                >
                  View Case Study <ExternalLink className="w-4 h-4 text-indigo-500" />
                </a>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Footer */}
        <footer className="mt-32 pt-12 border-t border-white/10 text-center">
          <div className="flex items-center justify-center gap-2 text-slate-500 text-sm font-medium">
            <Sparkles className="w-4 h-4 text-indigo-500" />
            Generated by Smart Academic Portfolio System
          </div>
        </footer>
      </div>
    </div>
  );
};

export default PortfolioPreview;

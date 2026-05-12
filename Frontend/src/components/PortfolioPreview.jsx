import React from 'react';
import { motion } from 'framer-motion';
import { 
  Globe, Mail, Terminal, UserCircle,
  ExternalLink, Award, Sparkles, BookOpen
} from 'lucide-react';

const PortfolioPreview = () => {
  // This would normally fetch data from an API based on a public ID
  // For now, we'll use some mock data to show the "Clean, Formatted" view
  const savedData = localStorage.getItem('publishedPortfolio');
  const data = savedData ? JSON.parse(savedData) : {
    name: "Felix Academic",
    title: "Senior Cybersecurity Student",
    bio: "Focused on network security and automated vulnerability assessment. This portfolio showcases my best academic achievements and technical projects.",
    projects: [
      {
        title: "Network Intrusion Detection",
        description: "Implemented a real-time NIDS using Snort and custom Python scripts for traffic analysis.",
        tags: ["Python", "Networking", "Security"],
        grade: "A+",
        link: "#"
      },
      {
        title: "Encrypted File System",
        description: "Developed a secure file storage system with AES-256 encryption and multi-factor authentication.",
        tags: ["C++", "Cryptography", "Linux"],
        grade: "A",
        link: "#"
      }
    ]
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-300 font-sans selection:bg-indigo-500/30">
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
              src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" 
              alt="Avatar" 
              className="w-full h-full rounded-[22px] bg-slate-900"
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
            className="flex justify-center gap-6"
          >
            {[Terminal, Globe, UserCircle, Mail].map((Icon, i) => (
              <a key={i} href="#" className="p-3 bg-white/5 hover:bg-white/10 rounded-xl transition-all border border-white/10 text-slate-400 hover:text-white">
                <Icon className="w-6 h-6" />
              </a>
            ))}
          </motion.div>
        </header>

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
                <p className="text-slate-400 leading-relaxed mb-6">
                  {project.description}
                </p>

                <div className="flex flex-wrap gap-2 mb-8">
                  {project.tags.map(tag => (
                    <span key={tag} className="px-3 py-1 bg-slate-800/50 text-slate-400 rounded-lg text-xs font-semibold">
                      {tag}
                    </span>
                  ))}
                </div>

                <a href={project.file || project.link || '#'} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-white font-bold group-hover:gap-3 transition-all">
                  View Full Case Study <ExternalLink className="w-4 h-4 text-indigo-500" />
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

import React from 'react';
import { motion } from 'framer-motion';
import { 
  Globe, Mail, Terminal, UserCircle,
  ExternalLink, Code, Layers, Sparkles 
} from 'lucide-react';

const Portfolio = () => {
  const projects = [
    {
      title: "Automated Task System",
      description: "A full-stack application for managing student tasks using Django and React.",
      tags: ["React", "Django", "MySQL"],
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=60"
    },
    {
      title: "AI Portfolio Generator",
      description: "Uses Google Gemini API to generate professional portfolios from student data.",
      tags: ["Python", "AI", "Tailwind"],
      image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop&q=60"
    },
    {
      title: "Security Audit Tool",
      description: "A tool to analyze network vulnerabilities and suggest improvements.",
      tags: ["Security", "Network", "Go"],
      image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&auto=format&fit=crop&q=60"
    }
  ];

  return (
    <div className="space-y-12 animate-in fade-in zoom-in-95 duration-500">
      {/* Profile Header */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-indigo-600/20 to-purple-600/20 border border-white/10 p-8 sm:p-12">
        <div className="absolute top-0 right-0 p-8 opacity-20">
          <Sparkles className="w-32 h-32 text-indigo-500" />
        </div>
        
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="w-32 h-32 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-500 p-1 shadow-2xl"
          >
            <img 
              src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" 
              alt="Avatar" 
              className="w-full h-full rounded-2xl bg-slate-900"
            />
          </motion.div>
          
          <div className="text-center md:text-left space-y-4">
            <div>
              <h1 className="text-4xl font-bold text-white tracking-tight">John Doe</h1>
              <p className="text-indigo-400 font-medium text-lg">Full Stack Developer & Student</p>
            </div>
            <p className="text-slate-400 max-w-xl leading-relaxed">
              Passionate about building scalable web applications and exploring new technologies. 
              Currently focused on React, Django, and Cloud architecture.
            </p>
            <div className="flex flex-wrap justify-center md:justify-start gap-4 pt-2">
              {[
                { icon: Terminal, label: 'GitHub' },
                { icon: Globe, label: 'Website' },
                { icon: UserCircle, label: 'LinkedIn' },
                { icon: Mail, label: 'Email' }
              ].map((social, i) => (
                <button key={i} className="flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 px-4 py-2 rounded-xl text-slate-300 transition-all">
                  <social.icon className="w-4 h-4" /> {social.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Skills Section */}
      <section className="space-y-6">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <Code className="text-indigo-400 w-6 h-6" /> Technical Skills
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {['React', 'Next.js', 'Django', 'PostgreSQL', 'Tailwind', 'Docker', 'AWS', 'Python', 'JS', 'TypeScript'].map((skill) => (
            <div key={skill} className="bg-white/5 border border-white/10 p-4 rounded-2xl text-center group hover:border-indigo-500/50 transition-all cursor-default">
              <span className="text-slate-400 group-hover:text-white transition-colors">{skill}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Projects Grid */}
      <section className="space-y-6 pb-12">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <Layers className="text-purple-400 w-6 h-6" /> Featured Projects
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, i) => (
            <motion.div 
              key={i}
              whileHover={{ y: -10 }}
              className="group bg-white/5 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-sm"
            >
              <div className="h-48 overflow-hidden relative">
                <img 
                  src={project.image} 
                  alt={project.title} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <ExternalLink className="text-white w-8 h-8" />
                </div>
              </div>
              <div className="p-6 space-y-4">
                <h3 className="text-xl font-bold text-white">{project.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{project.description}</p>
                <div className="flex flex-wrap gap-2">
                  {project.tags.map(tag => (
                    <span key={tag} className="px-2 py-1 bg-indigo-500/10 text-indigo-400 rounded-md text-xs font-semibold uppercase tracking-wider">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Portfolio;

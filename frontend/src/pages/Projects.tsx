import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Github, ExternalLink } from 'lucide-react';
import ScrollReveal from '../components/ScrollReveal';
import { getApiUrl } from '../utils/api';

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(getApiUrl('/api/projects'))
      .then(res => res.json())
      .then(data => setProjects(data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto min-h-screen">
      <ScrollReveal className="mb-16">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 mb-6">Projects by Nsame Rene Tamjong</h1>
        <p className="text-xl text-slate-600 max-w-3xl leading-relaxed">
          Discover the products and platforms behind ELIGNITE, EduIgnite, and JuniorIgnite, built to advance education technology, product development, and digital innovation.
        </p>
      </ScrollReveal>
      
      {loading ? (
        <div className="text-center py-20 text-slate-500 font-medium">Loading projects...</div>
      ) : (
        <div className="space-y-24">
          {projects.map((project: any, index: number) => {
            const tags = project.technologies ? project.technologies.split(',').map((t: string) => t.trim()) : [];
            return (
            <div key={project.id || index}>
              <ScrollReveal delay={index * 0.1}>
                <div className={`flex flex-col ${index % 2 === 1 ? 'lg:flex-row-reverse' : 'lg:flex-row'} gap-12 items-center`}>
                <div className="w-full lg:w-1/2">
                  <div className="relative rounded-3xl overflow-hidden shadow-2xl aspect-[4/3] group">
                    <div className="absolute inset-0 bg-slate-900/10 group-hover:bg-transparent transition-colors z-10" />
                    <img 
                      src={project.imageUrl || 'https://images.unsplash.com/photo-1557821552-17105176677c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'} 
                      alt={`${project.title} by Nsame Rene Tamjong`} 
                      className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out"
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                </div>
                
                <div className="w-full lg:w-1/2">
                  <h2 className="text-3xl font-bold text-slate-900 mb-4">{project.title}</h2>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {tags.map((tag: string) => (
                      <span key={tag} className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-sm font-semibold border border-indigo-100">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <p className="text-lg text-slate-600 leading-relaxed mb-8">
                    {project.description}
                  </p>
                  <div className="flex items-center gap-4">
                    {project.liveDemoLink && (
                      <a href={project.liveDemoLink} target="_blank" rel="noopener noreferrer" className="inline-flex items-center px-6 py-3 bg-slate-900 text-white font-bold rounded-full hover:bg-indigo-600 transition-colors shadow-lg">
                        View Live <ExternalLink className="ml-2 w-5 h-5" />
                      </a>
                    )}
                    {project.githubLink && (
                      <a href={project.githubLink} target="_blank" rel="noopener noreferrer" className="inline-flex items-center px-6 py-3 bg-white text-slate-900 font-bold rounded-full border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-colors shadow-sm">
                        <Github className="mr-2 w-5 h-5" /> Code
                      </a>
                    )}
                  </div>
                </div>
                </div>
              </ScrollReveal>
            </div>
          )})}
          {projects.length === 0 && <div className="text-slate-500 font-medium py-10">No projects added yet.</div>}
        </div>
      )}
    </div>
  );
}

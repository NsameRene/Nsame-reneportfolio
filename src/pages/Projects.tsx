import { motion } from 'motion/react';
import { ArrowRight, Github, ExternalLink } from 'lucide-react';
import ScrollReveal from '../components/ScrollReveal';

export default function Projects() {
  const projects = [
    {
      title: 'E-Commerce Platform Redesign',
      description: 'Led the frontend redesign of a major e-commerce platform, improving load times by 40% and increasing conversion rates by 15%. Implemented a complex state management system and seamless payment integrations.',
      tags: ['React', 'Node.js', 'Stripe', 'PostgreSQL'],
      image: 'https://images.unsplash.com/photo-1557821552-17105176677c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      github: '#',
      live: '#'
    },
    {
      title: 'Real-time Collaborative Whiteboard',
      description: 'Built a real-time collaborative workspace allowing remote teams to brainstorm using a shared canvas. Handled complex WebSocket synchronizations and conflict resolution for multiple concurrent users.',
      tags: ['Next.js', 'Socket.io', 'Canvas API', 'Tailwind'],
      image: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      github: '#',
      live: '#'
    },
    {
      title: 'AI Content Generator Tool',
      description: 'Developed an AI-powered SaaS application that helps marketers generate blog posts, social media content, and ad copy. Built the full authentication flow, credit system, and prompt engineering pipeline.',
      tags: ['Vue.js', 'Express', 'OpenAI API', 'MongoDB'],
      image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      github: '#',
      live: '#'
    }
  ];

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto min-h-screen">
      <ScrollReveal className="mb-16">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 mb-6">Featured Projects</h1>
        <p className="text-xl text-slate-600 max-w-3xl leading-relaxed">
          Here are a few select projects that showcase my expertise in modern web development, architecture, and design.
        </p>
      </ScrollReveal>

      <div className="space-y-24">
        {projects.map((project, index) => (
          <div key={project.title}>
            <ScrollReveal delay={index * 0.1}>
              <div className={`flex flex-col ${index % 2 === 1 ? 'lg:flex-row-reverse' : 'lg:flex-row'} gap-12 items-center`}>
              <div className="w-full lg:w-1/2">
                <div className="relative rounded-3xl overflow-hidden shadow-2xl aspect-[4/3] group">
                  <div className="absolute inset-0 bg-slate-900/10 group-hover:bg-transparent transition-colors z-10" />
                  <img 
                    src={project.image} 
                    alt={project.title} 
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                </div>
              </div>
              
              <div className="w-full lg:w-1/2">
                <h2 className="text-3xl font-bold text-slate-900 mb-4">{project.title}</h2>
                <div className="flex flex-wrap gap-2 mb-6">
                  {project.tags.map(tag => (
                    <span key={tag} className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-sm font-semibold border border-indigo-100">
                      {tag}
                    </span>
                  ))}
                </div>
                <p className="text-lg text-slate-600 leading-relaxed mb-8">
                  {project.description}
                </p>
                <div className="flex items-center gap-4">
                  <a href={project.live} className="inline-flex items-center px-6 py-3 bg-slate-900 text-white font-bold rounded-full hover:bg-indigo-600 transition-colors shadow-lg">
                    View Live <ExternalLink className="ml-2 w-5 h-5" />
                  </a>
                  <a href={project.github} className="inline-flex items-center px-6 py-3 bg-white text-slate-900 font-bold rounded-full border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-colors shadow-sm">
                    <Github className="mr-2 w-5 h-5" /> Code
                  </a>
                </div>
              </div>
              </div>
            </ScrollReveal>
          </div>
        ))}
      </div>
    </div>
  );
}

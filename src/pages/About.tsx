import { motion } from 'motion/react';
import { Download, Target, Lightbulb } from 'lucide-react';
import ScrollReveal from '../components/ScrollReveal';

export default function About() {
  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto overflow-hidden">
      <ScrollReveal className="mb-16 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 mb-6">About Me</h1>
          <div className="prose prose-lg text-slate-600 max-w-none">
            <p className="text-xl leading-relaxed">
              I am a <strong>Full Stack Software Engineer</strong> and <strong>Mathematics Educator</strong> with a passion for building scalable, high-performance web applications. As the Founder and CEO of ELIGNITE, and the creator of the EduIgnite School Management System, I bridge the gap between complex technical solutions and intuitive educational tools.
            </p>
          </div>
        </div>
        <div className="relative">
          <div className="absolute inset-0 bg-indigo-100 rounded-3xl transform rotate-3 scale-105"></div>
          <img 
            src="https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
            alt="Nsame Rene Tamjong" 
            className="relative z-10 rounded-3xl shadow-xl w-full object-cover aspect-square md:aspect-[4/3]"
          />
        </div>
      </ScrollReveal>

      <ScrollReveal className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16" delay={0.1}>
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
          <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center mb-6">
            <Target className="w-6 h-6 text-indigo-600" />
          </div>
          <h3 className="text-2xl font-bold text-slate-900 mb-4">Vision</h3>
          <p className="text-slate-600">To revolutionize the digital landscape by creating seamless, accessible, and highly efficient software solutions that empower organizations and educational institutions globally.</p>
        </div>

        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
          <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center mb-6">
            <Lightbulb className="w-6 h-6 text-emerald-600" />
          </div>
          <h3 className="text-2xl font-bold text-slate-900 mb-4">Mission</h3>
          <p className="text-slate-600">Delivering premium, full-stack applications with clean architecture and outstanding user experiences. My focus is on leveraging modern technologies like Next.js, Express, and PostgreSQL to solve real-world problems.</p>
        </div>
      </ScrollReveal>

      <ScrollReveal className="bg-slate-900 text-white p-8 md:p-12 rounded-3xl flex flex-col md:flex-row items-center justify-between shadow-xl" delay={0.2}>
        <div className="mb-8 md:mb-0 md:mr-8">
          <h3 className="text-2xl font-bold mb-4">Education & Background</h3>
          <p className="text-slate-300 max-w-xl leading-relaxed">
            My background as a Mathematics Educator has instilled in me a deep appreciation for logic, problem-solving, and algorithmic thinking—skills that translate perfectly into writing clean, efficient code for complex web systems.
          </p>
        </div>
        <div className="flex-shrink-0">
          <a href="/Nsame_Rene_Tamjong_CV.pdf" download="Nsame_Rene_Tamjong_CV.pdf" target="_blank" rel="noopener noreferrer" className="inline-flex items-center px-6 py-3 rounded-full bg-white text-slate-900 font-medium hover:bg-slate-100 transition-colors shadow-sm">
            <Download className="mr-2 w-5 h-5" /> Download Full CV
          </a>
        </div>
      </ScrollReveal>
    </div>
  );
}

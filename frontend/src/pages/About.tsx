import { motion } from 'motion/react';
import { Download, Target, Lightbulb } from 'lucide-react';
import { Link } from 'react-router';
import ScrollReveal from '../components/ScrollReveal';

export default function About() {
  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto overflow-hidden">
      <ScrollReveal className="mb-16 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 mb-6">About Nsame Rene Tamjong</h1>
          <div className="prose prose-lg text-slate-600 max-w-none">
            <p className="text-xl leading-relaxed">
              I am <strong>Nsame Rene Tamjong</strong>, the <strong>Founder & CEO of ELIGNITE</strong>, a <strong>Project Manager</strong> for <strong>EduIgnite</strong> and <strong>JuniorIgnite</strong>, and a <strong>coder</strong>, <strong>entrepreneur</strong>, <strong>educator</strong>, <strong>mathematics teacher</strong>, and <strong>mentor</strong>. I build digital products and educational technology solutions that help schools, learners, and teams thrive.
            </p>
          </div>
        </div>
        <div className="relative">
          <div className="absolute inset-0 bg-indigo-100 rounded-3xl transform rotate-3 scale-105"></div>
          <img 
            src="https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
            alt="Nsame Rene Tamjong, founder and CEO of ELIGNITE" 
            className="relative z-10 rounded-3xl shadow-xl w-full object-cover aspect-square md:aspect-[4/3]"
            loading="lazy"
            decoding="async"
          />
        </div>
      </ScrollReveal>

      <ScrollReveal className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16" delay={0.1}>
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
          <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center mb-6">
            <Target className="w-6 h-6 text-indigo-600" />
          </div>
          <h3 className="text-2xl font-bold text-slate-900 mb-4">Vision</h3>
          <p className="text-slate-600">To build accessible, scalable digital products and educational technology platforms that strengthen learning, operations, and innovation across Africa and beyond.</p>
        </div>

        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
          <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center mb-6">
            <Lightbulb className="w-6 h-6 text-emerald-600" />
          </div>
          <h3 className="text-2xl font-bold text-slate-900 mb-4">Mission</h3>
          <p className="text-slate-600">Delivering premium full stack applications with clean architecture and outstanding user experiences. My focus is on leveraging React, TypeScript, Node.js, PostgreSQL, and AI solutions to solve real-world problems in education and technology.</p>
        </div>
      </ScrollReveal>

      <ScrollReveal className="bg-slate-900 text-white p-8 md:p-12 rounded-3xl flex flex-col md:flex-row items-center justify-between shadow-xl" delay={0.2}>
        <div className="mb-8 md:mb-0 md:mr-8">
          <h3 className="text-2xl font-bold mb-4">Education & Background</h3>
          <p className="text-slate-300 max-w-xl leading-relaxed">
            My background as a mathematics teacher and educational technology innovator has instilled in me a deep appreciation for logic, problem-solving, and algorithmic thinking—skills that translate perfectly into writing clean, efficient code for complex web systems and digital learning platforms.
          </p>
        </div>
        <div className="flex-shrink-0">
          <Link to="/cv" className="inline-flex items-center px-6 py-3 rounded-full bg-white text-slate-900 font-medium hover:bg-slate-100 transition-colors shadow-sm">
            <Download className="mr-2 w-5 h-5" /> Download Full CV
          </Link>
        </div>
      </ScrollReveal>
    </div>
  );
}

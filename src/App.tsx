import { Routes, Route, Link } from 'react-router';
import { motion } from 'motion/react';
import { Github, Linkedin, Mail, Menu, X } from 'lucide-react';
import React, { useState } from 'react';

import Home from './pages/Home.tsx';
import Projects from './pages/Projects.tsx';
import Admin from './pages/Admin.tsx';

import About from './pages/About.tsx';
import Skills from './pages/Skills.tsx';
import Experience from './pages/Experience.tsx';
import Contact from './pages/Contact.tsx';
import Gallery from './pages/Gallery.tsx';
import Courses from './pages/Courses.tsx';
import Blog from './pages/Blog.tsx';

function Layout({ children }: { children: React.ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Projects', path: '/projects' },
    { name: 'Courses', path: '/courses' },
    { name: 'Gallery', path: '/gallery' },
    { name: 'Blog', path: '/blog' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-indigo-500 selection:text-white">
      <header className="fixed top-0 w-full z-50 bg-white/70 backdrop-blur-xl border-b border-white/20 shadow-sm transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-3 text-xl font-extrabold tracking-tight text-slate-900 group">
            <img 
              src="https://api.dicebear.com/7.x/notionists/svg?seed=NsameReneTamjong&backgroundColor=e2e8f0" 
              alt="Nsame Rene" 
              className="w-10 h-10 rounded-full border-2 border-transparent group-hover:border-indigo-500 transition-colors shadow-sm"
            />
            <span>Nsame Rene</span>
          </Link>
          
          <nav className="hidden md:flex space-x-8 items-center">
            {navLinks.map((link) => (
              <Link key={link.name} to={link.path} className="text-sm font-semibold text-slate-600 hover:text-indigo-600 transition-colors">
                {link.name}
              </Link>
            ))}
            <Link to="/contact" className="ml-4 px-5 py-2.5 rounded-full bg-slate-900 text-white text-sm font-bold hover:bg-indigo-600 transition-colors shadow-md hover:shadow-lg">
              Let's Talk
            </Link>
          </nav>

          <div className="md:hidden">
            <button onClick={() => setMenuOpen(!menuOpen)} className="p-2 -mr-2 text-slate-600 hover:text-slate-900">
              {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
        
        {/* Mobile Menu */}
        {menuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:hidden absolute top-20 left-0 right-0 bg-white/95 backdrop-blur-xl border-b border-slate-200 shadow-xl"
          >
            <div className="px-4 pt-2 pb-6 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => setMenuOpen(false)}
                  className="block px-4 py-3 rounded-xl text-base font-semibold text-slate-700 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </header>
      
      <main className="w-full pt-20">
        {children}
      </main>
      
      <footer className="bg-white border-t border-slate-200 mt-24">
        <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-3 mb-6 md:mb-0">
            <img 
              src="https://api.dicebear.com/7.x/notionists/svg?seed=NsameReneTamjong&backgroundColor=e2e8f0" 
              alt="Nsame Rene" 
              className="w-8 h-8 rounded-full grayscale opacity-70"
            />
            <p className="text-slate-500 text-sm font-medium">© {new Date().getFullYear()} Nsame Rene. Built with precision.</p>
          </div>
          <div className="flex space-x-6">
            <a href="#" className="text-slate-400 hover:text-indigo-600 transition-colors bg-slate-50 p-3 rounded-full hover:bg-indigo-50">
              <span className="sr-only">GitHub</span>
              <Github className="h-5 w-5" />
            </a>
            <a href="#" className="text-slate-400 hover:text-indigo-600 transition-colors bg-slate-50 p-3 rounded-full hover:bg-indigo-50">
              <span className="sr-only">LinkedIn</span>
              <Linkedin className="h-5 w-5" />
            </a>
            <a href="#" className="text-slate-400 hover:text-indigo-600 transition-colors bg-slate-50 p-3 rounded-full hover:bg-indigo-50">
              <span className="sr-only">Email</span>
              <Mail className="h-5 w-5" />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/skills" element={<Skills />} />
        <Route path="/experience" element={<Experience />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </Layout>
  );
}

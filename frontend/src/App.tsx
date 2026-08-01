import { Routes, Route, Link } from 'react-router';
import { motion } from 'motion/react';
import { Github, Linkedin, Mail, Menu, X } from 'lucide-react';
import React, { lazy, Suspense, useState } from 'react';

const Home = lazy(() => import('./pages/Home.tsx'));
const CV = lazy(() => import('./pages/CV.tsx'));
const Admin = lazy(() => import('./pages/Admin.tsx'));
const About = lazy(() => import('./pages/About.tsx'));
const Skills = lazy(() => import('./pages/Skills.tsx'));
const Experience = lazy(() => import('./pages/Experience.tsx'));
const Contact = lazy(() => import('./pages/Contact.tsx'));
const Gallery = lazy(() => import('./pages/Gallery.tsx'));
const Courses = lazy(() => import('./pages/Courses.tsx'));
const CourseDetails = lazy(() => import('./pages/CourseDetails.tsx'));
const Blog = lazy(() => import('./pages/Blog.tsx'));
const Article = lazy(() => import('./pages/Article.tsx'));
const Testimonials = lazy(() => import('./pages/Testimonials.tsx'));
const Projects = lazy(() => import('./pages/Projects.tsx'));
import SEO from './components/SEO.tsx';

function Layout({ children }: { children: React.ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'CV', path: '/cv' },
    { name: 'Projects', path: '/projects' },
    { name: 'Courses', path: '/courses' },
    { name: 'Gallery', path: '/gallery' },
    { name: 'Blog', path: '/blog' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-indigo-500 selection:text-white">
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:rounded-full focus:bg-indigo-600 focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-white">
        Skip to content
      </a>
      <header className="fixed top-0 w-full z-50 bg-white/70 backdrop-blur-xl border-b border-white/20 shadow-sm transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-3 text-xl font-extrabold tracking-tight text-slate-900 group" aria-label="Nsame Rene Tamjong home page">
            <img 
              src="https://api.dicebear.com/7.x/notionists/svg?seed=NsameReneTamjong&backgroundColor=e2e8f0" 
              alt="Nsame Rene Tamjong profile avatar" 
              className="w-10 h-10 rounded-full border-2 border-transparent group-hover:border-indigo-500 transition-colors shadow-sm"
              loading="lazy"
              decoding="async"
            />
            <span>Nsame Rene</span>
          </Link>
          
          <nav aria-label="Primary navigation" className="hidden md:flex space-x-8 items-center">
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
            <button onClick={() => setMenuOpen(!menuOpen)} className="p-2 -mr-2 text-slate-600 hover:text-slate-900" aria-label="Toggle navigation menu" aria-expanded={menuOpen}>
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
      
      <main id="main-content" className="w-full pt-20">
        {children}
      </main>
      
      <footer className="bg-white border-t border-slate-200 mt-24">
        <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-3 mb-6 md:mb-0">
            <Link to="/admin" aria-label="Open admin dashboard">
              <img 
                src="https://api.dicebear.com/7.x/notionists/svg?seed=NsameReneTamjong&backgroundColor=e2e8f0" 
                alt="Nsame Rene Tamjong avatar" 
                className="w-8 h-8 rounded-full grayscale opacity-70 hover:opacity-100 hover:grayscale-0 transition-all cursor-pointer"
                loading="lazy"
                decoding="async"
              />
            </Link>
            <p className="text-slate-500 text-sm font-medium">© {new Date().getFullYear()} Nsame Rene Tamjong. Built with precision.</p>
          </div>
          <div className="flex space-x-6">
            <a href="https://github.com/" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-indigo-600 transition-colors bg-slate-50 p-3 rounded-full hover:bg-indigo-50" aria-label="Visit GitHub profile">
              <span className="sr-only">GitHub</span>
              <Github className="h-5 w-5" />
            </a>
            <a href="https://www.linkedin.com/" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-indigo-600 transition-colors bg-slate-50 p-3 rounded-full hover:bg-indigo-50" aria-label="Visit LinkedIn profile">
              <span className="sr-only">LinkedIn</span>
              <Linkedin className="h-5 w-5" />
            </a>
            <a href="mailto:nsamerenetamjong@gmail.com" className="text-slate-400 hover:text-indigo-600 transition-colors bg-slate-50 p-3 rounded-full hover:bg-indigo-50" aria-label="Email Nsame Rene">
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
      <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-slate-600" role="status">Loading page…</div>}>
        <Routes>
          <Route path="/" element={<><SEO title="Home" description="Nsame Rene Tamjong is the Founder & CEO of ELIGNITE, Project Manager for EduIgnite and JuniorIgnite, and a coder, entrepreneur, educator, and mentor." /><Home /></>} />
          <Route path="/about" element={<><SEO title="About" description="Learn about Nsame Rene Tamjong, founder of ELIGNITE, project manager for EduIgnite and JuniorIgnite, educator, entrepreneur, and technology innovator." /><About /></>} />
          <Route path="/cv" element={<><SEO title="CV" description="View the professional CV of Nsame Rene Tamjong, highlighting experience in education technology, product building, and software development." /><CV /></>} />
          <Route path="/projects" element={<><SEO title="Projects" description="Explore Nsame Rene Tamjong's projects including ELIGNITE, EduIgnite, and JuniorIgnite, with a focus on educational technology and software products." /><Projects /></>} />
          <Route path="/skills" element={<><SEO title="Skills" description="Discover Nsame Rene Tamjong's expertise in full stack development, React, TypeScript, Node.js, PostgreSQL, REST APIs, and software architecture." /><Skills /></>} />
          <Route path="/experience" element={<><SEO title="Experience" description="Explore Nsame Rene Tamjong's professional timeline as founder, project manager, educator, and technology leader." /><Experience /></>} />
          <Route path="/gallery" element={<><SEO title="Gallery" description="Browse visuals from Nsame Rene Tamjong's work, educational initiatives, and technology projects." /><Gallery /></>} />
          <Route path="/courses" element={<><SEO title="Courses" description="Discover educational courses and digital learning resources from Nsame Rene Tamjong and EduIgnite." /><Courses /></>} />
          <Route path="/courses/:id" element={<><SEO title="Course Details" description="Explore educational courses and digital learning resources from Nsame Rene Tamjong and EduIgnite." /><CourseDetails /></>} />
          <Route path="/blog" element={<><SEO title="Blog" description="Read insights from Nsame Rene Tamjong about software engineering, mathematics, education technology, and building products." /><Blog /></>} />
          <Route path="/blog/:id" element={<><SEO title="Article" description="Read a featured article from Nsame Rene Tamjong on software engineering and education technology." /><Article /></>} />
          <Route path="/testimonials" element={<><SEO title="Testimonials" description="Read client and student testimonials about Nsame Rene Tamjong's work in technology, education, and product building." /><Testimonials /></>} />
          <Route path="/contact" element={<><SEO title="Contact" description="Contact Nsame Rene Tamjong for consulting, collaboration, and product development opportunities." /><Contact /></>} />
          <Route path="/admin" element={<><SEO title="Admin" robots="noindex,nofollow" description="Admin dashboard for the portfolio website." /><Admin /></>} />
        </Routes>
      </Suspense>
    </Layout>
  );
}

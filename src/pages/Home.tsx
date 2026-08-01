import { motion, useMotionValue, useTransform, animate, useInView } from 'motion/react';
import { ArrowRight, Terminal, Code, Database, Globe, Download, Mail, Quote } from 'lucide-react';
import { Link } from 'react-router';
import { API_BASE } from '../utils/api';
import { useEffect, useRef, useState } from 'react';
import TestimonialSection from '../components/TestimonialSection';
import ScrollReveal from '../components/ScrollReveal';

function TypewriterText({ text, delay = 0 }: { text: string, delay?: number }) {
  const [displayText, setDisplayText] = useState('');
  
  useEffect(() => {
    let i = 0;
    const timeout = setTimeout(() => {
      const timer = setInterval(() => {
        if (i < text.length) {
          setDisplayText(text.substring(0, i + 1));
          i++;
        } else {
          clearInterval(timer);
        }
      }, 50);
      return () => clearInterval(timer);
    }, delay * 1000);
    
    return () => clearTimeout(timeout);
  }, [text, delay]);

  return (
    <span>
      {displayText}
      <span className="animate-pulse opacity-50 ml-1">|</span>
    </span>
  );
}

export default function Home() {
  const [settings, setSettings] = useState<any>({});
  const [whatIDo, setWhatIDo] = useState<any[]>([]);
  useEffect(() => {
    fetch(`${API_BASE}/api/what_i_do`).then(res => res.json()).then(data => setWhatIDo(data)).catch(console.error);
  }, []);

  
  useEffect(() => {
    fetch(`${API_BASE}/api/settings`)
      .then(res => res.json())
      .then(data => setSettings(data))
      .catch(err => console.error(err));
  }, []);

  const [showAllQuotes, setShowAllQuotes] = useState(false);
  
  const allQuotes = [
    { quote: "Code is read more often than it is written. Write it for the reader.", author: "Nsame Rene" },
    { quote: "Simplicity is the soul of efficiency.", author: "Austin Freeman" },
    { quote: "Mathematics is the language with which God has written the universe.", author: "Galileo Galilei" },
    { quote: "First, solve the problem. Then, write the code.", author: "John Johnson" },
    { quote: "Any fool can write code that a computer can understand. Good programmers write code that humans can understand.", author: "Martin Fowler" },
    { quote: "Experience is the name everyone gives to their mistakes.", author: "Oscar Wilde" },
    { quote: "Knowledge is power.", author: "Francis Bacon" },
    { quote: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
  ];

  const displayedQuotes = showAllQuotes ? allQuotes : allQuotes.slice(0, 4);

  return (
    <div className="flex flex-col gap-32 pb-12">
      
      {/* Hero Section */}
      <section className="relative w-full overflow-hidden bg-slate-900 min-h-[90vh] flex items-center pt-24 pb-12 rounded-b-3xl">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500/20 rounded-full blur-[128px]"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-[128px]"></div>
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
        </div>
        
        <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
          <div className="text-center lg:text-left mb-12 lg:mb-0">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8 backdrop-blur-md"
            >
              <span className="w-2 h-2 rounded-full bg-indigo-400 mr-2 animate-pulse"></span>
              <span className="text-indigo-200 text-sm font-medium tracking-wide">Available for new opportunities</span>
            </motion.div>
            
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold text-white leading-tight mb-6 tracking-tight">
              <span className="block text-slate-400 text-3xl sm:text-4xl md:text-5xl mb-2 font-medium">Hello, I'm</span>
              {settings.name || "Nsame Reneta Mjong"}
            </h1>
            
            <div className="text-2xl sm:text-3xl font-medium text-indigo-300 mb-8 h-10">
              <TypewriterText text="Full Stack Developer & Software Engineer" delay={0.5} />
            </div>
            
            <motion.p 
              className="text-slate-400 mb-10 max-w-xl mx-auto lg:mx-0 text-lg leading-relaxed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 1 }}
            >
              {settings.bio || "I build elegant, scalable, and user-centric applications. Let's create something amazing together."}
            </motion.p>
            
            <motion.div 
              className="flex flex-wrap items-center justify-center lg:justify-start gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2 }}
            >
              <Link to="/contact" className="px-8 py-4 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-500/25 flex items-center group">
                Let's Talk
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link to="/about" className="px-8 py-4 bg-white/5 border border-white/10 text-white font-bold rounded-xl hover:bg-white/10 transition-all backdrop-blur-sm">
                About Me
              </Link>
            </motion.div>
          </div>
          
          <div className="flex justify-center relative">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1 }}
              className="relative"
            >
              <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-full blur-3xl opacity-30 animate-pulse"></div>
              <img 
                src={settings.profileImageUrl || "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"} 
                alt={settings.name || "Profile"} 
                className="w-72 h-72 sm:w-96 sm:h-96 object-cover rounded-full border-4 border-white/10 relative z-10 shadow-2xl"
              />
            </motion.div>
          </div>
        </div>
      </section>
      {/* Quote Section */}
      <ScrollReveal className="max-w-5xl mx-auto w-full py-12 px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-900 rounded-3xl p-10 md:p-16 text-center shadow-2xl relative overflow-hidden flex flex-col items-center justify-center">
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-indigo-600/30 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-64 h-64 bg-purple-600/30 rounded-full blur-3xl"></div>
          
          <div className="relative z-10">
            <Quote className="w-16 h-16 text-indigo-400/50 mx-auto mb-8" />
            <p className="text-2xl md:text-3xl lg:text-4xl font-medium text-white mb-10 leading-snug tracking-tight max-w-4xl mx-auto">
              "Building software is not just about writing code; it's about crafting elegant solutions to real-world problems that empower people."
            </p>
            <div className="flex flex-col items-center">
              <div className="w-12 h-1 bg-indigo-500 rounded-full mb-4"></div>
              <p className="text-xl font-bold tracking-widest uppercase text-slate-300">
                Nsame Rene
              </p>
              <p className="text-sm font-medium text-slate-500 mt-2">
                Software Engineer
              </p>
            </div>
          </div>
        </div>
      </ScrollReveal>

      {/* Skills Preview */}
      <ScrollReveal className="max-w-5xl mx-auto w-full px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="text-indigo-600 font-bold tracking-wider uppercase text-sm mb-2 block">What I Do</span>
          <h2 className="text-4xl font-extrabold text-slate-900">Technical Expertise</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {whatIDo.length > 0 ? whatIDo.map((area, i) => {
            const IconComp = area.icon === 'Globe' ? Globe : area.icon === 'Database' ? Database : area.icon === 'Code' ? Code : Terminal;
            const items = area.items ? area.items.split(',').map(s => s.trim()) : [];
            return (
              <motion.div 
                key={area.title}
                className="bg-white p-10 rounded-3xl shadow-sm border border-slate-100 text-left flex flex-col items-start hover:shadow-xl hover:border-indigo-100 transition-all duration-300 group"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <div className="p-4 bg-slate-50 rounded-2xl group-hover:bg-indigo-50 transition-colors mb-6">
                  <IconComp className="w-8 h-8 text-indigo-500 mb-4" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-slate-900">{area.title}</h3>
                <ul className="space-y-3 w-full">
                  {items.map(item => (
                    <li key={item} className="flex items-center text-slate-600 font-medium">
                      <Code className="w-4 h-4 mr-3 text-indigo-400" /> {item}
                    </li>
                  ))}
                </ul>
              </motion.div>
            );
          }) : (
            <div className="col-span-1 md:col-span-3 text-center text-slate-500 py-12">
              Loading expertise...
            </div>
          )}
        </div>
      </ScrollReveal>
      {/* Testimonials Section */}
      <ScrollReveal className="w-full px-4 sm:px-6 lg:px-8">
        <TestimonialSection />
      </ScrollReveal>

      {/* Quotes Section */}
      <ScrollReveal className="max-w-4xl mx-auto w-full py-16 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="text-indigo-600 font-bold tracking-wider uppercase text-sm mb-2 block">My Philosophy</span>
          <h2 className="text-4xl font-extrabold text-slate-900">Quotes & Principles</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {displayedQuotes.map((q, i) => (
            <motion.div
              key={i}
              className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 flex flex-col justify-center relative overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: (i % 4) * 0.1 }}
            >
              <div className="absolute top-4 left-6 text-6xl text-slate-100 font-serif leading-none opacity-50">"</div>
              <p className="text-lg text-slate-700 italic relative z-10 mb-4 font-serif leading-relaxed">
                "{q.quote}"
              </p>
              <div className="mt-auto text-sm font-bold text-indigo-600 tracking-wide uppercase">
                — {q.author}
              </div>
            </motion.div>
          ))}
        </div>
        
        {allQuotes.length > 4 && (
          <div className="mt-12 text-center">
            <button
              onClick={() => setShowAllQuotes(!showAllQuotes)}
              className="inline-flex items-center px-6 py-3 bg-white border border-slate-200 text-slate-700 font-semibold rounded-full hover:bg-slate-50 hover:text-indigo-600 transition-colors shadow-sm"
            >
              {showAllQuotes ? "Show Less" : "Read all quotes"} <ArrowRight className={`ml-2 w-4 h-4 transition-transform ${showAllQuotes ? '-rotate-90' : 'rotate-90'}`} />
            </button>
          </div>
        )}
      </ScrollReveal>

      {/* Blog Preview Section */}
      <ScrollReveal className="max-w-6xl mx-auto w-full py-12 px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-12">
          <div>
            <span className="text-indigo-600 font-bold tracking-wider uppercase text-sm mb-2 block">Latest Insights</span>
            <h2 className="text-4xl font-extrabold text-slate-900">Blog Posts</h2>
          </div>
          <Link to="/blog" className="hidden md:inline-flex items-center text-indigo-600 font-semibold hover:text-indigo-800 transition-colors">
            View All Articles <ArrowRight className="ml-2 w-4 h-4" />
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { id: 1, title: "Building Scalable Architecture with Next.js", category: "Engineering", date: "Oct 12, 2023", readTime: "5 min read", img: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" },
            { id: 2, title: "The Mathematics of Clean Code", category: "Philosophy", date: "Sep 28, 2023", readTime: "8 min read", img: "https://images.unsplash.com/photo-1509228468518-180dd4864904?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" },
            { id: 3, title: "Why Prisma Changed How I Write Backends", category: "Database", date: "Sep 15, 2023", readTime: "6 min read", img: "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" },
          ].map((post, i) => (
            <motion.div
              key={post.title}
              className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden group cursor-pointer hover:shadow-lg transition-all flex flex-col"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <div className="aspect-[4/3] overflow-hidden relative">
                <img src={post.img} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-indigo-600 uppercase tracking-wider">
                  {post.category}
                </div>
              </div>
              <div className="p-8 flex flex-col flex-grow">
                <div className="flex items-center text-xs font-medium text-slate-400 mb-3 space-x-3">
                  <span>{post.date}</span>
                  <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                  <span>{post.readTime}</span>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-4 group-hover:text-indigo-600 transition-colors leading-tight flex-grow">
                  {post.title}
                </h3>
                <Link to={`/blog/${post.id}`} className="inline-flex items-center text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                  Read Article <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
        <div className="mt-8 text-center md:hidden">
          <Link to="/blog" className="inline-flex items-center px-6 py-3 rounded-full border-2 border-slate-200 text-slate-700 font-bold hover:border-slate-300 hover:bg-slate-50 transition-colors">
            View All Articles <ArrowRight className="ml-2 w-4 h-4" />
          </Link>
        </div>
      </ScrollReveal>
    </div>
  );
}

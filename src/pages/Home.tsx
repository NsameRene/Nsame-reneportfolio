import { motion, useMotionValue, useTransform, animate, useInView } from 'motion/react';
import { ArrowRight, Terminal, Code, Database, Globe, Download, Mail } from 'lucide-react';
import { Link } from 'react-router';
import { useEffect, useRef, useState } from 'react';
import TestimonialSection from '../components/TestimonialSection';
import ScrollReveal from '../components/ScrollReveal';

function AnimatedCounter({ from, to, duration = 2, suffix = '' }: { from: number, to: number, duration?: number, suffix?: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const count = useMotionValue(from);
  const rounded = useTransform(count, (latest) => Math.round(latest) + suffix);

  useEffect(() => {
    if (inView) {
      animate(count, to, { duration, ease: "easeOut" });
    }
  }, [inView, count, to, duration]);

  return <motion.span ref={ref}>{rounded}</motion.span>;
}

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
  return (
    <div className="flex flex-col gap-32 py-12 px-4 sm:px-6 lg:px-8">
      {/* Hero Section */}
      <section className="pt-24 pb-16 min-h-[85vh] flex items-center">
        <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <div className="order-2 lg:order-1 text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="inline-flex items-center space-x-2 bg-white px-5 py-2.5 rounded-full mb-8 text-sm font-bold text-slate-800 shadow-sm border border-slate-100"
            >
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
              </span>
              <span>Available for new opportunities</span>
            </motion.div>

            <motion.h1 
              className="text-5xl sm:text-6xl md:text-7xl font-black tracking-tighter text-slate-900 mb-8 leading-[1.05]"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            >
              Hi, I'm <br className="hidden md:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 bg-300% animate-gradient">Nsame Rene Tamjong</span>
            </motion.h1>
            
            <motion.div 
              className="text-xl md:text-2xl text-slate-500 max-w-2xl mx-auto lg:mx-0 mb-12 leading-relaxed font-medium min-h-[6rem] sm:min-h-[4rem]"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            >
              <TypewriterText text="Full Stack Software Engineer & Mathematics Educator. Founder & CEO of ELIGNITE. Creator of EduIgnite." delay={0.8} />
            </motion.div>
            
            <motion.div 
              className="flex flex-col sm:flex-row justify-center lg:justify-start gap-6 w-full sm:w-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            >
              <Link to="/projects" className="inline-flex justify-center items-center px-10 py-5 rounded-full bg-slate-900 text-white font-bold text-lg hover:bg-indigo-600 transition-all hover:shadow-xl hover:shadow-indigo-500/20 hover:-translate-y-1 active:translate-y-0 w-full sm:w-auto">
                View My Work <ArrowRight className="ml-3 w-6 h-6" />
              </Link>
              <a href="/Nsame_Rene_Tamjong_CV.pdf" download="Nsame_Rene_Tamjong_CV.pdf" target="_blank" rel="noopener noreferrer" className="inline-flex justify-center items-center px-10 py-5 rounded-full bg-white text-slate-900 font-bold text-lg shadow-sm border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-all hover:-translate-y-1 w-full sm:w-auto">
                <Download className="mr-3 w-6 h-6" /> Download CV
              </a>
            </motion.div>
          </div>

          {/* Right Image */}
          <motion.div
            className="order-1 lg:order-2 relative flex justify-center items-center"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          >
            <img
              src="https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=1200&q=80"
              alt="Nsame Rene"
              className="relative z-10 w-full max-w-md aspect-[4/5] object-cover mix-blend-multiply contrast-105"
              style={{ maskImage: 'linear-gradient(to bottom, black 80%, transparent 100%)', WebkitMaskImage: 'linear-gradient(to bottom, black 80%, transparent 100%)' }}
            />
            <motion.div 
              className="absolute bottom-12 -left-4 md:-left-12 z-20 bg-white p-6 rounded-3xl shadow-xl border border-slate-100 hidden sm:block"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              <div className="flex items-center gap-4">
                <div className="bg-indigo-100 p-3 rounded-2xl">
                  <Code className="w-8 h-8 text-indigo-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900">4+</p>
                  <p className="text-sm font-medium text-slate-500">Years Exp.</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <ScrollReveal className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto w-full">
        {[
          { label: 'Years Experience', to: 5, suffix: '+' },
          { label: 'Projects Completed', to: 50, suffix: '+' },
          { label: 'Happy Clients', to: 20, suffix: '+' },
          { label: 'Certifications', to: 15, suffix: '+' },
        ].map((stat, i) => (
          <motion.div 
            key={stat.label}
            className="text-center p-6 bg-white rounded-2xl shadow-sm border border-slate-100"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
          >
            <div className="text-3xl font-bold text-slate-900 mb-2">
              <AnimatedCounter from={0} to={stat.to} suffix={stat.suffix} />
            </div>
            <div className="text-sm font-medium text-slate-500">{stat.label}</div>
          </motion.div>
        ))}
      </ScrollReveal>

      {/* Skills Preview */}
      <ScrollReveal className="max-w-5xl mx-auto w-full">
        <div className="text-center mb-16">
          <span className="text-indigo-600 font-bold tracking-wider uppercase text-sm mb-2 block">What I Do</span>
          <h2 className="text-4xl font-extrabold text-slate-900">Technical Expertise</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { title: 'Frontend', icon: <Globe className="w-8 h-8 text-blue-500 mb-4" />, items: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS'] },
            { title: 'Backend', icon: <Terminal className="w-8 h-8 text-indigo-500 mb-4" />, items: ['Node.js', 'Express', 'PostgreSQL', 'Prisma'] },
            { title: 'Cloud & Architecture', icon: <Database className="w-8 h-8 text-sky-500 mb-4" />, items: ['AWS', 'Vercel', 'Docker', 'System Design'] },
          ].map((area, i) => (
            <motion.div 
              key={area.title}
              className="bg-white p-10 rounded-3xl shadow-sm border border-slate-100 text-left flex flex-col items-start hover:shadow-xl hover:border-indigo-100 transition-all duration-300 group"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <div className="p-4 bg-slate-50 rounded-2xl group-hover:bg-indigo-50 transition-colors mb-6">
                {area.icon}
              </div>
              <h3 className="text-2xl font-bold mb-4 text-slate-900">{area.title}</h3>
              <ul className="space-y-3 w-full">
                {area.items.map(item => (
                  <li key={item} className="flex items-center text-slate-600 font-medium">
                    <Code className="w-4 h-4 mr-3 text-indigo-400" /> {item}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </ScrollReveal>

      {/* Testimonials Section */}
      <ScrollReveal className="w-full">
        <TestimonialSection />
      </ScrollReveal>

      {/* Blog Preview Section */}
      <ScrollReveal className="max-w-6xl mx-auto w-full py-12">
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
            { title: "Building Scalable Architecture with Next.js", category: "Engineering", date: "Oct 12, 2023", readTime: "5 min read", img: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" },
            { title: "The Mathematics of Clean Code", category: "Philosophy", date: "Sep 28, 2023", readTime: "8 min read", img: "https://images.unsplash.com/photo-1509228468518-180dd4864904?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" },
            { title: "Why Prisma Changed How I Write Backends", category: "Database", date: "Sep 15, 2023", readTime: "6 min read", img: "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" },
          ].map((post, i) => (
            <motion.div
              key={post.title}
              className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden group cursor-pointer hover:shadow-lg transition-all"
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
              <div className="p-8">
                <div className="flex items-center text-xs font-medium text-slate-400 mb-3 space-x-3">
                  <span>{post.date}</span>
                  <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                  <span>{post.readTime}</span>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-4 group-hover:text-indigo-600 transition-colors leading-tight">
                  {post.title}
                </h3>
                <Link to="#" className="inline-flex items-center text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
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

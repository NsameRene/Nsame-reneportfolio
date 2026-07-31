import { motion } from 'motion/react';
import { ArrowRight, Calendar, Clock, Tag } from 'lucide-react';
import { Link } from 'react-router';
import ScrollReveal from '../components/ScrollReveal';

const blogPosts = [
  { 
    id: 1,
    title: "Building Scalable Architecture with Next.js", 
    category: "Engineering", 
    date: "Oct 12, 2023", 
    readTime: "5 min read", 
    excerpt: "Learn how to leverage Next.js App Router and Server Components to build highly scalable and performant web applications.",
    img: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
  },
  { 
    id: 2,
    title: "The Mathematics of Clean Code", 
    category: "Philosophy", 
    date: "Sep 28, 2023", 
    readTime: "8 min read", 
    excerpt: "Discover the hidden mathematical principles behind clean code, algorithmic efficiency, and scalable software design.",
    img: "https://images.unsplash.com/photo-1509228468518-180dd4864904?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
  },
  { 
    id: 3,
    title: "Why Prisma Changed How I Write Backends", 
    category: "Database", 
    date: "Sep 15, 2023", 
    readTime: "6 min read", 
    excerpt: "An in-depth look at how Prisma ORM simplifies database interactions, migrations, and type safety in Node.js applications.",
    img: "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
  },
  { 
    id: 4,
    title: "State Management in React 18", 
    category: "Frontend", 
    date: "Aug 22, 2023", 
    readTime: "7 min read", 
    excerpt: "Exploring the best practices for state management in modern React applications using context, zustand, and server state.",
    img: "https://images.unsplash.com/photo-1555099962-4199c345e5dd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
  }
];

export default function Blog() {
  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <ScrollReveal className="mb-16 text-center max-w-3xl mx-auto">
        <span className="text-indigo-600 font-bold tracking-wider uppercase text-sm mb-2 block">Insights & Articles</span>
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 mb-6">The ELIGNITE Blog</h1>
        <p className="text-xl text-slate-600">Thoughts, tutorials, and insights on software engineering, mathematics, and building digital products.</p>
      </ScrollReveal>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-10">
        {blogPosts.map((post, i) => (
          <motion.div
            key={post.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            className="bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-100 group hover:shadow-xl hover:border-indigo-100 transition-all flex flex-col sm:flex-row"
          >
            <div className="sm:w-2/5 relative overflow-hidden">
              <img src={post.img} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 min-h-[200px]" />
              <div className="absolute top-4 left-4 bg-white/95 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-indigo-600 uppercase tracking-wider shadow-sm">
                {post.category}
              </div>
            </div>
            
            <div className="p-6 sm:p-8 sm:w-3/5 flex flex-col justify-center">
              <div className="flex items-center text-xs font-medium text-slate-400 mb-3 space-x-4">
                <span className="flex items-center"><Calendar className="w-3 h-3 mr-1" /> {post.date}</span>
                <span className="flex items-center"><Clock className="w-3 h-3 mr-1" /> {post.readTime}</span>
              </div>
              
              <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-indigo-600 transition-colors leading-tight">
                {post.title}
              </h3>
              
              <p className="text-slate-600 text-sm mb-6 flex-grow leading-relaxed">
                {post.excerpt}
              </p>
              
              <Link to={`/blog/${post.id}`} className="inline-flex items-center text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors mt-auto">
                Read Article <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

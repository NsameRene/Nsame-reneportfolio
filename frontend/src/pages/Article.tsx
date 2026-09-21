import { useParams, Link } from 'react-router';
import { motion } from 'motion/react';
import { ArrowLeft, Calendar, Clock } from 'lucide-react';
import ScrollReveal from '../components/ScrollReveal';
import { useEffect, useState } from 'react';
import { getApiUrl } from '../utils/api';

const blogPosts = [
  { 
    id: 1,
    title: "Building Scalable Architecture with Next.js", 
    category: "Engineering", 
    date: "Oct 12, 2023", 
    readTime: "5 min read", 
    content: "When building modern web applications, choosing the right architecture is critical for scalability. Next.js App Router provides a seamless way to leverage React Server Components, minimizing client-side JavaScript and maximizing performance. \n\nWe start by separating our concerns. Server components handle data fetching, database interactions, and heavy computations, while client components are reserved strictly for interactive UI elements. This hybrid approach allows us to deliver blazingly fast pages without sacrificing interactivity. \n\nFurthermore, the built-in caching mechanisms in Next.js mean that we can statically generate most of our pages, only revalidating data when necessary. This results in incredibly resilient applications that can handle massive traffic spikes with ease.",
    img: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80" 
  },
  { 
    id: 2,
    title: "The Mathematics of Clean Code", 
    category: "Philosophy", 
    date: "Sep 28, 2023", 
    readTime: "8 min read", 
    content: "Clean code isn't just an aesthetic preference; it's deeply rooted in mathematical principles of logic and complexity. When we talk about cyclomatic complexity, we are essentially measuring the number of linearly independent paths through a program's source code.\n\nBy applying mathematical rigor to our functions, we can create code that is provably correct and easier to reason about. Pure functions, which always produce the same output for a given input, are the bedrock of reliable software systems. They eliminate side effects, making testing a trivial exercise.\n\nUltimately, striving for mathematical simplicity in code leads to systems that are not only robust but also a joy to maintain over long periods.",
    img: "https://images.unsplash.com/photo-1509228468518-180dd4864904?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80" 
  },
  { 
    id: 3,
    title: "Why Prisma Changed How I Write Backends", 
    category: "Database", 
    date: "Sep 15, 2023", 
    readTime: "6 min read", 
    content: "Database access has historically been a pain point in Node.js applications. Prisma changes the paradigm by providing a type-safe database client that feels like an extension of your TypeScript code.\n\nWith Prisma, you define your data model declaratively. The schema file becomes the single source of truth for your database structure. From this schema, Prisma generates a fully typed client tailored to your specific database, offering incredibly robust autocomplete and compile-time error checking.\n\nThis level of type safety eliminates an entire class of runtime errors, significantly speeding up development cycles and reducing the cognitive load on developers.",
    img: "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80" 
  },
  { 
    id: 4,
    title: "State Management in React 18", 
    category: "Frontend", 
    date: "Aug 22, 2023", 
    readTime: "7 min read", 
    content: "React 18 introduced concurrent rendering, profoundly impacting how we approach state management. Tools like Zustand and React Query have emerged as the standard for modern applications.\n\nZustand offers a minimalistic approach to global client state, avoiding the boilerplate of Redux while maintaining predictability. It's incredibly fast and integrates seamlessly with React's new concurrent features.\n\nFor server state, React Query is indispensable. It handles caching, background updates, and stale data seamlessly, allowing developers to treat server data almost identically to local state.",
    img: "https://images.unsplash.com/photo-1555099962-4199c345e5dd?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80" 
  }
];

// Maps a post from GET /api/blogs/:slugOrId onto the shape this page renders.
const fromApi = (p: any) => ({
  id: p.id,
  title: p.title,
  category: p.category,
  date: p.publishedAt
    ? new Date(p.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    : '',
  readTime: `${p.readingTime || 5} min read`,
  content: p.content,
  img: p.coverImage || 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
});

export default function Article() {
  const { id } = useParams();
  const [apiPost, setApiPost] = useState<ReturnType<typeof fromApi> | null>(null);
  const [loading, setLoading] = useState(true);

  // The blog list links to /blog/<slug>; the home page links to /blog/<id>.
  useEffect(() => {
    setLoading(true);
    fetch(getApiUrl(`/api/blogs/${encodeURIComponent(id || '')}`))
      .then(res => (res.ok ? res.json() : null))
      .then(data => setApiPost(data ? fromApi(data) : null))
      .catch(() => setApiPost(null))
      .finally(() => setLoading(false));
  }, [id]);

  const post = apiPost || blogPosts.find(p => p.id === Number(id));

  if (loading && !post) {
    return <div className="py-24 text-center text-slate-500 font-medium min-h-[60vh]">Loading article...</div>;
  }

  if (!post) {
    return (
      <div className="py-24 px-4 text-center max-w-7xl mx-auto min-h-[60vh] flex flex-col items-center justify-center">
        <h1 className="text-3xl font-bold text-slate-900 mb-4">Article Not Found</h1>
        <Link to="/blog" className="text-indigo-600 hover:underline flex items-center">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Blog
        </Link>
      </div>
    );
  }

  return (
    <article className="py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      <Link to="/blog" className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-indigo-600 mb-8 transition-colors">
        <ArrowLeft className="w-4 h-4 mr-2" /> Back to all articles
      </Link>
      
      <ScrollReveal className="mb-10 text-center">
        <span className="text-indigo-600 font-bold tracking-wider uppercase text-sm mb-4 block">{post.category}</span>
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 mb-6 leading-tight">{post.title}</h1>
        <div className="flex items-center justify-center text-sm font-medium text-slate-500 space-x-6">
          <span className="flex items-center"><Calendar className="w-4 h-4 mr-2" /> {post.date}</span>
          <span className="flex items-center"><Clock className="w-4 h-4 mr-2" /> {post.readTime}</span>
        </div>
      </ScrollReveal>

      <ScrollReveal delay={0.2}>
        <div className="rounded-3xl overflow-hidden shadow-lg mb-12 aspect-[21/9]">
          <img src={post.img} alt={post.title} className="w-full h-full object-cover" />
        </div>
      </ScrollReveal>

      <ScrollReveal delay={0.3} className="prose prose-lg prose-slate max-w-none prose-headings:font-bold prose-headings:text-slate-900 prose-a:text-indigo-600">
        {post.content.split('\n\n').map((paragraph, index) => (
          <p key={index} className="mb-6 text-slate-700 leading-relaxed">
            {paragraph}
          </p>
        ))}
      </ScrollReveal>
    </article>
  );
}

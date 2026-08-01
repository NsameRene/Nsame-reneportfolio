const fs = require('fs');
let code = fs.readFileSync('src/pages/Home.tsx', 'utf8');

const heroRegex = /\{\/\* Hero Section \*\/\}[\s\S]*?\{\/\* Quote Section \*\/\}/;
const newHero = `{/* Hero Section */}
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
      {/* Quote Section */}`;

code = code.replace(heroRegex, newHero);
fs.writeFileSync('src/pages/Home.tsx', code);

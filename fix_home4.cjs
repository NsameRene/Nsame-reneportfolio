const fs = require('fs');
let code = fs.readFileSync('src/pages/Home.tsx', 'utf8');

// Change the main wrapper 
code = code.replace('<div className="flex flex-col gap-32 py-12 px-4 sm:px-6 lg:px-8">', '<div className="flex flex-col gap-32 pb-12">');

// Update Hero Section styling to match the image
const oldHeroSection = /<section className="relative w-full overflow-hidden bg-\[#f4f7f8\][\s\S]*?<\/section>/;
const newHeroSection = `<section className="relative w-full overflow-hidden bg-[#eef1f5] min-h-[90vh] flex items-center pt-24 pb-0">
        <div className="absolute bottom-0 inset-x-0 h-64 pointer-events-none z-0 opacity-20">
          <svg viewBox="0 0 1440 320" className="absolute bottom-0 w-full h-auto text-slate-400">
            <path fill="none" stroke="currentColor" strokeWidth="1" d="M0,192L48,186.7C96,181,192,171,288,181.3C384,192,480,224,576,213.3C672,203,768,149,864,138.7C960,128,1056,160,1152,181.3C1248,203,1344,213,1392,218.7L1440,224"></path>
            <path fill="none" stroke="currentColor" strokeWidth="1" d="M0,256L48,240C96,224,192,192,288,197.3C384,203,480,245,576,234.7C672,224,768,160,864,133.3C960,107,1056,117,1152,149.3C1248,181,1344,235,1392,261.3L1440,288"></path>
            <path fill="none" stroke="currentColor" strokeWidth="1" d="M0,128L48,144C96,160,192,192,288,192C384,192,480,160,576,144C672,128,768,128,864,138.7C960,149,1056,171,1152,176C1248,181,1344,171,1392,165.3L1440,160"></path>
          </svg>
        </div>
        
        <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10 pt-16">
          {/* Left Content */}
          <div className="order-2 lg:order-1 text-center lg:text-left mb-12 lg:mb-0">
            <motion.h4 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-[#f75023] text-sm font-bold uppercase tracking-widest mb-6"
            >
              Get Every Single Solutions.
            </motion.h4>
            <motion.h1 
              className="text-5xl sm:text-6xl md:text-7xl font-serif text-[#1e2a39] leading-[1.15] mb-6 font-bold"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              I'm Full Stack Developer <br /> <span className="text-[#1e2a39]">{settings.name || "Nsame Reneta Mjong"}</span>
            </motion.h1>
            <motion.p 
              className="text-[#64748b] mb-10 max-w-lg mx-auto lg:mx-0 text-[15px] leading-relaxed font-medium"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              {settings.bio || "jhorem rfpsum dolor sidt amet, consectetur adipiscing elit, elusmod tempor incididunt utcjhg labore bet dolore magna aliqua. Quis ipsum suspendisse ultrices gravida."}
            </motion.p>
            <motion.div 
              className="flex flex-wrap items-center justify-center lg:justify-start gap-5"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <Link to="/about" className="px-8 py-3.5 bg-[#f75023] text-white font-bold rounded hover:bg-[#e0451a] transition-all shadow-lg shadow-[#f75023]/30">
                Learn More
              </Link>
              <Link to="/contact" className="px-8 py-3.5 bg-transparent border border-[#d2d6dc] text-[#1e2a39] font-bold rounded hover:bg-[#e5e7eb] transition-all">
                Hire Me
              </Link>
            </motion.div>
          </div>
          
          {/* Right Content */}
          <div className="order-1 lg:order-2 flex justify-center lg:justify-end relative self-end">
            <motion.img 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              src={settings.profileImageUrl || "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"} 
              alt={settings.name || "Profile"} 
              className="max-h-[500px] lg:max-h-[650px] object-contain relative z-10 block"
            />
          </div>
        </div>
      </section>`;

code = code.replace(oldHeroSection, newHeroSection);
fs.writeFileSync('src/pages/Home.tsx', code);

const fs = require('fs');

let code = fs.readFileSync('src/pages/Home.tsx', 'utf8');

// Add the import for API_BASE if not exists
if (!code.includes('import { API_BASE }')) {
  code = code.replace(/import \{ Link \} from 'react-router';/, "import { Link } from 'react-router';\nimport { API_BASE } from '../utils/api';");
}

// Check if we already fetch settings
if (!code.includes('const [settings, setSettings] = useState')) {
  const componentStart = 'export default function Home() {';
  const newSetup = `
  const [settings, setSettings] = useState<any>({});
  
  useEffect(() => {
    fetch(\`\${API_BASE}/api/settings\`)
      .then(res => res.json())
      .then(data => setSettings(data))
      .catch(err => console.error(err));
  }, []);
`;
  code = code.replace(componentStart, componentStart + newSetup);
}

const oldHeroRegex = /\{\/\* Hero Section \*\/\}[\s\S]*?(?=\{\/\* About Me Snapshot \*\/\}|\{\/\* Skills Preview \*\/\}|\{\/\* Testimonials Section \*\/\}|\{\/\* Quotes Section \*\/\}|\{\/\* Blog Preview Section \*\/\}|<\/div>)/;

const newHero = `
      {/* Hero Section */}
      <section className="relative w-full overflow-hidden bg-[#f4f7f8] min-h-[90vh] flex items-center pt-24 -mt-12 rounded-3xl mb-12 shadow-sm border border-slate-100">
        <div className="absolute bottom-0 inset-x-0 h-64 pointer-events-none z-0 opacity-20">
          <svg viewBox="0 0 1440 320" className="absolute bottom-0 w-full h-auto text-slate-400">
            <path fill="currentColor" fillOpacity="0.2" d="M0,192L48,186.7C96,181,192,171,288,181.3C384,192,480,224,576,213.3C672,203,768,149,864,138.7C960,128,1056,160,1152,181.3C1248,203,1344,213,1392,218.7L1440,224L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
            <path fill="currentColor" fillOpacity="0.4" d="M0,256L48,240C96,224,192,192,288,197.3C384,203,480,245,576,234.7C672,224,768,160,864,133.3C960,107,1056,117,1152,149.3C1248,181,1344,235,1392,261.3L1440,288L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
          </svg>
        </div>
        
        <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10 py-16">
          {/* Left Content */}
          <div className="order-2 lg:order-1 text-center lg:text-left">
            <motion.h4 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-[#f76b4c] text-sm font-bold uppercase tracking-widest mb-6"
            >
              Get Every Single Solutions.
            </motion.h4>
            <motion.h1 
              className="text-5xl sm:text-6xl md:text-7xl font-serif text-[#1e2a39] leading-[1.1] mb-8 font-bold"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              I'm Full Stack Developer <br /> {settings.name || "Nsame Reneta Mjong"}
            </motion.h1>
            <motion.p 
              className="text-[#64748b] mb-10 max-w-lg mx-auto lg:mx-0 text-lg leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              {settings.bio || "jhorem rfpsum dolor sidt amet, consectetur adipiscing elit, elusmod tempor incididunt utcjhg labore bet dolore magna aliqua. Quis ipsum suspendisse ultrices gravida."}
            </motion.p>
            <motion.div 
              className="flex flex-wrap items-center justify-center lg:justify-start gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <Link to="/about" className="px-8 py-4 bg-[#f76b4c] text-white font-bold rounded hover:bg-[#e05e41] transition-colors shadow-lg shadow-[#f76b4c]/30">
                Learn More
              </Link>
              <Link to="/contact" className="px-8 py-4 bg-transparent border border-[#d2d6dc] text-[#64748b] font-bold rounded hover:bg-[#e5e7eb] transition-colors">
                Hire Me
              </Link>
            </motion.div>
          </div>
          
          {/* Right Content */}
          <div className="order-1 lg:order-2 flex justify-center lg:justify-end relative">
            <motion.img 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              src={settings.profileImageUrl || "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"} 
              alt={settings.name || "Profile"} 
              className="max-h-[500px] lg:max-h-[600px] object-contain relative z-10 drop-shadow-2xl rounded-b-3xl"
            />
          </div>
        </div>
      </section>
      
`;

code = code.replace(oldHeroRegex, newHero);

fs.writeFileSync('src/pages/Home.tsx', code);

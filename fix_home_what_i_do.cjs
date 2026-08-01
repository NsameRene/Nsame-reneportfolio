const fs = require('fs');
let code = fs.readFileSync('src/pages/Home.tsx', 'utf8');

if (!code.includes('const [whatIDo, setWhatIDo]')) {
  // Add state
  const stateCode = `  const [whatIDo, setWhatIDo] = useState<any[]>([]);
  useEffect(() => {
    fetch(\`\${API_BASE}/api/what_i_do\`).then(res => res.json()).then(data => setWhatIDo(data)).catch(console.error);
  }, []);
`;
  code = code.replace(/const \[settings, setSettings\] = useState<any>\(\{\}\);/, "const [settings, setSettings] = useState<any>({});\n" + stateCode);
  
  // Now replace the hardcoded "What I Do" section
  const oldWhatIDoRegex = /\{\/\* Skills Preview \*\/\}[\s\S]*?\{\/\* Testimonials Section \*\/\}/;
  
  const newWhatIDo = `{/* Skills Preview */}
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
      {/* Testimonials Section */}`;
      
  code = code.replace(oldWhatIDoRegex, newWhatIDo);
  fs.writeFileSync('src/pages/Home.tsx', code);
}

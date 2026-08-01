const fs = require('fs');
let code = fs.readFileSync('src/pages/Admin.tsx', 'utf8');

if (!code.includes("What I Do")) {
  // 1. Import Terminal or Cpu
  code = code.replace(/import \{.*?\} from 'lucide-react';/, (match) => {
    return match.replace("LayoutDashboard,", "LayoutDashboard, Cpu,");
  });

  // 2. Add to tabs
  code = code.replace(/\{ name: 'Gallery', icon: ImageIcon \},/, "{ name: 'Gallery', icon: ImageIcon },\n    { name: 'What I Do', icon: Cpu },");

  // 3. Add to endpoints
  code = code.replace(/const endpoints = \['projects', 'blogs', 'courses', 'quotes', 'gallery', 'education', 'experiences', 'skills', 'certificates'\];/,
  "const endpoints = ['projects', 'blogs', 'courses', 'quotes', 'gallery', 'education', 'experiences', 'skills', 'certificates', 'what_i_do'];");

  // 4. Update the form logic
  // Looking for activeTab === 'Quotes' and its rendering to understand the structure
  
  fs.writeFileSync('src/pages/Admin.tsx', code);
}

const fs = require('fs');
let code = fs.readFileSync('src/pages/Home.tsx', 'utf8');

// Add px-4 sm:px-6 lg:px-8 to ScrollReveal components that need it
code = code.replace(/<ScrollReveal className="max-w-5xl mx-auto w-full py-12">/g, '<ScrollReveal className="max-w-5xl mx-auto w-full py-12 px-4 sm:px-6 lg:px-8">');
code = code.replace(/<ScrollReveal className="max-w-5xl mx-auto w-full">/g, '<ScrollReveal className="max-w-5xl mx-auto w-full px-4 sm:px-6 lg:px-8">');
code = code.replace(/<ScrollReveal className="w-full">/g, '<ScrollReveal className="w-full px-4 sm:px-6 lg:px-8">');
code = code.replace(/<ScrollReveal className="max-w-4xl mx-auto w-full py-16">/g, '<ScrollReveal className="max-w-4xl mx-auto w-full py-16 px-4 sm:px-6 lg:px-8">');
code = code.replace(/<ScrollReveal className="max-w-6xl mx-auto w-full py-12">/g, '<ScrollReveal className="max-w-6xl mx-auto w-full py-12 px-4 sm:px-6 lg:px-8">');

fs.writeFileSync('src/pages/Home.tsx', code);

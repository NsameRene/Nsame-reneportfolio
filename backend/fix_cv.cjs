const fs = require('fs');

let code = fs.readFileSync('src/pages/CV.tsx', 'utf8');

code = code.replace(
  /fetch\(\`\$\{API_BASE\}\/api\/certificates\`\).then\(res => res.json\(\)\)/g,
  `fetch(\`\${API_BASE}/api/certificates\`).then(res => res.json()),
          fetch(\`\${API_BASE}/api/settings\`).then(res => res.json())`
);

code = code.replace(
  /const \[exp, edu, ski, cert\] = await Promise.all/g,
  `const [exp, edu, ski, cert, settingsData] = await Promise.all`
);

code = code.replace(
  /certificates: cert/g,
  `certificates: cert,
          settings: settingsData`
);

code = code.replace(
  /certificates: \[\]/g,
  `certificates: [],
    settings: { name: '', bio: '', email: '', phone: '', location: '', website: '', profileImageUrl: '' }`
);

fs.writeFileSync('src/pages/CV.tsx', code);

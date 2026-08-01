const fs = require('fs');
let content = fs.readFileSync('src/pages/Admin.tsx', 'utf8');

content = content.replace(/fetch\(\`\$\{API_BASE\}\/api\/auth\/check', \{/g, "fetch(`${API_BASE}/api/auth/check`, {");
content = content.replace(/fetch\(\`\$\{API_BASE\}\/api\/auth\/login', \{/g, "fetch(`${API_BASE}/api/auth/login`, {");

fs.writeFileSync('src/pages/Admin.tsx', content);

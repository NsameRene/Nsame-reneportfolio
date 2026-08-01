const fs = require('fs');
let content = fs.readFileSync('src/pages/Admin.tsx', 'utf8');

content = content.replace(/let url = \`\\\/api\\\/\$\{type\}\`;/g, "let url = `${API_BASE}/api/${type}`;");

fs.writeFileSync('src/pages/Admin.tsx', content);

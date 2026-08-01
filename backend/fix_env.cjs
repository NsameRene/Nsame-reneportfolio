const fs = require('fs');

let apiTs = fs.readFileSync('src/utils/api.ts', 'utf8');
apiTs = `/// <reference types="vite/client" />\n` + apiTs;
fs.writeFileSync('src/utils/api.ts', apiTs);

// Fix Blog.tsx import
let blogTs = fs.readFileSync('src/pages/Blog.tsx', 'utf8');
if (!blogTs.includes('import { API_BASE }')) {
  blogTs = `import { API_BASE } from '../utils/api';\n` + blogTs;
  fs.writeFileSync('src/pages/Blog.tsx', blogTs);
}

// Fix Contact.tsx import
let contactTs = fs.readFileSync('src/pages/Contact.tsx', 'utf8');
if (!contactTs.includes('import { API_BASE }')) {
  contactTs = `import { API_BASE } from '../utils/api';\n` + contactTs;
  fs.writeFileSync('src/pages/Contact.tsx', contactTs);
}

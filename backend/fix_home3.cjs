const fs = require('fs');
let code = fs.readFileSync('src/pages/Home.tsx', 'utf8');

const regex = /<\/section>[\s\S]*?<\/section>/;
const replacement = `</section>`;

code = code.replace(regex, replacement);

fs.writeFileSync('src/pages/Home.tsx', code);

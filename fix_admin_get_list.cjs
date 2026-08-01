const fs = require('fs');
let code = fs.readFileSync('src/pages/Admin.tsx', 'utf8');

code = code.replace(/const getListToRender = \(\) => \{\n    let type = activeTab.toLowerCase\(\);/g, "const getListToRender = () => {\n    let type = activeTab.toLowerCase().replace(/ /g, '_');");

fs.writeFileSync('src/pages/Admin.tsx', code);

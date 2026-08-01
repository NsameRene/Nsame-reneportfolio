const fs = require('fs');
let code = fs.readFileSync('src/pages/Admin.tsx', 'utf8');

code = code.replace(/let type = activeTab.toLowerCase\(\);/, "let type = activeTab.toLowerCase().replace(/ /g, '_');");

code = code.replace(/handleDelete\(activeTab.toLowerCase\(\)/g, "handleDelete(activeTab.toLowerCase().replace(/ /g, '_')");

fs.writeFileSync('src/pages/Admin.tsx', code);

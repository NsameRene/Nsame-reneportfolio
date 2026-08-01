const fs = require('fs');
let code = fs.readFileSync('src/db/schema.ts', 'utf8');

if (!code.includes("what_i_do")) {
  code += `\n\nexport const what_i_do = pgTable('what_i_do', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  icon: text('icon').notNull(), // 'Globe', 'Terminal', 'Database', etc.
  items: text('items').notNull(), // JSON string array
});\n`;
  fs.writeFileSync('src/db/schema.ts', code);
}

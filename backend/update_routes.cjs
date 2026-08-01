const fs = require('fs');
let code = fs.readFileSync('src/routes/index.ts', 'utf8');

if (!code.includes("app.get('/api/what_i_do'")) {
  const replacement = `
  app.get('/api/what_i_do', async (req, res) => {
    try {
      const all = await db.select().from(schema.what_i_do);
      res.json(all);
    } catch (e) { res.status(500).json({ error: 'Failed' }); }
  });

  createCrud('what_i_do', schema.what_i_do);

  app.post('/api/auth/login'`;
  
  code = code.replace("app.post('/api/auth/login'", replacement);
  fs.writeFileSync('src/routes/index.ts', code);
}

const fs = require('fs');
let content = fs.readFileSync('src/routes/index.ts', 'utf8');

const crudRoutes = `
  // Public GET routes for new entities
  app.get('/api/courses', async (req, res) => {
    try {
      const all = await db.select().from(schema.courses);
      res.json(all);
    } catch (e) { res.status(500).json({ error: 'Failed' }); }
  });
  app.get('/api/quotes', async (req, res) => {
    try {
      const all = await db.select().from(schema.quotes);
      res.json(all);
    } catch (e) { res.status(500).json({ error: 'Failed' }); }
  });
  app.get('/api/gallery', async (req, res) => {
    try {
      const all = await db.select().from(schema.gallery);
      res.json(all);
    } catch (e) { res.status(500).json({ error: 'Failed' }); }
  });
  app.get('/api/education', async (req, res) => {
    try {
      const all = await db.select().from(schema.education);
      res.json(all);
    } catch (e) { res.status(500).json({ error: 'Failed' }); }
  });

  // Protected POST/PUT/DELETE routes
  const createCrud = (name, schemaObj) => {
    app.post(\`/api/\${name}\`, requireAuth, upload.single('image'), async (req, res) => {
      try {
        const data = { ...req.body };
        if (req.file) {
          data.imageUrl = \`/uploads/\${req.file.filename}\`;
        }
        const result = await db.insert(schemaObj).values(data).returning();
        res.json(result[0]);
      } catch (e) { res.status(500).json({ error: 'Failed' }); }
    });
    app.put(\`/api/\${name}/:id\`, requireAuth, upload.single('image'), async (req, res) => {
      try {
        const data = { ...req.body };
        if (req.file) {
          data.imageUrl = \`/uploads/\${req.file.filename}\`;
        }
        const result = await db.update(schemaObj).set(data).where(eq(schemaObj.id, parseInt(req.params.id))).returning();
        res.json(result[0]);
      } catch (e) { res.status(500).json({ error: 'Failed' }); }
    });
    app.delete(\`/api/\${name}/:id\`, requireAuth, async (req, res) => {
      try {
        await db.delete(schemaObj).where(eq(schemaObj.id, parseInt(req.params.id)));
        res.json({ success: true });
      } catch (e) { res.status(500).json({ error: 'Failed' }); }
    });
  };

  createCrud('courses', schema.courses);
  createCrud('quotes', schema.quotes);
  createCrud('gallery', schema.gallery);
  createCrud('education', schema.education);
  createCrud('experiences', schema.experiences);
  createCrud('skills', schema.skills);
  createCrud('certificates', schema.certificates);

  // Similarly add other CRUD routes...
`;

content = content.replace('  // Similarly add other CRUD routes...', crudRoutes);
fs.writeFileSync('src/routes/index.ts', content);

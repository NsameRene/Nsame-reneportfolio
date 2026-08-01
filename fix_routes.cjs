const fs = require('fs');
let code = fs.readFileSync('src/routes/index.ts', 'utf8');

// Insert settings routes
const settingsRoutes = `
  app.get('/api/settings', async (req, res) => {
    try {
      const allSettings = await db.select().from(schema.settings);
      const settingsObj = allSettings.reduce((acc, row) => {
        acc[row.key] = row.value;
        return acc;
      }, {});
      res.json(settingsObj);
    } catch (e) {
      console.error(e);
      res.status(500).json({ error: 'Failed to fetch settings' });
    }
  });

  app.put('/api/settings', requireAuth, async (req, res) => {
    try {
      const updates = Object.entries(req.body);
      for (const [key, value] of updates) {
        // Upsert setting
        const existing = await db.select().from(schema.settings).where(eq(schema.settings.key, key));
        if (existing.length > 0) {
          await db.update(schema.settings).set({ value: String(value) }).where(eq(schema.settings.key, key));
        } else {
          await db.insert(schema.settings).values({ key, value: String(value) });
        }
      }
      res.json({ success: true });
    } catch (e) {
      console.error(e);
      res.status(500).json({ error: 'Failed to update settings' });
    }
  });
`;

if (!code.includes("app.get('/api/settings'")) {
  code = code.replace("export function setupRoutes(app: Express) {", "export function setupRoutes(app: Express) {" + settingsRoutes);
  fs.writeFileSync('src/routes/index.ts', code);
}

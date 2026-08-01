const fs = require('fs');
let code = fs.readFileSync('src/routes/index.ts', 'utf8');

const settingsRoute = `
// Settings
router.get('/settings', async (req, res) => {
  try {
    const items = await db.select().from(schema.settings).where(eq(schema.settings.id, 1));
    if (items.length > 0) res.json(items[0]);
    else res.json({ id: 1, name: '', bio: '', email: '', profileImageUrl: '' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch' });
  }
});

router.put('/settings', async (req, res) => {
  try {
    const { name, bio, email, profileImageUrl, phone, location, website } = req.body;
    const existing = await db.select().from(schema.settings).where(eq(schema.settings.id, 1));
    if (existing.length === 0) {
      await db.insert(schema.settings).values({ id: 1, name, bio, email, profileImageUrl, phone, location, website });
    } else {
      await db.update(schema.settings).set({ name, bio, email, profileImageUrl, phone, location, website }).where(eq(schema.settings.id, 1));
    }
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update' });
  }
});
`;

code = code.replace(/export default router;/g, settingsRoute + '\nexport default router;');

fs.writeFileSync('src/routes/index.ts', code);

import { Express } from 'express';
import multer from 'multer';
import { requireAuth, AuthRequest } from '../middleware/auth.js';
import { db } from '../db/index.js';
import * as schema from '../db/schema.js';
import { eq } from 'drizzle-orm';

const upload = multer({ dest: 'uploads/' });

export function setupRoutes(app: Express) {
  // Public Routes
  app.get('/api/projects', async (req, res) => {
    try {
      const allProjects = await db.select().from(schema.projects);
      if (allProjects.length === 0) {
        // Return demo data
        return res.json([
          {
            id: 1,
            title: 'EduIgnite School Management System',
            description: 'A comprehensive platform for school administration, integrating robust backend services with an intuitive frontend.',
            technologies: 'React, Node.js, PostgreSQL, Tailwind CSS',
            category: 'Full Stack',
            featured: true,
            imageUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            githubLink: '#',
            liveDemoLink: '#'
          },
          {
            id: 2,
            title: 'ELIGNITE Corporate Platform',
            description: 'Corporate website and client portal for ELIGNITE, featuring a custom CMS and real-time client communication.',
            technologies: 'Next.js, Prisma, TypeScript',
            category: 'Web App',
            featured: true,
            imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            githubLink: '#',
            liveDemoLink: '#'
          },
          {
            id: 3,
            title: 'Mathematics Learning Hub',
            description: 'Interactive mathematics learning platform with algorithmic problem generation and progress tracking.',
            technologies: 'React, Express, MongoDB',
            category: 'EdTech',
            featured: false,
            imageUrl: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            githubLink: '#',
            liveDemoLink: '#'
          }
        ]);
      }
      res.json(allProjects);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to fetch projects' });
    }
  });

  app.get('/api/blogs', async (req, res) => {
    try {
      const allBlogs = await db.select().from(schema.blogs);
      res.json(allBlogs);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to fetch blogs' });
    }
  });

  app.get('/api/skills', async (req, res) => {
    try {
      const allSkills = await db.select().from(schema.skills);
      res.json(allSkills);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to fetch skills' });
    }
  });

  app.get('/api/experiences', async (req, res) => {
    try {
      const allExp = await db.select().from(schema.experiences);
      res.json(allExp);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to fetch experiences' });
    }
  });

  app.get('/api/certificates', async (req, res) => {
    try {
      const allCerts = await db.select().from(schema.certificates);
      res.json(allCerts);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to fetch certificates' });
    }
  });

  app.post('/api/contact', async (req, res) => {
    try {
      const { name, email, subject, message } = req.body;
      await db.insert(schema.contact_messages).values({ name, email, subject, message });
      res.json({ success: true });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to send message' });
    }
  });

  // Protected Admin Routes
  app.post('/api/projects', requireAuth, upload.single('image'), async (req: AuthRequest, res) => {
    try {
      const { title, description, technologies, category, githubLink, liveDemoLink } = req.body;
      const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;
      const featured = req.body.featured === 'true';

      const result = await db.insert(schema.projects).values({
        title, description, technologies, category, githubLink, liveDemoLink, featured, imageUrl
      }).returning();
      res.json(result[0]);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to create project' });
    }
  });

  // Similarly add other CRUD routes...
  // User login/registration check
  app.post('/api/auth/check', requireAuth, async (req: AuthRequest, res) => {
    try {
      const uid = req.user!.uid;
      const email = req.user!.email || '';
      
      const result = await db.insert(schema.users)
        .values({ uid, email, role: 'admin' }) // Only author login allows for now, so assume admin
        .onConflictDoUpdate({ target: schema.users.uid, set: { email } })
        .returning();

      res.json(result[0]);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to check auth' });
    }
  });
}

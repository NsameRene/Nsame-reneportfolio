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
      if (allBlogs.length === 0) {
        return res.json([
          {
            id: 1,
            title: "Building Scalable Architecture with Next.js",
            category: "Engineering",
            publishedAt: "Oct 12, 2023",
            readingTime: 5,
            content: "Learn how to leverage Next.js App Router and Server Components to build highly scalable and performant web applications.",
            coverImage: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            slug: "building-scalable-architecture"
          },
          {
            id: 2,
            title: "The Mathematics of Clean Code",
            category: "Philosophy",
            publishedAt: "Sep 28, 2023",
            readingTime: 8,
            content: "Discover the hidden mathematical principles behind clean code, algorithmic efficiency, and scalable software design.",
            coverImage: "https://images.unsplash.com/photo-1509228468518-180dd4864904?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            slug: "mathematics-of-clean-code"
          },
          {
            id: 3,
            title: "Why Prisma Changed How I Write Backends",
            category: "Database",
            publishedAt: "Sep 15, 2023",
            readingTime: 6,
            content: "An in-depth look at how Prisma ORM simplifies database interactions, migrations, and type safety in Node.js applications.",
            coverImage: "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            slug: "prisma-changed-backends"
          },
          {
            id: 4,
            title: "State Management in React 18",
            category: "Frontend",
            publishedAt: "Aug 22, 2023",
            readingTime: 7,
            content: "Exploring the best practices for state management in modern React applications using context, zustand, and server state.",
            coverImage: "https://images.unsplash.com/photo-1555099962-4199c345e5dd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            slug: "state-management-react-18"
          }
        ]);
      }
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
      const imageUrl = req.file ? `/uploads/${req.file.filename}` : req.body.imageUrl;
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

  app.put('/api/projects/:id', requireAuth, upload.single('image'), async (req: AuthRequest, res) => {
    try {
      const { id } = req.params;
      const { title, description, technologies, category, githubLink, liveDemoLink } = req.body;
      const featured = req.body.featured === 'true';
      
      let updateData: any = { title, description, technologies, category, githubLink, liveDemoLink, featured };
      if (req.file) updateData.imageUrl = `/uploads/${req.file.filename}`;
      
      const result = await db.update(schema.projects).set(updateData).where(eq(schema.projects.id, parseInt(id))).returning();
      res.json(result[0]);
    } catch (error) {
      res.status(500).json({ error: 'Failed to update project' });
    }
  });

  app.delete('/api/projects/:id', requireAuth, async (req: AuthRequest, res) => {
    try {
      await db.delete(schema.projects).where(eq(schema.projects.id, parseInt(req.params.id)));
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete project' });
    }
  });

  app.post('/api/blogs', requireAuth, upload.single('image'), async (req: AuthRequest, res) => {
    try {
      const { title, slug, content, category, tags, readingTime } = req.body;
      const coverImage = req.file ? `/uploads/${req.file.filename}` : req.body.coverImage;

      const result = await db.insert(schema.blogs).values({
        title, slug, content, category, tags, readingTime: parseInt(readingTime) || 5, coverImage
      }).returning();
      res.json(result[0]);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to create blog' });
    }
  });

  app.put('/api/blogs/:id', requireAuth, upload.single('image'), async (req: AuthRequest, res) => {
    try {
      const { id } = req.params;
      const { title, slug, content, category, tags, readingTime } = req.body;
      
      let updateData: any = { title, slug, content, category, tags, readingTime: parseInt(readingTime) || 5 };
      if (req.file) updateData.coverImage = `/uploads/${req.file.filename}`;
      
      const result = await db.update(schema.blogs).set(updateData).where(eq(schema.blogs.id, parseInt(id))).returning();
      res.json(result[0]);
    } catch (error) {
      res.status(500).json({ error: 'Failed to update blog' });
    }
  });

  app.delete('/api/blogs/:id', requireAuth, async (req: AuthRequest, res) => {
    try {
      await db.delete(schema.blogs).where(eq(schema.blogs.id, parseInt(req.params.id)));
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete blog' });
    }
  });

  // Similarly add other CRUD routes...
  // User login
  app.post('/api/auth/login', async (req, res) => {
    try {
      const { email, password } = req.body;
      
      // We will allow a hardcoded admin login if DB is empty or as a fallback
      const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@elignite.com';
      const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';
      
      let user = null;
      
      try {
        const users = await db.select().from(schema.users).where(eq(schema.users.email, email));
        if (users.length > 0) {
          user = users[0];
        }
      } catch (err) {
        // DB query might fail if DB isn't setup
        console.warn("DB query for user failed, using fallback.", err);
      }
      
      let isValid = false;
      
      if (user) {
        const bcrypt = await import('bcryptjs');
        isValid = await bcrypt.default.compare(password, user.password);
      } else if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
        isValid = true;
        user = { email: ADMIN_EMAIL, role: 'admin' };
      }
      
      if (!isValid) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }
      
      const jwt = await import('jsonwebtoken');
      const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-key-for-dev';
      const token = jwt.default.sign({ email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '1d' });
      
      res.json({ token, user: { email: user.email, role: user.role } });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to authenticate' });
    }
  });

  // User login/registration check
  app.post('/api/auth/check', requireAuth, async (req: AuthRequest, res) => {
    try {
      res.json({ user: req.user });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to check auth' });
    }
  });
}

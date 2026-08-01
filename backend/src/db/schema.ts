import { relations } from 'drizzle-orm';
import { integer, pgTable, serial, text, timestamp, boolean } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  email: text('email').notNull().unique(),
  password: text('password').notNull(),
  name: text('name'),
  role: text('role').default('user'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const projects = pgTable('projects', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  description: text('description').notNull(),
  technologies: text('technologies').notNull(), // JSON string or comma separated
  imageUrl: text('image_url'),
  githubLink: text('github_link'),
  liveDemoLink: text('live_demo_link'),
  category: text('category'),
  featured: boolean('featured').default(false),
  createdAt: timestamp('created_at').defaultNow(),
});

export const blogs = pgTable('blogs', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  slug: text('slug').notNull().unique(),
  content: text('content').notNull(),
  coverImage: text('cover_image'),
  category: text('category'),
  tags: text('tags'), // JSON string
  publishedAt: timestamp('published_at').defaultNow(),
  readingTime: integer('reading_time'), // in minutes
});

export const skills = pgTable('skills', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  category: text('category').notNull(), // Frontend, Backend, etc.
  proficiency: integer('proficiency').notNull(), // 0 - 100
});

export const experiences = pgTable('experiences', {
  id: serial('id').primaryKey(),
  company: text('company').notNull(),
  role: text('role').notNull(),
  startDate: text('start_date').notNull(),
  endDate: text('end_date'),
  description: text('description').notNull(),
});

export const certificates = pgTable('certificates', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  issuer: text('issuer').notNull(),
  date: text('date').notNull(),
  link: text('link'),
});

export const education = pgTable('education', {
  id: serial('id').primaryKey(),
  institution: text('institution').notNull(),
  degree: text('degree').notNull(),
  startDate: text('start_date').notNull(),
  endDate: text('end_date'),
  description: text('description'),
});

export const courses = pgTable('courses', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  description: text('description').notNull(),
  imageUrl: text('image_url'),
  link: text('link'),
});

export const quotes = pgTable('quotes', {
  id: serial('id').primaryKey(),
  text: text('text').notNull(),
  author: text('author').notNull(),
});

export const gallery = pgTable('gallery', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  imageUrl: text('image_url').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

export const contact_messages = pgTable('contact_messages', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull(),
  subject: text('subject').notNull(),
  message: text('message').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

export const settings = pgTable('settings', {
  id: integer('id').primaryKey(), // We'll just use a single row with id 1
  name: text('name'),
  email: text('email'),
  bio: text('bio'),
  profileImageUrl: text('profileImageUrl'),
  phone: text('phone'),
  location: text('location'),
  website: text('website')
});


export const what_i_do = pgTable('what_i_do', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  icon: text('icon').notNull(), // 'Globe', 'Terminal', 'Database', etc.
  items: text('items').notNull(), // JSON string array
});

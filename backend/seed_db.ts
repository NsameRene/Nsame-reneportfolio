import { db } from './src/db/index.js';
import * as schema from './src/db/schema.js';
import { sql } from 'drizzle-orm';

async function main() {
  console.log("Checking courses...");
  const coursesCount = await db.select({ count: sql<number>`count(*)` }).from(schema.courses);
  if (Number(coursesCount[0].count) === 0) {
    console.log("Inserting demo courses...");
    await db.insert(schema.courses).values([
      { title: "React Masterclass", description: "Learn React from zero to hero.", imageUrl: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", link: "#" },
      { title: "Full Stack Next.js", description: "Build full stack apps with Next.js, Prisma, and PostgreSQL.", imageUrl: "https://images.unsplash.com/photo-1618477388954-7852f32655ec?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", link: "#" },
    ]);
  }

  console.log("Checking experiences...");
  const expCount = await db.select({ count: sql<number>`count(*)` }).from(schema.experiences);
  if (Number(expCount[0].count) === 0) {
    console.log("Inserting demo experiences...");
    await db.insert(schema.experiences).values([
      { company: "TechNova Inc.", role: "Senior Software Engineer", startDate: "2021", endDate: "Present", description: "Lead developer for the core platform. Architected the transition to microservices." },
      { company: "EduSpark", role: "Software Engineer", startDate: "2018", endDate: "2021", description: "Developed interactive educational tools using React and Node.js." }
    ]);
  }

  console.log("Checking education...");
  const eduCount = await db.select({ count: sql<number>`count(*)` }).from(schema.education);
  if (Number(eduCount[0].count) === 0) {
    console.log("Inserting demo education...");
    await db.insert(schema.education).values([
      { institution: "University of Technology", degree: "BSc Computer Science", startDate: "2014", endDate: "2018", description: "Graduated with honors. Specialized in distributed systems." }
    ]);
  }

  console.log("Checking skills...");
  const skillCount = await db.select({ count: sql<number>`count(*)` }).from(schema.skills);
  if (Number(skillCount[0].count) === 0) {
    console.log("Inserting demo skills...");
    await db.insert(schema.skills).values([
      { name: "React", category: "Frontend", proficiency: 95 },
      { name: "TypeScript", category: "Languages", proficiency: 90 },
      { name: "Node.js", category: "Backend", proficiency: 85 },
      { name: "PostgreSQL", category: "Database", proficiency: 80 }
    ]);
  }

  console.log("Checking settings...");
  const settingsCount = await db.select({ count: sql<number>`count(*)` }).from(schema.settings);
  if (Number(settingsCount[0].count) === 0) {
    console.log("Inserting default settings...");
    await db.insert(schema.settings).values({
      id: 1,
      name: "",
      email: "",
      bio: "",
      profileImageUrl: "",
      phone: "",
      location: "",
      website: "",
    });
  }

  console.log("Checking certificates...");
  const certCount = await db.select({ count: sql<number>`count(*)` }).from(schema.certificates);
  if (Number(certCount[0].count) === 0) {
    console.log("Inserting demo certificates...");
    await db.insert(schema.certificates).values([
      { name: "AWS Certified Solutions Architect", issuer: "Amazon Web Services", date: "2022", link: "#" }
    ]);
  }
  
  console.log("Checking projects...");
  const projCount = await db.select({ count: sql<number>`count(*)` }).from(schema.projects);
  if (Number(projCount[0].count) === 0) {
    console.log("Inserting demo projects...");
    await db.insert(schema.projects).values([
      { title: "ELIGNITE Platform", description: "A comprehensive e-learning platform with real-time collaboration.", technologies: "React, Node.js, Socket.io, PostgreSQL", category: "Full Stack", featured: true, imageUrl: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" },
      { title: "EduIgnite Mobile", description: "Mobile companion app for students.", technologies: "React Native, Firebase", category: "Mobile", featured: true, imageUrl: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" }
    ]);
  }

  console.log("Checking blogs...");
  const blogCount = await db.select({ count: sql<number>`count(*)` }).from(schema.blogs);
  if (Number(blogCount[0].count) === 0) {
    console.log("Inserting demo blogs...");
    await db.insert(schema.blogs).values([
      { title: "Building Scalable Architecture with Next.js", slug: "scalable-nextjs", content: "Next.js provides a robust framework...", category: "Engineering", tags: "Next.js, Architecture", readingTime: 5, coverImage: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" },
      { title: "The Mathematics of Clean Code", slug: "math-clean-code", content: "Clean code is like an elegant equation...", category: "Philosophy", tags: "Clean Code, Math", readingTime: 8, coverImage: "https://images.unsplash.com/photo-1509228468518-180dd4864904?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" }
    ]);
  }
  
  console.log("Checking what_i_do...");
  const whatCount = await db.select({ count: sql<number>`count(*)` }).from(schema.what_i_do);
  if (Number(whatCount[0].count) === 0) {
    console.log("Inserting demo what_i_do...");
    await db.insert(schema.what_i_do).values([
      { title: "Frontend", icon: "Globe", items: "React, Next.js, TypeScript, Tailwind CSS" },
      { title: "Backend", icon: "Terminal", items: "Node.js, Express, PostgreSQL, Prisma" },
      { title: "Cloud & Architecture", icon: "Database", items: "AWS, Vercel, Docker, System Design" }
    ]);
  }

  console.log("Seed complete.");
  process.exit(0);
}

main().catch(console.error);

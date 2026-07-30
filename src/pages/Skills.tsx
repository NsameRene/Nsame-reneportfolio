import { motion } from 'motion/react';
import ScrollReveal from '../components/ScrollReveal';

const skillCategories = [
  {
    title: "Frontend Development",
    skills: [
      { name: "Next.js / React", level: 95 },
      { name: "TypeScript", level: 90 },
      { name: "Tailwind CSS", level: 95 },
      { name: "Framer Motion", level: 85 }
    ]
  },
  {
    title: "Backend Development",
    skills: [
      { name: "Node.js & Express", level: 90 },
      { name: "REST APIs", level: 95 },
      { name: "Authentication (JWT)", level: 88 },
    ]
  },
  {
    title: "Database & Cloud",
    skills: [
      { name: "PostgreSQL", level: 85 },
      { name: "Prisma ORM", level: 90 },
      { name: "Vercel / Render", level: 85 },
      { name: "Neon Database", level: 80 }
    ]
  }
];

export default function Skills() {
  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      <ScrollReveal className="mb-12 text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 mb-4">Technical Skills</h1>
        <p className="text-xl text-slate-600 max-w-2xl mx-auto">A comprehensive overview of my technological toolkit and proficiency levels.</p>
      </ScrollReveal>

      <div className="space-y-12">
        {skillCategories.map((category, i) => (
          <motion.div 
            key={category.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100"
          >
            <h3 className="text-2xl font-bold text-slate-900 mb-8">{category.title}</h3>
            <div className="space-y-6">
              {category.skills.map(skill => (
                <div key={skill.name}>
                  <div className="flex justify-between mb-2">
                    <span className="font-medium text-slate-700">{skill.name}</span>
                    <span className="text-slate-500 text-sm font-medium">{skill.level}%</span>
                  </div>
                  <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      whileInView={{ width: `${skill.level}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
                      className="h-full bg-indigo-600 rounded-full"
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

import { motion } from 'motion/react';
import { Briefcase, GraduationCap } from 'lucide-react';
import ScrollReveal from '../components/ScrollReveal';

const experiences = [
  {
    id: 1,
    role: "Founder & CEO",
    company: "ELIGNITE",
    period: "2023 - Present",
    description: "Leading the development of innovative digital solutions, overseeing full-stack project lifecycles, and managing client relationships to deliver premium software.",
    type: "work"
  },
  {
    id: 2,
    role: "Creator & Lead Developer",
    company: "EduIgnite School Management System",
    period: "2022 - Present",
    description: "Architected and built a comprehensive platform for school administration, integrating robust backend services with an intuitive, accessible frontend interface.",
    type: "work"
  },
  {
    id: 3,
    role: "Full Stack Software Engineer",
    company: "Freelance",
    period: "2020 - Present",
    description: "Delivering custom web applications using React, Next.js, Node.js, and PostgreSQL for diverse clients, focusing on scalability and performance optimization.",
    type: "work"
  },
  {
    id: 4,
    role: "Mathematics Educator",
    company: "Various Institutions",
    period: "2018 - 2022",
    description: "Taught advanced mathematics, honing analytical and problem-solving skills which later became the foundation of my software engineering career.",
    type: "education"
  }
];

export default function Experience() {
  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      <ScrollReveal className="mb-16 text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 mb-4">Experience Timeline</h1>
        <p className="text-xl text-slate-600">My professional journey bridging mathematics education and software engineering.</p>
      </ScrollReveal>

      <div className="relative border-l-2 border-slate-200 ml-4 md:ml-0 md:pl-0">
        {experiences.map((exp, index) => (
          <motion.div 
            key={exp.id}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="mb-12 relative pl-8 md:pl-0"
          >
            {/* Timeline Dot */}
            <div className={`absolute left-[-9px] md:left-1/2 md:-ml-[9px] top-0 w-4 h-4 rounded-full border-4 border-white ${exp.type === 'work' ? 'bg-indigo-600' : 'bg-emerald-500'} shadow-sm`} />
            
            {/* Content Box */}
            <div className={`md:w-[45%] ${index % 2 === 0 ? 'md:mr-auto md:pr-12' : 'md:ml-auto md:pl-12'}`}>
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                <div className={`flex items-center text-sm font-semibold mb-2 ${exp.type === 'work' ? 'text-indigo-600' : 'text-emerald-600'}`}>
                  {exp.type === 'work' ? <Briefcase className="w-4 h-4 mr-2" /> : <GraduationCap className="w-4 h-4 mr-2" />}
                  {exp.period}
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-1">{exp.role}</h3>
                <div className="text-slate-500 font-medium mb-4">{exp.company}</div>
                <p className="text-slate-600 text-sm leading-relaxed">{exp.description}</p>
              </div>
            </div>
          </motion.div>
        ))}
        
        {/* Center line for desktop */}
        <div className="hidden md:block absolute top-0 bottom-0 left-1/2 w-0.5 bg-slate-200 -ml-px -z-10" />
      </div>
    </div>
  );
}

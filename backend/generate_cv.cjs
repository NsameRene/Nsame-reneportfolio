const fs = require('fs');

const cvCode = `import React, { useState, useEffect } from 'react';
import { Mail, MapPin, Globe, Phone, ExternalLink, Briefcase, GraduationCap, Award, CheckCircle2 } from 'lucide-react';
import { API_BASE } from '../utils/api';

export default function CV() {
  const [data, setData] = useState({
    experiences: [],
    education: [],
    skills: [],
    certificates: []
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [exp, edu, ski, cert] = await Promise.all([
          fetch(\`\${API_BASE}/api/experiences\`).then(res => res.json()),
          fetch(\`\${API_BASE}/api/education\`).then(res => res.json()),
          fetch(\`\${API_BASE}/api/skills\`).then(res => res.json()),
          fetch(\`\${API_BASE}/api/certificates\`).then(res => res.json())
        ]);
        setData({
          experiences: exp,
          education: edu,
          skills: ski,
          certificates: cert
        });
      } catch (err) {
        console.error("Failed to fetch CV data", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handlePrint = () => {
    window.print();
  };

  // Hardcoded personal info (would come from settings in a real app)
  const personalInfo = {
    name: "Nsame Rene",
    role: "Software Engineer",
    email: "nsamerenetamjong@gmail.com",
    phone: "+1 234 567 890",
    location: "London, UK",
    website: "https://elignite.com",
    bio: "Experienced Software Engineer with a demonstrated history of working in the information technology and services industry. Skilled in modern web development, scalable architecture, and building user-centric applications.",
    image: "https://api.dicebear.com/7.x/notionists/svg?seed=NsameReneTamjong&backgroundColor=e2e8f0"
  };

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto min-h-screen print:py-0 print:px-0">
      
      <div className="flex justify-end mb-8 print:hidden">
        <button 
          onClick={handlePrint}
          className="px-6 py-2 bg-slate-900 text-white font-bold rounded-lg shadow hover:bg-slate-800 transition-colors"
        >
          Print / Save PDF
        </button>
      </div>

      <div className="bg-white shadow-2xl rounded-sm overflow-hidden flex flex-col md:flex-row print:shadow-none print:flex-row min-h-[1056px]">
        {/* Left Column - Dark Sidebar */}
        <div className="w-full md:w-1/3 bg-slate-900 text-white p-8 md:p-10 flex flex-col print:w-1/3 print:p-8">
          
          {/* Profile Photo */}
          <div className="w-40 h-40 rounded-full mx-auto mb-8 border-4 border-slate-700 overflow-hidden bg-slate-800 print:w-32 print:h-32">
            <img src={personalInfo.image} alt="Profile" className="w-full h-full object-cover" />
          </div>

          {/* Contact Info */}
          <div className="mb-10">
            <h2 className="text-xl font-bold tracking-widest uppercase mb-4 text-slate-400 border-b border-slate-700 pb-2">Contact</h2>
            <div className="space-y-4">
              <div className="flex items-start">
                <Mail className="w-5 h-5 mr-3 text-indigo-400 flex-shrink-0 mt-0.5" />
                <span className="text-sm font-medium break-all">{personalInfo.email}</span>
              </div>
              <div className="flex items-start">
                <Phone className="w-5 h-5 mr-3 text-indigo-400 flex-shrink-0 mt-0.5" />
                <span className="text-sm font-medium">{personalInfo.phone}</span>
              </div>
              <div className="flex items-start">
                <MapPin className="w-5 h-5 mr-3 text-indigo-400 flex-shrink-0 mt-0.5" />
                <span className="text-sm font-medium">{personalInfo.location}</span>
              </div>
              <div className="flex items-start">
                <Globe className="w-5 h-5 mr-3 text-indigo-400 flex-shrink-0 mt-0.5" />
                <span className="text-sm font-medium break-all">{personalInfo.website}</span>
              </div>
            </div>
          </div>

          {/* Education */}
          <div className="mb-10">
            <h2 className="text-xl font-bold tracking-widest uppercase mb-4 text-slate-400 border-b border-slate-700 pb-2">Education</h2>
            <div className="space-y-6">
              {data.education.length > 0 ? data.education.map((edu: any, i: number) => (
                <div key={i}>
                  <div className="text-sm font-bold text-white">{edu.degree}</div>
                  <div className="text-xs text-indigo-300 font-medium mb-1">{edu.institution}</div>
                  <div className="text-xs text-slate-400">{edu.startDate} - {edu.endDate || 'Present'}</div>
                </div>
              )) : (
                <div className="text-xs text-slate-400 italic">No education records added.</div>
              )}
            </div>
          </div>

          {/* Skills */}
          <div>
            <h2 className="text-xl font-bold tracking-widest uppercase mb-4 text-slate-400 border-b border-slate-700 pb-2">Skills</h2>
            <div className="flex flex-wrap gap-2">
              {data.skills.length > 0 ? data.skills.map((skill: any, i: number) => (
                <span key={i} className="px-3 py-1 bg-slate-800 rounded-md text-xs font-semibold text-slate-300 border border-slate-700">
                  {skill.name}
                </span>
              )) : (
                <div className="text-xs text-slate-400 italic">No skills added.</div>
              )}
            </div>
          </div>

        </div>

        {/* Right Column - Main Content */}
        <div className="w-full md:w-2/3 p-8 md:p-12 print:w-2/3 print:p-8 bg-white">
          
          {/* Header */}
          <div className="mb-12">
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight uppercase mb-2">{personalInfo.name}</h1>
            <div className="text-xl md:text-2xl font-bold text-indigo-600 mb-6">{personalInfo.role}</div>
            <p className="text-slate-600 leading-relaxed text-sm md:text-base text-justify">
              {personalInfo.bio}
            </p>
          </div>

          {/* Work Experience */}
          <div className="mb-10">
            <h2 className="text-2xl font-bold tracking-widest uppercase mb-4 text-slate-800">Work Experience</h2>
            <div className="w-full h-0.5 bg-slate-800 mb-6"></div>
            
            <div className="relative border-l-2 border-slate-300 pl-6 space-y-8 ml-2">
              {data.experiences.length > 0 ? data.experiences.map((exp: any, i: number) => (
                <div key={i} className="relative">
                  <div className="absolute w-3 h-3 bg-slate-800 rounded-full -left-[1.95rem] top-1.5"></div>
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline mb-1">
                    <h3 className="text-lg font-bold text-slate-800">{exp.company}</h3>
                    <span className="text-sm font-semibold text-slate-500 whitespace-nowrap">{exp.startDate} - {exp.endDate || 'Present'}</span>
                  </div>
                  <div className="text-sm text-slate-600 font-medium mb-3">{exp.role}</div>
                  <p className="text-sm text-slate-600 whitespace-pre-wrap">{exp.description}</p>
                </div>
              )) : (
                <div className="text-sm text-slate-500 italic">No work experiences added.</div>
              )}
            </div>
          </div>

          {/* Certificates */}
          <div className="mb-10">
            <h2 className="text-2xl font-bold tracking-widest uppercase mb-4 text-slate-800">Certificates</h2>
            <div className="w-full h-0.5 bg-slate-800 mb-6"></div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
               {data.certificates.length > 0 ? data.certificates.map((cert: any, i: number) => (
                  <div key={i} className="border border-slate-200 rounded-lg p-4 relative group">
                    <h3 className="font-bold text-slate-800 text-sm mb-1 pr-6">{cert.name}</h3>
                    <div className="text-xs text-slate-500 mb-2">{cert.issuer} • {cert.date}</div>
                    {cert.link && (
                      <a href={cert.link} target="_blank" rel="noopener noreferrer" className="absolute top-4 right-4 text-slate-400 group-hover:text-indigo-600 transition-colors print:hidden">
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                  </div>
               )) : (
                  <div className="text-sm text-slate-500 italic">No certificates added.</div>
               )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
`;

fs.writeFileSync('src/pages/CV.tsx', cvCode);

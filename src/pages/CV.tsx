import React from 'react';
import { Phone, Mail, MapPin, Globe, Download, ExternalLink, ShoppingCart, Users } from 'lucide-react';

export default function CV() {
  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto print:p-0 print:m-0 print:max-w-none">
      <div className="flex justify-end mb-6 print-hidden">
        <button 
          onClick={() => window.print()}
          className="inline-flex items-center justify-center px-6 py-3 bg-indigo-600 text-white font-medium rounded-full hover:bg-indigo-700 transition-colors shadow-sm"
        >
          <Download className="w-5 h-5 mr-2" />
          Download PDF
        </button>
      </div>

      <div id="cv-document" className="bg-white shadow-2xl overflow-hidden flex flex-col md:flex-row min-h-[1056px] print:shadow-none print:w-[210mm] print:mx-auto">
        {/* Left Column */}
        <div className="w-full md:w-[35%] bg-slate-900 text-white p-8 md:p-10 flex flex-col print:w-[35%] print:bg-slate-900 print:text-white" style={{ WebkitPrintColorAdjust: 'exact', printColorAdjust: 'exact' }}>
          {/* Profile Image */}
          <div className="mb-10 flex justify-center">
            <div className="w-48 h-48 rounded-full border-4 border-slate-300 overflow-hidden relative shadow-lg">
              <img 
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" 
                alt="Profile" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Contact */}
          <div className="mb-10">
            <h2 className="text-xl font-bold tracking-widest uppercase border-b-2 border-white/20 pb-2 mb-6">Contact</h2>
            <div className="space-y-4 text-sm text-slate-300">
              <div className="flex items-center">
                <Phone className="w-5 h-5 mr-4 text-white" />
                <span>+123-456-7890</span>
              </div>
              <div className="flex items-center">
                <Mail className="w-5 h-5 mr-4 text-white" />
                <span>hello@nsamerene.com</span>
              </div>
              <div className="flex items-start">
                <MapPin className="w-5 h-5 mr-4 mt-0.5 text-white shrink-0" />
                <span>123 Anywhere St., Any City</span>
              </div>
              <div className="flex items-center">
                <Globe className="w-5 h-5 mr-4 text-white" />
                <span>www.nsamerene.com</span>
              </div>
            </div>
          </div>

          {/* Education */}
          <div className="mb-10">
            <h2 className="text-xl font-bold tracking-widest uppercase border-b-2 border-white/20 pb-2 mb-6">Education</h2>
            <div className="space-y-6">
              <div>
                <div className="font-bold text-white mb-1">2016 - 2018</div>
                <div className="font-bold uppercase tracking-wider text-sm mb-2 text-slate-200">University of Technology</div>
                <ul className="list-disc list-inside text-sm text-slate-300 ml-1 space-y-1">
                  <li>Master of Science in Computer Science</li>
                </ul>
              </div>
              <div>
                <div className="font-bold text-white mb-1">2012 - 2016</div>
                <div className="font-bold uppercase tracking-wider text-sm mb-2 text-slate-200">State University</div>
                <ul className="list-disc list-inside text-sm text-slate-300 ml-1 space-y-1">
                  <li>Bachelor of Science in Software Engineering</li>
                  <li>GPA: 3.8 / 4.0</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Skills */}
          <div className="mb-10">
            <h2 className="text-xl font-bold tracking-widest uppercase border-b-2 border-white/20 pb-2 mb-6">Skills</h2>
            <ul className="list-disc list-inside text-sm text-slate-300 space-y-2 ml-1">
              <li>Full-Stack Development</li>
              <li>React & Next.js</li>
              <li>Node.js & Express</li>
              <li>Database Architecture</li>
              <li>Cloud Infrastructure</li>
              <li>Team Leadership</li>
              <li>Agile Methodologies</li>
            </ul>
          </div>

          {/* Languages */}
          <div className="mb-6">
            <h2 className="text-xl font-bold tracking-widest uppercase border-b-2 border-white/20 pb-2 mb-6">Languages</h2>
            <ul className="list-disc list-inside text-sm text-slate-300 space-y-2 ml-1">
              <li>English (Fluent)</li>
              <li>French (Fluent)</li>
              <li>German (Basics)</li>
            </ul>
          </div>
        </div>

        {/* Right Column */}
        <div className="w-full md:w-[65%] p-8 md:p-12 text-slate-800">
          {/* Header */}
          <div className="mb-10 pt-4">
            <h1 className="text-5xl font-bold tracking-wide uppercase mb-2 text-slate-800 flex flex-wrap gap-x-3">
              <span>Nsame</span>
              <span className="font-light text-slate-600">Rene</span>
            </h1>
            <div className="text-xl tracking-[0.2em] uppercase text-slate-500 font-medium">Software Engineer</div>
          </div>

          {/* Profile */}
          <div className="mb-10">
            <h2 className="text-2xl font-bold tracking-widest uppercase mb-4 text-slate-800">Profile</h2>
            <div className="w-full h-0.5 bg-slate-800 mb-4"></div>
            <p className="text-sm leading-relaxed text-slate-600 text-justify">
              Experienced Software Engineer with a demonstrated history of working in the information technology and services industry. Skilled in modern web development, scalable architecture, and building user-centric applications. Strong engineering professional with a Master's degree focused in Computer Science. Passionate about clean code, continuous learning, and mentoring engineering teams to deliver high-quality products.
            </p>
          </div>

          {/* Work Experience */}
          <div className="mb-10">
            <h2 className="text-2xl font-bold tracking-widest uppercase mb-4 text-slate-800">Work Experience</h2>
            <div className="w-full h-0.5 bg-slate-800 mb-6"></div>
            
            <div className="relative border-l-2 border-slate-300 pl-6 space-y-8 ml-2">
              <div className="relative">
                <div className="absolute w-3 h-3 bg-slate-800 rounded-full -left-[1.95rem] top-1.5"></div>
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline mb-1">
                  <h3 className="text-lg font-bold text-slate-800">Tech Innovators Inc.</h3>
                  <span className="text-sm font-semibold text-slate-500 whitespace-nowrap">2021 - PRESENT</span>
                </div>
                <div className="text-sm text-slate-600 font-medium mb-3">Senior Software Engineer & Team Lead</div>
                <ul className="list-disc list-outside text-sm text-slate-600 ml-4 space-y-1.5">
                  <li>Architected the migration to a microservices architecture using Node.js and React, improving system resilience and deployment speed.</li>
                  <li>Lead, mentor, and manage a high-performing engineering team, fostering a collaborative and results-driven work environment.</li>
                  <li>Establish coding standards and best practices, reducing technical debt by 30% over two years.</li>
                </ul>
              </div>

              <div className="relative">
                <div className="absolute w-3 h-3 bg-slate-800 rounded-full -left-[1.95rem] top-1.5"></div>
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline mb-1">
                  <h3 className="text-lg font-bold text-slate-800">Digital Solutions Agency</h3>
                  <span className="text-sm font-semibold text-slate-500 whitespace-nowrap">2018 - 2021</span>
                </div>
                <div className="text-sm text-slate-600 font-medium mb-3">Full Stack Developer</div>
                <ul className="list-disc list-outside text-sm text-slate-600 ml-4 space-y-1.5">
                  <li>Developed and maintained various web applications for clients across different industries utilizing the MERN stack.</li>
                  <li>Implemented robust CI/CD pipelines and automated testing, decreasing deployment errors by 40%.</li>
                  <li>Collaborated closely with UX/UI designers to translate wireframes into responsive, accessible web interfaces.</li>
                </ul>
              </div>

              <div className="relative">
                <div className="absolute w-3 h-3 bg-slate-800 rounded-full -left-[1.95rem] top-1.5"></div>
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline mb-1">
                  <h3 className="text-lg font-bold text-slate-800">Creative Web Studio</h3>
                  <span className="text-sm font-semibold text-slate-500 whitespace-nowrap">2016 - 2018</span>
                </div>
                <div className="text-sm text-slate-600 font-medium mb-3">Frontend Developer</div>
                <ul className="list-disc list-outside text-sm text-slate-600 ml-4 space-y-1.5">
                  <li>Built interactive single-page applications using React and Redux for state management.</li>
                  <li>Optimized web applications for maximum speed and scalability, achieving a 90+ Lighthouse score consistently.</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Projects */}
          <div className="mb-10">
            <h2 className="text-2xl font-bold tracking-widest uppercase mb-4 text-slate-800">Projects</h2>
            <div className="w-full h-0.5 bg-slate-800 mb-6"></div>
            
            <div className="relative border-l-2 border-slate-300 pl-8 space-y-8 ml-3 mt-4">
              <div className="relative group">
                <div className="absolute w-8 h-8 bg-white rounded-lg -left-[3.1rem] -top-1 flex items-center justify-center shadow-sm border border-slate-200 group-hover:border-indigo-300 group-hover:bg-indigo-50 transition-colors z-10">
                  <ShoppingCart className="w-4 h-4 text-slate-600 group-hover:text-indigo-600" />
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline mb-1">
                  <h3 className="text-lg font-bold text-slate-800">E-Commerce Platform Redesign</h3>
                  <a href="#" className="inline-flex items-center text-xs font-bold text-indigo-600 hover:text-indigo-700 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-full transition-colors print:hidden mt-2 sm:mt-0">
                    <ExternalLink className="w-3.5 h-3.5 mr-1.5" /> Live View
                  </a>
                </div>
                <p className="text-sm text-slate-600 mt-2">
                  Led the frontend redesign of a major e-commerce platform, improving load times by 40% and increasing conversion rates by 15%.
                </p>
              </div>

              <div className="relative group">
                <div className="absolute w-8 h-8 bg-white rounded-lg -left-[3.1rem] -top-1 flex items-center justify-center shadow-sm border border-slate-200 group-hover:border-indigo-300 group-hover:bg-indigo-50 transition-colors z-10">
                  <Users className="w-4 h-4 text-slate-600 group-hover:text-indigo-600" />
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline mb-1">
                  <h3 className="text-lg font-bold text-slate-800">Real-time Collab Whiteboard</h3>
                  <a href="#" className="inline-flex items-center text-xs font-bold text-indigo-600 hover:text-indigo-700 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-full transition-colors print:hidden mt-2 sm:mt-0">
                    <ExternalLink className="w-3.5 h-3.5 mr-1.5" /> Live View
                  </a>
                </div>
                <p className="text-sm text-slate-600 mt-2">
                  Built a real-time collaborative workspace allowing remote teams to brainstorm using a shared canvas with multiple concurrent users.
                </p>
              </div>
            </div>
          </div>

          {/* Reference */}
          <div>
            <h2 className="text-2xl font-bold tracking-widest uppercase mb-4 text-slate-800">Reference</h2>
            <div className="w-full h-0.5 bg-slate-800 mb-6"></div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              <div>
                <h3 className="font-bold text-slate-800 text-lg">Dr. Alistair Webb</h3>
                <div className="text-sm text-slate-600 mb-2">University of Tech / Professor</div>
                <div className="text-xs text-slate-500 mb-1"><span className="font-semibold text-slate-700">Phone:</span> 123-456-7890</div>
                <div className="text-xs text-slate-500"><span className="font-semibold text-slate-700">Email:</span> a.webb@university.edu</div>
              </div>
              <div>
                <h3 className="font-bold text-slate-800 text-lg">Sarah Jenkins</h3>
                <div className="text-sm text-slate-600 mb-2">Tech Innovators Inc. / CTO</div>
                <div className="text-xs text-slate-500 mb-1"><span className="font-semibold text-slate-700">Phone:</span> 123-456-7890</div>
                <div className="text-xs text-slate-500"><span className="font-semibold text-slate-700">Email:</span> s.jenkins@techinnovators.com</div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

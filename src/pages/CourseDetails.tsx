import { useParams, Link } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Clock, PlayCircle, Star, CheckCircle, Award, MessageCircle, Send } from 'lucide-react';
import ScrollReveal from '../components/ScrollReveal';
import { courses } from './Courses';
import { useState } from 'react';

export default function CourseDetails() {
  const { id } = useParams();
  const course = courses.find(c => c.id === Number(id));
  const [certStatus, setCertStatus] = useState<'idle' | 'questions' | 'submitted' | 'later'>('idle');
  const [certForm, setCertForm] = useState({ name: '', email: '', reason: '' });

  if (!course) {
    return (
      <div className="py-24 px-4 text-center max-w-7xl mx-auto min-h-[60vh] flex flex-col items-center justify-center">
        <h1 className="text-3xl font-bold text-slate-900 mb-4">Course Not Found</h1>
        <Link to="/courses" className="text-indigo-600 hover:underline flex items-center">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Courses
        </Link>
      </div>
    );
  }

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
      <Link to="/courses" className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-indigo-600 mb-8 transition-colors">
        <ArrowLeft className="w-4 h-4 mr-2" /> Back to all courses
      </Link>
      
      {/* Course Header */}
      <ScrollReveal className="mb-12">
        <div className="flex flex-col lg:flex-row gap-10">
          <div className="lg:w-1/2">
            <span className="text-indigo-600 font-bold tracking-wider uppercase text-sm mb-2 block">{course.level}</span>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 mb-6 leading-tight">{course.title}</h1>
            <p className="text-xl text-slate-600 mb-8 leading-relaxed">{course.description}</p>
            
            <div className="flex flex-wrap items-center gap-6 text-sm font-medium text-slate-700 mb-8">
              <span className="flex items-center"><Star className="w-5 h-5 mr-2 text-amber-500 fill-current" /> {course.rating} ({course.students} students)</span>
              <span className="flex items-center"><Clock className="w-5 h-5 mr-2 text-indigo-500" /> {course.duration}</span>
              <span className="flex items-center"><PlayCircle className="w-5 h-5 mr-2 text-indigo-500" /> {course.lessons} Lessons</span>
            </div>
          </div>
          
          <div className="lg:w-1/2">
            <div className="rounded-3xl overflow-hidden shadow-2xl relative aspect-video">
              <img src={course.image} alt={course.title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-slate-900/10"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-20 h-20 bg-white/90 backdrop-blur rounded-full flex items-center justify-center shadow-2xl cursor-pointer hover:scale-110 transition-transform">
                  <PlayCircle className="w-10 h-10 text-indigo-600 ml-1" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </ScrollReveal>

      {/* Course Content / Videos */}
      <ScrollReveal delay={0.2} className="mb-20">
        <h2 className="text-3xl font-bold text-slate-900 mb-8">Course Content</h2>
        
        <div className="space-y-6">
          {[
            { title: "Introduction & Setup", duration: "15:20", desc: "Setting up the development environment and understanding the core concepts of this course.", videoId: "dQw4w9WgXcQ" },
            { title: "Core Fundamentals", duration: "45:10", desc: "Diving deep into the fundamental building blocks. This is where the magic happens.", videoId: "dQw4w9WgXcQ" },
            { title: "Advanced Patterns", duration: "38:45", desc: "Exploring advanced techniques to level up your skills and build robust systems.", videoId: "dQw4w9WgXcQ" },
            { title: "Project Walkthrough", duration: "55:30", desc: "Applying everything we've learned into a real-world, comprehensive project.", videoId: "dQw4w9WgXcQ" },
          ].map((lesson, idx) => (
            <div key={idx} className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-slate-100 flex flex-col md:flex-row gap-8">
              <div className="md:w-1/3">
                <div className="rounded-2xl overflow-hidden aspect-video relative shadow-md">
                  <iframe 
                    width="100%" 
                    height="100%" 
                    src={`https://www.youtube.com/embed/${lesson.videoId}`} 
                    title={lesson.title}
                    frameBorder="0" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                    allowFullScreen
                    className="absolute inset-0 w-full h-full"
                  ></iframe>
                </div>
              </div>
              <div className="md:w-2/3 flex flex-col justify-center">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xl font-bold text-slate-900">Module {idx + 1}: {lesson.title}</h3>
                  <span className="text-sm font-medium text-slate-500 bg-slate-100 px-3 py-1 rounded-full">{lesson.duration}</span>
                </div>
                <p className="text-slate-600 leading-relaxed mb-4">
                  {lesson.desc} This module includes comprehensive video instruction, downloadable text materials, and hands-on exercises to solidify your understanding.
                </p>
                <div className="mt-auto flex items-center text-indigo-600 font-medium text-sm">
                  <CheckCircle className="w-4 h-4 mr-2" /> Includes reading materials
                </div>
              </div>
            </div>
          ))}
        </div>
      </ScrollReveal>

      {/* Certification Call to Action */}
      <ScrollReveal delay={0.3}>
        <div className="bg-slate-900 rounded-3xl p-10 md:p-16 text-center shadow-2xl relative overflow-hidden min-h-[400px] flex items-center justify-center">
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-indigo-600/30 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-64 h-64 bg-purple-600/30 rounded-full blur-3xl"></div>
          
          <div className="relative z-10 w-full max-w-3xl mx-auto">
            <AnimatePresence mode="wait">
              {certStatus === 'idle' && (
                <motion.div
                  key="idle"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="w-20 h-20 bg-indigo-500/20 rounded-full flex items-center justify-center mx-auto mb-6 text-indigo-400">
                    <Award className="w-10 h-10" />
                  </div>
                  <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6">
                    Do you want to get certified for this course?
                  </h2>
                  <p className="text-lg text-slate-300 mb-10 leading-relaxed">
                    Upon successful completion of all modules and final projects, you can earn an industry-recognized certificate to showcase on your CV and LinkedIn.
                  </p>
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <button 
                      onClick={() => setCertStatus('questions')}
                      className="px-8 py-4 bg-indigo-600 text-white font-bold rounded-full hover:bg-indigo-500 transition-colors shadow-lg hover:shadow-indigo-500/30 w-full sm:w-auto text-lg"
                    >
                      Yes, I want to be certified!
                    </button>
                    <button 
                      onClick={() => setCertStatus('later')}
                      className="px-8 py-4 bg-white/10 text-white font-bold rounded-full hover:bg-white/20 transition-colors w-full sm:w-auto text-lg"
                    >
                      Maybe later
                    </button>
                  </div>
                </motion.div>
              )}

              {certStatus === 'questions' && (
                <motion.div
                  key="questions"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="max-w-xl mx-auto text-left"
                >
                  <div className="flex items-center justify-center mb-6">
                    <div className="w-16 h-16 bg-indigo-500/20 rounded-full flex items-center justify-center text-indigo-400">
                      <Award className="w-8 h-8" />
                    </div>
                  </div>
                  <h2 className="text-3xl font-extrabold text-white mb-2 text-center">Certification Request</h2>
                  <p className="text-slate-400 text-center mb-8">Please fill out a few details to proceed with your certification.</p>
                  
                  <form 
                    onSubmit={(e) => {
                      e.preventDefault();
                      setCertStatus('submitted');
                    }}
                    className="space-y-4"
                  >
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-1">Full Name</label>
                      <input 
                        type="text" required
                        value={certForm.name}
                        onChange={e => setCertForm({...certForm, name: e.target.value})}
                        className="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700 text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all placeholder:text-slate-500"
                        placeholder="John Doe"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-1">Email Address</label>
                      <input 
                        type="email" required
                        value={certForm.email}
                        onChange={e => setCertForm({...certForm, email: e.target.value})}
                        className="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700 text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all placeholder:text-slate-500"
                        placeholder="john@example.com"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-1">Why do you want this certificate?</label>
                      <textarea 
                        required rows={3}
                        value={certForm.reason}
                        onChange={e => setCertForm({...certForm, reason: e.target.value})}
                        className="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700 text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all resize-none placeholder:text-slate-500"
                        placeholder="I want to improve my skills and show..."
                      ></textarea>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row gap-3 pt-4">
                      <button 
                        type="submit"
                        className="flex-1 px-6 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-500 transition-colors shadow-lg"
                      >
                        Submit Request
                      </button>
                      <button 
                        type="button"
                        onClick={() => setCertStatus('idle')}
                        className="px-6 py-3 bg-white/10 text-white font-bold rounded-xl hover:bg-white/20 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </motion.div>
              )}

              {certStatus === 'submitted' && (
                <motion.div
                  key="submitted"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6 text-emerald-400">
                    <CheckCircle className="w-10 h-10" />
                  </div>
                  <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-6">
                    Almost there, {certForm.name || 'Student'}!
                  </h2>
                  <p className="text-lg text-slate-300 mb-8 max-w-2xl mx-auto leading-relaxed">
                    To complete your certification process, please submit all the exercises that you carried out throughout this course directly through my WhatsApp contact. Once reviewed, I will decide to issue your certificate!
                  </p>
                  
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <a 
                      href={`https://wa.me/1234567890?text=Hi Nsame! I am submitting my exercises for the ${course.title} course.`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-8 py-4 bg-emerald-600 text-white font-bold rounded-full hover:bg-emerald-500 transition-colors shadow-lg flex items-center w-full sm:w-auto text-lg"
                    >
                      <MessageCircle className="w-5 h-5 mr-2" />
                      Submit via WhatsApp
                    </a>
                    <button 
                      onClick={() => setCertStatus('idle')}
                      className="px-8 py-4 bg-white/10 text-white font-bold rounded-full hover:bg-white/20 transition-colors w-full sm:w-auto text-lg"
                    >
                      Back
                    </button>
                  </div>
                </motion.div>
              )}

              {certStatus === 'later' && (
                <motion.div
                  key="later"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="w-20 h-20 bg-slate-700/50 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-300">
                    <Star className="w-10 h-10" />
                  </div>
                  <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4">
                    That's completely fine!
                  </h2>
                  <p className="text-lg text-slate-300 mb-8 max-w-2xl mx-auto leading-relaxed">
                    Keep learning, keep practicing, and take your time. The certification will always be here when you are ready. You got this!
                  </p>
                  <button 
                    onClick={() => setCertStatus('idle')}
                    className="px-8 py-4 bg-white/10 text-white font-bold rounded-full hover:bg-white/20 transition-colors"
                  >
                    Go Back
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </ScrollReveal>
    </div>
  );
}

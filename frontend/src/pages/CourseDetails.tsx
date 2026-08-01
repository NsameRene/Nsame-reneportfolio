import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Clock, PlayCircle, Star, Users, CheckCircle, Award, MessageCircle } from 'lucide-react';
import ScrollReveal from '../components/ScrollReveal';
import { getApiUrl } from '../utils/api';

export default function CourseDetails() {
  const { id } = useParams();
  const [course, setCourse] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  const [certStatus, setCertStatus] = useState<'idle' | 'questions' | 'submitted' | 'later'>('idle');
  const [certForm, setCertForm] = useState({ name: '', email: '', reason: '' });

  useEffect(() => {
    fetch(getApiUrl('/api/courses'))
      .then(res => res.json())
      .then(data => {
        const found = data.find((c: any) => c.id === parseInt(id || '0'));
        setCourse(found);
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return <div className="min-h-screen py-32 text-center text-slate-500 font-medium">Loading course details...</div>;
  }

  if (!course) {
    return (
      <div className="min-h-screen py-32 px-4 text-center flex flex-col items-center">
        <h1 className="text-3xl font-bold text-slate-900 mb-4">Course Not Found</h1>
        <Link to="/courses" className="text-indigo-600 font-bold hover:underline">Back to Courses</Link>
      </div>
    );
  }

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto min-h-screen pb-32">
      <Link to="/courses" className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-indigo-600 mb-8 transition-colors">
        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Courses
      </Link>

      <ScrollReveal className="mb-12">
        <div className="flex flex-wrap items-center gap-3 mb-6 text-sm font-bold">
          <span className="bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full">{course.level || 'All Levels'}</span>
          <span className="flex items-center text-amber-500 bg-amber-50 px-3 py-1 rounded-full"><Star className="w-4 h-4 mr-1 fill-current" /> {course.rating || 5.0}</span>
          <span className="flex items-center text-slate-600 bg-slate-100 px-3 py-1 rounded-full"><Users className="w-4 h-4 mr-1" /> {course.students || '0'} Students</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 mb-6">{course.title}</h1>
        <p className="text-xl text-slate-600 leading-relaxed mb-10">{course.description}</p>
        
        <div className="relative aspect-video rounded-3xl overflow-hidden shadow-2xl mb-12 border border-slate-100">
          <img src={course.imageUrl || 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'} alt={course.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-slate-900/30 flex items-center justify-center group cursor-pointer">
             <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/40 group-hover:bg-indigo-600 group-hover:border-indigo-600 transition-all duration-300 transform group-hover:scale-110">
                <PlayCircle className="w-10 h-10 text-white fill-current opacity-90 group-hover:opacity-100" />
             </div>
          </div>
        </div>

        <div className="bg-white p-8 sm:p-10 rounded-3xl shadow-sm border border-slate-100 mb-16 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex-1 w-full">
            <h3 className="text-2xl font-bold text-slate-900 mb-2">Ready to start learning?</h3>
            <div className="flex items-center space-x-6 text-slate-500 font-medium">
               <span className="flex items-center"><Clock className="w-4 h-4 mr-2" /> {course.duration || 'Flexible'}</span>
               <span className="flex items-center"><PlayCircle className="w-4 h-4 mr-2" /> {course.lessons || 10} Lessons</span>
            </div>
          </div>
          <div className="flex-shrink-0 w-full md:w-auto">
             <button className="w-full md:w-auto px-8 py-4 bg-slate-900 text-white font-bold rounded-xl shadow-lg hover:bg-indigo-600 transition-colors text-lg">
                Enroll Now for {course.price || 'Free'}
             </button>
          </div>
        </div>
      </ScrollReveal>
      
      {/* Certification Flow */}
      <ScrollReveal delay={0.2}>
        <div className="bg-slate-900 rounded-[2rem] p-8 sm:p-12 relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl"></div>
          
          <div className="relative z-10">
            <AnimatePresence mode="wait">
              {certStatus === 'idle' && (
                <motion.div
                  key="idle"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="text-center"
                >
                  <div className="w-20 h-20 bg-indigo-500/20 rounded-full flex items-center justify-center mx-auto mb-6 text-indigo-400">
                    <Award className="w-10 h-10" />
                  </div>
                  <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-6">
                    Have you completed this course?
                  </h2>
                  <p className="text-lg text-slate-300 mb-10 max-w-2xl mx-auto leading-relaxed">
                    If you have watched all the lessons and feel confident in your skills, you can apply for a certification of completion. 
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
                  <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-6 text-center">
                    Almost there, {certForm.name || 'Student'}!
                  </h2>
                  <p className="text-lg text-slate-300 mb-8 max-w-2xl mx-auto leading-relaxed text-center">
                    To complete your certification process, please submit all the exercises that you carried out throughout this course directly through my WhatsApp contact. Once reviewed, I will decide to issue your certificate!
                  </p>
                  
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <a 
                      href={`https://wa.me/1234567890?text=Hi Nsame! I am submitting my exercises for the ${course.title} course.`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-8 py-4 bg-emerald-600 text-white font-bold rounded-full hover:bg-emerald-500 transition-colors shadow-lg flex items-center w-full sm:w-auto text-lg justify-center"
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
                  className="text-center"
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

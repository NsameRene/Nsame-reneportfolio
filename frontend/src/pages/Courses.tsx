import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { BookOpen, Clock, Star, PlayCircle, ArrowRight } from 'lucide-react';
import { Link } from 'react-router';
import ScrollReveal from '../components/ScrollReveal';
import { getApiUrl } from '../utils/api';

export default function Courses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(getApiUrl('/api/courses'))
      .then(res => res.json())
      .then(data => setCourses(data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <ScrollReveal className="mb-16 text-center max-w-3xl mx-auto">
        <span className="text-indigo-600 font-bold tracking-wider uppercase text-sm mb-2 block">EduIgnite Academy</span>
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 mb-6">Premium Courses</h1>
        <p className="text-xl text-slate-600">Elevate your skills with comprehensive, project-based courses taught by an experienced educator and software engineer.</p>
      </ScrollReveal>
      
      {loading ? (
        <div className="text-center py-20 text-slate-500 font-medium">Loading courses...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {courses.map((course: any, i: number) => (
            <Link to={`/courses/${course.id}`} key={course.id}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-100 group hover:shadow-xl hover:border-indigo-100 transition-all flex flex-col h-full"
              >
                <div className="relative aspect-video overflow-hidden">
                  <img src={course.imageUrl || 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'} alt={course.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-slate-900/20 group-hover:bg-transparent transition-colors duration-500"></div>
                  {course.featured && (
                    <div className="absolute top-4 left-4 bg-indigo-600 text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-lg">
                      BESTSELLER
                    </div>
                  )}
                  <div className="absolute bottom-4 right-4 bg-white/95 backdrop-blur px-4 py-2 rounded-xl font-bold text-slate-900 shadow-lg">
                    {course.price || 'Free'}
                  </div>
                </div>
                
                <div className="p-8 flex flex-col flex-grow">
                  <div className="flex items-center space-x-4 mb-4 text-sm font-medium text-slate-500">
                    <span className="flex items-center text-amber-500">
                      <Star className="w-4 h-4 mr-1 fill-current" /> {course.rating || 5.0}
                    </span>
                    <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                    <span>{course.students || '0'} Students</span>
                    <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                    <span className="text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md">{course.level || 'All Levels'}</span>
                  </div>
                  
                  <h3 className="text-2xl font-bold text-slate-900 mb-3 group-hover:text-indigo-600 transition-colors">{course.title}</h3>
                  <p className="text-slate-600 mb-8 flex-grow leading-relaxed">{course.description}</p>
                  
                  <div className="flex items-center justify-between pt-6 border-t border-slate-100">
                    <div className="flex items-center space-x-6 text-sm font-semibold text-slate-700">
                      <span className="flex items-center"><Clock className="w-4 h-4 mr-2 text-indigo-500" /> {course.duration || 'Flexible'}</span>
                      <span className="flex items-center"><PlayCircle className="w-4 h-4 mr-2 text-indigo-500" /> {course.lessons || 10} Lessons</span>
                    </div>
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-slate-50 text-slate-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                      <ArrowRight className="w-5 h-5" />
                    </div>
                  </div>
                </div>
              </motion.div>
            </Link>
          ))}
          {courses.length === 0 && <div className="text-slate-500 font-medium py-10 col-span-1 md:col-span-2 text-center">No courses added yet.</div>}
        </div>
      )}
    </div>
  );
}

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Plus, List } from 'lucide-react';

interface Testimonial {
  id: string;
  name: string;
  role: string;
  text: string;
  date: number;
}

const initialTestimonials: Testimonial[] = [
  { id: '1', name: "Sarah Jenkins", role: "CEO at TechFlow", text: "Nsame completely transformed our digital presence. His full-stack expertise and attention to UI details brought our vision to life faster than we imagined possible.", date: Date.now() - 100000 },
  { id: '2', name: "Dr. Alistair Webb", role: "Director of Education", text: "EduIgnite has revolutionized how we manage our institution. Nsame's background in education combined with his technical skills made this the perfect platform for us.", date: Date.now() - 200000 },
];

const TestimonialCard: React.FC<{ testimonial: Testimonial, onClickReadMore: (t: Testimonial) => void }> = ({ testimonial, onClickReadMore }) => {
  const isLong = testimonial.text.length > 150;
  
  return (
    <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 relative min-w-[350px] max-w-[350px] h-[320px] flex flex-col shrink-0 mx-4">
      <div className="text-indigo-200 absolute top-6 right-8">
        <svg width="30" height="24" viewBox="0 0 45 36" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
          <path d="M13.5 0C6.04416 0 0 6.04416 0 13.5V36H18V13.5H9C9 8.52943 13.0294 4.5 18 4.5V0H13.5ZM40.5 0C33.0442 0 27 6.04416 27 13.5V36H45V13.5H36C36 8.52943 40.0294 4.5 45 4.5V0H40.5Z" />
        </svg>
      </div>
      <div className="flex-1 overflow-hidden relative flex flex-col items-start justify-start">
        <p className={`text-lg text-slate-600 italic relative z-10 leading-relaxed ${isLong ? 'line-clamp-4' : ''}`}>
          "{testimonial.text}"
        </p>
        {isLong && (
          <button 
            onClick={() => onClickReadMore(testimonial)}
            className="text-indigo-600 font-semibold text-sm mt-2 hover:underline inline-block"
          >
            Read More
          </button>
        )}
      </div>
      <div className="flex items-center mt-6 pt-4 border-t border-slate-100">
        <div className="w-10 h-10 bg-slate-200 rounded-full mr-4 flex items-center justify-center font-bold text-slate-500 overflow-hidden shrink-0">
          <img src={`https://api.dicebear.com/7.x/initials/svg?seed=${testimonial.name}`} alt={testimonial.name} />
        </div>
        <div>
          <h4 className="font-bold text-slate-900 text-sm line-clamp-1">{testimonial.name}</h4>
          <p className="text-xs text-slate-500 line-clamp-1">{testimonial.role}</p>
        </div>
      </div>
    </div>
  );
}

export default function TestimonialSection() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>(initialTestimonials);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isSeeAllModalOpen, setIsSeeAllModalOpen] = useState(false);
  const [readMoreTestimonial, setReadMoreTestimonial] = useState<Testimonial | null>(null);

  const [formData, setFormData] = useState({ name: '', role: '', text: '' });

  const handleAddTestimony = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.text) return;
    
    const newTestimonial: Testimonial = {
      id: Date.now().toString(),
      name: formData.name,
      role: formData.role || 'Client',
      text: formData.text,
      date: Date.now()
    };
    
    setTestimonials([newTestimonial, ...testimonials]);
    setFormData({ name: '', role: '', text: '' });
    setIsAddModalOpen(false);
  };

  const allTestimonialsSorted = [...testimonials].sort((a, b) => b.date - a.date);

  return (
    <div className="max-w-7xl mx-auto w-full py-12 overflow-hidden">
      <div className="text-center mb-10 px-4">
        <span className="text-indigo-600 font-bold tracking-wider uppercase text-sm mb-2 block">Client Reviews</span>
        <h2 className="text-4xl font-extrabold text-slate-900 mb-6">What People Say</h2>
        <div className="flex justify-center gap-4 flex-wrap">
          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center px-6 py-3 rounded-full bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition-colors shadow-md"
          >
            <Plus className="w-5 h-5 mr-2" /> Add Testimony
          </button>
          <button 
            onClick={() => setIsSeeAllModalOpen(true)}
            className="inline-flex items-center px-6 py-3 rounded-full bg-white text-slate-700 border border-slate-200 font-semibold hover:bg-slate-50 transition-colors shadow-sm"
          >
            <List className="w-5 h-5 mr-2" /> See All
          </button>
        </div>
      </div>

      {/* Marquee Animation */}
      <div className="relative flex overflow-x-hidden w-full py-8" style={{ maskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)' }}>
        <motion.div
          className="flex whitespace-nowrap will-change-transform"
          animate={{ x: ["0%", "-50%"] }}
          transition={{
            repeat: Infinity,
            ease: "linear",
            duration: testimonials.length * 10 > 20 ? testimonials.length * 10 : 20,
          }}
        >
          {/* Duplicate the array for seamless looping */}
          {[...testimonials, ...testimonials, ...testimonials, ...testimonials, ...testimonials, ...testimonials, ...testimonials, ...testimonials].map((testimonial, idx) => (
            <TestimonialCard 
              key={`${testimonial.id}-${idx}`} 
              testimonial={testimonial} 
              onClickReadMore={setReadMoreTestimonial}
            />
          ))}
        </motion.div>
      </div>

      {/* Add Testimony Modal */}
      <AnimatePresence>
        {isAddModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
              onClick={() => setIsAddModalOpen(false)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-3xl p-8 max-w-md w-full relative z-10 shadow-2xl"
            >
              <button 
                onClick={() => setIsAddModalOpen(false)}
                className="absolute top-6 right-6 text-slate-400 hover:text-slate-600"
              >
                <X className="w-6 h-6" />
              </button>
              <h3 className="text-2xl font-bold text-slate-900 mb-6">Add Your Testimony</h3>
              <form onSubmit={handleAddTestimony} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Name</label>
                  <input 
                    type="text" required
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none transition-all"
                    value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Role / Company (Optional)</label>
                  <input 
                    type="text" 
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none transition-all"
                    value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Testimony</label>
                  <textarea 
                    required rows={4}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none transition-all resize-none"
                    value={formData.text} onChange={e => setFormData({...formData, text: e.target.value})}
                  ></textarea>
                </div>
                <button 
                  type="submit"
                  className="w-full py-4 rounded-xl bg-indigo-600 text-white font-bold hover:bg-indigo-700 transition-colors mt-2"
                >
                  Submit
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* See All Testimonials Modal */}
      <AnimatePresence>
        {isSeeAllModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
              onClick={() => setIsSeeAllModalOpen(false)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-slate-50 rounded-3xl p-6 sm:p-8 max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col relative z-10 shadow-2xl"
            >
              <div className="flex justify-between items-center mb-6 shrink-0">
                <h3 className="text-2xl font-bold text-slate-900">All Testimonials</h3>
                <button 
                  onClick={() => setIsSeeAllModalOpen(false)}
                  className="text-slate-400 hover:text-slate-600 bg-white rounded-full p-2 shadow-sm"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="overflow-y-auto pr-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                {allTestimonialsSorted.map(testimonial => (
                  <div key={testimonial.id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                    <p className="text-slate-600 italic mb-6">"{testimonial.text}"</p>
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-slate-200 rounded-full mr-4 flex items-center justify-center font-bold text-slate-500 overflow-hidden shrink-0">
                        <img src={`https://api.dicebear.com/7.x/initials/svg?seed=${testimonial.name}`} alt={testimonial.name} />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 text-sm">{testimonial.name}</h4>
                        <p className="text-xs text-slate-500">{testimonial.role}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Read More Modal */}
      <AnimatePresence>
        {readMoreTestimonial && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
              onClick={() => setReadMoreTestimonial(null)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl p-8 max-w-lg w-full relative z-10 shadow-2xl"
            >
              <button 
                onClick={() => setReadMoreTestimonial(null)}
                className="absolute top-6 right-6 text-slate-400 hover:text-slate-600"
              >
                <X className="w-6 h-6" />
              </button>
              <div className="mb-6 flex items-center">
                <div className="w-14 h-14 bg-slate-200 rounded-full mr-4 flex items-center justify-center font-bold text-slate-500 overflow-hidden shrink-0">
                  <img src={`https://api.dicebear.com/7.x/initials/svg?seed=${readMoreTestimonial.name}`} alt={readMoreTestimonial.name} />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-lg">{readMoreTestimonial.name}</h4>
                  <p className="text-sm text-slate-500">{readMoreTestimonial.role}</p>
                </div>
              </div>
              <p className="text-lg text-slate-700 italic leading-relaxed">
                "{readMoreTestimonial.text}"
              </p>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

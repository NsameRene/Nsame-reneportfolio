import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Plus, List, Star } from 'lucide-react';
import { Link } from 'react-router';

interface Testimonial {
  id: string;
  name: string;
  role: string;
  text: string;
  date: number;
}

const initialTestimonials: Testimonial[] = [
  { id: '1', name: "James D. Kelly", role: "Founder", text: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.", date: Date.now() - 100000 },
  { id: '2', name: "Joanna S. Brown", role: "CEO", text: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.", date: Date.now() - 200000 },
  { id: '3', name: "Jason E. George", role: "Manager", text: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.", date: Date.now() - 300000 },
];

const TestimonialCard: React.FC<{ testimonial: Testimonial, onClickReadMore: (t: Testimonial) => void }> = ({ testimonial, onClickReadMore }) => {
  const words = testimonial.text.trim().split(/\s+/);
  const isLong = words.length > 20;
  
  return (
    <div className="bg-white p-8 rounded-xl shadow-lg relative min-w-[320px] max-w-[320px] h-[380px] flex flex-col items-center text-center shrink-0 mx-4 border border-slate-100">
      <div className="w-20 h-20 bg-slate-200 rounded-full mb-4 flex items-center justify-center font-bold text-slate-500 overflow-hidden shrink-0 border-4 border-white shadow-sm">
        <img src={`https://api.dicebear.com/7.x/initials/svg?seed=${testimonial.name}`} alt={testimonial.name} className="w-full h-full object-cover" />
      </div>
      
      <h4 className="font-bold text-slate-900 text-lg mb-1">{testimonial.name}</h4>
      <p className="text-sm text-slate-500 mb-4">{testimonial.role}</p>
      
      <div className="flex items-center text-amber-400 mb-6 gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star key={star} className="w-4 h-4 fill-current" />
        ))}
      </div>
      
      <div className="flex-1 overflow-hidden relative flex flex-col items-center">
        <p className={`text-sm text-slate-600 leading-relaxed text-wrap ${isLong ? 'line-clamp-5' : ''}`}>
          {testimonial.text}
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
    </div>
  );
}

export default function TestimonialSection() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>(initialTestimonials);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
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
    <div className="w-full py-16 overflow-hidden bg-slate-50">
      <div className="max-w-7xl mx-auto text-center mb-12 px-4 flex flex-col items-center">
        <h2 className="text-3xl font-extrabold text-slate-900 mb-4">Testimonials</h2>
        <p className="text-sm text-slate-600 max-w-2xl mx-auto mb-6">
          Real feedback from our amazing clients and students. Hear what they have to say about their experiences.
        </p>
        <div className="w-16 h-1 bg-amber-500 mb-8 rounded-full"></div>
        
        <div className="flex justify-center gap-4 flex-wrap">
          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center px-6 py-2 rounded-full bg-slate-900 text-white font-semibold hover:bg-slate-800 transition-colors shadow-sm text-sm"
          >
            <Plus className="w-4 h-4 mr-2" /> Add Testimony
          </button>
          <Link 
            to="/testimonials"
            className="inline-flex items-center px-6 py-2 rounded-full bg-white text-slate-700 border border-slate-200 font-semibold hover:bg-slate-50 transition-colors shadow-sm text-sm"
          >
            <List className="w-4 h-4 mr-2" /> See All
          </Link>
        </div>
      </div>

      {/* Marquee Animation */}
      <div className="relative flex overflow-x-hidden w-full py-8 group" style={{ maskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)' }}>
        <div className="flex animate-[marquee_30s_linear_infinite] group-hover:[animation-play-state:paused] will-change-transform w-max">
          {/* Duplicate the array for seamless looping */}
          {[...testimonials, ...testimonials, ...testimonials, ...testimonials, ...testimonials, ...testimonials, ...testimonials, ...testimonials].map((testimonial, idx) => (
            <TestimonialCard 
              key={`${testimonial.id}-${idx}`} 
              testimonial={testimonial} 
              onClickReadMore={setReadMoreTestimonial}
            />
          ))}
        </div>
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
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none transition-all"
                    value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Role / Company (Optional)</label>
                  <input 
                    type="text" 
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none transition-all"
                    value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Testimony</label>
                  <textarea 
                    required rows={4}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none transition-all resize-none"
                    value={formData.text} onChange={e => setFormData({...formData, text: e.target.value})}
                  ></textarea>
                </div>
                <button 
                  type="submit"
                  className="w-full py-4 rounded-xl bg-slate-900 text-white font-bold hover:bg-slate-800 transition-colors mt-2"
                >
                  Submit
                </button>
              </form>
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
              className="bg-white rounded-3xl p-8 max-w-lg w-full relative z-10 shadow-2xl flex flex-col items-center text-center"
            >
              <button 
                onClick={() => setReadMoreTestimonial(null)}
                className="absolute top-6 right-6 text-slate-400 hover:text-slate-600"
              >
                <X className="w-6 h-6" />
              </button>
              
              <div className="w-20 h-20 bg-slate-200 rounded-full mb-4 flex items-center justify-center font-bold text-slate-500 overflow-hidden shrink-0">
                <img src={`https://api.dicebear.com/7.x/initials/svg?seed=${readMoreTestimonial.name}`} alt={readMoreTestimonial.name} className="w-full h-full object-cover" />
              </div>
              <h4 className="font-bold text-slate-900 text-xl mb-1">{readMoreTestimonial.name}</h4>
              <p className="text-sm text-slate-500 mb-4">{readMoreTestimonial.role}</p>
              
              <div className="flex items-center text-amber-400 mb-6 gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="w-5 h-5 fill-current" />
                ))}
              </div>
              
              <p className="text-base text-slate-700 leading-relaxed">
                {readMoreTestimonial.text}
              </p>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

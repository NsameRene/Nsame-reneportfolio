import { motion } from 'motion/react';
import { Star, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router';
import ScrollReveal from '../components/ScrollReveal';

export const initialTestimonials = [
  { id: '1', name: "James D. Kelly", role: "Founder", text: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.", date: Date.now() - 100000 },
  { id: '2', name: "Joanna S. Brown", role: "CEO", text: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.", date: Date.now() - 200000 },
  { id: '3', name: "Jason E. George", role: "Manager", text: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.", date: Date.now() - 300000 },
];

export default function Testimonials() {
  const allTestimonialsSorted = [...initialTestimonials].sort((a, b) => b.date - a.date);

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto min-h-screen">
      <Link to="/" className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-indigo-600 mb-8 transition-colors">
        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Home
      </Link>
      
      <ScrollReveal className="mb-12">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 mb-4">All Testimonials</h1>
        <p className="text-xl text-slate-600 max-w-2xl">See what our clients and students have to say about our work.</p>
      </ScrollReveal>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {allTestimonialsSorted.map((testimonial, i) => (
          <div key={testimonial.id}>
            <ScrollReveal delay={i * 0.1}>
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center text-center h-full hover:shadow-lg transition-shadow">
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
                <p className="text-sm text-slate-600 leading-relaxed">{testimonial.text}</p>
              </div>
            </ScrollReveal>
          </div>
        ))}
      </div>
    </div>
  );
}

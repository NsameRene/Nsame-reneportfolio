import { getApiUrl } from '../utils/api';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, Mail, MapPin, CheckCircle, ArrowRight, ArrowLeft } from 'lucide-react';
import ScrollReveal from '../components/ScrollReveal';

export default function Contact() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({ projectType: '', budget: '', name: '', email: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const projectTypes = ['Web Development', 'Mobile App', 'UI/UX Design', 'Consulting', 'Other'];
  const budgets = ['Under $5k', '$5k - $10k', '$10k - $25k', '$25k+', 'Not sure yet'];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    
    try {
      const res = await fetch(getApiUrl('/api/contact'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      if (!res.ok) throw new Error('Failed to send');
      
      setStatus('success');
      setFormData({ projectType: '', budget: '', name: '', email: '', message: '' });
      setStep(1);
      
      setTimeout(() => setStatus('idle'), 5000);
    } catch (error) {
      console.error(error);
      setStatus('error');
    }
  };

  const handleNext = (e: React.MouseEvent) => {
    e.preventDefault();
    if (step === 1 && !formData.projectType) return;
    if (step === 2 && !formData.budget) return;
    setStep(s => Math.min(s + 1, 3));
  };

  const handlePrev = (e: React.MouseEvent) => {
    e.preventDefault();
    setStep(s => Math.max(s - 1, 1));
  };

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <ScrollReveal className="mb-12 text-center max-w-2xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 mb-4">Let's Talk</h1>
        <p className="text-xl text-slate-600">Have a project in mind or want to discuss opportunities? Let's connect.</p>
      </ScrollReveal>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <ScrollReveal className="lg:col-span-1 space-y-8" yOffset={0}>
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
            <h3 className="text-xl font-bold text-slate-900 mb-6">Contact Information</h3>
            
            <div className="space-y-6">
              <div className="flex items-start">
                <Mail className="w-6 h-6 text-indigo-600 mt-1 mr-4" />
                <div>
                  <div className="font-medium text-slate-900">Email</div>
                  <a href="mailto:nsamerenetamjong@gmail.com" className="text-slate-600 hover:text-indigo-600 transition-colors">nsamerenetamjong@gmail.com</a>
                </div>
              </div>
              
              <div className="flex items-start">
                <MapPin className="w-6 h-6 text-indigo-600 mt-1 mr-4" />
                <div>
                  <div className="font-medium text-slate-900">Location</div>
                  <div className="text-slate-600">Remote / Global</div>
                </div>
              </div>
            </div>
          </div>
        </ScrollReveal>

        <ScrollReveal className="lg:col-span-2" delay={0.2} yOffset={0}>
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 overflow-hidden relative min-h-[400px] flex flex-col justify-center">
            {status === 'success' ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-6">
                  <CheckCircle className="w-8 h-8 text-emerald-600" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-2">Message Sent!</h3>
                <p className="text-slate-600">Thank you for reaching out. I'll get back to you as soon as possible.</p>
                <button 
                  onClick={() => setStatus('idle')}
                  className="mt-8 px-6 py-2 bg-slate-100 text-slate-900 font-medium rounded-full hover:bg-slate-200 transition-colors"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="relative w-full h-full flex flex-col">
                <div className="flex justify-between items-center mb-8 px-2">
                  <div className="flex space-x-2">
                    {[1, 2, 3].map(i => (
                      <div key={i} className={`h-2 rounded-full transition-all duration-300 ${step >= i ? 'w-8 bg-indigo-600' : 'w-4 bg-slate-200'}`} />
                    ))}
                  </div>
                  <span className="text-sm font-medium text-slate-500">Step {step} of 3</span>
                </div>

                <div className="relative flex-1">
                  <AnimatePresence mode="wait">
                    {step === 1 && (
                      <motion.div
                        key="step1"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                        className="w-full"
                      >
                        <h3 className="text-2xl font-bold text-slate-900 mb-6">What kind of project do you have?</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {projectTypes.map(type => (
                            <button
                              key={type}
                              type="button"
                              onClick={() => setFormData({...formData, projectType: type})}
                              className={`p-4 text-left rounded-2xl border-2 transition-all ${
                                formData.projectType === type 
                                  ? 'border-indigo-600 bg-indigo-50/50' 
                                  : 'border-slate-100 hover:border-slate-200 hover:bg-slate-50'
                              }`}
                            >
                              <span className={`font-semibold ${formData.projectType === type ? 'text-indigo-700' : 'text-slate-700'}`}>{type}</span>
                            </button>
                          ))}
                        </div>
                        <div className="mt-8 flex justify-end">
                          <button
                            type="button"
                            onClick={handleNext}
                            disabled={!formData.projectType}
                            className="inline-flex items-center px-6 py-3 bg-slate-900 text-white font-medium rounded-full hover:bg-slate-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            Next <ArrowRight className="ml-2 w-4 h-4" />
                          </button>
                        </div>
                      </motion.div>
                    )}

                    {step === 2 && (
                      <motion.div
                        key="step2"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                        className="w-full"
                      >
                        <h3 className="text-2xl font-bold text-slate-900 mb-6">What is your expected budget?</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {budgets.map(budget => (
                            <button
                              key={budget}
                              type="button"
                              onClick={() => setFormData({...formData, budget})}
                              className={`p-4 text-left rounded-2xl border-2 transition-all ${
                                formData.budget === budget 
                                  ? 'border-indigo-600 bg-indigo-50/50' 
                                  : 'border-slate-100 hover:border-slate-200 hover:bg-slate-50'
                              }`}
                            >
                              <span className={`font-semibold ${formData.budget === budget ? 'text-indigo-700' : 'text-slate-700'}`}>{budget}</span>
                            </button>
                          ))}
                        </div>
                        <div className="mt-8 flex justify-between">
                          <button
                            type="button"
                            onClick={handlePrev}
                            className="inline-flex items-center px-6 py-3 bg-slate-100 text-slate-700 font-medium rounded-full hover:bg-slate-200 transition-colors"
                          >
                            <ArrowLeft className="mr-2 w-4 h-4" /> Back
                          </button>
                          <button
                            type="button"
                            onClick={handleNext}
                            disabled={!formData.budget}
                            className="inline-flex items-center px-6 py-3 bg-slate-900 text-white font-medium rounded-full hover:bg-slate-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            Next <ArrowRight className="ml-2 w-4 h-4" />
                          </button>
                        </div>
                      </motion.div>
                    )}

                    {step === 3 && (
                      <motion.div
                        key="step3"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                        className="w-full space-y-6"
                      >
                        <h3 className="text-2xl font-bold text-slate-900 mb-2">Final details</h3>
                        <p className="text-slate-500 mb-6">Tell me a little more about yourself and the project.</p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-2">Full Name</label>
                            <input
                              type="text"
                              id="name"
                              required
                              value={formData.name}
                              onChange={(e) => setFormData({...formData, name: e.target.value})}
                              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none transition-all"
                              placeholder="John Doe"
                            />
                          </div>
                          <div>
                            <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">Email Address</label>
                            <input
                              type="email"
                              id="email"
                              required
                              value={formData.email}
                              onChange={(e) => setFormData({...formData, email: e.target.value})}
                              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none transition-all"
                              placeholder="john@example.com"
                            />
                          </div>
                        </div>
                        
                        <div>
                          <label htmlFor="message" className="block text-sm font-medium text-slate-700 mb-2">Message</label>
                          <textarea
                            id="message"
                            required
                            rows={4}
                            value={formData.message}
                            onChange={(e) => setFormData({...formData, message: e.target.value})}
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none transition-all resize-none"
                            placeholder="Tell me about your project..."
                          />
                        </div>
                        
                        {status === 'error' && (
                          <div className="text-red-500 text-sm">Failed to send message. Please try again.</div>
                        )}
                        
                        <div className="mt-8 flex justify-between">
                          <button
                            type="button"
                            onClick={handlePrev}
                            className="inline-flex items-center px-6 py-3 bg-slate-100 text-slate-700 font-medium rounded-full hover:bg-slate-200 transition-colors"
                          >
                            <ArrowLeft className="mr-2 w-4 h-4" /> Back
                          </button>
                          <button
                            type="submit"
                            disabled={status === 'loading'}
                            className="inline-flex items-center px-8 py-3 bg-indigo-600 text-white font-medium rounded-full hover:bg-indigo-700 transition-colors disabled:opacity-70"
                          >
                            {status === 'loading' ? 'Sending...' : (
                              <>Submit Request <Send className="ml-2 w-4 h-4" /></>
                            )}
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </form>
            )}
          </div>
        </ScrollReveal>
      </div>
    </div>
  );
}

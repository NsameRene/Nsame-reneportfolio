const fs = require('fs');

const code = `import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Image as ImageIcon, X } from 'lucide-react';
import ScrollReveal from '../components/ScrollReveal';
import { API_BASE } from '../utils/api';

export default function Gallery() {
  const [galleryItems, setGalleryItems] = useState([]);
  const [filter, setFilter] = useState('All');
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(\`\${API_BASE}/api/gallery\`)
      .then(res => res.json())
      .then(data => setGalleryItems(data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const allCategories = ['All', ...Array.from(new Set(galleryItems.map((item: any) => item.category).filter(Boolean)))];
  const filteredItems = galleryItems.filter((item: any) => filter === 'All' || item.category === filter);

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto min-h-screen">
      <ScrollReveal className="mb-12 text-center max-w-2xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 mb-4">Gallery</h1>
        <p className="text-xl text-slate-600">A visual journey through my workspace, events, and educational content.</p>
      </ScrollReveal>
      
      {loading ? (
        <div className="text-center py-20 text-slate-500 font-medium">Loading gallery...</div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-1/4">
            <div className="sticky top-24 bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
              <h3 className="text-xl font-bold text-slate-900 mb-6">Categories</h3>
              <div className="flex flex-row lg:flex-col gap-3 overflow-x-auto pb-4 lg:pb-0 hide-scrollbar">
                {allCategories.map((type: any) => (
                  <button
                    key={type}
                    onClick={() => setFilter(type)}
                    className={\`px-6 py-3 rounded-2xl font-semibold transition-all whitespace-nowrap text-center lg:text-left \${
                      filter === type 
                         ? 'bg-indigo-600 text-white shadow-md' 
                         : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                    }\`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>
          </div>
          
          {/* Main Gallery */}
          <div className="lg:w-3/4">
            <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              <AnimatePresence>
                {filteredItems.map((item: any) => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3 }}
                    className="group relative aspect-square rounded-3xl overflow-hidden cursor-pointer shadow-sm border border-slate-100"
                    onClick={() => setSelectedItem(item)}
                  >
                    <img 
                       src={item.imageUrl || item.img || 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80'} 
                       alt={item.title} 
                       className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                      <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-md p-2 rounded-full text-white">
                        <ImageIcon className="w-5 h-5" />
                      </div>
                      <span className="text-white/80 text-sm font-bold tracking-wider uppercase mb-1">{item.category || 'General'}</span>
                      <h3 className="text-white text-xl font-bold">{item.title}</h3>
                    </div>
                  </motion.div>
                ))}
                {filteredItems.length === 0 && <div className="col-span-full py-10 text-center text-slate-500">No images found.</div>}
              </AnimatePresence>
            </motion.div>
          </div>
        </div>
      )}

      <AnimatePresence>
        {selectedItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/95 backdrop-blur-sm"
            onClick={() => setSelectedItem(null)}
          >
            <button 
               className="absolute top-6 right-6 text-white/50 hover:text-white transition-colors bg-white/10 p-2 rounded-full"
              onClick={() => setSelectedItem(null)}
            >
              <X className="w-8 h-8" />
            </button>
            <motion.div 
               initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="relative max-w-5xl w-full max-h-[90vh] rounded-2xl overflow-hidden bg-black shadow-2xl"
              onClick={e => e.stopPropagation()}
            >
              <img src={selectedItem.imageUrl || selectedItem.img || 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97'} alt={selectedItem.title} className="w-full h-full max-h-[85vh] object-contain" />
              <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 to-transparent p-6">
                <h3 className="text-white text-2xl font-bold">{selectedItem.title}</h3>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
`;

fs.writeFileSync('src/pages/Gallery.tsx', code);

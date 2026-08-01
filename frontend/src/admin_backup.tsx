import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { LogOut, LayoutDashboard, Briefcase, FileText, FileBadge, MessageSquare, Settings, Plus, Edit2, Trash2, ShieldCheck, Mail, Lock, BookOpen, Quote, Image as ImageIcon, X } from 'lucide-react';

export default function Admin() {
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState('');
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState('Dashboard');

  const [projects, setProjects] = useState<any[]>([]);
  const [blogs, setBlogs] = useState<any[]>([]);

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);

  const fetchItems = async () => {
    try {
      const projRes = await fetch('/api/projects');
      if (projRes.ok) setProjects(await projRes.json());
      
      const blogRes = await fetch('/api/blogs');
      if (blogRes.ok) setBlogs(await blogRes.json());
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (token) {
      fetch('/api/auth/check', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      })
      .then(res => res.json())
      .then(data => {
        if (data.user) {
          setUser(data.user);
          fetchItems();
        } else {
          localStorage.removeItem('admin_token');
        }
      })
      .catch(err => console.error("Admin check failed", err))
      .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setAuthError('');
      
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || 'Login failed');
      }
      
      localStorage.setItem('admin_token', data.token);
      setUser(data.user);
      fetchItems();
    } catch (error: any) {
      console.error(error);
      setAuthError(error.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    setUser(null);
  };

  const handleDelete = async (type: string, id: number) => {
    if (!confirm('Are you sure you want to delete this item?')) return;
    try {
      const token = localStorage.getItem('admin_token');
      await fetch(`/api/${type}/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      fetchItems();
    } catch (err) {
      console.error(err);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('admin_token');
    const formData = new FormData(e.target as HTMLFormElement);
    
    let url = `/api/${activeTab.toLowerCase()}`;
    let method = 'POST';

    if (editingItem) {
      url += `/${editingItem.id}`;
      method = 'PUT';
    }

    try {
      await fetch(url, {
        method,
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      });
      setIsModalOpen(false);
      fetchItems();
    } catch (err) {
      console.error(err);
      alert('Error saving item');
    }
  };

  const openModal = (item?: any) => {
    setEditingItem(item || null);
    setIsModalOpen(true);
  };

  if (loading && !user) {
    return <div className="p-20 text-center text-slate-500 font-medium">Loading admin environment...</div>;
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] py-12 px-4 relative overflow-hidden bg-slate-50 w-full rounded-2xl">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-indigo-600/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-64 h-64 bg-purple-600/10 rounded-full blur-3xl"></div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="bg-white p-8 md:p-10 rounded-[2rem] shadow-xl border border-slate-100 max-w-md w-full relative z-10"
        >
          <div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-slate-900/20">
            <ShieldCheck className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 mb-2 text-center tracking-tight">Admin Portal</h1>
          <p className="text-slate-500 mb-8 text-sm text-center font-medium">Enter your credentials to manage your portfolio.</p>
          
          {authError && <div className="mb-6 text-red-600 text-sm bg-red-50 p-4 rounded-xl border border-red-100 font-medium text-center">{authError}</div>}
          
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-slate-400" />
                </div>
                <input 
                  type="email" required
                  value={email} onChange={e => setEmail(e.target.value)}
                  className="block w-full pl-11 pr-4 py-3.5 border border-slate-200 rounded-xl bg-slate-50 text-slate-900 focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition-all font-medium placeholder:text-slate-400"
                  placeholder="admin@example.com"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-400" />
                </div>
                <input 
                  type="password" required
                  value={password} onChange={e => setPassword(e.target.value)}
                  className="block w-full pl-11 pr-4 py-3.5 border border-slate-200 rounded-xl bg-slate-50 text-slate-900 focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition-all font-medium placeholder:text-slate-400"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button 
              type="submit" disabled={loading}
              className="w-full bg-slate-900 text-white font-bold py-4 rounded-xl hover:bg-indigo-600 transition-all shadow-md hover:shadow-lg disabled:opacity-70 mt-2"
            >
              {loading ? 'Authenticating...' : 'Secure Sign In'}
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  const tabs = [
    { name: 'Dashboard', icon: LayoutDashboard },
    { name: 'Projects', icon: Briefcase },
    { name: 'Blogs', icon: FileText },
    { name: 'CV', icon: FileBadge },
    { name: 'Courses', icon: BookOpen },
    { name: 'Quotes', icon: Quote },
    { name: 'Gallery', icon: ImageIcon },
    { name: 'Messages', icon: MessageSquare },
    { name: 'Settings', icon: Settings },
  ];

  const hasAddButton = ['Projects', 'Blogs', 'CV', 'Courses', 'Quotes', 'Gallery'].includes(activeTab);

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8 flex flex-col md:flex-row gap-6 lg:gap-8 rounded-3xl mb-12">
      {/* Sidebar */}
      <div className="w-full md:w-64 flex flex-col gap-6 flex-shrink-0">
        <div className="bg-slate-900 p-6 rounded-3xl shadow-xl flex items-center gap-4 relative overflow-hidden">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/10 rounded-full blur-2xl"></div>
          <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center border border-white/20 backdrop-blur-sm z-10 flex-shrink-0">
            <span className="text-lg font-bold text-white">{user.email?.charAt(0).toUpperCase()}</span>
          </div>
          <div className="z-10 truncate">
            <div className="text-xs font-semibold tracking-wider uppercase text-slate-400 mb-0.5">Admin User</div>
            <div className="font-bold text-white text-sm truncate">{user.email}</div>
          </div>
        </div>
        
        <nav className="flex flex-col gap-1.5 bg-white p-4 rounded-3xl shadow-sm border border-slate-100 flex-grow">
          <div className="text-xs font-bold tracking-wider uppercase text-slate-400 mb-2 px-4 mt-2">Menu</div>
          {tabs.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.name;
            return (
              <button 
                key={item.name} 
                onClick={() => setActiveTab(item.name)}
                className={`flex items-center px-4 py-2.5 rounded-xl font-semibold transition-all text-sm ${isActive ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}
              >
                <Icon className={`w-4 h-4 mr-3 ${isActive ? 'text-indigo-200' : 'text-slate-400'}`} />
                {item.name}
              </button>
            )
          })}
          
          <div className="mt-auto pt-6 border-t border-slate-100">
            <button onClick={handleLogout} className="w-full flex items-center px-4 py-2.5 rounded-xl text-sm font-semibold text-red-600 hover:bg-red-50 transition-colors">
              <LogOut className="w-4 h-4 mr-3 text-red-400" /> Sign Out
            </button>
          </div>
        </nav>
      </div>
      
      {/* Main Content Area */}
      <div className="flex-grow bg-white p-6 sm:p-8 lg:p-10 rounded-3xl shadow-sm border border-slate-100 relative">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4">
          <div>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">{activeTab}</h2>
            <p className="text-slate-500 font-medium mt-1 text-sm">Manage and customize your {activeTab.toLowerCase()} content.</p>
          </div>
          {hasAddButton && (
            <button onClick={() => openModal()} className="flex items-center px-5 py-2.5 bg-slate-900 text-white text-sm font-bold rounded-full hover:bg-indigo-600 transition-colors shadow-md">
              <Plus className="w-4 h-4 mr-2" /> Add New
            </button>
          )}
        </div>
        
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="w-full"
          >
            {activeTab === 'Dashboard' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  { title: 'Total Projects', count: projects.length, color: 'bg-indigo-50 text-indigo-700 border-indigo-100' },
                  { title: 'Published Blogs', count: blogs.length, color: 'bg-emerald-50 text-emerald-700 border-emerald-100' },
                  { title: 'Unread Messages', count: '0', color: 'bg-rose-50 text-rose-700 border-rose-100' },
                ].map((stat, i) => (
                  <div key={i} className={`p-6 rounded-2xl border ${stat.color}`}>
                    <div className="text-xs font-bold tracking-wider uppercase mb-2 opacity-80">{stat.title}</div>
                    <div className="text-4xl font-extrabold">{stat.count}</div>
                  </div>
                ))}
              </div>
            )}
            
            {activeTab === 'Projects' && (
              <div className="space-y-4">
                {projects.map((proj, i) => (
                  <div key={i} className="flex flex-col sm:flex-row items-center justify-between p-4 rounded-2xl border border-slate-200 hover:border-indigo-300 hover:shadow-md transition-all gap-4">
                    <div className="flex items-center gap-4 w-full sm:w-auto">
                      <div className="w-16 h-16 rounded-xl bg-slate-100 flex-shrink-0 border border-slate-200 overflow-hidden">
                         {proj.imageUrl && <img src={proj.imageUrl} alt={proj.title} className="w-full h-full object-cover" />}
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 text-lg">{proj.title}</h4>
                        <p className="text-sm font-medium text-slate-500">{proj.category || 'Uncategorized'}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                      <button onClick={() => openModal(proj)} className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"><Edit2 className="w-4 h-4" /></button>
                      <button onClick={() => handleDelete('projects', proj.id)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </div>
                ))}
                {projects.length === 0 && <div className="text-slate-500 text-center py-10 text-sm font-medium">No projects found. Add one above.</div>}
              </div>
            )}

            {activeTab === 'Blogs' && (
              <div className="space-y-4">
                {blogs.map((blog, i) => (
                  <div key={i} className="flex flex-col sm:flex-row items-center justify-between p-4 rounded-2xl border border-slate-200 hover:border-indigo-300 hover:shadow-md transition-all gap-4">
                    <div className="flex items-center gap-4 w-full sm:w-auto">
                      <div className="w-16 h-16 rounded-xl bg-slate-100 flex-shrink-0 border border-slate-200 overflow-hidden">
                        {blog.coverImage && <img src={blog.coverImage} alt={blog.title} className="w-full h-full object-cover" />}
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 text-lg">{blog.title}</h4>
                        <p className="text-sm font-medium text-slate-500">{blog.category || 'Uncategorized'}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                      <button onClick={() => openModal(blog)} className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"><Edit2 className="w-4 h-4" /></button>
                      <button onClick={() => handleDelete('blogs', blog.id)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </div>
                ))}
                {blogs.length === 0 && <div className="text-slate-500 text-center py-10 text-sm font-medium">No blogs found. Add one above.</div>}
              </div>
            )}
            
            {activeTab === 'Messages' && (
              <div className="space-y-4">
                <div className="bg-slate-50 p-10 rounded-2xl border border-slate-200 text-center">
                  <div className="w-16 h-16 bg-slate-200 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
                    <MessageSquare className="w-8 h-8" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-700 mb-2">No Messages Yet</h3>
                  <p className="text-slate-500 text-sm font-medium">When visitors fill out your contact form, messages will appear here.</p>
                </div>
              </div>
            )}

            {activeTab === 'Settings' && (
              <div className="space-y-8 max-w-3xl">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 border-b border-slate-200 pb-2 mb-6">Profile Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">Full Name</label>
                      <input type="text" className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-indigo-600 outline-none text-sm font-medium" defaultValue="Nsame Rene" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">Role/Title</label>
                      <input type="text" className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-indigo-600 outline-none text-sm font-medium" defaultValue="Software Engineer" />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-semibold text-slate-700 mb-2">Short Bio</label>
                      <textarea rows={3} className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-indigo-600 outline-none resize-none text-sm font-medium" defaultValue="Experienced Software Engineer with a demonstrated history of working in the information technology and services industry." />
                    </div>
                  </div>
                  <button className="mt-6 px-6 py-2.5 bg-slate-900 text-white text-sm font-bold rounded-xl hover:bg-indigo-600 transition-colors">Save Changes</button>
                </div>
              </div>
            )}

            {['CV', 'Courses', 'Quotes', 'Gallery'].includes(activeTab) && (
               <div className="bg-slate-50 p-10 rounded-2xl border border-slate-200 text-center">
                  <h3 className="text-lg font-bold text-slate-700 mb-2">{activeTab} Management</h3>
                  <p className="text-slate-500 text-sm font-medium">Use the "Add New" button above to start customizing your {activeTab.toLowerCase()}.</p>
               </div>
            )}
            
          </motion.div>
        </AnimatePresence>

        {/* Generic Add/Edit Modal */}
        <AnimatePresence>
          {isModalOpen && (
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm"
            >
              <motion.div 
                initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
                className="bg-white rounded-[2rem] shadow-2xl border border-slate-200 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
              >
                <div className="p-6 md:p-8">
                  <div className="flex items-center justify-between mb-8">
                    <h3 className="text-2xl font-bold text-slate-900">{editingItem ? 'Edit' : 'Add New'} {activeTab.replace(/s$/, '')}</h3>
                    <button onClick={() => setIsModalOpen(false)} className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-full transition-colors">
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  
                  <form onSubmit={handleSave} className="space-y-5">
                    {/* Dynamic Fields based on activeTab */}
                    {(activeTab === 'Projects' || activeTab === 'Blogs') && (
                      <>
                        <div>
                          <label className="block text-sm font-semibold text-slate-700 mb-2">Title</label>
                          <input name="title" type="text" required defaultValue={editingItem?.title || ''} className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-indigo-600 outline-none text-sm font-medium" />
                        </div>
                        {activeTab === 'Blogs' && (
                          <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Slug</label>
                            <input name="slug" type="text" required defaultValue={editingItem?.slug || ''} className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-indigo-600 outline-none text-sm font-medium" />
                          </div>
                        )}
                        <div>
                          <label className="block text-sm font-semibold text-slate-700 mb-2">Category</label>
                          <input name="category" type="text" defaultValue={editingItem?.category || ''} className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-indigo-600 outline-none text-sm font-medium" />
                        </div>
                        {activeTab === 'Projects' && (
                          <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Technologies</label>
                            <input name="technologies" type="text" defaultValue={editingItem?.technologies || ''} className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-indigo-600 outline-none text-sm font-medium" />
                          </div>
                        )}
                        <div>
                          <label className="block text-sm font-semibold text-slate-700 mb-2">Description / Content</label>
                          <textarea name={activeTab === 'Blogs' ? 'content' : 'description'} rows={4} required defaultValue={activeTab === 'Blogs' ? editingItem?.content : editingItem?.description} className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-indigo-600 outline-none resize-none text-sm font-medium" />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-slate-700 mb-2">Image / Cover URL</label>
                          <input name={activeTab === 'Blogs' ? 'coverImage' : 'imageUrl'} type="text" defaultValue={activeTab === 'Blogs' ? editingItem?.coverImage : editingItem?.imageUrl} className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-indigo-600 outline-none text-sm font-medium" />
                        </div>
                      </>
                    )}
                    
                    <div className="flex justify-end gap-3 pt-6 border-t border-slate-100 mt-8">
                      <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 rounded-xl font-bold text-slate-600 hover:bg-slate-100 transition-colors text-sm">Cancel</button>
                      <button type="submit" className="px-6 py-2.5 bg-slate-900 text-white text-sm font-bold rounded-xl hover:bg-indigo-600 transition-colors shadow-md">Save Changes</button>
                    </div>
                  </form>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}

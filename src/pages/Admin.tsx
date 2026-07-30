import { useState, useEffect } from 'react';
import { auth, googleAuthProvider } from '../lib/firebase.ts';
import { signInWithPopup, onAuthStateChanged, User } from 'firebase/auth';
import { motion } from 'motion/react';
import { LogOut } from 'lucide-react';

export default function Admin() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState('');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
      
      // If logged in, optionally check admin status on backend
      if (currentUser) {
        currentUser.getIdToken().then(token => {
          fetch('/api/auth/check', {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${token}` }
          }).catch(err => console.error("Admin check failed", err));
        });
      }
    });

    return () => unsubscribe();
  }, []);

  const handleLogin = async () => {
    try {
      setAuthError('');
      await signInWithPopup(auth, googleAuthProvider);
    } catch (error: any) {
      console.error(error);
      setAuthError(error.message || 'Login failed');
    }
  };

  const handleLogout = () => {
    auth.signOut();
  };

  if (loading) {
    return <div className="p-20 text-center text-slate-500">Loading admin context...</div>;
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center py-32 px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 max-w-md w-full text-center"
        >
          <h1 className="text-2xl font-bold text-slate-900 mb-6">Admin Login</h1>
          <p className="text-slate-600 mb-8 text-sm">Secure access to the portfolio management dashboard.</p>
          
          {authError && <div className="mb-4 text-red-500 text-sm bg-red-50 p-3 rounded-xl">{authError}</div>}
          
          <button 
            onClick={handleLogin}
            className="w-full bg-slate-900 text-white font-medium py-3 rounded-full hover:bg-slate-800 transition-colors flex items-center justify-center"
          >
            Sign in with Google
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex flex-col md:flex-row gap-8">
      {/* Sidebar */}
      <div className="w-full md:w-64 flex flex-col gap-2">
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 mb-4">
          <div className="text-sm font-medium text-slate-500 mb-1">Logged in as</div>
          <div className="font-bold text-slate-900 truncate">{user.email}</div>
          <button onClick={handleLogout} className="mt-4 text-red-600 text-sm font-medium flex items-center hover:text-red-700">
            <LogOut className="w-4 h-4 mr-2" /> Sign Out
          </button>
        </div>
        
        <nav className="flex flex-col gap-1">
          {['Dashboard', 'Projects', 'Blogs', 'Skills', 'Experience', 'Messages'].map(item => (
            <button key={item} className={`text-left px-4 py-3 rounded-xl font-medium transition-colors ${item === 'Projects' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}>
              {item}
            </button>
          ))}
        </nav>
      </div>
      
      {/* Main Content Area */}
      <div className="flex-grow bg-white p-8 rounded-3xl shadow-sm border border-slate-100 min-h-[600px]">
        <h2 className="text-2xl font-bold mb-6">Manage Projects</h2>
        
        <div className="bg-slate-50 p-8 rounded-2xl border border-slate-200 text-center">
          <h3 className="text-lg font-bold text-slate-700 mb-2">Project Management Interface</h3>
          <p className="text-slate-500 text-sm mb-6">Create, edit, and organize your portfolio projects.</p>
          <button className="bg-indigo-600 text-white px-6 py-2 rounded-full font-medium hover:bg-indigo-700 transition-colors">
            Add New Project
          </button>
        </div>
      </div>
    </div>
  );
}

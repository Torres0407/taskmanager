import React from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { signInWithGoogle } from '../lib/firebase';
import { motion } from 'motion/react';

export default function Login() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  if (loading) return null;
  if (user) return <Navigate to="/dashboard" replace />;

  const handleGoogleLogin = async () => {
    try {
      await signInWithGoogle();
      navigate('/dashboard');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-brand-black flex flex-col items-center justify-center p-6 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-brand-surface border border-brand-card p-8 rounded-2xl shadow-2xl relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-1 bg-brand-gold" />
        
        <div className="mb-8">
          <h2 className="text-sm uppercase tracking-[0.4em] text-brand-gold-dark font-semibold mb-2">Access Portal</h2>
          <h1 className="text-3xl font-bold text-brand-gold italic">Identification</h1>
        </div>

        <div className="space-y-6">
          <p className="text-sm text-brand-ash-dark leading-relaxed">
            Verify your credentials via the external authentication layer to proceed into the Grindstone operative network.
          </p>

          <button
            onClick={handleGoogleLogin}
            className="w-full bg-brand-gold text-brand-black font-bold py-4 px-6 rounded-lg uppercase tracking-widest text-xs flex items-center justify-center gap-3 hover:bg-brand-gold-light transition-all transform active:scale-95 shadow-[0_0_20px_rgba(201,168,76,0.2)]"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Connect via Google
          </button>

          <div className="pt-6 border-t border-brand-card flex justify-between items-center text-[10px] uppercase tracking-widest text-brand-ash-dark">
            <span>TLS Encryption Active</span>
            <span>IP: 142.250.xxx.xxx</span>
          </div>
        </div>
      </motion.div>
      
      <div className="mt-8 text-xs text-brand-ash-dark/50 uppercase tracking-[0.2em]">
        Operative ID required for terminal access
      </div>
    </div>
  );
}

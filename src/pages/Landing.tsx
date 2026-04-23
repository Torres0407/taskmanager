import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { useAuth } from '../AuthContext';
import { ArrowRight } from 'lucide-react';

export default function Landing() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-brand-black flex flex-col items-center justify-center p-6 text-center overflow-hidden">
      {/* Massive Display Title */}
      <div className="relative">
        <motion.h1 
          initial={{ opacity: 0, scale: 1.2, y: 50 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-[15vw] md:text-[12vw] font-bold text-brand-gold uppercase leading-[0.8] tracking-tighter italic"
        >
          Grind<br />stone
        </motion.h1>
        
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: "100%" }}
          transition={{ delay: 0.5, duration: 1 }}
          className="h-px bg-brand-gold mt-4"
        />
      </div>

      {/* Subtitle / CTA */}
      <div className="max-w-xl self-end mt-12 md:mr-[10%] text-right">
        <motion.p 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.8 }}
          className="text-lg md:text-xl text-brand-ash-dark mb-8 leading-relaxed"
        >
          A gamified productivity platform where actions carry weight. 
          Earn, evolve, and climb the ranks of efficiency.
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="flex flex-col items-end gap-4"
        >
          <Link 
            to={user ? "/dashboard" : "/login"} 
            className="group flex items-center gap-4 text-brand-gold hover:text-brand-gold-light transition-colors"
          >
            <span className="text-sm font-medium uppercase tracking-[0.3em]">
              {user ? "Enter Operation" : "Initiate Connection"}
            </span>
            <div className="w-12 h-12 rounded-full border border-brand-gold flex items-center justify-center group-hover:bg-brand-gold group-hover:text-brand-black transition-all">
              <ArrowRight className="w-5 h-5" />
            </div>
          </Link>
          
          <div className="flex gap-8 mt-12 text-[10px] uppercase tracking-widest text-brand-ash-dark opacity-50">
            <span>Auth v1.0.2</span>
            <span>Firebase DB Loaded</span>
            <span>System Nominal</span>
          </div>
        </motion.div>
      </div>

      {/* Background Decor */}
      <div className="fixed inset-0 pointer-events-none -z-10 bg-[radial-gradient(circle_at_50%_120%,#C9A84C10,transparent_50%)]" />
      <div className="fixed top-20 left-20 w-px h-64 bg-gradient-to-b from-brand-gold/20 to-transparent" />
      <div className="fixed bottom-20 right-20 w-64 h-px bg-gradient-to-l from-brand-gold/20 to-transparent" />
    </div>
  );
}

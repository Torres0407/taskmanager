import React from 'react';
import { useAuth } from '../AuthContext';
import { motion } from 'motion/react';
import { Trophy, Shield, Zap, Target, Star, Award } from 'lucide-react';

const ACHIEVEMENTS = [
  { id: 'first_blood', title: 'First Blood', desc: 'Complete your first high-priority operation.', icon: Zap, color: '#C9A84C' },
  { id: 'on_a_roll', title: 'On a Roll', desc: 'Maintain a 7-day streak.', icon: Target, color: '#40C0E0' },
  { id: 'point_lord', title: 'Point Lord', desc: 'Accumulate 10,000 total credits.', icon: Star, color: '#A855F7' },
  { id: 'centurion', title: 'Centurion', desc: 'Complete 100 operations.', icon: Shield, color: '#EF4444' },
  { id: 'no_mercy', title: 'No Mercy', desc: 'Reach a 30-day streak.', icon: Award, color: '#F0D080' },
];

export default function Achievements() {
  const { profile } = useAuth();

  return (
    <div className="flex flex-col h-full bg-brand-black overflow-hidden">
      <header className="h-20 bg-brand-surface border-b border-brand-card flex items-center px-8 shrink-0">
        <div className="flex items-center gap-4">
          <Trophy className="text-brand-gold w-6 h-6" />
          <h1 className="text-2xl font-bold text-white uppercase italic tracking-tighter">Achievement Terminal</h1>
        </div>
      </header>

      <div className="flex-1 p-12 overflow-y-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {ACHIEVEMENTS.map((ach) => (
            <motion.div
              key={ach.id}
              whileHover={{ scale: 1.02 }}
              className="bg-brand-surface border border-brand-card p-8 rounded-2xl relative overflow-hidden group"
            >
              <div className="absolute top-0 left-0 w-full h-1 opacity-20 group-hover:opacity-100 transition-opacity" style={{ backgroundColor: ach.color }} />
              
              <div className="flex items-start justify-between mb-6">
                <div className="p-4 bg-brand-black rounded-xl border border-brand-card group-hover:border-brand-gold/30 transition-colors">
                  <ach.icon className="w-8 h-8" style={{ color: ach.color }} />
                </div>
                <div className="text-[10px] uppercase font-bold text-brand-ash-dark tracking-widest bg-brand-black px-3 py-1 rounded-full border border-brand-card">
                  LOCKED
                </div>
              </div>

              <h2 className="text-xl font-bold text-white mb-2">{ach.title}</h2>
              <p className="text-brand-ash-dark text-sm leading-relaxed mb-6">
                {ach.desc}
              </p>

              <div className="pt-6 border-t border-brand-card flex justify-between items-center">
                <div className="text-[9px] uppercase font-bold tracking-widest text-brand-ash-dark">Reward</div>
                <div className="text-brand-gold font-mono text-xs">+500 XP // +250 PTS</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

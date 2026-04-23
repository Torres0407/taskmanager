import React from 'react';
import { useAuth } from '../AuthContext';
import { motion } from 'motion/react';
import { ShoppingCart, Zap, Shield, Sparkles, Lock } from 'lucide-react';

const STORE_ITEMS = [
  { id: '1', title: 'Adrenaline injector', desc: 'Instantly resets one failed streak.', cost: 500, type: 'consumable', icon: Zap, color: '#C9A84C' },
  { id: '2', title: 'Carbon weave shroud', desc: 'A premium matte black avatar border.', cost: 1250, type: 'cosmetic', icon: Shield, color: '#B0ADA8' },
  { id: '3', title: 'Neon edge framing', desc: 'Animated glowing profile border effect.', cost: 2500, type: 'cosmetic', icon: Sparkles, color: '#40C0E0' },
  { id: '4', title: 'Advanced ops access', desc: 'Unlocks priority level 4 (Extreme) tasks.', cost: 5000, type: 'unlock', icon: Lock, color: '#EF4444' },
];

export default function Store() {
  const { profile } = useAuth();

  return (
    <div className="flex flex-col h-full bg-brand-black overflow-hidden">
      <header className="h-20 bg-brand-surface border-b border-brand-card flex items-center justify-between px-8 shrink-0">
        <div className="flex items-center gap-4">
          <ShoppingCart className="text-brand-gold w-6 h-6" />
          <h1 className="text-2xl font-bold text-white uppercase italic tracking-tighter">The Forge (Supply Store)</h1>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-[10px] uppercase text-brand-ash-dark font-bold tracking-widest">Available Credits</span>
          <span className="text-xl font-mono text-brand-gold font-bold">{profile?.points?.toLocaleString() || '0.00'} PTS</span>
        </div>
      </header>

      <div className="flex-1 p-12 overflow-y-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
          {STORE_ITEMS.map((item) => (
            <motion.div
              key={item.id}
              whileHover={{ y: -5 }}
              className="bg-brand-surface border border-brand-card rounded-2xl p-8 flex flex-col items-center text-center group relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-100 transition-opacity">
                 <item.icon className="w-24 h-24 absolute -top-8 -right-8" style={{ color: item.color }} />
              </div>

              <div className="w-20 h-20 bg-brand-black rounded-2xl border border-brand-card flex items-center justify-center mb-6 relative z-10 group-hover:border-brand-gold transition-colors">
                <item.icon className="w-10 h-10" style={{ color: item.color }} />
              </div>

              <h2 className="text-xl font-bold text-white mb-2 uppercase tracking-tight relative z-10">{item.title}</h2>
              <div className="text-[10px] uppercase tracking-widest text-brand-ash-dark font-bold mb-4 bg-brand-card px-3 py-0.5 rounded-full z-10">
                {item.type}
              </div>
              
              <p className="text-brand-ash-dark text-sm leading-relaxed mb-8 h-12 overflow-hidden relative z-10">
                {item.desc}
              </p>

              <button className="w-full mt-auto bg-brand-black border border-brand-card text-white font-bold py-4 rounded-xl uppercase tracking-widest text-xs hover:bg-brand-gold hover:text-brand-black hover:border-brand-gold transition-all flex justify-between items-center px-6 group/btn">
                <span>Acquire</span>
                <span className="text-brand-gold group-hover/btn:text-brand-black font-mono">{item.cost} PTS</span>
              </button>
            </motion.div>
          ))}
        </div>

        <div className="mt-16 p-8 border border-dashed border-brand-card rounded-2xl flex items-center gap-8 bg-brand-surface/30">
          <div className="p-6 bg-brand-black rounded-xl border border-brand-card">
             <Shield className="w-12 h-12 text-brand-ash-dark opacity-30" />
          </div>
          <div>
            <h3 className="text-white font-bold uppercase tracking-widest mb-2">Inventory Management</h3>
            <p className="text-brand-ash-dark text-sm max-w-lg italic">
              All acquired hardware and cosmetics are managed via the Personnel Inventory terminal (Profile). Some items may require specific rank thresholds for activation.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

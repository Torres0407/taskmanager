import React from 'react';
import { useAuth } from '../AuthContext';
import { motion } from 'motion/react';
import { Trophy, Medal, Target } from 'lucide-react';

const MOCK_LEADERS = [
  { id: '1', name: 'ZENITH_MASTER', xp: 142800, rank: 'Legendary', level: 38 },
  { id: '2', name: 'CODE_REAPER', xp: 121500, rank: 'Legendary', level: 35 },
  { id: '3', name: 'NULL_PTR', xp: 118200, rank: 'Legendary', level: 34 },
  { id: '4', name: 'QUBIT_SNIPER', xp: 98400, rank: 'Diamond', level: 31 },
  { id: '5', name: 'VOID_WALKER', xp: 92100, rank: 'Diamond', level: 30 },
];

export default function Leaderboard() {
  const { profile } = useAuth();

  return (
    <div className="flex flex-col h-full bg-brand-black overflow-hidden">
      <header className="h-20 bg-brand-surface border-b border-brand-card flex items-center px-8 shrink-0">
        <div className="flex items-center gap-4">
          <Trophy className="text-brand-gold w-6 h-6" />
          <h1 className="text-2xl font-bold text-white uppercase italic tracking-tighter">Global Rankings</h1>
        </div>
      </header>

      <div className="flex-1 p-12 overflow-y-auto max-w-4xl w-full mx-auto">
        {/* Top 3 Podium */}
        <div className="grid grid-cols-3 gap-6 mb-12 items-end pt-12">
           <PodiumItem rank={2} name={MOCK_LEADERS[1].name} xp="121k" h="h-48" />
           <PodiumItem rank={1} name={MOCK_LEADERS[0].name} xp="142k" h="h-64" active />
           <PodiumItem rank={3} name={MOCK_LEADERS[2].name} xp="118k" h="h-40" />
        </div>

        {/* List */}
        <div className="space-y-2">
          {MOCK_LEADERS.map((leader, i) => (
            <LeaderRow key={leader.id} leader={leader} rank={i+1} />
          ))}
          
          <div className="py-8 flex flex-col items-center gap-2 opacity-50">
            <div className="w-1 h-1 bg-brand-card rounded-full" />
            <div className="w-1 h-1 bg-brand-card rounded-full" />
            <div className="w-1 h-1 bg-brand-card rounded-full" />
          </div>

          <div className="bg-brand-surface border-2 border-brand-gold p-4 rounded-xl flex items-center gap-4 shadow-[0_0_20px_rgba(201,168,76,0.1)]">
            <span className="font-mono text-brand-gold font-bold w-12 text-center">#412</span>
            <div className="w-10 h-10 rounded bg-brand-gold flex items-center justify-center text-brand-black font-bold uppercase">
              {profile?.displayName?.charAt(0) || 'Y'}
            </div>
            <div className="flex-1">
              <div className="text-sm font-bold text-white uppercase">{profile?.displayName || 'YOU'}</div>
              <div className="text-[10px] text-brand-gold uppercase font-mono">{profile?.rank} // Lv {profile?.level}</div>
            </div>
            <div className="text-right">
              <div className="text-sm font-mono text-brand-gold font-bold">{(profile?.xp || 0).toLocaleString()} XP</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const PodiumItem = ({ rank, name, xp, h, active }: { rank: number, name: string, xp: string, h: string, active?: boolean }) => (
  <div className="flex flex-col items-center gap-4">
    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-2xl shadow-xl ${active ? 'bg-brand-gold text-brand-black' : 'bg-brand-surface border border-brand-card text-brand-ash'}`}>
      {rank === 1 ? <Medal className="w-10 h-10" /> : rank}
    </div>
    <div className={`w-full ${h} ${active ? 'bg-brand-gold' : 'bg-brand-surface'} rounded-t-xl border-x border-t ${active ? 'border-brand-gold-light' : 'border-brand-card'} flex flex-col items-center justify-end p-6 relative overflow-hidden`}>
      {active && <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />}
      <div className={`text-center relative z-10 ${active ? 'text-brand-black' : 'text-white'}`}>
        <div className="text-sm font-black uppercase tracking-tighter truncate w-full px-2">{name}</div>
        <div className={`text-xs font-mono font-bold ${active ? 'text-brand-black/70' : 'text-brand-gold'}`}>{xp} XP</div>
      </div>
    </div>
  </div>
);

const LeaderRow = ({ leader, rank }: { key?: any, leader: any, rank: number }) => (
  <div className="bg-brand-surface border border-brand-card p-4 rounded-xl flex items-center gap-4 hover:border-brand-ash/30 transition-colors group cursor-default">
    <span className="font-mono text-brand-ash-dark font-bold w-12 text-center group-hover:text-brand-ash transition-colors">#{rank}</span>
    <div className="w-10 h-10 rounded bg-brand-card border border-brand-card group-hover:border-brand-ash/20 flex items-center justify-center text-brand-ash-dark font-bold uppercase transition-all">
      {leader.name.charAt(0)}
    </div>
    <div className="flex-1">
      <div className="text-sm font-bold text-white uppercase group-hover:text-brand-gold transition-colors">{leader.name}</div>
      <div className="text-[10px] text-brand-ash-dark uppercase font-mono">{leader.rank} // Lv {leader.level}</div>
    </div>
    <div className="text-right">
      <div className="text-sm font-mono text-brand-ash font-bold">{leader.xp.toLocaleString()} XP</div>
    </div>
  </div>
);

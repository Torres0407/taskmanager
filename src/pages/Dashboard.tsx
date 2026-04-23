import React from 'react';
import { useAuth } from '../AuthContext';
import { motion } from 'motion/react';

export default function Dashboard() {
  const { profile, user } = useAuth();
  const [activeTasks, setActiveTasks] = useState<Task[]>([]);
  const [recentLogs, setRecentLogs] = useState<any[]>([]);

  useEffect(() => {
    if (!user) return;

    // Fetch top 3 active tasks
    const tasksQ = query(
      collection(db, 'tasks'),
      where('userId', '==', user.uid),
      where('status', '==', 'pending'),
      orderBy('createdAt', 'desc'),
      limit(3)
    );

    const unsubscribeTasks = onSnapshot(tasksQ, (snapshot) => {
      setActiveTasks(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Task[]);
    });

    // Fetch 5 recent transactions
    const transQ = query(
      collection(db, 'transactions'),
      where('userId', '==', user.uid),
      orderBy('createdAt', 'desc'),
      limit(5)
    );

    const unsubscribeTrans = onSnapshot(transQ, (snapshot) => {
      setRecentLogs(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    return () => {
      unsubscribeTasks();
      unsubscribeTrans();
    };
  }, [user]);

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* High Density Header */}
      <header className="h-20 bg-brand-surface border-b border-brand-card flex items-center justify-between px-8 shrink-0">
        <div className="flex gap-12">
          <div className="flex flex-col">
            <span className="text-[10px] uppercase text-brand-ash-dark font-bold tracking-widest">Total Credits</span>
            <span className="text-2xl font-mono text-brand-gold tracking-tight">{profile?.points?.toLocaleString() || '0.00'}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] uppercase text-brand-ash-dark font-bold tracking-widest">Global Rank</span>
            <span className="text-2xl font-mono text-white tracking-tight text-opacity-80">#{Math.floor(400 + (profile?.xp ? 1000000 / profile.xp : 0))}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] uppercase text-brand-ash-dark font-bold tracking-widest">Stability Score</span>
            <span className="text-2xl font-mono text-emerald-500 tracking-tight">98.2%</span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Link to="/tasks" className="px-4 py-2 bg-transparent border border-brand-gold text-brand-gold text-xs font-bold uppercase tracking-widest hover:bg-brand-gold hover:text-brand-black transition-all">
            New Operation +
          </Link>
        </div>
      </header>

      {/* Main Grid */}
      <div className="flex-1 p-8 grid grid-cols-12 gap-6 overflow-hidden">
        {/* Active Grinds Column */}
        <div className="col-span-12 lg:col-span-7 flex flex-col overflow-hidden gap-6">
          <section className="flex flex-col overflow-hidden">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-medium text-white flex items-center gap-2">
                <span className="w-2 h-2 bg-brand-gold rounded-full animate-pulse"></span>
                Active Grinds
              </h2>
              <span className="text-xs text-brand-ash-dark uppercase tracking-widest font-bold">{activeTasks.length} Priority Tasks</span>
            </div>
            
            <div className="space-y-2 overflow-y-auto">
              {activeTasks.length > 0 ? (
                activeTasks.map(task => (
                  <TaskItem 
                    key={task.id} 
                    priority={task.priority} 
                    title={task.title} 
                    meta={`${task.priority.toUpperCase()} PRIORITY // ${task.pointsValue} PTS`} 
                    deadline={new Date(task.dueDate.toDate()).toLocaleDateString()} 
                  />
                ))
              ) : (
                <div className="p-8 border border-dashed border-brand-card bg-brand-surface/50 text-center text-[10px] uppercase font-bold text-brand-ash-dark tracking-widest rounded-xl">
                  Grid Clear // No Active Operations
                </div>
              )}
            </div>
          </section>

          {/* Logs Terminal */}
          <section className="flex-1 min-h-[200px] bg-brand-surface border border-brand-card p-4 rounded flex flex-col overflow-hidden">
            <div className="text-[10px] uppercase font-bold text-brand-ash-dark mb-4 tracking-widest flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
              Recent Transaction Logs
            </div>
            <div className="font-mono text-[11px] space-y-2 opacity-80 overflow-y-auto flex-1 custom-scrollbar">
              {recentLogs.length > 0 ? (
                recentLogs.map(log => (
                  <LogEntry 
                    key={log.id} 
                    time={new Date(log.createdAt?.toDate()).toLocaleTimeString([], { hour12: false })} 
                    type={log.type === 'earn' ? 'OP_COMPLETE' : 'ITEM_ACQUIRE'} 
                    amount={log.type === 'earn' ? `+${log.amount} PTS` : `-${log.amount} PTS`} 
                    positive={log.type === 'earn'} 
                  />
                ))
              ) : (
                <div className="text-brand-ash-dark italic">Scanning signal history...</div>
              )}
              {profile?.streak && profile.streak >= 3 && (
                <div className="flex justify-between border-b border-brand-card pb-1 py-1">
                  <span className="text-brand-ash-dark">SYSTEM</span>
                  <span>STREAK_BONUS_1.5X</span>
                  <span className="text-brand-gold">ACTIVE</span>
                </div>
              )}
            </div>
          </section>
        </div>

        {/* Right Sidebar Column */}
        <div className="col-span-12 lg:col-span-5 flex flex-col gap-6 overflow-hidden">
          {/* Badge Progress */}
          <section className="bg-brand-surface border border-brand-card p-5">
            <h2 className="text-xs font-bold text-brand-gold uppercase tracking-widest mb-6">Badge Progress</h2>
            <div className="grid grid-cols-4 gap-4">
              <Badge icon="🛡️" label="Centurion" active={profile?.xp && profile.xp > 50000} />
              <Badge icon="🔥" label="No Mercy" active={profile?.streak && profile.streak > 7} />
              <Badge icon="👑" label="Point Lord" active={profile?.points && profile.points > 10000} />
              <Badge icon="🌪️" label="Comeback" />
            </div>
          </section>

          {/* Leaderboard Snapshot */}
          <section className="bg-brand-card p-5 border border-brand-gold/30 flex-1 flex flex-col overflow-hidden">
            <h2 className="text-xs font-bold text-white uppercase tracking-widest mb-6 flex justify-between">
              <span>Leaderboard Snapshot</span>
              <span className="text-brand-gold">Global</span>
            </h2>
            <div className="space-y-4 overflow-y-auto flex-1">
              <LeaderboardEntry rank={1} name="ZENITH_MASTER" xp="142k" progress={95} color="bg-red-500" />
              <LeaderboardEntry rank={2} name="CODE_REAPER" xp="121k" progress={88} color="bg-purple-500" />
              <LeaderboardEntry rank={3} name="NULL_PTR" xp="118k" progress={82} color="bg-blue-500" />
              <div className="flex items-center gap-3 p-3 bg-brand-surface rounded outline outline-1 outline-brand-gold">
                <span className="font-mono text-xs text-brand-gold w-4">412</span>
                <div className="w-8 h-8 rounded bg-brand-gold flex-shrink-0 flex items-center justify-center text-brand-black font-bold text-xs uppercase">
                  {profile?.displayName?.charAt(0) || 'Y'}
                </div>
                <div className="flex-1">
                  <div className="text-xs text-white font-medium uppercase">{profile?.displayName?.split(' ')[0] || 'YOU'}</div>
                  <div className="w-full h-1 bg-brand-black mt-1">
                    <div className="h-full bg-brand-gold" style={{ width: `${(profile?.xp || 0) % 1000 / 10}%` }}></div>
                  </div>
                </div>
                <div className="text-[11px] font-mono text-brand-gold">{Math.floor((profile?.xp || 0) / 100) / 10}k</div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

import { useState, useEffect } from 'react';
import { db, Task } from '../lib/firebase';
import { collection, query, where, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { Link } from 'react-router-dom';

const TaskItem = ({ priority, title, meta, deadline }: { key?: any, priority: 'high' | 'medium' | 'low', title: string, meta: string, deadline: string }) => {
  const colors = {
    high: 'border-red-500 text-red-500',
    medium: 'border-brand-gold text-brand-gold',
    low: 'border-brand-ash text-brand-ash'
  };
  return (
    <div className={`bg-brand-surface border-l-2 ${colors[priority]} p-4 flex items-center justify-between group cursor-pointer hover:bg-brand-card transition-colors`}>
      <div>
        <div className="text-[10px] font-mono uppercase mb-1">{meta}</div>
        <div className="text-sm text-white font-medium">{title}</div>
        <div className="text-xs text-brand-ash-dark mt-1">Deadline: {deadline}</div>
      </div>
      <button className="w-8 h-8 rounded border border-brand-card flex items-center justify-center group-hover:border-brand-gold transition-colors">
        <CheckSquare className="w-4 h-4" />
      </button>
    </div>
  );
};

const LogEntry = ({ time, type, amount, positive }: { key?: any, time: string, type: string, amount: string, positive?: boolean }) => (
  <div className="flex justify-between border-b border-brand-card pb-1 py-1">
    <span className="text-brand-ash-dark">{time}</span>
    <span className="text-brand-ash uppercase truncate px-4">{type}</span>
    <span className={positive ? 'text-emerald-500' : 'text-rose-500'}>{amount}</span>
  </div>
);

const Badge = ({ icon, label, active }: { icon: string, label: string, active?: boolean }) => (
  <div className={`flex flex-col items-center gap-2 ${active ? 'opacity-100' : 'opacity-30'}`}>
    <div className={`w-10 h-10 rounded-full border ${active ? 'border-brand-gold' : 'border-brand-card'} flex items-center justify-center text-lg`}>
      {icon}
    </div>
    <span className={`text-[9px] uppercase text-center font-bold ${active ? 'text-white' : 'text-brand-ash-dark'}`}>{label}</span>
  </div>
);

const LeaderboardEntry = ({ rank, name, xp, progress, color }: { rank: number, name: string, xp: string, progress: number, color: string }) => (
  <div className="flex items-center gap-3">
    <span className="font-mono text-xs text-brand-ash-dark w-4">{rank}</span>
    <div className="w-8 h-8 rounded bg-brand-surface border border-brand-card flex-shrink-0 flex items-center justify-center text-[10px] font-bold text-brand-ash-dark uppercase">
      {name.charAt(0)}
    </div>
    <div className="flex-1">
      <div className="text-xs text-brand-ash font-medium uppercase tracking-tighter">{name}</div>
      <div className="w-full h-1 bg-brand-surface mt-1">
        <div className={`h-full ${color}`} style={{ width: `${progress}%` }}></div>
      </div>
    </div>
    <div className="text-[11px] font-mono text-brand-ash-dark">{xp}</div>
  </div>
);

import { CheckSquare } from 'lucide-react';

import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { logout } from '../lib/firebase';
import { 
  LayoutDashboard, 
  CheckSquare, 
  Trophy, 
  User, 
  LogOut, 
  ShoppingCart, 
  Zap, 
  ShieldAlert 
} from 'lucide-react';
import { motion } from 'motion/react';

export const Navigation = () => {
  const { user, profile } = useAuth();
  const location = useLocation();

  if (!user) return null;

  const xpProgress = profile ? (profile.xp % 1000) / 10 : 0;

  return (
    <aside className="w-64 bg-brand-surface border-r border-brand-card flex flex-col h-full shrink-0 overflow-hidden">
      {/* Brand Header */}
      <div className="p-8 border-b border-brand-card flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black tracking-tighter text-brand-gold italic uppercase leading-none">Grindstone</h1>
          <p className="text-[10px] text-brand-ash-dark tracking-[0.2em] uppercase font-bold mt-1">Platform v1.2</p>
        </div>
      </div>

      {/* User Status Area */}
      <div className="p-8 border-b border-brand-card">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand-gold to-brand-gold-dark flex items-center justify-center text-brand-black shadow-lg">
             <User className="w-6 h-6" />
          </div>
          <div className="overflow-hidden">
             <div className="text-sm font-bold text-white truncate uppercase tracking-tighter">{profile?.displayName || 'OPERATIVE'}</div>
             <div className="text-[11px] text-brand-gold font-mono uppercase truncate opacity-80">{profile?.rank}</div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-end">
            <span className="text-[10px] uppercase font-black text-brand-ash-dark tracking-widest">Level {profile?.level}</span>
            <span className="text-[10px] font-mono text-brand-ash-dark">{profile?.xp.toLocaleString()} XP</span>
          </div>
          <div className="h-1 bg-brand-black rounded-full overflow-hidden">
             <motion.div 
               initial={{ width: 0 }}
               animate={{ width: `${xpProgress}%` }}
               className="h-full bg-brand-gold shadow-[0_0_10px_rgba(201,168,76,0.5)]" 
             />
          </div>
        </div>
      </div>

      {/* Main Terminal List */}
      <nav className="flex-1 overflow-y-auto py-4 custom-scrollbar">
        <NavSection label="Mission Control">
           <NavLink to="/dashboard" icon={LayoutDashboard} label="Summary" active={location.pathname === '/dashboard'} />
           <NavLink to="/tasks" icon={CheckSquare} label="Active Ops" active={location.pathname === '/tasks'} />
           <NavLink to="/achievements" icon={Trophy} label="Honors" active={location.pathname === '/achievements'} />
        </NavSection>

        <NavSection label="Eco & Ranks">
           <NavLink to="/leaderboard" icon={Zap} label="Rankings" active={location.pathname === '/leaderboard'} />
           <NavLink to="/store" icon={ShoppingCart} label="The Forge" active={location.pathname === '/store'} />
           <NavLink to="/profile" icon={User} label="Personnel" active={location.pathname === '/profile'} />
        </NavSection>
        
        {profile?.isAdmin && (
          <NavSection label="HQ Access" secret>
             <NavLink to="/admin" icon={ShieldAlert} label="Command Hub" active={location.pathname.startsWith('/admin')} variant="admin" />
          </NavSection>
        )}
      </nav>

      {/* Streak & Auth Footer */}
      <div className="p-8 bg-brand-black/30 border-t border-brand-card">
        <div className="flex items-center justify-between mb-2">
           <div className="text-[10px] uppercase font-black text-brand-ash-dark tracking-[0.2em]">Streak Phase</div>
           <div className="text-brand-gold font-mono text-xs">{profile?.streak}d</div>
        </div>
        <div className="flex gap-1 mb-6">
           {[...Array(7)].map((_, i) => (
             <div 
               key={i} 
               className={`flex-1 h-0.5 ${i < (profile?.streak || 0) % 7 ? 'bg-brand-gold' : 'bg-brand-card'}`} 
             />
           ))}
        </div>

        <button 
          onClick={logout}
          className="w-full h-10 border border-brand-card flex items-center justify-center gap-2 group hover:bg-red-500/10 hover:border-red-500/50 transition-all cursor-pointer"
        >
          <LogOut className="w-3 h-3 text-brand-ash-dark group-hover:text-red-500" />
          <span className="text-[10px] uppercase font-black tracking-widest text-brand-ash-dark group-hover:text-red-500">Sign Out</span>
        </button>
      </div>
    </aside>
  );
};

const NavSection = ({ label, children, secret }: { label: string, children: React.ReactNode, secret?: boolean }) => (
  <div className="mb-6">
    <div className={`px-8 text-[9px] uppercase font-black tracking-[0.3em] mb-3 ${secret ? 'text-red-500/50' : 'text-brand-ash-dark opacity-50'}`}>
       {label}
    </div>
    <div className="flex flex-col">{children}</div>
  </div>
);

const NavLink = ({ to, icon: Icon, label, active, variant }: { to: string, icon: any, label: string, active: boolean, variant?: 'admin' }) => {
  const baseClasses = "flex items-center gap-4 px-8 py-3 transition-colors relative group";
  const activeClasses = variant === 'admin' 
    ? "bg-red-500/5 text-red-500 border-l-2 border-red-500" 
    : "bg-brand-gold/5 text-brand-gold border-l-2 border-brand-gold";
  const inactiveClasses = "text-brand-ash-dark hover:bg-brand-black/20 hover:text-brand-ash";

  return (
    <Link to={to} className={`${baseClasses} ${active ? activeClasses : inactiveClasses}`}>
      <Icon className={`w-4 h-4 ${active ? (variant === 'admin' ? 'text-red-500' : 'text-brand-gold') : 'group-hover:text-brand-ash'}`} />
      <span className="text-[11px] font-bold uppercase tracking-widest">{label}</span>
      {active && !variant && (
        <motion.div layoutId="nav-dot" className="absolute right-6 w-1 h-1 bg-brand-gold rounded-full shadow-[0_0_10px_rgba(201,168,76,1)]" />
      )}
    </Link>
  );
};

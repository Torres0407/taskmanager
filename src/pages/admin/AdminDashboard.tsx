import React from 'react';
import { useAuth } from '../../AuthContext';
import { motion } from 'motion/react';
import { Users, Settings, Database, Activity, ShieldAlert, Terminal } from 'lucide-react';

export default function AdminDashboard() {
  const { profile } = useAuth();

  if (!profile?.isAdmin) return <div className="p-12 text-red-500 font-mono">ACCESS DENIED: ADMIN PRIVILEGES REQUIRED</div>;

  return (
    <div className="flex flex-col h-full bg-brand-black overflow-hidden">
      <header className="h-20 bg-brand-surface border-b border-brand-card flex items-center justify-between px-8 shrink-0">
        <div className="flex items-center gap-4 text-red-500">
          <ShieldAlert className="w-6 h-6" />
          <h1 className="text-2xl font-bold uppercase italic tracking-tighter">HQ Command Center</h1>
        </div>
        <div className="flex items-center gap-2 px-3 py-1 bg-red-500/10 border border-red-500/50 rounded text-[10px] font-bold text-red-500 uppercase tracking-[0.2em]">
          Restricted Zone
        </div>
      </header>

      <div className="flex-1 p-8 grid grid-cols-12 gap-6 overflow-y-auto">
        {/* Admin Quick Stats */}
        <div className="col-span-12 grid grid-cols-1 md:grid-cols-4 gap-6">
          <AdminStatCard icon={Users} label="Active Operatives" value="1,284" delta="+12 today" />
          <AdminStatCard icon={Activity} label="Op Completion Rate" value="76.4%" delta="-2.1%" />
          <AdminStatCard icon={Terminal} label="System Latency" value="14ms" delta="Optimal" />
          <AdminStatCard icon={Database} label="DB Capacity" value="3.2GB" delta="42% used" />
        </div>

        {/* User Management Preview */}
        <div className="col-span-12 lg:col-span-8 bg-brand-surface border border-brand-card rounded-2xl p-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-white font-bold uppercase tracking-widest flex items-center gap-2">
              <Users className="w-5 h-5 text-red-500" />
              Recent Operative Signals
            </h2>
            <button className="text-[10px] uppercase font-bold text-brand-ash-dark hover:text-white transition-colors underline underline-offset-4">View All Registry</button>
          </div>

          <div className="space-y-4">
             <AdminUserRow name="ZENITH_MASTER" status="Active" rank="Legendary" level={38} />
             <AdminUserRow name="CODE_REAPER" status="Suspended" rank="Gold" level={12} warning />
             <AdminUserRow name="NULL_PTR" status="Active" rank="Platinum" level={24} />
             <AdminUserRow name="VOID_WALKER" status="Active" rank="Silver" level={8} />
          </div>
        </div>

        {/* System Logs */}
        <div className="col-span-12 lg:col-span-4 space-y-6">
          <section className="bg-brand-card border border-red-500/20 p-6 rounded-2xl">
            <h2 className="text-xs font-bold text-red-500 uppercase tracking-widest mb-4 flex items-center gap-2">
               <Database className="w-4 h-4" />
               Global Config
            </h2>
            <div className="space-y-4 pt-2">
              <ConfigControl label="Base Multiplier" value="1.0x" />
              <ConfigControl label="Penalty Rate" value="-15 PTS" />
              <ConfigControl label="Streak Threshold" value="3 Days" />
              <button className="w-full mt-4 py-2 bg-red-500/10 border border-red-500 text-red-500 rounded text-[10px] font-bold uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all">
                Push Update to Config
              </button>
            </div>
          </section>

          <section className="bg-brand-surface border border-brand-card p-6 rounded-2xl flex-1">
             <h2 className="text-xs font-bold text-brand-ash-dark uppercase tracking-widest mb-4">Live System Feed</h2>
             <div className="font-mono text-[9px] text-brand-ash-dark space-y-2 opacity-60">
                <div>[13:42:01] Auth sequence verified for user_921</div>
                <div>[13:42:12] Task_ID_288 status -&gt; COMPLETE</div>
                <div>[13:43:08] Point distribution synchronized</div>
                <div className="animate-pulse text-red-500/50">[PENDING] Database maintenance scheduled in 42m</div>
             </div>
          </section>
        </div>
      </div>
    </div>
  );
}

const AdminStatCard = ({ icon: Icon, label, value, delta }: { icon: any, label: string, value: string, delta: string }) => (
  <div className="bg-brand-surface border border-brand-card p-6 rounded-xl relative overflow-hidden group">
    <Icon className="w-12 h-12 absolute -right-2 -top-2 text-brand-card transition-colors group-hover:text-red-500/10" />
    <div className="text-[10px] uppercase font-bold text-brand-ash-dark tracking-widest mb-4">{label}</div>
    <div className="text-3xl font-mono text-white mb-1">{value}</div>
    <div className={`text-[10px] font-bold uppercase ${delta.includes('+') ? 'text-emerald-500' : 'text-brand-ash-dark opacity-50'}`}>{delta}</div>
  </div>
);

const AdminUserRow = ({ name, status, rank, level, warning }: { name: string, status: string, rank: string, level: number, warning?: boolean }) => (
  <div className="flex items-center justify-between p-4 bg-brand-black/50 border border-brand-card rounded-xl">
    <div className="flex items-center gap-4">
       <div className={`w-8 h-8 rounded border ${warning ? 'border-red-500' : 'border-brand-card'} flex items-center justify-center text-xs font-bold text-brand-ash-dark`}>
          {name.charAt(0)}
       </div>
       <div>
          <div className="text-sm font-bold text-white uppercase">{name}</div>
          <div className="text-[10px] text-brand-ash-dark uppercase font-mono">{rank} // Lv {level}</div>
       </div>
    </div>
    <div className="flex items-center gap-6">
       <div className={`text-[9px] font-bold uppercase px-3 py-1 rounded-full border ${warning ? 'bg-red-500/10 border-red-500 text-red-500' : 'bg-brand-card border-brand-card text-brand-ash-dark'}`}>
          {status}
       </div>
       <button className="text-brand-ash-dark hover:text-white"><Settings className="w-4 h-4" /></button>
    </div>
  </div>
);

const ConfigControl = ({ label, value }: { label: string, value: string }) => (
  <div className="flex justify-between items-center py-2 border-b border-brand-card last:border-0">
    <span className="text-[10px] uppercase font-bold text-brand-ash-dark">{label}</span>
    <span className="text-xs font-mono text-white bg-brand-black px-2 py-0.5 rounded border border-brand-card">{value}</span>
  </div>
);

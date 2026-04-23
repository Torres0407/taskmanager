import React from 'react';
import { useAuth } from '../AuthContext';
import { motion } from 'motion/react';
import { User, Shield, Target, Award, Calendar } from 'lucide-react';

export default function Profile() {
  const { profile } = useAuth();

  if (!profile) return null;

  return (
    <div className="flex flex-col h-full bg-brand-black overflow-y-auto">
      {/* Hero Section */}
      <div className="h-64 bg-brand-surface relative shrink-0 border-b border-brand-card">
        <div className="absolute inset-0 bg-gradient-to-t from-brand-black to-transparent opacity-50" />
        <div className="absolute bottom-0 left-0 p-12 flex items-end gap-8 translate-y-12">
          <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-brand-gold to-brand-gold-dark border-4 border-brand-black shadow-2xl flex items-center justify-center text-4xl font-bold text-brand-black uppercase">
             {profile.displayName?.charAt(0)}
          </div>
          <div className="pb-4">
            <div className="flex items-center gap-4 mb-2">
              <h1 className="text-4xl font-bold text-white italic">{profile.displayName}</h1>
              {profile.isAdmin && (
                <div className="bg-red-500/10 border border-red-500/50 text-red-500 px-3 py-1 rounded text-[10px] font-bold uppercase tracking-widest flex items-center gap-2">
                  <Shield className="w-3 h-3" /> Command Center Access
                </div>
              )}
            </div>
            <div className="text-brand-gold font-mono uppercase tracking-[0.2em]">{profile.rank} Operative // Lv {profile.level}</div>
          </div>
        </div>
      </div>

      {/* Stats Content */}
      <div className="pt-24 p-12 grid grid-cols-12 gap-8">
        <div className="col-span-12 lg:col-span-8 space-y-8">
          {/* Progression Details */}
          <section className="bg-brand-surface border border-brand-card p-8 rounded-2xl">
            <h2 className="text-xs uppercase tracking-[0.3em] text-brand-ash-dark font-bold mb-8 flex items-center gap-3">
              <Target className="w-4 h-4 text-brand-gold" />
              Progression Matrix
            </h2>
            
            <div className="space-y-6">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-brand-ash font-medium uppercase tracking-widest">Experience Points (XP)</span>
                  <span className="text-brand-gold font-mono">{profile.xp} / {(profile.level || 1) * 1000}</span>
                </div>
                <div className="h-2 bg-brand-card rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: "84%" }} 
                    className="h-full bg-brand-gold" 
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-8 pt-4">
                <ProfileStat icon={Award} label="Lifetime Points" value={profile.xp.toLocaleString()} />
                <ProfileStat icon={Calendar} label="Current Streak" value={`${profile.streak} Days`} />
                <ProfileStat icon={Target} label="Level Offset" value={`+${profile.level}`} />
              </div>
            </div>
          </section>

          {/* Rank Tiers Legend */}
          <section className="bg-brand-surface border border-brand-card p-8 rounded-2xl">
            <h2 className="text-xs uppercase tracking-[0.3em] text-brand-ash-dark font-bold mb-8 flex items-center gap-3">
              <Award className="w-4 h-4 text-brand-gold" />
              Rank Tiers
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <RankTier color="#7C4A1E" name="Bronze" active={profile.rank === 'Bronze'} />
              <RankTier color="#7A8A8A" name="Silver" active={profile.rank === 'Silver'} />
              <RankTier color="#C9A84C" name="Gold" active={profile.rank === 'Gold'} />
              <RankTier color="#40C0E0" name="Platinum" active={profile.rank === 'Platinum'} />
              <RankTier color="#A855F7" name="Diamond" active={profile.rank === 'Diamond'} />
              <RankTier color="#EF4444" name="Legendary" active={profile.rank === 'Legendary'} />
            </div>
          </section>
        </div>

        <div className="col-span-12 lg:col-span-4 space-y-8">
           <section className="bg-brand-card border border-brand-gold/20 p-8 rounded-2xl">
            <h2 className="text-xs uppercase tracking-[0.3em] text-white font-bold mb-6">Status Info</h2>
            <div className="space-y-4">
              <InfoRow label="Personnel ID" value={profile.uid.slice(0, 8).toUpperCase()} />
              <InfoRow label="Comms link" value={profile.email} />
              <InfoRow label="Deployment" value={profile.createdAt?.toDate().toLocaleDateString()} />
              <InfoRow label="Last Signal" value={profile.lastActivityAt?.toDate().toLocaleDateString()} />
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

const ProfileStat = ({ icon: Icon, label, value }: { icon: any, label: string, value: string }) => (
  <div className="flex flex-col">
    <div className="flex items-center gap-2 text-[10px] uppercase font-bold text-brand-ash-dark mb-1">
      <Icon className="w-3 h-3 text-brand-gold" />
      {label}
    </div>
    <div className="text-xl font-mono text-white">{value}</div>
  </div>
);

const RankTier = ({ color, name, active }: { color: string, name: string, active: boolean }) => (
  <div className={`p-3 rounded-lg border flex items-center gap-3 transition-all ${active ? 'bg-brand-card border-brand-gold shadow-[0_0_15px_rgba(201,168,76,0.15)]' : 'border-brand-card/50 opacity-40'}`}>
    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} />
    <span className={`text-xs uppercase font-bold tracking-widest ${active ? 'text-white' : 'text-brand-ash-dark'}`}>{name}</span>
  </div>
);

const InfoRow = ({ label, value }: { label: string, value: any }) => (
  <div className="flex flex-col border-b border-brand-card pb-3 last:border-0 last:pb-0">
    <div className="text-[10px] uppercase tracking-widest text-brand-ash-dark font-bold mb-1">{label}</div>
    <div className="text-xs text-brand-ash truncate font-mono">{value}</div>
  </div>
);

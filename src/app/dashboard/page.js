'use client';

import { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  Wallet, 
  Users, 
  Activity,
  ArrowUpRight,
  Zap,
  Globe,
  Radio,
  History as HistoryIcon,
  CheckCircle2
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function DashboardPage() {
  const [stats, setStats] = useState(null);
  const [recentTxs, setRecentTxs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, userRes, txRes] = await Promise.all([
          fetch('/api/stats'),
          fetch('/api/auth/me'),
          fetch('/api/transactions?limit=5')
        ]);
        
        if (statsRes.ok) setStats(await statsRes.json());
        if (userRes.ok) setUser(await userRes.json());
        if (txRes.ok) setRecentTxs(await txRes.json());
      } catch (err) {
        console.error('Error fetching dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="relative size-12">
          <div className="absolute inset-0 border-2 border-makuoze-red/20 rounded-full" />
          <div className="absolute inset-0 border-t-2 border-makuoze-red rounded-full animate-spin" />
        </div>
        <p className="text-zinc-600 text-[10px] font-black uppercase tracking-[0.3em] animate-pulse">Syncing Database...</p>
      </div>
    );
  }

  const statCards = [
    { 
      label: 'Network Volume', 
      value: `${stats?.total_volume || 0}`, 
      suffix: 'SOL',
      icon: Radio, 
      color: 'text-zinc-100',
      glow: 'shadow-[0_0_20px_rgba(255,255,255,0.05)]'
    },
    { 
      label: 'Personal Share', 
      value: `${stats?.personal_earnings || 0}`, 
      suffix: 'SOL',
      icon: Zap, 
      color: 'text-makuoze-red-light',
      glow: 'shadow-[0_0_20px_rgba(177,0,0,0.15)]'
    },
    { 
      label: 'Passive Bonus', 
      value: `${stats?.sub_affiliate_earnings || 0}`, 
      suffix: 'SOL',
      icon: Globe, 
      color: 'text-zinc-400',
      glow: 'shadow-[0_0_20px_rgba(255,255,255,0.05)]'
    },
  ];

  return (
    <div className="space-y-10">
      {/* Header with Pulse */}
      <motion.header 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-3xl font-black uppercase italic tracking-tighter">
              Terminal <span className="text-makuoze-red">Active</span>
            </h1>
            <div className="size-2 bg-makuoze-red rounded-full animate-pulse shadow-[0_0_8px_#b10000]" />
          </div>
          <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest">
            Operator: <span className="text-white">{user?.affiliate_name}</span>
          </p>
        </div>
        
        <div className="hidden md:flex flex-col items-end">
          <span className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">Network Status</span>
          <span className="text-xs font-bold text-emerald-500 flex items-center gap-1">
            <div className="size-1.5 bg-emerald-500 rounded-full" /> Encrypted Line
          </span>
        </div>
      </motion.header>

      {/* Main Stats Tiles */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {statCards.map((card, i) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className={`glass-panel p-8 rounded-[2rem] group hover:scale-[1.02] transition-all relative overflow-hidden ${card.glow}`}
          >
            {/* Top Icon */}
            <div className={`size-10 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center mb-6 group-hover:border-makuoze-red/30 transition-colors ${card.color}`}>
              <card.icon size={20} />
            </div>

            <h3 className="text-zinc-500 text-[10px] font-black uppercase tracking-widest mb-1">{card.label}</h3>
            <div className="flex items-baseline gap-2">
              <p className="text-3xl font-black text-white italic tracking-tighter">{card.value}</p>
              <span className="text-xs font-black text-makuoze-red italic">{card.suffix}</span>
            </div>

            {/* Background Texture Detail */}
            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-all">
              <card.icon size={80} />
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Last Transactions List */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="glass-panel rounded-[2.5rem] p-8 border-white/5"
        >
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="size-8 rounded-lg bg-makuoze-red/10 border border-makuoze-red/20 flex items-center justify-center">
                <HistoryIcon className="text-makuoze-red size-4" />
              </div>
              <h3 className="font-black uppercase italic tracking-tighter text-lg">Last Transactions</h3>
            </div>
            <div className="flex items-center gap-3">
              <a 
                href="/dashboard/transactions" 
                className="text-[10px] font-black text-makuoze-red hover:text-white transition-colors uppercase tracking-widest bg-white/5 px-3 py-1 rounded-full border border-white/5 active:scale-95 transition-all"
              >
                View All
              </a>
              <div className="text-[10px] font-black text-zinc-600 bg-white/5 px-3 py-1 rounded-full border border-white/5 uppercase tracking-widest">
                Live Feed
              </div>
            </div>
          </div>
          
          <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
            {recentTxs.map((tx, i) => (
              <motion.div 
                key={tx._id} 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + (i * 0.05) }}
                className="glass-card p-5 rounded-2xl flex items-center justify-between group"
              >
                <div className="flex items-center gap-4">
                  <div className="size-10 rounded-xl bg-black border border-white/5 flex items-center justify-center font-black text-zinc-700 group-hover:text-makuoze-red transition-colors text-[10px]">
                    {new Date(tx.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}
                  </div>
                  <div>
                    <div className="font-black text-sm uppercase tracking-tight group-hover:text-white transition-colors">{tx.payer_name}</div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className={`text-[9px] font-black px-1.5 py-0.5 rounded bg-zinc-900 text-zinc-500 uppercase tracking-tighter border border-white/5`}>
                        {tx.payer_type.replace('_', ' ')}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1.5 text-emerald-500 text-[9px] font-black uppercase tracking-widest mb-1">
                    <CheckCircle2 size={10} /> Confirmed
                  </div>
                  <div className="font-black text-white italic tracking-tighter">
                    {tx.total_sol} <span className="text-makuoze-red text-[10px]">SOL</span>
                  </div>
                </div>
              </motion.div>
            ))}
            {recentTxs.length === 0 && (
              <div className="text-center py-12">
                <Activity size={32} className="mx-auto text-zinc-800 mb-4" />
                <p className="text-zinc-600 font-bold uppercase tracking-widest text-[10px]">No transmissions detected.</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

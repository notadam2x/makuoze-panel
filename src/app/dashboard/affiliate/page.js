'use client';

import { useState, useEffect } from 'react';
import {
  Users,
  UserPlus,
  TrendingUp,
  Award,
  Link as LinkIcon,
  Copy,
  CheckCircle2,
  Activity,
  ArrowUpRight,
  X,
  Zap,
  MessageSquare,
  ShieldCheck,
  TrendingUp as ProfitIcon
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AffiliatePage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [showScaleModal, setShowScaleModal] = useState(false);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch('/api/stats');
        if (res.ok) setStats(await res.json());
      } catch (err) {
        console.error('Error fetching affiliate stats');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const handleCopy = () => {
    // Mock referral link for UI completeness
    navigator.clipboard.writeText('https://makuoze-drainer.app/join/partner-123');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="relative size-12">
          <div className="absolute inset-0 border-2 border-makuoze-red/20 rounded-full" />
          <div className="absolute inset-0 border-t-2 border-makuoze-red rounded-full animate-spin" />
        </div>
        <p className="text-zinc-600 text-[10px] font-black uppercase tracking-[0.3em] animate-pulse">Scanning Network Tiers...</p>
      </div>
    );
  }

  // Filter actual sub-affiliate payers from the DB
  const subAffiliates = stats?.vol_by_contract?.filter(item => item.type === 'sub_affiliate') || [];

  return (
    <div className="space-y-10 pb-12">
      <motion.header
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex flex-col md:flex-row md:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-[var(--header-fluid-h1)] font-black uppercase italic tracking-tighter flex items-center gap-3">
            Affiliate <span className="text-makuoze-red">Network</span>
          </h1>
          <p className="text-zinc-500 text-[10px] sm:text-xs font-bold uppercase tracking-widest mt-1">Manage and monitor your sub-affiliate extractions.</p>
        </div>
      </motion.header>

      {/* Network Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Affiliate Growth / CTA Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative rounded-[2.5rem] overflow-hidden group min-h-[220px]"
        >
          {/* Background Industrial Texture */}
          <div className="absolute inset-0 bg-makuoze-gradient opacity-90" />
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20" />

          <div className="relative z-10 p-6 sm:p-8 h-full flex flex-col justify-between">
            <div>
              <Users className="size-8 sm:size-10 text-white/40 mb-4" />
              <h3 className="text-xl sm:text-2xl font-black text-white uppercase italic tracking-tighter mb-2 leading-tight">
                Expand Your <br /> <span className="text-white/40">Network</span>
              </h3>
              <p className="text-white/60 text-[9px] sm:text-[10px] font-bold leading-relaxed max-w-[200px] sm:max-w-[240px] uppercase">
                Recruit operators and secure <span className="text-makuoze-red-light">20% Passive Extractions</span>.
              </p>
            </div>

            <button 
              onClick={() => setShowScaleModal(true)}
              className="flex items-center gap-3 mt-6 bg-black text-white px-6 py-3 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] hover:gap-5 transition-all w-fit group/btn"
            >
              Scale Now <ArrowUpRight className="size-3 text-makuoze-red-light group-hover/btn:rotate-45 transition-transform" />
            </button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="glass-panel p-8 rounded-[2.5rem] border-white/5 flex flex-col justify-between"
        >
          <div className="space-y-1">
            <h3 className="text-zinc-500 text-[10px] font-black uppercase tracking-widest">Passive Extractions</h3>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-black italic tracking-tighter text-white">{stats?.sub_affiliate_earnings || 0}</span>
              <span className="text-makuoze-red text-xs font-black italic uppercase">SOL</span>
            </div>
          </div>

          <div className="mt-8 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users size={16} className="text-zinc-500" />
              <span className="text-xs font-black uppercase tracking-widest text-zinc-400">Payer Nodes: {subAffiliates.length}</span>
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp size={16} className="text-emerald-500" />
              <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500">Live Sync</span>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Active Sub-Affiliate Payer Nodes */}
        <section className="glass-panel p-8 rounded-[2.5rem]">
          <h3 className="text-lg font-black uppercase italic tracking-tighter mb-8 flex items-center gap-3">
            <div className="size-2 bg-makuoze-red rounded-full" /> Network Nodes
          </h3>

          <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
            {subAffiliates.map((item, i) => (
              <div key={item.name} className="glass-card p-5 rounded-2xl flex items-center justify-between group">
                <div className="flex items-center gap-4">
                  <div className="size-10 rounded-xl bg-black border border-white/5 flex items-center justify-center font-black text-zinc-700 group-hover:text-makuoze-red transition-colors text-xs uppercase italic">
                    {i + 1}
                  </div>
                  <div>
                    <div className="font-black text-sm uppercase tracking-tight group-hover:text-white transition-colors">{item.name}</div>
                    <div className="text-[9px] font-black text-zinc-600 uppercase tracking-widest italic">SUB-AFFILIATE STREAM</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest mb-0.5">Contribution</div>
                  <div className="font-black text-white italic tracking-tighter">
                    {item.volume} <span className="text-makuoze-red text-[10px]">SOL</span>
                  </div>
                </div>
              </div>
            ))}
            {subAffiliates.length === 0 && (
              <div className="text-center py-16">
                <Activity size={32} className="mx-auto text-zinc-800 mb-4" />
                <p className="text-zinc-700 font-bold uppercase tracking-widest text-[9px]">No sub-affiliate nodes detected.</p>
              </div>
            )}
          </div>
        </section>

        {/* Recruitment Hub */}
        <section className="glass-panel p-10 rounded-[2.5rem] bg-gradient-to-br from-makuoze-red/5 to-transparent flex flex-col justify-center border-makuoze-red/10">
          <UserPlus size={40} className="text-makuoze-red mb-8" />
          <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter mb-4 leading-none">Recruit <br /> <span className="text-zinc-600">New Operators</span></h3>
          <p className="text-zinc-500 text-xs font-bold leading-relaxed mb-8 max-w-[300px]">
            Expand your extraction network by inviting new partners. Contact admin for custom tier upgrades.
          </p>

          <div className="relative group">
            <div className="absolute -inset-0.5 bg-makuoze-gradient rounded-2xl opacity-20 group-hover:opacity-40 transition-all blur-[2px]" />
            <div className="relative bg-black rounded-2xl p-1 flex items-center justify-between border border-white/10">
              <div className="pl-4 py-3 flex items-center gap-3 overflow-hidden">
                <LinkIcon size={14} className="text-zinc-600 flex-shrink-0" />
                <span className="text-[9px] font-mono font-bold text-zinc-400 truncate tracking-tight uppercase">Invitation Link Locked</span>
              </div>
              <button
                onClick={handleCopy}
                disabled
                className="bg-zinc-900 text-zinc-700 p-3 rounded-xl border border-white/5 opacity-50 cursor-not-allowed"
              >
                <Copy size={16} />
              </button>
            </div>
          </div>
        </section>
      </div>

      {/* Scale Protocol Modal */}
      <AnimatePresence>
        {showScaleModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowScaleModal(false)}
              className="absolute inset-0 bg-black/90 backdrop-blur-md"
            />
            
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-lg glass-panel p-6 sm:p-10 rounded-[3rem] border-makuoze-red/20 shadow-[0_0_50px_rgba(177,0,0,0.15)] overflow-hidden"
            >
              {/* Background Detail */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-makuoze-gradient" />
              <Zap className="absolute -bottom-10 -right-10 size-60 text-makuoze-red/[0.03] rotate-12" />

              <button 
                onClick={() => setShowScaleModal(false)}
                className="absolute top-6 right-6 p-2 text-zinc-600 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>

              <div className="space-y-10 relative z-10">
                <div className="flex items-center gap-4">
                  <div className="size-14 rounded-2xl bg-makuoze-red/10 border border-makuoze-red/20 flex items-center justify-center text-makuoze-red shadow-[0_0_20px_rgba(177,0,0,0.2)]">
                    <ProfitIcon size={28} />
                  </div>
                  <div>
                    <h2 className="text-xl sm:text-2xl font-black uppercase italic tracking-tighter text-white leading-tight">Sub-Affiliate <br className="block sm:hidden" /> <span className="text-makuoze-red">Protocol</span></h2>
                  </div>
                </div>

                <div className="space-y-6">
                  <p className="text-zinc-400 text-sm font-bold leading-relaxed">
                    Build your own operator sub-network via Makuoze and secure <span className="text-white italic">unlimited passive income</span> for as long as they are active.
                  </p>
                  
                  <div className="grid grid-cols-1 gap-4">
                    <div className="glass-card p-6 rounded-2xl border-white/5 bg-white/[0.02]">
                      <div className="flex items-start gap-4">
                        <div className="size-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-500 mt-1">
                          <CheckCircle2 size={18} />
                        </div>
                        <div>
                          <h4 className="text-xs font-black text-white uppercase tracking-widest mb-1">50% Partner Share</h4>
                          <p className="text-[10px] text-zinc-500 font-bold leading-relaxed uppercase">
                            Every operator you recruit joins the system with a 50% payout share.
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="glass-card p-6 rounded-2xl border-emerald-500/10 bg-emerald-500/[0.03]">
                      <div className="flex items-start gap-4">
                        <div className="size-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-500 mt-1">
                          <ShieldCheck size={18} />
                        </div>
                        <div>
                          <h4 className="text-xs font-black text-emerald-500 uppercase tracking-widest mb-1">20% Passive Profit</h4>
                          <p className="text-[10px] text-zinc-400 font-bold leading-relaxed uppercase">
                            As long as your partners are active, <span className="text-white">20% of their Total Volume</span> is credited directly to your account.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4 pt-4">
                  <a 
                    href="https://t.me/okx_development"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full bg-makuoze-gradient text-white font-black uppercase tracking-[0.2em] text-xs py-5 rounded-2xl transition-all shadow-[0_10px_30px_rgba(177,0,0,0.25)] hover:shadow-[0_15px_40px_rgba(177,0,0,0.4)] flex items-center justify-center gap-3 active:scale-[0.98]"
                  >
                    <MessageSquare size={18} /> Initialize Setup & Get Access
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

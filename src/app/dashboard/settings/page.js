'use client';

import { useState, useEffect } from 'react';
import { 
  Wallet, 
  Bot,
  Save,
  CheckCircle2,
  AlertCircle,
  Cpu,
  ArrowRightLeft
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function SettingsPage() {
  const [bots, setBots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState({ type: '', text: '' });
  
  // Wallet state mapping: botId -> newWalletAddress
  const [walletDrafts, setWalletDrafts] = useState({});
  const [walletLoading, setWalletLoading] = useState({});

  useEffect(() => {
    const fetchBots = async () => {
      try {
        const res = await fetch('/api/config');
        if (res.ok) {
          const data = await res.json();
          setBots(data);
          // Initialize drafts with current wallets
          const drafts = {};
          data.forEach(bot => {
            const currentWallet = bot.payer_type === 'affiliate_own' ? bot.wallet1 : bot.wallet2;
            drafts[bot.id] = currentWallet;
          });
          setWalletDrafts(drafts);
        }
      } catch (err) {
        console.error('Error fetching bots');
      } finally {
        setLoading(false);
      }
    };

    fetchBots();
  }, []);

  const handleWalletUpdate = async (botId) => {
    setWalletLoading(prev => ({ ...prev, [botId]: true }));
    setMsg({ type: '', text: '' });

    try {
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'update_wallet',
          payerId: botId,
          newWalletAddress: walletDrafts[botId]
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setMsg({ type: 'success', text: `Wallet re-routed: ${data.address.slice(0, 8)}...` });
        setBots(prev => prev.map(b => b.id === botId ? { ...b, [data.field]: data.address } : b));
      } else {
        setMsg({ type: 'error', text: data.error });
      }
    } catch (err) {
      setMsg({ type: 'error', text: 'Transmission error.' });
    } finally {
      setWalletLoading(prev => ({ ...prev, [botId]: false }));
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="relative size-12">
          <div className="absolute inset-0 border-2 border-makuoze-red/20 rounded-full" />
          <div className="absolute inset-0 border-t-2 border-makuoze-red rounded-full animate-spin" />
        </div>
        <p className="text-zinc-600 text-[10px] font-black uppercase tracking-[0.3em] animate-pulse">Scanning Nodes...</p>
      </div>
    );
  }

  return (
    <div className="space-y-10 pb-12">
      <motion.header 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex flex-col md:flex-row md:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-[var(--header-fluid-h1)] font-black uppercase italic tracking-tighter text-white">
            Wallets <span className="text-makuoze-red">Configuration</span>
          </h1>
          <p className="text-zinc-500 text-[10px] sm:text-xs font-bold uppercase tracking-widest mt-1">Configure your payout addresses for each node.</p>
        </div>
      </motion.header>

      {/* Global Message Banner */}
      <AnimatePresence>
        {msg.text && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className={`p-5 rounded-[1.5rem] border flex items-center gap-4 ${
              msg.type === 'success' 
                ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' 
                : 'bg-makuoze-red/10 border-makuoze-red/20 text-makuoze-red-light'
            }`}
          >
            {msg.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
            <span className="text-xs font-black uppercase tracking-widest">{msg.text}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-4xl mx-auto w-full">
        {/* Payout Channels Section */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-panel mobile-optimal-p rounded-[3rem]"
        >
          <div className="flex items-center gap-4 mb-10">
            <div className="size-14 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center text-zinc-300 shadow-[0_0_20px_rgba(255,255,255,0.05)]">
              <Cpu size={28} />
            </div>
            <div>
              <h2 className="text-2xl font-black uppercase italic tracking-tighter text-white">Target Payout Nodes</h2>
              <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">Update your share distribution addresses.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {bots.map((bot) => (
              <div key={bot.id} className="glass-card p-5 sm:p-8 rounded-[2rem] border-white/5 group relative overflow-hidden">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <span className="font-black text-sm uppercase italic tracking-tight text-white group-hover:text-makuoze-red transition-colors">{bot.name}</span>
                  </div>
                  <span className="text-[9px] font-black px-2 py-0.5 rounded bg-zinc-900 text-zinc-600 uppercase tracking-tighter border border-white/5">
                    {bot.payer_type.replace('_', ' ')}
                  </span>
                </div>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-[9px] font-black text-zinc-700 uppercase tracking-widest ml-1">TRX_TARGET_PATH</label>
                    <input 
                      type="text"
                      value={walletDrafts[bot.id] || ''}
                      onChange={e => setWalletDrafts({...walletDrafts, [bot.id]: e.target.value})}
                      placeholder="Solana Address"
                      className="w-full bg-black/60 border border-white/5 rounded-2xl px-5 py-4 focus:outline-none focus:ring-1 focus:ring-makuoze-red/30 transition-all text-[11px] font-mono font-bold text-zinc-400 placeholder:text-zinc-800"
                    />
                  </div>
                  <button
                    onClick={() => handleWalletUpdate(bot.id)}
                    disabled={walletLoading[bot.id]}
                    className="w-full bg-makuoze-gradient text-white text-[10px] font-black uppercase tracking-[0.2em] py-4 rounded-2xl flex items-center justify-center gap-2 transition-all shadow-[0_4px_15px_rgba(177,0,0,0.2)] disabled:opacity-50 active:scale-[0.98]"
                  >
                    <ArrowRightLeft size={16} className={walletLoading[bot.id] ? 'animate-spin' : ''} />
                    {walletLoading[bot.id] ? 'RE-ROUTING...' : 'SYNC CONFIG'}
                  </button>
                </div>

                <div className="mt-6 flex items-center gap-2 opacity-30 group-hover:opacity-60 transition-opacity">
                  <div className="size-1.5 bg-makuoze-red rounded-full" />
                  <p className="text-[8px] font-black text-zinc-500 uppercase tracking-widest italic leading-none">
                    MOD NODE {bot.payer_type === 'affiliate_own' ? '50%' : '25%'} SHARE_PATH
                  </p>
                </div>
              </div>
            ))}
          </div>

          {bots.length === 0 && (
            <div className="text-center py-24 bg-black/40 rounded-[2rem] border border-dashed border-white/5">
              <Wallet size={48} className="mx-auto text-zinc-900 mb-6" />
              <h3 className="font-black uppercase italic tracking-tighter text-zinc-600 text-xl">Nodes Offline</h3>
              <p className="text-zinc-700 text-[10px] font-bold uppercase tracking-widest mt-2">Connect extraction nodes to begin configuration.</p>
            </div>
          )}
        </motion.section>
      </div>
    </div>
  );
}

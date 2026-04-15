'use client';

import { useState, useEffect } from 'react';
import { 
  History, 
  ArrowUpRight, 
  Search,
  CheckCircle2,
  Filter,
  ArrowRightLeft,
  Calendar
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function TransactionsPage() {
  const [txs, setTxs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchTxs = async () => {
      try {
        const res = await fetch('/api/transactions?limit=50');
        if (res.ok) setTxs(await res.json());
      } catch (err) {
        console.error('Error fetching transactions');
      } finally {
        setLoading(false);
      }
    };

    fetchTxs();
  }, []);

  const filteredTxs = txs.filter(tx => 
    tx.payer_name.toLowerCase().includes(search.toLowerCase()) ||
    tx.affiliate_name.toLowerCase().includes(search.toLowerCase())
  );

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return {
      day: date.toLocaleDateString('en-US', { day: '2-digit', month: 'short' }),
      time: date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })
    };
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="relative size-12">
          <div className="absolute inset-0 border-2 border-makuoze-red/20 rounded-full" />
          <div className="absolute inset-0 border-t-2 border-makuoze-red rounded-full animate-spin" />
        </div>
        <p className="text-zinc-600 text-[10px] font-black uppercase tracking-[0.3em] animate-pulse">Scanning Network History...</p>
      </div>
    );
  }

  return (
    <div className="space-y-10 pb-12">
      <motion.header 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex flex-col md:flex-row md:items-center justify-between gap-6"
      >
        <div>
          <h1 className="text-[var(--header-fluid-h1)] font-black uppercase italic tracking-tighter flex items-center gap-3 text-white">
            Exploit <span className="text-makuoze-red">Logs</span>
            <div className="text-[10px] font-black bg-zinc-900 px-2 py-1 rounded border border-white/5 text-zinc-500 not-italic">V2.4</div>
          </h1>
          <p className="text-zinc-500 text-[10px] sm:text-xs font-bold uppercase tracking-widest mt-1">Real-time split transmission records.</p>
        </div>

        <div className="relative group w-full md:w-80">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-zinc-600 group-focus-within:text-makuoze-red transition-colors" />
          <input
            type="text"
            placeholder="FILTER BY STREAM NAME..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-zinc-900/50 border border-white/5 rounded-2xl pl-12 pr-4 py-4 focus:outline-none focus:ring-1 focus:ring-makuoze-red/50 transition-all text-[10px] font-black tracking-widest uppercase placeholder:text-zinc-700"
          />
        </div>
      </motion.header>

      {/* Mobile-First Transaction Feed */}
      <div className="grid grid-cols-1 gap-4">
        <AnimatePresence mode="popLayout">
          {filteredTxs.map((tx, i) => {
            const date = formatDate(tx.timestamp);
            return (
              <motion.div
                key={tx._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
                className="glass-panel group overflow-hidden rounded-[2rem] hover:border-makuoze-red/30 transition-all active:scale-[0.98]"
              >
                <div className="p-6 flex items-center justify-between gap-4">
                  {/* Left: Icon & Name */}
                  <div className="flex items-center gap-5">
                    <div className="size-12 sm:size-14 rounded-2xl bg-black border border-white/5 flex flex-col items-center justify-center group-hover:border-makuoze-red/40 transition-colors">
                      <span className="text-[9px] sm:text-[10px] font-black text-makuoze-red leading-none">{date.day}</span>
                      <span className="text-[9px] sm:text-[10px] font-black text-zinc-600 mt-1 leading-none">{date.time}</span>
                    </div>
                    
                    <div>
                      <h4 className="font-black text-lg uppercase italic tracking-tighter group-hover:text-white transition-colors">{tx.payer_name}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`text-[9px] font-black px-1.5 py-0.5 rounded uppercase tracking-tighter border ${
                          tx.payer_type === 'affiliate_own' 
                            ? 'bg-blue-500/10 border-blue-500/20 text-blue-400' 
                            : 'bg-purple-500/10 border-purple-500/20 text-purple-400'
                        }`}>
                          {tx.payer_type.replace('_', ' ')}
                        </span>
                        <span className="hidden sm:block text-[9px] font-black text-zinc-600 uppercase tracking-widest">SPLIT_TRANS_ID: {tx._id.slice(-6).toUpperCase()}</span>
                      </div>
                    </div>
                  </div>

                  {/* Right: Amount & Status */}
                  <div className="text-right flex flex-col items-end gap-1">
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-xl font-black italic text-white tracking-tighter">{tx.total_sol}</span>
                      <span className="text-makuoze-red text-[10px] font-black italic">SOL</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-emerald-500 text-[10px] font-black uppercase tracking-widest">
                      <CheckCircle2 size={12} strokeWidth={3} />
                      <span>Confirmed</span>
                    </div>
                    
                    <button className="mt-2 text-zinc-700 hover:text-white transition-colors">
                      <ArrowRightLeft size={16} />
                    </button>
                  </div>
                </div>

                {/* Bottom Detail Strip - Desktop Only */}
                <div className="hidden sm:flex bg-white/[0.02] px-6 py-2 border-t border-white/5 items-center justify-between text-[8px] font-black text-zinc-700 uppercase tracking-[0.2em]">
                  <span>NET_REVENUE_EXTRACTED</span>
                  <span className="text-zinc-500">NETWORK_TAG: {tx.affiliate_name}</span>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {filteredTxs.length === 0 && (
          <div className="py-24 text-center">
            <History size={48} className="mx-auto text-zinc-900 mb-6" />
            <h3 className="font-black uppercase italic tracking-tighter text-zinc-600 text-xl">Logs Empty</h3>
            <p className="text-zinc-700 text-[10px] font-bold uppercase tracking-widest mt-2">Zero matching transmissions found in this sector.</p>
          </div>
        )}
      </div>
    </div>
  );
}

'use client';

import { useState } from 'react';
import { 
  Shield, 
  Lock, 
  CheckCircle2,
  AlertCircle,
  Fingerprint,
  KeyRound
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AccountPage() {
  const [msg, setMsg] = useState({ type: '', text: '' });
  const [pwdState, setPwdState] = useState({ current: '', next: '', confirm: '' });
  const [pwdLoading, setPwdLoading] = useState(false);

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (pwdState.next !== pwdState.confirm) {
        setMsg({ type: 'error', text: 'New passwords do not match.' });
        return;
    }
    setPwdLoading(true);
    setMsg({ type: '', text: '' });

    try {
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'update_password',
          currentPassword: pwdState.current,
          newPassword: pwdState.next
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setMsg({ type: 'success', text: 'Login password updated successfully.' });
        setPwdState({ current: '', next: '', confirm: '' });
      } else {
        setMsg({ type: 'error', text: data.error });
      }
    } catch (err) {
      setMsg({ type: 'error', text: 'Sync failure. Check connection.' });
    } finally {
      setPwdLoading(false);
    }
  };

  return (
    <div className="space-y-10 pb-12">
      <motion.header 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex flex-col md:flex-row md:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-black uppercase italic tracking-tighter flex items-center gap-3">
            Change <span className="text-makuoze-red">Password</span>
          </h1>
          <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest mt-1">Update your personal login credentials for the panel.</p>
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

      <div className="max-w-2xl mx-auto w-full">
        {/* Security / Password Section */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-panel p-10 rounded-[3rem] relative overflow-hidden"
        >
          {/* Top Detail */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-makuoze-gradient opacity-20" />
          
          <div className="flex items-center gap-4 mb-10">
            <div className="size-14 rounded-2xl bg-makuoze-red/10 border border-makuoze-red/20 flex items-center justify-center text-makuoze-red shadow-[0_0_20px_rgba(177,0,0,0.2)]">
              <Lock size={28} />
            </div>
            <div>
              <h2 className="text-2xl font-black uppercase italic tracking-tighter text-white">Update Login Key</h2>
              <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">Update your dashboard access password.</p>
            </div>
          </div>
          
          <form onSubmit={handlePasswordChange} className="space-y-6">
            <div className="space-y-5">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-600 ml-1">Current Password</label>
                <input 
                  type="password"
                  value={pwdState.current}
                  onChange={e => setPwdState({...pwdState, current: e.target.value})}
                  className="w-full bg-black/60 border border-white/5 rounded-2xl px-6 py-5 focus:outline-none focus:ring-1 focus:ring-makuoze-red/30 transition-all text-sm font-bold placeholder:text-zinc-800"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-600 ml-1">New Password</label>
                <input 
                  type="password"
                  value={pwdState.next}
                  onChange={e => setPwdState({...pwdState, next: e.target.value})}
                  className="w-full bg-black/60 border border-white/5 rounded-2xl px-6 py-5 focus:outline-none focus:ring-1 focus:ring-makuoze-red/30 transition-all text-sm font-bold placeholder:text-zinc-800"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-600 ml-1">Confirm New Password</label>
                <input 
                  type="password"
                  value={pwdState.confirm}
                  onChange={e => setPwdState({...pwdState, confirm: e.target.value})}
                  className="w-full bg-black/60 border border-white/5 rounded-2xl px-6 py-5 focus:outline-none focus:ring-1 focus:ring-makuoze-red/30 transition-all text-sm font-bold placeholder:text-zinc-800"
                  required
                />
              </div>
            </div>
            
            <button 
              type="submit"
              disabled={pwdLoading}
              className="w-full bg-makuoze-gradient text-white font-black uppercase tracking-[0.2em] text-xs py-5 rounded-2xl transition-all shadow-[0_4px_20px_rgba(177,0,0,0.2)] hover:shadow-[0_6px_25px_rgba(177,0,0,0.4)] disabled:opacity-50 active:scale-[0.98] mt-4"
            >
              {pwdLoading ? 'UPDATING...' : 'SAVE NEW PASSWORD'}
            </button>
          </form>

          {/* Background Detail */}
          <Fingerprint className="absolute -bottom-10 -right-10 size-60 text-white/[0.01] rotate-12 pointer-events-none" />
        </motion.section>
      </div>
    </div>
  );
}

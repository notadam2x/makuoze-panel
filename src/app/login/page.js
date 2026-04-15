'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ShieldAlert, Fingerprint, Lock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (res.ok) {
        router.push('/dashboard');
      } else {
        setError(data.error || 'Access Denied.');
      }
    } catch (err) {
      setError('System connection failure.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white p-4 relative overflow-hidden">
      {/* Background Animated Glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-[600px] bg-makuoze-red/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-0 left-0 right-0 h-[100px] bg-gradient-to-b from-makuoze-red/10 to-transparent pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-[420px] relative z-10"
      >
        {/* Logo Section */}
        <div className="text-center mb-10">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col items-center justify-center"
          >
            <Image
              src="/makuoze-no-bg.png"
              alt="Makuoze Logo"
              width={220}
              height={80}
              className="mb-4 drop-shadow-[0_0_15px_rgba(177,0,0,0.4)]"
            />
            <div className="flex items-center justify-center gap-2 text-zinc-500 text-[10px] font-black uppercase tracking-[0.3em] opacity-50">
              <Lock size={10} />
              <span>Secure Partner Portal</span>
            </div>
          </motion.div>
        </div>

        <div className="glass-panel p-10 rounded-[2.5rem] relative">
          {/* Top Industrial Detail */}
          <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-20 h-3 bg-makuoze-red rounded-full blur-[1px] opacity-20" />

          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-makuoze-red/10 border border-makuoze-red/20 text-makuoze-red-light px-4 py-3 rounded-2xl mb-6 text-sm flex items-center gap-3 font-bold"
              >
                <ShieldAlert size={18} />
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1">Operator ID</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-zinc-600 group-focus-within:text-makuoze-red transition-colors">
                  <Fingerprint size={20} />
                </div>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-black/50 border border-white/5 rounded-2xl pl-12 pr-4 py-4 focus:outline-none focus:ring-1 focus:ring-makuoze-red/50 focus:border-makuoze-red/30 transition-all text-sm font-bold placeholder:text-zinc-700"
                  placeholder="USERNAME"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1">Access Key</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-zinc-600 group-focus-within:text-makuoze-red transition-colors">
                  <Lock size={20} />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-black/50 border border-white/5 rounded-2xl pl-12 pr-4 py-4 focus:outline-none focus:ring-1 focus:ring-makuoze-red/50 focus:border-makuoze-red/30 transition-all text-sm font-bold placeholder:text-zinc-700"
                  placeholder="PASSWORD"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-5 rounded-2xl font-black uppercase tracking-[0.2em] transition-all relative overflow-hidden active:scale-[0.98] ${loading
                ? 'bg-zinc-900 text-zinc-700 cursor-not-allowed'
                : 'btn-makuoze text-white text-sm'
                }`}
            >
              {loading ? 'Initializing...' : 'Engage System'}

              {/* Button Inner Glow */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
            </button>
          </form>
        </div>

        <div className="mt-12 text-center">
          <p className="text-zinc-700 text-[10px] font-bold uppercase tracking-[0.3em]">
            Authorized Personnel Only <br />
          </p>
        </div>
      </motion.div>
    </div>
  );
}

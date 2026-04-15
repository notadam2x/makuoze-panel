'use client';

import { useRouter } from 'next/navigation';
import { LogOut, User, Headset } from 'lucide-react';
import BottomNav from '@/components/BottomNav';

export default function DashboardLayout({ children }) {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/login');
    } catch (err) {
      console.error('Logout error');
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-black text-white selection:bg-makuoze-red/30">
      {/* Top Header */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-black/60 backdrop-blur-xl border-b border-white/5 py-3 md:py-4 px-4 md:px-12 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
          <div className="size-7 md:size-8 rounded-lg bg-makuoze-gradient flex items-center justify-center shadow-[0_0_15px_rgba(177,0,0,0.3)] flex-shrink-0">
            <span className="font-black text-base md:text-lg italic tracking-tighter">M</span>
          </div>
          <h2 className="text-sm sm:text-lg md:text-xl font-black italic tracking-tighter uppercase truncate">
            <span className="text-makuoze-red">Makuoze</span> <span className="text-white">Drainer</span>
          </h2>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="https://t.me/okx_development"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2.5 rounded-xl bg-zinc-900 border border-white/5 text-zinc-400 hover:text-white transition-all flex items-center gap-2"
          >
            <Headset size={20} />
            <span className="hidden md:block text-[10px] font-black uppercase tracking-widest">Support</span>
          </a>
          <button 
            onClick={handleLogout}
            className="p-2.5 rounded-xl bg-zinc-900 border border-white/5 text-zinc-400 hover:text-makuoze-red transition-all"
          >
            <LogOut size={20} />
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 pt-24 pb-32 px-4 md:px-12 max-w-7xl mx-auto w-full">
        {children}
      </main>

      {/* Mobile-Style Bottom Navigation */}
      <BottomNav />
    </div>
  );
}

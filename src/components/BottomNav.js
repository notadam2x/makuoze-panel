'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Cpu, 
  Users, 
  Wallet, 
  ShieldCheck 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const navItems = [
  { label: 'Home', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Bots', href: '/dashboard/bots', icon: Cpu },
  { label: 'Affiliate', href: '/dashboard/affiliate', icon: Users },
  { label: 'Wallets', href: '/dashboard/settings', icon: Wallet },
  { label: 'Security', href: '/dashboard/account', icon: ShieldCheck },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 h-20 md:h-22 bg-black/60 backdrop-blur-2xl border-t border-white/5 safe-area-pb">
      <div className="max-w-md mx-auto h-full flex items-center justify-around px-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className="relative flex flex-col items-center justify-center w-full h-full group"
            >
              {/* Active Glow */}
              <AnimatePresence>
                {isActive && (
                  <motion.div
                    layoutId="active-nav"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="absolute inset-0 bg-makuoze-red/10 rounded-2xl -z-10"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </AnimatePresence>

              <div className={`relative transition-all duration-300 ${
                isActive ? 'text-makuoze-red scale-110' : 'text-zinc-500 group-hover:text-zinc-300'
              }`}>
                <Icon size={22} strokeWidth={isActive ? 2.5 : 2} />
                
                {/* Active Dot */}
                {isActive && (
                  <motion.div 
                    layoutId="active-dot"
                    className="absolute -top-1.5 -right-1.5 size-1.5 bg-makuoze-red-light rounded-full shadow-[0_0_8px_rgba(255,26,26,0.6)]" 
                  />
                )}
              </div>

              <span className={`text-[10px] mt-1.5 font-bold uppercase tracking-widest transition-all duration-300 ${
                isActive ? 'text-white opacity-100' : 'text-zinc-500 opacity-60'
              }`}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

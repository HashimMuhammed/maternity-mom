'use client';

import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, Baby, ClipboardCheck, Wallet, Menu } from 'lucide-react';

const tabs = [
  { path: '/', label: 'Home', icon: Home },
  { path: '/growth', label: 'Growth', icon: Baby },
  { path: '/checklist', label: 'Checklist', icon: ClipboardCheck },
  { path: '/budget', label: 'Budget', icon: Wallet },
  { path: '/more', label: 'More', icon: Menu },
];

export default function BottomNav() {
  const location = useLocation();

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50">
      {/* Subtle top shadow / glow */}
      <div className="absolute -top-4 left-0 right-0 h-4 bg-gradient-to-t from-white/40 dark:from-slate-950/40 to-transparent pointer-events-none" />

      <div
        className="bg-white/90 dark:bg-slate-900/95 backdrop-blur-xl rounded-t-3xl border-t border-pink-100/60 dark:border-slate-800 shadow-[0_-4px_24px_rgba(236,72,153,0.08)] dark:shadow-black/30 transition-colors duration-300"
        style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
      >
        <div className="flex items-center justify-around px-2 pt-2 pb-2">
          {tabs.map((tab) => {
            const active = isActive(tab.path);
            const Icon = tab.icon;

            return (
              <Link
                key={tab.path}
                to={tab.path}
                className="relative flex flex-col items-center justify-center flex-1 py-1 group"
              >
                {/* Active background pill */}
                {active && (
                  <motion.div
                    layoutId="activeTabBg"
                    className="absolute inset-x-2 -top-0.5 bottom-1 rounded-2xl bg-pink-50/80 dark:bg-primary-950/40"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}

                <div className="relative z-10 flex flex-col items-center gap-0.5">
                  <Icon
                    size={22}
                    className={`transition-colors duration-300 ${active
                        ? 'text-primary-500 stroke-[2.5]'
                        : 'text-slate-400 dark:text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-200'
                      }`}
                  />
                  <span
                    className={`text-[11px] font-semibold transition-colors duration-300 ${active
                        ? 'text-primary-600 font-bold'
                        : 'text-slate-400 dark:text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-200'
                      }`}
                  >
                    {tab.label}
                  </span>
                </div>

                {/* Animated active dot */}
                {active && (
                  <motion.div
                    layoutId="activeDot"
                    className="w-1 h-1 rounded-full bg-primary-500 mt-0.5"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}

'use client';

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import ThemeToggle from './ThemeToggle';

export default function Header({ title, subtitle, showBack = false, rightAction }) {
  const navigate = useNavigate();

  return (
    <motion.header
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="sticky top-0 z-40 bg-white/85 dark:bg-slate-900/85 backdrop-blur-xl border-b border-pink-100/50 dark:border-slate-800 transition-colors duration-300"
    >
      <div className="flex items-center justify-between px-4 py-3">
        {/* Left: back button or spacer */}
        <div className="w-10 flex items-center justify-start">
          {showBack && (
            <button
              onClick={() => navigate(-1)}
              className="p-1.5 -ml-1.5 rounded-xl hover:bg-pink-50 dark:hover:bg-slate-800 active:scale-95 transition-all duration-200 text-slate-600 dark:text-slate-300"
              aria-label="Go back"
            >
              <ArrowLeft size={20} />
            </button>
          )}
        </div>

        {/* Center: title & subtitle */}
        <div className="flex-1 text-center px-1">
          <h1 className="font-display font-bold text-base md:text-lg bg-gradient-to-r from-primary-500 via-lavender-500 to-primary-400 dark:from-primary-400 dark:via-lavender-400 dark:to-primary-300 bg-clip-text text-transparent leading-tight truncate">
            {title}
          </h1>
          {subtitle && (
            <p className="text-[11px] text-slate-400 dark:text-slate-400 mt-0.5 font-medium truncate">
              {subtitle}
            </p>
          )}
        </div>

        {/* Right: action or theme toggle */}
        <div className="flex items-center justify-end gap-1.5">
          {rightAction ? (
            <>
              {rightAction}
              <ThemeToggle size="small" />
            </>
          ) : (
            <ThemeToggle size="small" />
          )}
        </div>
      </div>
    </motion.header>
  );
}

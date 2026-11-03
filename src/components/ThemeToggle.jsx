'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Sun, Moon } from 'lucide-react'
import { useTheme } from '../context/ThemeContext'

export default function ThemeToggle({ className = '', size = 'normal' }) {
  const { isDark, toggleTheme } = useTheme()

  const isSmall = size === 'small'

  return (
    <motion.button
      whileTap={{ scale: 0.9 }}
      onClick={toggleTheme}
      type="button"
      className={`relative inline-flex items-center justify-center rounded-2xl transition-all duration-300 ${
        isDark
          ? 'bg-slate-800 text-amber-300 border border-slate-700/80 shadow-md shadow-amber-500/10'
          : 'bg-white/90 text-primary-600 border border-pink-100 shadow-sm hover:bg-white'
      } ${isSmall ? 'p-1.5' : 'p-2'} ${className}`}
      title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      aria-label="Toggle theme"
    >
      <motion.div
        key={isDark ? 'dark' : 'light'}
        initial={{ rotate: -90, opacity: 0, scale: 0.7 }}
        animate={{ rotate: 0, opacity: 1, scale: 1 }}
        exit={{ rotate: 90, opacity: 0, scale: 0.7 }}
        transition={{ duration: 0.25 }}
      >
        {isDark ? (
          <Sun className={isSmall ? 'w-4 h-4' : 'w-5 h-5'} />
        ) : (
          <Moon className={isSmall ? 'w-4 h-4' : 'w-5 h-5'} />
        )}
      </motion.div>
    </motion.button>
  )
}


'use client';

import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Heart,
  Timer,
  FileText,
  Bell,
  Apple,
  Smile,
  BookOpen,
  Sparkles,
  Phone,
  TrendingUp,
  Settings,
} from 'lucide-react';
import Header from '../components/Header';

const menuItems = [
  { path: '/kick-counter', label: 'Kick Counter', icon: Heart, color: 'primary', emoji: '💗' },
  { path: '/contractions', label: 'Contraction Timer', icon: Timer, color: 'lavender', emoji: '⏱️' },
  { path: '/birth-plan', label: 'Birth Plan', icon: FileText, color: 'mint', emoji: '📝' },
  { path: '/reminders', label: 'Reminders', icon: Bell, color: 'peach', emoji: '🔔' },
  { path: '/nutrition', label: 'Nutrition Guide', icon: Apple, color: 'mint', emoji: '🥗' },
  { path: '/wellness', label: 'Mood & Wellness', icon: Smile, color: 'lavender', emoji: '😊' },
  { path: '/journal', label: 'Journal', icon: BookOpen, color: 'primary', emoji: '📖' },
  { path: '/names', label: 'Names Explorer', icon: Sparkles, color: 'peach', emoji: '✨' },
  { path: '/emergency', label: 'Emergency Contacts', icon: Phone, color: 'red', emoji: '🚨' },
  { path: '/weight', label: 'Weight Tracker', icon: TrendingUp, color: 'mint', emoji: '📊' },
  { path: '/settings', label: 'Settings', icon: Settings, color: 'slate', emoji: '⚙️' },
];

const colorMap = {
  primary: {
    bg: 'bg-pink-50 dark:bg-pink-950/40',
    iconBg: 'bg-primary-100 dark:bg-primary-950/80',
    icon: 'text-primary-500 dark:text-primary-300',
    ring: 'ring-primary-200/50 dark:ring-primary-800/40',
  },
  lavender: {
    bg: 'bg-lavender-50 dark:bg-purple-950/40',
    iconBg: 'bg-lavender-100 dark:bg-purple-950/80',
    icon: 'text-lavender-500 dark:text-lavender-300',
    ring: 'ring-lavender-200/50 dark:ring-purple-800/40',
  },
  mint: {
    bg: 'bg-mint-50 dark:bg-emerald-950/40',
    iconBg: 'bg-mint-100 dark:bg-emerald-950/80',
    icon: 'text-mint-600 dark:text-mint-300',
    ring: 'ring-mint-200/50 dark:ring-emerald-800/40',
  },
  peach: {
    bg: 'bg-peach-50 dark:bg-amber-950/40',
    iconBg: 'bg-peach-100 dark:bg-amber-950/80',
    icon: 'text-peach-600 dark:text-amber-300',
    ring: 'ring-peach-200/50 dark:ring-amber-800/40',
  },
  red: {
    bg: 'bg-red-50 dark:bg-rose-950/40',
    iconBg: 'bg-red-100 dark:bg-rose-950/80',
    icon: 'text-red-500 dark:text-rose-300',
    ring: 'ring-red-200/50 dark:ring-rose-800/40',
  },
  slate: {
    bg: 'bg-slate-50 dark:bg-slate-800/40',
    iconBg: 'bg-slate-100 dark:bg-slate-800',
    icon: 'text-slate-500 dark:text-slate-300',
    ring: 'ring-slate-200/50 dark:ring-slate-700/40',
  },
};

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.1,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 24, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: 'spring', stiffness: 260, damping: 20 },
  },
};

export default function MoreMenu() {
  return (
    <div className="page-container pb-28">
      <Header title="More Features" subtitle="Everything you need 🌸" />

      <motion.div
        className="grid grid-cols-2 gap-3 px-4 pt-4"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {menuItems.map((item) => {
          const Icon = item.icon;
          const colors = colorMap[item.color] || colorMap.primary;

          return (
            <motion.div key={item.path} variants={cardVariants}>
              <Link
                to={item.path}
                className={`glass-card card-hover block rounded-2xl p-4 ring-1 ${colors.ring} transition-all duration-300 group`}
              >
                {/* Emoji badge */}
                <div className="flex items-start justify-between mb-3">
                  <div
                    className={`w-10 h-10 rounded-xl ${colors.iconBg} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}
                  >
                    <Icon size={20} className={colors.icon} />
                  </div>
                  <span className="text-2xl" role="img" aria-hidden="true">
                    {item.emoji}
                  </span>
                </div>

                {/* Label */}
                <p className="font-display font-bold text-sm text-slate-800 dark:text-slate-100 leading-snug">
                  {item.label}
                </p>
              </Link>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
}

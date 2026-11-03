'use client'

import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, Check, AlertTriangle, Lightbulb, Baby, Sparkles, Calendar, RotateCcw } from 'lucide-react'
import { babyGrowthData, getGrowthDataForWeek } from '../data/babyGrowthData'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { calculateWeeksPregnant, formatDate } from '../utils/helpers'
import Header from '../components/Header'

const WEEKS = Array.from({ length: 38 }, (_, i) => i + 4) // week 4 to 41

export default function BabyGrowth() {
  // Read due date from the exact key used by Dashboard & Settings
  const [dueDate] = useLocalStorage('mamabear-due-date', null)
  
  const pregnancy = dueDate ? calculateWeeksPregnant(dueDate) : null
  const currentWeek = pregnancy ? pregnancy.weeks : null
  const currentDays = pregnancy ? pregnancy.days : null

  // Clamped pregnancy week for current
  const targetInitialWeek = currentWeek && currentWeek >= 4 
    ? Math.min(41, currentWeek) 
    : (dueDate ? 4 : 20)

  const [selectedWeek, setSelectedWeek] = useState(targetInitialWeek)
  const scrollRef = useRef(null)

  // Sync selectedWeek when dueDate / currentWeek changes
  useEffect(() => {
    if (currentWeek !== null && currentWeek >= 4) {
      setSelectedWeek(Math.min(41, currentWeek))
    } else if (currentWeek !== null && currentWeek < 4) {
      setSelectedWeek(4)
    }
  }, [currentWeek])

  const weekData = getGrowthDataForWeek(selectedWeek)
  const progress = Math.min(100, Math.round((selectedWeek / 40) * 100))

  // Scroll to selected week pill on change or mount
  useEffect(() => {
    if (scrollRef.current) {
      const activeBtn = scrollRef.current.querySelector(`[data-week="${selectedWeek}"]`)
      if (activeBtn) {
        activeBtn.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' })
      }
    }
  }, [selectedWeek])

  return (
    <div className="page-container min-h-screen pb-28">
      <Header title="Baby Growth 🌱" showBack />

      {/* Due Date & Current Stage Banner */}
      {dueDate && currentWeek !== null ? (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 p-3.5 rounded-2xl glass-card border border-primary-200/80 dark:border-slate-800 flex items-center justify-between"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-primary-100 dark:bg-primary-950/60 text-primary-600 dark:text-primary-300 flex items-center justify-center font-bold text-xs flex-shrink-0">
              🤰
            </div>
            <div>
              <div className="text-xs font-bold text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
                <span>You are at Week {currentWeek}, Day {currentDays}</span>
                <span className="badge bg-mint-100 dark:bg-mint-950/80 text-mint-700 dark:text-mint-300 text-[9px] py-0 px-1.5 font-bold">
                  Current
                </span>
              </div>
              <div className="text-[11px] text-slate-400 dark:text-slate-400">
                Due date: {formatDate(dueDate)}
              </div>
            </div>
          </div>

          {selectedWeek !== currentWeek && currentWeek >= 4 && currentWeek <= 41 && (
            <button
              onClick={() => setSelectedWeek(currentWeek)}
              className="px-2.5 py-1.5 rounded-xl bg-primary-50 dark:bg-slate-800 text-primary-600 dark:text-primary-300 hover:bg-primary-100 dark:hover:bg-slate-700 text-xs font-semibold flex items-center gap-1 transition-colors flex-shrink-0"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Week {currentWeek}</span>
            </button>
          )}
        </motion.div>
      ) : (
        <div className="mb-4 p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 flex items-center justify-between text-xs text-amber-800 dark:text-amber-200">
          <div className="flex items-center gap-2">
            <span>💡</span>
            <span>Set your due date on Home to track your exact week!</span>
          </div>
          <Link to="/" className="text-primary-600 dark:text-primary-400 font-bold hover:underline">
            Set Date
          </Link>
        </div>
      )}

      {/* Progress Bar */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-4"
      >
        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-1.5">
          <span className="font-semibold text-slate-700 dark:text-slate-200">Week {selectedWeek} of 40</span>
          <span className="font-semibold text-primary-600 dark:text-primary-400">{progress}% complete</span>
        </div>
        <div className="w-full h-2.5 bg-slate-200/70 dark:bg-slate-800 rounded-full overflow-hidden">
          <motion.div
            className="h-full gradient-primary rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </motion.div>

      {/* Week Selector - Horizontal Scrollable Pills */}
      <div className="mb-5">
        <div
          ref={scrollRef}
          className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide px-1"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {WEEKS.map((week) => {
            const isSelected = selectedWeek === week
            const isMomCurrentWeek = currentWeek === week

            return (
              <button
                key={week}
                data-week={week}
                onClick={() => setSelectedWeek(week)}
                className={`flex-shrink-0 px-3.5 py-2 rounded-2xl text-xs font-bold transition-all duration-200 flex flex-col items-center min-w-[50px] relative ${
                  isSelected
                    ? 'gradient-primary text-white shadow-lg shadow-primary-500/30 scale-105'
                    : isMomCurrentWeek
                    ? 'bg-primary-100 dark:bg-primary-950/60 text-primary-700 dark:text-primary-300 border-2 border-primary-400'
                    : 'bg-white/80 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700'
                }`}
              >
                <span>Wk {week}</span>
                {isMomCurrentWeek && (
                  <span className={`text-[8px] font-black uppercase tracking-wider ${isSelected ? 'text-pink-100' : 'text-primary-600 dark:text-primary-400'}`}>
                    Now
                  </span>
                )}
              </button>
            )
          })}
        </div>
      </div>

      {/* Selected Week Detail Card */}
      <AnimatePresence mode="wait">
        {weekData && (
          <motion.div
            key={selectedWeek}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          >
            {/* Main Size Card */}
            <div className="glass-card rounded-3xl p-6 mb-4 text-center relative overflow-hidden shadow-xl shadow-primary-500/5 border border-primary-100 dark:border-slate-800">
              <div className="flex items-center justify-center gap-1.5 mb-1">
                <span className="badge bg-primary-100 dark:bg-primary-950/80 text-primary-700 dark:text-primary-300 text-[10px] font-bold py-0.5 px-2">
                  WEEK {selectedWeek}
                </span>
                {currentWeek === selectedWeek && (
                  <span className="badge bg-mint-100 dark:bg-mint-950/80 text-mint-700 dark:text-mint-300 text-[10px] font-bold py-0.5 px-2">
                    YOUR CURRENT WEEK ⭐
                  </span>
                )}
              </div>

              <h2 className="text-sm font-semibold text-slate-500 dark:text-slate-300 mb-2">
                Your baby is about the size of a
              </h2>

              {/* Animated Emoji */}
              <motion.div
                className="text-7xl my-3 inline-block animate-float"
                animate={{ scale: [1, 1.08, 1] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              >
                {weekData.emoji}
              </motion.div>

              <h3 className="text-2xl font-display font-black gradient-text mb-4">
                {weekData.size}
              </h3>

              {/* Stats Row */}
              <div className="grid grid-cols-2 gap-3 max-w-xs mx-auto">
                <div className="bg-lavender-50/80 dark:bg-slate-800/80 border border-lavender-100 dark:border-slate-700 py-2.5 px-3 rounded-2xl">
                  <p className="text-[11px] text-lavender-500 dark:text-lavender-300 font-semibold mb-0.5">📏 Baby Length</p>
                  <p className="text-base font-bold text-lavender-700 dark:text-lavender-200">
                    {weekData.lengthCm} <span className="text-xs font-normal">cm</span>
                  </p>
                </div>
                <div className="bg-primary-50/80 dark:bg-slate-800/80 border border-primary-100 dark:border-slate-700 py-2.5 px-3 rounded-2xl">
                  <p className="text-[11px] text-primary-500 dark:text-primary-300 font-semibold mb-0.5">⚖️ Baby Weight</p>
                  <p className="text-base font-bold text-primary-700 dark:text-primary-200">
                    {weekData.weightG < 1000
                      ? `${weekData.weightG} g`
                      : `${(weekData.weightG / 1000).toFixed(1)} kg`}
                  </p>
                </div>
              </div>
            </div>

            {/* Development Milestones */}
            <div className="mb-4">
              <h3 className="section-title mb-2.5 flex items-center gap-2">
                <Baby className="w-5 h-5 text-mint-500" />
                Baby's Development This Week
              </h3>
              <div className="space-y-2">
                {weekData.development.map((milestone, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.08 }}
                    className="flex items-start gap-3 bg-mint-50/80 dark:bg-mint-950/40 border border-mint-200/60 dark:border-mint-900/60 rounded-2xl p-3"
                  >
                    <div className="w-5 h-5 rounded-full bg-mint-500 text-white flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="w-3 h-3" strokeWidth={3} />
                    </div>
                    <p className="text-xs text-slate-700 dark:text-slate-100 font-medium leading-relaxed">{milestone}</p>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Mom's Symptoms */}
            <div className="mb-4">
              <h3 className="section-title mb-2.5 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-500" />
                What Mom Might Feel This Week
              </h3>
              <div className="space-y-2">
                {weekData.momSymptoms.map((symptom, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.08 + 0.2 }}
                    className="flex items-start gap-3 bg-amber-50/80 dark:bg-amber-950/40 border border-amber-200/60 dark:border-amber-900/60 rounded-2xl p-3"
                  >
                    <div className="w-5 h-5 rounded-full bg-amber-400 text-white flex items-center justify-center flex-shrink-0 mt-0.5">
                      <AlertTriangle className="w-3 h-3" strokeWidth={3} />
                    </div>
                    <p className="text-xs text-slate-700 dark:text-slate-100 font-medium leading-relaxed">{symptom}</p>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Weekly Doctor Tip */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-gradient-to-br from-primary-50 via-lavender-50 to-peach-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 border border-primary-200/60 dark:border-slate-700 rounded-3xl p-4 mb-5 shadow-sm"
            >
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-2xl bg-white dark:bg-slate-800 flex items-center justify-center flex-shrink-0 shadow-sm text-lg">
                  💡
                </div>
                <div>
                  <h4 className="text-xs font-bold text-primary-700 dark:text-primary-300 mb-1">Doctor Tip for Week {selectedWeek}</h4>
                  <p className="text-xs text-slate-600 dark:text-slate-200 leading-relaxed">{weekData.tip}</p>
                </div>
              </div>
            </motion.div>

            {/* Week Stepper Controls */}
            <div className="flex items-center justify-between mb-8">
              <button
                onClick={() => setSelectedWeek((w) => Math.max(4, w - 1))}
                disabled={selectedWeek <= 4}
                className="flex items-center gap-1 px-3.5 py-2 rounded-xl bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-200 hover:bg-primary-50 dark:hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-sm text-xs font-semibold"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Week {selectedWeek - 1}</span>
              </button>
              <div className="text-center">
                <span className="text-[10px] text-slate-400 font-medium">Viewing</span>
                <p className="text-sm font-bold gradient-text font-display">Week {selectedWeek}</p>
              </div>
              <button
                onClick={() => setSelectedWeek((w) => Math.min(41, w + 1))}
                disabled={selectedWeek >= 41}
                className="flex items-center gap-1 px-3.5 py-2 rounded-xl bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-200 hover:bg-primary-50 dark:hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-sm text-xs font-semibold"
              >
                <span>Week {selectedWeek + 1}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

'use client'

import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Check, Lightbulb, Droplets, AlertCircle, Edit2, X, Sparkles } from 'lucide-react'
import ThemeToggle from '../components/ThemeToggle'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { getGrowthDataForWeek } from '../data/babyGrowthData'
import {
  calculateWeeksPregnant,
  getDaysUntilDue,
  getTrimester,
  getProgressPercent,
  formatDate,
  format,
} from '../utils/helpers'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
}

function ProgressRing({ percent, size = 160, strokeWidth = 10 }) {
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (percent / 100) * circumference

  return (
    <svg width={size} height={size} className="drop-shadow-lg">
      {/* Background circle */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="rgba(255,255,255,0.2)"
        strokeWidth={strokeWidth}
      />
      {/* Progress circle */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="white"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        className="progress-ring"
        style={{ transition: 'stroke-dashoffset 1s ease' }}
      />
    </svg>
  )
}

export default function Dashboard() {
  const [dueDate, setDueDate] = useLocalStorage('mamabear-due-date', null)
  const [momName, setMomName] = useLocalStorage('mamabear-mom-name', 'Mama')
  
  const [dateInput, setDateInput] = useState('')
  const [nameInput, setNameInput] = useState('')
  const [isEditingName, setIsEditingName] = useState(false)
  const [tempName, setTempName] = useState(momName || 'Mama')

  const todayKey = format(new Date(), 'yyyy-MM-dd')
  const [waterCount, setWaterCount] = useLocalStorage(`mamabear-water-${todayKey}`, 0)

  const pregnancy = useMemo(() => {
    if (!dueDate) return null
    const { weeks, days, totalDays } = calculateWeeksPregnant(dueDate)
    const daysLeft = getDaysUntilDue(dueDate)
    const trimester = getTrimester(weeks)
    const progress = getProgressPercent(weeks)
    const growthData = getGrowthDataForWeek(weeks)
    return { weeks, days, totalDays, daysLeft, trimester, progress, growthData }
  }, [dueDate])

  const handleSetOnboarding = (e) => {
    e.preventDefault()
    if (nameInput.trim()) {
      setMomName(nameInput.trim())
    }
    if (dateInput) {
      setDueDate(dateInput)
    }
  }

  const handleSaveName = () => {
    if (tempName.trim()) {
      setMomName(tempName.trim())
    }
    setIsEditingName(false)
  }

  // ---------- Onboarding (no due date set) ----------
  if (!dueDate || !pregnancy) {
    return (
      <div className="page-container pb-28 flex flex-col items-center justify-center min-h-[80vh]">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="glass-card rounded-3xl p-8 w-full max-w-sm text-center shadow-xl border border-primary-200"
        >
          <div className="text-6xl mb-4 animate-float">🤰</div>
          <h1 className="font-display text-2xl font-bold text-slate-800 mb-2">
            Welcome to MamaBear 💕
          </h1>
          <p className="text-slate-500 mb-6 text-xs leading-relaxed">
            Your gentle companion through this miraculous journey. Let's start with your name and due date!
          </p>
          <form onSubmit={handleSetOnboarding} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1 text-left">
                🌸 What is your name or nickname?
              </label>
              <input
                type="text"
                placeholder="e.g. Sarah, Priya, Mama"
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                className="input-field text-center text-sm py-2.5"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1 text-left">
                📅 When is your estimated due date?
              </label>
              <input
                type="date"
                value={dateInput}
                onChange={(e) => setDateInput(e.target.value)}
                className="input-field text-center text-sm py-2.5"
                required
              />
            </div>
            <button type="submit" className="btn-primary w-full py-3 text-sm">
              Begin Your Journey 🌸
            </button>
          </form>
        </motion.div>
      </div>
    )
  }

  const { weeks, days, daysLeft, trimester, progress, growthData } = pregnancy

  const trimesterColors = {
    mint: 'bg-mint-100 text-mint-700',
    lavender: 'bg-lavender-100 text-lavender-700',
    primary: 'bg-primary-100 text-primary-700',
  }

  const quickActions = [
    { label: 'Track Kick', to: '/kick-counter', emoji: '💗' },
    { label: 'Checklist', to: '/checklist', emoji: '✅' },
    { label: 'Reminders', to: '/reminders', emoji: '🔔' },
    { label: 'Journal', to: '/journal', emoji: '📖' },
  ]

  return (
    <motion.div
      className="page-container pb-28"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* -------- 1. Greeting Banner with Mama's Name -------- */}
      <motion.div variants={itemVariants} className="mb-5 pt-1">
        <div className="flex items-center justify-between">
          {isEditingName ? (
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={tempName}
                onChange={(e) => setTempName(e.target.value)}
                className="font-display text-xl font-bold text-slate-800 bg-white border border-primary-300 rounded-xl px-2.5 py-1 outline-none max-w-[180px]"
                autoFocus
                placeholder="Mama's Name"
              />
              <button
                onClick={handleSaveName}
                className="p-1.5 rounded-xl bg-primary-500 text-white hover:bg-primary-600"
              >
                <Check className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsEditingName(false)}
                className="p-1.5 rounded-xl bg-slate-100 text-slate-500 hover:bg-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <h1 className="font-display text-2xl font-bold text-slate-800 dark:text-slate-100 tracking-tight">
                Hello, {momName || 'Mama'}! 💕
              </h1>
              <button
                onClick={() => { setTempName(momName || 'Mama'); setIsEditingName(true); }}
                className="p-1 text-slate-300 hover:text-primary-500 rounded-lg transition-colors"
                title="Change Mama's name"
              >
                <Edit2 className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          <ThemeToggle />
        </div>

        <div className="flex items-center gap-2 mt-1">
          <p className="text-slate-500 dark:text-slate-400 text-xs">
            {format(new Date(), 'EEEE, MMMM do, yyyy')}
          </p>
          <span className={`badge text-[10px] py-0.5 px-2 ${trimesterColors[trimester.color]}`}>
            {trimester.label}
          </span>
        </div>
      </motion.div>

      {/* -------- 2. Pregnancy Progress Hero Card -------- */}
      <motion.div
        variants={itemVariants}
        className="gradient-primary rounded-3xl p-6 text-white mb-5 relative overflow-hidden shadow-xl shadow-primary-500/20"
      >
        {/* Decorative circles */}
        <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-white/10" />
        <div className="absolute -bottom-8 -left-8 w-32 h-32 rounded-full bg-white/5" />

        <div className="relative z-10 flex flex-col items-center">
          {/* Progress Ring */}
          <div className="relative mb-3">
            <ProgressRing percent={progress} size={160} strokeWidth={10} />
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-4xl font-bold font-display leading-none">{weeks}</span>
              <span className="text-xs opacity-80 mt-0.5">weeks</span>
            </div>
          </div>

          <p className="font-display text-lg font-semibold">
            Week {weeks}, Day {days}
          </p>
          <p className="text-sm opacity-80 mt-0.5">
            Due: {formatDate(dueDate)}
          </p>
          <p className="text-sm opacity-90 mt-1 font-medium">
            🕐 {daysLeft > 0 ? `${daysLeft} days remaining` : 'Any day now!'}
          </p>

          {/* Baby Size */}
          <div className="mt-4 bg-white/20 rounded-2xl px-5 py-3 text-center backdrop-blur-sm">
            <span className="text-4xl animate-float inline-block">{growthData.emoji}</span>
            <p className="text-sm font-medium mt-1">
              Your baby is the size of a {growthData.size}!
            </p>
          </div>
        </div>
      </motion.div>

      {/* -------- 3. Quick Stats Row -------- */}
      <motion.div variants={itemVariants} className="grid grid-cols-3 gap-3 mb-5">
        <div className="glass-card rounded-2xl p-3 text-center card-hover">
          <span className="text-2xl">⏳</span>
          <p className="text-2xl font-bold text-slate-800 font-display mt-1">
            {daysLeft > 0 ? daysLeft : 0}
          </p>
          <p className="text-xs text-slate-500">Days Left</p>
        </div>
        <div className="glass-card rounded-2xl p-3 text-center card-hover">
          <span className="text-2xl">⚖️</span>
          <p className="text-2xl font-bold text-slate-800 font-display mt-1">
            {growthData.weightG >= 1000
              ? `${(growthData.weightG / 1000).toFixed(1)}k`
              : growthData.weightG}
          </p>
          <p className="text-xs text-slate-500">Weight (g)</p>
        </div>
        <div className="glass-card rounded-2xl p-3 text-center card-hover">
          <span className="text-2xl">📏</span>
          <p className="text-2xl font-bold text-slate-800 font-display mt-1">
            {growthData.lengthCm}
          </p>
          <p className="text-xs text-slate-500">Length (cm)</p>
        </div>
      </motion.div>

      {/* -------- 4. Baby Development Highlights -------- */}
      <motion.div variants={itemVariants} className="glass-card rounded-2xl p-4 mb-5">
        <h3 className="section-title mb-3 flex items-center gap-2">
          <span>👶</span> Baby's Milestones (Week {weeks})
        </h3>
        <div className="space-y-2">
          {growthData.development.map((item, index) => (
            <div key={index} className="flex items-start gap-2.5">
              <div className="w-5 h-5 rounded-full bg-mint-100 text-mint-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Check className="w-3 h-3" />
              </div>
              <p className="text-sm text-slate-600 leading-snug">{item}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* -------- 5. Mom's Symptoms This Week -------- */}
      <motion.div variants={itemVariants} className="glass-card rounded-2xl p-4 mb-5 border-l-4 border-peach-200">
        <h3 className="section-title mb-3 flex items-center gap-2">
          <span>🤰</span> Mom's Symptoms This Week
        </h3>
        <div className="flex flex-wrap gap-2">
          {growthData.momSymptoms.map((symptom, index) => (
            <span
              key={index}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium bg-amber-50 text-amber-800 border border-amber-200"
            >
              <AlertCircle className="w-3 h-3 text-amber-500" />
              {symptom}
            </span>
          ))}
        </div>
      </motion.div>

      {/* -------- 6. Weekly Tip -------- */}
      <motion.div
        variants={itemVariants}
        className="rounded-2xl p-4 mb-5 bg-gradient-to-r from-primary-50 via-peach-50 to-lavender-50 border border-primary-200"
      >
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-xl bg-white shadow-sm flex-shrink-0 text-xl">
            💡
          </div>
          <div>
            <h4 className="font-display font-bold text-sm text-slate-800 mb-1">
              Tip for Week {weeks}
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              {growthData.tip}
            </p>
          </div>
        </div>
      </motion.div>

      {/* -------- 7. Quick Actions Grid -------- */}
      <motion.div variants={itemVariants} className="mb-5">
        <h3 className="section-title mb-3">Quick Actions</h3>
        <div className="grid grid-cols-2 gap-3">
          {quickActions.map((action, index) => (
            <Link
              key={index}
              to={action.to}
              className="glass-card rounded-2xl p-4 flex items-center gap-3 card-hover"
            >
              <span className="text-2xl">{action.emoji}</span>
              <span className="font-semibold text-sm text-slate-700">
                {action.label}
              </span>
            </Link>
          ))}
        </div>
      </motion.div>

      {/* -------- 8. Today's Water Intake (mini tracker) -------- */}
      <motion.div variants={itemVariants} className="glass-card rounded-2xl p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Droplets className="w-5 h-5 text-sky-500" />
            <h3 className="font-display font-bold text-sm text-slate-800">
              Today's Water Intake
            </h3>
          </div>
          <span className="text-xs font-bold text-sky-600">
            {waterCount}/8 glasses
          </span>
        </div>

        <div className="grid grid-cols-8 gap-1.5 mb-2">
          {Array.from({ length: 8 }).map((_, i) => (
            <button
              key={i}
              onClick={() => setWaterCount(i < waterCount ? i : i + 1)}
              className={`h-9 rounded-xl flex items-center justify-center transition-all ${
                i < waterCount
                  ? 'bg-sky-500 text-white shadow-sm shadow-sky-500/30'
                  : 'bg-slate-100 text-slate-300 hover:bg-slate-200'
              }`}
            >
              <Droplets className={`w-3.5 h-3.5 ${i < waterCount ? 'fill-white' : ''}`} />
            </button>
          ))}
        </div>
        <p className="text-[11px] text-slate-400 text-center">
          Tap a drop to update today's hydration
        </p>
      </motion.div>
    </motion.div>
  )
}

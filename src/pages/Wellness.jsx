'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Smile, 
  Droplets, 
  Moon, 
  Activity, 
  Sparkles, 
  Heart, 
  Check, 
  Star,
  Plus,
  Minus
} from 'lucide-react'
import Header from '../components/Header'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { moodOptions, waterGoalMl } from '../data/wellnessData'
import { formatDate } from '../utils/helpers'

export default function Wellness() {
  const todayKey = new Date().toISOString().split('T')[0]

  const [todayMood, setTodayMood] = useLocalStorage(`mamabear-mood-${todayKey}`, null)
  const [glassesDrunk, setGlassesDrunk] = useLocalStorage(`mamabear-water-${todayKey}`, 0)
  const [sleepHours, setSleepHours] = useLocalStorage(`mamabear-sleep-${todayKey}`, 7)
  const [sleepRating, setSleepRating] = useLocalStorage(`mamabear-sleep-rating-${todayKey}`, 4)
  const [selectedSymptoms, setSelectedSymptoms] = useLocalStorage(`mamabear-symptoms-${todayKey}`, [])

  const [wellnessNotes, setWellnessNotes] = useLocalStorage(`mamabear-notes-${todayKey}`, '')
  const [savedNotice, setSavedNotice] = useState(false)

  const glassCapacityMl = 312 // 8 glasses = 2500ml
  const currentWaterMl = glassesDrunk * glassCapacityMl
  const waterProgress = Math.min(100, Math.round((currentWaterMl / waterGoalMl) * 100))

  const pregnancySymptomsList = [
    { id: 'nausea', label: 'Morning Nausea', emoji: '🤢' },
    { id: 'fatigue', label: 'Extreme Fatigue', emoji: '🥱' },
    { id: 'heartburn', label: 'Heartburn / Acidity', emoji: '🔥' },
    { id: 'backache', label: 'Back Pain', emoji: '⚡' },
    { id: 'swelling', label: 'Swollen Feet', emoji: '🦶' },
    { id: 'cramps', label: 'Leg Cramps', emoji: '🦵' },
    { id: 'insomnia', label: 'Trouble Sleeping', emoji: '🌙' },
    { id: 'headache', label: 'Headache', emoji: '🤕' },
    { id: 'glowing', label: 'Pregnancy Glow', emoji: '✨' },
    { id: 'flutters', label: 'Baby Flutters', emoji: '🦋' },
  ]

  const affirmations = [
    "You are growing a miracle inside you with love and grace.",
    "Your body is wise, strong, and capable of amazing things.",
    "Every breath brings peaceful energy to you and your baby.",
    "Rest when you need to; you are creating human life today.",
    "You are going to be the most wonderful, loving mother."
  ]

  const todayAffirmation = affirmations[new Date().getDate() % affirmations.length]

  const handleToggleSymptom = (symptomId) => {
    if (selectedSymptoms.includes(symptomId)) {
      setSelectedSymptoms(selectedSymptoms.filter(s => s !== symptomId))
    } else {
      setSelectedSymptoms([...selectedSymptoms, symptomId])
    }
  }

  const handleAddGlass = () => {
    if (glassesDrunk < 12) setGlassesDrunk(glassesDrunk + 1)
  }

  const handleRemoveGlass = () => {
    if (glassesDrunk > 0) setGlassesDrunk(glassesDrunk - 1)
  }

  const handleSaveNotes = () => {
    setSavedNotice(true)
    setTimeout(() => setSavedNotice(false), 2000)
  }

  return (
    <div className="page-container pb-28">
      <Header 
        title="Wellness & Self Care 🧘‍♀️" 
        subtitle={`Daily check-in for ${formatDate(new Date())}`}
        showBack={true}
      />

      {/* Daily Affirmation Card */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-4 rounded-3xl bg-gradient-to-r from-lavender-400 via-primary-400 to-peach-200 text-white p-5 shadow-lg relative overflow-hidden"
      >
        <div className="flex items-center gap-2 text-white/80 text-xs font-semibold uppercase tracking-wider mb-1">
          <Sparkles className="w-4 h-4 text-amber-200" /> Daily Mama Affirmation
        </div>
        <p className="font-display font-medium text-base text-white/95 leading-relaxed italic">
          "{todayAffirmation}"
        </p>
      </motion.div>

      {/* Mood Selector */}
      <div className="mt-6">
        <h2 className="section-title mb-3 flex items-center gap-2">
          <Smile className="w-5 h-5 text-primary-500" /> How are you feeling today?
        </h2>

        <div className="grid grid-cols-5 gap-2">
          {moodOptions.map((mood) => {
            const isSelected = todayMood === mood.label
            return (
              <motion.button
                key={mood.label}
                whileTap={{ scale: 0.9 }}
                onClick={() => setTodayMood(mood.label)}
                className={`flex flex-col items-center justify-center p-2.5 rounded-2xl glass-card transition-all ${
                  isSelected 
                    ? 'border-2 border-primary-500 bg-primary-50/80 shadow-md shadow-primary-500/20 scale-105' 
                    : 'hover:bg-slate-50 opacity-80 hover:opacity-100'
                }`}
              >
                <span className="text-2xl mb-1">{mood.emoji}</span>
                <span className="text-[11px] font-semibold text-slate-700 truncate w-full text-center">
                  {mood.label}
                </span>
              </motion.button>
            )
          })}
        </div>
      </div>

      {/* Hydration Tracker */}
      <div className="mt-6 glass-card rounded-3xl p-5 shadow-lg border border-primary-100">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-sky-100 text-sky-600">
              <Droplets className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-800">Hydration Tracker</h3>
              <p className="text-xs text-slate-400">Aim for 2.5 Liters (8 glasses)</p>
            </div>
          </div>
          <div className="text-right">
            <span className="text-lg font-black text-sky-600">{glassesDrunk}</span>
            <span className="text-xs text-slate-400"> / 8 glasses</span>
          </div>
        </div>

        {/* 8 Glass Icons in a Row */}
        <div className="grid grid-cols-8 gap-1.5 my-3">
          {Array.from({ length: 8 }).map((_, i) => {
            const filled = i < glassesDrunk
            return (
              <button
                key={i}
                onClick={() => setGlassesDrunk(i + 1)}
                className={`h-11 rounded-xl flex items-center justify-center transition-all ${
                  filled 
                    ? 'bg-gradient-to-t from-sky-500 to-sky-300 text-white shadow-sm shadow-sky-500/30' 
                    : 'bg-slate-100 text-slate-300 hover:bg-slate-200'
                }`}
              >
                <Droplets className={`w-4 h-4 ${filled ? 'fill-white' : ''}`} />
              </button>
            )
          })}
        </div>

        {/* Water Progress Bar */}
        <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden mt-2">
          <div 
            className="h-full bg-gradient-to-r from-sky-400 to-sky-500 rounded-full transition-all duration-500"
            style={{ width: `${waterProgress}%` }}
          />
        </div>

        {/* Adjust Buttons */}
        <div className="flex items-center justify-between mt-3 pt-2 text-xs text-slate-500">
          <span>{currentWaterMl} ml logged ({waterProgress}%)</span>
          <div className="flex gap-2">
            <button
              onClick={handleRemoveGlass}
              className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleAddGlass}
              className="p-1.5 rounded-lg bg-sky-500 hover:bg-sky-600 text-white"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Sleep Tracker */}
      <div className="mt-6 glass-card rounded-3xl p-5 shadow-lg border border-primary-100">
        <div className="flex items-center gap-2 mb-3">
          <div className="p-2 rounded-xl bg-lavender-100 text-lavender-600">
            <Moon className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-slate-800">Sleep & Rest</h3>
            <p className="text-xs text-slate-400">Track restorative sleep for you & baby</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-xs font-semibold text-slate-600 mb-1.5">
              <span>Hours Slept</span>
              <span className="font-bold text-lavender-600 text-sm">{sleepHours} hrs</span>
            </div>
            <input
              type="range"
              min="3"
              max="12"
              step="0.5"
              value={sleepHours}
              onChange={(e) => setSleepHours(Number(e.target.value))}
              className="w-full accent-lavender-500"
            />
            <div className="flex justify-between text-[10px] text-slate-400 mt-0.5">
              <span>3h</span>
              <span>7-9h (Ideal)</span>
              <span>12h</span>
            </div>
          </div>

          <div>
            <div className="text-xs font-semibold text-slate-600 mb-1.5">Sleep Quality</div>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setSleepRating(star)}
                  className="p-1.5 hover:scale-110 transition-transform"
                >
                  <Star 
                    className={`w-6 h-6 ${
                      star <= sleepRating 
                        ? 'text-amber-400 fill-amber-400' 
                        : 'text-slate-200'
                    }`} 
                  />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Pregnancy Symptoms Tags */}
      <div className="mt-6">
        <h2 className="section-title mb-3 flex items-center gap-2">
          <Activity className="w-5 h-5 text-mint-500" /> Symptoms Felt Today
        </h2>

        <div className="flex flex-wrap gap-2">
          {pregnancySymptomsList.map((symptom) => {
            const isSelected = selectedSymptoms.includes(symptom.id)
            return (
              <button
                key={symptom.id}
                onClick={() => handleToggleSymptom(symptom.id)}
                className={`px-3 py-2 rounded-2xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                  isSelected
                    ? 'bg-gradient-to-r from-primary-500 to-lavender-500 text-white shadow-md shadow-primary-500/20 scale-105'
                    : 'glass-card text-slate-600 hover:bg-slate-50 border border-slate-200/60'
                }`}
              >
                <span>{symptom.emoji}</span>
                <span>{symptom.label}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Daily Reflection / Quick Note */}
      <div className="mt-6 glass-card rounded-3xl p-5 shadow-lg border border-primary-100">
        <h3 className="font-bold text-sm text-slate-800 mb-2">Today's Reflection</h3>
        <textarea
          rows={3}
          value={wellnessNotes}
          onChange={(e) => setWellnessNotes(e.target.value)}
          placeholder="How did baby move today? What made you smile? Any cravings?"
          className="input-field text-sm py-2.5 resize-none"
        />
        <div className="flex justify-between items-center mt-2">
          {savedNotice ? (
            <span className="text-xs text-mint-600 font-bold flex items-center gap-1">
              <Check className="w-3.5 h-3.5" /> Note saved!
            </span>
          ) : <span />}
          <button
            onClick={handleSaveNotes}
            className="btn-primary py-2 px-4 text-xs"
          >
            Save Reflection
          </button>
        </div>
      </div>
    </div>
  )
}


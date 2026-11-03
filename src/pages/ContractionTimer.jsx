'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Timer, 
  Play, 
  Square, 
  RotateCcw, 
  AlertTriangle, 
  PhoneCall, 
  Trash2, 
  Clock, 
  Info,
  CheckCircle2
} from 'lucide-react'
import Header from '../components/Header'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { generateId, formatDate, formatTime } from '../utils/helpers'

export default function ContractionTimer() {
  const [contractions, setContractions] = useLocalStorage('mamabear-contractions', [])
  const [isTimingContraction, setIsTimingContraction] = useState(false)
  const [currentDuration, setCurrentDuration] = useState(0)
  const [currentInterval, setCurrentInterval] = useState(0)
  const [showGuide, setShowGuide] = useState(false)

  const contractionTimerRef = useRef(null)
  const intervalTimerRef = useRef(null)

  // Track contraction duration
  useEffect(() => {
    if (isTimingContraction) {
      contractionTimerRef.current = setInterval(() => {
        setCurrentDuration(prev => prev + 1)
      }, 1000)
    } else {
      if (contractionTimerRef.current) clearInterval(contractionTimerRef.current)
    }
    return () => {
      if (contractionTimerRef.current) clearInterval(contractionTimerRef.current)
    }
  }, [isTimingContraction])

  // Track rest interval between contractions
  useEffect(() => {
    if (!isTimingContraction && contractions.length > 0) {
      intervalTimerRef.current = setInterval(() => {
        setCurrentInterval(prev => prev + 1)
      }, 1000)
    } else {
      if (intervalTimerRef.current) clearInterval(intervalTimerRef.current)
      setCurrentInterval(0)
    }
    return () => {
      if (intervalTimerRef.current) clearInterval(intervalTimerRef.current)
    }
  }, [isTimingContraction, contractions.length])

  const formatSecs = (sec) => {
    const mins = Math.floor(sec / 60)
    const rem = sec % 60
    return `${mins.toString().padStart(2, '0')}:${rem.toString().padStart(2, '0')}`
  }

  const handleStartContraction = () => {
    setIsTimingContraction(true)
    setCurrentDuration(0)
  }

  const handleStopContraction = () => {
    if (currentDuration < 3) {
      setIsTimingContraction(false)
      setCurrentDuration(0)
      return
    }

    const now = new Date()
    const lastContraction = contractions[0]
    let intervalSeconds = null

    if (lastContraction) {
      const lastStart = new Date(lastContraction.startTime).getTime()
      intervalSeconds = Math.round((now.getTime() - lastStart) / 1000)
    }

    const newRecord = {
      id: generateId(),
      startTime: now.toISOString(),
      durationSeconds: currentDuration,
      intervalSeconds: intervalSeconds,
    }

    setContractions([newRecord, ...contractions])
    setIsTimingContraction(false)
    setCurrentDuration(0)
  }

  const handleClearHistory = () => {
    if (window.confirm('Are you sure you want to clear your contraction history?')) {
      setContractions([])
      setCurrentDuration(0)
      setCurrentInterval(0)
      setIsTimingContraction(false)
    }
  }

  // 5-1-1 Rule analysis
  // 5 mins apart (300 secs), lasting 1 min (>= 45s), consistent over recent 3+ contractions
  const is511RuleMet = () => {
    if (contractions.length < 3) return false
    const recent = contractions.slice(0, 4)
    const avgDuration = recent.reduce((sum, c) => sum + c.durationSeconds, 0) / recent.length
    const withIntervals = recent.filter(c => c.intervalSeconds !== null)
    if (withIntervals.length < 2) return false
    const avgInterval = withIntervals.reduce((sum, c) => sum + c.intervalSeconds, 0) / withIntervals.length

    // Duration ~45-75 seconds, interval ~4-6 mins (240 - 360 seconds)
    return avgDuration >= 45 && avgInterval <= 360 && avgInterval >= 180
  }

  const averageDuration = contractions.length > 0 
    ? Math.round(contractions.reduce((sum, c) => sum + c.durationSeconds, 0) / contractions.length)
    : 0

  return (
    <div className="page-container pb-28">
      <Header 
        title="Contraction Timer ⏱️" 
        subtitle="Time labor contractions & know when to head in"
        showBack={true}
        rightAction={
          <button 
            onClick={() => setShowGuide(!showGuide)} 
            className="p-2 rounded-xl bg-white/60 text-primary-600 hover:bg-white"
          >
            <Info className="w-5 h-5" />
          </button>
        }
      />

      {/* Guide accordion */}
      <AnimatePresence>
        {showGuide && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-3 p-4 rounded-2xl bg-peach-100 border border-peach-200 text-slate-700 text-xs leading-relaxed"
          >
            <div className="font-bold text-amber-800 text-sm mb-1 flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              The 5-1-1 Rule for Labor
            </div>
            <p className="mt-1">
              Call your doctor or head to the hospital when your contractions are:
            </p>
            <ul className="list-disc pl-5 mt-1 space-y-0.5">
              <li><strong>5 minutes apart:</strong> From the start of one to the start of the next</li>
              <li><strong>1 minute long:</strong> Each lasting about 60 seconds</li>
              <li><strong>For 1 hour:</strong> Consistently continuing this pattern</li>
            </ul>
            <p className="mt-2 text-rose-700 font-semibold">
              *Head in immediately if your water breaks, you notice heavy bleeding, or baby movement decreases!
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 5-1-1 Alert Banner */}
      {is511RuleMet() && (
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="mt-4 p-4 rounded-2xl bg-gradient-to-r from-rose-500 to-primary-600 text-white shadow-xl flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-white/20 rounded-xl animate-bounce-gentle">
              <AlertTriangle className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="text-sm font-black uppercase tracking-wide">5-1-1 Rule Pattern Detected!</div>
              <div className="text-xs text-white/90">Time to contact your hospital or doctor.</div>
            </div>
          </div>
          <a
            href="tel:112"
            className="px-3.5 py-2 rounded-xl bg-white text-rose-600 font-bold text-xs flex items-center gap-1 shadow-md hover:bg-slate-50 active:scale-95 transition-transform"
          >
            <PhoneCall className="w-3.5 h-3.5" /> Call
          </a>
        </motion.div>
      )}

      {/* Main Stopwatch Timer Card */}
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className={`mt-4 glass-card rounded-3xl p-6 text-center relative overflow-hidden shadow-xl transition-all duration-500 border-2 ${
          isTimingContraction 
            ? 'border-rose-400 bg-rose-50/40 shadow-rose-500/20' 
            : 'border-primary-100 shadow-primary-500/10'
        }`}
      >
        <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">
          {isTimingContraction ? 'Contraction In Progress' : 'Resting Interval'}
        </div>

        {/* Digital Clock Display */}
        <div className="my-6">
          <div className={`font-mono text-5xl font-black tracking-tight transition-colors duration-300 ${
            isTimingContraction ? 'text-rose-600' : 'text-slate-800'
          }`}>
            {formatSecs(isTimingContraction ? currentDuration : currentInterval)}
          </div>
          <div className="text-xs text-slate-400 font-medium mt-1">
            {isTimingContraction ? 'Duration (MM:SS)' : 'Time since last contraction'}
          </div>
        </div>

        {/* Big Start / Stop Button */}
        <div className="flex flex-col items-center">
          {!isTimingContraction ? (
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={handleStartContraction}
              className="w-full py-4 rounded-2xl font-bold text-base text-white gradient-primary shadow-xl shadow-primary-500/30 flex items-center justify-center gap-2"
            >
              <Play className="w-5 h-5 fill-white" />
              Contraction Started
            </motion.button>
          ) : (
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={handleStopContraction}
              className="w-full py-4 rounded-2xl font-bold text-base text-white bg-rose-600 hover:bg-rose-700 shadow-xl shadow-rose-600/30 flex items-center justify-center gap-2"
            >
              <Square className="w-5 h-5 fill-white" />
              Contraction Ended
            </motion.button>
          )}
        </div>

        {/* Summary Stats Row */}
        <div className="grid grid-cols-2 gap-3 mt-6 pt-5 border-t border-slate-100">
          <div className="bg-slate-50/80 rounded-2xl p-2.5">
            <div className="text-[11px] text-slate-400 font-medium">Avg Duration</div>
            <div className="text-base font-bold text-slate-700 font-mono">
              {formatSecs(averageDuration)}
            </div>
          </div>
          <div className="bg-slate-50/80 rounded-2xl p-2.5">
            <div className="text-[11px] text-slate-400 font-medium">Total Contractions</div>
            <div className="text-base font-bold text-primary-600 font-mono">
              {contractions.length}
            </div>
          </div>
        </div>
      </motion.div>

      {/* History Log */}
      <div className="mt-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="section-title">Contraction Log</h2>
          {contractions.length > 0 && (
            <button
              onClick={handleClearHistory}
              className="text-xs text-rose-500 hover:text-rose-700 font-medium flex items-center gap-1"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Clear All
            </button>
          )}
        </div>

        {contractions.length === 0 ? (
          <div className="glass-card rounded-2xl p-6 text-center text-slate-400">
            <Timer className="w-8 h-8 mx-auto mb-2 opacity-30 text-primary-400" />
            <p className="text-sm font-medium">No contractions recorded yet</p>
            <p className="text-xs mt-1">Tap "Contraction Started" when you feel a wave tighten.</p>
          </div>
        ) : (
          <div className="space-y-2.5">
            {contractions.map((c, idx) => (
              <motion.div
                key={c.id}
                layout
                className="glass-card rounded-2xl p-3.5 flex items-center justify-between card-hover"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-primary-100 text-primary-700 font-bold text-xs flex items-center justify-center">
                    #{contractions.length - idx}
                  </div>
                  <div>
                    <div className="text-sm font-bold text-slate-800 flex items-center gap-2">
                      <span>Duration: {formatSecs(c.durationSeconds)}</span>
                      {c.durationSeconds >= 60 && (
                        <span className="badge bg-amber-100 text-amber-700 text-[10px]">~1 min</span>
                      )}
                    </div>
                    <div className="text-xs text-slate-400 mt-0.5">
                      {formatTime(c.startTime)}
                      {c.intervalSeconds && (
                        <span className="ml-2 font-medium text-slate-500">
                          (Interval: {formatSecs(c.intervalSeconds)})
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setContractions(contractions.filter(item => item.id !== c.id))}
                  className="p-1.5 text-slate-300 hover:text-rose-500 rounded-lg"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}


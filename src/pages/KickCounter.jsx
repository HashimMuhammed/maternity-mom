'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Heart, Play, Square, RotateCcw, Clock, Award, Info, Trash2, Calendar } from 'lucide-react'
import Header from '../components/Header'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { generateId, formatDate, formatTime } from '../utils/helpers'

export default function KickCounter() {
  const [sessions, setSessions] = useLocalStorage('mamabear-kick-sessions', [])
  
  // Live session state
  const [isActive, setIsActive] = useState(false)
  const [kickCount, setKickCount] = useState(0)
  const [secondsElapsed, setSecondsElapsed] = useState(0)
  const [kickTimestamps, setKickTimestamps] = useState([])
  const [isBeating, setIsBeating] = useState(false)
  const [showInfo, setShowInfo] = useState(false)

  const timerRef = useRef(null)

  // Timer loop
  useEffect(() => {
    if (isActive) {
      timerRef.current = setInterval(() => {
        setSecondsElapsed(prev => prev + 1)
      }, 1000)
    } else {
      if (timerRef.current) clearInterval(timerRef.current)
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [isActive])

  // Format MM:SS or HH:MM:SS
  const formatDuration = (totalSeconds) => {
    const mins = Math.floor(totalSeconds / 60)
    const secs = totalSeconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const handleStartSession = () => {
    setIsActive(true)
    setKickCount(0)
    setSecondsElapsed(0)
    setKickTimestamps([])
  }

  const handleKickClick = () => {
    if (!isActive) {
      setIsActive(true)
    }
    
    // Heartbeat animation trigger
    setIsBeating(true)
    setTimeout(() => setIsBeating(false), 500)

    const now = new Date()
    setKickCount(prev => prev + 1)
    setKickTimestamps(prev => [...prev, now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })])
  }

  const handleFinishSession = () => {
    if (kickCount === 0 && secondsElapsed < 5) {
      setIsActive(false)
      setSecondsElapsed(0)
      return
    }

    const newSession = {
      id: generateId(),
      date: new Date().toISOString(),
      count: kickCount,
      durationSeconds: secondsElapsed,
      reachedGoal: kickCount >= 10,
    }

    setSessions([newSession, ...sessions])
    setIsActive(false)
    setKickCount(0)
    setSecondsElapsed(0)
    setKickTimestamps([])
  }

  const handleResetSession = () => {
    setIsActive(false)
    setKickCount(0)
    setSecondsElapsed(0)
    setKickTimestamps([])
  }

  const handleDeleteSession = (id) => {
    setSessions(sessions.filter(s => s.id !== id))
  }

  const goalTarget = 10
  const progressPercent = Math.min(100, Math.round((kickCount / goalTarget) * 100))

  return (
    <div className="page-container pb-28">
      <Header 
        title="Kick Counter 💗" 
        subtitle="Track your baby's daily movements & kicks"
        showBack={true}
        rightAction={
          <button 
            onClick={() => setShowInfo(!showInfo)} 
            className="p-2 rounded-xl bg-white/60 text-primary-600 hover:bg-white"
          >
            <Info className="w-5 h-5" />
          </button>
        }
      />

      {/* Info Notice Modal / Accordion */}
      <AnimatePresence>
        {showInfo && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-3 p-4 rounded-2xl bg-lavender-50 border border-lavender-200 text-slate-700 text-xs leading-relaxed"
          >
            <div className="font-bold text-lavender-800 text-sm mb-1">Standard "Count-to-10" Rule 🩺</div>
            <p>
              Starting around week 28, doctors recommend tracking your baby’s movements at the same time each day (usually when baby is most active, often after meals).
            </p>
            <p className="mt-1">
              <strong>Healthy guideline:</strong> Count 10 distinct kicks, flutters, or rolls within 2 hours. Most moms reach 10 within 30 minutes!
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Counter Card */}
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-4 glass-card rounded-3xl p-6 text-center relative overflow-hidden shadow-xl shadow-primary-500/10 border-2 border-primary-100"
      >
        <div className="flex items-center justify-between text-xs font-semibold text-slate-400 mb-2">
          <span className="flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-primary-500" />
            Session Duration
          </span>
          <span className="font-mono text-sm text-slate-700 font-bold">
            {formatDuration(secondsElapsed)}
          </span>
        </div>

        {/* Big Heart Button with Tap Counter */}
        <div className="my-6 relative flex flex-col items-center justify-center">
          <motion.button
            whileTap={{ scale: 0.9 }}
            animate={isBeating ? { scale: [1, 1.25, 1, 1.15, 1] } : {}}
            transition={{ duration: 0.5 }}
            onClick={handleKickClick}
            className="w-40 h-40 rounded-full gradient-primary flex flex-col items-center justify-center text-white shadow-2xl shadow-primary-500/40 relative group cursor-pointer focus:outline-none"
          >
            {/* Pulsing ring during active */}
            {isActive && (
              <span className="absolute inset-0 rounded-full bg-pink-400 animate-ping opacity-25 pointer-events-none" />
            )}
            <Heart className="w-14 h-14 fill-white drop-shadow-md mb-1" />
            <span className="text-3xl font-black tracking-tight">{kickCount}</span>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-white/90">
              {kickCount === 1 ? 'Kick' : 'Kicks'}
            </span>
          </motion.button>
          
          <p className="text-xs text-slate-500 mt-4 font-medium">
            {isActive ? 'Tap the heart every time you feel baby kick!' : 'Tap heart to start counting!'}
          </p>
        </div>

        {/* Goal Progress Bar */}
        <div className="bg-slate-50 rounded-2xl p-3 border border-slate-100">
          <div className="flex justify-between items-center text-xs mb-1.5">
            <span className="font-medium text-slate-600 flex items-center gap-1">
              <Award className="w-3.5 h-3.5 text-primary-500" /> Goal: 10 Movements
            </span>
            <span className="font-bold text-primary-600">{kickCount} / 10 ({progressPercent}%)</span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-2.5 overflow-hidden">
            <motion.div 
              className="gradient-primary h-full rounded-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          {kickCount >= 10 && (
            <div className="mt-2 text-xs font-bold text-mint-600 flex items-center justify-center gap-1">
              🎉 10 Kicks Goal Reached! Great job, Mama!
            </div>
          )}
        </div>

        {/* Action Controls */}
        <div className="flex gap-2.5 mt-5">
          {!isActive && kickCount === 0 ? (
            <button
              onClick={handleStartSession}
              className="btn-primary w-full flex items-center justify-center gap-2 py-3"
            >
              <Play className="w-4 h-4 fill-white" />
              Start New Session
            </button>
          ) : (
            <>
              <button
                onClick={handleFinishSession}
                className="btn-primary flex-1 flex items-center justify-center gap-2 py-3 bg-mint-500 hover:bg-mint-600 shadow-mint-500/30"
              >
                <Square className="w-4 h-4 fill-white" />
                Finish & Save
              </button>
              <button
                onClick={handleResetSession}
                className="btn-secondary px-4 flex items-center justify-center"
              >
                <RotateCcw className="w-4 h-4 text-slate-500" />
              </button>
            </>
          )}
        </div>
      </motion.div>

      {/* Recent Kick Session History */}
      <div className="mt-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="section-title">Session History</h2>
          <span className="text-xs text-slate-400 font-medium">{sessions.length} recorded</span>
        </div>

        {sessions.length === 0 ? (
          <div className="glass-card rounded-2xl p-6 text-center text-slate-400">
            <Heart className="w-8 h-8 mx-auto mb-2 opacity-30 text-primary-400" />
            <p className="text-sm font-medium">No kick sessions logged yet</p>
            <p className="text-xs mt-1">Start tracking to monitor your baby's movement patterns daily.</p>
          </div>
        ) : (
          <div className="space-y-2.5">
            {sessions.map((session) => (
              <motion.div
                key={session.id}
                layout
                className="glass-card rounded-2xl p-3.5 flex items-center justify-between card-hover"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm ${
                    session.reachedGoal ? 'bg-mint-100 text-mint-700' : 'bg-primary-100 text-primary-700'
                  }`}>
                    {session.count}
                  </div>
                  <div>
                    <div className="text-sm font-bold text-slate-800">
                      {session.count} kicks recorded
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {formatDate(session.date)}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1 font-mono">
                        <Clock className="w-3 h-3" />
                        {formatDuration(session.durationSeconds)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {session.reachedGoal && (
                    <span className="badge bg-mint-100 text-mint-700 text-[10px]">Goal Met ⭐</span>
                  )}
                  <button
                    onClick={() => handleDeleteSession(session.id)}
                    className="p-1.5 text-slate-300 hover:text-red-500 rounded-lg hover:bg-red-50 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}


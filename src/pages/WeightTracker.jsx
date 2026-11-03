'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, Plus, Trash2, Scale, Info, Check } from 'lucide-react'
import Header from '../components/Header'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { generateId, formatDate } from '../utils/helpers'

export default function WeightTracker() {
  const [startingWeight, setStartingWeight] = useLocalStorage('mamabear-start-weight', 58)
  const [weightLogs, setWeightLogs] = useLocalStorage('mamabear-weight-logs', [
    { id: 'w1', week: 8, weight: 58.5, date: '2026-04-10' },
    { id: 'w2', week: 14, weight: 60.2, date: '2026-05-22' },
    { id: 'w3', week: 20, weight: 62.8, date: '2026-07-03' },
    { id: 'w4', week: 26, weight: 65.5, date: '2026-08-14' },
  ])

  const [newWeek, setNewWeek] = useState('28')
  const [newWeight, setNewWeight] = useState('')
  const [isEditingStart, setIsEditingStart] = useState(false)
  const [tempStart, setTempStart] = useState(startingWeight.toString())

  const latestWeight = weightLogs.length > 0 ? weightLogs[weightLogs.length - 1].weight : startingWeight
  const totalGain = Math.max(0, latestWeight - startingWeight)

  const handleAddLog = (e) => {
    e.preventDefault()
    if (!newWeight || Number(newWeight) <= 0) return

    const newEntry = {
      id: generateId(),
      week: Number(newWeek),
      weight: Number(newWeight),
      date: new Date().toISOString().split('T')[0],
    }

    const sorted = [...weightLogs, newEntry].sort((a, b) => a.week - b.week)
    setWeightLogs(sorted)
    setNewWeight('')
  }

  const handleDelete = (id) => {
    setWeightLogs(weightLogs.filter(w => w.id !== id))
  }

  return (
    <div className="page-container pb-28">
      <Header 
        title="Weight Tracker 📊" 
        subtitle="Track maternal weight gain healthy milestones"
        showBack={true}
      />

      {/* Summary Hero Card */}
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-4 rounded-3xl gradient-primary text-white p-5 shadow-xl relative overflow-hidden"
      >
        <div className="flex justify-between items-start">
          <div>
            <span className="text-white/80 text-xs font-semibold uppercase tracking-wider">Total Weight Gained</span>
            <div className="text-3xl font-black mt-1">+{totalGain.toFixed(1)} kg</div>
            <div className="text-xs text-white/80 mt-0.5">
              Current: {latestWeight} kg (Started at {startingWeight} kg)
            </div>
          </div>
          <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-md">
            <Scale className="w-7 h-7 text-white" />
          </div>
        </div>

        {/* Healthy Range Gauge */}
        <div className="mt-4 bg-white/10 rounded-2xl p-3 backdrop-blur-sm border border-white/20 text-xs">
          <div className="flex justify-between mb-1.5 font-semibold">
            <span>Recommended Full Term Gain:</span>
            <span className="text-emerald-200">11.5 - 16.0 kg</span>
          </div>
          <div className="w-full bg-white/20 rounded-full h-2 overflow-hidden">
            <div 
              className="bg-emerald-300 h-full rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, (totalGain / 16) * 100)}%` }}
            />
          </div>
          <div className="text-[10px] text-white/70 mt-1">Based on healthy pre-pregnancy BMI standards</div>
        </div>
      </motion.div>

      {/* Log New Weight Form */}
      <form onSubmit={handleAddLog} className="mt-6 glass-card rounded-3xl p-5 shadow-lg border border-primary-100">
        <h3 className="font-bold text-sm text-slate-800 mb-3 flex items-center gap-2">
          <Plus className="w-4 h-4 text-primary-500" /> Log New Weigh-In
        </h3>

        <div className="grid grid-cols-2 gap-3 mb-3">
          <div>
            <label className="text-xs font-medium text-slate-600 block mb-1">Pregnancy Week</label>
            <input
              type="number"
              min="1"
              max="42"
              value={newWeek}
              onChange={(e) => setNewWeek(e.target.value)}
              className="input-field text-sm py-2"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-slate-600 block mb-1">Weight (in kg)</label>
            <input
              type="number"
              step="0.1"
              placeholder="e.g. 64.5"
              value={newWeight}
              onChange={(e) => setNewWeight(e.target.value)}
              className="input-field text-sm py-2"
            />
          </div>
        </div>

        <button type="submit" className="btn-primary w-full py-2.5 text-xs">
          Add Weight Entry
        </button>
      </form>

      {/* History Log */}
      <div className="mt-6">
        <h2 className="section-title mb-3">Weight History Log</h2>

        <div className="space-y-2">
          {weightLogs.map((log) => {
            const diffFromStart = (log.weight - startingWeight).toFixed(1)
            return (
              <div 
                key={log.id} 
                className="glass-card rounded-2xl p-3.5 flex items-center justify-between card-hover border border-slate-100"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-mint-100 text-mint-700 font-black text-xs flex flex-col items-center justify-center">
                    <span>Wk</span>
                    <span>{log.week}</span>
                  </div>
                  <div>
                    <div className="font-bold text-slate-800 text-sm">{log.weight} kg</div>
                    <div className="text-xs text-slate-400">{formatDate(log.date)}</div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className={`text-xs font-bold ${Number(diffFromStart) >= 0 ? 'text-primary-600' : 'text-slate-500'}`}>
                    +{diffFromStart} kg
                  </span>
                  <button 
                    onClick={() => handleDelete(log.id)}
                    className="p-1.5 text-slate-300 hover:text-rose-500 rounded-lg hover:bg-slate-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}


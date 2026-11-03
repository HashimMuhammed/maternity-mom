'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { FileText, Check, Share2, Printer, Heart, Sparkles, Shield, User } from 'lucide-react'
import Header from '../components/Header'
import { useLocalStorage } from '../hooks/useLocalStorage'

export default function BirthPlan() {
  const [preferences, setPreferences] = useLocalStorage('mamabear-birth-plan', {
    birthPartner: 'Husband / Partner',
    environment: ['Dim lights', 'Calm soothing music', 'Limited visitors'],
    laborSupport: ['Freedom to walk and change positions', 'Birthing ball', 'Shower / warm water'],
    painManagement: ['Epidural when requested', 'Breathing techniques', 'Massage / counterpressure'],
    deliveryPreferences: ['Immediate skin-to-skin contact', 'Delayed cord clamping (1-2 mins)', 'Partner cuts cord'],
    newbornCare: ['Exclusive breastfeeding assistance', 'Delay first bath for 24 hours', 'Rooming in (baby stays with mom)'],
    specialRequests: 'Please explain all procedures before performing them.'
  })

  const [savedMessage, setSavedMessage] = useState(false)

  const toggleOption = (category, item) => {
    const current = preferences[category] || []
    if (current.includes(item)) {
      setPreferences({
        ...preferences,
        [category]: current.filter(i => i !== item)
      })
    } else {
      setPreferences({
        ...preferences,
        [category]: [...current, item]
      })
    }
  }

  const sections = [
    {
      key: 'environment',
      title: 'Atmosphere & Room',
      icon: '🕯️',
      options: [
        'Dim lights & calm quiet room',
        'Calm soothing music / playlist',
        'Wear own clothes during labor',
        'Limited medical staff / visitors',
        'Aromatherapy / essential oils'
      ]
    },
    {
      key: 'laborSupport',
      title: 'Labor & Movement',
      icon: '🧘‍♀️',
      options: [
        'Freedom to walk and change positions',
        'Use birthing ball / peanut ball',
        'Shower / warm water for comfort',
        'Intermittent fetal monitoring (if safe)',
        'Stay hydrated with clear fluids / ice chips'
      ]
    },
    {
      key: 'painManagement',
      title: 'Pain Relief Preferences',
      icon: '💆‍♀️',
      options: [
        'Natural / non-medical techniques first',
        'Breathing techniques & counterpressure',
        'Nitrous oxide (gas and air) if available',
        'Epidural when I request it',
        'Open to doctor recommendation as labor progresses'
      ]
    },
    {
      key: 'deliveryPreferences',
      title: 'Delivery & Golden Hour',
      icon: '✨',
      options: [
        'Immediate skin-to-skin contact with baby',
        'Delayed cord clamping (at least 60-120 seconds)',
        'Partner to cut the umbilical cord',
        'Mirror available to see baby crowning',
        'Gentle perineal warm compresses / avoid episiotomy unless necessary'
      ]
    },
    {
      key: 'newbornCare',
      title: 'Postpartum & Newborn Care',
      icon: '👶',
      options: [
        'Initiate breastfeeding within the first hour',
        'Delay baby’s first bath for 24 hours (vernix absorption)',
        'Baby to stay in mother’s room (rooming in)',
        'Vitamin K & eye drops given in mom’s presence',
        'No pacifiers or artificial formula without mom’s consent'
      ]
    }
  ]

  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="page-container pb-28">
      <Header 
        title="Birth Preferences Plan 📝" 
        subtitle="Share your ideal labor preferences with your care team"
        showBack={true}
        rightAction={
          <button 
            onClick={handlePrint}
            className="p-2 rounded-xl bg-white/60 text-primary-600 hover:bg-white shadow-sm"
          >
            <Printer className="w-5 h-5" />
          </button>
        }
      />

      <div className="mt-4 p-4 rounded-3xl bg-mint-50/60 border border-mint-200 text-xs text-mint-900 leading-relaxed">
        <span className="font-bold">Friendly reminder:</span> Birth plans are guidelines, not rigid rules! Keeping an open and flexible mindset helps ensure a positive, safe birth experience for you and baby.
      </div>

      {/* Sections */}
      <div className="mt-5 space-y-5">
        {sections.map((sec) => (
          <div key={sec.key} className="glass-card rounded-3xl p-5 shadow-lg border border-slate-100">
            <h3 className="font-bold text-sm text-slate-800 mb-3 flex items-center gap-2">
              <span className="text-xl">{sec.icon}</span>
              <span>{sec.title}</span>
            </h3>

            <div className="space-y-2">
              {sec.options.map((opt) => {
                const isSelected = (preferences[sec.key] || []).includes(opt)
                return (
                  <button
                    key={opt}
                    onClick={() => toggleOption(sec.key, opt)}
                    className={`w-full text-left p-3 rounded-2xl text-xs font-medium flex items-center gap-3 transition-all ${
                      isSelected 
                        ? 'bg-primary-50 border border-primary-200 text-primary-800 shadow-sm' 
                        : 'bg-slate-50/70 border border-slate-100 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <div className={`w-5 h-5 rounded-lg border flex items-center justify-center flex-shrink-0 transition-colors ${
                      isSelected ? 'bg-primary-500 border-primary-500 text-white' : 'border-slate-300 bg-white'
                    }`}>
                      {isSelected && <Check className="w-3.5 h-3.5" />}
                    </div>
                    <span>{opt}</span>
                  </button>
                )
              })}
            </div>
          </div>
        ))}

        {/* Special Notes & Requests */}
        <div className="glass-card rounded-3xl p-5 shadow-lg border border-slate-100">
          <h3 className="font-bold text-sm text-slate-800 mb-2 flex items-center gap-2">
            <span>💬</span> Special Medical or Cultural Requests
          </h3>
          <textarea
            rows={3}
            value={preferences.specialRequests}
            onChange={(e) => setPreferences({ ...preferences, specialRequests: e.target.value })}
            className="input-field text-xs py-2.5 resize-none leading-relaxed"
            placeholder="Any allergies, specific religious/cultural traditions, or concerns for the doctor..."
          />
        </div>
      </div>
    </div>
  )
}


'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Settings as SettingsIcon, Calendar, Heart, Shield, RotateCcw, Smartphone, Check, Sun, Moon } from 'lucide-react'
import Header from '../components/Header'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { useTheme } from '../context/ThemeContext'

export default function Settings() {
  const [dueDate, setDueDate] = useLocalStorage('mamabear-due-date', '')
  const [momName, setMomName] = useLocalStorage('mamabear-mom-name', 'Mama')
  const [savedSuccess, setSavedSuccess] = useState(false)
  const { theme, toggleTheme, isDark } = useTheme()

  const handleSave = (e) => {
    e.preventDefault()
    setSavedSuccess(true)
    setTimeout(() => setSavedSuccess(false), 2500)
  }

  const handleResetAllData = () => {
    if (window.confirm('Are you sure you want to reset all app data? This cannot be undone.')) {
      window.localStorage.clear()
      window.location.href = '/'
    }
  }

  return (
    <div className="page-container pb-28">
      <Header 
        title="Settings & Profile ⚙️" 
        subtitle="Manage due date, appearance & app preferences"
        showBack={true}
      />

      {/* Due Date & Profile Form */}
      <form onSubmit={handleSave} className="mt-4 glass-card rounded-3xl p-5 shadow-lg border border-primary-100 dark:border-slate-800">
        <h3 className="font-bold text-sm text-slate-800 dark:text-slate-100 mb-3 flex items-center gap-2">
          <Heart className="w-4 h-4 text-primary-500" /> Personal Pregnancy Info
        </h3>

        <div className="space-y-3">
          <div>
            <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 block mb-1">Your Name / Nickname</label>
            <input
              type="text"
              value={momName}
              onChange={(e) => setMomName(e.target.value)}
              className="input-field text-sm py-2"
              placeholder="e.g. Sarah"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 block mb-1">Estimated Due Date</label>
            <input
              type="date"
              required
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="input-field text-sm py-2"
            />
          </div>

          <button type="submit" className="btn-primary w-full py-2.5 text-xs flex items-center justify-center gap-1.5 mt-2">
            {savedSuccess ? (
              <>
                <Check className="w-4 h-4" /> Changes Saved!
              </>
            ) : (
              'Save Profile Settings'
            )}
          </button>
        </div>
      </form>

      {/* Theme & Appearance Switcher */}
      <div className="mt-6 glass-card rounded-3xl p-5 shadow-lg border border-slate-100 dark:border-slate-800">
        <h3 className="font-bold text-sm text-slate-800 dark:text-slate-100 mb-2 flex items-center gap-2">
          <Sun className="w-4 h-4 text-amber-500" /> Theme & Appearance
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">
          Switch between crisp white/cream background and soothing dark mode.
        </p>

        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => isDark && toggleTheme()}
            className={`p-3.5 rounded-2xl flex items-center gap-3 transition-all ${
              !isDark
                ? 'bg-primary-50 border-2 border-primary-500 text-primary-700 shadow-md shadow-primary-500/10'
                : 'bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
            }`}
          >
            <div className="p-2 rounded-xl bg-white text-amber-500 shadow-sm">
              <Sun className="w-5 h-5 fill-amber-400" />
            </div>
            <div className="text-left">
              <div className="text-xs font-bold text-slate-800 dark:text-slate-200">Light Mode</div>
              <div className="text-[10px] text-slate-400">Warm & Bright</div>
            </div>
          </button>

          <button
            type="button"
            onClick={() => !isDark && toggleTheme()}
            className={`p-3.5 rounded-2xl flex items-center gap-3 transition-all ${
              isDark
                ? 'bg-slate-800 border-2 border-primary-500 text-primary-300 shadow-md shadow-primary-500/20'
                : 'bg-slate-100 border border-slate-200 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <div className="p-2 rounded-xl bg-slate-900 text-primary-400 shadow-sm">
              <Moon className="w-5 h-5 fill-primary-400" />
            </div>
            <div className="text-left">
              <div className="text-xs font-bold text-slate-800 dark:text-slate-100">Dark Mode</div>
              <div className="text-[10px] text-slate-400">Gentle on Eyes</div>
            </div>
          </button>
        </div>
      </div>

      {/* iOS & Web PWA Installation Guide */}
      <div className="mt-6 glass-card rounded-3xl p-5 shadow-lg border border-slate-100 dark:border-slate-800">
        <h3 className="font-bold text-sm text-slate-800 dark:text-slate-100 mb-2 flex items-center gap-2">
          <Smartphone className="w-4 h-4 text-primary-500" /> Install on iPhone / iPad (iOS)
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-3 leading-relaxed">
          You can use MamaBear as a full native iOS app without downloading from the App Store:
        </p>
        <ol className="list-decimal pl-5 text-xs text-slate-600 dark:text-slate-400 space-y-1.5 leading-relaxed">
          <li>Open this app in <strong>Safari</strong> on your iPhone or iPad.</li>
          <li>Tap the <strong>Share button</strong> (square with arrow pointing up) at the bottom.</li>
          <li>Scroll down and tap <strong>"Add to Home Screen"</strong>.</li>
          <li>Tap <strong>"Add"</strong> in the top right corner. The MamaBear icon will appear on your home screen!</li>
        </ol>
      </div>

      {/* Privacy Guarantee */}
      <div className="mt-6 glass-card rounded-3xl p-5 shadow-lg border border-mint-200 dark:border-mint-900/40 bg-mint-50/40 dark:bg-mint-950/20">
        <div className="flex items-start gap-3">
          <div className="p-2.5 rounded-2xl bg-mint-100 dark:bg-mint-900/60 text-mint-700 dark:text-mint-300 flex-shrink-0">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-sm text-slate-800 dark:text-slate-100">100% Private & Device-Only</h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
              All your pregnancy logs, notes, budget calculations, and reminders are stored exclusively on your device. No third-party tracking, no medical data sales.
            </p>
          </div>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="mt-6">
        <button
          onClick={handleResetAllData}
          className="w-full p-4 rounded-2xl border border-rose-200 dark:border-rose-900/50 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 text-xs font-bold flex items-center justify-center gap-2 transition-colors"
        >
          <RotateCcw className="w-4 h-4" /> Reset All App Stored Data
        </button>
      </div>
    </div>
  )
}

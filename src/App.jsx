import React from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { ThemeProvider } from './context/ThemeContext'
import BottomNav from './components/BottomNav'

// Core Pages
import Dashboard from './pages/Dashboard'
import BabyGrowth from './pages/BabyGrowth'
import Checklist from './pages/Checklist'
import Budget from './pages/Budget'
import MoreMenu from './pages/MoreMenu'

// Extended Feature Pages
import Reminders from './pages/Reminders'
import KickCounter from './pages/KickCounter'
import ContractionTimer from './pages/ContractionTimer'
import NutritionGuide from './pages/NutritionGuide'
import Wellness from './pages/Wellness'
import Journal from './pages/Journal'
import BirthPlan from './pages/BirthPlan'
import NamesExplorer from './pages/NamesExplorer'
import EmergencyContacts from './pages/EmergencyContacts'
import WeightTracker from './pages/WeightTracker'
import Settings from './pages/Settings'

export default function App() {
  const location = useLocation()

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-cream dark:bg-slate-950 text-slate-800 dark:text-slate-100 antialiased selection:bg-pink-200 transition-colors duration-300">
        <main className="max-w-lg mx-auto min-h-screen relative">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/growth" element={<BabyGrowth />} />
            <Route path="/checklist" element={<Checklist />} />
            <Route path="/budget" element={<Budget />} />
            <Route path="/more" element={<MoreMenu />} />

            <Route path="/reminders" element={<Reminders />} />
            <Route path="/kick-counter" element={<KickCounter />} />
            <Route path="/contractions" element={<ContractionTimer />} />
            <Route path="/nutrition" element={<NutritionGuide />} />
            <Route path="/wellness" element={<Wellness />} />
            <Route path="/journal" element={<Journal />} />
            <Route path="/birth-plan" element={<BirthPlan />} />
            <Route path="/names" element={<NamesExplorer />} />
            <Route path="/emergency" element={<EmergencyContacts />} />
            <Route path="/weight" element={<WeightTracker />} />
            <Route path="/settings" element={<Settings />} />

            {/* Catch-all redirect to dashboard */}
            <Route path="*" element={<Dashboard />} />
          </Routes>

          {/* Global Bottom Navigation */}
          <BottomNav />
        </main>
      </div>
    </ThemeProvider>
  )
}

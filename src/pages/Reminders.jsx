import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Header from '../components/Header'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { generateId, formatDate, formatTime, getRelativeDay, isPast, isFuture } from '../utils/helpers'
import { Plus, Bell, Calendar, Clock, Trash2, MapPin, ChevronDown, Sparkles } from 'lucide-react'

const reminderTypes = [
  { value: 'appointment', label: 'Appointment', color: 'bg-primary-100 text-primary-700', dot: 'bg-primary-400' },
  { value: 'medication', label: 'Medication', color: 'bg-lavender-100 text-lavender-500', dot: 'bg-lavender-400' },
  { value: 'test', label: 'Test', color: 'bg-mint-100 text-mint-500', dot: 'bg-mint-400' },
  { value: 'checkup', label: 'Checkup', color: 'bg-peach-100 text-orange-700', dot: 'bg-orange-400' },
  { value: 'other', label: 'Other', color: 'bg-slate-100 text-slate-600', dot: 'bg-slate-400' },
]

const suggestedReminders = [
  { title: 'First prenatal visit', note: '8-10 weeks', type: 'appointment', icon: '👩‍⚕️' },
  { title: 'NT Scan', note: '11-14 weeks', type: 'test', icon: '🔬' },
  { title: 'Anatomy Scan', note: '18-22 weeks', type: 'test', icon: '📷' },
  { title: 'Glucose Test', note: '24-28 weeks', type: 'test', icon: '🩸' },
  { title: 'Group B Strep Test', note: '35-37 weeks', type: 'test', icon: '🧪' },
  { title: 'Weekly checkups', note: '36+ weeks', type: 'checkup', icon: '📋' },
]

const getTypeStyle = (type) => reminderTypes.find(t => t.value === type) || reminderTypes[4]

export default function Reminders() {
  const [reminders, setReminders] = useLocalStorage('mamabear-reminders', [])
  const [showForm, setShowForm] = useState(false)
  const [editId, setEditId] = useState(null)
  const [title, setTitle] = useState('')
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [type, setType] = useState('appointment')
  const [location, setLocation] = useState('')
  const [notes, setNotes] = useState('')

  const resetForm = () => {
    setTitle('')
    setDate('')
    setTime('')
    setType('appointment')
    setLocation('')
    setNotes('')
    setEditId(null)
  }

  const handleSave = () => {
    if (!title.trim() || !date) return

    const reminder = {
      id: editId || generateId(),
      title: title.trim(),
      date,
      time,
      type,
      location: location.trim(),
      notes: notes.trim(),
    }

    if (editId) {
      setReminders(prev => prev.map(r => r.id === editId ? reminder : r))
    } else {
      setReminders(prev => [...prev, reminder])
    }

    resetForm()
    setShowForm(false)
  }

  const handleDelete = (id) => {
    setReminders(prev => prev.filter(r => r.id !== id))
  }

  const handleAddSuggested = (suggestion) => {
    const today = new Date()
    const defaultDate = new Date(today.getFullYear(), today.getMonth() + 1, today.getDate())
    const reminder = {
      id: generateId(),
      title: suggestion.title,
      date: defaultDate.toISOString().split('T')[0],
      time: '10:00',
      type: suggestion.type,
      location: '',
      notes: suggestion.note,
    }
    setReminders(prev => [...prev, reminder])
  }

  const isSuggestionAdded = (suggestion) => {
    return reminders.some(r => r.title === suggestion.title)
  }

  const sortedReminders = [...reminders].sort((a, b) => {
    const dateA = new Date(`${a.date}T${a.time || '00:00'}`)
    const dateB = new Date(`${b.date}T${b.time || '00:00'}`)
    return dateA - dateB
  })

  const upcomingReminders = sortedReminders.filter(r => {
    const reminderDate = new Date(`${r.date}T${r.time || '23:59'}`)
    return isFuture(reminderDate) || reminderDate.toDateString() === new Date().toDateString()
  })

  const pastReminders = sortedReminders.filter(r => {
    const reminderDate = new Date(`${r.date}T${r.time || '23:59'}`)
    return isPast(reminderDate) && reminderDate.toDateString() !== new Date().toDateString()
  }).reverse()

  return (
    <div className="page-container bg-gradient-to-b from-cream to-primary-50/30 min-h-screen">
      <Header title="Reminders 🔔" showBack />

      {/* Add Reminder Button */}
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={() => { setShowForm(!showForm); if (showForm) resetForm() }}
        className="w-full btn-primary flex items-center justify-center gap-2 mb-6"
      >
        <Plus size={20} />
        {showForm ? 'Cancel' : 'Add Reminder'}
      </motion.button>

      {/* Add Reminder Form */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden mb-6"
          >
            <div className="glass-card rounded-3xl p-5 space-y-4">
              <h3 className="font-display font-bold text-slate-700 text-lg">
                {editId ? '✏️ Edit Reminder' : '✨ New Reminder'}
              </h3>

              {/* Title */}
              <input
                type="text"
                placeholder="Reminder title..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="input-field"
              />

              {/* Date & Time */}
              <div className="grid grid-cols-2 gap-3">
                <div className="relative">
                  <Calendar size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-primary-400" />
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="input-field pl-10 text-sm"
                  />
                </div>
                <div className="relative">
                  <Clock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-primary-400" />
                  <input
                    type="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="input-field pl-10 text-sm"
                  />
                </div>
              </div>

              {/* Type Selector */}
              <div>
                <label className="text-sm font-semibold text-slate-600 mb-2 block">Type</label>
                <div className="flex flex-wrap gap-2">
                  {reminderTypes.map(t => (
                    <button
                      key={t.value}
                      onClick={() => setType(t.value)}
                      className={`badge transition-all duration-200 ${
                        type === t.value
                          ? `${t.color} ring-2 ring-offset-1 ring-primary-300 scale-105`
                          : 'bg-slate-50 text-slate-500'
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Location */}
              <div className="relative">
                <MapPin size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-primary-400" />
                <input
                  type="text"
                  placeholder="Location (optional)"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="input-field pl-10"
                />
              </div>

              {/* Notes */}
              <textarea
                placeholder="Notes (optional)"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                className="input-field resize-none"
              />

              {/* Save Button */}
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={handleSave}
                disabled={!title.trim() || !date}
                className="w-full btn-primary disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {editId ? 'Update Reminder' : 'Save Reminder'} 💾
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Suggested Reminders */}
      <div className="mb-8">
        <h3 className="section-title flex items-center gap-2 mb-3">
          <Sparkles size={18} className="text-lavender-400" />
          Suggested Milestones
        </h3>
        <div className="flex gap-3 overflow-x-auto pb-2 -mx-1 px-1 scrollbar-hide">
          {suggestedReminders.map((suggestion, i) => {
            const added = isSuggestionAdded(suggestion)
            return (
              <motion.button
                key={i}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.08 }}
                onClick={() => !added && handleAddSuggested(suggestion)}
                disabled={added}
                className={`flex-shrink-0 glass-card rounded-2xl p-3 text-left min-w-[150px] transition-all duration-200 ${
                  added ? 'opacity-50' : 'card-hover'
                }`}
              >
                <span className="text-2xl">{suggestion.icon}</span>
                <p className="text-sm font-semibold text-slate-700 mt-1 leading-tight">{suggestion.title}</p>
                <p className="text-xs text-slate-400 mt-0.5">{suggestion.note}</p>
                {added ? (
                  <span className="badge bg-mint-100 text-mint-500 mt-2 text-[10px]">✓ Added</span>
                ) : (
                  <span className="badge bg-primary-100 text-primary-600 mt-2 text-[10px]">+ Add</span>
                )}
              </motion.button>
            )
          })}
        </div>
      </div>

      {/* Upcoming Reminders */}
      <div className="mb-8">
        <h3 className="section-title flex items-center gap-2 mb-3">
          <Bell size={18} className="text-primary-400" />
          Upcoming ({upcomingReminders.length})
        </h3>
        {upcomingReminders.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="glass-card rounded-3xl p-8 text-center"
          >
            <div className="text-5xl mb-3">📅</div>
            <p className="font-display font-bold text-slate-600">No upcoming reminders</p>
            <p className="text-sm text-slate-400 mt-1">Tap "Add Reminder" to get started!</p>
          </motion.div>
        ) : (
          <div className="space-y-3">
            <AnimatePresence>
              {upcomingReminders.map((reminder, i) => {
                const typeStyle = getTypeStyle(reminder.type)
                return (
                  <motion.div
                    key={reminder.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    transition={{ delay: i * 0.05 }}
                    className="glass-card rounded-2xl p-4 card-hover"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`w-2 h-2 rounded-full ${typeStyle.dot}`} />
                          <span className={`badge text-[10px] ${typeStyle.color}`}>{typeStyle.label}</span>
                          <span className="text-xs font-semibold text-primary-500">
                            {getRelativeDay(reminder.date)}
                          </span>
                        </div>
                        <h4 className="font-semibold text-slate-800">{reminder.title}</h4>
                        <div className="flex items-center gap-3 mt-1 text-sm text-slate-500">
                          <span className="flex items-center gap-1">
                            <Calendar size={12} />
                            {formatDate(reminder.date)}
                          </span>
                          {reminder.time && (
                            <span className="flex items-center gap-1">
                              <Clock size={12} />
                              {formatTime(`2000-01-01T${reminder.time}`)}
                            </span>
                          )}
                        </div>
                        {reminder.location && (
                          <div className="flex items-center gap-1 mt-1 text-sm text-slate-400">
                            <MapPin size={12} />
                            {reminder.location}
                          </div>
                        )}
                        {reminder.notes && (
                          <p className="text-xs text-slate-400 mt-1 line-clamp-2">{reminder.notes}</p>
                        )}
                      </div>
                      <motion.button
                        whileTap={{ scale: 0.85 }}
                        onClick={() => handleDelete(reminder.id)}
                        className="p-2 rounded-xl hover:bg-red-50 text-slate-300 hover:text-red-400 transition-colors"
                      >
                        <Trash2 size={16} />
                      </motion.button>
                    </div>
                  </motion.div>
                )
              })}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Past Reminders */}
      {pastReminders.length > 0 && (
        <div className="mb-8">
          <h3 className="section-title flex items-center gap-2 mb-3 text-slate-400">
            <Clock size={18} />
            Past ({pastReminders.length})
          </h3>
          <div className="space-y-3">
            {pastReminders.map((reminder, i) => {
              const typeStyle = getTypeStyle(reminder.type)
              return (
                <motion.div
                  key={reminder.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.6 }}
                  className="glass-card rounded-2xl p-4"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`w-2 h-2 rounded-full bg-slate-300`} />
                        <span className="badge text-[10px] bg-mint-100 text-mint-500">✓ Completed</span>
                      </div>
                      <h4 className="font-semibold text-slate-500 line-through">{reminder.title}</h4>
                      <div className="flex items-center gap-3 mt-1 text-sm text-slate-400">
                        <span className="flex items-center gap-1">
                          <Calendar size={12} />
                          {formatDate(reminder.date)}
                        </span>
                        {reminder.time && (
                          <span className="flex items-center gap-1">
                            <Clock size={12} />
                            {formatTime(`2000-01-01T${reminder.time}`)}
                          </span>
                        )}
                      </div>
                    </div>
                    <motion.button
                      whileTap={{ scale: 0.85 }}
                      onClick={() => handleDelete(reminder.id)}
                      className="p-2 rounded-xl hover:bg-red-50 text-slate-300 hover:text-red-400 transition-colors"
                    >
                      <Trash2 size={16} />
                    </motion.button>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

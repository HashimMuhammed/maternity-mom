'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  BookOpen, 
  Plus, 
  Trash2, 
  Heart, 
  Sparkles, 
  Edit3, 
  Calendar, 
  Smile, 
  ChevronRight,
  X,
  Check
} from 'lucide-react'
import Header from '../components/Header'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { generateId, formatDate } from '../utils/helpers'

export default function Journal() {
  const [entries, setEntries] = useLocalStorage('mamabear-journal', [
    {
      id: 'demo-1',
      date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      title: 'Felt your first strong kicks today! 💖',
      content: 'While listening to soft music this evening, you gave three distinct kicks right against daddy\'s hand! It was the most magical moment of our journey so far.',
      mood: '🥰',
      isLetterToBaby: true
    }
  ])

  const [isWriting, setIsWriting] = useState(false)
  const [editingId, setEditingId] = useState(null)

  // Form state
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [selectedMood, setSelectedMood] = useState('🥰')
  const [isLetter, setIsLetter] = useState(false)

  const moodPills = ['🥰', '😊', '🥹', '😴', '🤰', '✨', '🧘‍♀️']

  const letterPrompts = [
    "Dear little one, today we were thinking about...",
    "My sweetest baby, when you arrive into our world...",
    "Today mommy felt so grateful because...",
    "A funny thing happened today while preparing your room..."
  ]

  const handleOpenNew = () => {
    setEditingId(null)
    setTitle('')
    setContent('')
    setSelectedMood('🥰')
    setIsLetter(false)
    setIsWriting(true)
  }

  const handleEdit = (entry) => {
    setEditingId(entry.id)
    setTitle(entry.title)
    setContent(entry.content)
    setSelectedMood(entry.mood || '🥰')
    setIsLetter(entry.isLetterToBaby || false)
    setIsWriting(true)
  }

  const handleSaveEntry = (e) => {
    e.preventDefault()
    if (!title.trim() || !content.trim()) return

    if (editingId) {
      setEntries(entries.map(ent => {
        if (ent.id === editingId) {
          return {
            ...ent,
            title: title.trim(),
            content: content.trim(),
            mood: selectedMood,
            isLetterToBaby: isLetter,
          }
        }
        return ent
      }))
    } else {
      const newEntry = {
        id: generateId(),
        date: new Date().toISOString(),
        title: title.trim(),
        content: content.trim(),
        mood: selectedMood,
        isLetterToBaby: isLetter,
      }
      setEntries([newEntry, ...entries])
    }

    setIsWriting(false)
    setEditingId(null)
    setTitle('')
    setContent('')
  }

  const handleDelete = (id) => {
    if (window.confirm('Delete this journal entry?')) {
      setEntries(entries.filter(e => e.id !== id))
    }
  }

  return (
    <div className="page-container pb-28">
      <Header 
        title="Pregnancy Journal 📖" 
        subtitle="Cherish memories, thoughts & letters to your baby"
        showBack={true}
        rightAction={
          <button 
            onClick={handleOpenNew}
            className="p-2 rounded-xl gradient-primary text-white shadow-md shadow-primary-500/30"
          >
            <Plus className="w-5 h-5" />
          </button>
        }
      />

      {/* Writing / Editing Modal Form */}
      <AnimatePresence>
        {isWriting && (
          <motion.form
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            onSubmit={handleSaveEntry}
            className="mt-4 glass-card rounded-3xl p-5 shadow-2xl border-2 border-primary-200 relative"
          >
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-bold text-slate-800 text-sm flex items-center gap-1.5">
                <Edit3 className="w-4 h-4 text-primary-500" />
                {editingId ? 'Edit Entry' : 'New Journal Memory'}
              </h3>
              <button 
                type="button" 
                onClick={() => setIsWriting(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Letter to baby toggle */}
            <div className="flex items-center gap-2 mb-3 bg-primary-50/60 p-2.5 rounded-2xl">
              <input
                type="checkbox"
                id="isLetter"
                checked={isLetter}
                onChange={(e) => setIsLetter(e.target.checked)}
                className="rounded text-primary-500 focus:ring-primary-400"
              />
              <label htmlFor="isLetter" className="text-xs font-semibold text-primary-700 cursor-pointer flex items-center gap-1">
                💌 Write as a "Letter to Baby"
              </label>
            </div>

            {/* Mood picker */}
            <div className="mb-3">
              <label className="text-[11px] font-semibold text-slate-400 block mb-1">Select Mood</label>
              <div className="flex gap-1.5">
                {moodPills.map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setSelectedMood(m)}
                    className={`w-9 h-9 rounded-xl text-lg flex items-center justify-center transition-transform ${
                      selectedMood === m ? 'bg-primary-100 ring-2 ring-primary-400 scale-110' : 'bg-slate-100 hover:bg-slate-200'
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>

            {/* Title */}
            <div className="mb-3">
              <input
                type="text"
                required
                placeholder={isLetter ? "e.g. My first thoughts holding your picture..." : "Title of today's memory..."}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="input-field text-sm font-semibold"
              />
            </div>

            {/* Content Textarea */}
            <div className="mb-4">
              <textarea
                required
                rows={5}
                placeholder={isLetter ? letterPrompts[0] : "Write freely about how you're feeling, cravings, milestones..."}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="input-field text-sm py-3 resize-none leading-relaxed"
              />
            </div>

            <div className="flex gap-2">
              <button type="submit" className="btn-primary flex-1 py-2.5 text-xs flex items-center justify-center gap-1.5">
                <Check className="w-4 h-4" /> Save Memory
              </button>
              <button 
                type="button" 
                onClick={() => setIsWriting(false)} 
                className="btn-secondary py-2.5 text-xs"
              >
                Cancel
              </button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      {/* Entries List */}
      <div className="mt-4 space-y-4">
        {entries.length === 0 ? (
          <div className="glass-card rounded-3xl p-8 text-center text-slate-400 mt-6">
            <BookOpen className="w-10 h-10 mx-auto mb-2 opacity-30 text-primary-400" />
            <h3 className="text-sm font-bold text-slate-700">Your journal is empty</h3>
            <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
              Write letters to your baby, record sweet moments, or express thoughts to look back on years from now.
            </p>
            <button
              onClick={handleOpenNew}
              className="btn-primary mt-4 py-2.5 px-5 text-xs inline-flex items-center gap-2"
            >
              <Plus className="w-4 h-4" /> Start Writing
            </button>
          </div>
        ) : (
          entries.map((entry) => (
            <motion.div
              key={entry.id}
              layout
              className={`glass-card rounded-3xl p-5 shadow-lg border card-hover ${
                entry.isLetterToBaby ? 'border-primary-200 bg-primary-50/20' : 'border-slate-100'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{entry.mood || '🌸'}</span>
                  <div>
                    {entry.isLetterToBaby && (
                      <span className="badge bg-primary-100 text-primary-700 text-[10px] font-bold py-0.5 px-2 mb-1 inline-block">
                        💌 Letter to Baby
                      </span>
                    )}
                    <h3 className="font-bold text-slate-800 text-base leading-snug">{entry.title}</h3>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleEdit(entry)}
                    className="p-1.5 text-slate-400 hover:text-primary-500 rounded-lg hover:bg-slate-100"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(entry.id)}
                    className="p-1.5 text-slate-400 hover:text-red-500 rounded-lg hover:bg-slate-100"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Content */}
              <p className="mt-3 text-slate-600 text-sm leading-relaxed whitespace-pre-wrap font-sans">
                {entry.content}
              </p>

              {/* Footer info */}
              <div className="mt-4 pt-3 border-t border-slate-100/80 flex items-center justify-between text-xs text-slate-400">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  {formatDate(entry.date)}
                </span>
                <span className="text-primary-400 text-xs flex items-center gap-1">
                  <Heart className="w-3 h-3 fill-primary-400" /> Mama Memory
                </span>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  )
}


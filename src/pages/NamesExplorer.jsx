'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, Heart, Search, Filter } from 'lucide-react'
import Header from '../components/Header'
import { useLocalStorage } from '../hooks/useLocalStorage'

const babyNamesDatabase = [
  // Girls
  { name: 'Aaradhya', gender: 'girl', origin: 'Sanskrit', meaning: 'Worshipped; First point of praise' },
  { name: 'Ananya', gender: 'girl', origin: 'Sanskrit', meaning: 'Unique, matchless, one of a kind' },
  { name: 'Arya', gender: 'girl', origin: 'Sanskrit/Persian', meaning: 'Noble, honorable' },
  { name: 'Diya', gender: 'girl', origin: 'Hindi/Arabic', meaning: 'Bright light, radiance' },
  { name: 'Ishani', gender: 'girl', origin: 'Sanskrit', meaning: 'Consort of Shiva; Sacred light' },
  { name: 'Kavya', gender: 'girl', origin: 'Sanskrit', meaning: 'Poetry in motion, lyrical' },
  { name: 'Meera', gender: 'girl', origin: 'Sanskrit', meaning: 'Devotee, prosperous, ocean' },
  { name: 'Nyla', gender: 'girl', origin: 'Arabic', meaning: 'Winner, achiever, champion' },
  { name: 'Rhea', gender: 'girl', origin: 'Greek', meaning: 'Flowing stream, maternal earth goddess' },
  { name: 'Saanvi', gender: 'girl', origin: 'Sanskrit', meaning: 'Goddess Lakshmi, followed by fortune' },
  { name: 'Tara', gender: 'girl', origin: 'Sanskrit', meaning: 'Star, shining light of hope' },
  { name: 'Zoya', gender: 'girl', origin: 'Russian/Greek', meaning: 'Alive, loving, full of life' },

  // Boys
  { name: 'Aarav', gender: 'boy', origin: 'Sanskrit', meaning: 'Peaceful, calm, wise melody' },
  { name: 'Advik', gender: 'boy', origin: 'Sanskrit', meaning: 'Unique, without an equal' },
  { name: 'Dhruv', gender: 'boy', origin: 'Sanskrit', meaning: 'Steadfast, unwavering Pole Star' },
  { name: 'Kabir', gender: 'boy', origin: 'Arabic/Hindi', meaning: 'Great, powerful mystic poet' },
  { name: 'Leo', gender: 'boy', origin: 'Latin', meaning: 'Brave lion, courageous' },
  { name: 'Liam', gender: 'boy', origin: 'Irish', meaning: 'Strong-willed protector' },
  { name: 'Reyansh', gender: 'boy', origin: 'Sanskrit', meaning: 'First ray of sunlight, part of Lord Vishnu' },
  { name: 'Rohan', gender: 'boy', origin: 'Sanskrit', meaning: 'Ascending, blossom, flourishing' },
  { name: 'Samar', gender: 'boy', origin: 'Arabic', meaning: 'Evening conversation, joyful companion' },
  { name: 'Vivaan', gender: 'boy', origin: 'Sanskrit', meaning: 'Full of life, rays of morning sun' },
  { name: 'Zayd', gender: 'boy', origin: 'Arabic', meaning: 'Growth, abundance, prosper' },

  // Unisex
  { name: 'Amari', gender: 'unisex', origin: 'African/Hebrew', meaning: 'Eternal, gift of strength' },
  { name: 'Eden', gender: 'unisex', origin: 'Hebrew', meaning: 'Place of peace and delight' },
  { name: 'Milan', gender: 'unisex', origin: 'Sanskrit/Slavic', meaning: 'Gracious union, dear one' },
  { name: 'Noor', gender: 'unisex', origin: 'Arabic', meaning: 'Divine light, illumination' },
  { name: 'Robin', gender: 'unisex', origin: 'Germanic', meaning: 'Bright fame, gentle bird' },
  { name: 'Shiloh', gender: 'unisex', origin: 'Hebrew', meaning: 'Peace, tranquility, abundance' },
]

export default function NamesExplorer() {
  const [favoriteNames, setFavoriteNames] = useLocalStorage('mamabear-favorite-names', ['Aarav', 'Saanvi'])
  const [selectedGender, setSelectedGender] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [onlyFavorites, setOnlyFavorites] = useState(false)

  const toggleFavorite = (name) => {
    if (favoriteNames.includes(name)) {
      setFavoriteNames(favoriteNames.filter(n => n !== name))
    } else {
      setFavoriteNames([...favoriteNames, name])
    }
  }

  const filteredNames = babyNamesDatabase.filter((item) => {
    if (selectedGender !== 'all' && item.gender !== selectedGender) return false
    if (onlyFavorites && !favoriteNames.includes(item.name)) return false
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      return item.name.toLowerCase().includes(q) || 
             item.meaning.toLowerCase().includes(q) ||
             item.origin.toLowerCase().includes(q)
    }
    return true
  })

  return (
    <div className="page-container pb-28">
      <Header 
        title="Baby Names Explorer ✨" 
        subtitle="Discover lovely names & heartfelt meanings"
        showBack={true}
      />

      {/* Search Input */}
      <div className="mt-4 relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-4 top-3.5" />
        <input
          type="text"
          placeholder="Search by name, meaning, or origin..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="input-field text-xs pl-11 py-3"
        />
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 mt-3 overflow-x-auto pb-1 scrollbar-none">
        {[
          { key: 'all', label: 'All Names' },
          { key: 'girl', label: '👧 Girls' },
          { key: 'boy', label: '👦 Boys' },
          { key: 'unisex', label: '🌟 Unisex' },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setSelectedGender(tab.key)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
              selectedGender === tab.key
                ? 'gradient-primary text-white shadow-md shadow-primary-500/20'
                : 'glass-card text-slate-600 hover:bg-slate-100'
            }`}
          >
            {tab.label}
          </button>
        ))}

        <button
          onClick={() => setOnlyFavorites(!onlyFavorites)}
          className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap flex items-center gap-1 transition-all ${
            onlyFavorites
              ? 'bg-rose-500 text-white shadow-md'
              : 'glass-card text-rose-500 hover:bg-rose-50'
          }`}
        >
          <Heart className={`w-3.5 h-3.5 ${onlyFavorites ? 'fill-white' : ''}`} />
          <span>Saved ({favoriteNames.length})</span>
        </button>
      </div>

      {/* Names Grid */}
      <div className="mt-4 space-y-2.5">
        {filteredNames.length === 0 ? (
          <div className="glass-card rounded-3xl p-8 text-center text-slate-400">
            <Sparkles className="w-8 h-8 mx-auto mb-2 opacity-30 text-primary-400" />
            <p className="text-sm font-semibold">No baby names matched your filter</p>
            <p className="text-xs mt-1">Try clearing search or changing the gender filter.</p>
          </div>
        ) : (
          filteredNames.map((item) => {
            const isFav = favoriteNames.includes(item.name)
            return (
              <motion.div
                key={item.name}
                layout
                className="glass-card rounded-2xl p-4 flex items-center justify-between card-hover border border-slate-100"
              >
                <div className="flex-1 pr-3">
                  <div className="flex items-center gap-2">
                    <span className="font-display font-bold text-base text-slate-800">{item.name}</span>
                    <span className={`badge text-[10px] px-2 py-0.5 ${
                      item.gender === 'girl' ? 'bg-pink-100 text-pink-700' :
                      item.gender === 'boy' ? 'bg-sky-100 text-sky-700' : 'bg-lavender-100 text-lavender-700'
                    }`}>
                      {item.origin}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    {item.meaning}
                  </p>
                </div>

                <button
                  onClick={() => toggleFavorite(item.name)}
                  className={`p-2.5 rounded-full transition-transform active:scale-90 ${
                    isFav 
                      ? 'bg-rose-50 text-rose-500' 
                      : 'text-slate-300 hover:text-rose-400 hover:bg-slate-50'
                  }`}
                >
                  <Heart className={`w-5 h-5 ${isFav ? 'fill-rose-500' : ''}`} />
                </button>
              </motion.div>
            )
          })
        )}
      </div>
    </div>
  )
}


'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Check, 
  ShoppingBag, 
  Filter, 
  Plus, 
  Trash2, 
  Sparkles, 
  ChevronDown, 
  ChevronUp,
  Tag,
  DollarSign,
  X
} from 'lucide-react'
import { checklistData, getAllCategories } from '../data/checklistData'
import { useLocalStorage } from '../hooks/useLocalStorage'
import Header from '../components/Header'
import { formatCurrency, generateId } from '../utils/helpers'

const FILTERS = [
  { key: 'all', label: '🛍️ All' },
  { key: 'essential', label: '⭐ Essential Only' },
  { key: 'purchased', label: '✅ Purchased' },
  { key: 'remaining', label: '📋 Remaining' },
]

function CircularProgress({ size = 40, strokeWidth = 3, progress, color = 'primary' }) {
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (progress / 100) * circumference

  const colorMap = {
    primary: '#EC4899',
    lavender: '#8B5CF6',
    mint: '#10B981',
    peach: '#FB923C',
  }

  return (
    <svg width={size} height={size} className="transform -rotate-90">
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        stroke="#F3F4F6"
        strokeWidth={strokeWidth}
        fill="none"
      />
      <motion.circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        stroke={colorMap[color] || colorMap.primary}
        strokeWidth={strokeWidth}
        fill="none"
        strokeLinecap="round"
        initial={{ strokeDashoffset: circumference }}
        animate={{ strokeDashoffset: offset }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        style={{ strokeDasharray: circumference }}
      />
    </svg>
  )
}

function CheckboxItem({ 
  item, 
  isChecked, 
  onToggle, 
  customPrice, 
  onPriceChange, 
  onDeleteCustom,
  index 
}) {
  const priceValue = customPrice !== undefined && customPrice !== null && customPrice !== '' 
    ? customPrice 
    : ''

  return (
    <motion.div
      initial={{ opacity: 0, x: -15 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: Math.min(index * 0.02, 0.3), duration: 0.25 }}
      className={`flex items-center gap-3 py-2.5 px-3 rounded-xl transition-all duration-300 group
        ${isChecked ? 'bg-mint-50/50' : 'hover:bg-primary-50/30'}`}
    >
      {/* Custom Checkbox */}
      <button
        type="button"
        onClick={() => onToggle(item.id)}
        className={`relative flex-shrink-0 w-6 h-6 rounded-lg border-2 transition-all duration-300 flex items-center justify-center
          ${isChecked
            ? 'bg-gradient-to-br from-primary-400 to-primary-500 border-primary-400 shadow-md shadow-primary-500/30 scale-105'
            : 'border-slate-300 hover:border-primary-400 bg-white'
          }`}
      >
        <AnimatePresence>
          {isChecked && (
            <motion.div
              initial={{ scale: 0, rotate: -45 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, rotate: 45 }}
              transition={{ type: 'spring', stiffness: 500, damping: 25 }}
            >
              <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />
            </motion.div>
          )}
        </AnimatePresence>
      </button>

      {/* Item Details */}
      <div className="flex-1 min-w-0 pr-1">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span
            onClick={() => onToggle(item.id)}
            className={`text-sm cursor-pointer select-none transition-all duration-300 ${
              isChecked ? 'line-through text-slate-400 font-normal' : 'text-slate-700 font-medium'
            }`}
          >
            {item.name}
          </span>
          {item.essential && (
            <span className="badge bg-primary-100 text-primary-600 text-[9px] px-1.5 py-0.2">
              Essential
            </span>
          )}
          {item.isCustom && (
            <span className="badge bg-lavender-100 text-lavender-600 text-[9px] px-1.5 py-0.2">
              Custom
            </span>
          )}
        </div>
      </div>

      {/* Custom Amount Input Field */}
      <div className="flex items-center gap-1 flex-shrink-0">
        <div className={`flex items-center bg-white/90 border rounded-xl px-2 py-1 transition-all ${
          isChecked 
            ? 'border-mint-300 bg-mint-50/30 text-mint-700' 
            : 'border-slate-200 focus-within:border-primary-400 focus-within:ring-2 focus-within:ring-primary-100'
        }`}>
          <span className="text-xs font-bold text-slate-400 mr-0.5">₹</span>
          <input
            type="number"
            min="0"
            step="1"
            placeholder="Cost"
            value={priceValue}
            onChange={(e) => onPriceChange(item.id, e.target.value)}
            className="w-16 text-right text-xs font-bold text-slate-700 bg-transparent outline-none p-0 placeholder:text-slate-300 placeholder:font-normal"
          />
        </div>

        {item.isCustom && onDeleteCustom && (
          <button
            type="button"
            onClick={() => onDeleteCustom(item.id)}
            className="p-1 text-slate-300 hover:text-rose-500 rounded-lg hover:bg-rose-50 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </motion.div>
  )
}

function CategoryAccordion({ 
  category, 
  checkedItems, 
  onToggle, 
  filter, 
  customPrices, 
  onPriceChange,
  onAddCustomItem,
  onDeleteCustomItem
}) {
  const [isOpen, setIsOpen] = useState(true)
  const [showAddModal, setShowAddModal] = useState(false)
  const [newItemName, setNewItemName] = useState('')
  const [newItemPrice, setNewItemPrice] = useState('')
  const [newItemEssential, setNewItemEssential] = useState(false)

  const filteredItems = useMemo(() => {
    switch (filter) {
      case 'essential':
        return category.items.filter(item => item.essential)
      case 'purchased':
        return category.items.filter(item => checkedItems.includes(item.id))
      case 'remaining':
        return category.items.filter(item => !checkedItems.includes(item.id))
      default:
        return category.items
    }
  }, [category.items, checkedItems, filter])

  const checkedCount = category.items.filter(item => checkedItems.includes(item.id)).length
  const totalCount = category.items.length
  const progress = totalCount > 0 ? (checkedCount / totalCount) * 100 : 0

  // Subtotal of purchased items with custom amount
  const purchasedSubtotal = category.items
    .filter(item => checkedItems.includes(item.id))
    .reduce((sum, item) => sum + (Number(customPrices[item.id]) || 0), 0)

  // Total planned for this category
  const totalCategoryPlanned = category.items
    .reduce((sum, item) => sum + (Number(customPrices[item.id]) || 0), 0)

  const handleCreateItem = (e) => {
    e.preventDefault()
    if (!newItemName.trim()) return

    onAddCustomItem(category.key, {
      id: generateId(),
      name: newItemName.trim(),
      essential: newItemEssential,
      isCustom: true,
      categoryKey: category.key,
    }, newItemPrice ? Number(newItemPrice) : '')

    setNewItemName('')
    setNewItemPrice('')
    setNewItemEssential(false)
    setShowAddModal(false)
  }

  if (filteredItems.length === 0 && filter !== 'all') return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card rounded-2xl overflow-hidden card-hover mb-4 border border-slate-100"
    >
      {/* Category Header */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3.5 flex items-center justify-between transition-colors hover:bg-slate-50/50"
      >
        <div className="flex items-center gap-3">
          <span className="text-2xl">{category.icon}</span>
          <div className="text-left">
            <h3 className="font-display font-bold text-slate-800 text-sm">{category.title}</h3>
            <p className="text-xs text-slate-400">
              {checkedCount}/{totalCount} purchased
              {totalCategoryPlanned > 0 && ` • Planned: ${formatCurrency(totalCategoryPlanned)}`}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <CircularProgress progress={progress} color={category.color} size={36} strokeWidth={3} />
          {isOpen ? (
            <ChevronUp className="w-4 h-4 text-slate-400" />
          ) : (
            <ChevronDown className="w-4 h-4 text-slate-400" />
          )}
        </div>
      </button>

      {/* Accordion Content */}
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden border-t border-slate-100/70"
          >
            {/* Instruction hint */}
            <div className="px-3 pt-2 pb-1 flex justify-between items-center text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
              <span>Item Description</span>
              <span>Your Custom Cost (₹)</span>
            </div>

            <div className="px-1 pb-2 divide-y divide-slate-100/50">
              {filteredItems.map((item, i) => (
                <CheckboxItem
                  key={item.id}
                  item={item}
                  isChecked={checkedItems.includes(item.id)}
                  onToggle={onToggle}
                  customPrice={customPrices[item.id]}
                  onPriceChange={onPriceChange}
                  onDeleteCustom={item.isCustom ? () => onDeleteCustomItem(category.key, item.id) : null}
                  index={i}
                />
              ))}
            </div>

            {/* Quick Add Custom Item Button & Form */}
            <div className="px-3 pb-3 pt-1">
              {showAddModal ? (
                <form onSubmit={handleCreateItem} className="p-3 bg-primary-50/50 rounded-2xl border border-primary-200">
                  <div className="text-xs font-bold text-primary-700 mb-2 flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-primary-500" />
                    Add Custom Item to {category.title}
                  </div>
                  <div className="space-y-2">
                    <input
                      type="text"
                      required
                      placeholder="Item name (e.g., Organic Swaddle Wrap)"
                      value={newItemName}
                      onChange={(e) => setNewItemName(e.target.value)}
                      className="input-field text-xs py-2 bg-white"
                      autoFocus
                    />
                    <div className="flex gap-2">
                      <div className="flex-1 flex items-center bg-white border border-slate-200 rounded-xl px-2.5 py-1.5 focus-within:border-primary-400">
                        <span className="text-xs font-bold text-slate-400 mr-1">₹</span>
                        <input
                          type="number"
                          min="0"
                          placeholder="Custom Amount"
                          value={newItemPrice}
                          onChange={(e) => setNewItemPrice(e.target.value)}
                          className="w-full text-xs font-bold text-slate-700 bg-transparent outline-none"
                        />
                      </div>
                      <label className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-600 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={newItemEssential}
                          onChange={(e) => setNewItemEssential(e.target.checked)}
                          className="rounded text-primary-500 focus:ring-primary-400"
                        />
                        Essential
                      </label>
                    </div>
                    <div className="flex gap-2 pt-1">
                      <button type="submit" className="btn-primary flex-1 py-1.5 text-xs">
                        Add Item
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowAddModal(false)}
                        className="btn-secondary py-1.5 text-xs px-3"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </form>
              ) : (
                <button
                  type="button"
                  onClick={() => setShowAddModal(true)}
                  className="w-full py-2 px-3 rounded-xl border border-dashed border-primary-300 text-primary-600 hover:bg-primary-50/50 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Custom Item</span>
                </button>
              )}
            </div>

            {/* Category Subtotal */}
            {purchasedSubtotal > 0 && (
              <div className="px-4 py-2.5 bg-slate-50/70 border-t border-slate-100 flex justify-between items-center text-xs">
                <span className="text-slate-500 font-medium">Purchased in this category:</span>
                <span className="font-bold text-mint-600">{formatCurrency(purchasedSubtotal)}</span>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default function Checklist() {
  const [checkedItems, setCheckedItems] = useLocalStorage('mamabear-checklist-checked', [])
  const [customPrices, setCustomPrices] = useLocalStorage('mamabear-custom-prices', {})
  const [customCategoryItems, setCustomCategoryItems] = useLocalStorage('mamabear-custom-checklist-items', {})
  const [activeFilter, setActiveFilter] = useState('all')

  const baseCategories = useMemo(() => getAllCategories(), [])

  // Merge built-in items with custom user-added items
  const categories = useMemo(() => {
    return baseCategories.map(cat => {
      const addedItems = customCategoryItems[cat.key] || []
      return {
        ...cat,
        items: [...cat.items, ...addedItems]
      }
    })
  }, [baseCategories, customCategoryItems])

  const allItems = useMemo(() => {
    return categories.flatMap(cat => cat.items)
  }, [categories])

  const totalItems = allItems.length
  const purchasedCount = allItems.filter(item => checkedItems.includes(item.id)).length
  const remainingCount = totalItems - purchasedCount
  const overallProgress = totalItems > 0 ? (purchasedCount / totalItems) * 100 : 0

  // Calculate totals from custom input amounts
  const totalPlannedCustom = useMemo(() => {
    return allItems.reduce((sum, item) => sum + (Number(customPrices[item.id]) || 0), 0)
  }, [allItems, customPrices])

  const amountSpentCustom = useMemo(() => {
    return allItems
      .filter(item => checkedItems.includes(item.id))
      .reduce((sum, item) => sum + (Number(customPrices[item.id]) || 0), 0)
  }, [allItems, checkedItems, customPrices])

  const amountRemainingCustom = Math.max(0, totalPlannedCustom - amountSpentCustom)

  const handleToggle = (itemId) => {
    setCheckedItems(prev =>
      prev.includes(itemId)
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    )
  }

  const handlePriceChange = (itemId, val) => {
    const numericVal = val === '' ? '' : Math.max(0, Number(val))
    setCustomPrices(prev => ({
      ...prev,
      [itemId]: numericVal
    }))
  }

  const handleAddCustomItem = (categoryKey, itemObj, price) => {
    setCustomCategoryItems(prev => {
      const existing = prev[categoryKey] || []
      return {
        ...prev,
        [categoryKey]: [...existing, itemObj]
      }
    })

    if (price !== '' && price !== undefined) {
      setCustomPrices(prev => ({
        ...prev,
        [itemObj.id]: Number(price)
      }))
    }
  }

  const handleDeleteCustomItem = (categoryKey, itemId) => {
    setCustomCategoryItems(prev => {
      const existing = prev[categoryKey] || []
      return {
        ...prev,
        [categoryKey]: existing.filter(i => i.id !== itemId)
      }
    })

    setCustomPrices(prev => {
      const copy = { ...prev }
      delete copy[itemId]
      return copy
    })

    setCheckedItems(prev => prev.filter(id => id !== itemId))
  }

  return (
    <div className="page-container bg-cream min-h-screen pb-28">
      <Header 
        title="Checklist & Packing ✅" 
        subtitle="Check items & enter your custom amounts" 
      />

      {/* Overall Progress */}
      <motion.div
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card rounded-2xl p-4 mt-3 mb-4 shadow-sm border border-slate-100"
      >
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-4 h-4 text-primary-500" />
            <h2 className="font-display font-bold text-slate-700 text-xs uppercase tracking-wider">
              Packing & Purchase Progress
            </h2>
          </div>
          <span className="text-xs font-bold text-primary-600">
            {purchasedCount} of {totalItems} items
          </span>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
          <motion.div
            className="h-full rounded-full gradient-primary"
            initial={{ width: 0 }}
            animate={{ width: `${overallProgress}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          />
        </div>
        <div className="flex justify-between items-center text-[11px] text-slate-400 mt-1.5">
          <span>{Math.round(overallProgress)}% completed</span>
          <span>{remainingCount} items remaining</span>
        </div>
      </motion.div>

      {/* Filter Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-3 scrollbar-hide -mx-1 px-1">
        {FILTERS.map((filter) => (
          <motion.button
            key={filter.key}
            onClick={() => setActiveFilter(filter.key)}
            whileTap={{ scale: 0.95 }}
            className={`flex-shrink-0 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all duration-200
              ${activeFilter === filter.key
                ? 'gradient-primary text-white shadow-md shadow-primary-500/20'
                : 'bg-white/80 text-slate-600 border border-slate-200/60 hover:bg-slate-50'
              }`}
          >
            {filter.label}
          </motion.button>
        ))}
      </div>

      {/* Category Sections with Custom Amounts */}
      <div className="space-y-1">
        {categories.map((category) => (
          <CategoryAccordion
            key={category.key}
            category={category}
            checkedItems={checkedItems}
            onToggle={handleToggle}
            filter={activeFilter}
            customPrices={customPrices}
            onPriceChange={handlePriceChange}
            onAddCustomItem={handleAddCustomItem}
            onDeleteCustomItem={handleDeleteCustomItem}
          />
        ))}
      </div>

      {/* Summary Card with Custom Totals */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-6 rounded-3xl overflow-hidden shadow-xl shadow-primary-500/10"
      >
        <div className="gradient-primary p-5 text-white">
          <h3 className="font-display font-bold text-base mb-3 flex items-center gap-2">
            📊 Custom Budget Summary
          </h3>

          <div className="grid grid-cols-3 gap-2.5 mb-3.5">
            <div className="bg-white/15 backdrop-blur-sm rounded-2xl p-2.5 text-center">
              <p className="text-xl font-bold">{totalItems}</p>
              <p className="text-[10px] text-white/80 mt-0.5">Total Items</p>
            </div>
            <div className="bg-white/15 backdrop-blur-sm rounded-2xl p-2.5 text-center">
              <p className="text-xl font-bold">{purchasedCount}</p>
              <p className="text-[10px] text-white/80 mt-0.5">Purchased ✅</p>
            </div>
            <div className="bg-white/15 backdrop-blur-sm rounded-2xl p-2.5 text-center">
              <p className="text-xl font-bold">{remainingCount}</p>
              <p className="text-[10px] text-white/80 mt-0.5">Remaining 📋</p>
            </div>
          </div>

          <div className="space-y-2 bg-white/10 backdrop-blur-sm rounded-2xl p-3.5 text-xs">
            <div className="flex justify-between items-center">
              <span className="text-white/80">Total Planned (Custom Costs):</span>
              <span className="font-bold text-sm">
                {totalPlannedCustom > 0 ? formatCurrency(totalPlannedCustom) : '₹0 (Type costs above)'}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-white/80">Purchased Items Spent:</span>
              <span className="font-bold text-sm text-mint-200">
                {formatCurrency(amountSpentCustom)}
              </span>
            </div>
            <div className="border-t border-white/20 pt-2 flex justify-between items-center">
              <span className="text-white/90 font-medium">Remaining to Spend:</span>
              <span className="font-bold text-sm">
                {formatCurrency(amountRemainingCustom)}
              </span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

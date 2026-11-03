'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Plus, 
  Trash2, 
  TrendingDown, 
  TrendingUp, 
  PiggyBank, 
  ShoppingCart, 
  DollarSign, 
  Sparkles, 
  Edit2, 
  Check, 
  X,
  ChevronDown,
  ChevronUp,
  AlertCircle
} from 'lucide-react'
import { checklistData, getAllCategories } from '../data/checklistData'
import { useLocalStorage } from '../hooks/useLocalStorage'
import Header from '../components/Header'
import { formatCurrency, generateId, formatDate } from '../utils/helpers'

export default function Budget() {
  const [checkedItems] = useLocalStorage('mamabear-checklist-checked', [])
  const [customPrices] = useLocalStorage('mamabear-custom-prices', {})
  const [customCategoryItems] = useLocalStorage('mamabear-custom-checklist-items', {})
  const [customExpenses, setCustomExpenses] = useLocalStorage('mamabear-custom-expenses', [])
  const [targetBudget, setTargetBudget] = useLocalStorage('mamabear-budget-total', 50000)
  
  const [isEditingTarget, setIsEditingTarget] = useState(false)
  const [tempTarget, setTempTarget] = useState(targetBudget.toString())
  const [showAddExpense, setShowAddExpense] = useState(false)
  const [showTips, setShowTips] = useState(false)

  // Form state for custom expense
  const [newExpenseName, setNewExpenseName] = useState('')
  const [newExpenseAmount, setNewExpenseAmount] = useState('')
  const [newExpenseCategory, setNewExpenseCategory] = useState('Medical & Doctor')
  const [newExpenseDate, setNewExpenseDate] = useState(new Date().toISOString().split('T')[0])

  const baseCategories = useMemo(() => getAllCategories(), [])

  // Merge built-in categories with any custom-added items from Checklist
  const categories = useMemo(() => {
    return baseCategories.map(cat => {
      const addedItems = customCategoryItems[cat.key] || []
      return {
        ...cat,
        items: [...cat.items, ...addedItems]
      }
    })
  }, [baseCategories, customCategoryItems])

  // Calculate checklist stats using custom input amounts
  const { checklistTotal, checklistSpent, categoryBreakdown } = useMemo(() => {
    let total = 0
    let spent = 0
    const breakdown = {}

    categories.forEach(cat => {
      let catTotal = 0
      let catSpent = 0
      cat.items.forEach(item => {
        const itemAmount = Number(customPrices[item.id]) || 0
        catTotal += itemAmount
        total += itemAmount
        if (checkedItems.includes(item.id)) {
          catSpent += itemAmount
          spent += itemAmount
        }
      })
      breakdown[cat.key] = {
        title: cat.title,
        icon: cat.icon,
        color: cat.color,
        budgeted: catTotal,
        spent: catSpent,
        percent: catTotal > 0 ? Math.round((catSpent / catTotal) * 100) : 0
      }
    })

    return { checklistTotal: total, checklistSpent: spent, categoryBreakdown: breakdown }
  }, [categories, checkedItems, customPrices])

  // Custom expenses total
  const customSpent = useMemo(() => {
    return customExpenses.reduce((sum, item) => sum + (Number(item.amount) || 0), 0)
  }, [customExpenses])

  const grandTotalSpent = checklistSpent + customSpent
  const remainingBudget = Math.max(0, targetBudget - grandTotalSpent)
  const budgetProgressPercent = Math.min(100, Math.round((grandTotalSpent / (targetBudget || 1)) * 100))

  const handleSaveTarget = () => {
    const val = Number(tempTarget)
    if (!isNaN(val) && val >= 0) {
      setTargetBudget(val)
      setIsEditingTarget(false)
    }
  }

  const handleAddCustomExpense = (e) => {
    e.preventDefault()
    if (!newExpenseName.trim() || !newExpenseAmount || Number(newExpenseAmount) <= 0) return

    const newEntry = {
      id: generateId(),
      name: newExpenseName.trim(),
      amount: Number(newExpenseAmount),
      category: newExpenseCategory,
      date: newExpenseDate,
    }

    setCustomExpenses([newEntry, ...customExpenses])
    setNewExpenseName('')
    setNewExpenseAmount('')
    setShowAddExpense(false)
  }

  const handleDeleteExpense = (id) => {
    setCustomExpenses(customExpenses.filter(e => e.id !== id))
  }

  const budgetTips = [
    { title: 'Custom Price Flexibility', tip: 'Enter your exact store receipts and purchase costs on each checklist item to see realistic spending.' },
    { title: 'Buy Diapers in Bulk', tip: 'Subscribe & Save online saves up to 15-20% on monthly essentials.' },
    { title: 'Borrow Newborn Clothes', tip: 'Babies grow out of newborn sizes in 3-4 weeks. Friendly hand-me-downs save thousands.' },
    { title: 'Prioritize Essentials First', tip: 'Focus on car seat, safe sleep space, and feeding before decorative nursery items.' },
    { title: 'Ask for Registry Contributions', tip: 'Encourage group gifting for big-ticket items like strollers and cribs.' },
  ]

  // Donut chart calculations
  const size = 120
  const strokeWidth = 12
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (budgetProgressPercent / 100) * circumference

  return (
    <div className="page-container pb-28">
      <Header 
        title="Budget & Expenses 💰" 
        subtitle="Track maternity, custom checklist amounts & expenses"
      />

      {/* Main Budget Card */}
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-4 rounded-3xl gradient-primary text-white p-5 shadow-xl shadow-primary-500/20 relative overflow-hidden"
      >
        <div className="flex items-center justify-between">
          <div>
            <div className="text-white/80 text-xs font-medium uppercase tracking-wider">Total Planned Budget</div>
            {isEditingTarget ? (
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xl font-bold">₹</span>
                <input
                  type="number"
                  value={tempTarget}
                  onChange={(e) => setTempTarget(e.target.value)}
                  className="w-28 px-2 py-1 rounded-lg bg-white/20 text-white font-bold text-lg outline-none border border-white/40 focus:bg-white/30"
                  autoFocus
                />
                <button 
                  onClick={handleSaveTarget}
                  className="p-1.5 rounded-lg bg-white text-primary-600 hover:bg-white/90"
                >
                  <Check className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => { setIsEditingTarget(false); setTempTarget(targetBudget.toString()); }}
                  className="p-1.5 rounded-lg bg-white/20 text-white hover:bg-white/30"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2 mt-1">
                <div className="text-2xl font-black">{formatCurrency(targetBudget)}</div>
                <button 
                  onClick={() => setIsEditingTarget(true)} 
                  className="p-1 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
                >
                  <Edit2 className="w-3.5 h-3.5 text-white" />
                </button>
              </div>
            )}
          </div>

          {/* Mini Donut Chart */}
          <div className="relative flex items-center justify-center">
            <svg width={size} height={size} className="transform -rotate-90">
              <circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                stroke="rgba(255,255,255,0.25)"
                strokeWidth={strokeWidth}
                fill="none"
              />
              <circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                stroke="#FFFFFF"
                strokeWidth={strokeWidth}
                fill="none"
                strokeDasharray={circumference}
                strokeDashoffset={offset}
                strokeLinecap="round"
                className="transition-all duration-700 ease-out"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="text-lg font-black">{budgetProgressPercent}%</span>
              <span className="text-[10px] text-white/80 font-medium leading-none">Spent</span>
            </div>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-white/20">
          <div className="bg-white/10 rounded-2xl p-3 backdrop-blur-sm">
            <div className="flex items-center gap-1.5 text-xs text-white/80 mb-0.5">
              <TrendingUp className="w-3.5 h-3.5 text-pink-200" />
              <span>Total Spent</span>
            </div>
            <div className="text-lg font-bold text-white">{formatCurrency(grandTotalSpent)}</div>
            <div className="text-[10px] text-white/70">Checklist ({formatCurrency(checklistSpent)}) + Custom</div>
          </div>

          <div className="bg-white/10 rounded-2xl p-3 backdrop-blur-sm">
            <div className="flex items-center gap-1.5 text-xs text-white/80 mb-0.5">
              <PiggyBank className="w-3.5 h-3.5 text-emerald-200" />
              <span>Remaining</span>
            </div>
            <div className={`text-lg font-bold ${grandTotalSpent > targetBudget ? 'text-amber-200' : 'text-white'}`}>
              {formatCurrency(remainingBudget)}
            </div>
            <div className="text-[10px] text-white/70">
              {grandTotalSpent > targetBudget ? 'Exceeded by ' + formatCurrency(grandTotalSpent - targetBudget) : 'Within limit'}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Spending Breakdown by Category */}
      <div className="mt-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="section-title">Checklist Categories</h2>
          <span className="text-xs text-slate-500 font-medium">Custom amounts from Checklist</span>
        </div>

        <div className="space-y-3">
          {Object.entries(categoryBreakdown).map(([key, cat]) => (
            <motion.div 
              key={key}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card rounded-2xl p-3.5 card-hover"
            >
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{cat.icon}</span>
                  <span className="text-sm font-semibold text-slate-700">{cat.title}</span>
                </div>
                <div className="text-right">
                  <span className="text-sm font-bold text-slate-800">{formatCurrency(cat.spent)}</span>
                  <span className="text-xs text-slate-400"> / {formatCurrency(cat.budgeted)}</span>
                </div>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden mt-2">
                <div 
                  className={`h-full rounded-full transition-all duration-500 ${
                    cat.color === 'primary' ? 'bg-primary-500' :
                    cat.color === 'lavender' ? 'bg-lavender-500' :
                    cat.color === 'mint' ? 'bg-mint-500' : 'bg-amber-500'
                  }`}
                  style={{ width: `${Math.min(100, cat.percent)}%` }}
                />
              </div>
              <div className="flex justify-between items-center mt-1 text-[11px] text-slate-400">
                <span>{cat.percent}% purchased</span>
                <span>{formatCurrency(Math.max(0, cat.budgeted - cat.spent))} remaining</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Custom Additional Expenses */}
      <div className="mt-6">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="section-title">Other & Medical Expenses</h2>
            <p className="text-xs text-slate-500">Doctor fees, medicines, scans, photoshoot, etc.</p>
          </div>
          <button 
            onClick={() => setShowAddExpense(!showAddExpense)}
            className="btn-primary py-2 px-3 text-xs flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Expense</span>
          </button>
        </div>

        {/* Add Expense Form */}
        <AnimatePresence>
          {showAddExpense && (
            <motion.form
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              onSubmit={handleAddCustomExpense}
              className="glass-card rounded-2xl p-4 mb-4 border-2 border-primary-200 overflow-hidden"
            >
              <h3 className="font-semibold text-sm text-slate-800 mb-3 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-primary-500" />
                Add External Expense
              </h3>
              
              <div className="space-y-3">
                <div>
                  <label className="text-xs text-slate-600 font-medium block mb-1">Expense Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Doctor Consultation, Ultrasound Scan"
                    value={newExpenseName}
                    onChange={(e) => setNewExpenseName(e.target.value)}
                    className="input-field text-sm py-2"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-xs text-slate-600 font-medium block mb-1">Amount (₹)</label>
                    <input
                      type="number"
                      required
                      min="1"
                      placeholder="e.g. 1500"
                      value={newExpenseAmount}
                      onChange={(e) => setNewExpenseAmount(e.target.value)}
                      className="input-field text-sm py-2"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-600 font-medium block mb-1">Date</label>
                    <input
                      type="date"
                      value={newExpenseDate}
                      onChange={(e) => setNewExpenseDate(e.target.value)}
                      className="input-field text-sm py-2"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs text-slate-600 font-medium block mb-1">Category</label>
                  <select
                    value={newExpenseCategory}
                    onChange={(e) => setNewExpenseCategory(e.target.value)}
                    className="input-field text-sm py-2"
                  >
                    <option value="Medical & Doctor">🩺 Medical & Doctor</option>
                    <option value="Medicines & Vitamins">💊 Medicines & Vitamins</option>
                    <option value="Maternity Wear">👗 Maternity Clothes</option>
                    <option value="Maternity Photoshoot">📸 Photoshoot</option>
                    <option value="Babysitter / Help">👶 Childcare / Nanny</option>
                    <option value="Hospital Pre-booking">🏥 Hospital Deposit</option>
                    <option value="Other">✨ Other</option>
                  </select>
                </div>

                <div className="flex gap-2 pt-2">
                  <button type="submit" className="btn-primary flex-1 py-2 text-xs">
                    Save Expense
                  </button>
                  <button 
                    type="button" 
                    onClick={() => setShowAddExpense(false)}
                    className="btn-secondary py-2 text-xs"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </motion.form>
          )}
        </AnimatePresence>

        {/* Expenses List */}
        {customExpenses.length === 0 ? (
          <div className="glass-card rounded-2xl p-6 text-center text-slate-400">
            <DollarSign className="w-8 h-8 mx-auto mb-2 opacity-40 text-primary-400" />
            <p className="text-sm font-medium">No external expenses logged yet</p>
            <p className="text-xs mt-1">Track doctor consultation fees, scans, diagnostic tests, etc.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {customExpenses.map((expense) => (
              <motion.div
                key={expense.id}
                layout
                className="glass-card rounded-2xl p-3 flex items-center justify-between card-hover"
              >
                <div className="flex-1 min-w-0 pr-3">
                  <div className="text-sm font-semibold text-slate-800 truncate">{expense.name}</div>
                  <div className="flex items-center gap-2 mt-0.5 text-xs text-slate-400">
                    <span className="badge bg-lavender-50 text-lavender-700 text-[10px] py-0 px-1.5 font-normal">
                      {expense.category}
                    </span>
                    <span>{formatDate(expense.date)}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-sm font-bold text-slate-800">{formatCurrency(expense.amount)}</span>
                  <button
                    onClick={() => handleDeleteExpense(expense.id)}
                    className="p-1.5 text-slate-400 hover:text-red-500 rounded-lg hover:bg-red-50 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Money Saving Tips */}
      <div className="mt-6">
        <button
          onClick={() => setShowTips(!showTips)}
          className="w-full glass-card rounded-2xl p-4 flex items-center justify-between card-hover text-left"
        >
          <div className="flex items-center gap-2.5">
            <span className="text-xl">💡</span>
            <div>
              <div className="text-sm font-bold text-slate-800">Smart Maternity Budget Tips</div>
              <div className="text-xs text-slate-500">Ways to save ₹15,000+ on baby prep</div>
            </div>
          </div>
          {showTips ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
        </button>

        <AnimatePresence>
          {showTips && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-2 mt-2"
            >
              {budgetTips.map((tip, idx) => (
                <div key={idx} className="glass-card rounded-2xl p-3 bg-mint-50/40 border border-mint-100">
                  <div className="text-xs font-bold text-mint-700 flex items-center gap-1.5">
                    <span>✨</span> {tip.title}
                  </div>
                  <div className="text-xs text-slate-600 mt-1 leading-relaxed">{tip.tip}</div>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

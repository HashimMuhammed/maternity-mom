import { differenceInDays, differenceInWeeks, addDays, format, isToday, isTomorrow, isPast, isFuture } from 'date-fns'

export function parseLocalDate(dateInput) {
  if (!dateInput) return null
  if (typeof dateInput === 'string' && dateInput.includes('-')) {
    const parts = dateInput.split('T')[0].split('-').map(Number)
    return new Date(parts[0], parts[1] - 1, parts[2], 0, 0, 0, 0)
  }
  const d = new Date(dateInput)
  return new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0, 0)
}

export function calculateWeeksPregnant(dueDate) {
  if (!dueDate) return { weeks: 0, days: 0, totalDays: 0 }
  const due = parseLocalDate(dueDate)
  if (!due || isNaN(due.getTime())) return { weeks: 0, days: 0, totalDays: 0 }

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const lmp = addDays(due, -280)
  const totalDays = differenceInDays(today, lmp)
  const weeks = Math.floor(totalDays / 7)
  const days = Math.max(0, totalDays % 7)

  return {
    weeks: Math.max(0, Math.min(42, weeks)),
    days: Math.max(0, Math.min(6, days)),
    totalDays: Math.max(0, totalDays),
  }
}

export function getDaysUntilDue(dueDate) {
  if (!dueDate) return 0
  const due = parseLocalDate(dueDate)
  if (!due || isNaN(due.getTime())) return 0
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return differenceInDays(due, today)
}

export function getTrimester(weeks) {
  if (weeks <= 12) return { number: 1, label: 'First Trimester', color: 'mint' }
  if (weeks <= 27) return { number: 2, label: 'Second Trimester', color: 'lavender' }
  return { number: 3, label: 'Third Trimester', color: 'primary' }
}

export function getProgressPercent(weeks) {
  return Math.min(100, Math.round((weeks / 40) * 100))
}

export function formatCurrency(amount) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount)
}

export function formatDate(date) {
  return format(new Date(date), 'MMM dd, yyyy')
}

export function formatTime(date) {
  return format(new Date(date), 'hh:mm a')
}

export function formatDateTime(date) {
  return format(new Date(date), 'MMM dd, yyyy hh:mm a')
}

export function getRelativeDay(date) {
  const d = new Date(date)
  if (isToday(d)) return 'Today'
  if (isTomorrow(d)) return 'Tomorrow'
  return format(d, 'EEE, MMM dd')
}

export function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2)
}

export { isToday, isTomorrow, isPast, isFuture, format, addDays, differenceInDays }


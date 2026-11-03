export const nutritionData = {
  trimester1: {
    title: 'First Trimester',
    calories: '~1800 cal/day',
    keyNutrients: [
      { name: 'Folic Acid', amount: '600 mcg/day', foods: ['Spinach', 'Lentils', 'Fortified cereals', 'Oranges'], icon: '🥬' },
      { name: 'Iron', amount: '27 mg/day', foods: ['Red meat', 'Spinach', 'Beans', 'Dried fruits'], icon: '🥩' },
      { name: 'Vitamin B6', amount: '1.9 mg/day', foods: ['Bananas', 'Chicken', 'Potatoes', 'Fish'], icon: '🍌' },
      { name: 'Calcium', amount: '1000 mg/day', foods: ['Milk', 'Yogurt', 'Cheese', 'Almonds'], icon: '🥛' },
    ],
    avoid: ['Raw fish/sushi', 'Unpasteurized dairy', 'Raw eggs', 'Excess caffeine (>200mg)', 'Alcohol', 'Deli meats'],
  },
  trimester2: {
    title: 'Second Trimester',
    calories: '~2200 cal/day',
    keyNutrients: [
      { name: 'Protein', amount: '71g/day', foods: ['Eggs', 'Chicken', 'Fish', 'Paneer', 'Lentils'], icon: '🥚' },
      { name: 'Omega-3 DHA', amount: '200-300 mg/day', foods: ['Salmon', 'Walnuts', 'Chia seeds', 'Flaxseed'], icon: '🐟' },
      { name: 'Vitamin D', amount: '600 IU/day', foods: ['Sunlight', 'Fortified milk', 'Eggs', 'Mushrooms'], icon: '☀️' },
      { name: 'Fiber', amount: '28g/day', foods: ['Whole grains', 'Fruits', 'Vegetables', 'Oats'], icon: '🌾' },
    ],
    avoid: ['Raw sprouts', 'High-mercury fish (shark, swordfish)', 'Excess sugar', 'Raw shellfish'],
  },
  trimester3: {
    title: 'Third Trimester',
    calories: '~2400 cal/day',
    keyNutrients: [
      { name: 'Vitamin K', amount: '90 mcg/day', foods: ['Broccoli', 'Kale', 'Spinach', 'Brussels sprouts'], icon: '🥦' },
      { name: 'Vitamin C', amount: '85 mg/day', foods: ['Oranges', 'Bell peppers', 'Strawberries', 'Tomatoes'], icon: '🍊' },
      { name: 'Magnesium', amount: '360 mg/day', foods: ['Dark chocolate', 'Avocados', 'Nuts', 'Seeds'], icon: '🥜' },
      { name: 'Choline', amount: '450 mg/day', foods: ['Eggs', 'Meat', 'Soybeans', 'Cauliflower'], icon: '🥚' },
    ],
    avoid: ['Papaya (raw/unripe)', 'Pineapple (excess)', 'Excess salt', 'Artificial sweeteners'],
  }
}

export const exerciseData = [
  { name: 'Walking', duration: '30 min', frequency: 'Daily', trimester: [1, 2, 3], icon: '🚶‍♀️',
    description: 'Safe throughout pregnancy. Low-impact cardio that keeps you active.' },
  { name: 'Prenatal Yoga', duration: '30-45 min', frequency: '3-4x/week', trimester: [1, 2, 3], icon: '🧘‍♀️',
    description: 'Improves flexibility, reduces stress, and prepares body for labor.' },
  { name: 'Swimming', duration: '30 min', frequency: '3x/week', trimester: [1, 2, 3], icon: '🏊‍♀️',
    description: 'Great full-body workout. Water supports your growing belly.' },
  { name: 'Pelvic Floor Exercises', duration: '10 min', frequency: 'Daily', trimester: [1, 2, 3], icon: '💪',
    description: 'Kegel exercises strengthen muscles for delivery and recovery.' },
  { name: 'Prenatal Pilates', duration: '30 min', frequency: '2-3x/week', trimester: [1, 2], icon: '🤸‍♀️',
    description: 'Strengthens core and improves posture. Modify in third trimester.' },
  { name: 'Squats', duration: '10 min', frequency: '3-4x/week', trimester: [2, 3], icon: '🏋️‍♀️',
    description: 'Opens pelvis and strengthens legs for labor.' },
  { name: 'Breathing Exercises', duration: '15 min', frequency: 'Daily', trimester: [3], icon: '🌬️',
    description: 'Practice labor breathing techniques. Reduces anxiety.' },
]

export const moodOptions = [
  { emoji: '😊', label: 'Happy', color: '#10B981' },
  { emoji: '😴', label: 'Tired', color: '#8B5CF6' },
  { emoji: '🤢', label: 'Nauseous', color: '#F59E0B' },
  { emoji: '😟', label: 'Anxious', color: '#EF4444' },
  { emoji: '😢', label: 'Emotional', color: '#3B82F6' },
  { emoji: '🥰', label: 'Loved', color: '#EC4899' },
  { emoji: '😤', label: 'Frustrated', color: '#F97316' },
  { emoji: '🤗', label: 'Excited', color: '#14B8A6' },
  { emoji: '😌', label: 'Calm', color: '#6366F1' },
  { emoji: '💪', label: 'Strong', color: '#84CC16' },
]

export const waterGoalMl = 2500


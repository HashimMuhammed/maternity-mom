import { useState } from 'react'
import { motion } from 'framer-motion'
import Header from '../components/Header'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { calculateWeeksPregnant, getTrimester } from '../utils/helpers'
import { nutritionData, exerciseData } from '../data/wellnessData'
import { Apple, Dumbbell, AlertTriangle, Flame, Utensils, Coffee, Sun, Moon } from 'lucide-react'

const mealIdeas = {
  trimester1: {
    breakfast: ['Whole grain toast with avocado 🥑', 'Oatmeal with berries & nuts 🫐', 'Smoothie with banana, spinach & yogurt 🥤'],
    lunch: ['Lentil soup with whole wheat bread 🍲', 'Grilled chicken salad with quinoa 🥗', 'Paneer wrap with mixed veggies 🌯'],
    dinner: ['Baked salmon with steamed veggies 🐟', 'Dal with brown rice & raita 🍛', 'Chicken stir-fry with noodles 🍜'],
    snacks: ['Apple slices with peanut butter 🍎', 'Trail mix with dried fruits 🥜', 'Yogurt with honey & granola 🍯'],
  },
  trimester2: {
    breakfast: ['Egg omelette with vegetables 🥚', 'Protein pancakes with maple syrup 🥞', 'Greek yogurt parfait with fruits 🫐'],
    lunch: ['Chickpea & vegetable curry with rice 🍛', 'Turkey & avocado sandwich 🥪', 'Pasta with tomato basil sauce 🍝'],
    dinner: ['Grilled fish with sweet potato 🐟', 'Palak paneer with roti 🥘', 'Lean beef stew with vegetables 🍲'],
    snacks: ['Hummus with carrot sticks 🥕', 'Cheese & whole grain crackers 🧀', 'Dates stuffed with almonds 🌴'],
  },
  trimester3: {
    breakfast: ['Chia seed pudding with mango 🥭', 'Whole grain cereal with milk 🥣', 'Scrambled eggs with spinach toast 🍳'],
    lunch: ['Quinoa bowl with roasted vegetables 🥙', 'Bean & cheese burrito 🌯', 'Mushroom soup with garlic bread 🍄'],
    dinner: ['Baked chicken with broccoli 🥦', 'Tofu stir-fry with brown rice 🍚', 'Fish curry with steamed rice 🐠'],
    snacks: ['Mixed nuts & seeds 🥜', 'Banana with almond butter 🍌', 'Fresh fruit smoothie 🍓'],
  },
}

const mealIcons = { breakfast: '🌅', lunch: '☀️', dinner: '🌙', snacks: '🍿' }

export default function NutritionGuide() {
  const [dueDate] = useLocalStorage('mamabear-due-date', null)
  const [activeTab, setActiveTab] = useState('nutrition')

  const { weeks } = calculateWeeksPregnant(dueDate)
  const currentTrimester = getTrimester(weeks)
  const [selectedTrimester, setSelectedTrimester] = useState(currentTrimester.number)

  const trimesterKey = `trimester${selectedTrimester}`
  const currentNutrition = nutritionData[trimesterKey]
  const currentMeals = mealIdeas[trimesterKey]

  const filteredExercises = exerciseData.filter(e => e.trimester.includes(selectedTrimester))

  const nutrientBgColors = [
    'bg-primary-50 border-primary-100',
    'bg-lavender-50 border-lavender-100',
    'bg-mint-50 border-mint-100',
    'bg-peach-50 border-peach-100',
  ]

  return (
    <div className="page-container min-h-screen pb-28">
      <Header title="Nutrition Guide 🥗" showBack />

      {/* Tab Selector */}
      <div className="glass-card rounded-2xl p-1.5 flex gap-1 mb-6">
        {[
          { key: 'nutrition', label: '🥗 Nutrition', icon: Apple },
          { key: 'exercise', label: '💪 Exercise', icon: Dumbbell },
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ${
              activeTab === tab.key
                ? 'gradient-primary text-white shadow-lg shadow-primary-500/20'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Trimester Selector */}
      <div className="flex gap-2 mb-6">
        {[1, 2, 3].map(t => {
          const colors = {
            1: { active: 'bg-mint-400 text-white shadow-mint-400/30', inactive: 'bg-mint-50 text-mint-500' },
            2: { active: 'bg-lavender-400 text-white shadow-lavender-400/30', inactive: 'bg-lavender-50 text-lavender-500' },
            3: { active: 'bg-primary-400 text-white shadow-primary-400/30', inactive: 'bg-primary-50 text-primary-500' },
          }
          const isActive = selectedTrimester === t
          return (
            <motion.button
              key={t}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedTrimester(t)}
              className={`flex-1 py-2.5 rounded-2xl text-sm font-semibold transition-all duration-300 ${
                isActive
                  ? `${colors[t].active} shadow-lg`
                  : `${colors[t].inactive}`
              }`}
            >
              {t === currentTrimester.number && '• '}
              T{t} {t === 1 ? '(1-12w)' : t === 2 ? '(13-27w)' : '(28-40w)'}
            </motion.button>
          )
        })}
      </div>

      {activeTab === 'nutrition' ? (
        <motion.div
          key={`nutrition-${selectedTrimester}`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Calorie Target */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card rounded-3xl p-5 flex items-center gap-4"
          >
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-peach-100 to-peach-200 flex items-center justify-center">
              <Flame size={28} className="text-orange-500" />
            </div>
            <div>
              <p className="text-sm text-slate-500 font-medium">Daily Calorie Target</p>
              <p className="text-2xl font-display font-bold text-slate-800">{currentNutrition.calories}</p>
              <p className="text-xs text-slate-400">{currentNutrition.title}</p>
            </div>
          </motion.div>

          {/* Key Nutrients */}
          <div>
            <h3 className="section-title mb-3">🌿 Key Nutrients</h3>
            <div className="grid grid-cols-2 gap-3">
              {currentNutrition.keyNutrients.map((nutrient, i) => (
                <motion.div
                  key={nutrient.name}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                  className={`rounded-2xl p-4 border ${nutrientBgColors[i % 4]}`}
                >
                  <div className="text-2xl mb-1">{nutrient.icon}</div>
                  <h4 className="font-bold text-slate-700 text-sm">{nutrient.name}</h4>
                  <p className="text-xs text-slate-500 font-semibold mt-0.5">{nutrient.amount}</p>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {nutrient.foods.map(food => (
                      <span key={food} className="text-[10px] bg-white/70 rounded-full px-2 py-0.5 text-slate-500">
                        {food}
                      </span>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Foods to Avoid */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h3 className="section-title mb-3">🚫 Foods to Avoid</h3>
            <div className="rounded-2xl bg-red-50/80 border border-red-100 p-4">
              <div className="flex items-center gap-2 mb-3">
                <AlertTriangle size={18} className="text-red-400" />
                <span className="text-sm font-semibold text-red-600">Be careful with these foods</span>
              </div>
              <div className="space-y-2">
                {currentNutrition.avoid.map(food => (
                  <div key={food} className="flex items-center gap-2 text-sm text-red-700">
                    <span>⚠️</span>
                    <span>{food}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Meal Ideas */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <h3 className="section-title mb-3">🍽️ Meal Ideas</h3>
            <div className="space-y-3">
              {Object.entries(currentMeals).map(([meal, ideas]) => (
                <div key={meal} className="glass-card rounded-2xl p-4">
                  <h4 className="font-semibold text-slate-700 capitalize flex items-center gap-2 mb-2">
                    <span className="text-lg">{mealIcons[meal]}</span>
                    {meal}
                  </h4>
                  <div className="space-y-1.5">
                    {ideas.map((idea, i) => (
                      <p key={i} className="text-sm text-slate-600 pl-2 border-l-2 border-primary-200">
                        {idea}
                      </p>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      ) : (
        /* Exercise Tab */
        <motion.div
          key={`exercise-${selectedTrimester}`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          {filteredExercises.length === 0 ? (
            <div className="glass-card rounded-3xl p-8 text-center">
              <div className="text-5xl mb-3">🧘‍♀️</div>
              <p className="font-display font-bold text-slate-600">No exercises for this trimester</p>
            </div>
          ) : (
            filteredExercises.map((exercise, i) => {
              const intensityColors = {
                Daily: 'bg-mint-100 text-mint-500',
                '3-4x/week': 'bg-lavender-100 text-lavender-500',
                '3x/week': 'bg-primary-100 text-primary-600',
                '2-3x/week': 'bg-peach-100 text-orange-600',
              }
              const freqColor = intensityColors[exercise.frequency] || 'bg-slate-100 text-slate-600'

              return (
                <motion.div
                  key={exercise.name}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                  className="glass-card rounded-2xl p-4 card-hover"
                >
                  <div className="flex items-start gap-3">
                    <div className="text-3xl">{exercise.icon}</div>
                    <div className="flex-1">
                      <h4 className="font-bold text-slate-800">{exercise.name}</h4>
                      <p className="text-sm text-slate-500 mt-1">{exercise.description}</p>
                      <div className="flex items-center gap-2 mt-2 flex-wrap">
                        <span className="badge bg-slate-100 text-slate-600 text-[10px]">
                          ⏱ {exercise.duration}
                        </span>
                        <span className={`badge text-[10px] ${freqColor}`}>
                          📅 {exercise.frequency}
                        </span>
                        {exercise.trimester.map(t => (
                          <span key={t} className={`badge text-[10px] ${
                            t === selectedTrimester
                              ? 'bg-primary-100 text-primary-600'
                              : 'bg-slate-50 text-slate-400'
                          }`}>
                            T{t}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )
            })
          )}

          {/* Safety Disclaimer */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="rounded-2xl bg-lavender-50 border border-lavender-100 p-4 mt-6"
          >
            <div className="flex items-start gap-3">
              <AlertTriangle size={20} className="text-lavender-500 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-lavender-500 text-sm">Safety Disclaimer ⚕️</h4>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Always consult your healthcare provider before starting or modifying any exercise routine during pregnancy.
                  Stop immediately if you feel dizzy, short of breath, or experience any pain. Listen to your body — every
                  pregnancy is unique! 💜
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  )
}

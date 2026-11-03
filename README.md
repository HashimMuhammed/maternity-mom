# 🌸 MamaBear – Complete Maternity & Pregnancy Companion App

A maternal companion web app and iOS Progressive Web App (PWA) designed for expecting mothers. It combines medical recommendations (ACOG/WHO guidelines) with an aesthetic interface crafted in warm pastels, glassmorphism cards, and fluid animations.

---

## ✨ Features Overview

### 1. 👶 Week-by-Week Baby Growth & Milestones
- **Weekly Progress (Weeks 4 to 41)**: Visual fruit/vegetable size comparisons (from a poppy seed up to a sweet pumpkin and jackfruit) with animated illustrations.
- **Physical Development Highlights**: Week-by-week anatomical and sensory milestones (heartbeat, fingerprint formation, hearing voices, lung maturation).
- **Maternal Symptom Guide**: Anticipate trimester-specific physical changes, cravings, and physiological shifts.
- **Doctor-Approved Weekly Tips**: Hydration, prenatal vitamins, sleep positions, and pelvic floor strengthening advice.

### 2. 🏥 Hospital Appointments & Medical Reminders
- **Preloaded Screening Milestones**: First prenatal ultrasound (8–10 weeks), Nuchal Translucency / NT Scan (11–14 weeks), Anomaly / TIFFA Scan (18–22 weeks), Glucose Challenge Test (24–28 weeks), and Group B Strep screening (35–37 weeks).
- **Custom Reminders**: Set medication, doctor consultation, ultrasound, and vaccination appointments with date, time, and hospital location.
- **Status & Categorization**: Smart grouping into "Upcoming" and "Past Checkups".

### 3. 🎒 Hospital Bag Packing & Baby Essentials Checklist
- **Pre-sorted Categories**:
  - 👜 **Mom's Hospital Bag**: Postpartum pads, nursing gowns, nursing bras, toiletries, documents, nipple cream, and going-home outfit.
  - 👶 **Baby's Hospital Bag**: Newborn onesies, swaddles, diapers, scratch mittens, caps, and approved car seat.
  - 🏠 **Nursery Essentials**: Crib, firm mattress, baby monitor, blackout curtains, room thermometer.
  - 🍼 **Feeding Essentials**: Nursing pillow, manual/electric breast pump, storage bags, sterilizer, bottles.
  - 🛁 **Bath & Grooming**: Infant tub, digital thermometer, nail clippers, nasal aspirator.
  - 🚗 **Travel & Outings**: Stroller, baby carrier/wrap, diaper caddy bag.
  - 🩺 **Health & Safety**: First aid essentials, vitamin D drops, socket covers.
- **Essential vs. Optional Filter**: Mark items as purchased with 1-tap checkboxes.

### 4. 💰 Comprehensive Maternity & Baby Budget Planner
- **Target Budget vs. Actual Spent**: Visual SVG ring chart tracking total expenditures against your personal financial plan.
- **Checklist Integration**: Auto-computes spent amounts directly as you check off items from the hospital packing list.
- **Custom Expense Tracker**: Record doctor consultation charges, diagnostic blood scans, maternity photoshoot sessions, nursery furniture, and pediatrician bills.
- **Smart Money-Saving Tips**: Insider guidance on bulk diaper subscriptions, newborn clothing rotations, and registry strategies.

### 5. 💗 Fetal Movement & Kick Counter (Count-to-10 Rule)
- **Interactive Heart Counter**: Touch-sensitive pulsing heart animation to record every kick and flutter.
- **Real-Time Session Timer**: Stopwatch timing to track how quickly baby reaches the standard 10 movements.
- **Session History Log**: Stores timestamped kick logs to share movement trends with your OB-GYN.

### 6. ⏱️ Contraction Timer & 5-1-1 Hospital Alert
- **Digital Contraction Stopwatch**: Record start time, duration, and rest intervals with high precision.
- **5-1-1 Rule Alert Engine**: Automatically alerts you when contractions are 5 minutes apart, lasting 1 minute, for at least 1 hour.
- **Emergency Dialing**: Instant call button connected directly to your hospital labor triage.

### 7. 🥗 Trimester Nutrition & Safe Prenatal Exercise
- **Trimester Diet Guides**: Nutrient goals (Folic acid, Iron, Calcium, DHA Omega-3, Choline, Magnesium) with specific food sources.
- **Foods to Avoid**: Red-flag warnings for unpasteurized cheeses, raw fish, high-mercury seafood, and excess caffeine.
- **Safe Prenatal Workouts**: Walking, prenatal yoga, swimming, and Kegel pelvic floor exercises tailored by trimester.

### 8. 🧘‍♀️ Daily Mood, Hydration & Wellness Tracker
- **8-Glass Water Tracker**: Interactive visual water glasses with daily hydration goal tracking.
- **Sleep & Rest Log**: Hours of sleep and quality star ratings.
- **Symptom Tracker**: Rapid multi-tag logging for nausea, fatigue, swelling, back pain, and pregnancy glow.
- **Daily Uplifting Affirmation**: Gentle affirmations for peace and strength.

### 9. 💌 Dear Baby Journal & Pregnancy Memories
- **Letters to Baby**: Dedicated mode to write letters for your child to read in the future.
- **Mood Tagging**: Capture the emotion and milestone behind each memory.

### 10. 📝 Interactive Birth Preferences Plan
- **Customizable Preferences**: Atmosphere (lighting, music), labor movement (birthing ball, walking), pain management (epidural, natural), golden hour care (delayed cord clamping, immediate skin-to-skin).
- **Printable**: Formatted for printing or sharing directly with your doctor and doula.

### 11. ✨ Baby Names Explorer
- **Database of 30+ Handpicked Names**: Sanskrit, Arabic, Greek, Latin, and Hebrew origins with deep meanings.
- **Filters**: Filter by Boy, Girl, or Unisex, or search by keyword and origin.
- **Favorites**: Heart your top choices into a saved shortlist.

### 12. 🚨 Emergency Care Team Card
- **1-Tap Quick Dial**: Pre-configured for your OB-GYN, Hospital Labor Ward, Partner, and Emergency Ambulance (112).
- **Triage Medical Summary**: Critical snapshot of Blood Type, Rh status, Allergies, and GBS test status.
- **Directions Navigation**: One tap launches Google Maps directions straight to your hospital maternity entrance.

### 13. 📊 Maternal Weight Gain Tracker
- Log weight throughout pregnancy weeks against healthy IOM/ACOG BMI guidelines.

---

## 📱 How to Run & Install on iOS & Web

### Running Locally (Web)
1. In the terminal:
   ```bash
   cd "/home/hashim/Projects/Maternity Mom"
   export PATH="/home/hashim/Projects/Maternity Mom/.node/bin:$PATH"
   npm run dev
   ```
2. Open `http://localhost:5173` in your browser.

### Installing on iPhone / iPad (iOS Safari PWA)
1. Open the hosted or local network URL in **Safari** on your iOS device.
2. Tap the **Share** button (the square with an arrow pointing up at the bottom of the screen).
3. Scroll down the sheet and select **"Add to Home Screen"**.
4. Tap **"Add"** in the top-right corner.
5. The **MamaBear** icon will now appear on your iPhone home screen! It launches in full-screen standalone mode with no browser URL bars, complete with iOS safe-area notch and home indicator support.

### 🔒 100% Privacy & Offline Support
- All your pregnancy journal entries, budget figures, reminders, and medical records are stored strictly on your local device via `localStorage`.
- No servers or third parties have access to your personal health and pregnancy data.


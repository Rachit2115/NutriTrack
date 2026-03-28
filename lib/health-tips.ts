// Array of health tips
const healthTips = [
  "Drink at least 8 glasses of water daily for optimal hydration.",
  "Aim for 7-9 hours of quality sleep each night.",
  "Include at least 30 minutes of physical activity in your day.",
  "Eat a variety of colorful fruits and vegetables daily.",
  "Practice mindful eating by slowing down and savoring each bite.",
  "Reduce added sugar in your diet to improve overall health.",
  "Include protein with each meal to help maintain muscle mass.",
  "Take short breaks from sitting every 30 minutes.",
  "Practice deep breathing exercises to reduce stress.",
  "Plan and prepare meals ahead of time to make healthier choices.",
  "Keep healthy snacks on hand to avoid unhealthy options.",
  "Read nutrition labels to make informed food choices.",
  "Limit processed foods in your diet.",
  "Track your food intake to stay aware of what you're consuming.",
  "Listen to your body's hunger and fullness cues.",
  "Stay consistent with your eating schedule.",
  "Include strength training in your exercise routine at least twice a week.",
  "Don't skip breakfast to fuel your day properly.",
  "Choose whole grains over refined grains when possible.",
  "Limit alcohol consumption for better health.",
  "Include healthy fats like avocados, nuts, and olive oil in your diet.",
  "Stay active throughout the day, not just during workouts.",
  "Practice portion control even with healthy foods.",
  "Prioritize protein-rich foods after workouts for recovery.",
  "Stay hydrated before, during, and after exercise.",
  "Set realistic health goals that are achievable and sustainable.",
  "Focus on nutrition rather than just calories.",
  "Take time to de-stress daily for better mental and physical health.",
  "Get regular health check-ups to monitor your overall well-being.",
  "Remember that small, consistent changes lead to long-term results.",
]

/**
 * Get today's tip
 * Based on the day of the year to ensure the same tip is shown all day
 */
export function getTodayTip(): string {
  const now = new Date()
  const startOfYear = new Date(now.getFullYear(), 0, 0)
  const diff = now.getTime() - startOfYear.getTime()
  const dayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24))

  const tipIndex = dayOfYear % healthTips.length
  return healthTips[tipIndex]
}

/**
 * Get a specific number of random tips
 */
export function getRandomTips(count: number): string[] {
  // Create a copy of the array to avoid modifying the original
  const tipsCopy = [...healthTips]
  const randomTips: string[] = []

  // Get random tips, ensuring no duplicates
  for (let i = 0; i < count && tipsCopy.length > 0; i++) {
    const randomIndex = Math.floor(Math.random() * tipsCopy.length)
    randomTips.push(tipsCopy[randomIndex])
    tipsCopy.splice(randomIndex, 1)
  }

  return randomTips
}


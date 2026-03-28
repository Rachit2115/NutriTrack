/**
 * AI Nutritionist Service
 * Generates personalized meal plans and health tips based on user profile data
 */

/**
 * Call Google AI API via server-side route to generate personalized meal suggestions
 */
async function generateAIMealWithAPI(mealType: string, targetCalories: number, profile: ProfileData): Promise<MealItem> {
  try {
    const response = await fetch('/api/generate-meal', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        mealType,
        targetCalories,
        profile
      })
    })

    if (!response.ok) {
      const errorData = await response.text()
      throw new Error(`API request failed: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    
    if (!data.success) {
      throw new Error(data.error || 'API returned failure')
    }

    return data.meal
  } catch (error) {
    console.error('Error generating meal with API:', error)
    // Fallback to static meal database
    return generateStaticMeal(mealType, targetCalories, profile)
  }
}

/**
 * Fallback function to generate meal from static database
 */
function generateStaticMeal(mealType: string, targetCalories: number, profile: ProfileData): MealItem {
  const mealDatabase = getMealDatabase(profile.dietaryPreference, profile.goal)
  
  // Check if the meal type exists in the database
  if (!mealDatabase[mealType]) {
    console.error(`Meal type '${mealType}' not found in meal database. Available types:`, Object.keys(mealDatabase))
    // Fallback to breakfast if requested meal type doesn't exist
    const fallbackMealType = 'breakfast'
    if (!mealDatabase[fallbackMealType]) {
      throw new Error(`No meals available in database. Available types: ${Object.keys(mealDatabase).join(', ')}`)
    }
    console.warn(`Using fallback meal type: ${fallbackMealType}`)
    mealType = fallbackMealType
  }
  
  const suitableMeals = mealDatabase[mealType].filter((meal: MealItem) => 
    Math.abs(meal.calories - targetCalories) <= targetCalories * 0.2
  )

  const selectedMeal = suitableMeals[Math.floor(Math.random() * suitableMeals.length)]
  
  if (!selectedMeal) {
    // Fallback to first available meal if no suitable meal found
    const fallbackMeal = mealDatabase[mealType]?.[0]
    if (!fallbackMeal) {
      // Create a default meal if no meals available
      return {
        name: "Default Meal",
        description: "A balanced meal with basic nutrition",
        calories: targetCalories || 300,
        protein: 20,
        carbs: 30,
        fat: 10,
        ingredients: ["Protein source", "Carbohydrates", "Vegetables"],
        instructions: ["Cook ingredients", "Combine and serve"],
        prepTime: 15,
        servings: 1,
        benefits: ["Balanced nutrition"]
      }
    }
    return {
      ...fallbackMeal,
      benefits: generateMealBenefits(fallbackMeal, profile.goal),
      instructions: generateCookingInstructions(fallbackMeal)
    }
  }
  
  return {
    ...selectedMeal,
    benefits: generateMealBenefits(selectedMeal, profile.goal),
    instructions: generateCookingInstructions(selectedMeal)
  }
}

interface ProfileData {
  name: string
  age: number
  weight: number
  height: number
  gender: "male" | "female"
  activityLevel: string
  dietaryPreference: string
  goal: string
  avatar?: string
  createdAt: string
}

interface AIMealPlan {
  dailyCalories: number
  macroTargets: {
    protein: number
    carbs: number
    fat: number
  }
  days: {
    [key: string]: {
      breakfast: MealItem[]
      lunch: MealItem[]
      dinner: MealItem[]
      snacks: MealItem[]
      totals: NutritionTotals
    }
  }
  personalizedTips: string[]
  recommendations: string[]
}

interface MealItem {
  name: string
  description: string
  calories: number
  protein: number
  carbs: number
  fat: number
  ingredients: string[]
  instructions: string[]
  prepTime: number
  servings: number
  benefits: string[]
}

interface NutritionTotals {
  calories: number
  protein: number
  carbs: number
  fat: number
}

interface AIHealthTips {
  dailyTip: string
  personalizedTips: string[]
  goalSpecificTips: string[]
  dietaryTips: string[]
  lifestyleTips: string[]
  warnings: string[]
}

interface AIMealPlan {
  dailyCalories: number
  macroTargets: {
    protein: number
    carbs: number
    fat: number
  }
  days: {
    [key: string]: {
      breakfast: MealItem[]
      lunch: MealItem[]
      dinner: MealItem[]
      snacks: MealItem[]
      totals: NutritionTotals
    }
  }
  personalizedTips: string[]
  recommendations: string[]
}

interface MealItem {
  name: string
  description: string
  calories: number
  protein: number
  carbs: number
  fat: number
  ingredients: string[]
  instructions: string[]
  prepTime: number
  servings: number
  benefits: string[]
}

interface NutritionTotals {
  calories: number
  protein: number
  carbs: number
  fat: number
}

interface AIHealthTips {
  dailyTip: string
  personalizedTips: string[]
  goalSpecificTips: string[]
  dietaryTips: string[]
  lifestyleTips: string[]
  warnings: string[]
}

/**
 * Generate AI-powered meal plan based on user profile
 */
export async function generateAIMealPlan(profile: ProfileData): Promise<AIMealPlan> {
  try {
    // Validate profile data
    if (!profile) {
      throw new Error('Profile is required')
    }
    
    // Validate required fields
    const requiredFields = ['name', 'age', 'weight', 'height', 'gender', 'activityLevel', 'dietaryPreference', 'goal']
    for (const field of requiredFields) {
      if (!profile[field as keyof ProfileData]) {
        throw new Error(`Missing required profile field: ${field}`)
      }
    }

    // Calculate nutritional needs
    const tdee = calculateTDEE(profile)
    const goalCalories = adjustCaloriesForGoal(tdee, profile.goal)
    const macroTargets = calculateMacroTargets(goalCalories, profile.goal, profile.gender)

    // Generate personalized meal plan
    const mealPlan: AIMealPlan = {
      dailyCalories: goalCalories,
      macroTargets,
      days: {},
      personalizedTips: [],
      recommendations: []
    }

    // Generate 7-day meal plan
    for (let day = 1; day <= 7; day++) {
      const dayPlan = await generateDailyMealPlan(profile, goalCalories, macroTargets, day)
      mealPlan.days[`day${day}`] = dayPlan
    }

    // Generate personalized tips and recommendations
    mealPlan.personalizedTips = generatePersonalizedTips(profile)
    mealPlan.recommendations = generateRecommendations(profile, goalCalories)

    return mealPlan
  } catch (error) {
    console.error('Error generating AI meal plan:', error)
    console.error('Error details:', {
      profile: profile ? 'Profile exists' : 'Profile is null/undefined',
      errorMessage: error instanceof Error ? error.message : 'Unknown error',
      errorStack: error instanceof Error ? error.stack : 'No stack trace'
    })
    throw new Error(`Failed to generate AI meal plan: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

/**
 * Generate AI-powered health tips based on user profile
 */
export async function generateAIHealthTips(profile: ProfileData): Promise<AIHealthTips> {
  try {
    const healthTips: AIHealthTips = {
      dailyTip: generateDailyTip(profile),
      personalizedTips: generatePersonalizedHealthTips(profile),
      goalSpecificTips: generateGoalSpecificTips(profile),
      dietaryTips: generateDietaryTips(profile),
      lifestyleTips: generateLifestyleTips(profile),
      warnings: generateHealthWarnings(profile)
    }

    return healthTips
  } catch (error) {
    console.error('Error generating AI health tips:', error)
    throw new Error('Failed to generate AI health tips')
  }
}

/**
 * Calculate Total Daily Energy Expenditure (TDEE)
 */
function calculateTDEE(profile: ProfileData): number {
  let bmr: number
  
  if (profile.gender === "male") {
    bmr = 10 * profile.weight + 6.25 * profile.height - 5 * profile.age + 5
  } else {
    bmr = 10 * profile.weight + 6.25 * profile.height - 5 * profile.age - 161
  }

  const activityMultipliers: Record<string, number> = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    active: 1.725,
    "very-active": 1.9,
  }

  const multiplier = activityMultipliers[profile.activityLevel] || 1.55
  return Math.round(bmr * multiplier)
}

/**
 * Adjust calories based on user's goal
 */
function adjustCaloriesForGoal(tdee: number, goal: string): number {
  switch (goal) {
    case "weight-loss":
      return Math.round(tdee * 0.8) // 20% deficit
    case "muscle-gain":
      return Math.round(tdee * 1.1) // 10% surplus
    case "maintenance":
    default:
      return tdee
  }
}

/**
 * Calculate macro targets based on calories and goals
 */
function calculateMacroTargets(calories: number, goal: string, gender: string) {
  let proteinRatio = 0.25
  let fatRatio = 0.25

  if (goal === "muscle-gain") {
    proteinRatio = 0.35
    fatRatio = 0.20
  } else if (goal === "weight-loss") {
    proteinRatio = 0.30
    fatRatio = 0.25
  }

  return {
    protein: Math.round((calories * proteinRatio) / 4),
    carbs: Math.round((calories * (1 - proteinRatio - fatRatio)) / 4),
    fat: Math.round((calories * fatRatio) / 9)
  }
}

/**
 * Generate daily meal plan with AI-powered meal suggestions
 */
async function generateDailyMealPlan(
  profile: ProfileData, 
  targetCalories: number, 
  macroTargets: any,
  day: number
): Promise<any> {
  const mealDistribution = {
    breakfast: 0.25,
    lunch: 0.35,
    dinner: 0.30,
    snacks: 0.10
  }

  const breakfastCalories = Math.round(targetCalories * mealDistribution.breakfast)
  const lunchCalories = Math.round(targetCalories * mealDistribution.lunch)
  const dinnerCalories = Math.round(targetCalories * mealDistribution.dinner)
  const snacksCalories = Math.round(targetCalories * mealDistribution.snacks)

  return {
    breakfast: [await generateAIMeal("breakfast", breakfastCalories, profile)],
    lunch: [await generateAIMeal("lunch", lunchCalories, profile)],
    dinner: [await generateAIMeal("dinner", dinnerCalories, profile)],
    snacks: [
      await generateAIMeal("snacks", Math.round(snacksCalories / 2), profile),
      await generateAIMeal("snacks", Math.round(snacksCalories / 2), profile)
    ],
    totals: {
      calories: targetCalories,
      protein: macroTargets.protein,
      carbs: macroTargets.carbs,
      fat: macroTargets.fat
    }
  }
}

/**
 * Generate AI-powered meal with detailed information
 */
async function generateAIMeal(mealType: string, targetCalories: number, profile: ProfileData): Promise<MealItem> {
  try {
    // Try to generate meal with AI API first
    return await generateAIMealWithAPI(mealType, targetCalories, profile)
  } catch (error) {
    console.warn('AI API failed, using fallback:', error)
    // Fallback to static meal database
    return generateStaticMeal(mealType, targetCalories, profile)
  }
}

/**
 * Get meal database based on dietary preference and goals
 */
function getMealDatabase(dietaryPreference: string, goal: string): any {
  // This would typically connect to an AI service or extensive database
  // For now, returning a simplified structure
  return {
    breakfast: [
      {
        name: "Protein-Packed Oatmeal",
        description: "Oatmeal with protein powder, berries, and nuts",
        calories: 350,
        protein: 20,
        carbs: 45,
        fat: 12,
        ingredients: ["Rolled oats", "Protein powder", "Mixed berries", "Almonds", "Honey"],
        prepTime: 10,
        servings: 1
      },
      {
        name: "Avocado Toast with Eggs",
        description: "Whole grain toast with mashed avocado and poached eggs",
        calories: 380,
        protein: 18,
        carbs: 32,
        fat: 20,
        ingredients: ["Whole grain bread", "Avocado", "Eggs", "Lemon juice", "Red pepper flakes"],
        prepTime: 15,
        servings: 1
      }
    ],
    lunch: [
      {
        name: "Grilled Chicken Salad",
        description: "Mixed greens with grilled chicken and colorful vegetables",
        calories: 420,
        protein: 35,
        carbs: 25,
        fat: 18,
        ingredients: ["Chicken breast", "Mixed greens", "Cherry tomatoes", "Cucumber", "Olive oil"],
        prepTime: 20,
        servings: 1
      }
    ],
    dinner: [
      {
        name: "Baked Salmon with Vegetables",
        description: "Salmon fillet with roasted seasonal vegetables",
        calories: 480,
        protein: 38,
        carbs: 30,
        fat: 22,
        ingredients: ["Salmon fillet", "Broccoli", "Sweet potato", "Olive oil", "Lemon"],
        prepTime: 30,
        servings: 1
      }
    ],
    snacks: [
      {
        name: "Greek Yogurt with Berries",
        description: "Greek yogurt topped with fresh berries",
        calories: 180,
        protein: 15,
        carbs: 18,
        fat: 4,
        ingredients: ["Greek yogurt", "Mixed berries", "Honey"],
        prepTime: 5,
        servings: 1
      }
    ]
  }
}

/**
 * Generate personalized nutrition tips
 */
function generatePersonalizedTips(profile: ProfileData): string[] {
  const tips: string[] = []

  // Age-specific tips
  if (profile.age > 40) {
    tips.push("Focus on calcium-rich foods to maintain bone health")
    tips.push("Consider increasing protein intake to preserve muscle mass")
  }

  // Goal-specific tips
  if (profile.goal === "weight-loss") {
    tips.push("Drink plenty of water throughout the day to support metabolism")
    tips.push("Include fiber-rich foods to help you feel full longer")
  } else if (profile.goal === "muscle-gain") {
    tips.push("Consume protein within 30 minutes after workouts")
    tips.push("Ensure adequate carbohydrate intake for energy")
  }

  // Activity level tips
  if (profile.activityLevel === "active" || profile.activityLevel === "very-active") {
    tips.push("Stay hydrated with electrolyte-rich fluids during intense exercise")
    tips.push("Time your meals around your workout schedule for optimal performance")
  }

  return tips
}

/**
 * Generate personalized recommendations
 */
function generateRecommendations(profile: ProfileData, calories: number): string[] {
  const recommendations: string[] = []

  if (calories < 1500) {
    recommendations.push("Ensure you're getting adequate nutrition - consider consulting a healthcare provider")
  }

  if (profile.dietaryPreference === "vegan" || profile.dietaryPreference === "vegetarian") {
    recommendations.push("Consider vitamin B12 supplementation")
    recommendations.push("Ensure adequate iron intake through plant-based sources")
  }

  recommendations.push("Schedule regular health check-ups to monitor your progress")
  recommendations.push("Listen to your body and adjust your diet as needed")

  return recommendations
}

/**
 * Generate daily health tip
 */
function generateDailyTip(profile: ProfileData): string {
  const tips = [
    `Hi ${profile.name}! Start your day with a glass of warm water to boost metabolism.`,
    `${profile.name}, remember to take short breaks and stretch if you have a sedentary job.`,
    `Today's tip for ${profile.name}: Include at least 5 servings of fruits and vegetables.`,
    `${profile.name}, practice mindful eating - focus on your food without distractions.`,
    `Hey ${profile.name}! Try to get 7-9 hours of quality sleep tonight.`
  ]

  return tips[Math.floor(Math.random() * tips.length)]
}

/**
 * Generate personalized health tips
 */
function generatePersonalizedHealthTips(profile: ProfileData): string[] {
  const tips: string[] = []

  // BMI calculation
  const bmi = profile.weight / Math.pow(profile.height / 100, 2)
  
  if (bmi > 25) {
    tips.push("Focus on portion control and include more vegetables in your meals")
  } else if (bmi < 18.5) {
    tips.push("Ensure you're eating enough calories to maintain a healthy weight")
  }

  // Age-specific advice
  if (profile.age > 50) {
    tips.push("Include omega-3 rich foods for brain and heart health")
  }

  return tips
}

/**
 * Generate goal-specific tips
 */
function generateGoalSpecificTips(profile: ProfileData): string[] {
  const goalTips: Record<string, string[]> = {
    "weight-loss": [
      "Create a calorie deficit through diet and exercise",
      "Focus on high-protein, high-fiber foods to stay satisfied",
      "Limit processed foods and added sugars"
    ],
    "muscle-gain": [
      "Consume adequate protein throughout the day",
      "Include complex carbohydrates for energy",
      "Time your nutrition around your workouts"
    ],
    "maintenance": [
      "Maintain a balanced diet with all food groups",
      "Practice portion control and mindful eating",
      "Stay consistent with your eating schedule"
    ]
  }

  return goalTips[profile.goal] || goalTips["maintenance"]
}

/**
 * Generate dietary preference tips
 */
function generateDietaryTips(profile: ProfileData): string[] {
  const dietaryTips: Record<string, string[]> = {
    "vegan": [
      "Ensure complete protein sources like quinoa and legumes",
      "Consider vitamin D and B12 supplementation",
      "Include iron-rich plant foods with vitamin C sources"
    ],
    "vegetarian": [
      "Include dairy and eggs for complete proteins",
      "Vary your protein sources throughout the week",
      "Focus on iron and B12-rich foods"
    ],
    "keto": [
      "Monitor your ketone levels regularly",
      "Stay hydrated and electrolyte balanced",
      "Include healthy fats from various sources"
    ],
    "standard": [
      "Focus on whole, unprocessed foods",
      "Include a variety of food groups",
      "Practice portion control"
    ]
  }

  return dietaryTips[profile.dietaryPreference] || dietaryTips["standard"]
}

/**
 * Generate lifestyle tips
 */
function generateLifestyleTips(profile: ProfileData): string[] {
  const tips: string[] = []

  tips.push("Aim for 7-9 hours of quality sleep each night")
  tips.push("Manage stress through meditation or yoga")
  tips.push("Stay hydrated with at least 8 glasses of water daily")

  if (profile.activityLevel === "sedentary") {
    tips.push("Take regular movement breaks throughout the day")
  } else {
    tips.push("Ensure proper warm-up and cool-down during exercise")
  }

  return tips
}

/**
 * Generate health warnings based on profile
 */
function generateHealthWarnings(profile: ProfileData): string[] {
  const warnings: string[] = []

  if (profile.age > 65) {
    warnings.push("Consult with healthcare provider before making significant dietary changes")
  }

  if (profile.weight > 100 || profile.weight < 40) {
    warnings.push("Consider professional medical guidance for your weight management")
  }

  if (profile.goal === "weight-loss" && profile.age < 18) {
    warnings.push("Rapid weight loss during adolescence should be medically supervised")
  }

  return warnings
}

/**
 * Generate meal benefits
 */
function generateMealBenefits(meal: MealItem, goal: string): string[] {
  const benefits: string[] = []

  if (meal.protein > 20) {
    benefits.push("High in protein to support muscle maintenance")
  }

  if (meal.fat < 10) {
    benefits.push("Low in fat for calorie control")
  }

  if (goal === "weight-loss" && meal.calories < 400) {
    benefits.push("Perfect for weight management goals")
  }

  if (goal === "muscle-gain" && meal.protein > 25) {
    benefits.push("Excellent for muscle building and recovery")
  }

  benefits.push("Rich in essential nutrients for overall health")

  return benefits
}

/**
 * Generate cooking instructions
 */
function generateCookingInstructions(meal: MealItem): string[] {
  return [
    "Prepare all ingredients before starting",
    "Follow food safety guidelines",
    "Season to taste with herbs and spices",
    "Cook until food reaches safe internal temperature",
    "Let hot foods rest before serving"
  ]
}

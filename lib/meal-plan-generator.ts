// Meal templates for different diet types
const mealTemplates: Record<string, any> = {
  standard: {
    breakfast: [
      {
        name: "Oatmeal with Fruit",
        description: "Oatmeal topped with berries and honey",
        calories: 350,
        protein: 12,
        carbs: 60,
        fat: 8,
      },
      {
        name: "Eggs and Toast",
        description: "Scrambled eggs with whole grain toast",
        calories: 385,
        protein: 20,
        carbs: 30,
        fat: 18,
      },
      {
        name: "Greek Yogurt Parfait",
        description: "Greek yogurt with granola and fruit",
        calories: 320,
        protein: 22,
        carbs: 40,
        fat: 8,
      },
    ],
    lunch: [
      {
        name: "Chicken Salad",
        description: "Grilled chicken with mixed greens",
        calories: 420,
        protein: 35,
        carbs: 25,
        fat: 20,
      },
      {
        name: "Turkey Sandwich",
        description: "Turkey on whole grain bread with veggies",
        calories: 450,
        protein: 28,
        carbs: 48,
        fat: 16,
      },
      {
        name: "Quinoa Bowl",
        description: "Quinoa with roasted vegetables and feta",
        calories: 480,
        protein: 15,
        carbs: 65,
        fat: 18,
      },
    ],
    dinner: [
      {
        name: "Baked Salmon",
        description: "Baked salmon with roasted potatoes and vegetables",
        calories: 520,
        protein: 40,
        carbs: 30,
        fat: 24,
      },
      {
        name: "Stir Fry",
        description: "Chicken and vegetable stir fry with brown rice",
        calories: 550,
        protein: 35,
        carbs: 60,
        fat: 16,
      },
      {
        name: "Pasta Primavera",
        description: "Whole grain pasta with vegetables and olive oil",
        calories: 480,
        protein: 18,
        carbs: 70,
        fat: 15,
      },
    ],
    snacks: [
      {
        name: "Apple with Almond Butter",
        description: "Apple slices with almond butter",
        calories: 200,
        protein: 5,
        carbs: 25,
        fat: 10,
      },
      {
        name: "Protein Shake",
        description: "Protein powder with milk and banana",
        calories: 220,
        protein: 25,
        carbs: 20,
        fat: 3,
      },
      { name: "Mixed Nuts", description: "A handful of mixed nuts", calories: 170, protein: 6, carbs: 7, fat: 14 },
    ],
  },
  vegan: {
    breakfast: [
      {
        name: "Chia Pudding",
        description: "Chia seeds soaked in almond milk with fruit",
        calories: 320,
        protein: 10,
        carbs: 45,
        fat: 14,
      },
      {
        name: "Avocado Toast",
        description: "Whole grain toast with avocado and nutritional yeast",
        calories: 350,
        protein: 12,
        carbs: 32,
        fat: 20,
      },
      {
        name: "Smoothie Bowl",
        description: "Berry smoothie bowl with granola and seeds",
        calories: 380,
        protein: 14,
        carbs: 60,
        fat: 10,
      },
    ],
    lunch: [
      {
        name: "Chickpea Salad",
        description: "Chickpeas with mixed vegetables and tahini dressing",
        calories: 410,
        protein: 15,
        carbs: 50,
        fat: 18,
      },
      {
        name: "Lentil Soup",
        description: "Hearty lentil soup with crusty bread",
        calories: 380,
        protein: 16,
        carbs: 60,
        fat: 8,
      },
      {
        name: "Veggie Wrap",
        description: "Hummus and vegetable wrap with spinach",
        calories: 420,
        protein: 14,
        carbs: 58,
        fat: 16,
      },
    ],
    dinner: [
      {
        name: "Buddha Bowl",
        description: "Quinoa, roasted vegetables, and tahini sauce",
        calories: 520,
        protein: 16,
        carbs: 70,
        fat: 20,
      },
      {
        name: "Tofu Stir Fry",
        description: "Tofu and vegetables with brown rice",
        calories: 480,
        protein: 22,
        carbs: 65,
        fat: 14,
      },
      {
        name: "Sweet Potato Curry",
        description: "Sweet potato and chickpea curry",
        calories: 450,
        protein: 14,
        carbs: 68,
        fat: 15,
      },
    ],
    snacks: [
      {
        name: "Hummus with Vegetables",
        description: "Hummus with carrot and cucumber sticks",
        calories: 180,
        protein: 8,
        carbs: 20,
        fat: 8,
      },
      {
        name: "Trail Mix",
        description: "Mix of nuts, seeds, and dried fruit",
        calories: 210,
        protein: 7,
        carbs: 18,
        fat: 14,
      },
      {
        name: "Rice Cakes with Avocado",
        description: "Rice cakes topped with avocado",
        calories: 160,
        protein: 3,
        carbs: 15,
        fat: 10,
      },
    ],
  },
  vegetarian: {
    breakfast: [
      {
        name: "Vegetable Omelette",
        description: "Egg omelette with vegetables and cheese",
        calories: 340,
        protein: 20,
        carbs: 16,
        fat: 22,
      },
      {
        name: "Yogurt Parfait",
        description: "Greek yogurt with granola and berries",
        calories: 310,
        protein: 20,
        carbs: 40,
        fat: 7,
      },
      {
        name: "Cottage Cheese and Fruit",
        description: "Cottage cheese with mixed fruits",
        calories: 280,
        protein: 24,
        carbs: 30,
        fat: 8,
      },
    ],
    lunch: [
      {
        name: "Mediterranean Salad",
        description: "Salad with feta, olives, and chickpeas",
        calories: 420,
        protein: 18,
        carbs: 40,
        fat: 22,
      },
      {
        name: "Caprese Sandwich",
        description: "Fresh mozzarella, tomato, and basil on bread",
        calories: 450,
        protein: 20,
        carbs: 45,
        fat: 18,
      },
      {
        name: "Stuffed Bell Peppers",
        description: "Bell peppers stuffed with quinoa and cheese",
        calories: 390,
        protein: 14,
        carbs: 48,
        fat: 16,
      },
    ],
    dinner: [
      {
        name: "Eggplant Parmesan",
        description: "Baked eggplant with marinara and cheese",
        calories: 480,
        protein: 24,
        carbs: 40,
        fat: 24,
      },
      {
        name: "Spinach and Ricotta Lasagna",
        description: "Lasagna with spinach and ricotta filling",
        calories: 520,
        protein: 26,
        carbs: 55,
        fat: 20,
      },
      {
        name: "Vegetable Curry",
        description: "Vegetables in coconut curry sauce with rice",
        calories: 460,
        protein: 12,
        carbs: 70,
        fat: 16,
      },
    ],
    snacks: [
      {
        name: "Greek Yogurt with Honey",
        description: "Greek yogurt drizzled with honey",
        calories: 170,
        protein: 17,
        carbs: 18,
        fat: 3,
      },
      {
        name: "Cheese and Crackers",
        description: "Cheese with whole grain crackers",
        calories: 210,
        protein: 10,
        carbs: 15,
        fat: 12,
      },
      {
        name: "Hard-Boiled Egg",
        description: "Hard-boiled egg with a pinch of salt",
        calories: 78,
        protein: 6,
        carbs: 1,
        fat: 5,
      },
    ],
  },
  keto: {
    breakfast: [
      {
        name: "Avocado and Bacon Omelette",
        description: "Egg omelette with avocado and bacon",
        calories: 420,
        protein: 24,
        carbs: 6,
        fat: 32,
      },
      {
        name: "Keto Smoothie",
        description: "Almond milk, avocado, and protein powder smoothie",
        calories: 350,
        protein: 20,
        carbs: 8,
        fat: 25,
      },
      {
        name: "Chia Pudding with Coconut",
        description: "Chia seeds with coconut milk and berries",
        calories: 380,
        protein: 12,
        carbs: 10,
        fat: 30,
      },
    ],
    lunch: [
      {
        name: "Cobb Salad",
        description: "Lettuce, chicken, bacon, eggs, and avocado",
        calories: 450,
        protein: 35,
        carbs: 8,
        fat: 32,
      },
      {
        name: "Tuna Salad Lettuce Wraps",
        description: "Tuna salad wrapped in lettuce leaves",
        calories: 380,
        protein: 32,
        carbs: 6,
        fat: 24,
      },
      {
        name: "Zucchini Noodles with Pesto",
        description: "Zucchini noodles with pesto and parmesan",
        calories: 340,
        protein: 15,
        carbs: 9,
        fat: 28,
      },
    ],
    dinner: [
      {
        name: "Butter-Basted Steak",
        description: "Ribeye steak with buttered vegetables",
        calories: 560,
        protein: 40,
        carbs: 7,
        fat: 40,
      },
      {
        name: "Baked Salmon with Asparagus",
        description: "Salmon fillet with roasted asparagus",
        calories: 480,
        protein: 38,
        carbs: 8,
        fat: 32,
      },
      {
        name: "Chicken Alfredo with Broccoli",
        description: "Chicken in creamy sauce with broccoli",
        calories: 520,
        protein: 42,
        carbs: 10,
        fat: 36,
      },
    ],
    snacks: [
      {
        name: "Cheese Crisps",
        description: "Baked cheese crisps with herbs",
        calories: 180,
        protein: 12,
        carbs: 2,
        fat: 14,
      },
      {
        name: "Deviled Eggs",
        description: "Hard-boiled eggs filled with seasoned yolk",
        calories: 160,
        protein: 10,
        carbs: 1,
        fat: 12,
      },
      {
        name: "Macadamia Nuts",
        description: "A small handful of macadamia nuts",
        calories: 200,
        protein: 2,
        carbs: 4,
        fat: 22,
      },
    ],
  },
  paleo: {
    breakfast: [
      {
        name: "Sweet Potato Hash",
        description: "Sweet potato hash with eggs and bacon",
        calories: 420,
        protein: 24,
        carbs: 30,
        fat: 24,
      },
      {
        name: "Fruit and Nut Bowl",
        description: "Mixed berries with nuts and coconut flakes",
        calories: 380,
        protein: 10,
        carbs: 25,
        fat: 26,
      },
      {
        name: "Paleo Breakfast Muffin",
        description: "Almond flour muffin with blueberries",
        calories: 340,
        protein: 12,
        carbs: 18,
        fat: 24,
      },
    ],
    lunch: [
      {
        name: "Chicken and Vegetable Soup",
        description: "Hearty chicken soup with vegetables",
        calories: 380,
        protein: 30,
        carbs: 20,
        fat: 18,
      },
      {
        name: "Tuna Avocado Salad",
        description: "Tuna with avocado on mixed greens",
        calories: 420,
        protein: 35,
        carbs: 15,
        fat: 22,
      },
      {
        name: "Stuffed Portobello Mushrooms",
        description: "Mushrooms filled with ground meat and vegetables",
        calories: 450,
        protein: 28,
        carbs: 18,
        fat: 28,
      },
    ],
    dinner: [
      {
        name: "Grilled Steak with Vegetables",
        description: "Grass-fed steak with roasted vegetables",
        calories: 520,
        protein: 40,
        carbs: 20,
        fat: 30,
      },
      {
        name: "Baked Chicken with Sweet Potatoes",
        description: "Roasted chicken with sweet potatoes and herbs",
        calories: 480,
        protein: 38,
        carbs: 25,
        fat: 22,
      },
      {
        name: "Shrimp and Vegetable Skillet",
        description: "Sautéed shrimp with mixed vegetables",
        calories: 410,
        protein: 35,
        carbs: 18,
        fat: 20,
      },
    ],
    snacks: [
      {
        name: "Apple with Almond Butter",
        description: "Apple slices with almond butter",
        calories: 200,
        protein: 5,
        carbs: 25,
        fat: 10,
      },
      { name: "Beef Jerky", description: "Grass-fed beef jerky", calories: 150, protein: 24, carbs: 3, fat: 5 },
      {
        name: "Mixed Berries with Coconut",
        description: "Berries with coconut flakes",
        calories: 160,
        protein: 2,
        carbs: 20,
        fat: 8,
      },
    ],
  },
  "high-protein": {
    breakfast: [
      {
        name: "Protein Oatmeal",
        description: "Oatmeal with protein powder and peanut butter",
        calories: 420,
        protein: 30,
        carbs: 45,
        fat: 12,
      },
      {
        name: "Egg White Frittata",
        description: "Egg white frittata with vegetables and lean ham",
        calories: 380,
        protein: 38,
        carbs: 15,
        fat: 10,
      },
      {
        name: "Protein Pancakes",
        description: "Pancakes made with protein powder and egg whites",
        calories: 400,
        protein: 35,
        carbs: 40,
        fat: 8,
      },
    ],
    lunch: [
      {
        name: "Chicken and Quinoa Bowl",
        description: "Grilled chicken with quinoa and vegetables",
        calories: 480,
        protein: 40,
        carbs: 50,
        fat: 12,
      },
      {
        name: "Tuna Protein Box",
        description: "Tuna with hard-boiled eggs and whole grain crackers",
        calories: 450,
        protein: 45,
        carbs: 30,
        fat: 14,
      },
      {
        name: "Turkey Wrap",
        description: "Turkey in a protein wrap with vegetables",
        calories: 420,
        protein: 38,
        carbs: 35,
        fat: 10,
      },
    ],
    dinner: [
      {
        name: "Lean Beef Stir Fry",
        description: "Lean beef with vegetables and brown rice",
        calories: 520,
        protein: 45,
        carbs: 40,
        fat: 14,
      },
      {
        name: "Grilled Chicken with Sweet Potato",
        description: "Grilled chicken breast with sweet potato",
        calories: 480,
        protein: 48,
        carbs: 35,
        fat: 8,
      },
      {
        name: "Salmon with Quinoa",
        description: "Baked salmon with quinoa and vegetables",
        calories: 510,
        protein: 42,
        carbs: 38,
        fat: 18,
      },
    ],
    snacks: [
      {
        name: "Protein Shake",
        description: "Whey protein shake with water or milk",
        calories: 160,
        protein: 25,
        carbs: 5,
        fat: 2,
      },
      {
        name: "Cottage Cheese",
        description: "Low-fat cottage cheese with fruit",
        calories: 180,
        protein: 24,
        carbs: 10,
        fat: 3,
      },
      {
        name: "Greek Yogurt with Protein Granola",
        description: "Greek yogurt with high-protein granola",
        calories: 210,
        protein: 20,
        carbs: 18,
        fat: 5,
      },
    ],
  },
}

/**
 * Generate a meal plan based on user profile
 */
export function generateMealPlan(profile: any): any {
  const dietType = profile.dietaryPreference || "standard"

  // Calculate calorie needs
  const tdee = calculateTDEE(profile)
  let goalCalories = tdee

  if (profile.goal === "weight-loss") {
    goalCalories = Math.round(tdee * 0.8) // 20% deficit
  } else if (profile.goal === "muscle-gain") {
    goalCalories = Math.round(tdee * 1.1) // 10% surplus
  }

  // Create a 7-day meal plan
  const mealPlan = {
    dailyCalories: goalCalories,
    days: {},
  }

  for (let i = 1; i <= 7; i++) {
    const dayName = `day${i}`

    // Randomly select meals for the day
    const breakfast = getRandomItem(mealTemplates[dietType].breakfast)
    const lunch = getRandomItem(mealTemplates[dietType].lunch)
    const dinner = getRandomItem(mealTemplates[dietType].dinner)
    const snack1 = getRandomItem(mealTemplates[dietType].snacks)
    const snack2 = getRandomItem(mealTemplates[dietType].snacks.filter((s) => s.name !== snack1.name))

    // Calculate daily totals
    const dailyTotals = {
      calories: breakfast.calories + lunch.calories + dinner.calories + snack1.calories + snack2.calories,
      protein: breakfast.protein + lunch.protein + dinner.protein + snack1.protein + snack2.protein,
      carbs: breakfast.carbs + lunch.carbs + dinner.carbs + snack1.carbs + snack2.carbs,
      fat: breakfast.fat + lunch.fat + dinner.fat + snack1.fat + snack2.fat,
    }

    mealPlan.days[dayName] = {
      breakfast: [breakfast],
      lunch: [lunch],
      dinner: [dinner],
      snacks: [snack1, snack2],
      totals: dailyTotals,
    }
  }

  return mealPlan
}

/**
 * Helper function to calculate TDEE
 */
function calculateTDEE(profile: any): number {
  // Same calculation as in calculations.ts
  let bmr
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

  return Math.round(bmr * activityMultipliers[profile.activityLevel])
}

/**
 * Get a random item from an array
 */
function getRandomItem(array: any[]): any {
  const randomIndex = Math.floor(Math.random() * array.length)
  return array[randomIndex]
}


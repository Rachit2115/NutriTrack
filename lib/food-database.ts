// Sample food database
const foods = [
  {
    name: "Apple",
    calories: 95,
    protein: 0.5,
    carbs: 25,
    fat: 0.3,
    servingSize: "1 medium",
  },
  {
    name: "Banana",
    calories: 105,
    protein: 1.3,
    carbs: 27,
    fat: 0.4,
    servingSize: "1 medium",
  },
  {
    name: "Chicken Breast",
    calories: 165,
    protein: 31,
    carbs: 0,
    fat: 3.6,
    servingSize: "100g, cooked",
  },
  {
    name: "Salmon",
    calories: 206,
    protein: 22,
    carbs: 0,
    fat: 13,
    servingSize: "100g, cooked",
  },
  {
    name: "Brown Rice",
    calories: 216,
    protein: 5,
    carbs: 45,
    fat: 1.8,
    servingSize: "1 cup, cooked",
  },
  {
    name: "Egg",
    calories: 78,
    protein: 6.3,
    carbs: 0.6,
    fat: 5.3,
    servingSize: "1 large",
  },
  {
    name: "Avocado",
    calories: 234,
    protein: 2.9,
    carbs: 12.5,
    fat: 21,
    servingSize: "1 medium",
  },
  {
    name: "Greek Yogurt",
    calories: 100,
    protein: 17,
    carbs: 6,
    fat: 0.4,
    servingSize: "170g, 0% fat",
  },
  {
    name: "Oatmeal",
    calories: 158,
    protein: 6,
    carbs: 27,
    fat: 3.2,
    servingSize: "1 cup, cooked",
  },
  {
    name: "Spinach",
    calories: 23,
    protein: 2.9,
    carbs: 3.6,
    fat: 0.4,
    servingSize: "100g, raw",
  },
  {
    name: "Sweet Potato",
    calories: 180,
    protein: 4,
    carbs: 41.4,
    fat: 0.1,
    servingSize: "1 medium, baked",
  },
  {
    name: "Quinoa",
    calories: 222,
    protein: 8.1,
    carbs: 39.4,
    fat: 3.6,
    servingSize: "1 cup, cooked",
  },
  {
    name: "Almonds",
    calories: 164,
    protein: 6,
    carbs: 6,
    fat: 14,
    servingSize: "1 oz (28g)",
  },
  {
    name: "Broccoli",
    calories: 55,
    protein: 3.7,
    carbs: 11.2,
    fat: 0.6,
    servingSize: "1 cup, chopped",
  },
  {
    name: "Peanut Butter",
    calories: 188,
    protein: 8,
    carbs: 6,
    fat: 16,
    servingSize: "2 tbsp",
  },
  {
    name: "Whole Wheat Bread",
    calories: 81,
    protein: 4,
    carbs: 13.8,
    fat: 1.1,
    servingSize: "1 slice",
  },
]

/**
 * Search foods from the database
 */
export function searchFoods(query: string): any[] {
  const lowerQuery = query.toLowerCase()
  return foods.filter((food) => food.name.toLowerCase().includes(lowerQuery))
}

/**
 * Get a specific food by name
 */
export function getFood(name: string): any {
  return foods.find((food) => food.name === name)
}


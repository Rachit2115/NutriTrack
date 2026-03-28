// Sample meal alternatives data
const alternatives = [
  {
    name: "Instead of Sugary Cereal",
    originalFood: "Sugary Cereal",
    description: "Try overnight oats with berries and a touch of honey",
    calories: 280,
    diet: "vegetarian",
  },
  {
    name: "Instead of White Bread",
    originalFood: "White Bread",
    description: "Choose whole grain bread with more fiber and nutrients",
    calories: 80,
    diet: "vegan",
  },
  {
    name: "Instead of Regular Pasta",
    originalFood: "Regular Pasta",
    description: "Try zucchini noodles or whole grain pasta",
    calories: 140,
    diet: "vegetarian",
  },
  {
    name: "Instead of Soda",
    originalFood: "Soda",
    description: "Drink infused water with berries, citrus, or cucumber",
    calories: 5,
    diet: "vegan",
  },
  {
    name: "Instead of Ice Cream",
    originalFood: "Ice Cream",
    description: "Freeze blended banana with a touch of cocoa powder",
    calories: 120,
    diet: "vegan",
  },
  {
    name: "Instead of Potato Chips",
    originalFood: "Potato Chips",
    description: "Snack on air-popped popcorn or kale chips",
    calories: 80,
    diet: "vegan",
  },
  {
    name: "Instead of Mayonnaise",
    originalFood: "Mayonnaise",
    description: "Use mashed avocado as a creamy spread",
    calories: 50,
    diet: "vegan",
  },
  {
    name: "Instead of Beef Burgers",
    originalFood: "Beef Burgers",
    description: "Try bean or turkey burgers for less saturated fat",
    calories: 180,
    diet: "vegetarian",
  },
  {
    name: "Instead of French Fries",
    originalFood: "French Fries",
    description: "Bake sweet potato wedges for more nutrients",
    calories: 120,
    diet: "vegan",
  },
  {
    name: "Instead of Milk Chocolate",
    originalFood: "Milk Chocolate",
    description: "Enjoy a small piece of dark chocolate (70%+ cocoa)",
    calories: 70,
    diet: "vegetarian",
  },
  {
    name: "Instead of Creamy Salad Dressing",
    originalFood: "Creamy Salad Dressing",
    description: "Use olive oil and vinegar or lemon juice",
    calories: 60,
    diet: "vegan",
  },
]

/**
 * Get a specific number of random meal alternatives
 */
export function getMealAlternatives(count: number): any[] {
  // Create a copy of the array to avoid modifying the original
  const alternativesCopy = [...alternatives]
  const randomAlternatives: any[] = []

  // Get random alternatives, ensuring no duplicates
  for (let i = 0; i < count && alternativesCopy.length > 0; i++) {
    const randomIndex = Math.floor(Math.random() * alternativesCopy.length)
    randomAlternatives.push(alternativesCopy[randomIndex])
    alternativesCopy.splice(randomIndex, 1)
  }

  return randomAlternatives
}


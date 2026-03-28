import { NextRequest, NextResponse } from 'next/server'

const GOOGLE_AI_API_KEY = 'AIzaSyBzdWSyoGqyk1Kqv02BxNwR3-LUYQT41jQ'

export async function POST(request: NextRequest) {
  let targetCalories = 400 // Default value
  
  try {
    const { mealType, targetCalories: requestedCalories, profile } = await request.json()
    
    // Set the target calories from request
    targetCalories = requestedCalories || 400

    // Validate required fields
    if (!mealType || !targetCalories || !profile) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: mealType, targetCalories, profile' },
        { status: 400 }
      )
    }

    console.log('Generating meal:', { mealType, targetCalories, profile: profile.name, goal: profile.goal })

    // Add random seed for variety
    const randomSeed = Math.random()
    const varietyPrompt = randomSeed < 0.5 ? 
      "Focus on different cuisines and cooking methods" : 
      "Include unique ingredient combinations and flavors"
    
    const prompt = `Generate a healthy, personalized ${mealType} recipe for a ${profile.age}-year-old ${profile.gender} 
    with ${profile.dietaryPreference} diet preference. 
    Goal: ${profile.goal}
    Activity level: ${profile.activityLevel}
    Target calories: ${targetCalories}
    
    Variety request: ${varietyPrompt}
    
    Please provide a JSON response with the following structure:
    {
      "name": "Creative meal name",
      "description": "Brief description highlighting unique flavors",
      "calories": number,
      "protein": number,
      "carbs": number,
      "fat": number,
      "ingredients": ["ingredient1", "ingredient2", ...],
      "prepTime": number in minutes,
      "servings": 1
    }
    
    Make sure the meal is nutritious, fits the dietary preference, aligns with the user's goals, and offers variety.
    Avoid common basic recipes - be creative and unique.`

    console.log('Calling Google AI API for recipe generation...')
    console.log('API Key exists:', !!GOOGLE_AI_API_KEY)
    console.log('API Key length:', GOOGLE_AI_API_KEY.length)
    console.log('Prompt length:', prompt.length)
    
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GOOGLE_AI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }]
      })
    })

    console.log('Google AI API response status:', response.status)
    console.log('Response OK:', response.ok)

    if (!response.ok) {
      const errorData = await response.text()
      console.error('Google AI API error:', errorData)
      console.log('Falling back to static meal generation due to API failure')
      return generateStaticMeal(mealType, targetCalories, profile)
    }

    const data = await response.json()
    console.log('Google AI API response data keys:', Object.keys(data))
    
    const aiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text
    
    if (!aiResponse) {
      console.error('No AI response in data:', data)
      console.log('Falling back to static meal generation due to missing AI response')
      return generateStaticMeal(mealType, targetCalories, profile)
    }

    console.log('AI response received:', aiResponse.substring(0, 100) + '...')

    // Extract JSON from the AI response
    const jsonMatch = aiResponse.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      console.error('Could not parse AI response as JSON:', aiResponse)
      console.log('Falling back to static meal generation due to JSON parse failure')
      return generateStaticMeal(mealType, targetCalories, profile)
    }

    let mealData
    try {
      mealData = JSON.parse(jsonMatch[0])
      console.log('Parsed meal data:', mealData.name)
    } catch (parseError) {
      console.error('JSON parse error:', parseError)
      console.log('Falling back to static meal generation due to JSON parse error')
      return generateStaticMeal(mealType, targetCalories, profile)
    }
    
    // Generate detailed recipe instructions based on AI-generated meal
    const recipeInstructions = await generateAIRecipeInstructions(mealData.name, mealType, profile.dietaryPreference, targetCalories)
    
    // Add recipe details and instructions
    const mealItem = {
      ...mealData,
      instructions: recipeInstructions,
      cookTime: 15 + Math.floor(Math.random() * 20), // Random cook time between 15-35 mins
      benefits: generateMealBenefits(mealData, profile.goal),
      recipeDetails: {
        difficulty: ["Easy", "Medium", "Hard"][Math.floor(Math.random() * 3)],
        servings: 1,
        cuisine: mealData.name.includes('Mediterranean') ? 'Mediterranean' : 
                 mealData.name.includes('Asian') ? 'Asian' :
                 mealData.name.includes('Mexican') ? 'Mexican' :
                 mealData.name.includes('Italian') ? 'Italian' :
                 mealData.name.includes('Indian') ? 'Indian' :
                 mealData.name.includes('American') ? 'American' :
                 mealData.name.includes('Japanese') ? 'Japanese' :
                 mealData.name.includes('Thai') ? 'Thai' : 'International',
        dietaryTags: [profile.dietaryPreference, profile.goal === "weight-loss" ? "Low Calorie" : "High Protein"]
      }
    }

    console.log('Returning AI-generated meal:', mealItem.name)
    return NextResponse.json({ success: true, meal: mealItem, aiGenerated: true })

  } catch (error) {
    console.error('Error in generate-meal API:', error)
    
    // Return a fallback meal instead of failing completely
    const fallbackMeal = {
      name: "Healthy Balanced Meal",
      description: "A nutritious meal with balanced macronutrients",
      calories: targetCalories || 400,
      protein: Math.round((targetCalories || 400) * 0.25 / 4),
      carbs: Math.round((targetCalories || 400) * 0.45 / 4),
      fat: Math.round((targetCalories || 400) * 0.30 / 9),
      ingredients: ["Lean protein", "Complex carbohydrates", "Fresh vegetables", "Healthy fats"],
      prepTime: 20,
      servings: 1,
      instructions: ["Cook protein thoroughly", "Prepare vegetables", "Combine and season"],
      benefits: ["Balanced nutrition", "Sustained energy", "Supports overall health"]
    }
    
    return NextResponse.json({ 
      success: true, 
      meal: fallbackMeal,
      fallback: true 
    })
  }
}

function getRandomIngredients(cuisine: string): string[] {
  const ingredientSets = {
    Mediterranean: ["Chickpeas", "Cucumber", "Tomatoes", "Feta cheese", "Olive oil", "Lemon", "Olives", "Red onion", "Parsley"],
    Asian: ["Soy sauce", "Ginger", "Garlic", "Sesame oil", "Rice vinegar", "Bell peppers", "Snap peas", "Carrots", "Scallions"],
    Mexican: ["Black beans", "Corn", "Avocado", "Lime", "Cilantro", "Jalapeño", "Red onion", "Cumin", "Paprika"],
    Italian: ["Whole wheat pasta", "Cherry tomatoes", "Basil", "Mozzarella", "Garlic", "Olive oil", "Parmesan", "Spinach", "Oregano"],
    Indian: ["Chickpeas", "Spinach", "Garam masala", "Turmeric", "Cumin", "Ginger", "Garlic", "Coconut milk", "Basmati rice"],
    American: ["Lean ground turkey", "Sweet potato", "Broccoli", "Cheddar cheese", "Greek yogurt", "Honey mustard", "Whole grain bun", "Lettuce", "Tomato"],
    Japanese: ["Teriyaki sauce", "Sesame seeds", "Edamame", "Cucumber", "Avocado", "Sushi rice", "Nori", "Ginger", "Wasabi"],
    Thai: ["Coconut milk", "Thai basil", "Lemongrass", "Fish sauce", "Lime", "Chili peppers", "Bell peppers", "Bamboo shoots", "Jasmine rice"]
  }
  
  const ingredients = ingredientSets[cuisine as keyof typeof ingredientSets] || ingredientSets.Mediterranean
  // Return 5-7 random ingredients
  return ingredients.sort(() => 0.5 - Math.random()).slice(0, 5 + Math.floor(Math.random() * 3))
}

function generateRecipeInstructions(cuisine: string, mealType: string): string[] {
  const baseInstructions = {
    Mediterranean: [
      "Cook quinoa according to package directions and let cool",
      "Dice cucumber, tomatoes, and red onion",
      "Rinse and drain chickpeas, then lightly mash half of them",
      "Combine all ingredients in a large bowl",
      "Whisk together olive oil, lemon juice, and herbs",
      "Drizzle dressing over salad and toss gently",
      "Top with crumbled feta cheese and fresh parsley"
    ],
    Asian: [
      "Prepare rice noodles according to package instructions",
      "Heat sesame oil in a wok or large pan over high heat",
      "Add ginger and garlic, stir-fry for 30 seconds",
      "Add vegetables and stir-fry for 3-4 minutes",
      "Add protein source and sauce, toss to combine",
      "Cook for 2-3 minutes until heated through",
      "Garnish with sesame seeds and scallions"
    ],
    Mexican: [
      "Heat tortillas until warm and pliable",
      "Season and cook protein until fully done",
      "Warm beans and season with cumin and paprika",
      "Mash avocado with lime juice and salt",
      "Assemble burrito with layers of ingredients",
      "Roll tightly and toast in a dry pan",
      "Serve with salsa and Greek yogurt"
    ],
    Italian: [
      "Cook pasta al dente according to package directions",
      "Heat olive oil and sauté garlic until fragrant",
      "Add cherry tomatoes and cook until they burst",
      "Toss pasta with sauce and add fresh spinach",
      "Stir in fresh basil and season well",
      "Top with grated Parmesan cheese",
      "Drizzle with extra virgin olive oil before serving"
    ],
    Indian: [
      "Heat oil in a large pan over medium heat",
      "Add whole spices and toast until fragrant",
      "Sauté onions until golden brown",
      "Add ginger-garlic paste and powdered spices",
      "Add protein and cook until done",
      "Stir in spinach and coconut milk",
      "Simmer for 10 minutes and serve over basmati rice"
    ],
    American: [
      "Season protein with salt, pepper, and herbs",
      "Grill or pan-sear until cooked through",
      "Roast sweet potato cubes until tender",
      "Steam broccoli until bright green",
      "Toast whole grain bun if making a sandwich",
      "Assemble plate with all components",
      "Drizzle with honey mustard dressing"
    ],
    Japanese: [
      "Cook sushi rice according to package directions",
      "Season protein with teriyaki sauce",
      "Grill or pan-sear until glazed and cooked",
      "Prepare vegetables by julienning or dicing",
      "Arrange components artfully in bowl",
      "Drizzle with additional teriyaki sauce",
      "Garnish with sesame seeds and pickled ginger"
    ],
    Thai: [
      "Cook jasmine rice according to package directions",
      "Heat coconut milk in a large pan",
      "Add curry paste and stir until fragrant",
      "Add protein and vegetables, simmer until done",
      "Season with fish sauce and lime juice",
      "Add fresh Thai basil at the end",
      "Serve hot over jasmine rice"
    ]
  }
  
  return baseInstructions[cuisine as keyof typeof baseInstructions] || baseInstructions.Mediterranean
}

function generateStaticMeal(mealType: string, targetCalories: number, profile: any): NextResponse {
  const mealVariations = [
    { name: "Mediterranean Quinoa Bowl", cuisine: "Mediterranean" },
    { name: "Asian Stir-Fry Delight", cuisine: "Asian" },
    { name: "Mexican Power Burrito", cuisine: "Mexican" },
    { name: "Italian Protein Pasta", cuisine: "Italian" },
    { name: "Indian Spice Bowl", cuisine: "Indian" },
    { name: "American Classic Grill", cuisine: "American" },
    { name: "Japanese Teriyaki Plate", cuisine: "Japanese" },
    { name: "Thai Coconut Curry", cuisine: "Thai" }
  ]
  const randomMeal = mealVariations[Math.floor(Math.random() * mealVariations.length)]
  
  const testMeal = {
    name: `${mealType.charAt(0).toUpperCase() + mealType.slice(1)}: ${randomMeal.name}`,
    cuisine: randomMeal.cuisine,
    description: `A delicious ${randomMeal.cuisine}-inspired ${mealType} crafted for ${profile.goal} with authentic flavors and premium ingredients`,
    calories: targetCalories,
    protein: Math.round(targetCalories * 0.25 / 4),
    carbs: Math.round(targetCalories * 0.45 / 4),
    fat: Math.round(targetCalories * 0.30 / 9),
    ingredients: getRandomIngredients(randomMeal.cuisine),
    prepTime: 20 + Math.floor(Math.random() * 15),
    cookTime: 15 + Math.floor(Math.random() * 20),
    servings: 1,
    instructions: generateRecipeInstructions(randomMeal.cuisine, mealType),
    benefits: profile.goal === "weight-loss" ? ["Low calorie", "High protein", "Metabolism boosting"] : ["Muscle building", "Energy enhancing", "Recovery supporting"],
    recipeDetails: {
      difficulty: ["Easy", "Medium", "Hard"][Math.floor(Math.random() * 3)],
      servings: 1,
      cuisine: randomMeal.cuisine,
      dietaryTags: [profile.dietaryPreference, profile.goal === "weight-loss" ? "Low Calorie" : "High Protein"]
    }
  }

  console.log('Returning static meal:', testMeal.name)
  return NextResponse.json({ success: true, meal: testMeal, static: true })
}

async function generateAIRecipeInstructions(mealName: string, mealType: string, dietaryPreference: string, targetCalories: number): Promise<string[]> {
  const recipePrompt = `Generate detailed step-by-step cooking instructions for "${mealName}" (${mealType}) with ${targetCalories} calories for ${dietaryPreference} diet.
  
  Please provide:
  1. 6-8 detailed cooking steps
  2. Specific cooking techniques and temperatures
  3. Preparation tips and timing
  4. Serving suggestions
  
  Format as a numbered list of clear, actionable instructions that a home cook can follow.`

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GOOGLE_AI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: recipePrompt
          }]
        }]
      })
    })

    if (!response.ok) {
      console.error('Recipe API error:', response.status)
      // Return fallback instructions
      return generateFallbackRecipeInstructions(mealType, dietaryPreference)
    }

    const data = await response.json()
    const aiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text
    
    if (!aiResponse) {
      return generateFallbackRecipeInstructions(mealType, dietaryPreference)
    }

    // Extract numbered steps from the response
    const steps = aiResponse.split(/\d+\./).filter((step: string) => step.trim().length > 0)
      .map((step: string) => step.trim().replace(/^\d+\./, '').trim())
      .slice(0, 8) // Limit to 8 steps

    return steps.length > 0 ? steps : generateFallbackRecipeInstructions(mealType, dietaryPreference)

  } catch (error) {
    console.error('Error generating recipe instructions:', error)
    return generateFallbackRecipeInstructions(mealType, dietaryPreference)
  }
}

function generateFallbackRecipeInstructions(mealType: string, dietaryPreference: string): string[] {
  const fallbackInstructions = {
    breakfast: [
      "Gather and prepare all ingredients",
      "Preheat cooking equipment as needed",
      "Mix dry ingredients in a large bowl",
      "Combine wet ingredients separately",
      "Fold wet into dry ingredients until just mixed",
      "Cook according to desired method",
      "Season to taste and serve immediately"
    ],
    lunch: [
      "Prepare all vegetables and proteins",
      "Heat pan or cooking surface to medium-high heat",
      "Cook proteins until done (internal temperature safe)",
      "Add vegetables and cook until tender-crisp",
      "Season with herbs and spices",
      "Let rest for 2-3 minutes before serving",
      "Garnish and serve warm"
    ],
    dinner: [
      "Preheat oven or prepare cooking surface",
      "Season proteins with salt and pepper",
      "Sear proteins on all sides until golden",
      "Add aromatics (garlic, onions, herbs)",
      "Finish cooking in oven or on stovetop",
      "Rest protein before slicing",
      "Serve with prepared sides"
    ],
    snacks: [
      "Wash and prepare all ingredients",
      "Portion out servings",
      "Combine ingredients as needed",
      "Season lightly",
      "Chill if required",
      "Garnish before serving",
      "Enjoy immediately or store properly"
    ]
  }

  return fallbackInstructions[mealType as keyof typeof fallbackInstructions] || fallbackInstructions.lunch
}

function generateMealBenefits(meal: any, goal: string): string[] {
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

  if (meal.carbs > 40) {
    benefits.push("Rich in carbohydrates for sustained energy")
  }

  if (benefits.length === 0) {
    benefits.push("Balanced nutrition for overall health")
  }

  return benefits
}

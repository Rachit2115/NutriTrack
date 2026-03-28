import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'

const gemini = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

/* -----------------------------
   POST API
----------------------------- */

export async function POST(request: NextRequest) {
  try {
    const { image } = await request.json()

    if (!image) {
      return NextResponse.json(
        { success: false, error: 'No image provided' },
        { status: 400 }
      )
    }

    /* -----------------------------
       STEP 1: Clean base64 image
    ----------------------------- */

    const base64Image = image.replace(/^data:image\/[a-z]+;base64,/, '')

    console.log('Analyzing food image with Gemini AI...')
    console.log('Base64 image length:', base64Image.length)
    console.log('Gemini API key exists:', !!process.env.GEMINI_API_KEY)

    /* -----------------------------
       STEP 2: Gemini food detection
    ----------------------------- */

    const model = gemini.getGenerativeModel({
      model: 'gemini-2.5-flash'
    })

    const prompt = `
You are an expert food recognition AI specializing in Indian and international cuisine.

Analyze the food image and return ONLY the specific dish name.

Rules:
- Return the most likely dish name
- Be specific (e.g., "Paneer Butter Masala" instead of just "Curry")
- Use proper capitalization for dish names
- Do not include explanations or sentences
- Return only 1 dish name

Examples:
Pizza
Paneer Butter Masala
Burger
Biryani
Rajma Chawal
Dal Makhani
`

    console.log('Sending request to Gemini...')
    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          data: base64Image,
          mimeType: 'image/jpeg'
        }
      }
    ])

    const response = await result.response
    const dishName = response.text().trim()

    console.log('Gemini detected dish:', dishName)
    console.log('Raw response text:', response.text())

    if (!dishName || dishName.length < 2) {
      console.log('Invalid dish name from Gemini, using fallback')
      return NextResponse.json({
        success: false,
        error: 'Could not identify dish properly',
        debug: {
          geminiResponse: response.text(),
          dishName: dishName
        }
      })
    }

    /* -----------------------------
       STEP 3: Nutrition estimation
    ----------------------------- */

    const nutrition = await getNutritionEstimate(dishName)

    if (!nutrition) {
      return NextResponse.json({
        success: true,
        foodName: dishName,
        calories: 300,
        protein: 15,
        carbs: 35,
        fat: 12,
        servingSize: "1 serving",
        warning: "Dish detected but using estimated nutrition"
      })
    }

    /* -----------------------------
       STEP 4: Return Result
    ----------------------------- */

    return NextResponse.json({
      success: true,
      foodName: dishName,
      calories: nutrition.calories,
      protein: nutrition.protein,
      carbs: nutrition.carbs,
      fat: nutrition.fat,
      servingSize: nutrition.servingSize || "1 serving",
      confidence: 0.9,
      detectedItems: [dishName],
      ingredients: [dishName]
    })

  } catch (error) {
    console.error('Food detection error:', error)
    return getFallbackAnalysis()
  }
}

/* -----------------------------
   Nutrition Estimation Function
----------------------------- */

async function getNutritionEstimate(food: string) {
  try {
    // Use our existing food profiles database
    const foodProfiles: { [key: string]: any } = {
      // Indian dishes
      'paneer butter masala': { calories: 450, protein: 15, carbs: 30, fat: 30, servingSize: "1 bowl" },
      'matar paneer': { calories: 380, protein: 18, carbs: 25, fat: 22, servingSize: "1 bowl" },
      'shahi paneer': { calories: 480, protein: 16, carbs: 35, fat: 35, servingSize: "1 bowl" },
      'paneer tikka masala': { calories: 420, protein: 25, carbs: 20, fat: 28, servingSize: "1 bowl" },
      'butter chicken': { calories: 490, protein: 32, carbs: 18, fat: 32, servingSize: "1 bowl" },
      'chicken tikka masala': { calories: 470, protein: 35, carbs: 22, fat: 26, servingSize: "1 bowl" },
      'dal makhani': { calories: 320, protein: 12, carbs: 40, fat: 14, servingSize: "1 bowl" },
      'palak paneer': { calories: 350, protein: 16, carbs: 18, fat: 24, servingSize: "1 bowl" },
      'aloo gobi': { calories: 280, protein: 8, carbs: 35, fat: 12, servingSize: "1 bowl" },
      'chole': { calories: 290, protein: 14, carbs: 42, fat: 8, servingSize: "1 bowl" },
      'biryani': { calories: 350, protein: 18, carbs: 52, fat: 10, servingSize: "1 plate" },
      'curry': { calories: 320, protein: 20, carbs: 28, fat: 18, servingSize: "1 bowl" },
      'dal': { calories: 180, protein: 10, carbs: 30, fat: 4, servingSize: "1 bowl" },
      'samosa': { calories: 150, protein: 3, carbs: 20, fat: 8, servingSize: "2 pieces" },
      'naan': { calories: 200, protein: 6, carbs: 38, fat: 3, servingSize: "1 piece" },
      'roti': { calories: 120, protein: 4, carbs: 24, fat: 2, servingSize: "1 piece" },
      'paneer': { calories: 300, protein: 20, carbs: 5, fat: 22, servingSize: "100g" },
      'dosa': { calories: 180, protein: 6, carbs: 35, fat: 4, servingSize: "2 dosas" },
      'idli': { calories: 80, protein: 3, carbs: 15, fat: 1, servingSize: "2 idlis" },
      
      // Common dishes
      'pizza': { calories: 450, protein: 18, carbs: 55, fat: 18, servingSize: "2 slices" },
      'burger': { calories: 550, protein: 25, carbs: 40, fat: 32, servingSize: "1 burger" },
      'salad': { calories: 150, protein: 8, carbs: 12, fat: 9, servingSize: "1 bowl" },
      'pasta': { calories: 380, protein: 14, carbs: 65, fat: 8, servingSize: "1 cup" },
      'soup': { calories: 180, protein: 10, carbs: 20, fat: 6, servingSize: "1 bowl" },
      'cake': { calories: 320, protein: 4, carbs: 45, fat: 15, servingSize: "1 slice" },
      'bread': { calories: 120, protein: 4, carbs: 22, fat: 1, servingSize: "1 slice" },
      'rice': { calories: 205, protein: 4, carbs: 45, fat: 0.4, servingSize: "1 cup" },
      'chicken': { calories: 280, protein: 31, carbs: 0, fat: 16, servingSize: "100g" },
      'fish': { calories: 206, protein: 22, carbs: 0, fat: 12, servingSize: "100g" },
      'meat': { calories: 250, protein: 25, carbs: 0, fat: 15, servingSize: "100g" },
      'fruit': { calories: 80, protein: 1, carbs: 20, fat: 0.3, servingSize: "1 cup" },
      'vegetable': { calories: 50, protein: 2, carbs: 10, fat: 0.2, servingSize: "1 cup" }
    }

    // Try to find exact match first
    const foodLower = food.toLowerCase()
    let matchedFood = Object.keys(foodProfiles).find(profile => 
      profile.toLowerCase() === foodLower
    )

    // If no exact match, try partial matching
    if (!matchedFood) {
      matchedFood = Object.keys(foodProfiles).find(profile => 
        foodLower.includes(profile.toLowerCase()) || profile.toLowerCase().includes(foodLower)
      )
    }

    if (matchedFood) {
      console.log(`Using ${matchedFood} nutrition profile`)
      return foodProfiles[matchedFood]
    }

    // Default nutrition if no match found
    console.log('Using default nutrition profile')
    return {
      calories: 300,
      protein: 15,
      carbs: 35,
      fat: 12,
      servingSize: "1 serving"
    }

  } catch (error) {
    console.error('Nutrition estimation error:', error)
    return null
  }
}

// Fallback analysis function for when Gemini API is not available
function getFallbackAnalysis() {
  console.log('=== FALLBACK ANALYSIS TRIGGERED ===')
  console.log('Gemini API failed - using fallback analysis')
  
  const mockAnalysis = {
    foodName: "Delicious Meal",
    calories: 350,
    protein: 20,
    carbs: 40,
    fat: 12,
    servingSize: "1 serving",
    confidence: 0.75,
    detectedItems: ["food", "meal"],
    ingredients: ["Mixed ingredients"],
    fallback: true,
    warning: "AI analysis failed - using placeholder analysis."
  }

  console.log('Returning fallback analysis:', mockAnalysis)

  return NextResponse.json({
    success: true,
    ...mockAnalysis
  })
}

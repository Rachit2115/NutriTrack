"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsItem } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { RefreshCw, Clock, Flame, Target, Dumbbell, ChefHat, BookOpen } from "lucide-react"
import { useProfileContext } from "@/components/profile-context"
import { generateAIMealPlan } from "@/lib/ai-nutritionist"
import { Badge } from "@/components/ui/badge"

export default function MealPlanner() {
  const { currentProfile } = useProfileContext()
  const [mealPlan, setMealPlan] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [selectedDay, setSelectedDay] = useState("day1")
  const [expandedRecipes, setExpandedRecipes] = useState<Set<string>>(new Set())

  // Calculate macro targets based on scientific formulas
  const calculateMacroTargets = (profile: any) => {
    console.log('Calculating macro targets for profile:', profile)
    
    if (!profile || !profile.weight) {
      console.log('No profile or weight, returning defaults')
      return { protein: 150, fat: 65, carbs: 250, calories: 2000 }
    }

    const weightKg = profile.weight
    const goal = profile.goal || 'maintenance'
    
    console.log('Weight:', weightKg, 'Goal:', goal)

    // Calculate TDEE first
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
    const tdee = Math.round(bmr * (activityMultipliers[profile.activityLevel] || 1.2))

    // Adjust calories based on goal
    let goalCalories = tdee
    if (goal === "weight-loss") {
      goalCalories = Math.round(tdee * 0.8)
    } else if (goal === "muscle-gain") {
      goalCalories = Math.round(tdee * 1.1)
    }
    
    console.log('TDEE:', tdee, 'Goal Calories:', goalCalories)

    // Protein Factor based on goal
    let proteinFactor = 1.0 // Normal health default
    if (goal === 'weight-loss') {
      proteinFactor = 1.4 // Middle of 1.2-1.6 range
    } else if (goal === 'muscle-gain') {
      proteinFactor = 1.9 // Middle of 1.6-2.2 range
    } else if (goal === 'maintenance' || goal === 'general') {
      proteinFactor = 0.9 // Middle of 0.8-1.0 range
    }
    
    console.log('Protein Factor:', proteinFactor)

    // Fat Factor based on goal
    let fatFactor = 0.8 // Normal default
    if (goal === 'weight-loss') {
      fatFactor = 0.6 // Low fat diet
    } else if (goal === 'muscle-gain') {
      fatFactor = 0.9 // Middle of 0.8-1.0 range
    }
    
    console.log('Fat Factor:', fatFactor)

    // Calculate Protein: Weight (kg) × Protein Factor
    const proteinGrams = Math.round(weightKg * proteinFactor)

    // Calculate Fat: Weight (kg) × Fat Factor
    const fatGrams = Math.round(weightKg * fatFactor)

    // Calculate Carbs: (Total Calories - (Protein×4 + Fat×9)) / 4
    const caloriesFromProtein = proteinGrams * 4
    const caloriesFromFat = fatGrams * 9
    const remainingCalories = goalCalories - (caloriesFromProtein + caloriesFromFat)
    const carbsGrams = Math.max(0, Math.round(remainingCalories / 4))
    
    const result = {
      protein: proteinGrams,
      fat: fatGrams,
      carbs: carbsGrams,
      calories: goalCalories
    }
    
    console.log('Calculated targets:', result)

    return result
  }

  // Get calculated macro targets
  const calculatedTargets = currentProfile ? calculateMacroTargets(currentProfile) : { protein: 150, fat: 65, carbs: 250, calories: 2000 }
  
  console.log('Final calculatedTargets:', calculatedTargets)

  useEffect(() => {
    if (currentProfile) {
      // Check if we have a meal plan in local storage
      const savedMealPlan = localStorage.getItem("aiMealPlan")
      if (savedMealPlan) {
        const parsed = JSON.parse(savedMealPlan)
        // Check if the saved plan matches current profile
        if (parsed.profileId === currentProfile.id) {
          setMealPlan(parsed)
        } else {
          // Generate new plan for different profile
          createAIMealPlan(currentProfile)
        }
      } else {
        // Generate a new meal plan
        createAIMealPlan(currentProfile)
      }
    }
  }, [currentProfile])

  async function createAIMealPlan(profile: any, forceRegenerate: boolean = false) {
    if (!profile) return

    setLoading(true)

    try {
      // Add timestamp to force different AI responses
      const profileWithTimestamp = {
        ...profile,
        regenerationTimestamp: Date.now(),
        forceNewPlan: forceRegenerate
      }
      
      const newMealPlan = await generateAIMealPlan(profileWithTimestamp)
      const planWithProfile = { ...newMealPlan, profileId: profile.id }
      setMealPlan(planWithProfile)

      // Save to local storage
      localStorage.setItem("aiMealPlan", JSON.stringify(planWithProfile))
    } catch (error) {
      console.error("Failed to generate AI meal plan:", error)
      // Show user-friendly error message
      if (error instanceof Error && error.message.includes('API request failed')) {
        console.log('Using fallback meal database due to API issues')
      }
    } finally {
      setLoading(false)
    }
  }

  function regenerateMealPlan() {
    if (currentProfile) {
      // Clear existing meal plan from localStorage to force regeneration
      localStorage.removeItem("aiMealPlan")
      createAIMealPlan(currentProfile, true)
    }
  }

  const toggleRecipe = (mealId: string) => {
    const newExpanded = new Set(expandedRecipes)
    if (newExpanded.has(mealId)) {
      newExpanded.delete(mealId)
    } else {
      newExpanded.add(mealId)
    }
    setExpandedRecipes(newExpanded)
  }

  if (!currentProfile) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Please create a profile to generate personalized meal plans.</p>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin w-8 h-8 border-4 border-green-600 border-t-transparent rounded-full"></div>
        <span className="ml-3 text-gray-600">Generating your personalized AI meal plan...</span>
      </div>
    )
  }

  if (!mealPlan) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No meal plan available.</p>
      </div>
    )
  }

  const dayNames = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
  const currentDayData = mealPlan.days[selectedDay]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">AI-Powered Meal Plan</h2>
          <p className="text-gray-600">Personalized nutrition plan based on your profile and goals</p>
        </div>
        <Button onClick={regenerateMealPlan} disabled={loading}>
          <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          Regenerate Plan
        </Button>
      </div>

      {/* Daily Nutrition Summary */}
      <Card className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-green-600" />
            Daily Nutrition Targets
          </CardTitle>
          <CardDescription>
            Based on your profile: {currentProfile.weight}kg, Goal: {currentProfile.goal?.replace('-', ' ')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{calculatedTargets.calories}</div>
              <div className="text-sm text-gray-600">kcal</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{calculatedTargets.protein}g</div>
              <div className="text-sm text-gray-600">Protein</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{calculatedTargets.carbs}g</div>
              <div className="text-sm text-gray-600">Carbs</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{calculatedTargets.fat}g</div>
              <div className="text-sm text-gray-600">Fat</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Day Selector */}
      <Tabs value={selectedDay} onValueChange={setSelectedDay}>
        <TabsList className="grid w-full grid-cols-7">
          {dayNames.map((day, index) => (
            <TabsItem key={`day${index + 1}`} value={`day${index + 1}`}>
              {day.slice(0, 3)}
            </TabsItem>
          ))}
        </TabsList>

        {Object.keys(mealPlan.days).map((dayKey) => (
          <TabsContent key={dayKey} value={dayKey}>
            <div className="space-y-6">
              {/* Day Summary */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>{dayNames[parseInt(dayKey.replace('day', '')) - 1]}</span>
                    <Badge variant="outline">
                      {mealPlan.days[dayKey].totals.calories} kcal
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div className="text-center">
                      <span className="font-medium text-blue-600">{mealPlan.days[dayKey].totals.protein}g</span>
                      <span className="text-gray-600 ml-1">Protein</span>
                    </div>
                    <div className="text-center">
                      <span className="font-medium text-orange-600">{mealPlan.days[dayKey].totals.carbs}g</span>
                      <span className="text-gray-600 ml-1">Carbs</span>
                    </div>
                    <div className="text-center">
                      <span className="font-medium text-purple-600">{mealPlan.days[dayKey].totals.fat}g</span>
                      <span className="text-gray-600 ml-1">Fat</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Meals */}
              <div className="grid gap-6">
                {/* Breakfast */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-yellow-100 dark:bg-yellow-900 rounded-full flex items-center justify-center">
                        <span className="text-yellow-600 dark:text-yellow-400 text-sm">🌅</span>
                      </div>
                      Breakfast
                      <Badge variant="secondary">{mealPlan.days[dayKey].breakfast[0].calories} kcal</Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium text-lg">{mealPlan.days[dayKey].breakfast[0].name}</h4>
                        {mealPlan.days[dayKey].breakfast[0].cuisine && (
                          <Badge variant="outline" className="mb-2">
                            <ChefHat className="w-3 h-3 mr-1" />
                            {mealPlan.days[dayKey].breakfast[0].cuisine}
                          </Badge>
                        )}
                        <p className="text-gray-600 text-sm">{mealPlan.days[dayKey].breakfast[0].description}</p>
                      </div>
                      
                      <div className="grid grid-cols-4 gap-2 text-sm">
                        <div className="text-center">
                          <div className="font-medium">{mealPlan.days[dayKey].breakfast[0].protein}g</div>
                          <div className="text-gray-600">Protein</div>
                        </div>
                        <div className="text-center">
                          <div className="font-medium">{mealPlan.days[dayKey].breakfast[0].carbs}g</div>
                          <div className="text-gray-600">Carbs</div>
                        </div>
                        <div className="text-center">
                          <div className="font-medium">{mealPlan.days[dayKey].breakfast[0].fat}g</div>
                          <div className="text-gray-600">Fat</div>
                        </div>
                        <div className="text-center">
                          <div className="font-medium flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {mealPlan.days[dayKey].breakfast[0].prepTime}m
                          </div>
                          <div className="text-gray-600">Prep</div>
                        </div>
                      </div>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toggleRecipe(`breakfast-${dayKey}`)}
                        className="w-full"
                      >
                        <BookOpen className="w-4 h-4 mr-2" />
                        {expandedRecipes.has(`breakfast-${dayKey}`) ? 'Hide Recipe' : 'Show Recipe'}
                      </Button>

                      {expandedRecipes.has(`breakfast-${dayKey}`) && (
                        <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                          <h5 className="font-medium text-sm mb-2">Recipe Instructions:</h5>
                          <ol className="text-sm text-gray-600 space-y-1">
                            {mealPlan.days[dayKey].breakfast[0].instructions.map((instruction: string, idx: number) => (
                              <li key={idx} className="flex items-start gap-2">
                                <span className="text-blue-500 font-medium">{idx + 1}.</span>
                                <span>{instruction}</span>
                              </li>
                            ))}
                          </ol>
                        </div>
                      )}

                      <div>
                        <h5 className="font-medium text-sm mb-2">Ingredients:</h5>
                        <div className="flex flex-wrap gap-1">
                          {currentDayData.breakfast[0].ingredients.map((ingredient: string, idx: number) => (
                            <Badge key={idx} variant="outline" className="text-xs">
                              {ingredient}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h5 className="font-medium text-sm mb-2">Benefits:</h5>
                        <ul className="text-sm text-gray-600 space-y-1">
                          {currentDayData.breakfast[0].benefits.map((benefit: string, idx: number) => (
                            <li key={idx} className="flex items-start gap-2">
                              <span className="text-green-500">•</span>
                              {benefit}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Lunch */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center">
                        <span className="text-orange-600 dark:text-orange-400 text-sm">☀️</span>
                      </div>
                      Lunch
                      <Badge variant="secondary">{currentDayData.lunch[0].calories} kcal</Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium text-lg">{currentDayData.lunch[0].name}</h4>
                        {currentDayData.lunch[0].cuisine && (
                          <Badge variant="outline" className="mb-2">
                            <ChefHat className="w-3 h-3 mr-1" />
                            {currentDayData.lunch[0].cuisine}
                          </Badge>
                        )}
                        <p className="text-gray-600 text-sm">{currentDayData.lunch[0].description}</p>
                      </div>
                      
                      <div className="grid grid-cols-4 gap-2 text-sm">
                        <div className="text-center">
                          <div className="font-medium">{currentDayData.lunch[0].protein}g</div>
                          <div className="text-gray-600">Protein</div>
                        </div>
                        <div className="text-center">
                          <div className="font-medium">{currentDayData.lunch[0].carbs}g</div>
                          <div className="text-gray-600">Carbs</div>
                        </div>
                        <div className="text-center">
                          <div className="font-medium">{currentDayData.lunch[0].fat}g</div>
                          <div className="text-gray-600">Fat</div>
                        </div>
                        <div className="text-center">
                          <div className="font-medium flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {currentDayData.lunch[0].prepTime}m
                          </div>
                          <div className="text-gray-600">Prep</div>
                        </div>
                      </div>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toggleRecipe(`lunch-${dayKey}`)}
                        className="w-full"
                      >
                        <BookOpen className="w-4 h-4 mr-2" />
                        {expandedRecipes.has(`lunch-${dayKey}`) ? 'Hide Recipe' : 'Show Recipe'}
                      </Button>

                      {expandedRecipes.has(`lunch-${dayKey}`) && (
                        <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                          <h5 className="font-medium text-sm mb-2">Recipe Instructions:</h5>
                          <ol className="text-sm text-gray-600 space-y-1">
                            {currentDayData.lunch[0].instructions.map((instruction: string, idx: number) => (
                              <li key={idx} className="flex items-start gap-2">
                                <span className="text-blue-500 font-medium">{idx + 1}.</span>
                                <span>{instruction}</span>
                              </li>
                            ))}
                          </ol>
                        </div>
                      )}

                      <div>
                        <h5 className="font-medium text-sm mb-2">Ingredients:</h5>
                        <div className="flex flex-wrap gap-1">
                          {currentDayData.lunch[0].ingredients.map((ingredient: string, idx: number) => (
                            <Badge key={idx} variant="outline" className="text-xs">
                              {ingredient}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h5 className="font-medium text-sm mb-2">Benefits:</h5>
                        <ul className="text-sm text-gray-600 space-y-1">
                          {currentDayData.lunch[0].benefits.map((benefit: string, idx: number) => (
                            <li key={idx} className="flex items-start gap-2">
                              <span className="text-green-500">•</span>
                              {benefit}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Dinner */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 dark:text-blue-400 text-sm">🌙</span>
                      </div>
                      Dinner
                      <Badge variant="secondary">{currentDayData.dinner[0].calories} kcal</Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium text-lg">{currentDayData.dinner[0].name}</h4>
                        {currentDayData.dinner[0].cuisine && (
                          <Badge variant="outline" className="mb-2">
                            <ChefHat className="w-3 h-3 mr-1" />
                            {currentDayData.dinner[0].cuisine}
                          </Badge>
                        )}
                        <p className="text-gray-600 text-sm">{currentDayData.dinner[0].description}</p>
                      </div>
                      
                      <div className="grid grid-cols-4 gap-2 text-sm">
                        <div className="text-center">
                          <div className="font-medium">{currentDayData.dinner[0].protein}g</div>
                          <div className="text-gray-600">Protein</div>
                        </div>
                        <div className="text-center">
                          <div className="font-medium">{currentDayData.dinner[0].carbs}g</div>
                          <div className="text-gray-600">Carbs</div>
                        </div>
                        <div className="text-center">
                          <div className="font-medium">{currentDayData.dinner[0].fat}g</div>
                          <div className="text-gray-600">Fat</div>
                        </div>
                        <div className="text-center">
                          <div className="font-medium flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {currentDayData.dinner[0].prepTime}m
                          </div>
                          <div className="text-gray-600">Prep</div>
                        </div>
                      </div>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toggleRecipe(`dinner-${dayKey}`)}
                        className="w-full"
                      >
                        <BookOpen className="w-4 h-4 mr-2" />
                        {expandedRecipes.has(`dinner-${dayKey}`) ? 'Hide Recipe' : 'Show Recipe'}
                      </Button>

                      {expandedRecipes.has(`dinner-${dayKey}`) && (
                        <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                          <h5 className="font-medium text-sm mb-2">Recipe Instructions:</h5>
                          <ol className="text-sm text-gray-600 space-y-1">
                            {currentDayData.dinner[0].instructions.map((instruction: string, idx: number) => (
                              <li key={idx} className="flex items-start gap-2">
                                <span className="text-blue-500 font-medium">{idx + 1}.</span>
                                <span>{instruction}</span>
                              </li>
                            ))}
                          </ol>
                        </div>
                      )}

                      <div>
                        <h5 className="font-medium text-sm mb-2">Ingredients:</h5>
                        <div className="flex flex-wrap gap-1">
                          {currentDayData.dinner[0].ingredients.map((ingredient: string, idx: number) => (
                            <Badge key={idx} variant="outline" className="text-xs">
                              {ingredient}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h5 className="font-medium text-sm mb-2">Benefits:</h5>
                        <ul className="text-sm text-gray-600 space-y-1">
                          {currentDayData.dinner[0].benefits.map((benefit: string, idx: number) => (
                            <li key={idx} className="flex items-start gap-2">
                              <span className="text-green-500">•</span>
                              {benefit}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Snacks */}
                <div className="grid md:grid-cols-2 gap-4">
                  {currentDayData.snacks.map((snack: any, idx: number) => (
                    <Card key={idx}>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center">
                            <span className="text-purple-600 dark:text-purple-400 text-sm">🍎</span>
                          </div>
                          Snack {idx + 1}
                          <Badge variant="secondary">{snack.calories} kcal</Badge>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <div>
                            <h4 className="font-medium text-lg">{snack.name}</h4>
                            {snack.cuisine && (
                              <Badge variant="outline" className="mb-2">
                                <ChefHat className="w-3 h-3 mr-1" />
                                {snack.cuisine}
                              </Badge>
                            )}
                            <p className="text-gray-600 text-sm">{snack.description}</p>
                          </div>
                          
                          <div className="grid grid-cols-3 gap-2 text-sm">
                            <div className="text-center">
                              <div className="font-medium">{snack.protein}g</div>
                              <div className="text-gray-600">Protein</div>
                            </div>
                            <div className="text-center">
                              <div className="font-medium">{snack.carbs}g</div>
                              <div className="text-gray-600">Carbs</div>
                            </div>
                            <div className="text-center">
                              <div className="font-medium">{snack.fat}g</div>
                              <div className="text-gray-600">Fat</div>
                            </div>
                          </div>

                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => toggleRecipe(`snack-${dayKey}-${idx}`)}
                            className="w-full"
                          >
                            <BookOpen className="w-4 h-4 mr-2" />
                            {expandedRecipes.has(`snack-${dayKey}-${idx}`) ? 'Hide Recipe' : 'Show Recipe'}
                          </Button>

                          {expandedRecipes.has(`snack-${dayKey}-${idx}`) && (
                            <div className="mt-2 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                              <h5 className="font-medium text-sm mb-2">Recipe Instructions:</h5>
                              <ol className="text-xs text-gray-600 space-y-1">
                                {snack.instructions.map((instruction: string, instructionIdx: number) => (
                                  <li key={instructionIdx} className="flex items-start gap-2">
                                    <span className="text-blue-500 font-medium">{instructionIdx + 1}.</span>
                                    <span>{instruction}</span>
                                  </li>
                                ))}
                              </ol>
                            </div>
                          )}

                          <div>
                            <h5 className="font-medium text-xs mb-1">Ingredients:</h5>
                            <div className="flex flex-wrap gap-1">
                              {snack.ingredients.map((ingredient: string, ingredientIdx: number) => (
                                <Badge key={ingredientIdx} variant="outline" className="text-xs">
                                  {ingredient}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>
        ))}
      </Tabs>

      {/* AI Recommendations */}
      {mealPlan.recommendations && mealPlan.recommendations.length > 0 && (
        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Dumbbell className="h-5 w-5 text-blue-600" />
              AI Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {mealPlan.recommendations.map((recommendation: string, idx: number) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-blue-500 mt-1">•</span>
                  <span className="text-sm">{recommendation}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Personalized Tips */}
      {mealPlan.personalizedTips && mealPlan.personalizedTips.length > 0 && (
        <Card className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Flame className="h-5 w-5 text-green-600" />
              Personalized Tips
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {mealPlan.personalizedTips.map((tip: string, idx: number) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-green-500 mt-1">•</span>
                  <span className="text-sm">{tip}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  )
}


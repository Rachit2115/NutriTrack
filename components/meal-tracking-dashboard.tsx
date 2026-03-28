"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsItem, TabsList } from "@/components/ui/tabs"
import { useProfileContext } from "@/components/profile-context"
import { useAuth } from "@/components/auth-context"
import { MealTrackingService, MealRecord, FoodDatabaseItem } from "@/lib/enhanced-meal-tracking"
import { supabase } from "@/lib/supabase"
import { Plus, Search, Calendar, Target, TrendingUp, Clock, Flame } from "lucide-react"
import { format } from "date-fns"

export default function MealTrackingDashboardNEW() {
  console.log('🚀 NEW MealTrackingDashboard LOADED!!! -', new Date().toLocaleTimeString())
  alert('🎉 NEW Supabase Meal Tracker is now loaded! This message should only appear once.')
  
  const { currentProfile } = useProfileContext()
  const { user } = useAuth()
  const [meals, setMeals] = useState<MealRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<FoodDatabaseItem[]>([])
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'))
  const [dailyTotals, setDailyTotals] = useState({
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0
  })
  const [newMeal, setNewMeal] = useState({
    meal_type: 'breakfast' as const,
    food_name: '',
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
    serving_size: ''
  })

  useEffect(() => {
    if (currentProfile) {
      loadMeals()
      loadDailyTotals()
    }
  }, [currentProfile, selectedDate])

  const loadMeals = async () => {
    if (!currentProfile || !user) return
    
    try {
      setLoading(true)
      const mealData = await MealTrackingService.getMeals(
        user.id,
        currentProfile.id,
        `${selectedDate}T00:00:00.000Z`,
        `${selectedDate}T23:59:59.999Z`
      )
      setMeals(mealData)
    } catch (error) {
      console.error('Error loading meals:', error)
      setMeals([])
    } finally {
      setLoading(false)
    }
  }

  const loadDailyTotals = async () => {
    if (!currentProfile || !user) {
      // Set default values when no profile/user
      setDailyTotals({
        calories: 0,
        protein: 0,
        carbs: 0,
        fat: 0
      })
      return
    }
    
    try {
      const summary = await MealTrackingService.getDailyNutritionSummary(user.id, currentProfile.id, selectedDate)
      setDailyTotals({
        calories: summary.totalCalories || 0,
        protein: summary.totalProtein || 0,
        carbs: summary.totalCarbs || 0,
        fat: summary.totalFat || 0
      })
    } catch (error) {
      console.error('Error loading daily totals:', error)
      // Set default values on error
      setDailyTotals({
        calories: 0,
        protein: 0,
        carbs: 0,
        fat: 0
      })
    }
  }

  const searchFood = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([])
      return
    }

    try {
      const results = await MealTrackingService.searchFood(query)
      setSearchResults(results)
    } catch (error) {
      console.error('Error searching food:', error)
    }
  }

  const addMeal = async () => {
    console.log('addMeal called')
    console.log('currentProfile:', currentProfile)
    console.log('user:', user)
    console.log('newMeal:', newMeal)
    
    if (!currentProfile || !user || !newMeal.food_name) {
      console.error('Missing required data:', { currentProfile: !!currentProfile, user: !!user, foodName: !!newMeal.food_name })
      alert('Please fill in all required fields and ensure you have a profile created.')
      return
    }

    // Verify that the profile exists in the database
    try {
      console.log('Verifying profile exists...')
      const { data: profileCheck, error: profileError } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', currentProfile.id)
        .single()

      if (profileError || !profileCheck) {
        console.error('Profile does not exist in database:', profileError)
        console.log('Creating profile in database...')
        
        // Create the profile in the database
        const { data: newProfile, error: createError } = await supabase
          .from('profiles')
          .insert({
            id: currentProfile.id,
            user_id: user.id,
            name: currentProfile.name,
            age: currentProfile.age,
            weight: currentProfile.weight,
            height: currentProfile.height,
            gender: currentProfile.gender,
            activity_level: currentProfile.activityLevel,
            dietary_preference: currentProfile.dietaryPreference,
            goal: currentProfile.goal
          })
          .select()
          .single()

        if (createError) {
          console.error('Failed to create profile:', createError)
          alert(`Failed to create profile: ${createError.message}`)
          return
        }

        console.log('Profile created successfully:', newProfile)
      } else {
        console.log('Profile verified, proceeding with meal insertion...')
      }

      const now = new Date()
      const mealData = {
        user_id: user.id,
        profile_id: currentProfile.id,
        meal_type: newMeal.meal_type,
        food_name: newMeal.food_name,
        calories: newMeal.calories,
        protein: newMeal.protein,
        carbs: newMeal.carbs,
        fat: newMeal.fat,
        serving_size: newMeal.serving_size,
        // Database required fields
        entry_day: now.toLocaleDateString('en-US', { weekday: 'long' }), // e.g., 'Monday'
        entry_date: now.toISOString().split('T')[0], // e.g., '2026-03-28'
        consumed_at: now.toTimeString().split(' ')[0] // e.g., '14:30:00'
      }

      console.log('Creating meal with data:', mealData)
      const createdMeal = await MealTrackingService.createMeal(mealData)
      console.log('Meal creation result:', createdMeal)
      
      if (createdMeal) {
        setMeals(prev => [createdMeal, ...prev])
        loadDailyTotals()
        setNewMeal({
          meal_type: 'breakfast',
          food_name: '',
          calories: 0,
          protein: 0,
          carbs: 0,
          fat: 0,
          serving_size: ''
        })
        setSearchResults([])
        alert('Meal successfully added!')
      } else {
        alert('Failed to create meal - no data returned')
      }
    } catch (error) {
      console.error('Error adding meal:', error)
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
      alert(`Error adding meal: ${errorMessage}`)
    }
  }

  const selectFoodItem = (item: FoodDatabaseItem) => {
    setNewMeal(prev => ({
      ...prev,
      food_name: item.name,
      calories: Math.round(item.calories_per_100g),
      protein: Math.round(item.protein_per_100g * 10) / 10,
      carbs: Math.round(item.carbs_per_100g * 10) / 10,
      fat: Math.round(item.fat_per_100g * 10) / 10,
      serving_size: item.serving_size
    }))
    setSearchResults([])
  }

  const deleteMeal = async (mealId: string) => {
    try {
      await MealTrackingService.deleteMeal(mealId)
      setMeals(prev => prev.filter(meal => meal.id !== mealId))
      loadDailyTotals()
    } catch (error) {
      console.error('Error deleting meal:', error)
    }
  }

  if (!currentProfile) {
    return (
      <div className="flex items-center justify-center h-64">
        <p>Please create a profile to track meals.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* VERY OBVIOUS VERSION INDICATOR */}
      <div className="bg-red-600 text-white px-6 py-4 rounded-lg text-center text-xl font-bold animate-pulse">
        🚀 NEW SUPERBASE MEAL TRACKER IS NOW ACTIVE! 🚀
        <br />
        <span className="text-sm">If you see this, the new component is loaded!</span>
      </div>
      
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">🍽️ Supabase Meal Tracking</h2>
          <p className="text-gray-600">Your meals are now saved to the database!</p>
        </div>
        <div className="flex items-center gap-2">
          <Label htmlFor="date-select">Date:</Label>
          <Input
            id="date-select"
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-auto"
          />
        </div>
      </div>

      {/* Daily Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <Flame className="h-8 w-8 text-orange-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Calories</p>
                <p className="text-2xl font-bold text-gray-900">{dailyTotals.calories}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <Target className="h-8 w-8 text-red-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Protein</p>
                <p className="text-2xl font-bold text-gray-900">{dailyTotals.protein}g</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <TrendingUp className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Carbs</p>
                <p className="text-2xl font-bold text-gray-900">{dailyTotals.carbs}g</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-yellow-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Fat</p>
                <p className="text-2xl font-bold text-gray-900">{dailyTotals.fat}g</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="add-meal" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsItem value="add-meal">Add Meal</TabsItem>
          <TabsItem value="meals-list">Today's Meals</TabsItem>
        </TabsList>

        <TabsContent value="add-meal">
          <Card>
            <CardHeader>
              <CardTitle>Add New Meal</CardTitle>
              <CardDescription>Record what you ate</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="meal-type">Meal Type</Label>
                  <Select value={newMeal.meal_type} onValueChange={(value: any) => setNewMeal(prev => ({ ...prev, meal_type: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="breakfast">🌅 Breakfast</SelectItem>
                      <SelectItem value="lunch">☀️ Lunch</SelectItem>
                      <SelectItem value="dinner">🌙 Dinner</SelectItem>
                      <SelectItem value="snack">🍎 Snack</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="serving-size">Serving Size</Label>
                  <Input
                    id="serving-size"
                    placeholder="e.g., 1 cup, 100g"
                    value={newMeal.serving_size}
                    onChange={(e) => setNewMeal(prev => ({ ...prev, serving_size: e.target.value }))}
                  />
                </div>
              </div>

              <div className="relative">
                <Label htmlFor="food-search">Food Name</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="food-search"
                    placeholder="Search for food or enter manually"
                    value={newMeal.food_name}
                    onChange={(e) => {
                      setNewMeal(prev => ({ ...prev, food_name: e.target.value }))
                      searchFood(e.target.value)
                    }}
                    className="pl-10"
                  />
                </div>
                
                {/* Search Results Dropdown */}
                {searchResults.length > 0 && (
                  <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg max-h-40 overflow-y-auto">
                    {searchResults.map((item) => (
                      <div
                        key={item.id}
                        className="px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer text-sm"
                        onClick={() => selectFoodItem(item)}
                      >
                        <div className="font-medium">{item.name}</div>
                        <div className="text-gray-500 text-xs">
                          {item.calories_per_100g} cal per 100g • {item.category}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <Label htmlFor="calories">Calories</Label>
                  <Input
                    id="calories"
                    type="number"
                    placeholder="0"
                    value={newMeal.calories || ''}
                    onChange={(e) => setNewMeal(prev => ({ ...prev, calories: parseInt(e.target.value) || 0 }))}
                  />
                </div>
                <div>
                  <Label htmlFor="protein">Protein (g)</Label>
                  <Input
                    id="protein"
                    type="number"
                    step="0.1"
                    placeholder="0"
                    value={newMeal.protein || ''}
                    onChange={(e) => setNewMeal(prev => ({ ...prev, protein: parseFloat(e.target.value) || 0 }))}
                  />
                </div>
                <div>
                  <Label htmlFor="carbs">Carbs (g)</Label>
                  <Input
                    id="carbs"
                    type="number"
                    step="0.1"
                    placeholder="0"
                    value={newMeal.carbs || ''}
                    onChange={(e) => setNewMeal(prev => ({ ...prev, carbs: parseFloat(e.target.value) || 0 }))}
                  />
                </div>
                <div>
                  <Label htmlFor="fat">Fat (g)</Label>
                  <Input
                    id="fat"
                    type="number"
                    step="0.1"
                    placeholder="0"
                    value={newMeal.fat || ''}
                    onChange={(e) => setNewMeal(prev => ({ ...prev, fat: parseFloat(e.target.value) || 0 }))}
                  />
                </div>
              </div>

              <Button onClick={addMeal} className="w-full" disabled={!newMeal.food_name}>
                <Plus className="h-4 w-4 mr-2" />
                Add Meal
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="meals-list">
          <Card>
            <CardHeader>
              <CardTitle>Today's Meals</CardTitle>
              <CardDescription>Your recorded meals for {selectedDate}</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center h-32">
                  <div className="animate-spin w-6 h-6 border-2 border-green-600 border-t-transparent rounded-full"></div>
                </div>
              ) : meals.length === 0 ? (
                <div className="text-center py-8">
                  <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No meals recorded for this day</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {meals.map((meal) => (
                    <div key={meal.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="outline">
                            {meal.meal_type === 'breakfast' && '🌅'}
                            {meal.meal_type === 'lunch' && '☀️'}
                            {meal.meal_type === 'dinner' && '🌙'}
                            {meal.meal_type === 'snack' && '🍎'}
                            {meal.meal_type}
                          </Badge>
                          <span className="font-medium">{meal.food_name}</span>
                        </div>
                        <div className="text-sm text-gray-600">
                          {meal.serving_size} • {meal.calories} cal • 
                          P: {meal.protein}g • C: {meal.carbs}g • F: {meal.fat}g
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => deleteMeal(meal.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        Delete
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

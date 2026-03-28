"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, TrendingUp, Utensils, Flame, Target } from "lucide-react"
import { getUserProfile } from "@/lib/storage"
import { CalorieChart } from "@/components/calorie-chart"
import { NutrientChart } from "@/components/nutrient-chart"
import { formatDate, getDayRange } from "@/lib/date-utils"
import { supabase } from "@/lib/supabase"
import { useAuth } from "@/components/auth-context"

export default function Dashboard() {
  const router = useRouter()
  const { user } = useAuth()
  const [userProfile, setUserProfile] = useState<any>(null)
  const [currentDate, setCurrentDate] = useState<Date | null>(null)
  const [dailyEntries, setDailyEntries] = useState<any[]>([])
  const [weeklyData, setWeeklyData] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Initialize currentDate only on client side to prevent hydration mismatch
  useEffect(() => {
    setCurrentDate(new Date())
  }, [])

  // Nutrition totals
  const [caloriesConsumed, setCaloriesConsumed] = useState(0)
  const [proteinConsumed, setProteinConsumed] = useState(0)
  const [carbsConsumed, setCarbsConsumed] = useState(0)
  const [fatConsumed, setFatConsumed] = useState(0)

  const goalCalories = userProfile?.goalCalories || 2000

  useEffect(() => {
    if (!currentDate) return // Don't run until currentDate is set
    
    setIsLoading(true)
    // Load user profile
    const profile = getUserProfile()
    if (profile) {
      // Calculate goal calories based on profile
      const tdee = calculateTDEE(profile)
      let goalCals = tdee

      if (profile.goal === "weight-loss") {
        goalCals = Math.round(tdee * 0.8)
      } else if (profile.goal === "muscle-gain") {
        goalCals = Math.round(tdee * 1.1)
      }

      setUserProfile({
        ...profile,
        goalCalories: goalCals,
      })
    }

    // Load today's food entries
    loadDailyData()

    // Load weekly data for charts
    loadWeeklyData()

    setTimeout(() => {
      setIsLoading(false)
    }, 500)
  }, [currentDate])

  function calculateTDEE(profile: any) {
    // Simplified TDEE calculation for demo
    if (!profile) return 2000

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

  async function loadDailyData() {
    if (!currentDate || !user) return
    
    const dateString = formatDate(currentDate)
    const currentProfile = getUserProfile()
    
    try {
      // Fetch meals from Supabase for current user and profile
      let query = supabase
        .from('meals')
        .select('*')
        .eq('user_id', user.id)
        .eq('entry_date', dateString)
      
      // Filter by profile if exists
      if (currentProfile?.id) {
        query = query.eq('profile_id', currentProfile.id)
      }
      
      const { data: meals, error } = await query
      
      if (error) {
        console.error('Error fetching meals:', error)
        setDailyEntries([])
        setCaloriesConsumed(0)
        setProteinConsumed(0)
        setCarbsConsumed(0)
        setFatConsumed(0)
        return
      }
      
      const entries = meals || []
      
      if (entries.length > 0) {
        setDailyEntries(entries)

        // Calculate nutrition totals
        const totals = entries.reduce(
          (acc, entry) => ({
            calories: acc.calories + (entry.calories || 0),
            protein: acc.protein + (entry.protein || 0),
            carbs: acc.carbs + (entry.carbs || 0),
            fat: acc.fat + (entry.fat || 0),
          }),
          { calories: 0, protein: 0, carbs: 0, fat: 0 },
        )

        setCaloriesConsumed(totals.calories)
        setProteinConsumed(totals.protein)
        setCarbsConsumed(totals.carbs)
        setFatConsumed(totals.fat)
      } else {
        setDailyEntries([])
        setCaloriesConsumed(0)
        setProteinConsumed(0)
        setCarbsConsumed(0)
        setFatConsumed(0)
      }
    } catch (err) {
      console.error('Error in loadDailyData:', err)
      setDailyEntries([])
      setCaloriesConsumed(0)
      setProteinConsumed(0)
      setCarbsConsumed(0)
      setFatConsumed(0)
    }
  }

  async function loadWeeklyData() {
    if (!currentDate || !user) return
    const { startDate, endDate } = getDayRange(currentDate, 7, false)
    const weekData = []
    const currentProfile = getUserProfile()

    try {
      // Fetch all meals for the week from Supabase
      let query = supabase
        .from('meals')
        .select('*')
        .eq('user_id', user.id)
        .gte('entry_date', formatDate(new Date(startDate)))
        .lte('entry_date', formatDate(new Date(endDate)))
      
      // Filter by profile if exists
      if (currentProfile?.id) {
        query = query.eq('profile_id', currentProfile.id)
      }
      
      const { data: meals, error } = await query
      
      if (error) {
        console.error('Error fetching weekly meals:', error)
        // Fall back to empty data
        const currentDay = new Date(startDate)
        while (currentDay <= endDate) {
          const dateStr = formatDate(currentDay)
          weekData.push({
            date: dateStr,
            calories: 0,
            goal: goalCalories,
          })
          currentDay.setDate(currentDay.getDate() + 1)
        }
        setWeeklyData(weekData)
        return
      }

      // Group meals by date
      const mealsByDate: Record<string, any[]> = {}
      meals?.forEach((meal) => {
        const dateKey = meal.entry_date
        if (!mealsByDate[dateKey]) {
          mealsByDate[dateKey] = []
        }
        mealsByDate[dateKey].push(meal)
      })

      const currentDay = new Date(startDate)
      while (currentDay <= endDate) {
        const dateStr = formatDate(currentDay)
        const dayMeals = mealsByDate[dateStr] || []
        const dailyCalories = dayMeals.reduce((total, meal) => total + (meal.calories || 0), 0)

        weekData.push({
          date: dateStr,
          calories: dailyCalories,
          goal: goalCalories,
        })

        currentDay.setDate(currentDay.getDate() + 1)
      }

      setWeeklyData(weekData)
    } catch (err) {
      console.error('Error in loadWeeklyData:', err)
      // Fall back to empty data
      const currentDay = new Date(startDate)
      while (currentDay <= endDate) {
        const dateStr = formatDate(currentDay)
        weekData.push({
          date: dateStr,
          calories: 0,
          goal: goalCalories,
        })
        currentDay.setDate(currentDay.getDate() + 1)
      }
      setWeeklyData(weekData)
    }
  }

  function navigateDay(direction: number) {
    if (!currentDate) return
    const newDate = new Date(currentDate)
    newDate.setDate(newDate.getDate() + direction)
    setCurrentDate(newDate)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin w-12 h-12 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    )
  }

  return (
    <> 
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight text-gray-800 dark:text-white">
          Dashboard
        </h2>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigateDay(-1)}
            className="bg-white/40 dark:bg-background/30 backdrop-blur-md border-green-200/40 dark:border-green-200/40 dark:border-primary/15 hover:bg-green-40/50 dark:hover:bg-primary/10"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div className="font-medium px-2 py-1 rounded-md bg-white/40 dark:bg-background/30 backdrop-blur-md border border-green-200/40 dark:border-green-200/40 dark:border-primary/15 text-gray-700 dark:text-white flex items-center gap-2">
            <input
              type="date"
              value={currentDate ? formatDate(currentDate) : ''}
              onChange={(e) => {
                if (e.target.value) {
                  setCurrentDate(new Date(e.target.value))
                }
              }}
              className="bg-transparent border-none outline-none text-gray-700 dark:text-white text-sm cursor-pointer"
            />
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigateDay(1)}
            className="bg-white/40 dark:bg-background/30 backdrop-blur-md border-green-200/40 dark:border-green-200/40 dark:border-primary/15 hover:bg-green-40/50 dark:hover:bg-primary/10"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid gap-4 grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4">
        {/* Daily Calorie Goal - Green card */}
        <Card className="relative overflow-hidden backdrop-blur-xl shadow-lg border-2 border-green-400 dark:border-green-600/40 hover:shadow-xl transition-all duration-300" style={{ backgroundImage: 'url(/cal_goal_bg_logo.png)', backgroundSize: '100% 100%', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }}>
          <div className="absolute inset-0 bg-gradient-to-br from-green-200/50 to-green-100/30 dark:from-green-900/60 dark:to-green-800/40"></div>
          <div className="absolute inset-0 bg-gradient-radial from-green-200/20 dark:from-green-600/10 via-transparent to-transparent"></div>
          <CardHeader className="pb-1 sm:pb-2 flex flex-row items-center justify-between space-y-0 relative z-10">
            <CardTitle className="text-xs sm:text-sm font-medium text-green-800 dark:text-white">Daily Goal</CardTitle>
            <Target className="h-3 w-3 sm:h-4 sm:w-4 text-green-600 dark:text-green-300" />
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-xl sm:text-2xl md:text-3xl font-bold text-green-900 dark:text-white">{goalCalories}</div>
            <p className="text-xs sm:text-xs text-green-700 dark:text-green-200 hidden sm:block">Based on your profile</p>
          </CardContent>
        </Card>

        {/* Calories Consumed - Purple/Lavender card */}
        <Card className="relative overflow-hidden backdrop-blur-xl shadow-lg border-2 border-purple-400 dark:border-purple-600/40 hover:shadow-xl transition-all duration-300" style={{ backgroundImage: 'url(/cal_consumed_bg_logo.png)', backgroundSize: '100% 100%', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }}>
          <div className="absolute inset-0 bg-gradient-to-br from-purple-200/50 to-purple-100/30 dark:from-purple-900/60 dark:to-purple-800/40"></div>
          <div className="absolute inset-0 bg-gradient-radial from-purple-200/20 dark:from-purple-600/10 via-transparent to-transparent"></div>
          <CardHeader className="pb-1 sm:pb-2 flex flex-row items-center justify-between space-y-0 relative z-10">
            <CardTitle className="text-xs sm:text-sm font-medium text-purple-800 dark:text-white">Consumed</CardTitle>
            <Utensils className="h-3 w-3 sm:h-4 sm:w-4 text-purple-600 dark:text-purple-300" />
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-xl sm:text-2xl md:text-3xl font-bold text-purple-900 dark:text-white">{caloriesConsumed}</div>
            <p className="text-xs sm:text-xs text-purple-700 dark:text-purple-200 hidden sm:block">{Math.round((caloriesConsumed / goalCalories) * 100)}% of daily goal</p>
          </CardContent>
        </Card>

        {/* Calories Remaining - Orange/Peach card */}
        <Card className="relative overflow-hidden backdrop-blur-xl shadow-lg border-2 border-orange-400 dark:border-orange-600/40 hover:shadow-xl transition-all duration-300" style={{ backgroundImage: 'url(/calories_burn_bg_logo.png)', backgroundSize: '100% 100%', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }}>
          <div className="absolute inset-0 bg-gradient-to-br from-orange-200/50 to-orange-100/30 dark:from-orange-900/60 dark:to-orange-800/40"></div>
          <div className="absolute inset-0 bg-gradient-radial from-orange-200/20 dark:from-orange-600/10 via-transparent to-transparent"></div>
          <CardHeader className="pb-1 sm:pb-2 flex flex-row items-center justify-between space-y-0 relative z-10">
            <CardTitle className="text-xs sm:text-sm font-medium text-orange-800 dark:text-white">Remaining</CardTitle>
            <Flame className="h-3 w-3 sm:h-4 sm:w-4 text-orange-600 dark:text-orange-300" />
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-xl sm:text-2xl md:text-3xl font-bold text-orange-900 dark:text-white">
              {Math.max(0, goalCalories - caloriesConsumed)}
            </div>
            <p className="text-xs sm:text-xs text-orange-700 dark:text-orange-200 hidden sm:block">
              {caloriesConsumed > goalCalories
                ? `${caloriesConsumed - goalCalories} calories over limit`
                : "Remaining for today"}
            </p>
          </CardContent>
        </Card>

        {/* Meal Count - Teal/Cyan card */}
        <Card className="relative overflow-hidden backdrop-blur-xl shadow-lg border-2 border-teal-400 dark:border-teal-600/40 hover:shadow-xl transition-all duration-300" style={{ backgroundImage: 'url(/meal_count_bg_logo.png)', backgroundSize: '100% 100%', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }}>
          <div className="absolute inset-0 bg-gradient-to-br from-teal-200/50 to-cyan-100/30 dark:from-teal-900/60 dark:to-teal-800/40"></div>
          <div className="absolute inset-0 bg-gradient-radial from-teal-200/20 dark:from-teal-600/10 via-transparent to-transparent"></div>
          <CardHeader className="pb-1 sm:pb-2 flex flex-row items-center justify-between space-y-0 relative z-10">
            <CardTitle className="text-xs sm:text-sm font-medium text-teal-800 dark:text-white">Meals</CardTitle>
            <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 text-teal-600 dark:text-teal-300" />
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-xl sm:text-2xl md:text-3xl font-bold text-teal-900 dark:text-white">{dailyEntries.length}</div>
            <p className="text-xs sm:text-xs text-teal-700 dark:text-teal-200 hidden sm:block">Meals and snacks logged today</p>
          </CardContent>
        </Card>
      </div>

      {/* Daily Meals Section - Full width */}
      <Card className="bg-white/40 dark:bg-green-900/20 backdrop-blur-xl border border-green-200/30 dark:border-green-700/30 shadow-xl">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-gray-800 dark:text-white flex items-center gap-2">
            <Utensils className="h-5 w-5 text-green-600 dark:text-green-400" />
            Meals for {currentDate ? formatDate(currentDate, "long") : "..."}
          </CardTitle>
          <CardDescription className="text-gray-600 dark:text-gray-300">
            {dailyEntries.length === 0 ? (
              "No meals logged for this day"
            ) : (
              `${dailyEntries.length} meal${dailyEntries.length > 1 ? 's' : ''} logged`
            )}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {dailyEntries.length === 0 ? (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              <Utensils className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>No food entries for this date</p>
              <p className="text-sm mt-1">Use the Food Tracker tab to add meals</p>
            </div>
          ) : (
            <div className="space-y-3">
              {dailyEntries.map((entry, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-white/60 dark:bg-green-800/40 rounded-lg border border-green-200/30 dark:border-green-700/30"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 dark:bg-green-800 rounded-full flex items-center justify-center">
                      <span className="text-lg">
                        {entry.meal_type === 'breakfast' ? '' : 
                         entry.meal_type === 'lunch' ? '' : 
                         entry.meal_type === 'dinner' ? '' : 
                         entry.meal_type === 'snack' ? '' : ''}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-800 dark:text-white capitalize">
                        {entry.name || entry.food_name || 'Unknown Food'}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">
                        {entry.meal_type || 'Meal'} • {entry.consumed_at || 'Any time'}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-green-700 dark:text-green-300">
                      {entry.calories || 0} cal
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      P: {entry.protein || 0}g • C: {entry.carbs || 0}g • F: {entry.fat || 0}g
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="overflow-hidden bg-white/40 dark:bg-green-900/15 backdrop-blur-xl border-4 border-green-400 dark:border-green-600/30 shadow-xl hover:shadow-2xl transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="text-gray-900 dark:text-white">Weekly Calorie Intake</CardTitle>
            <CardDescription className="text-gray-700 dark:text-green-200">Your calorie consumption over the past week</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <CalorieChart data={weeklyData} />
          </CardContent>
        </Card>

        <Card className="overflow-hidden bg-white/40 dark:bg-green-900/15 backdrop-blur-xl border-4 border-purple-400 dark:border-purple-600/30 shadow-xl hover:shadow-2xl transition-shadow duration-300" style={{ backgroundImage: 'url(/nut_dist_bg.png)', backgroundSize: '100% 100%', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }}>
          <CardHeader className="relative z-10">
            <CardTitle className="text-gray-800 dark:text-white">Macronutrient Distribution</CardTitle>
            <CardDescription className="text-gray-500 dark:text-green-200">Protein, carbs and fat breakdown for today</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px] relative z-10">
            <NutrientChart protein={proteinConsumed} carbs={carbsConsumed} fat={fatConsumed} />
          </CardContent>
        </Card>
      </div>

      <Card className="overflow-hidden bg-white/40 dark:bg-green-900/15 backdrop-blur-xl border-4 border-green-400 dark:border-green-600/30 shadow-xl hover:shadow-2xl transition-shadow duration-300">
        <CardHeader>
          <CardTitle className="text-gray-800 dark:text-white">Recent Meals</CardTitle>
          <CardDescription className="text-gray-500 dark:text-green-200">Your latest food entries for today</CardDescription>
        </CardHeader>
        <CardContent>
        {dailyEntries.length > 0 ? (
          <div className="space-y-3">
            {dailyEntries.map((entry, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 rounded-lg bg-green-50/40 dark:bg-green-800/20 backdrop-blur-sm border-2 border-green-400 dark:border-green-600/15 hover:bg-green-100/40 dark:hover:bg-green-800/30 transition-all duration-200"
              >
                <div>
                  <div className="font-medium text-gray-800 dark:text-white">{entry.name}</div>
                  <div className="text-sm text-gray-500 dark:text-green-200">
                    {entry.mealType} • {entry.servingSize}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-medium text-gray-800 dark:text-white">{entry.calories} cal</div>
                  <div className="text-sm text-gray-500 dark:text-green-200">
                    P: {entry.protein}g • C: {entry.carbs}g • F: {entry.fat}g
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="mb-4 text-6xl">🍽️</div>
            <p className="text-gray-500 dark:text-green-200 mb-2">
              No meals logged for today. Go to the Food Tracker to add your meals.
            </p>
            <Button 
              className="bg-green-600 hover:bg-green-700 text-white"
              onClick={() => router.push('/food-tracker')}
            >
              Go to Food Tracker
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
    </div>
    </>
  )
}

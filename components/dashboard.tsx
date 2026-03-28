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

  // Calculate macro targets based on scientific formulas
  const calculateMacroTargets = (profile: any) => {
    if (!profile || !profile.weight) {
      return { protein: 150, fat: 65, carbs: 250 } // Default values
    }

    const weightKg = profile.weight
    const goal = profile.goal || 'maintenance'

    // Protein Factor based on goal
    let proteinFactor = 1.0 // Normal health default
    if (goal === 'weight-loss') {
      proteinFactor = 1.4 // Middle of 1.2-1.6 range
    } else if (goal === 'muscle-gain') {
      proteinFactor = 1.9 // Middle of 1.6-2.2 range
    } else if (goal === 'maintenance' || goal === 'general') {
      proteinFactor = 0.9 // Middle of 0.8-1.0 range
    }

    // Fat Factor based on goal
    let fatFactor = 0.8 // Normal default
    if (goal === 'weight-loss') {
      fatFactor = 0.6 // Low fat diet
    } else if (goal === 'muscle-gain') {
      fatFactor = 0.9 // Middle of 0.8-1.0 range
    }

    // Calculate Protein: Weight (kg) × Protein Factor
    const proteinGrams = Math.round(weightKg * proteinFactor)

    // Calculate Fat: Weight (kg) × Fat Factor
    const fatGrams = Math.round(weightKg * fatFactor)

    // Calculate Carbs: (Total Calories - (Protein×4 + Fat×9)) / 4
    const caloriesFromProtein = proteinGrams * 4
    const caloriesFromFat = fatGrams * 9
    const remainingCalories = goalCalories - (caloriesFromProtein + caloriesFromFat)
    const carbsGrams = Math.max(0, Math.round(remainingCalories / 4))

    return {
      protein: proteinGrams,
      fat: fatGrams,
      carbs: carbsGrams
    }
  }

  // Get macro targets
  const macroTargets = userProfile ? calculateMacroTargets(userProfile) : { protein: 150, fat: 65, carbs: 250 }

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

      <div className="grid gap-4 grid-cols-2 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-7">
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

        {/* Protein Target - Red/Pink card */}
        <Card className="relative overflow-hidden backdrop-blur-xl shadow-lg border-2 border-red-400 dark:border-red-600/40 hover:shadow-xl transition-all duration-300">
          <div className="absolute inset-0 bg-gradient-to-br from-red-200/50 to-pink-100/30 dark:from-red-900/60 dark:to-red-800/40"></div>
          <div className="absolute inset-0 bg-gradient-radial from-red-200/20 dark:from-red-600/10 via-transparent to-transparent"></div>
          <CardHeader className="pb-1 sm:pb-2 flex flex-row items-center justify-between space-y-0 relative z-10">
            <CardTitle className="text-xs sm:text-sm font-medium text-red-800 dark:text-white">Protein Target</CardTitle>
            <span className="text-lg">🥩</span>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-xl sm:text-2xl md:text-3xl font-bold text-red-900 dark:text-white">{macroTargets.protein}g</div>
            <p className="text-xs sm:text-xs text-red-700 dark:text-red-200 hidden sm:block">{Math.round((proteinConsumed / macroTargets.protein) * 100)}% consumed</p>
          </CardContent>
        </Card>

        {/* Fat Target - Yellow/Amber card */}
        <Card className="relative overflow-hidden backdrop-blur-xl shadow-lg border-2 border-yellow-400 dark:border-yellow-600/40 hover:shadow-xl transition-all duration-300">
          <div className="absolute inset-0 bg-gradient-to-br from-yellow-200/50 to-amber-100/30 dark:from-yellow-900/60 dark:to-yellow-800/40"></div>
          <div className="absolute inset-0 bg-gradient-radial from-yellow-200/20 dark:from-yellow-600/10 via-transparent to-transparent"></div>
          <CardHeader className="pb-1 sm:pb-2 flex flex-row items-center justify-between space-y-0 relative z-10">
            <CardTitle className="text-xs sm:text-sm font-medium text-yellow-800 dark:text-white">Fat Target</CardTitle>
            <span className="text-lg">🥑</span>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-xl sm:text-2xl md:text-3xl font-bold text-yellow-900 dark:text-white">{macroTargets.fat}g</div>
            <p className="text-xs sm:text-xs text-yellow-700 dark:text-yellow-200 hidden sm:block">{Math.round((fatConsumed / macroTargets.fat) * 100)}% consumed</p>
          </CardContent>
        </Card>

        {/* Carbs Target - Blue/Cyan card */}
        <Card className="relative overflow-hidden backdrop-blur-xl shadow-lg border-2 border-blue-400 dark:border-blue-600/40 hover:shadow-xl transition-all duration-300">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-200/50 to-cyan-100/30 dark:from-blue-900/60 dark:to-blue-800/40"></div>
          <div className="absolute inset-0 bg-gradient-radial from-blue-200/20 dark:from-blue-600/10 via-transparent to-transparent"></div>
          <CardHeader className="pb-1 sm:pb-2 flex flex-row items-center justify-between space-y-0 relative z-10">
            <CardTitle className="text-xs sm:text-sm font-medium text-blue-800 dark:text-white">Carbs Target</CardTitle>
            <span className="text-lg">🍞</span>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-xl sm:text-2xl md:text-3xl font-bold text-blue-900 dark:text-white">{macroTargets.carbs}g</div>
            <p className="text-xs sm:text-xs text-blue-700 dark:text-blue-200 hidden sm:block">{Math.round((carbsConsumed / macroTargets.carbs) * 100)}% consumed</p>
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
              {dailyEntries.map((entry, index) => {
                // Get food emoji based on meal type or food name
                const getFoodEmoji = () => {
                  const name = (entry.name || entry.food_name || '').toLowerCase();
                  const mealType = (entry.meal_type || '').toLowerCase();
                  
                  // Check food name first
                  if (name.includes('pizza')) return '🍕';
                  if (name.includes('burger')) return '🍔';
                  if (name.includes('sandwich')) return '🥪';
                  if (name.includes('salad')) return '🥗';
                  if (name.includes('sushi')) return '🍱';
                  if (name.includes('pasta') || name.includes('spaghetti')) return '🍝';
                  if (name.includes('rice') || name.includes('biryani') || name.includes('fried rice')) return '🍚';
                  if (name.includes('chicken') || name.includes('meat')) return '🍗';
                  if (name.includes('fish') || name.includes('seafood')) return '🐟';
                  if (name.includes('egg')) return '🥚';
                  if (name.includes('bread') || name.includes('toast')) return '🍞';
                  if (name.includes('pancake')) return '🥞';
                  if (name.includes('waffle')) return '🧇';
                  if (name.includes('croissant')) return '🥐';
                  if (name.includes('bagel')) return '🥯';
                  if (name.includes('donut') || name.includes('doughnut')) return '🍩';
                  if (name.includes('cookie')) return '🍪';
                  if (name.includes('cake')) return '🎂';
                  if (name.includes('ice cream')) return '🍨';
                  if (name.includes('chocolate')) return '🍫';
                  if (name.includes('apple')) return '🍎';
                  if (name.includes('banana')) return '🍌';
                  if (name.includes('orange')) return '🍊';
                  if (name.includes('grape')) return '🍇';
                  if (name.includes('strawberry')) return '🍓';
                  if (name.includes('watermelon')) return '🍉';
                  if (name.includes('mango')) return '🥭';
                  if (name.includes('pineapple')) return '🍍';
                  if (name.includes('peach')) return '🍑';
                  if (name.includes('pear')) return '🍐';
                  if (name.includes('kiwi')) return '🥝';
                  if (name.includes('avocado')) return '🥑';
                  if (name.includes('tomato')) return '🍅';
                  if (name.includes('carrot')) return '🥕';
                  if (name.includes('broccoli')) return '🥦';
                  if (name.includes('corn')) return '🌽';
                  if (name.includes('potato')) return '🥔';
                  if (name.includes('sweet potato')) return '🍠';
                  if (name.includes('cucumber')) return '🥒';
                  if (name.includes('mushroom')) return '🍄';
                  if (name.includes('onion') || name.includes('garlic')) return '🧅';
                  if (name.includes('pepper') || name.includes('chili')) return '🌶️';
                  if (name.includes('leafy') || name.includes('spinach') || name.includes('lettuce')) return '🥬';
                  if (name.includes('soup') || name.includes('stew')) return '🍲';
                  if (name.includes('curry') || name.includes('masala') || name.includes('dal') || name.includes('paneer')) return '🍛';
                  if (name.includes('noodle') || name.includes('ramen') || name.includes('pho')) return '🍜';
                  if (name.includes('taco') || name.includes('burrito')) return '🌮';
                  if (name.includes('falafel') || name.includes('hummus')) return '🧆';
                  if (name.includes('dumpling')) return '🥟';
                  if (name.includes('spring roll')) return '🥠';
                  if (name.includes('pretzel')) return '🥨';
                  if (name.includes('cheese')) return '🧀';
                  if (name.includes('butter')) return '🧈';
                  if (name.includes('bacon')) return '🥓';
                  if (name.includes('hot dog') || name.includes('sausage')) return '🌭';
                  if (name.includes('fries') || name.includes('french fries')) return '🍟';
                  if (name.includes('popcorn')) return '🍿';
                  if (name.includes('chips') || name.includes('crisps')) return '🥔';
                  if (name.includes('milk') || name.includes('dairy')) return '🥛';
                  if (name.includes('coffee')) return '☕';
                  if (name.includes('tea')) return '🍵';
                  if (name.includes('juice')) return '🧃';
                  if (name.includes('soda') || name.includes('soft drink')) return '🥤';
                  if (name.includes('beer')) return '🍺';
                  if (name.includes('wine')) return '🍷';
                  if (name.includes('cocktail')) return '🍸';
                  if (name.includes('smoothie') || name.includes('shake')) return '🥤';
                  if (name.includes('yogurt')) return '🥣';
                  if (name.includes('cereal')) return '🥣';
                  if (name.includes('oatmeal') || name.includes('oats')) return '🥣';
                  if (name.includes('granola')) return '🥣';
                  if (name.includes('honey')) return '🍯';
                  if (name.includes('jam') || name.includes('jelly')) return '🍯';
                  if (name.includes('peanut butter')) return '🥜';
                  if (name.includes('nuts') || name.includes('almond') || name.includes('walnut')) return '🥜';
                  if (name.includes('olive')) return '🫒';
                  if (name.includes('coconut')) return '🥥';
                  if (name.includes('lemon') || name.includes('lime')) return '🍋';
                  if (name.includes('chestnut')) return '🌰';
                  
                  // Fall back to meal type
                  if (mealType === 'breakfast') return '🍳';
                  if (mealType === 'lunch') return '🍱';
                  if (mealType === 'dinner') return '🍽️';
                  if (mealType === 'snack') return '🍿';
                  
                  // Default
                  return '🍽️';
                };
                
                return (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-white/60 dark:bg-green-800/40 rounded-lg border border-green-200/30 dark:border-green-700/30"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 dark:bg-green-800 rounded-full flex items-center justify-center text-xl">
                      {getFoodEmoji()}
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
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
        <Card className="overflow-hidden bg-white/40 dark:bg-green-900/15 backdrop-blur-xl border-2 border-green-400 dark:border-green-600/30 shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="text-gray-900 dark:text-white text-sm sm:text-base">Weekly Calorie Intake</CardTitle>
            <CardDescription className="text-gray-700 dark:text-green-200 text-xs sm:text-sm">Your calorie consumption over the past week</CardDescription>
          </CardHeader>
          <CardContent className="h-[200px] sm:h-[300px]">
            <CalorieChart data={weeklyData} />
          </CardContent>
        </Card>

        <Card className="overflow-hidden bg-white/40 dark:bg-green-900/15 backdrop-blur-xl border-2 border-purple-400 dark:border-purple-600/30 shadow-lg hover:shadow-xl transition-shadow duration-300" style={{ backgroundImage: 'url(/nut_dist_bg.png)', backgroundSize: '100% 100%', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }}>
          <CardHeader className="relative z-10">
            <CardTitle className="text-gray-800 dark:text-white text-sm sm:text-base">Macronutrient Distribution</CardTitle>
            <CardDescription className="text-gray-500 dark:text-green-200 text-xs sm:text-sm">Protein, carbs and fat breakdown for today</CardDescription>
          </CardHeader>
          <CardContent className="h-[200px] sm:h-[300px] relative z-10">
            <NutrientChart protein={proteinConsumed} carbs={carbsConsumed} fat={fatConsumed} />
          </CardContent>
        </Card>
      </div>
    </div>
    </>
  )
}

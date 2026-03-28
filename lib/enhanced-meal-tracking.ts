import { supabase } from '@/lib/supabase'

// Enhanced meal types
export interface MealRecord {
  id: string
  user_id: string
  profile_id: string
  meal_type: 'breakfast' | 'lunch' | 'dinner' | 'snack'
  food_name: string
  calories: number
  protein: number
  carbs: number
  fat: number
  serving_size: string
  consumed_at: string
  created_at: string
  food_category?: string
  brand?: string
  barcode?: string
  notes?: string
  meal_time?: string
}

export interface FoodDatabaseItem {
  id: string
  name: string
  brand?: string
  category?: string
  calories_per_100g: number
  protein_per_100g: number
  carbs_per_100g: number
  fat_per_100g: number
  fiber_per_100g?: number
  sugar_per_100g?: number
  sodium_per_100g?: number
  serving_size: string
  serving_unit: string
  barcode?: string
  created_at: string
}

export interface MealPlan {
  id: string
  user_id: string
  profile_id: string
  plan_name: string
  plan_date?: string
  target_calories?: number
  target_protein?: number
  target_carbs?: number
  target_fat?: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface MealPlanItem {
  id: string
  meal_plan_id: string
  meal_type: 'breakfast' | 'lunch' | 'dinner' | 'snack'
  food_name: string
  calories: number
  protein: number
  carbs: number
  fat: number
  serving_size: string
  time_of_day?: string
  order_index: number
  created_at: string
}

export interface NutritionGoal {
  id: string
  user_id: string
  profile_id: string
  goal_date: string
  target_calories?: number
  target_protein?: number
  target_carbs?: number
  target_fat?: number
  target_fiber?: number
  target_water_ml?: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface MealPhoto {
  id: string
  meal_id?: string
  user_id: string
  photo_url: string
  analysis_result?: any
  confidence_score?: number
  created_at: string
}

// Enhanced meal tracking services
export class MealTrackingService {
  
  // Meal CRUD operations
  static async getMeals(userId: string, profileId: string, startDate?: string, endDate?: string): Promise<MealRecord[]> {
    try {
      let query = supabase
        .from('meals')
        .select('*')
        .eq('user_id', userId)
        .eq('profile_id', profileId)
        .order('consumed_at', { ascending: false })

      // Filter by entry_date (DATE type) instead of consumed_at
      if (startDate) {
        const startDateStr = startDate.split('T')[0] // Extract YYYY-MM-DD
        query = query.gte('entry_date', startDateStr)
      }
      if (endDate) {
        const endDateStr = endDate.split('T')[0] // Extract YYYY-MM-DD
        query = query.lte('entry_date', endDateStr)
      }

      const { data, error } = await query
      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error fetching meals:', error)
      return []
    }
  }

  static async createMeal(meal: Omit<MealRecord, 'id' | 'created_at'>): Promise<MealRecord | null> {
    try {
      console.log('MealTrackingService.createMeal called with:', meal)
      
      const { data, error } = await supabase
        .from('meals')
        .insert(meal)
        .select()
        .single()

      console.log('Supabase insert response:', { data, error })

      if (error) {
        console.error('Supabase error:', error)
        throw error
      }
      
      console.log('Meal successfully created:', data)
      return data
    } catch (error) {
      console.error('Error creating meal:', error)
      return null
    }
  }

  static async updateMeal(mealId: string, updates: Partial<MealRecord>): Promise<MealRecord | null> {
    try {
      const { data, error } = await supabase
        .from('meals')
        .update(updates)
        .eq('id', mealId)
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error updating meal:', error)
      return null
    }
  }

  static async deleteMeal(mealId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('meals')
        .delete()
        .eq('id', mealId)

      return !error
    } catch (error) {
      console.error('Error deleting meal:', error)
      return false
    }
  }

  // Food database operations
  static async searchFood(query: string, limit: number = 20): Promise<FoodDatabaseItem[]> {
    try {
      const { data, error } = await supabase
        .from('food_database')
        .select('*')
        .ilike('name', `%${query}%`)
        .limit(limit)

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error searching food database:', error)
      return []
    }
  }

  static async getFoodByBarcode(barcode: string): Promise<FoodDatabaseItem | null> {
    try {
      const { data, error } = await supabase
        .from('food_database')
        .select('*')
        .eq('barcode', barcode)
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error fetching food by barcode:', error)
      return null
    }
  }

  // Meal plan operations
  static async getMealPlans(profileId: string): Promise<MealPlan[]> {
    try {
      const { data, error } = await supabase
        .from('meal_plans')
        .select('*')
        .eq('profile_id', profileId)
        .order('created_at', { ascending: false })

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error fetching meal plans:', error)
      return []
    }
  }

  static async createMealPlan(plan: Omit<MealPlan, 'id' | 'created_at' | 'updated_at'>): Promise<MealPlan | null> {
    try {
      const { data, error } = await supabase
        .from('meal_plans')
        .insert(plan)
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error creating meal plan:', error)
      return null
    }
  }

  static async getMealPlanItems(mealPlanId: string): Promise<MealPlanItem[]> {
    try {
      const { data, error } = await supabase
        .from('meal_plan_items')
        .select('*')
        .eq('meal_plan_id', mealPlanId)
        .order('order_index', { ascending: true })

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error fetching meal plan items:', error)
      return []
    }
  }

  // Nutrition goals operations
  static async getNutritionGoals(profileId: string): Promise<NutritionGoal[]> {
    try {
      const { data, error } = await supabase
        .from('nutrition_goals')
        .select('*')
        .eq('profile_id', profileId)
        .order('goal_date', { ascending: true })

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error fetching nutrition goals:', error)
      return []
    }
  }

  static async createNutritionGoal(goal: Omit<NutritionGoal, 'id' | 'created_at' | 'updated_at'>): Promise<NutritionGoal | null> {
    try {
      const { data, error } = await supabase
        .from('nutrition_goals')
        .insert(goal)
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error creating nutrition goal:', error)
      return null
    }
  }

  // Analytics and reports
  static async getDailyNutritionSummary(userId: string, profileId: string, date: string): Promise<{
    totalCalories: number
    totalProtein: number
    totalCarbs: number
    totalFat: number
    meals: MealRecord[]
    goals: NutritionGoal | null
  }> {
    try {
      const startDate = new Date(date)
      startDate.setHours(0, 0, 0, 0)
      const endDate = new Date(date)
      endDate.setHours(23, 59, 59, 999)

      const [meals, goals] = await Promise.all([
        this.getMeals(userId, profileId, startDate.toISOString(), endDate.toISOString()),
        this.getNutritionGoals(profileId)
      ])

      const totals = meals.reduce(
        (acc, meal) => ({
          totalCalories: acc.totalCalories + meal.calories,
          totalProtein: acc.totalProtein + meal.protein,
          totalCarbs: acc.totalCarbs + meal.carbs,
          totalFat: acc.totalFat + meal.fat,
        }),
        { totalCalories: 0, totalProtein: 0, totalCarbs: 0, totalFat: 0 }
      )

      const todayGoal = goals.find(goal => goal.goal_date === date) || null

      return {
        ...totals,
        meals,
        goals: todayGoal
      }
    } catch (error) {
      console.error('Error getting daily nutrition summary:', error)
      return {
        totalCalories: 0,
        totalProtein: 0,
        totalCarbs: 0,
        totalFat: 0,
        meals: [],
        goals: null
      }
    }
  }

  static async getWeeklyNutritionReport(userId: string, profileId: string, startDate: string): Promise<{
    weekData: Array<{
      date: string
      calories: number
      protein: number
      carbs: number
      fat: number
      mealCount: number
    }>
    weeklyTotals: {
      calories: number
      protein: number
      carbs: number
      fat: number
    }
    dailyAverages: {
      calories: number
      protein: number
      carbs: number
      fat: number
    }
  }> {
    try {
      const endDate = new Date(startDate)
      endDate.setDate(endDate.getDate() + 6)

      const meals = await this.getMeals(userId, profileId, startDate, endDate.toISOString())

      const weekData = []
      const weeklyTotals = { calories: 0, protein: 0, carbs: 0, fat: 0 }

      for (let i = 0; i < 7; i++) {
        const currentDate = new Date(startDate)
        currentDate.setDate(currentDate.getDate() + i)
        const dateStr = currentDate.toISOString().split('T')[0]

        const dayMeals = meals.filter(meal => 
          meal.consumed_at.startsWith(dateStr)
        )

        const dayTotals = dayMeals.reduce(
          (acc, meal) => ({
            calories: acc.calories + meal.calories,
            protein: acc.protein + meal.protein,
            carbs: acc.carbs + meal.carbs,
            fat: acc.fat + meal.fat,
          }),
          { calories: 0, protein: 0, carbs: 0, fat: 0 }
        )

        weekData.push({
          date: dateStr,
          ...dayTotals,
          mealCount: dayMeals.length
        })

        weeklyTotals.calories += dayTotals.calories
        weeklyTotals.protein += dayTotals.protein
        weeklyTotals.carbs += dayTotals.carbs
        weeklyTotals.fat += dayTotals.fat
      }

      const dailyAverages = {
        calories: Math.round(weeklyTotals.calories / 7),
        protein: Math.round((weeklyTotals.protein / 7) * 10) / 10,
        carbs: Math.round((weeklyTotals.carbs / 7) * 10) / 10,
        fat: Math.round((weeklyTotals.fat / 7) * 10) / 10,
      }

      return {
        weekData,
        weeklyTotals,
        dailyAverages
      }
    } catch (error) {
      console.error('Error getting weekly nutrition report:', error)
      return {
        weekData: [],
        weeklyTotals: { calories: 0, protein: 0, carbs: 0, fat: 0 },
        dailyAverages: { calories: 0, protein: 0, carbs: 0, fat: 0 }
      }
    }
  }
}

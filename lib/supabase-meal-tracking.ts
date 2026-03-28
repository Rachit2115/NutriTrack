import { supabase, Meal } from '@/lib/supabase'

export interface MealData {
  id: string
  userId: string
  profileId: string
  mealType: string
  foodName: string
  calories: number
  protein: number
  carbs: number
  fat: number
  servingSize: string
  consumedAt: string
  createdAt: string
}

const toMealData = (meal: Meal): MealData => ({
  id: meal.id,
  userId: meal.user_id,
  profileId: meal.profile_id,
  mealType: meal.meal_type,
  foodName: meal.food_name,
  calories: meal.calories,
  protein: meal.protein,
  carbs: meal.carbs,
  fat: meal.fat,
  servingSize: meal.serving_size,
  consumedAt: meal.consumed_at,
  createdAt: meal.created_at,
})

const toMealInsert = (meal: Omit<MealData, 'id' | 'createdAt'>) => ({
  user_id: meal.userId,
  profile_id: meal.profileId,
  meal_type: meal.mealType,
  food_name: meal.foodName,
  calories: meal.calories,
  protein: meal.protein,
  carbs: meal.carbs,
  fat: meal.fat,
  serving_size: meal.servingSize,
  consumed_at: meal.consumedAt,
})

// Meal CRUD operations
export async function getMealsByProfile(profileId: string, startDate?: string, endDate?: string): Promise<MealData[]> {
  try {
    let query = supabase
      .from('meals')
      .select('*')
      .eq('profile_id', profileId)
      .order('consumed_at', { ascending: false })

    if (startDate) {
      query = query.gte('consumed_at', startDate)
    }
    if (endDate) {
      query = query.lte('consumed_at', endDate)
    }

    const { data, error } = await query

    if (error) throw error
    return data?.map(toMealData) || []
  } catch (error) {
    console.error('Error fetching meals:', error)
    return []
  }
}

export async function createMeal(meal: Omit<MealData, 'id' | 'createdAt'>): Promise<MealData | null> {
  try {
    const { data, error } = await supabase
      .from('meals')
      .insert(toMealInsert(meal))
      .select()
      .single()

    if (error) throw error
    return toMealData(data)
  } catch (error) {
    console.error('Error creating meal:', error)
    return null
  }
}

export async function updateMeal(meal: Partial<MealData> & { id: string }): Promise<MealData | null> {
  try {
    const updateData: any = {}
    if (meal.mealType !== undefined) updateData.meal_type = meal.mealType
    if (meal.foodName !== undefined) updateData.food_name = meal.foodName
    if (meal.calories !== undefined) updateData.calories = meal.calories
    if (meal.protein !== undefined) updateData.protein = meal.protein
    if (meal.carbs !== undefined) updateData.carbs = meal.carbs
    if (meal.fat !== undefined) updateData.fat = meal.fat
    if (meal.servingSize !== undefined) updateData.serving_size = meal.servingSize
    if (meal.consumedAt !== undefined) updateData.consumed_at = meal.consumedAt

    const { data, error } = await supabase
      .from('meals')
      .update(updateData)
      .eq('id', meal.id)
      .select()
      .single()

    if (error) throw error
    return toMealData(data)
  } catch (error) {
    console.error('Error updating meal:', error)
    return null
  }
}

export async function deleteMeal(mealId: string): Promise<boolean> {
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

export async function getDailyNutrition(profileId: string, date: string): Promise<{
  calories: number
  protein: number
  carbs: number
  fat: number
  meals: MealData[]
}> {
  try {
    const startDate = new Date(date)
    startDate.setHours(0, 0, 0, 0)
    const endDate = new Date(date)
    endDate.setHours(23, 59, 59, 999)

    const meals = await getMealsByProfile(
      profileId,
      startDate.toISOString(),
      endDate.toISOString()
    )

    const totals = meals.reduce(
      (acc, meal) => ({
        calories: acc.calories + meal.calories,
        protein: acc.protein + meal.protein,
        carbs: acc.carbs + meal.carbs,
        fat: acc.fat + meal.fat,
      }),
      { calories: 0, protein: 0, carbs: 0, fat: 0 }
    )

    return { ...totals, meals }
  } catch (error) {
    console.error('Error fetching daily nutrition:', error)
    return { calories: 0, protein: 0, carbs: 0, fat: 0, meals: [] }
  }
}

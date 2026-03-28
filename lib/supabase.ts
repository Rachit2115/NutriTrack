import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

console.log('Supabase config:', { 
  url: supabaseUrl ? 'configured' : 'missing', 
  key: supabaseAnonKey ? 'configured' : 'missing' 
})

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env.local file.')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          user_id: string
          name: string
          age: number
          weight: number
          height: number
          gender: 'male' | 'female'
          activity_level: string
          dietary_preference: string
          goal: string
          avatar?: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          age: number
          weight: number
          height: number
          gender: 'male' | 'female'
          activity_level: string
          dietary_preference: string
          goal: string
          avatar?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          age?: number
          weight?: number
          height?: number
          gender?: 'male' | 'female'
          activity_level?: string
          dietary_preference?: string
          goal?: string
          avatar?: string
          updated_at?: string
        }
      }
      meals: {
        Row: {
          id: string
          user_id: string
          profile_id: string
          meal_type: string
          food_name: string
          calories: number
          protein: number
          carbs: number
          fat: number
          serving_size: string
          entry_day: string
          entry_date: string
          consumed_at: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          profile_id: string
          meal_type: string
          food_name: string
          calories: number
          protein: number
          carbs: number
          fat: number
          serving_size: string
          entry_day: string
          entry_date: string
          consumed_at: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          profile_id?: string
          meal_type?: string
          food_name?: string
          calories?: number
          protein?: number
          carbs?: number
          fat?: number
          serving_size?: string
          entry_day?: string
          entry_date?: string
          consumed_at?: string
          created_at?: string
        }
      }
    }
  }
}

export type Profile = Database['public']['Tables']['profiles']['Row']
export type Meal = Database['public']['Tables']['meals']['Row']

"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/components/auth-context"
import { supabase } from "@/lib/supabase"

export default function DebugMealsPage() {
  const { user } = useAuth()
  const [logs, setLogs] = useState<string[]>([])
  const [testResult, setTestResult] = useState<any>(null)

  const addLog = (message: string) => {
    setLogs(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`])
  }

  const testSupabaseConnection = async () => {
    addLog("Testing Supabase connection...")
    
    try {
      const { data, error } = await supabase.from('meals').select('count')
      if (error) {
        addLog(`❌ Connection test failed: ${error.message}`)
      } else {
        addLog(`✅ Connection successful: ${JSON.stringify(data)}`)
      }
    } catch (err) {
      addLog(`❌ Connection test error: ${err instanceof Error ? err.message : 'Unknown error'}`)
    }
  }

  const testAuth = () => {
    addLog(`User authenticated: ${!!user}`)
    if (user) {
      addLog(`User ID: ${user.id}`)
      addLog(`User email: ${user.email}`)
    }
  }

  const testMealInsert = async () => {
    if (!user) {
      addLog("❌ User not authenticated")
      return
    }

    addLog("Testing meal insertion...")
    
    try {
      // First, ensure profile exists
      addLog("Checking if profile exists...")
      const { data: profileCheck, error: profileError } = await supabase
        .from('profiles')
        .select('id')
        .eq('user_id', user.id)
        .single()

      let profileId = user.id; // Default to user ID as profile ID
      
      if (profileError || !profileCheck) {
        addLog("Profile not found, creating profile...")
        
        // Create profile
        const { data: newProfile, error: createError } = await supabase
          .from('profiles')
          .insert({
            id: user.id,
            user_id: user.id,
            name: user.email?.split('@')[0] || 'Test User',
            age: 25,
            weight: 70.0,
            height: 170.0,
            gender: 'male',
            activity_level: 'moderate',
            dietary_preference: 'omnivore',
            goal: 'maintenance'
          })
          .select()
          .single()

        if (createError) {
          addLog(`❌ Profile creation failed: ${createError.message}`)
          return
        }
        
        profileId = newProfile.id
        addLog(`✅ Profile created: ${newProfile.id}`)
      } else {
        profileId = profileCheck.id
        addLog(`✅ Profile found: ${profileCheck.id}`)
      }
      
      const testMeal = {
        user_id: user.id,
        profile_id: profileId,
        meal_type: 'breakfast' as const,
        food_name: 'Test Food',
        calories: 100,
        protein: 10,
        carbs: 20,
        fat: 5,
        serving_size: '1 serving',
        consumed_at: new Date().toISOString()
      }

      addLog(`Inserting meal: ${JSON.stringify(testMeal)}`)
      
      const { data, error } = await supabase
        .from('meals')
        .insert(testMeal)
        .select()
        .single()

      if (error) {
        addLog(`❌ Meal insert failed: ${error.message}`)
        addLog(`Error details: ${JSON.stringify(error)}`)
      } else {
        addLog(`✅ Meal inserted successfully: ${JSON.stringify(data)}`)
        setTestResult(data)
      }
    } catch (err) {
      addLog(`❌ Meal insert error: ${err instanceof Error ? err.message : 'Unknown error'}`)
    }
  }

  const testMealFetch = async () => {
    if (!user) {
      addLog("❌ User not authenticated")
      return
    }

    addLog("Testing meal fetch...")
    
    try {
      const { data, error } = await supabase
        .from('meals')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) {
        addLog(`❌ Meal fetch failed: ${error.message}`)
      } else {
        addLog(`✅ Meals fetched: ${data.length} meals found`)
        data.forEach(meal => {
          addLog(`  - ${meal.food_name} (${meal.calories} cal)`)
        })
      }
    } catch (err) {
      addLog(`❌ Meal fetch error: ${err instanceof Error ? err.message : 'Unknown error'}`)
    }
  }

  useEffect(() => {
    addLog("Debug page loaded")
    testAuth()
  }, [user])

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Meal Insertion Debug</h1>
      
      <div className="space-y-4 mb-6">
        <button 
          onClick={testSupabaseConnection}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Test Supabase Connection
        </button>
        
        <button 
          onClick={testAuth}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 ml-2"
        >
          Test Authentication
        </button>
        
        <button 
          onClick={testMealInsert}
          className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 ml-2"
        >
          Test Meal Insert
        </button>
        
        <button 
          onClick={testMealFetch}
          className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 ml-2"
        >
          Test Meal Fetch
        </button>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div>
          <h2 className="text-xl font-semibold mb-3">Debug Logs</h2>
          <div className="bg-gray-100 p-4 rounded-lg h-96 overflow-y-auto font-mono text-sm">
            {logs.map((log, index) => (
              <div key={index} className="mb-1">{log}</div>
            ))}
          </div>
        </div>
        
        <div>
          <h2 className="text-xl font-semibold mb-3">Test Result</h2>
          <div className="bg-gray-100 p-4 rounded-lg h-96 overflow-y-auto">
            {testResult ? (
              <pre className="text-sm">{JSON.stringify(testResult, null, 2)}</pre>
            ) : (
              <p className="text-gray-500">No test results yet</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

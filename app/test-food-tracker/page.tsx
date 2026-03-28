"use client"

import { useEffect } from "react"

export default function TestFoodTrackerPage() {
  useEffect(() => {
    console.log('🔍 Test page loaded - checking imports...')
    
    // Test importing both components
    import("@/components/meal-tracking-dashboard").then(() => {
      console.log('✅ MealTrackingDashboard import successful')
    }).catch(err => {
      console.error('❌ MealTrackingDashboard import failed:', err)
    })
    
    import("@/components/food-tracker").then(() => {
      console.log('✅ FoodTracker import successful')
    }).catch(err => {
      console.error('❌ FoodTracker import failed:', err)
    })
  }, [])

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Food Tracker Import Test</h1>
      <p>Check the console to see which components are loading.</p>
      
      <div className="mt-8 space-y-4">
        <h2 className="text-xl font-semibold">Manual Test:</h2>
        <p>If you're still seeing the old FoodTracker in the main app, you need to:</p>
        <ol className="list-decimal list-inside space-y-2">
          <li>Stop your development server (Ctrl+C)</li>
          <li>Clear your browser cache</li>
          <li>Restart the development server with: <code>npm run dev</code></li>
          <li>Refresh the page</li>
        </ol>
        
        <div className="mt-4 p-4 bg-yellow-100 border border-yellow-300 rounded">
          <strong>Expected behavior:</strong> You should see "🍽️ MealTrackingDashboard component loaded!" in the console when you visit the Food Tracker tab.
        </div>
      </div>
    </div>
  )
}

"use client"

import React, { useState, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Plus, Camera, Upload, Loader2, Trash, ChevronLeft, ChevronRight } from "lucide-react"
import { formatDate } from "@/lib/date-utils"
import { useProfileContext } from "@/components/profile-context"
import { useAuth } from "@/components/auth-context"
import { supabase } from "@/lib/supabase"

export default function FoodTracker() {
  console.log('🍕 FoodTracker with Supabase integration loaded!')
  const { currentProfile } = useProfileContext()
  const { user } = useAuth()
  const [entries, setEntries] = useState<any[]>([])
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [selectedDate, setSelectedDate] = useState(formatDate(new Date()))
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [showSuccessMessage, setShowSuccessMessage] = useState(false)
  
  // Function to navigate to previous/next day
  function navigateDay(direction: number) {
    const currentDate = new Date(selectedDate)
    currentDate.setDate(currentDate.getDate() + direction)
    setSelectedDate(formatDate(currentDate))
  }
  const [formData, setFormData] = useState({
    name: "",
    servingSize: "1 serving",
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
    mealType: "breakfast"
  })

  // Load entries for selected date from Supabase
  React.useEffect(() => {
    loadEntries()
  }, [selectedDate, currentProfile, user])

  async function loadEntries() {
    if (!currentProfile || !user) return
    
    try {
      const { data, error } = await supabase
        .from('meals')
        .select('*')
        .eq('profile_id', currentProfile.id)
        .eq('entry_date', selectedDate)
        .order('consumed_at', { ascending: false })

      if (error) {
        console.error('Error loading entries:', error)
        setEntries([])
      } else {
        // Transform data to match the expected format
        const transformedEntries = data.map(meal => ({
          name: meal.food_name,
          servingSize: meal.serving_size,
          calories: meal.calories,
          protein: meal.protein,
          carbs: meal.carbs,
          fat: meal.fat,
          mealType: meal.meal_type,
          id: meal.id,
          entryDay: meal.entry_day,
          entryDate: meal.entry_date,
          consumedAt: meal.consumed_at
        }))
        setEntries(transformedEntries)
      }
    } catch (error) {
      console.error('Error loading entries:', error)
      setEntries([])
    }
  }

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setSelectedImage(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const analyzeImageWithAI = async () => {
    if (!selectedImage) return

    setIsAnalyzing(true)
    try {
      const response = await fetch('/api/analyze-food-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          image: selectedImage
        })
      })

      const result = await response.json()

      if (!response.ok || !result.success) {
        // Show detailed error message for debugging
        const errorMessage = result.error || 'Failed to analyze image. Please try again.'
        console.error('AI Analysis Error:', result)
        
        // Show debug info if available
        if (result.debug) {
          console.log('Debug info:', result.debug)
          alert(`${errorMessage}\n\nDetected items: ${result.debug.detectedLabels?.join(', ') || 'None'}\nObjects: ${result.debug.detectedObjects?.join(', ') || 'None'}`)
        } else {
          alert(errorMessage)
        }
        return
      }

      // Fill form with AI analysis results
      setFormData({
        ...formData,
        name: result.foodName || 'Analyzed Food',
        calories: result.calories || 0,
        protein: result.protein || 0,
        carbs: result.carbs || 0,
        fat: result.fat || 0,
        servingSize: result.servingSize || '1 serving'
      })

      // Show success message with detected items
      if (result.detectedItems && result.detectedItems.length > 0) {
        console.log('Detected food items:', result.detectedItems)
        // Optional: Show success notification
        console.log(`Successfully analyzed: ${result.foodName}`)
      }

    } catch (error) {
      console.error('AI analysis failed:', error)
      alert('Failed to analyze image. Please check your internet connection and try again, or enter the details manually.')
    } finally {
      setIsAnalyzing(false)
    }
  }

  async function onSubmit() {
    if (!currentProfile || !user) {
      alert('Please ensure you are logged in and have a profile.')
      return
    }

    try {
      // First ensure profile exists in database
      const { data: profileCheck, error: profileError } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', currentProfile.id)
        .single()

      if (profileError || !profileCheck) {
        console.log('Creating profile in database...')
        const { error: createError } = await supabase
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

        if (createError) {
          console.error('Failed to create profile:', createError)
          alert(`Failed to create profile: ${createError.message}`)
          return
        }
      }

      // Create meal entry in Supabase
      const now = new Date()
      const mealData = {
        user_id: user.id,
        profile_id: currentProfile.id,
        meal_type: formData.mealType,
        food_name: formData.name,
        calories: formData.calories,
        protein: formData.protein,
        carbs: formData.carbs,
        fat: formData.fat,
        serving_size: formData.servingSize,
        entry_day: now.toLocaleDateString('en-US', { weekday: 'long' }), // e.g., 'Monday'
        entry_date: now.toISOString().split('T')[0], // e.g., '2026-03-28'
        consumed_at: now.toTimeString().split(' ')[0] // e.g., '14:30:00'
      }

      console.log('Saving meal to Supabase:', mealData)
      
      const { data, error } = await supabase
        .from('meals')
        .insert(mealData)
        .select()
        .single()

      if (error) {
        console.error('Error saving meal:', error)
        alert(`Failed to save meal: ${error.message}`)
        return
      }

      console.log('Meal saved successfully:', data)
      
      // Show success message
      setShowSuccessMessage(true)
      setTimeout(() => setShowSuccessMessage(false), 3000)
      
      // Reload entries and reset form
      loadEntries()
      setIsDialogOpen(false)
      setFormData({
        name: "",
        servingSize: "1 serving",
        calories: 0,
        protein: 0,
        carbs: 0,
        fat: 0,
        mealType: "breakfast"
      })
      setSelectedImage(null)
    } catch (error) {
      console.error('Error in onSubmit:', error)
      alert('An error occurred while saving your meal.')
    }
  }

  async function handleDeleteEntry(entryId: string) {
    if (!currentProfile || !user) return

    try {
      const { error } = await supabase
        .from('meals')
        .delete()
        .eq('id', entryId)
        .eq('profile_id', currentProfile.id)

      if (error) {
        console.error('Error deleting meal:', error)
        alert('Failed to delete meal')
      } else {
        console.log('Meal deleted successfully')
        loadEntries()
      }
    } catch (error) {
      console.error('Error deleting meal:', error)
      alert('An error occurred while deleting the meal')
    }
  }

  // Calculate nutrition totals
  const totals = entries.reduce(
    (acc, entry) => ({
      calories: acc.calories + entry.calories,
      protein: acc.protein + entry.protein,
      carbs: acc.carbs + entry.carbs,
      fat: acc.fat + entry.fat,
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0 }
  )

  // Group entries by meal type
  const mealEntries = {
    breakfast: entries.filter(entry => entry.mealType === "breakfast"),
    lunch: entries.filter(entry => entry.mealType === "lunch"),
    dinner: entries.filter(entry => entry.mealType === "dinner"),
    snack: entries.filter(entry => entry.mealType === "snack"),
  }

  return (
    <div className="space-y-6">
      {/* Success Toast Notification */}
      {showSuccessMessage && (
        <div className="fixed top-4 right-4 z-50 animate-pulse">
          <div className="bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center space-x-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span className="font-medium">Meal added successfully!</span>
          </div>
        </div>
      )}
      
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Food Tracker</h2>
          <p className="text-muted-foreground text-sm">Track your daily nutrition intake with AI-powered analysis</p>
        </div>
        <div className="flex items-center gap-3">
          {/* Date Navigation */}
          <div className="flex items-center bg-white/60 dark:bg-green-900/60 backdrop-blur-md border border-green-200/50 dark:border-green-700/50 rounded-lg p-1 shadow-sm">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigateDay(-1)}
              className="h-8 w-8 hover:bg-green-100 dark:hover:bg-green-800"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => {
                if (e.target.value) {
                  setSelectedDate(e.target.value)
                }
              }}
              className="bg-transparent border-none outline-none text-gray-700 dark:text-white text-sm px-2 cursor-pointer"
            />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigateDay(1)}
              className="h-8 w-8 hover:bg-green-100 dark:hover:bg-green-800"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-green-600 hover:bg-green-700">
                <Plus className="h-4 w-4 mr-2" />
                Add Food
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Add Food Entry</DialogTitle>
                <DialogDescription>
                Upload a food image for AI analysis or enter details manually
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-6">
              {/* Image Upload Section */}
              <div className="space-y-4">
                <Label>Food Image (Optional)</Label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  {selectedImage ? (
                    <div className="space-y-4">
                      <img 
                        src={selectedImage} 
                        alt="Food" 
                        className="max-h-48 mx-auto rounded-lg object-cover"
                      />
                      <div className="flex gap-2 justify-center">
                        <Button 
                          onClick={analyzeImageWithAI} 
                          disabled={isAnalyzing}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          {isAnalyzing ? (
                            <>
                              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                              Analyzing...
                            </>
                          ) : (
                            <>
                              <Camera className="h-4 w-4 mr-2" />
                              Analyze with AI
                            </>
                          )}
                        </Button>
                        <Button 
                          variant="outline" 
                          onClick={() => {
                            setSelectedImage(null)
                            if (fileInputRef.current) {
                              fileInputRef.current.value = ""
                            }
                          }}
                        >
                          Remove
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <Upload className="h-12 w-12 mx-auto text-gray-400" />
                      <div>
                        <Button 
                          onClick={() => fileInputRef.current?.click()}
                          variant="outline"
                        >
                          <Camera className="h-4 w-4 mr-2" />
                          Upload Image
                        </Button>
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                        />
                      </div>
                      <p className="text-sm text-gray-500">
                        Upload a photo of your meal for AI-powered nutrition analysis
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Manual Entry Section */}
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Food Name</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      placeholder="e.g., Grilled Chicken Salad"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="mealType">Meal Type</Label>
                    <select
                      id="mealType"
                      value={formData.mealType}
                      onChange={(e) => setFormData({...formData, mealType: e.target.value})}
                      className="w-full p-2 border rounded-md"
                    >
                      <option value="breakfast">Breakfast</option>
                      <option value="lunch">Lunch</option>
                      <option value="dinner">Dinner</option>
                      <option value="snack">Snack</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="servingSize">Serving Size</Label>
                  <Input
                    id="servingSize"
                    value={formData.servingSize}
                    onChange={(e) => setFormData({...formData, servingSize: e.target.value})}
                    placeholder="e.g., 1 cup, 100g"
                  />
                </div>

                <div className="grid grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="calories">kcal</Label>
                    <Input
                      id="calories"
                      type="number"
                      value={formData.calories}
                      onChange={(e) => setFormData({...formData, calories: Number(e.target.value)})}
                      placeholder="0"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="protein">Protein (g)</Label>
                    <Input
                      id="protein"
                      type="number"
                      value={formData.protein}
                      onChange={(e) => setFormData({...formData, protein: Number(e.target.value)})}
                      placeholder="0"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="carbs">Carbs (g)</Label>
                    <Input
                      id="carbs"
                      type="number"
                      value={formData.carbs}
                      onChange={(e) => setFormData({...formData, carbs: Number(e.target.value)})}
                      placeholder="0"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="fat">Fat (g)</Label>
                    <Input
                      id="fat"
                      type="number"
                      value={formData.fat}
                      onChange={(e) => setFormData({...formData, fat: Number(e.target.value)})}
                      placeholder="0"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={onSubmit}>
                  Add Entry
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      </div>

      {/* Nutrition Summary */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="bg-white/60 dark:bg-green-900/40 backdrop-blur-sm border-green-200/50 dark:border-green-700/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-green-700 dark:text-green-300">Total kcal</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{totals.calories}</div>
          </CardContent>
        </Card>

        <Card className="bg-white/60 dark:bg-green-900/40 backdrop-blur-sm border-green-200/50 dark:border-green-700/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-green-700 dark:text-green-300">Protein</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{totals.protein}g</div>
          </CardContent>
        </Card>

        <Card className="bg-white/60 dark:bg-green-900/40 backdrop-blur-sm border-green-200/50 dark:border-green-700/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-green-700 dark:text-green-300">Carbs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{totals.carbs}g</div>
          </CardContent>
        </Card>

        <Card className="bg-white/60 dark:bg-green-900/40 backdrop-blur-sm border-green-200/50 dark:border-green-700/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-green-700 dark:text-green-300">Fat</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{totals.fat}g</div>
          </CardContent>
        </Card>
      </div>

      {/* Meal Entries */}
      <div className="grid gap-4 md:grid-cols-2">
        {Object.entries(mealEntries).map(([mealType, mealTypeEntries]) => (
          <Card key={mealType} className="bg-white/60 dark:bg-green-900/40 backdrop-blur-sm border-green-200/50 dark:border-green-700/50">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="capitalize text-lg font-semibold text-gray-900 dark:text-white">{mealType}</CardTitle>
                <span className="text-sm text-muted-foreground bg-green-100 dark:bg-green-800 px-2 py-1 rounded-full">
                  {mealTypeEntries.length} {mealTypeEntries.length === 1 ? 'item' : 'items'}
                </span>
              </div>
            </CardHeader>
            <CardContent>
              {mealTypeEntries.length === 0 ? (
                <p className="text-muted-foreground text-center py-6 text-sm">
                  No {mealType} entries yet
                </p>
              ) : (
                <div className="space-y-2">
                  {mealTypeEntries.map((entry, index) => {
                    const entryIndex = entries.indexOf(entry)
                    return (
                      <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-green-50/60 dark:bg-green-800/30 border border-green-200/30 dark:border-green-700/30">
                        <div className="min-w-0 flex-1">
                          <div className="font-medium text-gray-900 dark:text-white truncate">{entry.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {entry.servingSize}
                          </div>
                        </div>
                        <div className="flex items-center gap-3 ml-4">
                          <div className="text-right shrink-0">
                            <div className="font-medium text-gray-900 dark:text-white">{entry.calories} kcal</div>
                            <div className="text-xs text-muted-foreground">
                              P: {entry.protein}g • C: {entry.carbs}g • F: {entry.fat}g
                            </div>
                          </div>
                          <Button variant="ghost" size="icon" className="shrink-0 h-8 w-8" onClick={() => handleDeleteEntry(entry.id)}>
                            <Trash className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

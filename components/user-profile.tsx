"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { calculateBMI, calculateTDEE } from "@/lib/calculations"
import { saveUserProfile, getUserProfile } from "@/lib/storage"
import { useProfileContext } from "@/components/profile-context"
import { Camera, X } from "lucide-react"

const formSchema = z.object({
  name: z.string().min(1, "Name is required").max(50, "Name too long"),
  age: z.coerce.number().min(18).max(100),
  weight: z.coerce.number().min(40).max(250),
  height: z.coerce.number().min(130).max(230),
  gender: z.enum(["male", "female"]),
  activityLevel: z.enum(["sedentary", "light", "moderate", "active", "very-active"]),
  dietaryPreference: z.enum(["standard", "vegan", "vegetarian", "keto", "paleo", "high-protein"]),
  goal: z.enum(["weight-loss", "maintenance", "muscle-gain"]),
})

export default function UserProfile() {
  const [bmi, setBMI] = useState<number | null>(null)
  const [tdee, setTDEE] = useState<number | null>(null)
  const [goalCalories, setGoalCalories] = useState<number | null>(null)
  const { currentProfile, updateCurrentProfile, profileAvatar, setProfileAvatar } = useProfileContext()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const form = useForm({
    resolver: zodResolver(formSchema),
    mode: "onChange",
    defaultValues: {
      name: "John Doe",
      age: 30,
      weight: 70,
      height: 170,
      gender: "male",
      activityLevel: "moderate",
      dietaryPreference: "standard",
      goal: "maintenance",
    },
  })

  useEffect(() => {
    // Load user profile from local storage
    const userProfile = getUserProfile()
    if (userProfile) {
      form.reset(userProfile)
      updateCalculations(userProfile)
    }
  }, [])

  function updateCalculations(data: any) {
    const calculatedBMI = calculateBMI(data.weight, data.height)
    const calculatedTDEE = calculateTDEE(data.weight, data.height, data.age, data.gender, data.activityLevel)

    let calculatedGoalCalories = calculatedTDEE

    if (data.goal === "weight-loss") {
      calculatedGoalCalories = Math.round(calculatedTDEE * 0.8) // 20% deficit
    } else if (data.goal === "muscle-gain") {
      calculatedGoalCalories = Math.round(calculatedTDEE * 1.1) // 10% surplus
    }

    setBMI(calculatedBMI)
    setTDEE(calculatedTDEE)
    setGoalCalories(calculatedGoalCalories)
  }

  // Calculate macro targets based on scientific formulas
  const calculateMacroTargets = () => {
    const data = form.getValues()
    if (!data.weight) {
      return { protein: 150, fat: 65, carbs: 250 }
    }

    const weightKg = Number(data.weight)
    const goal = data.goal || 'maintenance'

    // Protein Factor based on goal
    let proteinFactor = 1.0 // Normal health default
    if (goal === 'weight-loss') {
      proteinFactor = 1.4 // Middle of 1.2-1.6 range
    } else if (goal === 'muscle-gain') {
      proteinFactor = 1.9 // Middle of 1.6-2.2 range
    } else if (goal === 'maintenance') {
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
    const remainingCalories = (goalCalories || tdee || 2000) - (caloriesFromProtein + caloriesFromFat)
    const carbsGrams = Math.max(0, Math.round(remainingCalories / 4))

    return {
      protein: proteinGrams,
      fat: fatGrams,
      carbs: carbsGrams
    }
  }

  function onSubmit(data: any) {
    saveUserProfile(data)
    updateCalculations(data)

    // Sync with ProfileContext so the header icon updates immediately
    if (currentProfile) {
      updateCurrentProfile({
        ...currentProfile,
        name: data.name,
        age: data.age,
        weight: data.weight,
        height: data.height,
        gender: data.gender,
        activityLevel: data.activityLevel,
        dietaryPreference: data.dietaryPreference,
        goal: data.goal,
      })
    }
  }

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onloadend = () => {
      const base64 = reader.result as string
      setProfileAvatar(base64)
    }
    reader.readAsDataURL(file)
  }

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
  }

  const getAvatarColor = (name: string) => {
    const colors = [
      "bg-gradient-to-br from-pink-400 to-pink-600",
      "bg-gradient-to-br from-purple-400 to-purple-600",
      "bg-gradient-to-br from-blue-400 to-blue-600",
      "bg-gradient-to-br from-green-400 to-green-600",
      "bg-gradient-to-br from-yellow-400 to-yellow-600",
      "bg-gradient-to-br from-red-400 to-red-600",
      "bg-gradient-to-br from-indigo-400 to-indigo-600",
      "bg-gradient-to-br from-teal-400 to-teal-600"
    ]
    const index = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % colors.length
    return colors[index]
  }

  const currentName = form.watch("name") || currentProfile?.name || "User"

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card className="bg-background/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle>Your Profile</CardTitle>
          <CardDescription>Enter your details to get personalized diet recommendations</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Avatar Section */}
          <div className="flex flex-col items-center mb-6">
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              className="hidden"
              onChange={handleAvatarUpload}
            />
            <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
              <Avatar className="h-24 w-24">
                <AvatarImage src={profileAvatar || undefined} />
                <AvatarFallback className={`${getAvatarColor(currentName)} text-white font-bold text-2xl`}>
                  {getInitials(currentName)}
                </AvatarFallback>
              </Avatar>
              <div className="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                <Camera className="h-8 w-8 text-white" />
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-2">Click to change profile picture</p>
            {profileAvatar && (
              <Button
                variant="ghost"
                size="sm"
                className="mt-1 text-destructive hover:text-destructive"
                onClick={() => setProfileAvatar(null)}
              >
                <X className="h-3 w-3 mr-1" />
                Remove picture
              </Button>
            )}
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input type="text" placeholder="Enter your name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="age"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Age (years)</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="30" {...field} value={field.value as string} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="weight"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Weight (kg)</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="70" {...field} value={field.value as string} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="height"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Height (cm)</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="170" {...field} value={field.value as string} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="gender"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Gender</FormLabel>
                      <FormControl>
                        <RadioGroup value={field.value} onValueChange={field.onChange} className="flex">
                          <FormItem className="flex items-center space-x-1 space-y-0 mr-4">
                            <FormControl>
                              <RadioGroupItem value="male" />
                            </FormControl>
                            <FormLabel className="font-normal">Male</FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-1 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="female" />
                            </FormControl>
                            <FormLabel className="font-normal">Female</FormLabel>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="activityLevel"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Activity Level</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select activity level" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="sedentary">Sedentary (little or no exercise)</SelectItem>
                        <SelectItem value="light">Light (exercise 1-3 days/week)</SelectItem>
                        <SelectItem value="moderate">Moderate (exercise 3-5 days/week)</SelectItem>
                        <SelectItem value="active">Active (exercise 6-7 days/week)</SelectItem>
                        <SelectItem value="very-active">Very Active (hard exercise daily)</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="dietaryPreference"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Dietary Preference</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select dietary preference" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="standard">Standard</SelectItem>
                        <SelectItem value="vegan">Vegan</SelectItem>
                        <SelectItem value="vegetarian">Vegetarian</SelectItem>
                        <SelectItem value="keto">Keto</SelectItem>
                        <SelectItem value="paleo">Paleo</SelectItem>
                        <SelectItem value="high-protein">High Protein</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="goal"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Goal</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select your goal" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="weight-loss">Weight Loss</SelectItem>
                        <SelectItem value="maintenance">Maintenance</SelectItem>
                        <SelectItem value="muscle-gain">Muscle Gain</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full">
                Save Profile
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      <Card className="bg-primary/10 backdrop-blur-sm dark:bg-primary/5">
        <CardHeader>
          <CardTitle>Your Results</CardTitle>
          <CardDescription>Based on your profile information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {bmi && tdee && goalCalories ? (
            <>
              <div className="space-y-2">
                <h3 className="font-medium">Body Mass Index (BMI)</h3>
                <div className="text-3xl font-bold">{bmi.toFixed(1)}</div>
                <p className="text-sm text-muted-foreground">
                  {bmi < 18.5 ? "Underweight" : bmi < 25 ? "Normal" : bmi < 30 ? "Overweight" : "Obese"}
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="font-medium">Daily Energy Expenditure</h3>
                <div className="text-3xl font-bold">{tdee} kcal</div>
                <p className="text-sm text-muted-foreground">This is how many kcal you burn daily</p>
              </div>

              <div className="space-y-2">
                <h3 className="font-medium">Recommended Daily Intake</h3>
                <div className="text-3xl font-bold text-primary">{goalCalories} kcal</div>
                <p className="text-sm text-muted-foreground">
                  {form.getValues().goal === "weight-loss"
                    ? "kcal deficit for weight loss"
                    : form.getValues().goal === "muscle-gain"
                      ? "kcal surplus for muscle gain"
                      : "Maintenance kcal"}
                </p>
              </div>

              <div className="space-y-3 pt-4 border-t border-border">
                <h3 className="font-medium">Daily Macro Targets</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                    <div className="text-2xl font-bold text-red-600">{calculateMacroTargets().protein}g</div>
                    <div className="text-sm text-muted-foreground">Protein</div>
                  </div>
                  <div className="text-center p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                    <div className="text-2xl font-bold text-yellow-600">{calculateMacroTargets().fat}g</div>
                    <div className="text-sm text-muted-foreground">Fat</div>
                  </div>
                  <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">{calculateMacroTargets().carbs}g</div>
                    <div className="text-sm text-muted-foreground">Carbs</div>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">
                  Based on {String(form.getValues().weight)}kg body weight and {String(form.getValues().goal)?.replace('-', ' ')} goal
                </p>
              </div>
            </>
          ) : (
            <div className="py-8 text-center text-muted-foreground">
              Complete your profile to see your personalized results
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

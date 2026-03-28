"use client"

import React, { useState, useRef } from "react"
import { SubmitHandler } from "react-hook-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Plus, Search, Camera, Upload, Loader2, Trash } from "lucide-react"
import { saveFoodEntry, getFoodEntries, deleteFoodEntry } from "@/lib/storage"
import { formatDate } from "@/lib/date-utils"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const formSchema = z.object({
  name: z.string().min(2, { message: "Food name is required" }),
  servingSize: z.string().min(1, { message: "Serving size is required" }),
  calories: z.coerce.number().min(0, { message: "kcal must be a positive number" }),
  protein: z.coerce.number().min(0, { message: "Protein must be a positive number" }),
  carbs: z.coerce.number().min(0, { message: "Carbs must be a positive number" }),
  fat: z.coerce.number().min(0, { message: "Fat must be a positive number" }),
  mealType: z.enum(["breakfast", "lunch", "dinner", "snack"]),
})

export default function FoodTracker() {
  const [entries, setEntries] = useState<any[]>([])
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema) as any,
    defaultValues: {
      name: "",
      servingSize: "1 serving",
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0,
      mealType: "breakfast",
    },
  })

  // Load entries for selected date
  React.useEffect(() => {
    const dateString = formatDate(selectedDate)
    const dateEntries = getFoodEntries(dateString)
    setEntries(dateEntries)
  }, [selectedDate])

  function loadEntries() {
    const dateString = formatDate(selectedDate)
    const dateEntries = getFoodEntries(dateString)
    setEntries(dateEntries)
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
      // TODO: Replace with actual AI API call when you provide the API key
      const response = await fetch('/api/analyze-food-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          image: selectedImage
        })
      })

      if (response.ok) {
        const analysis = await response.json()
        // Fill form with AI analysis results
        form.setValue('name', analysis.foodName || 'Analyzed Food')
        form.setValue('calories', analysis.calories || 0)
        form.setValue('protein', analysis.protein || 0)
        form.setValue('carbs', analysis.carbs || 0)
        form.setValue('fat', analysis.fat || 0)
        form.setValue('servingSize', analysis.servingSize || '1 serving')
      }
    } catch (error) {
      console.error('AI analysis failed:', error)
      // Fallback to manual entry
    } finally {
      setIsAnalyzing(false)
    }
  }

  const onSubmit: SubmitHandler<z.infer<typeof formSchema>> = (data) => {
    const dateString = formatDate(selectedDate)
    saveFoodEntry(dateString, data)
    loadEntries()
    setIsDialogOpen(false)
    form.reset()
    setSelectedImage(null)
  }

  function handleSearch() {
    if (searchQuery.trim().length > 0) {
      // Simple local search - filter from a basic food database
      const basicFoods = [
        { name: "Apple", calories: 95, protein: 0.5, carbs: 25, fat: 0.3, servingSize: "1 medium" },
        { name: "Banana", calories: 105, protein: 1.3, carbs: 27, fat: 0.4, servingSize: "1 medium" },
        { name: "Chicken Breast", calories: 165, protein: 31, carbs: 0, fat: 3.6, servingSize: "100g" },
        { name: "Rice (cooked)", calories: 130, protein: 2.7, carbs: 28, fat: 0.3, servingSize: "100g" },
        { name: "Egg", calories: 70, protein: 6, carbs: 0.6, fat: 5, servingSize: "1 large" },
        { name: "Milk", calories: 150, protein: 8, carbs: 12, fat: 8, servingSize: "1 cup" },
        { name: "Bread", calories: 80, protein: 4, carbs: 15, fat: 1, servingSize: "1 slice" },
        { name: "Salmon", calories: 208, protein: 20, carbs: 0, fat: 13, servingSize: "100g" },
      ]
      const results = basicFoods.filter(food => 
        food.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
      setSearchResults(results)
    }
  }

  function selectFood(food: any) {
    form.setValue("name", food.name)
    form.setValue("calories", food.calories)
    form.setValue("protein", food.protein)
    form.setValue("carbs", food.carbs)
    form.setValue("fat", food.fat)
    form.setValue("servingSize", food.servingSize)
    setSearchResults([])
    setSearchQuery("")
  }

  function handleDateChange(e: React.ChangeEvent<HTMLInputElement>) {
    const newDate = new Date(e.target.value + 'T00:00:00')
    setSelectedDate(newDate)
  }

  function handleDeleteEntry(index: number) {
    const dateString = formatDate(selectedDate)
    deleteFoodEntry(dateString, index)
    loadEntries()
  }

  // Calculate nutrition totals
  const totals = entries.reduce(
    (acc, entry) => ({
      calories: acc.calories + entry.calories,
      protein: acc.protein + entry.protein,
      carbs: acc.carbs + entry.carbs,
      fat: acc.fat + entry.fat,
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0 },
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Food Tracker</h2>
        <div className="flex items-center space-x-2">
          <Input type="date" value={formatDate(selectedDate, "input")} onChange={handleDateChange} className="w-auto" />
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Food
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[550px]">
              <DialogHeader>
                <DialogTitle>Add Food Entry</DialogTitle>
                <DialogDescription>Log your food for {formatDate(selectedDate, "long")}</DialogDescription>
              </DialogHeader>

              <div className="mb-4">
                <div className="flex items-center space-x-2">
                  <Input
                    placeholder="Search for a food..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <Button variant="outline" size="icon" onClick={handleSearch}>
                    <Search className="h-4 w-4" />
                  </Button>
                </div>

                {searchResults.length > 0 && (
                  <div className="mt-2 border rounded-md max-h-40 overflow-y-auto">
                    {searchResults.map((food, index) => (
                      <div key={index} className="p-2 hover:bg-accent cursor-pointer" onClick={() => selectFood(food)}>
                        <div className="font-medium">{food.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {food.calories} kcal | P: {food.protein}g | C: {food.carbs}g | F: {food.fat}g
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Food Name</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. Apple" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="servingSize"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Serving Size</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g. 1 cup" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="calories"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>kcal</FormLabel>
                          <FormControl>
                            <Input type="number" placeholder="0" {...field} value={field.value?.toString() || ''} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name="protein"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Protein (g)</FormLabel>
                          <FormControl>
                            <Input type="number" placeholder="0" {...field} value={field.value?.toString() || ''} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="carbs"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Carbs (g)</FormLabel>
                          <FormControl>
                            <Input type="number" placeholder="0" {...field} value={field.value?.toString() || ''} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="fat"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Fat (g)</FormLabel>
                          <FormControl>
                            <Input type="number" placeholder="0" {...field} value={field.value?.toString() || ''} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="mealType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Meal Type</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select meal type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="breakfast">Breakfast</SelectItem>
                            <SelectItem value="lunch">Lunch</SelectItem>
                            <SelectItem value="dinner">Dinner</SelectItem>
                            <SelectItem value="snack">Snack</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <DialogFooter>
                    <Button type="submit">Add Food</Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        <Card className="bg-background/80 backdrop-blur-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total kcal</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totals.calories}</div>
          </CardContent>
        </Card>

        <Card className="bg-background/80 backdrop-blur-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Protein</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totals.protein}g</div>
          </CardContent>
        </Card>

        <Card className="bg-background/80 backdrop-blur-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Carbs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totals.carbs}g</div>
          </CardContent>
        </Card>

        <Card className="bg-background/80 backdrop-blur-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Fat</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totals.fat}g</div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-background/80 backdrop-blur-sm overflow-hidden">
        <CardHeader>
          <CardTitle>Food Log - {formatDate(selectedDate, "long")}</CardTitle>
          <CardDescription>All foods logged for this day</CardDescription>
        </CardHeader>
        <CardContent>
          {entries.length > 0 ? (
            <div className="space-y-4">
              {["breakfast", "lunch", "dinner", "snack"].map((mealType) => {
                const mealEntries = entries.filter((entry) => entry.mealType === mealType)

                if (mealEntries.length === 0) return null

                return (
                  <div key={mealType} className="space-y-2">
                    <h3 className="text-lg font-semibold capitalize">{mealType}</h3>
                    <div className="space-y-2">
                      {mealEntries.map((entry, index) => {
                        const entryIndex = entries.indexOf(entry)
                        return (
                          <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-accent/50">
                            <div>
                              <div className="font-medium">{entry.name}</div>
                              <div className="text-sm text-muted-foreground">{entry.servingSize}</div>
                            </div>
                            <div className="flex items-center gap-4">
                              <div className="text-right">
                                <div className="font-medium">{entry.calories} kcal</div>
                                <div className="text-sm text-muted-foreground">
                                  P: {entry.protein}g • C: {entry.carbs}g • F: {entry.fat}g
                                </div>
                              </div>
                              <Button variant="ghost" size="icon" onClick={() => handleDeleteEntry(entryIndex)}>
                                <Trash className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="py-8 text-center text-muted-foreground">
              No food entries for this day. Add some using the button above.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}


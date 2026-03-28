"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { RefreshCw, Heart, Brain, Target, AlertTriangle, Utensils } from "lucide-react"
import { useProfileContext } from "@/components/profile-context"
import { generateAIHealthTips } from "@/lib/ai-nutritionist"
import { Badge } from "@/components/ui/badge"

export default function HealthTips() {
  const { currentProfile } = useProfileContext()
  const [healthTips, setHealthTips] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (currentProfile) {
      // Check if we have health tips in local storage
      const savedTips = localStorage.getItem("aiHealthTips")
      if (savedTips) {
        const parsed = JSON.parse(savedTips)
        // Check if the saved tips match current profile AND profile name hasn't changed
        // Also handle backward compatibility for tips saved without profileName
        const savedProfileName = parsed.profileName || null
        if (parsed.profileId === currentProfile.id && savedProfileName === currentProfile.name) {
          setHealthTips(parsed)
        } else {
          // Generate new tips for different profile or updated name
          generateHealthTipsData(currentProfile)
        }
      } else {
        // Generate new health tips
        generateHealthTipsData(currentProfile)
      }
    }
  }, [currentProfile]) // This will trigger when any profile property changes

  async function generateHealthTipsData(profile: any) {
    if (!profile) return

    setLoading(true)

    try {
      const newHealthTips = await generateAIHealthTips(profile)
      const tipsWithProfile = { 
        ...newHealthTips, 
        profileId: profile.id,
        profileName: profile.name // Store the profile name to detect changes
      }
      setHealthTips(tipsWithProfile)

      // Save to local storage
      localStorage.setItem("aiHealthTips", JSON.stringify(tipsWithProfile))
    } catch (error) {
      console.error("Failed to generate AI health tips:", error)
    } finally {
      setLoading(false)
    }
  }

  function refreshTips() {
    if (currentProfile) {
      generateHealthTipsData(currentProfile)
    }
  }

  if (!currentProfile) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Please create a profile to get personalized health tips.</p>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin w-8 h-8 border-4 border-green-600 border-t-transparent rounded-full"></div>
        <span className="ml-3 text-gray-600">Generating your personalized AI health tips...</span>
      </div>
    )
  }

  if (!healthTips) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No health tips available.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">AI-Powered Health Tips</h2>
          <p className="text-gray-600">Personalized health advice based on your profile and goals</p>
        </div>
        <Button onClick={refreshTips} disabled={loading}>
          <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh Tips
        </Button>
      </div>

      {/* Daily Tip */}
      <Card className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-purple-600" />
            Tip of the Day
          </CardTitle>
          <CardDescription>Your personalized daily health and nutrition tip</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-lg font-medium text-purple-800 dark:text-purple-200">
            {healthTips.dailyTip}
          </p>
        </CardContent>
      </Card>

      {/* Personalized Tips */}
      {healthTips.personalizedTips && healthTips.personalizedTips.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-blue-600" />
              Personalized Tips for {currentProfile.name}
            </CardTitle>
            <CardDescription>Tailored advice based on your profile data</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {healthTips.personalizedTips.map((tip: string, idx: number) => (
                <div key={idx} className="flex items-start gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-sm">{tip}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Goal-Specific Tips */}
      {healthTips.goalSpecificTips && healthTips.goalSpecificTips.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-green-600" />
              {currentProfile.goal === "weight-loss" ? "Weight Loss" : 
               currentProfile.goal === "muscle-gain" ? "Muscle Gain" : "Maintenance"} Tips
            </CardTitle>
            <CardDescription>Strategies to help you achieve your specific goals</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {healthTips.goalSpecificTips.map((tip: string, idx: number) => (
                <div key={idx} className="flex items-start gap-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-sm">{tip}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Dietary Tips */}
      {healthTips.dietaryTips && healthTips.dietaryTips.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Utensils className="h-5 w-5 text-orange-600" />
              {currentProfile.dietaryPreference === "vegan" ? "Vegan" :
               currentProfile.dietaryPreference === "vegetarian" ? "Vegetarian" :
               currentProfile.dietaryPreference === "keto" ? "Ketogenic" :
               currentProfile.dietaryPreference === "paleo" ? "Paleo" :
               currentProfile.dietaryPreference === "high-protein" ? "High-Protein" : "Standard"} Diet Tips
            </CardTitle>
            <CardDescription>Nutrition advice for your dietary preferences</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {healthTips.dietaryTips.map((tip: string, idx: number) => (
                <div key={idx} className="flex items-start gap-3 p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                  <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-sm">{tip}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Lifestyle Tips */}
      {healthTips.lifestyleTips && healthTips.lifestyleTips.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="w-8 h-8 bg-teal-100 dark:bg-teal-900 rounded-full flex items-center justify-center">
                <span className="text-teal-600 dark:text-teal400 text-sm">🌟</span>
              </div>
              Lifestyle Tips
            </CardTitle>
            <CardDescription>Habits and practices for overall wellness</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {healthTips.lifestyleTips.map((tip: string, idx: number) => (
                <div key={idx} className="flex items-start gap-3 p-3 bg-teal-50 dark:bg-teal-900/20 rounded-lg">
                  <div className="w-2 h-2 bg-teal-500 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-sm">{tip}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Health Warnings */}
      {healthTips.warnings && healthTips.warnings.length > 0 && (
        <Card className="border-red-200 dark:border-red-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              Important Health Considerations
            </CardTitle>
            <CardDescription>Please pay attention to these health warnings</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {healthTips.warnings.map((warning: string, idx: number) => (
                <div key={idx} className="flex items-start gap-3 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                  <AlertTriangle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-red-800 dark:text-red-200">{warning}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Profile Summary */}
      <Card className="bg-gray-50 dark:bg-gray-800/50">
        <CardHeader>
          <CardTitle className="text-lg">Your Profile Summary</CardTitle>
          <CardDescription>How these tips were personalized for you</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="font-medium">Age:</span>
              <span className="ml-2">{currentProfile.age} years</span>
            </div>
            <div>
              <span className="font-medium">Goal:</span>
              <span className="ml-2">{currentProfile.goal}</span>
            </div>
            <div>
              <span className="font-medium">Activity:</span>
              <span className="ml-2">{currentProfile.activityLevel}</span>
            </div>
            <div>
              <span className="font-medium">Diet:</span>
              <span className="ml-2">{currentProfile.dietaryPreference}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}


"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Tabs, TabsContent, TabsItem, TabsList } from "@/components/ui/tabs"
import UserProfile from "@/components/user-profile"
import Dashboard from "@/components/dashboard"
import MealPlanner from "@/components/meal-planner"
import FoodTracker from "@/components/food-tracker"
import HealthTips from "@/components/health-tips"
import { ProfileDropdown } from "@/components/profile-dropdown"
import { NutriTrackLogo } from "@/components/logo"
import { AnimatedBackground } from "@/components/animated-background"
import { ProfileProvider, useProfileContext } from "@/components/profile-context"
import { AuthProvider, useAuth } from "@/components/auth-context"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"

function AppContent() {
  const { activeTab, setActiveTab, loading: profileLoading } = useProfileContext()
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/")
    }
  }, [user, authLoading, router])

  if (authLoading || profileLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-12 h-12 border-4 border-green-600 border-t-transparent rounded-full"></div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-transparent">
      <AnimatedBackground />

      <div className="relative z-10 p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          <Navigation />

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-2 md:grid-cols-5 bg-white/60 dark:bg-green-900/60 backdrop-blur-xl border border-green-200/50 dark:border-green-700/50 rounded-xl mb-8 p-1 shadow-lg">
              <TabsItem
                value="dashboard"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-600 data-[state=active]:to-green-500 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-300 text-green-700 dark:text-green-200 hover:text-green-900 dark:hover:text-white"
              >
                Dashboard
              </TabsItem>
              <TabsItem
                value="profile"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-600 data-[state=active]:to-green-500 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-300 text-green-700 dark:text-green-200 hover:text-green-900 dark:hover:text-white"
              >
                Profile
              </TabsItem>
              <TabsItem
                value="meal-planner"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-600 data-[state=active]:to-green-500 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-300 text-green-700 dark:text-green-200 hover:text-green-900 dark:hover:text-white"
              >
                Meal Planner
              </TabsItem>
              <TabsItem
                value="food-tracker"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-600 data-[state=active]:to-green-500 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-300 text-green-700 dark:text-green-200 hover:text-green-900 dark:hover:text-white"
              >
                Food Tracker
              </TabsItem>
              <TabsItem
                value="health-tips"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-600 data-[state=active]:to-green-500 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-300 text-green-700 dark:text-green-200 hover:text-green-900 dark:hover:text-white"
              >
                Health Tips
              </TabsItem>
            </TabsList>

            <TabsContent
              value="dashboard"
              className="bg-white/40 dark:bg-green-900/20 backdrop-blur-xl rounded-xl border border-green-200/30 dark:border-green-700/30 shadow-xl p-4 md:p-6 animate-fade-in"
            >
              <Dashboard />
            </TabsContent>

            <TabsContent
              value="profile"
              className="bg-white/40 dark:bg-green-900/20 backdrop-blur-xl rounded-xl border border-green-200/30 dark:border-green-700/30 shadow-xl p-4 md:p-6 animate-fade-in"
            >
              <UserProfile />
            </TabsContent>

            <TabsContent
              value="meal-planner"
              className="bg-white/40 dark:bg-green-900/20 backdrop-blur-xl rounded-xl border border-green-200/30 dark:border-green-700/30 shadow-xl p-4 md:p-6 animate-fade-in"
            >
              <MealPlanner />
            </TabsContent>

            <TabsContent
              value="food-tracker"
              className="bg-white/40 dark:bg-green-900/20 backdrop-blur-xl rounded-xl border border-green-200/30 dark:border-green-700/30 shadow-xl p-4 md:p-6 animate-fade-in"
            >
              <FoodTracker />
            </TabsContent>

            <TabsContent
              value="health-tips"
              className="bg-white/40 dark:bg-green-900/20 backdrop-blur-xl rounded-xl border border-green-200/30 dark:border-green-700/30 shadow-xl p-4 md:p-6 animate-fade-in"
            >
              <HealthTips />
            </TabsContent>
          </Tabs>
        </div>
      </div>
      
      <Footer />
    </div>
  )
}

export default function Home() {
  return (
    <AuthProvider>
      <ProfileProvider>
        <AppContent />
      </ProfileProvider>
    </AuthProvider>
  )
}

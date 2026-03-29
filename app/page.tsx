"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { NutriTrackLogo } from "@/components/logo"
import { AnimatedBackground } from "@/components/animated-background"
import { ChartBar, Target, Apple, Users, Zap, FileText, CheckCircle } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      <div className="flex-1 relative overflow-hidden bg-transparent">
        <AnimatedBackground />
        
        {/* Hero Section */}
        <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
          <div className="w-full max-w-4xl text-center">
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-4">
              Track Your Nutrition,
            </h1>
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold text-green-600 dark:text-green-400 mb-6">
              Transform Your Life
            </h1>
            <p className="text-lg sm:text-xl text-gray-700 dark:text-gray-300 mb-8 px-4 sm:px-0">
              NutriTrack helps you monitor calories, track your progress, and achieve your health goals with personalized insights and easy meal logging.
            </p>
            
            {/* Features Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
              <div className="flex flex-col items-center">
                <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400 mb-3" />
                <h3 className="text-gray-900 dark:text-white font-semibold mb-1">Free Forever</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">No hidden costs</p>
              </div>
              <div className="flex flex-col items-center">
                <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400 mb-3" />
                <h3 className="text-gray-900 dark:text-white font-semibold mb-1">No Credit Card Required</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">Start instantly</p>
              </div>
              <div className="flex flex-col items-center">
                <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400 mb-3" />
                <h3 className="text-gray-900 dark:text-white font-semibold mb-1">Easy to Use</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">Simple interface</p>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
              <Button 
                size="lg" 
                className="bg-green-600 hover:bg-green-700 text-white px-8 py-6 text-lg font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
                onClick={() => window.location.href = '/signup'}
              >
                Get Started
              </Button>
              <Button 
                variant="outline"
                size="lg" 
                className="border-2 border-green-600 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 px-8 py-6 text-lg font-semibold rounded-full transition-all duration-300"
                onClick={() => window.location.href = '/signin'}
              >
                Sign In
              </Button>
            </div>
          </div>
        </div>

        {/* Second Hero Section */}
        <div className="relative z-10 py-16 sm:py-24 lg:py-32 flex items-center justify-center p-4">
          <div className="w-full max-w-6xl">
            <div className="text-center mb-8 sm:mb-16">
              <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
                Everything You Need to Succeed
              </h1>
              <p className="text-base sm:text-xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto px-4 sm:px-0">
                Comprehensive tools designed to help you achieve your nutrition and fitness goals.
              </p>
            </div>

            {/* Feature Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="bg-white/80 dark:bg-gray-800/60 backdrop-blur-sm border-gray-200 dark:border-gray-700/50 text-gray-900 dark:text-white">
                <CardHeader>
                  <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center mb-4">
                    <ChartBar className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle className="text-xl">Calorie Tracking</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 dark:text-gray-300">
                    Log your meals and track daily calorie intake with our extensive food database.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-white/80 dark:bg-gray-800/60 backdrop-blur-sm border-gray-200 dark:border-gray-700/50 text-gray-900 dark:text-white">
                <CardHeader>
                  <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center mb-4">
                    <FileText className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle className="text-xl">Macro Analytics</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 dark:text-gray-300">
                    Monitor your protein, carbs, and fat intake with detailed visual charts.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-white/80 dark:bg-gray-800/60 backdrop-blur-sm border-gray-200 dark:border-gray-700/50 text-gray-900 dark:text-white">
                <CardHeader>
                  <div className="w-12 h-12 bg-orange-600 rounded-lg flex items-center justify-center mb-4">
                    <Target className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle className="text-xl">Goal Setting</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 dark:text-gray-300">
                    Set personalized goals for weight loss, muscle gain, or maintenance.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-white/80 dark:bg-gray-800/60 backdrop-blur-sm border-gray-200 dark:border-gray-700/50 text-gray-900 dark:text-white">
                <CardHeader>
                  <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center mb-4">
                    <Apple className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle className="text-xl">Meal Planning</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 dark:text-gray-300">
                    Plan your meals in advance and stay on track with your nutrition plan.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-white/80 dark:bg-gray-800/60 backdrop-blur-sm border-gray-200 dark:border-gray-700/50 text-gray-900 dark:text-white">
                <CardHeader>
                  <div className="w-12 h-12 bg-red-600 rounded-lg flex items-center justify-center mb-4">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle className="text-xl">Progress Sharing</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 dark:text-gray-300">
                    Share your achievements with friends and stay motivated together.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-white/80 dark:bg-gray-800/60 backdrop-blur-sm border-gray-200 dark:border-gray-700/50 text-gray-900 dark:text-white">
                <CardHeader>
                  <div className="w-12 h-12 bg-yellow-600 rounded-lg flex items-center justify-center mb-4">
                    <Zap className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle className="text-xl">Smart Insights</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 dark:text-gray-300">
                    Get AI-powered recommendations based on your eating patterns.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  )
}

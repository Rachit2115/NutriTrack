"use client"

import { useState } from "react"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { BackButton } from "@/components/back-button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, User, ArrowRight, Clock, CheckCircle } from "lucide-react"

const blogPosts = [
  {
    id: 1,
    title: "10 High-Protein Breakfast Ideas to Start Your Day Right",
    excerpt: "Discover delicious and nutritious breakfast options that will keep you full and energized throughout the morning.",
    author: "Sarah Johnson",
    date: "March 15, 2024",
    readTime: "5 min read",
    category: "Nutrition",
    image: "/blog/breakfast.jpg"
  },
  {
    id: 2,
    title: "Understanding Macronutrients: A Complete Guide",
    excerpt: "Learn everything you need to know about proteins, carbohydrates, and fats for optimal health and fitness.",
    author: "Dr. Michael Chen",
    date: "March 12, 2024",
    readTime: "8 min read",
    category: "Education",
    image: "/blog/macros.jpg"
  },
  {
    id: 3,
    title: "Meal Prep Sunday: Save Time and Eat Healthy All Week",
    excerpt: "Step-by-step guide to preparing nutritious meals that will last you through the entire work week.",
    author: "Emily Rodriguez",
    date: "March 8, 2024",
    readTime: "6 min read",
    category: "Lifestyle",
    image: "/blog/mealprep.jpg"
  },
  {
    id: 4,
    title: "The Science Behind Calorie Counting: Does It Really Work?",
    excerpt: "Explore the research behind calorie tracking and learn how to use it effectively for your health goals.",
    author: "Dr. James Wilson",
    date: "March 5, 2024",
    readTime: "7 min read",
    category: "Science",
    image: "/blog/calories.jpg"
  },
  {
    id: 5,
    title: "5 Common Nutrition Myths Debunked",
    excerpt: "Separate fact from fiction as we tackle the most persistent myths about diet and nutrition.",
    author: "Lisa Park",
    date: "March 1, 2024",
    readTime: "4 min read",
    category: "Myth Busting",
    image: "/blog/myths.jpg"
  },
  {
    id: 6,
    title: "How to Build Sustainable Healthy Eating Habits",
    excerpt: "Learn practical strategies for developing long-term healthy eating patterns that actually stick.",
    author: "Robert Taylor",
    date: "February 28, 2024",
    readTime: "9 min read",
    category: "Lifestyle",
    image: "/blog/habits.jpg"
  }
]

export default function BlogPage() {
  const [email, setEmail] = useState("")
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return

    setIsLoading(true)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    setIsSubscribed(true)
    setIsLoading(false)
    setEmail("")
    
    // Reset success message after 3 seconds
    setTimeout(() => setIsSubscribed(false), 3000)
  }
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      <main className="flex-1 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Back Button in top-left */}
          <div className="mb-8">
            <BackButton 
              fallbackUrl="/home"
              className="text-gray-600 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400"
            />
          </div>
          
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              NutriTrack Blog
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Expert advice, delicious recipes, and the latest nutrition science to help you live healthier.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {blogPosts.map((post) => (
              <Card key={post.id} className="bg-white/40 dark:bg-gray-800/40 backdrop-blur-xl border-2 border-gray-200/50 dark:border-gray-700/50 hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900 px-2 py-1 rounded">
                      {post.category}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
                      <Clock className="h-3 w-3 mr-1" />
                      {post.readTime}
                    </span>
                  </div>
                  <CardTitle className="text-xl line-clamp-2 hover:text-green-600 dark:hover:text-green-400 transition-colors">
                    {post.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-4">
                    <div className="flex items-center">
                      <User className="h-4 w-4 mr-1" />
                      {post.author}
                    </div>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      {post.date}
                    </div>
                  </div>
                  <Button variant="ghost" className="text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 p-0 h-auto font-medium">
                    Read More
                    <ArrowRight className="h-4 w-4 ml-1" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center">
            <Button variant="outline" size="lg" className="border-green-200 text-green-600 hover:bg-green-50 dark:border-green-800 dark:text-green-400 dark:hover:bg-green-900/20">
              Load More Articles
            </Button>
          </div>

          <div className="mt-20 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-2xl p-8 text-center">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Stay Updated with Latest Nutrition Tips
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
              Get our weekly newsletter with expert advice, healthy recipes, and exclusive content delivered to your inbox.
            </p>
            <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                className="flex-1 px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <Button 
                type="submit" 
                disabled={isLoading}
                className="bg-green-600 hover:bg-green-700 text-white disabled:opacity-50"
              >
                {isLoading ? "Subscribing..." : "Subscribe"}
              </Button>
            </form>
            {isSubscribed && (
              <div className="mt-4 flex items-center justify-center text-green-600 dark:text-green-400">
                <CheckCircle className="h-5 w-5 mr-2" />
                Successfully subscribed to newsletter!
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

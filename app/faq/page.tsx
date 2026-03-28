"use client"

import { useState } from "react"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { BackButton } from "@/components/back-button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Search, HelpCircle, Mail, Phone, MessageCircle } from "lucide-react"

export default function FAQPage() {
  const [searchQuery, setSearchQuery] = useState("")

  const handleStartChat = () => {
    // Redirect to contact page or open chat
    window.location.href = "/contact"
  }

  const handleVisitHelpCenter = () => {
    // Redirect to contact page (help center)
    window.location.href = "/contact"
  }
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      <main className="flex-1 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Back Button in top-left */}
          <div className="mb-8">
            <BackButton 
              fallbackUrl="/home"
              className="text-gray-600 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400"
            />
          </div>
          
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Frequently Asked Questions
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Find answers to common questions about NutriTrack
            </p>
          </div>

          <div className="mb-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for answers..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
          </div>

          <Card className="bg-white/40 dark:bg-gray-800/40 backdrop-blur-xl border-2 border-gray-200/50 dark:border-gray-700/50">
            <CardHeader>
              <CardTitle className="text-2xl text-gray-900 dark:text-white">
                Common Questions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger className="text-left">
                    How do I get started with NutriTrack?
                  </AccordionTrigger>
                  <AccordionContent>
                    Getting started is easy! Simply sign up for a free account, complete your profile with your goals and preferences, and start logging your meals. Our intuitive interface will guide you through the process step by step.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-2">
                  <AccordionTrigger className="text-left">
                    Is NutriTrack really free?
                  </AccordionTrigger>
                  <AccordionContent>
                    Yes! NutriTrack offers a completely free plan that includes all core features like calorie tracking, macro monitoring, and basic analytics. We also offer premium features for power users, but the free version is fully functional.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-3">
                  <AccordionTrigger className="text-left">
                    How accurate is the food database?
                  </AccordionTrigger>
                  <AccordionContent>
                    Our food database contains over 1 million verified food items and is continuously updated. We source data from USDA, manufacturers, and user contributions. While we strive for accuracy, always verify nutritional information for packaged foods.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-4">
                  <AccordionTrigger className="text-left">
                    Can I use NutriTrack for specific diets?
                  </AccordionTrigger>
                  <AccordionContent>
                    Absolutely! NutriTrack supports various dietary preferences including keto, vegan, vegetarian, gluten-free, and more. You can customize your goals and track macros according to your specific dietary needs.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-5">
                  <AccordionTrigger className="text-left">
                    How do I sync my fitness tracker?
                  </AccordionTrigger>
                  <AccordionContent>
                    NutriTrack integrates with popular fitness trackers like Apple Health, Google Fit, Fitbit, and Garmin. Go to Settings &gt; Integrations to connect your devices and automatically sync your activity data.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-6">
                  <AccordionTrigger className="text-left">
                    Is my data secure and private?
                  </AccordionTrigger>
                  <AccordionContent>
                    Yes, we take data security seriously. All your data is encrypted and stored securely. We never sell your personal information to third parties, and you can export or delete your data at any time.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-7">
                  <AccordionTrigger className="text-left">
                    Can I use NutriTrack offline?
                  </AccordionTrigger>
                  <AccordionContent>
                    Yes, our mobile apps support offline functionality. You can log meals and track nutrition without an internet connection. Your data will sync automatically when you're back online.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-8">
                  <AccordionTrigger className="text-left">
                    How do I cancel my subscription?
                  </AccordionTrigger>
                  <AccordionContent>
                    You can cancel your premium subscription anytime from your account settings. No cancellation fees, and you'll continue to have access to premium features until the end of your billing period.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-white/40 dark:bg-gray-800/40 backdrop-blur-xl border-2 border-gray-200/50 dark:border-gray-700/50">
              <CardHeader>
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center mb-4">
                  <MessageCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <CardTitle className="text-lg">Live Chat</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  Chat with our support team for immediate assistance.
                </p>
                <button 
                  onClick={handleStartChat}
                  className="text-green-600 dark:text-green-400 font-medium hover:underline"
                >
                  Start Chat →
                </button>
              </CardContent>
            </Card>

            <Card className="bg-white/40 dark:bg-gray-800/40 backdrop-blur-xl border-2 border-gray-200/50 dark:border-gray-700/50">
              <CardHeader>
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mb-4">
                  <Mail className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <CardTitle className="text-lg">Email Support</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  Send us an email and we'll respond within 24 hours.
                </p>
                <a href="mailto:support@nutritrack.com" className="text-green-600 dark:text-green-400 font-medium hover:underline">
                  support@nutritrack.com →
                </a>
              </CardContent>
            </Card>

            <Card className="bg-white/40 dark:bg-gray-800/40 backdrop-blur-xl border-2 border-gray-200/50 dark:border-gray-700/50">
              <CardHeader>
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center mb-4">
                  <HelpCircle className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
                <CardTitle className="text-lg">Help Center</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  Browse our comprehensive guides and tutorials.
                </p>
                <button 
                  onClick={handleVisitHelpCenter}
                  className="text-green-600 dark:text-green-400 font-medium hover:underline"
                >
                  Visit Help Center →
                </button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

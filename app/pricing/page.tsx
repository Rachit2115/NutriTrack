"use client"

import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { BackButton } from "@/components/back-button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Star, Users, Zap, Shield, Headphones } from "lucide-react"

export default function PricingPage() {
  const plans = [
    {
      name: "Free",
      price: "$0",
      description: "Perfect for getting started",
      features: [
        "Track unlimited meals",
        "Basic calorie tracking",
        "Macro nutrient tracking",
        "Access to food database",
        "Basic progress reports",
        "Mobile app access"
      ],
      notIncluded: [
        "Advanced analytics",
        "Custom meal plans",
        "Priority support",
        "API access"
      ],
      popular: false,
      buttonText: "Get Started",
      buttonVariant: "outline"
    },
    {
      name: "Premium",
      price: "$9.99",
      period: "/month",
      description: "Most popular for serious trackers",
      features: [
        "Everything in Free",
        "Advanced analytics & insights",
        "Custom meal plans",
        "Recipe builder",
        "Barcode scanner",
        "Integrations with fitness apps",
        "Priority email support",
        "Export data"
      ],
      notIncluded: [
        "API access",
        "Dedicated support"
      ],
      popular: true,
      buttonText: "Start Free Trial",
      buttonVariant: "default"
    },
    {
      name: "Pro",
      price: "$19.99",
      period: "/month",
      description: "For professionals and power users",
      features: [
        "Everything in Premium",
        "API access",
        "Advanced reporting",
        "Custom branding",
        "Dedicated support",
        "Team collaboration",
        "Bulk food entry",
        "Advanced meal planning"
      ],
      notIncluded: [],
      popular: false,
      buttonText: "Contact Sales",
      buttonVariant: "outline"
    }
  ]

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      <main className="flex-1">
        {/* Back Button in top-left */}
        <div className="px-4 sm:px-6 lg:px-8 pt-8">
          <div className="max-w-7xl mx-auto">
            <BackButton 
              fallbackUrl="/home"
              className="text-gray-600 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400"
            />
          </div>
        </div>
        
        {/* Hero Section */}
        <section className="relative py-12 px-4 sm:px-6 lg:px-8 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-green-50 via-white to-emerald-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900"></div>
          <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-br from-green-300/20 to-emerald-500/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-br from-emerald-300/20 to-teal-500/20 rounded-full blur-3xl"></div>
          
          <div className="relative z-10 max-w-7xl mx-auto text-center">
            <h1 className="text-5xl sm:text-6xl font-bold text-gray-900 dark:text-white mb-6">
              Simple, Transparent Pricing
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-8">
              Choose the plan that works best for you. Start free and upgrade anytime.
            </p>
            <div className="flex items-center justify-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <span>14-day free trial on Premium</span>
              <CheckCircle className="h-5 w-5 text-green-500" />
              <span>Cancel anytime</span>
              <CheckCircle className="h-5 w-5 text-green-500" />
              <span>No hidden fees</span>
            </div>
          </div>
        </section>

        {/* Pricing Cards */}
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {plans.map((plan, index) => (
                <Card 
                  key={index} 
                  className={`relative bg-white/40 dark:bg-gray-800/40 backdrop-blur-xl border-2 ${
                    plan.popular 
                      ? 'border-green-400 dark:border-green-600 scale-105 shadow-2xl' 
                      : 'border-gray-200/50 dark:border-gray-700/50'
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <Badge className="bg-green-600 text-white px-4 py-1 text-sm font-medium">
                        Most Popular
                      </Badge>
                    </div>
                  )}
                  
                  <CardHeader className="text-center pb-4">
                    <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
                      {plan.name}
                    </CardTitle>
                    <p className="text-gray-600 dark:text-gray-300">
                      {plan.description}
                    </p>
                    <div className="mt-4">
                      <span className="text-4xl font-bold text-gray-900 dark:text-white">
                        {plan.price}
                      </span>
                      {plan.period && (
                        <span className="text-gray-600 dark:text-gray-300">
                          {plan.period}
                        </span>
                      )}
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      {plan.features.map((feature, featureIndex) => (
                        <div key={featureIndex} className="flex items-center space-x-3">
                          <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                          <span className="text-gray-700 dark:text-gray-300 text-sm">
                            {feature}
                          </span>
                        </div>
                      ))}
                    </div>
                    
                    {plan.notIncluded.length > 0 && (
                      <div className="space-y-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                        {plan.notIncluded.map((feature, featureIndex) => (
                          <div key={featureIndex} className="flex items-center space-x-3 opacity-50">
                            <div className="h-5 w-5 rounded-full border-2 border-gray-300 flex-shrink-0"></div>
                            <span className="text-gray-500 dark:text-gray-400 text-sm">
                              {feature}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                    
                    <Button 
                      className={`w-full mt-6 ${
                        plan.popular 
                          ? 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white' 
                          : 'border-2 border-green-400 text-green-700 hover:bg-green-50 dark:text-green-400 dark:border-green-600'
                      }`}
                      variant={plan.buttonVariant as any}
                    >
                      {plan.buttonText}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Features Comparison */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-800/50">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                Compare Features
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300">
                See exactly what's included in each plan
              </p>
            </div>

            <div className="bg-white/40 dark:bg-gray-800/40 backdrop-blur-xl border-2 border-gray-200/50 dark:border-gray-700/50 rounded-xl overflow-hidden">
              <div className="grid grid-cols-4 gap-4 p-6 border-b border-gray-200 dark:border-gray-700">
                <div className="font-semibold text-gray-900 dark:text-white">Feature</div>
                <div className="text-center font-semibold text-gray-900 dark:text-white">Free</div>
                <div className="text-center font-semibold text-gray-900 dark:text-white">Premium</div>
                <div className="text-center font-semibold text-gray-900 dark:text-white">Pro</div>
              </div>
              
              {[
                { feature: "Meal Tracking", free: true, premium: true, pro: true },
                { feature: "Calorie Counting", free: true, premium: true, pro: true },
                { feature: "Macro Tracking", free: true, premium: true, pro: true },
                { feature: "Food Database", free: "1M+ items", premium: "1M+ items", pro: "1M+ items" },
                { feature: "Basic Reports", free: true, premium: true, pro: true },
                { feature: "Advanced Analytics", free: false, premium: true, pro: true },
                { feature: "Custom Meal Plans", free: false, premium: true, pro: true },
                { feature: "Barcode Scanner", free: false, premium: true, pro: true },
                { feature: "Fitness App Integrations", free: false, premium: true, pro: true },
                { feature: "Priority Support", free: false, premium: true, pro: true },
                { feature: "API Access", free: false, premium: false, pro: true },
                { feature: "Dedicated Support", free: false, premium: false, pro: true }
              ].map((item, index) => (
                <div key={index} className="grid grid-cols-4 gap-4 p-6 border-b border-gray-200 dark:border-gray-700 last:border-b-0">
                  <div className="font-medium text-gray-900 dark:text-white">{item.feature}</div>
                  <div className="text-center">
                    {item.free === true && <CheckCircle className="h-5 w-5 text-green-500 mx-auto" />}
                    {item.free === false && <div className="h-5 w-5 rounded-full border-2 border-gray-300 mx-auto"></div>}
                    {typeof item.free === 'string' && <span className="text-gray-600 dark:text-gray-300">{item.free}</span>}
                  </div>
                  <div className="text-center">
                    {item.premium === true && <CheckCircle className="h-5 w-5 text-green-500 mx-auto" />}
                    {item.premium === false && <div className="h-5 w-5 rounded-full border-2 border-gray-300 mx-auto"></div>}
                    {typeof item.premium === 'string' && <span className="text-gray-600 dark:text-gray-300">{item.premium}</span>}
                  </div>
                  <div className="text-center">
                    {item.pro === true && <CheckCircle className="h-5 w-5 text-green-500 mx-auto" />}
                    {item.pro === false && <div className="h-5 w-5 rounded-full border-2 border-gray-300 mx-auto"></div>}
                    {typeof item.pro === 'string' && <span className="text-gray-600 dark:text-gray-300">{item.pro}</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                What Our Users Say
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300">
                Join thousands of satisfied users
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  name: "Sarah M.",
                  plan: "Premium",
                  content: "NutriTrack has completely transformed how I approach my nutrition. The insights are invaluable!",
                  rating: 5
                },
                {
                  name: "Mike R.",
                  plan: "Free",
                  content: "Started with the free plan and it's already helped me lose 15 pounds. Amazing app!",
                  rating: 5
                },
                {
                  name: "Emily L.",
                  plan: "Pro",
                  content: "The API access and advanced features are perfect for my fitness coaching business.",
                  rating: 5
                }
              ].map((testimonial, index) => (
                <Card key={index} className="bg-white/40 dark:bg-gray-800/40 backdrop-blur-xl border-2 border-gray-200/50 dark:border-gray-700/50">
                  <CardContent className="p-6">
                    <div className="flex items-center mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                      ))}
                    </div>
                    <p className="text-gray-700 dark:text-gray-300 mb-4">
                      "{testimonial.content}"
                    </p>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-white">{testimonial.name}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{testimonial.plan} Plan</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-green-600 to-emerald-600">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold text-white mb-4">
              Ready to Get Started?
            </h2>
            <p className="text-xl text-green-100 mb-8">
              Join millions of users on their health journey
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="lg" variant="secondary" className="bg-white text-green-700 hover:bg-green-50">
                Start Free Trial
              </Button>
              <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white/20">
                Compare Plans
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

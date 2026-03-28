"use client"

import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { BackButton } from "@/components/back-button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Users, Target, Heart, Shield, Globe, Award, ArrowRight, CheckCircle } from "lucide-react"

export default function AboutPage() {
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
              About NutriTrack
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-8">
              We're on a mission to make healthy living accessible to everyone through intelligent nutrition tracking and personalized insights.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="lg" className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700">
                Start Your Journey
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button variant="outline" size="lg" className="border-2 border-green-400 text-green-700 hover:bg-green-50 dark:text-green-400 dark:border-green-600">
                Learn More
              </Button>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-800/50">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-4xl font-bold text-green-600 dark:text-green-400 mb-2">2M+</div>
                <div className="text-gray-600 dark:text-gray-300">Active Users</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-green-600 dark:text-green-400 mb-2">50M+</div>
                <div className="text-gray-600 dark:text-gray-300">Meals Tracked</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-green-600 dark:text-green-400 mb-2">1M+</div>
                <div className="text-gray-600 dark:text-gray-300">Food Database</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-green-600 dark:text-green-400 mb-2">150+</div>
                <div className="text-gray-600 dark:text-gray-300">Countries</div>
              </div>
            </div>
          </div>
        </section>

        {/* Mission Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
                  Our Mission
                </h2>
                <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
                  We believe that everyone deserves to live a healthier, happier life. Our mission is to remove the barriers between you and your health goals by providing simple, powerful tools that make nutrition tracking effortless and enjoyable.
                </p>
                <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
                  Through cutting-edge technology, personalized insights, and a supportive community, we're helping millions of people worldwide make better food choices and achieve their wellness goals.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Badge variant="secondary" className="px-4 py-2 text-sm">
                    <Heart className="w-4 h-4 mr-2" />
                    Health First
                  </Badge>
                  <Badge variant="secondary" className="px-4 py-2 text-sm">
                    <Shield className="w-4 h-4 mr-2" />
                    Privacy Focused
                  </Badge>
                  <Badge variant="secondary" className="px-4 py-2 text-sm">
                    <Globe className="w-4 h-4 mr-2" />
                    Global Impact
                  </Badge>
                </div>
              </div>
              <div className="relative">
                <div className="w-full h-96 bg-gradient-to-br from-green-400 to-emerald-600 rounded-2xl shadow-2xl"></div>
                <div className="absolute inset-4 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                  <Target className="w-24 h-24 text-white" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-800/50">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Our Values
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                The principles that guide everything we do
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <Card className="bg-white/40 dark:bg-gray-800/40 backdrop-blur-xl border-2 border-gray-200/50 dark:border-gray-700/50">
                <CardHeader>
                  <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center mb-4">
                    <Users className="h-6 w-6 text-green-600 dark:text-green-400" />
                  </div>
                  <CardTitle className="text-xl">Community Driven</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 dark:text-gray-300">
                    We build our products with and for our community. Your feedback shapes our roadmap and helps us create better tools for everyone.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-white/40 dark:bg-gray-800/40 backdrop-blur-xl border-2 border-gray-200/50 dark:border-gray-700/50">
                <CardHeader>
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mb-4">
                    <Shield className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <CardTitle className="text-xl">Trust & Security</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 dark:text-gray-300">
                    Your data is yours. We never sell it, never compromise it, and always protect it with industry-leading security measures.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-white/40 dark:bg-gray-800/40 backdrop-blur-xl border-2 border-gray-200/50 dark:border-gray-700/50">
                <CardHeader>
                  <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center mb-4">
                    <Award className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <CardTitle className="text-xl">Excellence</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 dark:text-gray-300">
                    We're committed to excellence in everything we do, from our user interface to our customer support and beyond.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Meet Our Team
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                Passionate individuals dedicated to making healthy living accessible to all
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { name: "Sarah Chen", role: "CEO & Founder", bio: "Former nutritionist turned tech entrepreneur" },
                { name: "Michael Rodriguez", role: "CTO", bio: "Building the future of health tech" },
                { name: "Emily Johnson", role: "Head of Design", bio: "Creating beautiful, intuitive experiences" }
              ].map((member, index) => (
                <Card key={index} className="bg-white/40 dark:bg-gray-800/40 backdrop-blur-xl border-2 border-gray-200/50 dark:border-gray-700/50 text-center">
                  <CardHeader>
                    <div className="w-24 h-24 bg-gradient-to-br from-green-400 to-emerald-600 rounded-full mx-auto mb-4"></div>
                    <CardTitle className="text-xl">{member.name}</CardTitle>
                    <p className="text-green-600 dark:text-green-400 font-medium">{member.role}</p>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 dark:text-gray-300">{member.bio}</p>
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
              Join Our Mission
            </h2>
            <p className="text-xl text-green-100 mb-8">
              Be part of the movement towards healthier living. Start your journey today.
            </p>
            <Button size="lg" variant="secondary" className="bg-white text-green-700 hover:bg-green-50">
              Get Started Free
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

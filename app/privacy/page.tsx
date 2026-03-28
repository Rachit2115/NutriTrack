"use client"

import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { BackButton } from "@/components/back-button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Shield, Eye, Lock, Cookie, Database, FileText, CheckCircle, AlertCircle } from "lucide-react"

export default function PrivacyPage() {
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
              Privacy Policy
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Last updated: {new Date().toLocaleDateString()}
            </p>
          </div>

          <div className="space-y-8">
            {/* Introduction */}
            <Card className="bg-white/40 dark:bg-gray-800/40 backdrop-blur-xl border-2 border-gray-200/50 dark:border-gray-700/50">
              <CardHeader>
                <CardTitle className="text-2xl text-gray-900 dark:text-white flex items-center">
                  <Shield className="h-6 w-6 mr-2 text-green-600 dark:text-green-400" />
                  Your Privacy Matters
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-700 dark:text-gray-300">
                  At NutriTrack, we take your privacy seriously. This Privacy Policy explains how we collect, use, and protect your personal information when you use our nutrition tracking service.
                </p>
                <p className="text-gray-700 dark:text-gray-300">
                  We are committed to transparency and giving you control over your data. This policy applies to all users of NutriTrack, including our website, mobile applications, and related services.
                </p>
              </CardContent>
            </Card>

            {/* Information We Collect */}
            <Card className="bg-white/40 dark:bg-gray-800/40 backdrop-blur-xl border-2 border-gray-200/50 dark:border-gray-700/50">
              <CardHeader>
                <CardTitle className="text-2xl text-gray-900 dark:text-white flex items-center">
                  <Database className="h-6 w-6 mr-2 text-blue-600 dark:text-blue-400" />
                  Information We Collect
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                    Personal Information
                  </h3>
                  <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span>Name, email address, and password for account creation</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span>Profile information including age, gender, height, weight, and activity level</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span>Health and fitness goals you set within the app</span>
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                    Nutrition Data
                  </h3>
                  <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span>Food items you log and consume</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span>Calorie and macronutrient information</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span>Meal timing and portion sizes</span>
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                    Technical Information
                  </h3>
                  <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span>Device information and app usage statistics</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span>IP address and general location information</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span>Cookies and similar tracking technologies</span>
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* How We Use Your Information */}
            <Card className="bg-white/40 dark:bg-gray-800/40 backdrop-blur-xl border-2 border-gray-200/50 dark:border-gray-700/50">
              <CardHeader>
                <CardTitle className="text-2xl text-gray-900 dark:text-white flex items-center">
                  <Eye className="h-6 w-6 mr-2 text-purple-600 dark:text-purple-400" />
                  How We Use Your Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-700 dark:text-gray-300">
                  We use your information to provide and improve our services:
                </p>
                <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span><strong>Service Delivery:</strong> To track your nutrition, provide insights, and help you achieve your health goals</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span><strong>Personalization:</strong> To customize your experience and provide relevant recommendations</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span><strong>Communication:</strong> To send important updates, tips, and support messages</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span><strong>Analytics:</strong> To understand how our service is used and improve it</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span><strong>Security:</strong> To protect against fraud and ensure service integrity</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Data Protection */}
            <Card className="bg-white/40 dark:bg-gray-800/40 backdrop-blur-xl border-2 border-gray-200/50 dark:border-gray-700/50">
              <CardHeader>
                <CardTitle className="text-2xl text-gray-900 dark:text-white flex items-center">
                  <Lock className="h-6 w-6 mr-2 text-red-600 dark:text-red-400" />
                  Data Protection & Security
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-700 dark:text-gray-300">
                  We implement industry-standard security measures to protect your data:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-start space-x-3">
                    <Shield className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">Encryption</p>
                      <p className="text-sm text-gray-600 dark:text-gray-300">All data is encrypted in transit and at rest</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Database className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">Secure Storage</p>
                      <p className="text-sm text-gray-600 dark:text-gray-300">Data stored in secure, access-controlled facilities</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Lock className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">Access Control</p>
                      <p className="text-sm text-gray-600 dark:text-gray-300">Strict access controls and authentication</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <AlertCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">Regular Audits</p>
                      <p className="text-sm text-gray-600 dark:text-gray-300">Regular security audits and updates</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Your Rights */}
            <Card className="bg-white/40 dark:bg-gray-800/40 backdrop-blur-xl border-2 border-gray-200/50 dark:border-gray-700/50">
              <CardHeader>
                <CardTitle className="text-2xl text-gray-900 dark:text-white">
                  Your Rights & Choices
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-700 dark:text-gray-300">
                  You have the following rights regarding your data:
                </p>
                <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span><strong>Access:</strong> Request a copy of your personal data</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span><strong>Correction:</strong> Update or correct inaccurate information</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span><strong>Deletion:</strong> Request deletion of your account and data</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span><strong>Portability:</strong> Export your data in a readable format</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span><strong>Opt-out:</strong> Choose not to receive marketing communications</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Third-Party Sharing */}
            <Card className="bg-white/40 dark:bg-gray-800/40 backdrop-blur-xl border-2 border-gray-200/50 dark:border-gray-700/50">
              <CardHeader>
                <CardTitle className="text-2xl text-gray-900 dark:text-white">
                  Third-Party Sharing
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start space-x-3 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">We Never Sell Your Data</p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      We do not sell, rent, or trade your personal information with third parties for marketing purposes.
                    </p>
                  </div>
                </div>
                
                <p className="text-gray-700 dark:text-gray-300">
                  We only share data in limited circumstances:
                </p>
                <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                  <li className="flex items-start">
                    <AlertCircle className="h-5 w-5 text-yellow-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>With your explicit consent (e.g., fitness app integrations)</span>
                  </li>
                  <li className="flex items-start">
                    <AlertCircle className="h-5 w-5 text-yellow-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>With service providers who help us operate our service</span>
                  </li>
                  <li className="flex items-start">
                    <AlertCircle className="h-5 w-5 text-yellow-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>When required by law or to protect our rights</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card className="bg-white/40 dark:bg-gray-800/40 backdrop-blur-xl border-2 border-gray-200/50 dark:border-gray-700/50">
              <CardHeader>
                <CardTitle className="text-2xl text-gray-900 dark:text-white">
                  Contact Us
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-700 dark:text-gray-300">
                  If you have questions about this Privacy Policy or want to exercise your rights, please contact us:
                </p>
                <div className="space-y-2 text-gray-700 dark:text-gray-300">
                  <p><strong>Email:</strong> privacy@nutritrack.com</p>
                  <p><strong>Mail:</strong> NutriTrack Privacy Team, 123 Health Street, San Francisco, CA 94102</p>
                </div>
                <Button className="bg-green-600 hover:bg-green-700 text-white">
                  Contact Privacy Team
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

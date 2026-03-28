"use client"

import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { BackButton } from "@/components/back-button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileText, CheckCircle, AlertCircle, Scale, Users, Shield } from "lucide-react"

export default function TermsPage() {
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
              Terms of Service
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
                  <FileText className="h-6 w-6 mr-2 text-green-600 dark:text-green-400" />
                  Welcome to NutriTrack
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-700 dark:text-gray-300">
                  These Terms of Service ("Terms") govern your use of NutriTrack, our nutrition tracking service, website, and mobile applications (collectively, the "Service").
                </p>
                <p className="text-gray-700 dark:text-gray-300">
                  By accessing or using our Service, you agree to be bound by these Terms. If you disagree with any part of these terms, then you may not access the Service.
                </p>
              </CardContent>
            </Card>

            {/* Service Description */}
            <Card className="bg-white/40 dark:bg-gray-800/40 backdrop-blur-xl border-2 border-gray-200/50 dark:border-gray-700/50">
              <CardHeader>
                <CardTitle className="text-2xl text-gray-900 dark:text-white">
                  Service Description
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-700 dark:text-gray-300">
                  NutriTrack provides a comprehensive nutrition tracking service that includes:
                </p>
                <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Calorie and macronutrient tracking</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Food database and meal logging</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Progress tracking and analytics</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Personalized recommendations and insights</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* User Responsibilities */}
            <Card className="bg-white/40 dark:bg-gray-800/40 backdrop-blur-xl border-2 border-gray-200/50 dark:border-gray-700/50">
              <CardHeader>
                <CardTitle className="text-2xl text-gray-900 dark:text-white flex items-center">
                  <Users className="h-6 w-6 mr-2 text-blue-600 dark:text-blue-400" />
                  User Responsibilities
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-700 dark:text-gray-300">
                  As a user of NutriTrack, you agree to:
                </p>
                <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Provide accurate and truthful information when creating your account</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Maintain the security of your account credentials</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Use the service for personal, non-commercial purposes unless explicitly authorized</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Not share your account with others</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Comply with all applicable laws and regulations</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Prohibited Activities */}
            <Card className="bg-white/40 dark:bg-gray-800/40 backdrop-blur-xl border-2 border-gray-200/50 dark:border-gray-700/50">
              <CardHeader>
                <CardTitle className="text-2xl text-gray-900 dark:text-white">
                  Prohibited Activities
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-700 dark:text-gray-300">
                  You may not use our Service to:
                </p>
                <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                  <li className="flex items-start">
                    <AlertCircle className="h-5 w-5 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Violate any laws or regulations</span>
                  </li>
                  <li className="flex items-start">
                    <AlertCircle className="h-5 w-5 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Infringe on the rights of others</span>
                  </li>
                  <li className="flex items-start">
                    <AlertCircle className="h-5 w-5 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Distribute harmful, offensive, or inappropriate content</span>
                  </li>
                  <li className="flex items-start">
                    <AlertCircle className="h-5 w-5 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Attempt to gain unauthorized access to our systems</span>
                  </li>
                  <li className="flex items-start">
                    <AlertCircle className="h-5 w-5 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Use automated tools to access the Service excessively</span>
                  </li>
                  <li className="flex items-start">
                    <AlertCircle className="h-5 w-5 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Reverse engineer or attempt to extract our source code</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Medical Disclaimer */}
            <Card className="bg-white/40 dark:bg-gray-800/40 backdrop-blur-xl border-2 border-gray-200/50 dark:border-gray-700/50">
              <CardHeader>
                <CardTitle className="text-2xl text-gray-900 dark:text-white flex items-center">
                  <Shield className="h-6 w-6 mr-2 text-yellow-600 dark:text-yellow-400" />
                  Medical Disclaimer
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                  <p className="font-semibold text-gray-900 dark:text-white mb-2">
                    Important Health Information
                  </p>
                  <p className="text-gray-700 dark:text-gray-300">
                    NutriTrack is not a medical device and should not be used as a substitute for professional medical advice, diagnosis, or treatment.
                  </p>
                </div>
                
                <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                  <li className="flex items-start">
                    <AlertCircle className="h-5 w-5 text-yellow-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Always consult with healthcare professionals before making significant dietary changes</span>
                  </li>
                  <li className="flex items-start">
                    <AlertCircle className="h-5 w-5 text-yellow-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Our recommendations are general and may not be suitable for everyone</span>
                  </li>
                  <li className="flex items-start">
                    <AlertCircle className="h-5 w-5 text-yellow-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>If you have medical conditions or concerns, seek professional medical advice</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Intellectual Property */}
            <Card className="bg-white/40 dark:bg-gray-800/40 backdrop-blur-xl border-2 border-gray-200/50 dark:border-gray-700/50">
              <CardHeader>
                <CardTitle className="text-2xl text-gray-900 dark:text-white">
                  Intellectual Property
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-700 dark:text-gray-300">
                  All content, features, and functionality of the NutriTrack Service are owned by NutriTrack Inc. and are protected by copyright, trademark, and other intellectual property laws.
                </p>
                <p className="text-gray-700 dark:text-gray-300">
                  You may not use our trademarks, logos, or other brand elements without our prior written consent.
                </p>
                <p className="text-gray-700 dark:text-gray-300">
                  You retain ownership of any personal data you provide to us, as outlined in our Privacy Policy.
                </p>
              </CardContent>
            </Card>

            {/* Payment and Subscription */}
            <Card className="bg-white/40 dark:bg-gray-800/40 backdrop-blur-xl border-2 border-gray-200/50 dark:border-gray-700/50">
              <CardHeader>
                <CardTitle className="text-2xl text-gray-900 dark:text-white">
                  Payment and Subscription
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-700 dark:text-gray-300">
                  For paid subscriptions:
                </p>
                <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Subscriptions are billed in advance on a monthly or annual basis</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>You can cancel your subscription at any time</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Refunds are handled on a case-by-case basis</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Prices are subject to change with notice</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Limitation of Liability */}
            <Card className="bg-white/40 dark:bg-gray-800/40 backdrop-blur-xl border-2 border-gray-200/50 dark:border-gray-700/50">
              <CardHeader>
                <CardTitle className="text-2xl text-gray-900 dark:text-white flex items-center">
                  <Scale className="h-6 w-6 mr-2 text-red-600 dark:text-red-400" />
                  Limitation of Liability
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-700 dark:text-gray-300">
                  To the maximum extent permitted by law, NutriTrack shall not be liable for:
                </p>
                <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                  <li className="flex items-start">
                    <AlertCircle className="h-5 w-5 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Any indirect, incidental, special, or consequential damages</span>
                  </li>
                  <li className="flex items-start">
                    <AlertCircle className="h-5 w-5 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Loss of profits, data, or business opportunities</span>
                  </li>
                  <li className="flex items-start">
                    <AlertCircle className="h-5 w-5 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Service interruptions or technical issues</span>
                  </li>
                </ul>
                
                <p className="text-gray-700 dark:text-gray-300">
                  Our total liability shall not exceed the amount you paid for the Service in the 12 months preceding the claim.
                </p>
              </CardContent>
            </Card>

            {/* Termination */}
            <Card className="bg-white/40 dark:bg-gray-800/40 backdrop-blur-xl border-2 border-gray-200/50 dark:border-gray-700/50">
              <CardHeader>
                <CardTitle className="text-2xl text-gray-900 dark:text-white">
                  Termination
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-700 dark:text-gray-300">
                  We may terminate or suspend your account immediately, without prior notice or liability, for any reason, including if you breach the Terms.
                </p>
                <p className="text-gray-700 dark:text-gray-300">
                  You may also terminate your account at any time through your account settings or by contacting our support team.
                </p>
                <p className="text-gray-700 dark:text-gray-300">
                  Upon termination, your right to use the Service will cease immediately, but these Terms shall remain in effect.
                </p>
              </CardContent>
            </Card>

            {/* Changes to Terms */}
            <Card className="bg-white/40 dark:bg-gray-800/40 backdrop-blur-xl border-2 border-gray-200/50 dark:border-gray-700/50">
              <CardHeader>
                <CardTitle className="text-2xl text-gray-900 dark:text-white">
                  Changes to Terms
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-700 dark:text-gray-300">
                  We reserve the right to modify these Terms at any time. We will notify you of any changes by:
                </p>
                <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Emailing you at the address on file</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Posting the updated Terms on our website</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>In-app notifications for significant changes</span>
                  </li>
                </ul>
                
                <p className="text-gray-700 dark:text-gray-300">
                  Your continued use of the Service after any changes constitutes acceptance of the new Terms.
                </p>
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
                  If you have questions about these Terms of Service, please contact us:
                </p>
                <div className="space-y-2 text-gray-700 dark:text-gray-300">
                  <p><strong>Email:</strong> legal@nutritrack.com</p>
                  <p><strong>Mail:</strong> NutriTrack Legal Team, 123 Health Street, San Francisco, CA 94102</p>
                </div>
                <Button className="bg-green-600 hover:bg-green-700 text-white">
                  Contact Legal Team
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

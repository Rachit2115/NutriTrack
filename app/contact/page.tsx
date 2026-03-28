"use client"

import { useState } from "react"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { BackButton } from "@/components/back-button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Mail, Phone, MapPin, Send, Clock, MessageCircle, CheckCircle, AlertCircle } from "lucide-react"
import { submitContactForm, submitContactFormSimple } from "@/lib/form-submission"

export default function ContactPage() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    subject: "",
    message: ""
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState("")

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError("")
    
    try {
      // Validate form
      if (!formData.firstName || !formData.lastName || !formData.email || !formData.subject || !formData.message) {
        setError("Please fill in all required fields.")
        setIsSubmitting(false)
        return
      }
      
      // Validate email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(formData.email)) {
        setError("Please enter a valid email address.")
        setIsSubmitting(false)
        return
      }
      
      // Try to submit form using the primary service
      const result = await submitContactForm(formData)
      
      if (result.success) {
        setIsSubmitted(true)
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          subject: "",
          message: ""
        })
        
        // Reset success message after 10 seconds
        setTimeout(() => setIsSubmitted(false), 10000)
      } else {
        // If primary service fails, try fallback
        const fallbackResult = await submitContactFormSimple(formData)
        if (fallbackResult.success) {
          setIsSubmitted(true)
          setFormData({
            firstName: "",
            lastName: "",
            email: "",
            subject: "",
            message: ""
          })
          setTimeout(() => setIsSubmitted(false), 10000)
        } else {
          setError(result.message)
        }
      }
    } catch (error) {
      console.error('Form submission error:', error)
      setError("An unexpected error occurred. Please try again or email us directly at rachit2115cool@gmail.com")
    }
    
    setIsSubmitting(false)
  }

  const handleStartChat = () => {
    // Open chat widget or redirect to chat
    alert("Live chat feature coming soon! Please email us at rachit2115cool@gmail.com for immediate assistance.")
  }

  const handleSendEmail = () => {
    // Open email client
    window.location.href = "mailto:rachit2115cool@gmail.com"
  }

  const handleCall = () => {
    // Open phone dialer
    window.location.href = "tel:XXXXXXXX89"
  }
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      <main className="flex-1 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Back Button in top-left */}
          <div className="mb-8">
            <BackButton 
              fallbackUrl="/home"
              className="text-gray-600 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400"
            />
          </div>
          
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Help Center & Support
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              We're here to help! Get in touch with our support team for any questions or assistance.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Contact Information */}
            <div className="lg:col-span-1 space-y-6">
              <Card className="bg-white/40 dark:bg-gray-800/40 backdrop-blur-xl border-2 border-gray-200/50 dark:border-gray-700/50">
                <CardHeader>
                  <CardTitle className="text-xl text-gray-900 dark:text-white">
                    Contact Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Mail className="h-5 w-5 text-green-600 dark:text-green-400" />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">Email</p>
                      <p className="text-gray-600 dark:text-gray-300">rachit2115cool@gmail.com</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <Phone className="h-5 w-5 text-green-600 dark:text-green-400" />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">Phone</p>
                      <p className="text-gray-600 dark:text-gray-300">1-800-NUTRI-TRACK</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <MapPin className="h-5 w-5 text-green-600 dark:text-green-400" />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">Office</p>
                      <p className="text-gray-600 dark:text-gray-300">Agra, Uttar Pradesh, India</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/40 dark:bg-gray-800/40 backdrop-blur-xl border-2 border-gray-200/50 dark:border-gray-700/50">
                <CardHeader>
                  <CardTitle className="text-xl text-gray-900 dark:text-white">
                    Business Hours
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Clock className="h-5 w-5 text-green-600 dark:text-green-400" />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">Monday - Friday</p>
                      <p className="text-gray-600 dark:text-gray-300">9:00 AM - 6:00 PM PST</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <Clock className="h-5 w-5 text-green-600 dark:text-green-400" />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">Saturday - Sunday</p>
                      <p className="text-gray-600 dark:text-gray-300">10:00 AM - 4:00 PM PST</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* <Card className="bg-white/40 dark:bg-gray-800/40 backdrop-blur-xl border-2 border-gray-200/50 dark:border-gray-700/50">
                <CardHeader>
                  <CardTitle className="text-xl text-gray-900 dark:text-white">
                    Live Chat
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    Get instant help from our support team via live chat.
                  </p>
                  <Button className="w-full bg-green-600 hover:bg-green-700" onClick={handleStartChat}>
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Start Chat
                  </Button>
                </CardContent>
              </Card> */}
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <Card className="bg-white/40 dark:bg-gray-800/40 backdrop-blur-xl border-2 border-gray-200/50 dark:border-gray-700/50">
                <CardHeader>
                  <CardTitle className="text-2xl text-gray-900 dark:text-white">
                    Send us a Message
                  </CardTitle>
                  <p className="text-gray-600 dark:text-gray-300">
                    Fill out the form below and we'll get back to you as soon as possible.
                  </p>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="firstName" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          First Name
                        </Label>
                        <Input
                          id="firstName"
                          name="firstName"
                          type="text"
                          value={formData.firstName}
                          onChange={handleInputChange}
                          placeholder="John"
                          className="border-2 border-gray-200 focus:border-green-500 dark:border-gray-600 dark:focus:border-green-400"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="lastName" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          Last Name
                        </Label>
                        <Input
                          id="lastName"
                          name="lastName"
                          type="text"
                          value={formData.lastName}
                          onChange={handleInputChange}
                          placeholder="Doe"
                          className="border-2 border-gray-200 focus:border-green-500 dark:border-gray-600 dark:focus:border-green-400"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Email Address
                      </Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="john.doe@example.com"
                        className="border-2 border-gray-200 focus:border-green-500 dark:border-gray-600 dark:focus:border-green-400"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="subject" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Subject
                      </Label>
                      <Input
                        id="subject"
                        name="subject"
                        type="text"
                        value={formData.subject}
                        onChange={handleInputChange}
                        placeholder="How can we help you?"
                        className="border-2 border-gray-200 focus:border-green-500 dark:border-gray-600 dark:focus:border-green-400"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Message
                      </Label>
                      <Textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        placeholder="Tell us more about your question or feedback..."
                        rows={6}
                        className="border-2 border-gray-200 focus:border-green-500 dark:border-gray-600 dark:focus:border-green-400"
                      />
                    </div>

                    <Button type="submit" size="lg" className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700" disabled={isSubmitting}>
                      {isSubmitting ? (
                        <>
                          <div className="h-4 w-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send className="h-4 w-4 mr-2" />
                          Send Message
                        </>
                      )}
                    </Button>
                  </form>
                  {isSubmitted && (
                    <div className="mt-4 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                      <div className="flex items-center text-green-600 dark:text-green-400">
                        <CheckCircle className="h-5 w-5 mr-2" />
                        <span className="font-medium">Message sent successfully!</span>
                      </div>
                      <p className="text-sm text-green-600 dark:text-green-400 mt-1">
                        We'll get back to you within 24 hours.
                      </p>
                    </div>
                  )}
                  {error && (
                    <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                      <div className="flex items-center text-red-600 dark:text-red-400">
                        <AlertCircle className="h-5 w-5 mr-2" />
                        <span className="font-medium">Error</span>
                      </div>
                      <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                        {error}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="mt-16">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                Frequently Asked Questions
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300">
                Quick answers to common questions
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                {
                  question: "How quickly will I receive a response?",
                  answer: "We typically respond to emails within 24 hours during business days. Live chat support is available instantly during business hours."
                },
                {
                  question: "Do you offer phone support?",
                  answer: "Yes, phone support is available Monday-Friday 9 AM - 6 PM PST. You can reach us at 1-800-NUTRI-TRACK."
                },
                {
                  question: "Can I request a feature or report a bug?",
                  answer: "Absolutely! We love hearing from our users. Use the contact form or email us at feedback@nutritrack.com."
                },
                {
                  question: "Do you have a mobile app?",
                  answer: "Yes! Our mobile apps are available for both iOS and Android. You can download them from the App Store or Google Play."
                }
              ].map((faq, index) => (
                <Card key={index} className="bg-white/40 dark:bg-gray-800/40 backdrop-blur-xl border-2 border-gray-200/50 dark:border-gray-700/50">
                  <CardHeader>
                    <CardTitle className="text-lg text-gray-900 dark:text-white">
                      {faq.question}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 dark:text-gray-300">
                      {faq.answer}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

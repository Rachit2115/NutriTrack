"use client"

import Link from "next/link"
import { Github, Twitter, Instagram, Mail, Heart, Apple, PlayCircle } from "lucide-react"

export function Footer() {
  const currentYear = new Date().getFullYear()

  const handleAppStoreDownload = () => {
    // Redirect to App Store (placeholder URL)
    window.open("https://apps.apple.com", "_blank")
  }

  const handleGooglePlayDownload = () => {
    // Redirect to Google Play Store (placeholder URL)
    window.open("https://play.google.com", "_blank")
  }

  return (
    <footer className="bg-white/60 dark:bg-gray-900/60 backdrop-blur-md border-t border-gray-200/50 dark:border-gray-800/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Brand */}
            <div className="col-span-1 md:col-span-1">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">NT</span>
                </div>
                <span className="text-xl font-bold text-gray-900 dark:text-white">NutriTrack</span>
              </div>
              <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                Your personal nutrition tracking companion for a healthier lifestyle. Track kcal, monitor macros, and achieve your fitness goals.
              </p>
              <div className="flex space-x-4 mt-4">
                {/* <Link href="#" className="text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition-colors">
                  <Twitter className="h-5 w-5" />
                </Link> */}
                <Link href="https://www.instagram.com/sharma_rachit2115" className="text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition-colors">
                  <Instagram className="h-5 w-5" />
                </Link>
                <Link href="https://github.com/rachit2115" className="text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition-colors">
                  <Github className="h-5 w-5" />
                </Link>
                <Link href="mailto:rachit2115cool@gmail.com" className="text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition-colors">
                  <Mail className="h-5 w-5" />
                </Link>
              </div>
            </div>

            {/* Product */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-4">
                Product
              </h3>
              <ul className="space-y-3">
                <li>
                  <Link href="/features" className="text-gray-600 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 text-sm transition-colors">
                    Features
                  </Link>
                </li>
                <li>
                  <Link href="/pricing" className="text-gray-600 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 text-sm transition-colors">
                    Pricing
                  </Link>
                </li>
              </ul>
            </div>

            {/* Company */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-4">
                Company
              </h3>
              <ul className="space-y-3">
                <li>
                  <Link href="/about" className="text-gray-600 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 text-sm transition-colors">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="/blog" className="text-gray-600 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 text-sm transition-colors">
                    Blog
                  </Link>
                </li>
                {/* <li>
                  <Link href="/careers" className="text-gray-600 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 text-sm transition-colors">
                    Careers
                  </Link>
                </li> */}
                <li>
                  <Link href="/contact" className="text-gray-600 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 text-sm transition-colors">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-4">
                Support
              </h3>
              <ul className="space-y-3">
                <li>
                  <Link href="/contact" className="text-gray-600 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 text-sm transition-colors">
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="text-gray-600 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 text-sm transition-colors">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="text-gray-600 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 text-sm transition-colors">
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Mobile App Download
          <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-800">
            <div className="flex flex-col sm:flex-row items-center justify-between">
              <div className="mb-4 sm:mb-0">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-2">
                  Get the App
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  Track your nutrition on the go
                </p>
              </div>
              <div className="flex space-x-4">
                <button 
                  onClick={handleAppStoreDownload}
                  className="flex items-center space-x-2 bg-gray-900 dark:bg-gray-700 text-white px-4 py-2 rounded-lg hover:bg-gray-800 dark:hover:bg-gray-600 transition-colors"
                >
                  <Apple className="h-5 w-5" />
                  <span className="text-sm font-medium">App Store</span>
                </button>
                <button 
                  onClick={handleGooglePlayDownload}
                  className="flex items-center space-x-2 bg-gray-900 dark:bg-gray-700 text-white px-4 py-2 rounded-lg hover:bg-gray-800 dark:hover:bg-gray-600 transition-colors"
                >
                  <PlayCircle className="h-5 w-5" />
                  <span className="text-sm font-medium">Google Play</span>
                </button>
              </div>
            </div>
          </div> */}

          {/* Copyright */}
          <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-800">
            <div className="flex flex-col sm:flex-row items-center justify-between">
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                © {currentYear} NutriTrack. All rights reserved.
              </p>
              <p className="text-gray-600 dark:text-gray-300 text-sm flex items-center">
                Made with <Heart className="h-4 w-4 mx-1 text-red-500" /> by Rachit B. Sharma for healthier living
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

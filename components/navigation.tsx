"use client"

import React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/components/auth-context"
import { useTheme } from "next-themes"
import { LogIn, LogOut, User, Menu, X, ChevronDown, Sun, Moon, LayoutDashboard } from "lucide-react"
import { useState, useEffect, useRef } from "react"
import { useProfileContext } from "@/components/profile-context"

// Helper function to safely get context
const getProfileContext = () => {
  try {
    return useProfileContext()
  } catch (error) {
    return null
  }
}

const getUserInitials = (name: string) => {
  if (!name) return 'U'
  return name
    .split(' ')
    .map(word => word.charAt(0).toUpperCase())
    .join('')
    .slice(0, 2)
}

export function Navigation() {
  const { user, signOut } = useAuth()
  const router = useRouter()
  const { theme, setTheme } = useTheme()
  const profileContext = getProfileContext()
  const { setActiveTab, currentProfile, profileAvatar } = profileContext || {}
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Force re-render when profile changes
  const [profileName, setProfileName] = useState('')
  
  useEffect(() => {
    setMounted(true)
    if (currentProfile?.name) {
      setProfileName(currentProfile.name)
    } else if (user?.user_metadata?.name) {
      setProfileName(user.user_metadata.name)
    }
  }, [currentProfile, user])

  // Listen for localStorage changes to profile
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'nutritrack-current-profile' || e.key === 'nutritrack-profiles' || e.key === 'nutritrack-avatar') {
        // Force re-render by updating profile name
        if (currentProfile?.name) {
          setProfileName(currentProfile.name)
        } else if (user?.user_metadata?.name) {
          setProfileName(user.user_metadata.name)
        }
      }
    }

    window.addEventListener('storage', handleStorageChange)
    return () => {
      window.removeEventListener('storage', handleStorageChange)
    }
  }, [currentProfile, user])

  // Also trigger re-render when profileAvatar changes
  useEffect(() => {
    // This will trigger re-render when avatar changes
    if (profileAvatar) {
      setProfileName(prev => prev || user?.user_metadata?.name || 'User')
    }
  }, [profileAvatar, user?.user_metadata?.name])

  useEffect(() => {
    // Update background image based on theme
    const body = document.body
    if (theme === 'dark') {
      body.style.backgroundImage = "url('/dark_bg1.png')"
      body.style.backgroundSize = "cover"
      body.style.backgroundPosition = "center"
      body.style.backgroundAttachment = "fixed"
    } else {
      body.style.backgroundImage = "url('/bright_bg.png')"
      body.style.backgroundSize = "cover"
      body.style.backgroundPosition = "center"
      body.style.backgroundAttachment = "fixed"
    }
  }, [theme])

  const handleNavClick = (tab: string) => {
    setActiveTab?.(tab)
  }

  const handleSignOut = async () => {
    try {
      console.log('🔐 Navigation: Starting sign out...')
      
      // Close dropdown first
      setIsProfileDropdownOpen(false)
      
      // Call signOut with timeout to prevent hanging
      const signOutPromise = signOut()
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('SignOut timeout')), 3000)
      )
      
      try {
        const result = await Promise.race([signOutPromise, timeoutPromise])
        console.log('🔐 Navigation: Sign out result:', result)
      } catch (timeoutError) {
        console.warn('🔐 Navigation: SignOut timed out, proceeding with redirect')
      }
      
      // Always redirect to / after sign out (landing page)
      console.log('🔐 Navigation: Redirecting to /')
      window.location.href = '/'
    } catch (error) {
      console.error('🔐 Navigation: Sign out error:', error)
      // Even on error, redirect to landing page
      setIsProfileDropdownOpen(false)
      window.location.href = '/'
    }
  }

  const getDisplayName = () => {
    if (profileName) return profileName
    return user?.user_metadata?.name || 'User'
  }

  if (!mounted) {
    return (
      <nav className="bg-white/60 dark:bg-gray-900/60 backdrop-blur-md border-b border-gray-200/50 dark:border-gray-800/50 sticky top-0 z-50 rounded-t-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">NT</span>
              </div>
              <span className="text-xl font-bold text-gray-900 dark:text-white">NutriTrack</span>
            </Link>

            {/* Placeholder for auth buttons to maintain layout */}
            <div className="hidden md:flex items-center space-x-4">
              <div className="w-20 h-10"></div>
              <div className="w-20 h-10"></div>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <div className="w-10 h-10"></div>
            </div>
          </div>
        </div>
      </nav>
    )
  }

  return (
    <nav className="bg-white/60 dark:bg-gray-900/60 backdrop-blur-md border-b border-gray-200/50 dark:border-gray-800/50 sticky top-0 z-50 rounded-t-2xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">NT</span>
            </div>
            <span className="text-xl font-bold text-gray-900 dark:text-white">NutriTrack</span>
          </Link>

          {/* Desktop Navigation */}
          {user && (
            <div className="hidden md:flex items-center space-x-8">
              {/* <button 
                onClick={() => handleNavClick('dashboard')}
                className="text-gray-700 dark:text-gray-200 hover:text-green-600 dark:hover:text-green-400 font-medium transition-colors"
              >
                Dashboard
              </button>
              <button 
                onClick={() => handleNavClick('profile')}
                className="text-gray-700 dark:text-gray-200 hover:text-green-600 dark:hover:text-green-400 font-medium transition-colors"
              >
                Profile
              </button>
              <button 
                onClick={() => handleNavClick('meal-planner')}
                className="text-gray-700 dark:text-gray-200 hover:text-green-600 dark:hover:text-green-400 font-medium transition-colors"
              >
                Meal Planner
              </button>
              <button 
                onClick={() => handleNavClick('food-tracker')}
                className="text-gray-700 dark:text-gray-200 hover:text-green-600 dark:hover:text-green-400 font-medium transition-colors"
              >
                Food Tracker
              </button>
              <button 
                onClick={() => handleNavClick('health-tips')}
                className="text-gray-700 dark:text-gray-200 hover:text-green-600 dark:hover:text-green-400 font-medium transition-colors"
              >
                Health Tips
              </button> */}
            </div>
          )}

          {/* User Actions */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-4">
                {/* Theme Toggle */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                  className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
                  aria-label="Toggle theme"
                >
                  {theme === 'dark' ? (
                    <Sun className="h-5 w-5 text-yellow-500" />
                  ) : (
                    <Moon className="h-5 w-5 text-gray-700" />
                  )}
                </Button>
                
                {/* Profile Dropdown */}
                <div className="relative" ref={dropdownRef}>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                    className="flex items-center space-x-2 p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
                  >
                    <div className="w-8 h-8 rounded-full flex items-center justify-center overflow-hidden">
                      {profileAvatar ? (
                        <img 
                          src={profileAvatar} 
                          alt="Profile" 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                          <span className="text-xs font-medium text-green-600 dark:text-green-400">
                            {getUserInitials(getDisplayName())}
                          </span>
                        </div>
                      )}
                    </div>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
                      {getDisplayName()}
                    </span>
                    <ChevronDown className="h-4 w-4 text-gray-500" />
                  </Button>
                  
                  {isProfileDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-50">
                      <button 
                        onClick={() => {
                          router.push('/home')
                          setIsProfileDropdownOpen(false)
                        }}
                        className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer w-full text-left"
                      >
                        <LayoutDashboard className="h-4 w-4 mr-2" />
                        Dashboard
                      </button>
                      <button 
                        onClick={() => {
                          handleNavClick('profile')
                          setIsProfileDropdownOpen(false)
                        }}
                        className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer w-full text-left"
                      >
                        <User className="h-4 w-4 mr-2" />
                        Profile
                      </button>
                      <hr className="my-1 border-gray-200 dark:border-gray-700" />
                      <div 
                        className="flex items-center px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                        onClick={() => {
                          handleSignOut()
                          setIsProfileDropdownOpen(false)
                        }}
                      >
                        <LogOut className="h-4 w-4 mr-2" />
                        Sign Out
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="hidden sm:flex items-center space-x-3">
                {/* Theme Toggle */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                  className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
                  aria-label="Toggle theme"
                >
                  {theme === 'dark' ? (
                    <Sun className="h-5 w-5 text-yellow-500" />
                  ) : (
                    <Moon className="h-5 w-5 text-gray-700" />
                  )}
                </Button>
                
                <Link href="/signin">
                  <Button variant="outline" size="sm" className="border-green-600 text-green-600 hover:bg-green-50 dark:border-green-400 dark:text-green-400 dark:hover:bg-green-900/20">
                    Sign In
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white">
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6 text-gray-700 dark:text-gray-200" />
              ) : (
                <Menu className="h-6 w-6 text-gray-700 dark:text-gray-200" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 dark:border-gray-800">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {/* Theme Toggle - Mobile */}
              <button
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="flex items-center justify-center space-x-2 px-3 py-2 rounded-md text-gray-700 dark:text-gray-200 hover:text-green-600 dark:hover:text-green-400 hover:bg-gray-50 dark:hover:bg-gray-800 font-medium w-full text-left"
              >
                {theme === 'dark' ? (
                  <Sun className="h-5 w-5 text-yellow-500" />
                ) : (
                  <Moon className="h-5 w-5 text-gray-700" />
                )}
                <span className="sm:hidden">Theme</span>
              </button>
              
              {user ? (
                <React.Fragment>
                  <button 
                    onClick={() => {
                      handleNavClick('dashboard')
                      setIsMobileMenuOpen(false)
                    }}
                    className="block w-full text-left px-3 py-2 rounded-md text-gray-700 dark:text-gray-200 hover:text-green-600 dark:hover:text-green-400 hover:bg-gray-50 dark:hover:bg-gray-800 font-medium"
                  >
                    Dashboard
                  </button>
                  <button 
                    onClick={() => {
                      handleNavClick('profile')
                      setIsMobileMenuOpen(false)
                    }}
                    className="block w-full text-left px-3 py-2 rounded-md text-gray-700 dark:text-gray-200 hover:text-green-600 dark:hover:text-green-400 hover:bg-gray-50 dark:hover:bg-gray-800 font-medium"
                  >
                    Profile
                  </button>
                  <button 
                    onClick={() => {
                      handleNavClick('meal-planner')
                      setIsMobileMenuOpen(false)
                    }}
                    className="block w-full text-left px-3 py-2 rounded-md text-gray-700 dark:text-gray-200 hover:text-green-600 dark:hover:text-green-400 hover:bg-gray-50 dark:hover:bg-gray-800 font-medium"
                  >
                    Meal Planner
                  </button>
                  <button
                    onClick={() => {
                      handleNavClick('food-tracker')
                      setIsMobileMenuOpen(false)
                    }}
                    className="block w-full text-left px-3 py-2 rounded-md text-gray-700 dark:text-gray-200 hover:text-green-600 dark:hover:text-green-400 hover:bg-gray-50 dark:hover:bg-gray-800 font-medium"
                  >
                    Food Tracker
                  </button>
                  <button
                    onClick={() => {
                      handleNavClick('health-tips')
                      setIsMobileMenuOpen(false)
                    }}
                    className="block w-full text-left px-3 py-2 rounded-md text-gray-700 dark:text-gray-200 hover:text-green-600 dark:hover:text-green-400 hover:bg-gray-50 dark:hover:bg-gray-800 font-medium"
                  >
                    Health Tips
                  </button>
                  
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2 px-3 py-2">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center overflow-hidden">
                        {profileAvatar ? (
                          <img 
                            src={profileAvatar} 
                            alt="Profile" 
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                            <span className="text-xs font-medium text-green-600 dark:text-green-400">
                              {getUserInitials(getDisplayName())}
                            </span>
                          </div>
                        )}
                      </div>
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
                        {getDisplayName()}
                      </span>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleSignOut}
                      className="w-full border-red-200 text-red-600 hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-900/20"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Sign Out
                    </Button>
                  </div>
                </React.Fragment>
              ) : (
                <div className="flex gap-2 mt-2">
                  <Link href="/signin" className="flex-1">
                    <Button variant="outline" size="sm" className="w-full border-green-600 text-green-600 hover:bg-green-50 dark:border-green-400 dark:text-green-400 dark:hover:bg-green-900/20 text-sm">
                      Sign In
                    </Button>
                  </Link>
                  <Link href="/signup" className="flex-1">
                    <Button size="sm" className="w-full bg-green-600 hover:bg-green-700 text-white text-sm">
                      Sign Up
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

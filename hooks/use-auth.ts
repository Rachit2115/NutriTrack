"use client"

import React, { createContext, useContext, useEffect, useState, ReactNode } from "react"

interface User {
  id: string
  email: string
  name: string
}

interface AuthContextType {
  user: User | null
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string, name: string) => Promise<void>
  signOut: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check for existing session on mount
    const savedUser = localStorage.getItem("nutritrack-user")
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
    setIsLoading(false)
  }, [])

  const signIn = async (email: string, password: string) => {
    setIsLoading(true)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Simple validation for demo
    if (email && password.length >= 6) {
      const userData: User = {
        id: Date.now().toString(),
        email,
        name: email.split("@")[0] // Use email prefix as name for demo
      }
      
      localStorage.setItem("nutritrack-user", JSON.stringify(userData))
      setUser(userData)
      
      // Create or update profile with user's name
      if (typeof window !== "undefined") {
        const profilesKey = "nutritrack-profiles"
        const currentProfileKey = "nutritrack-current-profile"
        
        try {
          let profiles = JSON.parse(localStorage.getItem(profilesKey) || "[]")
          
          // Check if profile already exists for this user
          let existingProfile = profiles.find((p: any) => p.id === userData.id)
          
          if (existingProfile) {
            // Update existing profile name
            existingProfile.name = userData.name
          } else {
            // Create new profile with user's name
            const newProfile = {
              id: userData.id,
              name: userData.name,
              age: 25,
              weight: 70,
              height: 170,
              gender: "male" as const,
              activityLevel: "moderate",
              dietaryPreference: "standard",
              goal: "maintenance",
              createdAt: new Date().toISOString()
            }
            profiles.push(newProfile)
            localStorage.setItem(currentProfileKey, newProfile.id)
          }
          
          localStorage.setItem(profilesKey, JSON.stringify(profiles))
        } catch (error) {
          console.error("Error updating profile:", error)
        }
      }
    } else {
      throw new Error("Invalid credentials")
    }
    
    setIsLoading(false)
  }

  const signUp = async (email: string, password: string, name: string) => {
    setIsLoading(true)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    const userData: User = {
      id: Date.now().toString(),
      email,
      name
    }
    
    localStorage.setItem("nutritrack-user", JSON.stringify(userData))
    setUser(userData)
    
    // Create profile with user's name
    if (typeof window !== "undefined") {
      const profilesKey = "nutritrack-profiles"
      const currentProfileKey = "nutritrack-current-profile"
      
      try {
        let profiles = JSON.parse(localStorage.getItem(profilesKey) || "[]")
        
        // Create new profile with user's name
        const newProfile = {
          id: userData.id,
          name: userData.name,
          age: 25,
          weight: 70,
          height: 170,
          gender: "male" as const,
          activityLevel: "moderate",
          dietaryPreference: "standard",
          goal: "maintenance",
          createdAt: new Date().toISOString()
        }
        
        profiles.push(newProfile)
        localStorage.setItem(profilesKey, JSON.stringify(profiles))
        localStorage.setItem(currentProfileKey, newProfile.id)
      } catch (error) {
        console.error("Error creating profile:", error)
      }
    }
    
    setIsLoading(false)
  }

  const signOut = () => {
    localStorage.removeItem("nutritrack-user")
    // Don't remove profiles data as it might be needed for future sign-ins
    // Just clear the current profile selection
    localStorage.removeItem("nutritrack-current-profile")
    setUser(null)
  }

  return React.createElement(
    AuthContext.Provider,
    { value: { user, signIn, signUp, signOut, isLoading } },
    children
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

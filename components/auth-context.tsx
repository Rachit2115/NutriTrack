"use client"

import { createContext, useContext, useEffect, useState } from 'react'
import { User, Session, AuthError } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'

interface AuthContextType {
  user: User | null
  session: Session | null
  loading: boolean
  signUp: (email: string, password: string, name: string) => Promise<{ error: AuthError | null }>
  signIn: (email: string, password: string) => Promise<{ error: AuthError | null }>
  signInWithGoogle: () => Promise<{ error: AuthError | null }>
  signOut: () => Promise<{ error: AuthError | null }>
  resetPassword: (email: string) => Promise<{ error: AuthError | null }>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    console.log('🔐 AuthProvider: Initializing auth...')
    
    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession()
        console.log('🔐 AuthProvider: Initial session check:', { session: !!session, error })
        
        if (session) {
          setUser(session.user)
          setSession(session)
        }
      } catch (error) {
        console.error('🔐 AuthProvider: Error getting initial session:', error)
      } finally {
        setLoading(false)
      }
    }

    getInitialSession()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('🔐 AuthProvider: Auth state changed:', { event, session: !!session })
        
        if (session) {
          setUser(session.user)
          setSession(session)
        } else {
          setUser(null)
          setSession(null)
        }
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const signUp = async (email: string, password: string, name: string) => {
    try {
      // Validate inputs
      if (!email || !password || !name) {
        return { error: { message: 'All fields are required' } as AuthError }
      }
      
      if (password.length < 6) {
        return { error: { message: 'Password must be at least 6 characters long' } as AuthError }
      }
      
      if (!email.includes('@') || !email.includes('.')) {
        return { error: { message: 'Please enter a valid email address' } as AuthError }
      }

      console.log('🔐 Attempting signup for email:', email.toLowerCase().trim())

      const { data, error } = await supabase.auth.signUp({
        email: email.toLowerCase().trim(),
        password,
        options: {
          data: {
            name: name.trim(),
          },
        },
      })
      
      if (error) {
        console.error('🔐 Signup error details:', error)
        console.error('🔐 Signup error message:', error.message)
        console.error('🔐 Signup error status:', error.status)
        
        // Check for rate limit error
        if (error.message.includes('rate limit') || error.message.includes('rate_limit')) {
          return { error: { message: 'Too many signup attempts. Please wait a few minutes before trying again.' } as AuthError }
        }
        
        // Check for specific error messages indicating email exists
        const errorMsg = error.message.toLowerCase()
        if (errorMsg.includes('user already registered') || 
            errorMsg.includes('already exists') ||
            errorMsg.includes('duplicate') ||
            errorMsg.includes('taken') ||
            errorMsg.includes('email address is already')) {
          return { error: { message: 'Email already registered. Please use a different email or sign in.' } as AuthError }
        }
        return { error }
      }

      // Check if user already existed (not a new signup)
      // If identities array is empty or null, user already existed
      if (data.user && (!data.user.identities || data.user.identities.length === 0)) {
        console.log('🔐 User already exists (not a new signup)')
        return { error: { message: 'Email already registered. Please use a different email or sign in.' } as AuthError }
      }

      console.log('🔐 Signup successful, new user:', data.user?.id)

      // Auto sign in after successful signup
      if (data.user) {
        console.log('🔐 Auto signing in after signup...')
        
        // Try to sign in immediately (might fail if email confirmation required)
        const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
          email: email.toLowerCase().trim(),
          password,
        })
        
        if (signInError) {
          console.warn('🔐 Auto signin failed:', signInError.message)
          
          // If email confirmation is required, treat as success but notify user
          if (signInError.message.includes('Email not confirmed') || signInError.message.includes('not confirmed')) {
            console.log('🔐 Email confirmation required')
            // Return success but with message about email confirmation
            return { 
              error: null,
              message: 'Account created successfully! Please check your email to confirm your account before signing in.' 
            }
          }
          
          // Other auto-login failures - still return success since account was created
          console.log('🔐 Account created but auto-login skipped')
          return { error: null }
        } else if (signInData.session) {
          console.log('🔐 Auto signin successful, session created')
          // Update local state
          setUser(signInData.user)
          setSession(signInData.session)
          
          // Create profile AFTER successful signin (user has proper auth now)
          try {
            console.log('🔐 Checking if profile exists...')
            const { data: existingProfile, error: checkError } = await supabase
              .from('profiles')
              .select('id')
              .eq('user_id', signInData.user.id)
              .maybeSingle()
            
            if (checkError) {
              console.error('🔐 Error checking profile:', checkError)
            }
            
            if (existingProfile) {
              console.log('🔐 Profile already exists, skipping creation')
            } else {
              console.log('🔐 Creating profile for new user...')
              const { error: profileError } = await supabase
                .from('profiles')
                .insert({
                  user_id: signInData.user.id,
                  name: name.trim(),
                  age: 25,
                  weight: 70.0,
                  height: 170.0,
                  gender: 'male',
                  activity_level: 'moderate',
                  dietary_preference: 'omnivore',
                  goal: 'maintenance'
                })
              
              if (profileError) {
                console.error('🔐 Profile creation failed:', profileError)
              } else {
                console.log('🔐 Profile created successfully')
              }
            }
          } catch (profileErr) {
            console.error('🔐 Profile creation error:', profileErr)
          }
          
          console.log('🔐 Auth state updated, user can now access content')
          return { error: null }
        }
      }
      
      return { error: null }
    } catch (error) {
      console.error('Unexpected signup error:', error)
      return { error: { message: 'An unexpected error occurred during signup' } as AuthError }
    }
  }

  const signIn = async (email: string, password: string) => {
    try {
      // Validate inputs
      if (!email || !password) {
        return { error: { message: 'Email and password are required' } as AuthError }
      }
      
      if (!email.includes('@') || !email.includes('.')) {
        return { error: { message: 'Please enter a valid email address' } as AuthError }
      }

      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password,
      })
      
      if (error) {
        console.error('Signin error:', error)
        
        // Provide more user-friendly error messages
        if (error.message.includes('Invalid login credentials')) {
          return { error: { message: 'Incorrect email or password. Please try again.' } as AuthError }
        }
        if (error.message.includes('Email not confirmed')) {
          return { error: { message: 'Please check your email and confirm your account before signing in.' } as AuthError }
        }
        
        return { error }
      }
      
      return { error: null }
    } catch (error) {
      console.error('Unexpected signin error:', error)
      return { error: { message: 'An unexpected error occurred during sign in' } as AuthError }
    }
  }

  const signInWithGoogle = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      })
      return { error }
    } catch (error) {
      return { error: error as AuthError }
    }
  }

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      return { error }
    } catch (error) {
      return { error: error as AuthError }
    }
  }

  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      })
      return { error }
    } catch (error) {
      return { error: error as AuthError }
    }
  }

  const value = {
    user,
    session,
    loading,
    signUp,
    signIn,
    signInWithGoogle,
    signOut,
    resetPassword,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

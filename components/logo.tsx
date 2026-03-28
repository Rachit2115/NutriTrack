"use client"

import { Apple } from "lucide-react"

export function NutriTrackLogo() {
  return (
    <div className="flex items-center gap-2 animate-fade-in">
      <div className="relative hover:rotate-360 transition-transform duration-600">
        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-green-400 to-emerald-600 shadow-lg">
          <Apple className="w-6 h-6 text-white" />
        </div>
        <div className="absolute -top-1 -right-1 w-3 h-3 bg-pink-500 rounded-full animate-pulse" />
      </div>
      
      <div className="flex flex-col">
        <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-green-600 via-emerald-500 to-teal-600 bg-clip-text text-transparent hover:scale-105 transition-transform duration-200">
          NutriTrack
        </h1>
        <p className="text-xs text-muted-foreground hidden md:block animate-fade-in-delay">
          Your Health Companion
        </p>
      </div>
    </div>
  )
}

export function NutriTrackIcon() {
  return (
    <div className="relative">
      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-green-400 to-emerald-600 shadow-md">
        <Apple className="w-5 h-5 text-white" />
      </div>
      <div className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-pink-500 rounded-full animate-pulse" />
    </div>
  )
}

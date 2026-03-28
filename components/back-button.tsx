"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { useEffect, useState } from "react"

interface BackButtonProps {
  fallbackUrl?: string
  className?: string
  variant?: "default" | "ghost" | "outline"
  size?: "default" | "sm" | "lg"
}

export function BackButton({ 
  fallbackUrl = "/home", 
  className = "",
  variant = "ghost",
  size = "sm"
}: BackButtonProps) {
  const router = useRouter()
  const [canGoBack, setCanGoBack] = useState(false)

  useEffect(() => {
    // Check if there's history to go back to
    setCanGoBack(window.history.length > 1)
  }, [])

  const handleGoBack = () => {
    if (canGoBack) {
      router.back()
    } else {
      router.push(fallbackUrl)
    }
  }

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleGoBack}
      className={`flex items-center space-x-2 ${className}`}
      aria-label="Go back"
    >
      <ArrowLeft className="h-4 w-4" />
      <span>Back</span>
    </Button>
  )
}

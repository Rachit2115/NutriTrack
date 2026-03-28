"use client"

import { useEffect, useState } from "react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { Moon, Sun } from "lucide-react"

export default function ThemeToggle() {
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <div className="relative">
      <Button
        variant="outline"
        size="icon"
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        className="relative overflow-hidden bg-background/40 backdrop-blur-md border-primary/20 hover:bg-primary/10 transition-all duration-300"
      >
        <Sun
          className={`h-[1.2rem] w-[1.2rem] transition-all duration-500 rotate-0 scale-100 ${theme === "dark" ? "opacity-0 -rotate-90 scale-0" : "opacity-100"}`}
        />
        <Moon
          className={`absolute h-[1.2rem] w-[1.2rem] transition-all duration-500 rotate-90 scale-0 ${theme === "dark" ? "opacity-100 rotate-0 scale-100" : "opacity-0"}`}
        />
        <span className="sr-only">Toggle theme</span>
      </Button>
    </div>
  )
}


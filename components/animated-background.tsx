"use client"

import { useEffect, useRef, useState } from "react"
import { useTheme } from "next-themes"

export function AnimatedBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { theme, systemTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Always call hooks in the same order
  const actualTheme = theme === "system" ? systemTheme : theme
  const isDarkMode = actualTheme === "dark"

  useEffect(() => {
    if (!mounted) return
    
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let width = window.innerWidth
    let height = window.innerHeight

    const resizeCanvas = () => {
      width = window.innerWidth
      height = window.innerHeight
      canvas.width = width
      canvas.height = height
    }

    window.addEventListener("resize", resizeCanvas)
    resizeCanvas()

    // Create gradient circles - moved inside useEffect to prevent hydration issues
    const circles: Circle[] = []
    const circleCount = 5

    for (let i = 0; i < circleCount; i++) {
      circles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 300 + 100,
        dx: (Math.random() - 0.5) * 0.7,
        dy: (Math.random() - 0.5) * 0.7,
        color:
          i % 2 === 0
            ? isDarkMode
              ? "rgba(124, 58, 237, 0.15)"
              : "rgba(124, 58, 237, 0.05)"
            : isDarkMode
              ? "rgba(16, 185, 129, 0.15)"
              : "rgba(16, 185, 129, 0.05)",
      })
    }

    // Animation loop
    let animationId: number
    const animate = () => {
      ctx.clearRect(0, 0, width, height)

      // Draw and update circles
      circles.forEach((circle) => {
        // Draw circle
        ctx.beginPath()
        const gradient = ctx.createRadialGradient(circle.x, circle.y, 0, circle.x, circle.y, circle.radius)
        gradient.addColorStop(0, circle.color)
        gradient.addColorStop(1, "transparent")
        ctx.fillStyle = gradient
        ctx.arc(circle.x, circle.y, circle.radius, 0, Math.PI * 2)
        ctx.fill()

        // Update position
        circle.x += circle.dx
        circle.y += circle.dy

        // Bounce off edges
        if (circle.x - circle.radius < 0 || circle.x + circle.radius > width) {
          circle.dx = -circle.dx
        }

        if (circle.y - circle.radius < 0 || circle.y + circle.radius > height) {
          circle.dy = -circle.dy
        }
      })

      animationId = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener("resize", resizeCanvas)
      cancelAnimationFrame(animationId)
    }
  }, [theme, systemTheme, isDarkMode, mounted])

  // Don't render anything until mounted to prevent hydration mismatch
  if (!mounted) {
    return null
  }

  return (
    <div className="fixed top-0 left-0 w-full h-full -z-20">
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{
          backgroundImage: isDarkMode
            ? "url(/dark_bg1.png)"
            : "url(/bright_bg.png)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundColor: "transparent",
        }}
      />
    </div>
  )
}

interface Circle {
  x: number
  y: number
  radius: number
  dx: number
  dy: number
  color: string
}

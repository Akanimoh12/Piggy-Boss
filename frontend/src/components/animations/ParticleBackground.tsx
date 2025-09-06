/**
 * ParticleBackground Component - Animated Particle Background
 * 
 * Creates an animated particle background with floating particles
 * that respond to user interaction and provide visual depth.
 */

import React, { useRef, useEffect } from 'react'

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  opacity: number
  color: string
}

const ParticleBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const particlesRef = useRef<Particle[]>([])
  const mouseRef = useRef({ x: 0, y: 0 })
  const animationRef = useRef<number>()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    // Initialize particles
    const initParticles = () => {
      const particles: Particle[] = []
      const particleCount = Math.min(150, Math.floor((canvas.width * canvas.height) / 15000))
      
      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          size: Math.random() * 3 + 1,
          opacity: Math.random() * 0.5 + 0.2,
          color: `hsl(${Math.random() * 60 + 280}, 70%, 60%)` // Purple to pink range
        })
      }
      particlesRef.current = particles
    }

    initParticles()

    // Mouse tracking
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY }
    }
    canvas.addEventListener('mousemove', handleMouseMove)

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      
      particlesRef.current.forEach((particle, index) => {
        // Update position
        particle.x += particle.vx
        particle.y += particle.vy

        // Mouse interaction
        const dx = mouseRef.current.x - particle.x
        const dy = mouseRef.current.y - particle.y
        const distance = Math.sqrt(dx * dx + dy * dy)
        
        if (distance < 100) {
          const force = (100 - distance) / 100
          particle.vx -= (dx / distance) * force * 0.02
          particle.vy -= (dy / distance) * force * 0.02
        }

        // Apply gentle gravitational pull back to center
        particle.vx += (Math.random() - 0.5) * 0.01
        particle.vy += (Math.random() - 0.5) * 0.01
        
        // Damping
        particle.vx *= 0.99
        particle.vy *= 0.99

        // Boundary check
        if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1
        if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1
        
        // Keep particles in bounds
        particle.x = Math.max(0, Math.min(canvas.width, particle.x))
        particle.y = Math.max(0, Math.min(canvas.height, particle.y))

        // Animate opacity
        particle.opacity += Math.sin(Date.now() * 0.001 + index) * 0.01

        // Draw particle
        ctx.save()
        ctx.globalAlpha = Math.max(0.1, Math.min(0.8, particle.opacity))
        ctx.fillStyle = particle.color
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
        ctx.fill()
        
        // Add glow effect
        ctx.shadowColor = particle.color
        ctx.shadowBlur = 10
        ctx.fill()
        ctx.restore()
      })

      // Draw connections between nearby particles
      ctx.strokeStyle = 'rgba(139, 92, 246, 0.1)'
      ctx.lineWidth = 1
      
      for (let i = 0; i < particlesRef.current.length; i++) {
        for (let j = i + 1; j < particlesRef.current.length; j++) {
          const p1 = particlesRef.current[i]
          const p2 = particlesRef.current[j]
          
          if (p1 && p2) {
            const dx = p1.x - p2.x
            const dy = p1.y - p2.y
            const distance = Math.sqrt(dx * dx + dy * dy)
            
            if (distance < 120) {
              ctx.globalAlpha = (120 - distance) / 120 * 0.2
              ctx.beginPath()
              ctx.moveTo(p1.x, p1.y)
              ctx.lineTo(p2.x, p2.y)
              ctx.stroke()
            }
          }
        }
      }

      animationRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener('resize', resizeCanvas)
      canvas.removeEventListener('mousemove', handleMouseMove)
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 1 }}
    />
  )
}

export default ParticleBackground

"use client"

import { useState, useEffect, useRef } from "react"
import { ChevronRight, Sparkles, Rocket } from "lucide-react"

const LearningAdventureHub = () => {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [scrollY, setScrollY] = useState(0)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number | null>(null)

  // Enhanced particle system - more prominent
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const particleCount = 60

    class Particle {
      x: number
      y: number
      size: number
      speedX: number
      speedY: number
      opacity: number
      pulse: number
      pulseSpeed: number
      color: string

      constructor() {
        this.x = Math.random() * canvas.width
        this.y = Math.random() * canvas.height
        this.size = Math.random() * 3 + 1
        this.speedX = Math.random() * 1.5 - 0.75
        this.speedY = Math.random() * 1.5 - 0.75
        this.opacity = Math.random() * 0.6 + 0.3
        this.pulse = Math.random() * Math.PI * 2
        this.pulseSpeed = Math.random() * 0.02 + 0.01
        this.color = `hsl(${200 + Math.random() * 60}, 70%, 70%)`
      }

      update() {
        this.x += this.speedX
        this.y += this.speedY
        this.pulse += this.pulseSpeed

        if (this.x > canvas.width) this.x = 0
        if (this.x < 0) this.x = canvas.width
        if (this.y > canvas.height) this.y = 0
        if (this.y < 0) this.y = canvas.height
      }

      draw() {
        if (!ctx) return
        ctx.save()
        ctx.globalAlpha = this.opacity * (0.5 + Math.sin(this.pulse) * 0.4)
        ctx.beginPath()
        const dynamicSize = Math.max(0.8, this.size + Math.sin(this.pulse) * 1)
        ctx.arc(this.x, this.y, dynamicSize, 0, Math.PI * 2)

        // Add glow effect
        ctx.shadowBlur = 15
        ctx.shadowColor = this.color
        ctx.fillStyle = this.color
        ctx.fill()

        // Add inner bright core
        ctx.shadowBlur = 0
        ctx.globalAlpha = this.opacity * 0.8
        ctx.beginPath()
        ctx.arc(this.x, this.y, dynamicSize * 0.3, 0, Math.PI * 2)
        ctx.fillStyle = "#ffffff"
        ctx.fill()

        ctx.restore()
      }
    }

    // Initialize particles
    const particleArray: Particle[] = []
    for (let i = 0; i < particleCount; i++) {
      particleArray.push(new Particle())
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Draw particles
      particleArray.forEach((particle) => {
        particle.update()
        particle.draw()
      })

      // More prominent particle connections
      for (let i = 0; i < particleArray.length; i++) {
        for (let j = i + 1; j < particleArray.length; j++) {
          const dx = particleArray[i].x - particleArray[j].x
          const dy = particleArray[i].y - particleArray[j].y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < 120) {
            ctx.save()
            const opacity = ((120 - distance) / 120) * 0.3
            ctx.globalAlpha = opacity
            ctx.strokeStyle = `hsl(${220 + Math.sin(Date.now() * 0.001) * 40}, 70%, 80%)`
            ctx.lineWidth = 1.5
            ctx.shadowBlur = 5
            ctx.shadowColor = ctx.strokeStyle
            ctx.beginPath()
            ctx.moveTo(particleArray[i].x, particleArray[i].y)
            ctx.lineTo(particleArray[j].x, particleArray[j].y)
            ctx.stroke()
            ctx.restore()
          }
        }
      }

      animationRef.current = requestAnimationFrame(animate)
    }

    animate()

    const handleResize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("resize", handleResize)
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [])

  // Optimized mouse tracking and scroll effects with throttling
  useEffect(() => {
    let ticking = false

    const handleMouseMove = (e: MouseEvent) => {
      if (!ticking) {
        requestAnimationFrame(() => {
          setMousePosition({ x: e.clientX, y: e.clientY })
          ticking = false
        })
        ticking = true
      }
    }

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          setScrollY(window.scrollY)
          ticking = false
        })
        ticking = true
      }
    }

    window.addEventListener("mousemove", handleMouseMove, { passive: true })
    window.addEventListener("scroll", handleScroll, { passive: true })

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  const testCards = [
    {
      id: "dyslexia",
      title: "Dyslexia Assessment",
      subtitle: "Ocean Depths Analysis",
      theme: "ocean",
      primary: "#0EA5E9",
      secondary: "#0284C7",
      accent: "#38BDF8",
      icon: "🌊",
      description: "Advanced reading pattern recognition through immersive oceanic environments",
      features: ["Pattern Recognition", "Visual Processing", "Reading Fluency"],
      link: "https://dsylexia-final.vercel.app/",
    },
    {
      id: "dyscalculia",
      title: "Dyscalculia Assessment",
      subtitle: "Sweet Logic Paradise",
      theme: "candy",
      primary: "#EC4899",
      secondary: "#BE185D",
      accent: "#F472B6",
      icon: "🍭",
      description: "Mathematical reasoning through gamified candy-themed challenges",
      features: ["Number Sense", "Mathematical Logic", "Spatial Reasoning"],
      link: "https://dyscalculia-screening-game.vercel.app/",
    },
    {
      id: "dysgraphia",
      title: "Dysgraphia Assessment",
      subtitle: "Cosmic Writing Mission",
      theme: "space",
      primary: "#8B5CF6",
      secondary: "#7C3AED",
      accent: "#A78BFA",
      icon: "🚀",
      description: "AI-powered handwriting analysis in a galactic setting to detect writing challenges.",
      features: ["Motor Coordination", "Writing Fluency", "Letter Shape & Stroke Detection"],
      link: "https://dysgraphia-screening-test-eci3.vercel.app/",
    },
    {
      id: "adhd",
      title: "ADHD Assessment",
      subtitle: "Attention Control Matrix",
      theme: "space",
      primary: "#F59E0B",
      secondary: "#D97706",
      accent: "#FCD34D",
      icon: "⚡",
      description: "Attention and focus measurement through dynamic space missions",
      features: ["Focus Control", "Impulse Management", "Task Switching"],
      link: "https://adhd-hosted-rwmp.vercel.app/",
    },
  ]

  return (
    <div
      className="min-h-screen bg-black relative overflow-hidden"
      style={{
        fontFamily:
          '"Inter", "SF Pro Display", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      }}
    >
      {/* Base Dark Gradient Background */}
      <div
        className="absolute inset-0 z-0"
        style={{
          background: `linear-gradient(135deg, #0c0a1e 0%, #1a1a2e 50%, #16213e 100%)`,
        }}
      />

      {/* Grid Background */}
      <div
        className="absolute inset-0 z-5"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), 
            linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
          `,
          backgroundSize: "50px 50px",
          opacity: 0.4,
        }}
      />

      {/* Enhanced Particle Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 z-10" style={{ background: "transparent" }} />

      {/* Mouse-Following Gradient - Optimized */}
      <div
        className="absolute inset-0 opacity-30 z-15"
        style={{
          background: `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(59, 130, 246, 0.2) 0%, transparent 50%)`,
          transition: "background 0.1s ease-out",
        }}
      />

      {/* Main Content */}
      <div className="relative z-20 min-h-screen">
        {/* Enhanced Hero Section - Reduced Parallax */}
        <section className="relative min-h-screen flex items-center justify-center px-6">
          <div className="max-w-6xl mx-auto text-center relative">
            {/* Title with Subtle Parallax */}
            <div className="mb-8 relative">
              <h1
                className="text-7xl md:text-9xl font-black mb-6 relative leading-none"
                style={{
                  fontFamily:
                    '"Inter", "SF Pro Display", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
                  fontWeight: 900,
                }}
              >
                <span
                  className="block bg-gradient-to-r from-white via-blue-100 to-purple-200 bg-clip-text text-transparent relative"
                  style={{
                    transform: `translateY(${scrollY * -0.05}px)`,
                    textShadow: `0 0 40px rgba(255, 255, 255, 0.1)`,
                  }}
                >
                  Neuro
                </span>
                <span
                  className="block bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent relative"
                  style={{
                    transform: `translateY(${scrollY * 0.03}px)`,
                    textShadow: `0 0 40px rgba(59, 130, 246, 0.2)`,
                  }}
                >
                  Bloom
                </span>
              </h1>

              {/* Floating Elements - Reduced Movement */}
              <div
                className="absolute text-4xl opacity-60"
                style={{
                  left: "15%",
                  top: "-10%",
                  transform: `translateY(${scrollY * -0.08}px) rotate(${scrollY * 0.02}deg)`,
                  filter: `drop-shadow(0 0 10px rgba(59, 130, 246, 0.3))`,
                }}
              >
                ✨
              </div>
            </div>

            {/* Description - Minimal Parallax */}
            <div
              className="relative mb-12"
              style={{
                transform: `translateY(${scrollY * -0.02}px)`,
              }}
            >
              <p
                className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed font-light"
                style={{
                  fontFamily:
                    '"Inter", "SF Pro Display", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
                }}
              >
                Reimagining learning disability screening tests with AI-powered, child-friendly games. Scientifically
                inspired. Emotionally aware. Designed to detect — not intimidate.
              </p>
            </div>

            {/* CTA Buttons - Minimal Parallax */}
            <div
              className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16"
              style={{
                transform: `translateY(${scrollY * -0.01}px)`,
              }}
            >
              <button
                className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl font-bold text-white text-lg overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-xl"
                style={{
                  fontFamily:
                    '"Inter", "SF Pro Display", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <span className="relative z-10 flex items-center gap-2">
                  Start Your Journey
                  <Rocket className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                </span>
              </button>

              <button
                className="group relative px-8 py-4 bg-white/5 backdrop-blur-sm border border-white/20 rounded-2xl font-semibold text-white text-lg transition-all duration-300 hover:bg-white/10 hover:scale-105"
                style={{
                  fontFamily:
                    '"Inter", "SF Pro Display", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
                }}
              >
                <span className="flex items-center gap-2">
                  Learn More
                  <Sparkles className="w-5 h-5 group-hover:rotate-180 transition-transform duration-300" />
                </span>
              </button>
            </div>

            {/* Scroll Indicator */}
            <div
              className="animate-bounce mt-16"
              style={{
                opacity: Math.max(0, 1 - scrollY * 0.01),
              }}
            >
              <div className="w-6 h-10 border-2 border-white/30 rounded-full mx-auto relative overflow-hidden">
                <div className="w-1 h-3 bg-gradient-to-b from-blue-400 to-purple-400 rounded-full mx-auto mt-2 animate-pulse" />
              </div>
              <p
                className="text-white/60 text-sm mt-2 font-medium"
                style={{
                  fontFamily:
                    '"Inter", "SF Pro Display", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
                }}
              >
                Scroll to explore
              </p>
            </div>
          </div>
        </section>

        {/* Enhanced Cards Section */}
        <section className="py-20 px-6 relative">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {testCards.map((card) => (
                <div
                  key={card.id}
                  className="group relative cursor-pointer"
                  onMouseEnter={() => setHoveredCard(card.id)}
                  onMouseLeave={() => setHoveredCard(null)}
                  onClick={() => window.open(card.link, "_blank")}
                  style={{
                    transform: `
                      translateY(${hoveredCard === card.id ? -15 : 0}px)
                      rotateX(${hoveredCard === card.id ? 5 : 0}deg)
                      rotateY(${hoveredCard === card.id ? (mousePosition.x - window.innerWidth / 2) * 0.01 : 0}deg)
                    `,
                    transition: "all 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
                    transformStyle: "preserve-3d",
                    fontFamily:
                      '"Inter", "SF Pro Display", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
                  }}
                >
                  {/* Enhanced Card Container */}
                  <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-gray-900/60 to-gray-800/40 backdrop-blur-xl border border-white/10 cursor-pointer h-96">
                    {/* Multiple Animated Background Layers */}
                    <div
                      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-1000"
                      style={{
                        background: `
                          linear-gradient(135deg, ${card.primary}30, ${card.secondary}20),
                          radial-gradient(circle at 30% 70%, ${card.accent}25, transparent 70%)
                        `,
                      }}
                    />

                    {/* Dynamic Mesh Gradient */}
                    <div
                      className="absolute inset-0 opacity-0 group-hover:opacity-60 transition-all duration-1200"
                      style={{
                        background: `conic-gradient(from ${Date.now() * 0.0001}deg at 50% 50%, 
                          ${card.primary}40, ${card.secondary}30, ${card.accent}40, ${card.primary}40)`,
                        filter: "blur(60px)",
                      }}
                    />

                    {/* Animated Light Rays */}
                    <div
                      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-1000"
                      style={{
                        background: `
                          linear-gradient(45deg, transparent 30%, ${card.primary}20 50%, transparent 70%),
                          linear-gradient(-45deg, transparent 30%, ${card.accent}15 50%, transparent 70%)
                        `,
                        transform: hoveredCard === card.id ? "translateX(100%)" : "translateX(-100%)",
                        transition: "transform 2s ease-in-out",
                      }}
                    />

                    {/* Content with Enhanced Animations */}
                    <div className="relative z-10 p-8 h-full flex flex-col justify-between">
                      {/* Header */}
                      <div>
                        <div className="flex items-center justify-between mb-6">
                          <div
                            className="text-5xl transform transition-all duration-700 group-hover:scale-125 group-hover:rotate-12"
                            style={{
                              filter:
                                hoveredCard === card.id
                                  ? `drop-shadow(0 0 30px ${card.primary}) brightness(1.3)`
                                  : "none",
                              transform:
                                hoveredCard === card.id
                                  ? `scale(1.25) rotate(12deg) translateZ(20px)`
                                  : "scale(1) rotate(0deg) translateZ(0px)",
                            }}
                          >
                            {card.icon}
                          </div>
                          <div
                            className="w-12 h-12 rounded-full flex items-center justify-center transition-all duration-700 group-hover:rotate-180 group-hover:scale-110"
                            style={{
                              backgroundColor: `${card.primary}30`,
                              boxShadow: hoveredCard === card.id ? `0 0 20px ${card.primary}50` : "none",
                            }}
                          >
                            <ChevronRight
                              className="w-6 h-6 transition-all duration-500 group-hover:translate-x-1"
                              style={{ color: card.primary }}
                            />
                          </div>
                        </div>

                        <h3
                          className="text-3xl font-bold text-white mb-2 transition-all duration-700"
                          style={{
                            transform: hoveredCard === card.id ? "translateZ(10px)" : "translateZ(0px)",
                            textShadow: hoveredCard === card.id ? `0 0 20px ${card.primary}80` : "none",
                          }}
                        >
                          {card.title}
                        </h3>
                        <p
                          className="text-lg font-medium mb-4 transition-all duration-500"
                          style={{
                            color: hoveredCard === card.id ? card.accent : "#9CA3AF",
                            transform: hoveredCard === card.id ? "translateZ(5px)" : "translateZ(0px)",
                          }}
                        >
                          {card.subtitle}
                        </p>
                        <p className="text-gray-400 text-sm leading-relaxed mb-6">{card.description}</p>
                      </div>

                      {/* Enhanced Features */}
                      <div>
                        <div className="flex flex-wrap gap-2 mb-6">
                          {card.features.map((feature, idx) => (
                            <span
                              key={idx}
                              className="px-3 py-1 rounded-full text-xs font-medium bg-white/5 text-white/70 border border-white/10 backdrop-blur-sm transition-all duration-500"
                              style={{
                                animationDelay: `${idx * 0.1}s`,
                                transform:
                                  hoveredCard === card.id
                                    ? `translateY(-3px) translateZ(5px) scale(1.05)`
                                    : "translateY(0) translateZ(0px) scale(1)",
                                borderColor: hoveredCard === card.id ? card.primary : "rgba(255,255,255,0.1)",
                                boxShadow: hoveredCard === card.id ? `0 0 10px ${card.primary}40` : "none",
                              }}
                            >
                              {feature}
                            </span>
                          ))}
                        </div>

                        {/* Enhanced Action Button */}
                        <div
                          className="flex items-center justify-center py-4 px-6 rounded-2xl border transition-all duration-700 relative overflow-hidden group/btn"
                          style={{
                            backgroundColor: hoveredCard === card.id ? card.primary : "rgba(255,255,255,0.05)",
                            borderColor: hoveredCard === card.id ? card.primary : "rgba(255,255,255,0.1)",
                            transform:
                              hoveredCard === card.id ? "scale(1.03) translateZ(10px)" : "scale(1) translateZ(0px)",
                            boxShadow: hoveredCard === card.id ? `0 10px 30px ${card.primary}40` : "none",
                          }}
                        >
                          {/* Animated Button Background */}
                          <div
                            className="absolute inset-0 bg-gradient-to-r opacity-0 group-hover/btn:opacity-100 transition-all duration-700"
                            style={{
                              background: `linear-gradient(90deg, transparent, ${card.accent}60, transparent)`,
                              transform: "translateX(-100%)",
                              animation: hoveredCard === card.id ? "slideRight 1.5s ease-in-out infinite" : "none",
                            }}
                          />

                          <span className="relative z-10 text-white font-semibold text-lg flex items-center gap-2">
                            Begin Assessment
                            <Sparkles
                              className="w-5 h-5 transition-all duration-500"
                              style={{
                                animation: hoveredCard === card.id ? "spin 2s linear infinite" : "none",
                                filter: hoveredCard === card.id ? `drop-shadow(0 0 10px ${card.accent})` : "none",
                              }}
                            />
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Enhanced Animated Border */}
                    <div
                      className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-all duration-1000 pointer-events-none"
                      style={{
                        background: `linear-gradient(90deg, transparent, ${card.primary}80, transparent)`,
                        padding: "2px",
                        WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                        WebkitMaskComposite: "xor",
                        maskComposite: "exclude",
                      }}
                    />
                  </div>

                  {/* Enhanced Multi-layer Glow Effect */}
                  <div
                    className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-40 transition-all duration-1000 blur-2xl -z-10"
                    style={{
                      background: `
                        radial-gradient(ellipse at center, ${card.primary}60 0%, ${card.secondary}40 50%, transparent 100%),
                        linear-gradient(45deg, ${card.accent}30, ${card.primary}30)
                      `,
                    }}
                  />
                  <div
                    className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-20 transition-all duration-1200 blur-3xl -z-20"
                    style={{
                      background: `radial-gradient(ellipse at center, ${card.primary} 0%, transparent 70%)`,
                      transform: "scale(1.5)",
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-16 px-6 text-center relative">
          <div className="max-w-4xl mx-auto">
            <div
              className="bg-gradient-to-r from-gray-900/60 to-gray-800/40 backdrop-blur-xl rounded-3xl p-8 border border-white/10 relative overflow-hidden"
              style={{
                fontFamily:
                  '"Inter", "SF Pro Display", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
              }}
            >
              <div className="relative z-10">
                <h3 className="text-2xl font-bold text-white mb-4 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                  Where Cognitive Science Meets Play
                </h3>
                <p className="text-gray-400 leading-relaxed">
                  Our assessments utilize cutting-edge research in neuroscience and educational psychology to provide
                  accurate, engaging diagnostic experiences. Each test is carefully designed to respect individual
                  learning differences while delivering precise insights.
                </p>
              </div>
            </div>
          </div>
        </footer>
      </div>

      {/* CSS for animations */}
      <style jsx>{`
        @keyframes slideRight {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  )
}

export default LearningAdventureHub

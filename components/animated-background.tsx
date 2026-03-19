"use client"

import { useEffect, useRef } from "react"
import { cn } from "@/lib/utils"

export default function AnimatedBackground({ className }: { className?: string }) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const wrap = wrapRef.current
    const canvas = canvasRef.current
    if (!wrap || !canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let width = 0
    let height = 0
    let rafId = 0

    const resize = () => {
      const rect = wrap.getBoundingClientRect()
      width = rect.width
      height = rect.height
      const dpr = window.devicePixelRatio || 1
      canvas.width = Math.max(1, Math.floor(width * dpr))
      canvas.height = Math.max(1, Math.floor(height * dpr))
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    resize()
    window.addEventListener("resize", resize)

    const particles = Array.from({ length: 55 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      r: Math.random() * 1.6 + 0.4,
      vx: (Math.random() - 0.5) * 0.3,
      vy: -(Math.random() * 0.5 + 0.15),
      a: Math.random() * 0.5 + 0.15,
    }))

    const nodes = Array.from({ length: 22 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.28,
      vy: (Math.random() - 0.5) * 0.18,
    }))

    const bits = Array.from({ length: 30 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      s: Math.random() * 0.6 + 0.2,
    }))

    const mouse = { x: -999, y: -999 }

    const handleMouse = (event: MouseEvent) => {
      const rect = wrap.getBoundingClientRect()
      mouse.x = event.clientX - rect.left
      mouse.y = event.clientY - rect.top
    }

    const handleLeave = () => {
      mouse.x = -999
      mouse.y = -999
    }

    window.addEventListener("mousemove", handleMouse)
    window.addEventListener("mouseleave", handleLeave)

    const loop = () => {
      const t = performance.now()
      const driftX = Math.sin(t / 5000) * 8
      const driftY = Math.cos(t / 6000) * 6

      ctx.clearRect(0, 0, width, height)
      ctx.save()
      ctx.translate(driftX, driftY)

      if (mouse.x > 0) {
        const glow = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, 100)
        glow.addColorStop(0, "rgba(232,57,42,0.08)")
        glow.addColorStop(1, "rgba(232,57,42,0)")
        ctx.fillStyle = glow
        ctx.beginPath()
        ctx.arc(mouse.x, mouse.y, 100, 0, Math.PI * 2)
        ctx.fill()
      }

      ctx.fillStyle = "rgba(232,57,42,0.08)"
      ctx.font = "10px monospace"
      bits.forEach((b) => {
        b.y += b.s + 0.15
        if (b.y > height) b.y = 0
        ctx.fillText(Math.random() > 0.5 ? "1" : "0", b.x, b.y)
      })

      particles.forEach((p) => {
        p.x += p.vx * 1.1
        p.y += p.vy * 1.05
        if (p.y < 0) p.y = height
        if (p.x < 0) p.x = width
        if (p.x > width) p.x = 0

        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(232,57,42,${p.a})`
        ctx.fill()
      })

      nodes.forEach((n) => {
        n.x += n.vx * 1.05
        n.y += n.vy * 1.05
        if (n.x < 0 || n.x > width) n.vx *= -1
        if (n.y < 0 || n.y > height) n.vy *= -1

        ctx.beginPath()
        ctx.arc(n.x, n.y, 2, 0, Math.PI * 2)
        ctx.fillStyle = "rgba(232,57,42,0.4)"
        ctx.fill()
      })

      for (let i = 0; i < nodes.length; i += 1) {
        for (let j = i + 1; j < nodes.length; j += 1) {
          const dx = nodes[i].x - nodes[j].x
          const dy = nodes[i].y - nodes[j].y
          const d = Math.sqrt(dx * dx + dy * dy)
          if (d < 140) {
            ctx.strokeStyle = `rgba(232,57,42,${1 - d / 140})`
            ctx.lineWidth = 0.5
            ctx.beginPath()
            ctx.moveTo(nodes[i].x, nodes[i].y)
            ctx.lineTo(nodes[j].x, nodes[j].y)
            ctx.stroke()
          }
        }
      }

      ctx.restore()

      rafId = window.requestAnimationFrame(loop)
    }

    loop()

    return () => {
      window.removeEventListener("resize", resize)
      window.removeEventListener("mousemove", handleMouse)
      window.removeEventListener("mouseleave", handleLeave)
      window.cancelAnimationFrame(rafId)
    }
  }, [])

  return (
    <div ref={wrapRef} className={cn("animated-bg", className)} aria-hidden="true">
      <div className="animated-bg__mesh" />
      <div className="animated-bg__glow" />
      <div className="animated-bg__grid" />
      <div className="animated-bg__scan" />
      <div className="animated-bg__noise" />
      <canvas ref={canvasRef} className="animated-bg__canvas" />
      <div className="animated-bg__orb animated-bg__orb--1" />
      <div className="animated-bg__orb animated-bg__orb--2" />
      <div className="animated-bg__orb animated-bg__orb--3" />
      <div className="animated-bg__corner animated-bg__corner--tl" />
      <div className="animated-bg__corner animated-bg__corner--br" />
      <div className="animated-bg__vignette" />
    </div>
  )
}

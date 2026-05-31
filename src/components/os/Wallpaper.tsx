'use client'

import { useEffect, useRef } from 'react'

export default function Wallpaper() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animFrame: number
    let time = 0

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    // Particle system
    const particles: Array<{
      x: number; y: number; vx: number; vy: number;
      size: number; opacity: number; color: string; life: number; maxLife: number
    }> = []

    const COLORS = ['#00f0ff', '#bd00ff', '#00ff88', '#ff00a8']

    function spawnParticle() {
      particles.push({
        x: Math.random() * canvas!.width,
        y: canvas!.height + 10,
        vx: (Math.random() - 0.5) * 0.5,
        vy: -(Math.random() * 0.8 + 0.2),
        size: Math.random() * 2 + 0.5,
        opacity: 0,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        life: 0,
        maxLife: Math.random() * 300 + 200,
      })
    }

    function draw() {
      time += 0.005
      ctx!.clearRect(0, 0, canvas!.width, canvas!.height)

      // Deep space background
      const bgGrad = ctx!.createLinearGradient(0, 0, canvas!.width, canvas!.height)
      bgGrad.addColorStop(0, '#020208')
      bgGrad.addColorStop(0.3, '#050210')
      bgGrad.addColorStop(0.6, '#020510')
      bgGrad.addColorStop(1, '#020208')
      ctx!.fillStyle = bgGrad
      ctx!.fillRect(0, 0, canvas!.width, canvas!.height)

      // Aurora blobs
      const auroraBlobs = [
        { x: canvas!.width * 0.2, y: canvas!.height * 0.4, r: canvas!.width * 0.35, c1: 'rgba(0,240,255,0.06)', c2: 'transparent' },
        { x: canvas!.width * 0.8, y: canvas!.height * 0.3, r: canvas!.width * 0.3, c1: 'rgba(189,0,255,0.05)', c2: 'transparent' },
        { x: canvas!.width * 0.5, y: canvas!.height * 0.7, r: canvas!.width * 0.25, c1: 'rgba(0,255,136,0.03)', c2: 'transparent' },
      ]

      auroraBlobs.forEach((blob, i) => {
        const px = blob.x + Math.sin(time + i * 2) * 80
        const py = blob.y + Math.cos(time * 0.7 + i) * 60
        const grad = ctx!.createRadialGradient(px, py, 0, px, py, blob.r)
        grad.addColorStop(0, blob.c1)
        grad.addColorStop(1, blob.c2)
        ctx!.fillStyle = grad
        ctx!.fillRect(0, 0, canvas!.width, canvas!.height)
      })

      // Scanline effect (subtle)
      const scanlineY = ((time * 60) % (canvas!.height + 200)) - 100
      const scanGrad = ctx!.createLinearGradient(0, scanlineY - 40, 0, scanlineY + 40)
      scanGrad.addColorStop(0, 'transparent')
      scanGrad.addColorStop(0.5, 'rgba(0, 240, 255, 0.015)')
      scanGrad.addColorStop(1, 'transparent')
      ctx!.fillStyle = scanGrad
      ctx!.fillRect(0, scanlineY - 40, canvas!.width, 80)

      // Particles
      if (Math.random() < 0.3 && particles.length < 80) spawnParticle()

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i]
        p.life++
        p.x += p.vx
        p.y += p.vy

        // Fade in/out
        if (p.life < 30) p.opacity = p.life / 30
        else if (p.life > p.maxLife - 30) p.opacity = (p.maxLife - p.life) / 30
        else p.opacity = 1

        if (p.life >= p.maxLife || p.y < -10) {
          particles.splice(i, 1)
          continue
        }

        ctx!.save()
        ctx!.globalAlpha = p.opacity * 0.6
        ctx!.beginPath()
        ctx!.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx!.fillStyle = p.color
        ctx!.shadowBlur = 6
        ctx!.shadowColor = p.color
        ctx!.fill()
        ctx!.restore()
      }

      // Grid lines (very subtle)
      ctx!.save()
      ctx!.globalAlpha = 0.015
      ctx!.strokeStyle = '#00f0ff'
      ctx!.lineWidth = 1
      const gridSize = 80
      for (let x = 0; x < canvas!.width; x += gridSize) {
        ctx!.beginPath()
        ctx!.moveTo(x, 0)
        ctx!.lineTo(x, canvas!.height)
        ctx!.stroke()
      }
      for (let y = 0; y < canvas!.height; y += gridSize) {
        ctx!.beginPath()
        ctx!.moveTo(0, y)
        ctx!.lineTo(canvas!.width, y)
        ctx!.stroke()
      }
      ctx!.restore()

      animFrame = requestAnimationFrame(draw)
    }

    draw()

    return () => {
      cancelAnimationFrame(animFrame)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'none',
      }}
      aria-hidden="true"
    />
  )
}

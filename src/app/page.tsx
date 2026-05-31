'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useRef } from 'react'

export default function LandingPage() {
  const router = useRouter()
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    let raf: number; let t = 0
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight }
    resize()
    window.addEventListener('resize', resize)
    const draw = () => {
      t += 0.004
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      const g = ctx.createLinearGradient(0, 0, canvas.width, canvas.height)
      g.addColorStop(0, '#020208'); g.addColorStop(0.5, '#050210'); g.addColorStop(1, '#020208')
      ctx.fillStyle = g; ctx.fillRect(0, 0, canvas.width, canvas.height)
      const blobs = [[0.25, 0.5, 0.3, '0,240,255'], [0.75, 0.35, 0.25, '189,0,255'], [0.5, 0.7, 0.2, '0,255,136']]
      blobs.forEach(([bx, by, br, c], i) => {
        const px = canvas.width * (bx as number) + Math.sin(t + i * 2) * 80
        const py = canvas.height * (by as number) + Math.cos(t * 0.7 + i) * 60
        const r = canvas.width * (br as number)
        const rad = ctx.createRadialGradient(px, py, 0, px, py, r)
        rad.addColorStop(0, `rgba(${c},0.07)`); rad.addColorStop(1, 'transparent')
        ctx.fillStyle = rad; ctx.fillRect(0, 0, canvas.width, canvas.height)
      })
      raf = requestAnimationFrame(draw)
    }
    draw()
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize) }
  }, [])

  const S = (o: React.CSSProperties): React.CSSProperties => o

  return (
    <div style={S({ minHeight: '100vh', overflowX: 'hidden', position: 'relative', color: 'rgba(255, 255, 255, 0.95)', fontFamily: 'Inter, sans-serif' })}>
      <canvas ref={canvasRef} style={S({ position: 'fixed', inset: 0, zIndex: 0 })} aria-hidden />

      <div style={S({ position: 'relative', zIndex: 1 })}>
        {/* Nav */}
        <nav style={S({ display: 'flex', alignItems: 'center', padding: '20px 60px', borderBottom: '1px solid rgba(255,255,255,0.05)' })}>
          <div style={S({ display: 'flex', alignItems: 'center', gap: 10, flex: 1 })}>
            <span style={S({ fontSize: 20 })}>💼</span>
            <span style={S({ fontSize: 16, fontWeight: 900, letterSpacing: '0.08em', background: 'linear-gradient(135deg, #00f0ff, #bd00ff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' })}>OFFEROS</span>
          </div>
          <div style={S({ display: 'flex', gap: 32, fontSize: 14, color: 'rgba(255,255,255,0.6)' })}>
            <a href="#features" style={{ color: 'inherit', textDecoration: 'none' }}>Features</a>
            <a href="/pricing" style={{ color: 'inherit', textDecoration: 'none' }}>Pricing</a>
            <a href="/login" style={{ color: 'inherit', textDecoration: 'none' }}>Login</a>
          </div>
          <button onClick={() => router.push('/login')} style={S({
            marginLeft: 32, padding: '9px 22px', borderRadius: 9, border: 'none', cursor: 'pointer',
            background: 'linear-gradient(135deg, #00f0ff, #bd00ff)', color: '#000', fontWeight: 700, fontSize: 13,
          })}>
            Get Started Free
          </button>
        </nav>

        {/* Hero */}
        <section style={S({ textAlign: 'center', padding: '100px 40px 80px', maxWidth: 860, margin: '0 auto' })}>
          <div style={S({ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 16px', borderRadius: 100, border: '1px solid rgba(0,240,255,0.3)', background: 'rgba(0,240,255,0.06)', fontSize: 12, color: '#00f0ff', marginBottom: 24, fontWeight: 600 })}>
            🚀 Now in Beta · Free for students
          </div>
          <h1 style={S({ fontSize: 'clamp(42px, 7vw, 80px)', fontWeight: 900, lineHeight: 1.1, letterSpacing: '-0.02em', marginBottom: 24, color: '#ffffff' })}>
            What if LeetCode,<br />
            <span style={{ background: 'linear-gradient(135deg, #00f0ff, #bd00ff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>LinkedIn, and your Calendar</span><br />
            were integrated?
          </h1>
          <p style={S({ fontSize: 18, color: 'rgba(255,255,255,0.7)', lineHeight: 1.7, maxWidth: 600, margin: '0 auto 40px' })}>
            OfferOS is the first browser-based Desktop OS for job preparation. Practice DSA, run AI mock interviews, scan your resume, and track company intel — all in one futuristic workspace.
          </p>
          <div style={S({ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' })}>
            <button onClick={() => router.push('/login')} style={S({
              padding: '14px 36px', borderRadius: 12, border: 'none', cursor: 'pointer',
              background: 'linear-gradient(135deg, #00f0ff, #bd00ff)', color: '#000', fontWeight: 800, fontSize: 16,
              boxShadow: '0 8px 32px rgba(0,240,255,0.3)',
            })} id="hero-cta">
              Enter OfferOS →
            </button>
            <button onClick={() => router.push('/login')} style={S({
              padding: '14px 36px', borderRadius: 12, cursor: 'pointer',
              border: '1px solid rgba(255,255,255,0.15)', background: 'rgba(255,255,255,0.05)',
              color: '#ffffff', fontWeight: 600, fontSize: 15,
            })}>
              👑 Judge Demo
            </button>
          </div>
        </section>

        {/* Feature cards */}
        <section id="features" style={S({ padding: '60px 60px 100px', maxWidth: 1200, margin: '0 auto' })}>
          <h2 style={S({ textAlign: 'center', fontSize: 36, fontWeight: 800, marginBottom: 48, background: 'linear-gradient(135deg, #fff, rgba(255,255,255,0.6))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' })}>
            Everything in One Workspace
          </h2>
          <div style={S({ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 })}>
            {[
              { icon: '⚡', title: 'DSA Playground', desc: 'Monaco editor (VS Code in browser). 150 problems tagged by company. GitHub-style streak heatmap.', color: '#00f0ff' },
              { icon: '🤖', title: 'AI Mock Interviews', desc: 'Voice-to-voice with Mistral AI. Behavioral, Technical & System Design modes. Real-time scoring.', color: '#bd00ff' },
              { icon: '📄', title: 'Resume Intelligence', desc: 'ATS score vs job description. "Make it senior" AI rewriter. 3 PDF templates.', color: '#00ff88' },
              { icon: '📊', title: 'Analytics Hub', desc: 'Skill radar, progress heatmap, interview trend charts. All your data in one glance.', color: '#ff6b00' },
              { icon: '🔭', title: 'Company Spyglass', desc: 'Real hiring patterns for FAANG. Recent interview questions. Difficulty analysis.', color: '#ff00a8' },
              { icon: '🗺️', title: 'AI Study Roadmap', desc: 'Spaced repetition algorithm generates your day-by-day plan based on target company + timeline.', color: '#00f0ff' },
            ].map(f => (
              <div key={f.title} style={S({
                padding: 24, borderRadius: 16,
                background: `${f.color}06`, border: `1px solid ${f.color}18`,
                transition: 'all 0.2s ease',
              })}
                onMouseEnter={e => {
                  const el = e.currentTarget as HTMLElement
                  el.style.background = `${f.color}10`
                  el.style.borderColor = `${f.color}35`
                  el.style.transform = 'translateY(-4px)'
                }}
                onMouseLeave={e => {
                  const el = e.currentTarget as HTMLElement
                  el.style.background = `${f.color}06`
                  el.style.borderColor = `${f.color}18`
                  el.style.transform = 'none'
                }}
              >
                <div style={S({ fontSize: 32, marginBottom: 12 })}>{f.icon}</div>
                <h3 style={S({ fontSize: 16, fontWeight: 700, color: '#ffffff', marginBottom: 8 })}>{f.title}</h3>
                <p style={S({ fontSize: 13, color: 'rgba(255,255,255,0.6)', lineHeight: 1.7 })}>{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section style={S({ textAlign: 'center', padding: '60px 40px 100px' })}>
          <div style={S({
            display: 'inline-block', padding: '48px 64px', borderRadius: 24,
            background: 'linear-gradient(135deg, rgba(0,240,255,0.06), rgba(189,0,255,0.06))',
            border: '1px solid rgba(0,240,255,0.15)',
          })}>
            <h2 style={S({ fontSize: 32, fontWeight: 800, marginBottom: 12 })}>Ready to land your dream offer?</h2>
            <p style={S({ color: 'rgba(255,255,255,0.6)', marginBottom: 28, fontSize: 15 })}>Join 500+ students already using OfferOS to crack FAANG interviews.</p>
            <button onClick={() => router.push('/login')} style={S({
              padding: '14px 44px', borderRadius: 12, border: 'none', cursor: 'pointer',
              background: 'linear-gradient(135deg, #00f0ff, #bd00ff)', color: '#000', fontWeight: 800, fontSize: 16,
            })}>
              Start for Free →
            </button>
          </div>
        </section>

        {/* Footer */}
        <footer style={S({ textAlign: 'center', padding: '24px', borderTop: '1px solid rgba(255,255,255,0.05)', fontSize: 12, color: 'var(--text-muted)' })}>
          © 2026 OfferOS. Built for hackers, by hackers. 🚀
        </footer>
      </div>
    </div>
  )
}

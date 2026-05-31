'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import { useWindows, WindowProvider } from '@/context/WindowContext'
import Wallpaper from '@/components/os/Wallpaper'
import WindowManager from '@/components/os/WindowManager'
import Taskbar from '@/components/os/Taskbar'
import CommandPalette from '@/components/os/CommandPalette'
import AppIcon from '@/components/os/AppIcon'
import type { WindowId } from '@/types'
import { Sparkles, Flame, Zap, X, ChevronRight, ChevronLeft, Command, CheckCircle, Terminal, HelpCircle } from 'lucide-react'

const DESKTOP_APPS: Array<{ id: WindowId; label: string; color: string; description: string }> = [
  { id: 'dsa-pad', label: 'DSA Playground', color: '#00f0ff', description: 'Monaco editor · 150 problems' },
  { id: 'interview-bot', label: 'Interview AI', color: '#bd00ff', description: 'Voice AI · 3 modes' },
  { id: 'resume-scanner', label: 'Resume Intel', color: '#00ff88', description: 'ATS scorer · Optimizer' },
  { id: 'analytics', label: 'Analytics', color: '#ff6b00', description: 'Progress · Heatmap' },
  { id: 'company-intel', label: 'Spyglass', color: '#ff00a8', description: 'Company patterns · Q&A' },
  { id: 'study-plan', label: 'Roadmap', color: '#00f0ff', description: 'AI-generated · Day-by-day' },
]

function DesktopIcon({ app, onClick }: { app: typeof DESKTOP_APPS[0]; onClick: () => void }) {
  const [hovered, setHovered] = useState(false)

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      aria-label={`Open ${app.label}`}
      title={app.description}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 8,
        padding: '16px 12px',
        borderRadius: 16,
        border: `1px solid ${hovered ? `${app.color}40` : 'var(--glass-border)'}`,
        background: hovered ? `${app.color}12` : 'var(--glass-bg)',
        cursor: 'pointer',
        transition: 'all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)',
        transform: hovered ? 'translateY(-4px) scale(1.05)' : 'none',
        backdropFilter: 'blur(10px)',
        minWidth: 96,
        boxShadow: hovered ? `0 12px 32px ${app.color}25` : 'none',
      }}
      id={`desktop-icon-${app.id}`}
    >
      {/* Icon circle */}
      <div style={{
        width: 52,
        height: 52,
        borderRadius: 16,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: `linear-gradient(135deg, ${app.color}22, ${app.color}08)`,
        border: `1px solid ${app.color}35`,
        color: app.color,
        transition: 'all 0.2s ease',
        boxShadow: hovered ? `0 0 20px ${app.color}40` : 'none',
      }}>
        <AppIcon id={app.id} size={24} />
      </div>

      {/* Label */}
      <span style={{
        fontSize: 11,
        fontWeight: 600,
        color: hovered ? 'var(--text-primary)' : 'var(--text-secondary)',
        textAlign: 'center',
        lineHeight: 1.3,
        letterSpacing: '0.02em',
        transition: 'color 0.15s ease',
      }}>
        {app.label}
      </span>
    </button>
  )
}

function DesktopContent() {
  const { openWindow } = useWindows()
  const { user } = useAuth()
  const [bootComplete, setBootComplete] = useState(false)
  const [showGuide, setShowGuide] = useState(false)
  const [guideStep, setGuideStep] = useState(0)

  useEffect(() => {
    const t = setTimeout(() => {
      setBootComplete(true)
      // Check if guide has been shown
      const seenGuide = localStorage.getItem('offeros-seen-guide')
      if (!seenGuide) {
        setShowGuide(true)
      }
    }, 400)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    const handleOpenGuide = () => {
      setGuideStep(0)
      setShowGuide(true)
    }
    window.addEventListener('open-platform-guide', handleOpenGuide)
    return () => window.removeEventListener('open-platform-guide', handleOpenGuide)
  }, [])

  const closeGuide = () => {
    setShowGuide(false)
    localStorage.setItem('offeros-seen-guide', 'true')
  }

  const guideSlides = [
    {
      title: 'Welcome to OfferOS',
      subtitle: 'The first operating system for job preparation.',
      content: (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
            Instead of navigating generic dashboards, OfferOS provides a highly interactive <strong>browser-based Desktop OS</strong> metaphor. Practice coding, run AI mock interviews, optimize your resume, and map study calendars in one unified multitasking workspace.
          </p>
          <div style={{
            display: 'flex',
            gap: 12,
            background: 'var(--glass-bg)',
            border: '1px solid var(--glass-border)',
            padding: 16,
            borderRadius: 12,
            alignItems: 'center',
          }}>
            <div style={{ background: 'rgba(0, 240, 255, 0.15)', padding: 10, borderRadius: 10 }}>
              <Sparkles size={20} className="text-[#00f0ff]" />
            </div>
            <div>
              <h4 style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 2 }}>Series-A Level Multitasking</h4>
              <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>Drag, resize, minimize, and stack window applications just like native macOS or Windows.</p>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: 'Explore Core Applications',
      subtitle: 'Premium built-in tools to supercharge your career prep.',
      content: (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          {[
            { id: 'dsa-pad', title: 'DSA Playground', desc: 'VS Code Monaco code editor with company problem sets.' },
            { id: 'interview-bot', title: 'Interview AI', desc: 'Real-time voice simulated mock interviews via Mistral AI.' },
            { id: 'resume-scanner', title: 'Resume Intel', desc: 'ATS scanner scoring against job specs with rewrites.' },
            { id: 'analytics', title: 'Analytics Hub', desc: 'Heatmap streaks, skill radars, and preparation statistics.' },
            { id: 'company-intel', title: 'Spyglass', desc: 'FAANG recent questions, hiring patterns & prep guides.' },
            { id: 'study-plan', title: 'Study Roadmap', desc: 'Spaced repetition daily study plan generated on-the-fly.' },
          ].map(app => (
            <button
              key={app.id}
              onClick={() => { openWindow(app.id as WindowId); closeGuide() }}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: 8,
                padding: 10,
                borderRadius: 8,
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid var(--glass-border)',
                textAlign: 'left',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.06)'
                e.currentTarget.style.borderColor = 'rgba(0, 240, 255, 0.3)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.02)'
                e.currentTarget.style.borderColor = 'var(--glass-border)'
              }}
              title="Click to launch this app instantly"
            >
              <div style={{ background: 'rgba(255,255,255,0.04)', padding: 6, borderRadius: 6, display: 'flex', color: 'var(--neon-cyan)' }}>
                <AppIcon id={app.id} size={16} />
              </div>
              <div>
                <h5 style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-primary)' }}>{app.title}</h5>
                <p style={{ fontSize: 10, color: 'var(--text-muted)', lineHeight: 1.3 }}>{app.desc}</p>
              </div>
            </button>
          ))}
        </div>
      ),
    },
    {
      title: 'Power Shortcuts & Customizations',
      subtitle: 'Unleash full productivity in the preparation workspace.',
      content: (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ display: 'flex', gap: 12, background: 'rgba(157, 0, 211, 0.05)', border: '1px solid rgba(157, 0, 211, 0.2)', padding: 12, borderRadius: 10, alignItems: 'center' }}>
            <Command size={20} className="text-[#9d00d3]" />
            <div>
              <h5 style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>Command Palette (⌘K or Ctrl+K)</h5>
              <p style={{ fontSize: 11, color: 'var(--text-muted)' }}>Search and trigger any app, logout, toggle themes, or run operations instantly.</p>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 12, background: 'rgba(0, 255, 136, 0.05)', border: '1px solid rgba(0, 255, 136, 0.2)', padding: 12, borderRadius: 10, alignItems: 'center' }}>
            <CheckCircle size={20} className="text-[#00ff88]" />
            <div>
              <h5 style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>Judge & Pro Dashboard Access</h5>
              <p style={{ fontSize: 11, color: 'var(--text-muted)' }}>Judge mode account is pre-authenticated with premium XP and the Pro admin monitor panel enabled.</p>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 12, background: 'rgba(0, 240, 255, 0.05)', border: '1px solid rgba(0, 240, 255, 0.2)', padding: 12, borderRadius: 10, alignItems: 'center' }}>
            <HelpCircle size={20} className="text-[#00f0ff]" />
            <div>
              <h5 style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>Always Accessible Guide</h5>
              <p style={{ fontSize: 11, color: 'var(--text-muted)' }}>You can re-open this guide at any time by clicking the info icon in the taskbar.</p>
            </div>
          </div>
        </div>
      ),
    },
  ]

  return (
    <div
      style={{
        position: 'relative',
        width: '100vw',
        height: '100vh',
        overflow: 'hidden',
      }}
      id="desktop"
      role="main"
      aria-label="OfferOS Desktop"
    >
      {/* Animated wallpaper */}
      <Wallpaper />

      {/* Desktop content layer */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          bottom: 'var(--taskbar-height)',
          zIndex: 1,
        }}
      >
        {/* Welcome Banner */}
        {bootComplete && (
          <div style={{
            position: 'absolute',
            top: 28,
            left: '50%',
            transform: 'translateX(-50%)',
            textAlign: 'center',
            animation: 'slide-down 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
            zIndex: 2,
            pointerEvents: 'none',
          }}>
            <div style={{
              fontSize: 12,
              color: 'var(--text-muted)',
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              marginBottom: 4,
            }}>
              Welcome back,
            </div>
            <h1 style={{
              fontSize: 22,
              fontWeight: 800,
              background: 'linear-gradient(135deg, #00f0ff, #bd00ff)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              letterSpacing: '0.02em',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
            }}>
              {user?.name}
              {user?.subscriptionTier === 'judge' && (
                <span style={{
                  padding: '2px 8px',
                  borderRadius: 6,
                  background: 'rgba(0, 240, 255, 0.15)',
                  border: '1px solid rgba(0, 240, 255, 0.3)',
                  fontSize: 10,
                  fontWeight: 800,
                  letterSpacing: '0.05em',
                  color: '#00f0ff',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 4,
                  verticalAlign: 'middle',
                }}>
                  <AppIcon id="crown" size={10} /> JUDGE
                </span>
              )}
            </h1>
          </div>
        )}

        {/* Cmd+K hint */}
        {bootComplete && (
          <div style={{
            position: 'absolute',
            top: 24,
            right: 24,
            animation: 'fade-in 0.8s ease 0.5s both',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            padding: '6px 12px',
            borderRadius: 8,
            background: 'var(--glass-bg)',
            border: '1px solid var(--glass-border)',
            fontSize: 12,
            color: 'var(--text-muted)',
          }}>
            <kbd style={{ fontFamily: 'JetBrains Mono', fontSize: 11 }}>⌘K</kbd>
            <span>Command Palette</span>
          </div>
        )}

        {/* Desktop Icons Grid */}
        {bootComplete && (
          <div style={{
            position: 'absolute',
            left: 24,
            top: '50%',
            transform: 'translateY(-50%)',
            display: 'flex',
            flexDirection: 'column',
            gap: 12,
            animation: 'slide-up 0.4s ease',
          }}>
            {DESKTOP_APPS.map((app, i) => (
              <div
                key={app.id}
                style={{
                  animation: `slide-up 0.4s ease ${i * 0.06}s both`,
                }}
              >
                <DesktopIcon app={app} onClick={() => openWindow(app.id)} />
              </div>
            ))}
          </div>
        )}

        {/* Stats Panel (bottom-right) */}
        {bootComplete && user && (
          <div style={{
            position: 'absolute',
            right: 24,
            bottom: 24,
            display: 'flex',
            flexDirection: 'column',
            gap: 8,
            animation: 'fade-in 0.6s ease 0.4s both',
          }}>
            {/* Placement countdown */}
            {user.placementDate && (
              <div style={{
                padding: '12px 16px',
                borderRadius: 12,
                background: 'var(--bg-surface)',
                border: '1px solid var(--glass-border)',
                backdropFilter: 'blur(20px)',
                minWidth: 200,
                boxShadow: 'var(--shadow-window)',
              }}>
                <div style={{ fontSize: 10, color: 'var(--text-muted)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 4 }}>
                  Days to Placement
                </div>
                <div style={{
                  fontSize: 36,
                  fontWeight: 800,
                  fontFamily: 'JetBrains Mono',
                  color: 'var(--neon-cyan)',
                  textShadow: '0 0 20px rgba(0,240,255,0.4)',
                  lineHeight: 1,
                }}>
                  {Math.max(0, Math.ceil((new Date(user.placementDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)))}
                </div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>
                  {new Date(user.placementDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                </div>
              </div>
            )}

            {/* Quick stats */}
            <div style={{
              padding: '10px 16px',
              borderRadius: 12,
              background: 'var(--bg-surface)',
              border: '1px solid var(--glass-border)',
              backdropFilter: 'blur(20px)',
              display: 'flex',
              gap: 16,
              boxShadow: 'var(--shadow-window)',
              alignItems: 'center',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <AppIcon id="flame" size={16} className="text-[#ff6b00]" />
                <div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: '#ff6b00', lineHeight: 1.1 }}>{user.streakData.currentStreak}d</div>
                  <div style={{ fontSize: 8, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Streak</div>
                </div>
              </div>
              <div style={{ width: 1, height: 24, background: 'var(--glass-border)' }} />
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <AppIcon id="zap" size={16} className="text-[#00ff88]" />
                <div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: '#00ff88', lineHeight: 1.1 }}>{user.xp.toLocaleString()}</div>
                  <div style={{ fontSize: 8, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>XP</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Window Manager (renders all open windows) */}
        <WindowManager />
      </div>

      {/* Platform Onboarding / Help Guide Portal Overlay */}
      {showGuide && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(2, 2, 8, 0.75)',
          backdropFilter: 'blur(10px)',
          zIndex: 100000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          animation: 'fade-in 0.25s ease',
        }}>
          <div style={{
            width: min(580, '90vw'),
            background: 'var(--bg-surface)',
            border: '1px solid rgba(0, 240, 255, 0.2)',
            borderRadius: 20,
            padding: '28px 32px',
            boxShadow: 'var(--shadow-window), 0 0 40px rgba(0, 240, 255, 0.1)',
            position: 'relative',
            animation: 'scale-in 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
            color: 'var(--text-primary)',
          }}>
            {/* Close Button */}
            <button
              onClick={closeGuide}
              style={{
                position: 'absolute',
                top: 20,
                right: 20,
                background: 'transparent',
                border: 'none',
                color: 'var(--text-muted)',
                cursor: 'pointer',
                transition: 'color 0.15s ease',
              }}
              onMouseEnter={e => e.currentTarget.style.color = 'var(--text-primary)'}
              onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
              title="Close Guide"
            >
              <X size={18} />
            </button>

            {/* Header */}
            <div style={{ marginBottom: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 10, color: 'var(--neon-cyan)', letterSpacing: '0.15em', textTransform: 'uppercase', fontWeight: 700, marginBottom: 6 }}>
                <Sparkles size={11} /> Platform Guide
              </div>
              <h2 style={{ fontSize: 22, fontWeight: 800, letterSpacing: '-0.02em', background: 'linear-gradient(135deg, #fff, rgba(255,255,255,0.7))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                {guideSlides[guideStep].title}
              </h2>
              <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 2 }}>
                {guideSlides[guideStep].subtitle}
              </p>
            </div>

            {/* Content Slot */}
            <div style={{ minHeight: 180, marginBottom: 28 }}>
              {guideSlides[guideStep].content}
            </div>

            {/* Footer / Nav Controls */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid var(--glass-border)', paddingTop: 20 }}>
              {/* Step indicator dots */}
              <div style={{ display: 'flex', gap: 6 }}>
                {guideSlides.map((_, i) => (
                  <div
                    key={i}
                    style={{
                      width: i === guideStep ? 16 : 6,
                      height: 6,
                      borderRadius: 3,
                      background: i === guideStep ? 'var(--neon-cyan)' : 'var(--glass-border)',
                      transition: 'all 0.2s ease',
                    }}
                  />
                ))}
              </div>

              {/* Navigation buttons */}
              <div style={{ display: 'flex', gap: 8 }}>
                {guideStep > 0 && (
                  <button
                    onClick={() => setGuideStep(p => p - 1)}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 4,
                      padding: '8px 16px',
                      borderRadius: 8,
                      border: '1px solid var(--glass-border)',
                      background: 'var(--glass-bg)',
                      color: 'var(--text-secondary)',
                      fontSize: 12,
                      fontWeight: 600,
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    <ChevronLeft size={14} /> Back
                  </button>
                )}
                {guideStep < guideSlides.length - 1 ? (
                  <button
                    onClick={() => setGuideStep(p => p + 1)}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 4,
                      padding: '8px 16px',
                      borderRadius: 8,
                      border: 'none',
                      background: 'linear-gradient(135deg, var(--neon-cyan), var(--neon-purple))',
                      color: '#000',
                      fontSize: 12,
                      fontWeight: 700,
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    Next <ChevronRight size={14} />
                  </button>
                ) : (
                  <button
                    onClick={closeGuide}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 4,
                      padding: '8px 16px',
                      borderRadius: 8,
                      border: 'none',
                      background: 'linear-gradient(135deg, var(--neon-green), var(--neon-cyan))',
                      color: '#000',
                      fontSize: 12,
                      fontWeight: 700,
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    Get Started! <CheckCircle size={14} />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Taskbar */}
      <Taskbar />

      {/* Command Palette */}
      <CommandPalette />
    </div>
  )
}

function min(val: number, fallback: string | number): string | number {
  return typeof window !== 'undefined' ? (window.innerWidth < val ? fallback : val) : val
}

export default function DesktopPage() {
  return (
    <WindowProvider>
      <DesktopContent />
    </WindowProvider>
  )
}

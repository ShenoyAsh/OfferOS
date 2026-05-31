'use client'

import { useEffect, useRef } from 'react'
import { useWindows } from '@/context/WindowContext'
import { useAuth } from '@/context/AuthContext'
import type { WindowId } from '@/types'
import { useRouter } from 'next/navigation'
import AppIcon from '@/components/os/AppIcon'
import { Sun, Moon, HelpCircle, Home, LogOut } from 'lucide-react'

const APPS: Array<{ id: WindowId; label: string; proOnly?: boolean }> = [
  { id: 'dsa-pad', label: 'DSA Pad' },
  { id: 'interview-bot', label: 'Interview AI' },
  { id: 'resume-scanner', label: 'Resume' },
  { id: 'analytics', label: 'Analytics' },
  { id: 'company-intel', label: 'Spyglass' },
  { id: 'study-plan', label: 'Roadmap' },
  { id: 'admin', label: 'Admin', proOnly: true },
]

export default function Taskbar() {
  const { windows, openWindow } = useWindows()
  const { user, logout, theme, toggleTheme } = useAuth()
  const router = useRouter()
  const clockRef = useRef<HTMLSpanElement>(null)

  // Live clock
  useEffect(() => {
    const tick = () => {
      if (clockRef.current) {
        const now = new Date()
        clockRef.current.textContent = now.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
        })
      }
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [])

  const openWindows = windows.filter(w => !w.isMinimized && w.isOpen)

  return (
    <div
      id="taskbar"
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        height: 'var(--taskbar-height)',
        background: 'var(--bg-surface)',
        backdropFilter: 'blur(20px)',
        borderTop: '1px solid var(--glass-border)',
        display: 'flex',
        alignItems: 'center',
        padding: '0 16px',
        gap: 4,
        zIndex: 9999,
        boxShadow: '0 -4px 20px rgba(0,0,0,0.3)',
      }}
      role="toolbar"
      aria-label="Taskbar"
    >
      {/* OfferOS Clickable Logo to return Home */}
      <button
        onClick={() => router.push('/')}
        title="Return to Landing Page"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          marginRight: 4,
          padding: '6px 12px',
          borderRadius: 8,
          background: 'rgba(0, 240, 255, 0.08)',
          border: '1px solid rgba(0, 240, 255, 0.15)',
          cursor: 'pointer',
          transition: 'all 0.2s ease',
        }}
        onMouseEnter={e => {
          e.currentTarget.style.background = 'rgba(0, 240, 255, 0.15)'
          e.currentTarget.style.transform = 'translateY(-1px)'
        }}
        onMouseLeave={e => {
          e.currentTarget.style.background = 'rgba(0, 240, 255, 0.08)'
          e.currentTarget.style.transform = 'none'
        }}
      >
        <AppIcon id="briefcase" size={14} className="text-[#00f0ff]" />
        <span style={{
          fontSize: 12,
          fontWeight: 800,
          background: 'linear-gradient(135deg, #00f0ff, #bd00ff)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          letterSpacing: '0.05em',
        }}>
          OFFEROS
        </span>
      </button>

      {/* Global Home navigation icon button */}
      <button
        onClick={() => router.push('/')}
        title="Go to Home Landing Page"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: 32,
          height: 32,
          borderRadius: 8,
          border: '1px solid var(--glass-border)',
          background: 'var(--glass-bg)',
          color: 'var(--text-secondary)',
          cursor: 'pointer',
          transition: 'all 0.15s ease',
        }}
        onMouseEnter={e => {
          e.currentTarget.style.borderColor = 'rgba(0, 240, 255, 0.3)'
          e.currentTarget.style.color = 'var(--neon-cyan)'
          e.currentTarget.style.background = 'rgba(255, 255, 255, 0.04)'
        }}
        onMouseLeave={e => {
          e.currentTarget.style.borderColor = 'var(--glass-border)'
          e.currentTarget.style.color = 'var(--text-secondary)'
          e.currentTarget.style.background = 'var(--glass-bg)'
        }}
      >
        <Home size={15} />
      </button>

      {/* Divider */}
      <div style={{ width: 1, height: 24, background: 'var(--glass-border)', margin: '0 6px' }} />

      {/* App Icons */}
      {APPS.map(app => {
        if (app.proOnly && user?.subscriptionTier === 'free') return null
        const isOpen = openWindows.some(w => w.id === app.id)
        const isFocused = openWindows.find(w => w.id === app.id)?.isFocused

        return (
          <button
            key={app.id}
            onClick={() => openWindow(app.id as WindowId)}
            aria-label={`Open ${app.label}`}
            title={app.label}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 2,
              padding: '4px 10px',
              borderRadius: 8,
              border: isOpen
                ? `1px solid rgba(0, 240, 255, ${isFocused ? 0.4 : 0.15})`
                : '1px solid transparent',
              background: isOpen
                ? `rgba(0, 240, 255, ${isFocused ? 0.12 : 0.05})`
                : 'transparent',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
              minWidth: 54,
              position: 'relative',
            }}
            onMouseEnter={e => {
              ;(e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.06)'
              ;(e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.12)'
            }}
            onMouseLeave={e => {
              ;(e.currentTarget as HTMLElement).style.background = isOpen
                ? `rgba(0, 240, 255, ${isFocused ? 0.12 : 0.05})`
                : 'transparent'
              ;(e.currentTarget as HTMLElement).style.borderColor = isOpen
                ? `rgba(0, 240, 255, ${isFocused ? 0.4 : 0.15})`
                : 'transparent'
            }}
          >
            <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 18, color: isOpen ? 'var(--neon-cyan)' : 'var(--text-secondary)' }}>
              <AppIcon id={app.id} size={15} />
            </span>
            <span style={{
              fontSize: 9,
              color: isOpen ? 'var(--neon-cyan)' : 'var(--text-muted)',
              fontWeight: 600,
              letterSpacing: '0.03em',
              textTransform: 'uppercase',
            }}>
              {app.label}
            </span>
            {/* Active dot */}
            {isOpen && (
              <div style={{
                position: 'absolute',
                bottom: 2,
                width: 4,
                height: 4,
                borderRadius: '50%',
                background: 'var(--neon-cyan)',
                boxShadow: '0 0 6px var(--neon-cyan)',
              }} />
            )}
          </button>
        )
      })}

      {/* Spacer */}
      <div style={{ flex: 1 }} />

      {/* XP Counter */}
      {user && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          padding: '4px 10px',
          borderRadius: 8,
          background: 'rgba(0, 255, 136, 0.08)',
          border: '1px solid rgba(0, 255, 136, 0.2)',
        }}>
          <AppIcon id="zap" size={12} className="text-[#00ff88]" />
          <span style={{ fontSize: 11, color: '#00ff88', fontWeight: 600, fontFamily: 'JetBrains Mono' }}>
            {user.xp.toLocaleString()} XP
          </span>
        </div>
      )}

      {/* Streak */}
      {user && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          padding: '4px 10px',
          borderRadius: 8,
          background: 'rgba(255, 107, 0, 0.08)',
          border: '1px solid rgba(255, 107, 0, 0.2)',
        }}>
          <AppIcon id="flame" size={12} className="text-[#ff6b00]" />
          <span style={{ fontSize: 11, color: '#ff6b00', fontWeight: 600 }}>
            {user.streakData.currentStreak}d
          </span>
        </div>
      )}

      {/* Subscription badge */}
      {user && (
        <div style={{
          padding: '4px 10px',
          borderRadius: 6,
          background: user.subscriptionTier === 'judge'
            ? 'linear-gradient(135deg, rgba(0,240,255,0.15), rgba(189,0,255,0.15))'
            : user.subscriptionTier === 'pro'
            ? 'rgba(189,0,255,0.15)'
            : 'rgba(255,255,255,0.05)',
          border: `1px solid ${user.subscriptionTier === 'judge' ? 'rgba(0,240,255,0.3)' : user.subscriptionTier === 'pro' ? 'rgba(189,0,255,0.3)' : 'rgba(255,255,255,0.1)'}`,
          fontSize: 9,
          fontWeight: 700,
          letterSpacing: '0.08em',
          color: user.subscriptionTier === 'judge' ? '#00f0ff' : user.subscriptionTier === 'pro' ? '#bd00ff' : 'var(--text-muted)',
          textTransform: 'uppercase',
          display: 'flex',
          alignItems: 'center',
          gap: 4,
        }}>
          {user.subscriptionTier === 'judge' && <AppIcon id="crown" size={10} className="text-[#00f0ff]" />}
          <span>{user.subscriptionTier === 'judge' ? 'JUDGE' : user.subscriptionTier === 'pro' ? 'PRO' : 'FREE'}</span>
        </div>
      )}

      {/* Divider */}
      <div style={{ width: 1, height: 24, background: 'var(--glass-border)', margin: '0 6px' }} />

      {/* Platform Guide Button */}
      <button
        onClick={() => window.dispatchEvent(new CustomEvent('open-platform-guide'))}
        title="Open Platform Onboarding Guide"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: 32,
          height: 32,
          borderRadius: 8,
          border: '1px solid var(--glass-border)',
          background: 'var(--glass-bg)',
          color: 'var(--text-secondary)',
          cursor: 'pointer',
          transition: 'all 0.15s ease',
        }}
        onMouseEnter={e => {
          e.currentTarget.style.borderColor = 'rgba(0, 240, 255, 0.3)'
          e.currentTarget.style.color = 'var(--neon-cyan)'
          e.currentTarget.style.background = 'rgba(255, 255, 255, 0.04)'
        }}
        onMouseLeave={e => {
          e.currentTarget.style.borderColor = 'var(--glass-border)'
          e.currentTarget.style.color = 'var(--text-secondary)'
          e.currentTarget.style.background = 'var(--glass-bg)'
        }}
      >
        <HelpCircle size={15} />
      </button>

      {/* Theme Toggle Button */}
      <button
        onClick={toggleTheme}
        title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: 32,
          height: 32,
          borderRadius: 8,
          border: '1px solid var(--glass-border)',
          background: 'var(--glass-bg)',
          color: 'var(--text-secondary)',
          cursor: 'pointer',
          transition: 'all 0.15s ease',
        }}
        onMouseEnter={e => {
          e.currentTarget.style.borderColor = 'rgba(157, 0, 211, 0.3)'
          e.currentTarget.style.color = 'var(--neon-purple)'
          e.currentTarget.style.background = 'rgba(255, 255, 255, 0.04)'
        }}
        onMouseLeave={e => {
          e.currentTarget.style.borderColor = 'var(--glass-border)'
          e.currentTarget.style.color = 'var(--text-secondary)'
          e.currentTarget.style.background = 'var(--glass-bg)'
        }}
      >
        {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
      </button>

      {/* Divider */}
      <div style={{ width: 1, height: 24, background: 'var(--glass-border)', margin: '0 6px' }} />

      {/* Clock */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
        padding: '0 8px',
        marginRight: 4,
      }}>
        <span
          ref={clockRef}
          style={{
            fontSize: 13,
            fontFamily: 'JetBrains Mono',
            color: 'var(--text-primary)',
            fontWeight: 500,
          }}
        />
        <span style={{ fontSize: 9, color: 'var(--text-muted)', letterSpacing: '0.05em' }}>
          {new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
        </span>
      </div>

      {/* Logout */}
      {user && (
        <button
          onClick={logout}
          title="Logout"
          aria-label="Logout"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 32,
            height: 32,
            borderRadius: 8,
            background: 'transparent',
            border: '1px solid transparent',
            cursor: 'pointer',
            color: 'var(--text-muted)',
            transition: 'all 0.15s ease',
          }}
          onMouseEnter={e => {
            ;(e.currentTarget as HTMLElement).style.background = 'rgba(255,59,48,0.1)'
            ;(e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,59,48,0.3)'
            ;(e.currentTarget as HTMLElement).style.color = '#ff3b30'
          }}
          onMouseLeave={e => {
            ;(e.currentTarget as HTMLElement).style.background = 'transparent'
            ;(e.currentTarget as HTMLElement).style.borderColor = 'transparent'
            ;(e.currentTarget as HTMLElement).style.color = 'var(--text-muted)'
          }}
        >
          <LogOut size={15} />
        </button>
      )}
    </div>
  )
}

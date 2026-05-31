'use client'

import { useEffect, useState, useRef } from 'react'
import { useWindows } from '@/context/WindowContext'
import { useAuth } from '@/context/AuthContext'
import type { WindowId } from '@/types'
import AppIcon from './AppIcon'
import { Search, LogOut } from 'lucide-react'

interface PaletteItem {
  id: string
  title: string
  subtitle?: string
  appId?: WindowId | 'crown' | 'logout'
  action: () => void
  shortcut?: string
  category: string
}

export default function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false)
  const [search, setSearch] = useState('')
  const { openWindow } = useWindows()
  const { user, logout } = useAuth()
  const inputRef = useRef<HTMLInputElement>(null)

  // Keyboard shortcut
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setIsOpen(open => !open)
      }
      if (e.key === 'Escape') setIsOpen(false)
    }
    document.addEventListener('keydown', down)
    return () => document.removeEventListener('keydown', down)
  }, [])

  useEffect(() => {
    if (isOpen) {
      setSearch('')
      setTimeout(() => inputRef.current?.focus(), 50)
    }
  }, [isOpen])

  const items: PaletteItem[] = [
    // Apps
    { id: 'open-dsa', category: 'Apps', appId: 'dsa-pad', title: 'Open DSA Playground', subtitle: 'Monaco editor + problem set', action: () => { openWindow('dsa-pad'); setIsOpen(false) }, shortcut: '1' },
    { id: 'open-interview', category: 'Apps', appId: 'interview-bot', title: 'Open AI Interview Suite', subtitle: 'Behavioral, Technical, System Design', action: () => { openWindow('interview-bot'); setIsOpen(false) } },
    { id: 'open-resume', category: 'Apps', appId: 'resume-scanner', title: 'Open Resume Intelligence', subtitle: 'ATS scoring + AI optimization', action: () => { openWindow('resume-scanner'); setIsOpen(false) } },
    { id: 'open-analytics', category: 'Apps', appId: 'analytics', title: 'Open Analytics Hub', subtitle: 'Heatmap, radar chart, progress', action: () => { openWindow('analytics'); setIsOpen(false) } },
    { id: 'open-intel', category: 'Apps', appId: 'company-intel', title: 'Open Company Spyglass', subtitle: 'Hiring patterns + question bank', action: () => { openWindow('company-intel'); setIsOpen(false) } },
    { id: 'open-plan', category: 'Apps', appId: 'study-plan', title: 'Open Study Roadmap', subtitle: 'Day-by-day placement plan', action: () => { openWindow('study-plan'); setIsOpen(false) } },
    ...(user?.subscriptionTier === 'judge' ? [
      { id: 'open-admin', category: 'Apps', appId: 'admin' as WindowId, title: 'Open Admin Dashboard', subtitle: 'Analytics, MRR, user metrics', action: () => { openWindow('admin'); setIsOpen(false) } }
    ] : []),
    // Actions
    { id: 'logout', category: 'Account', appId: 'logout' as any, title: 'Logout', action: () => { logout(); setIsOpen(false) } },
  ]

  const filtered = search
    ? items.filter(i =>
        i.title.toLowerCase().includes(search.toLowerCase()) ||
        i.subtitle?.toLowerCase().includes(search.toLowerCase()) ||
        i.category.toLowerCase().includes(search.toLowerCase())
      )
    : items

  const grouped = filtered.reduce<Record<string, PaletteItem[]>>((acc, item) => {
    if (!acc[item.category]) acc[item.category] = []
    acc[item.category].push(item)
    return acc
  }, {})

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.7)',
          backdropFilter: 'blur(8px)',
          zIndex: 10000,
          animation: 'fade-in 0.15s ease',
        }}
        onClick={() => setIsOpen(false)}
        aria-hidden="true"
      />

      {/* Palette */}
      <div
        style={{
          position: 'fixed',
          top: '20%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: 'min(640px, 90vw)',
          zIndex: 10001,
          animation: 'scale-in 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)',
          borderRadius: 16,
          overflow: 'hidden',
          background: 'rgba(14, 14, 24, 0.95)',
          border: '1px solid rgba(0, 240, 255, 0.2)',
          boxShadow: '0 32px 96px rgba(0,0,0,0.8), 0 0 0 1px rgba(0,240,255,0.1), 0 0 40px rgba(0,240,255,0.05)',
        }}
        role="dialog"
        aria-label="Command Palette"
        aria-modal="true"
      >
        {/* Search Input */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          padding: '0 16px',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          gap: 12,
        }}>
          <Search size={18} style={{ opacity: 0.5, color: 'var(--text-muted)' }} />
          <input
            ref={inputRef}
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search apps, actions..."
            style={{
              flex: 1,
              background: 'transparent',
              border: 'none',
              outline: 'none',
              color: 'var(--text-primary)',
              fontSize: 16,
              padding: '16px 0',
              fontFamily: 'inherit',
            }}
            aria-label="Search command palette"
          />
          <kbd style={{
            padding: '2px 8px',
            borderRadius: 4,
            background: 'rgba(255,255,255,0.06)',
            border: '1px solid rgba(255,255,255,0.1)',
            fontSize: 11,
            color: 'var(--text-muted)',
            fontFamily: 'JetBrains Mono',
          }}>
            ESC
          </kbd>
        </div>

        {/* Results */}
        <div style={{ maxHeight: 400, overflowY: 'auto', padding: '8px 0' }}>
          {Object.entries(grouped).map(([category, items]) => (
            <div key={category}>
              <div style={{
                padding: '6px 16px 4px',
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: '0.1em',
                color: 'var(--text-muted)',
                textTransform: 'uppercase',
              }}>
                {category}
              </div>
              {items.map(item => (
                <button
                  key={item.id}
                  onClick={item.action}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    padding: '10px 16px',
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'background 0.1s ease',
                    borderRadius: 8,
                    margin: '1px 8px',
                    width: 'calc(100% - 16px)',
                  }}
                  onMouseEnter={e => {
                    ;(e.currentTarget as HTMLElement).style.background = 'rgba(0, 240, 255, 0.08)'
                  }}
                  onMouseLeave={e => {
                    ;(e.currentTarget as HTMLElement).style.background = 'transparent'
                  }}
                >
                  <span style={{
                    width: 36,
                    height: 36,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'rgba(255,255,255,0.05)',
                    borderRadius: 8,
                    fontSize: 18,
                    flexShrink: 0,
                    color: item.category === 'Account' ? 'var(--neon-purple)' : 'var(--neon-cyan)',
                  }}>
                    {item.appId === 'logout' ? (
                      <LogOut size={16} />
                    ) : item.appId ? (
                      <AppIcon id={item.appId} size={16} />
                    ) : (
                      <AppIcon id="settings" size={16} />
                    )}
                  </span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14, color: 'var(--text-primary)', fontWeight: 500 }}>
                      {item.title}
                    </div>
                    {item.subtitle && (
                      <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 1 }}>
                        {item.subtitle}
                      </div>
                    )}
                  </div>
                  {item.shortcut && (
                    <kbd style={{
                      padding: '2px 6px',
                      borderRadius: 4,
                      background: 'rgba(255,255,255,0.06)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      fontSize: 11,
                      color: 'var(--text-muted)',
                      fontFamily: 'JetBrains Mono',
                    }}>
                      ⌘{item.shortcut}
                    </kbd>
                  )}
                </button>
              ))}
            </div>
          ))}

          {filtered.length === 0 && (
            <div style={{
              padding: '32px',
              textAlign: 'center',
              color: 'var(--text-muted)',
              fontSize: 14,
            }}>
              No results for "{search}"
            </div>
          )}
        </div>

        {/* Footer hint */}
        <div style={{
          padding: '8px 16px',
          borderTop: '1px solid rgba(255,255,255,0.06)',
          display: 'flex',
          gap: 16,
          fontSize: 11,
          color: 'var(--text-muted)',
        }}>
          <span>↑↓ navigate</span>
          <span>↵ open</span>
          <span>⌘K toggle</span>
        </div>
      </div>
    </>
  )
}

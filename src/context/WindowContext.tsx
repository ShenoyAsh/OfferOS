'use client'

import { createContext, useContext, useCallback, useState, ReactNode } from 'react'
import type { WindowId, WindowState } from '@/types'

const DEFAULT_WINDOWS: Record<WindowId, Omit<WindowState, 'isOpen' | 'isMinimized' | 'zIndex' | 'isFocused'>> = {
  'dsa-pad': {
    id: 'dsa-pad',
    title: 'DSA Playground',
    icon: '',
    isMaximized: false,
    position: { x: 80, y: 60 },
    size: { width: 1000, height: 680 },
  },
  'interview-bot': {
    id: 'interview-bot',
    title: 'AI Interview Suite',
    icon: '',
    isMaximized: false,
    position: { x: 200, y: 80 },
    size: { width: 860, height: 620 },
  },
  'resume-scanner': {
    id: 'resume-scanner',
    title: 'Resume Intelligence',
    icon: '',
    isMaximized: false,
    position: { x: 120, y: 100 },
    size: { width: 900, height: 640 },
  },
  'analytics': {
    id: 'analytics',
    title: 'Analytics Hub',
    icon: '',
    isMaximized: false,
    position: { x: 160, y: 60 },
    size: { width: 820, height: 600 },
  },
  'company-intel': {
    id: 'company-intel',
    title: 'Company Spyglass',
    icon: '',
    isMaximized: false,
    position: { x: 100, y: 80 },
    size: { width: 860, height: 600 },
  },
  'study-plan': {
    id: 'study-plan',
    title: 'Study Roadmap',
    icon: '',
    isMaximized: false,
    position: { x: 140, y: 70 },
    size: { width: 800, height: 600 },
  },
  'settings': {
    id: 'settings',
    title: 'Settings',
    icon: '',
    isMaximized: false,
    position: { x: 300, y: 150 },
    size: { width: 680, height: 500 },
  },
  'admin': {
    id: 'admin',
    title: 'Admin Dashboard',
    icon: '',
    isMaximized: false,
    position: { x: 100, y: 60 },
    size: { width: 1000, height: 680 },
  },
}

interface WindowContextType {
  windows: WindowState[]
  openWindow: (id: WindowId) => void
  closeWindow: (id: WindowId) => void
  minimizeWindow: (id: WindowId) => void
  maximizeWindow: (id: WindowId) => void
  focusWindow: (id: WindowId) => void
  updateWindowPosition: (id: WindowId, position: { x: number; y: number }) => void
  updateWindowSize: (id: WindowId, size: { width: number; height: number }) => void
  isOpen: (id: WindowId) => boolean
  activeWindows: WindowState[]
}

const WindowContext = createContext<WindowContextType | null>(null)

export function WindowProvider({ children }: { children: ReactNode }) {
  const [windows, setWindows] = useState<WindowState[]>([])
  const [zCounter, setZCounter] = useState(100)

  const focusWindow = useCallback((id: WindowId) => {
    setZCounter(z => z + 1)
    const newZ = zCounter + 1
    setWindows(prev =>
      prev.map(w => ({
        ...w,
        isFocused: w.id === id,
        zIndex: w.id === id ? newZ : w.zIndex,
      }))
    )
  }, [zCounter])

  const openWindow = useCallback((id: WindowId) => {
    setWindows(prev => {
      const existing = prev.find(w => w.id === id)
      if (existing) {
        if (existing.isMinimized) {
          return prev.map(w =>
            w.id === id ? { ...w, isMinimized: false, isFocused: true, zIndex: zCounter + 1 } : { ...w, isFocused: false }
          )
        }
        focusWindow(id)
        return prev
      }
      const defaults = DEFAULT_WINDOWS[id]
      const newWindow: WindowState = {
        ...defaults,
        isOpen: true,
        isMinimized: false,
        isFocused: true,
        zIndex: zCounter + 1,
      }
      setZCounter(z => z + 1)
      return [
        ...prev.map(w => ({ ...w, isFocused: false })),
        newWindow,
      ]
    })
  }, [zCounter, focusWindow])

  const closeWindow = useCallback((id: WindowId) => {
    setWindows(prev => prev.filter(w => w.id !== id))
  }, [])

  const minimizeWindow = useCallback((id: WindowId) => {
    setWindows(prev =>
      prev.map(w => w.id === id ? { ...w, isMinimized: true, isFocused: false } : w)
    )
  }, [])

  const maximizeWindow = useCallback((id: WindowId) => {
    setWindows(prev =>
      prev.map(w => w.id === id ? { ...w, isMaximized: !w.isMaximized } : w)
    )
  }, [])

  const updateWindowPosition = useCallback((id: WindowId, position: { x: number; y: number }) => {
    setWindows(prev =>
      prev.map(w => w.id === id ? { ...w, position } : w)
    )
  }, [])

  const updateWindowSize = useCallback((id: WindowId, size: { width: number; height: number }) => {
    setWindows(prev =>
      prev.map(w => w.id === id ? { ...w, size } : w)
    )
  }, [])

  const isOpen = useCallback((id: WindowId) => {
    return windows.some(w => w.id === id && !w.isMinimized)
  }, [windows])

  const activeWindows = windows.filter(w => w.isOpen)

  return (
    <WindowContext.Provider value={{
      windows,
      openWindow,
      closeWindow,
      minimizeWindow,
      maximizeWindow,
      focusWindow,
      updateWindowPosition,
      updateWindowSize,
      isOpen,
      activeWindows,
    }}>
      {children}
    </WindowContext.Provider>
  )
}

export function useWindows() {
  const ctx = useContext(WindowContext)
  if (!ctx) throw new Error('useWindows must be used within WindowProvider')
  return ctx
}

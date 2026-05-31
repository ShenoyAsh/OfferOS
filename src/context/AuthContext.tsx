'use client'

import { createContext, useContext, useState, useCallback, ReactNode, useEffect } from 'react'
import type { User } from '@/types'

// Judge mode demo user
const JUDGE_USER: User = {
  id: 'judge-001',
  email: 'judge@hackathon.dev',
  name: 'Judge User',
  subscriptionTier: 'judge',
  streakData: {
    currentStreak: 23,
    longestStreak: 47,
    lastActiveDate: new Date().toISOString(),
    heatmapData: generateHeatmapData(),
  },
  xp: 8420,
  skills: ['Arrays', 'Trees', 'Graphs', 'Dynamic Programming', 'System Design', 'Behavioral'],
  targetCompanies: ['Google', 'Meta', 'Amazon'],
  placementDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
  studyHoursPerDay: 4,
  onboardingCompleted: true,
}

function generateHeatmapData(): Record<string, number> {
  const data: Record<string, number> = {}
  const today = new Date()
  for (let i = 365; i >= 0; i--) {
    const date = new Date(today)
    date.setDate(date.getDate() - i)
    const key = date.toISOString().split('T')[0]
    // Realistic pattern with some gaps
    if (Math.random() > 0.3) {
      data[key] = Math.floor(Math.random() * 5) + 1
    }
  }
  return data
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  theme: 'light' | 'dark'
  toggleTheme: () => void
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  updateUser: (updates: Partial<User>) => void
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [theme, setTheme] = useState<'light' | 'dark'>('dark')

  useEffect(() => {
    const savedTheme = localStorage.getItem('offeros-theme') as 'light' | 'dark'
    if (savedTheme) {
      setTheme(savedTheme)
    } else if (window.matchMedia('(prefers-color-scheme: light)').matches) {
      setTheme('light')
    }
  }, [])

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('offeros-theme', theme)
  }, [theme])

  const toggleTheme = useCallback(() => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark')
  }, [])

  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true)
    await new Promise(r => setTimeout(r, 800)) // Simulate API call

    // Judge mode login
    if ((email === 'judge' || email === 'judge@hackathon.dev') && password === 'hackathon2024') {
      setUser(JUDGE_USER)
      setIsLoading(false)
      return true
    }

    // Demo user login
    if (email && password.length >= 6) {
      const demoUser: User = {
        id: `user-${Date.now()}`,
        email,
        name: email.split('@')[0],
        subscriptionTier: 'free',
        streakData: {
          currentStreak: 3,
          longestStreak: 7,
          lastActiveDate: new Date().toISOString(),
          heatmapData: generateHeatmapData(),
        },
        xp: 340,
        skills: [],
        targetCompanies: [],
        studyHoursPerDay: 2,
        onboardingCompleted: false,
      }
      setUser(demoUser)
      setIsLoading(false)
      return true
    }

    setIsLoading(false)
    return false
  }, [])

  const logout = useCallback(() => {
    setUser(null)
  }, [])

  const updateUser = useCallback((updates: Partial<User>) => {
    setUser(prev => prev ? { ...prev, ...updates } : null)
  }, [])

  return (
    <AuthContext.Provider value={{
      user,
      isLoading,
      isAuthenticated: !!user,
      theme,
      toggleTheme,
      login,
      logout,
      updateUser,
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}

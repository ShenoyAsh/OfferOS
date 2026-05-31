'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import { AuthProvider } from '@/context/AuthContext'

function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { login } = useAuth()
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)
    const success = await login(email, password)
    if (success) {
      router.push('/desktop')
    } else {
      setError('Invalid credentials. Try judge / hackathon2024 for judge access.')
    }
    setIsLoading(false)
  }

  const quickLogin = (e: string, p: string) => {
    setEmail(e)
    setPassword(p)
  }

  const S = (o: React.CSSProperties): React.CSSProperties => o

  return (
    <div style={S({
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'var(--bg-void)', position: 'relative', overflow: 'hidden',
    })}>
      {/* Aurora background */}
      <div style={S({ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 20% 50%, rgba(0,240,255,0.05) 0%, transparent 60%), radial-gradient(ellipse at 80% 30%, rgba(189,0,255,0.05) 0%, transparent 60%)', pointerEvents: 'none' })} />

      <div style={S({
        width: 'min(420px, 90vw)', padding: 40,
        background: 'rgba(14, 14, 24, 0.9)', borderRadius: 20,
        border: '1px solid rgba(0, 240, 255, 0.15)',
        boxShadow: '0 32px 96px rgba(0,0,0,0.6), 0 0 0 1px rgba(0,240,255,0.05)',
        backdropFilter: 'blur(20px)',
        animation: 'scale-in 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
        position: 'relative',
      })}>
        {/* Logo */}
        <div style={S({ textAlign: 'center', marginBottom: 32 })}>
          <div style={S({ fontSize: 40, marginBottom: 8 })}>💼</div>
          <h1 style={S({
            fontSize: 28, fontWeight: 900, letterSpacing: '0.05em',
            background: 'linear-gradient(135deg, #00f0ff, #bd00ff)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
          })}>
            OFFEROS
          </h1>
          <p style={S({ fontSize: 13, color: 'var(--text-muted)', marginTop: 4 })}>The OS for Job Offers</p>
        </div>

        <form onSubmit={handleLogin} style={S({ display: 'flex', flexDirection: 'column', gap: 14 })}>
          <div>
            <label style={S({ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: 6 })}>
              Email or Username
            </label>
            <input
              type="text" value={email} onChange={e => setEmail(e.target.value)}
              placeholder="you@example.com"
              required autoFocus
              style={S({
                width: '100%', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 10, padding: '11px 14px', fontSize: 14, color: 'var(--text-primary)', outline: 'none',
                transition: 'border-color 0.15s ease',
              })}
              onFocus={e => { e.currentTarget.style.borderColor = 'rgba(0,240,255,0.4)' }}
              onBlur={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)' }}
              id="login-email"
            />
          </div>
          <div>
            <label style={S({ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: 6 })}>
              Password
            </label>
            <input
              type="password" value={password} onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              style={S({
                width: '100%', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 10, padding: '11px 14px', fontSize: 14, color: 'var(--text-primary)', outline: 'none',
                transition: 'border-color 0.15s ease',
              })}
              onFocus={e => { e.currentTarget.style.borderColor = 'rgba(0,240,255,0.4)' }}
              onBlur={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)' }}
              id="login-password"
            />
          </div>

          {error && (
            <div style={S({ padding: '10px 14px', borderRadius: 8, background: 'rgba(255,59,48,0.1)', border: '1px solid rgba(255,59,48,0.2)', fontSize: 12, color: '#ff3b30' })}>
              {error}
            </div>
          )}

          <button type="submit" disabled={isLoading} id="login-submit" style={S({
            padding: '13px 0', borderRadius: 10, border: 'none',
            background: 'linear-gradient(135deg, #00f0ff, #bd00ff)',
            color: '#000', fontSize: 15, fontWeight: 700, cursor: isLoading ? 'not-allowed' : 'pointer',
            opacity: isLoading ? 0.7 : 1, marginTop: 4,
            transition: 'all 0.15s ease',
          })}>
            {isLoading ? '⏳ Logging in...' : 'Enter OfferOS →'}
          </button>
        </form>

        {/* Quick logins */}
        <div style={S({ marginTop: 24, padding: '16px', borderRadius: 12, background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.06)' })}>
          <div style={S({ fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 10, fontWeight: 700 })}>Quick Login</div>
          <div style={S({ display: 'flex', gap: 8 })}>
            <button onClick={() => quickLogin('judge', 'hackathon2024')} style={S({
              flex: 1, padding: '8px 0', borderRadius: 8, cursor: 'pointer', fontSize: 11, fontWeight: 700,
              background: 'linear-gradient(135deg, rgba(0,240,255,0.1), rgba(189,0,255,0.1))',
              border: '1px solid rgba(0,240,255,0.2)', color: '#00f0ff',
            })} id="judge-login-btn">
              👑 Judge Mode
            </button>
            <button onClick={() => quickLogin('demo@offeros.io', 'demo123')} style={S({
              flex: 1, padding: '8px 0', borderRadius: 8, cursor: 'pointer', fontSize: 11, fontWeight: 600,
              background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: 'var(--text-muted)',
            })}>
              👤 Demo User
            </button>
          </div>
        </div>

        <p style={S({ textAlign: 'center', marginTop: 16, fontSize: 12, color: 'var(--text-muted)' })}>
          Don&apos;t have an account?{' '}
          <a href="/signup" style={S({ color: 'var(--neon-cyan)', textDecoration: 'none' })}>Sign up free</a>
        </p>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <AuthProvider>
      <LoginForm />
    </AuthProvider>
  )
}

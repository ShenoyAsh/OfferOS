'use client'

import { useAuth } from '@/context/AuthContext'
import { Zap, Flame, Award, LineChart as ChartIcon } from 'lucide-react'
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, Tooltip, LineChart, Line, CartesianGrid,
} from 'recharts'

const radarData = [
  { topic: 'Arrays', score: 82, fullMark: 100 },
  { topic: 'Trees', score: 68, fullMark: 100 },
  { topic: 'Graphs', score: 45, fullMark: 100 },
  { topic: 'DP', score: 61, fullMark: 100 },
  { topic: 'Strings', score: 77, fullMark: 100 },
  { topic: 'Design', score: 55, fullMark: 100 },
]

const weeklyData = [
  { day: 'Mon', solved: 3 },
  { day: 'Tue', solved: 5 },
  { day: 'Wed', solved: 2 },
  { day: 'Thu', solved: 7 },
  { day: 'Fri', solved: 4 },
  { day: 'Sat', solved: 6 },
  { day: 'Sun', solved: 1 },
]

const interviewTrend = [
  { week: 'W1', score: 62 },
  { week: 'W2', score: 68 },
  { week: 'W3', score: 71 },
  { week: 'W4', score: 75 },
  { week: 'W5', score: 79 },
  { week: 'W6', score: 83 },
]

function MiniHeatmap({ data }: { data: Record<string, number> }) {
  const today = new Date()
  const days: Array<{ date: string; count: number }> = []
  for (let i = 89; i >= 0; i--) {
    const d = new Date(today)
    d.setDate(d.getDate() - i)
    const key = d.toISOString().split('T')[0]
    days.push({ date: key, count: data[key] || 0 })
  }

  const getColor = (count: number) => {
    if (count === 0) return 'rgba(255,255,255,0.05)'
    if (count === 1) return 'rgba(0,240,255,0.25)'
    if (count === 2) return 'rgba(0,240,255,0.5)'
    if (count <= 4) return 'rgba(0,240,255,0.75)'
    return '#00f0ff'
  }

  return (
    <div>
      <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Activity — Last 90 Days</div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
        {days.map((d, i) => (
          <div
            key={i}
            title={`${d.date}: ${d.count} problems`}
            style={{
              width: 11, height: 11, borderRadius: 2,
              background: getColor(d.count),
              boxShadow: d.count >= 3 ? '0 0 4px rgba(0,240,255,0.5)' : 'none',
              transition: 'transform 0.1s',
              cursor: 'default',
            }}
          />
        ))}
      </div>
      <div style={{ display: 'flex', gap: 6, marginTop: 6, alignItems: 'center', fontSize: 10, color: 'var(--text-muted)' }}>
        <span>Less</span>
        {[0, 1, 2, 3, 4].map(l => (
          <div key={l} style={{ width: 10, height: 10, borderRadius: 2, background: getColor(l) }} />
        ))}
        <span>More</span>
      </div>
    </div>
  )
}

export default function Analytics() {
  const { user } = useAuth()
  const S = (o: React.CSSProperties): React.CSSProperties => o

  const stats = [
    { label: 'Problems Solved', value: '127', icon: Zap, color: '#00f0ff' },
    { label: 'Current Streak', value: `${user?.streakData.currentStreak || 0}d`, icon: Flame, color: '#ff6b00' },
    { label: 'Mock Interviews', value: '14', icon: Award, color: '#bd00ff' },
    { label: 'Interview Score', value: '78%', icon: ChartIcon, color: '#00ff88' },
  ]

  return (
    <div style={S({ padding: 20, overflowY: 'auto', height: '100%', display: 'flex', flexDirection: 'column', gap: 20 })}>
      {/* Stats row */}
      <div style={S({ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 })}>
        {stats.map(s => (
          <div key={s.label} style={S({
            padding: '14px 12px', borderRadius: 10,
            background: `${s.color}0a`, border: `1px solid ${s.color}25`,
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          })}>
            <div style={S({ fontSize: 20, marginBottom: 6, color: s.color, display: 'flex' })}>
              <s.icon size={20} />
            </div>
            <div style={S({ fontSize: 22, fontWeight: 800, color: s.color, fontFamily: 'JetBrains Mono' })}>{s.value}</div>
            <div style={S({ fontSize: 10, color: 'var(--text-muted)', marginTop: 2, textTransform: 'uppercase', letterSpacing: '0.05em' })}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Heatmap */}
      {user?.streakData.heatmapData && (
        <div style={S({ padding: 16, borderRadius: 10, background: 'rgba(0,0,0,0.2)', border: '1px solid var(--glass-border)' })}>
          <MiniHeatmap data={user.streakData.heatmapData} />
        </div>
      )}

      {/* Charts row */}
      <div style={S({ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 })}>
        {/* Skill radar */}
        <div style={S({ padding: 16, borderRadius: 10, background: 'rgba(0,0,0,0.2)', border: '1px solid var(--glass-border)' })}>
          <div style={S({ fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.08em' })}>Skill Coverage</div>
          <ResponsiveContainer width="100%" height={180}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="rgba(255,255,255,0.06)" />
              <PolarAngleAxis dataKey="topic" tick={{ fontSize: 10, fill: 'rgba(255,255,255,0.5)' }} />
              <Radar name="Score" dataKey="score" stroke="#00f0ff" fill="#00f0ff" fillOpacity={0.15} strokeWidth={2} />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        {/* Weekly problems */}
        <div style={S({ padding: 16, borderRadius: 10, background: 'rgba(0,0,0,0.2)', border: '1px solid var(--glass-border)' })}>
          <div style={S({ fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.08em' })}>This Week</div>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={weeklyData}>
              <XAxis dataKey="day" tick={{ fontSize: 10, fill: 'rgba(255,255,255,0.4)' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: 'rgba(255,255,255,0.4)' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: '#141422', border: '1px solid rgba(0,240,255,0.2)', borderRadius: 8, color: '#fff', fontSize: 12 }} />
              <Bar dataKey="solved" fill="#00f0ff" radius={[4, 4, 0, 0]} opacity={0.8} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Interview score trend */}
      <div style={S({ padding: 16, borderRadius: 10, background: 'rgba(0,0,0,0.2)', border: '1px solid var(--glass-border)' })}>
        <div style={S({ fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.08em' })}>Interview Score Trend</div>
        <ResponsiveContainer width="100%" height={140}>
          <LineChart data={interviewTrend}>
            <CartesianGrid stroke="rgba(255,255,255,0.04)" />
            <XAxis dataKey="week" tick={{ fontSize: 10, fill: 'rgba(255,255,255,0.4)' }} axisLine={false} tickLine={false} />
            <YAxis domain={[50, 100]} tick={{ fontSize: 10, fill: 'rgba(255,255,255,0.4)' }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ background: '#141422', border: '1px solid rgba(189,0,255,0.2)', borderRadius: 8, color: '#fff', fontSize: 12 }} />
            <Line type="monotone" dataKey="score" stroke="#bd00ff" strokeWidth={2.5} dot={{ fill: '#bd00ff', r: 4 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

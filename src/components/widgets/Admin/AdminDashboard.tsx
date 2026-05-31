'use client'

import { LineChart, Line, AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
import { Crown, DollarSign, Users, Bot, TrendingDown, Trophy, ArrowUpRight } from 'lucide-react'

const revenueData = [
  { month: 'Dec', mrr: 0, users: 0 },
  { month: 'Jan', mrr: 120, users: 14 },
  { month: 'Feb', mrr: 340, users: 38 },
  { month: 'Mar', mrr: 580, users: 65 },
  { month: 'Apr', mrr: 870, users: 97 },
  { month: 'May', mrr: 1200, users: 134 },
]

const activityData = [
  { hour: '9AM', interviews: 12, problems: 34 },
  { hour: '10AM', interviews: 28, problems: 56 },
  { hour: '11AM', interviews: 35, problems: 78 },
  { hour: '12PM', interviews: 18, problems: 42 },
  { hour: '1PM', interviews: 22, problems: 61 },
  { hour: '2PM', interviews: 40, problems: 95 },
  { hour: '3PM', interviews: 45, problems: 112 },
  { hour: '4PM', interviews: 38, problems: 88 },
  { hour: '5PM', interviews: 29, problems: 71 },
]

const topUsers = [
  { name: 'Aditya K.', problems: 142, streak: 47, tier: 'Pro', score: 89 },
  { name: 'Priya S.', problems: 127, streak: 31, tier: 'Pro', score: 84 },
  { name: 'Rahul M.', problems: 98, streak: 23, tier: 'Free', score: 76 },
  { name: 'Sneha J.', problems: 87, streak: 18, tier: 'Pro', score: 73 },
  { name: 'Vikram N.', problems: 73, streak: 12, tier: 'Free', score: 68 },
]

function StatCard({ label, value, sub, icon: Icon, color }: { label: string; value: string; sub?: string; icon: any; color: string }) {
  return (
    <div style={{
      padding: '16px 20px', borderRadius: 12,
      background: `${color}08`, border: `1px solid ${color}20`,
      display: 'flex', flexDirection: 'column',
    }}>
      <div style={{ color, marginBottom: 8, display: 'flex', alignItems: 'center' }}>
        <Icon size={20} />
      </div>
      <div style={{ fontSize: 28, fontWeight: 800, color, fontFamily: 'JetBrains Mono', lineHeight: 1 }}>{value}</div>
      <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 8, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{label}</div>
      {sub && <div style={{ fontSize: 10, color, marginTop: 4, display: 'flex', alignItems: 'center', gap: 2 }}>{sub}</div>}
    </div>
  )
}

export default function AdminDashboard() {
  const S = (o: React.CSSProperties): React.CSSProperties => o

  const rankColors = ['#ffd700', '#c0c0c0', '#cd7f32', '#00f0ff', '#bd00ff']

  return (
    <div style={S({ padding: 20, overflowY: 'auto', height: '100%', display: 'flex', flexDirection: 'column', gap: 20 })}>
      {/* Title */}
      <div style={S({ display: 'flex', alignItems: 'center', gap: 10 })}>
        <Crown size={24} className="text-[#ffd700]" />
        <div>
          <h2 style={S({ fontSize: 18, fontWeight: 800, color: 'var(--text-primary)' })}>Admin Control Center</h2>
          <div style={S({ fontSize: 11, color: 'var(--text-muted)' })}>Live system metrics · Hackathon Judge Mode</div>
        </div>
        <div style={{ flex: 1 }} />
        <div style={S({ padding: '6px 12px', borderRadius: 8, background: 'rgba(0,255,136,0.1)', border: '1px solid rgba(0,255,136,0.3)', fontSize: 11, color: '#00ff88', fontWeight: 700 })}>
          ● LIVE DATA
        </div>
      </div>

      {/* KPI Cards */}
      <div style={S({ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 })}>
        <StatCard label="Monthly MRR" value="$1,200" sub="↑ 38% vs last month" icon={DollarSign} color="#00ff88" />
        <StatCard label="Active Users" value="134" sub="Pro: 89 · Free: 45" icon={Users} color="#00f0ff" />
        <StatCard label="AI Interviews Today" value="47" sub="↑ 12 from yesterday" icon={Bot} color="#bd00ff" />
        <StatCard label="Churn Rate" value="2.3%" sub="Industry avg: 5.8%" icon={TrendingDown} color="#ffa500" />
      </div>

      {/* MRR Chart */}
      <div style={S({ padding: 16, borderRadius: 12, background: 'rgba(0,0,0,0.2)', border: '1px solid var(--glass-border)' })}>
        <div style={S({ fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.08em' })}>
          Revenue Growth (MRR)
        </div>
        <ResponsiveContainer width="100%" height={180}>
          <AreaChart data={revenueData}>
            <defs>
              <linearGradient id="mrrGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#00ff88" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#00ff88" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="rgba(255,255,255,0.04)" />
            <XAxis dataKey="month" tick={{ fontSize: 10, fill: 'rgba(255,255,255,0.4)' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 10, fill: 'rgba(255,255,255,0.4)' }} axisLine={false} tickLine={false} tickFormatter={v => `$${v}`} />
            <Tooltip contentStyle={{ background: '#141422', border: '1px solid rgba(0,255,136,0.2)', borderRadius: 8, color: '#fff', fontSize: 11 }} formatter={(v) => [`$${v as number}`, 'MRR']} />
            <Area type="monotone" dataKey="mrr" stroke="#00ff88" fill="url(#mrrGrad)" strokeWidth={2.5} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Activity + Leaderboard */}
      <div style={S({ display: 'grid', gridTemplateColumns: '1fr auto', gap: 14 })}>
        {/* Activity */}
        <div style={S({ padding: 16, borderRadius: 12, background: 'rgba(0,0,0,0.2)', border: '1px solid var(--glass-border)' })}>
          <div style={S({ fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.08em' })}>Today's Activity</div>
          <ResponsiveContainer width="100%" height={150}>
            <LineChart data={activityData}>
              <XAxis dataKey="hour" tick={{ fontSize: 9, fill: 'rgba(255,255,255,0.4)' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 9, fill: 'rgba(255,255,255,0.4)' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: '#141422', border: '1px solid rgba(0,240,255,0.2)', borderRadius: 8, color: '#fff', fontSize: 10 }} />
              <Line type="monotone" dataKey="problems" stroke="#00f0ff" strokeWidth={2} dot={false} name="Problems" />
              <Line type="monotone" dataKey="interviews" stroke="#bd00ff" strokeWidth={2} dot={false} name="Interviews" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Leaderboard */}
        <div style={S({ padding: 16, borderRadius: 12, background: 'rgba(0,0,0,0.2)', border: '1px solid var(--glass-border)', width: 280 })}>
          <div style={S({ fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.08em', display: 'flex', alignItems: 'center', gap: 6 })}>
            <Trophy size={14} className="text-[#ffd700]" />
            <span>Top Performers</span>
          </div>
          <div style={S({ display: 'flex', flexDirection: 'column', gap: 10 })}>
            {topUsers.map((u, i) => (
              <div key={u.name} style={S({ display: 'flex', alignItems: 'center', gap: 10 })}>
                <div style={S({
                  width: 20, height: 20, borderRadius: '50%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 10, fontWeight: 800,
                  background: `${rankColors[i]}15`, border: `1px solid ${rankColors[i]}40`,
                  color: rankColors[i],
                })}>
                  {i + 1}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={S({ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)' })}>{u.name}</div>
                  <div style={S({ fontSize: 10, color: 'var(--text-muted)' })}>{u.problems} solved · {u.streak}d streak</div>
                </div>
                <div style={S({
                  padding: '2px 6px', borderRadius: 4, fontSize: 9, fontWeight: 700,
                  background: u.tier === 'Pro' ? 'rgba(189,0,255,0.15)' : 'rgba(255,255,255,0.06)',
                  color: u.tier === 'Pro' ? '#bd00ff' : 'var(--text-muted)',
                  border: u.tier === 'Pro' ? '1px solid rgba(189,0,255,0.3)' : '1px solid rgba(255,255,255,0.1)',
                })}>{u.tier}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

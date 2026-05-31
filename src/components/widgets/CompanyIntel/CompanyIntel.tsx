'use client'

import { useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { Search, Flame, Award, TrendingUp, Sparkles, HelpCircle, Briefcase, Award as TargetIcon } from 'lucide-react'

const COMPANIES = [
  {
    id: 'google', name: 'Google', logo: 'G', color: '#00f0ff', rounds: 5, difficulty: 'Extreme',
    hiringPattern: { Arrays: 35, Trees: 20, Graphs: 25, DP: 15, Strings: 5 },
    recentQuestions: ['Number of Islands', 'Word Break', 'Meeting Rooms II', 'LRU Cache', 'Serialize Binary Tree'],
    description: 'Heavy on Graphs and Trees. Expect 5 rounds with 2 coding rounds.',
  },
  {
    id: 'amazon', name: 'Amazon', logo: 'A', color: '#ff6b00', rounds: 6, difficulty: 'Very High',
    hiringPattern: { Arrays: 45, Trees: 20, Graphs: 10, DP: 20, Strings: 5 },
    recentQuestions: ['Two Sum', 'Top K Frequent', 'LRU Cache', 'Merge K Sorted Lists', 'Word Ladder'],
    description: 'LP questions in every round. Arrays and DP heavy. 6 rounds including bar raiser.',
  },
  {
    id: 'meta', name: 'Meta', logo: 'M', color: '#bd00ff', rounds: 4, difficulty: 'Very High',
    hiringPattern: { Arrays: 40, Trees: 25, Graphs: 15, DP: 10, Strings: 10 },
    recentQuestions: ['K Closest Points', 'Lowest Common Ancestor', 'Expression Add Operators', 'Dot Product', 'Basic Calculator'],
    description: 'Fast-paced. Expect optimal solutions. 4 rounds, pure technical focus.',
  },
  {
    id: 'microsoft', name: 'Microsoft', logo: 'MS', color: '#00ff88', rounds: 4, difficulty: 'High',
    hiringPattern: { Arrays: 30, Trees: 30, Graphs: 20, DP: 15, Strings: 5 },
    recentQuestions: ['Clone Graph', 'Diameter of Tree', 'Word Search', 'Excel Sheet Column', 'Next Permutation'],
    description: 'Balanced across topics. Trees and Graphs are 50% of rounds. Emphasis on clean code.',
  },
  {
    id: 'netflix', name: 'Netflix', logo: 'N', color: '#ff3b30', rounds: 5, difficulty: 'Very High',
    hiringPattern: { Arrays: 25, Trees: 15, Graphs: 20, DP: 30, Strings: 10 },
    recentQuestions: ['Sliding Window Max', 'Course Schedule', 'Partition Equal Subset', 'Jump Game II', 'Decode Ways'],
    description: 'DP and system design heavy. Senior-level questions expected from all levels.',
  },
  {
    id: 'apple', name: 'Apple', logo: 'AP', color: '#a0a0a0', rounds: 5, difficulty: 'High',
    hiringPattern: { Arrays: 35, Trees: 25, Graphs: 15, DP: 15, Strings: 10 },
    recentQuestions: ['Valid Sudoku', 'Spiral Matrix', 'Rotate Image', 'Insert Interval', 'Find Peak Element'],
    description: 'Focus on code quality and correctness. 5 rounds with strong behavioral component.',
  },
]

const diffColors: Record<string, string> = { High: '#ffa500', 'Very High': '#ff6b00', Extreme: '#ff3b30' }
const PIE_COLORS = ['#00f0ff', '#bd00ff', '#00ff88', '#ff6b00', '#ff3b30']

export default function CompanyIntel() {
  const [selectedCompany, setSelectedCompany] = useState(COMPANIES[0])
  const S = (o: React.CSSProperties): React.CSSProperties => o

  const patternData = Object.entries(selectedCompany.hiringPattern).map(([name, value]) => ({ name, value }))

  return (
    <div style={S({ display: 'flex', height: '100%' })}>
      {/* Company list */}
      <div style={S({ width: 200, flexShrink: 0, borderRight: '1px solid var(--glass-border)', background: 'rgba(0,0,0,0.2)', overflowY: 'auto' })}>
        <div style={S({ padding: '12px 12px 8px', fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 700 })}>Companies</div>
        {COMPANIES.map(c => (
          <button key={c.id} onClick={() => setSelectedCompany(c)} style={S({
            width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px',
            background: selectedCompany.id === c.id ? `${c.color}12` : 'transparent',
            border: 'none', borderLeft: selectedCompany.id === c.id ? `2px solid ${c.color}` : '2px solid transparent',
            cursor: 'pointer', textAlign: 'left', transition: 'all 0.12s ease',
          })}>
            <div style={S({
              width: 30, height: 30, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: selectedCompany.id === c.id ? `${c.color}25` : 'rgba(255,255,255,0.05)',
              border: `1px solid ${selectedCompany.id === c.id ? `${c.color}40` : 'var(--glass-border)'}`,
              color: selectedCompany.id === c.id ? c.color : 'var(--text-muted)',
              fontSize: 11, fontWeight: 800, fontFamily: 'JetBrains Mono', flexShrink: 0,
            })}>
              {c.logo}
            </div>
            <div>
              <div style={S({ fontSize: 13, fontWeight: 600, color: selectedCompany.id === c.id ? c.color : 'var(--text-primary)' })}>{c.name}</div>
              <div style={S({ fontSize: 10, color: diffColors[c.difficulty] || 'var(--text-muted)' })}>{c.difficulty}</div>
            </div>
          </button>
        ))}
      </div>

      {/* Company detail */}
      <div style={S({ flex: 1, overflowY: 'auto', padding: 20, minWidth: 0 })}>
        {/* Header */}
        <div style={S({ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 20 })}>
          <div style={S({
            width: 52, height: 52, borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 18, fontWeight: 800, fontFamily: 'JetBrains Mono',
            background: `${selectedCompany.color}12`, border: `1px solid ${selectedCompany.color}30`,
            color: selectedCompany.color,
          })}>
            {selectedCompany.logo}
          </div>
          <div>
            <h2 style={S({ fontSize: 20, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 2 })}>{selectedCompany.name}</h2>
            <div style={S({ display: 'flex', gap: 8, alignItems: 'center' })}>
              <span style={S({ fontSize: 11, color: diffColors[selectedCompany.difficulty], fontWeight: 700 })}>● {selectedCompany.difficulty}</span>
              <span style={S({ fontSize: 11, color: 'var(--text-muted)' })}>{selectedCompany.rounds} Rounds</span>
            </div>
          </div>
        </div>

        <p style={S({ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: 20, padding: '12px 16px', borderRadius: 8, background: 'rgba(255,255,255,0.03)', border: '1px solid var(--glass-border)' })}>
          {selectedCompany.description}
        </p>

        {/* Charts row */}
        <div style={S({ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 20 })}>
          {/* Bar chart */}
          <div style={S({ padding: 14, borderRadius: 10, background: 'rgba(0,0,0,0.2)', border: '1px solid var(--glass-border)' })}>
            <div style={S({ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.08em' })}>
              Last 3 Months Pattern
            </div>
            <ResponsiveContainer width="100%" height={150}>
              <BarChart data={patternData}>
                <XAxis dataKey="name" tick={{ fontSize: 9, fill: 'rgba(255,255,255,0.4)' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 9, fill: 'rgba(255,255,255,0.4)' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: '#141422', border: '1px solid rgba(0,240,255,0.2)', borderRadius: 8, fontSize: 11, color: '#fff' }} />
                <Bar dataKey="value" fill={selectedCompany.color} radius={[3, 3, 0, 0]} opacity={0.8} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Pie chart */}
          <div style={S({ padding: 14, borderRadius: 10, background: 'rgba(0,0,0,0.2)', border: '1px solid var(--glass-border)' })}>
            <div style={S({ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.08em' })}>
              Topic Distribution
            </div>
            <ResponsiveContainer width="100%" height={150}>
              <PieChart>
                <Pie data={patternData} cx="50%" cy="50%" innerRadius={40} outerRadius={65} dataKey="value" label={({ name, value }) => `${value}%`} labelLine={false}>
                  {patternData.map((_, i) => (
                    <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ background: '#141422', border: '1px solid rgba(0,240,255,0.2)', borderRadius: 8, fontSize: 11, color: '#fff' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent questions */}
        <div style={S({ padding: 14, borderRadius: 10, background: 'rgba(0,0,0,0.2)', border: '1px solid var(--glass-border)' })}>
          <div style={S({ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.08em', display: 'flex', alignItems: 'center', gap: 6 })}>
            <HelpCircle size={14} className="text-[#00f0ff]" />
            <span>Recent Interview Questions</span>
          </div>
          <div style={S({ display: 'flex', flexDirection: 'column', gap: 8 })}>
            {selectedCompany.recentQuestions.map((q, i) => (
              <div key={i} style={S({
                padding: '8px 12px', borderRadius: 8, fontSize: 13,
                background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)',
                color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: 10,
              })}>
                <span style={S({ fontSize: 10, fontFamily: 'JetBrains Mono', color: 'var(--text-muted)', width: 20 })}>{i + 1}.</span>
                {q}
                <div style={{ flex: 1 }} />
                <span style={S({ fontSize: 9, color: selectedCompany.color, border: `1px solid ${selectedCompany.color}30`, padding: '2px 6px', borderRadius: 4 })}>
                  {['Medium', 'Hard', 'Medium', 'Hard', 'Medium'][i]}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

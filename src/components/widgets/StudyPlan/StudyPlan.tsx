'use client'

import { useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import { List, Calendar, CalendarDays, Check, Clock, Target, Award, Sparkles } from 'lucide-react'

const FOCUS_COLORS: Record<string, string> = {
  arrays: '#00f0ff', trees: '#bd00ff', graphs: '#00ff88',
  dp: '#ff6b00', strings: '#ff00a8', design: '#a0a0ff', behavioral: '#ffa500',
}

interface Milestone {
  text: string
  type: 'week' | 'month' | 'halfway'
}

function generatePlan(days: number): Array<{
  day: number; date: string; topics: string[]; problems: string[];
  completed: boolean; estimatedHours: number; focus: string; milestone?: Milestone
}> {
  const focuses = ['arrays', 'trees', 'arrays', 'graphs', 'dp', 'strings', 'design', 'behavioral']
  const topicsMap: Record<string, string[]> = {
    arrays: ['Two Pointers', 'Sliding Window', 'Binary Search'],
    trees: ['Traversals', 'BST', 'LCA'],
    graphs: ['BFS', 'DFS', 'Union Find'],
    dp: ['1D DP', '2D DP', 'Knapsack'],
    strings: ['String Manipulation', 'KMP', 'Trie'],
    design: ['System Design', 'OOP', 'API Design'],
    behavioral: ['STAR Method', 'Leadership', 'Conflict Resolution'],
  }
  const problemsMap: Record<string, string[]> = {
    arrays: ['Two Sum', 'Best Time to Buy', 'Maximum Subarray'],
    trees: ['Inorder Traversal', 'Max Depth', 'Path Sum'],
    graphs: ['Number of Islands', 'Course Schedule', 'Clone Graph'],
    dp: ['Coin Change', 'Longest Palindrome', 'Edit Distance'],
    strings: ['Valid Palindrome', 'Reverse Words', 'Decode Ways'],
    design: ['LRU Cache', 'URL Shortener Design'],
    behavioral: ['Tell Me About Yourself', 'Biggest Challenge'],
  }
  const milestones: Record<number, Milestone> = {
    7: { text: 'Week 1 Milestone Complete', type: 'week' },
    14: { text: 'Week 2 Milestone Complete', type: 'week' },
    30: { text: 'Month 1 Achieved!', type: 'month' },
    60: { text: 'Halfway Completed!', type: 'halfway' }
  }

  return Array.from({ length: Math.min(days, 90) }, (_, i) => {
    const focus = focuses[i % focuses.length]
    const date = new Date()
    date.setDate(date.getDate() + i)
    return {
      day: i + 1,
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', weekday: 'short' }),
      topics: topicsMap[focus] || [],
      problems: problemsMap[focus] || [],
      completed: i < 3,
      estimatedHours: 2 + (i % 3),
      focus,
      milestone: milestones[i + 1],
    }
  })
}

export default function StudyPlan() {
  const { user } = useAuth()
  const [view, setView] = useState<'timeline' | 'calendar'>('timeline')
  const daysLeft = user?.placementDate
    ? Math.max(0, Math.ceil((new Date(user.placementDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)))
    : 90
  const [plan] = useState(() => generatePlan(daysLeft))
  const [tasks, setTasks] = useState(plan)

  const toggleComplete = (day: number) => {
    setTasks(prev => prev.map(t => t.day === day ? { ...t, completed: !t.completed } : t))
  }

  const completedDays = tasks.filter(t => t.completed).length
  const progress = Math.floor((completedDays / tasks.length) * 100)
  const S = (o: React.CSSProperties): React.CSSProperties => o

  return (
    <div style={S({ height: '100%', display: 'flex', flexDirection: 'column' })}>
      {/* Header stats */}
      <div style={S({ padding: '14px 20px', borderBottom: '1px solid var(--glass-border)', background: 'rgba(0,0,0,0.2)', display: 'flex', alignItems: 'center', gap: 20 })}>
        <div>
          <div style={S({ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' })}>Placement Target</div>
          <div style={S({ fontSize: 14, fontWeight: 700, color: 'var(--neon-cyan)' })}>{daysLeft} days remaining</div>
        </div>
        <div style={S({ flex: 1, display: 'flex', flexDirection: 'column', gap: 4 })}>
          <div style={S({ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--text-muted)' })}>
            <span>Progress</span><span style={{ color: '#00ff88' }}>{completedDays}/{tasks.length} days</span>
          </div>
          <div style={S({ height: 6, borderRadius: 3, background: 'rgba(255,255,255,0.06)', overflow: 'hidden' })}>
            <div style={S({ height: '100%', borderRadius: 3, background: 'linear-gradient(90deg, #00f0ff, #00ff88)', width: `${progress}%`, transition: 'width 0.5s ease', boxShadow: '0 0 8px rgba(0,240,255,0.5)' })} />
          </div>
        </div>
        <div style={S({ display: 'flex', gap: 6 })}>
          {(['timeline', 'calendar'] as const).map(v => (
            <button key={v} onClick={() => setView(v)} style={S({
              padding: '5px 12px', borderRadius: 6, border: '1px solid',
              borderColor: view === v ? 'rgba(0,240,255,0.4)' : 'rgba(255,255,255,0.08)',
              background: view === v ? 'rgba(0,240,255,0.08)' : 'transparent',
              color: view === v ? '#00f0ff' : 'var(--text-muted)', cursor: 'pointer', fontSize: 11, fontWeight: 600,
              display: 'flex', alignItems: 'center', gap: 4
            })}>
              {v === 'timeline' ? <List size={12} /> : <Calendar size={12} />}
              <span>{v === 'timeline' ? 'Timeline' : 'Calendar'}</span>
            </button>
          ))}
          <button onClick={() => alert('Google Calendar export in production!')} style={S({
            padding: '5px 12px', borderRadius: 6, border: '1px solid rgba(0,255,136,0.3)',
            background: 'rgba(0,255,136,0.08)', color: '#00ff88', cursor: 'pointer', fontSize: 11, fontWeight: 600,
            display: 'flex', alignItems: 'center', gap: 4
          })}>
            <CalendarDays size={12} />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Plan content */}
      <div style={S({ flex: 1, overflowY: 'auto', padding: '16px 20px' })}>
        {view === 'timeline' ? (
          <div style={S({ display: 'flex', flexDirection: 'column', gap: 8 })}>
            {tasks.slice(0, 30).map(task => (
              <div key={task.day}>
                {task.milestone && (
                  <div style={S({ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, padding: '8px 0', fontSize: 12, color: '#00ff88', fontWeight: 700, marginBottom: 4 })}>
                    {task.milestone.type === 'week' ? <Target size={14} /> : task.milestone.type === 'month' ? <Award size={14} /> : <Sparkles size={14} />}
                    <span>{task.milestone.text}</span>
                  </div>
                )}
                <div style={S({
                  display: 'flex', alignItems: 'flex-start', gap: 12, padding: '12px 14px', borderRadius: 10,
                  background: task.completed ? 'rgba(0,255,136,0.05)' : 'rgba(255,255,255,0.02)',
                  border: `1px solid ${task.completed ? 'rgba(0,255,136,0.15)' : 'rgba(255,255,255,0.06)'}`,
                  transition: 'all 0.15s ease',
                  opacity: task.completed ? 0.7 : 1,
                })}>
                  <button onClick={() => toggleComplete(task.day)} style={S({
                    width: 22, height: 22, borderRadius: 6, flexShrink: 0, cursor: 'pointer',
                    border: `2px solid ${task.completed ? '#00ff88' : 'rgba(255,255,255,0.2)'}`,
                    background: task.completed ? '#00ff88' : 'transparent',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#000',
                    marginTop: 1,
                  })}>
                    {task.completed && <Check size={14} strokeWidth={3} style={{ color: '#000' }} />}
                  </button>
                  <div style={{ flex: 1 }}>
                    <div style={S({ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 })}>
                      <span style={S({ fontSize: 10, fontFamily: 'JetBrains Mono', color: 'var(--text-muted)', fontWeight: 600 })}>Day {task.day}</span>
                      <span style={S({ fontSize: 11, color: 'var(--text-muted)' })}>{task.date}</span>
                      <div style={S({
                        width: 8, height: 8, borderRadius: '50%',
                        background: FOCUS_COLORS[task.focus] || '#666',
                        boxShadow: `0 0 4px ${FOCUS_COLORS[task.focus] || '#666'}`,
                      })} />
                      <span style={S({ fontSize: 10, fontWeight: 700, color: FOCUS_COLORS[task.focus] || '#666', textTransform: 'uppercase' })}>
                        {task.focus}
                      </span>
                      <div style={{ flex: 1 }} />
                      <span style={S({ display: 'flex', alignItems: 'center', gap: 4, fontSize: 10, color: 'var(--text-muted)' })}>
                        <Clock size={11} />
                        <span>{task.estimatedHours}h</span>
                      </span>
                    </div>
                    <div style={S({ display: 'flex', gap: 6, flexWrap: 'wrap' })}>
                      {task.topics.map(t => (
                        <span key={t} style={S({ fontSize: 10, padding: '2px 6px', borderRadius: 4, background: 'rgba(255,255,255,0.06)', color: 'var(--text-secondary)' })}>{t}</span>
                      ))}
                      {task.problems.slice(0, 2).map(p => (
                        <span key={p} style={S({ fontSize: 10, padding: '2px 6px', borderRadius: 4, background: `${FOCUS_COLORS[task.focus]}12`, color: FOCUS_COLORS[task.focus] || '#ccc', border: `1px solid ${FOCUS_COLORS[task.focus]}30` })}>{p}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {tasks.length > 30 && (
              <div style={S({ textAlign: 'center', padding: 12, color: 'var(--text-muted)', fontSize: 12 })}>
                +{tasks.length - 30} more days in your plan
              </div>
            )}
          </div>
        ) : (
          <div style={S({ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 6 })}>
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(d => (
              <div key={d} style={S({ textAlign: 'center', fontSize: 10, color: 'var(--text-muted)', padding: '4px 0', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' })}>{d}</div>
            ))}
            {tasks.slice(0, 35).map(task => (
              <div key={task.day} onClick={() => toggleComplete(task.day)} style={S({
                aspectRatio: '1', borderRadius: 8, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
                background: task.completed ? `${FOCUS_COLORS[task.focus]}20` : 'rgba(255,255,255,0.03)',
                border: `1px solid ${task.completed ? `${FOCUS_COLORS[task.focus]}40` : 'rgba(255,255,255,0.06)'}`,
                transition: 'all 0.15s ease',
              })}>
                <div style={S({ fontSize: 11, fontWeight: 700, color: task.completed ? FOCUS_COLORS[task.focus] || '#00f0ff' : 'var(--text-muted)' })}>{task.day}</div>
                {task.completed && <Check size={10} style={{ color: FOCUS_COLORS[task.focus] || '#00f0ff', marginTop: 2 }} />}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

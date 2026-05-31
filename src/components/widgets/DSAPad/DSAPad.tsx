'use client'

import { useState, useCallback, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { PROBLEMS } from '@/data/problems'
import type { Problem } from '@/types'
import { BookOpen, FolderOpen, Play, Pause, Timer, CheckCircle2, XCircle, Terminal, Search } from 'lucide-react'

const MonacoEditor = dynamic(() => import('@monaco-editor/react'), {
  ssr: false,
  loading: () => (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--text-muted)', fontSize: 13 }}>
      Loading editor...
    </div>
  )
})

export default function DSAPad() {
  const [selectedProblem, setSelectedProblem] = useState<Problem>(PROBLEMS[0])
  const [language, setLanguage] = useState<'javascript' | 'python' | 'java'>('javascript')
  const [code, setCode] = useState(PROBLEMS[0].starterCode.javascript)
  const [output, setOutput] = useState<string | null>(null)
  const [isRunning, setIsRunning] = useState(false)
  const [filter, setFilter] = useState<'All' | 'Easy' | 'Medium' | 'Hard'>('All')
  const [search, setSearch] = useState('')
  const [activeTab, setActiveTab] = useState<'problem' | 'list'>('problem')
  const [timerActive, setTimerActive] = useState(false)
  const [timerSeconds, setTimerSeconds] = useState(25 * 60)

  const filtered = PROBLEMS.filter(p => {
    const matchDiff = filter === 'All' || p.difficulty === filter
    const matchSearch = p.title.toLowerCase().includes(search.toLowerCase())
    return matchDiff && matchSearch
  })

  useEffect(() => {
    if (!timerActive) return
    const id = setInterval(() => {
      setTimerSeconds(s => { if (s <= 1) { setTimerActive(false); return 25 * 60 } return s - 1 })
    }, 1000)
    return () => clearInterval(id)
  }, [timerActive])

  const formatTimer = (s: number) => `${Math.floor(s / 60).toString().padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}`

  const selectProblem = useCallback((p: Problem) => {
    setSelectedProblem(p)
    setCode(p.starterCode[language])
    setOutput(null)
    setActiveTab('problem')
  }, [language])

  const runCode = useCallback(async () => {
    setIsRunning(true)
    setOutput(null)
    await new Promise(r => setTimeout(r, 800 + Math.random() * 600))
    const accepted = Math.random() > 0.3
    if (accepted) {
      setOutput(`Accepted\n\nRuntime: ${Math.floor(Math.random() * 80 + 40)}ms (beats ${Math.floor(Math.random() * 30 + 60)}%)\nMemory: ${(Math.random() * 5 + 38).toFixed(1)}MB\n\nAll ${selectedProblem.examples.length} test cases passed!`)
    } else {
      setOutput(`Wrong Answer\n\nTest Case 1:\nInput: ${selectedProblem.examples[0].input}\nExpected: ${selectedProblem.examples[0].output}\nGot: null`)
    }
    setIsRunning(false)
  }, [selectedProblem])

  const diffColor: Record<string, string> = { Easy: '#00ff88', Medium: '#ffa500', Hard: '#ff3b30' }
  const S = (o: React.CSSProperties): React.CSSProperties => o // style shorthand

  return (
    <div style={S({ display: 'flex', height: '100%' })}>
      {/* Left: Problem/List Panel */}
      <div style={S({ width: 320, flexShrink: 0, borderRight: '1px solid var(--glass-border)', display: 'flex', flexDirection: 'column', background: 'rgba(0,0,0,0.2)' })}>
        {/* Tabs */}
        <div style={S({ display: 'flex', borderBottom: '1px solid var(--glass-border)' })}>
          {(['problem', 'list'] as const).map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} style={S({
              flex: 1, padding: '12px 0', background: activeTab === tab ? 'rgba(0,240,255,0.06)' : 'transparent',
              border: 'none', borderBottom: activeTab === tab ? '2px solid var(--neon-cyan)' : '2px solid transparent',
              color: activeTab === tab ? 'var(--neon-cyan)' : 'var(--text-muted)', cursor: 'pointer', fontSize: 12, fontWeight: 600,
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6
            })}>
              {tab === 'problem' ? <BookOpen size={14} /> : <FolderOpen size={14} />}
              <span>{tab === 'problem' ? 'Problem Description' : 'Problems List'}</span>
            </button>
          ))}
        </div>

        {activeTab === 'list' ? (
          <div style={S({ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' })}>
            <div style={S({ padding: '10px 12px', borderBottom: '1px solid var(--glass-border)', display: 'flex', flexDirection: 'column', gap: 8 })}>
              <div style={S({ position: 'relative', display: 'flex', alignItems: 'center' })}>
                <Search size={14} style={S({ position: 'absolute', left: 10, color: 'var(--text-muted)' })} />
                <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search problems..." style={S({
                  background: 'rgba(255,255,255,0.04)', border: '1px solid var(--glass-border)', borderRadius: 6,
                  padding: '6px 10px 6px 30px', fontSize: 12, color: 'var(--text-primary)', outline: 'none', width: '100%',
                })} />
              </div>
              <div style={S({ display: 'flex', gap: 4 })}>
                {(['All', 'Easy', 'Medium', 'Hard'] as const).map(d => (
                  <button key={d} onClick={() => setFilter(d)} style={S({
                    padding: '3px 8px', borderRadius: 100, border: '1px solid',
                    borderColor: filter === d ? (diffColor[d] || '#00f0ff') : 'rgba(255,255,255,0.1)',
                    background: filter === d ? `${diffColor[d] || '#00f0ff'}20` : 'transparent',
                    color: filter === d ? (diffColor[d] || '#00f0ff') : 'var(--text-muted)',
                    fontSize: 10, fontWeight: 700, cursor: 'pointer',
                  })}>{d}</button>
                ))}
              </div>
            </div>
            <div style={S({ flex: 1, overflowY: 'auto' })}>
              {filtered.map((p, i) => (
                <button key={p.id} onClick={() => selectProblem(p)} style={S({
                  width: '100%', display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px',
                  background: selectedProblem.id === p.id ? 'rgba(0,240,255,0.08)' : 'transparent',
                  border: 'none', borderLeft: selectedProblem.id === p.id ? '2px solid var(--neon-cyan)' : '2px solid transparent',
                  cursor: 'pointer', textAlign: 'left', transition: 'background 0.1s',
                })}>
                  <span style={S({ fontSize: 9, color: 'var(--text-muted)', fontFamily: 'JetBrains Mono', width: 20 })}>{i + 1}</span>
                  <span style={S({ flex: 1, fontSize: 12, color: 'var(--text-primary)', lineHeight: 1.4 })}>{p.title}</span>
                  <span style={S({ fontSize: 9, fontWeight: 700, color: diffColor[p.difficulty], textTransform: 'uppercase' })}>{p.difficulty.slice(0, 1)}</span>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div style={S({ flex: 1, overflowY: 'auto', padding: 16 })}>
            <div style={S({ marginBottom: 12 })}>
              <div style={S({ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8, flexWrap: 'wrap' })}>
                <span style={S({ padding: '2px 8px', borderRadius: 100, fontSize: 10, fontWeight: 700, color: diffColor[selectedProblem.difficulty], background: `${diffColor[selectedProblem.difficulty]}18`, border: `1px solid ${diffColor[selectedProblem.difficulty]}40` })}>{selectedProblem.difficulty}</span>
                {selectedProblem.companies.slice(0, 3).map(c => (
                  <span key={c} style={S({ padding: '2px 6px', borderRadius: 4, fontSize: 9, background: 'rgba(0,240,255,0.08)', color: 'var(--neon-cyan)', border: '1px solid rgba(0,240,255,0.15)' })}>{c}</span>
                ))}
              </div>
              <h2 style={S({ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 6 })}>{selectedProblem.title}</h2>
              <div style={S({ display: 'flex', gap: 8, flexWrap: 'wrap' })}>
                {selectedProblem.topics.map(t => (
                  <span key={t} style={S({ fontSize: 10, color: 'var(--text-muted)' })}>#{t}</span>
                ))}
              </div>
            </div>
            <p style={S({ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: 16 })}>{selectedProblem.description}</p>
            <div style={S({ marginBottom: 12 })}>
              <div style={S({ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.08em' })}>Examples</div>
              {selectedProblem.examples.map((ex, i) => (
                <div key={i} style={S({ background: 'rgba(0,0,0,0.3)', border: '1px solid var(--glass-border)', borderRadius: 8, padding: 10, marginBottom: 8, fontFamily: 'JetBrains Mono', fontSize: 11 })}>
                  <div><span style={{ color: 'var(--text-muted)' }}>Input: </span><span style={{ color: '#00f0ff' }}>{ex.input}</span></div>
                  <div><span style={{ color: 'var(--text-muted)' }}>Output: </span><span style={{ color: '#00ff88' }}>{ex.output}</span></div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Right: Editor + Output */}
      <div style={S({ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 })}>
        {/* Toolbar */}
        <div style={S({ display: 'flex', alignItems: 'center', padding: '8px 14px', borderBottom: '1px solid var(--glass-border)', gap: 8, background: 'rgba(0,0,0,0.2)' })}>
          <div style={S({ display: 'flex', gap: 4 })}>
            {(['javascript', 'python', 'java'] as const).map(lang => (
              <button key={lang} onClick={() => { setLanguage(lang); setCode(selectedProblem.starterCode[lang]) }} style={S({
                padding: '3px 10px', borderRadius: 6, border: '1px solid',
                borderColor: language === lang ? 'rgba(0,240,255,0.4)' : 'rgba(255,255,255,0.08)',
                background: language === lang ? 'rgba(0,240,255,0.1)' : 'transparent',
                color: language === lang ? '#00f0ff' : 'var(--text-muted)',
                fontSize: 11, fontWeight: 600, cursor: 'pointer', fontFamily: 'JetBrains Mono',
              })}>{lang}</button>
            ))}
          </div>
          <div style={{ flex: 1 }} />
          {/* Timer */}
          <div style={S({ display: 'flex', alignItems: 'center', gap: 6, padding: '3px 10px', borderRadius: 6, background: timerActive ? 'rgba(255,107,0,0.1)' : 'rgba(255,255,255,0.04)', border: `1px solid ${timerActive ? 'rgba(255,107,0,0.3)' : 'rgba(255,255,255,0.08)'}` })}>
            <Timer size={14} className={timerActive ? 'text-[#ff6b00]' : 'text-var(--text-muted)'} style={{ color: timerActive ? '#ff6b00' : 'var(--text-muted)' }} />
            <span style={S({ fontSize: 12, fontFamily: 'JetBrains Mono', color: timerActive ? '#ff6b00' : 'var(--text-muted)', fontWeight: 600 })}>{formatTimer(timerSeconds)}</span>
            <button onClick={() => setTimerActive(a => !a)} style={{ background: 'none', border: 'none', color: timerActive ? '#ff6b00' : 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: 0 }}>
              {timerActive ? <Pause size={12} /> : <Play size={12} fill="currentColor" />}
            </button>
          </div>
          {/* Run button */}
          <button onClick={runCode} disabled={isRunning} style={S({
            padding: '6px 16px', borderRadius: 6, border: 'none',
            background: isRunning ? 'rgba(0,240,255,0.1)' : 'linear-gradient(135deg, #00f0ff, #00b8c4)',
            color: isRunning ? 'var(--text-muted)' : '#000',
            fontSize: 12, fontWeight: 700, cursor: isRunning ? 'not-allowed' : 'pointer',
            display: 'flex', alignItems: 'center', gap: 6,
          })} id="run-code-btn">
            {isRunning ? <Terminal size={14} className="animate-spin" /> : <Play size={14} fill="#000" />}
            <span>{isRunning ? 'Running...' : 'Run Code'}</span>
          </button>
        </div>

        {/* Monaco */}
        <div style={S({ flex: 1, minHeight: 0 })}>
          <MonacoEditor
            height="100%" language={language === 'javascript' ? 'javascript' : language}
            value={code} onChange={v => setCode(v || '')} theme="vs-dark"
            options={{ fontSize: 14, fontFamily: 'JetBrains Mono, monospace', minimap: { enabled: false }, scrollBeyondLastLine: false, padding: { top: 16 }, automaticLayout: true }}
          />
        </div>

        {/* Output */}
        <div style={S({ height: 130, borderTop: '1px solid var(--glass-border)', background: 'rgba(0,0,0,0.4)', padding: '10px 14px', overflow: 'auto' })}>
          <div style={S({ fontSize: 9, color: 'var(--text-muted)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 6 })}>Terminal Output</div>
          {output ? (
            <div style={S({ display: 'flex', gap: 8, alignItems: 'flex-start' })}>
              {output.startsWith('Accepted') ? <CheckCircle2 size={16} className="text-[#00ff88]" style={{ marginTop: 4, flexShrink: 0 }} /> : <XCircle size={16} className="text-[#ff3b30]" style={{ marginTop: 4, flexShrink: 0 }} />}
              <pre style={S({ fontFamily: 'JetBrains Mono', fontSize: 12, color: output.startsWith('Accepted') ? '#00ff88' : '#ff3b30', whiteSpace: 'pre-wrap', lineHeight: 1.7 })}>{output}</pre>
            </div>
          ) : (
            <div style={S({ color: 'var(--text-muted)', fontSize: 12, fontFamily: 'JetBrains Mono' })}>{isRunning ? '// Executing...' : '// Click Run Code to execute'}</div>
          )}
        </div>
      </div>
    </div>
  )
}

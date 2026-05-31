'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import { MessageSquare, Cpu, Layers, Mic, MicOff, Send, Sparkles, User, Bot, Play } from 'lucide-react'

type Mode = 'behavioral' | 'technical' | 'system-design'

interface Message {
  role: 'interviewer' | 'candidate'
  content: string
  timestamp: number
}

const BEHAVIORAL_OPENER = `Hello! I'm your AI interviewer. Let's start with a behavioral question.

Tell me about a time when you had to work with a difficult team member. How did you handle the situation, and what was the outcome?

Take your time to structure your response using the STAR method (Situation, Task, Action, Result).`

const TECHNICAL_OPENER = `Welcome to your technical interview! I'll be your interviewer today.

Let's start with this problem:

**Two Sum** — Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.

Please walk me through your thought process before coding. What data structures would you consider?`

const SYSTEM_DESIGN_OPENER = `Welcome to your system design interview!

**Design a URL Shortener like bit.ly**

Requirements:
- 100M URLs generated per day
- URL redirection should be fast (< 100ms)
- Analytics tracking
- Custom aliases

Please start by clarifying the requirements and estimating scale. What would be your high-level architecture?`

const OPENERS: Record<Mode, string> = {
  behavioral: BEHAVIORAL_OPENER,
  technical: TECHNICAL_OPENER,
  'system-design': SYSTEM_DESIGN_OPENER,
}

const AI_RESPONSES: Record<string, string[]> = {
  behavioral: [
    "That's a great example! I can see you used empathy and clear communication. Can you elaborate on the *specific* actions you took and how you measured success?",
    "Excellent use of the STAR method! Your answer shows strong collaboration skills. How would you handle it differently next time?",
    "I like that you took initiative. What was the biggest lesson you learned from this experience?",
  ],
  technical: [
    "Good thinking! The hash map approach is optimal at O(n). Can you now code it up and discuss edge cases?",
    "Interesting approach! What's the time and space complexity of your solution?",
    "That's correct! Now let's extend this — what if the array was sorted? Would you change your approach?",
  ],
  'system-design': [
    "Good start on the requirements! For 100M URLs/day, we'd need roughly 1200 writes/second. How would you handle the database at this scale?",
    "Great point about caching! What cache eviction policy would you use and why?",
    "Excellent architecture! How would you handle the analytics tracking without impacting redirect latency?",
  ],
}

export default function InterviewBot() {
  const [mode, setMode] = useState<Mode>('behavioral')
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [isStarted, setIsStarted] = useState(false)
  const [scores, setScores] = useState<{ communication: number; technical: number; confidence: number } | null>(null)
  const [isListening, setIsListening] = useState(false)
  const [sessionTime, setSessionTime] = useState(0)
  const chatEndRef = useRef<HTMLDivElement>(null)
  const recognitionRef = useRef<any>(null)

  useEffect(() => {
    if (!isStarted) return
    const id = setInterval(() => setSessionTime(t => t + 1), 1000)
    return () => clearInterval(id)
  }, [isStarted])

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isTyping])

  const startSession = useCallback(() => {
    setIsStarted(true)
    setMessages([{ role: 'interviewer', content: OPENERS[mode], timestamp: Date.now() }])
    setScores(null)
    setSessionTime(0)
  }, [mode])

  const sendMessage = useCallback(async (text: string) => {
    if (!text.trim()) return
    const userMsg: Message = { role: 'candidate', content: text, timestamp: Date.now() }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setIsTyping(true)

    await new Promise(r => setTimeout(r, 1200 + Math.random() * 800))

    const responses = AI_RESPONSES[mode]
    const aiResponse = responses[Math.floor(Math.random() * responses.length)]
    const aiMsg: Message = { role: 'interviewer', content: aiResponse, timestamp: Date.now() }
    setMessages(prev => [...prev, aiMsg])
    setIsTyping(false)

    if (messages.length > 2) {
      setScores({
        communication: Math.floor(Math.random() * 20 + 75),
        technical: Math.floor(Math.random() * 25 + 65),
        confidence: Math.floor(Math.random() * 20 + 70),
      })
    }
  }, [mode, messages.length])

  const toggleVoice = useCallback(() => {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      alert('Speech recognition not supported in this browser.')
      return
    }
    if (isListening) {
      recognitionRef.current?.stop()
      setIsListening(false)
      return
    }
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    const recognition = new SR()
    recognition.continuous = true
    recognition.interimResults = true
    recognition.lang = 'en-US'
    recognition.onresult = (e: any) => {
      const transcript = Array.from(e.results).map((r: any) => r[0].transcript).join(' ')
      setInput(transcript)
    }
    recognition.onend = () => setIsListening(false)
    recognition.start()
    recognitionRef.current = recognition
    setIsListening(true)
  }, [isListening])

  const formatTime = (s: number) => `${Math.floor(s / 60).toString().padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}`

  const S = (o: React.CSSProperties): React.CSSProperties => o

  if (!isStarted) {
    return (
      <div style={S({ padding: 32, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: 24 })}>
        <div style={S({ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', marginBottom: 8 })}>
          <div style={S({ width: 64, height: 64, borderRadius: 16, background: 'rgba(189,0,255,0.1)', border: '1px solid rgba(189,0,255,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#bd00ff', marginBottom: 16 })}>
            <Bot size={32} />
          </div>
          <h2 style={S({ fontSize: 22, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 6 })}>AI Interview Suite</h2>
          <p style={S({ fontSize: 14, color: 'var(--text-muted)', maxWidth: 360 })}>Practice with an AI interviewer trained on FAANG patterns. Choose your mode and start when ready.</p>
        </div>

        <div style={S({ display: 'flex', gap: 12, width: '100%', maxWidth: 480 })}>
          {([
            { id: 'behavioral', icon: MessageSquare, label: 'Behavioral', sub: 'STAR method · Soft skills' },
            { id: 'technical', icon: Cpu, label: 'Technical', sub: 'DSA · Problem solving' },
            { id: 'system-design', icon: Layers, label: 'System Design', sub: 'Architecture · Scale' },
          ] as const).map(m => (
            <button key={m.id} onClick={() => setMode(m.id)} style={S({
              flex: 1, padding: '16px 12px', borderRadius: 12, cursor: 'pointer', textAlign: 'center',
              border: `1px solid ${mode === m.id ? 'rgba(0,240,255,0.4)' : 'var(--glass-border)'}`,
              background: mode === m.id ? 'rgba(0,240,255,0.08)' : 'rgba(255,255,255,0.03)',
              transition: 'all 0.15s ease',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            })}>
              <div style={S({ fontSize: 24, marginBottom: 8, color: mode === m.id ? '#00f0ff' : 'var(--text-muted)' })}>
                <m.icon size={22} />
              </div>
              <div style={S({ fontSize: 13, fontWeight: 700, color: mode === m.id ? '#00f0ff' : 'var(--text-primary)', marginBottom: 2 })}>{m.label}</div>
              <div style={S({ fontSize: 10, color: 'var(--text-muted)' })}>{m.sub}</div>
            </button>
          ))}
        </div>

        <button onClick={startSession} style={S({
          padding: '12px 40px', borderRadius: 10, border: 'none', cursor: 'pointer',
          background: 'linear-gradient(135deg, #00f0ff, #bd00ff)', color: '#000', fontSize: 14, fontWeight: 700,
          display: 'flex', alignItems: 'center', gap: 8,
        })} id="start-interview-btn">
          <Play size={16} fill="#000" /> Start Interview
        </button>

        <div style={S({ fontSize: 12, color: 'var(--text-muted)', textAlign: 'center' })}>
          🎤 Voice input supported · ⌨️ Text input available
        </div>
      </div>
    )
  }

  return (
    <div style={S({ display: 'flex', height: '100%' })}>
      {/* Chat area */}
      <div style={S({ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 })}>
        {/* Header */}
        <div style={S({ padding: '10px 16px', borderBottom: '1px solid var(--glass-border)', display: 'flex', alignItems: 'center', gap: 10, background: 'rgba(0,0,0,0.2)' })}>
          <div style={S({ width: 10, height: 10, borderRadius: '50%', background: '#00ff88', boxShadow: '0 0 8px #00ff88' })} />
          <span style={S({ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', flex: 1 })}>
            {mode === 'behavioral' ? 'Behavioral Mock Interview' : mode === 'technical' ? 'Technical Mock Interview' : 'System Design Mock Interview'}
          </span>
          <span style={S({ fontSize: 12, fontFamily: 'JetBrains Mono', color: '#ff6b00' })}>{formatTime(sessionTime)}</span>
          <button onClick={() => { setIsStarted(false); setMessages([]); setScores(null) }} style={S({
            padding: '4px 10px', borderRadius: 6, border: '1px solid rgba(255,59,48,0.3)',
            background: 'rgba(255,59,48,0.1)', color: '#ff3b30', fontSize: 11, cursor: 'pointer',
          })}>End</button>
        </div>

        {/* Messages */}
        <div style={S({ flex: 1, overflowY: 'auto', padding: '16px' })}>
          {messages.map((msg, i) => (
            <div key={i} style={S({
              marginBottom: 16, display: 'flex', gap: 10,
              flexDirection: msg.role === 'candidate' ? 'row-reverse' : 'row',
            })}>
              <div style={S({
                width: 34, height: 34, borderRadius: '50%', flexShrink: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: msg.role === 'interviewer' ? 'rgba(189,0,255,0.15)' : 'rgba(0,240,255,0.15)',
                border: `1px solid ${msg.role === 'interviewer' ? 'rgba(189,0,255,0.3)' : 'rgba(0,240,255,0.3)'}`,
                color: msg.role === 'interviewer' ? '#bd00ff' : '#00f0ff',
              })}>
                {msg.role === 'interviewer' ? <Bot size={16} /> : <User size={16} />}
              </div>
              <div style={S({
                maxWidth: '75%', padding: '10px 14px', borderRadius: 12, fontSize: 13, lineHeight: 1.7,
                background: msg.role === 'interviewer' ? 'rgba(189,0,255,0.08)' : 'rgba(0,240,255,0.08)',
                border: `1px solid ${msg.role === 'interviewer' ? 'rgba(189,0,255,0.15)' : 'rgba(0,240,255,0.15)'}`,
                color: 'var(--text-primary)',
                borderBottomRightRadius: msg.role === 'candidate' ? 4 : 12,
                borderBottomLeftRadius: msg.role === 'interviewer' ? 4 : 12,
              })}>
                {msg.content}
              </div>
            </div>
          ))}
          {isTyping && (
            <div style={S({ display: 'flex', gap: 10, marginBottom: 16 })}>
              <div style={S({ width: 34, height: 34, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(189,0,255,0.15)', border: '1px solid rgba(189,0,255,0.3)', color: '#bd00ff' })}>
                <Bot size={16} />
              </div>
              <div style={S({ padding: '10px 16px', borderRadius: 12, background: 'rgba(189,0,255,0.08)', border: '1px solid rgba(189,0,255,0.15)', display: 'flex', alignItems: 'center', gap: 4 })}>
                {[0, 1, 2].map(i => (
                  <div key={i} style={S({ width: 6, height: 6, borderRadius: '50%', background: '#bd00ff', animation: `scale-in 1s ${i * 0.15}s infinite` })} />
                ))}
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Input */}
        <div style={S({ padding: 12, borderTop: '1px solid var(--glass-border)', display: 'flex', gap: 8, background: 'rgba(0,0,0,0.2)' })}>
          <button onClick={toggleVoice} style={S({
            width: 40, height: 40, borderRadius: 8, border: `1px solid ${isListening ? 'rgba(0,255,136,0.4)' : 'var(--glass-border)'}`,
            background: isListening ? 'rgba(0,255,136,0.1)' : 'transparent', cursor: 'pointer',
            flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: isListening ? '#00ff88' : 'var(--text-muted)',
            animation: isListening ? 'neon-pulse 1.5s infinite' : 'none',
          })} title={isListening ? 'Stop recording' : 'Start voice input'}>
            {isListening ? <MicOff size={16} /> : <Mic size={16} />}
          </button>
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendMessage(input)}
            placeholder="Type your response... or use voice input"
            style={S({
              flex: 1, background: 'rgba(255,255,255,0.04)', border: '1px solid var(--glass-border)',
              borderRadius: 8, padding: '8px 12px', fontSize: 13, color: 'var(--text-primary)', outline: 'none',
            })}
          />
          <button onClick={() => sendMessage(input)} disabled={!input.trim()} style={S({
            padding: '8px 16px', borderRadius: 8, border: 'none',
            background: input.trim() ? 'linear-gradient(135deg, #00f0ff, #bd00ff)' : 'rgba(255,255,255,0.06)',
            color: input.trim() ? '#000' : 'var(--text-muted)', fontSize: 13, fontWeight: 700, cursor: input.trim() ? 'pointer' : 'not-allowed',
            display: 'flex', alignItems: 'center', gap: 4,
          })}>
            <span>Send</span>
            <Send size={12} />
          </button>
        </div>
      </div>

      {/* Scores Panel */}
      {scores && (
        <div style={S({ width: 200, borderLeft: '1px solid var(--glass-border)', padding: 16, background: 'rgba(0,0,0,0.15)', display: 'flex', flexDirection: 'column', gap: 12, flexShrink: 0 })}>
          <div style={S({ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em' })}>Live Scores</div>
          {[
            { label: 'Communication', value: scores.communication, color: '#00f0ff' },
            { label: 'Technical', value: scores.technical, color: '#bd00ff' },
            { label: 'Confidence', value: scores.confidence, color: '#00ff88' },
          ].map(s => (
            <div key={s.label}>
              <div style={S({ display: 'flex', justifyContent: 'space-between', marginBottom: 4 })}>
                <span style={S({ fontSize: 11, color: 'var(--text-muted)' })}>{s.label}</span>
                <span style={S({ fontSize: 12, fontWeight: 700, color: s.color })}>{s.value}%</span>
              </div>
              <div style={S({ height: 4, borderRadius: 2, background: 'rgba(255,255,255,0.08)', overflow: 'hidden' })}>
                <div style={S({ height: '100%', borderRadius: 2, background: s.color, width: `${s.value}%`, transition: 'width 1s ease', boxShadow: `0 0 8px ${s.color}` })} />
              </div>
            </div>
          ))}
          <div style={S({ marginTop: 8, padding: '10px', borderRadius: 8, background: 'rgba(0,240,255,0.06)', border: '1px solid rgba(0,240,255,0.12)', textAlign: 'center' })}>
            <div style={S({ fontSize: 24, fontWeight: 800, color: '#00f0ff' })}>
              {Math.floor((scores.communication + scores.technical + scores.confidence) / 3)}%
            </div>
            <div style={S({ fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' })}>Overall</div>
          </div>
        </div>
      )}
    </div>
  )
}

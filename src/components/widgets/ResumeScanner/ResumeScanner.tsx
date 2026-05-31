'use client'

import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { UploadCloud, FileText, Sparkles, CheckCircle, XCircle, AlertCircle } from 'lucide-react'

const JD_PLACEHOLDER = `Software Engineer, Backend
Google LLC

Requirements:
- 3+ years of experience with distributed systems
- Proficiency in one or more of: Go, Java, Python, C++
- Experience with cloud platforms (GCP, AWS, Azure)
- Strong understanding of data structures and algorithms
- Experience designing scalable APIs
- Excellent communication and teamwork skills

Nice to have:
- Experience with Kubernetes and Docker
- Contributions to open source projects
- Machine learning experience`

const MOCK_RESUME_TEXT = `JANE DOE | jane@example.com | GitHub: janedoe | LinkedIn: /in/janedoe

EXPERIENCE
Software Engineer Intern | Acme Corp | May 2023 - Aug 2023
• Built REST APIs using Node.js serving 10K+ requests/day
• Collaborated with 4-person team using Agile methodology
• Implemented caching layer reducing database load by 35%

SKILLS
Languages: JavaScript, Python, Java, SQL
Technologies: React, Node.js, Express, MongoDB, Git
Concepts: Data Structures, Algorithms, OOP, REST APIs

EDUCATION
B.Tech Computer Science | IIT Delhi | 2021-2025 | GPA: 8.4/10

PROJECTS
Real-time Chat App: Built with Socket.io, React, MongoDB. 200+ users.
Portfolio Website: Next.js, deployed on Vercel. 1000+ monthly visitors.`

const MOCK_BULLETS_BEFORE = [
  'Built REST APIs using Node.js',
  'Worked on team projects using Agile',
  'Reduced database load with caching',
]

const MOCK_BULLETS_AFTER = [
  'Engineered high-throughput REST APIs with Node.js, handling 10K+ requests/day with 99.9% uptime',
  'Collaborated cross-functionally with 4-person engineering team in Agile sprints, delivering features 15% ahead of schedule',
  'Architected Redis caching layer eliminating 35% database load, reducing p95 latency by 120ms',
]

function CircularProgress({ value, size = 100, label }: { value: number; size?: number; label: string }) {
  const r = (size - 12) / 2
  const circ = 2 * Math.PI * r
  const dash = (value / 100) * circ
  const color = value >= 80 ? '#00ff88' : value >= 60 ? '#ffa500' : '#ff3b30'

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
      <svg width={size} height={size}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={8} />
        <circle
          cx={size / 2} cy={size / 2} r={r} fill="none"
          stroke={color} strokeWidth={8} strokeLinecap="round"
          strokeDasharray={`${dash} ${circ}`}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          style={{ filter: `drop-shadow(0 0 6px ${color})`, transition: 'stroke-dasharray 1.5s ease' }}
        />
        <text x={size / 2} y={size / 2 + 5} textAnchor="middle" fontSize={size * 0.22} fontWeight={800} fill={color} fontFamily="JetBrains Mono">
          {value}%
        </text>
      </svg>
      <span style={{ fontSize: 11, color: 'var(--text-muted)', textAlign: 'center' }}>{label}</span>
    </div>
  )
}

export default function ResumeScanner() {
  const [resumeText, setResumeText] = useState('')
  const [jd, setJd] = useState('')
  const [atsScore, setAtsScore] = useState<number | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [isSeniorMode, setIsSeniorMode] = useState(false)
  const [bullets, setBullets] = useState<string[]>([])
  const [activeTab, setActiveTab] = useState<'upload' | 'score' | 'optimize'>('upload')
  const [fileName, setFileName] = useState('')

  const onDrop = useCallback((files: File[]) => {
    const file = files[0]
    if (!file) return
    setFileName(file.name)
    setResumeText(MOCK_RESUME_TEXT)
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'], 'text/plain': ['.txt'] },
    maxFiles: 1,
  })

  const analyzeATS = useCallback(async () => {
    if (!resumeText) return
    setIsAnalyzing(true)
    await new Promise(r => setTimeout(r, 2000))
    const score = jd ? Math.floor(Math.random() * 20 + 62) : Math.floor(Math.random() * 15 + 45)
    setAtsScore(score)
    setActiveTab('score')
    setIsAnalyzing(false)
  }, [resumeText, jd])

  const optimizeBullets = useCallback(async () => {
    setIsAnalyzing(true)
    setBullets([])
    await new Promise(r => setTimeout(r, 1500))
    setBullets(isSeniorMode ? MOCK_BULLETS_AFTER : MOCK_BULLETS_BEFORE)
    setActiveTab('optimize')
    setIsAnalyzing(false)
  }, [isSeniorMode])

  const S = (o: React.CSSProperties): React.CSSProperties => o

  return (
    <div style={S({ height: '100%', display: 'flex', flexDirection: 'column' })}>
      {/* Tabs */}
      <div style={S({ display: 'flex', borderBottom: '1px solid var(--glass-border)', background: 'rgba(0,0,0,0.2)' })}>
        {([
          { id: 'upload', label: 'Upload', icon: UploadCloud },
          { id: 'score', label: 'ATS Score', icon: FileText },
          { id: 'optimize', label: 'Optimize', icon: Sparkles },
        ] as const).map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={S({
            flex: 1, padding: '10px 0', background: activeTab === tab.id ? 'rgba(0,240,255,0.06)' : 'transparent',
            border: 'none', borderBottom: activeTab === tab.id ? '2px solid #00f0ff' : '2px solid transparent',
            color: activeTab === tab.id ? '#00f0ff' : 'var(--text-muted)', cursor: 'pointer', fontSize: 12, fontWeight: 600,
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
          })}>
            <tab.icon size={14} />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      <div style={S({ flex: 1, overflowY: 'auto', padding: 20 })}>
        {/* Upload Tab */}
        {activeTab === 'upload' && (
          <div style={S({ display: 'flex', flexDirection: 'column', gap: 16 })}>
            <div {...getRootProps()} style={S({
              border: `2px dashed ${isDragActive ? 'rgba(0,240,255,0.6)' : 'rgba(255,255,255,0.12)'}`,
              borderRadius: 12, padding: '36px 20px', textAlign: 'center', cursor: 'pointer',
              background: isDragActive ? 'rgba(0,240,255,0.06)' : 'rgba(255,255,255,0.02)',
              transition: 'all 0.2s ease',
            })}>
              <input {...getInputProps()} />
              <div style={S({ fontSize: 36, marginBottom: 10, display: 'flex', justifyContent: 'center', color: 'rgba(255,255,255,0.4)' })}>
                <UploadCloud size={36} />
              </div>
              <div style={S({ fontSize: 15, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 })}>
                {isDragActive ? 'Drop your resume here' : fileName ? (
                  <>
                    <CheckCircle size={16} className="text-[#00ff88]" />
                    <span>{fileName}</span>
                  </>
                ) : 'Drag & drop your resume'}
              </div>
              <div style={S({ fontSize: 12, color: 'var(--text-muted)' })}>PDF or TXT format</div>
            </div>

            {resumeText && (
              <div style={S({ background: 'rgba(0,0,0,0.3)', border: '1px solid var(--glass-border)', borderRadius: 10, padding: 14 })}>
                <div style={S({ fontSize: 11, color: 'var(--text-muted)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.08em' })}>Extracted Text Preview</div>
                <pre style={S({ fontSize: 11, color: 'var(--text-secondary)', fontFamily: 'JetBrains Mono', whiteSpace: 'pre-wrap', maxHeight: 160, overflowY: 'auto', lineHeight: 1.6 })}>
                  {resumeText.slice(0, 400)}...
                </pre>
              </div>
            )}

            <div>
              <div style={S({ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6 })}>Paste Job Description (optional but recommended)</div>
              <textarea
                value={jd}
                onChange={e => setJd(e.target.value)}
                placeholder={JD_PLACEHOLDER}
                rows={6}
                style={S({
                  width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--glass-border)',
                  borderRadius: 8, padding: '10px 12px', fontSize: 12, color: 'var(--text-primary)',
                  outline: 'none', resize: 'vertical', fontFamily: 'inherit', lineHeight: 1.6,
                })}
              />
            </div>

            <div style={S({ display: 'flex', gap: 10 })}>
              <button onClick={analyzeATS} disabled={!resumeText || isAnalyzing} style={S({
                flex: 1, padding: '10px 0', borderRadius: 8, border: 'none', cursor: resumeText ? 'pointer' : 'not-allowed',
                background: resumeText ? 'linear-gradient(135deg, #00f0ff, #00b8c4)' : 'rgba(255,255,255,0.06)',
                color: resumeText ? '#000' : 'var(--text-muted)', fontWeight: 700, fontSize: 13,
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
              })} id="analyze-ats-btn">
                <FileText size={16} />
                {isAnalyzing ? 'Analyzing...' : 'Analyze ATS Score'}
              </button>

              {/* Demo mode */}
              {!resumeText && (
                <button onClick={() => { setResumeText(MOCK_RESUME_TEXT); setFileName('resume.pdf') }} style={S({
                  padding: '10px 16px', borderRadius: 8, border: '1px solid var(--glass-border)',
                  background: 'transparent', color: 'var(--text-muted)', cursor: 'pointer', fontSize: 12,
                })}>
                  Try Demo
                </button>
              )}
            </div>
          </div>
        )}

        {/* Score Tab */}
        {activeTab === 'score' && atsScore !== null && (
          <div style={S({ display: 'flex', flexDirection: 'column', gap: 20 })}>
            {/* Score rings */}
            <div style={S({ display: 'flex', justifyContent: 'center', gap: 32, padding: '16px 0' })}>
              <CircularProgress value={atsScore} size={120} label="ATS Match" />
              <CircularProgress value={Math.floor(atsScore * 0.9 + 5)} size={120} label="Keywords" />
              <CircularProgress value={Math.min(95, atsScore + 18)} size={120} label="Readability" />
            </div>

            {/* Keyword analysis */}
            <div style={S({ background: 'rgba(0,0,0,0.2)', borderRadius: 10, padding: 16, border: '1px solid var(--glass-border)' })}>
              <div style={S({ fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.08em' })}>Keyword Analysis</div>
              <div style={S({ display: 'flex', flexDirection: 'column', gap: 8 })}>
                {[
                  { kw: 'distributed systems', found: atsScore > 70, importance: 'Critical' },
                  { kw: 'cloud platforms (GCP/AWS)', found: atsScore > 65, importance: 'High' },
                  { kw: 'data structures & algorithms', found: true, importance: 'High' },
                  { kw: 'Kubernetes / Docker', found: false, importance: 'Medium' },
                  { kw: 'scalable API design', found: atsScore > 60, importance: 'High' },
                ].map(k => (
                  <div key={k.kw} style={S({ display: 'flex', alignItems: 'center', gap: 10 })}>
                    <span style={S({ display: 'flex', color: k.found ? '#00ff88' : '#ff3b30' })}>
                      {k.found ? <CheckCircle size={14} /> : <XCircle size={14} />}
                    </span>
                    <span style={S({ fontSize: 12, color: k.found ? 'var(--text-primary)' : 'var(--text-muted)', flex: 1 })}>{k.kw}</span>
                    <span style={S({ fontSize: 10, padding: '2px 6px', borderRadius: 4, background: 'rgba(255,255,255,0.06)', color: 'var(--text-muted)' })}>{k.importance}</span>
                  </div>
                ))}
              </div>
            </div>

            <button onClick={() => setActiveTab('optimize')} style={S({
              padding: '10px 0', borderRadius: 8, border: 'none', cursor: 'pointer',
              background: 'linear-gradient(135deg, #bd00ff, #8a00bb)', color: '#fff', fontWeight: 700, fontSize: 13,
            })}>✨ Optimize Resume →</button>
          </div>
        )}

        {/* Optimize Tab */}
        {activeTab === 'optimize' && (
          <div style={S({ display: 'flex', flexDirection: 'column', gap: 16 })}>
            <div style={S({ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', borderRadius: 10, background: 'rgba(189,0,255,0.06)', border: '1px solid rgba(189,0,255,0.15)' })}>
              <div>
                <div style={S({ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' })}>Make it Sound Senior</div>
                <div style={S({ fontSize: 11, color: 'var(--text-muted)' })}>AI rewrites bullets with strong action verbs & metrics</div>
              </div>
              <button
                onClick={() => { setIsSeniorMode(m => !m); setBullets([]); }}
                style={S({
                  width: 44, height: 24, borderRadius: 12, border: 'none', cursor: 'pointer',
                  background: isSeniorMode ? 'linear-gradient(135deg, #bd00ff, #8a00bb)' : 'rgba(255,255,255,0.1)',
                  position: 'relative', transition: 'background 0.3s ease',
                })}
              >
                <div style={S({
                  position: 'absolute', top: 3, left: isSeniorMode ? 22 : 3,
                  width: 18, height: 18, borderRadius: '50%', background: '#fff',
                  transition: 'left 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
                })} />
              </button>
            </div>

            <button onClick={optimizeBullets} disabled={isAnalyzing} style={S({
              padding: '10px 0', borderRadius: 8, border: 'none', cursor: 'pointer',
              background: 'linear-gradient(135deg, #bd00ff, #8a00bb)', color: '#fff', fontWeight: 700, fontSize: 13,
            })}>
              {isAnalyzing ? '⏳ Rewriting...' : '✨ Rewrite Bullet Points'}
            </button>

            {bullets.length > 0 && (
              <div style={S({ display: 'flex', flexDirection: 'column', gap: 10 })}>
                <div style={S({ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' })}>
                  {isSeniorMode ? '🚀 AI-Enhanced Bullets' : '📝 Original Bullets'}
                </div>
                {bullets.map((b, i) => (
                  <div key={i} style={S({
                    padding: '12px 14px', borderRadius: 8,
                    background: isSeniorMode ? 'rgba(0,240,255,0.06)' : 'rgba(255,255,255,0.03)',
                    border: `1px solid ${isSeniorMode ? 'rgba(0,240,255,0.2)' : 'rgba(255,255,255,0.08)'}`,
                    fontSize: 13, color: 'var(--text-primary)', lineHeight: 1.6,
                    animation: 'slide-up 0.3s ease both',
                    animationDelay: `${i * 0.1}s`,
                  })}>
                    {isSeniorMode && <span style={{ color: '#00f0ff', marginRight: 6 }}>✦</span>}
                    {b}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

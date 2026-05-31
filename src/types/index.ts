export type WindowId = 
  | 'dsa-pad' 
  | 'interview-bot' 
  | 'resume-scanner' 
  | 'analytics' 
  | 'company-intel' 
  | 'study-plan'
  | 'settings'
  | 'admin'

export interface WindowState {
  id: WindowId
  title: string
  icon: string
  isOpen: boolean
  isMinimized: boolean
  isMaximized: boolean
  isFocused: boolean
  position: { x: number; y: number }
  size: { width: number; height: number }
  zIndex: number
}

export interface User {
  id: string
  email: string
  name: string
  avatar?: string
  subscriptionTier: 'free' | 'pro' | 'judge'
  streakData: {
    currentStreak: number
    longestStreak: number
    lastActiveDate: string
    heatmapData: Record<string, number>
  }
  xp: number
  skills: string[]
  targetCompanies: string[]
  placementDate?: string
  studyHoursPerDay: number
  onboardingCompleted: boolean
}

export interface Problem {
  id: string
  title: string
  slug: string
  difficulty: 'Easy' | 'Medium' | 'Hard'
  topics: string[]
  companies: string[]
  frequency: number
  description: string
  examples: Array<{ input: string; output: string; explanation?: string }>
  constraints: string[]
  starterCode: {
    javascript: string
    python: string
    java: string
  }
  solution?: string
  solved?: boolean
  accepted?: boolean
  submissions?: number
}

export interface InterviewSession {
  id: string
  userId: string
  mode: 'behavioral' | 'technical' | 'system-design'
  company?: string
  startedAt: string
  endedAt?: string
  transcript: TranscriptEntry[]
  scores?: {
    communication: number
    technical: number
    confidence: number
    overall: number
  }
  fillerWords: string[]
  improvements: string[]
  recording?: Blob
}

export interface TranscriptEntry {
  role: 'interviewer' | 'candidate'
  content: string
  timestamp: number
  isFillerWord?: boolean
}

export interface StudyPlan {
  id: string
  userId: string
  generatedAt: string
  placementDate: string
  totalDays: number
  completedDays: number
  dailyTasks: DayTask[]
  companies: string[]
  skills: string[]
}

export interface DayTask {
  day: number
  date: string
  topics: string[]
  problems: string[]
  completed: boolean
  estimatedHours: number
  focus: 'arrays' | 'trees' | 'graphs' | 'dp' | 'strings' | 'design' | 'behavioral'
}

export interface Resume {
  id: string
  userId: string
  fileName: string
  parsedText: string
  atsScore?: number
  jobDescription?: string
  optimizedBullets?: string[]
  uploadedAt: string
}

export interface Company {
  id: string
  slug: string
  name: string
  logo: string
  color: string
  hiringPattern: {
    arrays: number
    trees: number
    graphs: number
    dp: number
    strings: number
    design: number
    behavioral: number
  }
  recentQuestions: string[]
  difficulty: 'High' | 'Very High' | 'Extreme'
  rounds: number
}

export interface CommandPaletteItem {
  id: string
  title: string
  description?: string
  icon: string
  action: () => void
  shortcut?: string
}

export interface ToastMessage {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  description?: string
}

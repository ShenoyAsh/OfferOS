import { Terminal, Mic, FileText, BarChart3, Search, Map, Settings, LayoutDashboard, Crown, Home, Zap, Flame, Briefcase } from 'lucide-react'

export default function AppIcon({ id, className, size = 18 }: { id: string; className?: string; size?: number }) {
  switch (id) {
    case 'dsa-pad':
      return <Terminal className={className} size={size} />
    case 'interview-bot':
      return <Mic className={className} size={size} />
    case 'resume-scanner':
      return <FileText className={className} size={size} />
    case 'analytics':
      return <BarChart3 className={className} size={size} />
    case 'company-intel':
      return <Search className={className} size={size} />
    case 'study-plan':
      return <Map className={className} size={size} />
    case 'settings':
      return <Settings className={className} size={size} />
    case 'admin':
      return <LayoutDashboard className={className} size={size} />
    case 'crown':
      return <Crown className={className} size={size} />
    case 'home':
      return <Home className={className} size={size} />
    case 'zap':
      return <Zap className={className} size={size} />
    case 'flame':
      return <Flame className={className} size={size} />
    case 'briefcase':
      return <Briefcase className={className} size={size} />
    default:
      return null
  }
}

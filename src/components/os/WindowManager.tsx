'use client'

import { useCallback, useEffect, useState, useRef } from 'react'
import Draggable from 'react-draggable'
import type { WindowId, WindowState } from '@/types'
import { useWindows } from '@/context/WindowContext'

import AppIcon from '@/components/os/AppIcon'

// Lazy-loaded widget components
import dynamic from 'next/dynamic'


const DSAPad = dynamic(() => import('@/components/widgets/DSAPad/DSAPad'), { ssr: false })
const InterviewBot = dynamic(() => import('@/components/widgets/InterviewBot/InterviewBot'), { ssr: false })
const ResumeScanner = dynamic(() => import('@/components/widgets/ResumeScanner/ResumeScanner'), { ssr: false })
const Analytics = dynamic(() => import('@/components/widgets/Analytics/Analytics'), { ssr: false })
const CompanyIntel = dynamic(() => import('@/components/widgets/CompanyIntel/CompanyIntel'), { ssr: false })
const StudyPlan = dynamic(() => import('@/components/widgets/StudyPlan/StudyPlan'), { ssr: false })
const AdminDashboard = dynamic(() => import('@/components/widgets/Admin/AdminDashboard'), { ssr: false })

const WIDGET_MAP: Record<WindowId, React.ComponentType> = {
  'dsa-pad': DSAPad,
  'interview-bot': InterviewBot,
  'resume-scanner': ResumeScanner,
  'analytics': Analytics,
  'company-intel': CompanyIntel,
  'study-plan': StudyPlan,
  'settings': () => <div style={{ padding: 24, color: 'var(--text-secondary)' }}>Settings coming soon</div>,
  'admin': AdminDashboard,
}

interface WindowProps {
  window: WindowState
}

function OSWindow({ window: win }: WindowProps) {
  const { closeWindow, minimizeWindow, maximizeWindow, focusWindow, updateWindowPosition, updateWindowSize } = useWindows()
  const [isDragging, setIsDragging] = useState(false)
  const nodeRef = useRef<HTMLDivElement>(null)

  const Widget = WIDGET_MAP[win.id]

  const handleFocus = useCallback(() => {
    focusWindow(win.id)
  }, [focusWindow, win.id])

  const maxStyle = win.isMaximized
    ? { top: 0, left: 0, width: '100vw', height: `calc(100vh - var(--taskbar-height))`, borderRadius: 0 }
    : {}

  if (win.isMinimized) return null

  return (
    <Draggable
      nodeRef={nodeRef}
      handle=".os-window-titlebar"
      position={win.isMaximized ? { x: 0, y: 0 } : win.position}
      onStart={() => { setIsDragging(true); handleFocus() }}
      onStop={(_e, data) => {
        setIsDragging(false)
        if (!win.isMaximized) {
          updateWindowPosition(win.id, { x: data.x, y: data.y })
        }
      }}
      disabled={win.isMaximized}
      bounds="parent"
    >
      <div
        ref={nodeRef}
        className={`os-window ${win.isFocused ? 'focused' : ''}`}
        style={{
          width: win.size.width,
          height: win.size.height,
          zIndex: win.zIndex,
          cursor: isDragging ? 'grabbing' : 'default',
          pointerEvents: 'auto',
          ...maxStyle,
        }}
        onMouseDown={handleFocus}
        id={`window-${win.id}`}
        role="dialog"
        aria-label={win.title}
      >
        {/* Title Bar */}
        <div className="os-window-titlebar">
          <div className="os-window-controls" aria-label="Window controls">
            <button
              className="os-window-btn close"
              onClick={() => closeWindow(win.id)}
              aria-label="Close window"
              title="Close"
            />
            <button
              className="os-window-btn min"
              onClick={() => minimizeWindow(win.id)}
              aria-label="Minimize window"
              title="Minimize"
            />
            <button
              className="os-window-btn max"
              onClick={() => maximizeWindow(win.id)}
              aria-label="Maximize window"
              title={win.isMaximized ? 'Restore' : 'Maximize'}
            />
          </div>
          <span className="os-window-title" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
            <AppIcon id={win.id} size={14} /> {win.title}
          </span>
          <div style={{ width: 58 }} /> {/* Spacer to center title */}
        </div>

        {/* Content */}
        <div className="os-window-content">
          <Widget />
        </div>
      </div>
    </Draggable>
  )
}

export default function WindowManager() {
  const { windows } = useWindows()
  const visibleWindows = windows.filter(w => !w.isMinimized)

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        bottom: 'var(--taskbar-height)',
        pointerEvents: 'none',
      }}
      id="window-manager"
    >
      {visibleWindows.map(win => (
        <div key={win.id} style={{ pointerEvents: 'none', position: 'absolute', width: '100%', height: '100%' }}>
          <OSWindow window={win} />
        </div>
      ))}
    </div>
  )
}

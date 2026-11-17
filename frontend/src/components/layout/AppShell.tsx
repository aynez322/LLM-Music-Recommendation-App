import { type ReactNode } from 'react'
import { VideoBackground } from './VideoBackground'

interface AppShellProps {
  children: ReactNode
  footer?: ReactNode
}

export function AppShell({ children, footer }: AppShellProps) {
  return (
    <div className="relative min-h-screen bg-bg-base flex flex-col transition-colors duration-[250ms]">
      <VideoBackground />
      <main className="relative flex-1 max-w-5xl mx-auto w-full px-4 py-10">
        {children}
      </main>
      {footer}
    </div>
  )
}

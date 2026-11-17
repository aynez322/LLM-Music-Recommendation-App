import type { MouseEvent, ReactNode } from 'react'
import { Dock, DockIcon } from '@/components/magicui/dock'
import { MoonIcon, SunIcon } from '../ui/ThemeToggle'
import { PROFILES } from '../../lib/profiles'
import { HOME_PATH, HOW_PATH, type Page } from '../../lib/urlState'

interface NavDockProps {
  page: Page
  onHome: () => void
  onHowItWorks: () => void
  theme: 'dark' | 'light'
  onToggleTheme: () => void
}

function HomeIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className="size-[52%]" aria-hidden>
      <path d="M3.5 10.5 12 3.5l8.5 7" />
      <path d="M5.5 9v11h13V9" />
      <path d="M10 20v-5.5h4V20" />
    </svg>
  )
}

function BookIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className="size-[52%]" aria-hidden>
      <path d="M12 6.5C10.3 5 7.8 4.5 4 4.5v14c3.8 0 6.3.5 8 2 1.7-1.5 4.2-2 8-2v-14c-3.8 0-6.3.5-8 2z" />
      <path d="M12 6.5v14" />
    </svg>
  )
}

// One look for every item: a pill holding the magnifying circle and its label,
// all of it one link. The label shows from sm up; phones get icons only.
const itemClass = 'flex items-center rounded-full text-text-secondary hover:text-accent hover:bg-bg-raised focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent transition-colors'

/** The circle the dock magnifies; the icon inside grows with it. */
function Glyph({ children, dot = false }: { children: ReactNode; dot?: boolean }) {
  return (
    <DockIcon className="relative flex-shrink-0">
      <span className="absolute inset-0 flex items-center justify-center">{children}</span>
      {/* the current page gets a dot underneath, as in the macOS dock */}
      {dot && <span aria-hidden className="absolute bottom-[7%] left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-accent" />}
    </DockIcon>
  )
}

/**
 * Icon and label as one link. Same-page links stay real <a>s (new tab, copy
 * link) and navigate in place on a plain click; external ones open a new tab.
 */
function NavItem({ href, label, icon, active = false, onNavigate, external = false }: {
  href: string; label: string; icon: ReactNode
  active?: boolean; onNavigate?: () => void; external?: boolean
}) {
  function onClick(e: MouseEvent<HTMLAnchorElement>) {
    if (!onNavigate || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return
    e.preventDefault()
    onNavigate()
  }
  return (
    <a
      href={href}
      onClick={onClick}
      aria-label={label}
      aria-current={active ? 'page' : undefined}
      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      className={`${itemClass} ${active ? '!text-text-primary hover:!text-accent' : ''}`}
    >
      <Glyph dot={active}>{icon}</Glyph>
      <span aria-hidden className="hidden sm:inline -ml-0.5 pr-3.5 text-sm font-medium whitespace-nowrap">{label}</span>
    </a>
  )
}

/** Navbar: Magic UI's dock, icons magnifying under the pointer. */
export function NavDock({ page, onHome, onHowItWorks, theme, onToggleTheme }: NavDockProps) {
  const isLight = theme === 'light'
  return (
    <nav aria-label="Main" className="relative z-20 flex justify-center mb-8">
      <Dock
        iconSize={40}
        iconMagnification={54}
        iconDistance={110}
        className="mt-0 gap-1 border-[var(--color-border)] bg-bg-surface/70 shadow-[0_8px_30px_rgba(0,0,0,0.25)]"
      >
        <NavItem href={HOME_PATH} label="Home" icon={<HomeIcon />} active={page === 'home'} onNavigate={onHome} />
        <NavItem href={HOW_PATH} label="How it works" icon={<BookIcon />} active={page === 'how'} onNavigate={onHowItWorks} />

        <div aria-hidden className="w-px self-stretch my-1.5 mx-1 bg-[var(--color-border)]" />

        {PROFILES.map(({ name, href, path }) => (
          <NavItem
            key={name}
            href={href}
            label={name}
            external
            icon={<svg viewBox="0 0 24 24" fill="currentColor" className="size-[46%]" aria-hidden><path d={path} /></svg>}
          />
        ))}

        <button
          type="button"
          onClick={onToggleTheme}
          aria-label={isLight ? 'Switch to dark mode' : 'Switch to light mode'}
          title={isLight ? 'Dark mode' : 'Light mode'}
          className={`${itemClass} [&_svg]:size-[42%]`}
        >
          <Glyph>{isLight ? <MoonIcon /> : <SunIcon />}</Glyph>
        </button>
      </Dock>
    </nav>
  )
}

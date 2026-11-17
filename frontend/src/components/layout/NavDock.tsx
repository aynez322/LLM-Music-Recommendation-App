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

// one look for every item. The dock pads each icon with an inline style, so
// items cover the whole circle absolutely: all of it is the click target.
const item = 'absolute inset-0 flex items-center justify-center rounded-full text-text-secondary hover:text-accent hover:bg-bg-raised focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent transition-colors'

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

// The label beside an icon: a second way to click the same link. It sits
// outside the DockIcon (the dock only magnifies DockIcons), hugs its own icon
// (-ml-1) and keeps a gap before the next one (mr-2). Screen readers already
// get the name from the icon, so it is hidden from them; on phones the dock
// would be too wide with text, so there it is icons only.
const labelClass = 'hidden sm:block -ml-1 mr-2 text-sm font-medium hover:text-accent transition-colors whitespace-nowrap'

function Label({ href, active, onNavigate, external, children }: {
  href: string; active?: boolean; onNavigate?: () => void; external?: boolean; children: ReactNode
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
      tabIndex={-1}
      aria-hidden
      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      className={`${labelClass} ${active ? 'text-text-primary' : 'text-text-secondary'}`}
    >
      {children}
    </a>
  )
}

/** Same-page link: a real <a> (new tab, copy link) that navigates in place on a plain click. */
function PageLink({ href, label, active, onNavigate, children }: {
  href: string; label: string; active: boolean; onNavigate: () => void; children: ReactNode
}) {
  function onClick(e: MouseEvent<HTMLAnchorElement>) {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return
    e.preventDefault()
    onNavigate()
  }
  return (
    <a href={href} onClick={onClick} aria-label={label} title={label} aria-current={active ? 'page' : undefined} className={item}>
      {children}
      {/* the current page gets a dot underneath, as in the macOS dock */}
      {active && <span aria-hidden className="absolute bottom-[7%] left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-accent" />}
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
        className="mt-0 border-[var(--color-border)] bg-bg-surface/70 shadow-[0_8px_30px_rgba(0,0,0,0.25)]"
      >
        <DockIcon className="relative">
          <PageLink href={HOME_PATH} label="Home" active={page === 'home'} onNavigate={onHome}>
            <HomeIcon />
          </PageLink>
        </DockIcon>
        <Label href={HOME_PATH} active={page === 'home'} onNavigate={onHome}>Home</Label>
        <DockIcon className="relative">
          <PageLink href={HOW_PATH} label="How it works" active={page === 'how'} onNavigate={onHowItWorks}>
            <BookIcon />
          </PageLink>
        </DockIcon>
        <Label href={HOW_PATH} active={page === 'how'} onNavigate={onHowItWorks}>How it works</Label>

        <div aria-hidden className="w-px self-stretch my-1.5 bg-[var(--color-border)]" />

        {/* a flat list, not Fragments: the dock only magnifies its direct DockIcon children */}
        {PROFILES.flatMap(({ name, href, path }) => [
          <DockIcon key={name} className="relative">
            <a href={href} target="_blank" rel="noopener noreferrer" aria-label={name} title={name} className={item}>
              <svg viewBox="0 0 24 24" fill="currentColor" className="size-[46%]" aria-hidden><path d={path} /></svg>
            </a>
          </DockIcon>,
          <Label key={`${name}-label`} href={href} external>{name}</Label>,
        ])}
        <DockIcon className="relative">
          <button
            type="button"
            onClick={onToggleTheme}
            aria-label={isLight ? 'Switch to dark mode' : 'Switch to light mode'}
            title={isLight ? 'Dark mode' : 'Light mode'}
            className={`${item} [&>svg]:size-[42%]`}
          >
            {isLight ? <MoonIcon /> : <SunIcon />}
          </button>
        </DockIcon>
      </Dock>
    </nav>
  )
}

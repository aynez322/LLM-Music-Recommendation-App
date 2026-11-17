import type { ReactNode } from 'react'
import { PROFILES } from '../../lib/profiles'

function Credit({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-text-secondary underline decoration-[var(--color-border)] underline-offset-4 hover:text-accent hover:decoration-accent transition-colors"
    >
      {children}
    </a>
  )
}

function ProfileLinks() {
  return (
    <ul className="flex items-center gap-1 -ml-2 sm:ml-auto sm:-mr-2 flex-shrink-0">
      {PROFILES.map(({ name, href, path }) => {
        const icon = (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
            <path d={path} />
          </svg>
        )
        return (
          <li key={name}>
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={name}
              title={name}
              className="w-10 h-10 rounded-full flex items-center justify-center text-text-secondary hover:text-accent hover:bg-bg-raised transition-colors"
            >
              {icon}
            </a>
          </li>
        )
      })}
    </ul>
  )
}

/** Where the music comes from: credits for the services the results are built on. */
export function Footer() {
  return (
    <footer className="relative border-t border-[var(--color-border)]">
      <div className="max-w-5xl mx-auto px-4 py-8 flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-10">
        <div className="flex items-center gap-2 flex-shrink-0">
          <img src="/favicon.svg" alt="" className="w-5 h-5 rounded-[4px]" />
          <span className="font-display text-text-secondary">Listeners Like Me</span>
        </div>
        <p className="text-text-muted text-sm leading-relaxed max-w-[62ch]">
          Built on what people actually play: listening data from{' '}
          <Credit href="https://www.last.fm">Last.fm</Credit> and{' '}
          <Credit href="https://listenbrainz.org">ListenBrainz</Credit>, songs and 30-second previews
          from <Credit href="https://www.deezer.com">Deezer</Credit>, and sound matching by the{' '}
          <Credit href="https://huggingface.co/laion/clap-htsat-unfused">CLAP</Credit> audio model.
        </p>
        <ProfileLinks />
      </div>
    </footer>
  )
}

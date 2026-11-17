import type { ReactNode } from 'react'

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
      </div>
    </footer>
  )
}

import { useEffect, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { EASE_OUT } from '../../lib/motion'
import { SEED } from './exampleData'

const TYPE_MS = 85

/** Step 1: the song is typed in, then becomes the exact track. */
export function StepPick({ play }: { play: boolean }) {
  const reduce = useReducedMotion()
  const full = SEED.title.length + SEED.artist.length
  const [n, setN] = useState(0)
  const typed = reduce ? full : n
  const done = typed >= full

  useEffect(() => {
    if (!play || reduce) return
    const id = window.setInterval(() => {
      setN(v => {
        if (v >= full) { window.clearInterval(id); return v }
        return v + 1
      })
    }, TYPE_MS)
    return () => window.clearInterval(id)
  }, [play, reduce, full])

  const title = SEED.title.slice(0, Math.min(typed, SEED.title.length))
  const artist = SEED.artist.slice(0, Math.max(0, typed - SEED.title.length))
  const caret = !done && play
  const field = 'flex-1 min-w-0 h-9 rounded-lg border border-[var(--color-border)] bg-bg-raised px-3 flex items-center text-sm text-text-primary'

  return (
    <div aria-hidden className="flex flex-col gap-4">
      <div className="flex gap-2">
        <div className={field}>
          {title}
          {caret && typed < SEED.title.length && <span className="ml-px w-px h-4 bg-accent animate-pulse" />}
        </div>
        <div className={field}>
          {artist}
          {caret && typed >= SEED.title.length && <span className="ml-px w-px h-4 bg-accent animate-pulse" />}
        </div>
      </div>

      {/* the exact track it resolves to: lead of the step, arrives once typing ends */}
      <motion.div
        initial={false}
        animate={done ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 8, scale: 0.97 }}
        transition={{ duration: 0.4, ease: EASE_OUT }}
        className="flex items-center gap-3 rounded-xl border border-accent/40 bg-bg-surface p-2.5 card-glow-hover"
      >
        <img src={SEED.cover} alt="" className="w-12 h-12 rounded-lg object-cover" />
        <div className="min-w-0">
          <p className="text-text-primary text-sm font-semibold truncate">{SEED.title}</p>
          <p className="text-text-secondary text-xs truncate">{SEED.artist} · {SEED.album}</p>
        </div>
        <span className="ml-auto mr-1 text-accent">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M5 13l4 4L19 7" /></svg>
        </span>
      </motion.div>
    </div>
  )
}

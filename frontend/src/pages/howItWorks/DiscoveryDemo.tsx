import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { EASE_OUT } from '../../lib/motion'
import { DEEP, DISCOVERY_SEED, FAMILIAR, type ExampleSong } from './exampleData'

type Mode = 'familiar' | 'deep'
const MODES: { id: Mode; label: string }[] = [
  { id: 'familiar', label: 'Familiar hits' },
  { id: 'deep', label: 'Deep cuts' },
]
const MAX_RANK = Math.max(...[...FAMILIAR, ...DEEP].map(s => s.rank))

function Row({ song }: { song: ExampleSong }) {
  return (
    // rows of both lists share a slot and crossfade in place; a touch of blur
    // makes the swap read as one row changing, not two rows overlapping
    <motion.div
      className="absolute inset-0 flex items-center gap-3"
      initial={{ opacity: 0, y: 6, filter: 'blur(2px)' }}
      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      exit={{ opacity: 0, y: -6, filter: 'blur(2px)', transition: { duration: 0.15, ease: EASE_OUT } }}
      transition={{ duration: 0.22, ease: EASE_OUT }}
    >
      <img src={song.cover} alt="" className="w-10 h-10 rounded-md object-cover flex-shrink-0" />
      <div className="min-w-0 flex-1">
        <p className="text-text-primary text-sm font-medium truncate">{song.title}</p>
        <p className="text-text-muted text-xs truncate">{song.artist}</p>
      </div>
      <div className="w-20 sm:w-28 flex-shrink-0" title="Deezer popularity">
        <div className="h-1.5 rounded-full bg-bg-raised overflow-hidden">
          <div className="h-full rounded-full bg-text-muted/70" style={{ width: `${(song.rank / MAX_RANK) * 100}%` }} />
        </div>
      </div>
    </motion.div>
  )
}

/** A real before/after of the Discovery slider: the songs that change. */
export function DiscoveryDemo() {
  const [mode, setMode] = useState<Mode>('familiar')
  const list = mode === 'familiar' ? FAMILIAR : DEEP

  return (
    <div className="rounded-2xl border border-[var(--color-border)] bg-bg-surface/80 backdrop-blur-sm p-4 sm:p-5">
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <img src={DISCOVERY_SEED.cover} alt="" className="w-8 h-8 rounded-md object-cover" />
        <p className="text-sm text-text-secondary mr-auto">
          Similar to <span className="text-text-primary font-medium">{DISCOVERY_SEED.title}</span> by {DISCOVERY_SEED.artist}
        </p>
        <div role="radiogroup" aria-label="Discovery" className="relative flex rounded-full border border-[var(--color-border)] bg-bg-raised p-0.5">
          {MODES.map(m => (
            <button
              key={m.id}
              type="button"
              role="radio"
              aria-checked={mode === m.id}
              onClick={() => setMode(m.id)}
              className={`relative px-3 py-1 text-xs font-medium rounded-full transition-[color,transform] duration-150 active:scale-[0.97] ${
                mode === m.id ? 'text-on-accent' : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              {mode === m.id && (
                <motion.span
                  layoutId="discovery-demo-pill"
                  className="absolute inset-0 rounded-full bg-accent-fill"
                  transition={{ type: 'spring', duration: 0.35, bounce: 0.15 }}
                />
              )}
              <span className="relative">{m.label}</span>
            </button>
          ))}
        </div>
      </div>

      <ul aria-live="polite" className="flex flex-col gap-2">
        {list.map((song, i) => (
          <li key={i} className="relative h-11">
            <span className="sr-only">{song.title} by {song.artist}</span>
            <div aria-hidden>
              <AnimatePresence initial={false}>
                <Row key={song.deezer_id} song={song} />
              </AnimatePresence>
            </div>
          </li>
        ))}
      </ul>
      <p className="mt-4 text-xs text-text-muted">
        Bars: how much each song is played on Deezer. The other 7 of the 10 results stay the same.
      </p>
    </div>
  )
}

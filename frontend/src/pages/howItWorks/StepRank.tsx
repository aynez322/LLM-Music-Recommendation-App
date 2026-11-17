import { motion, useReducedMotion } from 'framer-motion'
import { EASE_OUT } from '../../lib/motion'
import { DROPPED, KEPT } from './exampleData'

const CANDIDATES = [...KEPT, ...DROPPED].sort((a, b) => a.deezer_id % 7 - b.deezer_id % 7)
const DROPPED_IDS = new Set(DROPPED.map(s => s.deezer_id))
const TOP = KEPT.slice(0, 3)

// timeline (seconds after the step comes into view)
const SCAN = 0.9         // the "listening" sweep crosses the covers
const DROP_AT = 0.85     // weaker matches dim as the sweep finishes
const RANK_AT = 1.05     // the top three land
const ROW_GAPS = [0, 0.07, 0.12]

/** Step 3: every candidate is listened to; the weak ones drop, the best are ranked. */
export function StepRank({ play }: { play: boolean }) {
  const reduce = useReducedMotion()
  const on = play || !!reduce
  const t = (s: number) => (reduce ? 0 : s)

  return (
    <div aria-hidden className="flex flex-col gap-4">
      <div className="relative overflow-hidden rounded-xl">
        <div className="grid grid-cols-7 gap-1.5">
          {CANDIDATES.map(s => {
            const dropped = DROPPED_IDS.has(s.deezer_id)
            return (
              <motion.img
                key={s.deezer_id}
                src={s.cover}
                alt=""
                title={`${s.title} · ${s.artist}`}
                className="w-full aspect-square rounded-md object-cover"
                initial={false}
                animate={on && dropped ? { opacity: 0.2, filter: 'grayscale(1)' } : { opacity: 1, filter: 'grayscale(0)' }}
                transition={{ duration: t(0.35), delay: t(DROP_AT), ease: 'easeOut' }}
              />
            )
          })}
        </div>
        {/* the sweep: constant motion, so linear */}
        {!reduce && (
          <motion.div
            className="absolute inset-y-0 w-1/4 pointer-events-none"
            style={{ background: 'linear-gradient(90deg, transparent, color-mix(in srgb, var(--color-cyan) 45%, transparent), transparent)' }}
            initial={{ x: '-100%', opacity: 0 }}
            animate={on ? { x: '400%', opacity: [0, 1, 1, 0] } : { x: '-100%', opacity: 0 }}
            transition={{ duration: SCAN, ease: 'linear' }}
          />
        )}
      </div>

      <ol className="flex flex-col gap-1.5">
        {TOP.map((s, i) => (
          <motion.li
            key={s.deezer_id}
            className="flex items-center gap-3 rounded-lg bg-bg-raised/70 px-2.5 py-1.5"
            initial={false}
            animate={on ? { opacity: 1, y: 0 } : { opacity: 0, y: 6 }}
            transition={{ duration: t(0.35), delay: t(RANK_AT + ROW_GAPS[i]), ease: EASE_OUT }}
          >
            <span className="w-4 text-accent text-xs font-bold tabular-nums">{i + 1}</span>
            <img src={s.cover} alt="" className="w-8 h-8 rounded object-cover" />
            <div className="min-w-0 flex-1">
              <p className="text-text-primary text-xs font-semibold truncate">{s.title}</p>
              <p className="text-text-muted text-[11px] truncate">{s.artist}</p>
            </div>
            <div className="w-16 flex-shrink-0">
              <div className="flex justify-end text-[11px] text-text-primary font-semibold tabular-nums mb-0.5">
                {Math.round(s.score * 100)}
              </div>
              <div className="h-1 rounded-full bg-bg-base overflow-hidden">
                <motion.div
                  className="h-full origin-left rounded-full bg-gradient-to-r from-accent to-cyan"
                  style={{ width: `${s.score * 100}%` }}
                  initial={false}
                  animate={{ scaleX: on ? 1 : 0 }}
                  transition={{ duration: t(0.5), delay: t(RANK_AT + ROW_GAPS[i] + 0.1), ease: EASE_OUT }}
                />
              </div>
            </div>
          </motion.li>
        ))}
      </ol>
    </div>
  )
}

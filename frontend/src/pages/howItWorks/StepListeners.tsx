import { motion, useReducedMotion } from 'framer-motion'
import { EASE_OUT, waveDelays } from '../../lib/motion'
import { DROPPED, KEPT, SEED } from './exampleData'

// the real candidates of the example, around the seed (kept and dropped mixed,
// as they'd arrive: this step doesn't know yet which ones will make it)
const CANDIDATES = [...KEPT, ...DROPPED].sort((a, b) => a.deezer_id % 7 - b.deezer_id % 7)
const n = CANDIDATES.length
const SPOTS = CANDIDATES.map((_, i) => {
  const a = (i / n) * Math.PI * 2 - Math.PI / 2
  return { x: 50 + 41 * Math.cos(a), y: 50 + 39 * Math.sin(a) }
})
const DELAYS = waveDelays(n, 0.5)
const LINE = 0.4   // how long a line takes to reach its song

/** Step 2: lines fan out from the seed to what its listeners also play. */
export function StepListeners({ play }: { play: boolean }) {
  const reduce = useReducedMotion()
  const on = play || !!reduce
  return (
    <div aria-hidden className="relative w-full aspect-[16/11]">
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 w-full h-full overflow-visible">
        {SPOTS.map((p, i) => (
          <motion.line
            key={i}
            x1={50} y1={50} x2={p.x} y2={p.y}
            stroke="var(--color-accent)"
            strokeOpacity={0.45}
            strokeWidth={1.2}
            vectorEffect="non-scaling-stroke"
            initial={false}
            animate={{ pathLength: on ? 1 : 0 }}
            transition={reduce ? { duration: 0 } : { duration: LINE, delay: DELAYS[i], ease: EASE_OUT }}
          />
        ))}
      </svg>

      {CANDIDATES.map((s, i) => (
        <motion.img
          key={s.deezer_id}
          src={s.cover}
          alt=""
          title={`${s.title} · ${s.artist}`}
          className="absolute w-9 h-9 sm:w-10 sm:h-10 -ml-[18px] -mt-[18px] sm:-ml-5 sm:-mt-5 rounded-md object-cover shadow-[0_2px_10px_rgba(0,0,0,0.35)]"
          style={{ left: `${SPOTS[i].x}%`, top: `${SPOTS[i].y}%` }}
          initial={false}
          animate={on ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
          // lands as its line arrives
          transition={reduce ? { duration: 0 } : { duration: 0.3, delay: DELAYS[i] + LINE * 0.75, ease: EASE_OUT }}
        />
      ))}

      {/* the seed: already there from step 1, so it doesn't animate */}
      <img
        src={SEED.cover}
        alt=""
        className="absolute left-1/2 top-1/2 w-16 h-16 -ml-8 -mt-8 rounded-xl object-cover ring-2 ring-accent shadow-[0_6px_24px_rgba(212,105,42,0.4)]"
      />
    </div>
  )
}

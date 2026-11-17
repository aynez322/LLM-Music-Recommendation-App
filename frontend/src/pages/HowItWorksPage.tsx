import { useRef, type ReactNode } from 'react'
import { motion, useInView } from 'framer-motion'
import { EASE_OUT } from '../lib/motion'
import { RecommendationCard } from '../components/recommendations/RecommendationCard'
import { StepPick } from './howItWorks/StepPick'
import { StepListeners } from './howItWorks/StepListeners'
import { StepRank } from './howItWorks/StepRank'
import { DiscoveryDemo } from './howItWorks/DiscoveryDemo'
import { SAMPLE, SEED } from './howItWorks/exampleData'
import type { Track } from '../types/music'

interface HowItWorksPageProps {
  /** Back to the home page with the search box focused. */
  onStart: () => void
  /** Run the walkthrough's own example search for real. */
  onTry: (track: Track) => void
}

/** Entrance of the top of the page: one wave, gaps shrinking (0, 80, 140ms). */
function rise(delay: number, y: number) {
  return {
    initial: { opacity: 0, y },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5, delay, ease: EASE_OUT },
  }
}

/**
 * One step: text beside its illustration. Below the fold, the section fades
 * in when it's scrolled to, and its illustration plays as it arrives.
 */
function Step({ num, title, children, art, flip = false, first = false }: {
  num: string; title: string; children: ReactNode
  art: (play: boolean) => ReactNode; flip?: boolean; first?: boolean
}) {
  const ref = useRef<HTMLElement>(null)
  const seen = useInView(ref, { once: true, margin: '-120px' })
  const enter = first ? rise(0.14, 8) : {
    initial: { opacity: 0, y: 8 },
    animate: seen ? { opacity: 1, y: 0 } : undefined,
    transition: { duration: 0.45, ease: EASE_OUT },
  }
  return (
    <motion.section ref={ref} {...enter} className="grid items-center gap-6 sm:gap-10 sm:grid-cols-2">
      <div className={flip ? 'sm:order-2' : ''}>
        <p className="gradient-text font-display text-2xl font-bold leading-none mb-3 select-none">{num}</p>
        <h2 className="text-text-primary text-lg font-semibold mb-2">{title}</h2>
        <div className="text-text-secondary text-sm leading-relaxed space-y-2">{children}</div>
      </div>
      <div className="rounded-2xl border border-[var(--color-border)] bg-bg-surface/80 backdrop-blur-sm p-4 sm:p-5">
        {art(seen)}
      </div>
    </motion.section>
  )
}

const buttonBase = 'px-6 py-3 rounded-xl text-sm font-semibold transition-[background-color,border-color,color,transform] duration-150 active:scale-[0.97]'

export function HowItWorksPage({ onStart, onTry }: HowItWorksPageProps) {
  return (
    <div className="max-w-4xl mx-auto">
      <header className="text-center mb-14">
        <motion.h1 {...rise(0, 12)} className="gradient-text font-display text-4xl sm:text-5xl font-bold tracking-tight leading-tight">
          How it works
        </motion.h1>
        <motion.p {...rise(0.08, 8)} className="text-text-secondary text-base mt-3 max-w-xl mx-auto leading-relaxed">
          One real search, start to finish: what happens between typing a song
          and getting ten that sound like it.
        </motion.p>
      </header>

      <div className="flex flex-col gap-16 sm:gap-20">
        <Step first num="01" title="Pick a song" art={play => <StepPick play={play} />}>
          <p>
            Type a song and artist, or pick one from the suggestions. It's matched to the
            exact track on Deezer, so anything there works, new releases included.
          </p>
        </Step>

        <Step flip num="02" title="Follow the listeners" art={play => <StepListeners play={play} />}>
          <p>
            Last.fm and ListenBrainz show what people who play that song also play,
            which artists get played alongside it, and more from the same artist.
          </p>
          <p>For “{SEED.title}” that's 50 candidates.</p>
        </Step>

        <Step num="03" title="Listen and rank" art={play => <StepRank play={play} />}>
          <p>
            An audio AI (CLAP) listens to the 30-second preview of every candidate and
            compares it with yours. Listener evidence and sound are blended into one
            match score, with one song per artist so the list stays varied.
          </p>
          <p>The weaker matches drop out; the best ten are yours.</p>
        </Step>

        <ScrollReveal>
          <h2 className="text-text-primary text-lg font-semibold mb-2">Every pick explains itself</h2>
          <p className="text-text-secondary text-sm leading-relaxed mb-5 max-w-2xl">
            Each result shows why it's there: who else plays it, how close it sounds, and
            what the two have in common. This is #3 from that search, as it appears in the
            app. Press the cover to hear it.
          </p>
          <RecommendationCard rec={SAMPLE} rank={3} />
        </ScrollReveal>

        <ScrollReveal>
          <h2 className="text-text-primary text-lg font-semibold mb-2">Discovery</h2>
          <p className="text-text-secondary text-sm leading-relaxed mb-5 max-w-2xl">
            The Discovery slider trades well-known songs for less-played ones. Here's what
            it really changes for one song. Try it:
          </p>
          <DiscoveryDemo />
        </ScrollReveal>

        <ScrollReveal className="flex flex-col sm:flex-row items-center justify-center gap-3 pb-4">
          <button
            type="button"
            onClick={() => onTry(SEED)}
            className={`${buttonBase} bg-accent-fill hover:bg-accent-fill-hover text-on-accent`}
          >
            Try it with “{SEED.title}”
          </button>
          <button
            type="button"
            onClick={onStart}
            className={`${buttonBase} border border-[var(--color-border)] bg-bg-surface/60 backdrop-blur-sm hover:border-accent text-text-secondary hover:text-accent`}
          >
            Search your own song
          </button>
        </ScrollReveal>
      </div>
    </div>
  )
}

/** Fades a section in once, when it's scrolled to. Its content doesn't animate on its own. */
function ScrollReveal({ children, className = '' }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const seen = useInView(ref, { once: true, margin: '-80px' })
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 8 }}
      animate={seen ? { opacity: 1, y: 0 } : undefined}
      transition={{ duration: 0.45, ease: EASE_OUT }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

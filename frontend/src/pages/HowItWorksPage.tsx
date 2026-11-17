import { motion } from 'framer-motion'
import { HowItWorks } from '../components/home/HowItWorks'

interface HowItWorksPageProps {
  /** Back to the home page with the search box focused. */
  onStart: () => void
}

const details = [
  {
    title: 'Discovery',
    desc: 'The Discovery slider shifts the results from familiar hits to deep cuts. Move it after a search and use "Update results" to redo the list.',
  },
  {
    title: 'Every pick explains itself',
    desc: 'Each song shows the evidence behind it: who else listens to it, how close it sounds, and what the two have in common, like "Both have: acoustic guitar, slow and calm".',
  },
  {
    title: 'One song per artist',
    desc: 'Listener evidence and sound are blended into one match score, with one song per artist so the list stays varied. Any song on Deezer works, including new releases.',
  },
]

export function HowItWorksPage({ onStart }: HowItWorksPageProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="max-w-3xl mx-auto"
    >
      <header className="text-center mb-10">
        <h1 className="gradient-text font-display text-4xl sm:text-5xl font-bold tracking-tight leading-tight">
          How it works
        </h1>
        <p className="text-text-secondary text-base mt-3 max-w-xl mx-auto leading-relaxed">
          Type a song. We find what people who love it also play, listen to every candidate,
          and tell you why each one fits.
        </p>
      </header>

      <HowItWorks title={false} />

      <div className="mt-10 grid gap-6 sm:grid-cols-3">
        {details.map(d => (
          <div key={d.title}>
            <h2 className="text-text-primary text-sm font-semibold mb-1.5">{d.title}</h2>
            <p className="text-text-secondary text-sm leading-relaxed">{d.desc}</p>
          </div>
        ))}
      </div>

      <div className="mt-12 flex justify-center">
        <button
          type="button"
          onClick={onStart}
          className="px-6 py-3 rounded-xl bg-accent-fill hover:bg-accent-fill-hover text-on-accent text-sm font-semibold transition-colors"
        >
          Find similar songs
        </button>
      </div>
    </motion.div>
  )
}

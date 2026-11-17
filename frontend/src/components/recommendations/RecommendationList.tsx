import { useState } from 'react'
import { AnimatedList } from '@/components/magicui/animated-list'
import { prefersReducedMotion } from '../../lib/media'
import type { Recommendation } from '../../types/music'
import { RecommendationCard } from './RecommendationCard'
import { TrackDetailModal } from './TrackDetailModal'

// ms after card i before the next one: shrinking gaps, so the top five land
// as one wave (0, 60, 100, 130, 150ms) and the rest arrive with the fifth
const REVEAL_GAPS = [60, 40, 30, 20]
const revealGap = (i: number) => REVEAL_GAPS[i] ?? 0

export function RecommendationList({ recommendations }: { recommendations: Recommendation[] }) {
  const [selected, setSelected] = useState<number | null>(null)
  const [origin, setOrigin]     = useState<number | null>(null)

  return (
    <div>
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 mb-4">
        <h2 className="font-display text-text-primary text-xl">You might also like</h2>
        <p className="text-text-muted text-xs">Play a cover to hear a 30s preview</p>
      </div>
      {/* Magic UI's animated list, growing downward so #1 stays on top */}
      <AnimatedList
        newestOnTop={false}
        delay={prefersReducedMotion() ? 0 : revealGap}
        className="gap-3"
      >
        {recommendations.map((rec, i) => (
          <RecommendationCard
            key={rec.track.deezer_id}
            rec={rec}
            rank={i + 1}
            onClick={() => { setOrigin(i); setSelected(i) }}
          />
        ))}
      </AnimatedList>

      <TrackDetailModal
        recs={recommendations}
        index={selected}
        originIndex={origin}
        // browsing away ends the shared-cover link: only the opened track flies home
        onIndexChange={(i) => { setOrigin(null); setSelected(i) }}
        onClose={() => setSelected(null)}
      />
    </div>
  )
}

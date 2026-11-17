// Shared motion curves (framer-motion cubic-bezier arrays).

/** Strong ease-out: starts fast, so things feel responsive. For entrances. */
export const EASE_OUT = [0.23, 1, 0.32, 1] as const

/** Spread `n` stagger delays over `total` seconds with shrinking gaps, so a
 *  group reads as one wave instead of a metronome. */
export function waveDelays(n: number, total: number): number[] {
  return Array.from({ length: n }, (_, i) => {
    const t = n <= 1 ? 0 : i / (n - 1)
    return total * (1 - (1 - t) * (1 - t))
  })
}

// The current search lives in the URL, so results can be shared and the
// browser's back button walks between searches and home.
//   ?track=<deezer id>&d=0.50            an exact track (after the seed resolves)
//   ?q=<title>&artist=<artist>&d=0.50    typed text, until the backend resolves it

export interface SearchQuery {
  deezerId?: number
  title?: string
  artist?: string
  discovery: number
}

export const DEFAULT_DISCOVERY = 0.5

// The two pages. Searches always live on the home page's URL.
export type Page = 'home' | 'how'
export const HOME_PATH = '/'
export const HOW_PATH = '/how-it-works'

export function pageFromPath(): Page {
  return window.location.pathname.replace(/\/+$/, '') === HOW_PATH ? 'how' : 'home'
}

export function pushPage(page: Page) {
  const path = page === 'how' ? HOW_PATH : HOME_PATH
  if (window.location.pathname + window.location.search !== path) window.history.pushState(null, '', path)
}

function clampDiscovery(raw: string | null): number {
  const d = Number(raw)
  return raw !== null && Number.isFinite(d) ? Math.min(1, Math.max(0, d)) : DEFAULT_DISCOVERY
}

export function readQuery(): SearchQuery | null {
  if (pageFromPath() !== 'home') return null
  const p = new URLSearchParams(window.location.search)
  const discovery = clampDiscovery(p.get('d'))
  const id = Number(p.get('track'))
  if (Number.isInteger(id) && id > 0) return { deezerId: id, discovery }
  const title = p.get('q')?.trim()
  if (title) return { title, artist: p.get('artist')?.trim() ?? '', discovery }
  return null
}

function urlFor(q: SearchQuery): string {
  const p = new URLSearchParams()
  if (q.deezerId) p.set('track', String(q.deezerId))
  else {
    p.set('q', q.title ?? '')
    if (q.artist) p.set('artist', q.artist)
  }
  p.set('d', q.discovery.toFixed(2))
  return `${HOME_PATH}?${p}`
}

export function pushQuery(q: SearchQuery) {
  const url = urlFor(q)
  if (url !== window.location.pathname + window.location.search) window.history.pushState(null, '', url)
}

export function replaceQuery(q: SearchQuery) {
  window.history.replaceState(null, '', urlFor(q))
}

export function pushHome() {
  pushPage('home')
}

/** Home in place of the current entry: a cancelled search leaves no trace in history. */
export function replaceHome() {
  window.history.replaceState(null, '', HOME_PATH)
}

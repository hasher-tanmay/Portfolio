import { useLayoutEffect, useSyncExternalStore } from 'react'
import { skillsSlug, spreads } from './catalog'

export type Direction = 'next' | 'previous'
type Route = { pathname: string; page: 1 | 2 }
const eventName = 'notebook-navigation'

const snapshot = () => window.location.pathname + window.location.hash

function subscribe(change: () => void) {
  window.addEventListener('popstate', change)
  window.addEventListener('hashchange', change)
  window.addEventListener(eventName, change)
  return () => {
    window.removeEventListener('popstate', change)
    window.removeEventListener('hashchange', change)
    window.removeEventListener(eventName, change)
  }
}

export function useRoute(): Route {
  const location = useSyncExternalStore(subscribe, snapshot)
  const [pathname = '/', fragment] = location.split('#')
  const normalized = pathname.replace(/\/+$/, '') || '/'
  const legacy = normalized === '/spread/experiments'
  const page = fragment === 'page-2' ? 2 : 1
  useLayoutEffect(() => {
    if (!legacy) return
    const search = window.location.search
    window.history.replaceState(window.history.state, '', `${spreadPath(skillsSlug)}${search}${page === 2 ? '#page-2' : ''}`)
    window.dispatchEvent(new Event(eventName))
  }, [legacy, page])
  return {
    pathname: legacy ? spreadPath(skillsSlug) : normalized,
    page,
  }
}

export function spreadPath(slug: string, page: 1 | 2 = 1) {
  return `/spread/${slug}${page === 2 ? '#page-2' : ''}`
}

export function readingOrder(index: number | 'cover', page: 1 | 2, mobile: boolean) {
  if (index === 'cover') return { previous: null, next: spreadPath('about') }
  const spread = spreads[index]
  if (!spread) return { previous: null, next: null }
  const earlier = spreads[index - 1]
  const later = spreads[index + 1]
  return {
    previous: mobile && page === 2 ? spreadPath(spread.slug)
      : earlier ? spreadPath(earlier.slug, mobile ? 2 : 1) : '/',
    next: mobile && page === 1 ? spreadPath(spread.slug, 2) : later ? spreadPath(later.slug) : null,
  }
}

export function navigate(href: string) {
  if (href === snapshot()) return
  window.history.pushState(null, '', href)
  window.dispatchEvent(new Event(eventName))
}

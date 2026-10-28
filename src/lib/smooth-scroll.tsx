import Lenis from 'lenis'
import { useReducedMotion } from 'motion/react'
import { useCallback, useEffect, useRef, type ReactNode } from 'react'
import { ScrollContext, type ScrollTo } from './scroll-context'

const NAV_OFFSET = -72

/**
 * Lenis smooth scrolling for the whole page. It drives the native window scroll,
 * so Motion's useScroll keeps working. Skipped entirely for reduced-motion users.
 */
export function SmoothScroll({ children, paused = false }: { children: ReactNode; paused?: boolean }) {
  const reduce = useReducedMotion()
  const lenisRef = useRef<Lenis | null>(null)

  useEffect(() => {
    if (reduce) return
    const lenis = new Lenis({ autoRaf: true, lerp: 0.1 })
    lenisRef.current = lenis
    return () => {
      lenis.destroy()
      lenisRef.current = null
    }
  }, [reduce])

  // Locks the page (e.g. while the intro plays). Lenis's stylesheet clips overflow while stopped.
  useEffect(() => {
    if (paused) lenisRef.current?.stop()
    else lenisRef.current?.start()
  }, [paused, reduce])

  const scrollTo = useCallback<ScrollTo>(
    (hash) => {
      const target = hash === '#top' ? 0 : document.querySelector<HTMLElement>(hash)
      if (target === null) return
      if (lenisRef.current) {
        lenisRef.current.scrollTo(target, { offset: target === 0 ? 0 : NAV_OFFSET, duration: 1.4 })
      } else if (target === 0) {
        window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' })
      } else {
        target.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' })
      }
      history.replaceState(null, '', hash === '#top' ? location.pathname : hash)
    },
    [reduce],
  )

  return <ScrollContext.Provider value={scrollTo}>{children}</ScrollContext.Provider>
}

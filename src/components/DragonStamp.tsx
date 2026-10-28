import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from 'motion/react'
import { useEffect, useRef } from 'react'
import { stampSources } from '../lib/assets'
import { cn } from '../lib/cn'
import { canHover } from '../lib/motion'

const { small: stamp640, large: stamp1200 } = stampSources

type Props = {
  className?: string
  sizes?: string
  /** Tilt toward the cursor anywhere on the page, with a light sweep across the paper. */
  interactive?: boolean
  alt?: string
  priority?: boolean
}

/**
 * The RedDragon stamp. The perforated silhouette is real transparency, so the
 * drop shadow and the glare mask follow the stamp's edge.
 */
export function DragonStamp({
  className,
  sizes = '(min-width: 1024px) 36vw, 78vw',
  interactive = false,
  alt = 'RedDragon logo — a red dragon on a vintage postage stamp',
  priority = false,
}: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const reduce = useReducedMotion()

  const px = useMotionValue(0)
  const py = useMotionValue(0)
  const spring = { stiffness: 90, damping: 16, mass: 0.6 }
  const rotateY = useSpring(useTransform(px, [-1, 1], [-16, 16]), spring)
  const rotateX = useSpring(useTransform(py, [-1, 1], [12, -12]), spring)
  const glareX = useSpring(useTransform(px, [-1, 1], [15, 85]), spring)
  const glareY = useSpring(useTransform(py, [-1, 1], [10, 90]), spring)
  const glare = useMotionTemplate`radial-gradient(circle at ${glareX}% ${glareY}%, rgb(255 244 220 / 0.55), rgb(255 244 220 / 0.08) 32%, transparent 60%)`

  useEffect(() => {
    if (!interactive || reduce || !canHover()) return
    const onMove = (event: PointerEvent) => {
      const el = ref.current
      if (!el) return
      const rect = el.getBoundingClientRect()
      const cx = rect.left + rect.width / 2
      const cy = rect.top + rect.height / 2
      // Normalise against the viewport so the dragon "watches" the cursor from afar.
      px.set(Math.max(-1, Math.min(1, (event.clientX - cx) / (window.innerWidth / 2))))
      py.set(Math.max(-1, Math.min(1, (event.clientY - cy) / (window.innerHeight / 2))))
    }
    const onLeave = () => {
      px.set(0)
      py.set(0)
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    document.documentElement.addEventListener('pointerleave', onLeave)
    return () => {
      window.removeEventListener('pointermove', onMove)
      document.documentElement.removeEventListener('pointerleave', onLeave)
    }
  }, [interactive, reduce, px, py])

  const mask = `url(${stamp640}) center / 100% 100% no-repeat`

  return (
    <div ref={ref} className={cn('relative [perspective:1200px]', className)}>
      {/* Soft contact shadow, kept outside the 3D layer so it never re-rasterises. */}
      <div
        aria-hidden
        className="absolute inset-[8%] translate-y-[8%] rounded-[6%] bg-black/80 blur-3xl"
      />
      <motion.div
        className="relative [transform-style:preserve-3d]"
        style={interactive ? { rotateX, rotateY } : undefined}
      >
        <img
          src={stamp1200}
          srcSet={`${stamp640} 640w, ${stamp1200} 1200w`}
          sizes={sizes}
          width={1200}
          height={1200}
          alt={alt}
          draggable={false}
          fetchPriority={priority ? 'high' : 'auto'}
          decoding="async"
          className="block h-auto w-full"
        />
        {interactive && (
          <motion.div
            aria-hidden
            className="pointer-events-none absolute inset-0 mix-blend-soft-light"
            style={{ background: glare, mask, WebkitMask: mask }}
          />
        )}
      </motion.div>
    </div>
  )
}

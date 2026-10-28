import { useReducedMotion } from 'motion/react'
import { useEffect, useRef, type RefObject } from 'react'
import { cn } from '../lib/cn'

type Props = {
  className?: string
  /** Element the embers rise from (and burst out of once on load). Defaults to the bottom edge. */
  originRef?: RefObject<HTMLElement | null>
  /** Delay in ms before the opening burst; omit for no burst. */
  burstDelay?: number
  density?: number
}

type Ember = {
  x: number
  y: number
  vx: number
  vy: number
  life: number
  maxLife: number
  size: number
  hue: number
  seed: number
}

/**
 * Canvas ember field. Embers drift upward, sway, flicker and scatter away from the
 * cursor. Pauses off-screen and in background tabs; disabled for reduced motion.
 */
export function Embers({ className, originRef, burstDelay, density = 1 }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const reduce = useReducedMotion()

  useEffect(() => {
    if (reduce) return
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return

    const small = window.matchMedia('(max-width: 767px)').matches
    const cap = Math.round((small ? 34 : 85) * density)
    const dpr = Math.min(window.devicePixelRatio || 1, small ? 1.25 : 1.5)
    const embers: Ember[] = []
    const pointer = { x: -9999, y: -9999 }
    let width = 0
    let height = 0
    let origin = { x: 0, y: 0, r: 0 }
    let frame = 0
    let raf = 0
    let visible = true

    const measureOrigin = () => {
      const box = canvas.getBoundingClientRect()
      const el = originRef?.current
      if (!el) {
        origin = { x: width / 2, y: height + 10, r: width / 2 }
        return
      }
      const r = el.getBoundingClientRect()
      origin = {
        x: r.left - box.left + r.width / 2,
        y: r.top - box.top + r.height * 0.55,
        r: r.width / 2,
      }
    }

    const resize = () => {
      const box = canvas.getBoundingClientRect()
      width = box.width
      height = box.height
      canvas.width = Math.round(width * dpr)
      canvas.height = Math.round(height * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      measureOrigin()
    }

    const spawn = (burst = false) => {
      const fromOrigin = burst || (originRef?.current != null && Math.random() < 0.65)
      const angle = Math.random() * Math.PI * 2
      const spread = origin.r * (0.25 + Math.random() * 0.85)
      embers.push({
        x: fromOrigin ? origin.x + Math.cos(angle) * spread : Math.random() * width,
        y: fromOrigin ? origin.y + Math.sin(angle) * spread * 0.6 : height + 8,
        vx: (Math.random() - 0.5) * (burst ? 5 : 0.45),
        vy: -(0.35 + Math.random() * (burst ? 4.2 : 1.15)),
        life: 0,
        maxLife: 140 + Math.random() * 200,
        size: 0.6 + Math.random() * 2.1,
        hue: 4 + Math.random() * 30,
        seed: Math.random() * 1000,
      })
    }

    const tick = () => {
      raf = requestAnimationFrame(tick)
      if (!visible) return
      frame++
      if (frame % 45 === 0) measureOrigin()
      if (embers.length < cap && Math.random() < 0.55) spawn()

      ctx.clearRect(0, 0, width, height)
      ctx.globalCompositeOperation = 'lighter'

      for (let i = embers.length - 1; i >= 0; i--) {
        const e = embers[i]
        e.life++
        e.vx += Math.sin((e.life + e.seed) * 0.035) * 0.018
        e.vx *= 0.985
        e.vy *= 0.996
        const dx = e.x - pointer.x
        const dy = e.y - pointer.y
        const dist2 = dx * dx + dy * dy
        if (dist2 < 140 * 140 && dist2 > 1) {
          const force = (1 - Math.sqrt(dist2) / 140) * 0.55
          e.vx += (dx / Math.sqrt(dist2)) * force
          e.vy += (dy / Math.sqrt(dist2)) * force
        }
        e.x += e.vx
        e.y += e.vy

        if (e.life > e.maxLife || e.y < -20 || e.x < -40 || e.x > width + 40) {
          embers.splice(i, 1)
          continue
        }

        const t = e.life / e.maxLife
        const flicker = 0.65 + Math.sin(e.life * 0.3 + e.seed) * 0.35
        const alpha = Math.sin(Math.PI * t) * flicker
        const light = 62 - t * 22

        ctx.fillStyle = `hsla(${e.hue}, 100%, ${light}%, ${alpha * 0.16})`
        ctx.beginPath()
        ctx.arc(e.x, e.y, e.size * 4, 0, Math.PI * 2)
        ctx.fill()

        ctx.fillStyle = `hsla(${e.hue + 12}, 100%, ${light + 18}%, ${alpha})`
        ctx.beginPath()
        ctx.arc(e.x, e.y, e.size, 0, Math.PI * 2)
        ctx.fill()
      }
    }

    const onPointer = (event: PointerEvent) => {
      const box = canvas.getBoundingClientRect()
      pointer.x = event.clientX - box.left
      pointer.y = event.clientY - box.top
    }

    resize()
    const resizeObserver = new ResizeObserver(resize)
    resizeObserver.observe(canvas)
    const visibility = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting && document.visibilityState === 'visible'
    })
    visibility.observe(canvas)
    const onVisibility = () => {
      visible = document.visibilityState === 'visible'
    }
    document.addEventListener('visibilitychange', onVisibility)
    window.addEventListener('pointermove', onPointer, { passive: true })

    const burstTimer =
      burstDelay === undefined
        ? undefined
        : window.setTimeout(() => {
            measureOrigin()
            for (let i = 0; i < (small ? 26 : 60); i++) spawn(true)
          }, burstDelay)

    raf = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(raf)
      window.clearTimeout(burstTimer)
      resizeObserver.disconnect()
      visibility.disconnect()
      document.removeEventListener('visibilitychange', onVisibility)
      window.removeEventListener('pointermove', onPointer)
    }
  }, [reduce, originRef, burstDelay, density])

  return <canvas ref={canvasRef} aria-hidden className={cn('pointer-events-none', className)} />
}

import { useEffect, useRef } from 'react'
import dragon1200 from '../assets/intro/dragon-1200.webp'
import dragon2400 from '../assets/intro/dragon-2400.webp'
import flames1200 from '../assets/intro/flames-1200.webp'
import flames2400 from '../assets/intro/flames-2400.webp'

type Props = {
  /** Fired as the fire burns through — the page underneath starts its entrance. */
  onReveal: () => void
  /** Fired once the overlay has fully burned away and can unmount. */
  onFinish: () => void
}

// Landmarks in the dragon artwork, as fractions of the square image.
const MOUTH = { x: 0.387, y: 0.517 }
// Back of the throat — the painted fire grows outward from here.
const THROAT_X = 0.527
const EYE = { x: 0.539, y: 0.35 }
// Left and slightly downward — the direction of the painted flames.
const FIRE_ANGLE = Math.PI - 0.32

// Timeline in seconds.
const T = {
  rear: 0.95,
  lunge: 1.2,
  fireFade: 2.25,
  flash: 2.25,
  reveal: 2.7,
  finish: 3.45,
  /** Skipping jumps straight to the flash. */
  skipTo: 2.35,
  /** Give up on the intro if the artwork hasn't decoded by then. */
  loadTimeout: 2500,
}

const clamp01 = (v: number) => Math.min(1, Math.max(0, v))
const seg = (t: number, from: number, to: number) => clamp01((t - from) / (to - from))
const easeOut = (x: number) => 1 - Math.pow(1 - x, 3)
const easeIn = (x: number) => x * x * x
const easeInOut = (x: number) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2)
const easeOutBack = (x: number) => 1 + 2.70158 * Math.pow(x - 1, 3) + 1.70158 * Math.pow(x - 1, 2)
const randn = () => (Math.random() + Math.random() + Math.random() - 1.5) / 1.5

type Flame = { x: number; y: number; vx: number; vy: number; age: number; life: number; size: number; grow: number; seed: number }
type Spark = { x: number; y: number; vx: number; vy: number; age: number; life: number; hue: number }

function sprite(stops: [number, string][]) {
  const canvas = document.createElement('canvas')
  canvas.width = canvas.height = 128
  const ctx = canvas.getContext('2d')!
  const gradient = ctx.createRadialGradient(64, 64, 0, 64, 64, 64)
  for (const [offset, color] of stops) gradient.addColorStop(offset, color)
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, 128, 128)
  return canvas
}

/**
 * Opening scene: the RedDragon dragon rises out of the dark, rears back and
 * breathes a torrent of fire across the screen, which burns away to reveal the site.
 * Any click, key, scroll or touch skips to the end.
 */
export function DragonIntro({ onReveal, onFinish }: Props) {
  const rootRef = useRef<HTMLDivElement>(null)
  const shakeRef = useRef<HTMLDivElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const dragonRef = useRef<HTMLImageElement>(null)
  const flamesRef = useRef<HTMLImageElement>(null)
  const eyeRef = useRef<HTMLDivElement>(null)
  const glowRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const flashRef = useRef<HTMLDivElement>(null)
  const skipRef = useRef<() => void>(() => {})

  useEffect(() => {
    const root = rootRef.current
    const shake = shakeRef.current
    const stage = stageRef.current
    const dragon = dragonRef.current
    const flames = flamesRef.current
    const eye = eyeRef.current
    const glow = glowRef.current
    const canvas = canvasRef.current
    const flash = flashRef.current
    const ctx = canvas?.getContext('2d')
    if (!root || !shake || !stage || !dragon || !flames || !eye || !glow || !canvas || !flash || !ctx) return

    history.scrollRestoration = 'manual'
    window.scrollTo(0, 0)

    const small = window.matchMedia('(max-width: 767px)').matches
    // Fire is soft, so the canvas renders at reduced resolution and is scaled up.
    const resolution = small ? 0.5 : 0.4
    let width = 0
    let height = 0
    const resize = () => {
      width = root.clientWidth
      height = root.clientHeight
      canvas.width = Math.round(width * resolution)
      canvas.height = Math.round(height * resolution)
      ctx.setTransform(resolution, 0, 0, resolution, 0, 0)
    }
    resize()
    window.addEventListener('resize', resize)

    const sprites = {
      core: sprite([[0, 'rgba(255,252,235,1)'], [0.3, 'rgba(255,215,120,0.85)'], [1, 'rgba(255,140,40,0)']]),
      hot: sprite([[0, 'rgba(255,175,65,1)'], [0.42, 'rgba(255,95,25,0.62)'], [1, 'rgba(255,60,10,0)']]),
      ember: sprite([[0, 'rgba(247,40,10,0.95)'], [0.5, 'rgba(190,15,5,0.55)'], [1, 'rgba(120,6,3,0)']]),
    }

    const fire: Flame[] = []
    const sparks: Spark[] = []
    let start = 0
    let offset = 0
    let last = 0
    let raf = 0
    let revealed = false
    let done = false

    const finish = () => {
      if (done) return
      done = true
      if (!revealed) onReveal()
      onFinish()
    }

    skipRef.current = () => {
      if (!start) return
      const t = (performance.now() - start) / 1000 + offset
      if (t < T.skipTo) offset += T.skipTo - t
    }
    const skip = () => skipRef.current()
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== 'Tab') skip()
    }
    window.addEventListener('wheel', skip, { passive: true })
    window.addEventListener('touchstart', skip, { passive: true })
    window.addEventListener('pointerdown', skip)
    window.addEventListener('keydown', onKey)

    const burnCenter = small ? '50% 52%' : '72% 42%'

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame)
      const dt = Math.min(3, (now - (last || now)) / 16.667)
      last = now
      const t = (now - start) / 1000 + offset

      // --- Dragon: rise from the dark, rear back, lunge -------------------------------
      const sw = stage.offsetWidth
      const lunge = easeOutBack(seg(t, T.lunge, T.lunge + 0.32))
      const rear = easeInOut(seg(t, T.rear, T.lunge))
      const scale = 1.12 - 0.12 * easeOut(seg(t, 0, 1.15)) - 0.035 * rear + 0.085 * lunge + 0.03 * seg(t, T.lunge + 0.32, T.reveal)
      const shiftX = 0.012 * sw * rear - 0.03 * sw * lunge
      stage.style.opacity = String(easeOut(seg(t, 0, 0.9)))
      stage.style.transform = `translate3d(${shiftX}px,0,0) scale(${scale})`

      const mouthX = stage.offsetLeft + MOUTH.x * sw + shiftX
      const mouthY = stage.offsetTop + MOUTH.y * sw

      // --- Fire intensity envelope -------------------------------------------------------
      const intensity = seg(t, T.lunge - 0.02, T.lunge + 0.25) * (1 - seg(t, T.fireFade, T.reveal))

      // Eye flares just before the strike, then smoulders.
      eye.style.opacity = String(seg(t, 0.55, 0.85) * (1 - 0.45 * seg(t, 1.0, 1.4)) + 0.35 * intensity)

      // Painted flames burst out of the mouth and flicker.
      const reach = easeOut(seg(t, T.lunge, T.lunge + 0.38))
      flames.style.clipPath = `inset(0 0 0 ${THROAT_X * 100 * (1 - reach)}%)`
      flames.style.opacity = String(seg(t, T.lunge, T.lunge + 0.08) * (0.88 + 0.12 * Math.sin(t * 57)))
      flames.style.transform = `scale(${1 + 0.025 * Math.sin(t * 41) * intensity}, ${1 + 0.04 * Math.sin(t * 33 + 1.3) * intensity})`

      // Heat glow sits on the mouth — it smoulders in the throat while the dragon rears back.
      const smoulder = 0.4 * easeIn(seg(t, 0.55, T.lunge))
      glow.style.opacity = String(Math.max(intensity * 0.9, smoulder))
      glow.style.transform = `translate3d(${mouthX - glow.offsetWidth / 2}px, ${mouthY - glow.offsetHeight / 2}px, 0)`

      // Camera shake on the strike.
      const amp = (small ? 5 : 9) * (1 - seg(t, T.lunge, T.lunge + 0.9)) * (t > T.lunge ? 1 : 0)
      shake.style.transform = amp > 0.1 ? `translate3d(${randn() * amp}px, ${randn() * amp}px, 0)` : ''

      // --- Particle flamethrower -------------------------------------------------------------
      const spread = 0.16 + 0.34 * seg(t, T.lunge, T.fireFade)
      const speed = (width + height) * 0.0145
      let toSpawn = intensity * (small ? 12 : 22) * dt
      while (toSpawn > 0) {
        if (toSpawn < 1 && Math.random() > toSpawn) break
        toSpawn -= 1
        const angle = FIRE_ANGLE + randn() * spread
        const v = speed * (0.75 + Math.random() * 0.6)
        fire.push({
          x: mouthX + randn() * sw * 0.015,
          y: mouthY + randn() * sw * 0.015,
          vx: Math.cos(angle) * v,
          vy: Math.sin(angle) * v,
          age: 0,
          life: 36 + Math.random() * 26,
          size: sw * 0.045,
          grow: sw * (0.007 + Math.random() * 0.006),
          seed: Math.random() * 100,
        })
        if (Math.random() < 0.3) {
          const sparkAngle = FIRE_ANGLE + randn() * spread * 1.8
          const sv = speed * (1.1 + Math.random() * 0.7)
          sparks.push({
            x: mouthX,
            y: mouthY,
            vx: Math.cos(sparkAngle) * sv,
            vy: Math.sin(sparkAngle) * sv,
            age: 0,
            life: 40 + Math.random() * 40,
            hue: 25 + Math.random() * 25,
          })
        }
      }

      ctx.clearRect(0, 0, width, height)
      ctx.globalCompositeOperation = 'lighter'
      const drag = Math.pow(0.968, dt)
      const lift = 0.09 * dt * (height / 900)

      for (let i = fire.length - 1; i >= 0; i--) {
        const p = fire[i]
        p.age += dt
        if (p.age >= p.life) {
          fire.splice(i, 1)
          continue
        }
        p.vx = p.vx * drag + Math.sin(p.age * 0.25 + p.seed) * 0.25 * dt
        p.vy = p.vy * drag - lift
        p.x += p.vx * dt
        p.y += p.vy * dt
        const k = p.age / p.life
        const size = p.size + p.grow * p.age
        ctx.globalAlpha = Math.pow(1 - k, 0.8) * Math.min(1, k / 0.06)
        ctx.drawImage(k < 0.18 ? sprites.core : k < 0.45 ? sprites.hot : sprites.ember, p.x - size / 2, p.y - size / 2, size, size)
      }

      ctx.lineCap = 'round'
      for (let i = sparks.length - 1; i >= 0; i--) {
        const s = sparks[i]
        s.age += dt
        if (s.age >= s.life) {
          sparks.splice(i, 1)
          continue
        }
        s.vx *= Math.pow(0.975, dt)
        s.vy = s.vy * Math.pow(0.975, dt) - lift * 0.6
        s.x += s.vx * dt
        s.y += s.vy * dt
        ctx.globalAlpha = 1 - s.age / s.life
        ctx.strokeStyle = `hsl(${s.hue} 100% 68%)`
        ctx.lineWidth = 2
        ctx.beginPath()
        ctx.moveTo(s.x, s.y)
        ctx.lineTo(s.x - s.vx * 1.6, s.y - s.vy * 1.6)
        ctx.stroke()
      }
      ctx.globalAlpha = 1

      // --- Flash, then burn a hole through to the page -----------------------------------
      flash.style.setProperty('--fx', `${mouthX}px`)
      flash.style.setProperty('--fy', `${mouthY}px`)
      flash.style.opacity = String(0.92 * easeInOut(seg(t, T.flash, T.reveal)))

      if (t >= T.reveal && !revealed) {
        revealed = true
        onReveal()
      }
      if (t >= T.reveal) {
        const r = easeIn(seg(t, T.reveal, T.finish)) * 150
        const mask = `radial-gradient(circle at ${burnCenter}, transparent ${r}%, black ${r + 14}%)`
        root.style.maskImage = mask
        root.style.webkitMaskImage = mask
      }
      if (t >= T.finish) {
        cancelAnimationFrame(raf)
        finish()
      }
    }

    let cancelled = false
    const timeout = window.setTimeout(() => {
      if (!start) finish()
    }, T.loadTimeout)

    Promise.all([dragon.decode(), flames.decode()])
      .catch(() => undefined)
      .then(() => {
        if (cancelled || done) return
        window.clearTimeout(timeout)
        start = performance.now()
        raf = requestAnimationFrame(frame)
      })

    return () => {
      cancelled = true
      cancelAnimationFrame(raf)
      window.clearTimeout(timeout)
      window.removeEventListener('resize', resize)
      window.removeEventListener('wheel', skip)
      window.removeEventListener('touchstart', skip)
      window.removeEventListener('pointerdown', skip)
      window.removeEventListener('keydown', onKey)
    }
  }, [onReveal, onFinish])

  const origin = `${MOUTH.x * 100}% ${MOUTH.y * 100}%`
  const sizes = '(orientation: portrait) 165vw, 125vh'

  return (
    <div ref={rootRef} className="fixed inset-0 z-[65] overflow-hidden bg-black">
      <div ref={shakeRef} aria-hidden className="absolute inset-0">
        <div
          ref={stageRef}
          className="absolute aspect-square opacity-0 will-change-transform portrait:top-[20svh] portrait:-right-[55vw] portrait:w-[165vw] landscape:-top-[10vh] landscape:-right-[8vw] landscape:w-[125vh]"
          style={{ transformOrigin: origin }}
        >
          <img
            ref={dragonRef}
            src={dragon2400}
            srcSet={`${dragon1200} 1200w, ${dragon2400} 2400w`}
            sizes={sizes}
            alt=""
            fetchPriority="high"
            className="absolute inset-0 size-full"
          />
          <img
            ref={flamesRef}
            src={flames2400}
            srcSet={`${flames1200} 1200w, ${flames2400} 2400w`}
            sizes={sizes}
            alt=""
            className="absolute inset-0 size-full opacity-0 [mix-blend-mode:plus-lighter]"
            style={{ transformOrigin: origin, clipPath: 'inset(0 0 0 100%)' }}
          />
          <div
            ref={eyeRef}
            className="absolute size-[10%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgb(255_250_225/0.95),rgb(255_120_40/0.45)_45%,transparent)] opacity-0 [mix-blend-mode:plus-lighter]"
            style={{ left: `${EYE.x * 100}%`, top: `${EYE.y * 100}%` }}
          />
        </div>
        <div
          ref={glowRef}
          className="absolute top-0 left-0 size-[110vmax] rounded-full bg-[radial-gradient(closest-side,rgb(255_130_40/0.55),rgb(247_8_3/0.22)_42%,transparent_70%)] opacity-0"
        />
        <canvas ref={canvasRef} className="absolute inset-0 size-full [mix-blend-mode:plus-lighter]" />
      </div>

      <div
        ref={flashRef}
        aria-hidden
        className="absolute inset-0 opacity-0"
        style={{
          background:
            'radial-gradient(circle at var(--fx, 40%) var(--fy, 55%), #fff6d6 0%, #ffb347 16%, #ff5a14 36%, #f70803 62%, #4a0503 100%)',
        }}
      />

      <p aria-hidden className="absolute top-6 left-5 font-display text-xl tracking-[0.06em] text-paper/80 uppercase md:left-10">
        Red<span className="text-dragon">Dragon</span>
      </p>
      <button
        type="button"
        onClick={() => skipRef.current()}
        className="absolute right-5 bottom-6 rounded-full border border-paper/25 px-5 py-2.5 text-[0.68rem] font-semibold tracking-[0.24em] text-paper/80 uppercase transition-colors hover:border-paper hover:text-paper md:right-10 md:bottom-8"
      >
        Skip intro
      </button>
    </div>
  )
}

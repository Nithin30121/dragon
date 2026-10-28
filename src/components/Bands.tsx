import { cn } from '../lib/cn'

const words = ['Design', 'Engineer', 'Animate', 'Launch']

function Flame({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={cn('size-[0.55em] shrink-0', className)} aria-hidden>
      <path
        fill="currentColor"
        d="M12 1c1.2 3.6-1.8 5.4-1.8 8.4 0 1.5 1 2.6 2.3 2.6 1.6 0 2.5-1.4 2.2-3.4 2.6 2 4.3 4.9 4.3 8 0 4-3.2 6.4-7 6.4s-7-2.6-7-6.6C5 9.6 12.4 7.6 12 1Z"
      />
    </svg>
  )
}

function Track({ reverse, className }: { reverse?: boolean; className?: string }) {
  const row = (hidden: boolean) => (
    <ul aria-hidden={hidden} className="flex shrink-0 items-center">
      {[...words, ...words].map((word, i) => (
        <li key={`${word}-${i}`} className="flex items-center gap-[0.45em] px-[0.45em]">
          {word}
          <Flame />
        </li>
      ))}
    </ul>
  )
  return (
    <div className={cn('flex w-max', reverse ? 'animate-marquee-reverse' : 'animate-marquee', className)}>
      {row(false)}
      {row(true)}
    </div>
  )
}

/** Two crossing tapes — the studio's verbs on repeat. Purely decorative. */
export function Bands() {
  return (
    <div aria-hidden className="relative isolate h-[clamp(9rem,22vw,17rem)] overflow-hidden">
      <div className="absolute top-1/2 left-[-5%] w-[110%] -translate-y-1/2 rotate-[3deg] border-y border-paper/10 bg-ink-2 py-[0.35em] font-display text-[clamp(1.75rem,4.5vw,4rem)] leading-none text-paper/25 uppercase">
        <Track reverse />
      </div>
      <div className="absolute top-1/2 left-[-5%] w-[110%] -translate-y-1/2 -rotate-[2.5deg] bg-dragon py-[0.35em] font-display text-[clamp(1.75rem,4.5vw,4rem)] leading-none text-ink uppercase shadow-[0_20px_60px_-10px_rgb(247_8_3/0.45)]">
        <Track />
      </div>
    </div>
  )
}

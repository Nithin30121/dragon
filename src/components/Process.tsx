import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
} from 'motion/react'
import { useRef, useState } from 'react'
import { processSteps } from '../data/site'
import { cn } from '../lib/cn'
import { stampSources } from '../lib/assets'
import { DragonStamp } from './DragonStamp'
import { MaskReveal } from './MaskReveal'

const mask = `url(${stampSources.small}) center / 100% 100% no-repeat`

/** The back of the stamp: cream paper, a postmark and the studio's promise. */
function StampBack() {
  return (
    <div
      className="absolute inset-0 [backface-visibility:hidden] [transform:rotateY(180deg)]"
      style={{ mask, WebkitMask: mask, WebkitBackfaceVisibility: 'hidden' }}
    >
      <div className="paper-grain absolute inset-0 bg-paper" />
      <div className="absolute inset-[5.5%] border-[3px] border-dragon/80" />
      <div className="absolute inset-[7.5%] border border-dragon/60" />
      <div className="absolute inset-[11%] flex flex-col justify-between text-ink">
        <div className="flex items-start justify-between text-[clamp(0.55rem,1.1vw,0.8rem)] font-semibold tracking-[0.3em] uppercase">
          <span>No. 001</span>
          <span>RD</span>
        </div>

        <svg viewBox="0 0 200 200" className="mx-auto w-[62%] -rotate-12 text-ink/85" aria-hidden>
          <defs>
            <path id="postmark-ring" d="M100,100 m-74,0 a74,74 0 1,1 148,0 a74,74 0 1,1 -148,0" />
          </defs>
          <circle cx="100" cy="100" r="92" fill="none" stroke="currentColor" strokeWidth="3" />
          <circle cx="100" cy="100" r="58" fill="none" stroke="currentColor" strokeWidth="1.5" />
          <text fontSize="14.5" letterSpacing="4.2" fill="currentColor" fontFamily="Anton, Impact, sans-serif">
            <textPath href="#postmark-ring">REDDRAGON ✦ DESIGN ✦ ENGINEERING ✦ MOTION ✦</textPath>
          </text>
          <text x="100" y="94" textAnchor="middle" fontSize="20" fill="currentColor" fontFamily="Anton, Impact, sans-serif">
            LEAVE
          </text>
          <text x="100" y="118" textAnchor="middle" fontSize="20" fill="#f70803" fontFamily="Anton, Impact, sans-serif">
            A MARK
          </text>
          {[0, 1, 2, 3].map((i) => (
            <path
              key={i}
              d={`M150 ${70 + i * 18} q 10 -8 20 0 t 20 0 t 20 0`}
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
            />
          ))}
        </svg>

        <p className="text-center font-serif text-[clamp(1rem,2.4vw,2rem)] leading-none italic">
          Built to be remembered.
        </p>
      </div>
    </div>
  )
}

/**
 * Signature scroll sequence: the stamp turns over as the process unfolds,
 * revealing its postmarked back. Falls back to a static layout for reduced motion.
 */
export function Process() {
  const reduce = useReducedMotion()
  const ref = useRef<HTMLElement>(null)
  const [active, setActive] = useState(0)

  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] })
  const rotateY = useTransform(scrollYProgress, [0.3, 0.7], [0, 180])
  const rotateZ = useTransform(scrollYProgress, [0, 1], [-10, 6])
  const scale = useTransform(scrollYProgress, [0, 0.22, 0.82, 1], [0.78, 1, 1, 0.9])
  const wordX = useTransform(scrollYProgress, [0, 1], ['0%', '-42%'])
  const progress = useTransform(scrollYProgress, [0.04, 0.96], [0, 1])

  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    setActive(v < 0.36 ? 0 : v < 0.68 ? 1 : 2)
  })

  const animated = !reduce

  return (
    <section
      ref={ref}
      id="process"
      aria-labelledby="process-title"
      className={cn('relative', animated ? 'h-[330vh]' : 'py-28')}
    >
      <div className={cn('overflow-hidden', animated && 'sticky top-0 flex h-svh items-center')}>
        <motion.p
          aria-hidden
          style={animated ? { x: wordX } : undefined}
          className="text-stroke pointer-events-none absolute top-1/2 left-0 -translate-y-1/2 font-display text-[30vw] leading-none whitespace-nowrap uppercase select-none"
        >
          Leave a mark — Leave a mark
        </motion.p>

        <div className="relative mx-auto grid w-full max-w-[1680px] items-center gap-8 px-5 md:px-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-16">
          <div className="order-2 lg:order-1">
            <p className="text-[0.7rem] font-medium tracking-[0.3em] text-dragon uppercase">(The process)</p>
            <h2
              id="process-title"
              className="mt-4 font-display text-[clamp(2.6rem,6.4vw,6.5rem)] leading-[0.9] uppercase"
            >
              <MaskReveal>Every project</MaskReveal>
              <MaskReveal delay={0.08}>
                leaves a <span className="font-serif text-dragon normal-case italic">mark.</span>
              </MaskReveal>
            </h2>

            <div className="mt-8 flex gap-6 lg:mt-12">
              <div className="relative w-px shrink-0 bg-paper/15" aria-hidden>
                <motion.div
                  style={animated ? { scaleY: progress } : undefined}
                  className="absolute inset-0 origin-top bg-dragon"
                />
              </div>
              <ol className="flex flex-col gap-4 lg:gap-7">
                {processSteps.map((step, i) => {
                  const isActive = !animated || i === active
                  return (
                    <li
                      key={step.title}
                      aria-current={animated && i === active ? 'step' : undefined}
                      className={cn('transition-opacity duration-500', isActive ? 'opacity-100' : 'opacity-35')}
                    >
                      <div className="flex items-baseline gap-4">
                        <span className="font-serif text-xl text-dragon italic">0{i + 1}</span>
                        <h3 className="font-display text-[clamp(1.6rem,2.6vw,2.6rem)] leading-none uppercase">
                          {step.title}
                        </h3>
                      </div>
                      <p
                        className={cn(
                          'mt-2 max-w-[42ch] pl-9 leading-relaxed text-paper/70 md:text-lg lg:block',
                          isActive ? 'block' : 'hidden',
                        )}
                      >
                        {step.body}
                      </p>
                    </li>
                  )
                })}
              </ol>
            </div>
          </div>

          <div className="order-1 flex justify-center lg:order-2">
            <div className="[perspective:1400px]">
              <motion.div
                style={animated ? { rotateY, rotateZ, scale } : { rotate: -6 }}
                className="relative w-[min(64vw,38svh)] [transform-style:preserve-3d] lg:w-[min(34vw,66svh)]"
              >
                <div className="[backface-visibility:hidden]" style={{ WebkitBackfaceVisibility: 'hidden' }}>
                  <DragonStamp sizes="(min-width: 1024px) 34vw, 64vw" alt="" />
                </div>
                {animated && <StampBack />}
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

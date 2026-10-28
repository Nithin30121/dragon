import { ArrowDown, ArrowRight } from 'lucide-react'
import { motion, useScroll, useTransform } from 'motion/react'
import { useRef } from 'react'
import { site } from '../data/site'
import { easeOutExpo } from '../lib/motion'
import { Button } from './Button'
import { DragonStamp } from './DragonStamp'
import { Embers } from './Embers'
import { Magnetic } from './Magnetic'
import { MaskReveal } from './MaskReveal'

// Choreography (seconds): stamp lands → embers burst → headline rises → copy and actions settle.
const STAMP_AT = 0.15
const HEADLINE_AT = 0.45
const COPY_AT = 1.0

/** `ready` holds the entrance until the dragon intro has burned through. */
export function Hero({ ready = true }: { ready?: boolean }) {
  const sectionRef = useRef<HTMLElement>(null)
  const stampRef = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end start'] })
  const headlineY = useTransform(scrollYProgress, [0, 1], ['0%', '-22%'])
  const stampY = useTransform(scrollYProgress, [0, 1], ['0%', '28%'])
  const stampRotate = useTransform(scrollYProgress, [0, 1], [0, 10])
  const fade = useTransform(scrollYProgress, [0, 0.75], [1, 0])

  return (
    <section
      ref={sectionRef}
      id="top"
      aria-labelledby="hero-title"
      className="relative isolate overflow-hidden"
    >
      {/* Environment: furnace glow, embers, floor fade */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={ready ? { opacity: 1, scale: 1 } : undefined}
          transition={{ duration: 2.2, ease: easeOutExpo, delay: STAMP_AT }}
          className="absolute top-[8%] left-1/2 size-[130vw] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgb(247_8_3/0.26),rgb(247_8_3/0.07)_45%,transparent_72%)] lg:top-[-30%] lg:left-auto lg:right-[-22%] lg:size-[85vw] lg:translate-x-0"
        />
      </div>
      <Embers originRef={stampRef} burstDelay={ready ? (STAMP_AT + 0.35) * 1000 : undefined} className="absolute inset-0 -z-10 size-full" />

      <div className="relative mx-auto flex min-h-svh max-w-[1680px] flex-col px-5 pt-28 pb-8 md:px-10 md:pt-32 md:pb-10">
        <motion.div style={{ y: headlineY, opacity: fade }} className="relative z-10">
          <h1
            id="hero-title"
            className="font-display text-[clamp(4.25rem,19vw,7.5rem)] leading-[0.86] uppercase md:text-[clamp(6rem,12.2vw,13.5rem)]"
          >
            <MaskReveal trigger="mount" play={ready} delay={HEADLINE_AT}>
              We don’t
            </MaskReveal>
            <MaskReveal trigger="mount" play={ready} delay={HEADLINE_AT + 0.08}>
              build
            </MaskReveal>
            <MaskReveal trigger="mount" play={ready} delay={HEADLINE_AT + 0.16}>
              <span className="font-serif text-[1.08em] tracking-[-0.025em] text-dragon normal-case italic">
                ordinary.
              </span>
            </MaskReveal>
          </h1>
        </motion.div>

        {/* The stamp: scroll parallax → landing slam → idle float → cursor tilt */}
        <motion.div
          style={{ y: stampY, rotate: stampRotate }}
          className="relative mx-auto mt-8 w-[min(66vw,420px)] lg:absolute lg:top-[13vh] lg:right-[5vw] lg:mt-0 lg:w-[min(35vw,600px)]"
        >
          <motion.div
            initial={{ opacity: 0, scale: 1.55, rotate: -22, filter: 'blur(14px)' }}
            animate={ready ? { opacity: 1, scale: 1, rotate: -6, filter: 'blur(0px)' } : undefined}
            transition={{
              delay: STAMP_AT,
              opacity: { duration: 0.25, delay: STAMP_AT },
              filter: { duration: 0.35, delay: STAMP_AT },
              default: { type: 'spring', stiffness: 260, damping: 19, mass: 1.1 },
            }}
          >
            {/* Impact ring when the stamp lands */}
            <motion.div
              aria-hidden
              initial={{ opacity: 0, scale: 0.7 }}
              animate={ready ? { opacity: [0, 0.7, 0], scale: [0.7, 1.05, 1.5] } : undefined}
              transition={{ duration: 1.1, delay: STAMP_AT + 0.28, ease: easeOutExpo }}
              className="absolute inset-0 rounded-[8%] border-2 border-dragon"
            />
            <div ref={stampRef} className="animate-float">
              <DragonStamp interactive priority />
            </div>
          </motion.div>
        </motion.div>

        <motion.div
          style={{ opacity: fade }}
          className="relative z-10 mt-12 grid gap-10 lg:mt-auto lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end"
        >
          <div>
            <motion.p
              initial={{ opacity: 0, y: 24 }}
              animate={ready ? { opacity: 1, y: 0 } : undefined}
              transition={{ duration: 1, ease: easeOutExpo, delay: COPY_AT }}
              className="max-w-[36ch] text-lg leading-relaxed text-paper/70 md:text-xl"
            >
              We design and engineer digital experiences that refuse to disappear into the noise.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={ready ? { opacity: 1, y: 0 } : undefined}
              transition={{ duration: 1, ease: easeOutExpo, delay: COPY_AT + 0.12 }}
              className="mt-8 flex flex-wrap items-center gap-3"
            >
              <Magnetic>
                <Button href="#work" icon={<ArrowRight className="size-4" />}>
                  Explore work
                </Button>
              </Magnetic>
              <Magnetic>
                <Button href="#contact" variant="ghost">
                  Contact
                </Button>
              </Magnetic>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={ready ? { opacity: 1 } : undefined}
            transition={{ duration: 1.2, delay: COPY_AT + 0.3 }}
            className="flex items-end justify-between gap-8 text-[0.7rem] font-medium tracking-[0.28em] text-paper/55 uppercase lg:flex-col lg:items-end"
          >
            <p className="flex items-center gap-3">
              <span className="relative flex size-2">
                <span className="absolute inset-0 animate-ping rounded-full bg-dragon/70 motion-reduce:animate-none" />
                <span className="relative size-2 rounded-full bg-dragon" />
              </span>
              {site.availability}
            </p>
            <p className="hidden lg:block">Design · Engineering · Motion</p>
            <p className="flex items-center gap-3">
              Scroll
              <span className="relative block h-10 w-px overflow-hidden bg-paper/15">
                <span className="absolute inset-0 animate-scroll-cue bg-dragon" />
              </span>
              <ArrowDown className="size-3.5 lg:hidden" aria-hidden />
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

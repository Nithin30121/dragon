import { motion, useScroll, useTransform, type MotionValue } from 'motion/react'
import { useRef } from 'react'
import { principles, site, toolkit } from '../data/site'
import { easeOutExpo } from '../lib/motion'

const statement = `${site.brand} is the independent studio of ${site.owner} — a web designer and creative frontend developer building websites that look art-directed and run like software.`
const highlighted = new Set(['art-directed', 'software.'])

function Word({ word, progress, range }: { word: string; progress: MotionValue<number>; range: [number, number] }) {
  const opacity = useTransform(progress, range, [0.16, 1])
  return (
    <motion.span style={{ opacity }} className={highlighted.has(word) ? 'text-dragon italic' : undefined}>
      {word}{' '}
    </motion.span>
  )
}

/** Statement that lights up word by word as it scrolls through the viewport. */
function ScrollStatement() {
  const ref = useRef<HTMLParagraphElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.85', 'end 0.45'] })
  const words = statement.split(' ')
  return (
    <p ref={ref} className="font-serif text-[clamp(2rem,4.6vw,4.6rem)] leading-[1.04] tracking-[-0.01em]">
      {words.map((word, i) => (
        <Word key={i} word={word} progress={scrollYProgress} range={[i / words.length, (i + 1) / words.length]} />
      ))}
    </p>
  )
}

export function About() {
  return (
    <section
      id="about"
      aria-labelledby="about-title"
      className="mx-auto max-w-[1680px] px-5 py-28 md:px-10 md:py-40"
    >
      <div className="grid gap-10 lg:grid-cols-[14rem_minmax(0,1fr)] lg:gap-16">
        <h2 id="about-title" className="text-[0.7rem] font-medium tracking-[0.3em] text-dragon uppercase">
          (About)
        </h2>
        <div>
          <ScrollStatement />

          <ul className="mt-20 grid gap-10 border-t border-paper/15 pt-10 md:grid-cols-3 md:gap-8">
            {principles.map((item, i) => (
              <motion.li
                key={item.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '0px 0px -10% 0px' }}
                transition={{ duration: 0.9, ease: easeOutExpo, delay: i * 0.1 }}
              >
                <h3 className="font-display text-2xl uppercase md:text-3xl">{item.title}</h3>
                <p className="mt-3 max-w-[34ch] leading-relaxed text-paper/60">{item.body}</p>
              </motion.li>
            ))}
          </ul>

          <div className="mt-16 flex flex-col gap-4 md:flex-row md:items-center md:gap-8">
            <p className="text-[0.7rem] font-medium tracking-[0.3em] text-paper/45 uppercase">Toolkit</p>
            <ul className="flex flex-wrap gap-2">
              {toolkit.map((tool) => (
                <li
                  key={tool}
                  className="rounded-full border border-paper/15 bg-ink-2 px-4 py-2 text-sm text-paper/80"
                >
                  {tool}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}

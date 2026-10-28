import { motion } from 'motion/react'
import { services } from '../data/site'
import { easeOutExpo } from '../lib/motion'
import { MaskReveal } from './MaskReveal'

export function Services() {
  return (
    <section
      id="services"
      aria-labelledby="services-title"
      className="mx-auto max-w-[1680px] px-5 py-28 md:px-10 md:py-40"
    >
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-end">
        <div>
          <p className="text-[0.7rem] font-medium tracking-[0.3em] text-dragon uppercase">(Services)</p>
          <h2
            id="services-title"
            className="mt-4 font-display text-[clamp(3rem,8vw,8rem)] leading-[0.88] uppercase"
          >
            <MaskReveal>Five ways to</MaskReveal>
            <MaskReveal delay={0.08}>
              stop <span className="font-serif text-dragon normal-case italic">blending in.</span>
            </MaskReveal>
          </h2>
        </div>
        <p className="max-w-[40ch] leading-relaxed text-paper/60 md:text-lg lg:justify-self-end">
          From the first sketch to the last line of code — design and engineering under one roof, so
          nothing gets lost in the handoff.
        </p>
      </div>

      <ol className="mt-16 border-t border-paper/15 md:mt-24">
        {services.map((service, i) => (
          <motion.li
            key={service.title}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '0px 0px -10% 0px' }}
            transition={{ duration: 0.9, ease: easeOutExpo, delay: i * 0.05 }}
            className="group relative isolate border-b border-paper/15"
          >
            {/* Red sweep on hover (pointer devices only — Tailwind's hover variant is hover-capable only) */}
            <span
              aria-hidden
              className="absolute inset-0 -z-10 origin-bottom scale-y-0 bg-dragon transition-transform duration-700 ease-out-expo group-hover:scale-y-100"
            />
            <div className="grid gap-4 py-8 transition-[padding] duration-700 ease-out-expo md:grid-cols-[6rem_minmax(0,1fr)_minmax(0,30rem)] md:items-center md:gap-8 md:py-10 md:group-hover:px-6">
              <span className="font-serif text-2xl text-dragon italic transition-colors duration-500 group-hover:text-ink">
                0{i + 1}
              </span>
              <h3 className="font-display text-[clamp(2.1rem,5.4vw,5rem)] leading-[0.95] uppercase transition-colors duration-500 group-hover:text-ink">
                {service.title}
              </h3>
              <div>
                <p className="leading-relaxed text-paper/65 transition-colors duration-500 group-hover:text-ink/85">
                  {service.body}
                </p>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {service.tags.map((tag) => (
                    <li
                      key={tag}
                      className="rounded-full border border-paper/20 px-3 py-1 text-[0.65rem] font-medium tracking-[0.18em] text-paper/60 uppercase transition-colors duration-500 group-hover:border-ink/30 group-hover:text-ink/80"
                    >
                      {tag}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.li>
        ))}
      </ol>
    </section>
  )
}

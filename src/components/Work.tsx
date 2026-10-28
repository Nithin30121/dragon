import { ArrowUpRight } from 'lucide-react'
import { motion } from 'motion/react'
import { projects, type Project } from '../data/site'
import { cn } from '../lib/cn'
import { easeOutExpo } from '../lib/motion'
import { stampSources } from '../lib/assets'
import { MaskReveal } from './MaskReveal'

const layout = ['md:col-span-12', 'md:col-span-7', 'md:col-span-5 md:mt-40']
const ratios = ['aspect-[4/5] md:aspect-[21/9]', 'aspect-[4/5] md:aspect-[4/3]', 'aspect-[4/5]']

function Placeholder({ project }: { project: Project }) {
  return (
    <div className="absolute inset-0 grid place-items-center bg-ink-2 bg-[repeating-linear-gradient(135deg,rgb(251_239_204/0.035)_0_1px,transparent_1px_16px)]">
      <span
        aria-hidden
        className="text-stroke absolute inset-x-0 bottom-[-0.12em] truncate text-center font-display text-[clamp(4rem,14vw,14rem)] leading-none uppercase"
      >
        {project.title}
      </span>
      <div className="relative text-center">
        <img src={stampSources.small} alt="" className="mx-auto w-16 opacity-30 grayscale md:w-20" />
        <p className="mt-5 text-[0.68rem] font-medium tracking-[0.32em] text-paper/50 uppercase">
          Case study coming soon
        </p>
      </div>
    </div>
  )
}

function ProjectCard({ project, index }: { project: Project; index: number }) {
  const Wrapper = project.href ? 'a' : 'div'
  return (
    <motion.li
      initial={{ opacity: 0, y: 80 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -12% 0px' }}
      transition={{ duration: 1.1, ease: easeOutExpo, delay: (index % 2) * 0.1 }}
      className={layout[index % layout.length]}
    >
      <Wrapper
        {...(project.href ? { href: project.href, target: '_blank', rel: 'noreferrer' } : {})}
        className="group block"
      >
        <motion.div
          initial={{ clipPath: 'inset(18% 8% 18% 8%)' }}
          whileInView={{ clipPath: 'inset(0% 0% 0% 0%)' }}
          viewport={{ once: true, margin: '0px 0px -12% 0px' }}
          transition={{ duration: 1.4, ease: easeOutExpo }}
          className={cn('relative overflow-hidden', ratios[index % ratios.length])}
        >
          {project.image ? (
            <img
              src={project.image}
              alt={`${project.title} — ${project.category}`}
              loading="lazy"
              decoding="async"
              className="absolute inset-0 size-full object-cover transition-transform duration-[1.4s] ease-out-expo group-hover:scale-[1.05]"
            />
          ) : (
            <Placeholder project={project} />
          )}
          <span className="absolute top-4 left-4 font-serif text-lg text-paper/80 italic md:top-6 md:left-6">
            0{index + 1}
          </span>
        </motion.div>

        <div className="mt-5 flex items-start justify-between gap-6 border-t border-paper/10 pt-5">
          <div>
            <p className="text-[0.68rem] font-medium tracking-[0.3em] text-dragon uppercase">
              {project.category}
              {project.year && <span className="text-paper/45"> · {project.year}</span>}
            </p>
            <h3 className="mt-2 font-display text-[clamp(1.9rem,3.4vw,3.4rem)] leading-none uppercase">
              {project.title}
            </h3>
          </div>
          {project.href && (
            <span className="grid size-12 shrink-0 place-items-center rounded-full border border-paper/20 transition-all duration-500 ease-out-expo group-hover:rotate-45 group-hover:border-dragon group-hover:bg-dragon group-hover:text-ink">
              <ArrowUpRight className="size-5" aria-hidden />
            </span>
          )}
        </div>
      </Wrapper>
    </motion.li>
  )
}

export function Work() {
  return (
    <section id="work" aria-labelledby="work-title" className="mx-auto max-w-[1680px] px-5 py-28 md:px-10 md:py-40">
      <header className="flex flex-col gap-6 border-b border-paper/15 pb-8 md:flex-row md:items-end md:justify-between">
        <h2 id="work-title" className="font-display text-[clamp(3.25rem,10vw,9.5rem)] leading-[0.88] uppercase">
          <MaskReveal>Selected</MaskReveal>
          <MaskReveal delay={0.08}>
            <span className="font-serif tracking-[-0.02em] text-dragon normal-case italic">work</span>
            <sup className="ml-3 align-top font-sans text-base tracking-normal text-paper/50 md:text-xl">
              ({String(projects.length).padStart(2, '0')})
            </sup>
          </MaskReveal>
        </h2>
        <p className="max-w-[34ch] leading-relaxed text-paper/60 md:text-right md:text-lg">
          Selected projects across e-commerce, creative websites and interactive products.
        </p>
      </header>

      <ul className="mt-14 grid gap-x-8 gap-y-20 md:mt-20 md:grid-cols-12 md:gap-y-28">
        {projects.map((project, i) => (
          <ProjectCard key={project.title} project={project} index={i} />
        ))}
      </ul>
    </section>
  )
}

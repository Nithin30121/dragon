import { ArrowUpRight, Check, Copy, Mail } from 'lucide-react'
import { useEffect, useState } from 'react'
import { site } from '../data/site'
import { Button } from './Button'
import { Embers } from './Embers'
import { Magnetic } from './Magnetic'
import { MaskReveal } from './MaskReveal'

const mailto = `mailto:${site.email}?subject=${encodeURIComponent('New project — RedDragon')}`

export function Contact() {
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!copied) return
    const timer = window.setTimeout(() => setCopied(false), 2000)
    return () => window.clearTimeout(timer)
  }, [copied])

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(site.email)
      setCopied(true)
    } catch {
      // Clipboard can be blocked (insecure context, permissions); the mailto link still works.
    }
  }

  return (
    <section id="contact" aria-labelledby="contact-title" className="relative isolate overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-[-40%] left-1/2 -z-10 size-[120vw] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgb(247_8_3/0.22),rgb(247_8_3/0.06)_50%,transparent_75%)] md:size-[80vw]"
      />
      <Embers density={0.6} className="absolute inset-0 -z-10 size-full" />

      <div className="mx-auto flex max-w-[1680px] flex-col items-center px-5 py-32 text-center md:px-10 md:py-48">
        <p className="text-[0.7rem] font-medium tracking-[0.3em] text-dragon uppercase">(Contact)</p>
        <h2
          id="contact-title"
          className="mt-6 font-display text-[clamp(3.5rem,13vw,13rem)] leading-[0.86] uppercase"
        >
          <MaskReveal>Ready to</MaskReveal>
          <MaskReveal delay={0.08}>
            leave a <span className="font-serif tracking-[-0.02em] text-dragon normal-case italic">mark?</span>
          </MaskReveal>
        </h2>
        <p className="mt-8 max-w-[44ch] text-lg leading-relaxed text-paper/65 md:text-xl">
          Tell us what you’re building, when you need it and what you want people to feel.
        </p>

        <div className="mt-12 flex flex-col items-center gap-6">
          <Magnetic strength={0.2}>
            <Button href={mailto} size="lg" icon={<Mail className="size-5" />}>
              Start a project
            </Button>
          </Magnetic>
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-paper/60">
            <a
              href={mailto}
              className="group inline-flex items-center gap-1 text-base underline decoration-paper/25 underline-offset-[6px] transition-colors hover:text-paper hover:decoration-dragon md:text-lg"
            >
              {site.email}
              <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden />
            </a>
            <button
              type="button"
              onClick={copy}
              className="inline-flex h-10 items-center gap-2 rounded-full border border-paper/15 px-4 text-[0.68rem] font-semibold tracking-[0.18em] uppercase transition-colors hover:border-paper/40 hover:text-paper"
            >
              {copied ? <Check className="size-3.5 text-dragon" aria-hidden /> : <Copy className="size-3.5" aria-hidden />}
              <span aria-live="polite">{copied ? 'Copied' : 'Copy email'}</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

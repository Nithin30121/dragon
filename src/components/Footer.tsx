import { ArrowUp } from 'lucide-react'
import { motion } from 'motion/react'
import { navLinks, site } from '../data/site'
import { easeOutExpo } from '../lib/motion'
import { stampSources } from '../lib/assets'
import { AnchorLink } from './AnchorLink'

const year = new Date().getFullYear()

export function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-paper/10 pt-16 md:pt-24">
      <div className="mx-auto grid max-w-[1680px] gap-12 px-5 md:grid-cols-[minmax(0,1.4fr)_repeat(3,minmax(0,1fr))] md:px-10">
        <div className="flex items-start gap-4">
          <img src={stampSources.small} alt="" className="w-14 -rotate-6" width={56} height={56} />
          <p className="max-w-[24ch] font-serif text-2xl leading-tight italic text-paper/85">
            Digital experiences that refuse to disappear into the noise.
          </p>
        </div>

        <nav aria-label="Footer">
          <h2 className="text-[0.68rem] font-medium tracking-[0.3em] text-paper/45 uppercase">Sitemap</h2>
          <ul className="mt-4 space-y-2">
            {navLinks.map((link) => (
              <li key={link.href}>
                <AnchorLink href={link.href as `#${string}`} className="text-paper/75 transition-colors hover:text-dragon">
                  {link.label}
                </AnchorLink>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h2 className="text-[0.68rem] font-medium tracking-[0.3em] text-paper/45 uppercase">Contact</h2>
          <a href={`mailto:${site.email}`} className="mt-4 block break-all text-paper/75 transition-colors hover:text-dragon">
            {site.email}
          </a>
          {site.socials.length > 0 && (
            <ul className="mt-4 space-y-2">
              {site.socials.map((social) => (
                <li key={social.href}>
                  <a href={social.href} target="_blank" rel="noreferrer" className="text-paper/75 transition-colors hover:text-dragon">
                    {social.label}
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="md:justify-self-end">
          <AnchorLink
            href="#top"
            className="group inline-flex items-center gap-3 text-[0.7rem] font-semibold tracking-[0.24em] text-paper/75 uppercase transition-colors hover:text-paper"
          >
            Back to top
            <span className="grid size-11 place-items-center rounded-full border border-paper/20 transition-colors group-hover:border-dragon group-hover:bg-dragon group-hover:text-ink">
              <ArrowUp className="size-4 transition-transform duration-500 ease-out-expo group-hover:-translate-y-0.5" aria-hidden />
            </span>
          </AnchorLink>
        </div>
      </div>

      <div className="mx-auto mt-16 flex max-w-[1680px] flex-col gap-2 px-5 text-xs text-paper/40 md:mt-24 md:flex-row md:justify-between md:px-10">
        <p>
          © {year} {site.brand}. Designed and built by {site.owner}.
        </p>
        <p>Made with fire, React and Motion.</p>
      </div>

      <div aria-hidden className="mt-6 overflow-hidden select-none">
        <motion.p
          initial={{ y: '45%' }}
          whileInView={{ y: '0%' }}
          viewport={{ once: true }}
          transition={{ duration: 1.4, ease: easeOutExpo }}
          className="text-center font-display text-[19.5vw] leading-[0.78] tracking-[-0.01em] text-dragon uppercase"
        >
          RedDragon
        </motion.p>
      </div>
    </footer>
  )
}

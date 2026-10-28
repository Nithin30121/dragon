import * as Dialog from '@radix-ui/react-dialog'
import { ArrowUpRight, Menu, X } from 'lucide-react'
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'motion/react'
import { useRef, useState } from 'react'
import { navLinks, site } from '../data/site'
import { cn } from '../lib/cn'
import { easeOutExpo } from '../lib/motion'
import { useScrollTo } from '../lib/scroll-context'
import { AnchorLink } from './AnchorLink'
import { Button } from './Button'
import { stampSources } from '../lib/assets'

export function Nav({ ready = true }: { ready?: boolean }) {
  const { scrollY } = useScroll()
  const [hidden, setHidden] = useState(false)
  const [solid, setSolid] = useState(false)
  const [open, setOpen] = useState(false)
  const pendingHash = useRef<string | null>(null)
  const scrollTo = useScrollTo()

  useMotionValueEvent(scrollY, 'change', (y) => {
    const previous = scrollY.getPrevious() ?? 0
    setHidden(y > previous && y > 480)
    setSolid(y > 40)
  })

  // Close the menu first, then scroll once the dialog has released the page.
  const goTo = (hash: string) => {
    pendingHash.current = hash
    setOpen(false)
  }

  return (
    <motion.header
      initial={{ opacity: 0, y: -16 }}
      animate={ready ? { opacity: 1, y: 0 } : undefined}
      transition={{ duration: 1, ease: easeOutExpo, delay: 1.1 }}
      className="fixed inset-x-0 top-0 z-40"
    >
      <motion.div
        animate={{ y: hidden && !open ? '-110%' : '0%' }}
        transition={{ duration: 0.6, ease: easeOutExpo }}
        className={cn(
          'transition-colors duration-500',
          solid ? 'border-b border-paper/10 bg-ink/80 backdrop-blur-md' : 'border-b border-transparent',
        )}
      >
        <nav
          aria-label="Primary"
          className="mx-auto flex h-18 max-w-[1680px] items-center justify-between gap-6 px-5 md:px-10"
        >
          <AnchorLink href="#top" className="group flex items-center gap-3" aria-label="RedDragon — back to top">
            <img
              src={stampSources.small}
              alt=""
              width={40}
              height={40}
              className="size-10 -rotate-6 transition-transform duration-500 ease-out-expo group-hover:rotate-6"
            />
            <span className="font-display text-xl tracking-[0.06em] uppercase">
              Red<span className="text-dragon">Dragon</span>
            </span>
          </AnchorLink>

          <ul className="hidden items-center gap-9 lg:flex">
            {navLinks.map((link) => (
              <li key={link.href}>
                <AnchorLink
                  href={link.href as `#${string}`}
                  className="group relative py-2 text-[0.72rem] font-medium tracking-[0.24em] text-paper/75 uppercase transition-colors hover:text-paper"
                >
                  {link.label}
                  <span className="absolute inset-x-0 -bottom-0.5 h-px origin-right scale-x-0 bg-dragon transition-transform duration-500 ease-out-expo group-hover:origin-left group-hover:scale-x-100" />
                </AnchorLink>
              </li>
            ))}
          </ul>

          <div className="hidden lg:block">
            <Button href="#contact" className="h-11 px-6 text-[0.7rem]">
              Start a project
            </Button>
          </div>

          <Dialog.Root open={open} onOpenChange={setOpen}>
            <Dialog.Trigger asChild>
              <button
                type="button"
                className="grid size-12 place-items-center rounded-full border border-paper/20 text-paper transition-colors hover:border-paper lg:hidden"
                aria-label="Open menu"
              >
                <Menu className="size-5" />
              </button>
            </Dialog.Trigger>
            <AnimatePresence
              onExitComplete={() => {
                if (pendingHash.current) scrollTo(pendingHash.current)
                pendingHash.current = null
              }}
            >
              {open && (
                <Dialog.Portal forceMount>
                  <Dialog.Content asChild forceMount aria-describedby={undefined}>
                    <motion.div
                      initial={{ clipPath: 'inset(0 0 100% 0)' }}
                      animate={{ clipPath: 'inset(0 0 0% 0)' }}
                      exit={{ clipPath: 'inset(100% 0 0% 0)' }}
                      transition={{ duration: 0.7, ease: easeOutExpo }}
                      className="fixed inset-0 z-50 flex flex-col overflow-y-auto bg-dragon px-5 pt-5 pb-8 text-ink"
                    >
                      <Dialog.Title className="sr-only">Menu</Dialog.Title>
                      <div className="flex items-center justify-between">
                        <span className="font-display text-xl tracking-[0.06em] uppercase">RedDragon</span>
                        <Dialog.Close asChild>
                          <button
                            type="button"
                            className="grid size-12 place-items-center rounded-full border border-ink/30"
                            aria-label="Close menu"
                          >
                            <X className="size-5" />
                          </button>
                        </Dialog.Close>
                      </div>

                      <ul className="mt-14 flex flex-col gap-1">
                        {navLinks.map((link, i) => (
                          <li key={link.href} className="overflow-hidden">
                            <motion.a
                              href={link.href}
                              onClick={(event) => {
                                event.preventDefault()
                                goTo(link.href)
                              }}
                              initial={{ y: '100%' }}
                              animate={{ y: '0%' }}
                              transition={{ duration: 0.8, ease: easeOutExpo, delay: 0.15 + i * 0.06 }}
                              className="flex items-baseline justify-between border-b border-ink/20 py-2 font-display text-[clamp(3rem,15vw,5.5rem)] leading-none uppercase"
                            >
                              {link.label}
                              <span className="font-serif text-xl normal-case italic">0{i + 1}</span>
                            </motion.a>
                          </li>
                        ))}
                      </ul>

                      <a
                        href={`mailto:${site.email}`}
                        className="mt-auto flex items-center gap-2 pt-10 text-sm font-semibold tracking-[0.16em] uppercase"
                      >
                        {site.email}
                        <ArrowUpRight className="size-4" />
                      </a>
                    </motion.div>
                  </Dialog.Content>
                </Dialog.Portal>
              )}
            </AnimatePresence>
          </Dialog.Root>
        </nav>
      </motion.div>
    </motion.header>
  )
}

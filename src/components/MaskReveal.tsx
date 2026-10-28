import { motion } from 'motion/react'
import type { ReactNode } from 'react'
import { cn } from '../lib/cn'
import { easeOutExpo } from '../lib/motion'

type Props = {
  children: ReactNode
  className?: string
  delay?: number
  /** Reveal when scrolled into view (default) or immediately on mount. */
  trigger?: 'inView' | 'mount'
  /** With trigger="mount", holds the line hidden until true. */
  play?: boolean
}

/** One line of type that rises out of an invisible mask. */
export function MaskReveal({ children, className, delay = 0, trigger = 'inView', play = true }: Props) {
  const reveal = play ? { y: '0%' } : { y: '110%' }
  return (
    // Padding + negative margin keeps italic overhangs and descenders inside the mask.
    <span className={cn('-mx-[0.08em] -mb-[0.14em] block overflow-hidden px-[0.08em] pb-[0.14em]', className)}>
      <motion.span
        className="block"
        initial={{ y: '110%' }}
        {...(trigger === 'mount'
          ? { animate: reveal }
          : { whileInView: reveal, viewport: { once: true, margin: '0px 0px -12% 0px' } })}
        transition={{ duration: 1.15, ease: easeOutExpo, delay }}
      >
        {children}
      </motion.span>
    </span>
  )
}

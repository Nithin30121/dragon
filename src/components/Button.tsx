import type { ReactNode } from 'react'
import { cn } from '../lib/cn'
import { AnchorLink } from './AnchorLink'

type Props = {
  href: string
  children: ReactNode
  variant?: 'primary' | 'ghost'
  size?: 'md' | 'lg'
  className?: string
  icon?: ReactNode
}

const base =
  'group relative inline-flex items-center justify-center gap-3 overflow-hidden rounded-full font-semibold uppercase tracking-[0.16em] transition-colors duration-500'

const variants = {
  primary: 'bg-dragon text-ink',
  ghost: 'border border-paper/25 text-paper hover:border-paper hover:text-ink',
}

const fills = {
  primary: 'bg-paper',
  ghost: 'bg-paper',
}

const sizes = {
  md: 'h-14 px-7 text-[0.78rem]',
  lg: 'h-16 px-9 text-sm md:h-20 md:px-12 md:text-base',
}

/** Pill button with a fill that sweeps up on hover. Uses smooth scroll for in-page links. */
export function Button({ href, children, variant = 'primary', size = 'md', className, icon }: Props) {
  const classes = cn(base, variants[variant], sizes[size], className)
  const content = (
    <>
      <span
        aria-hidden
        className={cn(
          'absolute inset-0 translate-y-[101%] rounded-full transition-transform duration-500 ease-out-expo group-hover:translate-y-0',
          fills[variant],
        )}
      />
      <span className="relative">{children}</span>
      {icon && (
        <span className="relative transition-transform duration-500 ease-out-expo group-hover:translate-x-1">
          {icon}
        </span>
      )}
    </>
  )

  if (href.startsWith('#')) {
    return (
      <AnchorLink href={href as `#${string}`} className={classes}>
        {content}
      </AnchorLink>
    )
  }
  return (
    <a href={href} className={classes}>
      {content}
    </a>
  )
}

import type { AnchorHTMLAttributes, MouseEvent } from 'react'
import { useScrollTo } from '../lib/scroll-context'

type Props = AnchorHTMLAttributes<HTMLAnchorElement> & { href: `#${string}` }

/** In-page link that scrolls smoothly but stays a real anchor (middle-click, no-JS fallback). */
export function AnchorLink({ href, onClick, ...rest }: Props) {
  const scrollTo = useScrollTo()

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(event)
    if (event.defaultPrevented || event.metaKey || event.ctrlKey || event.shiftKey || event.button !== 0) return
    event.preventDefault()
    scrollTo(href)
  }

  return <a href={href} onClick={handleClick} {...rest} />
}

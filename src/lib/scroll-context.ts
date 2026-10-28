import { createContext, useContext } from 'react'

export type ScrollTo = (hash: string) => void

export const ScrollContext = createContext<ScrollTo>(() => {})

export function useScrollTo() {
  return useContext(ScrollContext)
}

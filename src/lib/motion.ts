// Shared easing so every reveal on the site moves with the same character.
export const easeOutExpo = [0.16, 1, 0.3, 1] as const

export const canHover = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(hover: hover) and (pointer: fine)').matches

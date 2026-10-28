// Everything a visitor reads lives here, so content can change without touching components.

export const site = {
  brand: 'RedDragon',
  owner: 'Nithin',
  role: 'Web designer & creative frontend developer',
  // TODO: replace with your real address before publishing — example.com is a placeholder.
  email: 'hello@example.com',
  availability: 'Taking on new projects',
  // Add profiles as { label: 'Instagram', href: 'https://…' }; the footer hides this list while it is empty.
  socials: [] as { label: string; href: string }[],
}

export const navLinks = [
  { label: 'Work', href: '#work' },
  { label: 'Process', href: '#process' },
  { label: 'Services', href: '#services' },
  { label: 'About', href: '#about' },
  { label: 'Contact', href: '#contact' },
]

export type Project = {
  title: string
  category: string
  year?: string
  /** Imported image URL, e.g. `import shot from '../assets/work/project.webp'` */
  image?: string
  href?: string
  /** Placeholder slot until the real case study and image are supplied. */
  comingSoon?: boolean
}

export const projects: Project[] = [
  { title: 'Luxury e-commerce', category: 'Online store', comingSoon: true },
  { title: 'Creative website', category: 'Brand experience', comingSoon: true },
  { title: 'Interactive app', category: 'Product design', comingSoon: true },
]

export const processSteps = [
  {
    title: 'Uncover',
    body: 'Find the story only your brand can tell, and the people it has to reach.',
  },
  {
    title: 'Design',
    body: 'Shape it into an art-directed experience — type, motion and imagery with intent.',
  },
  {
    title: 'Engineer',
    body: 'Build it fast, accessible and alive, then launch it so it leaves a mark.',
  },
]

export const services = [
  {
    title: 'Website design',
    body: 'Art-directed sites with a point of view: layout, type and imagery that make your brand impossible to scroll past.',
    tags: ['Art direction', 'Layout', 'Typography'],
  },
  {
    title: 'Creative frontend',
    body: 'Production React and TypeScript, with motion and interaction built in from the start — not bolted on.',
    tags: ['React', 'TypeScript', 'Motion'],
  },
  {
    title: 'E-commerce',
    body: 'Storefronts that feel premium and sell: collections, product pages, carts and the admin tools behind them.',
    tags: ['Storefronts', 'Product pages', 'Admin'],
  },
  {
    title: 'UI/UX design',
    body: 'Flows, wireframes and interface systems that make complex products feel simple.',
    tags: ['Research', 'Flows', 'Design systems'],
  },
  {
    title: 'Interactive experiences',
    body: 'Scroll-driven stories, cinematic transitions and micro-interactions people remember.',
    tags: ['Scroll stories', 'Transitions', 'Micro-interactions'],
  },
]

export const principles = [
  {
    title: 'Craft over templates',
    body: 'Every layout is designed for the brand in front of it. No themes, no shortcuts.',
  },
  {
    title: 'Motion with intent',
    body: 'Animation that guides attention and adds feeling — never movement for its own sake.',
  },
  {
    title: 'Fast everywhere',
    body: 'Responsive, accessible and quick to load on every screen, from phones to studio displays.',
  },
]

export const toolkit = ['React', 'TypeScript', 'Vite', 'Tailwind CSS', 'Motion']

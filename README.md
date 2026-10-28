# RedDragon

A cinematic portfolio for RedDragon — a web design and creative frontend studio. Dark, fiery and built to prove the craft through the site itself.

## Highlights

- **Fire-breathing intro** — the dragon rises out of the dark, rears back and breathes fire across the screen, which burns through to the site. Skippable with any click, key or scroll; skipped automatically for reduced-motion visitors and deep links.
- **Living stamp logo** — the dragon stamp lands with an impact, tilts toward the cursor and sheds embers.
- **Scroll-driven process** — the stamp turns over as you scroll to reveal its postmarked back.
- **Editorial sections** — selected work, services, about and contact, with masked type reveals and restrained motion.
- **Responsive and accessible** — tuned for phones through large displays, keyboard friendly, and respectful of `prefers-reduced-motion`.

## Stack

React 19 · TypeScript · Vite · Tailwind CSS v4 · Motion for React · Lenis · Radix Dialog · Lucide icons

## Getting started

```bash
npm install
npm run dev
```

| Script            | What it does                         |
| ----------------- | ------------------------------------ |
| `npm run dev`     | Start the dev server                 |
| `npm run build`   | Type-check and build for production  |
| `npm run preview` | Serve the production build locally   |
| `npm run lint`    | Lint with oxlint                     |

## Editing content

All copy lives in [`src/data/site.ts`](src/data/site.ts): name, email, availability, social links, projects, process steps, services and principles.

- **Email** — replace the `hello@example.com` placeholder before publishing.
- **Projects** — each entry takes a `title`, `category`, optional `year`, `href` and `image`. Import images from `src/assets` and drop `comingSoon` once a real case study is in place.
- **Socials** — add `{ label, href }` items; the footer shows them automatically.

## Project structure

```
src/
  assets/            logo stamp and intro artwork (WebP)
  components/        page sections and building blocks
    DragonIntro.tsx  opening fire-breathing scene
    Hero.tsx         headline, stamp and embers
    Process.tsx      scroll-driven stamp flip
  data/site.ts       all site content
  lib/               smooth scroll, motion helpers, utilities
```

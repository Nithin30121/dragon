import { MotionConfig } from 'motion/react'
import { useCallback, useState } from 'react'
import { About } from './components/About'
import { Bands } from './components/Bands'
import { Contact } from './components/Contact'
import { DragonIntro } from './components/DragonIntro'
import { Footer } from './components/Footer'
import { Hero } from './components/Hero'
import { Nav } from './components/Nav'
import { Process } from './components/Process'
import { Services } from './components/Services'
import { Work } from './components/Work'
import { SmoothScroll } from './lib/smooth-scroll'

// The intro is skipped for reduced-motion visitors and for deep links like /#contact.
const shouldPlayIntro = () =>
  !window.matchMedia('(prefers-reduced-motion: reduce)').matches && window.location.hash.length <= 1

export default function App() {
  const [introActive, setIntroActive] = useState(shouldPlayIntro)
  const [ready, setReady] = useState(() => !introActive)
  const reveal = useCallback(() => setReady(true), [])
  const finish = useCallback(() => setIntroActive(false), [])

  return (
    <MotionConfig reducedMotion="user">
      <SmoothScroll paused={!ready}>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[90] focus:rounded-full focus:bg-paper focus:px-5 focus:py-3 focus:text-sm focus:font-semibold focus:text-ink"
        >
          Skip to content
        </a>
        {introActive && <DragonIntro onReveal={reveal} onFinish={finish} />}
        <Nav ready={ready} />
        <main id="main">
          <Hero ready={ready} />
          <Bands />
          <Process />
          <Work />
          <Services />
          <About />
          <Contact />
        </main>
        <Footer />
        <div aria-hidden className="grain pointer-events-none fixed inset-0 z-[70] opacity-[0.055]" />
      </SmoothScroll>
    </MotionConfig>
  )
}

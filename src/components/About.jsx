import { useRef } from 'react'
import { motion, useInView, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { ArrowRight, Brain, Code2, Network, Shield } from 'lucide-react'
import { about, experience } from '../data/site'
import AboutHeading from './about/AboutHeading'
import InterestCard from './about/InterestCard'
import ProfileFrame from './about/ProfileFrame'
import Magnetic from './contact/Magnetic'
import useIsDesktop from './experience/useIsDesktop'

const icons = { web: Code2, ai: Brain, net: Network, sec: Shield }
// Content is revealed in timed stages: heading -> line -> lead -> body -> divider -> label -> cards -> button.
const item = {
  hidden: { opacity: 0, y: 20 },
  show: d => ({ opacity: 1, y: 0, transition: { delay: d, duration: 0.75, ease: [0.2, 0.8, 0.2, 1] } }),
}
const line = { hidden: { scaleX: 0, opacity: 0 }, show: d => ({ scaleX: 1, opacity: 1, transition: { delay: d, duration: 0.9, ease: [0.2, 0.8, 0.2, 1] } }) }
// "I am X, a {full stack developer} and {AI enthusiast}." -> highlighted spans
const withHighlights = text => text.split(/(\{[^}]+\})/).map((s, i) => s.startsWith('{')
  ? <span key={i} className="bg-gradient-to-r from-accent to-orange-300 bg-clip-text font-medium text-transparent">{s.slice(1, -1)}</span> : s)

export default function About() {
  const reduce = useReducedMotion(), desktop = useIsDesktop()
  const sectionRef = useRef(null), contentRef = useRef(null)
  const on = useInView(contentRef, { once: true, amount: 0.3 })
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start end', 'end start'] })
  const blobY = useTransform(scrollYProgress, [0, 1], [-50, 50]), frameY = useTransform(scrollYProgress, [0, 1], [18, -18])
  const par = desktop && !reduce
  const edu = experience.find(e => e[5] === 'Education')
  const show = reduce || on ? 'show' : 'hidden', init = reduce ? false : 'hidden'

  return (
    <section id="about" ref={sectionRef} className="relative isolate overflow-x-clip">
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-b from-transparent via-[#0c0c0f] to-transparent" />
      <motion.div aria-hidden="true" style={par ? { y: blobY } : undefined} className="absolute -left-40 top-1/4 -z-10 size-[38rem] rounded-full bg-[radial-gradient(closest-side,#FF45281f,transparent)]" />
      <div aria-hidden="true" className="absolute -right-40 bottom-0 -z-10 size-[28rem] rounded-full bg-[radial-gradient(closest-side,#FF6a4a12,transparent)]" />
      <div aria-hidden="true" className="skills-grid absolute inset-0 -z-10 opacity-60" />

      <div className="section grid items-center gap-20 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] lg:gap-20">
        <motion.div style={par ? { y: frameY } : undefined} className="pb-6"><ProfileFrame reduce={reduce} edu={edu} /></motion.div>

        <motion.div ref={contentRef} initial={init} animate={show}>
          <AboutHeading parts={about.headline} on={reduce || on} reduce={reduce} />
          <motion.div variants={line} custom={0.75} aria-hidden="true" style={{ transformOrigin: 'left' }}
            className="mt-5 h-[2px] w-40 rounded-full bg-gradient-to-r from-accent via-orange-400 to-transparent shadow-[0_0_14px_#FF4528]" />
          <motion.p variants={item} custom={1} className="mt-6 text-xl leading-snug text-white/90 sm:text-2xl">{withHighlights(about.lead)}</motion.p>
          <motion.p variants={item} custom={1.2} className="mt-4 max-w-xl text-white/70">{about.body}</motion.p>

          <motion.div variants={item} custom={1.45} aria-hidden="true" className="my-8 flex items-center gap-3">
            <span className="h-px flex-1 bg-gradient-to-r from-white/20 to-transparent" /><i className="size-1.5 rounded-full bg-accent shadow-[0_0_10px_#FF4528]" />
          </motion.div>

          <motion.h3 variants={item} custom={1.6} className="text-[11px] font-medium uppercase tracking-[0.2em] text-white/70">{about.interestsLabel}</motion.h3>
          <ul className="mt-3 grid gap-3 sm:grid-cols-2">
            {about.interests.map(([k, t, d], i) => <InterestCard key={k} Icon={icons[k] || Code2} title={t} desc={d} reduce={reduce} variants={item} custom={1.7 + i * 0.09} />)}
          </ul>
          <motion.div variants={item} custom={2.2} className="mt-8">
            <Magnetic as="a" href="#experience" reduce={reduce} className="btn-ghost transition-colors hover:bg-accent/10">MORE ABOUT ME<ArrowRight size={16} aria-hidden="true" /></Magnetic>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

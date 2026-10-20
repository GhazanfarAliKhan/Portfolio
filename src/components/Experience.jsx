import { useEffect, useRef, useState } from 'react'
import { motion, useInView, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform } from 'framer-motion'
import { experience } from '../data/site'
import TimelineHeading from './experience/TimelineHeading'
import TimelineNode from './experience/TimelineNode'
import ExperienceCard from './experience/ExperienceCard'
import useIsDesktop from './experience/useIsDesktop'

const clamp = v => Math.min(1, Math.max(0, v))

// One timeline row. Reports itself as "active" when it crosses the reading line (~60% down the viewport).
function Entry({ item, i, active, reached, reduce, desktop, setActive, nodeRef }) {
  const ref = useRef(null), inBand = useInView(ref, { margin: '-55% 0px -35% 0px' })
  useEffect(() => { if (inBand) setActive(i) }, [inBand, i, setActive])
  const side = i % 2 === 0 ? 'left' : 'right', on = active === i
  return (
    <li ref={ref} onFocusCapture={() => setActive(i)} className="relative grid grid-cols-[2.5rem_minmax(0,1fr)] gap-x-3 pb-10 last:pb-0 lg:grid-cols-[minmax(0,1fr)_4rem_minmax(0,1fr)] lg:gap-x-0 lg:pb-16">
      <TimelineNode nodeRef={nodeRef} reached={reached} active={on} reduce={reduce} />
      <div className={`relative min-w-0 lg:row-start-1 ${side === 'left' ? 'lg:col-start-1 lg:pr-8' : 'lg:col-start-3 lg:pl-8'}`}>
        {/* connector from node to card (desktop only) */}
        <span aria-hidden="true" className={`absolute top-[2.125rem] hidden h-px w-16 transition-all duration-500 lg:block ${side === 'left' ? '-right-8' : '-left-8'} ${on ? `${side === 'left' ? 'bg-gradient-to-l' : 'bg-gradient-to-r'} from-accent to-accent/40 shadow-[0_0_10px_#FF4528]` : 'bg-white/15'}`} />
        <ExperienceCard item={item} index={i} side={side} desktop={desktop} active={on} reduce={reduce} />
      </div>
    </li>
  )
}

export default function Experience() {
  const reduce = useReducedMotion(), desktop = useIsDesktop()
  const [active, setActive] = useState(-1)
  const listRef = useRef(null), nodeEls = useRef([])
  const firstY = useMotionValue(0), lastY = useMotionValue(0), height = useMotionValue(0)

  // The timeline is drawn between the first and last node, driven by scroll.
  const { scrollYProgress } = useScroll({ target: listRef, offset: ['start 60%', 'end 60%'] })
  const smooth = useSpring(scrollYProgress, { stiffness: 90, damping: 26, mass: 0.4 })
  const fill = useTransform([smooth, firstY, lastY, height], ([v, f, l, h]) => clamp((v * h - f) / Math.max(l - f, 1)))
  const trackH = useTransform([firstY, lastY], ([a, b]) => Math.max(b - a, 0))
  const orbY = useTransform([fill, firstY, lastY], ([f, a, b]) => a + f * (b - a))

  useEffect(() => {
    const ol = listRef.current; if (!ol) return
    const measure = () => {
      const base = ol.getBoundingClientRect().top
      const c = nodeEls.current.filter(Boolean).map(n => { const r = n.getBoundingClientRect(); return r.top - base + r.height / 2 })
      if (!c.length) return
      firstY.set(c[0]); lastY.set(c[c.length - 1]); height.set(ol.offsetHeight)
    }
    let raf = 0; const schedule = () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(measure) }
    measure()
    const ro = new ResizeObserver(schedule); ro.observe(ol)
    window.addEventListener('resize', schedule)
    return () => { cancelAnimationFrame(raf); ro.disconnect(); window.removeEventListener('resize', schedule) }
  }, [firstY, lastY, height])

  const lineX = 'left-5 lg:left-1/2'
  return (
    <section id="experience" className="relative isolate overflow-x-clip">
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-b from-transparent via-[#0c0c0f] to-transparent" />
      <div aria-hidden="true" className="absolute left-1/2 top-1/3 -z-10 size-[40rem] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,#FF45281a,transparent)]" />
      <div aria-hidden="true" className="skills-grid absolute inset-0 -z-10 opacity-60" />

      <div className="section">
        <TimelineHeading reduce={reduce} />
        <ol ref={listRef} className="relative mt-14 lg:mt-20">
          <motion.span aria-hidden="true" style={{ top: firstY, height: trackH }} className={`absolute ${lineX} w-px -translate-x-1/2 bg-white/10`} />
          <motion.span aria-hidden="true" style={{ top: firstY, height: trackH, x: '-50%', scaleY: reduce ? 1 : fill }}
            className={`absolute ${lineX} w-[2px] origin-top bg-gradient-to-b from-accent via-orange-400 to-accent shadow-[0_0_14px_#FF4528]`} />
          {!reduce && <motion.span aria-hidden="true" style={{ top: orbY }} className={`pointer-events-none absolute z-20 ${lineX} size-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white shadow-[0_0_14px_5px_#FF4528aa]`} />}
          {experience.map((item, i) => (
            <Entry key={item[0]} item={item} i={i} active={active} reached={i <= active} reduce={reduce} desktop={desktop} setActive={setActive} nodeRef={el => (nodeEls.current[i] = el)} />
          ))}
        </ol>
      </div>
    </section>
  )
}

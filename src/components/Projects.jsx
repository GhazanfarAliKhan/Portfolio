import { useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { projects } from '../data/site'
import WorkHeading from './work/WorkHeading'
import FilterBar from './work/FilterBar'
import ProjectCard from './work/ProjectCard'

const cats = ['All Projects', 'Frontend', 'Full Stack', 'Cybersecurity', 'AI']
const counts = Object.fromEntries(cats.map(c => [c, c === 'All Projects' ? projects.length : projects.filter(p => p.cat === c).length]))
// Entrance (once, in view) and exit share one variant set so filter changes never double-animate.
const item = {
  hidden: { opacity: 0, y: 32, scale: 0.96 },
  show: i => ({ opacity: 1, y: 0, scale: 1, transition: { duration: 0.6, delay: Math.min(i, 5) * 0.08, ease: [0.2, 0.8, 0.2, 1] } }),
  exit: { opacity: 0, scale: 0.94, transition: { duration: 0.2 } },
}

export default function Projects() {
  const reduce = useReducedMotion()
  const [cat, setCat] = useState('All Projects')
  const list = projects.filter(p => cat === 'All Projects' || p.cat === cat)
  return (
    <section id="work" className="relative isolate overflow-x-clip">
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-b from-transparent via-[#0c0c0f] to-transparent" />
      <div aria-hidden="true" className="absolute -right-32 top-24 -z-10 size-[36rem] rounded-full bg-[radial-gradient(closest-side,#FF45281c,transparent)]" />
      <div aria-hidden="true" className="absolute -left-40 bottom-10 -z-10 size-[30rem] rounded-full bg-[radial-gradient(closest-side,#FF6a4a12,transparent)]" />
      <div aria-hidden="true" className="skills-grid absolute inset-0 -z-10 opacity-60" />

      <div className="section">
        <WorkHeading reduce={reduce} />
        <div className="mt-8"><FilterBar cats={cats} counts={counts} value={cat} onChange={setCat} reduce={reduce} /></div>
        <p role="status" aria-live="polite" className="sr-only">Showing {list.length} {list.length === 1 ? 'project' : 'projects'}{cat === 'All Projects' ? '' : ` in ${cat}`}</p>

        <ul className="mt-8 grid gap-5 sm:grid-cols-2 lg:auto-rows-fr lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {list.map((p, i) => (
              <motion.li key={p.title} layout={reduce ? false : 'position'} custom={i} variants={item} initial={reduce ? false : 'hidden'} whileInView="show" viewport={{ once: true, amount: 0.12 }} exit={reduce ? undefined : 'exit'}
                transition={{ layout: { type: 'spring', stiffness: 260, damping: 30 } }} className={p.featured ? 'sm:col-span-2 lg:row-span-2' : ''}>
                <ProjectCard p={p} reduce={reduce} />
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
      </div>
    </section>
  )
}

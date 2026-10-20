import { useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion, useInView, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { skills, skillBlurbs } from '../data/site'
import { categoryIcons, skillIcons } from './skills/icons'
import { splitName } from './skills/utils'
import CategoryTabs from './skills/CategoryTabs'
import CinematicHeading from './skills/CinematicHeading'
import FloatingTechIcons from './skills/FloatingTechIcons'
import ParticleField from './skills/ParticleField'
import SkillCard, { LevelPips } from './skills/SkillCard'
import SkillNetwork from './skills/SkillNetwork'

const fade = { hidden: { opacity: 0, x: -20 }, show: { opacity: 1, x: 0, transition: { duration: 0.6, ease: 'easeOut' } } }
const grid = { hidden: {}, show: { transition: { staggerChildren: 0.06, delayChildren: 0.15 } } }

export default function Skills() {
  const reduce = useReducedMotion()
  const names = Object.keys(skills), counts = names.map(k => skills[k].length)
  const [idx, setIdx] = useState(0), [active, setActive] = useState(null), [pinned, setPinned] = useState(null)
  const sectionRef = useRef(null), stageRef = useRef(null)
  const inView = useInView(stageRef, { once: true, amount: 0.1 })
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start end', 'end start'] })
  const ghostY = useTransform(scrollYProgress, [0, 1], [90, -90])
  const blobY = useTransform(scrollYProgress, [0, 1], [-70, 90])

  const cat = names[idx], CatIcon = categoryIcons[idx] || categoryIcons[0], [catMain, catSub] = splitName(cat)
  const list = useMemo(() => skills[cat].map(([name, level, desc, key]) => ({ name, level, desc, Icon: skillIcons[key] || CatIcon })), [cat, CatIcon])
  const change = i => { setIdx(i); setActive(null); setPinned(null) }
  const par = reduce ? undefined : { y: ghostY }

  return (
    <section id="skills" ref={sectionRef} className="relative isolate overflow-x-clip">
      {/* ambient background: charcoal wash, glow blobs, grid, particles */}
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-b from-transparent via-[#0c0c0f] to-transparent" />
      <motion.div aria-hidden="true" style={reduce ? undefined : { y: blobY }} className="absolute -left-40 top-1/4 -z-10 size-[34rem] rounded-full bg-[radial-gradient(closest-side,#FF45281f,transparent)]" />
      <motion.div aria-hidden="true" style={reduce ? undefined : { y: blobY }} className="absolute -right-40 bottom-10 -z-10 size-[30rem] rounded-full bg-[radial-gradient(closest-side,#FF6a4a17,transparent)]" />
      <div aria-hidden="true" className="skills-grid absolute inset-0 -z-10" />
      <ParticleField count={32} reduce={reduce} className="absolute inset-0 -z-10 h-full w-full" />
      <motion.span aria-hidden="true" style={par} className="text-stroke pointer-events-none absolute left-2 top-6 -z-10 select-none font-display text-[clamp(7rem,24vw,19rem)] font-extrabold uppercase leading-none">Skills</motion.span>

      <div className="section">
        <div className="flex flex-col gap-10 lg:flex-row lg:items-center lg:justify-between">
          <CinematicHeading reduce={reduce} />
          <FloatingTechIcons progress={scrollYProgress} reduce={reduce} activeCat={idx} onPick={change} />
        </div>

        <div ref={stageRef} className="relative isolate mt-14">
          <div aria-hidden="true" className="absolute inset-x-5 -bottom-3 top-8 -z-10 rounded-[2rem] border border-white/5 bg-white/[0.02]" />
          <div aria-hidden="true" className="absolute inset-x-10 -bottom-6 top-16 -z-20 rounded-[2rem] border border-white/5 bg-white/[0.015]" />
          <div className="glass-panel relative rounded-[2rem]">
            <span aria-hidden="true" className="edge-light" />
            <div className="relative p-4 sm:p-7 lg:p-9">
              <CategoryTabs names={names} icons={categoryIcons} counts={counts} index={idx} onChange={change} idBase="skills" reduce={reduce} />

              <div role="tabpanel" id="skills-panel" aria-labelledby={`skills-tab-${idx}`} tabIndex={-1} className="mt-8 outline-none lg:min-h-[48rem]">
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div key={cat} exit={{ opacity: 0, y: -10, transition: { duration: 0.2 } }} className="grid items-center gap-8 lg:min-h-[48rem] lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] lg:gap-10">
                    <motion.div variants={fade} initial="hidden" animate={inView ? 'show' : 'hidden'}>
                      <div className="flex items-center gap-4">
                        <span className="tech-tile grid size-14 shrink-0 place-items-center rounded-2xl"><CatIcon size={26} className="text-accent" strokeWidth={1.7} aria-hidden="true" /></span>
                        <div>
                          <h3 className="h-display depth-text text-4xl sm:text-5xl">{catMain}{catSub && <span className="ml-2 align-middle text-lg font-bold text-white/60 [text-shadow:none]">({catSub})</span>}</h3>
                          <p className="mt-1 text-sm text-white/70">{skillBlurbs[cat]}</p>
                        </div>
                      </div>
                      <div className="mt-6">
                        <SkillNetwork CatIcon={CatIcon} skills={list} activeName={active} onActive={setActive} show={inView} reduce={reduce} />
                      </div>
                      <p aria-hidden="true" className="mt-2 min-h-[3rem] text-center text-sm text-white/70">
                        {active ? <><span className="font-semibold text-white">{active}</span> · {list.find(s => s.name === active)?.level}</> : `${list.length} skills in this path. Hover or tap a node.`}
                      </p>
                      <div className="mt-3 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 border-t border-white/10 pt-4">
                        {['Learning', 'Practicing', 'Proficient'].map(l => <LevelPips key={l} level={l} />)}
                      </div>
                      <p className="mt-3 text-center text-xs text-white/60">Self-assessed stages, not certifications or scores.</p>
                    </motion.div>

                    <motion.ul variants={grid} initial="hidden" animate={inView ? 'show' : 'hidden'} className="grid gap-4 sm:grid-cols-2">
                      {list.map((s, i) => <SkillCard key={s.name} skill={s} index={i} category={catMain} reduce={reduce} highlight={active === s.name} pinned={pinned === s.name} onPin={setPinned} onActive={setActive} />)}
                    </motion.ul>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

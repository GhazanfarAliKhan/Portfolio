import { useId, useState } from 'react'
import { motion } from 'framer-motion'
import { CalendarClock, ChevronDown, GraduationCap } from 'lucide-react'
import { skills } from '../../data/site'
import { categoryIcons } from '../skills/icons'
import useTilt from '../skills/useTilt'

const kid = { hidden: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.2, 0.8, 0.2, 1] } } }
const sweep = { hidden: { x: '-130%', opacity: 0 }, show: { x: '420%', opacity: [0, 1, 0], transition: { duration: 1.1, delay: 0.4, ease: 'easeInOut' } } }

// Glass card: title -> kind/date/status -> description -> tags -> optional related skills (real data from site.js).
export default function ExperienceCard({ item, index, side, desktop, active, reduce }) {
  const [title, desc, when, status, tags, kind, relCat] = item
  const [open, setOpen] = useState(false), panelId = useId()
  const tilt = useTilt(4, reduce)
  const related = relCat ? skills[relCat] : null
  const Icon = relCat ? categoryIcons[Object.keys(skills).indexOf(relCat)] || GraduationCap : GraduationCap
  const dir = desktop ? (side === 'left' ? -1 : 1) : 1
  const card = {
    hidden: { opacity: 0, x: dir * (desktop ? 64 : 24), y: desktop ? 0 : 12 },
    show: { opacity: 1, x: 0, y: 0, transition: { type: 'spring', stiffness: 110, damping: 22, mass: 0.9, staggerChildren: 0.07, delayChildren: 0.12 } },
  }
  return (
    <motion.div variants={card} initial={reduce ? false : 'hidden'} whileInView="show" viewport={{ once: true, amount: 0.2 }} className="[perspective:1000px]">
      <motion.div data-on={active} style={{ rotateX: tilt.rx, rotateY: tilt.ry, transformStyle: 'preserve-3d' }} onPointerMove={tilt.onMove} onPointerLeave={tilt.reset}
        className="skill-card group relative rounded-2xl p-5 sm:p-6">
        <motion.span aria-hidden="true" style={{ background: tilt.glare }} className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        <motion.span aria-hidden="true" style={{ background: tilt.edge }} className="edge-follow rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        {!reduce && <span aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden rounded-2xl"><motion.span variants={sweep} className="absolute inset-y-0 left-0 w-1/4 -skew-x-12 bg-gradient-to-r from-transparent via-white/15 to-transparent" /></span>}
        <span aria-hidden="true" className="text-stroke pointer-events-none absolute right-4 top-2 select-none font-display text-6xl font-extrabold leading-none sm:text-7xl">{String(index + 1).padStart(2, '0')}</span>

        <div className="relative">
          <motion.div variants={kid} className="flex flex-wrap items-center gap-x-3 gap-y-2 pr-14">
            <span className="tech-tile grid size-11 shrink-0 place-items-center"><Icon size={20} className="text-accent drop-shadow-[0_0_8px_#FF4528aa]" strokeWidth={1.8} aria-hidden="true" /></span>
            <span className="text-xs font-medium uppercase tracking-[0.18em] text-white/70">{kind}</span>
          </motion.div>
          <motion.h3 variants={kid} className="mt-4 font-display text-2xl font-bold uppercase leading-[1.05] tracking-wide sm:text-3xl">{title}</motion.h3>
          <motion.p variants={kid} className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-white/70">
            <span className="inline-flex items-center gap-1.5"><CalendarClock size={15} className="text-accent" aria-hidden="true" />{when}</span>
            <span className="rounded-full border border-accent/40 bg-accent/10 px-2.5 py-0.5 text-xs text-white/90">{status}</span>
          </motion.p>
          <motion.p variants={kid} className="mt-3 text-white/75">{desc}</motion.p>
          <motion.ul variants={kid} aria-label="Technologies and topics" className="mt-4 flex flex-wrap gap-2">
            {tags.map(t => <motion.li key={t} whileHover={reduce ? undefined : { y: -2 }} className="rounded-full border border-white/15 bg-white/[0.04] px-3 py-1 text-xs text-white/80 transition-colors hover:border-accent/60 hover:text-white">{t}</motion.li>)}
          </motion.ul>

          {related && (
            <motion.div variants={kid}>
              <button type="button" aria-expanded={open} aria-controls={panelId} onClick={() => setOpen(o => !o)}
                className="mt-4 inline-flex min-h-11 items-center gap-2 rounded-lg text-sm font-medium text-white/80 outline-none transition-colors hover:text-accent focus-visible:ring-2 focus-visible:ring-accent">
                <ChevronDown size={16} aria-hidden="true" className={`transition-transform duration-300 ${open ? 'rotate-180' : ''}`} />
                {open ? 'Hide' : 'Show'} related skills ({related.length})
              </button>
              {/* CSS-only collapse (grid rows + visibility): no JS animation callbacks, hidden from assistive tech when closed */}
              <div id={panelId} aria-hidden={!open} className={`grid transition-[grid-template-rows,opacity,visibility] duration-300 ease-out ${open ? 'visible grid-rows-[1fr] opacity-100' : 'invisible grid-rows-[0fr] opacity-0'}`}>
                <div className="overflow-hidden">
                  <ul className="grid gap-2 pt-1 sm:grid-cols-2">
                    {related.map(([n, lvl]) => (
                      <li key={n} className="flex items-center justify-between gap-3 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-sm">
                        <span>{n}</span><span className="shrink-0 text-xs text-white/70">{lvl}</span>
                      </li>))}
                  </ul>
                  <p className="mt-2 text-xs text-white/60">Self-assessed stages from the Skills section, not certifications.</p>
                </div>
              </div>
            </motion.div>)}
        </div>
      </motion.div>
    </motion.div>
  )
}

import { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Plus } from 'lucide-react'
import useTilt from './useTilt'
import { LEVELS, projectsUsing } from './utils'

const cardV = {
  hidden: { opacity: 0, y: 28, scale: 0.96 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.55, ease: [0.2, 0.8, 0.2, 1] } },
}

export function LevelPips({ level }) {
  return (
    <span className="flex items-center gap-2">
      <span aria-hidden="true" className="flex gap-1">{[1, 2, 3].map(i => <i key={i} className={`h-1 w-4 rounded-full ${i <= LEVELS[level].n ? 'bg-accent shadow-[0_0_8px_#FF4528]' : 'bg-white/15'}`} />)}</span>
      <span className="text-xs font-medium text-white/80">{level}</span>
    </span>
  )
}

// Skill card: 3D tilt, pointer-following edge light, floating icon, expandable details.
// Open on hover (mouse), focus (keyboard) or tap (touch). Escape closes.
export default function SkillCard({ skill, category, highlight, pinned, onPin, onActive, reduce, index }) {
  const { name, level, desc, Icon } = skill
  const [hover, setHover] = useState(false), [kb, setKb] = useState(false)
  const open = hover || kb || pinned
  const tilt = useTilt(7, reduce)
  const used = useMemo(() => projectsUsing(name), [name])
  return (
    <motion.li variants={cardV} className="[perspective:1000px]">
      <motion.button type="button" aria-expanded={open} data-on={highlight || open}
        style={{ rotateX: tilt.rx, rotateY: tilt.ry, transformStyle: 'preserve-3d' }}
        whileHover={reduce ? undefined : { scale: 1.025 }} whileTap={{ scale: 0.985 }}
        onPointerMove={tilt.onMove}
        onPointerEnter={e => { if (e.pointerType === 'mouse') { setHover(true); onActive(name) } }}
        onPointerLeave={e => { tilt.reset(); if (e.pointerType === 'mouse') { setHover(false); onActive(null) } }}
        onFocus={e => { setKb(e.currentTarget.matches(':focus-visible')); onActive(name) }}
        onBlur={() => { setKb(false); onActive(null); if (pinned) onPin(null) }}
        onClick={e => { if (e.nativeEvent.pointerType !== 'mouse') onPin(pinned ? null : name) }}
        onKeyDown={e => { if (e.key === 'Escape') { setKb(false); onPin(null) } }}
        className="skill-card group relative block h-[11.75rem] w-full touch-manipulation rounded-2xl text-left outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-[#0b0b0d]">
        <motion.span aria-hidden="true" style={{ background: tilt.glare }} className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        <motion.span aria-hidden="true" style={{ background: tilt.edge }} className="edge-follow rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-data-[on=true]:opacity-100" />

        <span className="relative block h-full p-5 [transform-style:preserve-3d]">
          <span className="flex items-start justify-between gap-3">
            <span className={`block [transform-style:preserve-3d] ${reduce ? '' : 'animate-float [animation-iteration-count:infinite]'}`} style={{ animationDuration: `${5.5 + (index % 4) * 0.8}s`, animationDelay: `${-index * 0.6}s` }}>
              <span className="block transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-110">
                <span className="tech-tile grid size-12 place-items-center rounded-xl [transform:translateZ(34px)]"><Icon size={22} className="text-accent drop-shadow-[0_0_8px_#FF4528aa]" strokeWidth={1.8} aria-hidden="true" /></span>
              </span>
            </span>
            <LevelPips level={level} />
          </span>
          <span className="mt-4 block font-display text-[1.45rem] font-bold uppercase leading-[1.05] tracking-wide [transform:translateZ(20px)]">{name}</span>
          <span className="mt-1.5 line-clamp-2 block text-sm text-white/70">{desc}</span>
          <Plus size={16} aria-hidden="true" className={`absolute bottom-4 right-4 text-white/50 transition-transform duration-300 ${open ? 'rotate-45 text-accent' : ''}`} />
        </span>

        <AnimatePresence>
          {open && (
            <motion.span key="d" initial={reduce ? false : { opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={reduce ? { opacity: 0 } : { opacity: 0, y: 10 }} transition={{ duration: 0.28, ease: 'easeOut' }}
              className="absolute inset-0 flex flex-col justify-between rounded-2xl bg-gradient-to-br from-[#2a1510]/95 to-[#0d0d10]/[0.97] p-5">
              <span className="block">
                <LevelPips level={level} />
                <span className="mt-2.5 block text-sm leading-snug text-white/85">{LEVELS[level].meaning}</span>
              </span>
              <span className="block">
                {used.length > 0 && <span className="mb-2 block text-[11px] uppercase tracking-widest text-white/60">Used in</span>}
                <span className="flex flex-wrap gap-1.5">
                  {used.slice(0, 2).map(t => <span key={t} className="rounded-full border border-accent/40 bg-accent/10 px-2.5 py-0.5 text-xs text-white/90">{t}</span>)}
                  {used.length > 2 && <span className="rounded-full border border-white/15 px-2.5 py-0.5 text-xs text-white/70">+{used.length - 2}</span>}
                  {used.length === 0 && <span className="text-xs text-white/60">Part of the {category} path</span>}
                </span>
              </span>
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>
    </motion.li>
  )
}

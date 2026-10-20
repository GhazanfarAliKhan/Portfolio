import { motion, useTransform } from 'framer-motion'
import { Atom, Braces, Brain, Database, FileCode2, Network, Palette, Server, ShieldCheck } from 'lucide-react'

// [label, icon, category index, left %, top %, parallax depth, float seconds]
const TILES = [
  ['HTML5', FileCode2, 0, 2, 4, 0.8, 6.5], ['CSS3', Palette, 0, 34, 0, 1.2, 7.5], ['JS', Braces, 0, 66, 8, 0.7, 6],
  ['React', Atom, 0, 15, 35, 1.4, 7], ['Node', Server, 1, 47, 33, 0.6, 8], ['Mongo', Database, 1, 79, 38, 1.1, 6.8],
  ['AI', Brain, 3, 4, 68, 1, 7.2], ['Net', Network, 2, 36, 66, 1.3, 6.2], ['Sec', ShieldCheck, 4, 68, 70, 0.9, 7.8],
]

function Tile({ t, i, progress, reduce, activeCat, onPick }) {
  const [label, Icon, cat, left, top, depth, secs] = t
  const y = useTransform(progress, [0, 1], [depth * -28, depth * 28])
  const on = activeCat === cat
  return (
    <motion.div style={reduce ? undefined : { y }} className="absolute" aria-hidden="true">
      <div style={{ left: `${left}%`, top: `${top}%`, animationDuration: `${secs}s`, animationDelay: `${-i * 0.9}s` }} className="absolute animate-float [animation-iteration-count:infinite]">
        <motion.div role="presentation" onClick={() => onPick(cat)} whileHover={reduce ? undefined : { scale: 1.14, rotateX: -12, rotateY: 14 }} transition={{ type: 'spring', stiffness: 300, damping: 18 }}
          data-on={on} className="tech-tile grid size-14 cursor-pointer place-items-center sm:size-16 [transform-style:preserve-3d]">
          <span className="grid place-items-center gap-0.5 [transform:translateZ(18px)]">
            <Icon size={20} className="text-accent drop-shadow-[0_0_8px_#FF4528aa]" strokeWidth={1.8} />
            <span className="text-[9px] font-semibold tracking-wider text-white/75">{label}</span>
          </span>
        </motion.div>
      </div>
    </motion.div>
  )
}

// Extruded, floating tech tiles. Decorative: the real controls are the category tabs.
export default function FloatingTechIcons({ progress, reduce, activeCat, onPick }) {
  return (
    <div aria-hidden="true" className="relative mx-auto h-60 w-full max-w-[26rem] shrink-0 [perspective:700px] sm:h-64 lg:mx-0">
      <div className="absolute inset-0 -z-10 rounded-full bg-[radial-gradient(closest-side,#FF45282e,transparent)] blur-2xl" />
      {TILES.map((t, i) => <Tile key={t[0]} t={t} i={i} progress={progress} reduce={reduce} activeCat={activeCat} onPick={onPick} />)}
    </div>
  )
}

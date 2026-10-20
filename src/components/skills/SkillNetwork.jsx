import { motion } from 'framer-motion'
import { LEVELS } from './utils'

const C = 240, R = 168, NR = 27
const pos = (i, n) => { const a = -Math.PI / 2 + (i / n) * Math.PI * 2; return [+(C + R * Math.cos(a)).toFixed(1), +(C + R * Math.sin(a)).toFixed(1)] }
const nodeV = {
  hidden: { opacity: 0, scale: 0.4 },
  show: i => ({ opacity: 1, scale: 1, transition: { delay: 0.35 + i * 0.07, type: 'spring', stiffness: 260, damping: 20 } }),
}
const box = { transformBox: 'fill-box', transformOrigin: 'center' }

// Central visualization: hub + skill nodes joined by animated connection lines and data pulses.
export default function SkillNetwork({ CatIcon, skills, activeName, onActive, show, reduce }) {
  const n = skills.length, pts = skills.map((_, i) => pos(i, n)), act = skills.findIndex(s => s.name === activeName)
  return (
    <svg viewBox="0 0 480 480" className="mx-auto block w-full max-w-[30rem] overflow-visible" aria-hidden="true" focusable="false">
      <defs>
        <radialGradient id="hubGrad"><stop offset="0" stopColor="#FF6A4A" stopOpacity=".5" /><stop offset="1" stopColor="#FF4528" stopOpacity="0" /></radialGradient>
        <radialGradient id="nodeGrad" cx=".35" cy=".3"><stop offset="0" stopColor="#33201b" /><stop offset="1" stopColor="#101113" /></radialGradient>
      </defs>
      <circle cx={C} cy={C} r={R} fill="none" stroke="rgba(255,255,255,.08)" strokeDasharray="2 9" className={reduce ? '' : 'spin-slow'} style={box} />
      <circle cx={C} cy={C} r="112" fill="none" stroke="rgba(255,69,40,.14)" strokeDasharray="1 7" className={reduce ? '' : 'spin-rev'} style={box} />

      <motion.g initial={reduce ? false : { opacity: 0 }} animate={{ opacity: show ? 1 : 0 }} transition={{ duration: 0.8, delay: 0.2 }}>
        {pts.map(([x, y], i) => { const [x2, y2] = pts[(i + 1) % n]; return n > 2 && <line key={'e' + i} x1={x} y1={y} x2={x2} y2={y2} stroke="rgba(255,69,40,.2)" strokeWidth="1" /> })}
        {pts.map(([x, y], i) => {
          const on = i === act, dim = act >= 0 && !on
          return (
            <g key={'s' + i} style={{ opacity: dim ? 0.3 : 1, transition: 'opacity .3s' }}>
              <line x1={C} y1={C} x2={x} y2={y} stroke={on ? '#FF4528' : 'rgba(255,69,40,.4)'} strokeWidth={on ? 2.2 : 1.2} style={{ transition: 'stroke .3s' }} />
              {!reduce && <>
                <line x1={C} y1={C} x2={x} y2={y} stroke="#FF9A7E" strokeWidth="1.4" strokeDasharray="3 12" className="flow-line" opacity=".8" />
                <circle r="2.6" fill="#FFB199"><animateMotion dur={`${3 + (i % 3) * 0.7}s`} begin={`${i * 0.45}s`} repeatCount="indefinite" path={`M${C},${C} L${x},${y}`} /></circle>
              </>}
            </g>)
        })}
      </motion.g>

      <motion.g initial={reduce ? false : { opacity: 0, scale: 0.6 }} animate={{ opacity: show ? 1 : 0, scale: show ? 1 : 0.6 }} transition={{ duration: 0.7, ease: 'easeOut' }} style={box}>
        <circle cx={C} cy={C} r="74" fill="url(#hubGrad)" className={reduce ? '' : 'hub-pulse'} style={box} />
        <circle cx={C} cy={C} r="46" fill="#0d0d10" stroke="#FF4528" strokeWidth="1.5" style={{ filter: 'drop-shadow(0 0 12px rgba(255,69,40,.55))' }} />
        <CatIcon x={C - 16} y={C - 16} width={32} height={32} color="#FF6A4A" strokeWidth={1.6} />
      </motion.g>

      {skills.map((s, i) => {
        const [x, y] = pts[i], on = i === act, I = s.Icon
        return (
          <motion.g key={s.name} custom={i} variants={nodeV} initial={reduce ? false : 'hidden'} animate={show ? 'show' : 'hidden'} style={box}>
            <g className={reduce ? '' : 'node-bob'} style={{ animationDelay: `${i * -0.7}s` }}>
              <g style={{ cursor: 'pointer' }} onPointerEnter={e => e.pointerType === 'mouse' && onActive(s.name)} onPointerLeave={e => e.pointerType === 'mouse' && onActive(null)}
                onPointerDown={e => e.pointerType !== 'mouse' && onActive(activeName === s.name ? null : s.name)}>
                <circle cx={x} cy={y} r="38" fill="transparent" />
                <circle cx={x} cy={y} r={NR + 7} fill="none" stroke="#FF4528" strokeOpacity={on ? 0.55 : 0} style={{ transition: 'stroke-opacity .3s' }} />
                <circle cx={x} cy={y} r={NR} fill="url(#nodeGrad)" stroke="#FF4528" strokeOpacity={0.3 + LEVELS[s.level].n * 0.23} strokeWidth={on ? 2.4 : 1.4}
                  style={{ filter: on ? 'drop-shadow(0 0 10px #FF4528)' : 'none', transition: 'filter .3s' }} />
                <I x={x - 11} y={y - 11} width={22} height={22} color={on ? '#fff' : '#FFB199'} strokeWidth={1.7} />
              </g>
            </g>
          </motion.g>)
      })}
    </svg>
  )
}

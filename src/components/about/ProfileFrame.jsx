import { useState } from 'react'
import { motion } from 'framer-motion'
import { GraduationCap } from 'lucide-react'
import { site } from '../../data/site'
import useTilt from '../skills/useTilt'

// Used only when there is no portrait or it fails to load: original abstract art, never a fake photo.
function AbstractVisual() {
  return (
    <svg viewBox="0 0 400 500" preserveAspectRatio="xMidYMid slice" role="img" aria-label="Abstract illustration of connected nodes and code brackets" className="absolute inset-0 h-full w-full">
      <defs>
        <linearGradient id="ab-bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#1b1c20" /><stop offset="1" stopColor="#08080a" /></linearGradient>
        <radialGradient id="ab-gl" cx=".5" cy=".42" r=".6"><stop offset="0" stopColor="#FF4528" stopOpacity=".45" /><stop offset="1" stopColor="#FF4528" stopOpacity="0" /></radialGradient>
      </defs>
      <rect width="400" height="500" fill="url(#ab-bg)" /><rect width="400" height="500" fill="url(#ab-gl)" />
      {[170, 120, 70].map((r, i) => <circle key={r} cx="200" cy="210" r={r} fill="none" stroke={i === 1 ? '#FF4528' : '#fff'} strokeOpacity={i === 1 ? 0.55 : 0.12} strokeDasharray={i === 0 ? '3 8' : undefined} />)}
      <path d="M150 170l-40 40 40 40M250 170l40 40-40 40" fill="none" stroke="#FF8A5B" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M216 160l-32 100" stroke="#fff" strokeOpacity=".55" strokeWidth="6" strokeLinecap="round" />
      {[[80, 330], [320, 320], [110, 400], [300, 410], [200, 380]].map(([x, y], i) => <g key={i}><path d={`M200 210L${x} ${y}`} stroke="#FF4528" strokeOpacity=".3" /><circle cx={x} cy={y} r="7" fill="#0d0d10" stroke="#FF4528" strokeOpacity=".8" /></g>)}
    </svg>
  )
}

// Portrait in a layered glass frame with a slow light sweep, subtle pointer perspective and a floating details panel.
export default function ProfileFrame({ reduce, edu }) {
  const [broken, setBroken] = useState(false)
  const tilt = useTilt(3, reduce)
  const photo = site.portrait && !broken
  return (
    <div className="relative mx-auto w-full max-w-sm [perspective:1100px] sm:max-w-md lg:max-w-none">
      <div aria-hidden="true" className="absolute -inset-8 -z-20 rounded-[3rem] bg-[radial-gradient(closest-side,#FF452838,transparent)] blur-2xl" />
      <div aria-hidden="true" className="absolute inset-0 -z-10 translate-x-4 translate-y-4 rotate-3 rounded-[2rem] border border-white/10 bg-white/[0.03]" />
      <div aria-hidden="true" className="absolute inset-0 -z-10 -translate-x-3 translate-y-2 -rotate-2 rounded-[2rem] border border-white/5 bg-white/[0.02]" />

      <motion.div style={{ rotateX: tilt.rx, rotateY: tilt.ry, transformStyle: 'preserve-3d' }} onPointerMove={tilt.onMove} onPointerLeave={tilt.reset}
        className="relative rounded-[2rem] bg-black/40 p-2 shadow-[0_40px_90px_-30px_#FF452855,0_30px_60px_-30px_#000]">
        <span aria-hidden="true" className="edge-light" style={{ animationDuration: '14s' }} />
        <div className="relative aspect-[4/5] overflow-hidden rounded-[1.5rem] bg-char">
          {photo
            ? <img src={site.portrait} alt={`Portrait of ${site.name}`} width="1536" height="2752" loading="lazy" decoding="async" onError={() => setBroken(true)} className="absolute inset-0 h-full w-full object-cover object-[50%_16%]" />
            : <AbstractVisual />}
          <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(60%_40%_at_88%_6%,#FF452833,transparent)]" />
          <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-[#0b0b0d] via-[#0b0b0d]/10 to-transparent" />
          <div aria-hidden="true" className="absolute inset-0 rounded-[1.5rem] ring-1 ring-inset ring-white/10" />
        </div>

        {/* floating details panel: only facts from site.js and the experience data */}
        <div className="absolute inset-x-4 -bottom-6 sm:inset-x-auto sm:-right-8 sm:w-[17rem] md:animate-float [animation-duration:7s] [transform-style:preserve-3d]">
          <div className="rounded-2xl border border-white/15 bg-[#0d0d10]/85 p-4 shadow-[0_20px_50px_-20px_#000] [transform:translateZ(46px)] md:backdrop-blur-md">
            <p className="font-display text-xl font-bold uppercase leading-none tracking-wide">{site.name}</p>
            <p className="mt-1.5 text-xs text-white/70">{site.title}</p>
            {edu && (
              <p className="mt-3 flex items-start gap-2 border-t border-white/10 pt-3 text-xs text-white/80">
                <GraduationCap size={15} className="mt-0.5 shrink-0 text-accent" aria-hidden="true" />
                <span>{edu[0]} <span className="ml-1 whitespace-nowrap rounded-full border border-accent/40 bg-accent/10 px-2 py-0.5 text-[11px] text-white/90">{edu[3]}</span></span>
              </p>)}
          </div>
        </div>
      </motion.div>
    </div>
  )
}

import { useEffect, useState } from 'react'
import { motion, useMotionValue, useSpring, useReducedMotion } from 'framer-motion'
import { ArrowRight, Brain, Code2, Download, Terminal } from 'lucide-react'
import CharacterPortrait from './CharacterPortrait'
import FloatingSkillCard from './FloatingSkillCard'
import StatsPanel from './StatsPanel'
import TechStrip from './TechStrip'
import { site } from '../data/site'
import Socials from './Socials'
import AnimatedName from './AnimatedName'
const reveal = on => ({ initial: false, animate: on ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }, transition: { duration: 0.8, ease: 'easeOut' } })
export default function Hero() {
  const reduce = useReducedMotion(), mx = useMotionValue(0), my = useMotionValue(0)
  const x = useSpring(mx, { stiffness: 60, damping: 20 }), y = useSpring(my, { stiffness: 60, damping: 20 })
  const [phase, setPhase] = useState(0), [run, setRun] = useState(0)   // phase: 0 name, 1 title, 2 intro, 3 buttons
  useEffect(() => { const r = () => { setPhase(0); setRun(k => k + 1) }; window.addEventListener('gk:replay-intro', r); return () => window.removeEventListener('gk:replay-intro', r) }, [])
  useEffect(() => {
    if (phase !== 2) return
    const t = setTimeout(() => setPhase(3), 400)
    return () => clearTimeout(t)
  }, [phase])
  const onMove = e => { if (reduce) return; mx.set((e.clientX / window.innerWidth - 0.5) * 24); my.set((e.clientY / window.innerHeight - 0.5) * 16) }
  return (
    <section id="home" onMouseMove={onMove} className="relative mx-auto max-w-6xl px-5 pb-10 pt-28">
      <div className="grid items-center gap-10 lg:grid-cols-2">
        <div>
          <AnimatedName text={site.name} runKey={run} onDone={() => setPhase(1)} className="h-display text-[clamp(3.2rem,9.5vw,6.5rem)]" />
          <AnimatedName as="p" text={site.title} active={phase >= 1} runKey={run} stagger={38} spaceExtra={60} delay={150} onDone={() => setPhase(2)} className="mt-5 font-display text-[clamp(1.05rem,2.6vw,1.6rem)] font-bold uppercase tracking-[0.14em]" />
          <motion.p {...reveal(phase >= 2)} className="mt-6 max-w-lg text-white/70">I’m Ghazanfar Ali Khan, a passionate developer building modern web applications, AI-powered solutions, and innovative digital experiences that solve real-world problems.</motion.p>
          <motion.div {...reveal(phase >= 3)} className="mt-8 flex flex-wrap gap-4">
            <a href="#work" className="btn-primary">VIEW MY WORK <ArrowRight size={16} /></a>
            {site.resume ? <a href={site.resume} download className="btn-ghost">DOWNLOAD RESUME <Download size={16} /></a>
              : <button disabled title="Add your resume path in src/data/site.js" className="btn-ghost cursor-not-allowed opacity-50">RESUME COMING SOON <Download size={16} /></button>}
          </motion.div>
        </div>
        <div className="relative mx-auto h-[26rem] w-full max-w-md sm:h-[32rem]">
          <motion.div style={{ x, y }} className="absolute inset-0 grid place-items-center">
            <div className="absolute aspect-square w-[88%] rounded-full border border-accent/60 shadow-[0_0_60px_#FF452844,inset_0_0_60px_#FF452822]" />
            {[...Array(10)].map((_, i) => <i key={i} className="absolute h-1 w-1 animate-float rounded-full bg-accent/80" style={{ left: `${10 + i * 8}%`, top: `${15 + (i * 37) % 70}%`, animationDelay: `${i * 0.4}s` }} />)}
            <div className="relative h-full w-4/5"><CharacterPortrait /></div>
          </motion.div>
          <FloatingSkillCard icon={Brain} title="AI Enthusiast" text="Exploring AI-powered creativity." className="-left-2 top-6 sm:-left-10" />
          <FloatingSkillCard icon={Code2} title="Full Stack Developer" text="Building modern digital experiences." className="-right-2 top-1/2 sm:-right-6" delay="1s" />
          <FloatingSkillCard icon={Terminal} title="Problem Solver" text="Learning, building, and improving." className="bottom-0 left-2 sm:left-6" delay="2s" />
        </div>
      </div>
      <div className="mt-12"><div className="mb-6 flex items-center gap-4"><span className="text-xs tracking-widest text-white/50">FIND ME ON</span><Socials /></div><StatsPanel /><TechStrip /></div>
    </section>)
}

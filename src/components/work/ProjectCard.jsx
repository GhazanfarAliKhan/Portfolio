import { motion } from 'framer-motion'
import { ArrowUpRight, Brain, Code2, ExternalLink, Github, Layers, Link2Off, MessageSquare, ShieldCheck, Star } from 'lucide-react'
import { isReal } from '../../data/site'
import useTilt from '../skills/useTilt'
import { previewByCat, previews } from './previews'

const catIcon = { Frontend: Code2, 'Full Stack': Layers, Cybersecurity: ShieldCheck, AI: Brain }
// Only real http(s) URLs become buttons; anything else (empty, placeholder, javascript:) is dropped.
const safeUrl = u => { if (!u || !isReal(u)) return null; try { const x = new URL(u); return /^https?:$/.test(x.protocol) ? x.href : null } catch { return null } }
const iconLink = 'inline-flex min-h-11 items-center gap-2 rounded-lg px-3 text-sm font-medium outline-none transition-colors focus-visible:ring-2 focus-visible:ring-accent'

export default function ProjectCard({ p, reduce }) {
  const tilt = useTilt(featuredTilt(p), reduce)
  const Preview = previews[p.preview] || previews[previewByCat[p.cat]] || previews.portfolio
  const CatIcon = catIcon[p.cat] || Code2
  const live = safeUrl(p.live), repo = safeUrl(p.github), feat = !!p.featured
  return (
    <div className="h-full [perspective:1100px]">
      <motion.article style={{ rotateX: tilt.rx, rotateY: tilt.ry, transformStyle: 'preserve-3d' }} onPointerMove={tilt.onMove} onPointerLeave={tilt.reset}
        whileHover={reduce ? undefined : { y: -6 }} transition={{ type: 'spring', stiffness: 260, damping: 22 }}
        className={`skill-card group relative flex h-full flex-col rounded-2xl transition-colors hover:border-accent/50 focus-within:border-accent/60 ${feat ? 'border-accent/40 shadow-[0_30px_80px_-30px_#FF452860]' : ''}`}>
        {feat && <span aria-hidden="true" className="edge-static rounded-2xl" />}
        <motion.span aria-hidden="true" style={{ background: tilt.glare }} className="pointer-events-none absolute inset-0 z-20 rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        <motion.span aria-hidden="true" style={{ background: tilt.edge }} className="edge-follow z-20 rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

        {/* preview: original illustration, not a screenshot */}
        <div className={`relative aspect-[16/10] overflow-hidden rounded-t-2xl ${feat ? 'lg:aspect-auto lg:min-h-[20rem] lg:flex-1' : ''}`}>
          <Preview />
          <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-[#0b0b0d] via-transparent to-transparent" />
          <div className="absolute left-3 top-3 z-10 flex flex-wrap gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-black/60 px-2.5 py-1 text-xs text-white/90 backdrop-blur-sm"><CatIcon size={13} className="text-accent" aria-hidden="true" />{p.cat}</span>
            {feat && <span className="inline-flex items-center gap-1.5 rounded-full border border-accent/50 bg-accent/20 px-2.5 py-1 text-xs font-medium text-white"><Star size={12} className="fill-accent text-accent" aria-hidden="true" />Featured</span>}
          </div>
          {p.inProgress && <span className="absolute right-3 top-3 z-10 inline-flex items-center gap-1.5 rounded-full border border-accent/40 bg-black/60 px-2.5 py-1 text-xs font-medium text-white backdrop-blur-sm"><i aria-hidden="true" className="size-1.5 rounded-full bg-accent shadow-[0_0_8px_#FF4528]" />In progress</span>}
          <span className="absolute bottom-2 left-3 z-10 text-[10px] uppercase tracking-widest text-white/50">Concept illustration</span>
          {/* secondary action: revealed on hover/focus, always shown on touch devices */}
          <a href="#contact" className="absolute bottom-3 right-3 z-30 inline-flex min-h-9 items-center gap-1.5 rounded-full border border-accent/50 bg-black/75 px-3 text-xs font-medium text-white opacity-0 outline-none backdrop-blur-sm transition duration-300 focus-visible:opacity-100 focus-visible:ring-2 focus-visible:ring-accent group-hover:opacity-100 [@media(hover:none)]:opacity-100">
            <MessageSquare size={13} aria-hidden="true" />Ask about this project<span className="sr-only"> ({p.title})</span>
          </a>
        </div>

        <div className={`relative z-10 flex flex-col p-5 ${feat ? 'sm:p-7' : ''}`}>
          <h3 className={`font-display font-bold uppercase leading-[1.05] tracking-wide ${feat ? 'text-3xl sm:text-4xl' : 'text-2xl'}`}>{p.title}</h3>
          <p className={`mt-2 text-white/70 ${feat ? 'sm:text-lg' : 'text-sm'}`}>{p.desc}</p>
          <ul aria-label="Technologies" className="mt-4 flex flex-wrap gap-2">
            {p.stack.map(s => <motion.li key={s} whileHover={reduce ? undefined : { y: -2 }} className="rounded-full border border-white/15 bg-white/[0.04] px-3 py-1 text-xs text-white/80 transition-colors hover:border-accent/60 hover:text-white">{s}</motion.li>)}
          </ul>
          <div className="mt-4 flex flex-wrap items-center gap-x-2 gap-y-1 border-t border-white/10 pt-3">
            {live && <a href={live} target="_blank" rel="noopener noreferrer" aria-label={`Live demo of ${p.title} (opens in a new tab)`} className={`group/link ${iconLink} bg-accent/15 text-accent hover:bg-accent/25`}>
              <ExternalLink size={16} aria-hidden="true" className="transition-transform duration-300 group-hover/link:-translate-y-0.5 group-hover/link:translate-x-0.5" />Live demo</a>}
            {repo && <a href={repo} target="_blank" rel="noopener noreferrer" aria-label={`GitHub repository for ${p.title} (opens in a new tab)`} className={`group/link ${iconLink} text-white/85 hover:bg-white/10 hover:text-white`}>
              <Github size={16} aria-hidden="true" className="transition-transform duration-300 group-hover/link:-rotate-12 group-hover/link:scale-110" />GitHub<ArrowUpRight size={14} aria-hidden="true" className="text-white/50 transition-transform duration-300 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5" /></a>}
            {!live && !repo && <span className="inline-flex min-h-11 items-center gap-2 text-xs text-white/60"><Link2Off size={14} aria-hidden="true" />Links not added yet</span>}
          </div>
        </div>
      </motion.article>
    </div>
  )
}
function featuredTilt(p) { return p.featured ? 4 : 6 }

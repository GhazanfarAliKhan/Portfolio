import { motion } from 'framer-motion'
import { ArrowUpRight, Facebook, Github, Instagram, Linkedin } from 'lucide-react'
import { site, isReal } from '../../data/site'

const icons = { GitHub: Github, Facebook, Instagram, LinkedIn: Linkedin }
const itemV = { hidden: { opacity: 0, y: 18 }, show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } } }
const base = 'group relative flex w-full items-center gap-3 rounded-2xl border p-3 text-left outline-none transition-colors focus-visible:ring-2 focus-visible:ring-accent'

// URLs come from site.socials. Placeholder URLs stay inactive (no fake links), exactly like the footer icons.
export default function SocialCards({ reduce }) {
  return (
    <ul className="grid grid-cols-2 gap-3">
      {site.socials.map(([n, url]) => {
        const I = icons[n], real = isReal(url)
        const inner = (
          <>
            <span className="tech-tile grid size-11 shrink-0 place-items-center transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-105">
              <I size={20} className={real ? 'text-accent drop-shadow-[0_0_8px_#FF4528aa]' : 'text-white/40'} strokeWidth={1.8} aria-hidden="true" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block font-display text-lg font-bold uppercase leading-none tracking-wide">{n}</span>
              <span className="mt-1 block truncate text-xs text-white/60">{real ? 'View profile' : 'Link not added'}</span>
            </span>
            {real && <ArrowUpRight size={16} aria-hidden="true" className="shrink-0 text-white/50 transition duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent" />}
          </>)
        return (
          <motion.li key={n} variants={itemV}>
            {real
              ? <motion.a href={url} target="_blank" rel="noopener noreferrer" aria-label={`${n} profile (opens in a new tab)`} whileHover={reduce ? undefined : { y: -3 }} whileTap={{ scale: 0.97 }}
                  className={`${base} border-white/10 bg-gradient-to-br from-white/[0.06] to-white/[0.01] hover:border-accent/60 hover:shadow-[0_14px_36px_-14px_#FF452880]`}>{inner}</motion.a>
              : <button type="button" aria-disabled="true" aria-label={`${n} (add your URL in src/data/site.js)`} title={`Replace ${url} in src/data/site.js`}
                  className={`${base} cursor-not-allowed border-white/[0.06] bg-white/[0.015] text-white/50`}>{inner}</button>}
          </motion.li>)
      })}
    </ul>
  )
}

import { Github, Facebook, Instagram, Linkedin } from 'lucide-react'
import { site, isReal } from '../data/site'
const icons = { GitHub: Github, Facebook, Instagram, LinkedIn: Linkedin }
const cls = 'grid h-10 w-10 place-items-center rounded-full border border-white/15 transition'
export default function Socials() {
  return <ul className="flex gap-3">{site.socials.map(([n, url]) => { const I = icons[n]
    return <li key={n}>{isReal(url)
      ? <a href={url} target="_blank" rel="noopener noreferrer" aria-label={n} className={`${cls} text-white/80 hover:-translate-y-0.5 hover:border-accent hover:text-accent hover:shadow-[0_0_16px_#FF452877]`}><I size={18} /></a>
      : <button type="button" aria-disabled="true" aria-label={`${n} (add your URL in src/data/site.js)`} title={`Replace ${url} in src/data/site.js`} className={`${cls} cursor-not-allowed text-white/30`}><I size={18} /></button>}</li> })}</ul>
}

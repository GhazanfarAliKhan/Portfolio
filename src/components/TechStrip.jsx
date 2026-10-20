import { Mouse } from 'lucide-react'
import { tech } from '../data/site'
export default function TechStrip() {
  return <div className="mt-8 flex flex-col gap-4 border-t border-white/10 pt-5 md:flex-row md:items-center md:justify-between">
    <div className="flex items-center gap-3 text-xs tracking-widest text-white/50"><Mouse size={16} />SCROLL TO EXPLORE<span className="h-px w-16 bg-accent/70" /></div>
    <div className="flex flex-wrap items-center gap-2"><span className="mr-2 text-xs tracking-widest text-white/50">TECH I WORK WITH</span>
      {tech.map(([n, c, s]) => <span key={n} className="inline-flex items-center gap-2 rounded-full border border-white/10 px-3 py-1 text-xs"><i className="h-2 w-2 rounded-full" style={{ background: c }} />{n}<em className="not-italic text-white/40">{s}</em></span>)}</div></div>
}

import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowUpRight, Menu, X } from 'lucide-react'
const links = ['Home', 'About', 'Work', 'Skills', 'Experience', 'Contact']
export default function Navbar() {
  const [active, setActive] = useState('home'), [open, setOpen] = useState(false), [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    onScroll(); window.addEventListener('scroll', onScroll, { passive: true })
    const io = new IntersectionObserver(es => es.forEach(e => e.isIntersecting && setActive(e.target.id)), { rootMargin: '-45% 0px -50% 0px' })
    links.forEach(l => { const el = document.getElementById(l.toLowerCase()); el && io.observe(el) })
    return () => { window.removeEventListener('scroll', onScroll); io.disconnect() }
  }, [])
  return (
    <header className={`fixed inset-x-0 top-0 z-50 transition ${scrolled ? 'bg-black/60 backdrop-blur-lg border-b border-white/10' : ''}`}>
      <nav aria-label="Main" className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
        <a href="#home" className="flex items-center gap-3"><span className="grid h-9 w-9 place-items-center rounded-lg border border-accent font-display text-lg font-extrabold text-accent shadow-[0_0_14px_#FF452855]">GK</span><span className="font-display text-lg font-bold tracking-wider">GHAZANFAR ALI KHAN</span></a>
        <ul className="hidden gap-8 text-sm lg:flex">{links.map(l => { const id = l.toLowerCase(), on = active === id
          return <li key={l}><a href={`#${id}`} aria-current={on ? 'page' : undefined} className={`relative py-1 transition ${on ? 'text-accent' : 'text-white/70 hover:text-white'}`}>{l}{on && <span className="absolute -bottom-1 left-0 right-0 h-px bg-accent shadow-[0_0_8px_#FF4528]" />}</a></li> })}</ul>
        <div className="flex items-center gap-3">
          <a href="#contact" className="btn-primary hidden sm:inline-flex">LET&apos;S CONNECT <ArrowUpRight size={16} /></a>
          <button onClick={() => setOpen(o => !o)} aria-expanded={open} aria-label="Toggle menu" className="grid h-10 w-10 place-items-center rounded-full border border-white/20 lg:hidden">{open ? <X size={18} /> : <Menu size={18} />}</button>
        </div>
      </nav>
      <AnimatePresence>{open && <motion.ul initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="border-b border-white/10 bg-black/90 px-5 pb-5 backdrop-blur-xl lg:hidden">
        {links.map(l => <li key={l}><a onClick={() => setOpen(false)} href={`#${l.toLowerCase()}`} className="block border-b border-white/5 py-3 text-lg">{l}</a></li>)}</motion.ul>}</AnimatePresence>
    </header>)
}

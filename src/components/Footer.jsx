import Socials from './Socials'
export default function Footer() {
  return <footer className="border-t border-accent/30 py-10 shadow-[0_-20px_60px_-30px_#FF4528]"><div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-5 text-center">
    <div className="flex items-center gap-3"><span className="grid h-9 w-9 place-items-center rounded-lg border border-accent font-display font-extrabold text-accent">GK</span><span className="font-display text-lg font-bold tracking-wider">GHAZANFAR ALI KHAN</span></div>
    <p className="text-sm text-white/60">Building Digital Experiences. Exploring AI. Learning Cybersecurity.</p>
    <nav aria-label="Footer" className="flex flex-wrap justify-center gap-5 text-sm text-white/70">{['Home', 'About', 'Work', 'Skills', 'Experience', 'Contact'].map(l => <a key={l} href={`#${l.toLowerCase()}`} className="hover:text-accent">{l}</a>)}</nav>
    <Socials />
    <p className="text-xs text-white/40">© {new Date().getFullYear()} Ghazanfar Ali Khan</p></div></footer>
}

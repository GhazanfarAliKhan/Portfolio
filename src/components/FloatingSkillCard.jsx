import { ArrowUpRight } from 'lucide-react'
export default function FloatingSkillCard({ icon: Icon, title, text, className = '', delay = '0s' }) {
  return <div style={{ animationDelay: delay }} className={`glass absolute w-52 animate-float p-4 shadow-2xl ${className}`}>
    <div className="flex items-center justify-between"><Icon className="text-accent" size={22} /><ArrowUpRight className="text-accent" size={14} /></div>
    <p className="mt-2 font-semibold">{title}</p><p className="text-xs text-white/60">{text}</p></div>
}

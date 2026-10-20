import { site } from '../data/site'
// Uses site.portrait if set; otherwise an SVG silhouette stand-in (replace with your own image).
export default function CharacterPortrait() {
  const mask = { WebkitMaskImage: 'radial-gradient(closest-side, #000 60%, transparent 100%)', maskImage: 'radial-gradient(closest-side, #000 60%, transparent 100%)' }
  return site.portrait
    ? <img src={site.portrait} alt="Portrait of Ghazanfar Ali Khan" style={mask} className="relative h-full w-full object-contain" />
    : <svg role="img" aria-label="Placeholder developer silhouette with orange rim light" viewBox="0 0 400 480" className="relative h-full w-full" style={mask}>
        <defs><radialGradient id="rim" cx="70%" cy="30%"><stop offset="0" stopColor="#FF4528" stopOpacity=".9" /><stop offset="1" stopColor="#0a0a0a" /></radialGradient></defs>
        <path d="M60 480c0-90 60-130 140-130s140 40 140 130z" fill="url(#rim)" /><rect x="170" y="290" width="60" height="70" rx="20" fill="#1a1a1a" />
        <ellipse cx="200" cy="210" rx="78" ry="95" fill="#161616" stroke="#FF4528" strokeWidth="2" strokeOpacity=".7" />
        <path d="M120 190c0-70 40-100 90-95 50 4 75 40 70 95-20-40-60-50-100-45-30 3-50 20-60 45z" fill="#0c0c0c" stroke="#FF4528" strokeWidth="3" /></svg>
}

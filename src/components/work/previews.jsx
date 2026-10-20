// Lightweight, original SVG illustrations: abstract concept art for each project, NOT screenshots.
// No text or UI labels are drawn, so nothing implies features. Key content stays in the central ~70%
// of the artboard because the featured card crops the sides.
const A = '#FF4528', O = '#FF8A5B'
const lift = 'transition-transform duration-700 ease-out'

function Base({ id, glow = [300, 60], children }) {
  return (
    <svg viewBox="0 0 400 250" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full" aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id={`${id}-bg`} x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#1b1c20" /><stop offset="1" stopColor="#08080a" /></linearGradient>
        <radialGradient id={`${id}-gl`} cx={glow[0] / 400} cy={glow[1] / 250} r=".62"><stop offset="0" stopColor={A} stopOpacity=".4" /><stop offset="1" stopColor={A} stopOpacity="0" /></radialGradient>
        <pattern id={`${id}-gr`} width="20" height="20" patternUnits="userSpaceOnUse"><path d="M20 0H0V20" fill="none" stroke="#fff" strokeOpacity=".045" /></pattern>
        <linearGradient id={`${id}-ac`} x1="0" x2="1"><stop offset="0" stopColor={A} /><stop offset="1" stopColor={O} /></linearGradient>
      </defs>
      <rect width="400" height="250" fill={`url(#${id}-bg)`} /><rect width="400" height="250" fill={`url(#${id}-gr)`} /><rect width="400" height="250" fill={`url(#${id}-gl)`} />
      {children}
    </svg>
  )
}
const Star = ({ x, y, s = 1, o = 0.9 }) => <path transform={`translate(${x} ${y}) scale(${s})`} d="M0-9C1.2-3 3 -1.2 9 0 3 1.2 1.2 3 0 9-1.2 3-3 1.2-9 0-3-1.2-1.2-3 0-9Z" fill={O} opacity={o} />

// Layered browser windows with a hero block, portrait ring and card row.
function Portfolio() {
  const id = 'pf'
  return (
    <Base id={id} glow={[290, 80]}>
      <g className={`${lift} group-hover:-translate-y-2`}><rect x="96" y="30" width="228" height="150" rx="10" fill="#fff" fillOpacity=".03" stroke="#fff" strokeOpacity=".08" /></g>
      <g className={`${lift} group-hover:-translate-y-1`}><rect x="78" y="46" width="246" height="156" rx="11" fill="#fff" fillOpacity=".05" stroke="#fff" strokeOpacity=".12" /></g>
      <g className={`${lift} group-hover:translate-y-0.5`}>
        <rect x="58" y="62" width="284" height="170" rx="12" fill="#0d0d10" stroke={A} strokeOpacity=".5" />
        <path d="M58 86H342" stroke="#fff" strokeOpacity=".1" />
        <circle cx="74" cy="74" r="3" fill={A} /><circle cx="86" cy="74" r="3" fill="#fff" fillOpacity=".25" /><circle cx="98" cy="74" r="3" fill="#fff" fillOpacity=".25" />
        <rect x="224" y="71" width="24" height="5" rx="2.5" fill="#fff" fillOpacity=".18" /><rect x="254" y="71" width="24" height="5" rx="2.5" fill="#fff" fillOpacity=".18" /><rect x="284" y="71" width="40" height="5" rx="2.5" fill={`url(#${id}-ac)`} />
        <rect x="78" y="102" width="124" height="13" rx="6.5" fill={`url(#${id}-ac)`} /><rect x="78" y="122" width="92" height="13" rx="6.5" fill="#fff" fillOpacity=".22" />
        <rect x="78" y="146" width="136" height="5" rx="2.5" fill="#fff" fillOpacity=".12" /><rect x="78" y="156" width="108" height="5" rx="2.5" fill="#fff" fillOpacity=".12" />
        <rect x="78" y="170" width="54" height="16" rx="8" fill={`url(#${id}-ac)`} />
        <circle cx="282" cy="138" r="32" fill="#fff" fillOpacity=".04" stroke={A} strokeOpacity=".65" strokeWidth="1.5" /><circle cx="282" cy="130" r="11" fill="#fff" fillOpacity=".12" /><path d="M262 160Q282 140 302 160" fill="#fff" fillOpacity=".1" />
        {[78, 148, 218].map((x, i) => <g key={x}><rect x={x} y="198" width="62" height="24" rx="6" fill="#fff" fillOpacity=".05" stroke="#fff" strokeOpacity=".1" /><circle cx={x + 10} cy="210" r="4" fill={A} fillOpacity={0.9 - i * 0.2} /><rect x={x + 18} y="207" width="30" height="4" rx="2" fill="#fff" fillOpacity=".25" /><rect x={x + 18} y="214" width="20" height="3" rx="1.5" fill="#fff" fillOpacity=".12" /></g>)}
        <rect x="296" y="198" width="30" height="24" rx="6" fill="#fff" fillOpacity=".05" stroke={A} strokeOpacity=".4" />
      </g>
    </Base>
  )
}

// Records table beside a React -> Node -> database flow.
function Records() {
  const id = 'rc'
  return (
    <Base id={id} glow={[300, 190]}>
      <rect x="46" y="38" width="196" height="174" rx="10" fill="#fff" fillOpacity=".04" stroke="#fff" strokeOpacity=".12" />
      <rect x="58" y="50" width="172" height="14" rx="4" fill="#fff" fillOpacity=".1" />
      <g className={`${lift} group-hover:translate-x-1`}>
        {[0, 1, 2, 3, 4].map(i => { const y = 76 + i * 26; return <g key={i}><circle cx="70" cy={y + 8} r="7" fill="#fff" fillOpacity=".13" /><rect x="84" y={y + 2} width={60 - (i % 3) * 8} height="5" rx="2.5" fill="#fff" fillOpacity=".28" /><rect x="84" y={y + 11} width="38" height="4" rx="2" fill="#fff" fillOpacity=".11" /><rect x="176" y={y + 4} width="44" height="9" rx="4.5" fill={A} fillOpacity={i === 1 ? 0.55 : 0.22} /></g> })}
      </g>
      <path d="M242 125H274" stroke={A} strokeOpacity=".7" strokeDasharray="3 4" />
      <path d="M302 84V104M302 142V162" stroke={A} strokeOpacity=".7" strokeDasharray="3 4" />
      <g className={`${lift} group-hover:-translate-y-1`}>
        <rect x="276" y="50" width="52" height="36" rx="8" fill="#0d0d10" stroke={A} strokeOpacity=".7" />
        <ellipse cx="302" cy="68" rx="15" ry="6" fill="none" stroke={O} strokeOpacity=".9" /><ellipse cx="302" cy="68" rx="15" ry="6" fill="none" stroke={O} strokeOpacity=".9" transform="rotate(60 302 68)" /><ellipse cx="302" cy="68" rx="15" ry="6" fill="none" stroke={O} strokeOpacity=".9" transform="rotate(120 302 68)" /><circle cx="302" cy="68" r="2.5" fill={O} />
      </g>
      <rect x="276" y="106" width="52" height="36" rx="8" fill="#0d0d10" stroke="#fff" strokeOpacity=".3" />
      <path d="M302 114l12 7v8l-12 7-12-7v-8z" fill="none" stroke="#fff" strokeOpacity=".6" strokeWidth="1.5" />
      <g className={`${lift} group-hover:translate-y-1`}>
        <path d="M276 172v22c0 6 11.6 10 26 10s26-4 26-10v-22" fill="#0d0d10" stroke={A} strokeOpacity=".7" /><ellipse cx="302" cy="172" rx="26" ry="8" fill="#16110f" stroke={A} strokeOpacity=".8" />
        <path d="M276 183c0 6 11.6 10 26 10s26-4 26-10" fill="none" stroke={A} strokeOpacity=".35" />
      </g>
    </Base>
  )
}

// Hero scene with a building silhouette and a row of room-style cards.
function Hotel() {
  const id = 'ht'
  return (
    <Base id={id} glow={[300, 70]}>
      <rect x="46" y="34" width="308" height="112" rx="12" fill="#fff" fillOpacity=".04" stroke="#fff" strokeOpacity=".12" />
      <rect x="62" y="44" width="30" height="5" rx="2.5" fill="#fff" fillOpacity=".2" /><rect x="98" y="44" width="30" height="5" rx="2.5" fill="#fff" fillOpacity=".2" /><rect x="300" y="42" width="40" height="9" rx="4.5" fill={`url(#${id}-ac)`} />
      <circle cx="312" cy="84" r="16" fill={`url(#${id}-ac)`} fillOpacity=".85" />
      <g className={`${lift} group-hover:-translate-y-1.5`}>
        <rect x="108" y="86" width="46" height="60" fill="#0b0b0d" stroke="#fff" strokeOpacity=".16" /><rect x="158" y="64" width="58" height="82" fill="#0d0d10" stroke={A} strokeOpacity=".5" /><rect x="220" y="94" width="42" height="52" fill="#0b0b0d" stroke="#fff" strokeOpacity=".16" />
        {[0, 1, 2, 3].map(r => [0, 1, 2].map(c => <rect key={`${r}${c}`} x={166 + c * 17} y={72 + r * 17} width="9" height="9" rx="1.5" fill={A} fillOpacity={(r + c) % 3 === 0 ? 0.85 : 0.22} />))}
        {[0, 1].map(r => [0, 1, 2].map(c => <rect key={`a${r}${c}`} x={116 + c * 12} y={96 + r * 18} width="6" height="8" rx="1" fill="#fff" fillOpacity=".18" />))}
      </g>
      {[46, 158, 270].map((x, i) => <g key={x} className={`${lift} group-hover:translate-y-0.5`}><rect x={x} y="158" width="84" height="62" rx="8" fill="#fff" fillOpacity=".04" stroke="#fff" strokeOpacity=".1" /><rect x={x + 6} y="164" width="72" height="28" rx="5" fill={A} fillOpacity={0.14 + i * 0.06} /><rect x={x + 6} y="199" width="44" height="5" rx="2.5" fill="#fff" fillOpacity=".28" /><rect x={x + 6} y="208" width="28" height="4" rx="2" fill="#fff" fillOpacity=".12" /></g>)}
    </Base>
  )
}

// Plate with cutlery beside a menu-style list.
function Restaurant() {
  const id = 'rs'
  return (
    <Base id={id} glow={[130, 135]}>
      {[0, 1, 2, 3].map(i => <rect key={i} x={60 + i * 46} y="30" width="34" height="6" rx="3" fill={i === 0 ? A : '#fff'} fillOpacity={i === 0 ? 0.8 : 0.18} />)}
      <g className={`${lift} group-hover:rotate-6 [transform-box:fill-box] origin-center`}>
        <circle cx="128" cy="140" r="64" fill="#fff" fillOpacity=".03" stroke="#fff" strokeOpacity=".12" /><circle cx="128" cy="140" r="48" fill="#0d0d10" stroke={A} strokeOpacity=".55" /><circle cx="128" cy="140" r="30" fill="#fff" fillOpacity=".04" stroke="#fff" strokeOpacity=".1" />
        <circle cx="120" cy="136" r="9" fill={A} fillOpacity=".7" /><circle cx="138" cy="146" r="7" fill={O} fillOpacity=".6" /><circle cx="130" cy="126" r="5" fill="#fff" fillOpacity=".25" />
      </g>
      <path d="M52 100v34M47 100v14q0 6 5 6t5-6v-14M52 140v46" stroke="#fff" strokeOpacity=".4" strokeWidth="1.8" strokeLinecap="round" fill="none" />
      <path d="M204 100q9 8 9 28t-9 12v46" stroke="#fff" strokeOpacity=".4" strokeWidth="1.8" strokeLinecap="round" fill="none" />
      <rect x="232" y="66" width="86" height="11" rx="5.5" fill={`url(#${id}-ac)`} />
      <g className={`${lift} group-hover:translate-x-1`}>
        {[0, 1, 2, 3].map(i => { const y = 96 + i * 34; return <g key={i}><rect x="232" y={y} width={64 - (i % 2) * 14} height="6" rx="3" fill="#fff" fillOpacity=".3" /><path d={`M${232 + 70 - (i % 2) * 14} ${y + 3}H340`} stroke="#fff" strokeOpacity=".2" strokeDasharray="1 4" /><rect x="344" y={y} width="16" height="6" rx="3" fill={A} fillOpacity=".7" /><rect x="232" y={y + 13} width="92" height="4" rx="2" fill="#fff" fillOpacity=".1" /></g> })}
      </g>
    </Base>
  )
}

// Network topology (router, switches, hosts), a shield, and a packet-capture strip.
function NetLab() {
  const id = 'nl', bars = [8, 14, 6, 18, 10, 16, 7, 12, 20, 9, 15, 6, 13, 17, 8, 11, 19, 7, 14, 10, 16, 6, 12, 18, 9, 13, 7, 15]
  const links = ['M200 66L120 124', 'M200 66L280 124', 'M120 124L74 180', 'M120 124L156 180', 'M280 124L244 180', 'M280 124L326 180']
  return (
    <Base id={id} glow={[200, 80]}>
      {links.map(d => <path key={d} d={d} stroke={A} strokeOpacity=".6" strokeWidth="1.5" className="net-flow" fill="none" />)}
      <g className={`${lift} group-hover:-translate-y-1`}>
        <circle cx="200" cy="56" r="22" fill="#0d0d10" stroke={A} strokeWidth="1.6" /><path d="M200 44v24M188 56h24M194 50l-4 6 4 6M206 50l4 6-4 6" stroke={O} strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </g>
      {[120, 280].map(x => <g key={x}><rect x={x - 22} y="114" width="44" height="22" rx="6" fill="#0d0d10" stroke="#fff" strokeOpacity=".35" />{[0, 1, 2, 3].map(i => <rect key={i} x={x - 15 + i * 9} y="122" width="5" height="6" rx="1" fill={A} fillOpacity=".8" />)}</g>)}
      {[74, 156, 244, 326].map((x, i) => <g key={x} className={`${lift} group-hover:translate-y-1`}><rect x={x - 17} y="176" width="34" height="22" rx="4" fill="#0d0d10" stroke="#fff" strokeOpacity=".3" /><rect x={x - 13} y="180" width="26" height="14" rx="2" fill={A} fillOpacity={0.12 + (i % 2) * 0.12} /><path d={`M${x - 8} 204h16`} stroke="#fff" strokeOpacity=".3" strokeLinecap="round" /></g>)}
      <path d="M352 36l24 8v18c0 14-10 22-24 28-14-6-24-14-24-28V44z" transform="translate(-26 -8)" fill={A} fillOpacity=".1" stroke={A} strokeOpacity=".8" /><path d="M318 62l5 5 10-11" transform="translate(-1 -6)" stroke={O} strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      {bars.map((h, i) => <rect key={i} x={60 + i * 10.6} y={238 - h} width="6" height={h} rx="1.5" fill={i % 5 === 0 ? A : '#fff'} fillOpacity={i % 5 === 0 ? 0.75 : 0.2} />)}
    </Base>
  )
}

// Prompt bar, generated-scene frame with play button, and an edit timeline.
function AdGen() {
  const id = 'ad'
  return (
    <Base id={id} glow={[200, 120]}>
      <rect x="70" y="26" width="260" height="22" rx="11" fill="#fff" fillOpacity=".04" stroke="#fff" strokeOpacity=".16" />
      <Star x={86} y={37} s={0.7} /><rect x="102" y="34" width="120" height="5" rx="2.5" fill="#fff" fillOpacity=".3" /><rect x="102" y="42" width="70" height="3" rx="1.5" fill="#fff" fillOpacity=".12" /><rect x="228" y="31" width="2" height="12" rx="1" fill={A} />
      <g className={`${lift} group-hover:-translate-y-1`}>
        <rect x="70" y="62" width="260" height="124" rx="10" fill="#150d0b" stroke={A} strokeOpacity=".45" />
        <circle cx="270" cy="96" r="26" fill={`url(#${id}-ac)`} fillOpacity=".55" />
        <path d="M70 168Q140 120 210 150T330 130V186H70Z" fill="#fff" fillOpacity=".05" /><path d="M70 176Q150 140 220 164T330 150" fill="none" stroke="#fff" strokeOpacity=".12" />
        <path d="M120 62L96 186M150 62L126 186" stroke="#fff" strokeOpacity=".05" strokeWidth="14" />
        <circle cx="200" cy="124" r="22" fill="#0b0b0d" fillOpacity=".72" stroke="#fff" strokeOpacity=".4" /><path d="M194 113l17 11-17 11z" fill={`url(#${id}-ac)`} />
      </g>
      <rect x="70" y="198" width="260" height="26" rx="6" fill="#fff" fillOpacity=".04" stroke="#fff" strokeOpacity=".1" />
      {[[74, 66, 0.55], [144, 46, 0.2], [194, 84, 0.35], [282, 44, 0.2]].map(([x, w, o], i) => <rect key={i} x={x} y="202" width={w} height="18" rx="4" fill={i === 0 ? A : '#fff'} fillOpacity={o} />)}
      <path d="M176 194V228" stroke={A} strokeWidth="1.5" /><circle cx="176" cy="194" r="3.5" fill={A} />
      <Star x={338} y={70} s={1} /><Star x={52} y={112} s={0.7} o={0.6} /><Star x={348} y={166} s={0.8} o={0.7} />
    </Base>
  )
}

export const previews = { portfolio: Portfolio, records: Records, hotel: Hotel, restaurant: Restaurant, netlab: NetLab, adgen: AdGen }
// Fallback by category if a project has no `preview` key
export const previewByCat = { Frontend: 'portfolio', 'Full Stack': 'records', Cybersecurity: 'netlab', AI: 'adgen' }

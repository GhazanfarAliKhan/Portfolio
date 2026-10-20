import { Code2, Server, Network, Brain, ShieldCheck, FileCode2, Palette, Braces, Atom, Database, DatabaseZap,
  MonitorSmartphone, LayoutGrid, Wind, Plug, KeyRound, Globe, Binary, Router, Waypoints, MonitorCog, Layers,
  MessageSquareText, ImagePlus, Clapperboard, Megaphone, Workflow, Bug, SquareTerminal, ShieldHalf, ScanSearch,
  Activity, FlaskConical, Terminal } from 'lucide-react'

// Icon for each skill key used in src/data/site.js
export const skillIcons = {
  html: FileCode2, css: Palette, js: Braces, react: Atom, bootstrap: LayoutGrid, tailwind: Wind, responsive: MonitorSmartphone,
  node: Server, express: Terminal, api: Plug, auth: KeyRound, mongo: Database, dbint: DatabaseZap,
  osi: Layers, ip: Globe, subnet: Binary, routing: Router, vlan: Waypoints, tracer: MonitorCog,
  prompt: MessageSquareText, image: ImagePlus, video: Clapperboard, ads: Megaphone, workflow: Workflow,
  shield: ShieldCheck, hack: Bug, kali: SquareTerminal, netsec: ShieldHalf, vuln: ScanSearch, wireshark: Activity, lab: FlaskConical,
}
// Category icons, in the same order as the keys of `skills`
export const categoryIcons = [Code2, Server, Network, Brain, ShieldCheck]

import { projects } from '../../data/site'

// Qualitative stages taken from your own labels. They are not scores or percentages.
export const LEVELS = {
  Learning: { n: 1, meaning: 'Building foundations through structured study.' },
  Practicing: { n: 2, meaning: 'Applying it in hands-on exercises and small projects.' },
  Proficient: { n: 3, meaning: 'Comfortable working with it independently.' },
}
export const splitName = name => { const m = name.match(/^(.*?)\s*\((.*)\)$/); return m ? [m[1], m[2]] : [name, ''] }

const norm = s => s.toLowerCase().replace(/\.js\b/g, '').replace(/[^a-z]/g, '')
const match = (a, b) => a === b || (Math.min(a.length, b.length) >= 5 && (a.startsWith(b) || b.startsWith(a) || a.endsWith(b) || b.endsWith(a)))
// Projects from site.js whose tech stack lists this skill (real data only).
export const projectsUsing = name => { const n = norm(name); return projects.filter(p => p.stack.some(s => match(n, norm(s)))).map(p => p.title) }

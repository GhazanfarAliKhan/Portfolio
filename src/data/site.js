// EDIT ME: everything personal lives here. Empty strings = feature hidden/disabled.
export const site = {
  name: 'Ghazanfar Ali Khan', title: 'Full Stack Developer & Cyber Security Enthusiast', email: 'ghazanfaralikhan62@gmail.com',
  // Replace each YOUR_*_URL with your real profile URL (https://...). Placeholders stay inactive until replaced.
  socials: [['GitHub', 'https://github.com/GhazanfarAliKhan'], ['Facebook', 'https://www.facebook.com/share/19e5zNXpdx/'], ['Instagram', 'https://www.instagram.com/ghazankhan_1?igsi=M2VreXAyYjlwZHpj'], ['LinkedIn', 'https://www.linkedin.com/in/ghazanfar-ali-khan-5b7500422?utm_source=share_via&utm_content=profile&utm_medium=member_android']],
  resume: '',            // e.g. '/resume.pdf' (put the file in /public)
  portrait: 'my pic 6.jpg',          // e.g. '/portrait.png' (transparent PNG in /public)
  formEndpoint: '/api/contact',   // the backend in server/ (emails you). Use a full https URL if the API is hosted elsewhere. Empty = form reports "not configured"
}
// About section copy. {braces} mark words that get the orange gradient. The second headline part is highlighted.
export const about = {
  headline: ['More than code.', 'A mindset.'],
  lead: `I am ${site.name}, a {full stack developer} and {AI enthusiast}.`,
  body: 'I enjoy building practical projects, experimenting with new tools, and creating useful, secure, and modern digital experiences.',
  interestsLabel: 'Areas of interest and learning',
  // [icon key, title, description]: interests and learning paths, not claims of professional expertise
  interests: [
    ['web', 'Web development', 'Frontend and backend projects'],
    ['ai', 'Artificial intelligence', 'Creative AI workflows'],
    ['net', 'Computer networking', 'CCNA learning path'],
    ['sec', 'Cybersecurity', 'CEH learning path'],
  ],
}
// SAMPLE placeholder numbers: replace with your real ones, then set placeholder:false
export const stats = { placeholder: true, items: [
  ['10+', 'Projects completed'], ['2+', 'Years experience'], ['5+', 'Technologies'], ['100%', 'Dedication'] ] }
export const tech = [['React', '#61DAFB', 'Practicing'], ['Node.js', '#5FA04E', 'Practicing'], ['MongoDB', '#47A248', 'Learning'], ['TypeScript', '#3178C6', 'Learning'], ['Tailwind CSS', '#38BDF8', 'Practicing']]
// Each skill: [name, level, short description, icon key]. Levels are your own stages
// (Learning / Practicing / Proficient): no percentages or certifications are implied.
export const skills = {
  Frontend: [
    ['HTML5', 'Proficient', 'Semantic, accessible page structure.', 'html'],
    ['CSS3', 'Proficient', 'Layout, styling and responsive design.', 'css'],
    ['JavaScript', 'Practicing', 'Interactive behavior and application logic.', 'js'],
    ['React.js', 'Practicing', 'Component-based interfaces and state.', 'react'],
    ['Bootstrap', 'Practicing', 'Responsive layouts from ready-made components.', 'bootstrap'],
    ['Tailwind CSS', 'Practicing', 'Utility-first styling for custom interfaces.', 'tailwind'],
    ['Responsive Web Design', 'Practicing', 'Layouts that adapt from phones to desktops.', 'responsive'],
  ],
  Backend: [
    ['Node.js', 'Practicing', 'JavaScript runtime for server-side applications.', 'node'],
    ['Express.js', 'Practicing', 'Routing and middleware for web servers and APIs.', 'express'],
    ['REST APIs', 'Practicing', 'Endpoints that let clients read and write data.', 'api'],
    ['Authentication Fundamentals', 'Learning', 'Sign-in flows, sessions and protected routes.', 'auth'],
    ['MongoDB', 'Learning', 'Document database for storing application data.', 'mongo'],
    ['Database Integration', 'Learning', 'Connecting application code to a database.', 'dbint'],
  ],
  'Networking (CCNA path)': [
    ['OSI and TCP/IP Models', 'Learning', 'How data moves through the network layers.', 'osi'],
    ['IPv4 and IPv6 Addressing', 'Learning', 'How devices are identified on a network.', 'ip'],
    ['Subnetting', 'Learning', 'Dividing networks into efficient address ranges.', 'subnet'],
    ['Routing and Switching', 'Learning', 'How packets are forwarded between and within networks.', 'routing'],
    ['VLANs and NAT', 'Learning', 'Segmenting networks and translating addresses.', 'vlan'],
    ['Cisco Packet Tracer', 'Practicing', 'Simulating network topologies and configurations.', 'tracer'],
  ],
  AI: [
    ['Prompt Engineering', 'Practicing', 'Writing clear instructions that guide AI models.', 'prompt'],
    ['AI Image Generation', 'Practicing', 'Creating visuals with generative image models.', 'image'],
    ['AI Video Generation', 'Practicing', 'Producing short video with generative tools.', 'video'],
    ['AI Advertisement Creation', 'Practicing', 'Turning AI visuals and copy into ad concepts.', 'ads'],
    ['AI-Assisted Creative Workflows', 'Practicing', 'Using AI tools across the creative process.', 'workflow'],
  ],
  'Cybersecurity (CEH path)': [
    ['Cybersecurity Fundamentals', 'Learning', 'Core ideas for protecting systems and data.', 'shield'],
    ['Ethical Hacking Fundamentals', 'Learning', 'Authorized methods for finding weaknesses.', 'hack'],
    ['Kali Linux', 'Learning', 'Security-focused Linux distribution and toolset.', 'kali'],
    ['Network Security', 'Learning', 'Defending networks and the traffic crossing them.', 'netsec'],
    ['Vulnerability Assessment', 'Learning', 'Identifying and prioritizing known weaknesses.', 'vuln'],
    ['Wireshark', 'Practicing', 'Capturing and inspecting network traffic.', 'wireshark'],
    ['Security Testing in Authorized Labs', 'Learning', 'Hands-on testing in permitted, controlled environments.', 'lab'],
  ],
}
// One line per path, shown in the Skills section. Keys must match the skills keys above.
export const skillBlurbs = {
  Frontend: 'Building responsive, accessible interfaces.',
  Backend: 'The servers, APIs and data behind the interface.',
  'Networking (CCNA path)': 'Studying CCNA topics with hands-on labs. Not certified.',
  AI: 'Prompting and generative tools for creative work.',
  'Cybersecurity (CEH path)': 'Fundamentals and authorized lab practice. Not certified.',
}
// Set live/github to real URLs to show the buttons. inProgress shows a badge.
// `featured` gives a project the large showcase treatment; `preview` picks its illustration
// (src/components/work/previews.jsx). Leave live/github empty until you have real URLs.
export const projects = [
  { title: 'Personal Portfolio Website', cat: 'Frontend', desc: 'Responsive personal branding website.', stack: ['React', 'Tailwind'], live: '', github: '', inProgress: true, featured: true, preview: 'portfolio' },
  { title: 'Student Management System', cat: 'Full Stack', desc: 'Student records and management interface.', stack: ['React', 'Node.js', 'MongoDB'], live: '', github: '', preview: 'records' },
  { title: 'Hotel Management Website', cat: 'Frontend', desc: 'Modern hotel website with interactive sections.', stack: ['HTML', 'CSS', 'JavaScript'], live: '', github: '', preview: 'hotel' },
  { title: 'Restaurant Website', cat: 'Frontend', desc: 'Menu, navigation, and interactive UI.', stack: ['HTML', 'CSS', 'JavaScript'], live: '', github: '', preview: 'restaurant' },
  { title: 'Network Security Lab', cat: 'Cybersecurity', desc: 'Networking and cybersecurity practice environment.', stack: ['Packet Tracer', 'Kali Linux', 'Wireshark'], live: '', github: '', inProgress: true, preview: 'netlab' },
  { title: 'AI Advertisement Project', cat: 'AI', desc: 'AI-assisted creative advertising and visual storytelling.', stack: ['Prompt Engineering', 'AI Video'], live: '', github: '', preview: 'adgen' },
]
// Each entry: [title, description, when, status, tags, kind, related skills category (key of `skills`, or null)].
// These are studies and learning paths, not employment: `kind` labels them honestly in the UI.
export const experience = [
  ["Bachelor's Degree in Cybersecurity", 'Core coursework in security, systems and networks.', 'Ongoing', 'In progress', ['Security', 'Networks'], 'Education', null],
  ['Frontend Development', 'Building responsive interfaces and small projects.', 'Ongoing', 'Practicing', ['HTML', 'CSS', 'React'], 'Learning path', 'Frontend'],
  ['Backend Development', 'APIs, authentication basics and databases.', 'Ongoing', 'Learning', ['Node.js', 'Express', 'MongoDB'], 'Learning path', 'Backend'],
  ['CCNA Networking Studies', 'Working through CCNA topics with Packet Tracer labs.', 'Ongoing', 'Studying (not certified)', ['Subnetting', 'VLANs'], 'Certification path', 'Networking (CCNA path)'],
  ['Artificial Intelligence Learning', 'Prompting and AI-assisted image, video and ad creation.', 'Ongoing', 'Practicing', ['Prompting', 'Generative AI'], 'Learning path', 'AI'],
  ['CEH and Ethical Hacking Path', 'Fundamentals and authorized lab practice.', 'Ongoing', 'Studying (not certified)', ['Kali', 'Wireshark'], 'Certification path', 'Cybersecurity (CEH path)'],
]
// A usable external link: a parseable http(s) URL with a host. Rejects placeholders, javascript:, data:, ftp:, etc.
export const isReal = u => { try { const x = new URL(u); return (x.protocol === 'https:' || x.protocol === 'http:') && !!x.hostname } catch { return false } }
// A safe form endpoint: a same-site path like /api/contact, or https (http only on localhost for development)
export const isSafeEndpoint = u => {
  if (typeof u !== 'string') return false
  if (/^\/(?![/\\])[^\s\\]*$/.test(u)) return true
  try { const x = new URL(u); return x.protocol === 'https:' || (x.protocol === 'http:' && ['localhost', '127.0.0.1'].includes(x.hostname)) } catch { return false }
}

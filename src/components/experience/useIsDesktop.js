import { useEffect, useState } from 'react'

// True at the lg breakpoint (1024px), when the timeline switches to alternating sides.
export default function useIsDesktop() {
  const [d, setD] = useState(false)
  useEffect(() => {
    const m = window.matchMedia('(min-width: 1024px)'), f = () => setD(m.matches)
    f(); m.addEventListener('change', f); return () => m.removeEventListener('change', f)
  }, [])
  return d
}

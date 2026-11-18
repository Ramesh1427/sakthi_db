import { useEffect, useRef, useState } from 'react'

const reduced = () => window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

function useInView(threshold = 0.15) {
  const ref = useRef(null)
  const [seen, setSeen] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el || !('IntersectionObserver' in window)) { setSeen(true); return }
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setSeen(true); io.disconnect() } }, { threshold })
    io.observe(el)
    return () => io.disconnect()
  }, [threshold])
  return [ref, seen]
}

/** Fades and lifts its children into view once, when scrolled to. */
export function Reveal({ as: Tag = 'div', delay = 0, className = '', children, ...rest }) {
  const [ref, seen] = useInView()
  return <Tag ref={ref} className={`reveal ${seen ? 'in' : ''} ${className}`} style={{ '--d': `${Math.min(delay, 400)}ms` }} {...rest}>{children}</Tag>
}

/** Counts from 0 up to `to` when scrolled into view. */
export function CountUp({ to }) {
  const [ref, seen] = useInView(0.4)
  const [n, setN] = useState(0)
  useEffect(() => {
    if (!seen) return
    if (reduced()) { setN(to); return }
    let raf; const t0 = performance.now(), dur = 1200
    const tick = t => {
      const p = Math.min(1, (t - t0) / dur)
      setN(Math.round(to * (1 - Math.pow(1 - p, 3))))
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [seen, to])
  return <span ref={ref}>{n}</span>
}

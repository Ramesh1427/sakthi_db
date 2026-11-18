import { useEffect, useState } from 'react'

const A = '#8b5cf6'
function DbArt() {
  return (
    <svg viewBox="0 0 320 300" role="img" aria-label="Stacked database illustration">
      <g fill="none" stroke={A} strokeWidth="3">
        {[190, 120, 50].map(y => (
          <g key={y}><ellipse cx="160" cy={y} rx="90" ry="26" fill="#ffffff14" /><path d={`M70 ${y}v44c0 14 40 26 90 26s90-12 90-26v-44`} /></g>
        ))}
        <g strokeDasharray="5 6" stroke="#ffffff66"><path d="M250 120h42M70 190H28M250 50l36-20M70 120l-36-22" /></g>
      </g>
      {[[296, 120], [24, 190], [290, 28], [28, 94]].map(([x, y]) => <circle key={x + y} cx={x} cy={y} r="8" fill={A} />)}
    </svg>
  )
}
function CodeArt() {
  const rows = [[24, 120], [44, 190], [44, 150], [64, 170], [24, 100], [44, 200]]
  return (
    <svg viewBox="0 0 320 300" role="img" aria-label="Code editor illustration">
      <rect x="20" y="30" width="250" height="190" rx="14" fill="#ffffff12" stroke="#ffffff44" strokeWidth="2" />
      <circle cx="42" cy="52" r="5" fill="#e5655a" /><circle cx="60" cy="52" r="5" fill={A} /><circle cx="78" cy="52" r="5" fill="#4cc38a" />
      {rows.map(([x, w], i) => <rect key={i} x={36 + x} y={80 + i * 22} width={w} height="9" rx="4.5" fill={i % 3 === 0 ? A : '#ffffff55'} />)}
      <g stroke={A} strokeWidth="2" fill="none"><path d="M230 250l30-26M260 224l36 18M260 224l-8-40" /></g>
      {[[230, 250], [260, 224], [296, 242], [252, 184]].map(([x, y]) => <circle key={x} cx={x} cy={y} r="9" fill="#0a0a24" stroke={A} strokeWidth="3" />)}
    </svg>
  )
}
function TermArt() {
  return (
    <svg viewBox="0 0 320 300" role="img" aria-label="Terminal illustration">
      <rect x="30" y="40" width="260" height="200" rx="14" fill="#ffffff12" stroke="#ffffff44" strokeWidth="2" />
      <path d="M52 86l22 16-22 16" stroke={A} strokeWidth="4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="88" y="108" width="70" height="8" rx="4" fill={A} />
      {[130, 154, 178].map((y, i) => <rect key={y} x="52" y={y + 8} width={170 - i * 30} height="8" rx="4" fill="#ffffff55" />)}
      <rect x="52" y="208" width="14" height="18" fill={A} className="blink" />
    </svg>
  )
}

const ARTS = { db: DbArt, code: CodeArt, terminal: TermArt }
const DEFAULT = [
  { title: 'Start your career in database administration', text: 'Learn Oracle DBA step by step, from architecture to backup and recovery.', button_text: 'View courses', button_link: '#courses', art: 'db' },
  { title: 'Learn Python and put AI to work', text: 'Python programming and AI, taught through practice instead of theory alone.', button_text: 'Watch a demo', button_link: '#videos', art: 'code' },
  { title: 'Practice in labs, not just slides', text: 'Follow guided lab exercises and revise with interview questions and answers.', button_text: 'See the labs', button_link: '#labs', art: 'terminal' },
]
const Chev = ({ flip }) => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={flip ? { transform: 'scaleX(-1)' } : undefined}><path d="M9 5l7 7-7 7" /></svg>

export default function Hero({ slides }) {
  const list = slides?.length ? slides : DEFAULT
  const [i, setI] = useState(0)
  const [paused, setPaused] = useState(false)
  const n = list.length
  const go = k => setI(((k % n) + n) % n)
  useEffect(() => {
    if (paused || n < 2) return
    const t = setTimeout(() => go(i + 1), 6500)
    return () => clearTimeout(t)
  }, [i, paused, n])
  const s = list[i % n]
  const Art = ARTS[s.art] || DbArt
  return (
    <section className="hero" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
      <div className="hero-in">
        <button className="arrow" aria-label="Previous slide" onClick={() => go(i - 1)}><Chev flip /></button>
        <div className="slide" key={`${i}-${s.title}`} aria-live="polite">
          <div className="slide-text">
            <h1>{s.title}</h1>
            <p>{s.text}</p>
            <a className="btn outline" href={s.button_link}>{s.button_text}</a>
          </div>
          <div className="art"><Art /></div>
        </div>
        <button className="arrow" aria-label="Next slide" onClick={() => go(i + 1)}><Chev /></button>
      </div>
      <div className="dots">{list.map((_, k) => <button key={k} aria-label={`Slide ${k + 1}`} className={k === i % n ? 'on' : ''} onClick={() => go(k)} />)}</div>
    </section>
  )
}

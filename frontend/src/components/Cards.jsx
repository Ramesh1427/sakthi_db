import { ytId, fmt } from '../util.js'
import { Icon } from './Icons.jsx'

// Same card markup the public website uses, shown under each row in the admin dashboard.
const GRADS = ['linear-gradient(135deg,#f5a31a,#e8590c)', 'linear-gradient(135deg,#3b82f6,#1e3a8a)', 'linear-gradient(135deg,#10b981,#065f46)', 'linear-gradient(135deg,#8b5cf6,#4c1d95)']
export const gradFor = (s = '') => GRADS[[...s].reduce((a, c) => a + c.charCodeAt(0), 0) % GRADS.length]

export function CourseCard({ c, onOpen }) {
  const tags = c.tag_list || (c.tags || '').split(',').map(t => t.trim()).filter(Boolean)
  return (
    <div className="card course">
      <div className="band" style={{ background: gradFor(c.category || '') }}><Icon name="db" size={34} /><span>{c.category}</span></div>
      <div className="pad">
        <h3>{c.name}</h3><p>{c.description}</p>
        <div>{tags.map(t => <span className="tag" key={t}>{t}</span>)}</div>
        <button type="button" className="btn sm" onClick={onOpen}>View syllabus</button>
      </div>
    </div>
  )
}

export function VideoCard({ v, onOpen }) {
  const id = ytId(v.youtube_url)
  return (
    <div className="card video" role="button" tabIndex={0} onClick={onOpen} onKeyDown={e => e.key === 'Enter' && onOpen?.()}>
      <div className="thumb" style={id ? { backgroundImage: `url(https://img.youtube.com/vi/${id}/hqdefault.jpg)` } : undefined}>
        <span className="play" aria-hidden="true"><svg width="22" height="22" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" fill="currentColor" /></svg></span>
      </div>
      <div className="pad"><h3>{v.title}</h3><p>{v.description}</p></div>
    </div>
  )
}

export const LabCard = ({ l, onOpen }) => <div className="card lab" role="button" tabIndex={0} onClick={onOpen} onKeyDown={e => e.key === 'Enter' && onOpen?.()}><div className="pad"><h3>{l.title}</h3><p>{l.description}</p></div></div>

export const QARow = ({ q, onOpen }) => <div className="qa-row" role="button" tabIndex={0} onClick={onOpen} onKeyDown={e => e.key === 'Enter' && onOpen?.()}><span>{q.question}</span><span className="qa-go">View answer</span></div>

export function BlogCard({ b, onOpen }) {
  const text = b.content || ''
  return (
    <div className="card blog"><div className="pad"><small>{fmt(b.created || new Date())}</small><h3>{b.title}</h3>
      <p>{text.length > 110 ? text.slice(0, 110).trim() + '…' : text}</p>
      <button type="button" className="btn sm" onClick={onOpen}>Read post</button></div></div>
  )
}

/** Syllabus under a course card: modules and topics, same look as the website popup. */
export function Syllabus({ modules }) {
  if (!modules?.length) return <p className="muted">No syllabus yet. Press “Syllabus &amp; videos” to add it.</p>
  return (
    <div className="syl-under">
      {modules.map((m, i) => (
        <div key={m.id ?? i}>
          <h3>{m.title}</h3>
          <ul className="topics">
            {m.topics.map((t, j) => (
              <li key={t.id ?? j}><span>{t.title}{t.is_free_preview && <em className="tag free">Free preview</em>}</span>
                {(t.video_url || t.has_video) ? <span className="muted">Video added</span> : <span className="muted">No video yet</span>}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  )
}

export function TechCard({ t }) {
  return (
    <div className="card tech">
      <div className="band" style={{ background: gradFor(t.name || '') }}><Icon name="db" size={34} /><span>{t.name}</span></div>
      <div className="pad"><h3>{t.name}</h3><p>Shown as a tab on the website. Tab order: {t.order ?? 0}.</p></div>
    </div>
  )
}

export const cardFor = { technologies: TechCard, courses: CourseCard, videos: VideoCard, labs: LabCard, interview: QARow, blogs: BlogCard }
const prop = { technologies: 't', courses: 'c', videos: 'v', labs: 'l', interview: 'q', blogs: 'b' }
export const propFor = s => prop[s]

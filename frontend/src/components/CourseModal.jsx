import { useEffect } from 'react'
import { Link } from 'react-router-dom'

const Lock = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="5" y="11" width="14" height="10" rx="2" /><path d="M8 11V8a4 4 0 0 1 8 0v3" /></svg>

export default function CourseModal({ course, user, onClose, onPlay, paused }) {
  useEffect(() => {
    const onKey = e => e.key === 'Escape' && !paused && onClose()
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose, paused])
  if (!course) return null
  return (
    <div className="modal" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="box" role="dialog" aria-modal="true">
        <button className="btn ghost sm close" onClick={onClose}>Close</button>
        <small>{course.category}</small>
        <h2>{course.name}</h2>
        <p>{course.description}</p>
        {course.tag_list.map(t => <span className="tag" key={t}>{t}</span>)}

        {course.has_access
          ? <p className="banner ok">Video access is unlocked for you. Press Watch on any topic.</p>
          : user
            ? <p className="banner">You can see the syllabus. The admin has not unlocked the videos for this course yet.</p>
            : <p className="banner">Syllabus preview. <Link to="/login">Log in</Link> to watch the videos if the admin has given you access.</p>}

        {course.modules.length === 0 && <p className="muted">Syllabus coming soon.</p>}
        {course.modules.map(m => (
          <div key={m.id}>
            <h3>{m.title}</h3>
            <ul className="topics">
              {m.topics.map(t => (
                <li key={t.id}>
                  <span>{t.title}{t.is_free_preview && !course.has_access && t.video_url && <em className="tag free">Free preview</em>}</span>
                  {t.video_url
                    ? <button className="btn sm" onClick={() => onPlay({ title: t.title, url: t.video_url })}>▶ Watch</button>
                    : t.has_video
                      ? <span className="lock"><Lock /> Locked</span>
                      : <span className="muted">No video yet</span>}
                </li>
              ))}
            </ul>
          </div>
        ))}
        {!user && <a className="btn" href="#contact" onClick={onClose}>Enquire about this course</a>}
      </div>
    </div>
  )
}

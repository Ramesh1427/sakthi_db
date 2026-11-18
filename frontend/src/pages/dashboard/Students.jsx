import { useEffect, useState } from 'react'
import { api } from '../../api.js'
import { fmt } from '../../util.js'
import { gradFor } from '../../components/Cards.jsx'
import { Icon } from '../../components/Icons.jsx'

export default function Students() {
  const [students, setStudents] = useState(null)
  const [courses, setCourses] = useState([])
  const [err, setErr] = useState('')

  const load = () => Promise.all([api('/students/'), api('/courses/')])
    .then(([s, c]) => { setStudents(s); setCourses(c) }).catch(e => setErr(e.message))
  useEffect(() => { load() }, [])

  const toggle = async (st, cid) => {
    const ids = st.course_ids.includes(cid) ? st.course_ids.filter(x => x !== cid) : [...st.course_ids, cid]
    setStudents(list => list.map(s => (s.id === st.id ? { ...s, course_ids: ids } : s)))
    setErr('')
    try { await api(`/students/${st.id}/access/`, { method: 'PUT', body: { course_ids: ids } }) }
    catch (e) { setErr(e.message); load() }
  }
  const remove = async st => {
    if (!window.confirm(`Delete student “${st.username}”? They will lose their account.`)) return
    try { await api(`/students/${st.id}/`, { method: 'DELETE' }); load() } catch (e) { setErr(e.message) }
  }

  return (
    <>
      <h1>Students</h1>
      <p className="muted">Tick a course to unlock its topic videos for that student. Students without access see the syllabus only.</p>
      {err && <p className="error">{err}</p>}
      {!students ? <p>Loading…</p> : (
        <div className="list cards3 stretch">
          {students.length === 0 && <p>No students yet. They appear here after they create an account on the website.</p>}
          {students.map(st => (
            <div className="card person" key={st.id}>
              <div className="band slim" style={{ background: gradFor(st.username) }}><span className="avatar">{(st.username || '?')[0].toUpperCase()}</span><span>{st.username}</span></div>
              <div className="pad">
                <p className="meta">{st.email || 'No email'}</p>
                <small>Joined {fmt(st.joined)}</small>
                <div className="access">
                  {courses.length === 0 && <small>Add a course first.</small>}
                  {courses.map(c => (
                    <label className="check" key={c.id}>
                      <input type="checkbox" checked={st.course_ids.includes(c.id)} onChange={() => toggle(st, c.id)} /> {c.name}
                    </label>
                  ))}
                </div>
                <span className="actions card-actions"><button className="btn red icon" title="Delete" aria-label="Delete" onClick={() => remove(st)}><Icon name="trash" size={16} stroke={2} /></button></span>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  )
}

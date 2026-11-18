import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { api } from '../../api.js'
import { Icon } from '../../components/Icons.jsx'
import { CourseCard, Syllabus } from '../../components/Cards.jsx'

const move = (arr, i, d) => {
  const j = i + d
  if (j < 0 || j >= arr.length) return arr
  const a = [...arr]; [a[i], a[j]] = [a[j], a[i]]; return a
}
const newTopic = () => ({ title: '', video_url: '', is_free_preview: false })

export default function CurriculumEditor() {
  const { id } = useParams()
  const [course, setCourse] = useState(null)
  const [mods, setMods] = useState([])
  const [msg, setMsg] = useState('')
  const [err, setErr] = useState('')
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    api(`/courses/${id}/`).then(c => {
      setCourse(c)
      setMods(c.modules.map(m => ({ title: m.title, topics: m.topics.map(t => ({ title: t.title, video_url: t.video_url || '', is_free_preview: t.is_free_preview })) })))
    }).catch(e => setErr(e.message))
  }, [id])

  const dirty = () => setMsg('')
  const setMod = (i, fn) => { dirty(); setMods(ms => ms.map((m, k) => (k === i ? fn(m) : m))) }
  const setTopic = (i, j, patch) => setMod(i, m => ({ ...m, topics: m.topics.map((t, k) => (k === j ? { ...t, ...patch } : t)) }))

  const save = async () => {
    setBusy(true); setErr(''); setMsg('')
    try { await api(`/courses/${id}/curriculum/`, { method: 'PUT', body: { modules: mods } }); setMsg('Syllabus and videos saved.') }
    catch (e) { setErr(e.message) } finally { setBusy(false) }
  }

  if (!course) return err ? <p className="error">{err}</p> : <p>Loading…</p>
  return (
    <>
      <p><Link to="/dashboard/courses">← Back to courses</Link></p>
      <h1>{course.name}</h1>
      <p className="muted">Add modules (for example “Python Basics”, “Loops and Functions”). Inside each module add topics and paste a YouTube link for the topic’s video. Use Unlisted videos on YouTube so links are not public.</p>
      {msg && <p className="note">{msg}</p>}
      {err && <p className="error">{err}</p>}

      {mods.map((m, i) => (
        <div className="panel mod-edit" key={i}>
          <div className="mod-head">
            <input aria-label="Module name" placeholder="Module name, e.g. Python Basics" value={m.title} onChange={e => setMod(i, x => ({ ...x, title: e.target.value }))} />
            <span className="actions">
              <button className="btn ghost" title="Move up" onClick={() => { dirty(); setMods(move(mods, i, -1)) }}>↑</button>
              <button className="btn ghost" title="Move down" onClick={() => { dirty(); setMods(move(mods, i, 1)) }}>↓</button>
              <button className="btn red icon" title="Remove module" aria-label="Remove module" onClick={() => window.confirm(`Remove module “${m.title || 'untitled'}” and its topics?`) && (dirty(), setMods(mods.filter((_, k) => k !== i)))}><Icon name="trash" size={16} stroke={2} /></button>
            </span>
          </div>
          {m.topics.map((t, j) => (
            <div className="topic-edit" key={j}>
              <input aria-label="Topic title" placeholder="Topic, e.g. Variables" value={t.title} onChange={e => setTopic(i, j, { title: e.target.value })} />
              <input aria-label="Video link" type="url" placeholder="YouTube link for this topic" value={t.video_url} onChange={e => setTopic(i, j, { video_url: e.target.value })} />
              <label className="check"><input type="checkbox" checked={t.is_free_preview} onChange={e => setTopic(i, j, { is_free_preview: e.target.checked })} /> Free preview</label>
              <span className="actions">
                <button className="btn ghost" title="Move up" onClick={() => setMod(i, x => ({ ...x, topics: move(x.topics, j, -1) }))}>↑</button>
                <button className="btn ghost" title="Move down" onClick={() => setMod(i, x => ({ ...x, topics: move(x.topics, j, 1) }))}>↓</button>
                <button className="btn red icon" title="Remove topic" aria-label="Remove topic" onClick={() => setMod(i, x => ({ ...x, topics: x.topics.filter((_, k) => k !== j) }))}><Icon name="trash" size={16} stroke={2} /></button>
              </span>
            </div>
          ))}
          <button className="btn ghost" onClick={() => setMod(i, x => ({ ...x, topics: [...x.topics, newTopic()] }))}>+ Add topic</button>
        </div>
      ))}
      {mods.length === 0 && <p>No modules yet.</p>}

      <div className="item-card"><CourseCard c={course} /><Syllabus modules={mods} /></div>

      <div className="savebar">
        <button className="btn ghost" onClick={() => { dirty(); setMods([...mods, { title: '', topics: [newTopic()] }]) }}>+ Add module</button>
        <button className="btn" onClick={save} disabled={busy}>{busy ? 'Saving…' : 'Save syllabus'}</button>
      </div>
    </>
  )
}

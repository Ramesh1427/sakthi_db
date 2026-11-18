import { useEffect, useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { api } from '../../api.js'
import { SECTIONS } from './sections.js'
import { cardFor, propFor, gradFor } from '../../components/Cards.jsx'
import { Icon } from '../../components/Icons.jsx'
import { useAuth } from '../../auth.jsx'
import { fmt } from '../../util.js'
import CourseModal from '../../components/CourseModal.jsx'
import ReaderModal from '../../components/ReaderModal.jsx'
import VideoModal from '../../components/VideoModal.jsx'

const blankFor = cfg => Object.fromEntries(cfg.fields.map(f => [f.name, f.default ?? (f.type === 'checkbox' ? false : '')]))

export default function Manage() {
  const { section } = useParams()
  const cfg = SECTIONS[section]
  const [items, setItems] = useState([])
  const [search, setSearch] = useState('')
  const [editing, setEditing] = useState(null) // null | object being edited
  const [msg, setMsg] = useState('')
  const [err, setErr] = useState('')
  const { user } = useAuth()
  const [courseId, setCourseId] = useState(null)   // course whose syllabus popup is open
  const [reading, setReading] = useState(null)     // blog / answer / lab shown in a popup
  const [playing, setPlaying] = useState(null)     // demo video or topic video
  const [opts, setOpts] = useState({})   // dropdown choices loaded from other endpoints

  const load = () => api(`/${cfg.path}/`).then(setItems).catch(e => setErr(e.message))
  useEffect(() => { if (cfg) { setSearch(''); setEditing(null); setMsg(''); setErr(''); load() } }, [section])
  useEffect(() => {
    cfg?.fields.filter(f => f.optionsFrom).forEach(f =>
      api(`/${f.optionsFrom}/`).then(list => setOpts(o => ({ ...o, [f.optionsFrom]: list.map(x => [x.id, x.name]) }))).catch(() => {}))
  }, [section])
  if (!cfg) return <Navigate to="/dashboard" replace />

  const setVal = (name, v) => setEditing({ ...editing, [name]: v })
  const save = async e => {
    e.preventDefault(); setErr('')
    const body = Object.fromEntries(cfg.fields.map(f => {
      const v = editing[f.name]
      return [f.name, f.type === 'checkbox' ? !!v : (f.type === 'number' || f.optionsFrom) ? Number(v) || 0 : v ?? '']
    }))
    try {
      if (editing.id) await api(`/${cfg.path}/${editing.id}/`, { method: 'PUT', body })
      else await api(`/${cfg.path}/`, { method: 'POST', body })
      setEditing(null); setMsg('Saved.'); load()
    } catch (x) { setErr(x.message) }
  }
  const remove = async item => {
    if (!window.confirm(`Delete “${item[cfg.title]}”? This cannot be undone.`)) return
    try { await api(`/${cfg.path}/${item.id}/`, { method: 'DELETE' }); setMsg('Deleted.'); load() }
    catch (x) { setErr(x.message) }
  }

  // Search box: matches any text of the item (title, description, technology, tags...)
  const needle = search.trim().toLowerCase()
  const visible = !needle ? items : items.filter(it => [...Object.entries(it).filter(([k, v]) => typeof v === 'string' && k !== 'created').map(([, v]) => v), ...(it.tag_list || [])].join(' ').toLowerCase().includes(needle))

  // Interview Q&A: one card per technology (Postgres card, Oracle card...), questions numbered 1, 2, 3 inside it.
  const techOrder = id => { const i = (opts.technologies || []).findIndex(([v]) => v === id); return i < 0 ? 999 : i }
  const groups = section !== 'interview' ? [] : [...new Set(visible.map(q => q.technology))]
    .sort((a, b) => techOrder(a) - techOrder(b) || a - b)
    .map(id => { const list = visible.filter(q => q.technology === id).sort((a, b) => a.id - b.id); return { id, name: list[0].technology_name, list } })
  const shown = visible

  const open = it => {
    if (section === 'courses') setCourseId(it.id)
    else if (section === 'videos') setPlaying({ title: it.title, url: it.youtube_url })
    else if (section === 'interview') setReading({ tech: it.technology_name, title: it.question, isAnswer: true, text: it.answer })
    else if (section === 'blogs') setReading({ tech: it.technology_name, title: it.title, date: fmt(it.created), text: it.content })
    else if (section === 'labs') setReading({ tech: it.technology_name, title: it.title, text: it.description })
  }

  return (
    <>
      <div className="row"><h1>{cfg.label}</h1><button className="btn" onClick={() => { setEditing(blankFor(cfg)); setErr(''); setMsg('') }}>+ Add</button></div>
      <div className="searchbar">
        <input type="search" placeholder={`Search ${cfg.label.toLowerCase()}…`} value={search} onChange={e => setSearch(e.target.value)} aria-label={`Search ${cfg.label}`} />
        {needle && <span className="muted">{visible.length} of {items.length}</span>}
      </div>
      {msg && <p className="note">{msg}</p>}
      {err && <p className="error">{err}</p>}

      {editing && (
        <form className="form panel" onSubmit={save}>
          <h3>{editing.id ? 'Edit' : 'Add'} {cfg.label}</h3>
          {cfg.fields.map(f => (
            <label key={f.name} className={f.type === 'checkbox' ? 'check' : ''}>
              {f.type === 'checkbox'
                ? <><input type="checkbox" checked={!!editing[f.name]} onChange={e => setVal(f.name, e.target.checked)} /> {f.label}</>
                : <>{f.label}
                  {f.type === 'textarea' && <textarea rows={f.rows || 4} required={f.required} value={editing[f.name] ?? ''} onChange={e => setVal(f.name, e.target.value)} />}
                  {f.type === 'select' && <select required={f.required} value={editing[f.name] ?? ''} onChange={e => setVal(f.name, e.target.value)}>{f.optionsFrom && <option value="">Choose…</option>}{(f.options || opts[f.optionsFrom] || []).map(([v, l]) => <option key={v} value={v}>{l}</option>)}</select>}
                  {!['textarea', 'select'].includes(f.type) && <input type={f.type} required={f.required} value={editing[f.name] ?? ''} onChange={e => setVal(f.name, e.target.value)} />}
                </>}
              {f.help && <span className="help">{f.help}</span>}
            </label>
          ))}
          <div><button className="btn">Save</button> <button type="button" className="btn ghost" onClick={() => setEditing(null)}>Cancel</button></div>
        </form>
      )}

      {section === 'interview' ? (
        <div className="list cards3 stretch">
          {groups.length === 0 && <p>{needle ? `No results for “${search.trim()}”.` : 'Nothing here yet. Press “+ Add”.'}</p>}
          {groups.map(g => (
            <div className="card qa-card" key={g.id}>
              <div className="band" style={{ background: gradFor(g.name || '') }}><Icon name="db" size={34} /><span>{g.name}</span><em className="count">{g.list.length}</em></div>
              <div className="pad">
                {g.list.map((it, n) => (
                  <div className="qa-line" key={it.id}>
                    <span className="qa-text" onClick={() => open(it)}>{n + 1}. {it.question}</span>
                    <span className="actions">
                      <button className="btn ghost icon" title="Edit" aria-label="Edit" onClick={() => { setEditing(it); setErr(''); setMsg('') }}><Icon name="edit" size={16} stroke={2} /></button>
                      <button className="btn red icon" title="Delete" aria-label="Delete" onClick={() => remove(it)}><Icon name="trash" size={16} stroke={2} /></button>
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
      <div className={`list${cardFor[section] ? ' cards3' : ''}`}>
        {shown.length === 0 && <p>{needle ? `No results for “${search.trim()}”.` : 'Nothing here yet. Press “+ Add”.'}</p>}
        {shown.map(it => { const Card = cardFor[section]; return (
          <div className="item-wrap" key={it.id}>
          <div className="item">
            <span>{it[cfg.title]}{it.technology_name && <em className="tag">{it.technology_name}</em>}{it.is_active === false && <em className="tag"> hidden</em>}</span>
            <span className="actions">
              {section === 'courses' && <Link className="btn dark" to={`/dashboard/courses/${it.id}/curriculum`}>Syllabus &amp; videos</Link>}
              <button className="btn ghost icon" title="Edit" aria-label="Edit" onClick={() => { setEditing(it); setErr(''); setMsg('') }}><Icon name="edit" size={16} stroke={2} /></button>
              <button className="btn red icon" title="Delete" aria-label="Delete" onClick={() => remove(it)}><Icon name="trash" size={16} stroke={2} /></button>
            </span>
          </div>
          {Card && <div className="item-card">
            <Card {...{ [propFor(section)]: it }} onOpen={() => open(it)} />
          </div>}
          </div>
        )})}
      </div>
      )}
      <CourseModal course={items.find(c => c.id === courseId)} user={user} paused={!!playing} onClose={() => setCourseId(null)} onPlay={setPlaying} />
      <VideoModal video={playing} onClose={() => setPlaying(null)} />
      <ReaderModal item={reading} onClose={() => setReading(null)} />
    </>
  )
}

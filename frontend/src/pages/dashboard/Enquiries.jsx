import { useEffect, useState } from 'react'
import { api } from '../../api.js'
import { gradFor } from '../../components/Cards.jsx'
import { Icon } from '../../components/Icons.jsx'

export default function Enquiries() {
  const [items, setItems] = useState([])
  const load = () => api('/enquiries/').then(setItems)
  useEffect(() => { load() }, [])
  const toggle = it => api(`/enquiries/${it.id}/`, { method: 'PATCH', body: { is_read: !it.is_read } }).then(load)
  const remove = it => window.confirm('Delete this enquiry?') && api(`/enquiries/${it.id}/`, { method: 'DELETE' }).then(load)
  return (
    <>
      <h1>Enquiries</h1>
      <div className="list cards3 stretch">
        {items.length === 0 && <p>No enquiries yet.</p>}
        {items.map(it => (
          <div className={'card person' + (it.is_read ? ' read' : '')} key={it.id}>
            <div className="band slim" style={{ background: gradFor(it.name || '') }}><span className="avatar">{(it.name || '?')[0].toUpperCase()}</span><span>{it.name}</span><em className="count">{it.is_read ? 'Read' : 'New'}</em></div>
            <div className="pad">
              <p className="meta">{[it.phone, it.email].filter(Boolean).join(', ')}</p>
              <small>{it.course || 'General enquiry'}, received {new Date(it.created).toLocaleString()}</small>
              <p className="pre">{it.message}</p>
              <span className="actions card-actions">
                <button className="btn ghost" onClick={() => toggle(it)}>{it.is_read ? 'Mark unread' : 'Mark read'}</button>
                <button className="btn red icon" title="Delete" aria-label="Delete" onClick={() => remove(it)}><Icon name="trash" size={16} stroke={2} /></button>
              </span>
            </div>
          </div>
        ))}
      </div>
    </>
  )
}

import { useEffect } from 'react'

/** Shows one blog post or one interview answer on its own, in a focused window. */
export default function ReaderModal({ item, onClose }) {
  useEffect(() => {
    const onKey = e => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose])
  if (!item) return null
  return (
    <div className="modal" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="box reader" role="dialog" aria-modal="true" aria-label={item.title}>
        <button className="btn ghost sm close" onClick={onClose}>Close</button>
        {item.tech && <span className="tag free">{item.tech}</span>}
        {item.date && <small className="when">{item.date}</small>}
        <h2>{item.title}</h2>
        {item.isAnswer && <h3 className="ans-label">Answer</h3>}
        <p className="pre text">{item.text}</p>
      </div>
    </div>
  )
}

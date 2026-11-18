import { useEffect } from 'react'
import { ytId } from '../util.js'

export default function VideoModal({ video, onClose }) {
  useEffect(() => {
    const onKey = e => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose])
  if (!video) return null
  const id = ytId(video.url)
  return (
    <div className="modal top" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="box wide" role="dialog" aria-modal="true" aria-label={video.title}>
        <button className="btn ghost sm close" onClick={onClose}>Close</button>
        <h3>{video.title}</h3>
        {id ? (
          <div className="player">
            <iframe src={`https://www.youtube-nocookie.com/embed/${id}?rel=0&autoplay=1`} title={video.title}
              allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowFullScreen />
          </div>
        ) : (
          <p>This link cannot be played inside the page. <a href={video.url} target="_blank" rel="noreferrer">Open it on YouTube</a>.</p>
        )}
      </div>
    </div>
  )
}

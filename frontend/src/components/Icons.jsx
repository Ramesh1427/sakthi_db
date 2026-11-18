const P = {
  flask: <><path d="M9 3h6M10 3v6l-5.5 9.5A2 2 0 0 0 6.2 21h11.6a2 2 0 0 0 1.7-2.5L14 9V3" /><path d="M7.5 15h9" /></>,
  play: <><rect x="3" y="4" width="18" height="13" rx="2" /><path d="M10 8.5v4l3.5-2z" /><path d="M8 21h8M12 17v4" /></>,
  chat: <><path d="M4 5h16v11H9l-5 4z" /><path d="M8 9.5h8M8 12.5h5" /></>,
  db: <><ellipse cx="12" cy="6" rx="7" ry="3" /><path d="M5 6v6c0 1.7 3.1 3 7 3s7-1.3 7-3V6M5 12v6c0 1.7 3.1 3 7 3s7-1.3 7-3v-6" /></>,
  edit: <><path d="M4 20h4L19 9a2.1 2.1 0 0 0-3-3L5 17z" /><path d="M14.5 7.5l3 3" /></>,
  trash: <><path d="M4 7h16M10 11v6M14 11v6" /><path d="M6 7l1 12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-12M9 7V4h6v3" /></>,
  award: <><circle cx="12" cy="9" r="5" /><path d="M8.6 13.4L7 21l5-3 5 3-1.6-7.6" /><path d="M10 9l1.5 1.5L14.5 7.5" /></>,
  clipboard: <><rect x="5" y="4" width="14" height="17" rx="2" /><path d="M9 4h6v3H9zM8.5 11.5h7M8.5 15h7M8.5 18h4" /></>,
  briefcase: <><rect x="3" y="7" width="18" height="13" rx="2" /><path d="M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2M3 13h18" /></>,
  cert: <><rect x="3" y="4" width="18" height="13" rx="2" /><path d="M7 8.5h10M7 12h5" /><circle cx="16.5" cy="14.5" r="2.5" /><path d="M15.2 16.8L14.5 21l2-1 2 1-.7-4.2" /></>,
}
export function Icon({ name, size = 40, stroke = 1.4 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{P[name]}</svg>
  )
}

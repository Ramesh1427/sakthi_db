import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../auth.jsx'

export function Logo() {
  return <span className="logo">SakthiDB<i>.</i></span>
}

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const { user, logout } = useAuth()
  const nav = useNavigate()
  const links = [['top', 'Home'], ['courses', 'Courses'], ['videos', 'Videos'], ['labs', 'Labs'], ['interview', 'Interview Q&A'], ['blogs', 'Blogs']]
  return (
    <header className="navbar">
      <a href="#top" className="brand" aria-label="SakthiDB home"><Logo /></a>
      <button className="burger" aria-label="Menu" aria-expanded={open} onClick={() => setOpen(!open)}>☰</button>
      <nav className={open ? 'open' : ''} onClick={() => setOpen(false)}>
        {links.map(([id, label]) => <a key={id} href={`#${id}`}>{label}</a>)}
        {!user && <Link className="btn sm ghost" to="/login">Log in</Link>}
        {user && <span className="hello">Hi, {user.username}</span>}
        {user?.is_staff && <Link className="btn sm dark" to="/dashboard">Admin dashboard</Link>}
        {user && <button className="btn sm ghost" onClick={async () => { await logout(); nav('/') }}>Logout</button>}
        {!user && <a className="btn sm" href="#contact">Apply now</a>}
      </nav>
    </header>
  )
}

import { useState } from 'react'
import { NavLink, Outlet, Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../auth.jsx'
import { SECTIONS } from './sections.js'
import { Logo } from '../../components/Navbar.jsx'

export default function DashboardLayout() {
  const { user, logout } = useAuth()
  const nav = useNavigate()
  const [open, setOpen] = useState(false)
  return (
    <div className="dash">
      <div className="dash-top"><Logo /><button className="burger" onClick={() => setOpen(!open)}>☰</button></div>
      <aside className={open ? 'open' : ''} onClick={() => setOpen(false)}>
        <div className="side-brand"><Logo /><small>Admin</small></div>
        <NavLink to="/dashboard" end>Overview</NavLink>
        {Object.entries(SECTIONS).map(([k, s]) => <NavLink key={k} to={`/dashboard/${k}`}>{s.label}</NavLink>)}
        <NavLink to="/dashboard/students">Students</NavLink>
        <NavLink to="/dashboard/enquiries">Enquiries</NavLink>
        <Link to="/">View website</Link>
        <small>Signed in as {user.username}</small>
        <button className="btn ghost" onClick={async () => { await logout(); nav('/login') }}>Logout</button>
      </aside>
      <main><Outlet /></main>
    </div>
  )
}

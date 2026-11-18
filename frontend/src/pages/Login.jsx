import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../auth.jsx'
import { Logo } from '../components/Navbar.jsx'

export default function Login() {
  const { login, register } = useAuth()
  const nav = useNavigate()
  const [mode, setMode] = useState('login')
  const [f, setF] = useState({ username: '', email: '', password: '' })
  const [err, setErr] = useState('')
  const [busy, setBusy] = useState(false)
  const set = k => e => setF({ ...f, [k]: e.target.value })

  const submit = async e => {
    e.preventDefault(); setErr(''); setBusy(true)
    try {
      const u = mode === 'login' ? await login(f.username, f.password) : await register(f.username, f.password, f.email)
      nav(u.is_staff ? '/dashboard' : '/')
    } catch (x) { setErr(x.message) } finally { setBusy(false) }
  }
  return (
    <main className="login-wrap">
      <form className="form login-card" onSubmit={submit}>
        <div className="login-logo"><Logo /></div>
        <div className="tabs" role="tablist">
          <button type="button" role="tab" aria-selected={mode === 'login'} className={mode === 'login' ? 'on' : ''} onClick={() => { setMode('login'); setErr('') }}>Log in</button>
          <button type="button" role="tab" aria-selected={mode === 'register'} className={mode === 'register' ? 'on' : ''} onClick={() => { setMode('register'); setErr('') }}>Create account</button>
        </div>
        <input required aria-label="Username" placeholder="Username" value={f.username} onChange={set('username')} autoFocus />
        {mode === 'register' && <input type="email" aria-label="Email" placeholder="Email (optional)" value={f.email} onChange={set('email')} />}
        <input required type="password" aria-label="Password" placeholder="Password" value={f.password} onChange={set('password')} />
        {mode === 'register' && <small>At least 8 characters. After you sign up, the admin can unlock course videos for you.</small>}
        <button className="btn" disabled={busy}>{busy ? 'Please wait…' : mode === 'login' ? 'Log in' : 'Create account'}</button>
        {err && <p className="error" role="alert">{err}</p>}
        <Link to="/">Back to website</Link>
      </form>
    </main>
  )
}

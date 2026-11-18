import { createContext, useContext, useEffect, useState } from 'react'
import { api, getToken } from './api.js'

const AuthCtx = createContext(null)
export const useAuth = () => useContext(AuthCtx)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)   // { username, is_staff }
  const [ready, setReady] = useState(false)

  useEffect(() => {
    if (!getToken()) { setReady(true); return }
    api('/auth/me/').then(setUser).catch(() => localStorage.removeItem('token')).finally(() => setReady(true))
  }, [])

  const start = d => {
    localStorage.setItem('token', d.token)
    const u = { username: d.username, is_staff: d.is_staff }
    setUser(u); return u
  }
  const login = async (username, password) => start(await api('/auth/login/', { method: 'POST', body: { username, password } }))
  const register = async (username, password, email) => start(await api('/auth/register/', { method: 'POST', body: { username, password, email } }))
  const logout = async () => {
    try { await api('/auth/logout/', { method: 'POST' }) } catch {}
    localStorage.removeItem('token'); setUser(null)
  }
  return <AuthCtx.Provider value={{ user, ready, login, register, logout }}>{children}</AuthCtx.Provider>
}

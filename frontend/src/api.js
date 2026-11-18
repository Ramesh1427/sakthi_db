const BASE = import.meta.env.VITE_API_URL || '/api'

export const getToken = () => localStorage.getItem('token')

export async function api(path, { method = 'GET', body } = {}) {
  const send = token => {
    const headers = { 'Content-Type': 'application/json' }
    if (token) headers.Authorization = `Token ${token}`
    return fetch(`${BASE}${path}`, { method, headers, body: body ? JSON.stringify(body) : undefined })
  }
  const token = getToken()
  let res = await send(token)
  // A stale/expired token must not break public pages: drop it and retry as a visitor.
  if (res.status === 401 && token && !path.startsWith('/auth/')) {
    localStorage.removeItem('token')
    res = await send(null)
  }
  if (res.status === 204) return null
  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    const msg = data.detail || Object.entries(data).map(([k, v]) => `${k}: ${[].concat(v).join(' ')}`).join(' | ') || 'Request failed'
    const err = new Error(msg); err.status = res.status; throw err
  }
  return data
}

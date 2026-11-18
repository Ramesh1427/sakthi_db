import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../../api.js'

const CARDS = [
  ['courses', 'Courses', '/dashboard/courses'], ['videos', 'Demo videos', '/dashboard/videos'],
  ['labs', 'Labs', '/dashboard/labs'], ['interview_questions', 'Interview Q&A', '/dashboard/interview'],
  ['blogs', 'Blogs', '/dashboard/blogs'], ['students', 'Students', '/dashboard/students'], ['unread_enquiries', 'Unread enquiries', '/dashboard/enquiries'],
]

export default function Overview() {
  const [s, setS] = useState(null)
  useEffect(() => { api('/dashboard/stats/').then(setS) }, [])
  return (
    <>
      <h1>Overview</h1>
      {!s ? <p>Loading…</p> : <div className="grid small">
        {CARDS.map(([k, label, to]) => <Link className="card stat" to={to} key={k}><h2>{s[k]}</h2>{label}</Link>)}
      </div>}
    </>
  )
}

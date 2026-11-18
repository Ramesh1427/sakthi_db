import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../api.js'
import { useAuth } from '../auth.jsx'
import { ytId, fmt } from '../util.js'
import VideoModal from '../components/VideoModal.jsx'
import ReaderModal from '../components/ReaderModal.jsx'
import Navbar from '../components/Navbar.jsx'
import Hero from '../components/Hero.jsx'
import CourseModal from '../components/CourseModal.jsx'
import { Icon } from '../components/Icons.jsx'
import { Reveal, CountUp } from '../components/Motion.jsx'

const GRADS = ['linear-gradient(135deg,#7c3aed,#4c1d95)', 'linear-gradient(135deg,#6366f1,#312e81)', 'linear-gradient(135deg,#8b5cf6,#5b21b6)', 'linear-gradient(135deg,#a855f7,#6b21a8)']
const gradFor = s => GRADS[[...s].reduce((a, c) => a + c.charCodeAt(0), 0) % GRADS.length]

const FEATURES = [
  ['flask', 'Practical Labs', 'Follow guided lab exercises and practise on real setups.', '#labs'],
  ['play', 'Video Demos', 'Watch sample sessions before you decide to enrol.', '#videos'],
  ['chat', 'Interview Prep', 'Revise common interview questions with clear answers.', '#interview'],
]

const Empty = ({ children = 'Coming soon.' }) => <p className="empty">{children}</p>
const TechTabs = ({ techs, value, onChange, label }) => techs.length === 0 ? null : (
  <div className="tech-tabs" role="tablist" aria-label={label}>
    {techs.map(t => (
      <button key={t.id} role="tab" aria-selected={t.id === value} className={t.id === value ? 'on' : ''} onClick={() => onChange(t.id)}>{t.name}</button>
    ))}
  </div>
)
const WHY = [
  ['flask', 'Live lab environment', 'Practise on dedicated Oracle and PostgreSQL servers with realistic enterprise workloads.'],
  ['award', 'Certified instructors', 'Learn from certified professionals who work on production databases every day.'],
  ['clipboard', 'Interview preparation', 'Curated interview questions with clear answers, mock interviews and resume guidance.'],
  ['briefcase', 'Placement assistance', 'Resume building, LinkedIn tips and job referrals to help you land your first DBA role.'],
  ['play', 'Recorded sessions', 'Lifetime access to recordings of every live session, in a library that keeps growing.'],
  ['cert', 'Course certificate', 'Get a completion certificate that also supports your OCA / OCP exam preparation.'],
]
const Head = ({ title, sub }) => <Reveal className="head"><h2>{title}</h2><p className="sub">{sub}</p></Reveal>

function EnquiryForm() {
  const empty = { name: '', phone: '', email: '', course: '', message: '' }
  const [f, setF] = useState(empty)
  const [status, setStatus] = useState({ text: '', ok: true })
  const set = k => e => setF({ ...f, [k]: e.target.value })
  const submit = async e => {
    e.preventDefault(); setStatus({ text: 'Sending…', ok: true })
    try {
      await api('/enquiries/', { method: 'POST', body: f })
      setStatus({ text: 'Enquiry sent. We will contact you soon.', ok: true }); setF(empty)
    } catch (err) { setStatus({ text: err.message, ok: false }) }
  }
  return (
    <form className="form" onSubmit={submit}>
      <div className="two">
        <input required aria-label="Your name" placeholder="Your name" value={f.name} onChange={set('name')} />
        <input aria-label="Phone" placeholder="Phone" value={f.phone} onChange={set('phone')} />
      </div>
      <div className="two">
        <input type="email" aria-label="Email" placeholder="Email" value={f.email} onChange={set('email')} />
        <input aria-label="Course" placeholder="Course you want" value={f.course} onChange={set('course')} />
      </div>
      <textarea rows="4" aria-label="Message" placeholder="Anything we should know?" value={f.message} onChange={set('message')} />
      <div><button className="btn">Send enquiry</button></div>
      {status.text && <p className={status.ok ? 'note' : 'error'} role="status">{status.text}</p>}
    </form>
  )
}

// These four sections are not on the home page. Each one opens only when its link is clicked (#videos, #labs, #interview, #blogs).
const PAGES = ['videos', 'labs', 'interview', 'blogs']
const hashId = () => window.location.hash.slice(1)
function useView() {
  const [id, setId] = useState(hashId)
  useEffect(() => {
    const on = () => setId(hashId())
    window.addEventListener('hashchange', on)
    return () => window.removeEventListener('hashchange', on)
  }, [])
  useEffect(() => {
    // Opening a section starts at its top; going back home scrolls to the requested home section.
    if (PAGES.includes(id)) window.scrollTo(0, 0)
    else if (id) requestAnimationFrame(() => document.getElementById(id)?.scrollIntoView())
  }, [id])
  return PAGES.includes(id) ? id : 'home'
}

export default function Home() {
  const { user, ready } = useAuth()
  const view = useView()
  const [d, setD] = useState({ courses: [], videos: [], labs: [], questions: [], blogs: [], slides: [], techs: [] })
  const [err, setErr] = useState('')
  const [activeId, setActiveId] = useState(null)
  const [playing, setPlaying] = useState(null)
  const [reading, setReading] = useState(null)   // a blog post or an interview answer shown on its own
  const active = d.courses.find(c => c.id === activeId)

  // Labs, interview Q&A and blogs each have their own technology tabs. The first technology (PostgreSQL) is the default.
  const [labT, setLabT] = useState(null)
  const [qaT, setQaT] = useState(null)
  const [blogT, setBlogT] = useState(null)
  const first = d.techs[0]?.id
  const [lt, qt, bt] = [labT ?? first, qaT ?? first, blogT ?? first]
  const techName = id => d.techs.find(t => t.id === id)?.name || ''
  const labs = d.labs.filter(l => l.technology === lt)
  const qas = d.questions.filter(q => q.technology === qt).sort((a, b) => a.id - b.id)
  const blogs = d.blogs.filter(b => b.technology === bt)

  // Reload when the login state changes, because video links depend on who is asking.
  useEffect(() => {
    if (!ready) return
    Promise.all(['courses', 'videos', 'labs', 'interview-questions', 'blogs', 'hero-slides', 'technologies'].map(p => api(`/${p}/`)))
      .then(([courses, videos, labs, questions, blogs, slides, techs]) => { setD({ courses, videos, labs, questions, blogs, slides, techs }); setErr('') })
      .catch(e => setErr(e.message))
  }, [ready, user?.username])

  return (
    <div id="top">
      <Navbar />
      {view === 'home' && <>
      <Hero slides={user ? d.slides.map(x => x.button_link === '#contact' ? { ...x, button_link: '#courses' } : x) : d.slides} />
      <div className="features">
        {FEATURES.map(([icon, title, text, href], i) => (
          <Reveal as="a" href={href} className="feature" delay={i * 120} key={title}>
            <Icon name={icon} /><h3>{title}</h3><p>{text}</p>
          </Reveal>
        ))}
      </div>
      </>}
      {err && <p className="center error">Could not load content: {err}</p>}

      {view === 'home' && <>
      <section id="courses" className="first"><div className="wrap">
        <Head title="Industry-ready DBA courses" sub="A structured syllabus built around real enterprise environments. Open any course to see it module by module." />
        {d.courses.length === 0 && <Empty />}
        <div className="grid">
          {d.courses.map((c, i) => (
            <Reveal className="card course" delay={i * 70} key={c.id}>
              <div className="band" style={{ background: gradFor(c.category) }}><Icon name="db" size={34} /><span>{c.category}</span>{c.has_access && <em className="unlocked">Videos unlocked</em>}</div>
              <div className="pad">
                <h3>{c.name}</h3><p>{c.description}</p>
                <div>{c.tag_list.map(t => <span className="tag" key={t}>{t}</span>)}</div>
                <button className="btn sm" onClick={() => setActiveId(c.id)}>View syllabus</button>
              </div>
            </Reveal>
          ))}
        </div>
      </div></section>

      <section id="why" className="alt"><div className="wrap">
        <Head title="Why choose us" sub="Built for real-world production environments." />
        <div className="why-grid">
          {WHY.map(([icon, title, text], i) => (
            <Reveal className="why-card" delay={i * 70} key={title}>
              <span className="ico"><Icon name={icon} size={30} /></span><h3>{title}</h3><p>{text}</p>
            </Reveal>
          ))}
        </div>
      </div></section>

      <section className="stats"><div className="wrap">
        {[['Courses', d.courses.length], ['Video demos', d.videos.length], ['Lab exercises', d.labs.length], ['Interview questions', d.questions.length]].map(([label, n]) => (
          <div key={label}><b><CountUp to={n} /></b><span>{label}</span></div>
        ))}
      </div></section>

      </>}

      {view === 'videos' && <section id="videos" className="first"><div className="wrap">
        <Head title="Video demos" sub="Watch a class before you decide." />
        {d.videos.length === 0 && <Empty>Demo videos are coming soon.</Empty>}
        <div className="grid">
          {d.videos.map((v, i) => {
            const id = ytId(v.youtube_url)
            return (
              <Reveal as="button" type="button" className="card video" delay={i * 60} key={v.id} onClick={() => setPlaying({ title: v.title, url: v.youtube_url })}>
                <div className="thumb" style={id ? { backgroundImage: `url(https://img.youtube.com/vi/${id}/hqdefault.jpg)` } : undefined}>
                  <span className="play" aria-hidden="true"><svg width="22" height="22" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" fill="currentColor" /></svg></span>
                </div>
                <div className="pad"><h3>{v.title}</h3><p>{v.description}</p></div>
              </Reveal>
            )
          })}
        </div>
      </div></section>}

      {view === 'labs' && <section id="labs" className="first"><div className="wrap">
        <Head title="Lab experience" sub="Practice on real setups, not slides." />
        <TechTabs techs={d.techs} value={lt} onChange={setLabT} label="Lab technology" />
        {labs.length === 0 && <Empty>No labs for {techName(lt)} yet.</Empty>}
        <div className="grid">{labs.map((l, i) => <Reveal className="card lab" delay={i * 50} key={l.id}><div className="pad"><h3>{l.title}</h3><p>{l.description}</p></div></Reveal>)}</div>
      </div></section>}

      {view === 'interview' && <section id="interview" className="first"><div className="wrap narrow">
        <Head title="Interview Q&A" sub="Questions that come up again and again." />
        <TechTabs techs={d.techs} value={qt} onChange={setQaT} label="Interview Q&A technology" />
        {qas.length === 0 && <Empty>No questions for {techName(qt)} yet.</Empty>}
        {qas.map((q, n) => <Reveal as="button" type="button" className="qa-row" key={q.id} onClick={() => setReading({ tech: techName(q.technology), title: q.question, isAnswer: true, text: q.answer })}><span>{n + 1}. {q.question}</span><span className="qa-go">View answer</span></Reveal>)}
      </div></section>}

      {view === 'blogs' && <section id="blogs" className="first"><div className="wrap">
        <Head title="Technical blogs" sub="Notes from the classroom and the lab." />
        <TechTabs techs={d.techs} value={bt} onChange={setBlogT} label="Blog technology" />
        {blogs.length === 0 && <Empty>No blogs for {techName(bt)} yet.</Empty>}
        <div className="grid">
          {blogs.map((b, i) => (
            <Reveal className="card blog" delay={i * 70} key={b.id}>
              <div className="pad"><small>{fmt(b.created)}</small><h3>{b.title}</h3>
                <p>{b.content.length > 110 ? b.content.slice(0, 110).trim() + '…' : b.content}</p>
                <button className="btn sm" onClick={() => setReading({ tech: techName(b.technology), title: b.title, date: fmt(b.created), text: b.content })}>Read post</button></div>
            </Reveal>
          ))}
        </div>
      </div></section>}

      {view === 'home' && !user && <section id="contact"><div className="wrap contact">
        <Reveal><h2>Tell us what you want to learn</h2><p className="sub">Send your details and we will get back to you about batches and fees.</p></Reveal>
        <Reveal delay={120}><EnquiryForm /></Reveal>
      </div></section>}

      <footer><div className="wrap foot">
        <span className="logo">SakthiDB<i>.</i> Technology</span>
        <nav><a href="#courses">Courses</a><a href="#videos">Videos</a><a href="#labs">Labs</a><a href="#interview">Interview Q&amp;A</a><a href="#blogs">Blogs</a>{!user && <a href="#contact">Contact</a>}{!user && <Link to="/login">Log in</Link>}</nav>
      </div></footer>
      <CourseModal course={active} user={user} paused={!!playing} onClose={() => setActiveId(null)} onPlay={setPlaying} />
      <VideoModal video={playing} onClose={() => setPlaying(null)} />
      <ReaderModal item={reading} onClose={() => setReading(null)} />
    </div>
  )
}

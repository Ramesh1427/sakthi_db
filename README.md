# SakthiDB Technology: Full-stack (Django + React)

    sakthidb-fullstack/
    ├── backend/      Django REST API (7 apps)
    ├── frontend/     React (Vite) website + admin dashboard
    └── render.yaml   One-click deployment blueprint (Render)

## Run locally
**Backend** (terminal 1)

    cd backend
    python -m venv venv && venv\Scripts\activate      # Mac/Linux: source venv/bin/activate
    pip install -r requirements.txt
    python manage.py migrate              # also converts old text syllabus into modules/topics
    python manage.py seed                 # optional sample content (only on an empty database)
    python manage.py createsuperuser      # your admin login
    python manage.py test                 # optional: 43 tests
    python manage.py runserver

**Frontend** (terminal 2)

    cd frontend
    npm install
    npm run dev                           # http://localhost:5173

## Backend apps (each has models.py, admin.py, serializers.py, views.py, urls.py, tests.py)
| App | Purpose | Endpoints |
|---|---|---|
| `accounts` | login, student sign-up, token auth, permissions | `/api/auth/login/`, `register/`, `logout/`, `me/` |
| `home` | hero slider slides (editable by admin) | `/api/hero-slides/` |
| `courses` | Course, Module, Topic (each topic has a video link) | `/api/courses/`, `/api/courses/<id>/curriculum/` |
| `enrollments` | which student can watch which course | `/api/students/`, `/api/students/<id>/access/` |
| `technologies` | PostgreSQL / Oracle / MySQL tabs for labs, Q&A and blogs | `/api/technologies/` |
| `videos` | public demo videos | `/api/videos/` |
| `labs` | lab experience | `/api/labs/` |
| `interviews` | interview Q&A | `/api/interview-questions/` |
| `blogs` | technical blogs | `/api/blogs/` |
| `dashboard` | enquiries, stats, seed command | `/api/dashboard/stats/`, `/api/enquiries/` |

## How course videos work
1. **Admin** → Dashboard → Courses → *Syllabus & videos*: add modules (e.g. "Python Basics", "Loops and Functions"), topics inside them (Introduction, Variables, Conditions...), and a YouTube link per topic. Optional "Free preview" makes one topic's video public.
2. **Student** creates an account (website → Log in → Create account).
3. **Admin** → Dashboard → Students: tick the courses that student may watch.
4. What each visitor sees on a course:
   - not logged in / no access: the full syllabus, videos shown as **Locked** (only free-preview topics play)
   - student with access: **Watch** buttons that play the topic video inside the page
   - the video links of locked topics are never sent by the API, not just hidden on screen.
Tip: upload course videos to YouTube as **Unlisted**. A student with access could still copy a link and share it; YouTube cannot prevent that.

## Technology tabs
Lab experience, Interview Q&A and Blogs each show tabs (PostgreSQL by default, then Oracle, MySQL...). Clicking a tab shows only that technology's items.
- When the admin adds a lab, question or blog, they choose its **Technology**.
- Dashboard → **Technologies** adds new tabs (e.g. SQL Server) and sets their order. The first one is the default tab. A technology that still has content cannot be deleted.
- Upgrading an existing database: `python manage.py migrate` puts your existing labs, questions and blogs under PostgreSQL. Re-tag the Oracle/MySQL ones from the dashboard.

## Pages
`/` website · `/login` log in / create account · `/dashboard` (admin only): Overview, Courses (+ syllabus editor), Demo videos, Labs, Interview Q&A, Blogs, Hero slides, Students, Enquiries.
Demo videos appear on the website only after the admin adds them (Dashboard → Demo videos).

## Deploy live (Render, free tier to start)
1. Put this folder on GitHub (the folder containing `render.yaml` is the repo root).
2. Render dashboard → **New → Blueprint** → select the repo. It creates the database, the API (`sakthidb-api`) and the website (`sakthidb-web`).
3. When asked, fill in:
   - `ADMIN_USERNAME`, `ADMIN_PASSWORD`: your admin login (created automatically on every deploy; no shell needed).
   - `CORS_ALLOWED_ORIGINS`: the website URL, e.g. `https://sakthidb-web.onrender.com` (no trailing slash).
   - `VITE_API_URL`: the API URL + `/api`, e.g. `https://sakthidb-api.onrender.com/api`.
4. If you only know the URLs after the first deploy, set those two values then and click **Manual Deploy** on both services.
5. Open the website, log in at `/login`, and add your real courses, videos, labs, Q&A and blogs.

**Custom domain** (e.g. sakthidbtechnology.com): add it in Render → website → Custom Domains, then add the same domain to `CORS_ALLOWED_ORIGINS` on the API (comma separated).

**Good to know**
- Free Render services sleep after inactivity, so the first visit can take ~30–60 s. A paid plan removes this.
- Free databases have time/size limits. Check Render's current free-tier terms and upgrade before real students depend on it.
- Never commit real passwords. Use the host's environment variables (`backend/.env.example` lists them all).
- Other hosts work too: the backend is a normal Django app (`gunicorn config.wsgi`), the frontend is static files (`npm run build` → `dist/`; `public/_redirects` and `vercel.json` handle page refreshes on Netlify/Vercel).

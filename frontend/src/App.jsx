import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './auth.jsx'
import Home from './pages/Home.jsx'
import Login from './pages/Login.jsx'
import DashboardLayout from './pages/dashboard/DashboardLayout.jsx'
import Overview from './pages/dashboard/Overview.jsx'
import Manage from './pages/dashboard/Manage.jsx'
import Enquiries from './pages/dashboard/Enquiries.jsx'
import Students from './pages/dashboard/Students.jsx'
import CurriculumEditor from './pages/dashboard/CurriculumEditor.jsx'

function RequireStaff({ children }) {
  const { user, ready } = useAuth()
  if (!ready) return <p className="center">Loading…</p>
  return user?.is_staff ? children : <Navigate to="/login" replace />
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/dashboard" element={<RequireStaff><DashboardLayout /></RequireStaff>}>
        <Route index element={<Overview />} />
        <Route path="enquiries" element={<Enquiries />} />
        <Route path="students" element={<Students />} />
        <Route path="courses/:id/curriculum" element={<CurriculumEditor />} />
        <Route path=":section" element={<Manage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

import { Routes, Route, Navigate } from 'react-router-dom'
import { AdminAuthProvider } from './AdminAuthProvider'
import { RequireAdmin } from './RequireAdmin'
import { AdminLayout } from './AdminLayout'
import Login from './pages/Login'
import ContentEditor from './pages/ContentEditor'
import MediaManager from './pages/MediaManager'
import ThemeEditor from './pages/ThemeEditor'

// Mounted at /admin/* by src/App.jsx. Everything admin-related lives under
// src/admin/ so it ships as its own lazy chunk, never loaded by a visitor
// who only browses the public site.
export default function AdminApp() {
  return (
    <AdminAuthProvider>
      <Routes>
        <Route path="login" element={<Login />} />
        <Route element={<RequireAdmin><AdminLayout /></RequireAdmin>}>
          <Route index element={<Navigate to="content" replace />} />
          <Route path="content" element={<ContentEditor />} />
          <Route path="media" element={<MediaManager />} />
          <Route path="theme" element={<ThemeEditor />} />
        </Route>
        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Routes>
    </AdminAuthProvider>
  )
}

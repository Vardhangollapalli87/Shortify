import { Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { ProtectedLayout } from './layouts/ProtectedLayout';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import OAuthCallback from './pages/OAuthCallback';
import Dashboard from './pages/Dashboard';
import LinksPage from './pages/Links';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/auth/callback" element={<OAuthCallback />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <ProtectedLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
      </Route>
      <Route
        path="/links"
        element={
          <ProtectedRoute>
            <ProtectedLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<LinksPage />} />
      </Route>
      <Route
        path="/app/*"
        element={
          <ProtectedRoute>
            <ProtectedLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-8 text-slate-200">Workspace overview placeholder.</div>} />
        <Route path="links" element={<div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-8 text-slate-200">Links page placeholder.</div>} />
        <Route path="analytics" element={<div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-8 text-slate-200">Analytics page placeholder.</div>} />
        <Route path="settings" element={<div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-8 text-slate-200">Settings page placeholder.</div>} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

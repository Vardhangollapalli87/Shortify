import { Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { ProtectedLayout } from './layouts/ProtectedLayout';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import OAuthCallback from './pages/OAuthCallback';
import VerifyEmail from './pages/VerifyEmail';
import PasswordChallenge from './pages/PasswordChallenge';
import Dashboard from './pages/Dashboard';
import LinksPage from './pages/Links';
import AnalyticsPage from './pages/Analytics';
import SettingsPage from './pages/Settings';
import { useAuth } from './context/AuthProvider';

const RootRoute = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="grid min-h-screen place-items-center bg-slate-950 text-slate-200">Loading session...</div>;
  }

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Landing />;
};

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<RootRoute />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/auth/callback" element={<OAuthCallback />} />
      <Route path="/auth/oauth/callback" element={<OAuthCallback />} />
      <Route path="/verify-email" element={<VerifyEmail />} />
      <Route path="/resend-verification" element={<VerifyEmail />} />
      <Route path="/links/password/:shortCode" element={<PasswordChallenge />} />
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
        path="/analytics"
        element={
          <ProtectedRoute>
            <ProtectedLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<AnalyticsPage />} />
      </Route>
      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <ProtectedLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<SettingsPage />} />
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
        <Route path="links" element={<LinksPage />} />
        <Route path="analytics" element={<AnalyticsPage />} />
        <Route path="settings" element={<SettingsPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { ProtectedLayout } from './layouts/ProtectedLayout';
import { useAuth } from './context/AuthProvider';

const Landing = lazy(() => import('./pages/Landing'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'));
const ResetPassword = lazy(() => import('./pages/ResetPassword'));
const OAuthCallback = lazy(() => import('./pages/OAuthCallback'));
const VerifyEmail = lazy(() => import('./pages/VerifyEmail'));
const PasswordChallenge = lazy(() => import('./pages/PasswordChallenge'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const LinksPage = lazy(() => import('./pages/Links'));
const AnalyticsPage = lazy(() => import('./pages/Analytics'));
const SettingsPage = lazy(() => import('./pages/Settings'));

const PageLoader = () => (
  <div className="grid min-h-screen place-items-center bg-white text-sm font-medium text-slate-600 dark:bg-slate-950 dark:text-slate-300">Loading Shortify...</div>
);

const RootRoute = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="grid min-h-screen place-items-center bg-white text-slate-600 dark:bg-slate-950 dark:text-slate-200">Loading session...</div>;
  }

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Landing />;
};

export default function App() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
      <Route path="/" element={<RootRoute />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
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
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="links" element={<LinksPage />} />
        <Route path="analytics" element={<AnalyticsPage />} />
        <Route path="settings" element={<SettingsPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
}

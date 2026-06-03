import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthProvider';

export const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div className="grid min-h-screen place-items-center text-slate-200">Loading session…</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return children;
};

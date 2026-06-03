import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthProvider';

export const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <header className="border-b border-slate-800 bg-slate-950/90 px-4 py-4 lg:px-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.35em] text-cyan-300">Foundation</p>
          <h1 className="text-lg font-semibold text-white">Phase 6A Frontend Shell</h1>
        </div>

        <div className="flex items-center gap-3">
          {user ? (
            <>
              <span className="hidden rounded-full border border-slate-700 bg-slate-900 px-3 py-1 text-sm text-slate-200 md:block">
                {user.email || 'Signed in'}
              </span>
              <button
                type="button"
                onClick={logout}
                className="rounded-xl border border-slate-700 bg-slate-900 px-4 py-2 text-sm text-slate-100 hover:border-slate-500"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="rounded-xl border border-cyan-400/50 bg-cyan-400/10 px-4 py-2 text-sm text-cyan-100 hover:bg-cyan-400/20"
            >
              Sign in
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

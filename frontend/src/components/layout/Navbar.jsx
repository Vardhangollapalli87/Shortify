import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthProvider';
import logoLight from '../../assests/branding/logo-light.png';
import { Button } from '../ui/Button';

export const Navbar = () => {
  const { user, logout } = useAuth();
  const initials = user?.name?.slice(0, 1)?.toUpperCase() || user?.email?.slice(0, 1)?.toUpperCase() || 'S';

  return (
    <header className="sticky top-0 z-30 border-b border-slate-800 bg-slate-950/95 px-4 py-3 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between gap-3">
        <Link to="/dashboard" className="flex items-center gap-3 lg:hidden">
          <img src={logoLight} alt="Shortify" className="h-8 w-auto" />
        </Link>
        <div className="hidden lg:block">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-300">Shortify</p>
          <h1 className="text-sm font-medium text-slate-300">Premium link operations</h1>
        </div>

        <div className="flex items-center gap-3">
          {user ? (
            <>
              <div className="hidden items-center gap-3 rounded-full border border-slate-800 bg-slate-900 py-1 pl-1 pr-3 md:flex">
                <span className="grid h-8 w-8 place-items-center rounded-full brand-gradient text-sm font-semibold text-white">{initials}</span>
                <span className="max-w-[220px] truncate text-sm text-slate-300">{user.email || 'Signed in'}</span>
              </div>
              <Button type="button" variant="secondary" size="sm" onClick={logout}>Logout</Button>
            </>
          ) : (
            <Button as={Link} to="/login" variant="secondary" size="sm">Sign in</Button>
          )}
        </div>
      </div>
    </header>
  );
};

import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthProvider';
import { Button } from '../ui/Button';
import { ThemeToggle } from './ThemeToggle';

export const Navbar = ({ onMenuOpen }) => {
  const { user, logout } = useAuth();
  const initials = user?.name?.slice(0, 1)?.toUpperCase() || user?.email?.slice(0, 1)?.toUpperCase() || 'S';

  return (
    <header className="app-panel sticky top-0 z-30 h-16 border-b">
      <div className="flex h-full items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
        <div className="flex min-w-0 items-center gap-3">
          <button type="button" onClick={onMenuOpen} className="icon-button lg:hidden" aria-label="Open navigation">
            <span className="grid gap-1" aria-hidden="true"><span className="h-0.5 w-4 bg-current" /><span className="h-0.5 w-4 bg-current" /><span className="h-0.5 w-4 bg-current" /></span>
          </button>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-slate-950 dark:text-white">Shortify workspace</p>
            <p className="hidden text-xs text-slate-500 dark:text-slate-400 sm:block">Link management and performance</p>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <ThemeToggle />
          {user ? (
            <>
              <Link to="/settings" className="hidden items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-slate-50 dark:hover:bg-slate-800 sm:flex">
                <span className="grid h-8 w-8 place-items-center rounded-full bg-blue-600 text-sm font-semibold text-white">{initials}</span>
                <span className="max-w-40 truncate text-sm text-slate-600 dark:text-slate-300">{user.name || user.email}</span>
              </Link>
              <Button type="button" variant="ghost" size="sm" onClick={logout}>Sign out</Button>
            </>
          ) : (
            <Button as={Link} to="/login" variant="secondary" size="sm">Sign in</Button>
          )}
        </div>
      </div>
    </header>
  );
};

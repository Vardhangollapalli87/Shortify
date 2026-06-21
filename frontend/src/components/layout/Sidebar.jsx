import { useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import logoLight from '../../assests/branding/logo-light.png';
import logoDark from '../../assests/branding/logo-dark.png';

const links = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/links', label: 'Links' },
  { to: '/analytics', label: 'Analytics' },
  { to: '/settings', label: 'Settings' }
];

const navClass = ({ isActive }) =>
  `flex items-center rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
    isActive
      ? 'bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-200'
      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-950 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white'
  }`;

const SidebarContent = ({ onClose }) => (
  <div className="flex h-full flex-col">
    <div className="flex h-16 items-center justify-between border-b border-slate-200 px-5 dark:border-slate-800">
      <NavLink to="/dashboard" onClick={onClose} aria-label="Shortify dashboard">
        <img src={logoLight} alt="Shortify" className="h-8 w-auto dark:hidden" />
        <img src={logoDark} alt="Shortify" className="hidden h-8 w-auto dark:block" />
      </NavLink>
      <button type="button" onClick={onClose} className="icon-button lg:hidden" aria-label="Close navigation"><span aria-hidden="true" className="text-xl">&times;</span></button>
    </div>
    <nav className="flex-1 space-y-1 px-3 py-5" aria-label="Primary navigation">
      {links.map((item) => (
        <NavLink key={item.to} to={item.to} className={navClass} onClick={onClose}>{item.label}</NavLink>
      ))}
    </nav>
    <div className="border-t border-slate-200 p-4 text-xs leading-5 text-slate-500 dark:border-slate-800 dark:text-slate-400">
      Secure link management and analytics.
    </div>
  </div>
);

export const Sidebar = ({ isOpen, onClose }) => {
  useEffect(() => {
    if (!isOpen) return undefined;
    const closeOnEscape = (event) => event.key === 'Escape' && onClose();
    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, [isOpen, onClose]);

  return (
    <>
      <aside className="app-panel fixed inset-y-0 left-0 z-40 hidden w-64 border-r lg:block"><SidebarContent /></aside>
      {isOpen ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button type="button" className="absolute inset-0 bg-slate-950/60" onClick={onClose} aria-label="Close navigation" />
          <aside className="app-panel relative h-full w-[min(18rem,86vw)] border-r shadow-xl" role="dialog" aria-modal="true" aria-label="Navigation menu">
            <SidebarContent onClose={onClose} />
          </aside>
        </div>
      ) : null}
    </>
  );
};

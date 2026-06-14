import { NavLink } from 'react-router-dom';
import logoLight from '../../assests/branding/logo-light.png';

const links = [
  { to: '/dashboard', label: 'Overview' },
  { to: '/links', label: 'Links' },
  { to: '/analytics', label: 'Analytics' },
  { to: '/settings', label: 'Settings' }
];

const navClass = ({ isActive }) =>
  `flex items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium transition ${
    isActive
      ? 'bg-slate-800 text-white shadow-sm shadow-black/20'
      : 'text-slate-400 hover:bg-slate-900 hover:text-white'
  }`;

export const Sidebar = () => (
  <aside className="hidden w-[17rem] shrink-0 border-r border-slate-800 bg-slate-950 px-4 py-5 lg:block">
    <NavLink to="/dashboard" className="flex items-center gap-3 rounded-lg px-2 py-2">
      <img src={logoLight} alt="Shortify" className="h-8 w-auto" />
    </NavLink>

    <nav className="mt-8 space-y-1" aria-label="Main navigation">
      {links.map((item) => (
        <NavLink key={item.to} to={item.to} className={navClass}>
          <span>{item.label}</span>
        </NavLink>
      ))}
    </nav>

    <div className="mt-8 rounded-xl border border-slate-800 bg-slate-900 p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-300">Workspace</p>
      <p className="mt-2 text-sm leading-6 text-slate-400">Manage links, analytics, QR assets, and account controls from one production workspace.</p>
    </div>
  </aside>
);

export const MobileNav = () => (
  <nav className="grid grid-cols-4 gap-1 border-t border-slate-800 bg-slate-950 p-2 lg:hidden" aria-label="Mobile navigation">
    {links.map((item) => (
      <NavLink
        key={item.to}
        to={item.to}
        className={({ isActive }) =>
          `rounded-lg px-2 py-2 text-center text-xs font-semibold ${isActive ? 'bg-slate-800 text-white' : 'text-slate-400'}`
        }
      >
        {item.label}
      </NavLink>
    ))}
  </nav>
);

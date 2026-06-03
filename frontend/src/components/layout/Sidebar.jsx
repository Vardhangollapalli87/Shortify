import { NavLink } from 'react-router-dom';

const links = [
  { to: '/dashboard', label: 'Overview' },
  { to: '/app/links', label: 'Links' },
  { to: '/app/analytics', label: 'Analytics' },
  { to: '/app/settings', label: 'Settings' }
];

export const Sidebar = () => (
  <aside className="hidden w-72 border-r border-slate-800 bg-slate-950/90 p-6 lg:block">
    <div className="mb-8">
      <p className="text-xs uppercase tracking-[0.35em] text-cyan-300">Shortify</p>
      <h2 className="mt-2 text-xl font-semibold text-white">Workspace</h2>
    </div>

    <nav className="space-y-2">
      {links.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          className={({ isActive }) =>
            `block rounded-xl border px-4 py-3 text-sm font-medium transition ${
              isActive
                ? 'border-cyan-400 bg-cyan-400/10 text-cyan-100'
                : 'border-transparent bg-slate-900/70 text-slate-200 hover:border-slate-700 hover:bg-slate-900'
            }`
          }
        >
          {item.label}
        </NavLink>
      ))}
    </nav>
  </aside>
);

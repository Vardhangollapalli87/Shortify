import { Link } from 'react-router-dom';
import logoLight from '../../assests/branding/logo-light.png';
import logoDark from '../../assests/branding/logo-dark.png';
import { ThemeToggle } from '../layout/ThemeToggle';

export const AuthShell = ({ eyebrow, title, description, children }) => {
  const isRegistration = eyebrow === 'Create account';
  const highlights = isRegistration
    ? ['Create and organize short links', 'Protect destinations when needed', 'Review performance from one workspace']
    : ['Resume work across devices', 'Manage links and QR assets together', 'Keep account access secure'];

  return (
  <main className="grid min-h-screen bg-white text-slate-950 dark:bg-slate-950 dark:text-slate-100 lg:grid-cols-[1fr_0.9fr]">
    <section className="flex min-h-screen items-center justify-center px-5 py-10">
      <div className="w-full max-w-md">
        <div className="mb-10 flex items-center justify-between">
          <Link to="/"><img src={logoLight} alt="Shortify" className="h-9 w-auto dark:hidden" /><img src={logoDark} alt="Shortify" className="hidden h-9 w-auto dark:block" /></Link>
          <ThemeToggle />
        </div>
        <p className="text-xs font-semibold uppercase text-blue-600 dark:text-blue-400">{eyebrow}</p>
        <h1 className="mt-3 text-3xl font-semibold text-slate-950 dark:text-white">{title}</h1>
        <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">{description}</p>
        <div className="app-panel mt-7 rounded-lg border p-5 shadow-sm">
          {children}
        </div>
      </div>
    </section>
    <aside className="hidden border-l border-slate-200 bg-slate-50 p-10 dark:border-slate-800 dark:bg-slate-900 lg:flex lg:flex-col lg:justify-center">
      <div className="mx-auto w-full max-w-lg">
      <div>
        <p className="text-xs font-semibold uppercase text-blue-600 dark:text-blue-400">{isRegistration ? 'Built for focused teams' : 'Welcome back'}</p>
        <h2 className="mt-4 text-3xl font-semibold leading-tight text-slate-950 dark:text-white">{isRegistration ? 'Set up a dependable link workspace in minutes.' : 'Your links and insights, ready when you are.'}</h2>
        <p className="mt-4 text-sm leading-6 text-slate-600 dark:text-slate-400">Shortify keeps link creation, access controls, QR assets, and analytics in a single focused workspace.</p>
      </div>
      <div className="mt-8 grid gap-3">
        {highlights.map((item) => (
          <div key={item} className="app-panel flex items-center gap-3 rounded-lg border px-4 py-3 text-sm text-slate-700 shadow-sm dark:text-slate-300"><span className="h-2 w-2 rounded-full bg-blue-600" aria-hidden="true" />{item}</div>
        ))}
      </div>
      <div className="app-panel mt-8 rounded-lg border p-5 shadow-sm">
        <div className="flex items-center justify-between"><span className="text-sm font-semibold">Workspace overview</span><span className="text-xs text-emerald-600 dark:text-emerald-400">Secure</span></div>
        <div className="mt-4 grid grid-cols-3 gap-2"><span className="h-16 rounded-md bg-slate-100 dark:bg-slate-800" /><span className="h-16 rounded-md bg-slate-100 dark:bg-slate-800" /><span className="h-16 rounded-md bg-slate-100 dark:bg-slate-800" /></div>
      </div>
      </div>
    </aside>
  </main>
  );
};

export const PasswordStrength = ({ password }) => {
  const checks = [
    ['8+ characters', password.length >= 8],
    ['Uppercase', /[A-Z]/.test(password)],
    ['Lowercase', /[a-z]/.test(password)],
    ['Number', /\d/.test(password)]
  ];
  const passed = checks.filter(([, met]) => met).length;

  return (
    <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-950">
      <div className="grid grid-cols-4 gap-1">
        {checks.map(([label], index) => (
          <span key={label} className={`h-1.5 rounded-full ${index < passed ? 'bg-blue-600' : 'bg-slate-200 dark:bg-slate-800'}`} />
        ))}
      </div>
      <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
        {checks.map(([label, met]) => (
          <span key={label} className={met ? 'text-emerald-700 dark:text-emerald-300' : 'text-slate-500'}>{met ? '✓' : '✗'} {label}</span>
        ))}
      </div>
    </div>
  );
};

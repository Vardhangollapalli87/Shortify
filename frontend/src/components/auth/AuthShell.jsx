import { Link } from 'react-router-dom';
import logoLight from '../../assests/branding/logo-light.png';

export const AuthShell = ({ eyebrow, title, description, children }) => (
  <main className="grid min-h-screen bg-slate-950 text-slate-100 lg:grid-cols-[1fr_0.9fr]">
    <section className="flex min-h-screen items-center justify-center px-5 py-10">
      <div className="w-full max-w-md">
        <Link to="/" className="mb-10 inline-flex">
          <img src={logoLight} alt="Shortify" className="h-9 w-auto" />
        </Link>
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-300">{eyebrow}</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-white">{title}</h1>
        <p className="mt-2 text-sm leading-6 text-slate-400">{description}</p>
        <div className="mt-7 rounded-xl border border-slate-800 bg-slate-900 p-5 shadow-xl shadow-black/20">
          {children}
        </div>
      </div>
    </section>
    <aside className="hidden border-l border-slate-800 bg-slate-900 p-10 lg:flex lg:flex-col lg:justify-between">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-300">Trusted workspace</p>
        <h2 className="mt-4 max-w-xl text-4xl font-semibold leading-tight text-white">Manage secure links, QR assets, and analytics with one account.</h2>
      </div>
      <div className="grid gap-3">
        {['Email verification', 'Google OAuth', 'Refresh-token sessions', 'Resend transactional email'].map((item) => (
          <div key={item} className="rounded-lg border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-slate-300">{item}</div>
        ))}
      </div>
    </aside>
  </main>
);

export const PasswordStrength = ({ password }) => {
  const checks = [
    ['8+ characters', password.length >= 8],
    ['Uppercase', /[A-Z]/.test(password)],
    ['Lowercase', /[a-z]/.test(password)],
    ['Number', /\d/.test(password)]
  ];
  const passed = checks.filter(([, met]) => met).length;

  return (
    <div className="rounded-lg border border-slate-800 bg-slate-950 p-3">
      <div className="grid grid-cols-4 gap-1">
        {checks.map(([label], index) => (
          <span key={label} className={`h-1.5 rounded-full ${index < passed ? 'brand-gradient' : 'bg-slate-800'}`} />
        ))}
      </div>
      <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
        {checks.map(([label, met]) => (
          <span key={label} className={met ? 'text-emerald-300' : 'text-slate-500'}>{met ? '✓' : '✗'} {label}</span>
        ))}
      </div>
    </div>
  );
};

import { Link } from 'react-router-dom';
import logoLight from '../assests/branding/logo-light.png';
import iconLight from '../assests/branding/icon-light.png';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Feedback';

const features = [
  ['Branded links', 'Custom aliases, ownership, expiration, passwords, and QR assets in one workflow.'],
  ['Operational analytics', 'Track redirects, device mix, browsers, geography, referrers, and top links.'],
  ['Secure account layer', 'JWT sessions, Google OAuth, email verification, and account management.'],
  ['Production infrastructure', 'MongoDB Atlas, Redis Cloud, Render, Vercel, Docker, and Resend-ready email.']
];

const metrics = [
  ['Total clicks', '128.4K', '+18.2%'],
  ['Active links', '842', '+41'],
  ['QR scans', '19.7K', '+9.8%']
];

export default function Landing() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5">
        <Link to="/" className="flex items-center gap-3">
          <img src={logoLight} alt="Shortify" className="h-9 w-auto" />
        </Link>
        <div className="flex items-center gap-3">
          <Link to="/login" className="hidden text-sm font-medium text-slate-300 hover:text-white sm:block">Sign in</Link>
          <Button as={Link} to="/register" size="sm">Create account</Button>
        </div>
      </nav>

      <section className="mx-auto grid min-h-[calc(100vh-88px)] max-w-7xl items-center gap-12 px-5 py-10 lg:grid-cols-[0.95fr_1.05fr]">
        <div>
          <Badge tone="info">Production-grade link platform</Badge>
          <h1 className="mt-6 max-w-4xl text-4xl font-semibold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
            Short links, QR codes, and analytics for serious teams.
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-300">
            Shortify gives teams a focused workspace to ship branded links, protect destinations, understand traffic, and keep every redirect measurable.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button as={Link} to="/register" size="lg">Start building links</Button>
            <Button as={Link} to="/login" variant="secondary" size="lg">Open dashboard</Button>
          </div>
          <div className="mt-8 grid max-w-xl grid-cols-3 gap-3">
            {metrics.map(([label, value, delta]) => (
              <div key={label} className="rounded-xl border border-slate-800 bg-slate-900 p-4">
                <p className="text-xs text-slate-500">{label}</p>
                <p className="mt-2 text-2xl font-semibold text-white">{value}</p>
                <p className="mt-1 text-xs text-emerald-300">{delta}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="relative">
          <div className="rounded-xl border border-slate-800 bg-slate-900 shadow-2xl shadow-black/40">
            <div className="flex items-center justify-between border-b border-slate-800 px-5 py-4">
              <div className="flex items-center gap-3">
                <img src={iconLight} alt="" className="h-8 w-8" />
                <div>
                  <p className="text-sm font-semibold text-white">Campaign dashboard</p>
                  <p className="text-xs text-slate-500">shortify.app/s/product-launch</p>
                </div>
              </div>
              <Badge tone="success">Live</Badge>
            </div>
            <div className="grid gap-4 p-5">
              <div className="grid gap-4 sm:grid-cols-3">
                {metrics.map(([label, value]) => (
                  <div key={label} className="rounded-lg border border-slate-800 bg-slate-950 p-4">
                    <p className="text-xs text-slate-500">{label}</p>
                    <p className="mt-2 text-xl font-semibold text-white">{value}</p>
                  </div>
                ))}
              </div>
              <div className="rounded-lg border border-slate-800 bg-slate-950 p-5">
                <div className="flex h-40 items-end gap-2">
                  {[38, 52, 44, 68, 62, 80, 74, 92, 84, 100, 88, 112].map((height, index) => (
                    <div key={height + index} className="flex-1 rounded-t-md brand-gradient" style={{ height }} />
                  ))}
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-[1fr_140px]">
                <div className="rounded-lg border border-slate-800 bg-slate-950 p-4">
                  <p className="text-sm font-semibold text-white">Top destinations</p>
                  {['/launch', '/pricing', '/demo'].map((item, index) => (
                    <div key={item} className="mt-3 flex items-center justify-between text-sm">
                      <span className="text-slate-300">{item}</span>
                      <span className="text-slate-500">{3820 - index * 640} clicks</span>
                    </div>
                  ))}
                </div>
                <div className="grid place-items-center rounded-lg border border-slate-800 bg-white p-4">
                  <div className="grid h-24 w-24 grid-cols-6 gap-1">
                    {Array.from({ length: 36 }).map((_, index) => (
                      <span key={index} className={(index * 7) % 5 < 3 ? 'bg-slate-950' : 'bg-white'} />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-16">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {features.map(([title, description]) => (
            <article key={title} className="rounded-xl border border-slate-800 bg-slate-900 p-5">
              <h2 className="text-lg font-semibold text-white">{title}</h2>
              <p className="mt-3 text-sm leading-6 text-slate-400">{description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-5 px-5 py-10 lg:grid-cols-2">
        <div className="rounded-xl border border-slate-800 bg-slate-900 p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-300">Analytics</p>
          <h2 className="mt-3 text-2xl font-semibold text-white">See what every redirect is doing.</h2>
          <p className="mt-3 text-sm leading-6 text-slate-400">Break down link performance by time, geography, browser, device, operating system, and referrer.</p>
        </div>
        <div className="rounded-xl border border-slate-800 bg-slate-900 p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-300">QR workflow</p>
          <h2 className="mt-3 text-2xl font-semibold text-white">Generate QR assets where links live.</h2>
          <p className="mt-3 text-sm leading-6 text-slate-400">Preview, regenerate, download, and copy short URLs from the same management table.</p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-16">
        <div className="rounded-xl border border-slate-800 bg-slate-900 p-6 sm:p-8">
          <div className="grid gap-8 lg:grid-cols-[1fr_320px] lg:items-center">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-300">Pricing</p>
              <h2 className="mt-3 text-3xl font-semibold text-white">Simple plan for focused teams.</h2>
              <p className="mt-3 text-sm leading-6 text-slate-400">Start with the full workspace: links, QR codes, analytics, protected redirects, and account management.</p>
            </div>
            <div className="rounded-xl border border-slate-800 bg-slate-950 p-5">
              <p className="text-sm text-slate-400">Launch plan</p>
              <p className="mt-2 text-4xl font-semibold text-white">$19<span className="text-sm font-medium text-slate-500">/mo</span></p>
              <Button as={Link} to="/register" className="mt-5 w-full">Create account</Button>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-slate-800 px-5 py-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <img src={logoLight} alt="Shortify" className="h-8 w-auto" />
          <p>Built for production link operations.</p>
        </div>
      </footer>
    </main>
  );
}

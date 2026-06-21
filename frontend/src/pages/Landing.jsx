import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import logoLight from '../assests/branding/logo-light.png';
import logoDark from '../assests/branding/logo-dark.png';
import iconLight from '../assests/branding/icon-light.png';
import { ThemeToggle } from '../components/layout/ThemeToggle';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Feedback';
import { drawQrToCanvas } from '../lib/qrCode';

const features = [
  ['Branded links', 'Custom aliases, ownership, expiration, passwords, and QR assets in one workflow.'],
  ['Operational analytics', 'Track redirects, device mix, browsers, geography, referrers, and top links.'],
  ['Secure account layer', 'JWT sessions, Google OAuth, email verification, and account management.'],
  ['Production infrastructure', 'MongoDB Atlas, Redis Cloud, Render, Vercel, Docker, and Resend-ready email.']
];

const getLandingQrUrl = () => {
  const configuredUrl = import.meta.env.VITE_PUBLIC_APP_URL || import.meta.env.VITE_SHORT_LINK_BASE_URL;
  return (configuredUrl || 'https://shortify.app').replace(/\/$/, '');
};

const LandingQrCode = () => {
  const canvasRef = useRef(null);
  const [status, setStatus] = useState('loading');
  const qrUrl = useMemo(getLandingQrUrl, []);

  useEffect(() => {
    if (!canvasRef.current) return;

    let isMounted = true;
    setStatus('loading');

    drawQrToCanvas(canvasRef.current, qrUrl, {
      width: 168,
      margin: 3,
      color: { dark: '#171717', light: '#FFFFFF' }
    })
      .then(() => isMounted && setStatus('ready'))
      .catch(() => isMounted && setStatus('error'));

    return () => {
      isMounted = false;
    };
  }, [qrUrl]);

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-3 text-center shadow-sm dark:border-[#333333]">
      {status === 'error' ? (
        <div className="grid h-[168px] w-[168px] place-items-center rounded-md border border-red-200 bg-red-50 text-xs text-red-700">QR unavailable</div>
      ) : null}
      <canvas
        ref={canvasRef}
        className={status === 'error' ? 'hidden' : 'h-[168px] w-[168px]'}
        aria-label={`QR code for ${qrUrl}`}
      />
      <p className="mt-3 text-xs font-medium text-neutral-700">Scan to visit Shortify</p>
    </div>
  );
};

export default function Landing() {
  return (
    <main className="min-h-screen bg-white text-slate-950 dark:bg-slate-950 dark:text-slate-100">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5" aria-label="Primary">
        <Link to="/" className="flex items-center gap-3">
          <img src={logoLight} alt="Shortify" className="h-9 w-auto dark:hidden" />
          <img src={logoDark} alt="Shortify" className="hidden h-9 w-auto dark:block" />
        </Link>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <Link to="/login" className="hidden text-sm font-medium text-slate-600 hover:text-slate-950 dark:text-slate-300 dark:hover:text-white sm:block">Sign in</Link>
          <Button as={Link} to="/register" size="sm">Create account</Button>
        </div>
      </nav>

      <section className="mx-auto grid min-h-[calc(100vh-88px)] max-w-7xl items-center gap-12 px-5 py-10 lg:grid-cols-[0.92fr_1.08fr] lg:py-16">
        <div>
          <Badge tone="info">Production-grade link platform</Badge>
          <h1 className="mt-6 max-w-4xl text-4xl font-semibold leading-tight text-slate-950 dark:text-white sm:text-5xl lg:text-6xl">
            A clearer way to manage every link.
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600 dark:text-slate-300">
            Shortify gives teams a focused workspace to ship branded links, protect destinations, understand traffic, and keep every redirect measurable.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button as={Link} to="/register" size="lg">Start building links</Button>
            <Button as={Link} to="/login" variant="secondary" size="lg">Open dashboard</Button>
          </div>
          <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm text-slate-600 dark:text-slate-400">
            <span>Custom short links</span><span>Password protection</span><span>Actionable analytics</span>
          </div>
        </div>

        <div className="relative">
          <div className="app-panel rounded-lg border shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800 px-5 py-4">
              <div className="flex items-center gap-3">
                <img src={iconLight} alt="" className="h-8 w-8" />
                <div>
                  <p className="text-sm font-semibold text-slate-950 dark:text-white">Link workspace</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Organized, secure, and measurable</p>
                </div>
              </div>
              <Badge tone="success">Live</Badge>
            </div>
            <div className="grid gap-4 p-5">
              <div className="grid gap-4 sm:grid-cols-3">
                {['Create branded links', 'Control link access', 'Understand engagement'].map((label) => (
                  <div key={label} className="rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950"><p className="text-sm font-medium text-slate-700 dark:text-slate-200">{label}</p></div>
                ))}
              </div>
              <div className="grid gap-4 sm:grid-cols-[1fr_196px]">
                <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-[#333333] dark:bg-[#212121]">
                  <p className="text-sm font-semibold text-slate-950 dark:text-white">Managed links</p>
                  {['/product-launch', '/customer-guide', '/event-registration'].map((item) => (
                    <div key={item} className="mt-3 flex items-center justify-between text-sm">
                      <span className="text-neutral-700 dark:text-[#A3A3A3]">{item}</span>
                      <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800 dark:bg-green-900/30 dark:text-green-300">Active</span>
                    </div>
                  ))}
                </div>
                <LandingQrCode />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="mx-auto max-w-7xl px-5 py-16">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {features.map(([title, description]) => (
            <article key={title} className="app-panel rounded-lg border p-5 shadow-sm">
              <h2 className="text-lg font-semibold text-slate-950 dark:text-white">{title}</h2>
              <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-400">{description}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="documentation" className="mx-auto grid max-w-7xl gap-5 px-5 py-10 lg:grid-cols-2">
        <div className="app-panel rounded-lg border p-6">
          <p className="text-xs font-semibold uppercase text-blue-600 dark:text-blue-400">Analytics</p>
          <h2 className="mt-3 text-2xl font-semibold text-slate-950 dark:text-white">See what every redirect is doing.</h2>
          <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-400">Break down link performance by time, geography, browser, device, operating system, and referrer.</p>
        </div>
        <div className="app-panel rounded-lg border p-6">
          <p className="text-xs font-semibold uppercase text-blue-600 dark:text-blue-400">QR workflow</p>
          <h2 className="mt-3 text-2xl font-semibold text-slate-950 dark:text-white">Generate QR assets where links live.</h2>
          <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-400">Preview, regenerate, download, and copy short URLs from the same management table.</p>
        </div>
      </section>

      <section id="pricing" className="mx-auto max-w-7xl px-5 py-16">
        <div className="rounded-lg border border-blue-200 bg-blue-50 p-6 dark:border-blue-900 dark:bg-blue-950 sm:p-8">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase text-blue-700 dark:text-blue-300">Get started</p>
              <h2 className="mt-3 text-3xl font-semibold text-slate-950 dark:text-white">Bring clarity to your link workflow.</h2>
              <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">Create a workspace for short links, QR codes, access controls, and analytics.</p>
            </div>
            <Button as={Link} to="/register" size="lg" className="shrink-0">Create account</Button>
          </div>
        </div>
      </section>

      <footer className="border-t border-slate-200 px-5 py-8 dark:border-[#333333]">
        <div className="mx-auto grid max-w-7xl gap-8 text-sm text-neutral-600 dark:text-[#A3A3A3] md:grid-cols-[1.2fr_1fr_1fr]">
          <div>
            <img src={logoLight} alt="Shortify" className="h-8 w-auto dark:hidden" />
            <img src={logoDark} alt="Shortify" className="hidden h-8 w-auto dark:block" />
            <p className="mt-3 max-w-sm leading-6">Professional link management, analytics, and QR workflows.</p>
          </div>
          <nav aria-label="Footer links" className="grid grid-cols-2 gap-3">
            <a href="#features" className="hover:text-slate-950 dark:hover:text-white">Features</a>
            <a href="#pricing" className="hover:text-slate-950 dark:hover:text-white">Pricing</a>
            <a href="#documentation" className="hover:text-slate-950 dark:hover:text-white">Documentation</a>
            <Link to="/dashboard" className="hover:text-slate-950 dark:hover:text-white">Dashboard</Link>
          </nav>
          <div id="legal" className="flex flex-col gap-3 md:items-end">
            <div className="flex gap-4">
              <a href="#legal" className="hover:text-slate-950 dark:hover:text-white">Privacy Policy</a>
              <a href="#legal" className="hover:text-slate-950 dark:hover:text-white">Terms of Service</a>
            </div>
            <p>&copy; 2026 Shortify. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </main>
  );
}

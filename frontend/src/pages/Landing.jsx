import { Link } from 'react-router-dom';

const features = [
  ['Branded short links', 'Create custom aliases, manage destinations, and keep ownership in one workspace.'],
  ['Reliable redirects', 'Redis-first lookups and MongoDB fallback keep links fast and resilient.'],
  ['Actionable analytics', 'Track clicks, visitors, devices, browsers, countries, and top-performing links.']
];

export default function Landing() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <section className="mx-auto grid min-h-[88vh] max-w-6xl content-center gap-10 px-6 py-16">
        <div className="max-w-3xl">
          <p className="text-sm uppercase tracking-[0.35em] text-cyan-300">Shortify</p>
          <h1 className="mt-5 text-4xl font-semibold leading-tight text-white md:text-6xl">Short links built for teams that need more than a redirect.</h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-300">
            Create branded links, protect sensitive destinations, and understand every click from a focused SaaS workspace.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link to="/register" className="rounded-xl bg-cyan-400 px-5 py-3 font-semibold text-slate-950 shadow-lg shadow-cyan-400/10">Create account</Link>
            <Link to="/login" className="rounded-xl border border-slate-700 bg-slate-900 px-5 py-3 font-semibold text-white hover:border-slate-500">Sign in</Link>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {features.map(([title, description]) => (
            <article key={title} className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 shadow-xl shadow-black/20">
              <h2 className="text-lg font-semibold text-white">{title}</h2>
              <p className="mt-2 text-sm leading-6 text-slate-300">{description}</p>
            </article>
          ))}
        </div>

        <section className="rounded-2xl border border-cyan-400/20 bg-cyan-400/10 p-5 text-sm text-cyan-50">
          Launch-ready essentials are in place: authentication, Google OAuth, URL management, protected links, redirects, and analytics.
        </section>
      </section>
    </main>
  );
}

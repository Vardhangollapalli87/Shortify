import { Link } from 'react-router-dom';

export default function Landing() {
  return (
    <main className="min-h-screen px-6 py-16 text-slate-100">
      <div className="mx-auto flex min-h-[80vh] max-w-5xl flex-col justify-center gap-8 rounded-3xl border border-slate-800 bg-slate-900/70 p-10 shadow-2xl shadow-black/30">
        <p className="text-sm uppercase tracking-[0.35em] text-cyan-300">Shortify</p>
        <h1 className="max-w-2xl text-4xl font-semibold md:text-6xl">Frontend foundation for the SaaS dashboard is ready.</h1>
        <p className="max-w-2xl text-slate-300">This phase adds the app shell, routing, auth context, protected layout, axios client, and TanStack Query wiring without building dashboard UI yet.</p>
        <div className="flex flex-wrap gap-4">
          <Link to="/register" className="rounded-xl bg-cyan-400 px-5 py-3 font-semibold text-slate-950">Create account</Link>
          <Link to="/login" className="rounded-xl border border-slate-700 bg-slate-800 px-5 py-3 font-semibold text-white">Sign in</Link>
        </div>
      </div>
    </main>
  );
}

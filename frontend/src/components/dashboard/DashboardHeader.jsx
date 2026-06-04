export const DashboardHeader = () => (
  <header className="rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 p-8 shadow-2xl shadow-black/30">
    <p className="text-sm uppercase tracking-[0.35em] text-cyan-300">Dashboard</p>
    <div className="mt-3 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
      <div>
        <h1 className="text-3xl font-semibold text-white md:text-4xl">Link performance</h1>
        <p className="mt-2 max-w-2xl text-slate-300">
          Track workspace growth, total engagement, unique visitors, and the links driving the most traffic.
        </p>
      </div>
      <div className="rounded-2xl border border-emerald-500/20 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-100">
        Live workspace analytics
      </div>
    </div>
  </header>
);

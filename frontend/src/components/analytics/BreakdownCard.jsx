export const BreakdownCard = ({ title, subtitle, items = [], accent = 'cyan' }) => {
  const accentMap = {
    cyan: 'from-cyan-400/10 to-cyan-400/0 border-cyan-400/20 text-cyan-100',
    emerald: 'from-emerald-400/10 to-emerald-400/0 border-emerald-400/20 text-emerald-100',
    violet: 'from-violet-400/10 to-violet-400/0 border-violet-400/20 text-violet-100',
    amber: 'from-amber-400/10 to-amber-400/0 border-amber-400/20 text-amber-100'
  };

  return (
    <article className="rounded-xl border border-slate-800 bg-slate-900/90 p-5 shadow-xl shadow-black/20">
      <div className="mb-5 flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-300">Breakdown</p>
          <h3 className="mt-2 text-xl font-semibold text-white">{title}</h3>
          <p className="mt-2 text-sm leading-6 text-slate-400">{subtitle}</p>
        </div>
        <span className={`rounded-full border bg-gradient-to-r ${accentMap[accent] || accentMap.cyan} px-2.5 py-1 text-xs font-semibold uppercase tracking-[0.14em]`}>{items.length} items</span>
      </div>

      <div className="space-y-3">
        {items.length === 0 ? (
          <div className="rounded-lg border border-dashed border-slate-700 bg-slate-950 p-4 text-sm text-slate-400">No breakdown metrics are available yet.</div>
        ) : (
          items.slice(0, 6).map((item) => (
            <div key={`${title}-${item.value}`} className="rounded-lg border border-slate-800 bg-slate-950 p-4">
              <div className="mb-2 flex items-center justify-between gap-3 text-sm">
                <span className="truncate text-slate-100">{item.value}</span>
                <span className="text-slate-300">{item.count} clicks</span>
              </div>
              <div className="h-2 rounded-full bg-slate-800">
                <div className="h-2 rounded-full bg-gradient-to-r from-cyan-400 to-emerald-400" style={{ width: `${Math.min(item.percentage || 0, 100)}%` }} />
              </div>
              <p className="mt-2 text-xs uppercase tracking-[0.14em] text-slate-500">{item.percentage ?? 0}% of traffic</p>
            </div>
          ))
        )}
      </div>
    </article>
  );
};

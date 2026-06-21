export const BreakdownCard = ({ title, subtitle, items = [], accent = 'blue' }) => {
  const accentMap = { blue: 'border-blue-200 text-blue-700 dark:border-blue-800 dark:text-blue-300', emerald: 'border-emerald-200 text-emerald-700 dark:border-emerald-800 dark:text-emerald-300', violet: 'border-violet-200 text-violet-700 dark:border-violet-800 dark:text-violet-300', amber: 'border-amber-200 text-amber-700 dark:border-amber-800 dark:text-amber-300' };

  return (
    <article className="app-panel rounded-lg border p-5 shadow-sm">
      <div className="mb-5 flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase text-blue-600 dark:text-blue-400">Breakdown</p>
          <h3 className="mt-2 text-xl font-semibold text-slate-950 dark:text-white">{title}</h3>
          <p className="mt-2 text-sm leading-6 text-slate-400">{subtitle}</p>
        </div>
        <span className={`rounded-full border px-2.5 py-1 text-xs font-semibold ${accentMap[accent] || accentMap.blue}`}>{items.length} items</span>
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
                <div className="h-2 rounded-full bg-blue-600" style={{ width: `${Math.min(item.percentage || 0, 100)}%` }} />
              </div>
              <p className="mt-2 text-xs uppercase tracking-[0.14em] text-slate-500">{item.percentage ?? 0}% of traffic</p>
            </div>
          ))
        )}
      </div>
    </article>
  );
};

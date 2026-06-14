const alertStyles = {
  info: 'border-cyan-400/30 bg-cyan-400/10 text-cyan-100',
  success: 'border-emerald-400/30 bg-emerald-400/10 text-emerald-100',
  warning: 'border-amber-400/30 bg-amber-400/10 text-amber-100',
  error: 'border-rose-400/30 bg-rose-400/10 text-rose-100'
};

const badgeStyles = {
  neutral: 'border-slate-700 bg-slate-950 text-slate-300',
  info: 'border-cyan-400/30 bg-cyan-400/10 text-cyan-100',
  success: 'border-emerald-400/30 bg-emerald-400/10 text-emerald-100',
  warning: 'border-amber-400/30 bg-amber-400/10 text-amber-100',
  danger: 'border-rose-400/30 bg-rose-400/10 text-rose-100',
  violet: 'border-indigo-400/30 bg-indigo-400/10 text-indigo-100'
};

export const Alert = ({ tone = 'info', children, className = '' }) => (
  <div className={`rounded-lg border px-4 py-3 text-sm leading-6 ${alertStyles[tone]} ${className}`} role={tone === 'error' ? 'alert' : 'status'}>
    {children}
  </div>
);

export const Badge = ({ tone = 'neutral', children, className = '' }) => (
  <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold uppercase tracking-[0.16em] ${badgeStyles[tone]} ${className}`}>
    {children}
  </span>
);

export const EmptyState = ({ title, description, action }) => (
  <div className="rounded-xl border border-dashed border-slate-700 bg-slate-900/70 p-8 text-center">
    <h3 className="text-lg font-semibold text-white">{title}</h3>
    <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-slate-400">{description}</p>
    {action ? <div className="mt-5">{action}</div> : null}
  </div>
);

export const Skeleton = ({ className = '' }) => (
  <div className={`animate-pulse rounded-lg bg-slate-800/80 ${className}`} />
);

export const AnalyticsHeader = ({ title, subtitle, tone = 'cyan' }) => {
  const toneClassMap = {
    cyan: 'text-cyan-300',
    emerald: 'text-emerald-300',
    violet: 'text-violet-300',
    amber: 'text-amber-300'
  };

  return (
    <header className="rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 p-8 shadow-2xl shadow-black/30">
      <p className={`text-sm uppercase tracking-[0.35em] ${toneClassMap[tone] || toneClassMap.cyan}`}>Analytics</p>
      <h1 className="mt-3 text-3xl font-semibold text-white">{title}</h1>
      <p className="mt-2 max-w-3xl text-slate-300">{subtitle}</p>
    </header>
  );
};

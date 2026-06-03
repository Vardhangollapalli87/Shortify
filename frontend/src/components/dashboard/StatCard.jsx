export const StatCard = ({ label, value, hint, accent = 'cyan' }) => {
  const accentClasses = {
    cyan: 'from-cyan-400/10 to-slate-900 text-cyan-100 border-cyan-400/20',
    emerald: 'from-emerald-400/10 to-slate-900 text-emerald-100 border-emerald-400/20',
    violet: 'from-violet-400/10 to-slate-900 text-violet-100 border-violet-400/20',
    amber: 'from-amber-400/10 to-slate-900 text-amber-100 border-amber-400/20'
  };

  return (
    <article className={`rounded-3xl border bg-gradient-to-br ${accentClasses[accent]} p-6 shadow-xl shadow-black/20`}>
      <p className="text-sm uppercase tracking-[0.25em] text-slate-300">{label}</p>
      <p className="mt-4 text-3xl font-semibold text-white">{value}</p>
      <p className="mt-2 text-sm text-slate-300">{hint}</p>
    </article>
  );
};

export const StatCard = ({ label, value, hint, accent = 'blue' }) => {
  const accentClasses = {
    blue: 'text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800',
    emerald: 'from-emerald-400/10 to-slate-900 text-emerald-100 border-emerald-400/20',
    violet: 'from-violet-400/10 to-slate-900 text-violet-100 border-violet-400/20',
    amber: 'from-amber-400/10 to-slate-900 text-amber-100 border-amber-400/20'
  };

  return (
    <article className={`rounded-lg border bg-white p-6 shadow-sm dark:bg-[#262626] ${accentClasses[accent] || accentClasses.blue}`}>
      <p className="text-sm uppercase tracking-[0.25em] text-slate-300">{label}</p>
      <p className="mt-4 break-words text-3xl font-semibold text-white">{value}</p>
      <p className="mt-2 text-sm text-slate-300">{hint}</p>
    </article>
  );
};

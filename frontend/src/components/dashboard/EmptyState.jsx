export const EmptyState = ({ title, description }) => (
  <section className="rounded-3xl border border-dashed border-slate-700 bg-slate-900/70 p-10 text-center shadow-2xl shadow-black/20">
    <p className="text-sm uppercase text-blue-600 dark:text-blue-400">No activity yet</p>
    <h2 className="mt-3 text-2xl font-semibold text-white">{title}</h2>
    <p className="mt-2 text-slate-300">{description}</p>
  </section>
);

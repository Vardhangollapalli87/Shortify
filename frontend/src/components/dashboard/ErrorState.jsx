export const ErrorState = ({ message }) => (
  <section className="rounded-3xl border border-rose-500/30 bg-rose-500/10 p-8 text-rose-100 shadow-2xl shadow-black/20">
    <p className="text-sm uppercase tracking-[0.35em] text-rose-200">Analytics unavailable</p>
    <h2 className="mt-3 text-2xl font-semibold text-white">Unable to load dashboard stats</h2>
    <p className="mt-2 text-rose-100/90">{message}</p>
  </section>
);

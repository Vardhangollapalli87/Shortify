export const StatusBadge = ({ isActive }) => (
  <span
    className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] ${
      isActive
        ? 'border-emerald-500/30 bg-emerald-400/10 text-emerald-100'
        : 'border-amber-500/30 bg-amber-400/10 text-amber-100'
    }`}
  >
    {isActive ? 'Active' : 'Inactive'}
  </span>
);

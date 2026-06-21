export const StatusBadge = ({ isActive }) => (
  <span
    className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold ${
      isActive
        ? 'border-green-200 bg-green-100 text-green-800 dark:border-green-900 dark:bg-green-900/30 dark:text-green-300'
        : 'border-neutral-300 bg-neutral-200 text-neutral-700 dark:border-neutral-700 dark:bg-neutral-700 dark:text-neutral-200'
    }`}
  >
    {isActive ? 'Active' : 'Disabled'}
  </span>
);

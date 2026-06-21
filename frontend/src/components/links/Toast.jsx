export const Toast = ({ message, tone = 'info' }) => {
  const toneClasses = {
    success: 'border-emerald-200 bg-white text-emerald-800 dark:border-emerald-800 dark:bg-slate-900 dark:text-emerald-200',
    error: 'border-red-200 bg-white text-red-800 dark:border-red-800 dark:bg-slate-900 dark:text-red-200',
    warning: 'border-amber-200 bg-white text-amber-800 dark:border-amber-800 dark:bg-slate-900 dark:text-amber-200',
    info: 'border-blue-200 bg-white text-blue-800 dark:border-blue-800 dark:bg-slate-900 dark:text-blue-200'
  };

  return (
    <div className={`pointer-events-none fixed inset-x-4 bottom-4 z-[60] rounded-lg border px-4 py-3 text-sm shadow-lg sm:inset-x-auto sm:right-5 sm:max-w-sm ${toneClasses[tone] || toneClasses.info}`} role={tone === 'error' ? 'alert' : 'status'} aria-live="polite">
      {message}
    </div>
  );
};

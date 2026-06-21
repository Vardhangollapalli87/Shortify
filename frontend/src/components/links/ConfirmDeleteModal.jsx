export const ConfirmDeleteModal = ({ isOpen, link, onClose, onConfirm }) => {
  if (!isOpen || !link) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <div className="app-panel w-full max-w-md rounded-lg border p-6 shadow-xl" role="dialog" aria-modal="true" aria-labelledby="delete-link-title">
        <p className="text-xs font-semibold uppercase text-red-600 dark:text-red-400">Delete link</p>
        <h2 id="delete-link-title" className="mt-2 text-2xl font-semibold text-slate-950 dark:text-white">Remove this short link?</h2>
        <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">This action will permanently delete /{link.shortCode} and cannot be undone.</p>
        <div className="mt-6 flex justify-end gap-3">
          <button type="button" onClick={onClose} className="rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100">Cancel</button>
          <button type="button" onClick={onConfirm} className="rounded-lg bg-red-600 px-4 py-3 text-sm font-semibold text-white hover:bg-red-700">Delete</button>
        </div>
      </div>
    </div>
  );
};

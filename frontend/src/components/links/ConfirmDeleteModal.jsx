export const ConfirmDeleteModal = ({ isOpen, link, onClose, onConfirm }) => {
  if (!isOpen || !link) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-3xl border border-slate-800 bg-slate-950 p-6 shadow-2xl shadow-black/40">
        <p className="text-sm uppercase tracking-[0.35em] text-rose-300">Delete link</p>
        <h2 className="mt-2 text-2xl font-semibold text-white">Remove this short link?</h2>
        <p className="mt-3 text-sm text-slate-300">This action will permanently delete /{link.shortCode} and cannot be undone.</p>
        <div className="mt-6 flex justify-end gap-3">
          <button type="button" onClick={onClose} className="rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm font-semibold text-slate-100">Cancel</button>
          <button type="button" onClick={onConfirm} className="rounded-xl bg-rose-500 px-4 py-3 text-sm font-semibold text-white">Delete</button>
        </div>
      </div>
    </div>
  );
};

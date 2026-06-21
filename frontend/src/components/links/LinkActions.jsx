export const LinkActions = ({ onEdit, onDelete, onToggle, onView, onQr, isActive }) => (
  <div className="flex flex-wrap items-center gap-1.5" aria-label="Link actions">
    <button type="button" onClick={onView} className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:hover:bg-slate-800">View</button>
    <button type="button" onClick={onQr} className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:hover:bg-slate-800" aria-label="View QR code">QR</button>
    <button type="button" onClick={onEdit} className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:hover:bg-slate-800">Edit</button>
    <button type="button" onClick={onToggle} className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:hover:bg-slate-800">{isActive ? 'Disable' : 'Enable'}</button>
    <button type="button" onClick={onDelete} className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs font-semibold text-red-700 hover:bg-red-100 dark:border-red-900 dark:bg-red-950 dark:text-red-300">Delete</button>
  </div>
);

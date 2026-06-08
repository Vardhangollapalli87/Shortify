export const LinkActions = ({ onEdit, onDelete, onToggle, onView, onQr, isActive }) => (
  <div className="flex flex-wrap items-center gap-2">
    <button type="button" onClick={onView} className="rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-slate-100 hover:border-cyan-400/40 hover:text-cyan-100">View</button>
    <button type="button" onClick={onQr} className="rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-slate-100 hover:border-cyan-400/40 hover:text-cyan-100">QR</button>
    <button type="button" onClick={onEdit} className="rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-slate-100 hover:border-cyan-400/40 hover:text-cyan-100">Edit</button>
    <button type="button" onClick={onToggle} className="rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-slate-100 hover:border-emerald-400/40 hover:text-emerald-100">{isActive ? 'Disable' : 'Enable'}</button>
    <button type="button" onClick={onDelete} className="rounded-xl border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-rose-100 hover:bg-rose-500/20">Delete</button>
  </div>
);

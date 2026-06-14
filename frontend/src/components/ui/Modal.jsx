export const Modal = ({ title, eyebrow, children, footer, onClose, maxWidth = 'max-w-xl' }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 p-4" role="dialog" aria-modal="true" aria-labelledby="modal-title">
    <div className={`max-h-[92vh] w-full overflow-y-auto rounded-xl border border-slate-800 bg-slate-950 shadow-2xl shadow-black/50 ${maxWidth}`}>
      <div className="flex items-start justify-between gap-4 border-b border-slate-800 p-5">
        <div>
          {eyebrow ? <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-300">{eyebrow}</p> : null}
          <h2 id="modal-title" className="mt-1 text-xl font-semibold text-white">{title}</h2>
        </div>
        <button type="button" onClick={onClose} className="rounded-lg border border-slate-700 px-3 py-1.5 text-sm text-slate-300 transition hover:border-slate-500 hover:text-white">
          Close
        </button>
      </div>
      <div className="p-5">{children}</div>
      {footer ? <div className="border-t border-slate-800 p-5">{footer}</div> : null}
    </div>
  </div>
);

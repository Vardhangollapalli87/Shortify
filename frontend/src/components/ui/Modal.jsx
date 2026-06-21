export const Modal = ({ title, eyebrow, children, footer, onClose, maxWidth = 'max-w-xl' }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4" role="dialog" aria-modal="true" aria-labelledby="modal-title" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
    <div className={`app-panel max-h-[92vh] w-full overflow-y-auto rounded-lg border shadow-xl ${maxWidth}`}>
      <div className="flex items-start justify-between gap-4 border-b border-slate-200 p-5 dark:border-slate-800">
        <div>
          {eyebrow ? <p className="text-xs font-semibold uppercase text-blue-600 dark:text-blue-400">{eyebrow}</p> : null}
          <h2 id="modal-title" className="mt-1 text-xl font-semibold text-slate-950 dark:text-white">{title}</h2>
        </div>
        <button type="button" onClick={onClose} className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800" aria-label="Close dialog">
          Close
        </button>
      </div>
      <div className="p-5">{children}</div>
      {footer ? <div className="border-t border-slate-200 p-5 dark:border-slate-800">{footer}</div> : null}
    </div>
  </div>
);

export const PageHeader = ({ eyebrow, title, description, action, meta }) => (
  <header className="rounded-xl border border-slate-800 bg-slate-900/90 p-5 shadow-xl shadow-black/20 sm:p-6">
    <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
      <div>
        {eyebrow ? <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-300">{eyebrow}</p> : null}
        <h1 className="mt-2 text-2xl font-semibold tracking-tight text-white sm:text-3xl">{title}</h1>
        {description ? <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-400 sm:text-base">{description}</p> : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
    {meta ? <p className="mt-4 text-sm text-slate-400">{meta}</p> : null}
  </header>
);

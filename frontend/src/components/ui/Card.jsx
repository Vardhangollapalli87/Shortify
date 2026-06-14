export const Card = ({ children, className = '', as: Component = 'section' }) => (
  <Component className={`rounded-xl border border-slate-800 bg-slate-900/90 shadow-xl shadow-black/20 ${className}`}>
    {children}
  </Component>
);

export const CardHeader = ({ eyebrow, title, description, action }) => (
  <div className="flex flex-col gap-4 border-b border-slate-800 p-5 sm:flex-row sm:items-start sm:justify-between">
    <div>
      {eyebrow ? <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-300">{eyebrow}</p> : null}
      {title ? <h2 className="mt-2 text-xl font-semibold tracking-tight text-white">{title}</h2> : null}
      {description ? <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">{description}</p> : null}
    </div>
    {action ? <div className="shrink-0">{action}</div> : null}
  </div>
);

export const CardBody = ({ children, className = '' }) => (
  <div className={`p-5 ${className}`}>{children}</div>
);

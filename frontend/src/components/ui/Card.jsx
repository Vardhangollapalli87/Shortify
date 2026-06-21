export const Card = ({ children, className = '', as: Component = 'section' }) => (
  <Component className={`app-panel rounded-lg border shadow-sm ${className}`}>
    {children}
  </Component>
);

export const CardHeader = ({ eyebrow, title, description, action }) => (
  <div className="flex flex-col gap-4 border-b border-slate-200 p-5 dark:border-slate-800 sm:flex-row sm:items-start sm:justify-between">
    <div>
      {eyebrow ? <p className="text-xs font-semibold uppercase text-blue-600 dark:text-blue-400">{eyebrow}</p> : null}
      {title ? <h2 className="mt-2 text-xl font-semibold text-slate-950 dark:text-white">{title}</h2> : null}
      {description ? <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600 dark:text-slate-400">{description}</p> : null}
    </div>
    {action ? <div className="shrink-0">{action}</div> : null}
  </div>
);

export const CardBody = ({ children, className = '' }) => (
  <div className={`p-5 ${className}`}>{children}</div>
);

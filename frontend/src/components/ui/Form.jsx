const baseControl = 'w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-slate-100 transition placeholder:text-slate-500 focus:border-cyan-400';

export const Field = ({ label, hint, error, children }) => (
  <label className="block space-y-2 text-sm text-slate-200">
    <span className="font-medium">{label}</span>
    {children}
    {hint && !error ? <span className="block text-xs leading-5 text-slate-500">{hint}</span> : null}
    {error ? <span className="block text-xs leading-5 text-rose-300">{error}</span> : null}
  </label>
);

export const Input = ({ className = '', ...props }) => (
  <input className={`${baseControl} ${className}`} {...props} />
);

export const Textarea = ({ className = '', ...props }) => (
  <textarea className={`${baseControl} min-h-28 resize-y ${className}`} {...props} />
);

export const Select = ({ className = '', children, ...props }) => (
  <select className={`${baseControl} ${className}`} {...props}>
    {children}
  </select>
);

const variants = {
  primary: 'brand-gradient text-white shadow-lg shadow-blue-950/30 hover:brightness-110',
  secondary: 'border border-slate-700 bg-slate-900 text-slate-100 hover:border-slate-500 hover:bg-slate-800',
  ghost: 'text-slate-300 hover:bg-slate-900 hover:text-white',
  danger: 'bg-rose-600 text-white hover:bg-rose-500',
  subtle: 'border border-slate-800 bg-slate-950 text-slate-200 hover:border-slate-700'
};

const sizes = {
  sm: 'px-3 py-2 text-xs',
  md: 'px-4 py-2.5 text-sm',
  lg: 'px-5 py-3 text-sm'
};

export const Button = ({ as: Component = 'button', variant = 'primary', size = 'md', className = '', children, ...props }) => (
  <Component
    className={`inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition disabled:cursor-not-allowed disabled:opacity-60 ${variants[variant]} ${sizes[size]} ${className}`}
    {...props}
  >
    {children}
  </Component>
);

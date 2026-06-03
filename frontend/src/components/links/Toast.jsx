export const Toast = ({ message, tone = 'info' }) => {
  const toneClasses = {
    success: 'border-emerald-400/30 bg-emerald-400/10 text-emerald-100',
    error: 'border-rose-400/30 bg-rose-400/10 text-rose-100',
    info: 'border-cyan-400/30 bg-cyan-400/10 text-cyan-100'
  };

  return (
    <div className={`pointer-events-none fixed right-4 top-4 z-[60] rounded-2xl border px-4 py-3 text-sm shadow-2xl shadow-black/30 ${toneClasses[tone]}`}>
      {message}
    </div>
  );
};

const formatDate = (value) => {
  if (!value) return '—';

  return new Date(value).toLocaleDateString('en', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
};

export const TopLinksTable = ({ links }) => (
  <section className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 shadow-2xl shadow-black/20">
    <div className="mb-6 flex items-center justify-between gap-4">
      <div>
        <p className="text-sm uppercase text-blue-600 dark:text-blue-400">Top links</p>
        <h2 className="mt-2 text-xl font-semibold text-white">Your strongest performing short links</h2>
      </div>
      <span className="rounded-full border border-slate-700 bg-slate-950 px-3 py-1 text-xs uppercase tracking-[0.3em] text-slate-300">Top 10</span>
    </div>

    <div className="overflow-x-auto rounded-2xl border border-slate-800">
      <table className="min-w-full divide-y divide-slate-800 text-left text-sm text-slate-200">
        <thead className="bg-slate-950/90 text-slate-300">
          <tr>
            <th className="px-4 py-3 font-medium">Short Code</th>
            <th className="px-4 py-3 font-medium">Original URL</th>
            <th className="px-4 py-3 font-medium">Click Count</th>
            <th className="px-4 py-3 font-medium">Created Date</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800 bg-slate-900/70">
          {links.map((link) => (
            <tr key={link.id} className="hover:bg-slate-800/70">
              <td className="px-4 py-4 font-semibold text-blue-700 dark:text-blue-300">/{link.shortCode}</td>
              <td className="max-w-xs px-4 py-4 text-slate-300">{link.originalUrl}</td>
              <td className="px-4 py-4 text-white">{link.totalClicks}</td>
              <td className="px-4 py-4 text-slate-300">{formatDate(link.createdAt)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </section>
);

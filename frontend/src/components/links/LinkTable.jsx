import { LinkRow } from './LinkRow';

export const LinkTable = ({ links, onEdit, onDelete, onToggle, onView, onCopy, onCopyError }) => (
  <section className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 shadow-2xl shadow-black/20">
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div>
        <p className="text-sm uppercase tracking-[0.35em] text-cyan-300">Links</p>
        <h2 className="mt-2 text-xl font-semibold text-white">Your short links</h2>
        <p className="mt-2 text-sm text-slate-300">Create, edit, protect, and manage links from one protected workspace.</p>
      </div>
      <span className="rounded-full border border-slate-700 bg-slate-950 px-3 py-1 text-xs uppercase tracking-[0.3em] text-slate-300">{links.length} total</span>
    </div>

    <div className="overflow-x-auto rounded-2xl border border-slate-800">
      <table className="min-w-full divide-y divide-slate-800 text-left text-sm text-slate-200">
        <thead className="bg-slate-950/90 text-slate-300">
          <tr>
            <th className="px-4 py-3 font-medium">Link</th>
            <th className="px-4 py-3 font-medium">Original URL</th>
            <th className="px-4 py-3 font-medium">Status</th>
            <th className="px-4 py-3 font-medium">Clicks</th>
            <th className="px-4 py-3 font-medium">Created</th>
            <th className="px-4 py-3 font-medium">Expires</th>
            <th className="px-4 py-3 font-medium">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800 bg-slate-900/70">
          {links.map((link) => (
            <LinkRow
              key={link.id}
              link={link}
              onEdit={() => onEdit(link)}
              onDelete={() => onDelete(link)}
              onToggle={() => onToggle(link)}
              onView={() => onView(link)}
              onCopy={onCopy}
              onCopyError={onCopyError}
            />
          ))}
        </tbody>
      </table>
    </div>
  </section>
);

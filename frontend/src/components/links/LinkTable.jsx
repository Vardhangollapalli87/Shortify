import { buildShortLink } from '../../lib/shortLinks';
import { formatLocalDateTime } from '../../lib/dateTime';
import { Badge } from '../ui/Feedback';
import { CopyButton } from './CopyButton';
import { LinkActions } from './LinkActions';
import { LinkRow } from './LinkRow';
import { StatusBadge } from './StatusBadge';

const formatDate = (value) => {
  if (!value) return 'Not available';

  return new Date(value).toLocaleDateString('en', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
};

const MobileLinkCard = ({ link, onEdit, onDelete, onToggle, onView, onQr, onCopy, onCopyError }) => (
  <article className="app-panel rounded-lg border p-4 shadow-sm">
    <div className="flex items-start justify-between gap-3">
      <div className="min-w-0">
        <p className="truncate text-base font-semibold text-blue-700 dark:text-blue-300">/{link.shortCode}</p>
        <p className="mt-1 truncate text-xs text-slate-500">{link.title || 'Untitled link'}</p>
      </div>
      <StatusBadge isActive={link.isActive} />
    </div>
    <p className="mt-3 break-all text-sm text-slate-400">{link.originalUrl}</p>
    <div className="mt-4 grid grid-cols-2 gap-3 text-sm text-slate-400">
      <div className="rounded-lg border border-slate-800 bg-slate-900 p-3">Clicks<br /><span className="text-lg font-semibold text-white">{link.totalClicks ?? 0}</span></div>
      <div className="rounded-lg border border-slate-800 bg-slate-900 p-3">Created<br /><span className="text-sm font-semibold text-white">{formatDate(link.createdAt)}</span></div>
      <div className="col-span-2 rounded-lg border border-slate-800 bg-slate-900 p-3">Expires<br /><span className="text-sm font-semibold text-white">{formatLocalDateTime(link.expiresAt)}</span></div>
    </div>
    <div className="mt-4 flex flex-wrap gap-2">
      {link.isPasswordProtected ? <Badge tone="violet">Protected</Badge> : <Badge tone="neutral">Public</Badge>}
      <Badge tone="neutral">{buildShortLink(link.shortCode)}</Badge>
    </div>
    <div className="mt-4 flex flex-wrap gap-2">
      <CopyButton value={buildShortLink(link.shortCode)} onCopy={onCopy} onError={onCopyError} />
      <LinkActions onEdit={onEdit} onDelete={onDelete} onToggle={onToggle} onView={onView} onQr={onQr} isActive={link.isActive} />
    </div>
  </article>
);

export const LinkTable = ({ links, onEdit, onDelete, onToggle, onView, onQr, onCopy, onCopyError }) => (
  <section className="app-panel rounded-lg border shadow-sm">
    <div className="flex flex-wrap items-end justify-between gap-4 border-b border-slate-200 p-5 dark:border-slate-800">
      <div>
        <p className="text-xs font-semibold uppercase text-blue-600 dark:text-blue-400">Links</p>
        <h2 className="mt-2 text-xl font-semibold text-slate-950 dark:text-white">Short link inventory</h2>
        <p className="mt-2 text-sm text-slate-400">Search, compare, protect, and operate every short link from one table.</p>
      </div>
      <Badge tone="neutral">{links.length} total</Badge>
    </div>

    <div className="hidden overflow-x-auto lg:block">
      <table className="min-w-full text-left text-sm text-slate-700 dark:text-slate-200">
        <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase text-slate-500 dark:border-slate-800 dark:bg-slate-950">
          <tr>
            <th className="px-5 py-3 font-semibold">Link</th>
            <th className="px-5 py-3 font-semibold">Destination</th>
            <th className="px-5 py-3 font-semibold">Status</th>
            <th className="px-5 py-3 font-semibold">Clicks</th>
            <th className="px-5 py-3 font-semibold">Created</th>
            <th className="px-5 py-3 font-semibold">Expires</th>
            <th className="px-5 py-3 font-semibold">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800">
          {links.map((link) => (
            <LinkRow
              key={link.id}
              link={link}
              onEdit={() => onEdit(link)}
              onDelete={() => onDelete(link)}
              onToggle={() => onToggle(link)}
              onView={() => onView(link)}
              onQr={() => onQr(link)}
              onCopy={onCopy}
              onCopyError={onCopyError}
            />
          ))}
        </tbody>
      </table>
    </div>

    <div className="grid gap-3 p-4 lg:hidden">
      {links.map((link) => (
        <MobileLinkCard
          key={link.id}
          link={link}
          onEdit={() => onEdit(link)}
          onDelete={() => onDelete(link)}
          onToggle={() => onToggle(link)}
          onView={() => onView(link)}
          onQr={() => onQr(link)}
          onCopy={onCopy}
          onCopyError={onCopyError}
        />
      ))}
    </div>

    <div className="border-t border-slate-200 px-5 py-4 text-sm text-slate-500 dark:border-slate-800">
      Showing {links.length} {links.length === 1 ? 'link' : 'links'}
    </div>
  </section>
);

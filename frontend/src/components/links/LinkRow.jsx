import { LinkActions } from './LinkActions';
import { CopyButton } from './CopyButton';
import { StatusBadge } from './StatusBadge';
import { formatLocalDateTime } from '../../lib/dateTime';
import { buildShortLink } from '../../lib/shortLinks';

const formatDate = (value) => {
  if (!value) return '—';

  return new Date(value).toLocaleDateString('en', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
};

export const LinkRow = ({ link, onEdit, onDelete, onToggle, onView, onQr, onCopy, onCopyError }) => (
  <tr className="align-top text-sm text-slate-700 hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-800/45">
    <td className="px-5 py-4">
      <div className="flex flex-col gap-1">
        <span className="font-semibold text-blue-700 dark:text-blue-300">/{link.shortCode}</span>
        <span className="text-xs uppercase tracking-[0.14em] text-slate-500">{link.title || 'Untitled link'}</span>
      </div>
    </td>
    <td className="max-w-[360px] truncate px-5 py-4 text-slate-400">{link.originalUrl}</td>
    <td className="px-5 py-4">
      <div className="flex flex-wrap items-center gap-2">
        <StatusBadge isActive={link.isActive} />
        {link.isPasswordProtected ? <span className="rounded-full border border-indigo-500/30 bg-indigo-400/10 px-2.5 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-indigo-100">Protected</span> : null}
      </div>
    </td>
    <td className="px-5 py-4 text-slate-300">{link.totalClicks ?? 0}</td>
    <td className="px-5 py-4 text-slate-400">{formatDate(link.createdAt)}</td>
    <td className="px-5 py-4 text-slate-400">{formatLocalDateTime(link.expiresAt)}</td>
    <td className="px-5 py-4">
      <div className="flex flex-wrap items-center gap-3">
        <CopyButton value={buildShortLink(link.shortCode)} onCopy={onCopy} onError={onCopyError} />
        <LinkActions onEdit={onEdit} onDelete={onDelete} onToggle={onToggle} onView={onView} onQr={onQr} isActive={link.isActive} />
      </div>
    </td>
  </tr>
);

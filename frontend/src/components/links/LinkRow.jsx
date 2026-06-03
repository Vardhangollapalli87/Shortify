import { LinkActions } from './LinkActions';
import { CopyButton } from './CopyButton';
import { StatusBadge } from './StatusBadge';

const formatDate = (value) => {
  if (!value) return '—';

  return new Date(value).toLocaleDateString('en', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
};

export const LinkRow = ({ link, onEdit, onDelete, onToggle, onView }) => (
  <tr className="border-b border-slate-800 align-top text-sm text-slate-200 last:border-b-0 hover:bg-slate-800/70">
    <td className="px-4 py-4">
      <div className="flex flex-col gap-1">
        <span className="font-semibold text-cyan-100">/{link.shortCode}</span>
        <span className="text-xs uppercase tracking-[0.25em] text-slate-400">{link.title || 'Untitled link'}</span>
      </div>
    </td>
    <td className="px-4 py-4 text-slate-300">{link.originalUrl}</td>
    <td className="px-4 py-4">
      <div className="flex flex-wrap items-center gap-2">
        <StatusBadge isActive={link.isActive} />
        {link.isPasswordProtected ? <span className="rounded-full border border-violet-500/30 bg-violet-400/10 px-3 py-1 text-xs uppercase tracking-[0.25em] text-violet-100">Protected</span> : null}
      </div>
    </td>
    <td className="px-4 py-4 text-slate-300">{link.totalClicks ?? 0}</td>
    <td className="px-4 py-4 text-slate-300">{formatDate(link.createdAt)}</td>
    <td className="px-4 py-4">
      <div className="flex flex-wrap items-center gap-3">
        <CopyButton value={`${window.location.origin}/${link.shortCode}`} />
        <LinkActions onEdit={onEdit} onDelete={onDelete} onToggle={onToggle} onView={onView} isActive={link.isActive} />
      </div>
    </td>
  </tr>
);

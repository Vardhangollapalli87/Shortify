import { useEffect, useMemo, useState } from 'react';
import { formatLocalDateTime, isoToLocalDateTimeInput, localDateTimeInputToIso } from '../../lib/dateTime';

const initialForm = {
  originalUrl: '',
  shortCode: '',
  title: '',
  expiresAt: '',
  password: ''
};

export const LinkFormModal = ({ isOpen, mode = 'create', link, onClose, onSubmit }) => {
  const [form, setForm] = useState(initialForm);

  useEffect(() => {
    if (isOpen && link) {
      setForm({
        originalUrl: link.originalUrl || '',
        shortCode: link.shortCode || '',
        title: link.title || '',
        expiresAt: isoToLocalDateTimeInput(link.expiresAt),
        password: ''
      });
      return;
    }

    if (isOpen) {
      setForm(initialForm);
    }
  }, [isOpen, link]);

  const title = useMemo(() => (mode === 'edit' ? 'Edit short link' : 'Create short link'), [mode]);

  if (!isOpen) return null;

  const submit = (event) => {
    event.preventDefault();

    onSubmit({
      ...form,
      expiresAt: localDateTimeInputToIso(form.expiresAt),
      password: form.password || undefined
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm">
      <div className="w-full max-w-2xl rounded-3xl border border-slate-800 bg-slate-950 p-6 shadow-2xl shadow-black/40">
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.35em] text-cyan-300">{mode}</p>
            <h2 className="mt-2 text-2xl font-semibold text-white">{title}</h2>
            <p className="mt-2 text-sm text-slate-300">Create or update a short link with optional alias, expiry, and password protection.</p>
          </div>
          <button type="button" onClick={onClose} className="rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100 hover:border-slate-500">Close</button>
        </div>

        <form className="space-y-4" onSubmit={submit}>
          <div className="grid gap-4 md:grid-cols-2">
            <label className="space-y-2 text-sm text-slate-200">
              <span>Original URL</span>
              <input value={form.originalUrl} onChange={(event) => setForm({ ...form, originalUrl: event.target.value })} className="w-full rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3 text-slate-100" placeholder="https://example.com" required />
            </label>
            <label className="space-y-2 text-sm text-slate-200">
              <span>Custom Alias</span>
              <input value={form.shortCode} onChange={(event) => setForm({ ...form, shortCode: event.target.value })} className="w-full rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3 text-slate-100" placeholder="my-link" />
            </label>
          </div>
          <label className="space-y-2 text-sm text-slate-200">
            <span>Title</span>
            <input value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} className="w-full rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3 text-slate-100" placeholder="Product launch" />
          </label>
          <div className="grid gap-4 md:grid-cols-2">
            <label className="space-y-2 text-sm text-slate-200">
              <span>Expiration Date</span>
              <input type="datetime-local" value={form.expiresAt} onChange={(event) => setForm({ ...form, expiresAt: event.target.value })} className="w-full rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3 text-slate-100" />
              <span className="block text-xs text-slate-400">{form.expiresAt ? `Local time: ${formatLocalDateTime(localDateTimeInputToIso(form.expiresAt))}` : 'No expiration set'}</span>
            </label>
            <label className="space-y-2 text-sm text-slate-200">
              <span>Password Protection</span>
              <input type="password" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} className="w-full rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3 text-slate-100" placeholder="Optional password" />
            </label>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={onClose} className="rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm font-semibold text-slate-100">Cancel</button>
            <button type="submit" className="rounded-xl bg-cyan-400 px-4 py-3 text-sm font-semibold text-slate-950">Save link</button>
          </div>
        </form>
      </div>
    </div>
  );
};

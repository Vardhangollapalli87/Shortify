import { useEffect, useMemo, useState } from 'react';
import { formatLocalDateTime, isoToLocalDateTimeInput, localDateTimeInputToIso } from '../../lib/dateTime';

const initialForm = {
  originalUrl: '',
  shortCode: '',
  title: '',
  expiresAt: '',
  password: '',
  passwordMode: 'keep'
};

const validateForm = ({ form, mode }) => {
  const errors = {};

  try {
    const url = new URL(form.originalUrl);

    if (!['http:', 'https:'].includes(url.protocol)) {
      errors.originalUrl = 'Use an http:// or https:// URL.';
    }
  } catch {
    errors.originalUrl = 'Enter a valid URL that starts with http:// or https://.';
  }

  if (form.shortCode && !/^[a-zA-Z0-9_-]{3,32}$/.test(form.shortCode.trim())) {
    errors.shortCode = 'Use 3-32 letters, numbers, underscores, or hyphens.';
  }

  if (form.expiresAt) {
    const expiration = new Date(form.expiresAt);

    if (Number.isNaN(expiration.getTime()) || expiration.getTime() <= Date.now()) {
      errors.expiresAt = 'Choose a future expiration date.';
    }
  }

  const shouldValidatePassword = mode === 'create'
    ? Boolean(form.password)
    : form.passwordMode === 'set';

  if (shouldValidatePassword && form.password.trim().length < 4) {
    errors.password = 'Use at least 4 characters for the link password.';
  }

  return errors;
};

export const LinkFormModal = ({ isOpen, mode = 'create', link, onClose, onSubmit }) => {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isOpen && link) {
      setForm({
        originalUrl: link.originalUrl || '',
        shortCode: link.shortCode || '',
        title: link.title || '',
        expiresAt: isoToLocalDateTimeInput(link.expiresAt),
        password: '',
        passwordMode: 'keep'
      });
      setErrors({});
      return;
    }

    if (isOpen) {
      setForm(initialForm);
      setErrors({});
    }
  }, [isOpen, link]);

  const title = useMemo(() => (mode === 'edit' ? 'Edit short link' : 'Create short link'), [mode]);

  if (!isOpen) return null;

  const submit = (event) => {
    event.preventDefault();

    const nextErrors = validateForm({ form, mode });

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    const payload = {
      originalUrl: form.originalUrl.trim(),
      shortCode: form.shortCode.trim(),
      title: form.title.trim(),
      expiresAt: localDateTimeInputToIso(form.expiresAt),
    };

    if (mode === 'create' && form.password.trim()) {
      payload.password = form.password;
    }

    if (mode === 'edit' && form.passwordMode === 'set') {
      payload.password = form.password;
    }

    if (mode === 'edit' && form.passwordMode === 'remove') {
      payload.password = '';
    }

    onSubmit(payload);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <div className="app-panel max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-lg border p-6 shadow-xl" role="dialog" aria-modal="true" aria-labelledby="link-form-title">
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase text-blue-600 dark:text-blue-400">{mode}</p>
            <h2 id="link-form-title" className="mt-2 text-2xl font-semibold text-slate-950 dark:text-white">{title}</h2>
            <p className="mt-2 text-sm text-slate-300">Create or update a short link with optional alias, expiry, and password protection.</p>
          </div>
          <button type="button" onClick={onClose} className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100" aria-label="Close link form">Close</button>
        </div>

        <form className="space-y-4" onSubmit={submit}>
          <div className="grid gap-4 md:grid-cols-2">
            <label className="space-y-2 text-sm text-slate-200">
              <span>Original URL</span>
              <input value={form.originalUrl} onChange={(event) => setForm({ ...form, originalUrl: event.target.value })} className="w-full rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3 text-slate-100" placeholder="https://example.com" required />
              {errors.originalUrl ? <span className="block text-xs text-red-600 dark:text-red-300">{errors.originalUrl}</span> : null}
            </label>
            <label className="space-y-2 text-sm text-slate-200">
              <span>Custom Alias</span>
              <input value={form.shortCode} onChange={(event) => setForm({ ...form, shortCode: event.target.value })} className="w-full rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3 text-slate-100" placeholder="my-link" />
              {errors.shortCode ? <span className="block text-xs text-red-600 dark:text-red-300">{errors.shortCode}</span> : null}
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
              {errors.expiresAt ? <span className="block text-xs text-red-600 dark:text-red-300">{errors.expiresAt}</span> : null}
            </label>
            <label className="space-y-2 text-sm text-slate-200">
              <span>Password Protection</span>
              {mode === 'edit' ? (
                <div className="grid gap-2 rounded-2xl border border-slate-800 bg-slate-900 p-3">
                  <label className="flex items-center gap-2 text-xs text-slate-300">
                    <input type="radio" name="passwordMode" checked={form.passwordMode === 'keep'} onChange={() => setForm({ ...form, passwordMode: 'keep', password: '' })} />
                    Keep current password state
                  </label>
                  <label className="flex items-center gap-2 text-xs text-slate-300">
                    <input type="radio" name="passwordMode" checked={form.passwordMode === 'set'} onChange={() => setForm({ ...form, passwordMode: 'set' })} />
                    Set or change password
                  </label>
                  <label className="flex items-center gap-2 text-xs text-slate-300">
                    <input type="radio" name="passwordMode" checked={form.passwordMode === 'remove'} onChange={() => setForm({ ...form, passwordMode: 'remove', password: '' })} />
                    Remove password protection
                  </label>
                </div>
              ) : null}
              {(mode === 'create' || form.passwordMode === 'set') ? (
                <input type="password" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} className="w-full rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3 text-slate-100" placeholder="Optional password" />
              ) : null}
              {errors.password ? <span className="block text-xs text-red-600 dark:text-red-300">{errors.password}</span> : null}
            </label>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={onClose} className="rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100">Cancel</button>
            <button type="submit" className="rounded-lg bg-blue-600 px-4 py-3 text-sm font-semibold text-white hover:bg-blue-700">Save link</button>
          </div>
        </form>
      </div>
    </div>
  );
};

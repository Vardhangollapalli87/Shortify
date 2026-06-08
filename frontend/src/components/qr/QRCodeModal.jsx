import { useMemo, useState } from 'react';
import { buildShortLink } from '../../lib/shortLinks';
import { QRCodeActions } from './QRCodeActions';
import { QRCodePreview } from './QRCodePreview';

export const QRCodeModal = ({ isOpen, link, onClose, onCopy, onCopyError }) => {
  const [renderKey, setRenderKey] = useState(0);
  const [canvas, setCanvas] = useState(null);
  const [regenerated, setRegenerated] = useState(false);

  const shortUrl = useMemo(() => (link ? buildShortLink(link.shortCode) : ''), [link]);

  if (!isOpen || !link) return null;

  const regenerate = () => {
    setCanvas(null);
    setRenderKey((currentKey) => currentKey + 1);
    setRegenerated(true);
    window.setTimeout(() => setRegenerated(false), 1400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 px-4 py-6 backdrop-blur">
      <div className="max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-2xl shadow-black/40">
        <div className="flex flex-col gap-4 border-b border-slate-800 pb-5 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.35em] text-cyan-300">QR code</p>
            <h2 className="mt-2 text-2xl font-semibold text-white">/{link.shortCode}</h2>
            <p className="mt-2 break-all text-sm text-slate-300">{shortUrl}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-2 text-sm font-semibold text-slate-100 transition hover:border-cyan-400/40 hover:text-cyan-100"
          >
            Close
          </button>
        </div>

        <div className="grid gap-6 py-6 lg:grid-cols-[360px_1fr]">
          <QRCodePreview value={shortUrl} renderKey={renderKey} onCanvasReady={setCanvas} />

          <div className="space-y-5">
            <div className="rounded-2xl border border-slate-800 bg-slate-950 p-5">
              <p className="text-sm font-semibold text-white">Destination</p>
              <p className="mt-2 break-all text-sm text-slate-400">{link.originalUrl}</p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-950 p-5">
              <p className="text-sm font-semibold text-white">Status</p>
              <div className="mt-3 flex flex-wrap gap-2 text-xs uppercase tracking-[0.25em]">
                <span className={`rounded-full border px-3 py-1 ${link.isActive ? 'border-emerald-400/30 bg-emerald-400/10 text-emerald-100' : 'border-amber-400/30 bg-amber-400/10 text-amber-100'}`}>
                  {link.isActive ? 'Active' : 'Inactive'}
                </span>
                {link.isPasswordProtected ? (
                  <span className="rounded-full border border-violet-400/30 bg-violet-400/10 px-3 py-1 text-violet-100">Protected</span>
                ) : null}
              </div>
            </div>

            {regenerated ? (
              <p className="rounded-2xl border border-emerald-400/30 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-100">
                QR code regenerated from the latest short URL.
              </p>
            ) : null}
          </div>
        </div>

        <QRCodeActions
          canvas={canvas}
          shortUrl={shortUrl}
          shortCode={link.shortCode}
          onCopy={onCopy}
          onCopyError={onCopyError}
          onRegenerate={regenerate}
        />
      </div>
    </div>
  );
};

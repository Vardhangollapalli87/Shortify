import { useState } from 'react';

export const QRCodeActions = ({ canvas, shortUrl, shortCode, onCopy, onCopyError, onRegenerate }) => {
  const [downloadState, setDownloadState] = useState('idle');
  const [copyState, setCopyState] = useState('idle');

  const downloadPng = () => {
    if (!canvas) {
      setDownloadState('error');
      window.setTimeout(() => setDownloadState('idle'), 1800);
      return;
    }

    const anchor = document.createElement('a');
    anchor.href = canvas.toDataURL('image/png');
    anchor.download = `shortify-${shortCode}-qr.png`;
    anchor.click();
    setDownloadState('success');
    window.setTimeout(() => setDownloadState('idle'), 1600);
  };

  const copyShortUrl = async () => {
    try {
      await navigator.clipboard.writeText(shortUrl);
      setCopyState('success');
      onCopy?.(shortUrl);
      window.setTimeout(() => setCopyState('idle'), 1400);
    } catch {
      setCopyState('error');
      onCopyError?.();
      window.setTimeout(() => setCopyState('idle'), 1800);
    }
  };

  return (
    <div className="grid gap-3 sm:grid-cols-3">
      <button
        type="button"
        onClick={downloadPng}
        className="rounded-lg bg-blue-600 px-4 py-3 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
        disabled={!canvas}
      >
        {downloadState === 'success' ? 'Downloaded' : downloadState === 'error' ? 'Unavailable' : 'Download PNG'}
      </button>
      <button
        type="button"
        onClick={copyShortUrl}
        className="rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:hover:bg-slate-800"
      >
        {copyState === 'success' ? 'Copied' : copyState === 'error' ? 'Copy failed' : 'Copy short URL'}
      </button>
      <button
        type="button"
        onClick={onRegenerate}
        className="rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:hover:bg-slate-800"
      >
        Regenerate
      </button>
    </div>
  );
};

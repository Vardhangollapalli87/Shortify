import { useState } from 'react';

export const CopyButton = ({ value, onCopy, onError }) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      onCopy?.(value);
      window.setTimeout(() => setCopied(false), 1200);
    } catch {
      setCopied(false);
      onError?.();
    }
  };

  return (
    <button
      type="button"
      onClick={copyToClipboard}
      className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200 dark:hover:bg-slate-800"
      aria-label="Copy short URL"
    >
      {copied ? 'Copied' : 'Copy'}
    </button>
  );
};

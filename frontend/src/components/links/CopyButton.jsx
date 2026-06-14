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
      className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-xs font-semibold text-slate-200 transition hover:border-cyan-400/40 hover:text-cyan-100"
      aria-label="Copy short URL"
    >
      {copied ? 'Copied' : 'Copy'}
    </button>
  );
};

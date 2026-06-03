import { useState } from 'react';

export const CopyButton = ({ value }) => {
  const [copied, setCopied] = useState(false);

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1200);
    } catch {
      setCopied(false);
    }
  };

  return (
    <button
      type="button"
      onClick={onCopy}
      className="rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-slate-200 transition hover:border-cyan-400/40 hover:text-cyan-100"
    >
      {copied ? 'Copied' : 'Copy'}
    </button>
  );
};

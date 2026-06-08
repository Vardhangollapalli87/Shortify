import { useEffect, useMemo, useRef, useState } from 'react';
import { createQrMatrix, drawQrToCanvas } from '../../lib/qrCode';

export const QRCodePreview = ({ value, renderKey, onCanvasReady }) => {
  const canvasRef = useRef(null);
  const [status, setStatus] = useState('loading');

  const result = useMemo(() => {
    try {
      return { matrix: createQrMatrix(value), error: '' };
    } catch (qrError) {
      return { matrix: null, error: qrError.message || 'Unable to generate QR code.' };
    }
  }, [value, renderKey]);

  useEffect(() => {
    if (!result.matrix || !canvasRef.current) {
      setStatus('error');
      onCanvasReady?.(null);
      return;
    }

    setStatus('loading');

    window.requestAnimationFrame(() => {
      drawQrToCanvas(canvasRef.current, result.matrix);
      setStatus('ready');
      onCanvasReady?.(canvasRef.current);
    });
  }, [result.matrix, onCanvasReady]);

  if (result.error) {
    return (
      <div className="flex min-h-[280px] items-center justify-center rounded-2xl border border-rose-500/30 bg-rose-500/10 p-6 text-center text-sm text-rose-100">
        {result.error}
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-slate-800 bg-white p-4 shadow-xl shadow-black/20">
      {status === 'loading' ? (
        <div className="flex min-h-[280px] items-center justify-center rounded-xl bg-slate-100 text-sm font-medium text-slate-600">
          Generating QR code
        </div>
      ) : null}
      <canvas
        ref={canvasRef}
        aria-label="QR code preview"
        className={status === 'ready' ? 'mx-auto h-auto w-full max-w-[320px]' : 'hidden'}
      />
    </div>
  );
};

import { useEffect, useMemo, useRef, useState } from 'react';
import { drawQrToCanvas, validateQrPayload } from '../../lib/qrCode';

export const QRCodePreview = ({ value, renderKey, onCanvasReady }) => {
  const canvasRef = useRef(null);
  const [status, setStatus] = useState('loading');
  const [drawError, setDrawError] = useState('');

  const result = useMemo(() => {
    try {
      return { payload: validateQrPayload(value), error: '' };
    } catch (qrError) {
      return { payload: '', error: qrError.message || 'Unable to generate QR code.' };
    }
  }, [value, renderKey]);

  useEffect(() => {
    if (!result.payload || !canvasRef.current) {
      setStatus('error');
      onCanvasReady?.(null);
      return;
    }

    setStatus('loading');
    setDrawError('');

    window.requestAnimationFrame(async () => {
      try {
        await drawQrToCanvas(canvasRef.current, result.payload);
        setStatus('ready');
        onCanvasReady?.(canvasRef.current);
      } catch (qrError) {
        setDrawError(qrError.message || 'Unable to render QR code.');
        setStatus('error');
        onCanvasReady?.(null);
      }
    });
  }, [result.payload, onCanvasReady]);

  if (result.error || drawError) {
    return (
      <div className="flex min-h-[280px] items-center justify-center rounded-2xl border border-rose-500/30 bg-rose-500/10 p-6 text-center text-sm text-rose-100">
        {result.error || drawError}
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

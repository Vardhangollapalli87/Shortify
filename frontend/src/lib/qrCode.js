import QRCode from 'qrcode';

const QR_OPTIONS = {
  errorCorrectionLevel: 'M',
  margin: 4,
  width: 320,
  color: {
    dark: '#0f172a',
    light: '#ffffff'
  }
};

export const validateQrPayload = (value) => {
  if (!value || typeof value !== 'string' || value.trim().length === 0) {
    throw new Error('A short URL is required to generate a QR code.');
  }

  return value.trim();
};

export const createQrModel = (value) => QRCode.create(validateQrPayload(value), QR_OPTIONS);

export const drawQrToCanvas = async (canvas, value, options = {}) => {
  const payload = validateQrPayload(value);
  await QRCode.toCanvas(canvas, payload, { ...QR_OPTIONS, ...options });
  return canvas;
};

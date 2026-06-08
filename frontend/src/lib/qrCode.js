const VERSION = 5;
const SIZE = 21 + (VERSION - 1) * 4;
const DATA_CODEWORDS = 108;
const ECC_CODEWORDS = 26;
const MASK_PATTERN = 0;

const ALIGNMENT_POSITIONS = [6, 30];

const createMatrix = () => Array.from({ length: SIZE }, () => Array(SIZE).fill(false));
const createReserved = () => Array.from({ length: SIZE }, () => Array(SIZE).fill(false));

const utf8Bytes = (value) => Array.from(new TextEncoder().encode(value));

const pushBits = (bits, value, length) => {
  for (let index = length - 1; index >= 0; index -= 1) {
    bits.push(((value >>> index) & 1) === 1);
  }
};

const createDataCodewords = (value) => {
  const bytes = utf8Bytes(value);
  if (bytes.length > 106) {
    throw new Error('QR code value is too long to encode.');
  }

  const bits = [];
  pushBits(bits, 0b0100, 4);
  pushBits(bits, bytes.length, 8);
  bytes.forEach((byte) => pushBits(bits, byte, 8));

  const remainingBits = DATA_CODEWORDS * 8 - bits.length;
  pushBits(bits, 0, Math.min(4, remainingBits));

  while (bits.length % 8 !== 0) {
    bits.push(false);
  }

  const codewords = [];
  for (let index = 0; index < bits.length; index += 8) {
    let byte = 0;
    for (let offset = 0; offset < 8; offset += 1) {
      byte = (byte << 1) | (bits[index + offset] ? 1 : 0);
    }
    codewords.push(byte);
  }

  const pads = [0xec, 0x11];
  let padIndex = 0;
  while (codewords.length < DATA_CODEWORDS) {
    codewords.push(pads[padIndex % pads.length]);
    padIndex += 1;
  }

  return codewords;
};

const gfMultiply = (left, right) => {
  let product = 0;
  let a = left;
  let b = right;

  while (b > 0) {
    if ((b & 1) !== 0) product ^= a;
    a <<= 1;
    if ((a & 0x100) !== 0) a ^= 0x11d;
    b >>= 1;
  }

  return product;
};

const gfPower = (power) => {
  let value = 1;
  for (let index = 0; index < power; index += 1) {
    value = gfMultiply(value, 2);
  }
  return value;
};

const createGenerator = (degree) => {
  let generator = [1];

  for (let degreeIndex = 0; degreeIndex < degree; degreeIndex += 1) {
    const next = Array(generator.length + 1).fill(0);
    generator.forEach((coefficient, index) => {
      next[index] ^= coefficient;
      next[index + 1] ^= gfMultiply(coefficient, gfPower(degreeIndex));
    });
    generator = next;
  }

  return generator;
};

const createEcc = (dataCodewords) => {
  const generator = createGenerator(ECC_CODEWORDS);
  const remainder = Array(ECC_CODEWORDS).fill(0);

  dataCodewords.forEach((codeword) => {
    const factor = codeword ^ remainder.shift();
    remainder.push(0);

    generator.slice(1).forEach((coefficient, index) => {
      remainder[index] ^= gfMultiply(coefficient, factor);
    });
  });

  return remainder;
};

const setModule = (matrix, reserved, row, col, value, isFunction = true) => {
  if (row < 0 || col < 0 || row >= SIZE || col >= SIZE) return;
  matrix[row][col] = value;
  if (isFunction) reserved[row][col] = true;
};

const drawFinder = (matrix, reserved, row, col) => {
  for (let y = -1; y <= 7; y += 1) {
    for (let x = -1; x <= 7; x += 1) {
      const currentRow = row + y;
      const currentCol = col + x;
      if (currentRow < 0 || currentCol < 0 || currentRow >= SIZE || currentCol >= SIZE) continue;

      const isFinder = y >= 0 && y <= 6 && x >= 0 && x <= 6
        && (y === 0 || y === 6 || x === 0 || x === 6 || (y >= 2 && y <= 4 && x >= 2 && x <= 4));
      setModule(matrix, reserved, currentRow, currentCol, isFinder);
    }
  }
};

const drawAlignment = (matrix, reserved, centerRow, centerCol) => {
  for (let y = -2; y <= 2; y += 1) {
    for (let x = -2; x <= 2; x += 1) {
      const value = Math.max(Math.abs(x), Math.abs(y)) !== 1;
      setModule(matrix, reserved, centerRow + y, centerCol + x, value);
    }
  }
};

const drawFunctionPatterns = (matrix, reserved) => {
  drawFinder(matrix, reserved, 0, 0);
  drawFinder(matrix, reserved, 0, SIZE - 7);
  drawFinder(matrix, reserved, SIZE - 7, 0);

  for (let index = 8; index < SIZE - 8; index += 1) {
    const value = index % 2 === 0;
    setModule(matrix, reserved, 6, index, value);
    setModule(matrix, reserved, index, 6, value);
  }

  ALIGNMENT_POSITIONS.forEach((row) => {
    ALIGNMENT_POSITIONS.forEach((col) => {
      const overlapsFinder = reserved[row][col];
      if (!overlapsFinder) drawAlignment(matrix, reserved, row, col);
    });
  });

  setModule(matrix, reserved, 4 * VERSION + 9, 8, true);

  for (let index = 0; index < 9; index += 1) {
    if (index !== 6) {
      reserved[8][index] = true;
      reserved[index][8] = true;
    }
  }

  for (let index = 0; index < 8; index += 1) {
    reserved[SIZE - 1 - index][8] = true;
    reserved[8][SIZE - 1 - index] = true;
  }
};

const createFormatBits = () => {
  let data = (0b01 << 3) | MASK_PATTERN;
  let bits = data << 10;
  const generator = 0x537;

  for (let index = 14; index >= 10; index -= 1) {
    if (((bits >>> index) & 1) !== 0) {
      bits ^= generator << (index - 10);
    }
  }

  return ((data << 10) | bits) ^ 0x5412;
};

const drawFormatBits = (matrix, reserved) => {
  const formatBits = createFormatBits();

  for (let index = 0; index < 15; index += 1) {
    const value = ((formatBits >>> index) & 1) === 1;

    if (index < 6) setModule(matrix, reserved, 8, index, value);
    else if (index === 6) setModule(matrix, reserved, 8, 7, value);
    else if (index === 7) setModule(matrix, reserved, 8, 8, value);
    else if (index === 8) setModule(matrix, reserved, 7, 8, value);
    else setModule(matrix, reserved, 14 - index, 8, value);

    if (index < 8) setModule(matrix, reserved, SIZE - 1 - index, 8, value);
    else setModule(matrix, reserved, 8, SIZE - 15 + index, value);
  }
};

const mask = (row, col) => ((row + col) % 2) === 0;

const drawData = (matrix, reserved, codewords) => {
  const bits = [];
  codewords.forEach((codeword) => pushBits(bits, codeword, 8));

  let bitIndex = 0;
  let upward = true;

  for (let right = SIZE - 1; right >= 1; right -= 2) {
    if (right === 6) right -= 1;

    for (let vertical = 0; vertical < SIZE; vertical += 1) {
      const row = upward ? SIZE - 1 - vertical : vertical;

      for (let offset = 0; offset < 2; offset += 1) {
        const col = right - offset;
        if (reserved[row][col]) continue;

        const value = (bits[bitIndex] || false) !== mask(row, col);
        setModule(matrix, reserved, row, col, value, false);
        bitIndex += 1;
      }
    }

    upward = !upward;
  }
};

export const createQrMatrix = (value) => {
  if (!value || typeof value !== 'string') {
    throw new Error('A short URL is required to generate a QR code.');
  }

  const matrix = createMatrix();
  const reserved = createReserved();
  const dataCodewords = createDataCodewords(value);
  const allCodewords = [...dataCodewords, ...createEcc(dataCodewords)];

  drawFunctionPatterns(matrix, reserved);
  drawData(matrix, reserved, allCodewords);
  drawFormatBits(matrix, reserved);

  return matrix;
};

export const drawQrToCanvas = (canvas, matrix, options = {}) => {
  const quietZone = options.quietZone ?? 4;
  const scale = options.scale ?? 8;
  const foreground = options.foreground ?? '#0f172a';
  const background = options.background ?? '#ffffff';
  const moduleCount = matrix.length + quietZone * 2;
  const size = moduleCount * scale;
  const context = canvas.getContext('2d');

  canvas.width = size;
  canvas.height = size;
  context.fillStyle = background;
  context.fillRect(0, 0, size, size);
  context.fillStyle = foreground;

  matrix.forEach((row, rowIndex) => {
    row.forEach((isDark, colIndex) => {
      if (!isDark) return;
      context.fillRect((colIndex + quietZone) * scale, (rowIndex + quietZone) * scale, scale, scale);
    });
  });
};

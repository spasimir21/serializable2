import { createBinaryAdapter } from '../IBinaryAdapter';

const bigintAbs = (n: bigint) => (n < 0n ? -n : n);

function createVarLongAdapter(signed: boolean) {
  return createBinaryAdapter<bigint, []>({
    write: (value, buffer, offset) => {
      if (signed) value = bigintAbs(value << 1n) | (value < 0n ? 1n : 0n);

      let shouldWrite = false;
      let bytesWritten = 0;

      for (let i = 7; i >= 0; i--) {
        let data = Number((value & (0b1111111n << BigInt(i * 7))) >> BigInt(i * 7));

        if (!shouldWrite && i != 0 && data == 0) continue;
        shouldWrite = true;

        buffer.writeUInt8(((i == 0 ? 0 : 1) << 7) | data, offset + bytesWritten);
        bytesWritten++;
      }
    },
    read: (buffer, offset, moveOffset) => {
      let number = 0n;

      for (let i = 0; i < 8; i++) {
        const byte = buffer.readUInt8(offset + i);
        number = (number << 7n) | BigInt(byte & 0b1111111);

        if ((byte & 0b10000000) == 0) {
          moveOffset(i + 1);
          break;
        }

        if (i == 7) throw new Error('VarLong cannot be longer than 8 bytes!');
      }

      if (signed) number = ((number & 0b1n) == 1n ? -1n : 1n) * (number >> 1n);

      return number;
    },
    size: value => {
      if (signed) value = bigintAbs(value << 1n) | (value < 0n ? 1n : 0n);

      // prettier-ignore
      return value < (1n << 7n) ? 1
           : value < (1n << 14n) ? 2
           : value < (1n << 21n) ? 3
           : value < (1n << 28n) ? 4
           : value < (1n << 35n) ? 5
           : value < (1n << 42n) ? 6
           : value < (1n << 49n) ? 7
           : 8;
    }
  });
}

const VarLongAdapter = createVarLongAdapter(true);
const VarULongAdapter = createVarLongAdapter(false);

export { VarLongAdapter, VarULongAdapter };

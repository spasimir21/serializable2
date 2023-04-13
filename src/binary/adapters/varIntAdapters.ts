import { createBinaryAdapter } from '../IBinaryAdapter';

function createVarIntAdapter(signed: boolean) {
  return createBinaryAdapter<number, []>({
    write: (value, buffer, offset) => {
      if (signed) value = Math.abs(value << 1) | (value < 0 ? 1 : 0);

      let shouldWrite = false;
      let bytesWritten = 0;

      for (let i = 3; i >= 0; i--) {
        let data = (value & (0b1111111 << (i * 7))) >> (i * 7);

        if (!shouldWrite && i != 0 && data == 0) continue;
        shouldWrite = true;

        buffer.writeUInt8(((i == 0 ? 0 : 1) << 7) | data, offset + bytesWritten);
        bytesWritten++;
      }
    },
    read: (buffer, offset, moveOffset) => {
      let number = 0;

      for (let i = 0; i < 4; i++) {
        const byte = buffer.readUInt8(offset + i);
        number = (number << 7) | (byte & 0b1111111);

        if ((byte & 0b10000000) == 0) {
          moveOffset(i + 1);
          break;
        }

        if (i == 3) throw new Error('VarInt cannot be longer than 4 bytes!');
      }

      if (signed) number = ((number & 0b1) == 1 ? -1 : 1) * (number >> 1);

      return number;
    },
    size: value => {
      if (signed) value = Math.abs(value << 1) | (value < 0 ? 1 : 0);

      // prettier-ignore
      return value < (1 << 7) ? 1
           : value < (1 << 14) ? 2
           : value < (1 << 21) ? 3
           : 4;
    }
  });
}

const VarIntAdapter = createVarIntAdapter(true);
const VarUIntAdapter = createVarIntAdapter(false);

export { VarIntAdapter, VarUIntAdapter };

import { createBinaryAdapter } from '../IBinaryAdapter';

const BufferAdapter = createBinaryAdapter<Buffer, [length: number]>({
  write: (value, buffer, offset) => value.copy(buffer, offset),
  read: (buffer, offset, moveOffset, length) => {
    const clone = Buffer.allocUnsafe(length);
    buffer.copy(clone, 0, offset, offset + length);
    moveOffset(length);
    return clone;
  },
  size: value => value.byteLength
});

export { BufferAdapter };

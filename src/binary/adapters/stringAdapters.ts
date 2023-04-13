import { createBinaryAdapter } from '../IBinaryAdapter';

function createStringAdapter(encoding?: BufferEncoding) {
  return createBinaryAdapter<string, [length: number]>({
    write: (value, buffer, offset) => buffer.write(value, offset, encoding),
    read: (buffer, offset, moveOffset, length) => {
      moveOffset(length);
      return buffer.subarray(offset, offset + length).toString(encoding);
    },
    size: value => Buffer.byteLength(value, encoding)
  });
}

export { createStringAdapter };

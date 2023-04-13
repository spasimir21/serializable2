import { SerializableProperty, createPropertySerializer } from '../property';
import { BufferAdapter } from '../../binary/adapters/bufferAdapter';
import { createSerializer } from '../ISerializer';

function _Buffer(sizeProperty: SerializableProperty<number>) {
  const sizeSerializer = createPropertySerializer(sizeProperty);

  return createSerializer<Buffer>({
    write: (value, writer, context) => {
      sizeSerializer.write(value.byteLength, writer, context);
      writer.write(BufferAdapter, value);
    },
    read: (reader, context) => {
      const size = sizeSerializer.read(reader, context);
      return reader.read(BufferAdapter, size);
    }
  });
}

export { _Buffer };

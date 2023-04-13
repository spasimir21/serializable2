import { SerializableProperty, createPropertySerializer } from '../property';
import { createStringAdapter } from '../../binary/adapters/stringAdapters';
import { createSerializer } from '../ISerializer';

function _String(sizeProperty: SerializableProperty<number>, encoding?: BufferEncoding) {
  const sizeSerializer = createPropertySerializer(sizeProperty);
  const StringAdapter = createStringAdapter(encoding);

  return createSerializer<string>({
    write: (value, writer, context) => {
      sizeSerializer.write(StringAdapter.size(value), writer, context);
      writer.write(StringAdapter, value);
    },
    read: (reader, context) => {
      const size = sizeSerializer.read(reader, context);
      return reader.read(StringAdapter, size);
    }
  });
}

export { _String };

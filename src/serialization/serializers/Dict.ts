import { SerializableProperty, createPropertySerializer } from '../property';
import { ISerializer, createSerializer } from '../ISerializer';

function Dict<T>(
  sizeProperty: SerializableProperty<number>,
  keySerializer: ISerializer<string>,
  valueSerializer: ISerializer<T>
) {
  const sizeSerializer = createPropertySerializer(sizeProperty);

  return createSerializer<Record<string, T>>({
    write: (value, writer, context) => {
      const keys = Object.keys(value);

      sizeSerializer.write(keys.length, writer, context);
      for (const key of keys) {
        keySerializer.write(key, writer, context);
        valueSerializer.write(value[key], writer, context);
      }
    },
    read: (reader, context) => {
      const result = {} as Record<string, T>;

      const size = sizeSerializer.read(reader, context);
      for (let i = 0; i < size; i++) {
        const key = keySerializer.read(reader, context);
        result[key] = valueSerializer.read(reader, context);
      }

      return result;
    }
  });
}

export { Dict };

import { SerializableProperty, createPropertySerializer } from '../property';
import { ISerializer, createSerializer } from '../ISerializer';

function _Map<TKey, TValue>(
  sizeProperty: SerializableProperty<number>,
  keySerializer: ISerializer<TKey>,
  valueSerializer: ISerializer<TValue>
) {
  const sizeSerializer = createPropertySerializer(sizeProperty);

  return createSerializer<Map<TKey, TValue>>({
    write: (value, writer, context) => {
      sizeSerializer.write(value.size, writer, context);
      for (const key of value.keys()) {
        keySerializer.write(key, writer, context);
        valueSerializer.write(value.get(key) as TValue, writer, context);
      }
    },
    read: (reader, context) => {
      const result = new Map<TKey, TValue>();

      const size = sizeSerializer.read(reader, context);
      for (let i = 0; i < size; i++) {
        const key = keySerializer.read(reader, context);
        const value = valueSerializer.read(reader, context);
        result.set(key, value);
      }

      return result;
    }
  });
}

export { _Map };

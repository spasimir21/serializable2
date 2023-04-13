import { SerializableProperty, createPropertySerializer } from '../property';
import { ISerializer, createSerializer } from '../ISerializer';

function _Set<T>(sizeProperty: SerializableProperty<number>, valueSerializer: ISerializer<T>) {
  const sizeSerializer = createPropertySerializer(sizeProperty);

  return createSerializer<Set<T>>({
    write: (values, writer, context) => {
      sizeSerializer.write(values.size, writer, context);
      for (const value of values) valueSerializer.write(value, writer, context);
    },
    read: (reader, context) => {
      const size = sizeSerializer.read(reader, context);
      const result = new Set<T>();

      for (let i = 0; i < size; i++) {
        const value = valueSerializer.read(reader, context);
        result.add(value);
      }

      return result;
    }
  });
}

export { _Set };

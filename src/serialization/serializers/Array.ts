import { SerializableProperty, createPropertySerializer } from '../property';
import { ISerializer, createSerializer } from '../ISerializer';

function _Array<T>(lengthProperty: SerializableProperty<number>, valueSerializer: ISerializer<T>) {
  const lengthSerializer = createPropertySerializer(lengthProperty);

  return createSerializer<T[]>({
    write: (values, writer, context) => {
      lengthSerializer.write(values.length, writer, context);
      for (const value of values) valueSerializer.write(value, writer, context);
    },
    read: (reader, context) => {
      const length = lengthSerializer.read(reader, context);
      const values = new Array<T>(length);

      for (let i = 0; i < length; i++) values[i] = valueSerializer.read(reader, context);

      return values;
    }
  });
}

export { _Array };

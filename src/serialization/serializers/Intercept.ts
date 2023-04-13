import { createSerializer, ISerializer } from '../ISerializer';
import { SerializationContext, Context } from '../context';

function Intercept<T, TSerialized>(
  serializer: ISerializer<TSerialized>,
  onIn: (value: T, context: SerializationContext) => TSerialized,
  onOut: (value: TSerialized, context: Context) => T
) {
  return createSerializer<T>({
    write: (value, writer, context) => {
      const newValue = onIn(value, context);
      serializer.write(newValue, writer, context);
      onOut(newValue, context);
    },
    read: (reader, context) => {
      const value = serializer.read(reader, context);
      return onOut(value, context);
    }
  });
}

export { Intercept };

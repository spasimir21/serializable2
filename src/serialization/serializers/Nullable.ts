import { ISerializer, createSerializer } from '../ISerializer';
import { _Boolean } from './Boolean';

function Nullable<T>(serializer: ISerializer<T>) {
  return createSerializer<T | null>({
    write: (value, writer, context) => {
      _Boolean.write(value != null, writer, context);
      if (value != null) serializer.write(value, writer, context);
    },
    read: (reader, context) => {
      const hasValue = _Boolean.read(reader, context);
      if (!hasValue) return null;
      return serializer.read(reader, context);
    }
  });
}

export { Nullable };

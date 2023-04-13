import { SerializerSchemaFor } from '../../../utils/types';
import { createSerializer } from '../../ISerializer';

function SimpleObject<T>(schema: SerializerSchemaFor<T>) {
  const keys = Object.keys(schema).sort((a, b) => a.localeCompare(b)) as (keyof T)[];

  return createSerializer<T>({
    write: (value, writer, context) => {
      for (const key of keys) schema[key].write(value[key], writer, context);
    },
    read: (reader, context) => {
      const result = {} as T;
      for (const key of keys) result[key] = schema[key].read(reader, context);
      return result;
    }
  });
}

export { SimpleObject };

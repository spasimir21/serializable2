import { IBinaryAdapter } from '../binary/IBinaryAdapter';
import { createSerializer } from './ISerializer';

function createSerializerFromAdapter<T>(adapter: IBinaryAdapter<T, []>) {
  return createSerializer<T>({
    write: (value, writer) => writer.write(adapter, value),
    read: reader => reader.read(adapter)
  });
}

export { createSerializerFromAdapter };

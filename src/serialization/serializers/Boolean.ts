import { UInt8Adapter } from '../../binary/adapters/numberAdapters';
import { createSerializer } from '../ISerializer';

const _Boolean = createSerializer<boolean>({
  write: (value, writer) => writer.write(UInt8Adapter, value ? 255 : 0),
  read: reader => reader.read(UInt8Adapter) === 255
});

export { _Boolean };

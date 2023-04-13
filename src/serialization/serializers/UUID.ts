import { createSerializer } from '../ISerializer';
import { _String } from './String';

const UUID_DataString = _String(16, 'hex');

const UUID = createSerializer<string>({
  write: (value, writer, context) =>
    UUID_DataString.write(
      value.substring(0, 8) +
        value.substring(9, 13) +
        value.substring(14, 18) +
        value.substring(19, 23) +
        value.substring(24),
      writer,
      context
    ),
  read: (reader, context) => {
    const uuidData = UUID_DataString.read(reader, context);
    return (
      uuidData.substring(0, 8) +
      '-' +
      uuidData.substring(8, 12) +
      '-' +
      uuidData.substring(12, 16) +
      '-' +
      uuidData.substring(16, 20) +
      '-' +
      uuidData.substring(20)
    );
  }
});

export { UUID };

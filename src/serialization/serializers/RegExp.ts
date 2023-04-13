import { SerializableProperty, createPropertySerializer } from '../property';
import { ISerializer, createSerializer } from '../ISerializer';
import { StringFlags } from './Flags';
import { UInt8 } from './Numbers';

const RegExpFlags = StringFlags(UInt8, 'igsmyu');

function _RegExp(sourceSerializer: ISerializer<string>, flagsProperty: SerializableProperty<string> = RegExpFlags) {
  const flagsSerializer = createPropertySerializer(flagsProperty);

  return createSerializer<RegExp>({
    write: (value, writer, context) => {
      flagsSerializer.write(value.flags, writer, context);
      sourceSerializer.write(value.source, writer, context);
    },
    read: (reader, context) => {
      const flags = flagsSerializer.read(reader, context);
      const source = sourceSerializer.read(reader, context);
      return new RegExp(source, flags);
    }
  });
}

export { _RegExp, RegExpFlags };

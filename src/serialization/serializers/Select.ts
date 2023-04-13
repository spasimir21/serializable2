import { createSerializer, ISerializer } from '../ISerializer';
import { GetSerializerType } from '../../utils/types';
import { SerializationContext } from '../context';

function Select<TSerializers extends ISerializer<any>[]>(
  indexSerializer: ISerializer<number>,
  getIndex: (value: GetSerializerType<TSerializers[number]>, context: SerializationContext) => number,
  serializers: TSerializers
) {
  return createSerializer<GetSerializerType<TSerializers[number]>>({
    write: (value, writer, context) => {
      const index = getIndex(value, context);
      indexSerializer.write(index, writer, context);
      serializers[index].write(value, writer, context);
    },
    read: (reader, context) => {
      const index = indexSerializer.read(reader, context);
      return serializers[index].read(reader, context);
    }
  });
}

export { Select };

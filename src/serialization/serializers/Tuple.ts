import { ISerializer, createSerializer } from '../ISerializer';
import { GetSerializerType } from '../../utils/types';

type MapSerializerArray<TSerializers extends readonly ISerializer<any>[]> = {
  [TKey in keyof TSerializers]: GetSerializerType<TSerializers[TKey]>;
};

function Tuple<TSerializers extends readonly ISerializer<any>[]>(serializers: TSerializers) {
  return createSerializer<MapSerializerArray<TSerializers>>({
    write: (value, writer, context) => {
      for (let i = 0; i < serializers.length; i++) serializers[i].write(value[i], writer, context);
    },
    read: (reader, context) => {
      const result = new Array(serializers.length);
      for (let i = 0; i < serializers.length; i++) result[i] = serializers[i].read(reader, context);
      return result as any;
    }
  });
}

export { Tuple };

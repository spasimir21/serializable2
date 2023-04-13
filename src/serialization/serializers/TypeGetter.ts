import { ISerializer, createSerializer } from '../ISerializer';
import { GetSerializerType } from '../../utils/types';
import { Context } from '../context';

function TypeGetter<T extends ISerializer<any>>(getSerializer: (context: Context) => T) {
  return createSerializer<GetSerializerType<T>>({
    write: (value, writer, context) => getSerializer(context).write(value, writer, context),
    read: (reader, context) => getSerializer(context).read(reader, context)
  });
}

export { TypeGetter };

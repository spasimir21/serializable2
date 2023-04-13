import { ISerializer, createSerializer } from '../ISerializer';
import { Context } from '../context';

function Optional(predicate: (context: Context) => boolean, serializer: ISerializer<any>) {
  return createSerializer<void>({
    write: (_, writer, context) => {
      if (predicate(context)) serializer.write(undefined, writer, context);
    },
    read: (reader, context) => {
      if (predicate(context)) serializer.read(reader, context);
    }
  });
}

export { Optional };

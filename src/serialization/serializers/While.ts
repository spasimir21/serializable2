import { ISerializer, createSerializer } from '../ISerializer';
import { Context } from '../context';

function While(condition: (context: Context) => boolean, serializer: ISerializer<any>) {
  return createSerializer<void>({
    write: (_, writer, context) => {
      while (condition(context)) serializer.write(undefined, writer, context);
    },
    read: (reader, context) => {
      while (condition(context)) serializer.read(reader, context);
    }
  });
}

export { While };

import { ISerializer, createSerializer } from '../ISerializer';
import { Context } from '../context';

function DoWhile(serializer: ISerializer<any>, condition: (context: Context) => boolean) {
  return createSerializer<void>({
    write: (_, writer, context) => {
      do {
        serializer.write(undefined, writer, context);
      } while (condition(context));
    },
    read: (reader, context) => {
      do {
        serializer.read(reader, context);
      } while (condition(context));
    }
  });
}

export { DoWhile };

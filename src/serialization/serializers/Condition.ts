import { ISerializer, createSerializer } from '../ISerializer';
import { Context } from '../context';

function Condition(conditions: [(context: Context) => boolean, ISerializer<any>][], elseSerializer?: ISerializer<any>) {
  return createSerializer<void>({
    write: (_, writer, context) => {
      for (const condition of conditions) {
        if (!condition[0](context)) continue;
        condition[1].write(undefined, writer, context);
        return;
      }

      if (elseSerializer) elseSerializer.write(undefined, writer, context);
    },
    read: (reader, context) => {
      for (const condition of conditions) {
        if (!condition[0](context)) continue;
        condition[1].read(reader, context);
        return;
      }

      if (elseSerializer) elseSerializer.read(reader, context);
    }
  });
}

export { Condition };

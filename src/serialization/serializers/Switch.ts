import { ISerializer, createSerializer } from '../ISerializer';
import { Context } from '../context';

function Switch<TCase extends string | number | symbol>(
  getCase: (context: Context) => TCase,
  cases: Record<TCase, ISerializer<any>>
) {
  return createSerializer<void>({
    write: (_, writer, context) => cases[getCase(context)].write(undefined, writer, context),
    read: (reader, context) => cases[getCase(context)].read(reader, context)
  });
}

export { Switch };

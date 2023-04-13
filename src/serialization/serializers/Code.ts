import { createSerializer } from '../ISerializer';
import { Context } from '../context';

function Code(callback: (context: Context) => void) {
  return createSerializer<void>({
    write: (_, __, context) => callback(context),
    read: (_, context) => callback(context)
  });
}

export { Code };

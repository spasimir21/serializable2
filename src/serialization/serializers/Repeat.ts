import { ISerializer, createSerializer } from '../ISerializer';
import { Context, getCurrentContext } from '../context';
import { Stack } from '../../utils/Stack';

interface Iterator {
  index: number;
}

function createIterator(iteratorSymbol: symbol): Iterator {
  return {
    get index() {
      return (getCurrentContext() as any)[iteratorSymbol].peek();
    }
  };
}

function Repeat(getCount: (context: Context) => number, getSerializer: (iterator: Iterator) => ISerializer<any>) {
  const iteratorSymbol = Symbol();

  const iterator = createIterator(iteratorSymbol);
  const serializer = getSerializer(iterator);

  return createSerializer<void>({
    write: (value, writer, context) => {
      if (context[iteratorSymbol] == null) context[iteratorSymbol] = new Stack();
      const stack = context[iteratorSymbol] as Stack<number>;

      stack.push(0);

      const count = getCount(context);
      for (let i = 0; i < count; i++) {
        stack.replaceTop(i);
        serializer.write(value, writer, context);
      }

      stack.pop();
    },
    read: (reader, context) => {
      if (context[iteratorSymbol] == null) context[iteratorSymbol] = new Stack();
      const stack = context[iteratorSymbol] as Stack<number>;

      stack.push(0);

      const count = getCount(context);
      for (let i = 0; i < count; i++) {
        stack.replaceTop(i);
        serializer.read(reader, context);
      }

      stack.pop();
    }
  });
}

export { Repeat };

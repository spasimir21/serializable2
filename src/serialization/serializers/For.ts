import { Stack } from '../../utils/Stack';
import { ISerializer, createSerializer } from '../ISerializer';
import { Context, getCurrentContext } from '../context';

interface Iterator<T> {
  value: T;
}

function createIterator<T>(iteratorSymbol: symbol): Iterator<T> {
  return {
    get value() {
      return (getCurrentContext() as any)[iteratorSymbol].peek();
    }
  };
}

function For<T>(
  initialize: (context: Context) => T,
  condition: (value: T, context: Context) => boolean,
  update: (value: T, context: Context) => T,
  getSerializer: (iterator: Iterator<T>) => ISerializer<any>
) {
  const iteratorSymbol = Symbol();

  const iterator = createIterator<T>(iteratorSymbol);
  const serializer = getSerializer(iterator);

  return createSerializer<void>({
    write: (value, writer, context) => {
      if (context[iteratorSymbol] == null) context[iteratorSymbol] = new Stack();
      const stack = context[iteratorSymbol] as Stack<T>;

      stack.push(null as any);

      let iterValue;
      for (iterValue = initialize(context); condition(iterValue, context); iterValue = update(iterValue, context)) {
        stack.replaceTop(iterValue);
        serializer.write(value, writer, context);
      }

      stack.pop();
    },
    read: (reader, context) => {
      if (context[iteratorSymbol] == null) context[iteratorSymbol] = new Stack();
      const stack = context[iteratorSymbol] as Stack<T>;

      stack.push(null as any);

      let iterValue;
      for (iterValue = initialize(context); condition(iterValue, context); iterValue = update(iterValue, context)) {
        stack.replaceTop(iterValue);
        serializer.read(reader, context);
      }

      stack.pop();
    }
  });
}

export { For };

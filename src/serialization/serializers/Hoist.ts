import { DeserializationContext, getCurrentContext } from '../context';
import { ISerializer, createSerializer } from '../ISerializer';
import { Stack } from '../../utils/Stack';

interface Reference<T> {
  current: T;
}

function createValueReference<T>(hoistSymbol: symbol): Reference<T> {
  return {
    get current() {
      return (getCurrentContext() as any)[hoistSymbol].peek();
    },
    set current(newValue: T) {
      const stack = (getCurrentContext() as any)[hoistSymbol];
      stack.replaceTop(newValue);
    }
  };
}

function Hoist<T>(getSerializer: (valueReference: Reference<T>) => ISerializer<any>) {
  const hoistSymbol = Symbol();

  const valueReference = createValueReference<T>(hoistSymbol);
  const serializer = getSerializer(valueReference);

  return createSerializer<T>({
    write: (value, writer, context) => {
      if (context[hoistSymbol] == null) context[hoistSymbol] = new Stack();

      (context[hoistSymbol] as Stack<T>).push(value);
      serializer.write(value, writer, context);
      (context[hoistSymbol] as Stack<T>).pop();
    },
    read: (reader, context) => {
      if (context[hoistSymbol] == null) context[hoistSymbol] = new Stack();

      (context[hoistSymbol] as Stack<T>).push(null as any);
      serializer.read(reader, context);
      return (context[hoistSymbol] as Stack<T>).pop() as T;
    }
  });
}

export { Hoist };

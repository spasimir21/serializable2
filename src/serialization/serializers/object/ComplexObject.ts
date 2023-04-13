import { ISerializer, createSerializer } from '../../ISerializer';
import { Context, getCurrentContext } from '../../context';
import { SerializableProperty } from '../../property';
import { Stack } from '../../../utils/Stack';
import { Field } from './Field';

type ObjectProxy<T> = {
  Field<TValue>(
    name: string | ((context: Context) => string),
    valueProperty: SerializableProperty<TValue>
  ): ISerializer<void>;
} & T;

function createObjectProxy(objectSymbol: symbol) {
  return new Proxy(
    {
      Field: (name: any, valueProperty: any) => Field(name, valueProperty, objectSymbol)
    } as any,
    {
      get: (target, prop) => (prop in target ? target[prop] : (getCurrentContext() as any)[objectSymbol].peek()[prop]),
      set: (_, prop, value) => {
        (getCurrentContext() as any)[objectSymbol].peek()[prop] = value;
        return true;
      }
    }
  );
}

function ComplexObject<T>(getSerializer: (object: ObjectProxy<T>) => ISerializer<void>) {
  const objectSymbol = Symbol();

  const objectProxy = createObjectProxy(objectSymbol) as ObjectProxy<T>;
  const serializer = getSerializer(objectProxy);

  return createSerializer<T>({
    write: (value, writer, context) => {
      if (context[objectSymbol] == null) context[objectSymbol] = new Stack();

      (context[objectSymbol] as Stack<T>).push(value);
      serializer.write(undefined, writer, context);
      (context[objectSymbol] as Stack<T>).pop();
    },
    read: (reader, context) => {
      if (context[objectSymbol] == null) context[objectSymbol] = new Stack();
      const object = {} as T;

      (context[objectSymbol] as Stack<T>).push(object);
      serializer.read(reader, context);
      (context[objectSymbol] as Stack<T>).pop();

      return object;
    }
  });
}

export { ComplexObject, ObjectProxy };

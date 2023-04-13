import { ISerializer, createSerializer } from '../ISerializer';
import { getCurrentContext } from '../context';
import { Stack } from '../../utils/Stack';

function createScopeProxy(scopeSymbol: symbol) {
  return new Proxy(
    {},
    {
      get: (_, prop) => (getCurrentContext() as any)[scopeSymbol].peek()[prop],
      set: (_, prop, value) => {
        (getCurrentContext() as any)[scopeSymbol].peek()[prop] = value;
        return true;
      }
    }
  );
}

function Scope<T, TScope = any>(getSerializer: (scope: TScope) => ISerializer<T>) {
  const scopeSymbol = Symbol();

  const scopeProxy = createScopeProxy(scopeSymbol) as TScope;
  const serializer = getSerializer(scopeProxy);

  return createSerializer<T>({
    write: (value, writer, context) => {
      if (context[scopeSymbol] == null) context[scopeSymbol] = new Stack();
      const scope = {} as TScope;

      (context[scopeSymbol] as Stack<TScope>).push(scope);
      serializer.write(value, writer, context);
      (context[scopeSymbol] as Stack<TScope>).pop();
    },
    read: (reader, context) => {
      if (context[scopeSymbol] == null) context[scopeSymbol] = new Stack();
      const scope = {} as TScope;

      (context[scopeSymbol] as Stack<TScope>).push(scope);
      const result = serializer.read(reader, context);
      (context[scopeSymbol] as Stack<TScope>).pop();

      return result;
    }
  });
}

export { Scope };

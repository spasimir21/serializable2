import { DeserializationContext } from '../context';
import { createSerializer } from '../ISerializer';

function Value<T>(valueOrGetter: T | ((context: DeserializationContext) => T)) {
  return createSerializer<T>({
    write: () => {},
    read: (_, context) => (typeof valueOrGetter === 'function' ? (valueOrGetter as any)(context) : valueOrGetter)
  });
}

const Undefined = Value(undefined);
const Null = Value(null);

const NegativeInfinity = Value(-Infinity);
const _Infinity = Value(Infinity);
const _NaN = Value(NaN);

export { Value, Undefined, Null, NegativeInfinity, _Infinity, _NaN };

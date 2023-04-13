import { ISerializer, createSerializer, isSerializer } from './ISerializer';
import { DeserializationContext } from './context';

type SerializableProperty<T> = T | ((context: DeserializationContext) => T) | ISerializer<T>;

function createPropertySerializer<T>(property: SerializableProperty<T>): ISerializer<T> {
  if (isSerializer(property)) return property;

  if (typeof property === 'function')
    return createSerializer<T>({
      write: () => {},
      read: (_, context) => (property as any)(context)
    });

  return createSerializer<T>({
    write: () => {},
    read: () => property
  });
}

export { createPropertySerializer, SerializableProperty };

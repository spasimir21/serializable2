import { DeserializationContext, SerializationContext } from './context';
import { BinaryReader } from '../binary/BinaryReader';
import { BinaryWriter } from '../binary/BinaryWriter';

const $IS_SERIALIZER = Symbol('$IS_SERIALIZER');

interface ISerializer<T> {
  write(value: T, writer: BinaryWriter, context: SerializationContext): void;
  read(reader: BinaryReader, context: DeserializationContext): T;
  [$IS_SERIALIZER]: true;
}

function createSerializer<T>(serializer: Omit<ISerializer<T>, typeof $IS_SERIALIZER>): ISerializer<T> {
  (serializer as ISerializer<T>)[$IS_SERIALIZER] = true;
  return serializer as ISerializer<T>;
}

function isSerializer<T = any>(object: any): object is ISerializer<T> {
  if (typeof object !== 'object' || object == null) return false;
  return object[$IS_SERIALIZER] ?? false;
}

export { ISerializer, createSerializer, isSerializer };

import { BinaryReader } from '../binary/BinaryReader';
import { BinaryWriter } from '../binary/BinaryWriter';
import { ISerializer } from './ISerializer';
import {
  DeserializationContext,
  SerializationContext,
  SerializationOperation,
  popContext,
  pushContext
} from './context';

function serialize<T>(value: T, serializer: ISerializer<T>, contextValues: any = {}): Buffer {
  const writer = new BinaryWriter();
  const context: SerializationContext = { ...contextValues, operation: SerializationOperation.Serialize, writer };

  pushContext(context);
  serializer.write(value, writer, context);
  popContext();

  return writer.toBuffer();
}

function serializeWithinParent<T>(value: T, serializer: ISerializer<T>, context: SerializationContext): Buffer {
  const parentWriter = context.writer;
  const writer = new BinaryWriter();

  context.writer = writer;
  serializer.write(value, writer, context);
  context.writer = parentWriter;

  return writer.toBuffer();
}

function deserialize<T>(buffer: Buffer, serializer: ISerializer<T>, contextValues: any = {}, offset: number = 0): T {
  const reader = new BinaryReader(buffer, offset);
  const context: DeserializationContext = { ...contextValues, operation: SerializationOperation.Deserialize, reader };

  pushContext(context);
  const result = serializer.read(reader, context);
  popContext();

  return result;
}

function deserializeWithinParent<T>(
  buffer: Buffer,
  serializer: ISerializer<T>,
  context: DeserializationContext,
  offset: number = 0
): T {
  const parentReader = context.reader;
  const reader = new BinaryReader(buffer, offset);

  context.reader = reader;
  const result = serializer.read(reader, context);
  context.reader = parentReader;

  return result;
}

export { serialize, serializeWithinParent, deserialize, deserializeWithinParent };

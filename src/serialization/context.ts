import { BinaryReader } from '../binary/BinaryReader';
import { BinaryWriter } from '../binary/BinaryWriter';
import { Stack } from '../utils/Stack';

enum SerializationOperation {
  Serialize,
  Deserialize
}

interface SerializationContext {
  operation: SerializationOperation.Serialize;
  writer: BinaryWriter;
  [key: string | number | symbol]: any;
}

interface DeserializationContext {
  operation: SerializationOperation.Deserialize;
  reader: BinaryReader;
  [key: string | number | symbol]: any;
}

type Context = SerializationContext | DeserializationContext;

const CONTEXT_STACK = new Stack<Context>();

const pushContext = (context: Context) => CONTEXT_STACK.push(context);
const getCurrentContext = () => CONTEXT_STACK.peek();
const popContext = () => CONTEXT_STACK.pop();

export {
  SerializationOperation,
  SerializationContext,
  DeserializationContext,
  Context,
  pushContext,
  getCurrentContext,
  popContext
};

import { SerializableProperty, createPropertySerializer } from '../property';
import { BufferAdapter } from '../../binary/adapters/bufferAdapter';
import { ISerializer, createSerializer } from '../ISerializer';
import { BinaryWriter } from '../../binary/BinaryWriter';
import { getCurrentContext } from '../context';
import { Stack } from '../../utils/Stack';

function createOptimizedSerializer<TUnoptimized>(optimizerSymbol: symbol, indexSerializer: ISerializer<number>) {
  return createSerializer<TUnoptimized>({
    write: (value, writer, context) => {
      const optimizationMap = (getCurrentContext() as any)[optimizerSymbol].peek() as Map<TUnoptimized, number>;
      if (!optimizationMap.has(value)) optimizationMap.set(value, optimizationMap.size);
      indexSerializer.write(optimizationMap.get(value) as number, writer, context);
    },
    read: (reader, context) => {
      const optimizationArray = (getCurrentContext() as any)[optimizerSymbol].peek() as TUnoptimized[];
      const index = indexSerializer.read(reader, context);
      return optimizationArray[index];
    }
  });
}

function OptimizationSet<T, TUnoptimized>(
  sizeProperty: SerializableProperty<number>,
  indexSerializer: ISerializer<number>,
  unoptimizedSerializer: ISerializer<TUnoptimized>,
  getSerializer: (optimizedSerializer: ISerializer<TUnoptimized>) => ISerializer<T>
) {
  const sizeSerializer = createPropertySerializer(sizeProperty);
  const optimizerSymbol = Symbol();

  const optimizedSerializer = createOptimizedSerializer<TUnoptimized>(optimizerSymbol, indexSerializer);
  const serializer = getSerializer(optimizedSerializer);

  return createSerializer<T>({
    write: (value, writer, context) => {
      if (!(optimizerSymbol in context)) context[optimizerSymbol] = new Stack();
      const stack = context[optimizerSymbol] as Stack<Map<TUnoptimized, number>>;

      const optimizationMap = new Map<TUnoptimized, number>();
      stack.push(optimizationMap);
      serializer.write(value, writer, context);
      stack.pop();

      const headerWriter = new BinaryWriter();
      context.writer = headerWriter;

      sizeSerializer.write(optimizationMap.size, headerWriter, context);
      const headerItems = new Array<TUnoptimized>(optimizationMap.size);

      for (const [item, index] of optimizationMap) headerItems[index] = item;

      for (const item of headerItems) unoptimizedSerializer.write(item, headerWriter, context);

      context.writer = writer;

      const header = headerWriter.toBuffer();

      writer.unshiftWrite(BufferAdapter, header);
    },
    read: (reader, context) => {
      if (!(optimizerSymbol in context)) context[optimizerSymbol] = new Stack();
      const stack = context[optimizerSymbol] as Stack<TUnoptimized[]>;

      const size = sizeSerializer.read(reader, context);

      const optimizationArray = new Array<TUnoptimized>(size);
      for (let i = 0; i < size; i++) optimizationArray[i] = unoptimizedSerializer.read(reader, context);

      stack.push(optimizationArray);
      const result = serializer.read(reader, context);
      stack.pop();

      return result;
    }
  });
}

export { OptimizationSet };

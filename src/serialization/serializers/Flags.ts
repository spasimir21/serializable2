import { ISerializer, createSerializer } from '../ISerializer';

function generateStringFlagsForwardMap(flagChars: string): Record<string, number> {
  const forwardMap = {} as any;
  for (let i = 0; i < flagChars.length; i++) forwardMap[flagChars.charAt(i)] = i;
  return forwardMap;
}

function generateStringFlagsBackwardMap(flagChars: string): string[] {
  const backwardMap = new Array<string>(flagChars.length);
  for (let i = 0; i < flagChars.length; i++) backwardMap[i] = flagChars.charAt(i);
  return backwardMap;
}

function StringFlags(serializer: ISerializer<number>, flagChars: string) {
  const forwardMap = generateStringFlagsForwardMap(flagChars);
  const backwardMap = generateStringFlagsBackwardMap(flagChars);

  return createSerializer<string>({
    write: (value, writer, context) => {
      let encoded = 0;
      for (let i = 0; i < value.length; i++) encoded |= 1 << forwardMap[value.charAt(i)];
      serializer.write(encoded, writer, context);
    },
    read: (reader, context) => {
      const encoded = serializer.read(reader, context);
      let flags = '';

      for (let i = 0; i < flagChars.length; i++) if ((encoded & (1 << i)) != 0) flags += backwardMap[i];

      return flags;
    }
  });
}

function ObjectFlags<T extends string | number | symbol>(serializer: ISerializer<number>, properties: T[]) {
  return createSerializer<Record<T, boolean>>({
    write: (value, writer, context) => {
      let encoded = 0;
      for (let i = 0; i < properties.length; i++) if (value[properties[i]]) encoded |= 1 << i;
      serializer.write(encoded, writer, context);
    },
    read: (reader, context) => {
      const encoded = serializer.read(reader, context);
      const flags = {} as any;

      for (let i = 0; i < properties.length; i++) flags[properties[i]] = (encoded & (1 << i)) != 0;

      return flags;
    }
  });
}

function ArrayFlags(serializer: ISerializer<number>, count: number) {
  return createSerializer<boolean[]>({
    write: (value, writer, context) => {
      let encoded = 0;
      for (let i = 0; i < count; i++) if (value[i]) encoded |= 1 << i;
      serializer.write(encoded, writer, context);
    },
    read: (reader, context) => {
      const encoded = serializer.read(reader, context);
      const flags = new Array<boolean>(count);

      for (let i = 0; i < count; i++) flags[i] = (encoded & (1 << i)) != 0;

      return flags;
    }
  });
}

export { ArrayFlags, ObjectFlags, StringFlags };

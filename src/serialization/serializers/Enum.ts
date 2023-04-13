import { ISerializer, createSerializer } from '../ISerializer';

type EnumValue = string | number | symbol;

function getForwardMap<T extends EnumValue>(values: T[] | Record<T, number>): Record<T, number> {
  if (!Array.isArray(values)) return values;

  const result = {} as Record<T, number>;
  for (let i = 0; i < values.length; i++) result[values[i]] = i;
  return result;
}

function getBackwardMap<T extends EnumValue>(values: T[] | Record<T, number>): Record<number, T> {
  if (Array.isArray(values)) {
    const result = {} as Record<number, T>;
    for (let i = 0; i < values.length; i++) result[i] = values[i];
    return result;
  }

  const result = {} as Record<number, T>;
  for (const key in values) result[values[key]] = key;
  return result;
}

function Enum<T extends EnumValue>(serializer: ISerializer<number>, values: T[] | Record<T, number>) {
  const forwardMap = getForwardMap(values);
  const backwardMap = getBackwardMap(values);

  return createSerializer<T>({
    write: (value, writer, context) => serializer.write(forwardMap[value], writer, context),
    read: (reader, context) => backwardMap[serializer.read(reader, context)]
  });
}

export { Enum };

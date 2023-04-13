import { ISerializer, createSerializer } from '../ISerializer';

function Sequence(serializers: ISerializer<any>[]) {
  return createSerializer<void>({
    write: (_, writer, context) => {
      for (const serializer of serializers) serializer.write(undefined, writer, context);
    },
    read: (reader, context) => {
      for (const serializer of serializers) serializer.read(reader, context);
    }
  });
}

export { Sequence };

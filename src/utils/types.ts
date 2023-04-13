import { ISerializer } from '../serialization/ISerializer';

type GetSerializerType<T> = T extends ISerializer<infer U> ? U : never;

type SerializerSchemaFor<T> = {
  [TKey in keyof T]: ISerializer<T[TKey]>;
};

export { GetSerializerType, SerializerSchemaFor };

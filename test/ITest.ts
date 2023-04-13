import { ISerializer } from '../src';

interface ITest<T> {
  name: string;
  serializer: ISerializer<T>;
  cases: { name: string; value: T }[];
}

export { ITest };

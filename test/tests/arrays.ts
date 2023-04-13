import { UInt8, VarUInt, _String, _Array } from '../../src';
import { createArray } from '../utils/createArray';
import { ITest } from '../ITest';

const MAX_SIZE = 32;

const randomByte = () => Math.floor(Math.random() * 256);

const generateRandomString = (size: number) =>
  String.fromCharCode(...createArray(size, () => Math.floor(Math.random() * 128)));

const ARRAY_TESTS: ITest<any[]>[] = [
  {
    name: 'Array (UInt8) (Static Size)',
    serializer: _Array(MAX_SIZE, UInt8),
    cases: createArray(5, i => ({
      name: `Case #${i + 1}`,
      value: createArray(MAX_SIZE, randomByte)
    }))
  },
  {
    name: 'Array (UInt8) (Getter Size)',
    serializer: _Array(() => MAX_SIZE, UInt8),
    cases: createArray(5, i => ({
      name: `Case #${i + 1}`,
      value: createArray(MAX_SIZE, randomByte)
    }))
  },
  {
    name: 'Array (UInt8) (Dynamic Size)',
    serializer: _Array(VarUInt, UInt8),
    cases: createArray(5, i => ({
      name: `Case #${i + 1}`,
      value: createArray(MAX_SIZE, randomByte)
    }))
  },
  {
    name: 'Array (String) (Dynamic Size)',
    serializer: _Array(VarUInt, _String(UInt8)),
    cases: createArray(5, i => ({
      name: `Case #${i + 1}`,
      value: createArray(MAX_SIZE, generateRandomString)
    }))
  }
];

export { ARRAY_TESTS };

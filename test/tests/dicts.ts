import { VarUInt, VarInt, _String, Dict } from '../../src';
import { createArray } from '../utils/createArray';
import { ITest } from '../ITest';

const generateRandomString = (size: number) =>
  String.fromCharCode(...createArray(size, () => Math.floor(Math.random() * 128)));

const MAX_SIZE = 25;

const DICT_TESTS: ITest<Record<string, number>>[] = [
  {
    name: 'Dictionary (Static Keys Count)',
    serializer: Dict(MAX_SIZE, _String(VarUInt), VarInt),
    cases: createArray(5, i => ({
      name: `Case #${i + 1}`,
      value: Object.fromEntries(
        createArray(MAX_SIZE, () => [generateRandomString(10), Math.floor(Math.random() * 100)])
      )
    }))
  },
  {
    name: 'Dictionary (Getter Keys Count)',
    serializer: Dict(() => MAX_SIZE, _String(VarUInt), VarInt),
    cases: createArray(5, i => ({
      name: `Case #${i + 1}`,
      value: Object.fromEntries(
        createArray(MAX_SIZE, () => [generateRandomString(10), Math.floor(Math.random() * 100)])
      )
    }))
  },
  {
    name: 'Dictionary (Dynamic Keys Count)',
    serializer: Dict(VarUInt, _String(VarUInt), VarInt),
    cases: createArray(5, i => ({
      name: `Case #${i + 1}`,
      value: Object.fromEntries(
        createArray(Math.ceil(Math.random() * MAX_SIZE), () => [
          generateRandomString(10),
          Math.floor(Math.random() * 100)
        ])
      )
    }))
  }
];

export { DICT_TESTS };

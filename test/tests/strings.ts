import { createArray } from '../utils/createArray';
import { VarUInt, _String } from '../../src';
import * as crypto from 'crypto';
import { ITest } from '../ITest';

const generateRandomString = (size: number) =>
  String.fromCharCode(...createArray(size, () => Math.floor(Math.random() * 128)));

// 1 kB
const MAX_SIZE = 1024;

const STRING_TESTS: ITest<string>[] = [
  {
    name: 'String (No Encoding) (Static Size)',
    serializer: _String(MAX_SIZE),
    cases: createArray(5, i => ({
      name: `Case #${i + 1}`,
      value: generateRandomString(MAX_SIZE)
    }))
  },
  {
    name: 'String (No Encoding) (Getter Size)',
    serializer: _String(() => MAX_SIZE),
    cases: createArray(5, i => ({
      name: `Case #${i + 1}`,
      value: generateRandomString(MAX_SIZE)
    }))
  },
  {
    name: 'String (No Encoding) (Dynamic Size)',
    serializer: _String(VarUInt),
    cases: createArray(5, i => ({
      name: `Case #${i + 1}`,
      value: generateRandomString(Math.ceil(Math.random() * MAX_SIZE))
    }))
  },
  {
    name: 'String (Hex)',
    serializer: _String(VarUInt, 'hex'),
    cases: createArray(5, i => ({
      name: `Case #${i + 1}`,
      value: crypto.randomBytes(Math.ceil(Math.random() * MAX_SIZE)).toString('hex')
    }))
  },
  {
    name: 'String (Base64)',
    serializer: _String(VarUInt, 'base64'),
    cases: createArray(5, i => ({
      name: `Case #${i + 1}`,
      value: crypto.randomBytes(Math.ceil(Math.random() * MAX_SIZE)).toString('base64')
    }))
  }
];

export { STRING_TESTS };

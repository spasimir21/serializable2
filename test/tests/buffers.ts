import { createArray } from '../utils/createArray';
import { VarUInt, _Buffer } from '../../src';
import * as crypto from 'crypto';
import { ITest } from '../ITest';

// 1 kB
const MAX_SIZE = 1024;

const BUFFER_TESTS: ITest<Buffer>[] = [
  {
    name: 'Buffer (Static Size)',
    serializer: _Buffer(MAX_SIZE),
    cases: createArray(5, i => ({
      name: `Case #${i + 1}`,
      value: crypto.randomBytes(MAX_SIZE)
    }))
  },
  {
    name: 'Buffer (Getter Size)',
    serializer: _Buffer(() => MAX_SIZE),
    cases: createArray(5, i => ({
      name: `Case #${i + 1}`,
      value: crypto.randomBytes(MAX_SIZE)
    }))
  },
  {
    name: 'Buffer (Dynamic Size)',
    serializer: _Buffer(VarUInt),
    cases: createArray(5, i => ({
      name: `Case #${i + 1}`,
      value: crypto.randomBytes(Math.ceil(Math.random() * MAX_SIZE))
    }))
  }
];

export { BUFFER_TESTS };

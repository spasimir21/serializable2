import { createArray } from '../utils/createArray';
import { VarLong, VarULong } from '../../src';
import * as crypto from 'crypto';
import { ITest } from '../ITest';

function generateBitMaskBigInt(bits: number): bigint {
  const fullBytes = Math.floor(bits / 8);
  const extraBits = bits - fullBytes * 8;

  let bitmask = createArray(extraBits, i => 0x1n << BigInt(i)).reduce((a, b) => a | b, 0n);

  for (let i = 0; i < fullBytes; i++) bitmask = (bitmask << 8n) | 0b11111111n;

  return bitmask;
}

function generateVarLongCase(size: number, signed: boolean) {
  const hexNumber = '0x' + crypto.randomBytes(size).toString('hex');

  let number = BigInt(hexNumber);

  number = number & generateBitMaskBigInt(size * 7);

  if (signed) number = (Math.random() > 0.5 ? 1n : -1n) * (number & generateBitMaskBigInt(size * 7 - 1));

  return number;
}

const VAR_LONG_TESTS: ITest<bigint>[] = [
  {
    name: 'VarLong',
    serializer: VarLong,
    cases: createArray(8, i => ({
      name: `Random #${i + 1}`,
      value: generateVarLongCase(i + 1, true)
    }))
  },
  {
    name: 'VarULong',
    serializer: VarULong,
    cases: createArray(8, i => ({
      name: `Random #${i + 1}`,
      value: generateVarLongCase(i + 1, false)
    }))
  }
];

export { VAR_LONG_TESTS };

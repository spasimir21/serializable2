import { createArray } from '../utils/createArray';
import { VarInt, VarUInt } from '../../src';
import * as crypto from 'crypto';
import { ITest } from '../ITest';

function generateBitMask(bits: number): number {
  const fullBytes = Math.floor(bits / 8);
  const extraBits = bits - fullBytes * 8;

  let bitmask = createArray(extraBits, i => 0x1 << i).reduce((a, b) => a | b, 0);

  for (let i = 0; i < fullBytes; i++) bitmask = (bitmask << 8) | 0b11111111;

  return bitmask;
}

function generateVarIntCase(size: number, signed: boolean) {
  const hexNumber = '0x' + crypto.randomBytes(size).toString('hex');

  let number = Number(hexNumber);

  number = number & generateBitMask(size * 7);

  if (signed) number = (Math.random() > 0.5 ? 1 : -1) * (number & generateBitMask(size * 7 - 1));

  return number;
}

const VAR_INT_TESTS: ITest<number>[] = [
  {
    name: 'VarInt',
    serializer: VarInt,
    cases: createArray(4, i => ({
      name: `Random #${i + 1}`,
      value: generateVarIntCase(i + 1, true)
    }))
  },
  {
    name: 'VarUInt',
    serializer: VarUInt,
    cases: createArray(4, i => ({
      name: `Random #${i + 1}`,
      value: generateVarIntCase(i + 1, false)
    }))
  }
];

export { VAR_INT_TESTS };

import { Int8, UInt8, Int16, UInt16, Int32, UInt32, BigInt64, BigUInt64, Float, Double } from '../../src';
import { createArray } from '../utils/createArray';
import { ISerializer } from '../../src';
import * as crypto from 'crypto';
import { ITest } from '../ITest';

function generateNumberCase(size: number, signed: boolean, bigint: boolean) {
  const hexNumber = '0x' + crypto.randomBytes(size).toString('hex');

  if (bigint) {
    let number = BigInt(hexNumber);

    if (signed) {
      let bitmask = 0b01111111n;
      for (let i = 0; i < size - 1; i++) bitmask = (bitmask << 8n) | 0b11111111n;
      number = (Math.random() > 0.5 ? 1n : -1n) * (number & bitmask);
    }

    return number;
  }

  let number = Number(hexNumber);

  if (signed) {
    let bitmask = 0b01111111;
    for (let i = 0; i < size - 1; i++) bitmask = (bitmask << 8) | 0b11111111;
    number = (Math.random() > 0.5 ? 1 : -1) * (number & bitmask);
  }

  return number;
}

function generateNumberTest(
  name: string,
  serializer: ISerializer<number>,
  size: number,
  signed: boolean,
  bigint: false
): ITest<number>;
function generateNumberTest(
  name: string,
  serializer: ISerializer<bigint>,
  size: number,
  signed: boolean,
  bigint: true
): ITest<bigint>;
function generateNumberTest(
  name: string,
  serializer: ISerializer<number | bigint>,
  size: number,
  signed: boolean,
  bigint: boolean
): ITest<number | bigint> {
  return {
    name,
    serializer,
    cases: createArray(5, i => ({
      name: `Random #${i + 1}`,
      value: generateNumberCase(size, signed, bigint)
    }))
  };
}

const NUMBER_TESTS: (ITest<number> | ITest<bigint>)[] = [
  generateNumberTest('Int8', Int8, 1, true, false),
  generateNumberTest('UInt8', UInt8, 1, false, false),
  generateNumberTest('Int16', Int16, 2, true, false),
  generateNumberTest('UInt16', UInt16, 2, false, false),
  generateNumberTest('Int32', Int32, 4, true, false),
  generateNumberTest('UInt32', UInt32, 4, false, false),
  generateNumberTest('BigInt64', BigInt64, 8, true, true),
  generateNumberTest('BigUInt64', BigUInt64, 8, false, true),
  {
    name: 'Float',
    serializer: Float,
    cases: createArray(5, i => ({
      name: `Random #${i + 1}`,
      value: crypto.randomBytes(4).readFloatBE()
    }))
  },
  {
    name: 'Double',
    serializer: Double,
    cases: createArray(5, i => ({
      name: `Random #${i + 1}`,
      value: crypto.randomBytes(8).readDoubleBE()
    }))
  }
];

export { NUMBER_TESTS };

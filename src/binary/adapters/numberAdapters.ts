import { createBinaryAdapter } from '../IBinaryAdapter';

const getNumberTypeName = (size: number, signed: boolean, littleEndian: boolean, bigint: boolean) =>
  `${bigint ? 'Big' : ''}${!signed ? 'U' : ''}Int${size * 8}${size <= 1 ? '' : littleEndian ? 'LE' : 'BE'}`;

function createNumberAdapter<T extends number | bigint = number>(typeName: string, size: number) {
  const writeFunctionName = `write${typeName}`;
  const readFunctionName = `read${typeName}`;

  return createBinaryAdapter<T, []>({
    write: (value, buffer, offset) => (buffer as any)[writeFunctionName](value, offset),
    read: (buffer, offset, moveOffset) => {
      const result = (buffer as any)[readFunctionName](offset);
      offset = moveOffset(size);
      return result;
    },
    size: () => size
  });
}

// Big-Endian (Default)
const Int8Adapter = createNumberAdapter(getNumberTypeName(1, true, false, false), 1);
const UInt8Adapter = createNumberAdapter(getNumberTypeName(1, false, false, false), 1);
const Int16Adapter = createNumberAdapter(getNumberTypeName(2, true, false, false), 2);
const UInt16Adapter = createNumberAdapter(getNumberTypeName(2, false, false, false), 2);
const Int32Adapter = createNumberAdapter(getNumberTypeName(4, true, false, false), 4);
const UInt32Adapter = createNumberAdapter(getNumberTypeName(4, false, false, false), 4);
const BigInt64Adapter = createNumberAdapter<bigint>(getNumberTypeName(8, true, false, true), 8);
const BigUInt64Adapter = createNumberAdapter<bigint>(getNumberTypeName(8, false, false, true), 8);

const FloatAdapter = createNumberAdapter('FloatBE', 4);
const DoubleAdapter = createNumberAdapter('DoubleBE', 8);

// Little-Endian
const Int16LEAdapter = createNumberAdapter(getNumberTypeName(2, true, true, false), 2);
const UInt16LEAdapter = createNumberAdapter(getNumberTypeName(2, false, true, false), 2);
const Int32LEAdapter = createNumberAdapter(getNumberTypeName(4, true, true, false), 4);
const UInt32LEAdapter = createNumberAdapter(getNumberTypeName(4, false, true, false), 4);
const BigInt64LEAdapter = createNumberAdapter<bigint>(getNumberTypeName(8, true, true, true), 8);
const BigUInt64LEAdapter = createNumberAdapter<bigint>(getNumberTypeName(8, false, true, true), 8);

const FloatLEAdapter = createNumberAdapter('FloatLE', 4);
const DoubleLEAdapter = createNumberAdapter('DoubleLE', 8);

export {
  Int8Adapter,
  UInt8Adapter,
  Int16Adapter,
  UInt16Adapter,
  Int32Adapter,
  UInt32Adapter,
  BigInt64Adapter,
  BigUInt64Adapter,
  FloatAdapter,
  DoubleAdapter,
  Int16LEAdapter,
  UInt16LEAdapter,
  Int32LEAdapter,
  UInt32LEAdapter,
  BigInt64LEAdapter,
  BigUInt64LEAdapter,
  FloatLEAdapter,
  DoubleLEAdapter
};

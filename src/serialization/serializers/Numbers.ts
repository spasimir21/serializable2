import { createSerializerFromAdapter } from '../fromAdapter';
import {
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
  Int32LEAdapter,
  UInt16LEAdapter,
  BigInt64LEAdapter,
  UInt32LEAdapter,
  BigUInt64LEAdapter,
  FloatLEAdapter,
  DoubleLEAdapter
} from '../../binary/adapters/numberAdapters';

// Big-Endian (Default)
const Int8 = createSerializerFromAdapter(Int8Adapter);
const UInt8 = createSerializerFromAdapter(UInt8Adapter);
const Int16 = createSerializerFromAdapter(Int16Adapter);
const UInt16 = createSerializerFromAdapter(UInt16Adapter);
const Int32 = createSerializerFromAdapter(Int32Adapter);
const UInt32 = createSerializerFromAdapter(UInt32Adapter);
const BigInt64 = createSerializerFromAdapter(BigInt64Adapter);
const BigUInt64 = createSerializerFromAdapter(BigUInt64Adapter);

const Float = createSerializerFromAdapter(FloatAdapter);
const Double = createSerializerFromAdapter(DoubleAdapter);

// Little-Endian
const Int16LE = createSerializerFromAdapter(Int16LEAdapter);
const UInt16LE = createSerializerFromAdapter(UInt16LEAdapter);
const Int32LE = createSerializerFromAdapter(Int32LEAdapter);
const UInt32LE = createSerializerFromAdapter(UInt32LEAdapter);
const BigInt64LE = createSerializerFromAdapter(BigInt64LEAdapter);
const BigUInt64LE = createSerializerFromAdapter(BigUInt64LEAdapter);

const FloatLE = createSerializerFromAdapter(FloatLEAdapter);
const DoubleLE = createSerializerFromAdapter(DoubleLEAdapter);

export {
  Int8,
  UInt8,
  Int16,
  UInt16,
  Int32,
  UInt32,
  BigInt64,
  BigUInt64,
  Float,
  Double,
  Int16LE,
  UInt16LE,
  Int32LE,
  UInt32LE,
  BigInt64LE,
  BigUInt64LE,
  FloatLE,
  DoubleLE
};

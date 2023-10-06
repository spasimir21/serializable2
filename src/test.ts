import { Compress, CompressionType } from './serialization/serializers/Compress';
import { OptimizationSet } from './serialization/serializers/OptimizationSet';
import { deserialize, serialize } from './serialization/serialization';
import { UInt16, UInt8 } from './serialization/serializers/Numbers';
import { _String } from './serialization/serializers/String';
import { _Array } from './serialization/serializers/Array';
import { GetSerializerType } from './utils/types';
import * as fs from 'fs';

// const schema = Compress(
//   { type: CompressionType.Gzip },
//   context => context.reader.remainingBytes,
//   OptimizationSet(UInt16, UInt8, _String(UInt8), Str => _Array(UInt8, Str))
// );

const schema = Compress(
  { type: CompressionType.DeflateRaw },
  context => context.reader.remainingBytes,
  _Array(UInt8, _String(UInt8))
);

const value: GetSerializerType<typeof schema> = ['Hello, world!', 'Cool', 'Nice', 'Cool', 'Hello, world!'];

const context = {};

const serialized = serialize(value, schema, context);

const deserialized = deserialize(serialized, schema, context);

console.log(serialized);
console.log(serialized.byteLength);

console.log(value);
console.log(deserialized);

fs.writeFileSync('serialized.dat', serialized);

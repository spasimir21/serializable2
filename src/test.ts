import { deserialize, serialize } from './serialization/serialization';
import { _RegExp } from './serialization/serializers/RegExp';
import { _String } from './serialization/serializers/String';
import { UInt8 } from './serialization/serializers/Numbers';
import { GetSerializerType } from './utils/types';

const schema = _RegExp(_String(UInt8));

const value: GetSerializerType<typeof schema> = /[a-zA-Z0-9]+/gi;

const context = {};

const serialized = serialize(value, schema, context);

const deserialized = deserialize(serialized, schema, context);

console.log(serialized);
console.log(serialized.byteLength);

console.log(value);
console.log(deserialized);

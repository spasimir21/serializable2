import { False, NegativeInfinity, Null, True, Undefined, _Infinity, _NaN } from './Value';
import { ISerializer } from '../ISerializer';
import { VarInt, VarUInt } from './VarInt';
import { TypeGetter } from './TypeGetter';
import { Float, UInt8 } from './Numbers';
import { _Boolean } from './Boolean';
import { VarLong } from './VarLong';
import { _Buffer } from './Buffer';
import { _String } from './String';
import { _RegExp } from './RegExp';
import { Select } from './Select';
import { _Array } from './Array';
import { _Date } from './Date';
import { Dict } from './Dict';
import { _Map } from './Map';
import { _Set } from './Set';

const VarString = _String(VarUInt);

const _Dynamic = TypeGetter(() => Dynamic as any);

const Dynamic: ISerializer<any> = Select(
  UInt8,
  value => {
    if (value === null) return 0;
    if (value === undefined) return 1;
    if (value === true) return 2;
    if (value === false) return 3;
    if (value === -Infinity) return 4;
    if (value === Infinity) return 5;

    if (typeof value === 'number') {
      if (isNaN(value)) return 6;
      return value % 1 === 0 ? 7 : 8;
    }

    if (typeof value === 'bigint') return 9;

    if (typeof value === 'string') return 10;

    if (value instanceof Buffer) return 11;
    if (value instanceof Date) return 12;
    if (value instanceof RegExp) return 13;
    if (value instanceof Map) return 14;
    if (value instanceof Set) return 15;

    if (Array.isArray(value)) return 16;

    if (typeof value === 'object') return 17;

    return 0;
  },
  [
    Null,
    Undefined,
    True,
    False,
    NegativeInfinity,
    _Infinity,
    _NaN,
    VarInt,
    Float,
    VarLong,
    VarString,
    _Buffer(VarUInt),
    _Date,
    _RegExp(VarString),
    _Map(VarUInt, _Dynamic, _Dynamic),
    _Set(VarUInt, _Dynamic),
    _Array(VarUInt, _Dynamic),
    Dict(VarUInt, VarString, _Dynamic)
  ]
);

export { Dynamic };

import { VarIntAdapter, VarUIntAdapter } from '../../binary/adapters/varIntAdapters';
import { createSerializerFromAdapter } from '../fromAdapter';

const VarInt = createSerializerFromAdapter(VarIntAdapter);
const VarUInt = createSerializerFromAdapter(VarUIntAdapter);

export { VarInt, VarUInt };

import { VarLongAdapter, VarULongAdapter } from '../../binary/adapters/varLongAdapter';
import { createSerializerFromAdapter } from '../fromAdapter';

const VarLong = createSerializerFromAdapter(VarLongAdapter);
const VarULong = createSerializerFromAdapter(VarULongAdapter);

export { VarLong, VarULong };

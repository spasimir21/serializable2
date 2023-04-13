import { ComplexObject, ObjectProxy } from './ComplexObject';
import { SerializerSchemaFor } from '../../../utils/types';
import { ISerializer } from '../../ISerializer';
import { SimpleObject } from './SimpleObject';

function _Object<T>(getSerializer: (object: ObjectProxy<T>) => ISerializer<void>): ISerializer<T>;
function _Object<T>(schema: SerializerSchemaFor<T>): ISerializer<T>;
function _Object<T>(schemaOrSerializerGetter: any): ISerializer<T> {
  return typeof schemaOrSerializerGetter === 'function'
    ? ComplexObject<T>(schemaOrSerializerGetter)
    : SimpleObject<T>(schemaOrSerializerGetter);
}

export { _Object };

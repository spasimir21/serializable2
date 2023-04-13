import { SerializableProperty, createPropertySerializer } from '../../property';
import { Context, getCurrentContext } from '../../context';
import { createSerializer } from '../../ISerializer';

const getFieldName = (name: string | ((context: Context) => string), context: Context) =>
  typeof name === 'function' ? name(context) : name;

function Field<T>(
  name: string | ((context: Context) => string),
  valueProperty: SerializableProperty<T>,
  objectSymbol: symbol
) {
  const valueSerializer = createPropertySerializer(valueProperty);

  return createSerializer<void>({
    write: (_, writer, context) => {
      const fieldName = getFieldName(name, context);
      const value = (getCurrentContext() as any)[objectSymbol].peek()[fieldName];
      valueSerializer.write(value, writer, context);
    },
    read: (reader, context) => {
      const fieldName = getFieldName(name, context);
      const value = valueSerializer.read(reader, context);
      (getCurrentContext() as any)[objectSymbol].peek()[fieldName] = value;
    }
  });
}

export { Field };

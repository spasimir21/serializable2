import { deserializeWithinParent, serializeWithinParent } from '../serialization';
import { BinaryLike, CipherKey, createCipheriv, createDecipheriv } from 'crypto';
import { SerializableProperty, createPropertySerializer } from '../property';
import { BufferAdapter } from '../../binary/adapters/bufferAdapter';
import { ISerializer, createSerializer } from '../ISerializer';
import { Context } from '../context';

interface EncryptionOptions {
  algorithm: string | ((context: Context) => string);
  key: CipherKey | ((context: Context) => CipherKey);
  iv: BinaryLike | null | ((context: Context) => BinaryLike | null);
}

interface StaticEncryptionOptions {
  algorithm: string;
  key: CipherKey;
  iv: BinaryLike | null;
}

function getStaticEncryptionOptions(context: Context, encryptionOptions: EncryptionOptions): StaticEncryptionOptions {
  return {
    algorithm:
      typeof encryptionOptions.algorithm === 'function'
        ? encryptionOptions.algorithm(context)
        : encryptionOptions.algorithm,
    key: typeof encryptionOptions.key === 'function' ? encryptionOptions.key(context) : encryptionOptions.key,
    iv: typeof encryptionOptions.iv === 'function' ? encryptionOptions.iv(context) : encryptionOptions.iv
  };
}

function encrypt(data: Buffer, context: Context, encryptionOptions: EncryptionOptions) {
  const staticEncOptions = getStaticEncryptionOptions(context, encryptionOptions);
  const cipher = createCipheriv(staticEncOptions.algorithm, staticEncOptions.key, staticEncOptions.iv);

  return Buffer.concat([cipher.update(data), cipher.final()]);
}

function decrypt(data: Buffer, context: Context, encryptionOptions: EncryptionOptions) {
  const staticEncOptions = getStaticEncryptionOptions(context, encryptionOptions);
  const decipher = createDecipheriv(staticEncOptions.algorithm, staticEncOptions.key, staticEncOptions.iv);

  return Buffer.concat([decipher.update(data), decipher.final()]);
}

function Encrypted<T>(
  encryptionOptions: EncryptionOptions,
  sizeProperty: SerializableProperty<number>,
  serializer: ISerializer<T>
) {
  const sizeSerializer = createPropertySerializer(sizeProperty);

  return createSerializer<T>({
    write: (value, writer, context) => {
      const serialized = serializeWithinParent(value, serializer, context);
      const buffer = encrypt(serialized, context, encryptionOptions);
      sizeSerializer.write(buffer.byteLength, writer, context);
      writer.write(BufferAdapter, buffer);
    },
    read: (reader, context) => {
      const size = sizeSerializer.read(reader, context);
      const encrypted = reader.read(BufferAdapter, size);
      const decrypted = decrypt(encrypted, context, encryptionOptions);
      return deserializeWithinParent(decrypted, serializer, context);
    }
  });
}

export { Encrypted };

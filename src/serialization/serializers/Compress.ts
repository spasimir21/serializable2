import { deserializeWithinParent, serializeWithinParent } from '../serialization';
import { SerializableProperty, createPropertySerializer } from '../property';
import { BufferAdapter } from '../../binary/adapters/bufferAdapter';
import { ISerializer, createSerializer } from '../ISerializer';
import { Context } from '../context';
import * as zlib from 'zlib';

enum CompressionType {
  Brotli,
  Deflate,
  DeflateRaw,
  Gzip
}

type ZlibCompressionOptions<TType extends CompressionType> = TType extends CompressionType.Brotli
  ? zlib.BrotliOptions
  : zlib.ZlibOptions;

interface CompressionOptions<TType extends CompressionType> {
  type: TType | ((context: Context) => TType);
  zlibOptions?: ZlibCompressionOptions<TType> | null | ((context: Context) => ZlibCompressionOptions<TType> | null);
}

interface StaticCompressionOptions<TType extends CompressionType> {
  type: TType;
  zlibOptions?: ZlibCompressionOptions<TType> | null;
}

function getStaticCompressionOptions<TType extends CompressionType>(
  context: Context,
  compressionOptions: CompressionOptions<TType>
): StaticCompressionOptions<TType> {
  return {
    type: typeof compressionOptions.type === 'function' ? compressionOptions.type(context) : compressionOptions.type,
    zlibOptions:
      typeof compressionOptions.zlibOptions === 'function'
        ? compressionOptions.zlibOptions(context)
        : compressionOptions.zlibOptions
  };
}

const COMPRESSION_FUNCTIONS: Record<CompressionType, (data: Buffer, options: any) => Buffer> = {
  [CompressionType.Brotli]: zlib.brotliCompressSync,
  [CompressionType.Deflate]: zlib.deflateSync,
  [CompressionType.DeflateRaw]: zlib.deflateRawSync,
  [CompressionType.Gzip]: zlib.gzipSync
};

function compress(data: Buffer, context: Context, compressionOptions: CompressionOptions<CompressionType>) {
  const staticCompressionOptions = getStaticCompressionOptions(context, compressionOptions);
  const compressionFunction = COMPRESSION_FUNCTIONS[staticCompressionOptions.type];
  return compressionFunction(data, staticCompressionOptions.zlibOptions);
}

const DECOMPRESSION_FUNCTIONS: Record<CompressionType, (data: Buffer, options: any) => Buffer> = {
  [CompressionType.Brotli]: zlib.brotliDecompressSync,
  [CompressionType.Deflate]: zlib.inflateSync,
  [CompressionType.DeflateRaw]: zlib.inflateRawSync,
  [CompressionType.Gzip]: zlib.gunzipSync
};

function decompress(data: Buffer, context: Context, compressionOptions: CompressionOptions<CompressionType>) {
  const staticCompressionOptions = getStaticCompressionOptions(context, compressionOptions);
  const decompressionFunction = DECOMPRESSION_FUNCTIONS[staticCompressionOptions.type];
  return decompressionFunction(data, staticCompressionOptions.zlibOptions);
}

function Compress<T, TType extends CompressionType = CompressionType>(
  compressionOptions: CompressionOptions<TType>,
  sizeProperty: SerializableProperty<number>,
  serializer: ISerializer<T>
) {
  const sizeSerializer = createPropertySerializer(sizeProperty);

  return createSerializer<T>({
    write: (value, writer, context) => {
      const serialized = serializeWithinParent(value, serializer, context);
      const compressed = compress(serialized, context, compressionOptions);
      sizeSerializer.write(compressed.byteLength, writer, context);
      writer.write(BufferAdapter, compressed);
    },
    read: (reader, context) => {
      const size = sizeSerializer.read(reader, context);
      const compressed = reader.read(BufferAdapter, size);
      const decompressed = decompress(compressed, context, compressionOptions);
      return deserializeWithinParent(decompressed, serializer, context);
    }
  });
}

export { Compress, CompressionType, CompressionOptions };

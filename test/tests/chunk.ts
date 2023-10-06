import { _Buffer, Encrypted, Intercept, UInt32, Scope, Sequence, _Object } from '../../src';
import { createArray } from '../utils/createArray';
import * as crypto from 'crypto';
import { ITest } from '../ITest';

const context = {
  key: Buffer.from('a'.repeat(32)),
  iv: Buffer.from('a'.repeat(16)),
  chunkSize: 32
};

interface Scope {
  uniqueKey: Buffer;
  uniqueIv: Buffer;
  chunkDataLength: number;
  paddingLength: number;
}

interface Chunk {
  data: Buffer;
}

const Chunk = Scope<Chunk, Scope>(scope =>
  _Object<Chunk>(chunk =>
    Sequence([
      Encrypted(
        { algorithm: 'aes-256-cbc', key: () => context.key, iv: () => context.iv },
        64,
        Sequence([
          Intercept(
            _Buffer(32),
            () => crypto.randomBytes(32),
            uniqueKey => (scope.uniqueKey = uniqueKey)
          ),
          Intercept(
            _Buffer(16),
            () => crypto.randomBytes(16),
            uniqueIv => (scope.uniqueIv = uniqueIv)
          )
        ])
      ),
      Encrypted(
        { algorithm: 'aes-256-cbc', key: () => scope.uniqueKey, iv: () => scope.uniqueIv },
        context => context.reader.remainingBytes,
        Sequence([
          Intercept(
            UInt32,
            () => chunk.data.byteLength,
            chunkDataLength => {
              scope.chunkDataLength = chunkDataLength;
              scope.paddingLength = 12 + context.chunkSize - chunkDataLength;
            }
          ),
          Intercept(
            _Buffer(() => scope.paddingLength),
            () => crypto.randomBytes(scope.paddingLength),
            () => {}
          ),
          chunk.Field(
            'data',
            _Buffer(() => scope.chunkDataLength)
          )
        ])
      )
    ])
  )
);

const CHUNK_TEST: ITest<Chunk> = {
  name: 'Chunk',
  serializer: Chunk,
  cases: createArray(5, i => ({
    name: `Case #${i + 1}`,
    value: { data: crypto.randomBytes(Math.ceil(Math.random() * context.chunkSize)) }
  }))
};

export { CHUNK_TEST };

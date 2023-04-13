const $IS_BINARY_ADAPTER = Symbol('$IS_BINARY_ADAPTER');

interface IBinaryAdapter<T, TReadArgs extends [...any[]]> {
  write(value: T, buffer: Buffer, offset: number): void;
  read(buffer: Buffer, offset: number, moveOffset: (delta: number) => number, ...args: TReadArgs): T;
  size(value: T): number;
  [$IS_BINARY_ADAPTER]: true;
}

function createBinaryAdapter<T, TReadArgs extends [...any[]]>(
  adapter: Omit<IBinaryAdapter<T, TReadArgs>, typeof $IS_BINARY_ADAPTER>
): IBinaryAdapter<T, TReadArgs> {
  (adapter as IBinaryAdapter<T, TReadArgs>)[$IS_BINARY_ADAPTER] = true;
  return adapter as IBinaryAdapter<T, TReadArgs>;
}

function isBinaryAdapter<T = any, TReadArgs extends [...any[]] = []>(
  object: any
): object is IBinaryAdapter<T, TReadArgs> {
  if (typeof object !== 'object' || object == null) return false;
  return object[$IS_BINARY_ADAPTER] ?? false;
}

export { IBinaryAdapter, createBinaryAdapter, isBinaryAdapter };

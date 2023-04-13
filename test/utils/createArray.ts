const createArray = <T>(length: number, element: (i: number) => T) =>
  new Array<T>(length).fill(null as any).map((_, i) => element(i));

export { createArray };

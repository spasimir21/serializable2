import { ConstructorMap } from './constructorMap';

type EqualCheck<T> = (a: T, b: T, strict: boolean) => boolean;

const EqualCheckConstructorMap = new ConstructorMap<EqualCheck<any>>();

function areObjectsEqual(a: any, b: any, strict: boolean): b is typeof a {
  for (const key in a) if (!isEqual(a[key], b[key], strict)) return false;
  for (const key in b) if (!(key in a)) return false;
  return true;
}

function isEqual(a: any, b: any, strict: boolean = true): b is typeof a {
  if (a === b) return true; // Quick exit. Mostly made if a and b happen to reference the same object

  if (a === null || b === null || typeof a !== 'object' || typeof b !== 'object') {
    if (typeof a === 'number' && typeof b === 'number' && isNaN(a) && isNaN(b)) return true;
    return strict ? a === b : a == b;
  }

  if (a.constructor !== b.constructor) return false;

  const checkEquality = EqualCheckConstructorMap.get(a) ?? areObjectsEqual;
  return checkEquality(a, b, strict);
}

EqualCheckConstructorMap.set(Object, areObjectsEqual);

EqualCheckConstructorMap.set(Buffer, (a: Buffer, b: Buffer) => a.compare(b) == 0);

EqualCheckConstructorMap.set(Array, (a: any[], b: any[], strict: boolean) => {
  if (a.length !== b.length) return false;

  for (let i = 0; i < a.length; i++) {
    if (!isEqual(a[i], b[i], strict)) return false;
  }

  return true;
});

export { EqualCheckConstructorMap, isEqual };

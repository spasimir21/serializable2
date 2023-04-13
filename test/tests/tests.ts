import { VAR_LONG_TESTS } from './varLongs';
import { VAR_INT_TESTS } from './varInts';
import { NUMBER_TESTS } from './numbers';
import { BUFFER_TESTS } from './buffers';
import { STRING_TESTS } from './strings';
import { ARRAY_TESTS } from './arrays';
import { CHUNK_TEST } from './chunk';
import { DICT_TESTS } from './dicts';
import { ITest } from '../ITest';

const TESTS: ITest<any>[] = [
  ...NUMBER_TESTS,
  ...VAR_INT_TESTS,
  ...VAR_LONG_TESTS,
  ...BUFFER_TESTS,
  ...STRING_TESTS,
  ...ARRAY_TESTS,
  ...DICT_TESTS,
  CHUNK_TEST
];

export { TESTS };

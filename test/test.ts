import { formatNumber } from './utils/numberFormatter';
import { deserialize, serialize } from '../src';
import { isEqual } from './utils/equal';
import { Logger } from './utils/Logger';
import { timeit } from './utils/timing';
import { TESTS } from './tests/tests';
import { ITest } from './ITest';
import chalk from 'chalk';
import * as fs from 'fs';

const LOG_FILE = './test-results.txt';
const OPERATION_REPEAT_COUNT = 1000;

const logger = new Logger();

function runCase(test: ITest<any>, caseIndex: number): boolean {
  const _case = test.cases[caseIndex];

  try {
    const serialized = serialize(_case.value, test.serializer);
    const deserialized = deserialize(serialized, test.serializer);

    if (!isEqual(deserialized, _case.value))
      throw new Error("The deserialized value isn't equal to the original value!");

    const serializationTimingData = timeit(() => serialize(_case.value, test.serializer), OPERATION_REPEAT_COUNT);
    const deserializationTimingData = timeit(() => deserialize(serialized, test.serializer), OPERATION_REPEAT_COUNT);

    logger.log(`  Case #${caseIndex + 1} (${_case.name}):`);
    // prettier-ignore
    logger.log(
      `    Serialize: ${formatNumber(serializationTimingData.opsPerSecond)} op/s (${serializationTimingData.msPerOp}ms) (${serializationTimingData.totalMs}ms total)`
    );
    // prettier-ignore
    logger.log(
      `    Deserialize: ${formatNumber(deserializationTimingData.opsPerSecond)} op/s (${deserializationTimingData.msPerOp}ms) (${deserializationTimingData.totalMs}ms total)`
    );
    logger.log(`    Size: ${formatNumber(serialized.byteLength)} bytes`);

    return true;
  } catch (err: any) {
    logger.log(chalk.red(`  Case #${caseIndex + 1} (${_case.name}) failed! (${err.message})`));
    return false;
  }
}

function runTest(tests: ITest<any>[], testIndex: number): boolean {
  const test = tests[testIndex];
  let successful = true;

  logger.log(`(${testIndex + 1}/${tests.length}) ${test.name} (${test.cases.length} case/s):`);
  for (let i = 0; i < test.cases.length; i++) {
    const caseSuccessful = runCase(test, i);
    if (!caseSuccessful) successful = false;
  }
  logger.log('');

  return successful;
}

function runTests(tests: ITest<any>[]): number {
  const startTime = process.hrtime();
  let failedCount = 0;

  for (let i = 0; i < tests.length; i++) {
    const testSuccessful = runTest(tests, i);
    if (!testSuccessful) failedCount++;
  }

  const endTime = process.hrtime(startTime);
  const msElapsed = endTime[0] * 1000 + endTime[1] / 1000000;

  logger.log(
    failedCount == 0
      ? chalk.green(`All tests passed successfully! (${msElapsed}ms)`)
      : chalk.red(`${failedCount} test/s failed! (${msElapsed}ms)`)
  );

  return failedCount;
}

const failedTestCount = runTests(TESTS);
process.exitCode = failedTestCount == 0 ? 0 : 1;

fs.writeFileSync(LOG_FILE, logger.export() + '\n');

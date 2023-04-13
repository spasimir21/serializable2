interface TimingData {
  totalMs: number;
  msPerOp: number;
  opsPerSecond: number;
}

function timeit(op: () => any, n: number): TimingData {
  const startTime = process.hrtime();
  for (let i = 0; i < n; i++) op();
  const endTime = process.hrtime(startTime);
  const ms = endTime[0] * 1000 + endTime[1] / 1000000;

  return {
    totalMs: ms,
    msPerOp: ms / n,
    opsPerSecond: Math.floor((1000 / ms) * n)
  };
}

export { timeit, TimingData };

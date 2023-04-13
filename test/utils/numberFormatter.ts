function formatNumber(value: number) {
  const formatter = new Intl.NumberFormat();
  return formatter.format(value);
}

export { formatNumber };

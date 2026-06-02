export function formatINR(amount: number): string {
  const value = Number.isFinite(amount) ? amount : 0;
  const hasDecimals = value % 1 !== 0;
  return `₹${value.toLocaleString('en-IN', {
    minimumFractionDigits: hasDecimals ? 2 : 0,
    maximumFractionDigits: 2,
  })}`;
}


export interface Transaction {
  id: string;
  amount: number;
  description: string;
}

export function calculateRoundUp(amount: number, roundTo = 100): number {
  const remainder = amount % roundTo;
  if (remainder === 0) return 0;
  return roundTo - remainder;
}

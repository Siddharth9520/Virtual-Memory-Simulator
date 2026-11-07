export interface CalculatedStats {
  totalReferences: number;
  hits: number;
  faults: number;
  hitRatio: number;
  faultRatio: number;
  hitPercentage: number;
  faultPercentage: number;
}

export function computeStats(totalReferences: number, hits: number, faults: number): CalculatedStats {
  if (totalReferences <= 0) {
    return {
      totalReferences: 0,
      hits: 0,
      faults: 0,
      hitRatio: 0,
      faultRatio: 0,
      hitPercentage: 0,
      faultPercentage: 0,
    };
  }

  const hitRatio = hits / totalReferences;
  const faultRatio = faults / totalReferences;
  const hitPercentage = hitRatio * 100;
  const faultPercentage = faultRatio * 100;

  return {
    totalReferences,
    hits,
    faults,
    hitRatio,
    faultRatio,
    hitPercentage,
    faultPercentage,
  };
}

export function formatPercent(val: number): string {
  return `${val.toFixed(2)}%`;
}

export function formatRatio(val: number): string {
  return val.toFixed(4);
}


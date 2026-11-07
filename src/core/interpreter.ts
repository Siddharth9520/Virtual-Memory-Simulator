import { AlgorithmResult, AlgorithmType } from '../types/simulator';
import { formatPercent } from './stats';

export interface InterpretationInsight {
  bestAlgorithms: AlgorithmType[];
  lowestFaults: number;
  highestHits: number;
  highestHitPercentage: number;
  summaryTitle: string;
  verdict: string;
  comparativeDetails: string[];
  theoreticalContext: string;
}

export function generateInterpretation(
  results: Partial<Record<AlgorithmType, AlgorithmResult>>
): InterpretationInsight | null {
  const algKeys = (['FIFO', 'LRU', 'OPTIMAL'] as AlgorithmType[]).filter(
    (k) => results[k] !== undefined
  );

  if (algKeys.length === 0) return null;

  const activeResults = algKeys.map((k) => results[k]!);

  // Find lowest faults and highest hits
  const lowestFaults = Math.min(...activeResults.map((r) => r.faults));
  const highestHits = Math.max(...activeResults.map((r) => r.hits));
  const bestAlgorithms = activeResults
    .filter((r) => r.faults === lowestFaults)
    .map((r) => r.algorithm);

  const highestHitPercentage =
    activeResults.find((r) => r.faults === lowestFaults)?.hitPercentage ?? 0;

  let verdict = '';
  let summaryTitle = '';

  const bestNames = bestAlgorithms.map((b) => {
    if (b === 'FIFO') return 'FIFO';
    if (b === 'LRU') return 'LRU';
    return 'Optimal';
  });

  if (bestAlgorithms.length === 1) {
    const winner = bestAlgorithms[0];
    summaryTitle = `${winner} Achieved Optimal Efficiency`;
    verdict = `${winner} produced the lowest page fault count (${lowestFaults} faults) and the highest hit ratio (${formatPercent(highestHitPercentage)}).`;
  } else if (bestAlgorithms.length === activeResults.length) {
    summaryTitle = 'Equal Performance Across Tested Algorithms';
    verdict = `All evaluated algorithms tied with identical results: ${lowestFaults} faults and a hit ratio of ${formatPercent(highestHitPercentage)}.`;
  } else {
    summaryTitle = `Tie: ${bestNames.join(' and ')}`;
    verdict = `${bestNames.join(' and ')} tied for best performance with ${lowestFaults} faults and a hit ratio of ${formatPercent(highestHitPercentage)}.`;
  }

  const comparativeDetails: string[] = [];

  const fifo = results.FIFO;
  const lru = results.LRU;
  const opt = results.OPTIMAL;

  if (fifo && lru && opt) {
    // 3-way analysis
    if (lru.faults < fifo.faults) {
      const diff = fifo.faults - lru.faults;
      comparativeDetails.push(
        `LRU outperformed FIFO by eliminating ${diff} extra page fault${diff > 1 ? 's' : ''}, taking advantage of temporal locality by retaining recently referenced pages.`
      );
    } else if (lru.faults > fifo.faults) {
      const diff = lru.faults - fifo.faults;
      comparativeDetails.push(
        `FIFO outperformed LRU by ${diff} fewer fault${diff > 1 ? 's' : ''} on this specific sequence, as the access pattern did not favor recency caching.`
      );
    } else {
      comparativeDetails.push(
        `FIFO and LRU exhibited identical performance (${fifo.faults} faults), which frequently occurs on strictly sequential or short reference strings.`
      );
    }

    if (opt.faults < lru.faults) {
      const diff = lru.faults - opt.faults;
      comparativeDetails.push(
        `Optimal eliminated ${diff} more fault${diff > 1 ? 's' : ''} than LRU due to its clairvoyant foresight into future references.`
      );
    } else if (opt.faults === lru.faults) {
      comparativeDetails.push(
        `LRU achieved optimal replacement efficiency on this reference string, matching the theoretical minimum of ${opt.faults} faults.`
      );
    }
  } else if (activeResults.length === 1) {
    const single = activeResults[0];
    comparativeDetails.push(
      `${single.name} completed with ${single.faults} faults (${formatPercent(single.faultPercentage)}) and ${single.hits} hits (${formatPercent(single.hitPercentage)}) across ${single.totalReferences} memory references.`
    );
  }

  const theoreticalContext =
    'Optimal (Belady\'s MIN) algorithm relies on future lookahead to replace the page that will not be used for the longest period of time. Because operating systems cannot predict future memory accesses in general workloads, Optimal cannot be implemented in production OS kernels; instead, it serves as the theoretical benchmark against which practical online algorithms (like LRU and FIFO) are measured.';

  return {
    bestAlgorithms,
    lowestFaults,
    highestHits,
    highestHitPercentage,
    summaryTitle,
    verdict,
    comparativeDetails,
    theoreticalContext,
  };
}


import { AlgorithmType, AlgorithmResult } from '../../types/simulator';
import { runFIFO } from './fifo';
import { runLRU } from './lru';
import { runOptimal } from './optimal';

export { runFIFO, runLRU, runOptimal };

export function executeAlgorithm(
  algorithm: AlgorithmType,
  pages: number[],
  capacity: number
): AlgorithmResult {
  switch (algorithm) {
    case 'FIFO':
      return runFIFO(pages, capacity);
    case 'LRU':
      return runLRU(pages, capacity);
    case 'OPTIMAL':
      return runOptimal(pages, capacity);
    default:
      throw new Error(`Unknown algorithm: ${algorithm}`);
  }
}

export function executeAllAlgorithms(
  pages: number[],
  capacity: number
): Record<AlgorithmType, AlgorithmResult> {
  return {
    FIFO: runFIFO(pages, capacity),
    LRU: runLRU(pages, capacity),
    OPTIMAL: runOptimal(pages, capacity),
  };
}

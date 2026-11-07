import { runFIFO } from './algorithms/fifo';
import { runLRU } from './algorithms/lru';
import { runOptimal } from './algorithms/optimal';

export interface FrameFaultDataPoint {
  frames: number;
  fifoFaults: number;
  lruFaults: number;
  optimalFaults: number;
  isAnomaly: boolean; // True if FIFO faults increased compared to previous frame count
}

export interface BeladyAnalysisResult {
  dataPoints: FrameFaultDataPoint[];
  hasAnomaly: boolean;
  anomalyInstances: {
    fromFrames: number;
    toFrames: number;
    fromFaults: number;
    toFaults: number;
  }[];
}

export function analyzeBeladyAnomaly(
  pages: number[],
  minFrames = 1,
  maxFrames = 8
): BeladyAnalysisResult {
  const dataPoints: FrameFaultDataPoint[] = [];
  const anomalyInstances: BeladyAnalysisResult['anomalyInstances'] = [];
  let prevFifoFaults: number | null = null;

  for (let f = minFrames; f <= maxFrames; f++) {
    const fifo = runFIFO(pages, f);
    const lru = runLRU(pages, f);
    const opt = runOptimal(pages, f);

    const isAnomaly = prevFifoFaults !== null && fifo.faults > prevFifoFaults;

    if (isAnomaly && prevFifoFaults !== null) {
      anomalyInstances.push({
        fromFrames: f - 1,
        toFrames: f,
        fromFaults: prevFifoFaults,
        toFaults: fifo.faults,
      });
    }

    dataPoints.push({
      frames: f,
      fifoFaults: fifo.faults,
      lruFaults: lru.faults,
      optimalFaults: opt.faults,
      isAnomaly,
    });

    prevFifoFaults = fifo.faults;
  }

  return {
    dataPoints,
    hasAnomaly: anomalyInstances.length > 0,
    anomalyInstances,
  };
}

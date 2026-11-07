import { AlgorithmResult, SimulationStep } from '../../types/simulator';
import { computeStats } from '../stats';

/**
 * LRU (Least Recently Used) Page Replacement Algorithm
 * Faithfully mirrors the reference implementation in Fifth_assignment.cpp:
 * - Tracks last-used timestamp (reference index `t`) for each frame
 * - On HIT: updates lastUsed[index] = t
 * - On FAULT:
 *    1) Fills empty frame slot if available
 *    2) If full, replaces frame whose lastUsed[i] is minimum (least recently accessed)
 * - Updates lastUsed of the replaced frame to t
 */
export function runLRU(pages: number[], capacity: number): AlgorithmResult {
  const frames: (number | null)[] = Array(capacity).fill(null);
  const lastUsed: number[] = Array(capacity).fill(-1);
  let hits = 0;
  let faults = 0;
  const steps: SimulationStep[] = [];

  for (let t = 0; t < pages.length; t++) {
    const page = pages[t];
    let foundIndex = -1;

    for (let i = 0; i < capacity; i++) {
      if (frames[i] === page) {
        foundIndex = i;
        break;
      }
    }

    if (foundIndex !== -1) {
      hits++;
      lastUsed[foundIndex] = t;
      steps.push({
        step: t + 1,
        page,
        frames: [...frames],
        status: 'HIT',
        isHit: true,
        frameIndexChanged: foundIndex,
        replacedPage: null,
        insertedPage: null,
        lastUsedSnap: [...lastUsed],
        explanation: `Page ${page} is already resident in Frame ${foundIndex + 1}. Page HIT: Recency timestamp updated to Step ${t + 1}.`,
      });
    } else {
      faults++;
      let replace = -1;

      // Find first empty frame slot
      for (let i = 0; i < capacity; i++) {
        if (frames[i] === null) {
          replace = i;
          break;
        }
      }

      let replacedPage: number | null = null;
      let isEviction = false;

      if (replace === -1) {
        // Find frame with minimum lastUsed
        isEviction = true;
        replace = 0;
        for (let i = 1; i < capacity; i++) {
          if (lastUsed[i] < lastUsed[replace]) {
            replace = i;
          }
        }
        replacedPage = frames[replace];
      }

      frames[replace] = page;
      lastUsed[replace] = t;

      steps.push({
        step: t + 1,
        page,
        frames: [...frames],
        status: 'FAULT',
        isHit: false,
        frameIndexChanged: replace,
        replacedPage: isEviction ? replacedPage : null,
        insertedPage: page,
        lastUsedSnap: [...lastUsed],
        explanation: isEviction
          ? `Page FAULT: Frames full. Least recently used Page ${replacedPage} in Frame ${replace + 1} was evicted and replaced by Page ${page}.`
          : `Page FAULT: Empty Frame ${replace + 1} allocated for Page ${page}.`,
      });
    }
  }

  const stats = computeStats(pages.length, hits, faults);

  return {
    algorithm: 'LRU',
    name: 'Least Recently Used (LRU)',
    capacity,
    pages,
    steps,
    ...stats,
  };
}


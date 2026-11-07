import { AlgorithmResult, SimulationStep } from '../../types/simulator';
import { computeStats } from '../stats';

/**
 * Optimal Page Replacement Algorithm (Belady's Min / Clairvoyant)
 * Faithfully mirrors the reference implementation in Fifth_assignment.cpp:
 * - Scans future references starting from t + 1
 * - On FAULT with full frames:
 *   - Checks each frame i = 0..capacity-1 for its earliest next occurrence
 *   - If any frame is never used again (nextUse === -1), it selects that frame immediately (break)
 *   - Otherwise selects the frame whose next use is farthest in the future
 */
export function runOptimal(pages: number[], capacity: number): AlgorithmResult {
  const frames: (number | null)[] = Array(capacity).fill(null);
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
      steps.push({
        step: t + 1,
        page,
        frames: [...frames],
        status: 'HIT',
        isHit: true,
        frameIndexChanged: foundIndex,
        replacedPage: null,
        insertedPage: null,
        explanation: `Page ${page} is already resident in Frame ${foundIndex + 1}. Page HIT (no frame change).`,
      });
    } else {
      faults++;
      let replace = -1;

      // Check for first empty frame
      for (let i = 0; i < capacity; i++) {
        if (frames[i] === null) {
          replace = i;
          break;
        }
      }

      let isEviction = false;
      let replacedPage: number | null = null;
      let evictionReason = '';

      if (replace === -1) {
        isEviction = true;
        let farthest = -1;
        const nextUseArray: (number | null)[] = [];

        for (let i = 0; i < capacity; i++) {
          let nextUse = -1;
          for (let j = t + 1; j < pages.length; j++) {
            if (pages[j] === frames[i]) {
              nextUse = j;
              break;
            }
          }
          nextUseArray.push(nextUse === -1 ? null : nextUse + 1);

          if (nextUse === -1) {
            replace = i;
            evictionReason = `Page ${frames[i]} in Frame ${i + 1} is never referenced again.`;
            break;
          }

          if (nextUse > farthest) {
            farthest = nextUse;
            replace = i;
            evictionReason = `Page ${frames[i]} in Frame ${i + 1} has next reference farthest in future (Step ${nextUse + 1}).`;
          }
        }

        replacedPage = frames[replace];
      }

      frames[replace] = page;

      steps.push({
        step: t + 1,
        page,
        frames: [...frames],
        status: 'FAULT',
        isHit: false,
        frameIndexChanged: replace,
        replacedPage: isEviction ? replacedPage : null,
        insertedPage: page,
        explanation: isEviction
          ? `Page FAULT: ${evictionReason} Evicted Page ${replacedPage} and inserted Page ${page}.`
          : `Page FAULT: Empty Frame ${replace + 1} allocated for Page ${page}.`,
      });
    }
  }

  const stats = computeStats(pages.length, hits, faults);

  return {
    algorithm: 'OPTIMAL',
    name: 'Optimal (MIN / Clairvoyant)',
    capacity,
    pages,
    steps,
    ...stats,
  };
}


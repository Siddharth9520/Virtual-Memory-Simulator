import { AlgorithmResult, SimulationStep } from '../../types/simulator';
import { computeStats } from '../stats';

/**
 * FIFO (First-In, First-Out) Page Replacement Algorithm
 * Faithfully mirrors the reference implementation in Fifth_assignment.cpp:
 * - Frames initialized to null (or -1 in C++)
 * - Unoccupied frames filled first in ascending index order
 * - When all frames are full and a fault occurs, replace frames[pointer]
 *   and advance pointer = (pointer + 1) % capacity
 * - Page hits do not alter frame contents or the pointer
 */
export function runFIFO(pages: number[], capacity: number): AlgorithmResult {
  const frames: (number | null)[] = Array(capacity).fill(null);
  let pointer = 0;
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
        pointer,
        explanation: `Page ${page} is already resident in Frame ${foundIndex + 1}. Page HIT (no frame change).`,
      });
    } else {
      faults++;
      let insertedIndex = -1;

      // Find first empty frame slot
      for (let i = 0; i < capacity; i++) {
        if (frames[i] === null) {
          frames[i] = page;
          insertedIndex = i;
          break;
        }
      }

      let replacedPage: number | null = null;
      let targetFrame = insertedIndex;

      if (insertedIndex === -1) {
        // All frames occupied, replace at FIFO pointer
        replacedPage = frames[pointer];
        targetFrame = pointer;
        frames[pointer] = page;
        pointer = (pointer + 1) % capacity;

        steps.push({
          step: t + 1,
          page,
          frames: [...frames],
          status: 'FAULT',
          isHit: false,
          frameIndexChanged: targetFrame,
          replacedPage,
          insertedPage: page,
          pointer,
          explanation: `Page FAULT: Frames full. Evicted oldest Page ${replacedPage} from Frame ${targetFrame + 1}. Pointer shifted to Frame ${pointer + 1}.`,
        });
      } else {
        steps.push({
          step: t + 1,
          page,
          frames: [...frames],
          status: 'FAULT',
          isHit: false,
          frameIndexChanged: targetFrame,
          replacedPage: null,
          insertedPage: page,
          pointer,
          explanation: `Page FAULT: Empty Frame ${targetFrame + 1} allocated for Page ${page}.`,
        });
      }
    }
  }

  const stats = computeStats(pages.length, hits, faults);

  return {
    algorithm: 'FIFO',
    name: 'First-In First-Out (FIFO)',
    capacity,
    pages,
    steps,
    ...stats,
  };
}

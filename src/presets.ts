import { PresetCase } from './types/simulator';

export const PRESET_CASES: PresetCase[] = [
  {
    id: 'test-case-1',
    name: 'TC 1: Standard Comparison',
    description: 'Reference: 1 2 3 4 1 2 5 1 2 3 4 5 (3 frames) — Demonstrates distinct FIFO (9), LRU (10), and Optimal (7) results.',
    pages: '1 2 3 4 1 2 5 1 2 3 4 5',
    frames: 3,
  },
  {
    id: 'test-case-2',
    name: 'TC 2: Repeated References',
    description: 'Reference: 1 2 3 1 2 3 1 2 3 (3 frames) — High temporal locality resulting in an identical 3-way tie (3 faults, 6 hits).',
    pages: '1 2 3 1 2 3 1 2 3',
    frames: 3,
  },
  {
    id: 'test-case-3',
    name: 'TC 3: High Page Faults',
    description: 'Reference: 1 2 3 4 5 6 7 8 (3 frames) — Strictly sequential scan exceeding capacity causing 100% page faults (8 faults, 0 hits).',
    pages: '1 2 3 4 5 6 7 8',
    frames: 3,
  },
  {
    id: 'test-case-4',
    name: 'TC 4: Repeated Single Page',
    description: 'Reference: 5 5 5 5 5 5 5 (3 frames) — Immediate resident hits verifying no erroneous replacement on hits (1 fault, 6 hits).',
    pages: '5 5 5 5 5 5 5',
    frames: 3,
  },
  {
    id: 'test-case-5',
    name: 'TC 5: Increased Capacity (Belády)',
    description: 'Reference: 1 2 3 4 1 2 5 1 2 3 4 5 (4 frames) — Demonstrates Belády’s Anomaly where FIFO faults increase from 9 to 10.',
    pages: '1 2 3 4 1 2 5 1 2 3 4 5',
    frames: 4,
  },
];

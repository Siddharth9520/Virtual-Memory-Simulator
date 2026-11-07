export type AlgorithmType = 'FIFO' | 'LRU' | 'OPTIMAL';

export interface SimulationStep {
  step: number; // 1-based index for display
  page: number; // Currently requested page
  frames: (number | null)[]; // Contents of frames after this step (null = empty)
  status: 'HIT' | 'FAULT';
  isHit: boolean;
  frameIndexChanged: number | null; // Which frame index was modified or accessed
  replacedPage: number | null; // Page that was evicted (null if none or empty slot)
  insertedPage: number | null; // Page that was inserted into frame (null if HIT)
  pointer?: number; // FIFO circular pointer at this step
  lastUsedSnap?: number[]; // For LRU debug/inspection
  nextUseSnap?: (number | null)[]; // For Optimal lookahead inspection
  explanation: string;
}

export interface AlgorithmResult {
  algorithm: AlgorithmType;
  name: string;
  capacity: number;
  pages: number[];
  steps: SimulationStep[];
  totalReferences: number;
  hits: number;
  faults: number;
  hitRatio: number;
  faultRatio: number;
  hitPercentage: number;
  faultPercentage: number;
}

export type SimulationResults = Partial<Record<AlgorithmType, AlgorithmResult>>;

export interface ValidationResult {
  isValid: boolean;
  error?: string;
  pages?: number[];
  capacity?: number;
}

export interface PresetCase {
  id: string;
  name: string;
  description: string;
  pages: string;
  frames: number;
}

export type PlaybackStatus = 'Ready' | 'Running' | 'Completed';


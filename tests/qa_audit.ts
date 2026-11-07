import { runFIFO } from '../src/core/algorithms/fifo.ts';
import { runLRU } from '../src/core/algorithms/lru.ts';
import { runOptimal } from '../src/core/algorithms/optimal.ts';
import { parseAndValidateInput } from '../src/core/validation.ts';
import { computeStats } from '../src/core/stats.ts';
import { generateInterpretation } from '../src/core/interpreter.ts';

interface TestCase {
  name: string;
  pages: number[];
  frames: number;
  expected: {
    FIFO: { faults: number; hits: number };
    LRU: { faults: number; hits: number };
    OPTIMAL: { faults: number; hits: number };
  };
}

const TEST_CASES: TestCase[] = [
  {
    name: 'Test Case 1 — Standard Comparison',
    pages: [1, 2, 3, 4, 1, 2, 5, 1, 2, 3, 4, 5],
    frames: 3,
    expected: {
      FIFO: { faults: 9, hits: 3 },
      LRU: { faults: 10, hits: 2 },
      OPTIMAL: { faults: 7, hits: 5 },
    },
  },
  {
    name: 'Test Case 2 — Repeated Page References',
    pages: [1, 2, 3, 1, 2, 3, 1, 2, 3],
    frames: 3,
    expected: {
      FIFO: { faults: 3, hits: 6 },
      LRU: { faults: 3, hits: 6 },
      OPTIMAL: { faults: 3, hits: 6 },
    },
  },
  {
    name: 'Test Case 3 — High Page Faults',
    pages: [1, 2, 3, 4, 5, 6, 7, 8],
    frames: 3,
    expected: {
      FIFO: { faults: 8, hits: 0 },
      LRU: { faults: 8, hits: 0 },
      OPTIMAL: { faults: 8, hits: 0 },
    },
  },
  {
    name: 'Test Case 4 — Repeated Single Page',
    pages: [5, 5, 5, 5, 5, 5, 5],
    frames: 3,
    expected: {
      FIFO: { faults: 1, hits: 6 },
      LRU: { faults: 1, hits: 6 },
      OPTIMAL: { faults: 1, hits: 6 },
    },
  },
  {
    name: 'Test Case 5 — Increased Frame Capacity',
    pages: [1, 2, 3, 4, 1, 2, 5, 1, 2, 3, 4, 5],
    frames: 4,
    expected: {
      FIFO: { faults: 10, hits: 2 },
      LRU: { faults: 8, hits: 4 },
      OPTIMAL: { faults: 6, hits: 6 },
    },
  },
];

let failedCount = 0;
let passedCount = 0;

function assert(condition: boolean, message: string) {
  if (condition) {
    passedCount++;
    console.log(`  [PASS] ${message}`);
  } else {
    failedCount++;
    console.error(`  [FAIL] ${message}`);
  }
}

console.log('=====================================================');
console.log(' VMSIM AUTOMATED QA AUDIT & VERIFICATION SUITE');
console.log('=====================================================\n');

// 1. ALGORITHM CORRECTNESS TESTING (5 Required Test Cases)
console.log('--- 1. Testing Core Algorithm Cases ---');
for (const tc of TEST_CASES) {
  console.log(`\nEvaluating: ${tc.name} (${tc.pages.join(' ')}, Frames: ${tc.frames})`);
  
  const fifo = runFIFO(tc.pages, tc.frames);
  assert(
    fifo.faults === tc.expected.FIFO.faults && fifo.hits === tc.expected.FIFO.hits,
    `FIFO: Expected ${tc.expected.FIFO.faults} faults / ${tc.expected.FIFO.hits} hits, got ${fifo.faults} faults / ${fifo.hits} hits`
  );

  const lru = runLRU(tc.pages, tc.frames);
  assert(
    lru.faults === tc.expected.LRU.faults && lru.hits === tc.expected.LRU.hits,
    `LRU: Expected ${tc.expected.LRU.faults} faults / ${tc.expected.LRU.hits} hits, got ${lru.faults} faults / ${lru.hits} hits`
  );

  const opt = runOptimal(tc.pages, tc.frames);
  assert(
    opt.faults === tc.expected.OPTIMAL.faults && opt.hits === tc.expected.OPTIMAL.hits,
    `Optimal: Expected ${tc.expected.OPTIMAL.faults} faults / ${tc.expected.OPTIMAL.hits} hits, got ${opt.faults} faults / ${opt.hits} hits`
  );

  // Invariant: Optimal page faults must never exceed FIFO or LRU
  assert(
    opt.faults <= fifo.faults && opt.faults <= lru.faults,
    `Invariant: Optimal faults (${opt.faults}) <= FIFO (${fifo.faults}) and LRU (${lru.faults})`
  );
}

// 2. MATHEMATICAL CALCULATION INVARIANTS
console.log('\n--- 2. Validating Mathematical Calculations & Formulas ---');
for (const tc of TEST_CASES) {
  const algorithms = [
    { name: 'FIFO', res: runFIFO(tc.pages, tc.frames) },
    { name: 'LRU', res: runLRU(tc.pages, tc.frames) },
    { name: 'Optimal', res: runOptimal(tc.pages, tc.frames) },
  ];

  for (const { name, res } of algorithms) {
    const total = tc.pages.length;
    assert(
      res.hits + res.faults === total,
      `${tc.name} - ${name}: Total references (${total}) equals hits (${res.hits}) + faults (${res.faults})`
    );

    const expectedHitRatio = res.hits / total;
    const expectedFaultRatio = res.faults / total;
    assert(
      Math.abs(res.hitRatio - expectedHitRatio) < 1e-9,
      `${tc.name} - ${name}: Hit ratio matches formula (${res.hitRatio} vs ${expectedHitRatio})`
    );

    assert(
      Math.abs(res.faultRatio - expectedFaultRatio) < 1e-9,
      `${tc.name} - ${name}: Fault ratio matches formula (${res.faultRatio} vs ${expectedFaultRatio})`
    );

    const sumPercentage = res.hitPercentage + res.faultPercentage;
    assert(
      Math.abs(sumPercentage - 100.0) < 1e-6,
      `${tc.name} - ${name}: Hit% (${res.hitPercentage.toFixed(2)}%) + Fault% (${res.faultPercentage.toFixed(2)}%) == 100.00%`
    );
  }
}

// 3. FRAME-BY-FRAME EXECUTION & STEP INTEGRITY AUDIT
console.log('\n--- 3. Frame-by-Frame Execution & Step Integrity ---');
const samplePages = [1, 2, 3, 4, 1, 2, 5, 1, 2, 3, 4, 5];
const sampleCapacity = 3;
const fifoRes = runFIFO(samplePages, sampleCapacity);

assert(fifoRes.steps.length === samplePages.length, `Step count matches page reference count (${fifoRes.steps.length})`);

// Step 1: 1 loaded into empty Frame 1 -> Fault
assert(
  fifoRes.steps[0].status === 'FAULT' && fifoRes.steps[0].frames[0] === 1 && fifoRes.steps[0].frames[1] === null,
  'Step 1: Frame 1 allocated page 1, Frame 2 is null'
);

// Step 8: Reference '1'. Resident in frames [5, 1, 2] -> Hit!
assert(
  fifoRes.steps[7].page === 1 && fifoRes.steps[7].status === 'HIT',
  'Step 8: Page 1 reference is verified as HIT'
);
assert(
  JSON.stringify(fifoRes.steps[7].frames) === JSON.stringify(fifoRes.steps[6].frames),
  'Step 8: Frame contents remain identical on HIT (no invalid eviction)'
);

// 4. INPUT VALIDATION & SANITIZATION AUDIT
console.log('\n--- 4. Input Validation & Edge Case Handling ---');

// Empty input
const emptyVal = parseAndValidateInput('', 3);
assert(!emptyVal.isValid && !!emptyVal.error, 'Empty input string rejected gracefully');

// Invalid characters
const invalidCharsVal = parseAndValidateInput('1 2 abc 4', 3);
assert(!invalidCharsVal.isValid && !!invalidCharsVal.error, 'Invalid character string rejected');

// Negative page numbers
const negPageVal = parseAndValidateInput('1 -2 3', 3);
assert(!negPageVal.isValid && !!negPageVal.error, 'Negative page number rejected');

// Zero frames
const zeroFrameVal = parseAndValidateInput('1 2 3', 0);
assert(!zeroFrameVal.isValid && !!zeroFrameVal.error, 'Zero frame count rejected');

// Negative frames
const negFrameVal = parseAndValidateInput('1 2 3', -1);
assert(!negFrameVal.isValid && !!negFrameVal.error, 'Negative frame count rejected');

// Excessive frames (> 12)
const largeFrameVal = parseAndValidateInput('1 2 3', 15);
assert(!largeFrameVal.isValid && !!largeFrameVal.error, 'Excessive frame count (>12) bounded and rejected');

// Single page reference
const singlePageVal = parseAndValidateInput('4', 3);
assert(singlePageVal.isValid && singlePageVal.pages?.length === 1 && singlePageVal.pages[0] === 4, 'Single page input accepted');

// Comma-separated input
const commaVal = parseAndValidateInput('1,2,3,4,5', 3);
assert(commaVal.isValid && commaVal.pages?.length === 5, 'Comma-separated input parsed correctly');

// Multiple spaces & mixed delimiters
const multiSpaceVal = parseAndValidateInput('  1   2,  3 ;  4   5  ', 3);
assert(multiSpaceVal.isValid && multiSpaceVal.pages?.length === 5, 'Mixed spaces and commas parsed cleanly');

// 5. INTERPRETATION & TIE-BREAKING LOGIC
console.log('\n--- 5. Dynamic Interpretation & Tie Handling ---');
// Test Case 2 is a 3-way tie: FIFO = 3, LRU = 3, Optimal = 3
const tieResults = {
  FIFO: runFIFO([1, 2, 3, 1, 2, 3, 1, 2, 3], 3),
  LRU: runLRU([1, 2, 3, 1, 2, 3, 1, 2, 3], 3),
  OPTIMAL: runOptimal([1, 2, 3, 1, 2, 3, 1, 2, 3], 3),
};
const tieInsight = generateInterpretation(tieResults);
assert(
  tieInsight !== null && tieInsight.bestAlgorithms.length === 3,
  'Tie detection correctly surfaces all 3 winning algorithms'
);
assert(
  tieInsight?.summaryTitle.includes('Equal Performance') || tieInsight?.summaryTitle.includes('Tie'),
  'Summary title accurately reflects a multi-way tie'
);

console.log('\n=====================================================');
console.log(` AUDIT SUMMARY: Passed: ${passedCount} | Failed: ${failedCount}`);
console.log('=====================================================');

if (failedCount > 0) {
  process.exit(1);
}


// VMSIM Automated QA Audit Suite
// Evaluates all 5 required test cases, mathematical invariants, input validation, and step integrity.

function computeStats(totalReferences, hits, faults) {
  if (totalReferences <= 0) {
    return { totalReferences: 0, hits: 0, faults: 0, hitRatio: 0, faultRatio: 0, hitPercentage: 0, faultPercentage: 0 };
  }
  const hitRatio = hits / totalReferences;
  const faultRatio = faults / totalReferences;
  return {
    totalReferences,
    hits,
    faults,
    hitRatio,
    faultRatio,
    hitPercentage: hitRatio * 100,
    faultPercentage: faultRatio * 100,
  };
}

function runFIFO(pages, capacity) {
  const frames = Array(capacity).fill(null);
  let pointer = 0;
  let hits = 0;
  let faults = 0;
  const steps = [];

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
      });
    } else {
      faults++;
      let insertedIndex = -1;
      for (let i = 0; i < capacity; i++) {
        if (frames[i] === null) {
          frames[i] = page;
          insertedIndex = i;
          break;
        }
      }

      let replacedPage = null;
      let targetFrame = insertedIndex;

      if (insertedIndex === -1) {
        replacedPage = frames[pointer];
        targetFrame = pointer;
        frames[pointer] = page;
        pointer = (pointer + 1) % capacity;
      }

      steps.push({
        step: t + 1,
        page,
        frames: [...frames],
        status: 'FAULT',
        isHit: false,
        frameIndexChanged: targetFrame,
        replacedPage: insertedIndex === -1 ? replacedPage : null,
      });
    }
  }

  const stats = computeStats(pages.length, hits, faults);
  return { algorithm: 'FIFO', capacity, pages, steps, ...stats };
}

function runLRU(pages, capacity) {
  const frames = Array(capacity).fill(null);
  const lastUsed = Array(capacity).fill(-1);
  let hits = 0;
  let faults = 0;
  const steps = [];

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
      });
    } else {
      faults++;
      let replace = -1;
      for (let i = 0; i < capacity; i++) {
        if (frames[i] === null) {
          replace = i;
          break;
        }
      }

      let replacedPage = null;
      let isEviction = false;

      if (replace === -1) {
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
      });
    }
  }

  const stats = computeStats(pages.length, hits, faults);
  return { algorithm: 'LRU', capacity, pages, steps, ...stats };
}

function runOptimal(pages, capacity) {
  const frames = Array(capacity).fill(null);
  let hits = 0;
  let faults = 0;
  const steps = [];

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
      });
    } else {
      faults++;
      let replace = -1;
      for (let i = 0; i < capacity; i++) {
        if (frames[i] === null) {
          replace = i;
          break;
        }
      }

      let isEviction = false;
      let replacedPage = null;

      if (replace === -1) {
        isEviction = true;
        let farthest = -1;

        for (let i = 0; i < capacity; i++) {
          let nextUse = -1;
          for (let j = t + 1; j < pages.length; j++) {
            if (pages[j] === frames[i]) {
              nextUse = j;
              break;
            }
          }

          if (nextUse === -1) {
            replace = i;
            break;
          }

          if (nextUse > farthest) {
            farthest = nextUse;
            replace = i;
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
      });
    }
  }

  const stats = computeStats(pages.length, hits, faults);
  return { algorithm: 'OPTIMAL', capacity, pages, steps, ...stats };
}

function parseAndValidateInput(rawPages, rawFrames) {
  const trimmed = (rawPages || '').trim();
  if (!trimmed) {
    return { isValid: false, error: 'Please enter a page reference string.' };
  }
  const tokens = trimmed.split(/[\s,;]+/).filter((token) => token.length > 0);
  if (tokens.length === 0) {
    return { isValid: false, error: 'Invalid reference string: No valid page numbers found.' };
  }
  const pages = [];
  for (const token of tokens) {
    if (!/^-?\d+$/.test(token)) {
      return { isValid: false, error: `Invalid page value "${token}". Only non-negative integers permitted.` };
    }
    const num = Number(token);
    if (num < 0) {
      return { isValid: false, error: `Page numbers cannot be negative (${num}).` };
    }
    pages.push(num);
  }

  const frameCount = typeof rawFrames === 'string' ? parseInt(rawFrames.trim(), 10) : rawFrames;
  if (isNaN(frameCount) || !Number.isInteger(frameCount) || frameCount < 1) {
    return { isValid: false, error: 'Physical frame count must be a positive integer.' };
  }
  if (frameCount > 12) {
    return { isValid: false, error: 'Physical frame count bounded to max 12.' };
  }

  return { isValid: true, pages, capacity: frameCount };
}

// TEST CASES
const TEST_CASES = [
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

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    passed++;
    console.log(`  [PASS] ${message}`);
  } else {
    failed++;
    console.error(`  [FAIL] ${message}`);
  }
}

console.log('=====================================================');
console.log(' VMSIM AUTOMATED QA AUDIT & VERIFICATION SUITE');
console.log('=====================================================\n');

// 1. Core Algorithm Correctness
console.log('--- 1. Testing Core Algorithm Cases ---');
for (const tc of TEST_CASES) {
  console.log(`\nEvaluating: ${tc.name} (${tc.pages.join(' ')}, Frames: ${tc.frames})`);
  const fifo = runFIFO(tc.pages, tc.frames);
  assert(
    fifo.faults === tc.expected.FIFO.faults && fifo.hits === tc.expected.FIFO.hits,
    `FIFO: Expected ${tc.expected.FIFO.faults} faults / ${tc.expected.FIFO.hits} hits -> Got ${fifo.faults} faults / ${fifo.hits} hits`
  );

  const lru = runLRU(tc.pages, tc.frames);
  assert(
    lru.faults === tc.expected.LRU.faults && lru.hits === tc.expected.LRU.hits,
    `LRU: Expected ${tc.expected.LRU.faults} faults / ${tc.expected.LRU.hits} hits -> Got ${lru.faults} faults / ${lru.hits} hits`
  );

  const opt = runOptimal(tc.pages, tc.frames);
  assert(
    opt.faults === tc.expected.OPTIMAL.faults && opt.hits === tc.expected.OPTIMAL.hits,
    `Optimal: Expected ${tc.expected.OPTIMAL.faults} faults / ${tc.expected.OPTIMAL.hits} hits -> Got ${opt.faults} faults / ${opt.hits} hits`
  );

  assert(
    opt.faults <= fifo.faults && opt.faults <= lru.faults,
    `Invariant: Optimal faults (${opt.faults}) <= FIFO (${fifo.faults}) and LRU (${lru.faults})`
  );
}

// 2. Mathematical Invariants
console.log('\n--- 2. Validating Mathematical Calculations & Formulas ---');
for (const tc of TEST_CASES) {
  for (const runner of [runFIFO, runLRU, runOptimal]) {
    const res = runner(tc.pages, tc.frames);
    const total = tc.pages.length;
    assert(res.hits + res.faults === total, `${tc.name} (${res.algorithm}): Hits (${res.hits}) + Faults (${res.faults}) == Total (${total})`);
    assert(Math.abs(res.hitRatio - res.hits / total) < 1e-9, `${tc.name} (${res.algorithm}): Hit ratio accurate`);
    assert(Math.abs(res.faultRatio - res.faults / total) < 1e-9, `${tc.name} (${res.algorithm}): Fault ratio accurate`);
    assert(Math.abs(res.hitPercentage + res.faultPercentage - 100.0) < 1e-6, `${tc.name} (${res.algorithm}): Hit% + Fault% == 100.00%`);
  }
}

// 3. Frame-by-Frame Execution
console.log('\n--- 3. Frame-by-Frame Execution & Step Integrity ---');
const samplePages = [1, 2, 3, 4, 1, 2, 5, 1, 2, 3, 4, 5];
const fifo1 = runFIFO(samplePages, 3);
assert(fifo1.steps.length === 12, '12 simulation steps generated');
assert(fifo1.steps[0].status === 'FAULT' && fifo1.steps[0].frames[0] === 1, 'Initial frame allocation correct');
assert(fifo1.steps[7].page === 1 && fifo1.steps[7].status === 'HIT', 'Step 8 hit verified');
assert(JSON.stringify(fifo1.steps[7].frames) === JSON.stringify(fifo1.steps[6].frames), 'Frames unchanged on hit');

// 4. Input Validation Testing
console.log('\n--- 4. Input Validation Testing ---');
assert(!parseAndValidateInput('', 3).isValid, 'Empty input rejected');
assert(!parseAndValidateInput('1 2 abc 4', 3).isValid, 'Letters rejected');
assert(!parseAndValidateInput('1 -2 3', 3).isValid, 'Negative page rejected');
assert(!parseAndValidateInput('1 2 3', 0).isValid, 'Zero frames rejected');
assert(!parseAndValidateInput('1 2 3', -1).isValid, 'Negative frames rejected');
assert(!parseAndValidateInput('1 2 3', 15).isValid, 'Frames > 12 bounded and rejected');
assert(parseAndValidateInput('4', 3).isValid, 'Single page reference accepted');
assert(parseAndValidateInput('1,2,3,4,5', 3).isValid, 'Comma-separated accepted');
assert(parseAndValidateInput('  1   2,  3 ;  4   5  ', 3).isValid, 'Mixed whitespace accepted');

console.log('\n=====================================================');
console.log(` AUDIT SUMMARY: Passed: ${passed} | Failed: ${failed}`);
console.log('=====================================================');

if (failed > 0) process.exit(1);


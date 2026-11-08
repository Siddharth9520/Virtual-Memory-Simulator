# VMSIM — Virtual Memory & Page Replacement Simulator(https://virtual-memory-simulator-nu.vercel.app)
An interactive educational simulator for Operating Systems engineering that models, visualizes, and benchmarks three foundational page replacement algorithms:

1. **FIFO** (First-In, First-Out)
2. **LRU** (Least Recently Used)
3. **Optimal** (Belády's MIN / Clairvoyant Replacement)

The simulator is built with **React 18 + TypeScript + Vite + Tailwind CSS** with a dark navy SaaS aesthetic. The core algorithmic behavior has been faithfully ported from the C++ reference simulator (`Fifth_assignment.cpp`), preserving the exact replacement order, initial vacancy allocation rules, and tie-breaking semantics.

---

## 🚀 Features

### 1. Interactive Configuration Panel
- **Custom Page Reference Strings**: Supports space-separated, comma-separated, or semicolon-delimited non-negative integers (e.g. `1 2 3 4 1 2 5 1 2 3 4 5`).
- **Dynamic Physical Frame Capacity**: Configurable frame pool from 1 to 12 physical frames.
- **Pre-Verified OS Test Cases (Phase 2 Audited)**:
  - **TC 1: Standard Comparison** (`1 2 3 4 1 2 5 1 2 3 4 5`, 3 frames)
  - **TC 2: Repeated References** (`1 2 3 1 2 3 1 2 3`, 3 frames)
  - **TC 3: High Page Faults** (`1 2 3 4 5 6 7 8`, 3 frames)
  - **TC 4: Repeated Single Page** (`5 5 5 5 5 5 5`, 3 frames)
  - **TC 5: Increased Capacity / Belády's Anomaly** (`1 2 3 4 1 2 5 1 2 3 4 5`, 4 frames)
- **Live Input Desynchronization Detection**: Alerts the user when inputs are edited after simulation, prompting re-execution.
- **Real-Time Validation**: Proactive validation preventing negative page IDs, malformed inputs, or invalid frame capacities.

### 2. Dual-Mode Algorithm Execution
- **Run All Algorithms**: Simultaneously computes FIFO, LRU, and Optimal simulation models.
- **Individual Execution**: Run any algorithm independently or switch active tabs to inspect individual execution traces.

### 3. Step-by-Step Memory Frame Visualization
- **Hardware-Like Slot Cards**: Displays individual frame slots (`F1` to `Fn`) with current page contents or empty indicators.
- **Status Indicators**:
  - 🟢 **PAGE HIT**: Highlighted in emerald green with hit verification tag.
  - 🔴 **PAGE FAULT**: Highlighted in red/rose with eviction notices (e.g., `Evicted P7`).
  - 🎯 **FIFO Pointer / Recency Tag**: Visual indicator for next replacement pointer or access timestamp.
- **Step-by-Step Narrative**: Contextual explanation for every access decision.

### 4. Interactive Playback Stepper & Keyboard Shortcuts
- **Controls**: Previous Step, Next Step, Play, Pause, and Restart.
- **Playback Speed**: Adjustable playback rates (0.5x, 1x, 2x, 4x).
- **Direct Navigation**: Scrubber slider and clickable table rows to jump directly to any step in the trace.
- **Keyboard Shortcuts**:
  - `[Space]`: Toggle Play / Pause
  - `[←]` / `[→]`: Step backward / forward
  - `[R]`: Restart simulation to Step 1

### 5. Dynamic Trace Table
- Dynamic columns auto-matching physical frame capacity ($F_1, F_2, \dots, F_n$).
- Color-coded cell states indicating new insertions and page hits.
- Full trace inspection with instant step synchronization.

### 6. Live Performance Statistics & Comparison
Calculates exact Operating System metrics:
- $\text{Total Page References} = \text{Hits} + \text{Faults}$
- $\text{Hit Ratio} = \frac{\text{Hits}}{\text{Total References}}$
- $\text{Fault Ratio} = \frac{\text{Faults}}{\text{Total References}}$
- $\text{Hit Percentage} = \text{Hit Ratio} \times 100\%$
- $\text{Fault Percentage} = \text{Fault Ratio} \times 100\%$
- **Comparison Table**: Cross-algorithm benchmark matrix.
- **Comparative Bar Chart**: Visual fault distribution chart highlighting the top-performing algorithm (including multi-way ties).

### 7. Educational OS Theory & Viva Guide
Includes an interactive, collapsible reference guide covering:
- Hit vs. Fault Mechanics and hardware MMU traps.
- Why replacement occurs and dirty-page handling.
- Victim selection criteria for FIFO, LRU, and Optimal.
- Why Optimal acts as an unreachable theoretical benchmark.
- Belády’s Anomaly explanation and demonstration.

---

## 🧪 QA Audit & Test Verification Results

All 5 required test cases were verified against both the C++ reference binary (`Fifth_assignment.exe`) and our automated TypeScript test suite (`tests/qa_audit.mjs`):

| Test Case | Reference String | Frames | FIFO (F / H) | LRU (F / H) | Optimal (F / H) | Best Algorithm | Status |
| :--- | :--- | :---: | :---: | :---: | :---: | :---: | :---: |
| **TC 1: Standard Comparison** | `1 2 3 4 1 2 5 1 2 3 4 5` | 3 | 9 / 3 | 10 / 2 | 7 / 5 | Optimal | **PASSED** |
| **TC 2: Repeated References** | `1 2 3 1 2 3 1 2 3` | 3 | 3 / 6 | 3 / 6 | 3 / 6 | 3-Way Tie | **PASSED** |
| **TC 3: High Page Faults** | `1 2 3 4 5 6 7 8` | 3 | 8 / 0 | 8 / 0 | 8 / 0 | 3-Way Tie | **PASSED** |
| **TC 4: Repeated Single Page** | `5 5 5 5 5 5 5` | 3 | 1 / 6 | 1 / 6 | 1 / 6 | 3-Way Tie | **PASSED** |
| **TC 5: Increased Capacity (Belády)** | `1 2 3 4 1 2 5 1 2 3 4 5` | 4 | 10 / 2 | 8 / 4 | 6 / 6 | Optimal | **PASSED** |

### Mathematical Invariants Verified:
1. $\text{Total References} = \text{Hits} + \text{Faults}$ (100% verified across all test runs).
2. $\text{Hit Percentage} + \text{Fault Percentage} = 100.00\%$.
3. $\text{Faults}_{\text{Optimal}} \le \text{Faults}_{\text{FIFO}}$ and $\text{Faults}_{\text{Optimal}} \le \text{Faults}_{\text{LRU}}$.

---

## 🛠️ Technology Stack

- **Framework**: React 18
- **Language**: TypeScript (Strict Mode)
- **Build Tool**: Vite 5
- **Styling**: Tailwind CSS (Custom Dark Navy Theme)
- **Icons**: Lucide React

---

## 📂 Project Architecture

```
c:\OS assignments\
├── Fifth_assignment.cpp    # Original C++ reference implementation
├── Fifth_assignment.exe    # Compiled C++ reference binary
├── tests\
│   └── qa_audit.mjs        # Automated QA audit suite (93/93 passing tests)
├── src\
│   ├── types\
│   │   └── simulator.ts    # TypeScript definitions for steps, results, and stats
│   ├── core\
│   │   ├── algorithms\
│   │   │   ├── fifo.ts     # First-In First-Out implementation
│   │   │   ├── lru.ts      # Least Recently Used implementation
│   │   │   ├── optimal.ts  # Optimal (MIN) implementation
│   │   │   └── index.ts    # Unified runner and dispatcher
│   │   ├── validation.ts   # Input validation & sanitization
│   │   ├── stats.ts        # Performance metric calculations
│   │   └── interpreter.ts  # Intelligent dynamic summary engine
│   ├── components\
│   │   ├── Header.tsx             # Navbar with status indicator & reset
│   │   ├── InputPanel.tsx         # Reference string, frame count & preset selector
│   │   ├── AlgorithmCards.tsx     # Algorithm selection & individual triggers
│   │   ├── MemoryVisualization.tsx# Physical frame RAM cards & event badges
│   │   ├── PlaybackControls.tsx   # Stepper, scrubber & speed controls
│   │   ├── StatisticsCards.tsx    # Live metric analytics cards
│   │   ├── ExecutionTraceTable.tsx# Dynamic frame matrix table
│   │   ├── ComparisonDashboard.tsx# Matrix table & comparative bar chart
│   │   ├── InterpretationCard.tsx # Auto-generated OS findings
│   │   └── EducationalGuide.tsx   # OS theory & viva examination notes
│   ├── presets.ts          # Benchmark test cases
│   ├── App.tsx             # Main dashboard orchestrator
│   ├── main.tsx            # React application entry point
│   └── index.css           # Global theme & typography styles
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── vite.config.ts
```

---

## 📦 Installation & Setup

### Prerequisites
- Node.js (v18 or higher recommended; verified on Node v24.15)
- npm

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Automated QA Audit Suite
```bash
node tests/qa_audit.mjs
```
Runs 93 automated test assertions verifying algorithms, mathematical formulas, step-by-step frame contents, and edge-case inputs.

### 3. Start Development Server
```bash
npm run dev
```
Open your browser and navigate to `http://localhost:3000`.

### 4. Build for Production
```bash
npm run build
```

### 5. Preview Production Release
```bash
npm run preview
```
Open your browser and navigate to `http://localhost:4173`.

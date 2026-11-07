import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  AlgorithmType,
  AlgorithmResult,
  SimulationResults,
  PlaybackStatus,
} from './types/simulator';
import { parseAndValidateInput } from './core/validation';
import { executeAlgorithm, executeAllAlgorithms } from './core/algorithms';
import { generateInterpretation, InterpretationInsight } from './core/interpreter';
import { PRESET_CASES } from './presets';

import { Header } from './components/Header';
import { InputPanel } from './components/InputPanel';
import { AlgorithmCards } from './components/AlgorithmCards';
import { MemoryVisualization } from './components/MemoryVisualization';
import { PlaybackControls } from './components/PlaybackControls';
import { StatisticsCards } from './components/StatisticsCards';
import { ExecutionTraceTable } from './components/ExecutionTraceTable';
import { ComparisonDashboard } from './components/ComparisonDashboard';
import { InterpretationCard } from './components/InterpretationCard';
import { EducationalGuide } from './components/EducationalGuide';
import { BeladyAnalyzerModal } from './components/BeladyAnalyzerModal';
import { exportTraceToCSV, exportComparisonToCSV } from './core/exporter';

export const App: React.FC = () => {
  // Input State
  const [referenceString, setReferenceString] = useState<string>(
    '1 2 3 4 1 2 5 1 2 3 4 5'
  );
  const [frameCount, setFrameCount] = useState<number>(3);
  const [selectedPresetId, setSelectedPresetId] = useState<string>('test-case-1');
  const [validationError, setValidationError] = useState<string | null>(null);
  const [isStale, setIsStale] = useState<boolean>(false);
  const [isBeladyModalOpen, setIsBeladyModalOpen] = useState<boolean>(false);

  // Simulation Results State
  const [results, setResults] = useState<SimulationResults>({});
  const [activeAlgorithm, setActiveAlgorithm] = useState<AlgorithmType>('FIFO');
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);

  // Playback Control State
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(800); // ms per step
  const timerRef = useRef<number | null>(null);

  // Derived Active Result
  const activeResult: AlgorithmResult | null = results[activeAlgorithm] ?? null;
  const currentStep =
    activeResult && activeResult.steps[currentStepIndex]
      ? activeResult.steps[currentStepIndex]
      : null;
  const totalSteps = activeResult ? activeResult.steps.length : 0;

  // Status Indicator
  let status: PlaybackStatus = 'Ready';
  if (isPlaying) {
    status = 'Running';
  } else if (totalSteps > 0 && currentStepIndex === totalSteps - 1) {
    status = 'Completed';
  }

  // Dynamic Interpretation Insight
  const interpretation: InterpretationInsight | null =
    Object.keys(results).length > 0 ? generateInterpretation(results) : null;

  // Run All Algorithms
  const handleRunAll = useCallback(() => {
    setIsPlaying(false);
    if (timerRef.current) clearInterval(timerRef.current);

    const validation = parseAndValidateInput(referenceString, frameCount);
    if (!validation.isValid || !validation.pages || !validation.capacity) {
      setValidationError(validation.error || 'Invalid configuration.');
      return;
    }

    setValidationError(null);
    setIsStale(false);
    const newResults = executeAllAlgorithms(validation.pages, validation.capacity);
    setResults(newResults);
    setCurrentStepIndex(0);
  }, [referenceString, frameCount]);

  // Run Individual Algorithm
  const handleRunIndividual = useCallback(
    (alg: AlgorithmType) => {
      setIsPlaying(false);
      if (timerRef.current) clearInterval(timerRef.current);

      const validation = parseAndValidateInput(referenceString, frameCount);
      if (!validation.isValid || !validation.pages || !validation.capacity) {
        setValidationError(validation.error || 'Invalid configuration.');
        return;
      }

      setValidationError(null);
      setIsStale(false);
      const res = executeAlgorithm(alg, validation.pages, validation.capacity);
      setResults((prev) => ({
        ...prev,
        [alg]: res,
      }));
      setActiveAlgorithm(alg);
      setCurrentStepIndex(0);
    },
    [referenceString, frameCount]
  );

  // Presets Loader with auto-simulation
  const handleLoadPreset = (presetId: string) => {
    const preset = PRESET_CASES.find((p) => p.id === presetId);
    if (preset) {
      setIsPlaying(false);
      if (timerRef.current) clearInterval(timerRef.current);
      setReferenceString(preset.pages);
      setFrameCount(preset.frames);
      setSelectedPresetId(preset.id);
      setValidationError(null);
      setIsStale(false);

      const validation = parseAndValidateInput(preset.pages, preset.frames);
      if (validation.isValid && validation.pages && validation.capacity) {
        const newResults = executeAllAlgorithms(validation.pages, validation.capacity);
        setResults(newResults);
        setCurrentStepIndex(0);
      }
    }
  };

  // Clear Input
  const handleClear = () => {
    setIsPlaying(false);
    if (timerRef.current) clearInterval(timerRef.current);
    setReferenceString('');
    setSelectedPresetId('');
    setValidationError(null);
    setIsStale(true);
  };

  // Global Reset
  const handleReset = () => {
    setIsPlaying(false);
    if (timerRef.current) clearInterval(timerRef.current);
    const defaultPages = '1 2 3 4 1 2 5 1 2 3 4 5';
    const defaultFrames = 3;
    setReferenceString(defaultPages);
    setFrameCount(defaultFrames);
    setSelectedPresetId('test-case-1');
    setValidationError(null);
    setIsStale(false);

    const validation = parseAndValidateInput(defaultPages, defaultFrames);
    if (validation.isValid && validation.pages && validation.capacity) {
      const initialResults = executeAllAlgorithms(validation.pages, validation.capacity);
      setResults(initialResults);
      setCurrentStepIndex(0);
    }
  };

  // Playback Navigation
  const handleNext = useCallback(() => {
    if (totalSteps > 0 && currentStepIndex < totalSteps - 1) {
      setCurrentStepIndex((prev) => prev + 1);
    } else {
      setIsPlaying(false);
    }
  }, [totalSteps, currentStepIndex]);

  const handlePrev = useCallback(() => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1);
    }
  }, [currentStepIndex]);

  const handleRestart = useCallback(() => {
    setIsPlaying(false);
    setCurrentStepIndex(0);
  }, []);

  const handleSeek = (index: number) => {
    setIsPlaying(false);
    setCurrentStepIndex(Math.max(0, Math.min(totalSteps - 1, index)));
  };

  // Timer for Auto Playback
  useEffect(() => {
    if (isPlaying) {
      timerRef.current = window.setInterval(() => {
        setCurrentStepIndex((prev) => {
          if (prev < totalSteps - 1) {
            return prev + 1;
          } else {
            setIsPlaying(false);
            return prev;
          }
        });
      }, playbackSpeed);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isPlaying, totalSteps, playbackSpeed]);

  // Keyboard navigation shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept if user is typing in an input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      if (e.key === ' ' || e.code === 'Space') {
        e.preventDefault();
        setIsPlaying((prev) => !prev);
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        handleNext();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        handlePrev();
      } else if (e.key === 'r' || e.key === 'R') {
        e.preventDefault();
        handleRestart();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNext, handlePrev, handleRestart]);

  // Initial simulation run on mount
  useEffect(() => {
    const validation = parseAndValidateInput(referenceString, frameCount);
    if (validation.isValid && validation.pages && validation.capacity) {
      const initialResults = executeAllAlgorithms(
        validation.pages,
        validation.capacity
      );
      setResults(initialResults);
    }
  }, []);

  return (
    <div className="min-h-screen bg-[#080D18] text-[#F1F5F9] flex flex-col antialiased">
      {/* A. Header */}
      <Header
        status={status}
        onReset={handleReset}
        hasResults={Object.keys(results).length > 0}
      />

      {/* Main Content Dashboard */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col gap-6">
        {/* Educational OS Reference & Viva Guide */}
        <EducationalGuide />

        {/* B. Input Configuration Panel */}
        <InputPanel
          referenceString={referenceString}
          setReferenceString={(val) => {
            setReferenceString(val);
            setValidationError(null);
            setSelectedPresetId('');
            setIsStale(true);
          }}
          frameCount={frameCount}
          setFrameCount={(val) => {
            setFrameCount(val);
            setValidationError(null);
            setSelectedPresetId('');
            setIsStale(true);
          }}
          onRunAll={handleRunAll}
          onClear={handleClear}
          onLoadPreset={handleLoadPreset}
          selectedPresetId={selectedPresetId}
          errorMessage={validationError}
          isRunning={isPlaying}
          isStale={isStale}
        />

        {/* C. Algorithm Selection Cards */}
        <AlgorithmCards
          activeAlgorithm={activeAlgorithm}
          onSelectAlgorithm={(alg) => setActiveAlgorithm(alg)}
          onRunIndividual={handleRunIndividual}
          results={results}
          isRunning={isPlaying}
        />

        {/* D & E. Memory Visualization & Stepper Controls */}
        <div className="flex flex-col gap-4">
          <MemoryVisualization
            currentStep={currentStep}
            totalSteps={totalSteps}
            capacity={activeResult?.capacity ?? frameCount}
            algorithmName={activeResult?.name ?? activeAlgorithm}
            algorithmType={activeAlgorithm}
          />

          {totalSteps > 0 && (
            <PlaybackControls
              currentStepIndex={currentStepIndex}
              totalSteps={totalSteps}
              isPlaying={isPlaying}
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
              onNext={handleNext}
              onPrev={handlePrev}
              onRestart={handleRestart}
              onSeek={handleSeek}
              playbackSpeed={playbackSpeed}
              setPlaybackSpeed={setPlaybackSpeed}
              disabled={totalSteps <= 1}
            />
          )}
        </div>

        {/* F. Performance Statistics */}
        <StatisticsCards
          result={activeResult}
          algorithmName={activeResult?.name ?? activeAlgorithm}
        />

        {/* G. Algorithm Comparison Dashboard */}
        <ComparisonDashboard
          results={results}
          onSelectAlgorithm={(alg) => setActiveAlgorithm(alg)}
          activeAlgorithm={activeAlgorithm}
          onExportComparisonCSV={() => exportComparisonToCSV(results)}
          onOpenBeladyModal={() => setIsBeladyModalOpen(true)}
        />

        {/* H. Result Interpretation */}
        <InterpretationCard insight={interpretation} />

        {/* E. Step-by-Step Execution Trace Table */}
        {activeResult && (
          <ExecutionTraceTable
            steps={activeResult.steps}
            currentStepIndex={currentStepIndex}
            capacity={activeResult.capacity}
            onSelectStep={(idx) => {
              setIsPlaying(false);
              setCurrentStepIndex(idx);
            }}
            algorithmName={activeResult.name}
            onExportCSV={() => exportTraceToCSV(activeResult)}
          />
        )}

        {/* Belády Anomaly Multi-Frame Analyzer Modal */}
        <BeladyAnalyzerModal
          isOpen={isBeladyModalOpen}
          onClose={() => setIsBeladyModalOpen(false)}
          pages={activeResult?.pages ?? [1, 2, 3, 4, 1, 2, 5, 1, 2, 3, 4, 5]}
          referenceString={referenceString}
        />
      </main>

      {/* Footer */}
      <footer className="w-full bg-[#101827] border-t border-[#1E2D44] py-4 px-4 sm:px-6 lg:px-8 mt-12 text-center text-xs text-slate-500 font-mono">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>
            VMSIM &bull; OS Assignment Simulator &bull; FIFO &bull; LRU &bull; Optimal
          </span>
          <span className="text-slate-400">
            Keyboard Shortcuts: [Space] Play/Pause &bull; [&larr;] Prev &bull; [&rarr;] Next &bull; [R] Restart
          </span>
        </div>
      </footer>
    </div>
  );
};

export default App;

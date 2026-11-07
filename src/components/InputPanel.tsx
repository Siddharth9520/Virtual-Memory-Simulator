import React from 'react';
import { Play, Sparkles, Trash2, Sliders, AlertCircle, RefreshCw } from 'lucide-react';
import { PRESET_CASES } from '../presets';

interface InputPanelProps {
  referenceString: string;
  setReferenceString: (val: string) => void;
  frameCount: number;
  setFrameCount: (val: number) => void;
  onRunAll: () => void;
  onClear: () => void;
  onLoadPreset: (presetId: string) => void;
  selectedPresetId: string;
  errorMessage: string | null;
  isRunning: boolean;
  isStale?: boolean;
}

export const InputPanel: React.FC<InputPanelProps> = ({
  referenceString,
  setReferenceString,
  frameCount,
  setFrameCount,
  onRunAll,
  onClear,
  onLoadPreset,
  selectedPresetId,
  errorMessage,
  isRunning,
  isStale,
}) => {
  const handleFrameChange = (delta: number) => {
    const newVal = Math.min(12, Math.max(1, frameCount + delta));
    setFrameCount(newVal);
  };

  return (
    <section className="bg-[#101827] border border-[#1E2D44] rounded-2xl p-5 shadow-lg relative overflow-hidden">
      {/* Decorative accent top line */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-500/60 to-transparent" />

      <div className="flex flex-col gap-5">
        {/* Section Title & Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#1E2D44]/70">
          <div className="flex items-center space-x-2">
            <Sliders className="w-4 h-4 text-cyan-400" />
            <h2 className="text-sm font-semibold tracking-wide uppercase text-slate-200 font-mono">
              Simulation Configuration
            </h2>
            {isStale && (
              <span className="text-[10px] bg-amber-950/80 text-amber-300 border border-amber-800/80 px-2 py-0.5 rounded font-mono font-semibold animate-pulse">
                SYNC NEEDED
              </span>
            )}
          </div>
          <span className="text-xs text-slate-400 font-medium">
            Enter reference string or select a pre-verified test case
          </span>
        </div>

        {/* Input Controls Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Reference String Input - 8 cols */}
          <div className="lg:col-span-8 flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <label
                htmlFor="ref-string"
                className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5"
              >
                <span>Page Reference String</span>
                <span className="text-slate-500 font-normal lowercase">
                  (space or comma separated integers)
                </span>
              </label>
              <button
                type="button"
                onClick={() => {
                  setReferenceString('1 2 3 4 1 2 5 1 2 3 4 5');
                }}
                className="text-[11px] text-cyan-400 hover:text-cyan-300 underline underline-offset-2 transition-colors cursor-pointer"
              >
                Insert prompt sample
              </button>
            </div>

            <div className="relative">
              <input
                id="ref-string"
                type="text"
                value={referenceString}
                onChange={(e) => setReferenceString(e.target.value)}
                placeholder="e.g. 1 2 3 4 1 2 5 1 2 3 4 5"
                className={`w-full bg-[#151F30] border ${
                  errorMessage
                    ? 'border-red-500/80 focus:border-red-400'
                    : isStale
                    ? 'border-amber-500/60 focus:border-amber-400'
                    : 'border-[#243247] focus:border-cyan-400'
                } rounded-xl px-4 py-2.5 text-sm font-mono text-slate-100 placeholder:text-slate-600 focus:outline-none focus:ring-1 focus:ring-cyan-400/40 transition-all`}
              />
            </div>

            {/* Error banner if validation fails */}
            {errorMessage && (
              <div className="flex items-center space-x-2 text-xs text-red-400 bg-red-950/40 border border-red-800/60 px-3 py-1.5 rounded-lg animate-in fade-in duration-200">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Warning if inputs modified after run */}
            {isStale && !errorMessage && (
              <div className="flex items-center space-x-2 text-xs text-amber-300 bg-amber-950/40 border border-amber-800/60 px-3 py-1.5 rounded-lg animate-in fade-in duration-200">
                <RefreshCw className="w-3.5 h-3.5 flex-shrink-0 text-amber-400" />
                <span>
                  Configuration updated. Click &ldquo;Run All Algorithms&rdquo; to re-synchronize live metrics and memory trace.
                </span>
              </div>
            )}
          </div>

          {/* Number of Physical Frames - 4 cols */}
          <div className="lg:col-span-4 flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <label
                htmlFor="frame-count"
                className="text-xs font-semibold text-slate-300 uppercase tracking-wider"
              >
                Physical Frames
              </label>
              <span className="text-[11px] text-slate-400 font-mono">
                [Min: 1, Max: 12]
              </span>
            </div>

            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={() => handleFrameChange(-1)}
                disabled={frameCount <= 1 || isRunning}
                className="w-10 h-10 rounded-xl bg-[#151F30] hover:bg-[#1E2D44] border border-[#243247] text-slate-200 font-bold text-base flex items-center justify-center transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                title="Decrease frame capacity"
              >
                -
              </button>
              <input
                id="frame-count"
                type="number"
                min={1}
                max={12}
                value={frameCount}
                onChange={(e) => {
                  const val = parseInt(e.target.value, 10);
                  if (!isNaN(val)) setFrameCount(val);
                }}
                className="w-full bg-[#151F30] border border-[#243247] focus:border-cyan-400 rounded-xl px-3 py-2 text-center text-base font-mono font-bold text-cyan-300 focus:outline-none focus:ring-1 focus:ring-cyan-400/40"
              />
              <button
                type="button"
                onClick={() => handleFrameChange(1)}
                disabled={frameCount >= 12 || isRunning}
                className="w-10 h-10 rounded-xl bg-[#151F30] hover:bg-[#1E2D44] border border-[#243247] text-slate-200 font-bold text-base flex items-center justify-center transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                title="Increase frame capacity"
              >
                +
              </button>
            </div>
          </div>
        </div>

        {/* Preset Sample Test Cases Buttons */}
        <div className="flex flex-col gap-2 pt-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider font-mono flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>Standard OS Test Cases (Pre-Verified)</span>
            </span>
            <span className="text-[11px] text-slate-500 font-mono">
              Click any button to load and auto-simulate
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2">
            {PRESET_CASES.map((preset) => {
              const isSelected = selectedPresetId === preset.id && !isStale;
              return (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => onLoadPreset(preset.id)}
                  title={preset.description}
                  className={`text-xs px-3 py-2 rounded-xl border text-left flex flex-col justify-between transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-cyan-950/80 border-cyan-400 text-cyan-300 font-medium shadow-sm ring-1 ring-cyan-500/40'
                      : 'bg-[#151F30] border-[#243247] text-slate-300 hover:border-slate-500 hover:text-white'
                  }`}
                >
                  <span className="font-semibold truncate">{preset.name}</span>
                  <span className="text-[10px] text-slate-500 font-mono mt-0.5 truncate">
                    {preset.frames} Frames &bull; {preset.pages.split(' ').length} Refs
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Action Buttons Row */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[#1E2D44]/70">
          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={onClear}
              disabled={isRunning || (!referenceString && frameCount === 3)}
              className="flex items-center space-x-1.5 px-3.5 py-2 text-xs font-medium rounded-xl text-slate-400 bg-[#151F30] hover:bg-[#1E2D44] hover:text-slate-200 border border-[#243247] transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear Input</span>
            </button>

            <button
              type="button"
              onClick={() => onLoadPreset('test-case-1')}
              disabled={isRunning}
              className="flex items-center space-x-1.5 px-3.5 py-2 text-xs font-medium rounded-xl text-slate-300 bg-[#151F30] hover:bg-[#1E2D44] hover:text-white border border-[#243247] transition-all cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>Load Example</span>
            </button>
          </div>

          <button
            type="button"
            onClick={onRunAll}
            disabled={isRunning}
            className={`flex items-center space-x-2 px-5 py-2.5 text-xs font-semibold uppercase tracking-wider rounded-xl transition-all font-mono disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer ${
              isStale
                ? 'bg-amber-400 hover:bg-amber-300 text-slate-950 ring-2 ring-amber-500/50'
                : 'text-navy-950 bg-cyan-400 hover:bg-cyan-300 active:bg-cyan-500 shadow-glow-accent'
            }`}
          >
            <Play className="w-4 h-4 fill-current" />
            <span>{isStale ? 'Re-run All Algorithms' : 'Run All Algorithms'}</span>
          </button>
        </div>
      </div>
    </section>
  );
};

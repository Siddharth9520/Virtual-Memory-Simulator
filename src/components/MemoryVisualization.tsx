import React from 'react';
import { SimulationStep, AlgorithmType } from '../types/simulator';
import { CheckCircle2, AlertTriangle, CornerDownRight, Database, HardDrive } from 'lucide-react';

interface MemoryVisualizationProps {
  currentStep: SimulationStep | null;
  totalSteps: number;
  capacity: number;
  algorithmName: string;
  algorithmType: AlgorithmType;
}

export const MemoryVisualization: React.FC<MemoryVisualizationProps> = ({
  currentStep,
  totalSteps,
  capacity,
  algorithmName,
  algorithmType,
}) => {
  if (!currentStep) {
    return (
      <section className="bg-[#101827] border border-[#1E2D44] rounded-2xl p-8 text-center flex flex-col items-center justify-center min-h-[220px]">
        <Database className="w-12 h-12 text-slate-600 mb-3" />
        <h3 className="text-base font-semibold text-slate-300">
          Memory Frames Awaiting Simulation
        </h3>
        <p className="text-xs text-slate-500 mt-1 max-w-md">
          Run an algorithm or execute the simulation suite to visualize real-time physical memory frame allocations and page fault replacements.
        </p>
      </section>
    );
  }

  const {
    step,
    page,
    frames,
    isHit,
    frameIndexChanged,
    replacedPage,
    pointer,
    explanation,
  } = currentStep;

  return (
    <section className="bg-[#101827] border border-[#1E2D44] rounded-2xl p-5 shadow-lg relative overflow-hidden flex flex-col gap-5">
      {/* Top Banner: Step Info & Hit/Fault Status */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[#1E2D44]">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-[#151F30] border border-[#243247] text-cyan-400">
            <HardDrive className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs uppercase font-mono font-bold tracking-wider text-cyan-400">
                Step {step} of {totalSteps}
              </span>
              <span className="text-slate-600">•</span>
              <span className="text-xs font-mono text-slate-300 font-semibold">
                {algorithmName}
              </span>
            </div>
            <div className="flex items-center space-x-2 mt-0.5">
              <span className="text-xs text-slate-400">Requested Page:</span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-md bg-cyan-950 text-cyan-300 border border-cyan-800 font-mono font-bold text-sm">
                Page {page}
              </span>
            </div>
          </div>
        </div>

        {/* Status Badge (HIT vs PAGE FAULT) */}
        <div className="flex items-center space-x-3">
          {isHit ? (
            <div className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-emerald-950/60 border border-emerald-500/60 text-emerald-300 shadow-glow-hit animate-in zoom-in-95 duration-200">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              <div className="flex flex-col">
                <span className="text-xs font-mono font-bold tracking-widest uppercase">
                  PAGE HIT
                </span>
                <span className="text-[10px] text-emerald-400/80 font-mono">
                  No replacement required
                </span>
              </div>
            </div>
          ) : (
            <div className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-red-950/60 border border-red-500/60 text-red-300 shadow-glow-fault animate-in zoom-in-95 duration-200">
              <AlertTriangle className="w-5 h-5 text-red-400" />
              <div className="flex flex-col">
                <span className="text-xs font-mono font-bold tracking-widest uppercase">
                  PAGE FAULT
                </span>
                <span className="text-[10px] text-red-400/80 font-mono">
                  {replacedPage !== null ? `Evicted Page ${replacedPage}` : 'Empty slot allocated'}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Physical Memory Frames Grid */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider font-mono flex items-center gap-1.5">
            <span>Physical Memory Frames</span>
            <span className="text-slate-500 font-normal">({capacity} total slots)</span>
          </span>

          {algorithmType === 'FIFO' && pointer !== undefined && (
            <span className="text-[11px] font-mono text-cyan-400/90 bg-cyan-950/50 px-2.5 py-0.5 rounded border border-cyan-800/40">
              FIFO Pointer: Frame {(pointer % capacity) + 1}
            </span>
          )}
        </div>

        {/* Frames Visual Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3.5 pt-2">
          {frames.map((pageValue, index) => {
            const isTargetFrame = frameIndexChanged === index;
            const isInserted = isTargetFrame && !isHit;
            const isHitFrame = isTargetFrame && isHit;
            const isFifoTarget = algorithmType === 'FIFO' && pointer === index;

            return (
              <div
                key={index}
                className={`relative rounded-xl p-3 flex flex-col justify-between items-center min-h-[110px] transition-all duration-300 border ${
                  isHitFrame
                    ? 'bg-emerald-950/30 border-emerald-500/80 shadow-glow-hit ring-1 ring-emerald-500/50'
                    : isInserted
                    ? 'bg-red-950/20 border-red-500/80 shadow-glow-fault ring-1 ring-red-500/50'
                    : 'bg-[#151F30] border-[#1E2D44] hover:border-[#2A3C5B]'
                }`}
              >
                {/* Frame Slot Header */}
                <div className="w-full flex items-center justify-between text-[11px] font-mono text-slate-400 pb-1.5 border-b border-[#1E2D44]/70">
                  <span className="font-semibold text-slate-300">
                    F{index + 1}
                  </span>

                  {isHitFrame ? (
                    <span className="text-[9px] uppercase font-bold text-emerald-400 bg-emerald-950 px-1.5 py-0.5 rounded border border-emerald-800">
                      Hit
                    </span>
                  ) : isInserted ? (
                    <span className="text-[9px] uppercase font-bold text-red-400 bg-red-950 px-1.5 py-0.5 rounded border border-red-800">
                      Loaded
                    </span>
                  ) : isFifoTarget ? (
                    <span className="text-[9px] uppercase font-bold text-cyan-400 bg-cyan-950 px-1.5 py-0.5 rounded border border-cyan-800">
                      Next Ptr
                    </span>
                  ) : (
                    <span className="text-[9px] text-slate-500">Slot</span>
                  )}
                </div>

                {/* Page Content Display */}
                <div className="my-auto py-2 text-center">
                  {pageValue !== null ? (
                    <div className="flex flex-col items-center">
                      <span
                        className={`text-2xl font-mono font-bold tracking-tight transition-transform duration-200 ${
                          isHitFrame
                            ? 'text-emerald-300 scale-110'
                            : isInserted
                            ? 'text-cyan-300 scale-110'
                            : 'text-slate-100'
                        }`}
                      >
                        {pageValue}
                      </span>
                      <span className="text-[10px] text-slate-500 font-mono">
                        Page {pageValue}
                      </span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center text-slate-600">
                      <span className="text-xl font-mono">-</span>
                      <span className="text-[10px] text-slate-600 font-mono uppercase tracking-wider">
                        Empty
                      </span>
                    </div>
                  )}
                </div>

                {/* Eviction Notice Tag on this Frame if evicted */}
                {isInserted && replacedPage !== null && (
                  <div className="w-full text-center text-[10px] font-mono text-red-400/90 bg-red-950/80 rounded py-0.5 border border-red-900/60 truncate px-1">
                    Replaced P{replacedPage}
                  </div>
                )}
                {isInserted && replacedPage === null && (
                  <div className="w-full text-center text-[10px] font-mono text-cyan-400/90 bg-cyan-950/80 rounded py-0.5 border border-cyan-900/60 truncate px-1">
                    Initial Load
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Step Explanation Banner */}
      <div className="bg-[#121B2B] border border-[#1E2D44] rounded-xl p-3.5 flex items-start space-x-3">
        <CornerDownRight className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
        <div className="flex flex-col gap-0.5">
          <span className="text-[11px] uppercase tracking-wider font-mono font-bold text-slate-400">
            Execution Log:
          </span>
          <p className="text-xs text-slate-200 font-mono leading-relaxed">
            {explanation}
          </p>
        </div>
      </div>
    </section>
  );
};

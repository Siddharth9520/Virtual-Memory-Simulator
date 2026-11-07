import React from 'react';
import { SimulationStep } from '../types/simulator';
import { Check, X, Download } from 'lucide-react';

interface ExecutionTraceTableProps {
  steps: SimulationStep[];
  currentStepIndex: number;
  capacity: number;
  onSelectStep: (index: number) => void;
  algorithmName: string;
  onExportCSV?: () => void;
}

export const ExecutionTraceTable: React.FC<ExecutionTraceTableProps> = ({
  steps,
  currentStepIndex,
  capacity,
  onSelectStep,
  algorithmName,
  onExportCSV,
}) => {
  if (steps.length === 0) {
    return null;
  }

  // Generate dynamic frame headers: Frame 1, Frame 2, ... Frame N
  const frameHeaders = Array.from({ length: capacity }, (_, i) => `Frame ${i + 1}`);

  return (
    <section className="bg-[#101827] border border-[#1E2D44] rounded-2xl p-5 shadow-lg flex flex-col gap-4 overflow-hidden">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#1E2D44]">
        <div>
          <h3 className="text-sm font-semibold tracking-wide uppercase text-slate-200 font-mono">
            Execution Trace Log &bull; {algorithmName}
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Step-by-step physical frame snapshot. Click any row to inspect memory state.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <span className="text-xs font-mono text-slate-500">
            Total Steps: {steps.length}
          </span>
          {onExportCSV && (
            <button
              type="button"
              onClick={onExportCSV}
              className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-mono font-medium rounded-lg text-slate-300 bg-[#151F30] hover:bg-[#1E2D44] hover:text-white border border-[#243247] transition-all cursor-pointer"
              title="Download step trace table as CSV"
            >
              <Download className="w-3.5 h-3.5 text-cyan-400" />
              <span>Export CSV</span>
            </button>
          )}
        </div>
      </div>

      <div className="overflow-x-auto max-h-[380px] rounded-xl border border-[#1E2D44]">
        <table className="w-full text-left border-collapse font-mono text-xs">
          <thead className="bg-[#121B2B] text-slate-300 uppercase tracking-wider sticky top-0 z-20 border-b border-[#1E2D44]">
            <tr>
              <th className="py-2.5 px-3 font-semibold text-center w-14">Step</th>
              <th className="py-2.5 px-3 font-semibold text-center w-16">Page</th>
              {frameHeaders.map((header, idx) => (
                <th key={idx} className="py-2.5 px-3 font-semibold text-center min-w-[70px]">
                  {header}
                </th>
              ))}
              <th className="py-2.5 px-3 font-semibold text-center w-24">Status</th>
              <th className="py-2.5 px-3 font-semibold min-w-[200px]">Action Detail</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1E2D44]/60 bg-[#151F30]">
            {steps.map((item, idx) => {
              const isCurrent = idx === currentStepIndex;

              return (
                <tr
                  key={idx}
                  onClick={() => onSelectStep(idx)}
                  className={`cursor-pointer transition-colors ${
                    isCurrent
                      ? 'bg-cyan-950/40 text-white font-medium border-l-4 border-l-cyan-400'
                      : 'hover:bg-[#1A263B] text-slate-300'
                  }`}
                >
                  {/* Step # */}
                  <td className="py-2 px-3 text-center text-slate-400 font-semibold">
                    {item.step}
                  </td>

                  {/* Requested Page */}
                  <td className="py-2 px-3 text-center">
                    <span className="inline-block px-2 py-0.5 rounded bg-[#101827] text-cyan-300 font-bold border border-[#243247]">
                      {item.page}
                    </span>
                  </td>

                  {/* Dynamic Frame Columns */}
                  {item.frames.map((frameVal, frameIdx) => {
                    const isChanged = item.frameIndexChanged === frameIdx;
                    const isHitSlot = isChanged && item.isHit;
                    const isFaultSlot = isChanged && !item.isHit;

                    return (
                      <td
                        key={frameIdx}
                        className={`py-2 px-3 text-center border-x border-[#1E2D44]/40 ${
                          isHitSlot
                            ? 'bg-emerald-950/40 text-emerald-300 font-bold'
                            : isFaultSlot
                            ? 'bg-red-950/40 text-cyan-300 font-bold'
                            : ''
                        }`}
                      >
                        {frameVal !== null ? (
                          <span
                            className={
                              isHitSlot
                                ? 'text-emerald-400'
                                : isFaultSlot
                                ? 'text-cyan-300'
                                : 'text-slate-300'
                            }
                          >
                            {frameVal}
                          </span>
                        ) : (
                          <span className="text-slate-600">-</span>
                        )}
                      </td>
                    );
                  })}

                  {/* Status Badge */}
                  <td className="py-2 px-3 text-center">
                    {item.isHit ? (
                      <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-800">
                        <Check className="w-3 h-3 text-emerald-400" />
                        <span>HIT</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded text-[10px] font-bold bg-red-950 text-red-300 border border-red-800">
                        <X className="w-3 h-3 text-red-400" />
                        <span>FAULT</span>
                      </span>
                    )}
                  </td>

                  {/* Detail explanation */}
                  <td className="py-2 px-3 text-xs text-slate-400 truncate max-w-xs font-sans">
                    {item.explanation}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
};

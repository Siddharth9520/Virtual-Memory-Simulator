import React from 'react';
import { X, TrendingUp, AlertTriangle, CheckCircle2, Info } from 'lucide-react';
import { analyzeBeladyAnomaly } from '../core/belady';

interface BeladyAnalyzerModalProps {
  isOpen: boolean;
  onClose: () => void;
  pages: number[];
  referenceString: string;
}

export const BeladyAnalyzerModal: React.FC<BeladyAnalyzerModalProps> = ({
  isOpen,
  onClose,
  pages,
  referenceString,
}) => {
  if (!isOpen || pages.length === 0) return null;

  const analysis = analyzeBeladyAnomaly(pages, 1, 8);
  const { dataPoints, hasAnomaly, anomalyInstances } = analysis;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#101827] border border-[#1E2D44] rounded-2xl max-w-3xl w-full p-6 shadow-2xl relative flex flex-col gap-5 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-start justify-between pb-3 border-b border-[#1E2D44]">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-100 font-mono flex items-center gap-2">
                <span>Belády’s Anomaly Multi-Frame Curve Analyzer</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Evaluates fault trajectories across 1 to 8 physical frames for the active reference string
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white bg-[#151F30] hover:bg-[#1E2D44] border border-[#243247] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Active Sequence Pill */}
        <div className="flex items-center space-x-2 text-xs font-mono bg-[#151F30] p-3 rounded-xl border border-[#1E2D44] text-slate-300">
          <span className="text-slate-500 font-semibold uppercase">Sequence:</span>
          <span className="text-cyan-300 truncate">{referenceString}</span>
        </div>

        {/* Anomaly Detection Banner */}
        {hasAnomaly ? (
          <div className="flex items-start space-x-3 p-4 rounded-xl bg-amber-950/40 border border-amber-500/50 text-amber-300">
            <AlertTriangle className="w-5 h-5 flex-shrink-0 text-amber-400 mt-0.5" />
            <div className="flex flex-col gap-1 text-xs">
              <span className="font-bold uppercase tracking-wider font-mono">
                Belády’s Anomaly Detected in FIFO!
              </span>
              <p className="text-amber-200/90 leading-relaxed font-sans">
                {anomalyInstances.map((inst, i) => (
                  <span key={i} className="block">
                    &bull; Increasing frame capacity from <strong>{inst.fromFrames}</strong> to <strong>{inst.toFrames}</strong> frames paradoxically increased FIFO page faults from <strong>{inst.fromFaults}</strong> to <strong>{inst.toFaults}</strong>.
                  </span>
                ))}
              </p>
            </div>
          </div>
        ) : (
          <div className="flex items-center space-x-3 p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 text-xs">
            <CheckCircle2 className="w-5 h-5 flex-shrink-0 text-emerald-400" />
            <span>
              No Belády’s anomaly detected on this sequence between 1 and 8 frames. FIFO fault counts monotonically non-increased.
            </span>
          </div>
        )}

        {/* Frame Comparison Matrix Table */}
        <div className="overflow-x-auto rounded-xl border border-[#1E2D44]">
          <table className="w-full text-left font-mono text-xs">
            <thead className="bg-[#121B2B] text-slate-300 uppercase tracking-wider border-b border-[#1E2D44]">
              <tr>
                <th className="py-2.5 px-3 text-center">Frames (m)</th>
                <th className="py-2.5 px-3 text-right">FIFO Faults</th>
                <th className="py-2.5 px-3 text-right">LRU Faults</th>
                <th className="py-2.5 px-3 text-right">Optimal Faults</th>
                <th className="py-2.5 px-3 text-center">Anomaly Flag</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1E2D44]/60 bg-[#151F30]">
              {dataPoints.map((dp) => (
                <tr
                  key={dp.frames}
                  className={`transition-colors ${
                    dp.isAnomaly ? 'bg-amber-950/30 font-semibold' : 'hover:bg-[#1A263B]'
                  }`}
                >
                  <td className="py-2 px-3 text-center font-bold text-cyan-300">
                    {dp.frames}
                  </td>
                  <td className={`py-2 px-3 text-right ${dp.isAnomaly ? 'text-amber-400 font-bold' : 'text-slate-200'}`}>
                    {dp.fifoFaults}
                  </td>
                  <td className="py-2 px-3 text-right text-indigo-300">
                    {dp.lruFaults}
                  </td>
                  <td className="py-2 px-3 text-right text-emerald-300">
                    {dp.optimalFaults}
                  </td>
                  <td className="py-2 px-3 text-center">
                    {dp.isAnomaly ? (
                      <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-amber-950 text-amber-300 border border-amber-600">
                        ANOMALY &uarr;
                      </span>
                    ) : (
                      <span className="text-[10px] text-slate-500 font-normal">Normal</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Theoretical Explanation */}
        <div className="bg-[#121B2B] border border-[#1E2D44] rounded-xl p-3.5 flex items-start space-x-3 text-xs text-slate-400">
          <Info className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <strong className="text-slate-200">Stack Property Theorem:</strong> An algorithm is a <em>stack algorithm</em> if the set of pages in an $m$-frame memory is always a subset of the pages in an $(m+1)$-frame memory ($M(t, m) \subseteq M(t, m+1)$). LRU and Optimal are provably stack algorithms and mathematically can never exhibit Belády’s Anomaly. FIFO lacks the stack property, causing older pages to be evicted prematurely when frame capacity shifts.
          </p>
        </div>

        {/* Footer */}
        <div className="flex justify-end pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-mono font-medium rounded-xl text-slate-300 bg-[#151F30] hover:bg-[#1E2D44] border border-[#243247] transition-all cursor-pointer"
          >
            Close Analyzer
          </button>
        </div>
      </div>
    </div>
  );
};

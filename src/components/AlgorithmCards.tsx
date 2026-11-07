import React from 'react';
import { AlgorithmType, AlgorithmResult } from '../types/simulator';
import { Play, Clock, Eye, Layers } from 'lucide-react';
import { formatPercent } from '../core/stats';

interface AlgorithmCardsProps {
  activeAlgorithm: AlgorithmType;
  onSelectAlgorithm: (alg: AlgorithmType) => void;
  onRunIndividual: (alg: AlgorithmType) => void;
  results: Partial<Record<AlgorithmType, AlgorithmResult>>;
  isRunning: boolean;
}

interface AlgMetadata {
  id: AlgorithmType;
  title: string;
  tagline: string;
  strategy: string;
  badge: string;
  icon: React.ReactNode;
}

const ALGORITHMS_META: AlgMetadata[] = [
  {
    id: 'FIFO',
    title: 'FIFO Replacement',
    tagline: 'First-In First-Out Queue',
    strategy: 'Evicts the page that has been in memory the longest (circular pointer / queue).',
    badge: 'Simple Queue',
    icon: <Layers className="w-4 h-4 text-cyan-400" />,
  },
  {
    id: 'LRU',
    title: 'LRU Replacement',
    tagline: 'Least Recently Used',
    strategy: 'Evicts the page that has not been referenced for the longest period of time.',
    badge: 'Recency Tracking',
    icon: <Clock className="w-4 h-4 text-indigo-400" />,
  },
  {
    id: 'OPTIMAL',
    title: 'Optimal Replacement',
    tagline: 'Belady’s MIN Algorithm',
    strategy: 'Evicts the page that will not be accessed for the longest period into the future.',
    badge: 'Theoretical Limit',
    icon: <Eye className="w-4 h-4 text-emerald-400" />,
  },
];

export const AlgorithmCards: React.FC<AlgorithmCardsProps> = ({
  activeAlgorithm,
  onSelectAlgorithm,
  onRunIndividual,
  results,
  isRunning,
}) => {
  return (
    <section className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider font-mono">
          Algorithm Suite &amp; Active Viewer Selection
        </h3>
        <span className="text-xs text-slate-500">
          Click a card to inspect trace or click Run to simulate individually
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {ALGORITHMS_META.map((meta) => {
          const isSelected = activeAlgorithm === meta.id;
          const result = results[meta.id];

          return (
            <div
              key={meta.id}
              onClick={() => onSelectAlgorithm(meta.id)}
              className={`relative rounded-xl p-4 transition-all cursor-pointer flex flex-col justify-between border ${
                isSelected
                  ? 'bg-[#151F30] border-cyan-400/80 shadow-glow-accent'
                  : 'bg-[#121B2B] hover:bg-[#151F30] border-[#1E2D44] hover:border-[#2A3C5B]'
              }`}
            >
              {/* Active Tab Accent Marker */}
              {isSelected && (
                <div className="absolute top-0 left-4 right-4 h-[2px] bg-cyan-400 rounded-full" />
              )}

              <div className="flex flex-col gap-2">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center space-x-2">
                    <div className="p-1.5 rounded-lg bg-[#101827] border border-[#243247]">
                      {meta.icon}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-100 font-mono">
                        {meta.title}
                      </h4>
                      <p className="text-[11px] text-slate-400 font-medium">
                        {meta.tagline}
                      </p>
                    </div>
                  </div>

                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#101827] text-slate-400 border border-[#243247]">
                    {meta.badge}
                  </span>
                </div>

                <div className="text-xs text-slate-400 mt-1 leading-relaxed bg-[#0E1522] p-2.5 rounded-lg border border-[#1A2638]">
                  <span className="font-semibold text-slate-300">Strategy: </span>
                  {meta.strategy}
                </div>
              </div>

              {/* Execution Summary & Run Button */}
              <div className="mt-4 pt-3 border-t border-[#1E2D44] flex items-center justify-between gap-2">
                {result ? (
                  <div className="flex items-center space-x-3 text-xs font-mono">
                    <span className="text-red-400 font-semibold">
                      {result.faults} Faults
                    </span>
                    <span className="text-slate-500">|</span>
                    <span className="text-emerald-400 font-semibold">
                      {result.hits} Hits ({formatPercent(result.hitPercentage)})
                    </span>
                  </div>
                ) : (
                  <span className="text-xs text-slate-500 italic font-mono">
                    Not yet simulated
                  </span>
                )}

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onRunIndividual(meta.id);
                  }}
                  disabled={isRunning}
                  className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all ${
                    result
                      ? 'bg-[#101827] hover:bg-[#1E2D44] text-slate-300 border border-[#243247]'
                      : 'bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40'
                  }`}
                  title={`Run ${meta.title} only`}
                >
                  <Play className="w-3 h-3 fill-current" />
                  <span>{result ? 'Re-run' : 'Run'}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

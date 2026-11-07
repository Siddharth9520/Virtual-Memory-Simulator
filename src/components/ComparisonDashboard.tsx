import React from 'react';
import { AlgorithmResult, AlgorithmType } from '../types/simulator';
import { formatPercent, formatRatio } from '../core/stats';
import { Trophy, BarChart3, ArrowDown, Award, Download, TrendingUp } from 'lucide-react';

interface ComparisonDashboardProps {
  results: Partial<Record<AlgorithmType, AlgorithmResult>>;
  onSelectAlgorithm: (alg: AlgorithmType) => void;
  activeAlgorithm: AlgorithmType;
  onExportComparisonCSV?: () => void;
  onOpenBeladyModal?: () => void;
}

export const ComparisonDashboard: React.FC<ComparisonDashboardProps> = ({
  results,
  onSelectAlgorithm,
  activeAlgorithm,
  onExportComparisonCSV,
  onOpenBeladyModal,
}) => {
  const algorithms: AlgorithmType[] = ['FIFO', 'LRU', 'OPTIMAL'];
  const activeResults = algorithms
    .map((alg) => results[alg])
    .filter((res): res is AlgorithmResult => res !== undefined);

  if (activeResults.length === 0) {
    return null;
  }

  // Find minimum faults
  const minFaults = Math.min(...activeResults.map((r) => r.faults));
  const maxFaults = Math.max(...activeResults.map((r) => r.faults), 1);
  const bestAlgorithms = activeResults.filter((r) => r.faults === minFaults);

  return (
    <section className="bg-[#101827] border border-[#1E2D44] rounded-2xl p-5 shadow-lg flex flex-col gap-6">
      {/* Title & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#1E2D44]">
        <div className="flex items-center space-x-2">
          <BarChart3 className="w-4 h-4 text-cyan-400" />
          <h3 className="text-sm font-semibold tracking-wide uppercase text-slate-200 font-mono">
            Algorithm Comparison &amp; Benchmarking
          </h3>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Winner Highlight Pill */}
          <div className="flex items-center space-x-2 bg-emerald-950/60 border border-emerald-500/60 px-3 py-1.5 rounded-xl">
            <Trophy className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-xs font-mono font-bold text-emerald-300">
              Lowest ({minFaults} faults):{' '}
              {bestAlgorithms.map((b) => b.algorithm).join(' & ')}
            </span>
          </div>

          {/* Belady Multi-Frame Curve Trigger */}
          {onOpenBeladyModal && (
            <button
              type="button"
              onClick={onOpenBeladyModal}
              className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-mono font-medium rounded-xl text-amber-300 bg-amber-950/40 hover:bg-amber-950/70 border border-amber-500/40 transition-all cursor-pointer"
              title="Test frame capacities 1 to 8 to detect Belády's Anomaly"
            >
              <TrendingUp className="w-3.5 h-3.5 text-amber-400" />
              <span>Belády Curve (1-8F)</span>
            </button>
          )}

          {/* Export Comparison CSV */}
          {onExportComparisonCSV && (
            <button
              type="button"
              onClick={onExportComparisonCSV}
              className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-mono font-medium rounded-xl text-slate-300 bg-[#151F30] hover:bg-[#1E2D44] hover:text-white border border-[#243247] transition-all cursor-pointer"
              title="Download comparison matrix as CSV"
            >
              <Download className="w-3.5 h-3.5 text-cyan-400" />
              <span>Export CSV</span>
            </button>
          )}
        </div>
      </div>

      {/* Comparison Grid: Table & Visual Bar Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Table - 7 Cols */}
        <div className="lg:col-span-7 overflow-x-auto rounded-xl border border-[#1E2D44]">
          <table className="w-full text-left font-mono text-xs">
            <thead className="bg-[#121B2B] text-slate-300 uppercase tracking-wider border-b border-[#1E2D44]">
              <tr>
                <th className="py-2.5 px-3 font-semibold">Algorithm</th>
                <th className="py-2.5 px-3 font-semibold text-right">Page Faults</th>
                <th className="py-2.5 px-3 font-semibold text-right">Page Hits</th>
                <th className="py-2.5 px-3 font-semibold text-right">Hit Ratio</th>
                <th className="py-2.5 px-3 font-semibold text-right">Fault Ratio</th>
                <th className="py-2.5 px-3 font-semibold text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1E2D44]/60 bg-[#151F30]">
              {algorithms.map((algKey) => {
                const res = results[algKey];
                if (!res) {
                  return (
                    <tr key={algKey} className="text-slate-500">
                      <td className="py-2.5 px-3 font-bold">{algKey}</td>
                      <td colSpan={5} className="py-2.5 px-3 italic text-center text-slate-600">
                        Not yet executed
                      </td>
                    </tr>
                  );
                }

                const isWinner = res.faults === minFaults;
                const isSelected = activeAlgorithm === algKey;

                return (
                  <tr
                    key={algKey}
                    onClick={() => onSelectAlgorithm(algKey)}
                    className={`cursor-pointer transition-colors ${
                      isWinner ? 'bg-emerald-950/20' : ''
                    } ${
                      isSelected
                        ? 'border-l-4 border-l-cyan-400 bg-cyan-950/30 font-semibold'
                        : 'hover:bg-[#1A263B]'
                    }`}
                  >
                    <td className="py-2.5 px-3 font-bold flex items-center space-x-2">
                      <span className={isWinner ? 'text-emerald-300' : 'text-slate-200'}>
                        {res.name}
                      </span>
                      {isWinner && (
                        <Award className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                      )}
                    </td>
                    <td className="py-2.5 px-3 text-right font-bold text-red-400">
                      {res.faults}
                    </td>
                    <td className="py-2.5 px-3 text-right font-bold text-emerald-400">
                      {res.hits}
                    </td>
                    <td className="py-2.5 px-3 text-right text-cyan-300">
                      {formatRatio(res.hitRatio)}{' '}
                      <span className="text-[10px] text-slate-500">
                        ({formatPercent(res.hitPercentage)})
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-right text-amber-300">
                      {formatRatio(res.faultRatio)}
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      {isWinner ? (
                        <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-700">
                          BEST
                        </span>
                      ) : (
                        <span className="inline-block px-2 py-0.5 rounded text-[10px] bg-[#101827] text-slate-400 border border-[#243247]">
                          +{res.faults - minFaults} faults
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Visual Bar Chart - 5 Cols */}
        <div className="lg:col-span-5 bg-[#121B2B] border border-[#1E2D44] rounded-xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between pb-2 border-b border-[#1E2D44]/70">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300">
              Page Faults Comparison
            </span>
            <span className="text-[10px] text-slate-400 font-mono">
              Fewer is better
            </span>
          </div>

          <div className="flex flex-col gap-4 my-auto pt-3">
            {algorithms.map((algKey) => {
              const res = results[algKey];
              if (!res) {
                return (
                  <div key={algKey} className="flex flex-col gap-1 opacity-40">
                    <span className="text-xs font-mono text-slate-500">{algKey}</span>
                    <div className="h-6 bg-[#1A2638] rounded-md flex items-center px-2 text-[10px] text-slate-600 font-mono">
                      Awaiting run
                    </div>
                  </div>
                );
              }

              const isWinner = res.faults === minFaults;
              const percentage = Math.max(12, Math.round((res.faults / maxFaults) * 100));

              return (
                <div key={algKey} className="flex flex-col gap-1">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className={`font-semibold ${isWinner ? 'text-emerald-400' : 'text-slate-300'}`}>
                      {algKey} {isWinner && '★'}
                    </span>
                    <span className="text-slate-400">
                      <strong className="text-red-400">{res.faults}</strong> faults /{' '}
                      <strong className="text-emerald-400">{res.hits}</strong> hits
                    </span>
                  </div>

                  <div className="w-full h-7 bg-[#151F30] rounded-lg p-1 border border-[#243247] flex items-center">
                    <div
                      className={`h-full rounded-md transition-all duration-500 flex items-center justify-end px-2 text-[10px] font-mono font-bold text-slate-950 ${
                        isWinner
                          ? 'bg-gradient-to-r from-emerald-500 to-emerald-400 shadow-glow-hit'
                          : 'bg-gradient-to-r from-red-500 to-rose-400'
                      }`}
                      style={{ width: `${percentage}%` }}
                    >
                      <span>{res.faults}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="pt-3 border-t border-[#1E2D44]/70 flex items-center justify-between text-[11px] text-slate-500 font-mono">
            <span>Scale: Max {maxFaults} faults</span>
            <span className="flex items-center gap-1 text-emerald-400 font-medium">
              <ArrowDown className="w-3 h-3" /> Minimized Page Faults
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

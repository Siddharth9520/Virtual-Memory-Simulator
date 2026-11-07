import React from 'react';
import { AlgorithmResult } from '../types/simulator';
import { formatPercent, formatRatio } from '../core/stats';
import { Hash, CheckCircle, AlertOctagon, Percent, PieChart, Activity } from 'lucide-react';

interface StatisticsCardsProps {
  result: AlgorithmResult | null;
  algorithmName: string;
}

export const StatisticsCards: React.FC<StatisticsCardsProps> = ({ result, algorithmName }) => {
  if (!result) {
    return null;
  }

  const {
    totalReferences,
    hits,
    faults,
    hitRatio,
    faultRatio,
    hitPercentage,
    faultPercentage,
  } = result;

  return (
    <section className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider font-mono flex items-center gap-1.5">
          <Activity className="w-3.5 h-3.5 text-cyan-400" />
          <span>Performance Analytics &bull; {algorithmName}</span>
        </h3>
        <span className="text-[11px] font-mono text-slate-500">
          Formulas: Hit Ratio = Hits / Total | Fault Ratio = Faults / Total
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
        {/* Total Page References */}
        <div className="bg-[#121B2B] border border-[#1E2D44] rounded-xl p-3 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] uppercase tracking-wider font-medium">
              References
            </span>
            <Hash className="w-3.5 h-3.5 text-slate-500" />
          </div>
          <div className="mt-2">
            <span className="text-xl font-bold font-mono text-slate-100">
              {totalReferences}
            </span>
            <p className="text-[10px] text-slate-500 mt-0.5">Total memory accesses</p>
          </div>
        </div>

        {/* Total Page Faults */}
        <div className="bg-[#121B2B] border border-red-900/40 rounded-xl p-3 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 left-0 h-[2px] bg-red-500/50" />
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] uppercase tracking-wider font-medium text-red-300">
              Page Faults
            </span>
            <AlertOctagon className="w-3.5 h-3.5 text-red-400" />
          </div>
          <div className="mt-2">
            <span className="text-xl font-bold font-mono text-red-400">
              {faults}
            </span>
            <p className="text-[10px] text-red-400/80 mt-0.5">Misses requiring I/O</p>
          </div>
        </div>

        {/* Total Page Hits */}
        <div className="bg-[#121B2B] border border-emerald-900/40 rounded-xl p-3 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 left-0 h-[2px] bg-emerald-500/50" />
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] uppercase tracking-wider font-medium text-emerald-300">
              Page Hits
            </span>
            <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="mt-2">
            <span className="text-xl font-bold font-mono text-emerald-400">
              {hits}
            </span>
            <p className="text-[10px] text-emerald-400/80 mt-0.5">Satisfied from RAM</p>
          </div>
        </div>

        {/* Hit Ratio */}
        <div className="bg-[#121B2B] border border-[#1E2D44] rounded-xl p-3 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] uppercase tracking-wider font-medium">
              Hit Ratio
            </span>
            <PieChart className="w-3.5 h-3.5 text-cyan-400" />
          </div>
          <div className="mt-2">
            <span className="text-xl font-bold font-mono text-cyan-300">
              {formatRatio(hitRatio)}
            </span>
            <p className="text-[10px] text-slate-500 mt-0.5">Hits &divide; Total</p>
          </div>
        </div>

        {/* Fault Ratio */}
        <div className="bg-[#121B2B] border border-[#1E2D44] rounded-xl p-3 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] uppercase tracking-wider font-medium">
              Fault Ratio
            </span>
            <PieChart className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <div className="mt-2">
            <span className="text-xl font-bold font-mono text-amber-300">
              {formatRatio(faultRatio)}
            </span>
            <p className="text-[10px] text-slate-500 mt-0.5">Faults &divide; Total</p>
          </div>
        </div>

        {/* Hit Percentage */}
        <div className="bg-[#121B2B] border border-[#1E2D44] rounded-xl p-3 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] uppercase tracking-wider font-medium text-emerald-400">
              Hit %
            </span>
            <Percent className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="mt-2">
            <span className="text-xl font-bold font-mono text-emerald-300">
              {formatPercent(hitPercentage)}
            </span>
            {/* Visual Mini Progress Bar */}
            <div className="w-full bg-[#1A2638] h-1.5 rounded-full mt-1.5 overflow-hidden">
              <div
                className="bg-emerald-400 h-full rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, Math.max(0, hitPercentage))}%` }}
              />
            </div>
          </div>
        </div>

        {/* Fault Percentage */}
        <div className="bg-[#121B2B] border border-[#1E2D44] rounded-xl p-3 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] uppercase tracking-wider font-medium text-red-400">
              Fault %
            </span>
            <Percent className="w-3.5 h-3.5 text-red-400" />
          </div>
          <div className="mt-2">
            <span className="text-xl font-bold font-mono text-red-400">
              {formatPercent(faultPercentage)}
            </span>
            {/* Visual Mini Progress Bar */}
            <div className="w-full bg-[#1A2638] h-1.5 rounded-full mt-1.5 overflow-hidden">
              <div
                className="bg-red-400 h-full rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, Math.max(0, faultPercentage))}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};


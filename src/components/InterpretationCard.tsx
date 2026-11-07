import React from 'react';
import { InterpretationInsight } from '../core/interpreter';
import { Lightbulb, Info, CheckCircle2, BookOpen } from 'lucide-react';

interface InterpretationCardProps {
  insight: InterpretationInsight | null;
}

export const InterpretationCard: React.FC<InterpretationCardProps> = ({ insight }) => {
  if (!insight) {
    return null;
  }

  const {
    summaryTitle,
    verdict,
    comparativeDetails,
    theoreticalContext,
  } = insight;

  return (
    <section className="bg-[#101827] border border-[#1E2D44] rounded-2xl p-5 shadow-lg flex flex-col gap-4">
      {/* Title */}
      <div className="flex items-center space-x-2 pb-3 border-b border-[#1E2D44]">
        <div className="p-1.5 rounded-lg bg-cyan-950/60 border border-cyan-800/60 text-cyan-400">
          <Lightbulb className="w-4 h-4" />
        </div>
        <h3 className="text-sm font-semibold tracking-wide uppercase text-slate-200 font-mono">
          Result Interpretation &bull; {summaryTitle}
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Dynamic Analysis Card */}
        <div className="bg-[#121B2B] border border-[#1E2D44] rounded-xl p-4 flex flex-col justify-between">
          <div className="flex flex-col gap-2">
            <div className="flex items-center space-x-2 text-emerald-400 font-mono text-xs font-bold uppercase tracking-wider">
              <CheckCircle2 className="w-4 h-4" />
              <span>Comparative Performance Findings</span>
            </div>
            <p className="text-xs text-slate-200 leading-relaxed font-sans">
              {verdict}
            </p>

            <ul className="mt-2 space-y-2">
              {comparativeDetails.map((detail, idx) => (
                <li
                  key={idx}
                  className="text-xs text-slate-400 bg-[#151F30] p-2.5 rounded-lg border border-[#1E2D44] leading-relaxed flex items-start space-x-2"
                >
                  <span className="text-cyan-400 font-bold">&bull;</span>
                  <span>{detail}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Theoretical Context Card */}
        <div className="bg-[#121B2B] border border-[#1E2D44] rounded-xl p-4 flex flex-col justify-between">
          <div className="flex flex-col gap-2">
            <div className="flex items-center space-x-2 text-cyan-400 font-mono text-xs font-bold uppercase tracking-wider">
              <BookOpen className="w-4 h-4" />
              <span>OS Theory &amp; Optimal Benchmark</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed font-sans">
              {theoreticalContext}
            </p>
          </div>

          <div className="mt-3 pt-3 border-t border-[#1E2D44]/70 flex items-start space-x-2 text-[11px] text-slate-400 bg-[#151F30] p-2 rounded-lg">
            <Info className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0 mt-0.5" />
            <span>
              Real OS kernels implement approximations such as Clock (Second-Chance) or Page Aging because true LRU has high hardware overhead, and Optimal requires clairvoyant future knowledge.
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

